# PROTO 06 — R3 BOARD: FINDING-1 FIXED · 32/32 ATTACKS DENIED · STOPPED BEFORE R4
**Date:** 2026-08-31 · evidence: `proto-06/evidence/` · ledger: `proto-06/FINDINGS.md`

## Part 1 — FINDING-1 fix (8th policy, Director-approved)

| Step | Result |
|---|---|
| RED (pre-land) | 4 mismatches: businesses.select ×3 users + businesses.update ×ownerTwo | `R2-T3b_RED.log` |
| Land `t3b_business_select.sql` → `business_select_member` | ok; policy map: businesses SELECT ×1, UPDATE ×1 — **one-per-op law intact** |
| GREEN (post-land) | **80/80 cells, 0 mismatches, zero regressions** | `R2-T3b_GREEN.log` |

**The T-3 resolution, cell by cell:** ownerTwo × businesses × update → **ALLOW (1 UPDATED)** — admin@S1 via junction role. adminOne × businesses × update → DENY. memberOne × businesses × update → DENY. anon → DENY. Role-gated write now provably works *and* provably discriminates.

**Final policy set: 8 singletons.** fact_data S/I/U/D (member) · businesses SELECT (member) + UPDATE (admin) · ref_data SELECT (authenticated) · user_businesses SELECT (self).

## Part 2 — R3 attack battery: 32 cases, 32 DENIED, 0 breaches

`proto-06/evidence/R3_attack_battery_2026-08-31T0603.log`

| Attack | Cases | Result |
|---|---|---|
| **A1 — client-supplied foreign business_id, all write ops** (adminOne@S3/account-B targets S1/account-A: insert, update-by-id, delete-by-id, select-by-id) | 4 | ALL DENIED — insert `42501`, others 0 affected/0 rows |
| **A2 — junction role tampering** (memberOne self-promotes to admin on S3; inserts a fresh admin membership on S1; deletes own junction row) | 3 | ALL DENIED — insert `42501`, update/delete 0 affected |
| **A3 — cross-ACCOUNT probes by direct id** (ownerTwo/account-A reads account-B's business, account row, fact row; updates B's business; reads another user's junction row) | 5 | ALL DENIED — 0 rows/affected on every probe |
| **A4 — anonymous sweep** (no session × 5 tables × S/I/U/D) | 20 | ALL DENIED — inserts `42501`, everything else 0 |

**Persistence verified, not assumed.** "0 affected" is not proof nothing happened, so the role-tampering attack was independently checked against service-role ground truth: memberOne's junction role is **still `member`**, junction row count **still 4** — the escalation persisted nothing. (That verification discipline is now F-4 in the ledger.)

## Part 3 — Findings ledger written (`proto-06/FINDINGS.md`)

- **F-1 ⭐ Write policies require a paired SELECT policy or they silently no-op** — the T-3 discovery, recorded as a first-class transfer lesson with the BIM-002 mandate: *land SELECT before any write policy on every tenant table.* A write policy without its read path passes "is the policy there?" review and fails silently.
- **F-2 PostgREST's 1,000-row default cap** — harness finding: never infer "all rows" from `.select()`; use `{count:'exact'}`; CRV/BIM-005 must paginate or silently validate a slice.
- **F-3** `information_schema` is privilege-filtered → verify via `pg_catalog` (carried from BIM-001).
- **F-4** Deny semantics differ by operation (SELECT: 0 rows silent · INSERT: `42501` · UPDATE/DELETE: 0 affected silent) — harnesses checking only for errors will miss denials; mutation attacks need ground-truth confirmation.
- **F-5** SECURITY DEFINER is mandatory for the membership helper, not stylistic — a SECURITY INVOKER helper would read the junction under the caller's own T-5 restriction and collapse every policy to "myself only."
- **F-6** Drop the `ensure_rls` event trigger before any schema wipe (carried, applied).
- **F-7** Junction self-visibility must use `auth.uid()` directly, never the helper (self-reference).

## Standing

Gap-6 held throughout: every policy reads the junction or `auth.uid()`; **zero policies consult `user_roles`** (which doesn't exist on the rig) or any metadata; no superadmin policy was needed or written. No scenario asked for one.

**STOPPED before R4** (harness rerun clean from scratch: drop + rebuild + full suite in one command). Awaiting authorization.
