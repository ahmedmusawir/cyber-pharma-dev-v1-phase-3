#!/usr/bin/env node
// BIM-002 PRE-Q Phase 3 controlled One-Walk rerun controller (QA only).
// Cody runs this in Terminal A after an explicit execution release.
// It never mutates membership. Tony performs the separately guarded actions.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const evidencePath = process.argv[2];
if (!evidencePath) throw new Error("unique evidence path argument required");
if (fs.existsSync(evidencePath)) throw new Error("evidence path already exists; refusing overwrite");

const AUTH_REFRESH_MARGIN_MS = 90_000;
const MIN_BEYOND_MARGIN_MS = 15 * 60_000;
const MIN_ARM_LIFETIME_MS = AUTH_REFRESH_MARGIN_MS + MIN_BEYOND_MARGIN_MS;
const MIN_PRE_TO_POST_WINDOW_SECONDS = 300;
const MAX_PRE_TO_POST_WINDOW_SECONDS = 600;

function assertScratchSelection() {
  const head = fs.readFileSync(path.join(root, ".git/HEAD"), "utf8").trim();
  const sha = fs.readFileSync(path.join(root, ".git/refs/heads/qa/bim002"), "utf8").trim();
  if (head !== "ref: refs/heads/qa/bim002" || sha !== "53f1ac0004f40e4df9e403188382b16afb92899f") {
    throw new Error("branch/HEAD no longer matches PRE-Q specimen");
  }
  if (process.env.RLS_HARNESS_PREFIX || Object.keys(process.env).some(k => k.startsWith("RLS_REPLICA_"))) {
    throw new Error("prefix/replica override active; refusing One-Walk");
  }
  const names = new Set(fs.readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/).map(l => (l.match(/^([A-Z_0-9]+)=/) || [])[1]).filter(Boolean));
  const defaults = ["RLS_HARNESS_DB_URL", "RLS_HARNESS_SUPABASE_URL", "RLS_HARNESS_PUBLISHABLE_KEY", "RLS_HARNESS_SECRET_KEY"];
  const fallbacks = ["PROTO06_DB_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"];
  if (!defaults.every(k => !names.has(k)) || !fallbacks.every(k => names.has(k))) {
    throw new Error("A-1 SCRATCH key-name selection is ambiguous");
  }
}

function jwtExpiryMs(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("access token is not a three-part JWT");
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    throw new Error("JWT exp decode failed");
  }
  if (!Number.isFinite(payload?.exp)) throw new Error("JWT exp claim missing or invalid");
  return payload.exp * 1000;
}

assertScratchSelection();
const { loadEnv, CAST_PASSWORD } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/env.mjs")));
const { pgClient, serviceClient } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/db.mjs")));
const env = loadEnv();
const db = await pgClient(env);
const svc = serviceClient(env);
const lines = [];
let client;
let clientAnchor;
let authSubscription;
let rl;
let tokenRefreshSeen = false;
let releaseRefreshSignal;
const refreshSignal = new Promise(resolve => { releaseRefreshSignal = resolve; });
const log = (s = "") => { lines.push(s); console.log(s); };
const save = () => { fs.mkdirSync(path.dirname(evidencePath), { recursive: true }); fs.writeFileSync(evidencePath, lines.join("\n") + "\n"); };
const check = (id, expected, actual, ok) => {
  log(`${ok ? "MATCH" : "MISMATCH"} ${id} | expected=${expected} | observed=${actual}`);
  if (!ok) throw new Error(`One-Walk assertion failed: ${id}`);
};
const guarded = async promise => {
  const outcome = await Promise.race([
    Promise.resolve(promise).then(value => ({ kind: "value", value }), error => ({ kind: "error", error })),
    refreshSignal.then(() => ({ kind: "refresh" })),
  ]);
  if (outcome.kind === "refresh") throw new Error("TOKEN_REFRESHED event observed");
  if (outcome.kind === "error") throw outcome.error;
  return outcome.value;
};
const assertNoRefresh = label => check(label, "false", String(tokenRefreshSeen), !tokenRefreshSeen);
const remainingMs = expiryMs => expiryMs - Date.now();
const remainingSeconds = expiryMs => Math.floor(remainingMs(expiryMs) / 1000);
const assertOutsideRefreshMargin = (label, expiryMs) => {
  const seconds = remainingSeconds(expiryMs);
  check(label, ">90s", `${seconds}s`, remainingMs(expiryMs) > AUTH_REFRESH_MARGIN_MS);
};
const exactCount = async (c, table, filters = {}) => {
  let q = c.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const r = await guarded(q);
  if (r.error) throw new Error(`count ${table} failed code=${r.error.code ?? "unknown"}`);
  return r.count ?? 0;
};
const questionWithDeadline = async (prompt, deadlineAt, failureMessage) => {
  const waitMs = deadlineAt - Date.now();
  if (waitMs <= 0) throw new Error(failureMessage);
  let timer;
  try {
    return await guarded(Promise.race([
      rl.question(prompt),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(failureMessage)), waitMs); }),
    ]));
  } finally {
    if (timer) clearTimeout(timer);
  }
};

