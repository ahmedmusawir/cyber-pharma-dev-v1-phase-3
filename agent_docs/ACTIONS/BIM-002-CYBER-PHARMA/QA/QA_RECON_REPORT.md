# BIM-002-CYBER-PHARMA — QA RECON REPORT

**Role:** Cody, QA execution/recon  
**Date:** 2026-09-02  
**Phase:** QA reconnaissance only. No PRE-Q cases were executed and no QA verdict is expressed here.  
**Evidence posture:** This report catalogs the Engineering specimen and its existing evidence. “Engineering reports/claims” below are not QA adjudications.

## 1. SPECIMEN IDENTITY

| Item | Mechanical observation |
|---|---|
| Current branch | `qa/bim002` (disposable QA branch; not the Engineering-close branch named in the spec) |
| HEAD | `53f1ac0004f40e4df9e403188382b16afb92899f` |
| HEAD decoration | The same commit is also the local `phase-3-bim002` tip and `origin/phase-3-bim002`; commit subject: `1sep2026 - bim002 done waiting for qa and close out`. |
| State before this report | `git status --short`, `git diff --name-only`, and the untracked-file query were empty. The specimen was clean. |
| State after this report | Expected QA debris is this new untracked report only; no product, migration, harness, or evidence artifact was altered. |
| Spec pin | `ACCEPTANCE_SPEC.md` still has a blank Certified SHA field and records its Engineering-close branch as `phase-3-bim002`. Current HEAD therefore identifies the inspected specimen mechanically, but the spec itself is not SHA-pinned. |

### Exact BIM-002 implementation/support files present

Package entry point:

- `package.json` — adds `rls:prove` → `node scripts/rls-harness/prove.mjs`.

Migration implementation:

- `supabase/migrations/0016_rls_helpers.sql`
- `supabase/migrations/0017_rls_user_businesses.sql`
- `supabase/migrations/0018_rls_accounts.sql`
- `supabase/migrations/0019_rls_businesses.sql`
- `supabase/migrations/0020_rls_subscriptions.sql`
- `supabase/migrations/0021_rls_user_data.sql`
- `supabase/migrations/0022_rls_report_files.sql`
- `supabase/migrations/0023_rls_aac_reference.sql`
- `supabase/migrations/0024_rls_wac_reference.sql`
- `supabase/migrations/0025_rls_ful_reference.sql`
- `supabase/migrations/0026_rls_pbm_info.sql`
- `supabase/migrations/0027_rls_reference_dataset_versions.sql`

Permanent harness:

- `scripts/rls-harness/ac8-check.mjs`
- `scripts/rls-harness/attacks.mjs`
- `scripts/rls-harness/expectations.json`
- `scripts/rls-harness/harness.mjs`
- `scripts/rls-harness/lib/db.mjs`
- `scripts/rls-harness/lib/env.mjs`
- `scripts/rls-harness/lib/verdict.mjs`
- `scripts/rls-harness/payloads.mjs`
- `scripts/rls-harness/policy-check.mjs`
- `scripts/rls-harness/prove.mjs`
- `scripts/rls-harness/revocation.mjs`
- `scripts/rls-harness/scoping.mjs`
- `scripts/rls-harness/seed-map.json`
- `scripts/rls-harness/seed.mjs`
- `scripts/rls-harness/x3-red-green.mjs`

Review-by-diff authority:

- `agent_docs/AUTHORITY/RLS_TEMPLATES.md`.

Relative to BIM-001 certified state `9f8c80d`, Git reports all files above as added except `package.json`, which is modified. No `.github/` files are present.

## 2. AUTHORITY STATE

### Manager and Acceptance Spec lifecycle

- Manager (`CLAUDE.md`) header remains **FINAL — Awaiting Director review → Claudy launch**, not CLOSED. Its Definition of Done remains unchecked, still asks for CI wiring, and still asks for the Manager to be flipped CLOSED. This conflicts with the X7 handoff’s “Engineering complete / X0–X7 GREEN” close posture and with Erratum E-3 striking CI.
- Acceptance Spec is currently **ENGINEER EVIDENCE-FILLED (2026-09-01)**. `QA-VERIFIED` is the next lifecycle state, not the current state. Certified SHA remains blank.
- The spec header says its prose was re-read against E-1…E-5, but two stale criterion bodies remain: AC8 names only three helpers and does not state the separate PUBLIC check; AC13’s original CI criterion remains in the normative AC list and is struck only in the Engineering evidence table/Erratum E-3.
- The spec header attributes “AC8 evidence valid only after a from-scratch apply” to E-5. On disk, that rule is in E-4/F-12; E-5 is formulation C/fourth-helper adoption. The intended rule is clear, but the citation is inaccurate.

