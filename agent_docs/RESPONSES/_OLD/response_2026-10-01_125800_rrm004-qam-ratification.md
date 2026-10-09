# RRM-004 — QAM ratification amendments (A-14), docs only

**Branch:** `phase-3-rrm004` · **HEAD:** `3a2ed29612c964b65010eba484fe6579476d56b1` · 2026-10-01 12:54–12:58 +06:00 · Nothing committed.

✅ EXECUTION COMPLETE

All seven amendments are applied as instructed, so no new zip is needed. The QF rows are not renumbered. The frozen engineering text and every existing ruling are untouched. `QAM_TEST_PLAN.md` is **not** marked approved, and nothing here certifies the product.

Checks:
- A-01…A-14 each appear once.
- Every edited table has a consistent column count.
- No `<date, position>` placeholder is left.
- No stale wording remains (hash-only, attestation, "A-02 static copy", "its own npm ci").
- The product diff vs the candidate `2fbc72f` is empty.
- The Node env-file parser gives the same fingerprint `8ca83fc75bdf9fbc`. No live call was made.
- The editor-file pattern was tested on fake names: it caught `.swp`, `.swo`, `~`, `.bak` and `#…#`, and no near-misses.

## Amendment → file mapping

| # | Amendment | Files |
|---|---|---|
| 1 | A-14 recorded; A-13 accepted; AC-703 erratum (install order) | `RULINGS_ADDENDUM.md` (+A-14) · `ACCEPTANCE_SPEC.md` (+1 erratum row) |
| 2 | One QA-owned `npm ci` after QF-11 and before QF-08/09/10, recorded under QF-16 setup; QF-16 uses the same install; Q2's fresh `npm ci` before browser readiness; duplicate Q2 install removed | `QAM_PREFLIGHT.md` (new §4a, QF-16 step 1) · `AGENTS.md` (Q1 row, Q2 step 2) · `QAM_PROMPTS.md` (Q1 step 1, Q2 steps 2–3) |
| 3 | Scanner holds values and encodings in memory only (no hash-only rule), never emits or persists them, exits after scanning; editor swap/backup files discovered, reported by name, never read, staged or auto-deleted; cleanup limited to QA artifacts | `QAM_PREFLIGHT.md` (QF-17, QF-18 + editor check) · `QAM_PROMPTS.md` (Q5 steps 1, 3) · `AGENTS.md` (Credentials, Q5 row) · `QAM_CHECKPOINTS.md` (QC-1, QC-4) · `README.md` · `DIRECTOR_ACTIONS.md` (QC-1 Step 2) |
| 4 | Target authority = the Director's existing approval of root `.env.local` (attestation step removed; Director not claimed to have calculated the fingerprint); Node `--env-file` parsing with caught errors; explicit build → static/public copy → `node --env-file=.env.local .next/standalone/server.js`; `.env.qa.local` to helpers only; placeholder builds separate; no citation of this module's A-02 for the copy | `QAM_PREFLIGHT.md` (QF-15, QF-16) · `QAM_PROMPTS.md` (Q2 steps 4–5) · `AGENTS.md` (Credentials) · `QAM_RISK_REQUIREMENTS.md` §A-6 · `QAM_CHECKPOINTS.md` QC-1 · `README.md` · `DIRECTOR_ACTIONS.md` (Step 0 replaced) |
| 5 | Repo-root commands with `$QAM/AUTOMATION/…`; AGENTS permits the Q1 RESPONSES report `response_<date>_<time>_rrm004-qam-q1-recon.md`; Q1b: the Executor applies plan amendments, the Engineer applies contract/addendum amendments | `QAM_PROMPTS.md` (Q1 writes, Q2 step 5) · `QAM_PREFLIGHT.md` (helpers line) · `AGENTS.md` (write lane, Q1b row) · `QAM_ENTRY.md` (lane row, so it doesn't contradict AGENTS) |
| 6 | §C filled with C1–C6 | `QAM_RISK_REQUIREMENTS.md` |
| 7 | Ratification line verbatim (QF-04 now also checks the charter) | `AGENTS.md` · `QAM_PREFLIGHT.md` · `QAM_PILOT_CHARTER.md` · `QAM_RISK_REQUIREMENTS.md` |

Also touched: `CHANGELOG.md`, `agent_docs/SESSIONS/session_2026-10-01.md`, and this report.

## Notes (no ruling needed)

- I found no unresolved contradictions.
- In Q2 the real-target build reuses the step-2 install. That fits "one install per phase". The builds stay fresh (`rm -rf .next` each time).
- The existing `.next/standalone/` has no `.env*` files in it. That confirms the server needs `--env-file=.env.local` at start.
- The plain folder names `QAM/AUTOMATION/` that remain are prose descriptions of the lane, not commands.

## git status --short

```
 M CHANGELOG.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/ACCEPTANCE_SPEC.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_ACTIONS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_CHECKPOINTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_CHARTER.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PROMPTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/README.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md
 M agent_docs/SESSIONS/session_2026-10-01.md
?? agent_docs/RESPONSES/RRM004_QAM_RATIFICATION_REVIEW.zip
?? agent_docs/RESPONSES/response_2026-10-01_125800_rrm004-qam-ratification.md
```

**Untracked export, kept separate:** `agent_docs/RESPONSES/RRM004_QAM_RATIFICATION_REVIEW.zip` holds the 3a2ed29 review copy that the QA Lead reviewed. It is **not** in the block below.

## Staging block: run it yourself; I won't

```bash
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/ACCEPTANCE_SPEC.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_ACTIONS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_CHECKPOINTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_CHARTER.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PROMPTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/README.md
git add CHANGELOG.md
git add agent_docs/SESSIONS/session_2026-10-01.md
git add agent_docs/RESPONSES/response_2026-10-01_125800_rrm004-qam-ratification.md
git status --short
git commit -m "01oct2026 - RRM-004 QAM ratified by QA Lead for Q1: A-14, AC-703 erratum, preflight install order, privacy scanner, target authority, risk §C"
git push
git status --short
```

After the push, `git status --short` should show only the untracked review zip. The next step is DC-3, the QA branch cut, which is yours.
