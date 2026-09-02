# BIM-002-CYBER-PHARMA — THE MANAGER
## RLS Policy Campaign: Isolation Becomes Database Law

> **Status:** 📋 **FINAL — 2026-08-31 · Awaiting Director review → Claudy launch**
> **Launch condition:** launch-line prerequisite (§9) mechanically confirmed by the Director on branch `phase-3-bim002`.
> **Module type:** BIM (Backend Integration Module) · **Campaign:** Phase 3 BIM Campaign, module 4 of 7
> **Governed by:** BIM_PLAYBOOK v1.0 · PHASE_3_BIM_CAMPAIGN_MAP v1.1 (§4 + patch header) · SOFTWARE_FACTORY_PLAYBOOK › Module Identity & QA Handoff
> **Authority home:** `agent_docs/AUTHORITY/` (precedence README governs) · Proto 06 transfers at `agent_docs/ACTIONS/PROTO06/TRANSFERS.md` + `FINDINGS.md`
> **Branch:** identity resolved from disk at PRE-Q per doctrine — expected `phase-3-bim002`, never asserted here
> **Repo:** cyber-pharma-dev-v1-phase-3 · **Mainline:** `main`

---

## 1. MISSION (one sentence)

Stamp the Proto 06 blessed policy template across every tenant-scoped table in the sixteen-table schema, land the isolation harness as a permanent repo script, and prove — on throwaway databases only — that no authenticated identity can read or write a row outside the stores it is a junction member of.

---

## 2. VERIFIED GROUND (build on this WITHOUT re-verification)

| Fact | Provenance |
|---|---|
| Sixteen-table chain `supabase/migrations/0001–0015` certified at `9f8c80d`; every table born with RLS enabled and zero permissive policies | BIM-001 CLOSED (Gate Q PASS, zero rework) |
| Baseline tables `user_roles` + `profiles` carry 3 pre-existing policies (setup.sql + profiles overlay) — untouched by BIM-001 | agent_docs/DB_BASELINE.md · BIM-001 X0 |
| `update_updated_at()` created idempotently by the chain; `rls_auto_enable()` event trigger present | BIM-001 ERRATUM E-1/E-2 |
| Junction `user_businesses.role TEXT CHECK ('admin','member')`; UNIQUE `(user_id, business_id)` | BIM-001 R-3 (Gap-6 RATIFIED) |
| `businesses.account_id NOT NULL` → `accounts`; `subscriptions.account_id` (not business_id) | BIM-001 R-2 |
| Eight Proto 06 policies proven: 80-cell matrix, 32-case attack battery, twice-from-scratch identical | TRANSFERS.md §1–§2 |
| Helper shape: `SECURITY DEFINER` + `set search_path = ''` + `STABLE` + fully-qualified + `revoke from anon` | TRANSFERS §1.0 · FINDINGS F-5 |
| A write policy without a paired SELECT policy silently no-ops (0 affected, no error) | FINDINGS F-1 ⭐ |
| Deny shapes: SELECT → 0 rows · INSERT → `42501` · UPDATE/DELETE → 0 affected, no error | FINDINGS F-4 |
| PostgREST caps `.select()` at 1,000 rows silently; use `{ count: 'exact', head: true }` | FINDINGS F-2 |
| Verification reads `pg_catalog` / `pg_policies`, never `information_schema` | FINDINGS F-3 |
| Drop `ensure_rls`/`rls_auto_enable` event trigger BEFORE any schema wipe | FINDINGS F-6 |
| Junction self-visibility uses `user_id = auth.uid()` directly, never the helper | FINDINGS F-7 |
| Unqualified tenant read at 6k rows: Seq Scan, 125 ms; qualified read: Index Scan, 42 ms | TRANSFERS §4 (T-7) |
| Session pooler host generation is **`aws-1-us-west-1`** (`aws-0` → tenant not found) | Proto 06 retrospective #2 · BIM-001 evidence |
| Board green at BIM-001 close: build + tsc + jest 28 suites / 128 tests / 0 fail | BIM-001 X7 |
| Dev backend is at the 2-table baseline and STAYS THERE through BIM-004 | LIVE APPLY DEFERRED (Director, 08-31) |

