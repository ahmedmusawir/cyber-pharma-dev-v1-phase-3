#!/usr/bin/env node
// BIM-003 · rls-harness/audit-prove.mjs — THE ONE COMMAND.  npm run audit:prove
//
//   wipe (F-6 order) → chain 0001–0047 → seed (BIM-002 cast) → audit-seed (multi + R-10)
//   → scripted two-tenant session + probes + golden diff
//
// Exits non-zero the moment any stage fails. Same shape as prove.mjs; same env re-pointing
// (lib/env.mjs, RLS_HARNESS_PREFIX); no new env names. Evidence lands in BIM-003's folder.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { loadEnv, harnessRoot, repoRoot } from "./lib/env.mjs";

const PHASE = process.argv[2] ?? "S3";
const env = loadEnv();
const evidenceDir = join(repoRoot, "agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence");
const runTs = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
const out = [];
const say = (s) => { out.push(s); console.log(s); };
const H = (f) => join(harnessRoot, f);

const STAGES = [
  { name: "1/4 WIPE + CHAIN 0001-0047", cmd: "node", args: [join(repoRoot, "scripts/db-reset.mjs"), "reset"], env: { DB_URL: env.DB_URL, DB_RESET_ALLOW: "yes" } },
  { name: "2/4 SEED (BIM-002 cast + FK-safe reset)", cmd: "node", args: [H("seed.mjs")] },
  { name: "3/4 AUDIT-SEED (multi + R-10 rows)", cmd: "node", args: [H("audit-seed.mjs")] },
  { name: "4/4 SESSION + PROBES + GOLDEN DIFF", cmd: "node", args: [H("audit-session.mjs")] },
];

say(`[audit:prove] audit-trail proof from an empty scratch — ${runTs}`);
let failedAt = null;
for (const s of STAGES) {
  say(`\n═══ ${s.name} ═══`);
  const r = spawnSync(s.cmd, s.args, { cwd: repoRoot, encoding: "utf8", env: { ...process.env, ...(s.env ?? {}) } });
  say(((r.stdout || "") + (r.stderr || "")).trimEnd());
  if (r.status !== 0) { failedAt = `${s.name} (exit ${r.status})`; break; }
}
say(failedAt
  ? `\n[audit:prove] ✗ FAILED at ${failedAt}`
  : `\n[audit:prove] ✓ TRAIL PROVEN — chain 0001-0047 + immutability (6 probes) + write trail + R-8 + six wrapper reads + cross-tenant deny + admin-only visibility + golden match, from an empty database.`);

const raw = out.join("\n") + "\n";
writeFileSync(join(evidenceDir, `${PHASE}_audit_prove_${runTs}.log`), raw);
const normalise = (s) => s
  .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, "<uuid>")
  .replace(/\d{4}-\d{2}-\d{2}T\d{4,6}/g, "<ts>")
  .replace(/LIC-SESSION-\d+/g, "LIC-SESSION-<n>")
  .replace(/watermark: audit_logs\.id = \d+ \(\d+ rows/g, "watermark: audit_logs.id = <n> (<n> rows");
writeFileSync(join(evidenceDir, `${PHASE}_audit_prove_${runTs}.normalised.log`), normalise(raw));
console.log(`[audit:prove] evidence → evidence/${PHASE}_audit_prove_${runTs}.log (+ .normalised.log)`);
process.exit(failedAt ? 8 : 0);