### AC1–AC20 current criterion state and consequential changes

| AC | Current authority state / consequential text |
|---|---|
| AC1 | Five-identity × sixteen-table isolation matrix; exact tenant visibility and anon zero-row expectation. Evidence table claims 320/320 cells. |
| AC2 | Same-session junction revocation: B1 disappears, A1 remains, no token refresh; Engineering also claims immediate re-grant. |
| AC3 | Five named DB-layer spoof drills: foreign-business INSERT, UPDATE re-home, self-promotion, account spoof read, subscription spoof read. Engineering expands this to a 28-case battery. |
| AC4 | Account reads must derive from junction membership, not `owner_user_id`; app identities get no account writes. |
| AC5 | Gap-6 forbidden sources are `user_roles`, `user_metadata`, `raw_user_meta_data`, and `profiles`; Engineering also checks `owner_user_id` under AC4/L4. |
| AC6 | At most one permissive policy per table/operation; Engineering reports 18 table×operation groups. |
| AC7 | Every table with a write policy must also have a SELECT policy earlier in the same migration file. |
| AC8 | Ruled state is **four** helpers, SECURITY DEFINER/STABLE/empty search path, PUBLIC and anon both denied EXECUTE, authenticated allowed, and proof after from-scratch apply. The original AC body still names only three helpers and only anon/authenticated. Errata/evidence control the implemented state. |
| AC9 | Inventory must match the X0-confirmed plan; E-1 fixes the count to 15 new + 3 untouched baseline = 18 total. `apa_memberships` is deny-all. |
| AC10 | Five reference tables: authenticated read only; anon and app-role writes denied. |
| AC11 | `storage.objects` inventory unchanged; BIM-002 adds no Storage policy. |
| AC12 | `npm run rls:prove` twice from empty scratch, behavior identical modulo nondeterministic fields. Existing normalized twins are byte-identical by mechanical hash/diff inspection during recon. |
| AC13 | **STRUCK by Director (E-3).** No CI workflow is required in BIM-002; CI is deferred. No `.github/` directory exists. |
| AC14 | Full chain on a second throwaway preloaded with the two-table/three-policy baseline, then catalog/behavior comparison. |
| AC15 | Volume assertions must use exact count/head or pagination, not capped result-array length. |
| AC16 | X2 must record volume, plans for A/B and both query shapes, chosen predicate, rationale. Final evidence additionally measures C and supersedes the interim B selection. |
| AC17 | Chosen predicate’s qualified `user_data` read must show an index scan; unqualified behavior is informational and routes an application-filter rule. |
| AC18 | Build, TypeScript, Jest, and unchanged generated types. Repo contains only the X7 handoff’s summarized board output, not separate raw X7 logs in the BIM-002 evidence directory. |
| AC19 | Service-role client construction introduced by BIM-002 is confined to the harness; inherited app-side sites are claimed untouched. |
| AC20 | Authority templates must cover four helpers and T-1/T-2/T-3/T-4/T-5/R-A and match migration SQL bodies. Template text reflects C and both revokes. |

### AC13 Director strike/ruling

Erratum E-3 strikes AC13. The shipped contract is the local `rls:prove` npm task only; no CI file is present, and CI wiring is routed to the Deferred Ledger. Stale Manager/AC body references to CI are documentary residue, not silent implementation omissions.

### Erratum E-1 through E-5, plain English

- **E-1:** Corrects the Manager’s arithmetic from “17 policies” to **15 new policies plus 3 untouched baseline policies (18 catalog rows total)**.
- **E-2:** Establishes that revoking helper EXECUTE from `anon` alone does not close PUBLIC inheritance; helpers must also revoke from `public`.
- **E-3:** Strikes CI wiring from BIM-002 and defers it; no workflow should exist in this module.
- **E-4:** Establishes a second grant channel—explicit `anon` default ACL—so every helper must revoke from **both** `public` and `anon`; grant assertions must be made after a fresh create/from-scratch apply because `CREATE OR REPLACE` preserves ACL history.
- **E-5:** Adopts formulation **C** for tenant SELECTs and adds `my_business_ids()` as the fourth helper after it matched B’s plan shape while retaining SECURITY DEFINER shielding.

## 3. IMPLEMENTATION MAP

### Migration 0016–0027 inventory

