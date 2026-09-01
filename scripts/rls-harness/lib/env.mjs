// BIM-002 · rls-harness/lib/env.mjs — env loading, prefix-generalized (R-D).
// Reads .env.local at repo root. NEVER prints a value. Fail-closed.
//
// Prefix contract: loadEnv("RLS_HARNESS_") wants RLS_HARNESS_DB_URL,
// _SUPABASE_URL, _PUBLISHABLE_KEY, _SECRET_KEY. Until the Director adds those
// lines, Amendment A-1 maps the module to the Proto 06 throwaway keys.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const repoRoot = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));
export const harnessRoot = join(repoRoot, "scripts", "rls-harness");

// A-1 fallback map: <PREFIX><logical> -> actual key on disk today.
const A1_FALLBACK = {
  DB_URL: "PROTO06_DB_URL",
  SUPABASE_URL: "NEXT_PUBLIC_SUPABASE_URL",
  PUBLISHABLE_KEY: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  SECRET_KEY: "SUPABASE_SECRET_KEY",
};

export function loadEnv(prefix = process.env.RLS_HARNESS_PREFIX ?? "RLS_HARNESS_") {
  const envPath = join(repoRoot, ".env.local");
  if (!existsSync(envPath)) {
    console.error("FAIL-CLOSED: .env.local not found at repo root:", repoRoot);
    process.exit(1);
  }
  const raw = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
    if (m) raw[m[1]] = m[2].trim();
  }
  const out = {};
  const usedFallback = [];
  for (const logical of Object.keys(A1_FALLBACK)) {
    const prefixed = prefix + logical;
    if (raw[prefixed]) out[logical] = raw[prefixed];
    else if (raw[A1_FALLBACK[logical]]) { out[logical] = raw[A1_FALLBACK[logical]]; usedFallback.push(logical); }
    else {
      console.error(`FAIL-CLOSED: neither ${prefixed} nor A-1 fallback ${A1_FALLBACK[logical]} present in .env.local.`);
      process.exit(1);
    }
  }
  if (out.PUBLISHABLE_KEY === out.SECRET_KEY) {
    console.error("FAIL-CLOSED: publishable key equals secret key — the harness would 'prove' isolation as service role.");
    process.exit(1);
  }
  if (usedFallback.length) console.log(`[env] A-1 fallback in use for: ${usedFallback.join(", ")} (rename to ${prefix}* when the Director adds them)`);
  return out; // values never logged
}

// Synthetic, throwaway-only. Rig identities are recreated by seed.mjs every run.
export const CAST_PASSWORD = "bim002-Rls-Harness-2026!";
