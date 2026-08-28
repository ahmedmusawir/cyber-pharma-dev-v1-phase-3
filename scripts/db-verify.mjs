#!/usr/bin/env node
// BIM-001 · db-verify.mjs — post-chain gate assertions (X4, X5 + structural ACs).
//
//   node scripts/db-verify.mjs            structural checks only (safe on any target)
//   node scripts/db-verify.mjs --probes   + mutation probes (AC6/AC10/AC12/ensure_rls)
//                                          SCRATCH ONLY — writes then removes rows
// Env: DB_URL (fail-closed). Exit 0 = all green; 1 = env; 3 = check failures (all listed).

import pg from "pg";

const dbUrl = process.env.DB_URL;
if (!dbUrl) { console.error("FAIL-CLOSED: DB_URL not set."); process.exit(1); }
const probes = process.argv.includes("--probes");

const NEW_TABLES = [
  "accounts", "businesses", "user_businesses", "pending_registrations",
  "subscriptions", "apa_memberships", "reference_dataset_versions",
  "aac_reference", "wac_reference", "ful_reference", "pbm_info",
  "user_data", "report_files", "audit_logs",
];
const SIXTEEN = [...NEW_TABLES, "user_roles", "profiles"].sort();
const DEFERRED = ["desktop_client_versions", "local_desktop_users", "password_reset_tokens"];

// AC8 declared money-column list (all must be numeric; zero float/real/double anywhere)
const MONEY = {
  user_data: ["medicaid_rate", "acq", "acq_net", "difference", "total_paid", "payment",
    "new_paid", "expected_paid", "new_owed", "owed", "nadac", "awp", "medicaid_rate_original"],
  wac_reference: ["wac"],
  aac_reference: ["aac"],
  ful_reference: ["aca_ful"],
};
// AC9 identifier TEXT law: column → tables where it appears
const TEXT_IDS = [
  ["drug_ndc", ["user_data"]], ["ndc", ["aac_reference", "wac_reference", "ful_reference"]],
  ["script", ["user_data"]], ["bin", ["user_data", "pbm_info"]],
  ["pcn", ["user_data", "pbm_info"]], ["group_field", ["user_data"]],
  ["ncpdp", ["businesses", "pending_registrations"]], ["npi", ["businesses", "pending_registrations"]],
];

const failures = [];
const ok = (label) => console.log(`  ok  ${label}`);
const bad = (label, detail) => { console.error(`  FAIL ${label}: ${detail}`); failures.push(label); };

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();
const q = (sql, params) => client.query(sql, params);

console.log(`[db-verify] structural checks${probes ? " + mutation probes" : ""}`);

// ── AC4: sixteen-table inventory, deferred absent ────────────────────────────
{
  const { rows } = await q(`select table_name from information_schema.tables
    where table_schema='public' and table_type='BASE TABLE' order by table_name`);
  const names = rows.map((r) => r.table_name);
  const missing = SIXTEEN.filter((t) => !names.includes(t));
  const unexpected = names.filter((t) => !SIXTEEN.includes(t));
  if (missing.length) bad("AC4 inventory", `missing: ${missing.join(", ")}`);
  else if (unexpected.length) bad("AC4 inventory", `unexpected tables: ${unexpected.join(", ")}`);
  else ok(`AC4 inventory — exactly ${SIXTEEN.length} tables`);
  const zombie = DEFERRED.filter((t) => names.includes(t));
  if (zombie.length) bad("AC4 deferred", `deferred table exists: ${zombie.join(", ")}`);
  else ok("AC4 deferred tables absent");
}

// ── X4/AC7: RLS enabled on all 16; zero new policies (baseline 3 only) ───────
{
  const { rows } = await q(`select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and relkind='r' and not relrowsecurity`);
  if (rows.length) bad("X4 RLS-enabled", `RLS off on: ${rows.map((r) => r.relname).join(", ")}`);
  else ok("X4 RLS enabled on every public table");
  const { rows: pol } = await q(`select policyname, tablename from pg_policies where schemaname='public'`);
  const baseline = ["Profiles are updatable by owner or superadmins",
    "Profiles are viewable by owner or superadmins", "Users can read their own role"];
  const extra = pol.filter((p) => !baseline.includes(p.policyname));
  if (extra.length) bad("AC7 policy delta", `non-baseline policies: ${extra.map((p) => `${p.tablename}.${p.policyname}`).join(", ")}`);
  else if (pol.length !== 3) bad("AC7 policy delta", `expected 3 baseline policies, found ${pol.length}`);
  else ok("AC7 zero permissive policies added (baseline 3 intact)");
}

// ── X4 deny probe: anon + authenticated SELECT on every new table ────────────
for (const role of ["anon", "authenticated"]) {
  let denied = 0, empty = 0, leaked = [];
  for (const t of NEW_TABLES) {
    try {
      await q("begin");
      await q(`set local role ${role}`);
      const { rows } = await q(`select * from public.${t} limit 1`);
      if (rows.length === 0) empty++; else leaked.push(t);
      await q("rollback");
    } catch { denied++; await q("rollback").catch(() => {}); }
  }
  if (leaked.length) bad(`X4 deny-by-default (${role})`, `rows visible on: ${leaked.join(", ")}`);
  else ok(`X4 deny-by-default (${role}) — ${empty} empty / ${denied} denied of ${NEW_TABLES.length}`);
}

