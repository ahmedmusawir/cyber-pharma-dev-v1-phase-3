# RRM-004 QAM lane — the first QA Module run (v1.1)

This folder is a **prepared QA body**: it knows its candidate, its environment, its credentials protocol, its stops, its plan and its outputs before anyone opens a terminal. The Director starts it with one command per phase and never types a credential. The QA Executor recons and drafts the plan (Q1), the QA Lead approves it, the Executor runs the body in one session (Q2), then cleans up (Q5). The QA Lead certifies. Nothing here changes the acceptance standard: Gate Q is issued on the product ACs (AC-100…600) exactly as in RRM-001…003; the pilot-process ACs (AC-700) are graded separately in `QAM_PILOT_RESULTS.md`.

Start: `QAM_ENTRY.md`. Law: `AGENTS.md`. Prompts: `QAM_PROMPTS.md`. Director's touches: `QAM_CHECKPOINTS.md`.

## Who writes what (Rulings 2 and 3, addendum A-08/A-11)

| File | Author | When |
|---|---|---|
| `QAM_ENTRY.md` — model-neutral starting point | Architect | pack (v1.1 overlay) |
| `AGENTS.md` — the Executor's operating law | Architect v1.1 → **QA Lead ratifies** | before QC-1 |
| `QAM_PILOT_CHARTER.md` — what the pilot measures | Architect → QA Lead ratifies | before QC-1 |
| `QAM_PREFLIGHT.md` — QF-01…QF-18, a gate | Architect → QA Lead ratifies | before QC-1; Executor runs it first in Q1 (all rows) and again in Q2 (all except QF-16) |
| `QAM_RISK_REQUIREMENTS.md` — the QA Lead's standing and module-specific requirements | Architect carried §A/§B; **QA Lead fills §C and ratifies** | before QC-1 |
| `QAM_PROMPTS.md` — P2b · Q1 · Q1b · Q2 · Q4 · Q5 | Architect | pack |
| `QAM_CHECKPOINTS.md` — QC-1…QC-5 and the commands | Architect | pack |
| `QAM_MANIFEST.md` — the factual half | **Engineer** at handoff (end of P2) | facts and CLAIM-labeled measurements only |
| `QAM_TEST_PLAN.md` — the judgment half | **QA Executor drafts in Q1; QA Lead amends and approves** | before Q2; never the Engineer, never the Architect |
| `AUTOMATION/` · `evidence/` · `AC_EVIDENCE_MATRIX.md` · `QAM_EXECUTION_REPORT.md` · `REPAIR_PROPOSAL.md` (only on a FAIL) · `ARTIFACT_INVENTORY.json` · `QAM_CLEANUP_REPORT.md` · `QAM_PILOT_RESULTS.md` §1–§3 | **QA Executor** | Q1, Q2, Q5 |
| `QAM_CERTIFICATION.md` · `QAM_PILOT_RESULTS.md` §4 | **QA Lead** | after reading the matrix, the evidence map and the cleanup report |
| `GOVERNING/` | Engineer copies from RRM-003's `QA/GOVERNING/` at handoff with a fresh `PROVENANCE.md` | end of P2 |

Whoever built the candidate does not write the plan that tests it. The Engineer's manifest and handoff are claims; the Executor derives every expected value itself.

## Credentials in one paragraph (Ruling 4, addendum A-10)

Root `.env.qa.local` — exactly five unique, nonempty keys, dedicated QA identities on the main development Supabase (the Director-authorized root `.env.local`; its fingerprint is checked by QF-15, A-14), created by the Director at QC-1, proven Git-ignored, untracked and key-validated by QF-13/QF-14, loaded only through `node --env-file`, login/logout proven once per role in Q1 (QF-16) and signed in once per role in the Q2 walk, never printed or retained, value-scanned at Q5 step 1, deleted with proof at Q5 steps 2–3 together with all auth state and temporary browser profiles (credential editor swap/backup files are reported by name and removed by the Director, never read), pattern-scanned at Q5 step 4. The scanner must catch a planted secret first (QF-17). Certification is blocked on any leak; documentation mentions of key names are listed, not counted (A-13). Rotation is the Director's (QC-5).

## Architect risk notes

Moved to `QAM_RISK_REQUIREMENTS.md` §B so the Executor cites them by number in the plan.

Finding classes and statuses per the governing playbook. Bounded J-19 cleanup in Q5; `RECOVERY.md` and `agent_docs/SESSIONS/**` untouched.
