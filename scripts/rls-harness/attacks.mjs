#!/usr/bin/env node
// BIM-002 · rls-harness/attacks.mjs — the attack battery.
// Every case is EXPECTED DENIED, and every MUTATION denial is confirmed against
// service-role ground truth (Proto 06 F-4 corollary: "0 affected" is not proof
// that nothing persisted — the database may simply have declined to tell you).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient, serviceClient } from "./lib/db.mjs";
import { verdictFromResult, ALLOW } from "./lib/verdict.mjs";

const env = loadEnv();
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const svc = serviceClient(env);
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
let breaches = 0, gtMismatches = 0, cases = 0;

const sessions = {};
for (const who of m.cast) {
  const c = anonClient(env);
  const { data, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error) { console.error(`FAIL-CLOSED: sign-in ${who.key}: ${error.message}`); process.exit(1); }
  if (data?.user?.id !== m.users[who.key]) { console.error(`FAIL-CLOSED: identity mismatch for ${who.key}`); process.exit(1); }
  sessions[who.key] = c;
}
sessions.anon = anonClient(env);

// A case: run it (must be DENIED), then ask the service role whether the world
// actually changed. `truth` returns a value; `truthWant` is what it must still be.
async function attack({ id, desc, identity, run, truth, truthWant }) {
  cases++;
  const before = truth ? await truth() : null;
  const v = verdictFromResult(await run(sessions[identity]));
  const denied = v.outcome !== ALLOW;
  if (!denied) breaches++;
  let gtLine = "";
  if (truth) {
    const after = await truth();
    const intact = JSON.stringify(after) === JSON.stringify(truthWant);
    if (!intact) gtMismatches++;
    gtLine = ` · ground truth: ${JSON.stringify(after)} ${intact ? "UNCHANGED ✓" : `MUTATED ✗ (wanted ${JSON.stringify(truthWant)}, was ${JSON.stringify(before)})`}`;
  }
  log(`  ${denied && !gtLine.includes("✗") ? "ok(denied)" : "BREACH    "} ${id} ${desc} → ${v.outcome} (${v.detail})${gtLine}`);
}

const factA1Drug = async () => (await svc.from("user_data").select("drug_name").eq("id", m.samples.factA1).single()).data?.drug_name;
const factA1Biz  = async () => (await svc.from("user_data").select("business_id").eq("id", m.samples.factA1).single()).data?.business_id;
const factA1Count = async () => (await svc.from("user_data").select("*", { count: "exact", head: true }).eq("business_id", m.businesses.a1)).count;
const staffARole = async () => (await svc.from("user_businesses").select("role").eq("user_id", m.users.staffA).eq("business_id", m.businesses.a1).single()).data?.role;
const acctACount = async () => (await svc.from("accounts").select("*", { count: "exact", head: true }).eq("id", m.accounts.A)).count;
const junctionCount = async () => (await svc.from("user_businesses").select("*", { count: "exact", head: true })).count;

const seededDrug = await factA1Drug();
const seededA1Rows = await factA1Count();

log("[attacks] every case expected DENIED; every mutation confirmed against service-role ground truth\n");

log("A1 — cross-account reads by direct id (ownerB is account B only):");
await attack({ id: "A1.1", desc: "ownerB reads ACCOUNT A by id", identity: "ownerB",
  run: (c) => c.from("accounts").select("*").eq("id", m.accounts.A) });
await attack({ id: "A1.2", desc: "ownerB reads SUBSCRIPTION A by id", identity: "ownerB",
  run: (c) => c.from("subscriptions").select("*").eq("id", m.samples.subscriptionA) });
await attack({ id: "A1.3", desc: "ownerB reads user_data A1 row by id", identity: "ownerB",
  run: (c) => c.from("user_data").select("*").eq("id", m.samples.factA1) });
await attack({ id: "A1.4", desc: "ownerB reads business A1 by id", identity: "ownerB",
  run: (c) => c.from("businesses").select("*").eq("id", m.businesses.a1) });
await attack({ id: "A1.5", desc: "ownerB reads report_files A1 by id", identity: "ownerB",
  run: (c) => c.from("report_files").select("*").eq("id", m.samples.reportA1) });

log("\nA2 — client-supplied foreign business_id (the 'never from the client' law, enforced by the DB):");
await attack({ id: "A2.1", desc: "ownerB INSERTs user_data with business_id = A1", identity: "ownerB",
  run: (c) => c.from("user_data").insert({ business_id: m.businesses.a1, script: "ATTACK", drug_name: "attack" }).select(),
  truth: factA1Count, truthWant: seededA1Rows });
await attack({ id: "A2.2", desc: "ownerB UPDATEs an A1 row by id", identity: "ownerB",
  run: (c) => c.from("user_data").update({ drug_name: "attacked" }).eq("id", m.samples.factA1).select(),
  truth: factA1Drug, truthWant: seededDrug });
await attack({ id: "A2.3", desc: "ownerB DELETEs an A1 row by id", identity: "ownerB",
  run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(),
  truth: factA1Count, truthWant: seededA1Rows });