| Migration | Implemented object(s) | Notes |
|---|---|---|
| 0016 | `is_member_of(uuid)`, `is_admin_of(uuid)`, `my_business_ids()`, `is_account_member(uuid)` | All SQL/STABLE/SECURITY DEFINER/empty search path; fully-qualified bodies; revoke from PUBLIC and anon, grant authenticated. |
| 0017 | `ub_select_self` on `user_businesses` SELECT | Direct `user_id = auth.uid()`; no junction writes. Lands first. |
| 0018 | `account_select_member` on `accounts` SELECT | Uses `is_account_member(id)`; no app writes. |
| 0019 | `business_select_member`; `business_update_admin` | C-form SELECT first; admin UPDATE has USING + WITH CHECK. |
| 0020 | `subscription_select_account_member` | Account-derived read only. |
| 0021 | `user_data_select_member`, `user_data_insert_member`, `user_data_update_member`, `user_data_delete_admin` | C for SELECT; scalar member/admin helpers for writes; admin-only DELETE. |
| 0022 | `report_files_select_member` | C-form tenant read only. |
| 0023 | `aac_reference_select_authenticated` | Authenticated read only. |
| 0024 | `wac_reference_select_authenticated` | Authenticated read only. |
| 0025 | `ful_reference_select_authenticated` | Authenticated read only. |
| 0026 | `pbm_info_select_authenticated` | Authenticated read only. |
| 0027 | `reference_dataset_versions_select_authenticated` | Authenticated read only. |

Every policy migration asserts table existence, RLS enabled, and absence of a conflicting policy. C-form tenant files also assert that junction SELECT landed first.

### X2 predicate strategy

**Final selection: C**, not A or B.

- A (`is_member_of(business_id)`) was correct but invoked per candidate row and measured much slower at 100,000 rows.
- B (inline junction subquery) produced a hashed subplan and was fast, but the first benchmark returned zero rows because junction RLS blinded the invoker-evaluated subquery. With the junction SELECT present, it was fast and row-count-equivalent, but remained dependent on that policy.
- C (`business_id in (select public.my_business_ids())`) produced the same once-evaluated hashed-subplan shape/buffer profile as B, was within about one percent in the recorded measurements, and remained correct in the shield test when the junction SELECT policy was removed because the set-returning helper is SECURITY DEFINER.

`X2_AB_DECISION.md` contains an interim §4 statement that “B is adopted”; §7 explicitly supersedes it with C. The migration bodies and authority template implement C. Sol should read §7 as the final decision while retaining §2/§4 as the audit trail of the false-fast trap.

### Final policy inventory, table by table

| Table | Final catalog strategy |
|---|---|
| `accounts` | SELECT via `is_account_member(id)`; no app writes. |
| `businesses` | SELECT via C on row `id`; UPDATE admin-only with USING + WITH CHECK. |
| `user_roles` | One pre-existing baseline SELECT policy, untouched. |
| `profiles` | Two pre-existing baseline policies (SELECT, UPDATE), untouched. |
| `user_businesses` | Self SELECT via `auth.uid()`; no app writes. |
| `pending_registrations` | RLS enabled, zero policies (deny-all). |
| `subscriptions` | SELECT via `is_account_member(account_id)`; no app writes. |
| `apa_memberships` | RLS enabled, zero policies (deny-all); X0 found no valid tenant key. |
| `user_data` | Member SELECT/INSERT/UPDATE; admin DELETE; UPDATE has old-row and new-row gates. |
| `report_files` | Member SELECT via C; no app writes. |
| `aac_reference` | Authenticated SELECT only. |
| `wac_reference` | Authenticated SELECT only. |
| `ful_reference` | Authenticated SELECT only. |
| `pbm_info` | Authenticated SELECT only. |
| `audit_logs` | RLS enabled, zero policies; reserved for BIM-003. |
| `reference_dataset_versions` | Authenticated SELECT only. |

Catalog evidence reports 15 new policies plus 3 baseline policies = 18 total, one permissive policy per table/operation group.

### Indexes

BIM-002 migrations 0016–0027 add or alter **no indexes**. X0 catalog evidence records pre-existing relevant indexes, including `idx_user_data_business_id`, `idx_report_files_business_id`, `idx_businesses_account_id`, `idx_subscriptions_account_id`, both single-column junction indexes, and unique `uq_user_business`. X2’s qualified plan uses `idx_user_data_business_id`. The unqualified read remains a sequential scan; the authority explicitly treats RLS as a security boundary, not a query optimizer.

