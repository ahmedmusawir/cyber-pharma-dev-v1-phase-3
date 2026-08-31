# CODY QA EXECUTION REPORT — BIM-001-CYBER-PHARMA

> Independent deterministic Red Team execution report for Sol, QA Lead. Cody does not adjudicate Gate Q and does not declare BIM-001 pass/fail.

## 1. PREFLIGHT

- Repository: `cyber-pharma-dev-v1-phase-3`
- Repository root: `/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3`
- Branch: `qa/bim-001-cody-01`
- Tested HEAD: `fefde109fe50eb55839dee4dd29129b2ea3de90c`
- Initial working-tree state: clean (`git status --short` emitted no entries)
- Final working-tree state: Cody-created QA artifacts only, untracked under `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/QA/`; no product implementation file modified by Cody
- Git actions: no commit, push, checkout, branch switch, merge, rebase, reset, or cherry-pick
- Contract/implementation inputs inspected before probes: Acceptance Spec, manager, Engineering handoff, erratum, authority routing and data-contract documents, all 15 migrations, reset/bootstrap/verification tooling, and generated Supabase types
- Validated throwaway targets:
  - SCRATCH: project `jmzwhgnyunwssamrqyhp`, session pooler `aws-1-us-west-1.pooler.supabase.com`, disposable full-chain/reset surface
  - REPLICA: project `ihgcsrypblqkwommrkgj`, session pooler `aws-1-ap-south-1.pooler.supabase.com`, disposable baseline-to-chain replay surface
- Live Cyber Pharma database: not contacted
- Credentials: not persisted in QA artifacts

## 2. ATTACK MATRIX — TESTS ACTUALLY PERFORMED

| AC | Independent execution | Actual result | Primary Cody evidence |
|---|---|---|---|
| AC1 | Wiped disposable replica; executed migration 0001 against an empty public schema; then bootstrapped frozen baseline and compared pre/post baseline catalog shape. | Empty attack rejected with PostgreSQL `P0001` and named `BIM-001/0001 BASELINE ASSERT FAILED`. Bootstrap was required. Baseline structural digest remained identical across the chain. | `CODY_AC01_AC03_REPLICA_REPLAY_20260828101509.log` |
| AC2 | Executed documented scratch reset/bootstrap path from zero. | Exit 0; migrations 0001–0015 all `ok`; exact 16-table inventory. | `CODY_AC02_AC13_SCRATCH_RESETS_20260828101509.log` |
| AC3 | Wiped replica, installed frozen two-table baseline, captured pre-chain tables/policies/functions, then applied all 15 migrations and recataloged. | Pre-chain: 2 tables, 3 policies, 2 contract functions. Post-chain: exact 16 tables, same 3 policies, 3 contract functions. No duplicate-object error. Baseline table/policy digest identical. Function-count wording remains a contract question. | `CODY_AC01_AC03_REPLICA_REPLAY_20260828101509.log` |
| AC4 | Compared actual sorted names rather than count alone; asserted deferred names absent; dumped PK/FK/UNIQUE/CHECK constraints from `pg_catalog`. | Exact required sixteen present; all three deferred tables absent; catalog contains the declared structural constraints. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC5 | Cataloged account spine; attempted null/orphan account relations and duplicate business identity inside controlled probes. | Required account wiring present. Null `businesses.account_id` rejected `23502`; orphan account FK rejected `23503`; null subscription account rejected `23502`; orphan account owner rejected `23503`; duplicate business identity rejected `23505`; subscriptions has no `business_id`. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC6 | Accepted-value updates plus invalid `owner` and NULL attacks on a real junction fixture. | `admin` and `member` accepted; `owner` rejected by CHECK with `23514`; NULL rejected with `23502`. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC7 | Cataloged RLS and policies; inserted one service-owned fixture row into each new table; selected each exact row under `anon` and non-service `authenticated`. | RLS enabled on all 16 public tables; policy inventory remained the 3 frozen baseline policies; zero new policy delta. Both roles saw zero rows on all 14 new tables; no service-role-success inference used. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC8 | Inventoried declared monetary fields and all real/double columns from actual catalog. | All discovered declared money/formula fields are `numeric`; no real/double precision use observed. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC9 | Inventoried every actual occurrence of `ndc`, `drug_ndc`, `script`, `bin`, `pcn`, and `group_field`. | All occurrences are PostgreSQL `text`. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC10 | Exercised all seven ratified values plus `Portal`, empty string, lowercase `aac`, and NULL. | Seven values accepted; `Portal`, empty string, and lowercase value rejected with `23514`; NULL accepted. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC11 | Cataloged provenance columns and constraints for AAC/WAC/FUL/PBM plus version-registry identity fields. | Each of four reference tables has `source_file`, `imported_at`, and `dataset_version_id` FK. Registry has NOT NULL UNIQUE `dataset_name`, checksum, row count, and latest-upload timestamp. | `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` |
| AC12 | Cataloged all sixteen tables without excluding baseline; corrected a first-run aggregation defect; updated fixtures on all 14 new tables and compared timestamps. | All 14 new tables have both TIMESTAMPTZ columns, `set_updated_at`, and observable bumps. `profiles` and `user_roles` each have only `created_at` and no update trigger. Literal all-sixteen result is false; held as contract/evidence tension per Sol ruling. | `CODY_AC12_CORRECTED_20260828101818.log`; functional bump evidence in structural log |
| AC13 | Cody executed documented scratch reset twice consecutively and compared canonical inventories; Director separately executed and personally witnessed the manual reset. | Cody runs: both exit 0 and inventories byte-identical. Director run: exit 0, all 15 migrations `ok`, exact 16-table inventory. | `CODY_AC02_AC13_SCRATCH_RESETS_20260828101509.log`; `CODY_AC13_DIRECTOR_ONE_WALK_OBSERVATION_20260828.md` |
| AC14 | Parsed every generated Row field/type/nullability and public relationship against Cody's preserved actual post-chain catalog; checked inventory/deferred types; ran TypeScript. | All sixteen table types present; deferred types absent; no column/type/nullability/public-FK drift; `npx tsc --noEmit` exit 0. | `CODY_AC14_TYPES_CATALOG_COMPARE_20260828110709.log`; `CODY_REGRESSION_TSC_20260828110757.log` |
| AC15 | Ran full Jest suite and production build; parsed actual counts; inspected commit scope read-only for auth/product-code changes. | Jest: 28 suites, 128 tests, 0 failures. Build: exit 0, 22 routes. No auth/product-code implementation changes; only `src/types/supabase.ts` changed under `src/`. | `CODY_REGRESSION_JEST_20260828110757.log`; `CODY_REGRESSION_BUILD_20260828110757.log`; `CODY_AC15_SCOPE_INSPECTION_20260828.md` |

