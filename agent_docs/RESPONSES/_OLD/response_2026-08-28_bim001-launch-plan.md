# BIM-001-CYBER-PHARMA — Launch Plan (Plan Mode, ONE message per manager §9)

**Date:** 2026-08-28 · **Branch (disk):** phase-3-2 @ `70b38ef` · **Status:** PENDING_APPROVAL — opens with X0, carries 3 BLOCKING flags

---

## (1) X0 — Baseline Recon: PARTIALLY BLOCKED

**What X0 demands:** live catalog query output matches DB_BASELINE.md exactly (tables, policies, functions) before migration 0001 is authored.

**Disk side (verified):** `agent_docs/DB_BASELINE.md` expects tables `public.user_roles` + `public.profiles`; policies exactly: "Profiles are updatable by owner or superadmins", "Profiles are viewable by owner or superadmins", "Users can read their own role"; interpretation setup.sql + migration_add_profiles overlay; catalog date 2026-08-11. Manager V-ground adds 3 functions: `handle_new_user()`, `update_updated_at()`, `rls_auto_enable()` — the first exists in on-disk SQL (setup.sql:87, migration:72); **`update_updated_at()` and `rls_auto_enable()` appear in NO SQL on disk** (grep of supabase/setup.sql + docs/*.sql) — they exist only per DATA_CONTRACT_PHASE_1 §3 (doc not on disk either). Live catalog is the only way to confirm them.

**Live side: CANNOT EXECUTE from this machine — see FLAG-B (tooling).** No supabase CLI, no psql, no docker; supabase-js/PostgREST cannot read `information_schema`. X0's live half needs either (a) Director-as-hands catalog run (the BIM-000/Gate-Q precedent), or (b) the toolchain below installed + a read connection string.

**Per the manager: discrepancy = STOP and surface. X0 is surfaced, not skipped — no migration file gets authored before it closes.**

## (2) BLOCKING FLAGS (all three need Director action before build)

- **FLAG-A — Schema authority is not on disk.** FRANK_API `models.py` (the ruled schema authority), TRIANGULATION_DOC, LEGACY_DEMO_FORMAT_MAP, DATA_CONTRACT_PHASE_1, Campaign Map (medicaid_method vocabulary), BIM_PLAYBOOK — none exist in this repo, any sibling repo, or anywhere reachable on this machine (swept `~/nextjs`, `~/python`, `~/Documents`, `~/Downloads`). Found only: a *curated partial* extraction (`cyber-pharma-admin-portal-v1/.../DATA_SHAPES_frank_api.md` — 5 entities, screen-relevant columns, explicitly "only the entities MissionControl reads") and the MATH_SPEC extraction (`pharmacybooks-desktop-main/_EXTRACTIONS/MATH_SPEC/`). The manager's §5 demands "FRANK_API verbatim" / "FULL column set" for `businesses`, `user_data`, `pbm_info`, `apa_memberships`, the 3 reference tables, `report_files`, `audit_logs`, `reference_dataset_versions` — **I cannot author verbatim columns from an authority I cannot read.** This is the doc-repo/project-repo split the campaign journal pre-registered as risk #1. **Need:** stage `models.py` (or a full-fidelity extraction) + TRIANGULATION_DOC §3 + the campaign-map medicaid_method vocabulary into this repo (suggest `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/authority/`).
- **FLAG-B — Toolchain absent for X0–X4, X6.** No supabase CLI, no docker, no psql on this machine; `supabase/` holds only `setup.sql` (never `supabase init`ed — no config.toml, no migrations/ dir). Gates X1–X4 need a scratch Postgres; X6 needs `supabase gen types`. **Proposed toolchain (needs ratification since it installs deps):** `npm i -D supabase pg` — the CLI runs as `npx supabase` and `gen types --db-url` works against a plain connection string without login; the reset/verify runner uses node+`pg` against Director-provided scratch and baseline-replica connection strings (no psql/docker needed). Per X7 standing law, full suite re-runs after the install. Director provides: scratch DB URL + baseline-replica DB URL (+ read-only live URL for X0, or run the catalog as my hands).
- **FLAG-C — Junction-role vocabulary conflict, pre-resolved but must stay visible.** FRANK_API `models.py:306-351` uses `'admin'|'user'` (per the extraction); manager R-3 ratifies `CHECK (role IN ('admin','member'))`. R-3 wins (deliberate rebuild ruling) — noting it so "verbatim" fidelity to models.py is knowingly overridden on this one column.

## (3) Design & File Plan (what I CAN commit to now — structure locked, columns await FLAG-A)

**Migration chain — one file per table, FK-dependency order, under `supabase/migrations/` (created by `npx supabase init` layout or plain dir per Director preference):**

```
0001_baseline_acknowledge.sql     -- asserts user_roles + profiles + 3 policies + 3 functions; RAISE EXCEPTION on mismatch (AC1)
0002_accounts.sql                 -- R-2 spine: id uuid PK, name, owner_user_id FK→auth.users, timestamps
0003_businesses.sql               -- FRANK verbatim + account_id NOT NULL FK, UNIQUE(ncpdp,npi), lifecycle, pharmacy_slug, has_used_trial, Stripe fields
0004_user_businesses.sql          -- junction: UNIQUE(user_id,business_id), role TEXT CHECK('admin','member'), is_primary
0005_pending_registrations.sql    -- FRANK full shape (extraction has most of it; verify vs models.py)
0006_subscriptions.sql            -- account_id FK (NO business_id), Stripe state mirror
0007_apa_memberships.sql          -- UNIQUE license_number, discount_redeemed
0008_reference_dataset_versions.sql -- first of the reference family: checksum, row_count, per-dataset identity
0009_aac_reference.sql            -- UNIQUE(ndc,aac_date), effective_date, provenance cols
0010_wac_reference.sql            -- + pkg_size, pkg_size_mult, generic_indicator; NO wac_by_unit computed col
0011_ful_reference.sql            -- UNIQUE(ndc,year,month), provenance cols
0012_pbm_info.sql                 -- bin/pcn/state/email/pbm_key TEXT, matching_type NOT NULL, provenance
0013_user_data.sql                -- PHI fact table, FULL FRANK column set + business_id NOT NULL + pbm_key + medicaid_method CHECK + rate-provenance cols
0014_report_files.sql             -- FRANK shape, empty consumer
0015_audit_logs.sql               -- append-only, record_id VARCHAR(128), 3 indexes
```

Every migration: explicit `ALTER TABLE … ENABLE ROW LEVEL SECURITY` (belt) + rely-verify `rls_auto_enable()` (suspenders, gate-checked not trusted) · zero policies · `created_at/updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` + `update_updated_at()` trigger · money NUMERIC · ndc/script/bin/pcn/group_field TEXT · no seed rows · no storage.

**Reset runner:** `scripts/db-reset.mjs` + npm task `db:reset` — takes `DB_URL` env, drops schema objects created by the chain (or drops/recreates `public` on scratch), replays 0001–0015 in order, prints final inventory; exits non-zero on any error. Runs twice clean = X3.

**Verify runner:** `scripts/db-verify.mjs` + `db:verify` — post-chain assertions for X4 (RLS enabled on all 16, anon/authenticated SELECT denied), X5 type audit (information_schema dump: no float/real/double on money list; identifier TEXT law), AC4 inventory, AC5/AC6/AC10/AC12 structural checks. One evidence file per gate (unique filenames — BIM-000 lesson).

**Types:** `npx supabase gen types typescript --db-url $SCRATCH_URL > src/types/supabase.ts` (X6) → tsc must stay clean; note repo convention is `/types` per CLAUDE.md but `src/types/supabase.ts` is spec-mandated (AC14) — spec wins, flagged for awareness.

**Docs at close:** spec evidence-fill, RETROSPECTIVE, KIP check (none touched), CHANGELOG, session/RECOVERY, manager CLOSED flip.

## (4) Command Sequence (once flags clear)

1. Toolchain install (`npm i -D supabase pg`) → full triad re-run (X7 standing law, baseline board 28/128/0)
2. X0 live catalog vs DB_BASELINE.md → evidence file → STOP if mismatch
3. Author 0001 → run against baseline-replica → verify loud-fail on empty DB (AC1 negative test)
4. Author 0002–0015 from staged authority docs
5. X1 scratch-from-zero run · X2 baseline-replica run · X3 reset ×2 · X4/X5 verify runner · X6 types + tsc · X7 board
6. Spec evidence-fill per AC1–AC15 → handoff manifest (per-concern commit lists, zero git by me) → retrospective

## (5) Out of Scope / Forbidden (said loud)

No RLS policies beyond deny-by-default (BIM-002) · no audit triggers/RPCs (BIM-003) · no seed data (BIM-004) · no service/UI wiring (BIM-005+) · no pbm_key derivation logic (Phase 5) · no storage buckets · no `user_roles`/`profiles` structural change · **zero git/cloud commands by me** · live DB is NEVER a migration target for me — scratch/replica only; live application is Director-only post-Gate-Q (spec prerequisite 3).

→ **Awaiting: (a) plan approval, (b) FLAG-A authority docs staged, (c) FLAG-B toolchain ratification + connection strings (or Director-as-hands X0).** No migration file is authored before X0 closes green.
