# BIM-002 PRE-Q — Phase 1 Static Specimen & Instrument Attack

**Checkpoint:** PRE-Q Phase 1 only  
**Execution agent:** Cody  
**Local timestamp:** 2026-09-02 10:59:31 +0800  
**Branch:** `qa/bim002` (resolved directly from `.git/HEAD`; no Git command used)  
**HEAD:** `53f1ac0004f40e4df9e403188382b16afb92899f` (resolved directly from `.git/refs/heads/qa/bim002`)  
**Pinned specimen:** `53f1ac0004f40e4df9e403188382b16afb92899f`  
**Pinned specimen comparison:** exact match; Phase 1 was allowed to continue.  
**Boundary:** No database contact, reset, `npm run rls:prove`, service-role mutation, product implementation change, or Git operation occurred. Phases 2–4 remain locked.

This response records observations for Sol. It does not assign a QA/module verdict.

## 1. Files/probes created

- Created raw static evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P1_static_probe_2026-09-02_105931.log`.
- Created this mandatory checkpoint response under `QA/RESPONSE/`.
- No QA probe script was persisted; DB-free analyzers were executed inline against repository text.
- No shipped harness, migration, package, product, Engineering evidence, or authority file was modified.

## 2. Commands/actions executed

No `git` command was executed. Read-only actions were:

1. `wc`, `sed`, and `rg` over the PRE-Q plan and governing Phase-1 sources.
2. Direct reads of `.git/HEAD` and `.git/refs/heads/qa/bim002` to enforce the pinned-HEAD stop condition.
3. `find` inventories of the QA tree, migrations 0016–0027, harness, and Engineering evidence.
4. A DB-free inline Node analyzer that stripped SQL comments, parsed helper/policy definitions, checked forbidden executable references and structural DDL, and compared named template bodies/statements with migrations.
5. Boundary-focused `rg`/`sed` source inspection of sign-in, identity checks, mutation truth, payload targets, select/count shapes, Auth cleanup, env/reset selection, normalization, labeling, and service-role usage.
6. A read-only inline Node Git-index-v2/worktree hash comparison, excluding `.env.local`, to supply a status equivalent without a Git operation.
7. `mkdir` for the required QA response/evidence directories and report-only file creation through patch application.

## 3. Specimen integrity and worktree observation

The branch and HEAD match Sol’s pinned specimen.

Because Phase 1 forbids Git operations while P1-A asks for `git status --short`, I did not invoke Git. The read-only index/worktree comparator reported this status equivalent before Phase-1 artifacts were written:

```text
 M RECOVERY.md
?? agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/BIM-002_PRE-Q_TEST_PLAN.md
?? agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/QA_RECON_REPORT.md
?? agent_docs/RESPONSES/response_2026-09-02_bim002-qa-target-map.md
?? agent_docs/SESSIONS/session_2026-09-02.md
?? next-env.d.ts
?? tsconfig.tsbuildinfo
```

These paths were present before this response/evidence write. Cody did not alter or clean them. Phase 1 adds only the two QA paths listed in §1.

The BIM-002 implementation inventory is the twelve migrations 0016–0027, fifteen harness files under `scripts/rls-harness/`, `package.json`’s `rls:prove` entry, and `agent_docs/AUTHORITY/RLS_TEMPLATES.md`, matching the recon inventory.

## 4. Ruled-state reconciliation

| Topic | Ruled/current state from Erratum + evidence-filled spec | Executable/static specimen | Discrepancy classification |
|---|---|---|---|
| Helper count | Four helpers, including `my_business_ids()` | Four helpers in 0016 | Manager “three helpers” and original AC8 three-name list are **documentary residue**. No implementation conflict. |
| Policy count | 15 new + 3 untouched baseline = 18 total | 15 `CREATE POLICY` statements in 0017–0027; no BIM policy targets baseline tables | Manager “17 policies” is **documentary residue** governed by E-1. |
| AC13 | Struck; no CI in BIM-002 | No CI file; npm task only | Original AC13/Manager DoD CI wording is **documentary residue** governed by E-3. |
| Helper ACL law | Revoke PUBLIC and anon separately; grant authenticated; fresh-create proof required | Both revokes and authenticated grant exist for all four helpers | Executable state aligns. E-4’s “ratification requested” historical phrasing versus later governing use is status residue, not a behavioral conflict. |
| Final predicate | C via SECURITY DEFINER set-returning `my_business_ids()`; B nowhere | C on businesses/user_data/report_files SELECT; no inline B | X2 §4 “B adopted” is **documentary/audit-trail residue** explicitly superseded by §7, E-5, template, and migrations. |
| Junction-first | 0017 junction SELECT precedes dependent tenant policies | `ub_select_self` in 0017; C tenants in 0019/0021/0022 | Aligned. Migration 0016’s comment points to 0019 as the junction restriction rather than 0017; low-level documentary typo. |
| Forbidden sources | No policy/helper membership logic from `user_roles`, metadata, profiles, or `owner_user_id` | Boundary-aware, comments-stripped counts are zero for all five | Aligned. |
| Deny-all tables | `pending_registrations`, `apa_memberships`, `audit_logs` have no policies | No BIM-002 policy targets any of the three | Aligned. |
| Baseline preservation | Existing `user_roles`/`profiles` policies untouched | No 0016–0027 policy targets either table | Aligned statically; live catalog preservation remains a later execution question. |

No unresolved authority conflict changes the executable Phase-1 expectation. The remaining conflicts are ruled documentary residue or historical wording, and were not repaired.

## 5. Migration attack result

The independent, comments-stripped static probe observed:

- Four helpers, all declared SQL/STABLE/SECURITY DEFINER with empty search path.
- Fully-qualified table references (`public.user_businesses`; `is_account_member` also reads `public.businesses`) and `auth.uid()` on all helpers.
- PUBLIC revoke, anon revoke, and authenticated grant for each helper.
- Exactly 15 BIM-002 policy statements.
- Junction self-SELECT in 0017 before dependent policies.
- C on businesses, `user_data`, and `report_files` SELECT; no executable inline B.
- `user_data` INSERT uses WITH CHECK; UPDATE uses USING + WITH CHECK; DELETE calls `is_admin_of`.
- Accounts/subscriptions call the ruled account-membership helper.
- Five reference tables each expose one authenticated SELECT USING(true) and no write policy.
- No BIM-002 policy for the three deny-all tables, baseline `user_roles`/`profiles`, or Storage.
- Zero forbidden executable references after comments were removed.
- No table, column, or index structural DDL in 0016–0027.

AC20 challenge: all four function bodies were byte-equal between `RLS_TEMPLATES.md` and migrations, and every named shipped template policy statement had an exact text match in a migration. The sole unmatched template `CREATE POLICY "..."` is in the section explicitly documenting B as an unshipped anti-pattern.

## 6. Observation table

Severity is QA-planning priority only, not a module verdict.

| ID | Target | Observation | Evidence | Severity | Recommended Phase-2 follow-up |
|---|---|---|---|---|---|
| P1-01 | Specimen identity | Direct metadata resolves `qa/bim002` at the exact pinned HEAD. | Raw evidence §Specimen; `.git/HEAD`; branch ref | INFORMATIONAL | Recheck metadata immediately before any later live phase. |
| P1-02 | Migration implementation | Static executable state matches the ruled four-helper/15-policy/C/junction-first plan; forbidden sources and structural DDL absent after comment stripping. | Raw evidence §Migration; 0016–0027 | INFORMATIONAL | Confirm the same objects from live catalogs after a fresh scratch apply. |
| P1-03 | Authority package | Stale three-helper, 17-policy, AC13-CI, lifecycle, and original AC8 text remains, but Errata/evidence table explicitly governs it. | Manager, Acceptance Spec, Erratum; §4 above | MEDIUM | Sol should continue to bind later cases to the ruled table, not stale criterion prose. |
| P1-04 | Main matrix identity | `harness.mjs` fails on sign-in error but never compares returned `session.user.id` with the intended seed ID. Engineering addendum’s “every instrument asserts” statement is false for the main matrix; QA Recon was correct. | `harness.mjs:27–34`; raw evidence §Harness | HIGH | Wrap/replicate matrix sessions with an independent exact-ID assertion before trusting matrix cells. |
| P1-05 | DENY classifier | `verdictFromResult()` maps every API error to DENY. A constraint/type/network error can satisfy an expected denial without proving RLS or the operation-specific deny shape. `attacks.mjs` likewise treats every non-ALLOW result as denied. | `lib/verdict.mjs:16–22`; `attacks.mjs:30–45` | HIGH | Require SELECT=0/no error, INSERT=42501, UPDATE/DELETE=0/no error and independently ground-truth selected mutations. |
| P1-06 | Matrix mutation targets | Many expected-DENY UPDATE/DELETE cells use a sentinel missing UUID because payload target is null. An over-permissive policy can still affect zero rows and score DENY. | `harness.mjs:57–60`; `payloads.mjs:12–29` | HIGH | Exercise existing service-role-confirmed rows for each critical denied UPDATE/DELETE surface. |
| P1-07 | Matrix mutation truth | The 320-cell matrix does not service-role ground-truth denied mutations. Dedicated attacks truth selected user_data/junction/account/pbm mutations, not every matrix mutation; A7.1 reference INSERT has no truth callback. | `harness.mjs`; `attacks.mjs`; raw evidence | MEDIUM | Add independent before/after truth for the Phase-2 mutation subset selected by Sol. |
| P1-08 | Non-vacuity/scope | Seed provides rows in all sixteen matrix tables, but matrix SELECT uses `.limit(5)` and proves only any-row presence/absence. Exhaustive scoping is limited to user_data/businesses/accounts plus targeted direct-ID attacks. | `seed.mjs`; `harness.mjs:49–50`; `scoping.mjs` | MEDIUM | Independently count and tenant-filter critical readable tables, especially junction/report/subscription. |
| P1-09 | Cleanup/restoration | Matrix service-role cleanup/restoration does not fail on cleanup error or assert final shape for every table; it only increments successful counters. Cleanup can therefore leave unreported residue outside later scoped tables. | `harness.mjs:91–105` | MEDIUM | Snapshot service-role counts/selected values before and after attack groups. |
| P1-10 | Target selection | Prefix/fallback resolution selects DB coordinates; `prove.mjs` then supplies reset authorization automatically. The reset tool checks the flag but has no independent project/host allowlist. | `lib/env.mjs`; `prove.mjs:31–33`; `db-reset.mjs:37–55` | HIGH | Tony must confirm intended scratch selection out-of-band; add a non-destructive target fingerprint/allowlist check before release. |
| P1-11 | Auth cleanup | Seed calls `listUsers({perPage:1000})` once and does not paginate; “purge ALL” is not proven beyond 1,000 identities. | `seed.mjs:52–59` | MEDIUM | Count/paginate Auth identities or otherwise verify absence before and after the live seed. |
| P1-12 | AC8 execution probe | Catalog privilege checks cover four helpers, but direct anon execution probes only `my_business_ids()`. | `ac8-check.mjs:39–57` | MEDIUM | Directly execute all four as PUBLIC/anon/authenticated after fresh apply. |
| P1-13 | Seed-map coupling | Seed rewrites tracked `seed-map.json`; direct harness invocation can consume stale IDs. The one-command runner stops on seed failure, but individual tools do not attest map freshness. | `seed.mjs:112–121`; harness readers | MEDIUM | Bind map to run/target and independently compare every session ID before using it. |
| P1-14 | Normalization | UUID/timing/fingerprint masking preserves outcomes/counts/host but can erase wrong identity/tenant identifier drift or material performance drift from equality comparisons. | `prove.mjs:63–82` | MEDIUM | Compare raw security-significant identifiers through a safe relation map before normalized diff; never use normalized equality alone. |
| P1-15 | Evidence labeling | Existing X6 consolidated proof points to an `X5-matrix` sub-log while the spec names an X6 matrix. Current runner has phase-label support, apparently added after that evidence. | X6 proof line 105; spec AC1; `prove.mjs:18–22,37` | LOW | Require later evidence names and internal labels to agree with target/phase. |
| P1-16 | AC18 evidence | No standalone raw X7 build/tsc/Jest/type-diff artifact was found under BIM-002 evidence; only the X7 handoff summary was found. | Evidence inventory; X7 handoff lines 10–13 | MEDIUM | Re-run/capture board commands later if Sol requires independent acceptance evidence. |
| P1-17 | AC20 evidence | Engineering lacked a standalone diff artifact, but Phase 1 independently established exact equality for all four function bodies and every named shipped template policy statement. | Raw evidence §AC20 | INFORMATIONAL | Preserve the static probe; repeat only if migration/template text changes. |
| P1-18 | Storage evidence | X0 directly records initial Storage policy count zero. The searched final/two-target statement exists only in the X7 summary. | X0 lines 36–37; X7 handoff line 15 | MEDIUM | Read final live Storage catalog on the authorized throwaway(s), without exercising Storage behavior. |
| P1-19 | X2 decision record | X2 §4 says B adopted; §7 expressly supersedes it with C. Erratum E-5, templates, and executable migrations consistently use C. | `X2_AB_DECISION.md:41–103`; E-5; 0016/0019/0021/0022 | LOW | Attack C only; retain B shield failure as a negative control if Sol authorizes it. |
| P1-20 | Service-role boundary | Source confines service-client construction to `lib/db.mjs`; user-under-test matrix cells use publishable clients. Service role is used for seed, cleanup/restoration, ground truth, and revocation. | `lib/db.mjs`; serviceClient import/use search | INFORMATIONAL | During live QA, ensure policy observations come from publishable authenticated clients and label all service-role truth lines. |
| P1-21 | Policy structural checker | L1 catches duplicates but not whether a singleton policy is authorized by the plan. L3’s inline-junction source regex is narrower than all possible schema-qualified forms. | `policy-check.mjs:24–58` | LOW | Compare live inventory against an independent allowlist; grep live predicate text for both qualified/unqualified junction references. |
| P1-22 | Catalog-source doctrine | `db-reset.mjs::inventory()` uses `information_schema.tables` although campaign doctrine says verification instruments use `pg_catalog`; helper/policy checks do use catalog sources. | `db-reset.mjs:68–76`; Manager §6.9 | LOW | Use an independent `pg_catalog` table inventory during the later catalog attack. |

## 7. Instrument trust assessment

**TRUST WITH INDEPENDENT GROUND TRUTH**

Rationale:

- The harness has valuable controls: fail-closed env/sign-in handling, publishable/secret inequality, real authenticated sessions, seeded non-vacuous rows, exact-count scoping, dedicated attack truth, same-session revocation, catalog laws, and fresh-apply AC8 placement.
- It is not safe as sole proof because the main matrix lacks exact identity assertion, accepts arbitrary errors as DENY, uses missing-row targets for many denied mutations, and does not ground-truth every matrix mutation.
- Dedicated attack/scoping/revocation instruments are stronger than the broad matrix where they assert identity and existing-row truth, but later QA should independently control denial shape, target existence, and service-role before/after state.

This classification is instrument-level and is not a BIM-002 verdict.

## 8. Concrete Phase-2 attack recommendations

Recommendations only; Phase 2 remains locked.

1. Before destructive work, Tony confirms `INTENDED TARGET: SCRATCH` and a non-secret target fingerprint; stop on prefix/fallback ambiguity.
2. Fresh-apply then independently query all four helper definitions, owners, volatility, search paths, raw ACLs, and role privileges; directly invoke every helper as anon and authenticated.
3. Sign in each cast identity and compare returned user ID with an independently obtained seed map before any policy observation.
4. Use operation-specific denial assertions. Do not accept an arbitrary error as RLS denial; require 42501 only where specified and no-error zero rows/affected where specified.
5. For each selected UPDATE/DELETE denial, target an existing row confirmed through service-role ground truth and compare before/after state.
6. Independently test exact cross-tenant counts/direct IDs for businesses, junction rows, user_data, report_files, accounts, and subscriptions.
7. Attack foreign-business INSERT, UPDATE re-home, member/admin DELETE, account writes, and junction self-promotion with existing-row truth.
8. Verify deny-all tables contain rows via service role before asserting user zero rows, and inspect the live policy allowlist rather than only duplicate counts.
9. Inspect live helper/policy bodies for all forbidden sources and both qualified/unqualified inline-junction forms.
10. Capture final Storage policy inventory and baseline policy names/bodies directly from catalogs.
11. Snapshot critical table counts/values before and after harness subsets so service-role cleanup cannot conceal residue.
12. Keep raw target/identity relation evidence separately from normalized comparisons; use normalization only after security-significant parity is established.

## 9. Engineering evidence classification

| Challenge | Phase-1 classification | Reason |
|---|---|---|
| AC18 board/types | **Weak / summary-only; requires independent execution later if relied upon** | X7 handoff summarizes results; no raw evidence artifact found in BIM-002 evidence. |
| AC20 template equality | **Sufficient direct Phase-1 static artifact for later QA consideration** | Independent byte comparison matched four function bodies and all named shipped policy statements. |
| Final/two-target Storage inventory | **Weak / summary-only; requires independent catalog observation later** | X0 has direct before count; final two-target claim found only in X7 summary. |
| X6 target label | **Contradictory evidence labeling** | X6 consolidated log links an X5 matrix label; implementation now supports a phase label. |
| X2 B §4 vs C §7 | **Contradictory historical statements, explicitly resolved in the same artifact** | §7 supersedes §4; erratum/template/migrations converge on C. |
| Three-helper / 17-policy / CI wording | **Documentary residue** | E-1/E-3/E-5 and executable state explicitly govern the correction. |

## 10. Declared gaps

- No live catalog, policy, helper, Auth, or RLS behavior was observed in Phase 1.
- No credential or target value was read; current scratch-selection correctness remains unknown and is Tony’s boundary.
- The worktree status is a QA-generated index/hash equivalent, not literal `git status --short`, because Git operations were forbidden.
- Exact baseline-policy preservation, final Storage inventory, fresh-create ACLs, target default ACLs, and session behavior require an authorized later phase.
- AC18 raw command results remain absent from the searched BIM-002 evidence package.
- Auth absence beyond 1,000 users cannot be established from seed source or saved proof.
- No assessment here determines whether any observation changes Sol’s eventual PRE-Q/Gate-Q adjudication.

## 11. Product-file modification status

**Cody modified no product or shipped implementation file.** The only Phase-1 writes are:

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P1_static_probe_2026-09-02_105931.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/RESPONSE/response_2026-09-02_105931_preq-phase1-static-instrument-attack.md`

No migration, harness, package, source, Engineering evidence, authority, environment, or Git metadata file was modified.

## 12. STOP

**STOP — Phase 1 complete. Phases 2–4 remain LOCKED. Awaiting Sol.**
