#!/usr/bin/env node
// PROTO-06 · rig-policy.mjs — apply ONE policy/helper file, then enforce the
// one-permissive-policy-per-operation-per-table law (fails loudly if violated).
import { readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { loadEnv, pgClient, rigRoot } from "./rig-lib.mjs";

const file = process.argv[2];
if (!file) { console.error("usage: rig-policy.mjs <file-in-proto-06/policies/ | --map>"); process.exit(1); }
const env = loadEnv();
const client = await pgClient(env);
if (file !== "--map") {
  try {
    await client.query(readFileSync(join(rigRoot, "policies", basename(file)), "utf8"));
    console.log(`  ok  applied ${basename(file)}`);
  } catch (err) {
    console.error(`  FAIL ${basename(file)}: ${err.message}`);
    process.exit(2);
  }
}
const { rows } = await client.query(`
  select tablename, cmd, count(*)::int as n, string_agg(policyname, ', ' order by policyname) as names
  from pg_policies where schemaname='public' and permissive='PERMISSIVE'
  group by 1,2 order by 1,2`);
let violation = false;
for (const r of rows) {
  console.log(`  policy-map: ${r.tablename} ${r.cmd} × ${r.n} (${r.names})`);
  if (r.n > 1) violation = true;
}
if (violation) {
  console.error("LAW VIOLATION: >1 permissive policy on a table+operation. STOP and flag.");
  process.exit(3);
}
await client.end();
