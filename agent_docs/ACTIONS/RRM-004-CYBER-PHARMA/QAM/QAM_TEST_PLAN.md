# RRM-004-CYBER-PHARMA — QAM Test Plan

**Drafted by:** QA Executor (Q1), <date -Is> · **Approved by:** QA Lead, <date> — <approval line verbatim> · **Candidate:** `<sha>` · **QA HEAD:** `<sha>` · **Baseline:** `<sha>`

> Placeholder left by the Architect (v1.1, 2026-09-30). **The QA Executor drafts this file in Q1** from the frozen `../ACCEPTANCE_SPEC.md` (+ addendum and erratum lane), `QAM_RISK_REQUIREMENTS.md` §A/§B/§C, `QAM_MANIFEST.md`, and what recon found. **The QA Lead amends and approves it before Q2** (Ruling 2, addendum A-11). Neither the Engineer nor the Architect writes any part of it. AC-702 grades that the header names the Executor as drafter and the QA Lead as approver, with dates after the candidate.

Required sections (the Executor's draft must contain all of them; the QA Lead may add, strike or re-rank):

1. Entry and stop gates (Q1–Q8 by number; the QF preflight as the first act of Q2).
2. Risk ranking — what is attacked first and why; each attack cites the requirement it satisfies (`QAM_RISK_REQUIREMENTS.md` §A-n / §B-n / §C-n).
3. Independent execution per AC group, with the derivation rule for every reference value (registry reads, installed metadata on the Executor's platform, route table from the Executor's build, image inventory from source).
4. Negative controls — what must still be true (header pair + three controls, negative host probe with body, existing suites unmodified, `src/` diff empty).
5. The deliberate instrument attack — which value or helper is corrupted, the expected non-zero failure.
6. Authenticated image walk — roles × viewports × theme per §C; login through the app's form with the env-file identities via `node --env-file`; one sign-in per role; logout and session check; trace after login; what is captured; what is never retained.
7. Evidence and status rules; finding classification; when `REPAIR_PROPOSAL.md` is drafted.
8. Pilot-process rows (AC-700) — recorded separately from product grades.
9. Retest rule for a Q4 round.
10. ADJUDICATE rows raised at Q1 (contract questions that must be ruled before Q2).
