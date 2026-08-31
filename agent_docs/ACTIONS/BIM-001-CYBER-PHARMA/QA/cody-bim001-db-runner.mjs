#!/usr/bin/env node
// Disposable QA-only runner. Reads SCRATCH then REPLICA direct URLs as two
// stdin lines, keeps them in memory, derives documented session-pooler URLs,
// and never writes credentials to evidence.

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const migrationsDir = join(repo, "supabase", "migrations");
const bootstrapFile = join(repo, "scripts", "db-bootstrap-baseline.sql");
const branch = "qa/bim-001-cody-01";
const head = "fefde109fe50eb55839dee4dd29129b2ea3de90c";
const runId = new Date().toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14);
const expectedTables = [
  "aac_reference", "accounts", "apa_memberships", "audit_logs", "businesses",
  "ful_reference", "pbm_info", "pending_registrations", "profiles",
  "reference_dataset_versions", "report_files", "subscriptions",
  "user_businesses", "user_data", "user_roles", "wac_reference",
];
const newTables = expectedTables.filter((t) => !["profiles", "user_roles"].includes(t));
const deferred = ["desktop_client_versions", "local_desktop_users", "password_reset_tokens"];
const migrationFiles = readdirSync(migrationsDir).filter((f) => /^\d{4}_.+\.sql$/.test(f)).sort();

if (process.env.CODY_DB_DESTRUCTIVE_ALLOW !== "yes") {
  console.error("FAIL-CLOSED: CODY_DB_DESTRUCTIVE_ALLOW=yes required");
  process.exit(1);
}
if (migrationFiles.length !== 15 || migrationFiles[0] !== "0001_baseline_acknowledge.sql" || migrationFiles.at(-1) !== "0015_audit_logs.sql") {
  console.error("FAIL-CLOSED: unexpected BIM-001 migration chain");
  process.exit(1);
}

const input = readline.createInterface({ input: process.stdin, terminal: false });
const urls = [];
for await (const line of input) urls.push(line);
if (urls.length !== 2) {
  console.error(`FAIL-CLOSED: expected exactly 2 credential lines, received ${urls.length}`);
  process.exit(1);
}

const defs = [
  { label: "SCRATCH", ref: "jmzwhgnyunwssamrqyhp", pool: "aws-1-us-west-1.pooler.supabase.com", direct: urls[0] },
  { label: "REPLICA", ref: "ihgcsrypblqkwommrkgj", pool: "aws-1-ap-south-1.pooler.supabase.com", direct: urls[1] },
];

for (const t of defs) {
  const u = new URL(t.direct);
  if (u.hostname !== `db.${t.ref}.supabase.co` || u.pathname !== "/postgres") {
    console.error(`${t.label}: FAIL-CLOSED identity mismatch`);
    process.exit(2);
  }
  u.hostname = t.pool;
  u.port = "5432";
  u.username = `postgres.${t.ref}`;
  t.url = u.toString();
  t.redactions = [t.direct, t.url, u.password, decodeURIComponent(u.password)].filter(Boolean);
}

const scratch = defs[0];
const replica = defs[1];
const header = (probe, target) => [
  `CODY QA EVIDENCE — ${probe}`,
  `timestamp=${new Date().toISOString()}`,
  `branch=${branch}`,
  `tested_head=${head}`,
  `target_class=${target}`,
  "credentials=NOT_RECORDED",
];
const redact = (text, target) => target.redactions.reduce((s, secret) => s.split(secret).join("[REDACTED]"), String(text));
const writeEvidence = (name, target, lines) => {
  const path = join(here, `${name}_${runId}.log`);
  writeFileSync(path, [...header(name, target), ...lines, ""].join("\n"));
  console.log(`EVIDENCE ${path.slice(repo.length + 1)}`);
};
const stable = (x) => JSON.stringify(x, Object.keys(x).sort(), 2);
const digest = (x) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
const clientFor = (t) => new pg.Client({ connectionString: t.url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 });
const inventory = async (c) => (await c.query("select tablename from pg_catalog.pg_tables where schemaname='public' order by tablename")).rows.map((r) => r.tablename);
const contractFunctions = async (c) => (await c.query(`
  select p.proname, pg_get_functiondef(p.oid) definition
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname in ('handle_new_user','rls_auto_enable','update_updated_at')
  order by p.proname`)).rows;
