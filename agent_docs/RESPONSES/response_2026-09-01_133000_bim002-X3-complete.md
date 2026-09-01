# BIM-002 — X3 COMPLETE: 11 policy files landed red→green, laws held after every one
**Date:** 2026-09-01 · **STOPPED before X4**

## 1. Per-file red/green ledger

Machine-driven ritual (`scripts/rls-harness/x3-red-green.mjs`): flip that step's expectation cells to ALLOW → run the full 320-cell matrix → **must be RED** (abort if green, because a policy that never went red proves nothing) → apply the migration → run the matrix again → **must be GREEN** → run `policy-check` → all four laws. Any deviation stops the driver.

Ledger: `evidence/X3_red_green_ledger.json` · all logs in `evidence/`

| # | Migration | RED evidence | GREEN evidence | Laws |
|---|---|---|---|---|
| 01 | `0017_rls_user_businesses.sql` | `X3-01-…-RED_…0625.log` | `X3-01-…-GREEN_…0625.log` | ✅ |
| 02 | `0018_rls_accounts.sql` | `X3-02-…-RED_…0626.log` | `X3-02-…-GREEN_…0626.log` | ✅ |
| 03 | `0019_rls_businesses.sql` | `X3-03-…-RED_…0626.log` | `X3-03-…-GREEN_…0626.log` | ✅ |
| 04 | `0020_rls_subscriptions.sql` | `X3-04-…-RED_…0626.log` | `X3-04-…-GREEN_…0627.log` | ✅ |
| 05 | `0021_rls_user_data.sql` | `X3-05-…-RED_…0627.log` | `X3-05-…-GREEN_…0627.log` | ✅ |
| 06 | `0022_rls_report_files.sql` | `X3-06-…-RED_…0628.log` | `X3-06-…-GREEN_…0628.log` | ✅ |
| 07 | `0023_rls_aac_reference.sql` | `X3-07-…-RED_…0628.log` | `X3-07-…-GREEN_…0628.log` | ✅ |
| 08 | `0024_rls_wac_reference.sql` | `X3-08-…-RED_…0628.log` | `X3-08-…-GREEN_…0628.log` | ✅ |
| 09 | `0025_rls_ful_reference.sql` | `X3-09-…-RED_…0629.log` | `X3-09-…-GREEN_…0629.log` | ✅ |
| 10 | `0026_rls_pbm_info.sql` | `X3-10-…-RED_…0629.log` | `X3-10-…-GREEN_…0629.log` | ✅ |
| 11 | `0027_rls_reference_dataset_versions.sql` | `X3-11-…-RED_…0629.log` | `X3-11-…-GREEN_…0630.log` | ✅ |