### Relationship to `RLS_TEMPLATES.md`

The authority file is the review-by-diff rendering of shipped SQL bodies: four corrected helpers, C-form T-1, scalar-helper writes (T-2/T-3), shared reference read (T-4), junction self-visibility (T-5), and account-derived R-A. It also documents deny-all tables and B as an anti-pattern. Migration files add assert-then-create preambles and table-specific names around those bodies. The “byte-identical bodies” assertion is an Engineering static-proof claim; no standalone machine-generated diff artifact was found.

## 4. ENGINEERING CLAIM MAP

No PASS/FAIL status is assigned here. “Claim” is the Engineering claim currently attached to each non-struck AC.

| AC | Engineering claim | Existing evidence file(s) | Implementation file(s) involved | Evidence class |
|---|---|---|---|---|
| AC1 | 320/320 matrix cells match five identities × sixteen tables × four operations. | `evidence/X4-matrix_2026-09-01T0649.log`; X5/X6 prove logs and matrix sub-logs | `harness.mjs`, `expectations.json`, `payloads.mjs`, all policy migrations | Harness result / direct API observation |
| AC2 | Same token/session loses B1 immediately, retains A1, and regains B1 after restore. | `evidence/X4_revocation_2026-09-01T0725.log`; embedded X5/X6 revocation sections | `revocation.mjs`, 0016, 0017, 0019, 0021 | Harness result + service-role ground truth + token comparison |
| AC3 | Five named spoof drills and 23 additional attacks denied; mutations unchanged by service-role truth. | `evidence/X4_attacks_2026-09-01T0725.log`; X5/X6 prove logs | `attacks.mjs`, `verdict.mjs`, 0017–0021 | Harness result / direct attack observation / ground truth |
| AC4 | Account reads are junction-derived; cross-account read absent; account writes unavailable. | X4 attacks/scoping; X7 handoff grep summary | `0016_rls_helpers.sql`, `0018_rls_accounts.sql`, `0020_rls_subscriptions.sql`, `attacks.mjs`, `scoping.mjs` | Direct harness observation + grep/static proof |
| AC5 | No forbidden identity/ownership source appears in BIM-002 helper/policy bodies. | `evidence/X3_final_policy_inventory.log`; X7 handoff grep summary | 0016–0027; `policy-check.mjs` L4 | Catalog proof + grep/static proof |
| AC6 | 18 table×operation groups; none has more than one permissive policy. | `evidence/X3_final_policy_inventory.log`; X5/X6 prove logs | `policy-check.mjs`; 0017–0027 plus baseline policies | Catalog proof |
| AC7 | SELECT exists before write both in catalog and within migration file order. | X3 inventory/law output; X5/X6 prove logs | `policy-check.mjs` L2; 0019 and 0021 are the write-bearing BIM-002 files | Catalog proof + static migration-order proof |
| AC8 | Four helpers have required shape/grants after fresh create; anon cannot execute. | `evidence/X1_AC8_four_helpers_FINAL_2026-09-01.log`; `evidence/X5_ac8_fresh_*.log`; X5/X6 prove logs | `0016_rls_helpers.sql`, `ac8-check.mjs` | Catalog/ACL proof + live execution probe + from-scratch harness result |
| AC9 | Plan realized as 15 new + 3 untouched baseline policies; named deny-all/Storage areas remain without BIM-002 policies. | `evidence/X0_catalog_2026-09-01.log`; `evidence/X3_final_policy_inventory.log` | 0017–0027; `policy-check.mjs` | Before/after catalog proof |
| AC10 | Five reference tables allow authenticated reads and deny anonymous/read-write combinations as specified. | X4 matrix; X4 attacks A7; X5/X6 prove logs | 0023–0027; harness/attacks/payloads | Harness result / direct observation |
| AC11 | `storage.objects` has zero policies before/after on both throwaways. | X0 catalog; X7 handoff summary | No BIM-002 Storage implementation | Catalog proof for X0 + Engineering attestation for final/two-target statement |
| AC12 | Two from-empty scratch proofs are behaviorally identical after normalization. | `evidence/X5_prove_2026-09-01T0654.log`, `...T0656.log`, and both `.normalised.log` twins | `prove.mjs`, `scripts/db-reset.mjs`, complete harness/migration chain | Harness result + artifact comparison; recon confirmed normalized files have identical SHA-256 |
| AC14 | Second throwaway matched baseline before chain and reproduced full proof/catalog. | `evidence/X6_bootstrap_catalog_match.log`; `evidence/X6_prove_replica_2026-09-01T0725.log` | `prove.mjs`, `scripts/db-reset.mjs`, all migrations/harness | Catalog proof + harness result |
| AC15 | Volume claims use exact counts, not capped arrays. | Engineering spec table; source inspection | `verdict.mjs`, `scoping.mjs`, `attacks.mjs`, `revocation.mjs` | Grep/static proof |
| AC16 | 100,000-row A/B/C decision recorded with row parity, plans, shield test, and C rationale. | `evidence/X2_AB_DECISION.md`; `evidence/X2_AB_explain_CORRECTED_2026-09-01.log` | 0016, 0019, 0021, 0022 | Performance evidence + direct EXPLAIN observation |
| AC17 | Qualified C-form read uses `idx_user_data_business_id`; unqualified cost recorded. | Same X2 decision/corrected EXPLAIN files | `0016_rls_helpers.sql`, `0021_rls_user_data.sql`; pre-existing user_data index | Performance evidence / plan observation |
| AC18 | Build 22 routes, TypeScript clean, Jest 28 suites/128 tests, generated types unchanged from `9f8c80d`. | `agent_docs/RESPONSES/response_2026-09-01_161500_bim002-X7-handoff.md` | Board commands and `src/types/supabase.ts` comparison; no BIM product files claimed changed | Engineering attestation/summary; no separate raw X7 log found |
| AC19 | Exactly one new service-role construction site, inside harness; inherited app sites untouched. | X7 handoff summary; current Git diff inventory | `lib/db.mjs`, harness callers, `package.json` | Grep/static proof + Engineering attestation |
| AC20 | Template patterns and helper bodies match shipped migration bodies. | `RLS_TEMPLATES.md`; spec/X7 summary | `RLS_TEMPLATES.md`, 0016–0027 | Static review-by-diff claim; no standalone diff log found |

