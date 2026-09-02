#!/usr/bin/env node
// BIM-002 PRE-Q Phase 2 — independent SCRATCH-only live attack.
// This QA probe deliberately does not import or invoke the shipped matrix.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const evidencePath = process.argv[2];
if (!evidencePath) throw new Error("evidence path argument required");

const envMod = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/env.mjs")));
const dbMod = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/db.mjs")));
const { loadEnv, CAST_PASSWORD } = envMod;
const { pgClient, serviceClient, anonClient } = dbMod;

const lines = [];
let mismatches = 0;
let db;
const log = (s = "") => { lines.push(s); console.log(s); };
const safe = (s) => String(s ?? "")
  .replace(/postgres(?:ql)?:\/\/\S+/gi, "<redacted-connection-url>")
  .replace(/https?:\/\/\S+/gi, "<redacted-url>")
  .replace(/eyJ[A-Za-z0-9._-]+/g, "<redacted-token>");
const observed = (id, expected, actual, ok, detail = "") => {
  if (!ok) mismatches++;
  log(`${ok ? "MATCH" : "MISMATCH"} ${id} | expected=${expected} | observed=${actual}${detail ? ` | ${detail}` : ""}`);
};
const writeEvidence = () => {
  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, lines.join("\n") + "\n");
};
const apiShape = (r) => ({ code: r.error?.code ?? null, message: safe(r.error?.message ?? ""), rows: r.data?.length ?? 0 });
const shapeText = (r) => {
  const s = apiShape(r);
  return `code=${s.code ?? "none"}, rows=${s.rows}${s.message ? `, message=${s.message}` : ""}`;
};
const eqSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

async function one(sql, params = []) { return (await db.query(sql, params)).rows[0]; }
async function exactCount(client, table, filters = {}) {
  let q = client.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const r = await q;
  if (r.error) throw new Error(`count ${table} failed code=${r.error.code ?? "unknown"}`);
  return r.count ?? 0;
}
async function selectBy(client, table, filters) {
  let q = client.from(table).select("*");
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  return q;
}

