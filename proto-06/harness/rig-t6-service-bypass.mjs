#!/usr/bin/env node
// PROTO-06 · T-6 — the service-role bypass, demonstrated ONCE, deliberately.
// This is the MissionControl/admin path: the service key sees EVERYTHING across
// tenants, which is exactly why its use must be exceptional, server-side only,
// and audited (BIM-003's audit trail is the fence). Never in a browser, never
// in client-reachable code. No policy is created here — bypass is intrinsic.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnv, rigRoot } from "../scripts/rig-lib.mjs";

const env = loadEnv();
const svc = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
log("[T-6] service-role bypass demonstration (the fenced MissionControl path)");

for (const table of ["accounts", "businesses", "user_businesses", "fact_data", "ref_data"]) {
  const { count, error } = await svc.from(table).select("*", { count: "exact", head: true });
  if (error) { log(`  FAIL ${table}: ${error.message}`); process.exit(2); }
  log(`  service-role sees ${table}: ${count} rows (cross-tenant, policies bypassed)`);
}
const { data } = await svc.from("fact_data").select("business_id").limit(6000);
const distinct = new Set(data.map((r) => r.business_id)).size;
log(`  cross-tenant proof: fact_data rows span ${distinct} distinct businesses in one unauthenticated-context read`);
log("[T-6] CONFIRMED — bypass works as designed; fencing rule recorded for TRANSFERS: service key server-side only, every use audited, never a substitute for a policy.");
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(rigRoot, "evidence", `R2-T6_service_bypass_${ts}.log`), lines.join("\n") + "\n");
