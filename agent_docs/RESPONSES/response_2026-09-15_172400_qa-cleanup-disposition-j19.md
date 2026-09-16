# BIM-003 — QA CLEANUP DISPOSITION (J-19) · after GATE Q PASS

**Date:** 2026-09-15 17:24 · **From:** Fable (Engineer seat, drafting on SOL's instruction) · **To:** SOL (certification authority) · Tony (git authority) · Cody (execution seat)
**Certified specimen:** `c45949ece1a17f1a3fbb299f5551f911f869c21e` on `qa/phase-3-bim003` · **Gate Q:** PASS (SOL, 2026-09-15) · **Status of this document:** PROPOSAL — nothing below has been executed. No file deleted, no map restored, no git command run.

> J-19 itself is not on disk (`WEB_FACTORY_P1_DOCTRINE_JOURNAL.md` is referenced by `AUTHORITY_POINTER.md` but not present); the on-disk pointer is `QA/README.md`: "ruling packages, adjudication records, and the durable certification package (J-19) live here." BIM-002's Gate Q package is the precedent used throughout.

---

## 0. WORKING TREE AS INSPECTED (17:23)

| Path | State | Count |
|---|---|---|
| `RECOVERY.md` | M | 1 |
| `scripts/rls-harness/seed-map.json` · `audit-seed-map.json` | M — ids only (18 uuid lines each way), rewritten by `seed.mjs` / `audit-seed.mjs` on every run | 2 |
| `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/` | ?? — README (tracked) + recon + journal + `helpers/` ×3 + `evidence/` ×47 + `rls-prove/` ×16 | 68 |
| `agent_docs/RESPONSES/response_2026-09-15_*` | ?? — 6 Cody/Fable artifacts + this one | 7 |
| `agent_docs/SESSIONS/session_2026-09-15.md` | ?? | 1 |
| `src/**` · `supabase/migrations/**` · `scripts/**` (other than the two maps) · `package.json` · golden | **clean** — `git diff --name-only` minus RECOVERY + maps = empty; golden SHA `c30bfcdd…cd4f` | 0 |
| Engineering `evidence/` folders (BIM-002, BIM-003) | **clean** — no untracked files | 0 |

## 1. DURABLE — the certification package (keep, commit)

| Item | Path | Why durable |
|---|---|---|
| Recon | `QA/CODY_QA_RECON.md` | Finding board source (D-1…D-5, G-1…G-5); BIM-002 kept `QA_RECON_REPORT.md` |
| Journal | `QA/QA_WORK_JOURNAL.md` (rows 1–14) | J-13 record of every helper, mutation, restoration |
| Lane README | `QA/README.md` | tracked already |
| Helpers | `QA/helpers/qa-reset.mjs` · `qa-golden-attack.mjs` · `qa-probes.mjs` | Reproducibility instruments; journal rows 2/6 point at them; BIM-002 kept `QA/probes/` |
| Stage A evidence | `evidence/QA_A_db_reset.log` · `S3_audit_prove_…T0642.log` + `.normalised.log` · `S3_audit_session_…T0643.log` + `.produced.json` · `rls-prove/*T0638*` + `*T0639*` (7) | First independent from-empty reproduction; twin-diff basis |
| Stage B evidence | `evidence/QA_B_golden_attack_<action,business,remove-row,add-row,payload>.log` + `_full.log` (10) · `golden_committed_copy.json` | The 5/5 oracle proof; `_full.log` = complete audit:prove console per case |
| Stage C–G evidence | `evidence/QA_{C,D,E,F,G}_probes_*.log` (5) | The attack results SOL adjudicated |
| Stage H evidence | `rls-prove/*T0902*` · `*T0903*` · `*T0904*` (7) | Post-destructive isolation proof |
| Stage I evidence | `evidence/QA_I_triad_…T1705.log` · `S3_audit_prove_…T0905.log` + `.normalised.log` · `S3_audit_session_…T0906.log` + `.produced.json` | Final candidate-green + triad |
| SOL's certification | `QA/GATE_Q_REPORT_BIM-003-CYBER-PHARMA_PASS.md` — **SOL writes** (BIM-002 shape: verdict, Final-SHA Integrity with protected-path diff, discrepancies, status) | J-19 package anchor |

**Durable QA/ total after cleanup: 47 files** (README 1 + recon 1 + journal 1 + helpers 3 + evidence 27 + rls-prove 14) **+ SOL's Gate Q report = 48.**

## 2. DISPOSABLE — execution debris (delete, 22 files)

| Files | Count | Why disposable (verified, not assumed) |
|---|---|---|
| `evidence/S3_audit_prove_2026-09-15T07{14,17,19,22,25}.log` + `.normalised.log` | 10 | Byte-duplicates of the matching `QA_B_*_full.log` — diff on the `action` case differs only in the npm banner and the runner's evidence-pointer line |
| `evidence/S3_audit_session_2026-09-15T07{15,18,21,23,26}.log` + `.produced.json` | 10 | Session console is embedded in the `_full.log`; all five `.produced.json` are `cmp`-identical to Stage A's T0643 (the golden was corrupted, the produced trail never was) |
| `rls-prove/ABORTED-X5-matrix_…T0855.log` · `ABORTED-X5_ac8_fresh_…T0855.log` | 2 | See §4 |

Nothing outside the repo needs action (scratchpad captures are session-scoped and already off-tree).

## 3. SEED MAPS — RESTORE to the certified bytes (do not commit QA values)

**Disposition:** restore `scripts/rls-harness/seed-map.json` and `audit-seed-map.json` to their `c45949e` content.

**Why restore, not commit:**
- Both files are ids only. `prove.mjs` runs SEED (stage 2/8) before every consumer (`harness.mjs`, `scoping.mjs`, `revocation.mjs`, `audit-wrappers.mjs`); `audit-prove.mjs` runs SEED + AUDIT-SEED (2/4, 3/4) before the session (4/4). Whatever bytes are on disk are overwritten before they are read. Restoring cannot break a run.
- The Gate Q **Final-SHA Integrity** check (BIM-002 precedent) is "protected-path diff between PRE-Q specimen and certification SHA: EMPTY" over `supabase/migrations/`, `scripts/rls-harness/`, `scripts/db-reset.mjs`, `src/`, `package.json`. Committing QA-run ids would put a `scripts/rls-harness/` hunk into the QA-close commit and force SOL to re-explain the fence. Restoring keeps it literally empty.
- **How, without git mutation** (read-only `git show` + file write; `git checkout --` is forbidden to the agent): see §11 step 3. Director may equally run `git checkout -- <the two maps>` himself.
- **Hygiene carry (CF-8 candidate, BIM-005):** the maps are runtime state that git tracks — ignore them or write them under `evidence/`. Not changed now (harness path is protected).

## 4. ABORTED-* PARTIAL RLS LOGS — DELETE

The two T0855 files are from the pre-bounce Stage H attempt that died after the matrix stage: no `X5_prove`, scoping, attacks or revocation logs, so no verdict. Their existence, cause and non-proof status are durably recorded in journal row 12 and the C–I report §2. The bytes add nothing SOL graded, and keeping `ABORTED-*` files inside a certification package invites a future reader to mistake them for a failed proof. Delete.

## 5. RECOVERY.md / SESSION / RESPONSE ARTIFACTS — KEEP IN THEIR PROTOCOL HOMES

- `RECOVERY.md` (root) and `agent_docs/SESSIONS/session_2026-09-15.md` — protocol files, commit as-is with the QA-close commit; RECOVERY gets one more update at cleanup completion.
- `agent_docs/RESPONSES/response_2026-09-15_*` ×7 (+1 for the cleanup result) — stay where the RESPONSE LOGGING PROTOCOL puts them. **No copies into `QA/RESPONSE/`.** BIM-002 copied its responses into `QA/RESPONSE/` because `qa/bim002` was a disposable branch that was deleted unmerged; `qa/phase-3-bim003` merges to `main` per module CLAUDE.md §12, so `agent_docs/RESPONSES/` survives on its own. SOL may override for precedent parity — then step 6 in §11 is a plain `cp`.

## 6. TEMPORARY QA HELPER SCRIPTS — KEEP, UNCHANGED

`QA/helpers/` ×3 stay (durable, §1). They are the only way to re-run C–G; BIM-002 kept `QA/probes/` for the same reason. No edits — the 2-line client-shape fix (journal row 6) is already the version that produced the evidence.

## 7. RUNNER EVIDENCE-PATH HARD-CODING — CF-8 (already recorded) + QA corroboration line

Already durable: `RULINGS_ADDENDUM.md` "CF-8 additions" bullet and the RETROSPECTIVE ledger row (owner BIM-005). QA adds one fact: **`audit-prove.mjs` also hard-writes into BIM-003's Engineering `evidence/` folder** (the recorded item names only rls-prove → BIM-002's). QA relocated evidence 12 times this campaign. **Proposed append to the CF-8 bullet** (append-only file, SOL/Architect writes):

