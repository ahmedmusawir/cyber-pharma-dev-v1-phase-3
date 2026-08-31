# DATA CONTRACT — Phase 1: Foundation Skeleton

> **Scope:** Phase 1 only. Frank-domain tables are Phase 3's concern.
> **Reader:** Claudy (Claude Code)

---

## 1. Tables In Play For Phase 1

Phase 1 uses **only** the tables inherited from the starter kit. No Frank-domain tables exist yet.

### `auth.users` (Supabase managed)

Standard Supabase Auth users table. Not modified.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| email | text | UNIQUE |
| encrypted_password | text | Managed by Supabase Auth |
| user_metadata | jsonb | **NOT USED for roles** (security decision) |
| app_metadata | jsonb | Reserved for future server-set claims |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

🔒 **LOCKED:** Roles never written to `user_metadata`. Role data lives in `user_roles` table (below).

### `user_roles` (starter kit — kept as-is)

Server-controlled role table. Inherited from starter kit version 2.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to `auth.users(id)`, UNIQUE (one role row per user) |
| role | `app_role` enum | Values: `superadmin`, `admin`, `member` |
| created_at | timestamptz | Auto |

### `app_role` ENUM (starter kit — kept as-is)

Values: `superadmin`, `admin`, `member`.

🔒 **Phase 1 caveat:** In Phase 1, `admin` and `member` are platform-level (inherited from starter kit). In Phase 3, the semantics shift: `superadmin` stays platform-level, but `admin`/`member` become per-pharmacy (via the `user_businesses` junction added in Phase 3). The Phase 1 starter kit pattern remains valid for now — Phase 3 will refactor.

---

## 2. Tables NOT In Play For Phase 1

These tables are documented in MASTER_APP_BRIEF §5 but **do not exist yet** in Phase 1. They land in Phase 3.

- `businesses` (the tenant spine)
- `user_businesses` (multi-store admin junction)
- `user_data` (PHI fact table)
- `subscriptions` (Stripe state mirror)
- `apa_memberships`
- `aac_reference`, `wac_reference`, `ful_reference`
- `pbm_info`
- `audit_logs`
- `report_files`
- `reference_dataset_versions`
- `pending_registrations`

🔒 **LOCKED:** Phase 1 does NOT create or migrate any of these tables. Phase 1 does NOT use any Frank-domain data.

---

## 3. Trigger / Function Inventory

The starter kit ships with three database functions. Verify they exist after deployment:

| Function | Purpose |
|---|---|
| `handle_new_user()` | Trigger on `auth.users` insert; auto-creates a `user_roles` row with default role `member` |
| `update_updated_at()` | Trigger function for any table needing auto-updated `updated_at` |
| `rls_auto_enable()` | Event trigger that auto-enables RLS on newly created tables (defense-in-depth) |

🔒 **LOCKED:** All three preserved. `rls_auto_enable()` especially valuable — when Phase 3 creates Frank-domain tables, RLS is on by default instead of requiring manual enablement.

---

## 4. RLS Policies In Play For Phase 1

The starter kit's existing policies on `user_roles` and `auth.users`:

- Users can read their own `user_roles` row
- Only `service_role` (admin client) can write to `user_roles`
- No public access to either table

🔒 **LOCKED:** Phase 1 does NOT add or modify RLS policies beyond what the starter kit ships. Phase 3 adds RLS for all Frank-domain tables.

---

## 5. Storage Buckets

**None used in Phase 1.** Phase 6 introduces `pharma_reports` bucket with per-pharmacy folder structure and Storage RLS. Phase 4 introduces `reference-data` bucket for archived AAC/WAC/FUL/PBM files.

---

## 6. Environment Variables Used In Phase 1

| Var | Purpose | Required at Boot? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | YES — fail-closed |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for browser/server clients | YES — fail-closed |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin client | YES — fail-closed |
| `GHL_WEBHOOK_SECRET` | Placeholder check for Phase 6 | YES — fail-closed (even though not consumed yet) |
| `NEXT_PUBLIC_APP_URL` | Self-reference for redirects | YES |
| `RESEND_API_KEY` | Placeholder for Phase 6 | NO in Phase 1 (Phase 6 will add to required list) |
| `STRIPE_SECRET_KEY` | Placeholder for Phase 7 | NO in Phase 1 |
| `STRIPE_WEBHOOK_SECRET` | Placeholder for Phase 7 | NO in Phase 1 |

🔒 **LOCKED:** The four "YES — fail-closed" vars are checked at app boot. If any missing → app refuses to start, logs which var, exits non-zero.

---

## 7. Type Definitions

Database types should be generated from the Supabase schema (via `supabase gen types typescript`) and committed to `src/types/supabase.ts` in both repos. This addresses the TONY_DEMO gap where types were missing entirely.

🔒 **LOCKED:** `supabase gen types typescript` run during Phase 1 setup. Types committed.

---

🛡️ **End of Phase 1 DATA_CONTRACT. Phase 3 will materially expand this to cover 13 Frank-domain tables.**
