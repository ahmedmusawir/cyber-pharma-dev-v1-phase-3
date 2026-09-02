#!/usr/bin/env node
// BIM-002 PRE-Q Phase 3 One-Walk session controller.
// Cody runs this in Terminal A only after Sol/Tony release execution.
// It never mutates membership. It deliberately keeps one client/session alive
// while Tony performs the separately guarded mutation in Terminal B.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const evidencePath = process.argv[2];
if (!evidencePath) throw new Error("unique evidence path argument required");

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

assertScratchSelection();
const { loadEnv, CAST_PASSWORD } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/env.mjs")));
const { pgClient, serviceClient, anonClient } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/db.mjs")));
const env = loadEnv();
const db = await pgClient(env);
const svc = serviceClient(env);
const lines = [];
let client;
let rl;
const log = (s = "") => { lines.push(s); console.log(s); };
const save = () => { fs.mkdirSync(path.dirname(evidencePath), { recursive: true }); fs.writeFileSync(evidencePath, lines.join("\n") + "\n"); };
const fingerprint = token => crypto.createHash("sha256").update(token).digest("hex").slice(0, 12);
const exactCount = async (c, table, filters = {}) => {
  let q = c.from(table).select("*", { count: "exact", head: true });
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const r = await q;
  if (r.error) throw new Error(`count ${table} failed code=${r.error.code ?? "unknown"}`);
  return r.count ?? 0;
};
const check = (id, expected, actual, ok) => {
  log(`${ok ? "MATCH" : "MISMATCH"} ${id} | expected=${expected} | observed=${actual}`);
  if (!ok) throw new Error(`One-Walk assertion failed: ${id}`);
};

