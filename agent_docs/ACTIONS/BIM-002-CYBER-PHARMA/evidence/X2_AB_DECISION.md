# X2 — A/B PREDICATE DECISION (R-B)
**Date:** 2026-09-01 · **Scratch:** Proto 06 throwaway (`PROTO06_DB_URL`, pooler `aws-1-us-west-1`) · **Time-box:** 1 hour, used ~35 min
**Raw evidence:** `X2_AB_explain_CORRECTED_2026-09-01.log` (valid run) · `X2_AB_explain_2026-09-01.log` (**invalidated first run — retained deliberately, see §2**) · `X2_ab_ids.json`

## 1. Setup

| Item | Value |
|---|---|
| Seeded volume | **100,000 `user_data` rows** (R-B target met), across 3 stores in 2 accounts |
| Visible to probe identity | 66,667 rows (member of 2 of 3 stores) |
| Probe identity | a leftover Proto 06 `auth.users` row (public-schema wipe does not touch the `auth` schema) — measurement-only, replaced by the real cast at X4 |
| Impersonation | `set_config('request.jwt.claims', …)` + `set local role authenticated` — real `auth.uid()`, because the SQL editor lies about RLS |
| Method | `EXPLAIN (ANALYZE, BUFFERS)` × 2 query shapes × 3 runs; **cold run discarded**, warm median reported |
| Residue | all temp policies dropped; A/B data deleted; scratch returned to post-X1 state (verified: 0 rows, 3 baseline policies, 3 helpers) |

**Formulations**
- **A** — `using (public.is_member_of(business_id))` (SECURITY DEFINER helper)
- **B** — `using (business_id in (select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid()))` (inline subquery, invoker-evaluated)

## 2. ⚠️ The first run was INVALID — and that is the most important finding of this gate

Run 1 appeared to show B at 10 ms, ~160× faster. **It was returning zero rows.** The plan showed `SubPlan 1 → One-Time Filter: false, rows=0`: B's inline subquery reads `public.user_businesses`, which at that moment had **RLS enabled and zero policies**. Evaluated as the *invoker*, the subquery was blinded by the junction's own RLS, so the predicate matched nothing and **B silently denied every row on every table**.

This is the F-1 family — a silent, error-free wrong answer — with the polarity reversed: F-1 was a write policy that silently permits nothing; this is a read policy that silently *denies* everything.

**Mechanism:** formulation A is immune because `is_member_of` is SECURITY DEFINER and reads the junction unrestricted (that is exactly what FINDINGS F-5 is about). Formulation B has no such shield: it inherits whatever the junction's policy state allows the caller to see.

Run 2 was performed with the junction's self-visibility policy in place (the exact text `0017` will carry) — the real production state — and **correctness parity was asserted before comparing timings**: both formulations returned identical row counts (66,667 / 33,333).

## 3. Results (valid run, warm median)

| Query shape | A — helper | B — inline | Winner |
|---|---|---|---|
| Unqualified `select * from user_data` | **1,660.5 ms** · 101,640 buffers · Seq Scan, `Filter: is_member_of(business_id)` | **30.9 ms** · 1,641 buffers · Seq Scan, `Filter: (ANY (business_id = (hashed SubPlan 1).col1))` | **B by 53.8×** |
| Qualified `… where business_id = $1` | **562.8 ms** · 35,001 buffers · Index Scan + per-row filter | **18.5 ms** · 1,669 buffers · Index Scan + hashed subplan | **B by 30.3×** |

Both returned identical rows. Tie-break rule (within ~10% keep A) **does not apply** — the margin is 30–54× and the buffer counts differ by ~62×.

**Why:** A invokes a SECURITY DEFINER function **once per candidate row** (66,667 index probes into the junction — the "junction lookup is a per-row predicate" landmine, measured). B evaluates the junction subquery **once**, hashes the result, and does an in-memory membership test per row. The T-7 extrapolation from the rig (125 ms @ 6k → ~2 s @ 100k) is confirmed almost exactly by A's 1.66 s.

## 4. DECISION

**Formulation B is adopted for tenant SELECT predicates** — on the evidence, as R-B directs.

**Retained on formulation A (helpers), deliberately:**
| Use | Why |
|---|---|
| `is_admin_of` — all role-gated writes (`businesses` UPDATE, `user_data` DELETE) | R-B retains the helper for role-gated writes regardless; write predicates resolve few rows, so the per-row cost is nil (rig measured 0.8 ms for a point UPDATE) |
| `is_account_member` — `accounts`, `subscriptions` SELECT | Its inline equivalent joins `user_businesses` **and** `businesses`, so it would depend on **two** policies instead of one — doubly fragile, and `businesses`' own SELECT policy would narrow it. Keep the DEFINER shield |
| `user_data` / `report_files` INSERT + UPDATE `WITH CHECK` | A row being written should not have its legality decided by what the caller can *see*; the DEFINER helper keeps write authorization independent of read visibility |

Net: **B for the read path on `business_id`-scoped tables; A everywhere else.** Both templates ship in `RLS_TEMPLATES.md` with this rationale, because the choice is per-use, not global.

## 5. MANDATORY hardening that comes with adopting B

B's correctness is **coupled to the junction's own SELECT policy**. Without it, every B-formulated table silently denies everything. Three controls, all in this module:

1. **Ordering law extended (F-8+):** helpers → **junction SELECT** → other SELECTs → writes. The junction policy moves to the **first** policy migration.
   **Renumbering (nothing built yet, zero cost):** `0016` helpers · **`0017` user_businesses SELECT** · `0018` accounts · `0019` businesses · `0020` subscriptions · `0021` user_data · `0022` report_files · `0023–0027` reference ×5.
2. **Assert-then-create hardened:** every B-formulated migration asserts a SELECT policy exists on `public.user_businesses` before creating its own, and `RAISE EXCEPTION`s otherwise. The silent failure becomes a loud one.
3. **`policy-check.mjs` gains a rule:** if any policy body contains the inline junction subquery, a SELECT policy on `user_businesses` must exist — checked after every landing, alongside the one-per-op and SELECT-before-write rules.

## 7. FORMULATION C — measured on Architect ruling · **C ADOPTED, superseding §4**

**C** — `public.my_business_ids() returns setof uuid`, SECURITY DEFINER / STABLE / `search_path=''` / revoked from public **and** anon / granted to authenticated.
Predicate: `using (business_id in (select public.my_business_ids()))`
**Hypothesis (Architect):** the planner evaluates the set-returning function once and hashes it (B's plan shape) while the DEFINER shield removes B's coupling to the junction's policy state. **Both halves proven.**

Same protocol as run 2: junction SELECT policy present, row-count parity asserted before timing, 3 runs, cold discarded, warm median, both shapes, buffers recorded.

### Three-way result

| Metric | A — helper (per-row) | B — inline (invoker) | **C — my_business_ids (DEFINER, set)** |
|---|---|---|---|
| Unqualified | 1,685.1 ms | 29.363 ms | **29.589 ms** — **+0.8% vs B** |
| `where business_id = $1` | 572.7 ms | 18.154 ms | **18.274 ms** — **+0.7% vs B** |
| Buffers (unqualified) | 101,640 | 1,641 | **1,641** — identical |
| Plan shape | `Filter: is_member_of(business_id)`, per-row | `Filter: (ANY (business_id = (hashed SubPlan 1).col1))` | **identical: `(ANY … (hashed SubPlan 1).col1)`, `SubPlan 1 → ProjectSet`, 2 rows, evaluated once** |
| Rows returned | 66,667 / 33,333 | 66,667 / 33,333 | 66,667 / 33,333 — parity asserted |

**Plan shape proven, not merely inferred:** C's plan carries the same `hashed SubPlan 1` node as B, with `ProjectSet` (the set-returning function) executed **once, producing 2 rows** — not 66,667 invocations. The buffer count is the independent confirmation: 1,641 vs A's 101,640.

### Shield test — the decisive discriminator

Junction SELECT policy **dropped**, same probe identity, same data:

| Formulation | Rows visible with NO junction policy | Verdict |
|---|---|---|
| A — helper | 66,667 | ✅ SHIELDED |
| B — inline | **0** | ❌ **BLINDED — silent total deny** |
| **C — my_business_ids** | **66,667** | ✅ **SHIELDED** |

C has A's correctness independence and B's plan shape. **Decision rule satisfied: C is within ~20% of B on both shapes (+0.8% / +0.7%) → C is adopted for tenant SELECT predicates.**

### Revised allocation (supersedes §4)

| Use | Formulation |
|---|---|
| Tenant SELECT on `business_id`-scoped tables (`user_data`, `report_files`, `businesses`) | **C** — `business_id in (select public.my_business_ids())` |
| Role-gated writes (`businesses` UPDATE, `user_data` DELETE) | **A** — `is_admin_of(...)` (R-B retains; write predicates resolve few rows) |
| `accounts` / `subscriptions` SELECT | **A** — `is_account_member(...)` (join-based; keeps the DEFINER shield over two tables) |
| `user_data` / `report_files` INSERT + UPDATE `WITH CHECK` | **A** — `is_member_of(...)` (write legality must not depend on read visibility) |
| **B** | **adopted nowhere** — retained in `RLS_TEMPLATES.md` only as the documented anti-pattern with its shield-test evidence |

`my_business_ids()` joins `0016` as the **fourth helper**; all AC8 assertions apply and pass on a fresh create (`X1_AC8_four_helpers_FINAL_2026-09-01.log`).

### Hardening status

The junction-first ordering (§5.1) and the two assert/check controls (§5.2, §5.3) remain **required by ruling, whichever predicate ships** — and are implemented. Honest note: under C they are **defence-in-depth rather than load-bearing**, because C is no longer coupled to the junction's policy state. They stay because ordering is law and because a future predicate change must not silently reintroduce the coupling.

## 6. Consequences recorded elsewhere

- **New finding F-11** (drafted at close, with F-10): *"An inline junction subquery in an RLS policy is invoker-evaluated and is silently blinded by the junction's own RLS. It is 30–54× faster than the SECURITY DEFINER helper, but only correct while the junction's self-visibility policy exists. The helper is slower and unconditionally correct."* Both belong in TRANSFERS §1 for BIM-005.
- **AC17** satisfied: the `business_id = $1` read shows an **Index Scan** under the chosen predicate (`idx_user_data_business_id`), 18.5 ms.
- **App-query rule stands and is reinforced:** even under B, the unqualified read still scans the whole table. Every application query against a tenant table carries its own `business_id`/date filter. RLS is a security boundary, not a query optimizer.