## 5. KNOWN DEFECTS / CORRECTIONS / FINDINGS

- **Proto06 helper grant defect:** `REVOKE ... FROM anon` alone leaves PUBLIC inheritance. On these throwaways, `REVOKE ... FROM public` alone also leaves an explicit anon grant from `pg_default_acl`. Final migration rule is both revokes, then authenticated grant. Table-level anon denial masked the original helper EXECUTE surface.
- **Fresh-create ACL law:** an incremental `CREATE OR REPLACE` retained prior ACL state and created a false green helper check. Grant/ownership claims require drop-and-apply evidence (F-12).
- **X2 false-fast/zero-row trap:** the first B timing looked approximately 160× faster because it returned zero rows. Row-count parity must precede timing comparison; silent empty results are a correctness hazard.
- **Junction-first ordering law:** helpers → `user_businesses` SELECT → other SELECTs → writes. Under final C this is defense-in-depth; it is load-bearing if inline B ever returns.
- **F-10:** revoke helper EXECUTE from both PUBLIC and anon; Proto06’s anon-only form is defective.
- **F-11:** inline junction subqueries are invoker-evaluated and can be blinded by junction RLS; C supplies B-like plan shape behind a SECURITY DEFINER shield.
- **F-12:** ACL/privilege evidence is valid only from a fresh deployment state.
- **F-13:** existing harness evidence observes same-session revocation and re-grant on the next query.
- **`auth.users` leftover/cast contamination:** public-schema wipe does not clear Auth. X2 used a leftover identity for measurement. Later seed runs explicitly purged pre-existing Auth identities; X6 evidence records a materially non-empty leftover set. This created a silent-sign-in/anon risk when FK cleanup failed.
- **`accounts.owner_user_id` deletion constraint:** no ON DELETE behavior means deleting an owning Auth user is blocked while the account exists. The seed originally purged Auth before public account rows, failed mid-purge, and left identities whose sign-ins could fail. Final seed deletes public rows before Auth users. This is carried as CF-1 for onboarding/schema ruling.
- **Harness self-mutation:** allowed inserts that could not be deleted and allowed updates of seeded rows caused row-count/name drift. Final matrix tracks litter and restores mutated seed rows using service role.
- **Instrument false-positive history:** an ad-hoc scoping script treated failed sign-in as zero visible rows. Permanent scoping/attack/revocation tools fail on auth error and usually assert identity; the main matrix still lacks the identity-ID assertion (see blind spots).
- **Infrastructure incidents admitted by retrospective:** one pooler reset and one idle-in-transaction backend lock interrupted measurement. Engineering says results were rerun and unaffected; no QA replay occurred in recon.
- **X6 evidence-label inconsistency:** `X6_prove_replica_...log` contains a matrix output path labeled `X5-matrix_...`, while the Acceptance Spec says “X6-matrix inside” the X6 log. X7 says `prove.mjs` was later changed to accept a phase label. This is evidence provenance/label drift, not silently reconciled here.
- **Manager/spec residue:** stale three-helper, 17-policy, CI, and lifecycle text remains alongside corrective errata and final evidence.

