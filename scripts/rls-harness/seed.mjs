#!/usr/bin/env node
// BIM-002 · rls-harness/seed.mjs — the real cast (manager §5.3).
//
//   Account A → stores A1, A2 · Account B → store B1
//   ownerA     admin  A1 + A2
//   staffA     member A1
//   ownerB     admin  B1
//   multiStore member A1 + B1
//
// Reset step (X4 carry note, Architect 2026-09-01): the `auth` schema SURVIVES a
// public-schema wipe, so this step EXPLICITLY deletes every auth user it finds
// from prior lanes before creating the cast. The harness asserts the cast it
// created — never the absence of others.
//
// Every one of the sixteen tables is seeded with at least one row, so that a
// DENY verdict means "policy refused" and never "table happened to be empty".
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { pgClient, serviceClient } from "./lib/db.mjs";

const env = loadEnv();
const svc = serviceClient(env);
const db = await pgClient(env);
const one = async (s, p) => (await db.query(s, p)).rows[0];

const CAST = [
  { key: "ownerA", email: "bim002-ownera@rls.local" },
  { key: "staffA", email: "bim002-staffa@rls.local" },
  { key: "ownerB", email: "bim002-ownerb@rls.local" },
  { key: "multiStore", email: "bim002-multistore@rls.local" },
];

// ── reset, PUBLIC DATA FIRST ──
// Order is load-bearing: `accounts.owner_user_id` references auth.users with NO
// ON DELETE CASCADE (BIM-001 schema), so an auth user who owns an account cannot
// be deleted while that row exists — auth.admin.deleteUser returns "Database
// error deleting user" and a naive purge dies half-way, leaving orphaned
// identities whose sign-in then fails silently. Public rows go first; the
// junction's own ON DELETE CASCADE handles the rest.
for (const t of ["user_data", "report_files", "subscriptions", "user_businesses", "businesses",
                 "accounts", "apa_memberships", "pending_registrations", "audit_logs",
                 "aac_reference", "wac_reference", "ful_reference", "pbm_info", "reference_dataset_versions"]) {
  await db.query(`delete from public.${t}`);
}
console.log("  reset: fourteen public tables emptied (before the auth purge — FK order matters)");

// ── reset: purge ALL pre-existing auth users (explicit, never assumed absent) ──
// X4 carry note (Architect, 2026-09-01): the auth schema SURVIVES a public-schema
// wipe. Leftover identities from prior lanes are deleted here explicitly; the
// harness asserts the cast it created and never the absence of others.
const { data: existing, error: listErr } = await svc.auth.admin.listUsers({ perPage: 1000 });
if (listErr) { console.error("FAIL: listUsers — " + listErr.message); process.exit(2); }
for (const u of existing?.users ?? []) {
  const { error } = await svc.auth.admin.deleteUser(u.id);
  if (error) { console.error(`FAIL: deleteUser ${u.id} (${u.email}) — ${error.message}`); process.exit(2); }
}
console.log(`  reset: purged ${existing?.users?.length ?? 0} pre-existing auth.users`);

// ── the cast ──
const users = {};
for (const who of CAST) {
  const { data, error } = await svc.auth.admin.createUser({ email: who.email, password: CAST_PASSWORD, email_confirm: true });
  if (error) { console.error(`FAIL: createUser ${who.key} — ${error.message}`); process.exit(2); }
  users[who.key] = data.user.id;
}
console.log(`  cast: ${Object.keys(users).length} identities created (handle_new_user seeds their user_roles + profiles rows)`);

// ── tenants ──
const accA = await one(`insert into public.accounts (name, owner_user_id) values ('Account A', $1) returning id`, [users.ownerA]);
const accB = await one(`insert into public.accounts (name, owner_user_id) values ('Account B', $1) returning id`, [users.ownerB]);
const a1 = await one(`insert into public.businesses (account_id, ncpdp, npi, pharmacy_name) values ($1,'0100001','1010000001','Store A1') returning id`, [accA.id]);
const a2 = await one(`insert into public.businesses (account_id, ncpdp, npi, pharmacy_name) values ($1,'0100002','1010000002','Store A2') returning id`, [accA.id]);
const b1 = await one(`insert into public.businesses (account_id, ncpdp, npi, pharmacy_name) values ($1,'0100003','1010000003','Store B1') returning id`, [accB.id]);