**Disk > docs > memory.** X0 confirms the scratch database matches the sixteen-table catalog before any policy is authored.

---

## 3. WHY THIS MODULE EXISTS

BIM-001 built sixteen locked drawers. Nothing in OwedBook can read a row. This module hands the database the rules that unlock them — tenant by tenant, operation by operation — so that isolation is enforced by Postgres, not by application discipline. BIM-003 audits on top of these rules; BIM-004 seeds through them; BIM-005 reads through them for the phase gate. Every policy authored here is permanent production code, certified on throwaways.

---

## 4. BINDING RULINGS

### 4.1 Director rulings, Part 4 pre-flight (2026-08-31)

**R-A — `accounts` access pattern (closes Proto 06 N-6).** Read-only for any user holding a junction row on any business under the account. **Never** derived from `accounts.owner_user_id`. No INSERT/UPDATE/DELETE policy for any app role in v1 — account writes are billing territory (Payment Portal → service role). Implemented as a third helper, `is_account_member(acct uuid)`, same modifiers as the proven pair (it reads `businesses`, which carries RLS — F-5 applies).

**R-B — Predicate formulation A/B (closes Proto 06 T-7 flag).** *Architect's call, Director informed.* Before stamping sixteen tables, run a bounded A/B on the scratch database at ≥100k `user_data` rows: (A) `public.is_member_of(business_id)` vs (B) `business_id in (select business_id from public.user_businesses where user_id = auth.uid())`. EXPLAIN (ANALYZE, BUFFERS) both for the unqualified read and the `business_id = $1` read. Pick SELECT predicate by evidence; record the decision in `evidence/X2_AB_DECISION.md`. The helper is retained for role-gated writes regardless of the outcome. Time-box: one hour. The 100k seed is a target, not a gate; if the scratch cannot hold it, record the achieved volume and proceed.

**R-C — Live-session junction revocation (closes Proto 06 N-3).** In scope for BIM-002 as a harness case: sign in as multi-store user, confirm visibility of both stores, delete one junction row via service role, re-query on the SAME session (no token refresh), assert the revoked store's rows are gone immediately. Expected: immediate, because membership is looked up live. Expected ≠ proven — prove it.

**R-D — Permanent homes.**
- Harness → `scripts/rls-harness/` (ported from `proto-06/harness/` + `proto-06/scripts/`), exposed as npm task `rls:prove`, wired to CI (AC5). `loadEnv` generalized to a prefix; env keys become `RLS_HARNESS_*`.
- Policies → **inline in the migration chain, one migration per table**, numbered continuing from 0015. Within each file: SELECT policy first, write policies after (F-1/F-8 enforced by file layout). Templates transcribed to `agent_docs/AUTHORITY/RLS_TEMPLATES.md` for review-by-diff.
- `proto-06/` landing zone on `main` is deleted by the Director after harness re-point is certified; branch `phase-3-proto-6` deleted at the same time.

**R-E — Storage buckets stay deny-all.** No `storage.objects` policy is authored or altered. Proto 01 owns Storage; BIM-002's exit gate excludes it.

### 4.2 Inherited rulings (binding, do not contradict)

- **Gap-6 (BIM-001 R-3):** RLS membership reads `user_businesses` ONLY. No policy consults `user_roles`, `user_metadata`, `profiles`, or `accounts.owner_user_id`. No superadmin policy exists in OwedBook. Platform oversight = service role, server-side, audited (BIM-003 fences it).
- **LIVE APPLY DEFERRED:** this module never touches the dev backend. Scratch + clean replica only. The Phase 3 APPLY SESSION applies chains later.
- **BIM-003 pre-loads (BIM-001 R-4):** read-audit = per-page RPC wrappers; tenant audit visibility internal-only. `audit_logs` RLS is BIM-003's — leave deny-all.
- **Cody / QA staffing** is QA's internal matter; Engineer obligation ends at a finalized ACCEPTANCE_SPEC.md.

### 4.3 Proto 06 non-negotiables (TRANSFERS §1.7, FINDINGS)

