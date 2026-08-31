#!/usr/bin/env node
// PROTO-06 · rig-harness.mjs — the repeatable attack suite (transferable core).
// Signs in as each seeded identity via the PUBLISHABLE key (real sessions — the
// SQL editor lies about RLS), runs every cell of expectations.json, and writes
// one uniquely-named evidence file per run. Exits non-zero on ANY mismatch.
//
// Denial semantics per operation (PostgREST + RLS):
//   select → 0 rows, no error            insert → explicit RLS error
//   update/delete (.select() returning) → 0 affected rows OR explicit error
// An ALLOW expectation is satisfied by the inverse. Anything else = MISMATCH.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, rigRoot, RIG_PASSWORD } from "../scripts/rig-lib.mjs";

const env = loadEnv();
const exp = JSON.parse(readFileSync(join(rigRoot, "harness", "expectations.json"), "utf8"));
const seedMap = JSON.parse(readFileSync(join(rigRoot, "harness", "seed-map.json"), "utf8"));
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
const evidencePath = join(rigRoot, "evidence", `${exp.phase}_${ts}.log`);
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };

// sanity: harness must NOT be wired to the service role (landmine §7.1)
if (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY === env.SUPABASE_SECRET_KEY) {
  console.error("FAIL-CLOSED: publishable key equals secret key — client wiring is wrong.");
  process.exit(1);
}

// per-table probe payloads (ids from seed-map; foreign refs deliberate where noted)
const payloads = {
  accounts:        { insert: { name: "harness-probe", owner_user_id: seedMap.users.ownerTwo }, targetId: seedMap.accounts.A },
  businesses:      { insert: { account_id: seedMap.accounts.A, name: "harness-probe" }, targetId: seedMap.businesses.s1 },
  user_businesses: { insert: { user_id: seedMap.users.memberOne, business_id: seedMap.businesses.s1, role: "member" }, targetId: null },
  fact_data:       { insert: { business_id: seedMap.businesses.s1, label: "harness-probe", amount: 1 }, targetId: seedMap.factSample.s1 },
  ref_data:        { insert: { code: "HARNESS-PROBE", value: "x" }, targetId: null },
};

function expectationFor(identity, table, op) {
  return exp.overrides?.[identity]?.[table]?.[op] ?? exp.default;
}

async function clientFor(identity) {
  const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  if (identity === "anon") return c;
  const who = seedMap.identities.find((i) => i.key === identity);
  const { error } = await c.auth.signInWithPassword({ email: who.email, password: RIG_PASSWORD });
  if (error) { console.error(`FAIL-CLOSED: sign-in ${identity}: ${error.message}`); process.exit(1); }
  return c;
}

async function probe(c, table, op, chain) {
  const p = payloads[table];
  if (op === "select") {
    const { data, error } = await c.from(table).select("*").limit(5);
    if (error) return { outcome: "DENY", detail: `error: ${error.code || error.message}` };
    return data.length === 0 ? { outcome: "DENY", detail: "0 rows" } : { outcome: "ALLOW", detail: `${data.length} rows VISIBLE` };
  }
  if (op === "insert") {
    const { data, error } = await c.from(table).insert(p.insert).select();
    if (error) return { outcome: "DENY", detail: `error: ${error.code || error.message}` };
    if ((data?.length ?? 0) === 0) return { outcome: "DENY", detail: "no row returned" };
    chain.insertedId = data[0].id; // self-cleaning: update/delete prefer the probe's own row
    return { outcome: "ALLOW", detail: "row INSERTED" };
  }
  const staticTarget = p.targetId ?? "00000000-0000-4000-8000-00000000dead";
  const targetFilter = ["id", chain.insertedId ?? staticTarget];
  const updatePatch = {
    accounts: { name: "harness-upd" }, businesses: { name: "harness-upd" },
    user_businesses: { is_primary: false }, fact_data: { label: "harness-upd" },
    ref_data: { value: "harness-upd" },
  }[table];
  if (op === "update") {
    const { data, error } = await c.from(table).update(updatePatch).eq(...targetFilter).select();
    if (error) return { outcome: "DENY", detail: `error: ${error.code || error.message}` };
    return (data?.length ?? 0) === 0 ? { outcome: "DENY", detail: "0 affected" } : { outcome: "ALLOW", detail: `${data.length} UPDATED` };
  }
  if (op === "delete") {
    const { data, error } = await c.from(table).delete().eq(...targetFilter).select();
    if (error) return { outcome: "DENY", detail: `error: ${error.code || error.message}` };
    return (data?.length ?? 0) === 0 ? { outcome: "DENY", detail: "0 affected" } : { outcome: "ALLOW", detail: `${data.length} DELETED` };
  }
}

log(`[rig-harness] phase=${exp.phase} matrix=${exp.identities.length}×${exp.tables.length}×${exp.operations.length}`);
let mismatches = 0, cells = 0;
for (const identity of exp.identities) {
  const c = await clientFor(identity);
  for (const table of exp.tables) {
    const chain = {}; // per identity×table: insert's row id feeds update/delete
    for (const op of exp.operations) {
      cells++;
      const expected = expectationFor(identity, table, op);
      const { outcome, detail } = await probe(c, table, op, chain);
      const okCell = outcome === expected;
      if (!okCell) mismatches++;
      log(`  ${okCell ? "ok  " : "MISMATCH"} ${identity} × ${table} × ${op} → ${outcome} (${detail}) expected=${expected}`);
    }
  }
  if (identity !== "anon") await c.auth.signOut();
}
log(`[rig-harness] ${cells} cells · ${mismatches} mismatches → ${mismatches === 0 ? "MATRIX GREEN" : "MATRIX RED"}`);
writeFileSync(evidencePath, lines.join("\n") + "\n");
console.log(`[rig-harness] evidence → ${evidencePath}`);
process.exit(mismatches === 0 ? 0 : 3);
