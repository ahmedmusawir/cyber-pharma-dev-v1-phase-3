# RRM-003-CYBER-PHARMA — QA Handoff

Engineer → QA Lead (QA Executor executes; Director holds Git and credentials). Assembled at the end of P2. Every line is a claim for independent verification.

- Approved brief, acceptance spec (text unchanged), authority pointer, preflight, checkpoints, addendum rows, errata IDs used: <paths / IDs>.
- Ledger resolution rows appended for R-006, R-010, R-013, R-014 (docs), R-017 (docs), R-018 (README): <yes>. OBS-1 disposition: <flag-only → Phase 8 / as ruled>. OBS-2: PaginationControls <deleted / kept, reason>.
- Source reviews and recon: `agent_docs/ASTRA_CODE_REVIEW.md` A-005 · `agent_docs/FABLE_CODE_REVIEW.md` F6/F10/F13 · `agent_docs/RECON/RRM001_RECON_2026-09-18.md` R2/R3/R4/R7/R8 · `agent_docs/PHASE_2.1/UI_SPEC.md:132-134`.
- Execution log and evidence: `EXECUTION_LOG.md` (incl. §Metrics) · `evidence/PREFLIGHT_P1.txt`, `PREFLIGHT_P2.txt` · `S1_diffs.txt` · `S2_headers_before.txt`, `S2_headers_after.txt` · `S3_greps.txt`, `S3_docs_diffs.txt` · `repair.diff` · `changed_files.txt`.
- Repo `cyber-pharma-dev-v1-phase-3` · Baseline `<full SHA>` (RRM-002 merge commit) · Candidate `<full SHA of the Director's P2 commit>` · Handoff branch `phase-3-rrm003` · QA branch `qa/phase-3-rrm003` confirmed by Director: <date>.
- Governing QA instructions, repo-local: `QA/GOVERNING/` (copied from RRM-002's snapshot; see `QA/GOVERNING/PROVENANCE.md`).
- Reproduction: board commands; header-capture method (standalone `server.js`, placeholder env, port 36055, the five curl lines); placeholder env values (no real keys); no live Supabase call made in engineering; no browser used in engineering.
- Required regression for the QA Lead: AC-107 authenticated keyboard walk on SCRATCH as MEMBER and ADMIN, desktop and 375px, light and dark — agent-driven browser per the field note; the Director enters credentials in the browser (DC-4); AC-202 header re-capture from a build the QA Executor makes; AC-401–404.
- Unrun by design: browser walk; real-auth login. Deployment waived.
- Environment restoration: no server left running; `.env.local` untouched.
- QA writable lane: `QA/**` · Protected: see `CLAUDE.md`; `RECOVERY.md`, `agent_docs/SESSIONS/**` (Director-protected).

The QA Lead authors `QA/QA_TEST_PLAN.md` (and, if adopted, their own environment preflight for the SCRATCH test accounts before the browser opens); the QA Executor executes; the QA Lead certifies in `QA/QA_CERTIFICATION.md`. Prior-review findings are not pre-accepted; engineering results are not independently proven.
