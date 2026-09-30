# RRM-003-CYBER-PHARMA — Engineering Execution Log

Engineer · Approved scope/plan: `RRM_BRIEF.md` v1.0 + the P1 plan in `agent_docs/RESPONSES/response_2026-09-28_210200_rrm003-p1-plan.md` (Director-approved in full, 2026-09-28) + rulings A-01…A-12 · Code baseline `3d2e65565d820ecc8b89bc5813959a4e324b3acd` (RRM-002 merge commit; recorded at P1) · Branch: `phase-3-rrm003` (P2 started at `6655f95`) · Run shape: one-shot (P2 single session)

## Preflight

P1: `evidence/PREFLIGHT_P1.txt` — 14 PASS · PF-05 EXCEPTION (own protocol files; ruled A-01) · PF-14 literal PASS, measurement invalid (bare standalone 404s the chunk; ruled A-02) · PF-17 N/A · P2: `evidence/PREFLIGHT_P2.txt` — **17/17 PASS** (A-01 literal PF-05; A-02 static copy before PF-13/14)

## Stage S1 — Keyboard/focus

Start: 2026-09-28T21:30:41+08:00 · End: 2026-09-28T21:34:02+08:00

| File / surface | Change and reason | AC | Preservation concern |
|---|---|---|---|
| `src/components/common/DataTable.tsx` | Sortable header content wrapped in a native `<button type="button">` (only when `onSort` is set); no handler of its own — click/Enter/Space bubble to the unchanged `<th onClick>` | AC-101, AC-102 (A-05) | `columnheader` role, `aria-sort`, `<th>` click and mobile cards unchanged; Summary/Audit tables (no `onSort`) render identical markup |
| `src/components/layout/AuthedShell.tsx` | `triggerRef` on the drawer trigger; effect: focus first tabbable on open, return focus to trigger on close (open→closed only); `onKeyDown` Tab wrap on the drawer panel; one guard `if (e.defaultPrevented) return;` in the existing Escape handler (A-06) | AC-103, AC-104 | Escape close, backdrop, route/apply close and body-scroll lock unchanged; no `inert`; desktop rail untouched. The guard sits in the same handler; its line moved from `:49` to `:63` only because of the added imports, `FOCUSABLE` constant and refs above it |
| `src/components/common/MultiSelect.tsx` | `triggerRef` + `panelRef`; container `onKeyDown`: Escape → `preventDefault` + `stopPropagation` + close + focus trigger; Tab wraps inside the panel (stops propagation so the drawer trap never double-handles). Document Escape listener removed (replaced by the container handler); click-outside `mousedown` listener unchanged; `autoFocus` on search unchanged | AC-104 (A-06) | Selection, "All"/"N selected", Clear all, search, click-outside unchanged (existing suite green unmodified). Escape now acts when focus is inside the picker — which the trap guarantees while open |
| `src/__tests__/common/DataTable.keyboard.test.tsx` (new) | 6 cases | AC-101, AC-102 | — |
| `src/__tests__/common/MultiSelect.focus.test.tsx` (new) | 6 cases | AC-104 | — |
| `src/__tests__/layout/AuthedShell.focus.test.tsx` (new) | 7 drawer cases + 1 nested-Escape behavior case | AC-103, AC-104 | — |

| Command/check | Exit/result | Evidence |
|---|---|---|
| tsc · eslint · jest | tsc 0 · eslint 0 errors / 35 warnings (baseline 0/35) · jest 34 suites / 164 tests passed, 0 skipped | `evidence/S1_diffs.txt` |
| columns.tsx / ui diff | empty | `evidence/S1_diffs.txt` |
| `git diff --stat 3d2e655 -- src/__tests__` | empty (3 new untracked files only) | `evidence/S1_diffs.txt` |
| Mutation check (temporary) | guard removed → 1 fail; trap removed → 1 fail; file restored (cmp) | `evidence/S1_diffs.txt` |