> `— QA corroboration (Gate Q 2026-09-15): audit-prove.mjs likewise hard-writes to ACTIONS/BIM-003-CYBER-PHARMA/evidence/; QA relocated runner output 12× during A–I. Fix in BIM-005 = evidence root by module + env override.`

## 8. D-1 — DURABLE RECORD (no AC text, no Brief text changes)

D-1 contradicts no AC (every read-audit AC is wrapper-scoped), so the erratum lane is the wrong home. Three appends, all append-only files:

**(a) `RULINGS_ADDENDUM.md` — new carried flag, proposed text:**

> `- CF-10 (carried flag, QA D-1, SOL Gate Q 2026-09-15 — contract/threat-model gap, NOT a BIM-003 defect): an authorized junction member can SELECT user_data directly via PostgREST (BIM-002's certified user_data_select_member, 0021:28-30) and receive patient-shaped rows with zero read_page audit rows; the owedbook_* wrappers audit correctly (+1 per call, Stage C). Brief §1 "every read of patient-shaped data … leaves a row" is stronger than the frozen architecture guarantees: the DB layer audits wrapper reads only. Routes: (1) Architect — doctrine/campaign-map note that read audit is wrapper-scoped at the DB layer; (2) BIM-005 — the service swap must route every OwedBook read through the wrappers (the app-layer guarantee); (3) Deferred Ledger — closing direct member SELECT on user_data at the DB layer is a permissions-v2 / later-phase decision, not this module's.`

