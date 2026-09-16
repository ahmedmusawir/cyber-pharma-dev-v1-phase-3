# BIM-002 — X1 GREEN (amended) + X2 A/B DECISION · STOPPED before X3
**Date:** 2026-09-01

---

# PART 1 — X1 RE-RUN: **GREEN**

E-2 applied to `supabase/migrations/0016_rls_helpers.sql`: all three helpers now `revoke execute … from public`, each with a one-line divergence comment citing ERRATUM E-2, followed by `grant … to authenticated`. Re-run in full against the amended AC8.

**Evidence:** `evidence/X1_AC8_helper_shape_AMENDED_2026-09-01.log`

| Amended AC8 check | Result |
|---|---|
| 3/3 helpers present, `prosecdef=true`, `provolatile='s'`, `proconfig` has `search_path=""` | ✅ |
| **Raw ACL shows NO bare `=X/` entry (PUBLIC lacks EXECUTE — the mechanism)** | ✅ `{postgres=X/postgres, authenticated=X/postgres, service_role=X/postgres}` on all three |
| anon lacks EXECUTE | ✅ false on all three |
| authenticated holds EXECUTE | ✅ | 
| service_role holds EXECUTE | ✅ |
| Live probe: impersonated anon | ✅ **DENIED `42501`** |
| Live probe: impersonated authenticated w/ real `auth.uid()` | ✅ all three execute, return `false` with no membership |
| Policy count unchanged | ✅ 3 baseline, 0 new |

**X1 VERDICT: GREEN.** ERRATUM E-2 marked RATIFIED and APPLIED. Port source (`proto-06/policies/`, `proto-06/scripts/`) left untouched per ruling — corrected text lives only in `0016` and, at close, `RLS_TEMPLATES.md`.

---

# PART 2 — X2 A/B: **B adopted for tenant SELECT** — with a discovery that outranks the timings

**Decision file (AC16):** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X2_AB_DECISION.md`
**Raw:** `evidence/X2_AB_explain_CORRECTED_2026-09-01.log` (valid) · `evidence/X2_AB_explain_2026-09-01.log` (invalidated, retained) · `evidence/X2_ab_ids.json`
**Volume:** 100,000 `user_data` rows (target met) · 66,667 visible to the probe · time-box ~35 min of 60

## 2.1 The first A/B run was invalid, and that is the finding

Run 1 showed B at 10 ms — apparently 160× faster. **It was returning zero rows.** `SubPlan 1 → One-Time Filter: false`. B's inline subquery reads `user_businesses`, which then had RLS on and **zero policies**; evaluated as the invoker, it was blinded by the junction's own RLS, so **B silently denied everything**.

Same family as F-1 — a silent, error-free wrong answer — polarity reversed: F-1 permits nothing on writes; this denies everything on reads. A is immune because the helper is SECURITY DEFINER (that is what F-5 buys). **B has no shield: it inherits the junction's policy state.**

Run 2 was performed with the junction self-visibility policy in place (the exact text `0017` will carry), and **row-count parity was asserted before any timing was compared** — 66,667 / 33,333 identical on both formulations.

## 2.2 Valid results (warm median, cold discarded, 3 runs)

| Shape | A — helper | B — inline | Winner |
|---|---|---|---|
| Unqualified | **1,660.5 ms**, 101,640 buffers | **30.9 ms**, 1,641 buffers | **B 53.8×** |
| `where business_id = $1` | **562.8 ms**, 35,001 buffers | **18.5 ms**, 1,669 buffers | **B 30.3×** |

A calls the DEFINER function **once per candidate row** (66,667 junction probes); B hashes the subquery **once**. The rig's T-7 extrapolation (125 ms @ 6k → ~2 s @ 100k) is confirmed by A's 1.66 s. Tie-break (≤10% keeps A) does not apply.

## 2.3 The decision

**B for tenant SELECT predicates** (`user_data`, `report_files`, `businesses`) — on the evidence, as R-B directs.
**A retained deliberately** for: `is_admin_of` role-gated writes (few rows, no cost, R-B says retain) · `is_account_member` for `accounts`/`subscriptions` (its inline form would depend on **two** policies — doubly fragile) · INSERT/UPDATE `WITH CHECK` (write legality shouldn't hinge on read visibility).

## 2.4 Hardening that ships with B (mandatory, in this module)

1. **Ordering law extended:** helpers → **junction SELECT** → other SELECTs → writes. **Renumbering, zero cost since nothing else is built:** `0016` helpers · **`0017` user_businesses** · `0018` accounts · `0019` businesses · `0020` subscriptions · `0021` user_data · `0022` report_files · `0023–0027` reference ×5.
2. **Assert-then-create hardened:** every B-formulated migration asserts a SELECT policy exists on `user_businesses` and `RAISE EXCEPTION`s otherwise — silent failure becomes loud.
3. **`policy-check.mjs` gains a rule:** any policy body containing the inline junction subquery requires a SELECT policy on `user_businesses`; checked after every landing beside one-per-op and SELECT-before-write.

## 2.5 Residue / state

All temp policies dropped, A/B data deleted; scratch verified back to post-X1 state (0 rows, 3 baseline policies, 3 helpers intact). Nothing from the measurement survives into X3.

## 2.6 Carried to close

**F-11** (with F-10) for TRANSFERS §1 + FINDINGS: *"An inline junction subquery in an RLS policy is invoker-evaluated and silently blinded by the junction's own RLS — 30–54× faster than the DEFINER helper, but only correct while the junction's self-visibility policy exists."* BIM-005 inherits this template choice. **AC17 satisfied** (Index Scan on the qualified read, 18.5 ms). The app-query rule is reinforced, not retired: even under B the unqualified read scans the table.

---

**Standing:** zero git · `.env.local` untouched · no credential value in any command, log, or document · dev backend never touched · scratch only.

→ **STOPPED before X3.** Awaiting acknowledgement of the X2 decision and of the renumbering in §2.4.1.
