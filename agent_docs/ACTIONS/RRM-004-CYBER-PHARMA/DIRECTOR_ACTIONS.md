# RRM-004-CYBER-PHARMA — Director Actions (v1.1)

All YOU. Numbered, one command per block. Agents prepare; you type the git. DA-1…DA-4, DC-1 and P2 are already done on `phase-3-rrm004`; this runway starts at DC-2.

## DC-2 — After P2 (one commit)

Run the Engineer's single staging block exactly as returned, then:
```
git status --short
```
`node_modules` must not appear. Then his commit line, then:
```
git push
```
Then:
```
git status --porcelain
```
Then:
```
git log --oneline -1
```
Paste that line to the Architect — it is the candidate SHA.

## OV-1 — Place the QAM v1.1 overlay (still on `phase-3-rrm004`, before the QA branch is cut)

Step 1 — rename the lane (Git-tracked move, keeps Claudy's manifest and governing copy):
```
git mv agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM
```
Step 2 — remove the three v1.0 files the overlay renames:
```
git rm agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QA_ENVIRONMENT_PREFLIGHT.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QA_TEST_PLAN.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QA_EXECUTION_REPORT.md
```
Step 3 — unzip `RRM-004-CYBER-PHARMA_QAM_overlay_v1.1.zip` so its `RRM-004-CYBER-PHARMA/` folder lands on top of `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/` (it overwrites `README.md`, `DIRECTOR_ACTIONS.md` and the `QAM/` law/template files; it does **not** contain `QAM_MANIFEST.md` or `GOVERNING/`, so Claudy's work is untouched). Then:
```
git status --short
```
Expect: `R` lines for the rename, `D` for the three removals, `M` for README/DIRECTOR_ACTIONS and the overwritten QAM files, `??` for the new QAM files (`QAM_ENTRY.md`, `QAM_PROMPTS.md`, `QAM_CHECKPOINTS.md`, `QAM_PREFLIGHT.md`, `QAM_RISK_REQUIREMENTS.md`, `QAM_TEST_PLAN.md`, `QAM_EXECUTION_REPORT.md`). Nothing outside the pack folder.

Step 4:
```
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA
```
Step 5:
```
git commit -m "30sep2026 - RRM-004 QAM v1.1 overlay: QA/ -> QAM/, entry, prompts Q1/Q1b/Q2/Q4/Q5, credential protocol"
```
Step 6:
```
git push
```

## OV-2 — P2b errata (Claudy, docs-only)

Paste **P2b** from `QAM/QAM_PROMPTS.md` to the Engineer. Run his staging/commit block, then:
```
git push
```
Then:
```
git status --porcelain
```
Must print nothing.

## DC-3 — QA branch and QA Lead entry

Step 1:
```
git checkout -b qa/phase-3-rrm004
```
Step 2:
```
git push -u origin qa/phase-3-rrm004
```
Then hand the QA Lead this letter:

> QA LEAD — RRM-004-CYBER-PHARMA is on `qa/phase-3-rrm004`; candidate `<sha from DC-2>`, baseline the RRM-003 merge `649c36d`. This is the QAM pilot at v1.1 under your rulings of 2026-09-30. The Engineer's factual half is `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_MANIFEST.md` and `QA_HANDOFF.md`; the contract is `ACCEPTANCE_SPEC.md` with `RULINGS_ADDENDUM.md` A-01…A-13 and the erratum lane. Before I start the Executor: (1) fill §C of `QAM/QAM_RISK_REQUIREMENTS.md` (or strike it) and add your ratification line; (2) ratify or amend `QAM/AGENTS.md`, `QAM/QAM_PILOT_CHARTER.md`, `QAM/QAM_PREFLIGHT.md` (the "Ratified by" line in each). Return the four files and I commit them. Cody drafts the plan in Q1 and stops; you amend and approve; then Q2 runs with no touch from me. Gate Q on AC-100…600; pilot verdict on AC-700 in `QAM/QAM_PILOT_RESULTS.md`, separately.

When the QA Lead returns the four files:

Step 3:
```
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM
```
Step 4:
```
git commit -m "<date> - RRM-004 QAM: law, preflight, charter, risk requirements ratified by QA Lead"
```
Step 5:
```
git push
```

## QC-1 — Credentials and the Q1 command

Step 0 — attest the target: confirm the app's `.env.local` points at the main development Supabase project, i.e. `QAM/QAM_PREFLIGHT.md` QF-15's fingerprint `8ca83fc75bdf9fbc` is that project. It must be recorded as `Director attestation:` in QF-15 before the Q1 command (A-13 b).

Step 1 — create `.env.qa.local` at the repo root with exactly these five lines (your values; dedicated QA identities on the main development Supabase per A-07; never a personal login):
```
QA_TARGET_LABEL=main-dev
QA_ADMIN_EMAIL=
QA_ADMIN_PASSWORD=
QA_MEMBER_EMAIL=
QA_MEMBER_PASSWORD=
```
Step 2 — prove Git does not see it:
```
git status --porcelain
```
Must print nothing (`.env*.local` is in `.gitignore`; if this prints the file, stop and tell the Architect).

Step 3 — note the time:
```
date -Is
```
Step 4 — give the QA Executor exactly this line and nothing else:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q1. Read agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md and run Q1 from QAM_PROMPTS.md. Stop after the recon report and plan draft.

## QC-2 — Plan approval and the Q2 command

Send Cody's recon report and plan draft to the QA Lead. The QA Lead returns amendments and an approval line. Paste **Q1b** from `QAM/QAM_PROMPTS.md` with them filled in. Then:

Step 1:
```
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM
```
Step 2:
```
git commit -m "<date> - RRM-004 QAM: Q1 recon, plan approved by QA Lead"
```
Step 3:
```
git push
```
Step 4:
```
git status --porcelain
```
Prints nothing. Step 5 — give exactly this line and step back:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q2. Plan approved on disk, tree clean. Run Q2 from QAM_PROMPTS.md. Stop only on an enumerated Q-stop. Return to the QA Lead.

## QC-3 — If Cody raises a Q-stop

Read the Q-number and the path:line. Contract or instrument → QA Lead rules. Environment or credential → you rule. The Architect writes any row; the Engineer applies it; you commit; you resume Cody with one short instruction.

## QC-4 — After Q2 (and after any Q4 round): cleanup

Give exactly this line:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q5. Run Q5 from QAM_PROMPTS.md. Return to the QA Lead.

When Q5 returns:
```
test ! -e .env.qa.local && echo env-gone
```
Must print `env-gone`. Read `QAM/QAM_CLEANUP_REPORT.md` and `QAM/evidence/privacy_audit.json` (0 leaks in both modes; any leak recorded with its resolution). Then:

Step 1:
```
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM
```
Step 2:
```
git commit -m "<date> - RRM-004 QAM: Q2 execution, matrix, Q5 cleanup, pilot results"
```
Step 3:
```
git push
```
Send the matrix, report, cleanup report and results to the QA Lead for Gate Q and the pilot verdict; then to the Architect for P5.

## Rework, if any

Cody's `REPAIR_PROPOSAL.md` → QA Lead classifies → Architect rules scope and issues P4 (Claudy) and Q4 (Cody) → Claudy repairs on `qa/phase-3-rrm004`, you commit → Cody re-pins and reruns only the retest scope → QA Lead re-adjudicates. Q5 runs again after the last round.

## QC-5 — Rotate the QA passwords

After certification (immediately after any detected leak): Supabase dashboard → the two QA identities → new passwords. Record "rotated <date>" in `QAM/QAM_PILOT_RESULTS.md` §5.

## DC-7 — After Gate Q + cleanup + Architect closeout + Engineer closeout

Step 1:
```
git checkout main
```
Step 2:
```
git pull
```
Step 3:
```
git merge --no-ff qa/phase-3-rrm004 -m "<date> - merge qa/phase-3-rrm004 - RRM-004 CLOSED (Gate Q PASS @ <candidate>) - RRM campaign complete"
```
Step 4:
```
git push
```
Step 5:
```
git log --oneline -1
```
Paste that line to the Architect. Record candidate / QA HEAD / closeout / merge SHAs separately in the scoreboard. Read `QAM/QAM_PILOT_RESULTS.md` §2–§4 and fill §5: adopt, amend or drop the QAM shape for BIM-004.

## Still owed from RRM-001

Supabase "Allow new users to sign up" OFF on the dev project; curl verification per RRM-001 `DIRECTOR_ACTIONS.md` DA-2; evidence file `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md`. Status: NOT YET. The campaign closeout will say PRESENT or NOT YET in writing.
