// Service-role Supabase client factory — BLESSED INFRA, currently UNCONSUMED.
// Ledger E-04 (agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md, 2026-09-20): this is the
// single service-role factory in the repo. The duplicate copy that lived beside the
// operator user-management portal was deleted with that portal in RRM-001 (2026-09-20).
// Zero app consumers: nothing under src/ or scripts/ imports this file, and no route,
// page, component or Server Action may.
// FENCED to seeding and system jobs only — BIM-004's seed script decides its own import.
// CRITICAL: uses the secret (service_role) key — server-side only. NEVER import this in
// client components or expose the key to the browser.

import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client with service_role privileges.
 * This client bypasses Row Level Security (RLS) and should only be used
 * for privileged operations like creating admin users or updating roles.
 * 
 * @returns Supabase admin client
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