## 6. HARNESS CAPABILITY MAP

### What `npm run rls:prove` does, in order

1. Calls `scripts/db-reset.mjs reset` with the selected DB URL and reset flag; wipe order and the complete 0001–0027 chain are delegated to the BIM-001 reset tool.
2. Runs `seed.mjs`: deletes fourteen public data tables in FK-safe order, purges listed Auth users, creates the four signed-in cast identities, creates two accounts/three stores/six junctions, and seeds every matrix table with non-vacuous data.
3. Runs `ac8-check.mjs` immediately after the fresh chain to inspect all four helper shapes/ACLs and execute one anon denial probe.
4. Runs `policy-check.mjs` laws L1–L4: one permissive policy per operation, SELECT-before-write/catalog+file order, junction-first/no inline B, and no forbidden Gap-6 sources.
5. Runs `harness.mjs`: five identities × sixteen tables × four operations = 320 expectation cells.
6. Runs `scoping.mjs`: exact `user_data` counts and visible store/account names for the four authenticated identities, plus anon count.
7. Runs `attacks.mjs`: 28 expected-denial cases covering cross-account/tenant reads, foreign writes, re-home, role tampering, account writes, reference writes, deny-all reads, and anon reads; named mutations are checked against service-role state.
8. Runs `revocation.mjs`: same-session membership revoke and restore with token equality and service-role junction ground truth.

The runner stops at the first nonzero stage, writes a consolidated raw evidence file, and writes a normalized twin masking UUIDs/timestamps/timings/token fingerprint text. Optional cross-target comparison strips target-dependent banners/counts but deliberately keeps the pooler host.

### Identities and table/operation coverage

- Identities: `anon`, `ownerA`, `staffA`, `ownerB`, `multiStore`.
- Authenticated membership topology: ownerA admin A1+A2; staffA member A1; ownerB admin B1; multiStore member A1+B1.
- Matrix tables: all sixteen public schema tables in the BIM chain, including baseline `user_roles`/`profiles` and deny-all tables.
- Matrix operations: SELECT, INSERT, UPDATE, DELETE on every table.
- Exact row-scoping assertions cover `user_data`, `businesses`, and `accounts`; targeted attacks add direct-ID checks for subscriptions/report files/junctions and write restrictions.

### Ground truth, revocation, counts, identity, and service-role boundary

- Mutation ground truth: `attacks.mjs` re-reads named mutation targets through the service-role client. `groundTruthCount()` uses exact head counts. The general 320-cell matrix does not ground-truth every denied mutation.
- Same-session revocation: supported for multiStore/B1, including byte-equal access token and immediate re-grant observation.
- Volume: count-based assertions are used for explicit volume claims. The basic matrix intentionally uses limited row presence for ALLOW/DENY classification, not volume proof.
- Auth failure: all permanent tools stop or record a failure on sign-in error. `attacks`, `scoping`, and `revocation` compare the returned user ID with `seed-map.json`; `harness.mjs` does not.
- Scratch/replica: `loadEnv(prefix)` supports a default `RLS_HARNESS_` set or another prefix such as a replica prefix. It also contains Amendment A-1 fallbacks to Proto06/application-named variables. X6 used the same proof against a second throwaway.
- Service role: constructed centrally in `lib/db.mjs`; used for seed/reset-adjacent operations, matrix cleanup/restoration, attack ground truth, and revocation. Matrix cells themselves use the publishable-key client. Direct Postgres is used for reset/catalog checks.

### Repo-grounded harness blind spots