log("\nA3 — RE-HOME: staffA (legitimate A1 member) tries to move an A1 row into B1 (WITH CHECK):");
await attack({ id: "A3.1", desc: "staffA UPDATEs own-tenant row setting business_id = B1", identity: "staffA",
  run: (c) => c.from("user_data").update({ business_id: m.businesses.b1 }).eq("id", m.samples.factA1).select(),
  truth: factA1Biz, truthWant: m.businesses.a1 });

log("\nA4 — DELETE by a member (role gate: DELETE is is_admin_of, not is_member_of):");
await attack({ id: "A4.1", desc: "staffA (member of A1) DELETEs an A1 row", identity: "staffA",
  run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(),
  truth: factA1Count, truthWant: seededA1Rows });
await attack({ id: "A4.2", desc: "multiStore (member of A1) DELETEs an A1 row", identity: "multiStore",
  run: (c) => c.from("user_data").delete().eq("id", m.samples.factA1).select(),
  truth: factA1Count, truthWant: seededA1Rows });

log("\nA5 — junction role tampering (privilege escalation — structurally impossible: no write policy):");
await attack({ id: "A5.1", desc: "staffA promotes own junction role to admin", identity: "staffA",
  run: (c) => c.from("user_businesses").update({ role: "admin" }).eq("user_id", m.users.staffA).eq("business_id", m.businesses.a1).select(),
  truth: staffARole, truthWant: "member" });
await attack({ id: "A5.2", desc: "staffA INSERTs a new admin membership on B1", identity: "staffA",
  run: (c) => c.from("user_businesses").insert({ user_id: m.users.staffA, business_id: m.businesses.b1, role: "admin" }).select(),
  truth: junctionCount, truthWant: 6 });
await attack({ id: "A5.3", desc: "staffA DELETEs own junction row (self-offboard)", identity: "staffA",
  run: (c) => c.from("user_businesses").delete().eq("user_id", m.users.staffA).select(),
  truth: junctionCount, truthWant: 6 });
await attack({ id: "A5.4", desc: "staffA reads ANOTHER user's junction row", identity: "staffA",
  run: (c) => c.from("user_businesses").select("*").eq("user_id", m.users.ownerB) });

log("\nA6 — accounts are read-only for every app role (R-A):");
await attack({ id: "A6.1", desc: "ownerA INSERTs an account", identity: "ownerA",
  run: (c) => c.from("accounts").insert({ name: "attack-acct", owner_user_id: m.users.ownerA }).select(),
  truth: acctACount, truthWant: 1 });
await attack({ id: "A6.2", desc: "ownerA UPDATEs own account (owner_user_id must NOT grant writes)", identity: "ownerA",
  run: (c) => c.from("accounts").update({ name: "attacked" }).eq("id", m.accounts.A).select(),
  truth: async () => (await svc.from("accounts").select("name").eq("id", m.accounts.A).single()).data?.name, truthWant: "Account A" });
await attack({ id: "A6.3", desc: "ownerA DELETEs own account", identity: "ownerA",
  run: (c) => c.from("accounts").delete().eq("id", m.accounts.A).select(),
  truth: acctACount, truthWant: 1 });

log("\nA7 — reference tables are read-only for authenticated (locked by omission):");
await attack({ id: "A7.1", desc: "ownerA INSERTs into aac_reference", identity: "ownerA",
  run: (c) => c.from("aac_reference").insert({ ndc: "99999999999", aac_date: "2026-09-01", aac: 1 }).select() });
await attack({ id: "A7.2", desc: "ownerA UPDATEs pbm_info", identity: "ownerA",
  run: (c) => c.from("pbm_info").update({ pbm_name: "attacked" }).eq("bin", "004146").select(),
  truth: async () => (await svc.from("pbm_info").select("pbm_name").eq("bin", "004146").single()).data?.pbm_name, truthWant: "Seed PBM" });

log("\nA8 — deny-all tables stay dark to everyone (rows EXIST — a 0 here means refused, not empty):");
for (const [i, t] of ["apa_memberships", "pending_registrations", "audit_logs"].entries()) {
  const n = (await svc.from(t).select("*", { count: "exact", head: true })).count;
  await attack({ id: `A8.${i + 1}`, desc: `ownerA reads ${t} (service role sees ${n} row(s))`, identity: "ownerA",
    run: (c) => c.from(t).select("*") });
}

log("\nA9 — anonymous, no session:");
for (const [i, t] of ["accounts", "businesses", "user_businesses", "user_data", "subscriptions"].entries()) {
  await attack({ id: `A9.${i + 1}`, desc: `anon reads ${t}`, identity: "anon", run: (c) => c.from(t).select("*") });
}

log(`\n[attacks] ${cases} cases · ${breaches} breach(es) · ${gtMismatches} ground-truth mismatch(es) → ${breaches === 0 && gtMismatches === 0 ? "ALL DENIED, NOTHING PERSISTED" : "FAILURE"}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(repoRoot, "agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence", `X4_attacks_${ts}.log`), lines.join("\n") + "\n");
process.exit(breaches === 0 && gtMismatches === 0 ? 0 : 3);
