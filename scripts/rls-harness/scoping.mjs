#!/usr/bin/env node
// BIM-002 · rls-harness/scoping.mjs — the row-scoping assertion set.
// Promoted from a one-off X3 check into a permanent, named part of the suite
// (Architect ruling 2026-09-01): allow/deny is not isolation — WHICH rows is.
//
// Standing law applied here after instrument defect #4: FAIL CLOSED on auth
// failure, and assert the identity we actually ran as. A silently-failed sign-in
// reads as "0 rows" and would otherwise be scored as perfect isolation.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient } from "./lib/db.mjs";

const env = loadEnv();
const seed = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };

// Expected shape, derived from the seed cast (manager §5.3): 200 user_data rows
// per store · A1+A2 under Account A · B1 under Account B.
const EXPECT = {
  ownerA:     { rows: 400, stores: ["Store A1", "Store A2"], accounts: ["Account A"] },
  staffA:     { rows: 200, stores: ["Store A1"],             accounts: ["Account A"] },
  ownerB:     { rows: 200, stores: ["Store B1"],             accounts: ["Account B"] },
  multiStore: { rows: 400, stores: ["Store A1", "Store B1"], accounts: ["Account A", "Account B"] },
};

let failures = 0;
log("[scoping] row-level tenant scoping — which rows, not just allow/deny");

for (const who of seed.cast) {
  const c = anonClient(env);
  const { data: session, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error) { log(`  FAIL ${who.key}: sign-in failed (${error.message}) — FAILING CLOSED, not scoring as 0 rows`); failures++; continue; }
  // assert the identity we actually ran as (instrument defect #4)
  if (session?.user?.id !== seed.users[who.key]) {
    log(`  FAIL ${who.key}: session identity mismatch — signed in as ${session?.user?.id}, expected ${seed.users[who.key]}`);
    failures++; await c.auth.signOut(); continue;
  }
  const { count } = await c.from("user_data").select("*", { count: "exact", head: true }); // F-2: counted, never inferred
  const { data: biz } = await c.from("businesses").select("pharmacy_name").order("pharmacy_name");
  const { data: acct } = await c.from("accounts").select("name").order("name");
  const e = EXPECT[who.key];
  const gotStores = biz.map((b) => b.pharmacy_name);
  const gotAccts = acct.map((a) => a.name);
  const ok = count === e.rows
    && JSON.stringify(gotStores) === JSON.stringify(e.stores)
    && JSON.stringify(gotAccts) === JSON.stringify(e.accounts);
  if (!ok) failures++;
  log(`  ${ok ? "ok  " : "FAIL"} ${who.key.padEnd(11)} rows=${String(count).padEnd(4)} stores=[${gotStores.join(", ")}] accounts=[${gotAccts.join(", ")}]  expected rows=${e.rows} stores=[${e.stores.join(", ")}] accounts=[${e.accounts.join(", ")}]`);
  await c.auth.signOut();
}

const anon = anonClient(env);
const { count: anonRows } = await anon.from("user_data").select("*", { count: "exact", head: true });
const anonOk = (anonRows ?? 0) === 0;
if (!anonOk) failures++;
log(`  ${anonOk ? "ok  " : "FAIL"} ${"anon".padEnd(11)} rows=${anonRows} (expected 0)`);

log(`[scoping] ${failures === 0 ? "SCOPING EXACT" : `${failures} FAILURE(S)`}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(repoRoot, "agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence", `X4_scoping_${ts}.log`), lines.join("\n") + "\n");
process.exit(failures === 0 ? 0 : 3);