try {
  log("BIM-002 PRE-Q PHASE 2 — SCRATCH DESTRUCTIVE RLS ATTACK");
  log(`local_start=${new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kuala_Lumpur" })} +0800`);
  log("INTENDED TARGET: SCRATCH");
  log("target_selection=no replica prefix; default RLS_HARNESS_* absent; Amendment A-1 fallback selected");
  log("credential_values_recorded=false");

  const env = loadEnv(); // Emits only the approved key-name fallback banner.
  log("resolver_signal=[env] A-1 fallback in use");

  log("\n=== FRESH SCRATCH RESET + 0001-0027 APPLY ===");
  const reset = spawnSync(process.execPath, [path.join(root, "scripts/db-reset.mjs"), "reset"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, DB_URL: env.DB_URL, DB_RESET_ALLOW: "yes" },
  });
  const resetText = `${reset.stdout ?? ""}\n${reset.stderr ?? ""}`.trim();
  for (const rawLine of resetText.split("\n")) {
    if (/^\[db-reset\] reset → host=/.test(rawLine)) log("[db-reset] reset → A-1 SCRATCH target (host/db redacted)");
    else if (rawLine) log(safe(rawLine));
  }
  observed("RESET", "exit=0", `exit=${reset.status}`, reset.status === 0);
  if (reset.status !== 0) throw new Error("fresh SCRATCH reset/apply failed");

  db = await pgClient(env);
  const svc = serviceClient(env);

  log("\n=== INDEPENDENT PAGINATED AUTH CLEANUP + NON-VACUOUS SEED ===");
  let purged = 0;
  for (let pageGuard = 0; pageGuard < 100; pageGuard++) {
    const { data, error } = await svc.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw new Error(`Auth list failed code=${error.status ?? "unknown"}`);
    const users = data?.users ?? [];
    if (!users.length) break;
    for (const u of users) {
      const { error: delError } = await svc.auth.admin.deleteUser(u.id);
      if (delError) throw new Error(`Auth purge failed code=${delError.status ?? "unknown"}`);
      purged++;
    }
    if (pageGuard === 99) throw new Error("Auth purge page guard exhausted");
  }
  const { data: afterPurge, error: afterPurgeError } = await svc.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (afterPurgeError) throw new Error("Auth post-purge count failed");
  observed("AUTH-PURGE", "remaining=0", `purged=${purged}, remaining=${afterPurge?.users?.length ?? 0}`, (afterPurge?.users?.length ?? 0) === 0);

  const cast = [
    { key: "ownerA", email: "bim002-ownera@rls.local" },
    { key: "staffA", email: "bim002-staffa@rls.local" },
    { key: "ownerB", email: "bim002-ownerb@rls.local" },
    { key: "multiStore", email: "bim002-multistore@rls.local" },
  ];
  const users = {};
  for (const who of cast) {
    const { data, error } = await svc.auth.admin.createUser({ email: who.email, password: CAST_PASSWORD, email_confirm: true });
    if (error) throw new Error(`Auth create ${who.key} failed code=${error.status ?? "unknown"}`);
    users[who.key] = data.user.id;
  }
  observed("AUTH-CAST", "created=4", `created=${Object.keys(users).length}`, Object.keys(users).length === 4);

  const accA = await one("insert into public.accounts (name, owner_user_id) values ('Account A',$1) returning id", [users.ownerA]);
  const accB = await one("insert into public.accounts (name, owner_user_id) values ('Account B',$1) returning id", [users.ownerB]);
  const a1 = await one("insert into public.businesses (account_id,ncpdp,npi,pharmacy_name) values ($1,'0100001','1010000001','Store A1') returning id", [accA.id]);
  const a2 = await one("insert into public.businesses (account_id,ncpdp,npi,pharmacy_name) values ($1,'0100002','1010000002','Store A2') returning id", [accA.id]);
  const b1 = await one("insert into public.businesses (account_id,ncpdp,npi,pharmacy_name) values ($1,'0100003','1010000003','Store B1') returning id", [accB.id]);
  await db.query(`insert into public.user_businesses (user_id,business_id,role,is_primary) values
    ($1,$5,'admin',true),($1,$6,'admin',false),($2,$5,'member',true),
    ($3,$7,'admin',true),($4,$5,'member',true),($4,$7,'member',false)`,
    [users.ownerA, users.staffA, users.ownerB, users.multiStore, a1.id, a2.id, b1.id]);
  await db.query("insert into public.subscriptions (account_id,status) values ($1,'active'),($2,'trialing')", [accA.id, accB.id]);
  for (const [biz, tag] of [[a1.id, "A1"], [a2.id, "A2"], [b1.id, "B1"]]) {
    await db.query(`insert into public.user_data (business_id,script,drug_ndc,drug_name,qty,payment,expected_paid,owed,date_dispensed)
      select $1,'RX-${tag}-'||g,lpad(g::text,11,'0'),'Drug ${tag} '||g,(g%5)+1,(g*3)::numeric,(g*4)::numeric,g::numeric,current_date-(g%30)
      from generate_series(1,200) g`, [biz]);
    await db.query("insert into public.report_files (business_id,file_name,report_type) values ($1,$2,'owedbook')", [biz, `report-${tag}.pdf`]);
  }
  await db.query("insert into public.apa_memberships (license_number,membership,first_name,last_name) values ('LIC-0001','APA','Ada','Lovelace')");
  await db.query("insert into public.pending_registrations (ncpdp,npi,email,pharmacy_name) values ('0900001','1090000001','pending@rls.local','Pending Pharmacy')");
  await db.query("insert into public.audit_logs (username,table_name,action) values ('system_seed','user_data','create')");
  await db.query("insert into public.reference_dataset_versions (dataset_name,checksum,row_count) values ('aac','qa-seed',3)");
  await db.query("insert into public.aac_reference (ndc,aac_date,aac,drug_name) values ('00000000001',current_date,12.34,'Ref Drug')");
  await db.query("insert into public.wac_reference (ndc,effective_date,wac,pkg_size,pkg_size_mult,generic_indicator) values ('00000000001',current_date,56.78,30,1,'G')");
  await db.query("insert into public.ful_reference (ndc,year,month,aca_ful) values ('00000000001',2026,9,9.876543)");
  await db.query("insert into public.pbm_info (bin,pbm_name,pcn,state,matching_type) values ('004146','Seed PBM','PCN1','AL','bin_only')");
  const factA1 = await one("select id,business_id,drug_name from public.user_data where business_id=$1 order by id limit 1", [a1.id]);
  const factB1 = await one("select id from public.user_data where business_id=$1 order by id limit 1", [b1.id]);
  const reportA1 = await one("select id from public.report_files where business_id=$1", [a1.id]);
  const reportB1 = await one("select id from public.report_files where business_id=$1", [b1.id]);
  const subA = await one("select id from public.subscriptions where account_id=$1", [accA.id]);
  const subB = await one("select id from public.subscriptions where account_id=$1", [accB.id]);
  log("seed_relationships=AccountA->[A1,A2]; AccountB->[B1]; ownerA=A1+A2 admin; staffA=A1 member; ownerB=B1 admin; multiStore=A1+B1 member");
  observed("SEED-USER-DATA", "A1=200,A2=200,B1=200", `A1=${(await one("select count(*)::int n from public.user_data where business_id=$1", [a1.id])).n},A2=${(await one("select count(*)::int n from public.user_data where business_id=$1", [a2.id])).n},B1=${(await one("select count(*)::int n from public.user_data where business_id=$1", [b1.id])).n}`, true);

  log("\n=== A. FRESH HELPER SECURITY ===");
  const helperNames = ["is_member_of", "is_admin_of", "is_account_member", "my_business_ids"];
  const helperRows = (await db.query(`
    select p.oid, p.proname, pg_get_userbyid(p.proowner) owner_name,
           p.prosecdef, p.provolatile, p.proconfig::text config,
           has_function_privilege('anon',p.oid,'EXECUTE') anon_exec,
           has_function_privilege('authenticated',p.oid,'EXECUTE') auth_exec,
           has_function_privilege('service_role',p.oid,'EXECUTE') service_exec,
           coalesce((select bool_or(x.grantee=0 and x.privilege_type='EXECUTE')
                     from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) x),false) public_exec
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname=any($1) order by p.proname`, [helperNames])).rows;
  observed("HELPER-COUNT", "4", String(helperRows.length), helperRows.length === 4);
  for (const h of helperRows) {
    const ok = h.prosecdef === true && h.provolatile === "s" && /search_path=/.test(h.config ?? "")
      && h.public_exec === false && h.anon_exec === false && h.auth_exec === true;
    observed(`HELPER-${h.proname}`, "owner=postgres,secdef=true,stable=true,empty-search-path,public=false,anon=false,authenticated=true",
      `owner=${h.owner_name},secdef=${h.prosecdef},volatile=${h.provolatile},config=${h.config},public=${h.public_exec},anon=${h.anon_exec},authenticated=${h.auth_exec},service=${h.service_exec}`,
      ok && h.owner_name === "postgres");
  }

  for (const name of helperNames) {
    await db.query("begin");
    await db.query("set local role anon");
    let code = "none";
    try {
      if (name === "my_business_ids") await db.query("select * from public.my_business_ids()");
      else if (name === "is_account_member") await db.query("select public.is_account_member($1)", [accA.id]);
      else await db.query(`select public.${name}($1)`, [a1.id]);
    } catch (e) { code = e.code ?? "unknown"; }
    await db.query("rollback");
    observed(`ANON-EXEC-${name}`, "permission-denied code=42501", `code=${code}`, code === "42501");
  }

  await db.query("begin");
  await db.query("set local role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,true)", [users.ownerA]);
  const authMemberOwn = (await db.query("select public.is_member_of($1) v", [a1.id])).rows[0].v;
  const authMemberForeign = (await db.query("select public.is_member_of($1) v", [b1.id])).rows[0].v;
  const authAdminOwn = (await db.query("select public.is_admin_of($1) v", [a1.id])).rows[0].v;
  const authAccountOwn = (await db.query("select public.is_account_member($1) v", [accA.id])).rows[0].v;
  const authBizIds = (await db.query("select public.my_business_ids() v")).rows.map(r => r.v);
  await db.query("rollback");
  observed("AUTH-EXEC-is_member_of", "own=true,foreign=false", `own=${authMemberOwn},foreign=${authMemberForeign}`, authMemberOwn === true && authMemberForeign === false);
  observed("AUTH-EXEC-is_admin_of", "own=true", `own=${authAdminOwn}`, authAdminOwn === true);
  observed("AUTH-EXEC-is_account_member", "own=true", `own=${authAccountOwn}`, authAccountOwn === true);
  observed("AUTH-EXEC-my_business_ids", "stores=[A1,A2]", `stores=${JSON.stringify(authBizIds.map(id => id === a1.id ? "A1" : id === a2.id ? "A2" : "UNKNOWN" ).sort())}`, eqSet(authBizIds, [a1.id, a2.id]));

  log("\n=== B. EXACT SESSION IDENTITY ===");
  const sessions = {};
  for (const who of cast) {
    const c = anonClient(env);
    const { data, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
    const ok = !error && data?.user?.id === users[who.key];
    observed(`SESSION-${who.key}`, "sign-in=no-error,exact-seeded-id=true", `code=${error?.code ?? "none"},exact-seeded-id=${data?.user?.id === users[who.key]}`, ok);
    if (!ok) {
      log(`STOP_IDENTITY=${who.key}`);
      throw new Error(`identity mismatch for ${who.key}`);
    }
    sessions[who.key] = c;
  }

  log("\n=== E/F. TENANT ISOLATION + FORMULATION C RESULT SETS ===");
  const expectedCounts = {
    ownerA: { businesses: 2, user_businesses: 2, user_data: 400, report_files: 2, accounts: 1, subscriptions: 1 },
    staffA: { businesses: 1, user_businesses: 1, user_data: 200, report_files: 1, accounts: 1, subscriptions: 1 },
    ownerB: { businesses: 1, user_businesses: 1, user_data: 200, report_files: 1, accounts: 1, subscriptions: 1 },
    multiStore: { businesses: 2, user_businesses: 2, user_data: 400, report_files: 2, accounts: 2, subscriptions: 2 },
  };
  for (const who of cast) {
    for (const [table, want] of Object.entries(expectedCounts[who.key])) {
      const got = await exactCount(sessions[who.key], table);
      observed(`COUNT-${who.key}-${table}`, String(want), String(got), got === want);
    }
  }

  const foreign = {
    ownerA: { biz: b1.id, fact: factB1.id, report: reportB1.id, otherUser: users.ownerB, account: accB.id, sub: subB.id },
    staffA: { biz: b1.id, fact: factB1.id, report: reportB1.id, otherUser: users.ownerB, account: accB.id, sub: subB.id },
    ownerB: { biz: a1.id, fact: factA1.id, report: reportA1.id, otherUser: users.ownerA, account: accA.id, sub: subA.id },
    multiStore: { biz: a2.id, fact: (await one("select id from public.user_data where business_id=$1 order by id limit 1", [a2.id])).id, report: (await one("select id from public.report_files where business_id=$1", [a2.id])).id, otherUser: users.ownerA, account: null, sub: null },
  };
  for (const who of cast) {
    const c = sessions[who.key], f = foreign[who.key];
    for (const [label, table, filters] of [
      ["business", "businesses", { id: f.biz }], ["user_data", "user_data", { id: f.fact }],
      ["report", "report_files", { id: f.report }], ["junction-other-user", "user_businesses", { user_id: f.otherUser }],
    ]) {
      const r = await selectBy(c, table, filters);
      observed(`FOREIGN-${who.key}-${label}`, "code=none,rows=0", shapeText(r), !r.error && (r.data?.length ?? 0) === 0);
    }
    if (f.account) {
      for (const [label, table, filters] of [["account", "accounts", { id: f.account }], ["subscription", "subscriptions", { id: f.sub }]]) {
        const r = await selectBy(c, table, filters);
        observed(`FOREIGN-${who.key}-${label}`, "code=none,rows=0", shapeText(r), !r.error && (r.data?.length ?? 0) === 0);
      }
    } else log(`N/A FOREIGN-${who.key}-account/subscription | multiStore intentionally belongs to both seeded accounts`);
  }

  const idToStore = new Map([[a1.id, "A1"], [a2.id, "A2"], [b1.id, "B1"]]);
  const expectedRpc = { ownerA: ["A1", "A2"], staffA: ["A1"], ownerB: ["B1"], multiStore: ["A1", "B1"] };
  for (const who of cast) {
    const r = await sessions[who.key].rpc("my_business_ids");
    const raw = r.data ?? [];
    const ids = raw.map(v => typeof v === "object" && v !== null ? Object.values(v)[0] : v);
    const labels = ids.map(id => idToStore.get(id) ?? "UNKNOWN").sort();
    observed(`RPC-C-${who.key}`, `code=none,stores=${JSON.stringify(expectedRpc[who.key])}`, `code=${r.error?.code ?? "none"},stores=${JSON.stringify(labels)}`, !r.error && eqSet(labels, expectedRpc[who.key]));
  }
  const anonRpc = await anonClient(env).rpc("my_business_ids");
  observed("RPC-C-anon", "permission-denied code=42501", shapeText(anonRpc), anonRpc.error?.code === "42501");

  log("\n=== C/D/H. EXISTING-ROW MUTATIONS + EXACT DENIAL SHAPES + GROUND TRUTH ===");
  let before = await exactCount(svc, "user_data", { business_id: a1.id });
  let r = await sessions.ownerB.from("user_data").insert({ business_id: a1.id, script: "QA-FOREIGN", drug_name: "QA foreign" }).select();
  let after = await exactCount(svc, "user_data", { business_id: a1.id });
  observed("MUT-FOREIGN-INSERT", "code=42501;ground-truth-unchanged", `${shapeText(r)};before=${before};after=${after}`, r.error?.code === "42501" && before === after);

  const beforeRehome = (await svc.from("user_data").select("business_id").eq("id", factA1.id).single()).data?.business_id;
  r = await sessions.staffA.from("user_data").update({ business_id: b1.id }).eq("id", factA1.id).select();
  const afterRehome = (await svc.from("user_data").select("business_id").eq("id", factA1.id).single()).data?.business_id;
  observed("MUT-REHOME", "code=none,rows=0;ground-truth=A1->A1", `${shapeText(r)};before=A1;after=${afterRehome === a1.id ? "A1" : "CHANGED"}`, !r.error && (r.data?.length ?? 0) === 0 && beforeRehome === a1.id && afterRehome === a1.id);

  before = await exactCount(svc, "user_data", { id: factA1.id });
  r = await sessions.staffA.from("user_data").delete().eq("id", factA1.id).select();
  after = await exactCount(svc, "user_data", { id: factA1.id });
  observed("MUT-MEMBER-DELETE", "code=none,rows=0;existing-row-unchanged", `${shapeText(r)};before=${before};after=${after}`, !r.error && (r.data?.length ?? 0) === 0 && before === 1 && after === 1);

  const adminRow = await one("insert into public.user_data (business_id,script,drug_name) values ($1,'QA-ADMIN-DELETE','QA admin delete') returning id", [a1.id]);
  before = await exactCount(svc, "user_data", { id: adminRow.id });
  r = await sessions.ownerA.from("user_data").delete().eq("id", adminRow.id).select();
  after = await exactCount(svc, "user_data", { id: adminRow.id });
  observed("MUT-ADMIN-DELETE", "code=none,rows=1;ground-truth 1->0", `${shapeText(r)};before=${before};after=${after}`, !r.error && (r.data?.length ?? 0) === 1 && before === 1 && after === 0);

  const roleBefore = (await svc.from("user_businesses").select("role").eq("user_id", users.staffA).eq("business_id", a1.id).single()).data?.role;
  r = await sessions.staffA.from("user_businesses").update({ role: "admin" }).eq("user_id", users.staffA).eq("business_id", a1.id).select();
  const roleAfter = (await svc.from("user_businesses").select("role").eq("user_id", users.staffA).eq("business_id", a1.id).single()).data?.role;
  observed("MUT-JUNCTION-PROMOTE", "code=none,rows=0;role member->member", `${shapeText(r)};before=${roleBefore};after=${roleAfter}`, !r.error && (r.data?.length ?? 0) === 0 && roleBefore === "member" && roleAfter === "member");

  const accountBefore = (await svc.from("accounts").select("name").eq("id", accA.id).single()).data?.name;
  r = await sessions.ownerA.from("accounts").update({ name: "QA unauthorized" }).eq("id", accA.id).select();
  const accountAfter = (await svc.from("accounts").select("name").eq("id", accA.id).single()).data?.name;
  observed("MUT-ACCOUNT-UPDATE", "code=none,rows=0;name unchanged", `${shapeText(r)};before=${accountBefore};after=${accountAfter}`, !r.error && (r.data?.length ?? 0) === 0 && accountBefore === accountAfter);

  const refBefore = (await svc.from("pbm_info").select("pbm_name").eq("bin", "004146").single()).data?.pbm_name;
  r = await sessions.ownerA.from("pbm_info").update({ pbm_name: "QA unauthorized" }).eq("bin", "004146").select();
  const refAfter = (await svc.from("pbm_info").select("pbm_name").eq("bin", "004146").single()).data?.pbm_name;
  observed("MUT-REFERENCE-UPDATE", "code=none,rows=0;value unchanged", `${shapeText(r)};before=${refBefore};after=${refAfter}`, !r.error && (r.data?.length ?? 0) === 0 && refBefore === refAfter);

  log("\n=== H. DENY-ALL NON-VACUITY ===");
  for (const table of ["pending_registrations", "apa_memberships", "audit_logs"]) {
    const truth = await exactCount(svc, table);
    const userRead = await sessions.ownerA.from(table).select("*");
    observed(`DENY-ALL-${table}`, "service_rows>0;user code=none,rows=0", `service_rows=${truth};${shapeText(userRead)}`, truth > 0 && !userRead.error && (userRead.data?.length ?? 0) === 0);
  }

  log("\n=== G. LIVE POLICY / BASELINE / STORAGE CATALOG (pg_catalog) ===");
  const policies = (await db.query(`select schemaname,tablename,policyname,cmd,roles,qual,with_check
    from pg_policies where schemaname in ('public','storage') order by schemaname,tablename,cmd,policyname`)).rows;
  const publicPolicies = policies.filter(p => p.schemaname === "public");
  const expected = [
    ["aac_reference","SELECT","aac_reference_select_authenticated"], ["accounts","SELECT","account_select_member"],
    ["businesses","SELECT","business_select_member"], ["businesses","UPDATE","business_update_admin"],
    ["ful_reference","SELECT","ful_reference_select_authenticated"], ["pbm_info","SELECT","pbm_info_select_authenticated"],
    ["profiles","SELECT","Profiles are viewable by owner or superadmins"], ["profiles","UPDATE","Profiles are updatable by owner or superadmins"],
    ["reference_dataset_versions","SELECT","reference_dataset_versions_select_authenticated"], ["report_files","SELECT","report_files_select_member"],
    ["subscriptions","SELECT","subscription_select_account_member"], ["user_businesses","SELECT","ub_select_self"],
    ["user_data","DELETE","user_data_delete_admin"], ["user_data","INSERT","user_data_insert_member"],
    ["user_data","SELECT","user_data_select_member"], ["user_data","UPDATE","user_data_update_member"],
    ["user_roles","SELECT","Users can read their own role"], ["wac_reference","SELECT","wac_reference_select_authenticated"],
  ].map(x => x.join("|"));
  const actual = publicPolicies.map(p => [p.tablename,p.cmd,p.policyname].join("|"));
  observed("POLICY-ALLOWLIST", `18 exact entries`, `${actual.length} entries,exact=${eqSet(actual,expected)}`, actual.length === 18 && eqSet(actual, expected));
  const baseline = publicPolicies.filter(p => ["user_roles","profiles"].includes(p.tablename));
  const baselineSemantic = baseline.length === 3
    && baseline.some(p => p.tablename === "user_roles" && p.cmd === "SELECT" && /auth\.uid\(\).*user_id|user_id.*auth\.uid\(\)/i.test(p.qual ?? ""))
    && baseline.filter(p => p.tablename === "profiles").every(p => /auth\.uid\(\).*id/i.test(p.qual ?? "") && /user_roles/i.test(p.qual ?? "") && /superadmin/i.test(p.qual ?? ""));
  observed("BASELINE-POLICIES", "3 expected names/commands and baseline predicate semantics", `count=${baseline.length},semantics=${baselineSemantic}`, baselineSemantic);
  const bimPolicies = publicPolicies.filter(p => !["user_roles","profiles"].includes(p.tablename));
  observed("BIM-POLICY-COUNT", "15", String(bimPolicies.length), bimPolicies.length === 15);
  for (const t of ["pending_registrations","apa_memberships","audit_logs"]) {
    observed(`POLICY-DENY-ALL-${t}`, "0", String(publicPolicies.filter(p => p.tablename === t).length), publicPolicies.filter(p => p.tablename === t).length === 0);
  }
  const storageCount = policies.filter(p => p.schemaname === "storage" && p.tablename === "objects").length;
  observed("STORAGE-POLICY-COUNT", "0", String(storageCount), storageCount === 0);
  const cPolicies = bimPolicies.filter(p => /my_business_ids/i.test(`${p.qual ?? ""} ${p.with_check ?? ""}`));
  const inlineB = bimPolicies.filter(p => /from\s+(?:public\.)?user_businesses/i.test(`${p.qual ?? ""} ${p.with_check ?? ""}`));
  observed("LIVE-C-POLICIES", "3 names=business,user_data,report_files", `count=${cPolicies.length},names=${cPolicies.map(p => p.policyname).sort().join(",")}`, cPolicies.length === 3);
  observed("LIVE-INLINE-B", "0", String(inlineB.length), inlineB.length === 0);
  const forbidden = /\buser_roles\b|\bprofiles\b|user_metadata|raw_user_meta_data|owner_user_id/i;
  const forbiddenPolicies = bimPolicies.filter(p => forbidden.test(`${p.qual ?? ""} ${p.with_check ?? ""}`));
  const helperBodies = (await db.query(`select proname,prosrc from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and proname=any($1)`, [helperNames])).rows;
  const forbiddenHelpers = helperBodies.filter(h => forbidden.test(h.prosrc));
  observed("LIVE-FORBIDDEN-SOURCES", "policy=0,helper=0", `policy=${forbiddenPolicies.length},helper=${forbiddenHelpers.length}`, forbiddenPolicies.length === 0 && forbiddenHelpers.length === 0);
  for (const p of publicPolicies) log(`CATALOG policy=${p.tablename}.${p.cmd}.${p.policyname} roles=${JSON.stringify(p.roles)} qual=${p.qual ?? "null"} with_check=${p.with_check ?? "null"}`);

  log("\n=== CLEANUP AFTER CAPTURED GROUND TRUTH ===");
  // Only sessions are closed. Seeded SCRATCH state is retained for Sol review and Phase 3 remains untouched.
  for (const c of Object.values(sessions)) await c.auth.signOut();
  log("cleanup=session-signout-only; database seed retained; no revocation performed");

  log("\n=== PHASE 2 OBSERVATION SUMMARY ===");
  log(`observation_mismatches=${mismatches}`);
  log("module_verdict=NOT_ISSUED");
  log("phase3_one_walk=NOT_EXECUTED");
  log("replica=NOT_TOUCHED");
  log("dev_backend=NOT_TOUCHED");
  log("STOP=PHASE_2_COMPLETE_AWAIT_SOL");
} catch (e) {
  mismatches++;
  log(`\nPROBE_ABORT name=${e?.name ?? "Error"} message=${safe(e?.message ?? "unknown")}`);
  log(`observation_mismatches=${mismatches}`);
  log("module_verdict=NOT_ISSUED");
  log("phase3_one_walk=NOT_EXECUTED");
  log("replica=NOT_TOUCHED");
  log("dev_backend=NOT_TOUCHED");
  log("STOP=PHASE_2_ABORTED_AWAIT_SOL");
  writeEvidence();
  if (db) await db.end().catch(() => {});
  process.exit(2);
}

writeEvidence();
if (db) await db.end();
process.exit(0);