const policies = async (c) => (await c.query(`
  select tablename, policyname, permissive, roles, cmd, qual, with_check
  from pg_policies where schemaname='public' order by tablename, policyname`)).rows;
const baselineShape = async (c) => ({
  columns: (await c.query(`
    select c.relname table_name, a.attnum ordinal, a.attname column_name,
           format_type(a.atttypid,a.atttypmod) data_type, a.attnotnull,
           pg_get_expr(d.adbin,d.adrelid) default_expr
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    join pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
    left join pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum
    where n.nspname='public' and c.relname in ('profiles','user_roles')
    order by c.relname,a.attnum`)).rows,
  constraints: (await c.query(`
    select r.relname table_name, c.conname, c.contype, pg_get_constraintdef(c.oid,true) definition
    from pg_constraint c join pg_class r on r.oid=c.conrelid join pg_namespace n on n.oid=r.relnamespace
    where n.nspname='public' and r.relname in ('profiles','user_roles')
    order by r.relname,c.conname`)).rows,
  policies: await policies(c),
});

const wipeSql = `
  drop event trigger if exists ensure_rls;
  drop schema public cascade;
  create schema public;
  grant usage on schema public to postgres, anon, authenticated, service_role;
  grant all on all tables in schema public to postgres, service_role;
  alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;`;

async function replicaReplay() {
  const log = [...header("CODY-AC01-AC03-REPLICA-REPLAY", "REPLICA"),
    `sanitized_target=project_ref:${replica.ref} pooler:${replica.pool} db:postgres`,
    "procedure=wipe throwaway replica; attack 0001 on empty; bootstrap frozen baseline; catalog pre-chain; apply 0001-0015; catalog post-chain",
  ];
  const c = clientFor(replica);
  await c.connect();
  try {
    console.log("REPLICA destructive replay starting");
    await c.query(wipeSql);
    log.push("wipe=exit_0", `empty_inventory=${JSON.stringify(await inventory(c))}`);
    let negative;
    try {
      await c.query(readFileSync(join(migrationsDir, migrationFiles[0]), "utf8"));
      negative = { rejected: false };
    } catch (e) {
      negative = { rejected: true, code: e.code, named_error: String(e.message).includes("BIM-001/0001 BASELINE ASSERT FAILED"), message: e.message };
    }
    log.push(`ac1_empty_0001=${JSON.stringify(negative)}`);
    if (!negative.rejected || !negative.named_error) throw new Error("AC1 negative attack did not fail with named baseline error");

    await c.query(readFileSync(bootstrapFile, "utf8"));
    const preTables = await inventory(c);
    const preFunctions = await contractFunctions(c);
    const preShape = await baselineShape(c);
    log.push(`prechain_tables=${JSON.stringify(preTables)}`,
      `prechain_policies=${JSON.stringify(await policies(c))}`,
      `prechain_contract_functions=${JSON.stringify(preFunctions.map((r) => r.proname))}`,
      `prechain_baseline_shape_sha256=${digest(preShape)}`,
      `prechain_baseline_shape=${JSON.stringify(preShape)}`);

    for (const f of migrationFiles) {
      await c.query(readFileSync(join(migrationsDir, f), "utf8"));
      log.push(`migration=${f} exit=0`);
    }
    const postTables = await inventory(c);
    const postFunctions = await contractFunctions(c);
    const postShape = await baselineShape(c);
    log.push(`postchain_tables=${JSON.stringify(postTables)}`,
      `postchain_policies=${JSON.stringify(await policies(c))}`,
      `postchain_contract_functions=${JSON.stringify(postFunctions.map((r) => r.proname))}`,
      `postchain_baseline_shape_sha256=${digest(postShape)}`,
      `baseline_shape_identical=${JSON.stringify(preShape) === JSON.stringify(postShape)}`,
      `inventory_exact=${JSON.stringify(postTables) === JSON.stringify(expectedTables)}`,
      `deferred_absent=${deferred.every((t) => !postTables.includes(t))}`,
      "result=REPLICA_REPLAY_COMPLETE");
  } catch (e) {
    log.push(`instrument_or_probe_error=${redact(e.stack || e.message, replica)}`, "result=REPLICA_REPLAY_ABORTED");
    throw e;
  } finally {
    await c.end().catch(() => {});
    writeEvidence("CODY_AC01_AC03_REPLICA_REPLAY", "REPLICA", log);
  }
}

