#!/usr/bin/env node
// PROTO-06 · rig-seed.mjs — identities + miniature data (service-role path).
// 2 accounts · 3 stores · 3 identities (OwnerTwo admin@S1+S2, AdminOne admin@S3,
// MemberOne member@S3) · 6,000 synthetic fact rows · 50 ref rows.
// Writes proto-06/harness/seed-map.json (ids only — no secrets).
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, pgClient, rigRoot, RIG_PASSWORD } from "./rig-lib.mjs";

const env = loadEnv();
const IDENTITIES = [
  { key: "ownerTwo", email: "rig-ownertwo@proto06.local" },
  { key: "adminOne", email: "rig-adminone@proto06.local" },
  { key: "memberOne", email: "rig-memberone@proto06.local" },
];

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = {};
for (const who of IDENTITIES) {
  // idempotent-ish: try create; on "already registered" find by listUsers
  const { data, error } = await admin.auth.admin.createUser({
    email: who.email, password: RIG_PASSWORD, email_confirm: true,
  });
  if (error) {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
    const existing = list?.users?.find((u) => u.email === who.email);
    if (!existing) { console.error(`FAIL create ${who.key}: ${error.message}`); process.exit(2); }
    users[who.key] = existing.id;
    console.log(`  ok  ${who.key} (existing)`);
  } else {
    users[who.key] = data.user.id;
    console.log(`  ok  ${who.key} created`);
  }
}

const db = await pgClient(env);
const one = async (sql, params) => (await db.query(sql, params)).rows[0];

const acctA = await one(`insert into public.accounts (name, owner_user_id) values ('Rig Account A', $1) returning id`, [users.ownerTwo]);
const acctB = await one(`insert into public.accounts (name, owner_user_id) values ('Rig Account B', $1) returning id`, [users.adminOne]);
const s1 = await one(`insert into public.businesses (account_id, name) values ($1, 'Store S1') returning id`, [acctA.id]);
const s2 = await one(`insert into public.businesses (account_id, name) values ($1, 'Store S2') returning id`, [acctA.id]);
const s3 = await one(`insert into public.businesses (account_id, name) values ($1, 'Store S3') returning id`, [acctB.id]);
console.log("  ok  2 accounts, 3 stores");

await db.query(
  `insert into public.user_businesses (user_id, business_id, role, is_primary) values
   ($1,$4,'admin',true),($1,$5,'admin',false),($2,$6,'admin',true),($3,$6,'member',true)`,
  [users.ownerTwo, users.adminOne, users.memberOne, s1.id, s2.id, s3.id]
);
console.log("  ok  4 junction rows (OwnerTwo admin@S1+S2 · AdminOne admin@S3 · MemberOne member@S3)");

const stores = [s1.id, s2.id, s3.id];
for (const [i, biz] of stores.entries()) {
  const values = Array.from({ length: 2000 }, (_, n) => `('${biz}', 'rig-row-${i}-${n}', ${(n % 500) + 0.42})`).join(",");
  await db.query(`insert into public.fact_data (business_id, label, amount) values ${values}`);
}
const refValues = Array.from({ length: 50 }, (_, n) => `('CODE-${String(n).padStart(3, "0")}', 'ref-value-${n}')`).join(",");
await db.query(`insert into public.ref_data (code, value) values ${refValues}`);
const counts = await db.query(`select (select count(*) from public.fact_data) as fact, (select count(*) from public.ref_data) as ref`);
console.log(`  ok  seeded fact_data=${counts.rows[0].fact} ref_data=${counts.rows[0].ref}`);

const factIds = {};
for (const [label, biz] of [["s1", s1.id], ["s2", s2.id], ["s3", s3.id]]) {
  factIds[label] = (await one(`select id from public.fact_data where business_id=$1 limit 1`, [biz])).id;
}

writeFileSync(join(rigRoot, "harness", "seed-map.json"), JSON.stringify({
  users, accounts: { A: acctA.id, B: acctB.id },
  businesses: { s1: s1.id, s2: s2.id, s3: s3.id },
  factSample: factIds,
  identities: IDENTITIES.map((i) => ({ key: i.key, email: i.email })),
}, null, 2));
console.log("[rig-seed] complete — seed-map.json written (ids only).");
await db.end();
