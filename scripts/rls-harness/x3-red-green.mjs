#!/usr/bin/env node
// BIM-002 · X3 driver — lands 0017..0027 ONE AT A TIME, red then green.
//
// The ritual, mechanised so the evidence is uniform and reproducible:
//   1. flip that step's expectation cells to ALLOW  → run matrix → must be RED
//      (a policy that never went red proves nothing — manager §4.3.6)
//   2. apply the migration                          → run matrix → must be GREEN
//   3. run policy-check                             → all four laws must hold
// Any deviation stops the driver on the spot.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { loadEnv, harnessRoot, repoRoot } from "./lib/env.mjs";
import { pgClient } from "./lib/db.mjs";

const AUTHED = ["ownerA", "staffA", "ownerB", "multiStore"];
const all = (table, op) => Object.fromEntries(AUTHED.map((i) => [i, { [table]: { [op]: "ALLOW" } }]));
const some = (ids, table, op) => Object.fromEntries(ids.map((i) => [i, { [table]: { [op]: "ALLOW" } }]));

// Per-step expectation deltas. Tenant payloads target store A1 throughout, so
// ownerB (B-side only) staying DENY is the cross-tenant proof, cell by cell.
const STEPS = [
  { file: "0017_rls_user_businesses.sql", delta: all("user_businesses", "select"),
    why: "T-5 self-visibility: each identity sees only their own junction rows" },
  { file: "0018_rls_accounts.sql", delta: all("accounts", "select"),
    why: "R-A: each identity reads the account above a store they belong to" },
  { file: "0019_rls_businesses.sql",
    delta: merge(all("businesses", "select"), some(["ownerA"], "businesses", "update")),
    why: "T-1 read for all four; T-3 write only for ownerA (admin of A1, the probe target)" },
  { file: "0020_rls_subscriptions.sql", delta: all("subscriptions", "select"),
    why: "R-A mirror: account-scoped subscription read" },
  { file: "0021_rls_user_data.sql",
    delta: merge(all("user_data", "select"),
                 some(["ownerA", "staffA", "multiStore"], "user_data", "insert"),
                 some(["ownerA", "staffA", "multiStore"], "user_data", "update"),
                 some(["ownerA"], "user_data", "delete")),
    why: "SELECT all four; INSERT/UPDATE only A1 members; DELETE only the A1 admin (ownerB denied throughout = cross-tenant proof)" },
  { file: "0022_rls_report_files.sql", delta: all("report_files", "select"), why: "T-1 read" },
  { file: "0023_rls_aac_reference.sql", delta: all("aac_reference", "select"), why: "T-4 platform read" },
  { file: "0024_rls_wac_reference.sql", delta: all("wac_reference", "select"), why: "T-4 platform read" },
  { file: "0025_rls_ful_reference.sql", delta: all("ful_reference", "select"), why: "T-4 platform read" },
  { file: "0026_rls_pbm_info.sql", delta: all("pbm_info", "select"), why: "T-4 platform read" },
  { file: "0027_rls_reference_dataset_versions.sql", delta: all("reference_dataset_versions", "select"), why: "T-4 platform read" },
];

function merge(...objs) {
  const out = {};
  for (const o of objs) for (const [id, tables] of Object.entries(o)) {
    out[id] ||= {};
    for (const [t, ops] of Object.entries(tables)) out[id][t] = { ...(out[id][t] ?? {}), ...ops };
  }
  return out;
}
function applyDelta(overrides, delta) {
  for (const [id, tables] of Object.entries(delta)) {
    overrides[id] ||= {};
    for (const [t, ops] of Object.entries(tables)) overrides[id][t] = { ...(overrides[id][t] ?? {}), ...ops };
  }
}
const expPath = join(harnessRoot, "expectations.json");
const runMatrix = (label) => spawnSync("node", [join(harnessRoot, "harness.mjs"), label],
  { cwd: repoRoot, encoding: "utf8", env: { ...process.env, RLS_QUIET: "1" } });
const runCheck = () => spawnSync("node", [join(harnessRoot, "policy-check.mjs")], { cwd: repoRoot, encoding: "utf8" });

const env = loadEnv();
const db = await pgClient(env);
const ledger = [];

for (const [i, step] of STEPS.entries()) {
  const n = String(i + 1).padStart(2, "0");
  const stem = step.file.replace(/\.sql$/, "");
  console.log(`\n═════ STEP ${n}/${STEPS.length} — ${step.file} ═════\n  ${step.why}`);

  // 1. RED — flip expectations before the policy exists
  const exp = JSON.parse(readFileSync(expPath, "utf8"));
  applyDelta(exp.overrides, step.delta);
  exp.phase = `X3-${n}-${stem}-RED`;
  writeFileSync(expPath, JSON.stringify(exp, null, 2) + "\n");
  const red = runMatrix(exp.phase);
  const redFile = (red.stdout.match(/evidence\/(\S+\.log)/) || [])[1];
  if (red.status === 0) { console.error(`  ABORT: matrix was GREEN before ${step.file} landed — the step proves nothing.`); process.exit(4); }
  console.log(`  RED   ✓ ${redFile}`);

  // 2. GREEN — land the policy
  try { await db.query(readFileSync(join(repoRoot, "supabase", "migrations", step.file), "utf8")); }
  catch (e) { console.error(`  ABORT: ${step.file} failed to apply — ${e.message}`); process.exit(5); }
  exp.phase = `X3-${n}-${stem}-GREEN`;
  writeFileSync(expPath, JSON.stringify(exp, null, 2) + "\n");
  const green = runMatrix(exp.phase);
  const greenFile = (green.stdout.match(/evidence\/(\S+\.log)/) || [])[1];
  if (green.status !== 0) {
    console.error(`  ABORT: matrix still RED after ${step.file}.`);
    console.error(green.stdout.split("\n").filter((l) => l.includes("RED:")).join("\n"));
    process.exit(6);
  }
  console.log(`  GREEN ✓ ${greenFile}`);

  // 3. laws
  const chk = runCheck();
  if (chk.status !== 0) { console.error(`  ABORT: policy-check failed after ${step.file}\n${chk.stdout}${chk.stderr}`); process.exit(7); }
  console.log(`  LAWS  ✓ L1 one-per-op · L2 SELECT-before-write · L3 junction-first · L4 Gap-6`);
  ledger.push({ step: n, file: step.file, red: redFile, green: greenFile, why: step.why });
}

const exp = JSON.parse(readFileSync(expPath, "utf8"));
exp.phase = "X3-FINAL-all-policies";
writeFileSync(expPath, JSON.stringify(exp, null, 2) + "\n");
writeFileSync(join(repoRoot, "agent_docs", "ACTIONS", "BIM-002-CYBER-PHARMA", "evidence", "X3_red_green_ledger.json"), JSON.stringify(ledger, null, 2) + "\n");
console.log(`\n[x3] ${ledger.length}/${STEPS.length} steps landed red→green, laws held after every one.`);
await db.end();
