# RRM-004-CYBER-PHARMA — Dependencies

Module 4 of 4 in the RRM campaign (`agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §7). **Two pilots ride on it:** the Engineering side repeats the RRM-003 one-shot shape; the QA side is the **first QAM (QA Module) run** — a prepared `QAM/` folder the Director drives with one command per phase and no credential ever typed (QA Lead's rulings, 2026-09-30). Start at `CLAUDE.md` (Engineering) or `QAM/QAM_ENTRY.md` (QA). Director runway in `DIRECTOR_ACTIONS.md`. Status: **CLOSED 2026-10-02 — Gate Q PASS @ 2fbc72f**; certificate `QAM/QAM_CERTIFICATION.md`; pilot verdict `QAM/QAM_PILOT_RESULTS.md` §4 (merge pending, Director). AUTHORED 2026-09-30 (v1.0); **QAM v1.1 overlay 2026-09-30** — the QA lane was `QA/` in v1.0 and is `QAM/` from the overlay on (addendum A-09).

| File | Owner |
|---|---|
| CLAUDE.md · AUTHORITY_POINTER.md · ENVIRONMENT_PREFLIGHT.md · DIRECTOR_CHECKPOINTS.md · RRM_BRIEF.md · ACCEPTANCE_SPEC.md · CLAUDY_PROMPTS.md | Architect (frozen at engineering handoff; v1.1 changes recorded as rows A-09…A-12 and erratum-lane entries, never rewritten) |
| DIRECTOR_ACTIONS.md | Architect (runway, not contract; replaced in v1.1) |
| RULINGS_ADDENDUM.md | append-only; Engineer writes rows under Architect/Director instruction |
| EXECUTION_LOG.md (incl. §Metrics) · QA_HANDOFF.md · evidence/ · QAM/QAM_MANIFEST.md (the factual half only) | Engineer |
| QAM/QAM_ENTRY.md · QAM/QAM_PROMPTS.md · QAM/QAM_CHECKPOINTS.md | Architect |
| QAM/AGENTS.md · QAM/QAM_PILOT_CHARTER.md · QAM/QAM_PREFLIGHT.md · QAM/QAM_RISK_REQUIREMENTS.md (§C) | Architect drafted; **QA Lead ratifies** before QC-1 |
| QAM/QAM_TEST_PLAN.md | **QA Executor drafts (Q1); QA Lead amends and approves** |
| QAM/evidence/ · QAM/AUTOMATION/ · QAM/AC_EVIDENCE_MATRIX.md · QAM/QAM_EXECUTION_REPORT.md · QAM/REPAIR_PROPOSAL.md (only on a FAIL) · QAM/ARTIFACT_INVENTORY.json · QAM/QAM_CLEANUP_REPORT.md · QAM/QAM_PILOT_RESULTS.md §1–§3 | QA Executor |
| QAM/QAM_CERTIFICATION.md · QAM/QAM_PILOT_RESULTS.md §4 | QA Lead |
| QAM/GOVERNING/ | Engineer copies from RRM-003's `QA/GOVERNING/` at handoff with a fresh `PROVENANCE.md` |

Whoever built the candidate does not write the plan that tests it. This is an experimental QAM pilot; its lessons go to the 10X Lab and nothing is promoted into production QA doctrine until the pilot is measured and reviewed.