Allowed exceptions: none · Self-repairs: 2 after a red run, both in new test code (jest.mock factory scoped `useState`; nested test needed `within(drawer)` because the desktop rail holds a second sidebar instance) + 1 caught in review before the first run (a vacuous `every()` assertion replaced by `fireEvent`'s defaultPrevented return) · Deviations: none from A-05/A-06

## Stage S2 — Cache header

Start / End: 2026-09-28T21:34:20+08:00 / 2026-09-28T21:35:04+08:00 · `source` pattern used: `/((?!_next/static/).*)` (`next.config.js:16`, the only line changed) · Before/after captures: `evidence/S2_headers_before.txt`, `evidence/S2_headers_after.txt` (chunk 200 `public, max-age=31536000, immutable`; `/`, `/auth`, `/owedbook` 307, POST `/api/auth/login` 500 all `no-store`) · Server stopped, port free: yes (count 0)

## Stage S3 — Hygiene + docs

Start / End: 2026-09-28T21:35:04+08:00 / 2026-09-28T21:38:24+08:00 · console.log exceptions: `src/instrumentation.ts:34` (A-10, one-time boot signal, no data) · PaginationControls consumers at baseline: 0 (deleted) · README/TESTING counts set to: 34 suites / 164 tests (`README.md:8,134`, `docs/TESTING.md:10`, A-04) · Banners applied: 3 files (line 1; body byte-identical, cmp) · DB_BASELINE section appended (DA-2 status recorded as: NOT YET) · A-06 docs edited: 4 files (+ `AUTHORIZATION.md:81` pointer, A-09; `AUTHENTICATION.md:61-85` removed, A-08, plus the one blank line that would otherwise double) · Full board: blank build exit 0 (17 routes) / placeholder build exit 0 (17 routes) / tsc 0 / eslint 0 errors, 35 warnings / jest 34/164/0 skipped

**Flag for QA Lead / Architect (erratum candidate, not self-ruled):** AC-401's path list includes the whole `supabase` folder, so its diff shows the one AC-306-mandated banner line on `supabase/setup.sql` (an allowed file, `RRM_BRIEF.md:34`). `supabase/migrations/**` is empty. The two ACs overlap; there is only one correct action, so this was recorded rather than treated as stop condition 7. The P1 plan's §g also said "AC-401 diff-stat empty" without noticing the overlap.

## Metrics (AC-503)

| Metric | Value |
|---|---|
| P2 start / end (`date -Is`) | 2026-09-28T21:29:23+08:00 / 2026-09-28T21:41:17+08:00 |
| Wall-clock P2 | 11m54s |
| Per-stage durations S1 / S2 / S3 / handoff | 3m21s / 0m44s / 3m20s / 2m53s (preflight 1m18s) |
| Checks executed (count) | 17 preflight + S1 10 (tsc ×2, targeted jest, full jest, 2 mutants, eslint full + touched, 2 diffs) + S2 9 (build, GET status + 5 curls, port, diff) + S3 26 (consumer grep, 2 builds, tsc, eslint, jest, 20 greps/diffs incl. 3 `head -1` + 3 `cmp`) + handoff 5 (4 SHA-256 identity pairs as 1, table validation ×3, ledger validation) = **67** |
| Self-repair attempts (count; list) | 3, all in new test code: jest.mock scope; duplicate testid scope; vacuous assertion (pre-run). Zero product-code repairs |
| Director touches between P2 start and staging block | 0 |
| Stop conditions hit | none (AC-401/AC-306 overlap recorded as an erratum candidate, see S3) |
| Preflight failures (P1 / P2) | P1: 0 environment failures (1 exception, 1 invalid measurement — ruled A-01/A-02) / P2: 0 |
| New tests added | 3 suites / 20 tests (31/144 → 34/164) |

## Completion claim

Candidate: `21ea108bb27b965ddc5edae29dc3b1d6971ae576` (the Director's single P2 commit, DC-2) · Repair diff: `evidence/repair.diff` (baseline → working tree at handoff, incl. new files; that tree was committed as `21ea108bb27b965ddc5edae29dc3b1d6971ae576`) · Changed files: `evidence/changed_files.txt` · AC coverage claims: AC-101–106 → `evidence/S1_diffs.txt` + 3 new suites · AC-201–203 → `evidence/S2_headers_before.txt`, `evidence/S2_headers_after.txt` · AC-301–308 → `evidence/S3_greps.txt`, `evidence/S3_docs_diffs.txt` · AC-401–404 → `evidence/S3_greps.txt` (AC-401 with the flagged overlap) · AC-402 → full jest run (existing suites unmodified) · AC-501 → S1/S3 boards above · AC-502 → `evidence/PREFLIGHT_P2.txt` · AC-503 → this §Metrics · AC-504 → Director's commit (`.env.local` not edited by the Engineer — only its key names were counted by PF-08; no local server left running)
Limitations / not run: authenticated keyboard walk (QA, AC-107); header re-capture by the QA Executor; trigger correction not performed (BIM-004 CE-2); jsdom has no layout — visibility of drawer controls at 375px is QA's
QA handoff: `QA_HANDOFF.md`

Engineering evidence, not independent QA certification.

## Closeout (P5, 2026-09-29 — docs and evidence only; Director-approved plan, Architect unavailable)

| Field | Value |
|---|---|
| Verdict | **Gate Q PASS** — 26 PASS / 0 FAIL / 0 BLOCKED / 0 NOT RUN, zero repair rounds — QA Lead (SOL), 2026-09-29 (`QA/QA_CERTIFICATION.md`) |
| Repo | `cyber-pharma-dev-v1-phase-3` |
| Code baseline | `3d2e65565d820ecc8b89bc5813959a4e324b3acd` (RRM-002 merge) |
| Pack commit | `a59f069` |
| Certified candidate | `21ea108bb27b965ddc5edae29dc3b1d6971ae576` |
| QA HEAD | `1a94277b73c9ee61eab1ed74991f54fcd4771afe` (docs-only successor; product diff empty) |
| Closeout commit | _recorded by Director at merge_ |
| Merge SHA | _recorded by Director at merge_ |
| QA-F01 | RESOLVED — SCRATCH unavailable; Director-authorized main development Supabase for the login-only AC-107 walk; ledger E-17; DC-4 satisfied |
| QA-F02 | NON-BLOCKING OBSERVATION — PBM trigger Enter does not open (Space does); not an RRM-003 defect; backlog for a future accessibility review; ledger E-18 |
| QA cleanup (J-19) | Nothing removed. Three browser helpers (`qa_ac107.cjs`, `qa_pbm_probe.cjs`, `sanitize_trace.py`) retained by Director ruling as reproducibility / QAM learning artifacts. Inventory 76/76 resolve and hash-match; secrets scan 0. Detail: `QA/QA_CLEANUP_REPORT.md` |
| Journal | Architect entry, QA-logged entry and friction log: placeholders only; each seat appends its own |

**Deferred, with owners (unchanged by this module):**

| Item | Owner | Gate |
|---|---|---|
| R-014 backend trigger correction (docs quarantined here) | Architect | BIM-004 CE-2 |
| DA-2 Supabase signup OFF (AC-307 records NOT YET) | Director | carried from RRM-001 |
| E-16 `protectPage` callable Server Action | Architect | Phase 8 hardening |
| E-18 PBM trigger Enter behavior | Architect | future accessibility review |

No product, configuration, contract or test byte changed at P5. No build or test was rerun.