## 3. OBSERVATIONS

1. Both declared database targets matched their Director-provided project references and preserved expected post-chain state before destructive QA work.
2. Direct `db.*` hosts were IPv6-unreachable from the runner; the handoff-documented regional session poolers connected successfully.
3. Migration ordering resolved to exactly 15 lexical files, 0001 through 0015. Both zero/bootstrap and frozen-baseline entry paths completed without hidden prerequisite or duplicate-object failure.
4. Baseline shape/policies were preserved byte-for-byte by Cody's canonical snapshot digest. The only contract-function delta was migration 0001 adding `update_updated_at()`.
5. Exact table inventory, deferred absence, account spine, junction vocabulary, Medicaid vocabulary, provenance, type laws, deny-by-default behavior, and generated types matched the committed schema specimen.
6. Mutation fixtures were removed after probing. Both disposable databases remained on the post-chain schema.
7. The build emitted a non-failing stale `caniuse-lite`/Browserslist advisory. Compilation, internal TypeScript, static generation, and route output succeeded.
8. The tested commit tracks `supabase/.temp/cli-latest` and `supabase/.temp/linked-project.json`, despite the Engineering handoff instruction not to commit `supabase/.temp/`. This is recorded as repository-hygiene/runtime residue, not an AC1–AC15 product-schema defect.
9. The known `report_files` fidelity flag remains carried exactly as scoped; Cody did not broaden its schema.

## 4. SUSPECTED DEFECTS

None observed within AC1–AC15 after applying Sol's rulings that AC12 and AC3 remain contract questions rather than product defects.

No product fix was authored or attempted.

## 5. CONTRACT QUESTIONS / TENSIONS

### CONTRACT/EVIDENCE TENSION — AC12

- Expected by literal AC12: all sixteen tables have `created_at` and `updated_at` TIMESTAMPTZ plus the update trigger.
- Observed: all fourteen new tables satisfy the full law and all fourteen functional updates bumped `updated_at`. Frozen baseline tables `profiles` and `user_roles` each contain only `created_at` and no update trigger.
- Conflicting authority: literal all-sixteen wording versus frozen-baseline/no-structural-change requirements and Engineering's fourteen-table evidence.
- Cody disposition: unresolved; no defect ruling and no implementation modification. Routed to Sol/Director/Architect.

### CONTRACT QUESTION — AC3 baseline function count

- Expected by literal AC3 wording: baseline replica has 3 functions.
- Observed pre-chain: `handle_new_user`, `rls_auto_enable` only.
- Observed post-0001/chain: those two plus `update_updated_at`.
- Conflicting authority: AC3 wording versus ratified ERRATUM E-1 and actual migration behavior.
- Cody disposition: unresolved; no defect ruling and no implementation modification. Routed to Sol/Director/Architect.

## 6. QA-INSTRUMENT FAILURES

