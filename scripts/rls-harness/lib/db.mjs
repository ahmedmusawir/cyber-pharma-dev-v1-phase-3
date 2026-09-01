// BIM-002 · rls-harness/lib/db.mjs — service-role clients.
// The ONLY place in the repo that constructs a service-role client outside
// seed/system paths (AC19 fence). Everything the matrix asserts runs through
// the publishable key instead.
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

export async function pgClient(env, { timeout = "120s" } = {}) {
  const c = new pg.Client({ connectionString: env.DB_URL });
  await c.connect();
  await c.query(`set statement_timeout = '${timeout}'`);
  return c;
}

export function serviceClient(env) {
  return createClient(env.SUPABASE_URL, env.SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function anonClient(env) {
  return createClient(env.SUPABASE_URL, env.PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