1. SELECT policy lands BEFORE any write policy, on every tenant table (F-1).
2. Landing order is law: helpers → SELECTs → writes (F-8).
3. Exactly one permissive policy per operation per table — checked mechanically after every landing (`rig-policy.mjs` law).
4. INSERT uses `WITH CHECK`, never `USING`. UPDATE uses both (`USING` gates reach, `WITH CHECK` gates the row's new home).
5. Mutation-attack denials are verified against service-role ground truth, not just "0 affected" (F-4).
6. Red-then-green per policy: flip the expectation to ALLOW (matrix goes RED), then land the policy (GREEN). A policy that never went red proves nothing.

---

## 5. SCOPE — THE POLICY PLAN, TABLE BY TABLE

Three helpers, then sixteen tables in dependency order. Column names below are from BIM-001 authorities; **recon (X0) confirms every tenant-key column on disk before the file is written** — flag any mismatch, never assume.

### 5.1 Helpers (migration 0016)

| Helper | Body | Source |
|---|---|---|
| `is_member_of(biz uuid)` | verbatim TRANSFERS §1.0 | Proto 06 |
| `is_admin_of(biz uuid)` | verbatim TRANSFERS §1.0 | Proto 06 |
| `is_account_member(acct uuid)` | `exists (select 1 from public.user_businesses ub join public.businesses b on b.id = ub.business_id where ub.user_id = auth.uid() and b.account_id = acct)` — same modifiers, same grants/revokes | R-A (new) |

### 5.2 Tables

| # | Table | SELECT | INSERT | UPDATE | DELETE | Pattern | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `accounts` | `is_account_member(id)` | — | — | — | R-A | Writes service-role only |
| 2 | `businesses` | `is_member_of(id)` | — | `is_admin_of(id)` USING + WITH CHECK | — | T-3 | Store create/delete = onboarding (Phase 4) → service role in v1; **flag** if a Phase 3 path needs it |
| 3 | `user_roles` | **UNTOUCHED** | | | | baseline | 3 baseline policies stand; forbidden zone |
| 4 | `profiles` | **UNTOUCHED** | | | | baseline | forbidden zone |
| 5 | `user_businesses` | `user_id = auth.uid()` | — | — | — | T-5 | Direct comparison (F-7); writes service-role only — role-tampering structurally impossible |
| 6 | `pending_registrations` | — | — | — | — | deny-all | Registration flow is Phase 4; server route via service role. **Stays locked, documented not dropped** |
| 7 | `subscriptions` | `is_account_member(account_id)` | — | — | — | R-A mirror | Stripe state mirror, no secrets; writes = webhooks (service role). Phase 7 may tighten to admin-only — **flag, don't decide** |
| 8 | `apa_memberships` | tenant-key dependent | — | — | — | T-1 or deny | Recon determines the tenant key column; if `business_id` → `is_member_of`; if none → deny-all + flag |
| 9 | `user_data` | member | member WITH CHECK | member USING + WITH CHECK | **admin** USING | T-1 + T-2 | The PHI fact table. DELETE gated to `is_admin_of(business_id)` — *Architect's call:* claim deletion is an admin act in Frank's world; Director may strike to member |
| 10 | `report_files` | `is_member_of(business_id)` | — | — | — | T-1 | Phase 6 pipeline writes via service role; fidelity flag carried |
| 11 | `aac_reference` | `true` (authenticated) | — | — | — | T-4 | Locked by omission |
| 12 | `wac_reference` | `true` | — | — | — | T-4 | |
| 13 | `ful_reference` | `true` | — | — | — | T-4 | |
| 14 | `pbm_info` | `true` | — | — | — | T-4 | |
| 15 | `audit_logs` | **UNTOUCHED** | | | | BIM-003 | Deny-all until BIM-003; forbidden zone |
| 16 | `reference_dataset_versions` | `true` | — | — | — | T-4 | |

**Expected policy count:** 17 policies + 3 helpers (accounts 1 · businesses 2 · user_businesses 1 · subscriptions 1 · apa 0–1 · user_data 4 · report_files 1 · five reference tables 5 · pending_registrations 0 · audit_logs 0 · baseline 3 pre-existing untouched). The spec's count AC is written as "matches the plan as ruled at X0," never as a literal number (BIM-001 ERRATUM-Q2 lesson).

**Indexes (T-7 medicine):** confirm `(business_id)` exists on every tenant table and `(user_id, business_id)` on the junction; add via migration if BIM-001 left any absent (flag first — BIM-001 owned indexes; a missing one is a finding, not silent scope).

### 5.3 Harness re-point (TRANSFERS §2.3, config swap not rewrite)

- `expectations.json` → `tables` = the sixteen real tables; `identities` = `anon, ownerA, staffA, ownerB, multiStore`; `default: DENY`; overrides per §5.2.
- `payloads` map → one insert row + one update patch per real table (data, not logic).
- `seed-map.json` shape unchanged (ids only, never secrets).
- Seed cast (map §6, superadmin dropped): Account A → stores A1, A2 · Account B → store B1 · **ownerA** admin on A1 + A2 · **staffA** member on A1 · **ownerB** admin on B1 · **multiStore** member on A1 + B1.
- Guards kept: publishable-key ≠ secret-key assertion, fail-closed env, repo-root anchoring, unique evidence filenames, count-based volume assertions (F-2).
- New cases: accounts matrix column (R-A) · subscriptions column · revocation case (R-C) · accounts spoof (ownerB reads account A by id → 0 rows) · `user_data` DELETE by member → 0 affected + ground truth.

---

## 6. STRUCTURAL LAWS (apply to every migration in the chain)

1. **One migration per table.** File order = landing order. Helpers (0016) precede every policy file. Inside a file: SELECT first, then INSERT, UPDATE, DELETE.
2. **One permissive policy per operation per table.** Mechanical check after each landing; the run fails if any table+operation count exceeds 1.
3. **Every policy is `to authenticated`.** No policy grants `anon` anything on any table.
4. **Helpers are the only membership logic.** No policy inlines a junction subquery — unless R-B's evidence selects formulation (B) for SELECTs, in which case that exact predicate text is the template and lives in `RLS_TEMPLATES.md`.
5. **Assert-then-create.** Each policy file asserts the target table exists with `rowsecurity = true` and zero policies for that operation before creating; fails loudly otherwise.
6. **No table structure changes.** No columns, no type changes. Indexes only per §5.2 and only after a flag.
7. **No seed data in migrations.** Synthetic rows exist only in the harness seed on scratch.
8. **File-change law (BIM-000 R2, Response Logging v1.0):** Claudy never edits `.env.local`; never prints a credential value; mirrors every substantive artifact to `agent_docs/RESPONSES/response_<date>_<time>_<slug>.md` before printing; flag-don't-deviate on any disk-vs-manager conflict.
9. **Verification instruments read `pg_catalog`.** Instruments get the same skepticism as code (three defects this campaign).
10. **Wipe order on the scratch:** event trigger → schema → re-grants (F-6). The Proto 06 throwaway, if reused, still holds rig tables — X0 wipes first.

---

## 7. GATES (engineering, module-internal)

- **X0 — Recon & stage:** scratch wiped, chain 0001–0015 applied (`db:apply`, never reset against anything but scratch), `pg_catalog` catalog shows 16 tables all `rowsecurity = true`, exactly 3 policies (all on baseline tables), 0 on the fourteen new tables; tenant-key columns confirmed per §5.2; TRANSFERS + FINDINGS + map on disk under `agent_docs/`; pooler host `aws-1`. Discrepancy = STOP and surface.
- **X1 — Helpers land:** 0016 applied; `pg_proc` shows all three `prosecdef = true`, `proconfig` contains `search_path=`, `anon` has no EXECUTE, `authenticated` does.
- **X2 — A/B evidence (R-B):** seeded volume recorded; EXPLAIN (ANALYZE, BUFFERS) for both formulations × two query shapes captured under an impersonated `authenticated` role; decision written to `evidence/X2_AB_DECISION.md`; SELECT template fixed for the rest of the chain.
- **X3 — Policies land red-green:** each table file lands with its expectation flipped first (RED evidence), then applied (GREEN evidence); one-per-op check passes after every file; F-1 check: no write policy exists on a table lacking a SELECT policy.
- **X4 — Full matrix + attack battery:** harness green on all identities × sixteen tables × four ops; attack battery green including the new accounts/subscriptions/revocation/DELETE cases; every mutation denial ground-truthed via service role.
- **X5 — One-command proof, twice:** `npm run rls:prove` (wipe → chain 0001–00NN → seed → matrix → attacks) from an empty scratch, run twice, evidence files byte-identical modulo timestamps.
- **X6 — Clean replica:** chain applies on a second throwaway pre-loaded with the exact 2-table/3-policy baseline (mirrors BIM-001 X2), catalog matches X5's.
- **X7 — Board green + fences:** build + tsc + full jest pass baseline and final (re-run after ANY dependency install); `src/types/supabase.ts` diff vs BIM-001 = empty (policies don't change types — prove it); grep zero `createAdminClient` outside seed/system paths; grep zero `user_roles` / `user_metadata` / `owner_user_id` inside `supabase/migrations/0016+`.

---

## 8. FORBIDDEN ZONES

- Any policy on `audit_logs` (BIM-003) · any `storage.objects` policy (Proto 01) · any policy on `user_roles` / `profiles` (baseline)
- Any policy reading `user_roles`, `user_metadata`, `profiles`, or `accounts.owner_user_id`
- Any superadmin, platform, or "oversight" policy clause
- Table structure changes · seed data in migrations · service-layer or UI wiring (BIM-005)
- Audit triggers or RPC wrappers (BIM-003) · `pbm_key` logic (Phase 5)
- Touching the dev backend (LIVE APPLY DEFERRED) · editing `.env.local` · printing any credential
- git / cloud commands (Claudy: zero, ever — Director is sole committer)
- Merging or checking out `phase-3-proto-6` (copy-not-merge; it is deleted after this module)

---

## 9. LAUNCH PROCEDURE

**Launch-line prerequisite (REQUIRED, Director, mechanically checked — four consecutive staging misses):**

- [ ] On branch `phase-3-bim002`, cut from `main` at or after the DOCTRINE SYNC merge
- [ ] `agent_docs/AUTHORITY/` complete (README, BIM_PLAYBOOK v1.0, map v1.1, TRIANGULATION, FRANK_API-02, LEGACY_DEMO_FORMAT_MAP, DATA_CONTRACT + ERRATUM pointer)
- [ ] `agent_docs/ACTIONS/PROTO06/` holds TRANSFERS.md + FINDINGS.md + brief + plan v1.1
- [ ] This package on disk at `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/`
- [ ] `.env.local` (untracked) carries throwaway-scope values only: `RLS_HARNESS_DB_URL` (session pooler, `aws-1-us-west-1`), `RLS_HARNESS_SUPABASE_URL`, `RLS_HARNESS_PUBLISHABLE_KEY`, `RLS_HARNESS_SECRET_KEY` for the scratch; a second set (or a documented swap procedure) for the clean replica at X6
- [ ] Pooler host confirmed by the Director in this manager: `aws-1-us-west-1` ✅

Plan Mode first, ONE message. The plan opens with X0 evidence (scratch catalog vs sixteen-table target, tenant-key columns confirmed). Flags, don't deviates. Build only after Director approval of the plan. Response Logging Protocol v1.0 in force.

**Director launch line:** *"Claudy — BIM-002-CYBER-PHARMA. Read the manager. Plan Mode. X0 first."*

---

## 10. HANDOFF ORDER (walk-first, REQUIRED)

Engineer handoff → PRE-Q on the working tree (Sol designs, Cody executes, Director as hands) → One-Walk (revocation case is the eyes-on candidate) → per-concern commits by the Director → SHA pin → certification against the SHA → close-out batch **including the campaign journal delta**. Execution agent released only on the QA Lead's evidence-complete signal.

Per-concern commit lists Claudy prepares: (1) helpers + templates doc · (2) policy migrations · (3) harness port + npm task + CI · (4) evidence + spec + retrospective.

---

## 10a. CARRIED FLAGS — routed out of BIM-002 (Engineer close, 2026-09-01)

| # | Flag | Owner / destination |
|---|---|---|
| **CF-1** | `accounts.owner_user_id` has **no `ON DELETE` behaviour**: deleting an account owner's auth identity is blocked until the account is reassigned or removed (`auth.admin.deleteUser` → "Database error deleting user"). A real production constraint, discovered when it broke the seed's reset. BIM-002 does not touch schema. | **BIM-004 / Phase 4 onboarding** — deliberate ruling required |
| **CF-2** | **ERRATUM E-4's premise must be re-verified on the dev backend.** The `pg_default_acl` grant of function EXECUTE to `anon` was observed on throwaways whose defaults come partly from `db-reset.mjs`'s bootstrap. Supabase ships comparable defaults, but the helper grants must be re-asserted from scratch on the real target. | **Phase 3 APPLY SESSION** |
| **CF-3** | `report_files` fidelity flag — its columns were never enumerated in the FRANK catalog; BIM-001 shipped a minimal attested shape. Untouched here. | **BIM-004 / BIM-005** — verify vs `models.py:826-849` |
| **CF-4** | **Credential rotation owed** on every throwaway whose values transited chat: BIM-002 scratch (`jmzwhgnyunwssamrqyhp`), BIM-002/BIM-001 replica (`ihgcsrypblqkwommrkgj`), the BIM-001 throwaways, and the Proto 06 rig project. | **Director** |
| **CF-5** | `proto-06/` landing zone on `main` and branch `phase-3-proto-6` are deleted once this harness port is certified (R-D). The port is complete; `proto-06/` was **not modified** by this module and remains valid review-by-diff evidence until then. | **Director**, post-Gate Q |
| **CF-6** | **CI wiring deferred** — AC13 struck (E-3). No `.github/` exists in this repo; the harness ships as the `rls:prove` npm task only. | **Deferred Ledger** |
| **CF-7** | Harness `--compare-behaviour` mode shipped this module (strips env banners, **never** the pooler host). Cross-target diffs should use it; same-target diffs use the `.normalised.log` twin. | informational |
| **CF-8** | **Harness-improvement candidates raised by independent QA at PRE-Q** (2026-09-02), recorded and **deliberately not executed in this module** — changing harness code after certification would invalidate the specimen: (1) assert exact session ID at every call site, not merely sign-in success · (2) classify denial shape per case, `USING` → 0 affected vs `WITH CHECK` → `42501`, never "any non-ALLOW is DENY" (**F-14**) · (3) no missing-row targets for DENY mutation cells — a probe at a non-existent id proves nothing · (4) ground-truth every denied mutation in the 320-cell matrix, not only in the attack battery · (5) assert no `TOKEN_REFRESHED` event in the revocation walk, not only an unchanged token string · (6) reduce the RPC/PostgREST error-decoder assumption with a decoder-independent denial assertion. Full text: `RETROSPECTIVE.md` § PRE-Q. | **BIM-005 / CRV** |

**PRE-Q outcome (2026-09-02):** **zero implementation defects, zero rework.** One spec-prose defect (AC3(b) denial shape → **E-6**) and one generalised finding (**F-14**). **One-Walk proven on attempt 3, byte-identical token and no `TOKEN_REFRESHED` event.** Spec lifecycle remains ENGINEER EVIDENCE-FILLED; the QA-VERIFIED flip happens at certification.

## 11. DEFINITION OF DONE

- [ ] X0–X7 green with evidence in `evidence/`
- [ ] ACCEPTANCE_SPEC.md ENGINEER EVIDENCE-FILLED (no silent criteria changes; prose re-read against any errata before handoff)
- [ ] `agent_docs/AUTHORITY/RLS_TEMPLATES.md` written (review-by-diff source)
- [ ] `scripts/rls-harness/` ported, `rls:prove` task present, CI wiring in place
- [ ] Per-concern commit lists prepared for the Director (never run)
- [ ] RETROSPECTIVE.md written — what fought back
- [ ] `QA/` folder ready for Sol's package
- [ ] Manager flipped to CLOSED with deliverables map
- [ ] Routed out: credential rotation (both BIM-001 throwaways + Proto 06 + BIM-002 scratch) · `proto-06/` + branch deletion · P3 final grade

🥄