- **Main matrix identity assertion gap:** `harness.mjs::sessionFor` checks sign-in error but does not assert returned `user.id` matches the intended seed identity, contradicting the addendum’s “every instrument now asserts” statement.
- **Matrix mutation truth gap:** the matrix classifies UPDATE/DELETE zero affected as DENY without service-role verification; only the dedicated attack cases ground-truth selected mutation denials.
- **Limited exact scoping:** exact tenant counts/names are asserted only for user_data/businesses/accounts. Matrix SELECT is `.limit(5)` and proves presence/absence, not exhaustive row ownership, for other readable tables.
- **Auth purge pagination:** `listUsers({ perPage: 1000 })` performs one page only but comments say “purge ALL.” A throwaway with more than 1,000 Auth users can retain identities. The code asserts its created cast, not total absence afterward.
- **Target-selection guard:** `prove.mjs` hard-codes the reset allow flag once `loadEnv` resolves a DB URL. The inspected harness does not independently allowlist project identity/host as a throwaway. Safe execution therefore depends on Tony selecting correct `.env.local` keys/prefix; this is why recon did not run it.
- **Fallback targeting risk:** A-1 fallbacks can silently select Proto06/application-named variables when prefixed keys are absent. The banner states which logical fallbacks were used, but no value or target ID is shown before destructive reset.
- **AC8 live probe breadth:** catalog privilege checks cover all four helpers, but the impersonated anon execution probe invokes only `my_business_ids()`.
- **Seed-map mutability:** `seed.mjs` rewrites tracked `seed-map.json` with run-specific identifiers; normalized proof masks identifiers, but a run dirties the worktree and evidence depends on the current map.
- **Evidence-label drift:** the existing X6 consolidated log points to an X5-labeled matrix sub-log; phase-label support was added later according to X7.
- **No CI:** intentional under E-3, but it means the permanent proof has no repository automation trigger.

## 7. RISK / ATTACK SURFACE FOR SOL

Candidate surfaces only; this is not a QA plan.

- PUBLIC and explicit-anon EXECUTE grants on every SECURITY DEFINER helper, including behavior after a truly fresh target apply and target-specific default ACLs.
- Final C predicate behavior under normal junction policy state and under junction policy absence/tightening; confirm no accidental reversion to inline B.
- `user_businesses` dependency/order: direct self-visibility, no writes, migration-order assertion, and future-policy interaction.
- Cross-tenant reads by direct row ID and unqualified list queries across `businesses`, `user_data`, `report_files`, `accounts`, and `subscriptions`.
- Foreign-business INSERT (`WITH CHECK`) and UPDATE re-home (old-row USING plus new-row WITH CHECK).
- Member versus admin DELETE on `user_data`; admin DELETE is a Director-standing policy choice, not inherited Proto06 member-delete behavior.
- Account/subscription spoof reads and the two-table SECURITY DEFINER join inside `is_account_member`.
- Same-session revocation and re-grant, including token stability and surgical preservation of remaining membership.
- Preservation of the three baseline `user_roles`/`profiles` policies while adding 15 new policies.
- Forbidden references in live policy/helper definitions and migration bodies: `user_roles`, `user_metadata`, `raw_user_meta_data`, `profiles`, `owner_user_id`.
- Service-role containment: server/harness-only construction, no matrix evaluation through service role, and cleanup/ground-truth use not masking policy behavior.
- Silent-zero modes: blinded SELECT subquery, write-without-SELECT no-op, failed sign-in running as anon, empty deny-all table, and capped/partial result sets.
- Harness false positives: identity mismatch in main matrix, lack of ground truth for every matrix mutation, limited exact scoping, cleanup masking residue, and evidence normalization/labeling.
- Leftover Auth identities and FK-blocked deletion caused by `accounts.owner_user_id`; one-page Auth purge limitation.
- Wrong-target destructive reset through fallback env selection or prefix error. No live command should run until Tony confirms throwaway target scope without exposing values.
- SECURITY DEFINER ownership/search-path/function-ACL drift across targets; E-4’s default-ACL premise is explicitly carried for later real-target verification.
- `is_account_member` traverses both junction and businesses as definer; membership on any business grants account/subscription read by design. Multi-business/account edge cases are a concentrated authorization surface.
- Reference tables use `USING (true)` for every authenticated identity; verify that no sensitive columns/data classes have entered those tables since the policy decision.
- Deny-all tables depend on policy omission. Any inherited, future, or duplicate permissive policy widens them; one-per-op checks only report duplicates, not whether a newly introduced singleton is authorized by scope.
- `apa_memberships.discount_redeemed_business_id` is nullable/non-FK and intentionally rejected as a tenant key; it remains fully service-role-only.
- Unqualified tenant reads remain sequential scans. Performance degradation can look like access failure/timeouts and tempt service-role bypasses at the application layer.
- `report_files` carries a pre-existing schema fidelity flag; policy correctness cannot establish that the table shape matches the source model.
- Storage, browser/SSR session behavior, audit trail, and dev-backend behavior are explicitly outside this Engineering proof and must not be inferred from table-RLS evidence.