Baseline before any landing: `X3-step-00-baseline_…0623.log` — **320 cells GREEN with only the three baseline policies granting anything** (deny-by-default re-proven at the module's own starting line).

Laws checked after **every** landing: **L1** one permissive policy per operation per table · **L2** SELECT-before-write (catalog *and* migration file order) · **L3** junction-first · **L4** Gap-6 (no policy or helper reads `user_roles`/`profiles`/metadata/`owner_user_id`).

## 2. Final policy inventory — `evidence/X3_final_policy_inventory.log`

**18 rows in `pg_policies`: 15 new + 3 baseline untouched — exactly E-1's ruled count.**

| Table | Policies |
|---|---|
| `accounts` | SELECT `account_select_member` |
| `businesses` | SELECT `business_select_member` · UPDATE `business_update_admin` |
| `user_businesses` | SELECT `ub_select_self` |
| `subscriptions` | SELECT `subscription_select_account_member` |
| `user_data` | SELECT · INSERT · UPDATE · DELETE (`…_member` ×3, `…_delete_admin`) |
| `report_files` | SELECT `report_files_select_member` |
| `aac/wac/ful_reference`, `pbm_info`, `reference_dataset_versions` | SELECT `…_select_authenticated` ×5 |
| `user_roles`, `profiles` | the 3 baseline policies, **unchanged** |
| `apa_memberships`, `pending_registrations`, `audit_logs` | **zero — deny-all by design** |
| `storage.objects` | **zero — untouched (R-E)** |

## 3. Row-level scoping — `evidence/X3_row_scoping_check.log`

Allow/deny is not isolation; *which rows* is. Seeded 200 `user_data` rows per store:

| Identity | Rows | Stores | Accounts |
|---|---|---|---|
| ownerA (admin A1+A2) | **400** ✅ | Store A1, Store A2 | Account A |
| staffA (member A1) | **200** ✅ | Store A1 | Account A |
| ownerB (admin B1) | **200** ✅ | Store B1 | Account B |
| multiStore (member A1+B1) | **400** ✅ | Store A1, Store B1 | **Account A, Account B** |
| anon | **0** ✅ | — | — |

Exact, with no cross-tenant bleed and correct multi-account resolution — measured **after two consecutive full matrix runs**, so it doubles as the idempotence proof.

## 4. Two defects the gate surfaced (both fixed, both in the harness, none in the policies)

**H-1 — the harness was not idempotent.** The first row-scoping check read 426 rows where 400 were seeded. Cause: a probe whose INSERT is permitted but DELETE denied (staffA, multiStore on `user_data`) leaves its row behind, and a permitted UPDATE renames a seeded row for good — `Store A1` had become `probe-upd`. Fix: the harness now tracks every row it creates and, at end of run, service-role-deletes what its own DELETE probe could not, and restores seeded rows a permitted UPDATE mutated (`payloads.restore`). Re-verified: two consecutive runs, counts exactly 400/200/200/400/0, `Store A1` intact.

**H-2 — `accounts.owner_user_id` has no `ON DELETE CASCADE`, and it broke the seed reset.** `auth.admin.deleteUser` returns *"Database error deleting user"* for any identity owning an `accounts` row, so the purge died half-way and left orphaned identities whose sign-in then **failed silently**, causing queries to run as `anon` (which is exactly how it first showed up: multiStore reading 0 rows). Fix: the reset deletes public data **before** the auth purge — order is load-bearing and now commented as such.

> **Schema observation for the ledger (not BIM-002's to change):** `accounts.owner_user_id` blocking auth-user deletion is a real operational property — in production you cannot delete an account owner's identity without first reassigning or removing the account. Worth a deliberate decision in BIM-004/Phase 4 onboarding, not a surprise. Recorded as a carried flag.
>
> **Instrument note:** `harness.mjs` fails closed on a sign-in error; the ad-hoc scoping script I first wrote did not, which is why the orphan presented as "0 rows" rather than "sign-in failed". The scoping check now asserts sign-in explicitly. Fourth instrument defect this campaign — the pattern holds.

## 5. Deliverables added this gate

`scripts/rls-harness/` — `lib/env.mjs` (prefix-generalized `loadEnv`, A-1 fallback, publishable≠secret guard) · `lib/db.mjs` (the only service-role construction site — AC19 fence) · `lib/verdict.mjs` (F-4 deny semantics + ground-truth helper) · `expectations.json` · `payloads.mjs` · `seed.mjs` (cast + FK-safe reset + a row in all sixteen tables so no DENY is vacuous) · `harness.mjs` (320 cells, real sessions, self-cleaning) · `policy-check.mjs` (L1–L4) · `x3-red-green.mjs` (the ritual driver).
`supabase/migrations/0017–0027` — eleven policy files, each with an assert-then-create preamble that refuses to run against the wrong shape and, on the C-formulated files, refuses unless the junction SELECT policy exists (the §2.4.2 hardening).

## 6. Standing

Zero git · `.env.local` untouched · no credential value in any command, log, or document · dev backend never touched · scratch only · `proto-06/` unmodified.

→ **STOPPED before X4.** Next: full matrix + attack battery incl. the R-C live-session revocation case, with every mutation denial ground-truthed.
