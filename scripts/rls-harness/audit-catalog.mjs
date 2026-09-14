#!/usr/bin/env node
// BIM-003 · rls-harness/audit-catalog.mjs — Stage 1 catalog evidence (AC-102…105, 107, 108,
// 114, 115) plus a rolled-back smoke walk of the trigger and the immutability guard.
// Reads pg_catalog (never information_schema for privilege questions — F-3). Every write
// happens inside a transaction that is rolled back; the target's data is untouched.
// Output: agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S1_catalog.md
//   node scripts/rls-harness/audit-catalog.mjs [S1|S2]   (default S1)
// S2 adds the wrapper checks (AC-201…203) and writes S2_catalog.md instead.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { pgClient } from "./lib/db.mjs";

const STAMPED = ["businesses", "user_businesses", "pending_registrations", "user_data", "report_files",
  "accounts", "subscriptions", "apa_memberships", "reference_dataset_versions",
  "aac_reference", "wac_reference", "ful_reference", "pbm_info"]; // E-0, thirteen

const STAGE = process.argv[2] ?? "S1";
const WRAPPERS = ["owedbook_kpis", "owedbook_rows", "owedbook_summary", "owedbook_pbm_options"]; // E-0, N = 4
const env = loadEnv();
const db = await pgClient(env);
const q = async (s, p) => (await db.query(s, p)).rows;
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let fails = 0;
const check = (ok, label, detail = "") => { if (!ok) fails++; say(`- ${ok ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`); };
const table = (rows, cols) => { say(`| ${cols.join(" | ")} |`); say(`|${cols.map(() => "---").join("|")}|`); for (const r of rows) say(`| ${cols.map((c) => String(r[c] ?? "null").replace(/\|/g, "\\|")).join(" | ")} |`); };
// expected error inside a transaction: run under a savepoint, report the SQLSTATE, keep the txn alive
const expectError = async (label, sql, wantCode) => {
  await db.query("savepoint s");
  try { await db.query(sql); await db.query("release savepoint s"); check(false, label, "NO ERROR (expected a raise)"); return null; }
  catch (e) { await db.query("rollback to savepoint s"); check(!wantCode || e.code === wantCode, label, `${e.code} ${e.message.split("\n")[0]}`); return e; }
};

say(`# ${STAGE} catalog evidence — BIM-003-CYBER-PHARMA`);
say(`Generated ${new Date().toISOString()} by \`scripts/rls-harness/audit-catalog.mjs\` against host \`${new URL(env.DB_URL).hostname}\` (scratch throwaway, ENV_NOTE.md). Every mutation below ran inside a rolled-back transaction.`);
say();

say(`## RISK-1 — definer owner can insert through FORCE RLS`);
const who = (await q(`select current_user, rolbypassrls, rolsuper from pg_roles where rolname = current_user`))[0];
table([who], ["current_user", "rolbypassrls", "rolsuper"]);
check(who.rolbypassrls === true, "RISK-1 GREEN: migration role has BYPASSRLS, so SECURITY DEFINER inserts into the FORCED, policy-less audit_logs succeed", `(first observed read-only 2026-09-14 13:1x before S1; re-confirmed here)`);
say();

