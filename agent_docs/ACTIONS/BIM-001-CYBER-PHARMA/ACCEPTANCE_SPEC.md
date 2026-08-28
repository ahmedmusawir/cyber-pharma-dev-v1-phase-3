# ACCEPTANCE_SPEC.md — BIM-001-CYBER-PHARMA
## Schema Migrations: Sixteen-Table Target Schema

> **Lifecycle:** SEEDED → **ENGINEER EVIDENCE-FILLED (2026-08-28)** → QA-VERIFIED
> **Owning application:** CYBER-PHARMA (cyber-pharma-dev-v1-phase-3)
> **Seeded by:** Architect, 2026-08-28, from the approved module contract (manager §5–§7)
> **Branch + SHA (disk at engineering close):** `phase-3-2`, base `70b38ef`, work uncommitted — pin the close commit here at PRE-Q (BIM-000 lesson)
> **Evidence root:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/evidence/` (unique filenames per gate)
> **Ownership law:** criteria below are Architect/Director-defined. The Engineer maintains and finalizes this spec at handoff and may NOT silently add, remove, weaken, or redefine any requirement. Scope changes require Director approval.

---

## Objective

The live database migrates from the verified two-table baseline to the sixteen-table Cyber Pharma v1 target schema via a committed, replayable migration chain, with every new table born deny-by-default and TypeScript types regenerated to match.

## In Scope

Migration chain (fourteen new tables + baseline acknowledgment), structural constraints (PK/FK/UNIQUE/CHECK/NOT NULL), RLS enablement (no permissive policies), updated_at triggers, one-command reset script, regenerated `src/types/supabase.ts`.

## Out of Scope / Forbidden

RLS policies beyond deny-by-default · audit triggers/RPCs · seed data · service-layer or UI wiring · pbm_key derivation logic · storage buckets · structural changes to `user_roles`/`profiles` · any git/cloud command by the Engineer.

---

## Environment / Setup Prerequisites (Director executes — READ FIRST)

1. Supabase CLI authenticated against the Phase-3 project; scratch/branch database available for X1–X4 evidence runs.
2. `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` present (fail-closed set per DATA_CONTRACT_PHASE_1 §6).
3. Migrations applied to the LIVE database only by the Director, only after Gate Q PASS — QA verifies on scratch/replica first.
4. `supabase gen types typescript` available in the toolchain.

---

## Acceptance Requirements

**AC1 — Baseline acknowledgment.** Migration 0001 verifies `user_roles` and `profiles` exist with expected shape and fails loudly (non-zero, named error) when run against a database missing them. Observable: chain aborts with explicit message on an empty DB unless baseline is present or explicitly bootstrapped by the chain's documented entry path.

**AC2 — Chain applies from zero.** The full chain (via the reset script's bootstrap path) applies to a fresh database, exit 0, producing exactly sixteen target tables plus baseline objects. Observable: `select count(*) from information_schema.tables where table_schema='public'` matches the declared inventory.

**AC3 — Chain applies on baseline replica.** Against a replica containing only baseline (2 tables, 3 policies, 3 functions), the chain applies with exit 0 and no duplicate-object errors.

**AC4 — Sixteen-table inventory.** Post-chain, these tables exist with declared PK/FK/UNIQUE constraints: accounts, businesses, user_roles, profiles, user_businesses, pending_registrations, subscriptions, apa_memberships, user_data, report_files, aac_reference, wac_reference, ful_reference, pbm_info, audit_logs, reference_dataset_versions. Deferred tables (desktop_client_versions, local_desktop_users, password_reset_tokens) do NOT exist.

**AC5 — Accounts spine wiring.** `businesses.account_id` is NOT NULL FK→accounts. `subscriptions.account_id` is FK→accounts; `subscriptions` has NO business_id column. `accounts.owner_user_id` is FK→auth.users.

**AC6 — Junction role constraint.** `user_businesses.role` is TEXT with CHECK constraint permitting exactly 'admin' and 'member'. Observable: INSERT with role='owner' (or any third value) is rejected by the database.

**AC7 — Deny-by-default on all new tables.** Every table created by this module has RLS enabled. As `anon` and as `authenticated` (non-service) contexts, SELECT on each of the fourteen new tables returns zero rows or permission-denied. Zero permissive policies added by this module (policy count delta from baseline = 0).

**AC8 — Money type law.** No column storing a monetary value uses float/real/double precision. All money columns are NUMERIC. Evidence: information_schema column dump for the declared money-column list.

**AC9 — Identifier text law.** `drug_ndc`/`ndc`, `script`, `bin`, `pcn`, `group_field` are TEXT (character varying/text) on every table where they appear.

**AC10 — medicaid_method constrained vocabulary.** `user_data.medicaid_method` carries a CHECK constraint limited to the campaign-map vocabulary. Out-of-vocabulary INSERT is rejected.

**AC11 — Reference provenance.** aac_reference, wac_reference, ful_reference, pbm_info each carry provenance columns (source file, imported-at, dataset-version linkage) per manager §6.4, and `reference_dataset_versions` carries checksum + row_count + per-dataset identity.

**AC12 — Timestamps everywhere.** All sixteen tables carry `created_at`/`updated_at TIMESTAMPTZ` with the `update_updated_at()` trigger attached; an UPDATE observably bumps `updated_at`.

**AC13 — One-command reset.** A single documented command rebuilds the full chain on a scratch database; running it twice consecutively both exit 0 with identical final inventory.

**AC14 — Types regenerated.** `src/types/supabase.ts` regenerated from the post-chain schema and committed; `tsc` clean; the sixteen table types are present in the file.

**AC15 — Regression: board stays green.** Build succeeds (22 routes), tsc clean, full jest suite passes (baseline 28 suites / 128 tests / 0 fail — final run equal or better). Existing auth flows (login, role resolution, protected routes) unaffected.

---

## Gate ↔ AC Mapping

| Gate | ACs |
|---|---|
| X0 | AC1 (precondition evidence) |
| X1 | AC2, AC4 |
| X2 | AC3 |
| X3 | AC13 |
| X4 | AC7 |
| X5 | AC8, AC9 |
| X6 | AC14 |
| X7 | AC15 |
| (structural review) | AC5, AC6, AC10, AC11, AC12 |

## Manual-Only Acceptance Points

- Director-witnessed reset run on scratch (AC13) — One-Walk Rule applies: QA Lead designs/directs, Director executes as hands, evidence serves both PRE-Q and certification.

## Known Limitations / Follow-Up NOT in This Contract

- Permissive RLS policies (BIM-002) · audit population (BIM-003) · seed data (BIM-004) · pbm_key derivation + BIN 004146 normalization function (Phase 5) · medicaid_method vocabulary may widen on Frank's rulings (amendment path) · pending_registrations usage pending Frank confirm.

---

## Engineer Evidence (per requirement, 2026-08-28)

- **AC1** ✅ — 0001 asserts tables + 3 byte-faithful policies + both live functions + `ensure_rls` by real name, then CREATE-OR-REPLACEs `update_updated_at()` (X0 ruling (i), riders honored; ERRATUM.md cited in-file). **Negative test:** chain vs EMPTY DB → **exit 2**, named `BIM-001/0001 BASELINE ASSERT FAILED` message. *Evidence:* `AC1_replica_empty_loudfail.log`; bootstrap path documented in `scripts/db-reset.mjs` header.
- **AC2** ✅ — `db:reset` (bootstrap path) on fresh scratch: 15/15 migrations ok, inventory = **exactly 16 tables**. *Evidence:* `X1_scratch_reset_run1.log`.
- **AC3** ✅ — replica wiped (Director-authorized) → bootstrap = exactly the 2-table baseline → `db:apply` → **exit 0, zero duplicate-object errors**, 16 tables. *Evidence:* `X2_replica_wipe.log`, `X2_replica_bootstrap.log`, `X2_replica_apply.log`.
- **AC4** ✅ — verify: "AC4 inventory — exactly 16 tables" + "deferred tables absent" on BOTH scratch and replica. *Evidence:* `X4X5_scratch_verify_probes_rerun.log`, `X2_replica_verify_structural.log`.
- **AC5** ✅ — businesses.account_id NOT NULL FK→accounts; subscriptions.account_id FK→accounts with **NO business_id column**; accounts.owner_user_id FK→auth.users (verified via `pg_constraint` after the instrument's information_schema privilege-blindness false-fail was corrected — first-run FAIL documented, schema was correct throughout). *Evidence:* both verify logs + `X4X5_scratch_verify_probes.log` (the false-fail run, kept).
- **AC6** ✅ — CHECK definition present AND functional probe: INSERT role='owner' **rejected** (23514), 'member' accepted. *Evidence:* probes rerun log.
- **AC7** ✅ — RLS enabled on every public table; policy delta from baseline = **0** (the 3 baseline policies only); anon AND authenticated SELECT on all 14 new tables → 14/14 empty/denied; `ensure_rls` event trigger verified firing on a probe table (law §6.1's "verify the net"). *Evidence:* probes rerun log.
- **AC8** ✅ — zero real/double-precision columns in public schema; declared money list (13 user_data + wac + aac + ful cols) all `numeric`. *Evidence:* probes rerun log.
- **AC9** ✅ — ndc/drug_ndc, script, bin, pcn, group_field (+ncpdp/npi) TEXT on every table where they appear. *Evidence:* probes rerun log.
- **AC10** ✅ — CHECK carries exactly the 7 ratified values (Architect ruling 2026-08-28: NULLable, ''→NULL importer mapping documented in 0013 / implemented BIM-004, 'Portal' excluded); functional probe: 'Portal' **rejected** (23514), 'AAC' accepted. *Evidence:* probes rerun log.
- **AC11** ✅ — 12/12 provenance columns (source_file, imported_at, dataset_version_id) across aac/wac/ful/pbm_info; reference_dataset_versions = dataset_name (UNIQUE) + checksum + row_count + latest_upload_at. *Evidence:* `AC11_provenance_columns.log`.
- **AC12** ✅ — timestamptz pair + `set_updated_at` trigger on all 14 new tables (baseline 2 acknowledged as-is per manager §5 rows 3–4); functional probe: UPDATE observably bumps updated_at. *Evidence:* probes rerun log.
- **AC13** ✅ — one documented command (`DB_URL=… DB_RESET_ALLOW=yes npm run db:reset`); run twice consecutively: both exit 0, **inventories byte-identical** (diff = IDENTICAL). *Evidence:* `X1_scratch_reset_run1.log` + `X3_scratch_reset_run2.log`. Director-witnessed re-run per One-Walk Rule remains available to QA on the scratch project.
- **AC14** ✅ — `src/types/supabase.ts` regenerated from post-chain schema (Director-as-hands: login → `gen types --project-id <scratch>` → logout; credential never entered this session); all 16 table types present, deferred 3 absent, 1,100 lines; `tsc --noEmit` clean against it. *Evidence:* file on disk + board run.
- **AC15** ✅ — build passes (22 routes), tsc clean, jest **28 suites / 128 tests / 0 failures** (= FIX-001 baseline, no delta); auth flows untouched (`src/` untouched by this module except `types/supabase.ts`).

**Fidelity flag (carried, non-blocking):** `report_files` columns are not enumerated in the FRANK extraction (models.py:826-849 summarized only) — authored as minimal attested shape, flagged in-file; true up against verbatim source when staged (amendment path).

*Lifecycle banner flips to QA-VERIFIED only by Sol.*

🥄
