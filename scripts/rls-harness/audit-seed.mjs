#!/usr/bin/env node
// BIM-003 · rls-harness/audit-seed.mjs — runs AFTER seed.mjs. Adds two things the BIM-002 cast
// does not carry, without touching seed.mjs or its hardcoded counts:
//   · E-4  `multi` = multiAdmin, junction ADMIN of A1 AND B1 (the spec's "admin of A and B")
//   · R-10 a small user_data set on A1 with insurance / new_paid / status populated, so the
//          golden session exercises summary, pbm_options and the updated tab non-empty.
// Writes audit-seed-map.json (ids only, no secrets). Every insert here fires audit_write() —
// those rows land BEFORE the session watermark and are not part of the golden trail.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { pgClient, serviceClient } from "./lib/db.mjs";

const env = loadEnv();
const svc = serviceClient(env);
const db = await pgClient(env);
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));

const MULTI = { key: "multiAdmin", email: "bim003-multiadmin@rls.local" };
const { data: existing, error: listErr } = await svc.auth.admin.listUsers({ perPage: 1000 });
if (listErr) { console.error("FAIL: listUsers — " + listErr.message); process.exit(2); }
for (const u of existing?.users ?? []) if (u.email === MULTI.email) await svc.auth.admin.deleteUser(u.id);
const { data, error } = await svc.auth.admin.createUser({ email: MULTI.email, password: CAST_PASSWORD, email_confirm: true });
if (error) { console.error("FAIL: createUser multiAdmin — " + error.message); process.exit(2); }
await db.query(
  `insert into public.user_businesses (user_id, business_id, role, is_primary) values ($1, $2, 'admin', true), ($1, $3, 'admin', false)`,
  [data.user.id, m.businesses.a1, m.businesses.b1]
);
console.log("  multi: multiAdmin created — junction ADMIN of A1 + B1 (E-4)");

// R-10 rows (A1). Expected downstream: summary = [OptumRx 10.00, Caremark 9.50] · pbm_options =
// [Caremark, OptumRx] · updated tab total = 2 · KPIs add 19.50 owed / 4 scripts / 6.00 difference.
const R10 = [
  ["RX-R10-1", "OptumRx",  "underpaid", 5.00,  15.00, 10.00, null, null, "2026-09-01"],
  ["RX-R10-2", "OptumRx",  "recovered", 20.00, 20.00, 0.00,  25.00, 5.00, "2026-09-02"],
  ["RX-R10-3", "Caremark", "pending",   2.50,  10.00, 7.50,  null, null, "2026-09-03"],
  ["RX-R10-4", "Caremark", "underpaid", 8.00,  10.00, 2.00,  9.00,  1.00, "2026-09-04"],
];
const r10 = [];
for (const [script, insurance, status, total_paid, expected_paid, owed, new_paid, difference, date] of R10) {
  const row = (await db.query(
    `insert into public.user_data (business_id, script, drug_name, insurance, status, total_paid, expected_paid, owed, new_paid, difference, date_dispensed)
     values ($1, $2, 'r10', $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
    [m.businesses.a1, script, insurance, status, total_paid, expected_paid, owed, new_paid, difference, date]
  )).rows[0];
  r10.push(row.id);
}
console.log(`  r10: ${r10.length} user_data rows on A1 with insurance/new_paid/status populated (R-10)`);

writeFileSync(join(harnessRoot, "audit-seed-map.json"), JSON.stringify({ users: { multiAdmin: data.user.id }, cast: [MULTI], r10 }, null, 2));
console.log("[audit-seed] complete — audit-seed-map.json written (ids only, no secrets).");
await db.end();