## 8. DECLARED RECON GAPS

Established only by later live execution, not by this recon:

- Actual current state of either throwaway database; recon inspected saved evidence only.
- Reproduction of X0–X7 observations, including helper grants, catalog inventory, matrix, attacks, revocation, clean replica, performance plans, and board commands.
- Target-specific default ACL behavior on a fresh project and, later, the deferred real apply target.
- Whether saved credentials still work or have been rotated; credential values were neither read nor printed.
- Whether the throwaway target selected by current env keys/prefix is safe to wipe.
- Dev backend behavior (explicitly forbidden and deferred).

Requires Tony as hands/credential boundary later:

- Confirming the throwaway project and pooler target selected by `RLS_HARNESS_*` or replica prefix before any destructive proof.
- Supplying/rotating throwaway credentials and confirming publishable/secret separation without exposing values.
- Any live scratch/replica execution, Auth-user cleanup, or service-role mutation.
- Director SHA pinning in the Acceptance Spec and any Git operation.

Not established from repo artifacts alone:

- Raw X7 build/TypeScript/Jest/type-diff logs; only the Engineering handoff summary was found.
- A standalone byte-for-byte template-vs-migration diff artifact.
- A final two-target Storage catalog log; X0 contains the initial scratch count and X7 summarizes the final/two-target result.
- CI execution, by ruling (AC13 struck and no workflow exists).
- Exhaustive exact-row scoping for every readable table and ground truth for every one of the 320 mutation cells.
- Absence of Auth identities beyond the one-page seed purge or after saved evidence runs.
- Formal close state: Manager is not marked CLOSED and the Acceptance Spec Certified SHA is blank.

## 9. SOURCE INDEX

### Specimen, authority, and rulings

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/CLAUDE.md`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ACCEPTANCE_SPEC.md`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ERRATUM.md`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/RETROSPECTIVE.md`
- `agent_docs/ACTIONS/PROTO06/TRANSFERS.md`
- `agent_docs/ACTIONS/PROTO06/TRANSFERS_ADDENDUM_BIM-002.md`
- `agent_docs/AUTHORITY/RLS_TEMPLATES.md`
- `agent_docs/RESPONSES/response_2026-09-01_161500_bim002-X7-handoff.md`

### Implementation

- `supabase/migrations/0016_rls_helpers.sql`
- `supabase/migrations/0017_rls_user_businesses.sql`
- `supabase/migrations/0018_rls_accounts.sql`
- `supabase/migrations/0019_rls_businesses.sql`
- `supabase/migrations/0020_rls_subscriptions.sql`
- `supabase/migrations/0021_rls_user_data.sql`
- `supabase/migrations/0022_rls_report_files.sql`
- `supabase/migrations/0023_rls_aac_reference.sql`
- `supabase/migrations/0024_rls_wac_reference.sql`
- `supabase/migrations/0025_rls_ful_reference.sql`
- `supabase/migrations/0026_rls_pbm_info.sql`
- `supabase/migrations/0027_rls_reference_dataset_versions.sql`
- `scripts/rls-harness/` (all files listed in §1)
- `scripts/db-reset.mjs`
- `package.json`

### Core evidence

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X0_catalog_2026-09-01.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X1_AC8_helper_shape_2026-09-01.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X1_AC8_helper_shape_AMENDED_2026-09-01.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X1_AC8_four_helpers_FINAL_2026-09-01.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X1_FINDING_anon_execute_via_public.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X2_FINDING_fresh_create_anon_grant.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X2_AB_DECISION.md`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X2_AB_explain_2026-09-01.log` (retained invalid first run)
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X2_AB_explain_CORRECTED_2026-09-01.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X3_red_green_ledger.json`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X3_final_policy_inventory.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X3_row_scoping_check.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X4-matrix_2026-09-01T0649.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X4_attacks_2026-09-01T0725.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X4_scoping_2026-09-01T0725.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X4_revocation_2026-09-01T0725.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X5_prove_2026-09-01T0654.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X5_prove_2026-09-01T0654.normalised.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X5_prove_2026-09-01T0656.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X5_prove_2026-09-01T0656.normalised.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X6_bootstrap_catalog_match.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X6_prove_replica_2026-09-01T0725.log`

All other X3 RED/GREEN and X4/X5 timestamp variants in `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/` are retained provenance for the gate sequence; the paths above are the shortest source set supporting this report’s major statements.
