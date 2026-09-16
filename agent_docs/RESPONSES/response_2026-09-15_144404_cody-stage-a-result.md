# CODY BIM-003 — STAGE A RESULT (for SOL adjudication)

**Date:** 2026-09-15 14:44 · **Agent:** Cody (QA execution) · **Authorization:** SOL Stage A release (this session) · **Scope:** Stage A only — reset + rls:prove + audit:prove. No Stage B. No repair. No Gate Q.

---

## SPECIMEN

Re-pinned immediately before execution — matches the pinned candidate exactly:

- **branch:** `qa/phase-3-bim003` ✅
- **full HEAD:** `c45949ece1a17f1a3fbb299f5551f911f869c21e` ✅
- **pre-execution tree:** `M RECOVERY.md` + untracked QA protocol artifacts only. No product drift. No specimen change → proceeded.

## RESET / REPLAY

`node agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/helpers/qa-reset.mjs`

- **exit code:** 0
- **reset result:** drop event trigger → drop schema public → re-grant → bootstrap baseline (scratch-only X0 rider 3) — all ok
- **migration replay result:** **47/47 ok**, `0001_baseline_acknowledge.sql` … `0047_owedbook_pbm_options.sql`, zero failures
- **inventory:** 16 public tables, matches the expected 16-table chain
- **unexpected warnings/errors:** none
- **evidence path:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/evidence/QA_A_db_reset.log`
- **minor observation (instrument, not product):** the evidence log captures only the spawned `db-reset.mjs` child output; the helper process's own `[env] A-1 fallback in use…` provenance line lands on console only. Affects nothing; noted for completeness. The A-1 fallback line itself confirms the run targeted the unprefixed **SCRATCH** block (host `aws-1-us-west-1.pooler.supabase.com`, matches `evidence/ENV_NOTE.md`).

## RLS PROOF (BIM-002 security baseline)

`npm run rls:prove` — **exit 0**

- **verdict:** `✓ ISOLATION PROVEN — chain + 18 policies + AC8 + four laws + 320 cells + scoping + 28 attacks + live-session revocation, from an empty database`
- **board/result counts:** 8/8 stages (wipe+chain 0001–0027 … revocation R-C) · **19 policies** in public · **320-cell matrix GREEN** · scoping GREEN · **28 attack cases, 0 breaches, 0 ground-truth mismatches** · live-session revocation + re-grant proven immediate, byte-identical token, no refresh
- **unexpected failures:** none. `db:verify` AC7 / CF-9 was **not** encountered by the command.
- **no new tenant-security regression** → proceeded.
- **evidence (moved from BIM-002's Engineering folder into the QA lane):** `QA/rls-prove/X5_prove_2026-09-15T0638.log` (+ `.normalised.log`) · `X5-matrix_2026-09-15T0639.log` · `X5_ac8_fresh_2026-09-15T0638.log` · `X4_scoping_2026-09-15T0639.log` · `X4_attacks_2026-09-15T0639.log` · `X4_revocation_2026-09-15T0639.log` (7 files)

## AUDIT PROOF (BIM-003 baseline)

`npm run audit:prove` — **exit 0** (its stage 1 wiped + replayed the chain again on SCRATCH — authorized destructive-on-target)

- **verdict:** `✓ TRAIL PROVEN — chain 0001-0047 + immutability (6 probes) + write trail + R-8 + six wrapper reads + cross-tenant deny + admin-only visibility + golden match, from an empty database`
- **audit trail row count:** golden comparison — **produced 10, golden 10, 0 differing rows**
- **golden comparison result:** `TRAIL EXACT — every probe green and the produced trail matches the golden row-for-row` (rows after the watermark, ordered by id, id/occurred_at excluded, symbolised per E-2)
- **catalog/immutability results:** immutability 6 probes all green (svc/admin-A/anon × UPDATE/DELETE: P0001 below-RLS guard for svc; 42501 privilege-denied for admin-A and anon; ground truth unchanged each time)
- **failure-path result:** not emitted this run (failure-path is demonstrated by corrupting the golden — that is Stage B, not run)
- **other green checks:** AC-116/117 write trail (insert/update/delete, payload shapes, AC-119 attribution) · AC-118 R-8 (business_id NULL + context key) · AC-302 wrappers (6 calls → exactly 6 read_page rows, R-10 shapes non-empty) · AC-206 cross-tenant deny · AC-113 forged INSERT denied · AC-109…112 admin-only visibility scoping (admin-A 421 = A1+A2, member-A 0, admin-B 206, multi 424, anon 0)
- **unexpected warnings/errors:** none
- **evidence (moved from BIM-003's Engineering folder into the QA lane):** `QA/evidence/S3_audit_prove_2026-09-15T0642.log` (+ `.normalised.log`) · `S3_audit_session_2026-09-15T0643.log` · `S3_audit_session_2026-09-15T0643.produced.json` (4 files)

**Reproducibility twin comparison (independent QA check):** QA's fresh `.normalised.log` vs Engineering's committed S3 twin (`evidence/S3_audit_prove_2026-09-14T0738.normalised.log`): **only the timestamp line differs** — same host, every evidence line identical. Engineering's S3 claims reproduce exactly on a fresh QA reset.

## EVIDENCE

All Stage A evidence now lives in the QA lane (fresh run artifacts were moved out of Engineering's evidence folders; both Engineering folders verified back to committed state):

- `QA/evidence/QA_A_db_reset.log` (reset)
- `QA/rls-prove/` × 7 (rls:prove)
- `QA/evidence/` × 4 audit:prove files

## ENVIRONMENT / RESTORATION

- **SCRATCH:** reset + chain-replayed 3× total this stage (qa-reset, rls:prove stage 1, audit:prove stage 1) — all within the authorized destructive-on-SCRATCH scope. Now holds audit:prove's final seeded state, which Stage C–G probes expect.
- **REPLICA:** untouched — no prefixed env block was loaded by any command (A-1 fallback → unprefixed SCRATCH block only).
- **golden:** byte-untouched — `git diff` on `audit_trail_expected.json` empty. (Golden corruption is Stage B's move, not run.)
- **credentials:** none read or printed.
- **No repair attempted, no product file modified.**

## OBSERVATIONS (for SOL — no verdicts issued)

1. **Seed maps mutated by design:** `scripts/rls-harness/seed-map.json` + `audit-seed-map.json` show `M` — the seeder recreates rig identities every run and writes fresh UUIDs back (`lib/env.mjs:52`). Committed values were Engineering's 2026-09-14 run. **Left in place intentionally:** `qa-probes.mjs` reads these maps live for fail-closed identity asserts — reverting would break Stages C–G. SOL/Director to decide: commit QA-run values at campaign close, or restore then. Related to recon D-3 class (tracked harness state drifting from committed bytes by running the ritual).
2. **Evidence-path hard-coding:** both runners write fresh evidence into Engineering's evidence folders by hard-coded path; QA must relocate each time. Instrument-hygiene note only (candidate for BIM-005 CF-8 list).
3. **Evidence log missing the A-1 fallback provenance line** (console-only) — noted under RESET.
4. **Classifier timeouts recurred twice this session** (same infrastructure flake that stopped the previous session) — both on first attempt, both succeeded on retry; no command executed twice, no partial state possible (each command is a single atomic Bash invocation).

## WORKING TREE (post-execution `git status --short`)

```
 M RECOVERY.md                                        ← prior session handoff (pre-existing)
 M scripts/rls-harness/audit-seed-map.json             ← by-design seed regeneration (observation 1)
 M scripts/rls-harness/seed-map.json                   ← by-design seed regeneration (observation 1)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/         ← recon, journal, helpers, evidence/ (11 files), rls-prove/ (7 files)
?? agent_docs/RESPONSES/response_2026-09-15_122338_*.md
?? agent_docs/RESPONSES/response_2026-09-15_123634_*.md
?? agent_docs/RESPONSES/response_2026-09-15_141710_*.md
?? agent_docs/SESSIONS/session_2026-09-15.md
```

- **Product files modified: NONE** — the only tracked changes are `RECOVERY.md` (pre-existing handoff) and the two seed maps (harness runtime state, observation 1). `src/**`, `app/**`, `components/**`, `services/**`, migrations, golden: all untouched.
- **Golden untouched. REPLICA untouched.**

---

**STAGE A COMPLETE — AWAITING SOL**

Stage B NOT executed. No Gate Q. No whole-module PASS/FAIL classification. Standing by for SOL's Stage B release (golden-oracle attacks via `qa-golden-attack.mjs`).

🥄 *Camera's on now. Everything it saw, it wrote down. — Cody*