1. Initial read-only preflight shell call was blocked by `bwrap: loopback: Failed RTM_NEWADDR`. Correction: rerun through the approved execution path; identity results completed.
2. Two read-only calls were Director-interrupted while execution settings were adjusted. They made no repository/database change and were rerun where needed.
3. First interactive credential loader queued `read` setup lines incorrectly, causing the supplied URLs to appear in transient tool output as failed shell commands. No connection or filesystem change occurred. Correction: loader abandoned and non-echoing single-purpose Node input used. Credentials were not persisted; rotation after QA remains recommended.
4. Early target-validator variants encountered stdin EOF, unsuitable `stty` attachment, and one JavaScript regex syntax error before successful connection. Correction: simplified validator reran; successful sanitized validation is preserved.
5. Direct database paths returned `ENETUNREACH`. Correction: used the Engineering-handoff regional session poolers; both read-only validations succeeded.
6. First AC12 catalog query joined attributes directly to triggers, multiplying timestamp counts. The false result remains preserved in `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log`. Correction: independent correlated aggregates reran in `CODY_AC12_CORRECTED_20260828101818.log`, establishing exact counts.
7. While persisting the Director observation, the sandbox wrapper twice blocked an attempted update to the prewritten procedure document. No partial change occurred. Correction: a separate immutable Director-observation artifact was created and is authoritative over the procedure's earlier awaiting-status line.

## 7. MANUAL DIRECTOR ACTION REQUIRED

None outstanding.

The Director personally executed and witnessed the AC13 scratch reset:

- Exit code: 0
- All 15 migrations reported `ok`: YES
- Final public-table count: 16
- Final inventory: exact required sixteen
- Director One-Walk: COMPLETE

## 8. REGRESSION BOARD

| Board item | Actual result | Evidence |
|---|---|---|
| TypeScript | `npx tsc --noEmit` exit 0 | `CODY_REGRESSION_TSC_20260828110757.log` |
| Jest | 28 passed suites / 28 total; 128 passed tests / 128 total; 0 failures | `CODY_REGRESSION_JEST_20260828110757.log` |
| Production build | exit 0; compiled successfully; 22 parsed routes | `CODY_REGRESSION_BUILD_20260828110757.log` |
| Auth/product scope | No auth route, middleware, protected-page, role-resolution, UI, or service source changes in BIM-001 range | `CODY_AC15_SCOPE_INSPECTION_20260828.md` |

Declared baseline comparison: 22 routes / 28 suites / 128 tests / 0 failures — actual results equal the declared baseline.

## 9. EVIDENCE INDEX

### Cody evidence artifacts

1. `CODY_PHASE0_ATTACK_MATRIX_20260828.md` — fail-closed preflight and pre-execution AC1–AC15 attack matrix.
2. `CODY_TARGET_VALIDATION_20260828_DB01.md` — sanitized scratch/replica identity and initial-state validation.
3. `CODY_AC01_AC03_REPLICA_REPLAY_20260828101509.log` — empty-target negative attack, frozen baseline inventory, full replay, and baseline preservation.
4. `CODY_AC02_AC13_SCRATCH_RESETS_20260828101509.log` — two deterministic scratch resets and identical inventories.
5. `CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log` — catalog, constraint, type-law, provenance, RLS/seeded-denial, negative mutation, and functional timestamp probes; contains preserved first-run AC12 instrument error.
6. `CODY_AC12_CORRECTED_20260828101818.log` — corrected all-sixteen timestamp/trigger catalog evidence.
7. `CODY_AC13_DIRECTOR_ONE_WALK_PROCEDURE.md` — minimal manual procedure prepared before witness; its earlier awaiting line is superseded by item 8.
8. `CODY_AC13_DIRECTOR_ONE_WALK_OBSERVATION_20260828.md` — Director-supplied completed manual observation.
9. `CODY_AC14_TYPES_CATALOG_COMPARE_20260828110709.log` — independent generated-types/catalog comparison.
10. `CODY_REGRESSION_TSC_20260828110757.log` — TypeScript execution.
11. `CODY_REGRESSION_JEST_20260828110757.log` — complete Jest execution and parsed counts.
12. `CODY_REGRESSION_BUILD_20260828110757.log` — production build and parsed route inventory.
13. `CODY_AC15_SCOPE_INSPECTION_20260828.md` — read-only product/auth change-scope inspection.
14. `CODY_QA_EXECUTION_REPORT.md` — this persistent final Cody report.

### Disposable QA instruments

1. `cody-bim001-db-runner.mjs` — fail-closed independent replay/reset/catalog/mutation runner.
2. `cody-ac12-corrected.mjs` — corrected AC12 catalog runner.
3. `cody-ac14-types-compare.mjs` — local generated-types/catalog comparator.
4. `cody-regression-runner.mjs` — TypeScript/Jest/build evidence runner.

All listed files are module-scoped under `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/QA/`. No Engineering evidence file was overwritten.

## 10. FINAL EXECUTION STATUS

**EXECUTION COMPLETE — NO DEFECTS OBSERVED**

This is an execution status only. Gate Q authority remains with Sol, QA Lead.
