# BIM-001 — Pre-Build/X0 Status
**Date:** 2026-08-28 · **Status:** toolchain ✅ · board ✅ · authority ✅ · medicaid vocabulary DERIVED (awaiting ratification) · **X0 live half → Director hands**

## 1. FLAG-B executed

- `npm i -D supabase pg` — clean, 0 vulns. CLI **2.116.0** live via `npx supabase`.
- **X7 standing law honored — full board re-run post-install:** build ✓ (22 routes) · `tsc --noEmit` clean · jest **28 suites / 128 tests / 0 failures**. Baseline unchanged.

## 2. Authority package absorbed

Precedence per AUTHORITY_README.md: Manager R-rulings → TRIANGULATION_DOC §3 → FRANK_API-02-ARCHITECTURE-MAP (the verbatim catalog) → Format Map (format truth only) → DATA_CONTRACT_PHASE_1 (baseline objects). Fidelity rule noted: every deliberate catalog divergence gets a one-line authority comment in the migration file.

DATA_CONTRACT_PHASE_1 confirms the three baseline functions (`handle_new_user()`, `update_updated_at()`, `rls_auto_enable()` incl. the RLS event trigger) and the `app_role` enum (`superadmin`,`admin`,`member`) — all now encoded in the X0 instrument.

## 3. medicaid_method — DERIVED VOCABULARY (per AUTHORITY_README: surface, WAIT for ratification before 0013)

Source: MATH_SPEC-01-PRICING-METHODS §9 "Method Value Reference for the Web Port" (+§4 branch table):

| Value | Origin |
|---|---|
| `AAC` | AAC-present branch |
| `FUL` | FUL branch |
| `GWAC` | generic WAC branch |
| `BWAC` | brand WAC branch |
| `Take Action` | nothing found (Path B/D) |
| `Manual Override` | operator-edited rate preserved (Path B) |
| `Legacy` | stored rate present, calc found nothing (Path B) |
| `''` (empty) | Path A no-rate-found initialization |

**Excluded:** `"Portal"` — exists only in commented-out code (MATH_SPEC §9 GAP note).

**⚠️ DESIGN QUESTION for the Architect (blocks 0013 only):** how to encode the Path-A empty value in Postgres —
- **(a) RECOMMENDED:** column NULLable; `CHECK (medicaid_method IN ('AAC','FUL','GWAC','BWAC','Take Action','Manual Override','Legacy'))` applied when NOT NULL; importers map `''`→NULL. Clean Postgres idiom; one divergence comment citing this ruling.
- **(b)** admit `''` into the CHECK verbatim: `IN ('AAC','FUL','GWAC','BWAC','Take Action','Manual Override','Legacy','')` with NOT NULL. Byte-faithful to desktop behavior, uglier contract.

MATH_SPEC itself records the GAP that no constraint enforces this set anywhere in the desktop — this CHECK is the first-ever enforcement, which is exactly why the ratification gate matters.

## 4. X0 — live half handed to Director

`agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/X0_CATALOG.sql` is ready: 7 read-only queries (tables, policies, RLS flags, functions, event triggers, triggers, enum). CLI has no auth on this machine (probe: `LegacyPlatformAuthRequiredError`) — three Director options:

1. **Simplest (Gate-Q precedent):** run X0_CATALOG.sql in the Supabase dashboard SQL editor, paste output back verbatim. I diff it against DB_BASELINE.md + DATA_CONTRACT §3 and file the X0 evidence.
2. `! npx supabase login` in this session, then I run catalogs via CLI.
3. Provide a read-only `--db-url` connection string (also unlocks X1–X4 scratch/replica runs later — those need their own URLs regardless).

**Note for X1–X4 planning:** scratch + baseline-replica database URLs are still needed before gate runs — dashboard-paste covers X0 only.

## 5. Holding position

Per Director order: **no migration files authored.** Next actions on my side require: X0 output (Director), medicaid ruling (Architect). Everything else is staged.
