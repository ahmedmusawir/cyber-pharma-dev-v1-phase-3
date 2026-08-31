#!/usr/bin/env node
// PROTO-06 · R3 attack battery — every case EXPECTED DENIED, each with evidence.
// Real publishable-key sessions (never service role). A single ALLOW = breach.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, rigRoot, RIG_PASSWORD } from "../scripts/rig-lib.mjs";

const env = loadEnv();
const seed = JSON.parse(readFileSync(join(rigRoot, "harness", "seed-map.json"), "utf8"));
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
let breaches = 0, cases = 0;

async function sessionFor(key) {
  const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } });
  if (key !== "anon") {
    const who = seed.identities.find((i) => i.key === key);
    const { error } = await c.auth.signInWithPassword({ email: who.email, password: RIG_PASSWORD });
    if (error) { console.error(`sign-in ${key}: ${error.message}`); process.exit(1); }
  }
  return c;
}

// a case passes iff it was DENIED (error, or 0 rows/affected)
function verdict(label, { data, error }) {
  cases++;
  const denied = !!error || (data?.length ?? 0) === 0;
  if (!denied) { breaches++; log(`  BREACH ${label} → ${data.length} rows/affected VISIBLE`); }
  else log(`  ok(denied) ${label} → ${error ? `error ${error.code || error.message}` : "0 rows/affected"}`);
}

log("[R3] attack battery — all cases expected DENIED\n");

// ── Attack 1: staff-A (memberOne is B-side; use adminOne@S3 as the attacker vs A-side S1) ──
// Foreign business_id across ALL write ops: adminOne (member of S3/account B only) targets S1 (account A).
{
  const a = await sessionFor("adminOne");
  log("Attack 1 — cross-account write with foreign business_id (adminOne@S3 → S1/accountA):");
  verdict("A1.insert fact_data business_id=S1", await a.from("fact_data").insert({ business_id: seed.businesses.s1, label: "attack", amount: 1 }).select());
  verdict("A1.update fact S1 row by id", await a.from("fact_data").update({ label: "attack" }).eq("id", seed.factSample.s1).select());
  verdict("A1.delete fact S1 row by id", await a.from("fact_data").delete().eq("id", seed.factSample.s1).select());
  verdict("A1.select fact S1 row by direct id", await a.from("fact_data").select("*").eq("id", seed.factSample.s1));
  await a.auth.signOut();
}

// ── Attack 2: tampered role value in the junction (privilege escalation attempt) ──
// memberOne tries to promote self to admin on S3, and to insert a fresh admin membership.
{
  const m = await sessionFor("memberOne");
  log("\nAttack 2 — junction role tampering (memberOne self-promote on S3):");
  verdict("A2.update own junction role→admin", await m.from("user_businesses").update({ role: "admin" }).eq("user_id", seed.users.memberOne).eq("business_id", seed.businesses.s3).select());
  verdict("A2.insert self admin membership on S1", await m.from("user_businesses").insert({ user_id: seed.users.memberOne, business_id: seed.businesses.s1, role: "admin" }).select());
  verdict("A2.delete own junction row", await m.from("user_businesses").delete().eq("user_id", seed.users.memberOne).select());
  await m.auth.signOut();
}

// ── Attack 3: cross-account probes by direct id (read someone else's tenant) ──
// ownerTwo is account A (S1,S2); probe account B's S3 objects by id.
{
  const o = await sessionFor("ownerTwo");
  log("\nAttack 3 — cross-account read by direct id (ownerTwo/accountA → accountB objects):");
  verdict("A3.select business S3 by id", await o.from("businesses").select("*").eq("id", seed.businesses.s3));
  verdict("A3.select account B by id", await o.from("accounts").select("*").eq("id", seed.accounts.B));
  verdict("A3.select fact S3 row by id", await o.from("fact_data").select("*").eq("id", seed.factSample.s3));
  verdict("A3.update business S3 by id", await o.from("businesses").update({ name: "attack" }).eq("id", seed.businesses.s3).select());
  verdict("A3.select memberOne junction row", await o.from("user_businesses").select("*").eq("user_id", seed.users.memberOne));
  await o.auth.signOut();
}

// ── Attack 4: anon sweep — every table × every operation, unauthenticated ──
{
  const an = await sessionFor("anon");
  log("\nAttack 4 — anonymous sweep (no session), every table × every op:");
  const probeRow = {
    accounts: { name: "x", owner_user_id: seed.users.ownerTwo }, businesses: { account_id: seed.accounts.A, name: "x" },
    user_businesses: { user_id: seed.users.ownerTwo, business_id: seed.businesses.s1, role: "member" },
    fact_data: { business_id: seed.businesses.s1, label: "x", amount: 1 }, ref_data: { code: "X", value: "x" },
  };
  for (const t of ["accounts", "businesses", "user_businesses", "fact_data", "ref_data"]) {
    verdict(`A4.${t}.select`, await an.from(t).select("*").limit(3));
    verdict(`A4.${t}.insert`, await an.from(t).insert(probeRow[t]).select());
    verdict(`A4.${t}.update`, await an.from(t).update(t === "ref_data" ? { value: "x" } : { }).eq("id", "00000000-0000-4000-8000-00000000dead").select());
    verdict(`A4.${t}.delete`, await an.from(t).delete().eq("id", "00000000-0000-4000-8000-00000000dead").select());
  }
}

log(`\n[R3] ${cases} attack cases · ${breaches} breaches → ${breaches === 0 ? "ALL DENIED — ISOLATION HOLDS" : "ISOLATION BREACHED"}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(rigRoot, "evidence", `R3_attack_battery_${ts}.log`), lines.join("\n") + "\n");
console.log(`[R3] evidence → proto-06/evidence/R3_attack_battery_${ts}.log`);
process.exit(breaches === 0 ? 0 : 3);
