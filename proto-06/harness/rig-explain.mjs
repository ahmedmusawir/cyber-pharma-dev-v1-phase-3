#!/usr/bin/env node
// PROTO-06 · T-7 — EXPLAIN evidence (INFORMATIONAL, no pass/fail gate).
// Runs the policy-filtered SELECT and UPDATE paths as the `authenticated` role
// with a real auth.uid() claim, so the RLS predicate is actually in the plan.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, pgClient, rigRoot } from "../scripts/rig-lib.mjs";

const env = loadEnv();
const seed = JSON.parse(readFileSync(join(rigRoot, "harness", "seed-map.json"), "utf8"));
const db = await pgClient(env);
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };

// impersonate: role + JWT claim, exactly as PostgREST does for a signed-in user
async function asUser(uid, fn) {
  await db.query("begin");
  await db.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: "authenticated" })]);
  await db.query("set local role authenticated");
  try { return await fn(); } finally { await db.query("rollback"); }
}

log("[T-7] EXPLAIN evidence — policy-filtered paths at 6,000-row seed (informational)\n");
log(`seed shape: fact_data=6000 rows across 3 businesses; indexes: fact_data(business_id), user_businesses(user_id,business_id)\n`);

await asUser(seed.users.ownerTwo, async () => {
  for (const [label, sql] of [
    ["A. SELECT all visible fact_data (policy predicate only)",
     `explain (analyze, buffers) select * from public.fact_data`],
    ["B. SELECT one business's rows (policy + explicit filter)",
     `explain (analyze, buffers) select * from public.fact_data where business_id = '${seed.businesses.s1}'`],
    ["C. UPDATE path (policy USING + WITH CHECK)",
     `explain (analyze, buffers) update public.fact_data set label = 'explain-probe' where id = '${seed.factSample.s1}'`],
    ["D. helper in isolation",
     `explain (analyze, buffers) select public.is_member_of('${seed.businesses.s1}')`],
  ]) {
    log(`── ${label}`);
    const { rows } = await db.query(sql);
    for (const r of rows) log("   " + r["QUERY PLAN"]);
    log("");
  }
});

await db.end();
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(rigRoot, "evidence", `T7_explain_${ts}.log`), lines.join("\n") + "\n");
console.log(`[T-7] evidence → proto-06/evidence/T7_explain_${ts}.log`);
