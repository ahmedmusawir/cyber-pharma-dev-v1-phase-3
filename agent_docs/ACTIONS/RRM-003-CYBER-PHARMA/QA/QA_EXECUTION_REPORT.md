# RRM-003-CYBER-PHARMA — Independent QA execution report

**Seat:** Cody / QA Executor; for SOL / QA Lead. **No certification verdict.** Candidate `21ea108bb27b965ddc5edae29dc3b1d6971ae576`; QA HEAD `1a94277b73c9ee61eab1ed74991f54fcd4771afe`; baseline `3d2e65565d820ecc8b89bc5813959a4e324b3acd`.

## Entry gate and scope

At `2026-09-29T15:33:56+08:00`, `date -Is` was recorded; branch was `qa/phase-3-rrm003`; full HEAD was `1a94277b73c9ee61eab1ed74991f54fcd4771afe`; `git status --short` was empty. Candidate is a commit and an ancestor of HEAD. `candidate..HEAD` changes ten documentation paths only: CHANGELOG, pack acceptance/checkpoint/execution/handoff/rulings docs, response records, ledger, and a session log. There is no post-candidate product, test, dependency or configuration change. Raw path inventory: `evidence/entry_gate.json`, `evidence/static/candidate_head_paths.txt`.

I read the handoff, full acceptance spec and errata, A-01–A-14, checkpoints, brief, module `CLAUDE.md`, engineering evidence and completion report, then `QA/GOVERNING/` before writing `QA_TEST_PLAN.md`. I treated engineering evidence as historical claims and reran the required current checks.

Baseline-to-candidate product changes are limited to `DataTable.tsx`, `MultiSelect.tsx`, `AuthedShell.tsx`, two 404 pages, `next.config.js`, three new tests, and deletion of unused `PaginationControls.tsx`. The one banner on `supabase/setup.sql` is AC-306/A-13. The entire protected AC-401/A-13 list has an empty diff; `columns.tsx`, `ui/**`, actions, services, types, mocks, migrations, scripts, auth paths, dependency manifests and OwedBook sort code are unchanged. The admin group has exactly one line deleted in its 404 page. Existing tests have no diff; only three authorized tests were added. All three SQL bodies match baseline byte for byte below their exact banners. Raw checks: `evidence/static/`.

The baseline-to-candidate documentation inventory also contains nine byte-identical RRM-002 response archival renames in the Director's pre-engineering P1b commit `6655f95`. They are outside the engineering commit `6655f95..candidate` and do not change product, tests, dependencies or configuration. This is provenance, not an RRM-003 implementation finding.

## Independent board

Fresh `.next` removal preceded each build. Three Supabase keys were overridden in each process with blank or documented placeholder values; `.env.local` was neither edited nor printed. Build logs record Next.js 16.2.12. Tool versions: Node 22.14.0, npm 10.9.2, TypeScript 5.5.4, ESLint 9.39.5, Jest 30.4.1, Playwright 1.59.1.

| Check | Command / result | Raw evidence |
|---|---|---|
| Blank environment build | `next build`, exit 0, 17 routes | `evidence/board/blank_build.txt`, `build_summary.json` |
| Placeholder environment build | `next build`, exit 0, 17 routes | `evidence/board/placeholder_build.txt`, `build_summary.json` |
| TypeScript | `tsc --noEmit`, exit 0, 0 errors | `evidence/board/typescript.txt` |
| ESLint | `eslint .`, exit 0, **0 errors / 35 warnings** | `evidence/board/eslint.txt` |
| Full Jest | `jest --ci`, exit 0; **34/34 suites, 164/164 tests**, 0 failed, 0 skipped/pending, 0 todo | `evidence/board/jest.txt`, `jest_totals.json`, `jest_results.json` |

The ten named AC-402 original suites each show `passed` in Cody's Jest JSON and are byte-identical to baseline. README and `docs/TESTING.md` counts match the measured suite. The Jest JSON run was an additional board execution solely to capture explicit zero pending/todo totals; it also exited 0.

## AC-202 cache-header attack

From Cody's fresh placeholder build, `cp -r` copied `.next/static` and `public/` into `.next/standalone` as A-02 requires. The standalone server listened on a free local port. The validated capture used proper HEAD requests and an empty-body POST; all curls exited 0.

| Route | HTTP | Cache-Control |
|---|---:|---|
| `/` | 200 | `no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0` |
| `/auth` | 200 | same `no-store` set |
| `/owedbook` | 307 to `/auth` | same `no-store` set |
| POST `/api/auth/login` with empty body | 500 | same `no-store` set; inherited A-12 R3 |
| `/_next/static/chunks/04sa36x9-705m.js` | **200** | `public, max-age=31536000, immutable`; no `no-store` |

The server was stopped and its port tested closed. The initial probe used `curl -X HEAD`, which returned exit 18 for two 200 responses; that QA instrument error is preserved in `evidence/headers/headers.json` and corrected in `headers_validated.json`/`.txt`. The historical before capture in engineering `evidence/PREFLIGHT_P2.txt` shows a 200 chunk with `no-store`; it is identified as engineering history, not Cody's proof of the current candidate.

## Authenticated AC-107 — Director-authorized target substitution and browser execution

