# BIM-001 — CHAIN AUTHORED · holding for gate-run URLs
**Date:** 2026-08-28 · **Status:** 15 migrations + reset/verify runners + ERRATUM on disk · X5-static ✅ · X7 board ✅ · X1–X4/X6 await scratch+replica URLs

## The chain (supabase/migrations/)

| File | Table | Key authority calls |
|---|---|---|
| 0001_baseline_acknowledge | — | assert-then-create (X0 rider 3): asserts 2 tables, 3 byte-faithful policies, handle_new_user + rls_auto_enable + `ensure_rls` BY REAL NAME (rider 1); creates ONLY `update_updated_at()` (option (i), ERRATUM E-1 cited in-file) |
| 0002_accounts | accounts | R-2 spine: name, owner_user_id FK→auth.users |
| 0003_businesses | businesses | FRANK verbatim + account_id NOT NULL (R-2) + pharmacy_slug UNIQUE (Triangulation §3.1) + subscription-STATE fields moved out (§3.5+R-2, in-file comment); UNIQUE(ncpdp,npi); status CHECK pending/active/suspended |
| 0004_user_businesses | user_businesses | role TEXT CHECK ('admin','member') default 'member' (R-3 override of catalog 'admin'/'user', in-file comment); UNIQUE(user_id,business_id) |
| 0005_pending_registrations | pending_registrations | FRANK full shape; status CHECK 5 values; activation_token UNIQUE; UNIQUE(email,ncpdp,npi) |
| 0006_subscriptions | subscriptions | account_id FK, **NO business_id** (R-2/AC5); Stripe state mirror; status CHECK 6 documented values |
| 0007_apa_memberships | apa_memberships | verbatim; license_number UNIQUE; discount_redeemed_business_id soft-ref (catalog) |
| 0008_reference_dataset_versions | reference_dataset_versions | dataset_name UNIQUE + checksum + row_count; first of the family for provenance FKs |
| 0009–0012 | aac/wac/ful_reference, pbm_info | catalog UKs; wac adds pkg_size/pkg_size_mult/generic_indicator, drops wac_by_unit (Triangulation §3.3); pbm_info FULL shape + pbm_key COLUMN (derivation = Phase 5, forbidden) + matching_type NOT NULL; provenance trio everywhere (law §6.4) |
| 0013_user_data | user_data | FRANK FULL column set + pcn/group_field/pbm_key/owed (manager §5.9) + **medicaid_method NULLable CHECK on the 7 ratified values** ('' → NULL documented in-file, implemented BIM-004 per rider 1) |
| 0014_report_files | report_files | minimal attested shape — **FIDELITY FLAG: catalog cols not enumerated in extraction** (flagged in-file, carried to spec) |
| 0015_audit_logs | audit_logs | verbatim; record_id VARCHAR(128); 3 catalog indexes; action left unconstrained (catalog has no CHECK — none invented) |

Every table: explicit `ENABLE ROW LEVEL SECURITY` (belt; `ensure_rls` verified as net via probe) · zero policies · TIMESTAMPTZ pair + `set_updated_at` trigger · money NUMERIC · identifiers TEXT · no seeds · no storage.

## The runners (scripts/)

- **db-bootstrap-baseline.sql** — scratch-only (rider 3): reproduces the LIVE baseline exactly (incl. the smart-trigger `handle_new_user`, the migration-overlay policy names, and the `rls_auto_enable`/`ensure_rls` pair that exists on live but in no disk SQL).
- **db-reset.mjs** — `reset` (guarded: `DB_RESET_ALLOW=yes`; drops event trigger before schema; Supabase-standard re-grants; bootstrap; chain) · `apply` (chain only — the X2 replica path; 0001 asserts first) · `inventory`. Fail-closed anchors + named-file failure exits per BIM-000 runner lessons.
- **db-verify.mjs** — structural: AC4 inventory/deferred-absent, X4 RLS+zero-policy-delta+anon/authenticated deny probe, X5/AC8/AC9 type laws via information_schema, AC5 spine wiring (FK introspection incl. NO business_id on subscriptions), AC6/AC10 CHECK definitions, AC12 timestamps+trigger. `--probes` (scratch only): AC6/AC10 functional INSERT rejections, AC12 updated_at bump, ensure_rls fire test.
- npm: `db:reset` / `db:apply` / `db:inventory` / `db:verify` / `db:verify:probes` (all take `DB_URL` env).

## Gate status

| Gate | Status |
|---|---|
| X0 | ✅ CLOSED GREEN (with ruled discrepancy — ERRATUM.md) |
| X5 (static half) | ✅ zero float/real/double in chain; money NUMERIC; ids TEXT |
| X7 | ✅ build 22 routes · tsc clean · jest **28/128/0** |
| X1 X2 X3 X4 X6 | ⏳ **blocked on scratch + baseline-replica DB URLs** |

## Director run-sheet once URLs land

```
DB_URL=<scratch>  DB_RESET_ALLOW=yes  npm run db:reset          # X1 (scratch-from-zero)
DB_URL=<scratch>  npm run db:verify:probes                       # X4/X5 + functional ACs
DB_URL=<scratch>  DB_RESET_ALLOW=yes  npm run db:reset          # X3 (2nd consecutive — must match)
DB_URL=<replica>  npm run db:apply                               # X2 (baseline replica)
DB_URL=<replica>  npm run db:verify                              # structural on replica
npx supabase gen types typescript --db-url <scratch> > src/types/supabase.ts   # X6, then tsc + board
```
I run these myself the moment the URLs arrive — this sheet is what will execute.

## Flags carried to spec

- `report_files` fidelity flag (minimal attested shape; verify vs models.py:826-849 when staged).
- ERRATUM.md: DATA_CONTRACT §3 amendment for Director staging in the doc repo.
