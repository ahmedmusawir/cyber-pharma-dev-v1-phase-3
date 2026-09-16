# BIM-003 — QA CLEANUP RESULT (J-19) · return to SOL

**Date:** 2026-09-15 17:33 · **Executed by:** Fable on the SOL + Director cleanup release (revised, Director fence) · **Specimen:** `qa/phase-3-bim003` @ `c45949ece1a17f1a3fbb299f5551f911f869c21e` (re-pinned before step 1)

## 1. CLEANUP ACTIONS ACTUALLY PERFORMED

| # | Action | Result |
|---|---|---|
| 1 | Pre-verify: `cmp` of the five Stage-B `.produced.json` against Stage A's T0643 | all five identical → confirmed duplicates |
| 2 | Deleted 20 duplicate Stage-B runner files: `S3_audit_prove_…T07{14,17,19,22,25}.log` + `.normalised.log`, `S3_audit_session_…T07{15,18,21,23,26}.log` + `.produced.json` | 20 removed |
| 3 | Deleted 2 ABORTED partial RLS logs: `rls-prove/ABORTED-X5-matrix_…T0855.log`, `ABORTED-X5_ac8_fresh_…T0855.log` | 2 removed |
| 4 | Restored `scripts/rls-harness/seed-map.json` + `audit-seed-map.json` to `c45949e` bytes via read-only `git show c45949e:<path> >` | both clean |
| 5 | `RULINGS_ADDENDUM.md` — appended CF-10 (D-1) and CF-8 QA corroboration | +2 lines |
| 6 | `RETROSPECTIVE.md` — appended the D-1 / CF-10 Deferred Ledger row | +1 line |
| 7 | `BIM003_ACCEPTANCE_SPEC.md` — appended E-8 (D-3) below E-7 in the Erratum Lane | +2 lines; diff shows only the E-8 row + one blank line; **AC text untouched** |
| 8 | `CHANGELOG.md` — one bounded `[CC]` entry (QA Cleanup / Gate Q PASS) | +9 lines |
| 9 | `QA_WORK_JOURNAL.md` — row 15 (cleanup execution record) + CAMPAIGN POSITION line | Cody's QA lane |

**Not done, by the release:** no `QA/RESPONSE/` copies · existing `agent_docs/RESPONSES/**` untouched · no DB / SCRATCH / REPLICA contact · no rls:prove, audit:prove, build, tsc, test · no migration, golden or product change · no git add/commit/push/merge.

**Count correction (transparency):** the disposition's headline said "evidence ×27"; its per-item inventory (1 + 4 + 10 + 1 + 5 + 1 + 4) sums to **26**, which is what exists. Arithmetic slip in the headline only; every listed durable file is present.

## 2. FINAL DURABLE QA FILE COUNTS — `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/`

| Component | Count |
|---|---|
| `README.md` (tracked) · `CODY_QA_RECON.md` · `QA_WORK_JOURNAL.md` (rows 1–15) | 3 |
| `helpers/` (`qa-reset.mjs`, `qa-golden-attack.mjs`, `qa-probes.mjs`) | 3 |
| `evidence/` — QA_A ×1 · QA_B ×10 · golden_committed_copy ×1 · QA_C…G ×5 · QA_I_triad ×1 · S3 Stage-A T0642/T0643 ×4 · S3 final T0905/T0906 ×4 | 26 |
| `rls-prove/` — Stage A T0638/T0639 ×7 · Stage H T0902/T0903/T0904 ×7 | 14 |
| **Total** | **46** (+ SOL's `GATE_Q_REPORT_BIM-003-CYBER-PHARMA_PASS.md` when written = 47) |

## 3. `git status --short`

```
 M CHANGELOG.md
 M RECOVERY.md                                                        ← DIRECTOR-PROTECTED EXISTING STATE (not touched)
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md  ← E-8 only
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md           ← 1 ledger row
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md        ← CF-10 + CF-8 line
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/CODY_QA_RECON.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/QA_WORK_JOURNAL.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/evidence/                 (26)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/helpers/                  (3)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/rls-prove/                (14)
?? agent_docs/RESPONSES/response_2026-09-15_122338_session-open-qa-standby.md
?? agent_docs/RESPONSES/response_2026-09-15_123634_cody-qa-recon.md
?? agent_docs/RESPONSES/response_2026-09-15_141710_cody-session-recovery.md
?? agent_docs/RESPONSES/response_2026-09-15_144404_cody-stage-a-result.md
?? agent_docs/RESPONSES/response_2026-09-15_152858_cody-stage-b-result.md
?? agent_docs/RESPONSES/response_2026-09-15_170730_cody-stages-c-i-preq-report.md
?? agent_docs/RESPONSES/response_2026-09-15_172400_qa-cleanup-disposition-j19.md
?? agent_docs/RESPONSES/response_2026-09-15_173300_qa-cleanup-result.md   (this file)
?? agent_docs/SESSIONS/session_2026-09-15.md                            ← DIRECTOR-PROTECTED EXISTING STATE (not touched)
```

The two seed maps no longer appear. Nothing under `src/`, `supabase/`, `scripts/`, `package.json` appears.

## 4. PROTECTED PRODUCT-PATH FENCE

```
git diff c45949e --stat -- src supabase/migrations scripts package.json   → EMPTY
git status --short -- ".env*"                                            → EMPTY
```

## 5. GOLDEN SHA

```
c30bfcddf88b164d912f656369edd73e7b0eb79b512f58bc819eb095894ccd4f  scripts/rls-harness/golden/audit_trail_expected.json
```
Matches the required value.

## 6. ENGINEERING EVIDENCE-FOLDER STATUS

`git status --short` on `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/` and `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/` → **EMPTY** (both at committed state). `find QA -name "ABORTED-*" -o -name "*T07[12]*"` → **0**.

## 7. DIRECTOR-PROTECTED FILES

**RECOVERY.md: UNTOUCHED BY QA CLEANUP**
**agent_docs/SESSIONS/\*\*: UNTOUCHED BY QA CLEANUP**

Both mtimes are 17:24:51 (the pre-release disposition write); no read-modify-write occurred during cleanup. Their modified/untracked state is pre-existing and reported as Director-controlled, not as a QA-cleanliness item. The session-file status transition for this cleanup was deliberately **not** written, per the fence.

## 8. DRIFT STATEMENT

No unintended product or harness drift remains. The only tracked changes on the branch relative to `c45949e` are documentation records (CHANGELOG, spec erratum lane E-8, RULINGS_ADDENDUM, RETROSPECTIVE) plus the Director-protected RECOVERY.md. The implementation, migrations, harness code, seed maps, golden, package.json and env are byte-identical to the certified specimen.

**QA CLEANUP COMPLETE — AWAITING SOL MERGE-READY CONFIRMATION**