if (STAGE === "S2") {
  say(`## AC-201 — exactly N = 4 functions in public whose names begin with owedbook_`);
  const fns = await q(`select p.oid::int oid, p.proname, pg_get_function_identity_arguments(p.oid) args, pg_get_function_result(p.oid) result,
      p.prosecdef, p.proconfig::text cfg, p.proacl::text acl, p.proargnames[1] first_arg, (p.proargtypes[0])::regtype first_type, p.prolang::regclass lang
    from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname like 'owedbook\\_%' order by p.proname`);
  table(fns, ["proname", "args", "result"]);
  check(fns.length === 4, `pg_proc count = ${fns.length}`);
  check(JSON.stringify(fns.map((f) => f.proname)) === JSON.stringify([...WRAPPERS].sort()), "the four names match E-0 exactly");
  say();
  say(`## AC-202 — every wrapper: SECURITY DEFINER, search_path pinned, EXECUTE to authenticated, revoked from public and anon`);
  table(fns, ["proname", "prosecdef", "cfg", "acl"]);
  for (const f of fns) {
    // by oid: has_function_privilege's text form wants type-only signatures, identity_arguments carries names
    const g = (await q(`select has_function_privilege('anon', $1::oid, 'EXECUTE') a, has_function_privilege('authenticated', $1::oid, 'EXECUTE') b, has_function_privilege('service_role', $1::oid, 'EXECUTE') s`, [f.oid]))[0];
    const noPublic = !/(^|\{|,)=X\//.test(f.acl || ""), noAnon = !/anon=X/.test(f.acl || "");
    check(f.prosecdef === true && /search_path=/.test(f.cfg || "") && noPublic && noAnon && g.a === false && g.b === true,
      `${f.proname}: secdef=${f.prosecdef} cfg=${f.cfg} anon=${g.a} authenticated=${g.b} service_role=${g.s} PUBLIC-entry=${!noPublic}`);
  }
  // live: anon must be refused at execution time, not merely by catalog (ac8-check pattern)
  await db.query("begin"); await db.query("set local role anon");
  for (const w of WRAPPERS) await expectError(`anon EXECUTE ${w} refused at run time`, `select * from public.${w}('00000000-0000-4000-8000-000000000000'::uuid${w === "owedbook_rows" ? ", 'commercial_dollars'" : ""})`, "42501");
  await db.query("rollback");
  say();
  say(`## AC-203 — first parameter is p_business_id uuid on all four`);
  table(fns, ["proname", "first_arg", "first_type"]);
  check(fns.every((f) => f.first_arg === "p_business_id" && String(f.first_type) === "uuid"), "proargnames[1] = 'p_business_id', proargtypes[0] = uuid, all four");
  say();
  say(`## Body shape (Brief §5) — membership check, then ONE read_page insert, then the read`);
  const bodies = await q(`select proname, prosrc from pg_proc where pronamespace = 'public'::regnamespace and proname like 'owedbook\\_%' order by proname`);
  for (const b of bodies) {
    const src = b.prosrc;
    const iMember = src.search(/in \(select public\.my_business_ids\(\)\)/);
    const iRaise = src.indexOf("raise exception 'not a member of business'");
    const iInsert = src.indexOf("insert into public.audit_logs");
    const iRead = src.search(/from public\.user_data ud/);
    const inserts = (src.match(/insert into public\.audit_logs/g) || []).length;
    const fence = (src.match(/where ud\.business_id = p_business_id/g) || []).length;
    check(iMember > -1 && iRaise > iMember && iInsert > iRaise && iRead > iInsert && inserts === 1 && fence >= 1,
      `${b.proname}: membership@${iMember} < raise@${iRaise} < insert@${iInsert} < read@${iRead}; audit inserts = ${inserts}; explicit business_id fence × ${fence}`);
    check(/'read_page'/.test(src) && new RegExp(`'fn',\\s*'${b.proname}'`).test(src), `${b.proname}: action 'read_page' and context.fn = '${b.proname}'`);
  }
  say();
  say(`## Prior-stage invariants still hold`);
  const pol = await q(`select count(*)::int n from pg_policies where schemaname = 'public' and tablename = 'audit_logs'`);
  const stamps = await q(`select count(*)::int n from pg_trigger where tgfoid = 'public.audit_write'::regproc and not tgisinternal`);
  const rls = (await q(`select relrowsecurity, relforcerowsecurity from pg_class where oid = 'public.audit_logs'::regclass`))[0];
  check(pol[0].n === 1 && stamps[0].n === 13 && rls.relrowsecurity && rls.relforcerowsecurity, `audit_logs: 1 policy, RLS enabled+forced; audit_write stamps = ${stamps[0].n}`);
  say();
}
if (STAGE === "S1") {
say(`## AC-102 — audit_logs columns, in order`);
const cols = await q(`select a.attnum, a.attname, format_type(a.atttypid, a.atttypmod) type, a.attnotnull notnull, pg_get_expr(d.adbin, d.adrelid) dflt
  from pg_attribute a left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
  where a.attrelid = 'public.audit_logs'::regclass and a.attnum > 0 and not a.attisdropped order by a.attnum`);
table(cols, ["attnum", "attname", "type", "notnull", "dflt"]);
const want102 = ["id","occurred_at","actor_user_id","actor_role","business_id","table_name","row_id","action","old_data","new_data","context"];
check(JSON.stringify(cols.map((c) => c.attname)) === JSON.stringify(want102), `exactly these eleven columns in Brief §3 order (${cols.length} found)`);
say();

say(`## AC-103 — action CHECK: exactly four values; a fifth is rejected`);
const chk = await q(`select conname, pg_get_constraintdef(oid) def from pg_constraint where conrelid = 'public.audit_logs'::regclass and contype = 'c'`);
table(chk, ["conname", "def"]);
await db.query("begin");
for (const v of ["insert", "update", "delete", "read_page"]) {
  await db.query("savepoint s");
  try { await db.query(`insert into public.audit_logs (actor_role, table_name, action) values ('catalog', 'probe', $1)`, [v]); check(true, `positive: action='${v}' accepted`); }
  catch (e) { check(false, `positive: action='${v}'`, e.message); }
  await db.query("rollback to savepoint s");
}
await expectError("negative: action='archive' rejected", `insert into public.audit_logs (actor_role, table_name, action) values ('catalog', 'probe', 'archive')`, "23514");
await db.query("rollback");
say();

say(`## AC-104 — indexes beyond the primary key`);
const idx = await q(`select indexname, indexdef from pg_indexes where schemaname = 'public' and tablename = 'audit_logs' and indexname <> 'audit_logs_pkey' order by indexname`);
table(idx, ["indexname", "indexdef"]);
const defs = idx.map((i) => i.indexdef);
check(idx.length === 3 && defs.some((d) => /\(occurred_at\)$/.test(d)) && defs.some((d) => /\(business_id, occurred_at\)$/.test(d)) && defs.some((d) => /\(table_name, row_id\)$/.test(d)), "exactly three: (occurred_at) · (business_id, occurred_at) · (table_name, row_id)");
say();

say(`## AC-105 — BEFORE UPDATE OR DELETE trigger calling a function that raises unconditionally`);
const trg = await q(`select tgname, pg_get_triggerdef(t.oid) def from pg_trigger t where tgrelid = 'public.audit_logs'::regclass and not tgisinternal order by tgname`);
table(trg, ["tgname", "def"]);
const src = (await q(`select prosrc, proconfig::text cfg from pg_proc where proname = 'audit_logs_immutable' and pronamespace = 'public'::regnamespace`))[0];
say("```sql\n" + src.prosrc.trim() + "\n```");
check(trg.some((t) => /BEFORE (UPDATE OR DELETE|DELETE OR UPDATE) ON (public\.)?audit_logs FOR EACH ROW EXECUTE FUNCTION (public\.)?audit_logs_immutable\(\)/.test(t.def)), "BEFORE UPDATE OR DELETE … FOR EACH ROW → audit_logs_immutable()");
check(/raise exception/i.test(src.prosrc) && !/\bif\b/i.test(src.prosrc), "function body is a bare RAISE EXCEPTION — no IF, no WHEN, no role check");
check(trg.some((t) => /BEFORE TRUNCATE ON (public\.)?audit_logs FOR EACH STATEMENT/.test(t.def)), "plus BEFORE TRUNCATE statement trigger (row triggers never see TRUNCATE) — addition, reported in S1");
say();

say(`## AC-107 — RLS enabled AND forced`);
const rls = (await q(`select relrowsecurity, relforcerowsecurity from pg_class where oid = 'public.audit_logs'::regclass`))[0];
table([rls], ["relrowsecurity", "relforcerowsecurity"]);
check(rls.relrowsecurity && rls.relforcerowsecurity, "relrowsecurity = true, relforcerowsecurity = true");
say();

say(`## AC-108 — exactly one policy: SELECT to authenticated; zero INSERT/UPDATE/DELETE`);
const pol = await q(`select policyname, cmd, roles::text roles, permissive, qual from pg_policies where schemaname = 'public' and tablename = 'audit_logs' order by policyname`);
table(pol, ["policyname", "cmd", "roles", "permissive", "qual"]);
check(pol.length === 1 && pol[0].cmd === "SELECT" && pol[0].roles === "{authenticated}", "one policy, SELECT, {authenticated}");
check(pol.filter((p) => p.cmd !== "SELECT").length === 0, "zero write policies");
say(`Table privileges (RF-3 — UPDATE/DELETE revoked from anon and authenticated; INSERT left to RLS):`);
const priv = await q(`select grantee, string_agg(privilege_type, ', ' order by privilege_type) privs from information_schema.role_table_grants where table_schema = 'public' and table_name = 'audit_logs' group by grantee order by grantee`);
table(priv, ["grantee", "privs"]);
for (const r of ["anon", "authenticated"]) {
  const g = (await q(`select has_table_privilege($1, 'public.audit_logs', 'UPDATE') u, has_table_privilege($1, 'public.audit_logs', 'DELETE') d, has_table_privilege($1, 'public.audit_logs', 'INSERT') i, has_table_privilege($1, 'public.audit_logs', 'SELECT') s`, [r]))[0];
  check(g.u === false && g.d === false, `${r}: UPDATE=${g.u} DELETE=${g.d} (both false)`, `INSERT=${g.i} SELECT=${g.s} kept — RLS decides`);
}
say();

say(`## AC-114 — audit_write(): SECURITY DEFINER, search_path pinned, EXECUTE revoked from public and anon`);
const fn = (await q(`select proname, prosecdef, provolatile, proconfig::text cfg, proacl::text acl, pg_get_function_identity_arguments(oid) args, prorettype::regtype rettype from pg_proc where proname = 'audit_write' and pronamespace = 'public'::regnamespace`))[0];
table([fn], ["proname", "prosecdef", "cfg", "acl", "rettype"]);
const noPublic = !/(^|\{|,)=X\//.test(fn.acl || ""), noAnon = !/anon=X/.test(fn.acl || "");
const hfp = (await q(`select has_function_privilege('anon', 'public.audit_write()', 'EXECUTE') a, has_function_privilege('authenticated', 'public.audit_write()', 'EXECUTE') b, has_function_privilege('service_role', 'public.audit_write()', 'EXECUTE') s`))[0];
check(fn.prosecdef === true, "prosecdef = true (SECURITY DEFINER)");
check(/search_path=/.test(fn.cfg || ""), `proconfig pins search_path`, fn.cfg);
check(noPublic && noAnon && hfp.a === false, `no bare =X/ (PUBLIC) and no anon=X in proacl; has_function_privilege(anon) = ${hfp.a}`, `authenticated=${hfp.b} service_role=${hfp.s} (trigger firing never checks EXECUTE)`);
say();

say(`## AC-115 — thirteen tables carry audit_write, AFTER INSERT OR UPDATE OR DELETE … FOR EACH ROW (E-0)`);
const stamps = await q(`select c.relname, t.tgname, pg_get_triggerdef(t.oid) def from pg_trigger t join pg_class c on c.oid = t.tgrelid
  where t.tgfoid = 'public.audit_write'::regproc and not t.tgisinternal order by c.relname`);
table(stamps, ["relname", "def"]);
const names = stamps.map((s) => s.relname).sort();
check(stamps.length === 13, `pg_trigger count = ${stamps.length}`);
check(JSON.stringify(names) === JSON.stringify([...STAMPED].sort()), "the thirteen names match E-0 exactly");
check(stamps.every((s) => /AFTER INSERT OR DELETE OR UPDATE ON (public\.)?\w+ FOR EACH ROW EXECUTE FUNCTION (public\.)?audit_write\(\)/.test(s.def)), "every stamp is AFTER INSERT OR DELETE OR UPDATE … FOR EACH ROW (pg_get_triggerdef prints events in catalog order and omits the schema when it is on the search path)");
const notStamped = await q(`select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r'
  and not exists (select 1 from pg_trigger t where t.tgrelid = c.oid and t.tgfoid = 'public.audit_write'::regproc) order by 1`);
say(`Not stamped (by ruling): ${notStamped.map((r) => r.relname).join(", ")}`);
check(JSON.stringify(notStamped.map((r) => r.relname)) === JSON.stringify(["audit_logs", "profiles", "user_roles"]), "exactly audit_logs (self), profiles, user_roles (baseline) are unstamped");
say();

say(`## Smoke walk (rolled back) — the trigger writes what R-2/R-8 say, and the guard holds for the owner`);
await db.query("begin");
const acct = (await q(`insert into public.accounts (name, owner_user_id) select 'S1 smoke', id from auth.users limit 1 returning id`));
if (!acct.length) { say("- ⚠️ no auth.users row on target to own a smoke account — smoke walk skipped (seed.mjs creates them; rls:prove covers this)"); }
else {
  const a = acct[0].id;
  const b = (await q(`insert into public.businesses (account_id, ncpdp, npi, pharmacy_name) values ($1, '0999001', '1099000001', 'S1 Smoke Store') returning id`, [a]))[0].id;
  const u = (await q(`insert into public.user_data (business_id, script, drug_name) values ($1, 'RX-S1', 'smoke') returning id`, [b]))[0].id;
  await db.query(`update public.user_data set drug_name = 'smoke-2' where id = $1`, [u]);
  await db.query(`delete from public.user_data where id = $1`, [u]);
  const trail = await q(`select table_name, action, actor_role, actor_user_id, business_id, row_id, context, (old_data is not null) has_old, (new_data is not null) has_new
    from public.audit_logs where row_id in ($1, $2, $3) order by id`, [a, b, u]);
  table(trail, ["table_name", "action", "actor_role", "actor_user_id", "business_id", "row_id", "context", "has_old", "has_new"]);
  const byT = (t, act) => trail.find((r) => r.table_name === t && r.action === act);
  check(byT("accounts", "insert")?.business_id === null && byT("accounts", "insert")?.context?.id === a, "accounts (R-8): business_id NULL, context carries {id}");
  check(byT("businesses", "insert")?.business_id === b, "businesses special-case: business_id = the row's own id");
  check(byT("user_data", "insert")?.business_id === b && byT("user_data", "insert")?.row_id === u && byT("user_data", "insert")?.has_new && !byT("user_data", "insert")?.has_old, "user_data insert: business_id from row, row_id = pk, new_data only");
  check(byT("user_data", "update")?.has_old && byT("user_data", "update")?.has_new, "user_data update: old_data AND new_data");
  check(byT("user_data", "delete")?.has_old && !byT("user_data", "delete")?.has_new, "user_data delete: old_data only");
  check(trail.every((r) => r.actor_role === who.current_user && r.actor_user_id === null), `direct-connection writes: actor_role = '${who.current_user}' (current_user fallback), actor_user_id NULL`);
  check(trail.length === 5, `exactly five trail rows for five writes (${trail.length})`);
  const someId = (await q(`select id from public.audit_logs order by id desc limit 1`))[0].id;
  await expectError("owner UPDATE audit_logs raises (R-6, below RLS)", `update public.audit_logs set actor_role = 'x' where id = ${someId}`, "P0001");
  await expectError("owner DELETE audit_logs raises (R-6)", `delete from public.audit_logs where id = ${someId}`, "P0001");
  await expectError("owner TRUNCATE audit_logs raises (statement guard)", `truncate public.audit_logs`, "P0001");
  await db.query("set local role authenticated");
  await expectError("authenticated UPDATE audit_logs → 42501 permission denied (RF-3 revoke)", `update public.audit_logs set actor_role = 'x' where id = ${someId}`, "42501");
  await expectError("authenticated DELETE audit_logs → 42501 permission denied (RF-3 revoke)", `delete from public.audit_logs where id = ${someId}`, "42501");
  await expectError("authenticated INSERT audit_logs → 42501 RLS violation (no policy — AC-113 shape)", `insert into public.audit_logs (actor_role, table_name, action) values ('authenticated', 'probe', 'insert')`, "42501");
  await db.query("reset role");
}
await db.query("rollback");
say();

}
say(`## Verdict`);
say(fails === 0 ? `**${STAGE} CATALOG GREEN** — every assertion above holds.` : `**${fails} ASSERTION(S) FAILED** — see ❌ above.`);
writeFileSync(join(repoRoot, `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/${STAGE}_catalog.md`), out.join("\n") + "\n");
await db.end();
process.exit(fails === 0 ? 0 : 3);
