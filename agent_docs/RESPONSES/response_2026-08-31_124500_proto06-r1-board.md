# PROTO 06 — R1 BOARD: GATE GREEN, STOPPED BEFORE R2
**Date:** 2026-08-31 · **Branch:** phase-3-proto-6 · rig files under `proto-06/` only

## R1 execution board

| Step | Result | Evidence |
|---|---|---|
| 1. Wipe throwaway | ✅ `DROP SCHEMA public CASCADE` succeeded first try (ownership fallback armed, unused); ensure_rls event trigger pre-dropped; re-grants applied. **pg_catalog proof: tables=0, functions=0, policies=0, ensure_rls=absent** | `proto-06/evidence/R1_wipe_pgcatalog_proof.log` |
| 2. Miniature schema | ✅ p01–p05 applied — 5 tables (accounts, businesses, user_businesses w/ role CHECK admin\|member + UNIQUE pair, fact_data, ref_data). **RLS=true on all 5, ZERO policies, ZERO functions** | `R1_migrate_pgcatalog_proof.log` |
| 3. Seed | ✅ 3 fresh identities (OwnerTwo admin@S1+S2 · AdminOne admin@S3 · MemberOne member@S3) across 2 accounts / 3 stores · fact_data=6,000 · ref_data=50 · seed-map.json (ids only, no secrets) | `R1_seed.log` |
| 4. **R1 GATE — TOTAL DENY** | ✅ **80/80 cells DENY, 0 mismatches** — 4 identities (anon + 3 authenticated via real publishable-key sessions) × 5 tables × 4 operations (S/I/U/D per Director addition 1) | `R1-total-deny_2026-08-31T0425.log` |

**Denial shapes observed (the transferable semantics):** SELECT → 0 rows, no error · INSERT → explicit `42501` (RLS violation) · UPDATE/DELETE → 0 affected rows. Harness sanity guard confirmed the publishable key is in play (landmine §7.1: nothing sneaking through as service role).

## Director additions honored

1. `expectations.json` carries the full transferable shape from R1: identities × tables × {select, insert, update, delete}, declarative default+overrides — R2 flips cells to ALLOW one policy at a time.
2. Ownership fallback implemented in `rig-reset.mjs` (individual policy→table→function drops); not needed this run — CASCADE held.

## Notes for the record

- Zero writes outside `proto-06/` + protocol paths. `.env.local` untouched (Director added PROTO06_DB_URL himself, aws-1 host per FLAG-2). No git.
- Rig artifacts staged for transferability: harness is config-first (env-driven), matrix declarative — BIM-002/BIM-005 re-point it without rewrite (brief §6).

## STOPPED — awaiting R2 authorization

R2 = the membership helper (security-definer, junction-only, search-path-pinned per landmine §7.2) + policies T-1..T-6 landed ONE at a time, red-green around each, matrix updated per step. Say "R2" and it runs.