async function spawnReset() {
  return await new Promise((resolve) => {
    const child = spawn(process.execPath, [join(repo, "scripts", "db-reset.mjs"), "reset"], {
      cwd: repo,
      env: { ...process.env, DB_URL: scratch.url, DB_RESET_ALLOW: "yes" },
    });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => { stdout += d; process.stdout.write(redact(d, scratch)); });
    child.stderr.on("data", (d) => { stderr += d; process.stderr.write(redact(d, scratch)); });
    child.on("close", (code) => resolve({ code, stdout: redact(stdout, scratch), stderr: redact(stderr, scratch) }));
  });
}

async function scratchResets() {
  const log = [...header("CODY-AC02-AC13-SCRATCH-RESET", "SCRATCH"),
    `sanitized_target=project_ref:${scratch.ref} pooler:${scratch.pool} db:postgres`,
    "procedure=execute documented reset command twice consecutively; independently snapshot sorted inventory after each run",
    "command=DB_URL=[REDACTED] DB_RESET_ALLOW=yes npm run db:reset",
  ];
  const inventories = [];
  for (let i = 1; i <= 2; i++) {
    console.log(`SCRATCH reset run ${i} starting`);
    const result = await spawnReset();
    const c = clientFor(scratch); await c.connect();
    const inv = await inventory(c); await c.end();
    inventories.push(inv);
    log.push(`run${i}_exit=${result.code}`, `run${i}_stdout_begin`, result.stdout.trim(), `run${i}_stdout_end`,
      `run${i}_stderr=${result.stderr.trim() || "<empty>"}`, `run${i}_inventory=${JSON.stringify(inv)}`,
      `run${i}_inventory_sha256=${digest(inv)}`);
    if (result.code !== 0) throw new Error(`scratch reset run ${i} failed`);
  }
  log.push(`inventories_identical=${JSON.stringify(inventories[0]) === JSON.stringify(inventories[1])}`,
    `inventory_exact=${JSON.stringify(inventories[1]) === JSON.stringify(expectedTables)}`,
    `deferred_absent=${deferred.every((t) => !inventories[1].includes(t))}`,
    "manual_director_witness=NOT_PERFORMED_BY_CODY",
    "result=SCRATCH_TWO_DETERMINISTIC_RESETS_COMPLETE");
  writeEvidence("CODY_AC02_AC13_SCRATCH_RESETS", "SCRATCH", log);
}

const qRows = async (c, sql, params = []) => (await c.query(sql, params)).rows;
async function expectError(c, sql, expectedCode) {
  await c.query("savepoint cody_negative");
  try {
    await c.query(sql);
    await c.query("rollback to cody_negative");
    return { rejected: false, expectedCode };
  } catch (e) {
    await c.query("rollback to cody_negative");
    return { rejected: true, code: e.code, expectedCode, correct_code: e.code === expectedCode };
  }
}