await db.query(
  `insert into public.user_businesses (user_id, business_id, role, is_primary) values
     ($1,$5,'admin',true), ($1,$6,'admin',false),
     ($2,$5,'member',true),
     ($3,$7,'admin',true),
     ($4,$5,'member',true), ($4,$7,'member',false)`,
  [users.ownerA, users.staffA, users.ownerB, users.multiStore, a1.id, a2.id, b1.id]
);
console.log("  tenants: 2 accounts, 3 stores, 6 junction rows");

// ── one row minimum in every remaining table, so DENY is never vacuous ──
await db.query(`insert into public.subscriptions (account_id, status) values ($1,'active'), ($2,'trialing')`, [accA.id, accB.id]);
for (const [biz, tag] of [[a1.id, "A1"], [a2.id, "A2"], [b1.id, "B1"]]) {
  await db.query(
    `insert into public.user_data (business_id, script, drug_ndc, drug_name, qty, payment, expected_paid, owed, date_dispensed)
     select $1, 'RX-${tag}-'||g, lpad(g::text,11,'0'), 'Drug ${tag} '||g, (g%5)+1, (g*3)::numeric, (g*4)::numeric, g::numeric, current_date-(g%30)
     from generate_series(1,200) g`, [biz]);
  await db.query(`insert into public.report_files (business_id, file_name, report_type) values ($1, 'report-${tag}.pdf', 'owedbook')`, [biz]);
}
await db.query(`insert into public.apa_memberships (license_number, membership, first_name, last_name) values ('LIC-0001','APA','Ada','Lovelace')`);
await db.query(`insert into public.pending_registrations (ncpdp, npi, email, pharmacy_name) values ('0900001','1090000001','pending@rls.local','Pending Pharmacy')`);
await db.query(`insert into public.audit_logs (username, table_name, action) values ('system_seed','user_data','create')`);
await db.query(`insert into public.reference_dataset_versions (dataset_name, checksum, row_count) values ('aac','seed-checksum',3)`);
await db.query(`insert into public.aac_reference (ndc, aac_date, aac, drug_name) values ('00000000001', current_date, 12.34, 'Ref Drug')`);
await db.query(`insert into public.wac_reference (ndc, effective_date, wac, pkg_size, pkg_size_mult, generic_indicator) values ('00000000001', current_date, 56.78, 30, 1, 'G')`);
await db.query(`insert into public.ful_reference (ndc, year, month, aca_ful) values ('00000000001', 2026, 9, 9.876543)`);
await db.query(`insert into public.pbm_info (bin, pbm_name, pcn, state, matching_type) values ('004146','Seed PBM','PCN1','AL','bin_only')`);

const counts = await one(`select
  (select count(*) from public.user_data)::int ud, (select count(*) from public.report_files)::int rf,
  (select count(*) from public.subscriptions)::int sb, (select count(*) from public.user_roles)::int ur,
  (select count(*) from public.profiles)::int pr`);
console.log(`  rows: user_data=${counts.ud} report_files=${counts.rf} subscriptions=${counts.sb} user_roles=${counts.ur} profiles=${counts.pr} (+1 in each remaining table)`);

const factA1 = await one(`select id from public.user_data where business_id=$1 limit 1`, [a1.id]);
const factB1 = await one(`select id from public.user_data where business_id=$1 limit 1`, [b1.id]);
const rfA1 = await one(`select id from public.report_files where business_id=$1 limit 1`, [a1.id]);
const subA = await one(`select id from public.subscriptions where account_id=$1 limit 1`, [accA.id]);

writeFileSync(join(harnessRoot, "seed-map.json"), JSON.stringify({
  users, cast: CAST,
  accounts: { A: accA.id, B: accB.id },
  businesses: { a1: a1.id, a2: a2.id, b1: b1.id },
  samples: { factA1: factA1.id, factB1: factB1.id, reportA1: rfA1.id, subscriptionA: subA.id },
}, null, 2));
console.log("[seed] complete — seed-map.json written (ids only, no secrets).");
await db.end();
