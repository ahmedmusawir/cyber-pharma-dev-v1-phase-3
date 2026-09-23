# RRM-002 QA lane (QA Lead / QA Executor)

The QA Lead authors `QA_TEST_PLAN.md` here at QA entry; the QA Executor's reports and raw evidence stay here; the QA Lead's `QA_CERTIFICATION.md` (Gate Q + Cleanup release) lands here. `GOVERNING/` receives the repo-local QA playbook snapshot copied by the Engineer at P3 from `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/` with a fresh `PROVENANCE.md`.

Architect risk notes (input, not the plan): attack the same-filters pairing (AC-103) — race a slow summary against a filter change in the browser, not only in jsdom · derive the expected footer value yourself from the fixtures on the candidate, then compare to the rendered text · confirm `gap` cannot be produced by rounding alone (AC-105 evidence) · verify every fixture hunk has an erratum ID and that no money value moved without one (AC-203) · confirm `owedbook.test.ts` is byte-identical to baseline · the authenticated check (AC-304) is the only live proof; Playwright per the RRM-001 lesson, Director supplies browser-only credentials, one ADMIN and one MEMBER visual spot-check by the Director at most.

Finding classes and statuses per the governing playbook. Bounded J-19 cleanup after Gate Q; `RECOVERY.md` and `agent_docs/SESSIONS/**` untouched.
