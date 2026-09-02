#!/usr/bin/env node
// BIM-002 PRE-Q Phase 3 — Tony-only guarded service-role action.
// Usage: node .../phase3-tony-membership-action.mjs <revoke|restore> <unique-evidence-path>

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const action = process.argv[2];
const evidencePath = process.argv[3];
if (!['revoke','restore'].includes(action) || !evidencePath) throw new Error("action revoke|restore and unique evidence path required");

function assertScratchSelection() {
  const head = fs.readFileSync(path.join(root, ".git/HEAD"), "utf8").trim();
  const sha = fs.readFileSync(path.join(root, ".git/refs/heads/qa/bim002"), "utf8").trim();
  if (head !== "ref: refs/heads/qa/bim002" || sha !== "53f1ac0004f40e4df9e403188382b16afb92899f") throw new Error("branch/HEAD mismatch");
  if (process.env.RLS_HARNESS_PREFIX || Object.keys(process.env).some(k => k.startsWith("RLS_REPLICA_"))) throw new Error("prefix/replica override active");
  const names = new Set(fs.readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/).map(l => (l.match(/^([A-Z_0-9]+)=/) || [])[1]).filter(Boolean));
  const defaults = ["RLS_HARNESS_DB_URL", "RLS_HARNESS_SUPABASE_URL", "RLS_HARNESS_PUBLISHABLE_KEY", "RLS_HARNESS_SECRET_KEY"];
  const fallbacks = ["PROTO06_DB_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"];
  if (!defaults.every(k => !names.has(k)) || !fallbacks.every(k => names.has(k))) throw new Error("A-1 SCRATCH selection ambiguous");
}

assertScratchSelection();
const { loadEnv } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/env.mjs")));
const { pgClient, serviceClient } = await import(pathToFileURL(path.join(root, "scripts/rls-harness/lib/db.mjs")));
const env = loadEnv();
const db = await pgClient(env);
const svc = serviceClient(env);
const lines = [];
const log = (s = "") => { lines.push(s); console.log(s); };
const save = () => { fs.mkdirSync(path.dirname(evidencePath), { recursive: true }); fs.writeFileSync(evidencePath, lines.join("\n") + "\n"); };
const count = async (uid, bid) => {
  const r = await svc.from("user_businesses").select("*", { count: "exact", head: true }).eq("user_id", uid).eq("business_id", bid);
  if (r.error) throw new Error(`junction count failed code=${r.error.code ?? "unknown"}`);
  return r.count ?? 0;
};
const requireState = (label, expected, actual) => {
  const ok = expected === actual;
  log(`${ok ? "MATCH" : "MISMATCH"} ${label} expected=${expected} observed=${actual}`);
  if (!ok) throw new Error(`precondition failed: ${label}`);
};

try {
  log(`BIM-002 PHASE 3 TONY ACTION=${action}`);
  log("INTENDED TARGET: SCRATCH");
  log("resolver_signal=[env] A-1 fallback in use");
  log("credential_or_token_value_recorded=false");
  const users = (await db.query("select id from auth.users where email='bim002-multistore@rls.local'")).rows;
  const businesses = (await db.query("select id,pharmacy_name from public.businesses where pharmacy_name in ('Store A1','Store B1') order by pharmacy_name")).rows;
  requireState("identity-row-count", 1, users.length);
  requireState("business-row-count", 2, businesses.length);
  const uid = users[0].id;
  const ids = Object.fromEntries(businesses.map(r => [r.pharmacy_name, r.id]));
  const a1Before = await count(uid, ids["Store A1"]);
  const b1Before = await count(uid, ids["Store B1"]);

  if (action === "revoke") {
    requireState("pre-revoke-A1", 1, a1Before);
    requireState("pre-revoke-B1", 1, b1Before);
    const row = await svc.from("user_businesses").select("role,is_primary").eq("user_id", uid).eq("business_id", ids["Store B1"]).single();
    if (row.error) throw new Error(`B1 pre-read failed code=${row.error.code ?? "unknown"}`);
    requireState("pre-revoke-B1-role", "member", row.data.role);
    requireState("pre-revoke-B1-primary", false, row.data.is_primary);
    log("MUTATION_SCOPE=delete exactly multiStore -> Store B1; A1 predicate absent from mutation");
    const result = await svc.from("user_businesses").delete().eq("user_id", uid).eq("business_id", ids["Store B1"]).select("role,is_primary");
    if (result.error) throw new Error(`revoke failed code=${result.error.code ?? "unknown"}`);
    requireState("deleted-row-count", 1, result.data?.length ?? 0);
    requireState("post-revoke-A1", 1, await count(uid, ids["Store A1"]));
    requireState("post-revoke-B1", 0, await count(uid, ids["Store B1"]));
    log("TONY_ACTION_COMPLETE=REVOKE_EXACT_B1_ONLY");
  } else {
    requireState("pre-restore-A1", 1, a1Before);
    requireState("pre-restore-B1", 0, b1Before);
    log("MUTATION_SCOPE=insert exactly multiStore -> Store B1 role=member is_primary=false");
    const result = await svc.from("user_businesses").insert({ user_id: uid, business_id: ids["Store B1"], role: "member", is_primary: false }).select("role,is_primary");
    if (result.error) throw new Error(`restore failed code=${result.error.code ?? "unknown"}`);
    requireState("inserted-row-count", 1, result.data?.length ?? 0);
    requireState("restored-role", "member", result.data[0].role);
    requireState("restored-primary", false, result.data[0].is_primary);
    requireState("post-restore-A1", 1, await count(uid, ids["Store A1"]));
    requireState("post-restore-B1", 1, await count(uid, ids["Store B1"]));
    log("TONY_ACTION_COMPLETE=RESTORE_EXACT_B1_ONLY");
  }
  save();
} catch (e) {
  log(`ABORT=${String(e?.message ?? "unknown").replace(/https?:\/\/\S+/g, "<redacted-url>")}`);
  save();
  process.exitCode = 2;
} finally {
  await db.end().catch(() => {});
}
