# CODY BIM-003 — STAGE B RESULT (golden-oracle attack battery, for SOL adjudication)

**Date:** 2026-09-15 15:28 · **Agent:** Cody (QA execution) · **Authorization:** SOL Stage B release · **Scope:** Stage B only. No Stage C. No repair. No Gate Q.

## CASE RESULTS

| case | expected | observed | exit | mismatch detected | restored |
|---|---|---|---|---|---|
| `action` (row 1 insert→delete) | audit:prove non-zero, names the row | exit 8 · `DIFF at row 1` · row count ok 10/10 · `FAIL 1 differing row(s)` | **8** | ✅ yes — row identified | ✅ byte-identical ✓ |
| `business` (row 1 A1→B1) | audit:prove non-zero, names the row | exit 8 · `DIFF at row 1` · row count ok · `FAIL 1 differing row(s)` | **8** | ✅ yes — row identified | ✅ byte-identical ✓ |
| `remove-row` (row 3 removed, golden 9) | audit:prove non-zero, catches missing row | exit 8 · `FAIL row count: produced 10, golden 9` · DIFF at rows 3–10 · `FAIL 8 differing row(s)` | **8** | ✅ yes — count + rows identified | ✅ byte-identical ✓ |
| `add-row` (extra row 11, golden 11) | audit:prove non-zero, catches extra row | exit 8 · `FAIL row count: produced 10, golden 11` · `DIFF at row 11` · `FAIL 1 differing row(s)` | **8** | ✅ yes — count + row identified | ✅ byte-identical ✓ |
| `payload` (row 2 old_data present→null) | audit:prove non-zero, names the row | exit 8 · `DIFF at row 2` · row count ok · `FAIL 1 differing row(s)` | **8** | ✅ yes — row identified | ✅ byte-identical ✓ |

**All five cases: non-zero, mismatch detected, evidence sufficient to diagnose (row number + count FAIL where applicable), golden restored byte-exact before the next case ran. NO FALSE-GREEN. The HIGH-SEVERITY stop rule never fired.**

## SHA / RESTORATION

- **Original golden SHA-256:** `c30bfcddf88b164d912f656369edd73e7b0eb79b512f58bc819eb095894ccd4f` (recorded before case 1; `git diff` empty = byte-identical to commit `c45949e`)
- **Final golden SHA-256:** `c30bfcddf88b164d912f656369edd73e7b0eb79b512f58bc819eb095894ccd4f`
- **Restoration status:** helper's `status` case → `IDENTICAL — golden is byte-for-byte the committed specimen` (exit 0) · `git diff` on the golden → **empty** · SHA identical before/after.

## PRODUCT TREE / ENVIRONMENT

- **Product-tree status:** unchanged from Stage A — only `M RECOVERY.md` + `M seed-map.json` + `M audit-seed-map.json` (SOL-carried runtime state, untouched this stage beyond by-design regen by each run) + untracked QA/protocol artifacts. **No product file modified. Golden untouched at close.**
- **SCRATCH status:** reset + replayed 5 more times (one per corrupted case, via audit:prove stage 1 — authorized destructive-on-target). Now holds the last (payload-case) run's state; Stage C should re-run `audit:prove` or its own reset per SOL's next release — SOL to specify. Seed maps regenerated again per run (SOL disposition carried: preserve for C–G).
- **REPLICA status:** untouched — no prefixed env block loaded by any command.

## EVIDENCE

- `QA/evidence/QA_B_golden_attack_<case>.log` + `QA_B_golden_attack_<case>_full.log` × 5 cases (helper-filtered + full audit:prove console)
- `QA/evidence/golden_committed_copy.json` (snapshot taken before case 1, byte-copy of the committed golden — itself re-verified by the `status` case)
- 5 corrupted-run `S3_audit_prove_*` / `S3_audit_session_*` evidence sets (timestamps T0714…T0726) — relocated from Engineering's evidence folder into `QA/evidence/`; Engineering folder verified back to committed state.
- Journal row 5: `QA/QA_WORK_JOURNAL.md`.

## UNEXPECTED OBSERVATIONS

1. None affecting the verdict. One instrument-hygiene repeat from Stage A: each of the 5 corrupted runs wrote fresh evidence into Engineering's evidence folder (hard-coded path); relocated to the QA lane after the battery (SOL already carries this as a hygiene observation).
2. Shell-glob overlap during relocation briefly errored on already-moved `.normalised.log` files — verified net-zero effect; Engineering folder confirmed at committed state afterward.
3. Oracle behavior worth noting (positive): `remove-row` and `add-row` both tripped the **row-count check first** (`FAIL row count`) in addition to row-level diffs — missing/extra-row mutations are caught twice over. Recon's residual-risk confidence for G-1/G-2 (missing/extra detection) is now live-proven.

**STAGE B COMPLETE — AWAITING SOL**

Stage C (D-1 direct-read experiment via `qa-probes.mjs C`) NOT executed — staged, awaiting SOL release.

🥄 *I fed the oracle five lies. It called out every single one by row number. — Cody*