async function structuralAndMutationAttacks() {
  const log = [...header("CODY-AC04-AC12-STRUCTURAL-NEGATIVE", "SCRATCH"),
    `sanitized_target=project_ref:${scratch.ref} pooler:${scratch.pool} db:postgres`,
    "procedure=independent pg_catalog inventory plus rollback/cleaned negative attacks",
  ];
  const c = clientFor(scratch); await c.connect();
  const probe = "10000000-0000-4000-8000-000000000001";
  const account = "10000000-0000-4000-8000-0000000000aa";
  const business = "10000000-0000-4000-8000-0000000000bb";
  const dataset = "10000000-0000-4000-8000-0000000000cc";
  try {
    const inv = await inventory(c);
    log.push(`AC4_inventory=${JSON.stringify(inv)}`, `AC4_exact=${JSON.stringify(inv) === JSON.stringify(expectedTables)}`,
      `AC4_deferred_absent=${deferred.every((t) => !inv.includes(t))}`);

    const constraints = await qRows(c, `
      select r.relname table_name,c.conname,c.contype,pg_get_constraintdef(c.oid,true) definition
      from pg_constraint c join pg_class r on r.oid=c.conrelid join pg_namespace n on n.oid=r.relnamespace
      where n.nspname='public' and r.relname=any($1) order by r.relname,c.contype,c.conname`, [expectedTables]);
    const columns = await qRows(c, `
      select c.relname table_name,a.attnum ordinal,a.attname column_name,format_type(a.atttypid,a.atttypmod) data_type,
             a.attnotnull,pg_get_expr(d.adbin,d.adrelid) default_expr
      from pg_class c join pg_namespace n on n.oid=c.relnamespace
      join pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
      left join pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum
      where n.nspname='public' and c.relname=any($1) order by c.relname,a.attnum`, [expectedTables]);
    log.push(`AC4_constraints=${JSON.stringify(constraints)}`, `CATALOG_columns=${JSON.stringify(columns)}`);

    const rls = await qRows(c, `select c.relname table_name,c.relrowsecurity,c.relforcerowsecurity
      from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname=any($1) order by c.relname`, [expectedTables]);
    const pol = await policies(c);
    log.push(`AC7_rls=${JSON.stringify(rls)}`, `AC7_policies=${JSON.stringify(pol)}`,
      `AC7_all_rls=${rls.length === 16 && rls.every((r) => r.relrowsecurity)}`,
      `AC7_policy_count_delta_zero=${pol.length === 3}`);

    const money = await qRows(c, `select table_name,column_name,data_type,udt_name from information_schema.columns
      where table_schema='public' and (column_name in ('medicaid_rate','acq','acq_net','difference','total_paid','payment','new_paid','expected_paid','new_owed','owed','nadac','awp','medicaid_rate_original','wac','aac','aca_ful','pkg_size','pkg_size_mult')
      or data_type in ('real','double precision')) order by table_name,column_name`);
    const ids = await qRows(c, `select table_name,column_name,data_type,udt_name from information_schema.columns
      where table_schema='public' and column_name in ('ndc','drug_ndc','script','bin','pcn','group_field') order by column_name,table_name`);
    log.push(`AC8_money_inventory=${JSON.stringify(money)}`,
      `AC8_float_family_absent=${money.every((r) => !['real','double precision'].includes(r.data_type))}`,
      `AC8_all_discovered_money_numeric=${money.every((r) => r.data_type === 'numeric')}`,
      `AC9_identifier_inventory=${JSON.stringify(ids)}`,
      `AC9_all_text=${ids.every((r) => ['text','character varying'].includes(r.data_type))}`);

    const provenance = await qRows(c, `select table_name,column_name,data_type,is_nullable
      from information_schema.columns where table_schema='public'
      and table_name in ('aac_reference','wac_reference','ful_reference','pbm_info','reference_dataset_versions')
      and column_name in ('source_file','imported_at','dataset_version_id','dataset_name','checksum','row_count','latest_upload_at')
      order by table_name,column_name`);
    log.push(`AC11_provenance=${JSON.stringify(provenance)}`);

    const timestamps = await qRows(c, `
      select t.tablename table_name,
        count(*) filter (where a.attname in ('created_at','updated_at') and format_type(a.atttypid,a.atttypmod)='timestamp with time zone')::int timestamptz_pair_count,
        array_remove(array_agg(distinct case when not tr.tgisinternal then tr.tgname end),null) triggers
      from pg_tables t join pg_class r on r.relname=t.tablename join pg_namespace n on n.oid=r.relnamespace and n.nspname=t.schemaname
      left join pg_attribute a on a.attrelid=r.oid and a.attnum>0 and not a.attisdropped
      left join pg_trigger tr on tr.tgrelid=r.oid
      where t.schemaname='public' and t.tablename=any($1)
      group by t.tablename order by t.tablename`, [expectedTables]);
    log.push(`AC12_all16_timestamp_trigger_catalog=${JSON.stringify(timestamps)}`,
      `AC12_literal_all16=${timestamps.length === 16 && timestamps.every((r) => r.timestamptz_pair_count === 2 && r.triggers.includes('set_updated_at'))}`);

    await c.query("begin");
    await c.query(`insert into auth.users (id,email) values ($1,'cody-bim001-probe@invalid.local') on conflict do nothing`, [probe]);
    await c.query(`insert into public.accounts (id,name,owner_user_id) values ($1,'Cody Probe',$2)`, [account, probe]);
    await c.query(`insert into public.businesses (id,account_id,ncpdp,npi,pharmacy_name) values ($1,$2,'CODY001','CODY000001','Cody Pharmacy')`, [business, account]);
    await c.query(`insert into public.user_businesses (id,user_id,business_id,role) values ('10000000-0000-4000-8000-0000000000d1',$1,$2,'member')`, [probe, business]);
    await c.query(`insert into public.pending_registrations (id,ncpdp,npi,email) values ('10000000-0000-4000-8000-0000000000d2','CODY002','CODY000002','pending@invalid.local')`);
    await c.query(`insert into public.subscriptions (id,account_id) values ('10000000-0000-4000-8000-0000000000d3',$1)`, [account]);
    await c.query(`insert into public.apa_memberships (id,license_number,membership,first_name,last_name) values ('10000000-0000-4000-8000-0000000000d4','CODY-LIC','QA','Cody','Probe')`);
    await c.query(`insert into public.reference_dataset_versions (id,dataset_name) values ($1,'__cody_bim001__')`, [dataset]);
    await c.query(`insert into public.aac_reference (id,ndc,aac_date,dataset_version_id) values ('10000000-0000-4000-8000-0000000000d5','00000000001','2026-01-01',$1)`, [dataset]);
    await c.query(`insert into public.wac_reference (id,ndc,effective_date,dataset_version_id) values ('10000000-0000-4000-8000-0000000000d6','00000000001','2026-01-01',$1)`, [dataset]);
    await c.query(`insert into public.ful_reference (id,ndc,year,month,dataset_version_id) values ('10000000-0000-4000-8000-0000000000d7','00000000001',2026,1,$1)`, [dataset]);
    await c.query(`insert into public.pbm_info (id,bin,matching_type,dataset_version_id) values ('10000000-0000-4000-8000-0000000000d8','004146','exact',$1)`, [dataset]);
    await c.query(`insert into public.user_data (id,business_id,medicaid_method) values ('10000000-0000-4000-8000-0000000000d9',$1,'AAC')`, [business]);
    await c.query(`insert into public.report_files (id,business_id) values ('10000000-0000-4000-8000-0000000000da',$1)`, [business]);
    await c.query(`insert into public.audit_logs (id,username) values ('10000000-0000-4000-8000-0000000000db','cody-probe')`);

    const negative = {};
    negative.role_owner = await expectError(c, `update public.user_businesses set role='owner' where id='10000000-0000-4000-8000-0000000000d1'`, "23514");
    negative.role_null = await expectError(c, `update public.user_businesses set role=null where id='10000000-0000-4000-8000-0000000000d1'`, "23502");
    await c.query(`update public.user_businesses set role='admin' where id='10000000-0000-4000-8000-0000000000d1'`);
    await c.query(`update public.user_businesses set role='member' where id='10000000-0000-4000-8000-0000000000d1'`);
    negative.business_account_null = await expectError(c, `insert into public.businesses(account_id,ncpdp,npi,pharmacy_name) values(null,'BADNULL','BADNULL','bad')`, "23502");
    negative.business_account_fk = await expectError(c, `insert into public.businesses(account_id,ncpdp,npi,pharmacy_name) values('ffffffff-ffff-4fff-8fff-ffffffffffff','BADFK','BADFK','bad')`, "23503");
    negative.subscription_account_null = await expectError(c, `insert into public.subscriptions(account_id) values(null)`, "23502");
    negative.account_owner_fk = await expectError(c, `insert into public.accounts(name,owner_user_id) values('bad','ffffffff-ffff-4fff-8fff-ffffffffffff')`, "23503");
    negative.business_unique = await expectError(c, `insert into public.businesses(account_id,ncpdp,npi,pharmacy_name) values('${account}','CODY001','CODY000001','dup')`, "23505");
    negative.aac_unique = await expectError(c, `insert into public.aac_reference(ndc,aac_date) values('00000000001','2026-01-01')`, "23505");
    for (const v of ["AAC","FUL","GWAC","BWAC","Take Action","Manual Override","Legacy"]) {
      await c.query(`update public.user_data set medicaid_method=$1 where id='10000000-0000-4000-8000-0000000000d9'`, [v]);
      negative[`medicaid_accept_${v}`] = true;
    }
    negative.medicaid_portal = await expectError(c, `update public.user_data set medicaid_method='Portal' where id='10000000-0000-4000-8000-0000000000d9'`, "23514");
    negative.medicaid_empty = await expectError(c, `update public.user_data set medicaid_method='' where id='10000000-0000-4000-8000-0000000000d9'`, "23514");
    negative.medicaid_case = await expectError(c, `update public.user_data set medicaid_method='aac' where id='10000000-0000-4000-8000-0000000000d9'`, "23514");
    await c.query(`update public.user_data set medicaid_method=null where id='10000000-0000-4000-8000-0000000000d9'`);
    negative.medicaid_null_accepted = true;
    await c.query("commit");
    log.push(`AC5_AC6_AC10_negative_attacks=${JSON.stringify(negative)}`);

    const idsByTable = {
      accounts: account, businesses: business, user_businesses: "10000000-0000-4000-8000-0000000000d1",
      pending_registrations: "10000000-0000-4000-8000-0000000000d2", subscriptions: "10000000-0000-4000-8000-0000000000d3",
      apa_memberships: "10000000-0000-4000-8000-0000000000d4", reference_dataset_versions: dataset,
      aac_reference: "10000000-0000-4000-8000-0000000000d5", wac_reference: "10000000-0000-4000-8000-0000000000d6",
      ful_reference: "10000000-0000-4000-8000-0000000000d7", pbm_info: "10000000-0000-4000-8000-0000000000d8",
      user_data: "10000000-0000-4000-8000-0000000000d9", report_files: "10000000-0000-4000-8000-0000000000da",
      audit_logs: "10000000-0000-4000-8000-0000000000db",
    };
    const denial = {};
    for (const role of ["anon", "authenticated"]) {
      denial[role] = {};
      for (const table of newTables) {
        await c.query("begin");
        try {
          await c.query(`set local role ${role}`);
          const result = await c.query(`select id from public.${table} where id=$1`, [idsByTable[table]]);
          denial[role][table] = result.rowCount === 0 ? "empty" : `LEAKED_${result.rowCount}`;
          await c.query("rollback");
        } catch (e) {
          denial[role][table] = `denied_${e.code || 'error'}`;
          await c.query("rollback").catch(() => {});
        }
      }
    }
    log.push(`AC7_seeded_row_denial=${JSON.stringify(denial)}`,
      `AC7_no_leaks=${Object.values(denial).every((x) => Object.values(x).every((v) => !v.startsWith('LEAKED_')))}`);

    const before = Object.fromEntries((await qRows(c, `select table_name,updated_at from (
      ${newTables.map((t) => `select '${t}'::text table_name,updated_at from public.${t} where id='${idsByTable[t]}'`).join(" union all ")}
    ) s order by table_name`)).map((r) => [r.table_name, r.updated_at]));
    await new Promise((r) => setTimeout(r, 1100));
    const updates = {
      accounts: "name=name", businesses: "pharmacy_name=pharmacy_name", user_businesses: "is_primary=is_primary",
      pending_registrations: "verification_notes=verification_notes", subscriptions: "cancel_at_period_end=cancel_at_period_end",
      apa_memberships: "discount_redeemed=discount_redeemed", reference_dataset_versions: "row_count=row_count",
      aac_reference: "drug_name=drug_name", wac_reference: "drug_name=drug_name", ful_reference: "drug_name=drug_name",
      pbm_info: "pbm_name=pbm_name", user_data: "status=status", report_files: "report_type=report_type", audit_logs: "action=action",
    };
    for (const t of newTables) await c.query(`update public.${t} set ${updates[t]} where id=$1`, [idsByTable[t]]);
    const after = Object.fromEntries((await qRows(c, `select table_name,updated_at from (
      ${newTables.map((t) => `select '${t}'::text table_name,updated_at from public.${t} where id='${idsByTable[t]}'`).join(" union all ")}
    ) s order by table_name`)).map((r) => [r.table_name, r.updated_at]));
    const bumps = Object.fromEntries(newTables.map((t) => [t, new Date(after[t]) > new Date(before[t])]));
    log.push(`AC12_new_table_update_bumps=${JSON.stringify(bumps)}`, `AC12_all14_bump=${Object.values(bumps).every(Boolean)}`);

    await c.query("begin");
    for (const t of ["audit_logs","report_files","user_data","pbm_info","ful_reference","wac_reference","aac_reference","reference_dataset_versions","apa_memberships","subscriptions","pending_registrations","user_businesses","businesses","accounts"])
      await c.query(`delete from public.${t} where id=$1`, [idsByTable[t]]);
    await c.query("delete from auth.users where id=$1", [probe]);
    await c.query("commit");
    log.push("probe_cleanup=complete", "result=STRUCTURAL_AND_NEGATIVE_ATTACKS_COMPLETE");
  } catch (e) {
    await c.query("rollback").catch(() => {});
    log.push(`instrument_or_probe_error=${redact(e.stack || e.message, scratch)}`, "result=STRUCTURAL_AND_NEGATIVE_ATTACKS_ABORTED");
    throw e;
  } finally {
    await c.end().catch(() => {});
    writeEvidence("CODY_AC04_AC12_STRUCTURAL_NEGATIVE", "SCRATCH", log);
  }
}

try {
  console.log(`CODY DB RUN ${runId} branch=${branch} head=${head}`);
  await replicaReplay();
  await scratchResets();
  await structuralAndMutationAttacks();
  console.log("CODY_DETERMINISTIC_DB_EXECUTION_COMPLETE");
  console.log("DIRECTOR_ONE_WALK_NOT_PERFORMED");
} catch (e) {
  console.error(`CODY_DB_RUN_ABORTED ${redact(redact(e.message, scratch), replica)}`);
  process.exit(3);
}
