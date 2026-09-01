#!/usr/bin/env node
// BIM-002 · rls-harness/revocation.mjs — R-C: live-session junction revocation.
// Closes Proto 06 N-3, which was "expected immediate, never proven".
//
// The question that matters operationally: when a pharmacy offboards someone,
// does their access die NOW, or only when their token happens to refresh?
// Membership is looked up live from the junction, so it should be immediate —
// but expected is not proven, and an hour-long stale window on PHI is not a
// detail. ONE session, signed in ONCE, never refreshed, queried across the
// revocation.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient, serviceClient } from "./lib/db.mjs";

const env = loadEnv();
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const svc = serviceClient(env);
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
let failures = 0;
const check = (cond, ok, bad) => { if (cond) log(`  ok   ${ok}`); else { log(`  FAIL ${bad}`); failures++; } };

log("[revocation] R-C — junction revocation against a LIVE session (no token refresh)\n");

// ── sign in ONCE. This session object is never re-authenticated below. ──
const c = anonClient(env);
const who = m.cast.find((x) => x.key === "multiStore");
const { data: signIn, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
if (error) { console.error(`FAIL-CLOSED: sign-in multiStore: ${error.message}`); process.exit(1); }
if (signIn?.user?.id !== m.users.multiStore) { console.error("FAIL-CLOSED: identity mismatch"); process.exit(1); }
const tokenBefore = signIn.session.access_token;
log(`  signed in as multiStore once; access token captured (fingerprint ${tokenBefore.slice(-12)})`);

// ── step 1: baseline visibility across both stores ──
const rowsOf = async (biz) => (await c.from("user_data").select("*", { count: "exact", head: true }).eq("business_id", biz)).count;
const a1Before = await rowsOf(m.businesses.a1);
const b1Before = await rowsOf(m.businesses.b1);
const storesBefore = (await c.from("businesses").select("pharmacy_name").order("pharmacy_name")).data.map((b) => b.pharmacy_name);
log(`  step 1 — before revocation: A1=${a1Before} rows · B1=${b1Before} rows · stores=[${storesBefore.join(", ")}]`);
check(a1Before === 200 && b1Before === 200, "sees both stores' rows (200 + 200)", `expected 200/200, got ${a1Before}/${b1Before}`);

// ── step 2: service role revokes the (multiStore, B1) membership ──
const { error: delErr } = await svc.from("user_businesses").delete()
  .eq("user_id", m.users.multiStore).eq("business_id", m.businesses.b1);
if (delErr) { console.error(`FAIL: revoke failed — ${delErr.message}`); process.exit(2); }
const gtAfterRevoke = (await svc.from("user_businesses").select("business_id")
  .eq("user_id", m.users.multiStore)).data.map((r) => r.business_id);
log(`  step 2 — service role deleted (multiStore, B1). Ground truth: multiStore now holds ${gtAfterRevoke.length} junction row(s)`);
check(gtAfterRevoke.length === 1 && gtAfterRevoke[0] === m.businesses.a1, "junction ground truth: A1 only", "junction ground truth wrong after revoke");

// ── step 3: SAME session, no refresh, re-query ──
const tokenNow = (await c.auth.getSession()).data.session.access_token;
check(tokenNow === tokenBefore, "access token is byte-identical — no refresh occurred between the queries", "token changed; the test would prove nothing");
const a1After = await rowsOf(m.businesses.a1);
const b1After = await rowsOf(m.businesses.b1);
const storesAfter = (await c.from("businesses").select("pharmacy_name").order("pharmacy_name")).data.map((b) => b.pharmacy_name);
log(`  step 3 — after revocation, SAME session: A1=${a1After} rows · B1=${b1After} rows · stores=[${storesAfter.join(", ")}]`);
check(b1After === 0, "B1 rows are gone IMMEDIATELY (0) — revocation is not deferred to token refresh", `B1 still visible: ${b1After} rows — STALE ACCESS WINDOW`);
check(a1After === 200, "A1 rows remain (200) — revocation was surgical, not a blanket lockout", `A1 unexpectedly changed: ${a1After}`);
check(storesAfter.length === 1 && storesAfter[0] === "Store A1", "store list narrowed to A1 only", `store list wrong: [${storesAfter.join(", ")}]`);

// ── step 4: restore, so the suite is idempotent ──
await svc.from("user_businesses").insert({ user_id: m.users.multiStore, business_id: m.businesses.b1, role: "member", is_primary: false });
const restored = (await svc.from("user_businesses").select("*", { count: "exact", head: true })).count;
const b1Restored = await rowsOf(m.businesses.b1);
log(`  step 4 — membership restored (junction back to ${restored} rows); same session now sees B1=${b1Restored} rows again`);
check(restored === 6, "junction restored to its seeded shape", `junction is ${restored} rows, expected 6`);
check(b1Restored === 200, "re-granting membership is ALSO immediate on the same session", `B1=${b1Restored} after restore`);
await c.auth.signOut();

log(`\n[revocation] ${failures === 0 ? "R-C PROVEN — revocation and re-grant both take effect immediately, with no token refresh" : `${failures} FAILURE(S)`}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(repoRoot, "agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence", `X4_revocation_${ts}.log`), lines.join("\n") + "\n");
process.exit(failures === 0 ? 0 : 3);