try {
  log("BIM-002 PRE-Q PHASE 3 — CONTROLLED ONE-WALK RERUN");
  log("INTENDED TARGET: SCRATCH");
  log("resolver_signal=[env] A-1 fallback in use");
  log("credential_or_token_value_recorded=false");
  log("AUTH_OPTIONS autoRefreshToken=false persistSession=false detectSessionInUrl=false");
  log("AUTH_REFRESH_MARGIN_SECONDS=90");
  log("MINIMUM_ARM_LIFETIME_SECONDS=990");
  log("POST_WINDOW_RULE=min(600s,remaining_at_arm-900s-90s)");

  const userRows = (await db.query("select id from auth.users where email='bim002-multistore@rls.local'")).rows;
  const bizRows = (await db.query("select id,pharmacy_name from public.businesses where pharmacy_name in ('Store A1','Store B1') order by pharmacy_name")).rows;
  check("PRE-IDENTITY-ROW", "1", String(userRows.length), userRows.length === 1);
  check("PRE-BUSINESS-ROWS", "A1,B1", bizRows.map(r => r.pharmacy_name.replace("Store ", "")).join(","), bizRows.length === 2);
  const uid = userRows[0].id;
  const ids = Object.fromEntries(bizRows.map(r => [r.pharmacy_name, r.id]));

  client = createClient(env.SUPABASE_URL, env.PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  clientAnchor = client;
  await client.auth.stopAutoRefresh();
  log("AUTH_STOP_AUTO_REFRESH_CALLED=true");

  const authListener = client.auth.onAuthStateChange(event => {
    log(`AUTH_EVENT=${event}`);
    if (event === "TOKEN_REFRESHED") {
      tokenRefreshSeen = true;
      log("ABORT_SIGNAL=TOKEN_REFRESHED");
      save();
      releaseRefreshSignal();
    }
  });
  authSubscription = authListener.data.subscription;
  log("AUTH_EVENT_LISTENER_REGISTERED_BEFORE_SIGN_IN=true");

  const { data: signIn, error: signInError } = await guarded(client.auth.signInWithPassword({
    email: "bim002-multistore@rls.local", password: CAST_PASSWORD,
  }));
  check("PRE-SIGN-IN", "code=none", `code=${signInError?.code ?? "none"}`, !signInError);
  check("PRE-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${signIn?.user?.id === uid}`, signIn?.user?.id === uid);
  assertNoRefresh("PRE-NO-TOKEN-REFRESH");
  const originalToken = signIn.session.access_token;
  const tokenExpiryMs = jwtExpiryMs(originalToken);
  log("TOKEN_CAPTURED_IN_MEMORY_ONLY=true");

  const visibleBefore = await guarded(client.from("businesses").select("pharmacy_name").order("pharmacy_name"));
  const namesBefore = (visibleBefore.data ?? []).map(r => r.pharmacy_name);
  const a1Before = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
  const b1Before = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
  const a1TruthBefore = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
  const b1TruthBefore = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
  check("PRE-VISIBLE-BUSINESSES", "Store A1,Store B1", namesBefore.join(","), !visibleBefore.error && JSON.stringify(namesBefore) === JSON.stringify(["Store A1", "Store B1"]));
  check("PRE-USER-DATA", "A1=200,B1=200", `A1=${a1Before},B1=${b1Before}`, a1Before === 200 && b1Before === 200);
  check("PRE-JUNCTION-TRUTH", "A1=1,B1=1", `A1=${a1TruthBefore},B1=${b1TruthBefore}`, a1TruthBefore === 1 && b1TruthBefore === 1);
  assertNoRefresh("PRE-QUERY-NO-TOKEN-REFRESH");

  const armRemainingMs = remainingMs(tokenExpiryMs);
  const armRemainingSeconds = Math.floor(armRemainingMs / 1000);
  log(`TOKEN_LIFETIME_AT_ARM_SECONDS=${armRemainingSeconds}`);
  log(`TOKEN_LIFETIME_AT_ARM_MINUTES=${Math.floor(armRemainingSeconds / 60)}`);
  check("PRE-LIFETIME-ARM-GUARD", ">=990s", `${armRemainingSeconds}s`, armRemainingMs >= MIN_ARM_LIFETIME_MS);
  const allowedPostWindowSeconds = Math.min(
    MAX_PRE_TO_POST_WINDOW_SECONDS,
    Math.floor((armRemainingMs - MIN_BEYOND_MARGIN_MS - AUTH_REFRESH_MARGIN_MS) / 1000),
  );
  log(`ALLOWED_POST_WINDOW_SECONDS=${allowedPostWindowSeconds}`);
  check(
    "PRE-ALLOWED-POST-WINDOW-GUARD",
    ">=300s",
    `${allowedPostWindowSeconds}s`,
    allowedPostWindowSeconds >= MIN_PRE_TO_POST_WINDOW_SECONDS,
  );
  const preStateCapturedAt = Date.now();
  const postDeadlineAt = preStateCapturedAt + allowedPostWindowSeconds * 1000;
  log("PRE_STATE_CAPTURED=true");
  log("POST_WINDOW_ARMED=true");
  log("STOP_POINT_BEFORE_REVOCATION=true");
  log(`WAITING_FOR_TONY=run guarded revoke in Terminal B; then type POST here within ${allowedPostWindowSeconds} seconds`);
  save();

  rl = readline.createInterface({ input, output });
  const postSignal = (await questionWithDeadline(
    "Tony complete? Type POST exactly: ",
    postDeadlineAt,
    "dynamic PRE-to-POST deadline exceeded",
  )).trim();
  if (postSignal !== "POST") throw new Error("POST signal not received; no post-state query run");

  const postElapsedMs = Date.now() - preStateCapturedAt;
  log("\n=== PRE-POST CONTINUITY GUARDS ===");
  check(
    "POST-DEADLINE",
    `<=${allowedPostWindowSeconds}s`,
    `${(postElapsedMs / 1000).toFixed(3)}s`,
    postElapsedMs <= allowedPostWindowSeconds * 1000,
  );
  assertOutsideRefreshMargin("POST-OUTSIDE-REFRESH-MARGIN", tokenExpiryMs);
  assertNoRefresh("POST-PRECHECK-NO-TOKEN-REFRESH");
  check("POST-SAME-CLIENT-OBJECT", "true", String(client === clientAnchor), client === clientAnchor);

  log("\n=== SAME SESSION AFTER TONY REVOCATION ===");
  const sessionResult = await guarded(client.auth.getSession());
  if (sessionResult.error) throw new Error(`POST getSession failed code=${sessionResult.error.code ?? "unknown"}`);
  const sessionNow = sessionResult.data.session;
  assertNoRefresh("POST-GETSESSION-NO-TOKEN-REFRESH");
  check("POST-TOKEN-CONTINUITY", "byte-identical=true", `byte-identical=${sessionNow?.access_token === originalToken}`, sessionNow?.access_token === originalToken);
  check("POST-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${sessionNow?.user?.id === uid}`, sessionNow?.user?.id === uid);

  const visibleAfter = await guarded(client.from("businesses").select("pharmacy_name").order("pharmacy_name"));
  const namesAfter = (visibleAfter.data ?? []).map(r => r.pharmacy_name);
  const a1After = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
  const b1After = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
  const a1TruthAfter = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
  const b1TruthAfter = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
  check("POST-VISIBLE-BUSINESSES", "Store A1", namesAfter.join(","), !visibleAfter.error && JSON.stringify(namesAfter) === JSON.stringify(["Store A1"]));
  check("POST-USER-DATA", "A1=200,B1=0", `A1=${a1After},B1=${b1After}`, a1After === 200 && b1After === 0);
  check("POST-JUNCTION-TRUTH", "A1=1,B1=0", `A1=${a1TruthAfter},B1=${b1TruthAfter}`, a1TruthAfter === 1 && b1TruthAfter === 0);
  assertNoRefresh("POST-QUERY-NO-TOKEN-REFRESH");
  log("POST_REVOCATION_SAME_SESSION_CAPTURED=true");
  log("WAITING_FOR_TONY_RESTORE=run guarded restore in Terminal B; then type RESTORED here before the token refresh margin");
  save();

  const restoreDeadlineAt = tokenExpiryMs - AUTH_REFRESH_MARGIN_MS;
  const restoreSignal = (await questionWithDeadline(
    "Tony restore status (RESTORED or STOP): ",
    restoreDeadlineAt,
    "token entered auth-js refresh margin before restoration verification",
  )).trim();
  if (restoreSignal === "RESTORED") {
    log("\n=== SAME SESSION AFTER TONY RESTORE ===");
    assertOutsideRefreshMargin("RESTORE-OUTSIDE-REFRESH-MARGIN", tokenExpiryMs);
    assertNoRefresh("RESTORE-PRECHECK-NO-TOKEN-REFRESH");
    check("RESTORE-SAME-CLIENT-OBJECT", "true", String(client === clientAnchor), client === clientAnchor);
    const restoredSessionResult = await guarded(client.auth.getSession());
    if (restoredSessionResult.error) throw new Error(`RESTORE getSession failed code=${restoredSessionResult.error.code ?? "unknown"}`);
    const sessionRestored = restoredSessionResult.data.session;
    assertNoRefresh("RESTORE-GETSESSION-NO-TOKEN-REFRESH");
    check("RESTORE-TOKEN-CONTINUITY", "byte-identical=true", `byte-identical=${sessionRestored?.access_token === originalToken}`, sessionRestored?.access_token === originalToken);
    check("RESTORE-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${sessionRestored?.user?.id === uid}`, sessionRestored?.user?.id === uid);
    const visibleRestored = await guarded(client.from("businesses").select("pharmacy_name").order("pharmacy_name"));
    const namesRestored = (visibleRestored.data ?? []).map(r => r.pharmacy_name);
    const a1Restored = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
    const b1Restored = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
    const a1TruthRestored = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
    const b1TruthRestored = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
    check("RESTORE-VISIBLE-BUSINESSES", "Store A1,Store B1", namesRestored.join(","), !visibleRestored.error && JSON.stringify(namesRestored) === JSON.stringify(["Store A1", "Store B1"]));
    check("RESTORE-USER-DATA", "A1=200,B1=200", `A1=${a1Restored},B1=${b1Restored}`, a1Restored === 200 && b1Restored === 200);
    check("RESTORE-JUNCTION-TRUTH", "A1=1,B1=1", `A1=${a1TruthRestored},B1=${b1TruthRestored}`, a1TruthRestored === 1 && b1TruthRestored === 1);
    assertNoRefresh("RESTORE-QUERY-NO-TOKEN-REFRESH");
    log("RESTORATION_SAME_SESSION_CAPTURED=true");
  } else if (restoreSignal === "STOP") {
    log("RESTORATION_VERIFICATION=NOT_PERFORMED_BY_CONTROLLER");
  } else {
    throw new Error("unexpected restore signal");
  }

  log("ONE_WALK_OBSERVATIONS_COMPLETE=true");
  log("module_verdict=NOT_ISSUED");
  save();
} catch (e) {
  log(`ABORT=${String(e?.message ?? "unknown").replace(/https?:\/\/\S+/g, "<redacted-url>")}`);
  log("AC2_EVIDENCE_CLAIMED=false");
  log("OPERATOR_ACTION=if Tony revoke completed, run the guarded restore action before leaving SCRATCH");
  log("module_verdict=NOT_ISSUED");
  save();
  process.exitCode = 2;
} finally {
  if (rl) rl.close();
  if (authSubscription) authSubscription.unsubscribe();
  if (client) await client.auth.signOut().catch(() => {});
  await db.end().catch(() => {});
}