// ── X5/AC8: money type law ───────────────────────────────────────────────────
{
  const { rows } = await q(`select table_name, column_name, data_type from information_schema.columns
    where table_schema='public' and data_type in ('real','double precision')`);
  if (rows.length) bad("X5 float ban", rows.map((r) => `${r.table_name}.${r.column_name}`).join(", "));
  else ok("X5 zero float/real/double in public schema");
  for (const [table, cols] of Object.entries(MONEY)) {
    const { rows: cr } = await q(`select column_name, data_type from information_schema.columns
      where table_schema='public' and table_name=$1 and column_name = any($2)`, [table, cols]);
    const wrong = cr.filter((c) => c.data_type !== "numeric");
    const found = cr.map((c) => c.column_name);
    const absent = cols.filter((c) => !found.includes(c));
    if (wrong.length || absent.length)
      bad(`AC8 money ${table}`, `${wrong.map((c) => `${c.column_name}:${c.data_type}`).join(",")} ${absent.length ? `missing:${absent.join(",")}` : ""}`);
    else ok(`AC8 money NUMERIC — ${table} (${cols.length} cols)`);
  }
}

// ── X5/AC9: identifier TEXT law ──────────────────────────────────────────────
for (const [col, tables] of TEXT_IDS) {
  const { rows } = await q(`select table_name, data_type from information_schema.columns
    where table_schema='public' and column_name=$1 and table_name = any($2)`, [col, tables]);
  const wrong = rows.filter((r) => !["text", "character varying"].includes(r.data_type));
  const found = rows.map((r) => r.table_name);
  const absent = tables.filter((t) => !found.includes(t));
  if (wrong.length || absent.length)
    bad(`AC9 text ${col}`, `${wrong.map((r) => `${r.table_name}:${r.data_type}`).join(",")} ${absent.length ? `missing on:${absent.join(",")}` : ""}`);
  else ok(`AC9 TEXT — ${col} on ${tables.join("/")}`);
}

// ── AC5: accounts spine wiring ───────────────────────────────────────────────
{
  const { rows: bn } = await q(`select is_nullable from information_schema.columns
    where table_schema='public' and table_name='businesses' and column_name='account_id'`);
  if (!bn.length || bn[0].is_nullable !== "NO") bad("AC5 businesses.account_id", "missing or nullable");
  else ok("AC5 businesses.account_id NOT NULL");
  // pg_constraint, NOT information_schema: constraint_column_usage hides tables
  // the connecting role doesn't own (auth.users belongs to supabase_auth_admin),
  // which false-failed the auth.users FK on first run — instrument defect of the
  // BIM-000 "boundary-aware predicate" class, corrected 2026-08-28 (see evidence
  // X4X5_scratch_verify_probes_rerun.log; schema was correct all along).
  const fk = async (table, col, foreignRegclass) => {
    const { rows } = await q(`
      select 1
      from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
      where c.contype = 'f'
        and c.conrelid = ('public.' || $1)::regclass
        and a.attname = $2
        and c.confrelid = $3::regclass`, [table, col, foreignRegclass]);
    return rows.length > 0;
  };
  if (!(await fk("businesses", "account_id", "public.accounts"))) bad("AC5 FK", "businesses.account_id → accounts missing");
  else ok("AC5 FK businesses.account_id → accounts");
  if (!(await fk("subscriptions", "account_id", "public.accounts"))) bad("AC5 FK", "subscriptions.account_id → accounts missing");
  else ok("AC5 FK subscriptions.account_id → accounts");
  if (!(await fk("accounts", "owner_user_id", "auth.users"))) bad("AC5 FK", "accounts.owner_user_id → auth.users missing");
  else ok("AC5 FK accounts.owner_user_id → auth.users");
  const { rows: sb } = await q(`select 1 from information_schema.columns
    where table_schema='public' and table_name='subscriptions' and column_name='business_id'`);
  if (sb.length) bad("AC5 subscriptions", "business_id column EXISTS (must not)");
  else ok("AC5 subscriptions has NO business_id");
}

// ── AC6/AC10 constraint text (structural half; functional half under --probes) ─
{
  const check = async (label, table, mustContain) => {
    const { rows } = await q(`select pg_get_constraintdef(c.oid) as def from pg_constraint c
      join pg_class r on r.oid = c.conrelid join pg_namespace n on n.oid = r.relnamespace
      where n.nspname='public' and r.relname=$1 and c.contype='c'`, [table]);
    const hit = rows.some((r) => mustContain.every((s) => r.def.includes(s)));
    if (!hit) bad(label, `no CHECK on ${table} containing ${mustContain.join(" + ")}`);
    else ok(label);
  };
  await check("AC6 junction role CHECK ('admin','member')", "user_businesses", ["admin", "member", "role"]);
  await check("AC10 medicaid_method CHECK (7 values)", "user_data",
    ["AAC", "FUL", "GWAC", "BWAC", "Take Action", "Manual Override", "Legacy"]);
}

