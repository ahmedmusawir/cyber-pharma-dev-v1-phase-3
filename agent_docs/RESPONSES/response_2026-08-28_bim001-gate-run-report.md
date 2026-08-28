# BIM-001 — GATE RUN REPORT (interim: 2 Director decisions needed)
**Date:** 2026-08-28 · evidence in `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/evidence/` (unique filenames)

## Gate Table

| Gate | Verdict | Evidence file |
|---|---|---|
| X0 baseline recon | ✅ CLOSED GREEN (ruled discrepancy → ERRATUM) | `X0_EVIDENCE.md` |
| X1 chain from zero | ✅ 15/15 migrations ok, **exactly 16 tables** | `X1_scratch_reset_run1.log` |
| X2 chain on baseline replica | ⛔ **STOPPED — target not as described** | `X2_replica_precheck_FOREIGN_SCHEMA.md` |
| X3 idempotent reset ×2 | ✅ second run clean, **inventories byte-identical** (diff) | `X3_scratch_reset_run2.log` |
| X4 deny-by-default | ✅ RLS on all 16; **0 policies added** (baseline 3 intact); anon + authenticated SELECT → 14/14 empty; ensure_rls fires on probe table | `X4X5_scratch_verify_probes_rerun.log` |
| X5 type laws | ✅ zero float/real/double; 16 money cols NUMERIC; 8 identifier families TEXT | same |
| AC1 negative | ✅ chain on empty DB → **exit 2, named abort** in 0001 | `AC1_replica_empty_loudfail.log` |
| AC5/AC6/AC10/AC12 | ✅ structural + functional probes (role='owner' rejected · 'Portal' rejected · updated_at bumps) | verify rerun log |
| X6 types regenerated | ⏳ **BLOCKED — CLI needs Docker for --db-url** | `X6_gentypes_stderr.log` |
| X7 board | ✅ build 22 routes · tsc clean · jest **28/128/0** (re-confirmed post-runs) | board output |

## What fought back (flagged, zero silent fixes)

1. **IPv6-only direct hosts.** Both `db.*.supabase.co` URLs have no A record; this machine has no IPv6 route. Worked via **session pooler** — region-discovered: scratch = `aws-1-us-west-1`, replica = `aws-1-ap-south-1`. No module content touched.
2. **Verify-instrument false-fail on the auth.users FK.** `information_schema.constraint_column_usage` hides tables the connecting role doesn't own (auth.users → supabase_auth_admin). Ground truth via `pg_constraint` proved the FK exists (all six auth.users FKs live). Instrument rewritten to pg_constraint — the exact "boundary-aware predicate" defect class BIM-000 cataloged. Rerun: **ALL GREEN**.
3. **⛔ DECISION 1 — the replica is NOT factory-fresh.** It carries a foreign deployment: StarkReads-shape `subscriptions` (user-scoped, 4 policies), a `keepalive` table (something may be pinging it), `"Users can read own role"` (≠ our baseline policy name), and all three functions (unlike live). My 0006 would collide, and X2's precondition ("ONLY baseline") is unmeetable there. **I will not wipe a possibly-in-use project on my own authority.** Say "wipe the replica" (I drop public schema → bootstrap → apply → verify) or hand me a genuinely fresh ref.
4. **⏳ DECISION 2 — X6 needs one of:** (a) you run `! npx supabase login` in-session (or provide `SUPABASE_ACCESS_TOKEN`) → I regen via `--project-id jmzwhgnyunwssamrqyhp` against the hosted API, no Docker needed; or (b) Docker gets installed. The `--db-url` mode hard-requires a container runtime in CLI 2.116.0.

## Standing

Chain itself: **proven** — from-zero build, twice-consecutive identical reset, full deny-by-default and type-law battery, functional CHECK probes all green. Remaining board is X2 (your call on the target) and X6 (your call on the auth path). Both close within minutes of a decision.
