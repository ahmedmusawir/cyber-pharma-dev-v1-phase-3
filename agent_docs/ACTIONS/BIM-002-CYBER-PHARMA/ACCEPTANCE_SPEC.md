# BIM-002-CYBER-PHARMA — ACCEPTANCE SPEC

> **Lifecycle:** **SEEDED** (Architect, 2026-08-31) → ENGINEER EVIDENCE-FILLED → QA-VERIFIED
> **Certified SHA:** _(pinned by the Director after per-concern commits; certification runs against it)_
> **Branch:** _(resolved from disk at PRE-Q; never pre-named)_
> **Traceability:** map v1.1 §4 AC1–AC6 (as amended by the patch header) · Proto 06 TRANSFERS §1–§3 · Director rulings R-A…R-E (manager §4.1)
> **Verdict channel:** Sol's five-word vocabulary only. Engineer self-assessment never merges a module.

Every AC below is verified on the **scratch throwaway** unless stated otherwise. The dev backend is never touched (LIVE APPLY DEFERRED).

---

## A. Isolation (the mission)

**AC1 — Tenant matrix.** ownerA sees rows for A1 and A2 only; staffA sees A1 only; ownerB sees B1 only; multiStore sees A1 and B1 and nothing else; anon sees zero rows on every table. Evidence: harness matrix run, all cells green, unique evidence file. _(map AC1)_

**AC2 — Live-session revocation (R-C).** multiStore signed in, sees A1 and B1 rows; service role deletes the `(multiStore, B1)` junction row; the SAME session re-queries without token refresh; B1 rows are gone immediately, A1 rows remain. Evidence: harness case log + service-role ground truth of the junction state. _(closes Proto 06 N-3; map AC2)_

**AC3 — Spoof drills rejected at the DB layer.** (a) INSERT into `user_data` with a foreign `business_id` → `42501`; (b) UPDATE re-homing a `user_data` row to a foreign `business_id` → 0 affected, ground truth unchanged; (c) self-promotion `user_businesses.role` → `admin` → denied, ground truth `member`; (d) ownerB reads account A by id → 0 rows; (e) ownerB reads subscription A by id → 0 rows. Evidence: attack battery log with per-case ground-truth lines. _(map AC3, extended)_

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
