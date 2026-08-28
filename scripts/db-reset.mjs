#!/usr/bin/env node
// BIM-001 · db-reset.mjs — the one-command reset + chain runner (gates X1-X3).
//
// Commands:
//   node scripts/db-reset.mjs reset       drop public schema → bootstrap baseline → replay chain (SCRATCH ONLY)
//   node scripts/db-reset.mjs bootstrap   install the baseline reproduction ONLY (factory-fresh replica setup; no chain)
//   node scripts/db-reset.mjs apply       replay chain only (X2: baseline-replica path; 0001 asserts first)
//   node scripts/db-reset.mjs inventory   print public tables + counts, exit 0
//
// Environment (fail-closed — BIM-000 runner lessons: repo-root-anchored, loud):
//   DB_URL           postgres connection string (scratch or replica — NEVER live)
//   DB_RESET_ALLOW   must be exactly "yes" for the destructive `reset` command
//
// Exit codes: 0 success · 1 usage/env failure · 2 SQL failure (file named).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const migrationsDir = join(repoRoot, "supabase", "migrations");
const bootstrapFile = join(repoRoot, "scripts", "db-bootstrap-baseline.sql");

// fail-closed anchors (BIM-000 lesson: runners resolve repo root, verify, refuse)
for (const anchor of [migrationsDir, bootstrapFile]) {
  if (!existsSync(anchor)) {
    console.error(`FAIL-CLOSED: missing anchor ${anchor} — refusing to run.`);
    process.exit(1);
  }
}

const cmd = process.argv[2];
if (!["reset", "bootstrap", "apply", "inventory"].includes(cmd)) {
  console.error("usage: db-reset.mjs <reset|bootstrap|apply|inventory>   (DB_URL required)");
  process.exit(1);
}
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error("FAIL-CLOSED: DB_URL not set. Provide the SCRATCH/REPLICA connection string. Never the live project.");
  process.exit(1);
}
if (cmd === "reset" && process.env.DB_RESET_ALLOW !== "yes") {
  console.error("FAIL-CLOSED: `reset` DROPS the public schema. Set DB_RESET_ALLOW=yes to confirm the target is a scratch database.");
  process.exit(1);
}

const migrationFiles = readdirSync(migrationsDir)
  .filter((f) => /^\d{4}_.+\.sql$/.test(f))
  .sort();

const client = new pg.Client({ connectionString: dbUrl });
const target = new URL(dbUrl);
console.log(`[db-reset] ${cmd} → host=${target.hostname} db=${target.pathname.slice(1)}`);
console.log(`[db-reset] chain: ${migrationFiles.length} migrations (${migrationFiles[0]} … ${migrationFiles[migrationFiles.length - 1]})`);

async function runSql(label, sql) {
  try {
    await client.query(sql);
    console.log(`  ok  ${label}`);
  } catch (err) {
    console.error(`  FAIL ${label}: ${err.message}`);
    await client.end();
    process.exit(2);
  }
}

async function inventory() {
  const { rows } = await client.query(
    `select table_name from information_schema.tables
     where table_schema='public' and table_type='BASE TABLE' order by table_name`
  );
  console.log(`[inventory] ${rows.length} public tables:`);
  for (const r of rows) console.log(`  - ${r.table_name}`);
  return rows.map((r) => r.table_name);
}

await client.connect();

if (cmd === "inventory") {
  await inventory();
  await client.end();
  process.exit(0);
}

if (cmd === "reset") {
  // drop the event trigger FIRST — its function lives in public and a schema
  // drop would orphan the trigger, breaking all subsequent DDL.
  await runSql("drop event trigger (pre-drop)", `DROP EVENT TRIGGER IF EXISTS ensure_rls;`);
  await runSql("drop schema public", `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  // re-grant the Supabase-standard privileges the schema drop destroyed —
  // deny-by-default must come from RLS, not from missing grants (X4 semantics).
  await runSql(
    "re-grant public schema privileges",
    `GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
     GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;`
  );
  await runSql("bootstrap baseline (scratch-only, X0 rider 3)", readFileSync(bootstrapFile, "utf8"));
}

if (cmd === "bootstrap") {
  // factory-fresh target: install the baseline reproduction only, no chain.
  await runSql("bootstrap baseline (replica setup)", readFileSync(bootstrapFile, "utf8"));
  await inventory();
  await client.end();
  process.exit(0);
}

// chain replay — both `reset` and `apply` end here. 0001 asserts the baseline
// (assert-then-create) so a wrong target fails loudly on the first file.
for (const file of migrationFiles) {
  await runSql(file, readFileSync(join(migrationsDir, file), "utf8"));
}

const tables = await inventory();
console.log(`[db-reset] ${cmd} complete — ${tables.length} tables on target.`);
await client.end();
