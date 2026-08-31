# PROTO 06 — R1 LAUNCH PLAN (Plan Mode, ONE message; R1 ONLY)
**Date:** 2026-08-31 · **Branch:** phase-3-proto-6 @ `53f4b63` · **Status:** PENDING_APPROVAL · 3 flags (1 blocking-ish, 2 informational)

## (0) Rig recon (what exists right now)

- Docs staged at `agent_docs/ACTIONS/PROTO06/` (disk wins over the launch order's `PROTO/06/` path — per Director; TRANSFERS.md will be written THERE).
- PROTO_PLAN_06 v1.1 header absorbed: junction-only policies, no user_roles table on the rig, no superadmin anything, five-table miniature (accounts/businesses/user_businesses/fact_data/ref_data), browser-eyeball leg deferred, seed volume at my discretion (≥ a few thousand), EXPLAIN informational.
- Throwaway DB verified reachable and carrying leftover BIM-001 16-table schema (read-only inventory).
- `proto-06/` does not exist yet (will be created). Campaign journal safe on mainline per Director; untouched from this lane.

## FLAGS

- **FLAG-1 (needs Director action, blocks harness config): `PROTO06_DB_URL` is NOT in `.env.local`** — Addendum A says it is; key-name grep says 0 hits. The URL arrived via chat instead. **I cannot add it myself — standing doctrine (BIM-000 R2) forbids the Engineer from ever editing `.env.local`.** Please add the line (with the aws-1 host per FLAG-2). Until then, harness/reset runs export it per-command from your paste — works, but violates the addendum's read-from-file/never-print posture for anything durable.
- **FLAG-2 (resolved by recon, informational): the pasted URL's host is wrong.** `aws-0-us-west-1` → "tenant not found"; **`aws-1-us-west-1` connects** (verified read-only; consistent with BIM-001 evidence). The `PROTO06_DB_URL` you add should carry `aws-1-us-west-1.pooler.supabase.com`.
- **FLAG-3 (informational, no action needed): leftover auth.users test identities survive the public-schema wipe** (the wipe is public-schema-only per Addendum A; auth schema untouched). Harmless — R1 seeds fresh identities with unique rig emails; leftovers are inert without junction rows. Noting so nobody mistakes them for rig identities in evidence.

## (1) R1 scope (brief §7-R1 + plan body step 1 + Addendum A)

**A. Wipe the throwaway to bare** (`proto-06/scripts/rig-reset.mjs` — rig-owned, patterned on the BIM-001 runner lessons: fail-closed anchors, DB URL from env, destructive guard `RIG_RESET_ALLOW=yes`):
1. `DROP EVENT TRIGGER IF EXISTS ensure_rls` (BIM-001 lesson: drop before schema or DDL breaks), then `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` + Supabase-standard re-grants. This kills all leftover tables, functions (incl. handle_new_user → its auth.users trigger drops by dependency), triggers, and policies.
2. **Empty-state proof via pg_catalog** (Addendum requirement): tables=0, public functions=0, policies=0, event trigger gone — written to `proto-06/evidence/R1_wipe_pgcatalog_proof.log`.

**B. Miniature schema** (`proto-06/migrations/` — 5 files, minimal columns, uuid PKs; **RLS ENABLED in the same statement block as each CREATE — zero policies**):
- `p01_accounts.sql` — id, name, owner_user_id uuid FK→auth.users
- `p02_businesses.sql` — id, account_id uuid NOT NULL FK→accounts, name
- `p03_user_businesses.sql` — id, user_id uuid NOT NULL FK→auth.users, business_id uuid NOT NULL FK→businesses, `role text not null default 'member' check (role in ('admin','member'))`, is_primary bool, UNIQUE(user_id,business_id)
- `p04_fact_data.sql` — id, business_id uuid NOT NULL FK→businesses, label text, amount numeric (the two dummy cols)
- `p05_ref_data.sql` — id, code text, value text (NO business_id — platform-shared stand-in)
No user_roles (header item 1). No timestamps/triggers — rig-minimal, not mothership law.

**C. Seed** (`proto-06/scripts/rig-seed.mjs`, service-role via admin API + PROTO06_DB_URL SQL):
- Accounts: **A** (owner_user_id = OwnerTwo) and **B** (owner_user_id = AdminOne)
- Businesses: S1, S2 → account A · S3 → account B
- Identities (fresh auth users, rig-unique emails, created via `auth.admin.createUser`): **OwnerTwo** (junction: admin@S1 + admin@S2 — the multi-store case), **AdminOne** (admin@S3), **MemberOne** (member@S3). Cross-ACCOUNT isolation testable by construction (A-side vs B-side identities).
- `fact_data`: **6,000 synthetic rows** (2k per store, plan-discretion clause; synthetic labels/amounts, zero PHI-shaped content) · `ref_data`: 50 rows.

**D. Harness R1 slice** (`proto-06/harness/` — the transferable attack suite's skeleton):
- `expectations.json` — declarative matrix; R1 edition: 4 identity contexts (OwnerTwo, AdminOne, MemberOne via publishable-key sign-in sessions; + anon) × 5 tables × SELECT and INSERT → **every cell DENIED/empty**.
- `rig-harness.mjs` — signs in as each identity (supabase-js), runs the matrix, one evidence file per run (`R1_totaldeny_<ts>.log`), exits non-zero on any unexpected ALLOW. Config-first (URL/keys from `.env.local`) so BIM-002/BIM-005 can re-point it (brief §6 transferability).
- **R1 GATE = harness output: TOTAL DENY, all cells.** (Landmine check built in: any visible row at this stage = service-role leak in the client wiring — harness asserts it's using the publishable key.)

## (2) File-change list (everything under rig-owned paths ONLY)

`proto-06/migrations/p01–p05.sql` · `proto-06/scripts/rig-reset.mjs` + `rig-seed.mjs` · `proto-06/harness/rig-harness.mjs` + `expectations.json` · `proto-06/evidence/` (R1 logs) · `proto-06/README.md` (run-sheet) — plus protocol writes (session log, RESPONSES) at `agent_docs/` protocol paths. **Untouched:** `src/`, `supabase/`, `scripts/`, `agent_docs/` outside PROTO06+protocol, `.env.local` (FLAG-1 is yours).

## (3) Command sequence

1. `RIG_RESET_ALLOW=yes node proto-06/scripts/rig-reset.mjs wipe` → pg_catalog proof
2. `node proto-06/scripts/rig-reset.mjs migrate` → 5 tables, RLS on, 0 policies (pg_catalog re-proof)
3. `node proto-06/scripts/rig-seed.mjs` → identities + rows (service role)
4. `node proto-06/harness/rig-harness.mjs` → R1 TOTAL-DENY matrix evidence
5. STOP → report R1 board → await R2 authorization (per launch order).

## (4) Out of scope for R1 (said loud)

No policies (R2's), no helper function yet (R2's first red-green), no attack drills (R3), no Storage (post-R3), no EXPLAIN (T-7), no TRANSFERS.md (R5). No git. Zero mothership-path writes.

→ **Awaiting: "plan approved" + FLAG-1 (.env.local line, aws-1 host).**
