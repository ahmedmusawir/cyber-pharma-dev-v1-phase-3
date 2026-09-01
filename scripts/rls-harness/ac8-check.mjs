#!/usr/bin/env node
// BIM-002 · rls-harness/ac8-check.mjs — helper shape and grants (AC8).
//
// E-5 / ERRATUM E-4: this assertion is only meaningful AFTER a from-scratch
// drop-and-apply. `create or replace` preserves an existing ACL, so an
// incremental re-apply can show a clean grant that a fresh database would not
// reproduce — which is exactly how the anon grant hid through X1.
// PUBLIC and anon are two independent channels: pg_default_acl grants function
// EXECUTE to anon explicitly, so the raw ACL is checked for BOTH a bare `=X/`
// entry (PUBLIC) and an `anon=X` entry.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { pgClient } from "./lib/db.mjs";

const HELPERS = [
  ["is_member_of", "is_member_of(uuid)"],
  ["is_admin_of", "is_admin_of(uuid)"],
  ["is_account_member", "is_account_member(uuid)"],
  ["my_business_ids", "my_business_ids()"],
];

const env = loadEnv();
const db = await pgClient(env);
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
let fails = 0;

log("[ac8] helper shape + grants (asserted after a from-scratch apply, per E-5)");
const rows = (await db.query(
  `select proname, prosecdef, provolatile, proconfig::text cfg, proacl::text acl
   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and proname = any($1) order by 1`,
  [HELPERS.map((h) => h[0])]
)).rows;

if (rows.length !== HELPERS.length) { log(`  FAIL expected ${HELPERS.length} helpers, found ${rows.length}`); fails++; }
for (const r of rows) {
  const shape = r.prosecdef === true && r.provolatile === "s" && /search_path=/.test(r.cfg || "");
  const noPublic = !/(^|\{|,)=X\//.test(r.acl || "");   // bare =X/ is PUBLIC
  const noAnon = !/anon=X/.test(r.acl || "");
  const ok = shape && noPublic && noAnon;
  if (!ok) fails++;
  log(`  ${ok ? "ok  " : "FAIL"} ${r.proname.padEnd(18)} secdef=${r.prosecdef} volatile=${r.provolatile} config=${r.cfg} acl=${r.acl}`);
}
for (const [, sig] of HELPERS) {
  const g = (await db.query(
    `select has_function_privilege('anon','public.'||$1,'EXECUTE') a,
            has_function_privilege('authenticated','public.'||$1,'EXECUTE') b,
            has_function_privilege('service_role','public.'||$1,'EXECUTE') s`, [sig])).rows[0];
  const ok = g.a === false && g.b === true && g.s === true;
  if (!ok) fails++;
  log(`  ${ok ? "ok  " : "FAIL"} ${sig.padEnd(26)} anon=${g.a} authenticated=${g.b} service_role=${g.s}`);
}
// live probe: anon must be refused at execution time, not merely by catalog
await db.query("begin");
await db.query("set local role anon");
try { await db.query("select * from public.my_business_ids()"); log("  FAIL anon EXECUTED my_business_ids()"); fails++; }
catch (e) { log(`  ok   anon denied at execution (${e.code})`); }
await db.query("rollback");

log(`[ac8] ${fails === 0 ? "AC8 GREEN" : `${fails} FAILURE(S)`}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(repoRoot, "agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence", `X5_ac8_fresh_${ts}.log`), lines.join("\n") + "\n");
await db.end();
process.exit(fails === 0 ? 0 : 3);