// ── AC12 structural: timestamps + trigger on all 16 ──────────────────────────
{
  for (const t of SIXTEEN) {
    if (["user_roles", "profiles"].includes(t)) continue; // baseline: acknowledged as-is, not retrofitted (manager §5 rows 3-4: NO structural change)
    const { rows } = await q(`select count(*)::int as n from information_schema.columns
      where table_schema='public' and table_name=$1 and column_name in ('created_at','updated_at')
        and data_type='timestamp with time zone'`, [t]);
    const { rows: trg } = await q(`select 1 from information_schema.triggers
      where event_object_schema='public' and event_object_table=$1 and trigger_name='set_updated_at'`, [t]);
    if (rows[0].n !== 2) bad(`AC12 timestamps ${t}`, `${rows[0].n}/2 timestamptz cols`);
    else if (!trg.length) bad(`AC12 trigger ${t}`, "set_updated_at missing");
    else ok(`AC12 ${t} — timestamptz pair + trigger`);
  }
}

// ── mutation probes (scratch only) ───────────────────────────────────────────
if (probes) {
  console.log("[db-verify] mutation probes (scratch-only)");
  // AC6 functional: role='owner' rejected, 'member' accepted (rolled back)
  try {
    await q("begin");
    await q(`insert into auth.users (id, email) values ('00000000-0000-4000-8000-000000000001','probe@bim001.local')
             on conflict do nothing`);
    await q(`insert into public.accounts (id, name, owner_user_id)
             values ('00000000-0000-4000-8000-0000000000aa','probe','00000000-0000-4000-8000-000000000001')`);
    await q(`insert into public.businesses (id, account_id, ncpdp, npi, pharmacy_name)
             values ('00000000-0000-4000-8000-0000000000bb','00000000-0000-4000-8000-0000000000aa','0123456','0123456789','Probe Pharmacy')`);
    await q(`insert into public.user_businesses (user_id, business_id, role)
             values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-0000000000bb','member')`);
    let rejected = false;
    try {
      await q("savepoint p1");
      await q(`insert into public.user_businesses (user_id, business_id, role)
               values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-0000000000bb','owner')`);
    } catch (e) { rejected = e.code === "23514" || e.code === "23505"; await q("rollback to p1"); }
    if (rejected) ok("AC6 probe — role='owner' rejected, 'member' accepted");
    else bad("AC6 probe", "role='owner' was NOT rejected by CHECK");
    // AC10 functional: 'Portal' rejected, 'AAC' accepted
    let mmRejected = false;
    try {
      await q("savepoint p2");
      await q(`insert into public.user_data (business_id, medicaid_method)
               values ('00000000-0000-4000-8000-0000000000bb','Portal')`);
    } catch (e) { mmRejected = e.code === "23514"; await q("rollback to p2"); }
    await q(`insert into public.user_data (business_id, medicaid_method)
             values ('00000000-0000-4000-8000-0000000000bb','AAC')`);
    if (mmRejected) ok("AC10 probe — 'Portal' rejected, 'AAC' accepted");
    else bad("AC10 probe", "'Portal' was NOT rejected by CHECK");
    await q("rollback");
  } catch (e) { bad("AC6/AC10 probe scaffolding", e.message); await q("rollback").catch(() => {}); }

  // AC12 functional: updated_at bumps across transactions (real commit, then cleanup)
  try {
    await q(`insert into public.reference_dataset_versions (id, dataset_name)
             values ('00000000-0000-4000-8000-0000000000cc','__ac12_probe__')`);
    const { rows: before } = await q(`select updated_at from public.reference_dataset_versions where dataset_name='__ac12_probe__'`);
    await new Promise((r) => setTimeout(r, 1100));
    await q(`update public.reference_dataset_versions set row_count=1 where dataset_name='__ac12_probe__'`);
    const { rows: after } = await q(`select updated_at from public.reference_dataset_versions where dataset_name='__ac12_probe__'`);
    if (new Date(after[0].updated_at) > new Date(before[0].updated_at)) ok("AC12 probe — updated_at bumps on UPDATE");
    else bad("AC12 probe", "updated_at did not advance");
    await q(`delete from public.reference_dataset_versions where dataset_name='__ac12_probe__'`);
  } catch (e) { bad("AC12 probe", e.message); }

  // ensure_rls net check (law §6.1: verify the event trigger fires, don't rely on it)
  try {
    await q(`create table public.__ensure_rls_probe__ (id int)`);
    const { rows } = await q(`select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and relname='__ensure_rls_probe__'`);
    if (rows[0]?.relrowsecurity) ok("ensure_rls probe — event trigger auto-enabled RLS");
    else bad("ensure_rls probe", "new table born WITHOUT RLS from the event trigger");
    await q(`drop table public.__ensure_rls_probe__`);
  } catch (e) { bad("ensure_rls probe", e.message); }
}

await client.end();
if (failures.length) {
  console.error(`[db-verify] ${failures.length} FAILURE(S): ${failures.join(" · ")}`);
  process.exit(3);
}
console.log("[db-verify] ALL GREEN");
