#!/usr/bin/env node
// QA helper (Cody, BIM-003 dynamic campaign) — Stage A canonical reset.
// Equivalent to `npm run db:reset` with DB_URL + DB_RESET_ALLOW wired from .env.local
// through scripts/rls-harness/lib/env.mjs — the exact wiring audit-prove.mjs stage 1 uses
// (audit-prove.mjs:23). Values are never printed. SCRATCH target only (default env block).
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { loadEnv, repoRoot } from "../../../../../scripts/rls-harness/lib/env.mjs";

const env = loadEnv();
const r = spawnSync("node", [`${repoRoot}/scripts/db-reset.mjs`, "reset"], {
  cwd: repoRoot,
  encoding: "utf8",
  env: { ...process.env, DB_URL: env.DB_URL, DB_RESET_ALLOW: "yes" },
});
const out = (r.stdout || "") + (r.stderr || "");
process.stdout.write(out);
writeFileSync(`${repoRoot}/agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/evidence/QA_A_db_reset.log`, out);
process.exit(r.status ?? 1);