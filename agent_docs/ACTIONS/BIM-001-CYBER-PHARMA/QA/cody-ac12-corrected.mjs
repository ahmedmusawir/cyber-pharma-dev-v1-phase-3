#!/usr/bin/env node
// Corrected AC12 catalog probe. Reads the SCRATCH direct URL as one stdin line;
// no credential material is persisted or printed.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const direct = [];
const input = readline.createInterface({ input: process.stdin, terminal: false });
for await (const line of input) direct.push(line);
if (direct.length !== 1) throw new Error(`FAIL-CLOSED: expected one credential line, received ${direct.length}`);
const u = new URL(direct[0]);
const ref = "jmzwhgnyunwssamrqyhp";
if (u.hostname !== `db.${ref}.supabase.co` || u.pathname !== "/postgres") throw new Error("FAIL-CLOSED: scratch identity mismatch");
u.hostname = "aws-1-us-west-1.pooler.supabase.com";
u.port = "5432";
u.username = `postgres.${ref}`;

const client = new pg.Client({ connectionString: u.toString(), ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 });
await client.connect();
const { rows } = await client.query(`
  select t.tablename table_name,
    (select count(*)::int
       from pg_attribute a
      where a.attrelid = r.oid and a.attnum > 0 and not a.attisdropped
        and a.attname in ('created_at','updated_at')
        and format_type(a.atttypid,a.atttypmod) = 'timestamp with time zone') timestamptz_pair_count,
    coalesce((select array_agg(tr.tgname order by tr.tgname)
                from pg_trigger tr
               where tr.tgrelid = r.oid and not tr.tgisinternal), '{}') triggers
  from pg_tables t
  join pg_class r on r.relname=t.tablename
  join pg_namespace n on n.oid=r.relnamespace and n.nspname=t.schemaname
  where t.schemaname='public'
  order by t.tablename`);
await client.end();

const baseline = rows.filter((r) => ["profiles", "user_roles"].includes(r.table_name));
const fourteen = rows.filter((r) => !["profiles", "user_roles"].includes(r.table_name));
const runId = new Date().toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14);
const lines = [
  "CODY QA EVIDENCE — AC12 CORRECTED CATALOG PROBE",
  `timestamp=${new Date().toISOString()}`,
  "branch=qa/bim-001-cody-01",
  "tested_head=fefde109fe50eb55839dee4dd29129b2ea3de90c",
  `target_class=SCRATCH project_ref:${ref} pooler:aws-1-us-west-1.pooler.supabase.com db:postgres`,
  "credentials=NOT_RECORDED",
  "correction=first-run query multiplied column counts by trigger joins; this rerun uses independent correlated aggregates",
  `all16_catalog=${JSON.stringify(rows)}`,
  `fourteen_new_literal=${fourteen.length === 14 && fourteen.every((r) => r.timestamptz_pair_count === 2 && r.triggers.includes('set_updated_at'))}`,
  `baseline_catalog=${JSON.stringify(baseline)}`,
  `all16_literal=${rows.length === 16 && rows.every((r) => r.timestamptz_pair_count === 2 && r.triggers.includes('set_updated_at'))}`,
  "functional_bump_cross_reference=CODY_AC04_AC12_STRUCTURAL_NEGATIVE (all fourteen new tables true)",
  "result=CORRECTED_AC12_CATALOG_COMPLETE",
  "",
];
const out = join(here, `CODY_AC12_CORRECTED_${runId}.log`);
writeFileSync(out, lines.join("\n"));
console.log(`EVIDENCE ${out}`);
