# PROTO 06 — R2 BOARD: T-1..T-6 LANDED · ONE OPEN FINDING (T-3) · STOPPED BEFORE R3
**Date:** 2026-08-31 · evidence: `proto-06/evidence/R2-*` (RED + GREEN per policy)

## Per-policy ledger (red→green around every landing)

| # | Policy (file) | Table.op | RED (pre-land) | GREEN (post-land) | Regressions |
|---|---|---|---|---|---|
| 0 | `h0_helpers.sql` — `is_member_of` / `is_admin_of` (SECURITY DEFINER, `search_path=''`, STABLE, junction-only, anon-revoked) | — | n/a | matrix unchanged: 80/80 still deny (no-drift proof) | 0 |
| 1 | `t1_fact_select.sql` → `fact_select_member` | fact_data.SELECT | 3 mismatches (the 3 users, exactly as predicted) | 80/80 ✅ — each user sees only their stores' rows | 0 |
| 2 | `t2a_fact_insert.sql` → `fact_insert_member` (WITH CHECK) | fact_data.INSERT | 1 mismatch (ownerTwo) | 80/80 ✅ — **adminOne/memberOne inserting into S1 stay 42501: foreign business_id rejected by the database** (early spoof proof) | 0 |
| 3 | `t2b_fact_update.sql` (USING + WITH CHECK) | fact_data.UPDATE | 1 mismatch | 80/80 ✅ | 0 |
| 4 | `t2c_fact_delete.sql` (USING) | fact_data.DELETE | 1 mismatch | 80/80 ✅ (harness self-cleans via its own probe row) | 0 |
| 5 | `t3_business_update_admin.sql` → `business_update_admin` (is_admin_of) | businesses.UPDATE | 1 mismatch | **STILL RED — FINDING-1, held for ruling (below)** | 0 |
| 6 | `t4_ref_select.sql` → `ref_select_authenticated` | ref_data.SELECT | 3 mismatches | 80/80 ✅ — authenticated read; **writes stayed locked for all** (service-role-only writer proven by omission) | 0 |
| 7 | `t5_junction_self_select.sql` → `ub_select_self` (`auth.uid()` direct — helper here would be circular) | user_businesses.SELECT | 3 mismatches | 80/80 ✅ — **ownerTwo sees exactly 2 rows, adminOne 1, memberOne 1, anon 0** | 0 |
| 8 | T-6 service-role bypass (NO policy — demonstration) | all 5 tables | n/a | service key reads all rows cross-tenant (2/3/4/6004/50). Fencing rule recorded: server-side only, always audited, never a policy substitute | 0 |

**One-policy-per-op law:** enforced mechanically after every landing (`rig-policy.mjs` fails on any table+op count >1). Final map: 7 permissive policies, all singletons. Zero violations, zero STOP events under that rule.

## 🔴 FINDING-1 — T-3 landed but unreachable: UPDATE needs SELECT visibility (needs Director ruling)

`business_update_admin` (USING/WITH CHECK `is_admin_of(id)`) is on the table and correct — but ownerTwo's UPDATE still affects 0 rows. **Mechanism (confirmed):** Postgres applies SELECT-read semantics to rows referenced by an UPDATE's WHERE clause; `businesses` has NO select policy, so no row is readable, so the UPDATE's `WHERE id = S1` matches nothing. Corroboration in evidence: all identities' `businesses × select → 0 rows`, policy present in pg_policies, matrix red only on that one cell.

**This is a first-class transfer lesson:** *a write policy without a read path is dead code — role-gated UPDATE requires a paired SELECT policy (different operation, so the one-per-op law is untouched).* BIM-002 must know this or half its write policies will silently no-op.

**Proposed fix (your call, not built):** `business_select_member` — T-1 pattern on businesses (`for select to authenticated using (public.is_member_of(id))`). One new SELECT policy; expectation flips: all 3 users see their own stores; T-3's update cell then goes green for ownerTwo (admin@S1), stays denied for adminOne/memberOne against S1. It's an unplanned 8th policy beyond the T-1..T-6 list — per flag-first culture I held T-3 RED (expectation reverted, annotated in `expectations.json`) rather than build unapproved scope.

## Evidence-reading notes (so nothing in the logs surprises anyone)

- `fact_data = 6004` at T-6: 6,000 seed + 4 probe rows accumulated during the T-2a→T-2c window (insert policy live before delete policy; the harness self-cleans once delete landed). Explained, not drift.
- T-6's "span 1 distinct businesses" line: PostgREST's default 1,000-row response cap truncated the sample to the first store's block; the per-table exact counts above it are the real cross-tenant proof. Harness note carried to TRANSFERS (max-rows cap is itself a finding worth recording).

## STOPPED — awaiting: (a) FINDING-1 ruling, (b) R3 authorization

R3 = the attack battery (client-supplied foreign business_id beyond the T-2a case, tampered role value, cross-account probes by id, anon sweep) — all expected DENIED with evidence.
