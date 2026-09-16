#!/usr/bin/env node
// QA helper (Cody, BIM-003 dynamic campaign) — Stage B golden-oracle corruption driver.
//   node helpers/qa-golden-attack.mjs <case>
// cases: action | business | remove-row | add-row | payload | status
// The COMMITTED golden is snapshotted byte-for-byte to QA/evidence/golden_committed_copy.json
// on first run; each case corrupts a TEMPORARY working copy, runs `npm run audit:prove`
// (canonical 4-stage proof), captures the exit code + the mismatch lines, then restores the
// committed bytes exactly and re-verifies the sha256. Secrets: none. Product golden is never
// left modified; `status` reports the current byte-identity.
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const QA = dirname(dirname(fileURLToPath(import.meta.url))); // .../BIM-003-CYBER-PHARMA/QA
const repoRoot = dirname(dirname(dirname(dirname(QA))));     // repo root
const GOLDEN = join(repoRoot, "scripts/rls-harness/golden/audit_trail_expected.json");
const COMMITTED_COPY = join(QA, "evidence", "golden_committed_copy.json");
const ev = [];
const say = (s = "") => { ev.push(s); console.log(s); };
const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");

const caseName = process.argv[2];
if (!caseName) { console.error("usage: qa-golden-attack.mjs <action|business|remove-row|add-row|payload|status>"); process.exit(2); }

if (!existsSync(COMMITTED_COPY)) copyFileSync(GOLDEN, COMMITTED_COPY);
const committedSha = sha(COMMITTED_COPY);

if (caseName === "status") {
  const now = sha(GOLDEN);
  console.log(`committed-copy sha256: ${committedSha}`);
  console.log(`golden-now    sha256: ${now}`);
  console.log(now === committedSha ? "IDENTICAL — golden is byte-for-byte the committed specimen" : "MISMATCH — golden differs from the committed copy");
  process.exit(now === committedSha ? 0 : 1);
}

// corrupt a temp copy per case
const g = JSON.parse(readFileSync(COMMITTED_COPY, "utf8"));
const corrupt = {
  action: () => { g[0].action = "delete"; return "row 1 action insert→delete"; },
  business: () => { g[0].business_id = "B1"; return "row 1 business A1→B1"; },
  "remove-row": () => { g.splice(2, 1); return "row 3 (update) removed — golden 9 rows"; },
  "add-row": () => { g.push({ ...g[0], action: "read_page", row_id: null, old_data: null, new_data: null }); return "extra row 11 appended"; },
  payload: () => { g[1].old_data = null; return "row 2 old_data present→null"; },
};
if (!corrupt[caseName]) { console.error(`unknown case ${caseName}`); process.exit(2); }
const desc = corrupt[caseName]();
const corruptedBytes = JSON.stringify(g, null, 2) + "\n";
writeFileSync(GOLDEN, corruptedBytes);

say(`[qa-golden-attack] case=${caseName} — ${desc}`);
say(`[qa-golden-attack] running canonical npm run audit:prove against the corrupted golden…`);
const r = spawnSync("npm", ["run", "audit:prove"], { cwd: repoRoot, encoding: "utf8" });
const log = (r.stdout || "") + (r.stderr || "");
say(`exit code: ${r.status}`);
say("--- mismatch-relevant output ---");
say(log.split("\n").filter((l) => /DIFF|row count|differing|TRAIL|FAILED|✓|✗/.test(l)).join("\n"));
writeFileSync(join(QA, "evidence", `QA_B_golden_attack_${caseName}.log`), ev.join("\n") + "\n");
writeFileSync(join(QA, "evidence", `QA_B_golden_attack_${caseName}_full.log`), log);

// restore committed bytes exactly, verify
copyFileSync(COMMITTED_COPY, GOLDEN);
const restored = sha(GOLDEN) === committedSha;
say(`[qa-golden-attack] golden restored: ${restored ? "byte-identical to committed specimen ✓" : "RESTORE FAILED ✗✗✗"}`);
if (!restored) process.exit(9);
// verdict on the case itself: a corrupted golden MUST have produced a non-zero exit
const caught = (r.status ?? 0) !== 0;
say(`[qa-golden-attack] case ${caseName}: audit:prove exit ${r.status} — ${caught ? "NON-ZERO as required (oracle caught the corruption)" : "GREEN — FALSE-GREEN RISK (HIGH-SEVERITY QA-INSTRUMENT FINDING)"}`);
process.exit(caught ? 0 : 8);