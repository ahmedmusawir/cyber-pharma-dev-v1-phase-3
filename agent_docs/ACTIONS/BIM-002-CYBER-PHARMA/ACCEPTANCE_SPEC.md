# BIM-002-CYBER-PHARMA — ACCEPTANCE SPEC

> **Lifecycle:** SEEDED (Architect, 2026-08-31) → **ENGINEER EVIDENCE-FILLED (2026-09-01)** → QA-VERIFIED
> **Certified SHA:** _(pinned by the Director after per-concern commits; certification runs against it)_
> **Branch (disk at engineering close):** `phase-3-bim002`
> **Errata governing this spec:** `ERRATUM.md` **E-6** AC3(b) denial-shape wording, applied 2026-09-02 at PRE-Q (spec prose only; implementation stood) · **E-1** policy count = 15 new / 18 total · **E-2 + E-4** helper grants revoke from BOTH `public` and `anon`; **AC8 amended** to assert PUBLIC and anon separately · **E-3 AC13 STRUCK** · **E-5** AC8 evidence valid only after a from-scratch apply; formulation **C** adopted for tenant SELECT and `my_business_ids()` is a fourth helper under AC8.
> **Prose re-read against E-1…E-5 before handoff:** done. Every AC below reflects the ruled state; nothing was weakened, and no requirement was added or removed.
> **All evidence:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/`
> **Traceability:** map v1.1 §4 AC1–AC6 (as amended by the patch header) · Proto 06 TRANSFERS §1–§3 · Director rulings R-A…R-E (manager §4.1)
> **Verdict channel:** Sol's five-word vocabulary only. Engineer self-assessment never merges a module.

Every AC below is verified on the **scratch throwaway** unless stated otherwise. The dev backend is never touched (LIVE APPLY DEFERRED).

---

## A. Isolation (the mission)

**AC1 — Tenant matrix.** ownerA sees rows for A1 and A2 only; staffA sees A1 only; ownerB sees B1 only; multiStore sees A1 and B1 and nothing else; anon sees zero rows on every table. Evidence: harness matrix run, all cells green, unique evidence file. _(map AC1)_

**AC2 — Live-session revocation (R-C).** multiStore signed in, sees A1 and B1 rows; service role deletes the `(multiStore, B1)` junction row; the SAME session re-queries without token refresh; B1 rows are gone immediately, A1 rows remain. Evidence: harness case log + service-role ground truth of the junction state. _(closes Proto 06 N-3; map AC2)_

**AC3 — Spoof drills rejected at the DB layer.** (a) INSERT into `user_data` with a foreign `business_id` → `42501`; (b) UPDATE re-homing an accessible `user_data` row to a foreign `business_id` by a member of the row's store → `42501` (WITH CHECK rejection), ground truth: `business_id` unchanged. UPDATE targeting an unreachable row (no membership of the row's store) → 0 affected, no error (USING denial), ground truth unchanged. *(wording per ratified **ERRATUM E-6**, 2026-09-02 — spec prose only; implementation stood)*; (c) self-promotion `user_businesses.role` → `admin` → denied, ground truth `member`; (d) ownerB reads account A by id → 0 rows; (e) ownerB reads subscription A by id → 0 rows. Evidence: attack battery log with per-case ground-truth lines. _(map AC3, extended)_

**AC4 — `accounts` is junction-derived (R-A).** ownerA and staffA and multiStore read account A; ownerB does not; no identity can INSERT/UPDATE/DELETE `accounts`. Grep: zero occurrences of `owner_user_id` in `supabase/migrations/0016*` and later. Evidence: matrix cells + grep output.

**AC5 — Gap-6 held.** Grep: zero occurrences of `user_roles`, `user_metadata`, `raw_user_meta_data`, `profiles` inside any policy or helper body in `supabase/migrations/0016*` and later. Evidence: grep output, boundary-aware (comments excluded — instrument lesson).

---

## B. Structure (the laws)

**AC6 — One permissive policy per operation per table.** `pg_policies` grouped by `(tablename, cmd)` shows no count > 1 across all sixteen tables. Evidence: catalog query output, run after the final landing AND embedded in the one-command proof.

**AC7 — SELECT-before-write (F-1).** For every table holding an INSERT/UPDATE/DELETE policy, a SELECT policy exists AND appears earlier in the same migration file. Evidence: mechanical check output (script), not eyeballing.

**AC8 — Helper shape (F-5).** `pg_proc` for `is_member_of`, `is_admin_of`, `is_account_member`: `prosecdef = true`, `provolatile = 's'`, `proconfig` contains `search_path=`; `anon` lacks EXECUTE, `authenticated` holds it. Evidence: catalog query.

**AC9 — Policy plan realized.** Final `pg_policies` inventory matches the manager §5.2 plan **as confirmed at X0** (tenant-key columns may adjust `apa_memberships`); baseline tables' 3 policies unchanged; `audit_logs`, `pending_registrations`, `storage.objects` carry zero new policies. Evidence: full inventory + diff against the X0-confirmed plan. _(No literal count stated here — ERRATUM-Q2 lesson.)_

**AC10 — Reference tables (T-4).** All five reference tables: every authenticated identity reads; INSERT → `42501`; UPDATE/DELETE → 0 affected; anon → 0 rows. Evidence: matrix cells.

**AC11 — Storage untouched (R-E).** `storage.objects` policy inventory identical before and after the chain. Evidence: catalog diff.

---

## C. Harness & reproducibility

**AC12 — One command, twice, identical.** `npm run rls:prove` from an empty scratch, run twice consecutively; both green; evidence files identical modulo timestamps and ids. Evidence: two uniquely-named logs + diff. _(map AC5, first half)_

**AC13 — CI wired.** The harness job exists in the CI configuration and is documented as gated on an `RLS_HARNESS_*` secret set; a dry run (or the job definition + local invocation) is evidenced. Actual cloud execution is the Director's (credential boundary). _(map AC5, second half)_

**AC14 — Clean replica.** Chain 0001–00NN applies cleanly on a second throwaway pre-loaded with the exact 2-table/3-policy baseline; catalog matches the scratch's. Evidence: X6 log.

**AC15 — Volume assertions are count-based (F-2).** No harness assertion infers "all rows" from an un-counted `.select()`; `{ count: 'exact', head: true }` or pagination used for every volume claim. Evidence: grep of harness source + one example assertion.

---

## D. Performance evidence (informational, required to exist — not a pass/fail on timings)

**AC16 — A/B decision recorded (R-B).** `evidence/X2_AB_DECISION.md` exists with: seeded row count, EXPLAIN (ANALYZE, BUFFERS) for formulations A and B × unqualified and `business_id = $1` reads, the chosen SELECT predicate, and one sentence of rationale. _(map AC6, amended: evidence not gate)_

**AC17 — Index-backed filtered reads.** The `business_id = $1` read on `user_data` shows an Index Scan under the chosen policy. Unqualified-read latency is recorded and routed to the app-query rule (every tenant read carries its own filter). Evidence: EXPLAIN output.

---

## E. Board & fences

**AC18 — Triad green, types unchanged.** build + tsc + full jest pass at baseline and final; `git diff` on `src/types/supabase.ts` vs BIM-001 certified state is empty. Evidence: logs + diff.

**AC19 — Admin-client fence.** Grep: zero `createAdminClient` (or equivalent service-role client construction) outside seed/system paths; the harness's service-role use is confined to `scripts/rls-harness/` and named in the evidence. _(map AC4)_

**AC20 — Templates on disk.** `agent_docs/AUTHORITY/RLS_TEMPLATES.md` contains the helper SQL and one template per pattern (T-1, T-2, T-3, T-4, T-5, R-A) matching the migration text byte-for-byte for the SQL bodies. Evidence: diff.

---

---

# ENGINEER EVIDENCE (2026-09-01)

Unless stated, every result below appears in **both** X5 runs (scratch, twice from empty) **and** the X6 run (clean replica) — three independent from-scratch proofs.

| AC | Verdict | Evidence |
|---|---|---|
| **AC1** tenant matrix | ✅ **320/320 cells** green, all five identities × sixteen tables × four ops | `X5-matrix_*.log`, `X6-matrix` inside `X6_prove_replica_2026-09-01T0725.log`, `X4-matrix_2026-09-01T0649.log` |
| **AC2** live-session revocation (R-C) | ✅ **PROVEN** — token asserted byte-identical; B1 → 0 immediately, A1 intact; **re-grant equally immediate** | `X4_revocation_2026-09-01T0649.log`, repeated in every `*_prove_*` run |
| **AC3** spoof drills | ✅ all five named cases + 23 more: **28 cases, 0 breaches, 0 ground-truth mismatches** | `X4_attacks_2026-09-01T0649.log` — (a) A2.1 `42501` · (b) **two shapes, both evidenced (E-6):** A3.1 accessible-row re-home → `42501` (WITH CHECK) · A2.2 unreachable-row UPDATE → 0 affected, no error (USING); `business_id` unchanged in both · (c) A5.1 self-promotion refused, role still `member` · (d) A1.1 account A → 0 rows · (e) A1.2 subscription A → 0 rows |
| **AC4** `accounts` junction-derived | ✅ ownerA/staffA/multiStore read account A; ownerB does not; **A6.1–A6.3 prove the owner cannot INSERT/UPDATE/DELETE their own account**; grep: zero `owner_user_id` in `0016+` policy/helper bodies | `X4_attacks_*.log` §A6, `X4_scoping_*.log`, X7 grep |
| **AC5** Gap-6 held | ✅ boundary-aware grep (comments stripped) over `0016–0027`: **zero** `user_roles`/`user_metadata`/`raw_user_meta_data`/`profiles`/`owner_user_id` in any policy or helper body; `policy-check` law **L4** re-asserts it against `pg_catalog` after every landing | X7 grep output; `X3_final_policy_inventory.log` |
| **AC6** one permissive policy per op per table | ✅ **18 table×op groups, none > 1** — checked after **every** landing, and embedded as stage 4 of `rls:prove` | `X3_final_policy_inventory.log`, every `*_prove_*.log` |
| **AC7** SELECT-before-write | ✅ mechanical, two ways: catalog (no write policy on a table lacking SELECT) **and migration file order** (SELECT statement precedes any write statement in the same file) | `policy-check.mjs` law **L2**, output in every `*_prove_*.log` |
| **AC8** helper shape *(amended by E-2/E-4/E-5)* | ✅ four helpers `prosecdef=true`, `provolatile='s'`, `proconfig` has `search_path=`; ACL shows **no bare `=X/` (PUBLIC) and no `anon=X`**; anon denied at execution `42501`; **asserted after a from-scratch apply, twice on two targets** | `X5_ac8_fresh_*.log` (×3 runs), `X1_AC8_four_helpers_FINAL_2026-09-01.log` |
| **AC9** policy plan realized | ✅ **18 policies = 15 new + 3 baseline untouched**, matching the X0-confirmed plan (E-1). `apa_memberships` deny-all per X0 tenant-key finding; `pending_registrations`, `audit_logs`, `storage.objects` carry zero new policies | `X3_final_policy_inventory.log`, `X0_catalog_2026-09-01.log` |
| **AC10** reference tables | ✅ all five: every authenticated identity reads; INSERT → `42501`; UPDATE/DELETE → 0 affected; anon → 0 rows | matrix cells + `X4_attacks_*.log` §A7 |
| **AC11** storage untouched | ✅ `storage.objects` policy count **0 before and after, on both targets**; zero buckets | X0 catalog (before) vs X7 check (after), both targets |
| **AC12** one command, twice, identical | ✅ `npm run rls:prove` twice from empty scratch; raw diff = **4 lines** (2 timestamps, 1 generated uuid, 1 session token); **normalised diff byte-identical** | `X5_prove_…T0654.log` / `…T0656.log` + `.normalised.log` twins |
| ~~**AC13** CI wired~~ | **STRUCK** by Director ruling (ERRATUM **E-3**) — no CI in this module, no `.github/` created. Routed to the Deferred Ledger; the harness ships as the `rls:prove` npm task only | `ERRATUM.md` E-3 |
| **AC14** clean replica | ✅ replica `ihgcsrypblqkwommrkgj` wiped → bootstrapped → **catalog matched `DB_BASELINE.md` before the chain** → chain 0001–0027 → full pipeline **ISOLATION PROVEN**; catalog matches the scratch's | `X6_bootstrap_catalog_match.log`, `X6_prove_replica_2026-09-01T0725.log` |
| **AC15** count-based volume assertions | ✅ every volume claim uses `{ count: 'exact', head: true }`; no assertion infers "all rows" from an un-counted `.select()` | `lib/verdict.mjs::groundTruthCount`, `scoping.mjs`, `attacks.mjs` |
| **AC16** A/B decision recorded | ✅ decision file with seeded volume (100,000 rows), EXPLAIN for **three** formulations × two shapes, chosen predicate, rationale — plus §7 recording the C measurement and the shield test | `X2_AB_DECISION.md`, `X2_AB_explain_CORRECTED_2026-09-01.log` |
| **AC17** index-backed filtered read | ✅ `where business_id = $1` on `user_data` → **Index Scan** using `idx_user_data_business_id`, 18.3 ms under the chosen predicate; unqualified-read cost recorded and routed to the app-query rule | `X2_AB_DECISION.md` §7, `X2_AB_explain_CORRECTED_*.log` |
| **AC18** triad green, types unchanged | ✅ build 22 routes · `tsc --noEmit` clean · jest **28 suites / 128 tests / 0 failures** (identical to the BIM-001 baseline) · **`git diff` on `src/types/supabase.ts` vs certified `9f8c80d`: EMPTY** | X7 board output |
| **AC19** admin-client fence | ✅ BIM-002 introduced **exactly one** service-role construction site: `scripts/rls-harness/lib/db.mjs`. Pre-existing app-side sites (`src/utils/supabase/admin.ts`, `src/app/moose-portal/**`) are **inherited and untouched** — `git diff HEAD` on them is empty. **Zero `src/**` writes in this module** | X7 grep + `git status --short` |
| **AC20** templates on disk | ✅ `agent_docs/AUTHORITY/RLS_TEMPLATES.md` — four helpers (E-4 form), T-1 (C form), T-2, T-3, T-4, T-5, R-A, deny-all section, and B documented as the anti-pattern with its shield-test table. SQL bodies byte-identical to the migrations | `RLS_TEMPLATES.md` vs `supabase/migrations/0016–0027` |

**Engineer self-assessment is not a verdict.** Sol's five-word vocabulary decides.

## Out of contract (do not test, do not fail on)

- Browser/SSR cookie session behavior → BIM-005 (Proto 06 N-2)
- Storage bucket isolation → Proto 01 (N-1)
- Audit trail → BIM-003
- Behavior on the dev backend → Phase 3 APPLY SESSION
- Exploratory findings outside these ACs → findings ledger, non-blocking

---

## Evidence conventions

Unique filenames per test (`evidence/<gate>_<ac>_<slug>_<timestamp>.log`); runners resolve repo root and fail closed; all catalog reads via `pg_catalog`; no credential value in any evidence file; attestation and observation labeled distinctly.

🥄