try {
  log("BIM-002 PRE-Q PHASE 3 — ONE-WALK SAME-SESSION REVOCATION");
  log("INTENDED TARGET: SCRATCH");
  log("resolver_signal=[env] A-1 fallback in use");
  log("credential_or_token_value_recorded=false");

  const userRows = (await db.query("select id from auth.users where email='bim002-multistore@rls.local'")).rows;
  const bizRows = (await db.query("select id,pharmacy_name from public.businesses where pharmacy_name in ('Store A1','Store B1') order by pharmacy_name")).rows;
  check("PRE-IDENTITY-ROW", "1", String(userRows.length), userRows.length === 1);
  check("PRE-BUSINESS-ROWS", "A1,B1", bizRows.map(r => r.pharmacy_name.replace("Store ", "")).join(","), bizRows.length === 2);
  const uid = userRows[0].id;
  const ids = Object.fromEntries(bizRows.map(r => [r.pharmacy_name, r.id]));

  client = anonClient(env);
  const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
    email: "bim002-multistore@rls.local", password: CAST_PASSWORD,
  });
  check("PRE-SIGN-IN", "code=none", `code=${signInError?.code ?? "none"}`, !signInError);
  check("PRE-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${signIn?.user?.id === uid}`, signIn?.user?.id === uid);
  const originalToken = signIn.session.access_token;
  log(`TOKEN continuity_anchor=fingerprint:${fingerprint(originalToken)} value_recorded=false`);

  const visibleBefore = await client.from("businesses").select("pharmacy_name").order("pharmacy_name");
  const namesBefore = (visibleBefore.data ?? []).map(r => r.pharmacy_name);
  const a1Before = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
  const b1Before = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
  const a1TruthBefore = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
  const b1TruthBefore = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
  check("PRE-VISIBLE-BUSINESSES", "Store A1,Store B1", namesBefore.join(","), !visibleBefore.error && JSON.stringify(namesBefore) === JSON.stringify(["Store A1", "Store B1"]));
  check("PRE-USER-DATA", "A1=200,B1=200", `A1=${a1Before},B1=${b1Before}`, a1Before === 200 && b1Before === 200);
  check("PRE-JUNCTION-TRUTH", "A1=1,B1=1", `A1=${a1TruthBefore},B1=${b1TruthBefore}`, a1TruthBefore === 1 && b1TruthBefore === 1);
  log("PRE_STATE_CAPTURED=true");
  save();

  log("STOP_POINT_BEFORE_REVOCATION=true");
  log("WAITING_FOR_TONY=run guarded revoke in Terminal B; then type POST here");
  save();
  rl = readline.createInterface({ input, output });
  const postSignal = (await rl.question("Tony complete? Type POST exactly: ")).trim();
  if (postSignal !== "POST") throw new Error("POST signal not received; no post-state query run");

  log("\n=== SAME SESSION AFTER TONY REVOCATION ===");
  const sessionNow = (await client.auth.getSession()).data.session;
  check("POST-TOKEN-CONTINUITY", "byte-identical=true", `byte-identical=${sessionNow?.access_token === originalToken};fingerprint:${fingerprint(sessionNow?.access_token ?? "")}`, sessionNow?.access_token === originalToken);
  check("POST-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${sessionNow?.user?.id === uid}`, sessionNow?.user?.id === uid);
  const visibleAfter = await client.from("businesses").select("pharmacy_name").order("pharmacy_name");
  const namesAfter = (visibleAfter.data ?? []).map(r => r.pharmacy_name);
  const a1After = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
  const b1After = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
  const a1TruthAfter = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
  const b1TruthAfter = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
  check("POST-VISIBLE-BUSINESSES", "Store A1", namesAfter.join(","), !visibleAfter.error && JSON.stringify(namesAfter) === JSON.stringify(["Store A1"]));
  check("POST-USER-DATA", "A1=200,B1=0", `A1=${a1After},B1=${b1After}`, a1After === 200 && b1After === 0);
  check("POST-JUNCTION-TRUTH", "A1=1,B1=0", `A1=${a1TruthAfter},B1=${b1TruthAfter}`, a1TruthAfter === 1 && b1TruthAfter === 0);
  log("POST_REVOCATION_SAME_SESSION_CAPTURED=true");
  save();

  log("WAITING_FOR_TONY_RESTORE=run guarded restore in Terminal B; type RESTORED to verify or STOP to end without restore verification");
  save();
  const restoreSignal = (await rl.question("Tony restore status (RESTORED or STOP): ")).trim();
  if (restoreSignal === "RESTORED") {
    log("\n=== SAME SESSION AFTER TONY RESTORE ===");
    const sessionRestored = (await client.auth.getSession()).data.session;
    check("RESTORE-TOKEN-CONTINUITY", "byte-identical=true", `byte-identical=${sessionRestored?.access_token === originalToken};fingerprint:${fingerprint(sessionRestored?.access_token ?? "")}`, sessionRestored?.access_token === originalToken);
    check("RESTORE-SESSION-IDENTITY", "exact-seeded-id=true", `exact-seeded-id=${sessionRestored?.user?.id === uid}`, sessionRestored?.user?.id === uid);
    const visibleRestored = await client.from("businesses").select("pharmacy_name").order("pharmacy_name");
    const namesRestored = (visibleRestored.data ?? []).map(r => r.pharmacy_name);
    const a1Restored = await exactCount(client, "user_data", { business_id: ids["Store A1"] });
    const b1Restored = await exactCount(client, "user_data", { business_id: ids["Store B1"] });
    const a1TruthRestored = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store A1"] });
    const b1TruthRestored = await exactCount(svc, "user_businesses", { user_id: uid, business_id: ids["Store B1"] });
    check("RESTORE-VISIBLE-BUSINESSES", "Store A1,Store B1", namesRestored.join(","), !visibleRestored.error && JSON.stringify(namesRestored) === JSON.stringify(["Store A1", "Store B1"]));
    check("RESTORE-USER-DATA", "A1=200,B1=200", `A1=${a1Restored},B1=${b1Restored}`, a1Restored === 200 && b1Restored === 200);
    check("RESTORE-JUNCTION-TRUTH", "A1=1,B1=1", `A1=${a1TruthRestored},B1=${b1TruthRestored}`, a1TruthRestored === 1 && b1TruthRestored === 1);
    log("RESTORATION_SAME_SESSION_CAPTURED=true");
  } else if (restoreSignal === "STOP") {
    log("RESTORATION_VERIFICATION=NOT_PERFORMED_BY_CONTROLLER");
  } else throw new Error("unexpected restore signal");

  log("ONE_WALK_OBSERVATIONS_COMPLETE=true");
  log("module_verdict=NOT_ISSUED");
  save();
} catch (e) {
  log(`ABORT=${String(e?.message ?? "unknown").replace(/https?:\/\/\S+/g, "<redacted-url>")}`);
  log("module_verdict=NOT_ISSUED");
  save();
  process.exitCode = 2;
} finally {
  if (rl) rl.close();
  if (client) await client.auth.signOut().catch(() => {});
  await db.end().catch(() => {});
}
