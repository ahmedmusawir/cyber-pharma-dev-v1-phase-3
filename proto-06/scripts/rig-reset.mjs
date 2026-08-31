#!/usr/bin/env node
// PROTO-06 · rig-reset.mjs — throwaway wipe + miniature migrate + pg_catalog proof.
//   wipe     drop EVERYTHING in public (guard: RIG_RESET_ALLOW=yes); ownership
//            fallback per Director addition (2): individual drops if CASCADE fails
//   migrate  apply proto-06/migrations/p01–p05 in order
//   catalog  print the pg_catalog state (tables / functions / policies / event trigger / RLS flags)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, pgClient, rigRoot } from "./rig-lib.mjs";

const cmd = process.argv[2];
if (!["wipe", "migrate", "catalog"].includes(cmd)) {
  console.error("usage: rig-reset.mjs <wipe|migrate|catalog>");
  process.exit(1);
}
const env = loadEnv();
const client = await pgClient(env);
console.log(`[rig-reset] ${cmd} → throwaway (host redacted; PROTO06_DB_URL)`);

async function catalogProof(label) {
  const t = await client.query(`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by 1`);
  const f = await client.query(`select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' order by 1`);
  const pol = await client.query(`select tablename, policyname from pg_policies where schemaname='public' order by 1,2`);
  const et = await client.query(`select evtname from pg_event_trigger where evtname='ensure_rls'`);
  const rls = await client.query(`select relname, relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r' order by 1`);
  console.log(`[pg_catalog ${label}] tables=${t.rows.length} functions=${f.rows.length} policies=${pol.rows.length} ensure_rls=${et.rows.length ? "PRESENT" : "absent"}`);
  for (const r of t.rows) console.log(`  table: ${r.table_name}`);
  for (const r of f.rows) console.log(`  function: ${r.proname}`);
  for (const r of pol.rows) console.log(`  policy: ${r.tablename}.${r.policyname}`);
  for (const r of rls.rows) console.log(`  rls: ${r.relname}=${r.relrowsecurity}`);
  return { tables: t.rows.length, functions: f.rows.length, policies: pol.rows.length };
}

if (cmd === "catalog") {
  await catalogProof("state");
  await client.end();
  process.exit(0);
}

if (cmd === "wipe") {
  if (process.env.RIG_RESET_ALLOW !== "yes") {
    console.error("FAIL-CLOSED: wipe drops the public schema. Set RIG_RESET_ALLOW=yes.");
    process.exit(1);
  }
  await client.query(`DROP EVENT TRIGGER IF EXISTS ensure_rls`); // before schema drop — BIM-001 lesson
  try {
    await client.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    console.log("  ok  DROP SCHEMA public CASCADE");
  } catch (err) {
    // Director addition (2): ownership fallback — drop objects individually.
    console.log(`  note: schema CASCADE failed (${err.message}) — falling back to individual drops`);
    const pols = await client.query(`select tablename, policyname from pg_policies where schemaname='public'`);
    for (const p of pols.rows) await client.query(`DROP POLICY IF EXISTS "${p.policyname}" ON public."${p.tablename}"`);
    const tabs = await client.query(`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'`);
    for (const t of tabs.rows) await client.query(`DROP TABLE IF EXISTS public."${t.table_name}" CASCADE`);
    const fns = await client.query(`select p.proname, pg_get_function_identity_arguments(p.oid) as args from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'`);
    for (const f of fns.rows) await client.query(`DROP FUNCTION IF EXISTS public."${f.proname}"(${f.args}) CASCADE`);
    console.log(`  ok  individual drops: ${pols.rows.length} policies, ${tabs.rows.length} tables, ${fns.rows.length} functions`);
  }
  await client.query(`
    GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;`);
  console.log("  ok  re-grants");
  const proof = await catalogProof("post-wipe");
  if (proof.tables !== 0 || proof.functions !== 0 || proof.policies !== 0) {
    console.error("WIPE INCOMPLETE — objects remain. Refusing to proceed.");
    process.exit(2);
  }
  console.log("[rig-reset] wipe complete — public schema is BARE (proven).");
}

if (cmd === "migrate") {
  const files = readdirSync(join(rigRoot, "migrations")).filter((f) => /^p\d{2}_.+\.sql$/.test(f)).sort();
  for (const file of files) {
    try {
      await client.query(readFileSync(join(rigRoot, "migrations", file), "utf8"));
      console.log(`  ok  ${file}`);
    } catch (err) {
      console.error(`  FAIL ${file}: ${err.message}`);
      process.exit(2);
    }
  }
  await catalogProof("post-migrate");
}

await client.end();
