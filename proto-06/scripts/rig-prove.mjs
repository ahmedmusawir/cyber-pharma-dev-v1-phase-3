#!/usr/bin/env node
// PROTO-06 · rig-prove.mjs — R4: THE ONE COMMAND.
// wipe → rebuild schema → land all 8 policies in order → seed → 80-cell matrix
// → 32-case attack battery. Exits non-zero on ANY mismatch or breach.
//
//   RIG_RESET_ALLOW=yes node proto-06/scripts/rig-prove.mjs
//
// Every stage's stdout is captured into ONE uniquely-named evidence file.
import { spawnSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { rigRoot, repoRoot } from "./rig-lib.mjs";

const POLICY_ORDER = [
  "h0_helpers.sql",            // helpers first — every policy below calls them
  "t1_fact_select.sql",        // T-1 tenant SELECT
  "t2a_fact_insert.sql",       // T-2 tenant writes (WITH CHECK)
  "t2b_fact_update.sql",
  "t2c_fact_delete.sql",
  "t3b_business_select.sql",   // F-1 LAW: SELECT lands BEFORE the write policy
  "t3_business_update_admin.sql", // T-3 role-gated write (now reachable)
  "t4_ref_select.sql",         // T-4 platform-shared read
  "t5_junction_self_select.sql", // T-5 junction self-visibility
];

const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
const evidence = join(rigRoot, "evidence", `R4_full_proof_${ts}.log`);
const out = [];
let failed = null;

function stage(label, cmd, args, env = {}) {
  if (failed) return;
  const banner = `\n═══ ${label} ═══`;
  console.log(banner); out.push(banner);
  const r = spawnSync(cmd, args, { cwd: repoRoot, encoding: "utf8", env: { ...process.env, ...env } });
  const text = (r.stdout || "") + (r.stderr || "");
  process.stdout.write(text); out.push(text.trimEnd());
  if (r.status !== 0) { failed = `${label} (exit ${r.status})`; }
}

console.log(`[rig-prove] R4 full proof from scratch → ${ts}`);
out.push(`[rig-prove] R4 full proof from scratch → ${ts}`);

stage("1/5 WIPE", "node", ["proto-06/scripts/rig-reset.mjs", "wipe"], { RIG_RESET_ALLOW: "yes" });
stage("2/5 SCHEMA", "node", ["proto-06/scripts/rig-reset.mjs", "migrate"]);
for (const [i, p] of POLICY_ORDER.entries()) {
  stage(`3/5 POLICY ${i + 1}/${POLICY_ORDER.length} — ${p}`, "node", ["proto-06/scripts/rig-policy.mjs", p]);
}
stage("4/5 SEED", "node", ["proto-06/scripts/rig-seed.mjs"]);
stage("5/5a MATRIX (80 cells)", "node", ["proto-06/harness/rig-harness.mjs"]);
stage("5/5b ATTACK BATTERY (32 cases)", "node", ["proto-06/harness/rig-attacks.mjs"]);

const verdict = failed
  ? `\n[rig-prove] ✗ FAILED at: ${failed}`
  : `\n[rig-prove] ✓ FULL PROOF GREEN — schema + 8 policies + 80-cell matrix + 32 attacks, from an empty database.`;
console.log(verdict); out.push(verdict);
writeFileSync(evidence, out.join("\n") + "\n");
console.log(`[rig-prove] evidence → ${evidence}`);
process.exit(failed ? 4 : 0);
