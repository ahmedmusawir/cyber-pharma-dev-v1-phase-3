# QAM Checkpoints — RRM-004-CYBER-PHARMA (v1.1)

The Director's touches on the QA side, declared before the run. These supersede DC-4 and DC-5 in `../DIRECTOR_CHECKPOINTS.md` (addendum A-10). Everything not listed is the QA Executor's or the QA Lead's inside the contract. Target: **zero Director touches between the Q2 command and the Executor's return.**

| ID | When | What the Director does | Status |
|---|---|---|---|
| QC-1 | After DC-3 (QA branch cut) and P2b (errata committed) | Target: no attestation step. The Director has already authorized the root `.env.local` as the main-dev configuration, and that approval is the authority for QF-15's fingerprint `8ca83fc75bdf9fbc` (A-07, A-14); the Executor compares the resolved target at Q1 and Q2. Creates root `.env.qa.local` for the A-07 target with exactly five unique, nonempty lines: `QA_TARGET_LABEL=main-dev`, `QA_ADMIN_EMAIL=…`, `QA_ADMIN_PASSWORD=…`, `QA_MEMBER_EMAIL=…`, `QA_MEMBER_PASSWORD=…` — dedicated QA identities only, never a personal login. Closes the editor, so no `.env.qa.local.swp` / `.env.qa.local~` remains (editor files are **not** Git-ignored). Confirms `git status --porcelain` shows nothing (the file is ignored). Ratification lines in `AGENTS.md`, `QAM_PREFLIGHT.md`, `QAM_PILOT_CHARTER.md` and `QAM_RISK_REQUIREMENTS.md` were recorded 2026-10-01 (A-14) and committed with the ratification commit. Records `date -Is`. Gives the QA Executor the **Q1 command** (below) | pending |
| QC-2 | After Q1 returns | Sends the recon report and plan draft to the QA Lead. The QA Lead returns amendments and an approval line. Director pastes **Q1b**; commits the approved plan and the Executor's recon files (`QAM/evidence/QAM_PREFLIGHT_Q1.txt`, `entry_gate.json`, `AUTOMATION/*.cjs`). Confirms clean tree. Gives the **Q2 command** and steps back | pending |
| QC-3 | If the Executor raises a Q-stop during Q2 | Reads the stop number and path:line; the QA Lead (contract/instrument) or the Director (environment/credential) rules; the Architect writes any addendum row; the Engineer applies it; the Director commits; resumes the Executor with a short instruction. Each occurrence counted in `QAM_PILOT_RESULTS.md` | as needed |
| QC-4 | After Q2 returns (and after any Q4 round) | Gives the **Q5 command**. When Q5 returns, confirms `test ! -e .env.qa.local` prints nothing, removes any credential editor file Q5 reported by name (without opening it), reads `QAM_CLEANUP_REPORT.md` and `privacy_audit.json` (0 leaks in both modes; any leak recorded with its resolution); commits the QA lane; sends the matrix, report, cleanup report and results to the QA Lead for Gate Q and the pilot verdict | pending |
| QC-5 | After certification (or after any detected leak, immediately) | Rotates the two QA passwords in the Supabase dashboard (Director-owned; mandatory after a detected leak, otherwise after the pilot). Records "rotated <date>" in `QAM_PILOT_RESULTS.md` §5. Any QA credential entry by the Director during execution is counted as a touch (target 0) | pending |

## The commands

**Q1** (QC-1) — give exactly this:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q1. Read agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md and run Q1 from QAM_PROMPTS.md. Stop after the recon report and plan draft.

**Q1b** (QC-2) — paste the Q1b prompt from `QAM_PROMPTS.md` with the QA Lead's amendments filled in.

**Q2** (QC-2) — give exactly this:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q2. Plan approved on disk, tree clean. Run Q2 from QAM_PROMPTS.md. Stop only on an enumerated Q-stop. Return to the QA Lead.

**Q5** (QC-4) — give exactly this:

> QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q5. Run Q5 from QAM_PROMPTS.md. Return to the QA Lead.

No credential is ever typed into a browser, a chat or a prompt by anyone.
