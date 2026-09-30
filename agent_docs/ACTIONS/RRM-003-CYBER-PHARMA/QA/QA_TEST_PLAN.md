# RRM-003-CYBER-PHARMA — Independent QA test plan

QA Executor: Cody · Date: 2026-09-29 · Candidate: `21ea108bb27b965ddc5edae29dc3b1d6971ae576` · QA HEAD: `1a94277b73c9ee61eab1ed74991f54fcd4771afe` · Baseline: `3d2e65565d820ecc8b89bc5813959a4e324b3acd`

## Entry and stop gates

Record `date -Is`, branch, full HEAD, and status. Require a clean starting tree, candidate commit and ancestry, and a documentation-only candidate-to-HEAD diff. Stop on any product, test, dependency, or configuration change after the candidate. Entry observed at 2026-09-29T15:33:56+08:00: correct branch, clean tree, candidate is an ancestor, and the ten changed paths are documentation only. The subsequent QA files will make the working tree dirty by design; the pinned HEAD must not move.

Read the pack in the specified order, including errata, A-01–A-14, engineering reports, and `QA/GOVERNING/`. Treat engineering output as claims. Do not edit implementation, tests, contracts, configuration, or Git history. Stop execution only for a stated safety/scope gate or an unavailable required dependency; preserve partial evidence and identify the blocked AC.

## Independent execution

1. Compare baseline to candidate with `git diff` and `git show`. Classify every changed path against the allowed boundary. Verify protected paths, AC-401's A-13 corrected list, the one admin 404 line, all original regression tests, and SQL bodies after their banner lines.
2. Grade AC-101–106 by code, new test assertions, unmodified original tests, and the independent Jest board. Verify sort controls and the drawer/picker focus code against the literal contract and rulings.
3. Grade AC-201/203 by the config diff. Run fresh blank and placeholder builds in `.next`, with three Supabase keys overridden only in the process environment. Record versions, commands, exits, route totals, and logs under `QA/evidence/`. From the QA placeholder build, copy static and public assets into standalone, serve on a free local port, capture all five required responses and a real chunk, stop the server, and prove the port closed (AC-202).
4. Run independent `tsc`, `eslint`, and full `jest --ci`; record errors and warnings separately, plus suites, passed/failed/skipped/pending/todo counts. Verify README and testing counts against the measured suite.
5. For AC-301–308, run the literal greps and inspect documentation diffs and DA-2 evidence. Treat the documented exceptions A-07–A-10 as ruled, and record any unruled difference.
6. Prepare the SCRATCH authenticated browser walk for ADMIN and MEMBER. Check available browser tooling and SCRATCH account readiness without exposing secrets. After the Director enters credentials directly in a browser, automate desktop and 375px mobile in light/dark modes with keyboard, focus, sorting, nested Escape, route, console, hydration, and focused visual evidence. Record any unavailable account, browser, or environment as BLOCKED, not PASS. A-12's Radix Select Escape observation is inherited unless a baseline comparison proves a new regression.
7. Grade AC-501–504 independently using QA board results plus the specified engineering-process artifacts and Git facts. For process-only claims, distinguish verified artifact content from unobserved historical execution.
8. Produce `QA_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `ARTIFACT_INVENTORY.json`, `ONE_SHOT_QA_OBSERVATIONS.md`, and organized raw evidence. Each possible defect gets ID, AC, steps, expected, actual, evidence path, and cause classification. Return a recommendation to SOL without a certification verdict.

## Evidence and status rules

Use PASS only for independently proven literal AC, FAIL for a demonstrated requirement miss, BLOCKED for unavailable prerequisite, and NOT RUN when execution was not attempted for another reason. Preserve command exit codes and unfiltered raw output where practical. No credential, token, key value, or personal data enters evidence. Keep build output and transient server assets out of the durable evidence inventory. Recheck HEAD and tree status at the end.

## Director-authorized target amendment — 2026-09-29

The Director resolved the AC-107 environment block: the main development Supabase already configured by the repository's base `.env` values replaces SCRATCH and the replica, which lack the required ADMIN and MEMBER accounts. This authorization is login-only and read-only. Build the same pinned candidate with the existing configuration; the Director enters credentials directly in a visible browser; run the role × viewport × theme matrix and logout/session check. No application data, accounts, roles, or Supabase configuration may be changed. No environment values, credentials, auth state, or raw authenticated trace may enter evidence. The QA-only Playwright driver begins tracing after login and retains only a sanitized action timeline.