The initial QA turn stopped at the SCRATCH prerequisite, recorded in `evidence/browser/readiness.json`. On 2026-09-29 the Director authorized the existing **main development Supabase** in the repository's base `.env` configuration for login-only QA because SCRATCH and the replica lacked the required ADMIN and MEMBER accounts. No environment value was printed or copied. A fresh base-environment `npm run build` exited 0 with 17 routes (`evidence/browser/base_build_summary.json`); the app ran locally on port 38417. The Director entered credentials directly in visible browser windows. No account, role, Supabase configuration or application data was changed.

Playwright 1.59.1 drove both roles through 1440px desktop and 375px mobile, light and dark. **ADMIN: 125/125 checks passed; MEMBER: 124/124 passed.** Each desktop state verified real sortable header buttons, tab access to Owed, Enter ascending sort and row order, Space descending sort with a nonzero scroll position unchanged, mouse sorting, and no fake controls on Summary's non-sortable headers. Each mobile state opened Filters by keyboard, focused the exact Close button, wrapped Tab and Shift+Tab and kept 20 repeated Tabs in the drawer; Space opened the PBM picker and focused search; both picker trap directions and 20 repeated Tabs stayed in the panel; Escape closed the picker alone and returned focus to its trigger; the next Escape closed the drawer and restored focus to the exact Filters trigger. `evidence/browser/raw/admin_matrix.json`, `raw/member_matrix.json`, `final_matrix_summary.json`.

Both roles loaded OwedBook and Profile; ADMIN also loaded Admin Portal. Each logout landed on `/auth`, and a subsequent protected `/owedbook` visit returned to `/auth`. Across the covered flows there were zero console errors, page errors, hydration errors, and failed local routes. Eight cropped screenshots cover the table and drawer in each role/theme state; I inspected the focused captures and saw no obvious visual regression. The final two Playwright traces contain only an allowlisted action timeline. Raw authenticated traces were deleted after sanitization; no storage state, token, credential or identity-bearing navbar screenshot entered evidence. `evidence/browser/SCREENSHOT_TRACE_INVENTORY.json`, `traces/`, `screenshots/`. The server was stopped and port 38417 tested closed (`server_shutdown.json`). The A-12 Radix Select Escape behavior was not attributed to this candidate; no independent baseline regression evidence was collected for it.

## Findings and limits

**QA-F01 — AC-107 environment prerequisite, resolved by Director substitution (environmental, not candidate-caused).** Reproduction: at initial entry, SCRATCH account readiness/configuration was unavailable; the base target was explicitly distinct. Expected: an approved auth target with existing ADMIN and MEMBER accounts. Actual initially: no SCRATCH target ready; browser walk blocked. Director action: authorized main development Supabase for this read-only login walk. Actual after ruling: both roles authenticated there and completed the matrix. Evidence: `evidence/browser/readiness.json`, `base_build_summary.json`, `final_matrix_summary.json`; prior redacted classification in RRM-002 `QA/raw/ac304_environment.json`.

**QA-F02 — PBM trigger Enter does not open (AC-104/AC-107 observation; cause unresolved).** Reproduction: authenticated MEMBER at 375px, open Filters by keyboard, focus the closed PBM button, press Enter. Repeat after 20 Tab presses; the initial ADMIN and MEMBER role runs also reproduced it in both light and dark. Expected from a native button: Enter opens the panel and moves focus to search. Actual: Enter keydown reaches the focused trigger, becomes `defaultPrevented` between capture and bubble, produces no click, and leaves `aria-expanded=false`; the Radix Select is closed with no popper. Space produces a click, opens the panel, and moves focus to search; mouse click works. Evidence: `evidence/browser/raw/member_pbm_probe.json`, `raw/admin_attempt2_enter_matrix.json`, `raw/member_attempt1_enter_matrix.json`, corresponding sanitized attempt traces. The frozen picker-open step is satisfied by Space in every final matrix state; baseline browser behavior was not replayed, so this observation is **unresolved**, not assigned to RRM-003 or to the inherited Radix Select Escape condition. SOL should adjudicate its follow-up scope.

No candidate-caused defect was demonstrated by the executed checks. Historical P2 checkpoints and self-repair counts were verified as recorded artifacts; their original timing cannot be independently replayed on the pinned candidate. `.env.local` modification time predates P2, which supports but cannot by itself prove the Engineer's no-edit claim.

## Executor disposition for SOL

`AC_EVIDENCE_MATRIX.md` grades **26 PASS / 0 FAIL / 0 BLOCKED / 0 NOT RUN** on the literal criteria and Director-authorized environment substitution. The independent board, AC-202 attack and authenticated AC-107 matrix support the candidate. SOL should review QA-F02's reproducible Enter observation and decide its disposition without assuming candidate causation. SOL owns any Gate Q decision; this report issues none.

The working tree is dirty from the uncommitted QA package and required response log; pinned HEAD has not moved. No Git mutation, product repair, certification, database action, push, merge or Gate Q action was performed.

**Initial QA segment end (date -Is):** 2026-09-29T15:51:43+08:00. **Resumed browser segment:** 2026-09-29T20:24:56+08:00 → 2026-09-29T21:22:04+08:00 (date -Is).