**(b) `RETROSPECTIVE.md` Deferred Ledger table — one row:**

> `| Direct member SELECT on user_data is unaudited at the DB layer (read audit = wrapper reads only) | QA D-1 / CF-10 — BIM-002's certified member SELECT policy vs Brief §1 prose | BIM-005 (app-layer routing) · permissions-v2 (DB-layer closure, if ever) |`

**(c) SOL's Gate Q report** — D-1 disposition paragraph as SOL wrote it in the handoff.

Not proposed: an erratum row (nothing literal to correct), a Brief §1 rewrite (frozen), a BIM-003 repair (SOL: not a defect).

## 9. D-3 — DURABLE RECORD: erratum row E-8 on AC-901

Literal variance against a frozen AC → erratum lane, in the existing column format. **Proposed row (SOL authors; Director approves):**

> `| E-8 | AC-901 | QA recon D-3, SOL Gate Q 2026-09-15 | git diff 0e4e17e..c45949e touches supabase/.temp/cli-latest (2.116.0 → 2.117.0), a path outside AC-901's list | Supabase CLI cache file written by the Director-run types regen (AC-307, E-7 class); generator artifact, not a module change. AC-901 graded PASS WITH NOTE. Hygiene: add supabase/.temp/ to .gitignore in a later module (product-tree change, not now). | QA/CODY_QA_RECON.md §7 D-3 · git diff 0e4e17e..c45949e -- supabase/.temp/cli-latest | SOL-ruled · Director-approved (pending) |`

## 10. CLEAN-TREE EXPECTATIONS BEFORE THE DIRECTOR COMMITS

After §11 runs and the doc rows are appended, `git status --short` must show **exactly**:

```
 M CHANGELOG.md                                                   (cleanup entry)
 M RECOVERY.md
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md   (E-8 row only — erratum lane)
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md            (one ledger row)
 M agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md         (CF-10 + CF-8 line)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/CODY_QA_RECON.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/GATE_Q_REPORT_BIM-003-CYBER-PHARMA_PASS.md   (SOL)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/QA_WORK_JOURNAL.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/evidence/        (27 files)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/helpers/         (3 files)
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/rls-prove/       (14 files)
?? agent_docs/RESPONSES/response_2026-09-15_*.md               (8 files)
?? agent_docs/SESSIONS/session_2026-09-15.md
```

**Must be absent:** the two seed maps · anything under `src/`, `supabase/`, `scripts/`, `package.json` · any untracked file in either Engineering `evidence/` folder · any `ABORTED-*` or `S3_*T07xx` file.

**Fence check (Final-SHA Integrity, SOL runs or reads):**
```
git diff c45949e --stat -- supabase/migrations scripts src package.json      → (empty)
git status --short -- ".env*"                                                 → (empty)
sha256sum scripts/rls-harness/golden/audit_trail_expected.json                → c30bfcdd…cd4f
```

