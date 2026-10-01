# QAM Entry — RRM-004-CYBER-PHARMA

**This is the QA Executor's starting point.** Model-neutral: whichever brain sits in the QA Executor seat reads this file first. The operating law is `AGENTS.md`. The prompts are `QAM_PROMPTS.md`. Nothing else in this module is read before those two.

| Field | Value |
|---|---|
| Module | RRM-004-CYBER-PHARMA — Dependencies |
| QAM version | v1.1 (2026-09-30; QAM pilot per the QA Lead's rulings of 2026-09-30) |
| Candidate | `QAM_MANIFEST.md` §1 (filled by the Engineer at handoff) |
| Branch | `qa/phase-3-rrm004` |
| Your lane | `QAM/evidence/`, `QAM/AUTOMATION/`, and the output files named in `README.md` — nothing else |
| Your entry points | **Q1** recon + plan draft (one stop) → QA Lead approval → **Q1b** apply amendments (docs-only) → **Q2** one-shot QA body → **Q5** cleanup and closeout. **Q4** only on an approved retest after a repair |
| Credentials | `.env.qa.local` at repo root, created by the Director before Q1; you read it only through `node --env-file`; you never print, copy or retain a value; you delete it at Q5 |
| Stops | Q1–Q8 in `AGENTS.md`; on any of them, save, log, wait |

Read in this order, then run the prompt the Director gave you:

1. `AGENTS.md` — law
2. `QAM_PROMPTS.md` — the prompt you were started with
3. `QAM_PREFLIGHT.md` — the gate (first act of Q1)
4. `../CLAUDE.md`, `../ACCEPTANCE_SPEC.md`, `../RULINGS_ADDENDUM.md` (+ erratum lane) — the contract; A-09 onward carry this QAM's own errata
5. `QAM_PILOT_CHARTER.md`, `QAM_RISK_REQUIREMENTS.md` — what the pilot measures; the QA Lead's standing risk and attack requirements
6. `QAM_MANIFEST.md`, `../QA_HANDOFF.md` — the Engineer's facts and claims
7. `QAM_TEST_PLAN.md` — at Q1 you draft it; at Q2 you execute the QA Lead-approved version
8. `GOVERNING/` — playbook snapshot
