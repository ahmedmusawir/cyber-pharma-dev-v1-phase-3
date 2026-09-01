// PROTO-06 · rig-lib.mjs — shared env loading + pg client for the rig scripts.
// Reads .env.local; NEVER prints values (Addendum A posture).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

export const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const rigRoot = join(repoRoot, "proto-06");
export const RIG_PASSWORD = "proto06-Rig-Pass-2026!"; // synthetic throwaway cred, rig identities only

export function loadEnv() {
  const envPath = join(repoRoot, ".env.local");
  if (!existsSync(envPath)) {
    console.error("FAIL-CLOSED: .env.local not found at repo root.");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  for (const key of ["PROTO06_DB_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"]) {
    if (!env[key]) {
      console.error(`FAIL-CLOSED: ${key} missing from .env.local.`);
      process.exit(1);
    }
  }
  return env;
}

export async function pgClient(env) {
  const client = new pg.Client({ connectionString: env.PROTO06_DB_URL });
  await client.connect();
  return client;
}