**Sequence after that (not this document's to execute):** SOL writes the Gate Q report and flips the spec lifecycle to QA-VERIFIED pinning `c45949e` → Director makes **one** QA-close commit (docs + QA package only; the implementation hash under it is unchanged) → Architect closeout instruction → Director merges `qa/phase-3-bim003` → `main`. **Commit wording deliberately withheld here per SOL.**

## 11. EXACT CLEANUP INSTRUCTIONS FOR THE EXECUTION SEAT (Cody) — run only after SOL + Director say "go"

All paths relative to repo root. Every step is idempotent and verifiable. No git mutation anywhere.

**Step 1 — re-pin and pre-verify (read-only):**
```
git branch --show-current && git rev-parse HEAD        # expect qa/phase-3-bim003 · c45949ece1a17f1a3fbb299f5551f911f869c21e
cd agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/evidence
for t in 0715 0718 0721 0723 0726; do cmp S3_audit_session_2026-09-15T0643.produced.json S3_audit_session_2026-09-15T${t}.produced.json && echo "T$t dup OK"; done
cd - >/dev/null
```
Stop if any `cmp` reports a difference — that file is then evidence, not debris.

**Step 2 — delete the 22 disposable files:**
```
cd agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA
rm evidence/S3_audit_prove_2026-09-15T07{14,17,19,22,25}.log evidence/S3_audit_prove_2026-09-15T07{14,17,19,22,25}.normalised.log
rm evidence/S3_audit_session_2026-09-15T07{15,18,21,23,26}.log evidence/S3_audit_session_2026-09-15T07{15,18,21,23,26}.produced.json
rm rls-prove/ABORTED-X5-matrix_2026-09-15T0855.log rls-prove/ABORTED-X5_ac8_fresh_2026-09-15T0855.log
ls evidence | wc -l    # expect 27
ls rls-prove | wc -l   # expect 14
cd - >/dev/null
```

**Step 3 — restore the seed maps to the certified bytes (read-only git + file write):**
```
git show c45949e:scripts/rls-harness/seed-map.json       > scripts/rls-harness/seed-map.json
git show c45949e:scripts/rls-harness/audit-seed-map.json > scripts/rls-harness/audit-seed-map.json
git status --short scripts/                               # expect empty
```

**Step 4 — doc rows (SOL/Architect author; Cody may paste the exact text from §7, §8(a), §8(b), §9 on instruction):** append CF-10 + the CF-8 line to `RULINGS_ADDENDUM.md`; one row to `RETROSPECTIVE.md` ledger table; E-8 to the spec's Erratum Lane (append-only, below E-7). Never touch AC text.

**Step 5 — CHANGELOG entry** (`CHANGELOG.md`, top, per protocol): `[CC]` line listing the three doc files + the QA package, reason "BIM-003 QA Cleanup (J-19) after SOL Gate Q PASS 2026-09-15".

**Step 6 (only if SOL orders precedent parity):** `mkdir -p agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/RESPONSE && cp agent_docs/RESPONSES/response_2026-09-15_*.md agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/RESPONSE/`

**Step 7 — journal row 15 + RECOVERY + response mirror:** journal row 15 = "QA CLEANUP EXECUTED" (files removed, maps restored, counts); RECOVERY → "QA CLEANUP COMPLETE — awaiting SOL certification package + Director commit"; `agent_docs/RESPONSES/response_<ts>_qa-cleanup-result.md`.

**Step 8 — clean-tree proof (paste to SOL):** the three fence commands from §10 plus `git status --short`, and `git status --short agent_docs/ACTIONS/BIM-00{2,3}-CYBER-PHARMA/evidence/` (expect empty).

## 12. EXPECTED FINAL DURABLE QA PACKAGE

```
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/
├── README.md                                    (tracked)
├── GATE_Q_REPORT_BIM-003-CYBER-PHARMA_PASS.md   (SOL — verdict, Final-SHA Integrity, dispositions D-1…D-5/F-obs/G/CF-9)
├── CODY_QA_RECON.md
├── QA_WORK_JOURNAL.md                           (rows 1–15)
├── helpers/   qa-reset.mjs · qa-golden-attack.mjs · qa-probes.mjs                          (3)
├── evidence/  QA_A_db_reset.log · QA_B_* ×10 · golden_committed_copy.json · QA_{C..G}_probes ×5 ·
│              QA_I_triad_*T1705.log · S3_*T0642/T0643 ×4 · S3_*T0905/T0906 ×4                (27)
└── rls-prove/ Stage A *T0638/T0639 ×7 · Stage H *T0902/T0903/T0904 ×7                       (14)
                                                                                    = 48 files
+ agent_docs/RESPONSES/response_2026-09-15_* ×8  (protocol home; copies into QA/RESPONSE/ only on SOL's say-so)
+ agent_docs/SESSIONS/session_2026-09-15.md · RECOVERY.md
+ contract-layer appends: RULINGS_ADDENDUM (CF-10, CF-8 line) · RETROSPECTIVE (ledger row) · spec Erratum Lane (E-8) · CHANGELOG
```

**Adjudication asks for SOL (this document's own):** (1) approve the 22-file disposable set; (2) approve RESTORE for the seed maps; (3) approve DELETE for the ABORTED partials; (4) confirm no `QA/RESPONSE/` copies; (5) accept or amend the CF-10, E-8, CF-8 and ledger wording; (6) release Cody to run §11 steps 1–3, 5–8 (step 4 = SOL/Architect).

**Bookkeeping (Fable, this turn):** session-file PENDING_APPROVAL entry written · RECOVERY.md pointer updated · this artifact filed. Nothing executed.

**AWAITING SOL + DIRECTOR APPROVAL — CLEANUP NOT EXECUTED**
