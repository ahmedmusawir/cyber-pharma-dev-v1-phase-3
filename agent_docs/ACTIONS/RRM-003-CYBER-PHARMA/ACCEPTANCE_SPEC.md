# RRM-003-CYBER-PHARMA — Access, Cache, Hygiene, Docs — Acceptance Specification

**Version:** 1.0 · 2026-09-28 · **Architect** authored · **Director approval:** campaign map §6 + carried items · **Contract freezes at:** engineering handoff (end of P2). Post-freeze rulings append to `RULINGS_ADDENDUM.md` and the erratum lane below; frozen text is never rewritten.
**Scope:** keyboard/focus on three primitives; cache header scoped off static assets; hygiene; SQL docs quarantine and signup-prose cleanup. **Code baseline:** post-RRM-002 `main` merge commit (`<baseline>`; SHA recorded at P1).

Requirements are agreed before implementation. The Engineer delivers this file unchanged with execution evidence. QA verdicts belong to the QA Lead. Grep and diff criteria are literal; allowed exceptions are listed in `EXECUTION_LOG.md` with path and reason.

## AC-100 — Keyboard and focus (R-010, A-005, F10; UI_SPEC v1.0 §8)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-101 | Each sortable column header in `DataTable` exposes a focusable control: a `<button type="button">` inside the `<th>`, or the `<th>` itself with `tabIndex={0}` and `role="button"`. Tab reaches every sortable header in column order; non-sortable headers are not in the tab order. | Negative: `<th>` for a non-sortable column has no `tabIndex`/`role="button"`. | jsdom | test |
| AC-102 | Enter and Space on a focused sortable header toggle sort exactly as a click does (same `aria-sort` sequence: `none` → `ascending` → `descending` or the existing cycle, unchanged). Space does not scroll the page (`preventDefault`). | Negative: existing click tests pass unmodified. | jsdom | test + existing suite |
| AC-103 | Filter drawer (collapsed breakpoint, `AuthedShell`): on open, `document.activeElement` is the first focusable element inside the drawer; Tab from the last focusable element wraps to the first and Shift-Tab from the first wraps to the last (or the page behind is `inert` so no wrap is needed — either mechanism passes); Escape closes; on close, focus returns to the element that opened it. Body-scroll lock unchanged. | Negative: the persistent desktop rail is not affected (no `inert`, no focus move on mount). Existing `drawer-apply.integration.test.tsx` passes unmodified. | jsdom | tests |
| AC-104 | `MultiSelect`: opening the panel moves focus to the search input; Tab/Shift-Tab stay within the panel; Escape closes the panel and returns focus to the trigger; click-outside still closes. When the picker is open inside the drawer, one Escape closes the picker and the drawer stays open; a second Escape closes the drawer. | Negative: selection toggling and the "All" option behave exactly as before (existing MultiSelect tests unmodified). | jsdom | tests |
| AC-105 | `git diff <baseline> -- src/components/owedbook/columns.tsx src/components/ui` → empty (D5; kit primitives' APIs untouched). | — | repo | diff |
| AC-106 | New tests exist for AC-101–104 under `src/__tests__/common/` and/or `src/__tests__/layout/`; all pre-existing tests pass unmodified (`git diff --stat <baseline> -- src/__tests__` lists only added files). | — | Jest + repo | jest + diff |
| AC-107 | **Authenticated keyboard walk (QA):** on SCRATCH as MEMBER, at 375px: open the drawer by keyboard, Tab through it, open the PBM picker, Escape once (picker closes, drawer open), Escape again (drawer closes, focus on trigger). At desktop: Tab to the Owed header, press Enter, see the sort indicator change and rows reorder. Light and dark. | — | browser, real auth | QA record (trace/screenshots) |

## AC-200 — Cache header (R-006, F6)

| AC | Required observable behavior | Controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-201 | `next.config.js` `headers()` no longer applies the `no-store` header set to paths under `/_next/static/`. The change is confined to the `source` pattern (and, if needed, a second entry) — the header values themselves are unchanged. | — | repo | diff |
| AC-202 | Served from the standalone build with placeholder env: `curl -sI /` → `Cache-Control` contains `no-store`; `curl -sI /_next/static/chunks/<any>.js` → `Cache-Control` contains `immutable` **or** `max-age=31536000`, and does **not** contain `no-store`. Both captures saved verbatim, alongside the preflight "before" capture. | Negative: `/auth`, `/owedbook` (unauthenticated → redirect) and `/api/auth/login` (POST, empty body) responses still carry `no-store`. | served build | `evidence/S2_headers_before.txt`, `evidence/S2_headers_after.txt` |
| AC-203 | `git diff <baseline> -- next.config.js` shows changes only inside `headers()`; `images.*`, `output`, and everything else byte-identical. | — | repo | diff |

## AC-300 — Hygiene and docs (R-013, R-018, OBS-2, R-014/R-017, A-06)

| AC | Required observable behavior | Controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-301 | `grep -rn "This is coming from" src/` → 0. `src/app/(admin)/not-found.tsx` diff vs baseline is exactly one line. | — | repo | grep + diff |
| AC-302 | `grep -rn "console\.log" src/ --include=*.ts --include=*.tsx` excluding `src/__tests__/` → 0, or each remaining hit listed in `EXECUTION_LOG.md` as an allowed exception with a reason. | — | repo | grep |
| AC-303 | `src/components/common/PaginationControls.tsx` deleted after `grep -rn "PaginationControls" src/` proves zero consumers at baseline; `src/components/ui/tabs.tsx` byte-identical. | Negative: if a consumer exists, file stays and the finding is recorded, not forced. | repo | grep + diff |
| AC-304 | `README.md` (and `TESTING.md` if it carries counts) test suite/test numbers equal the final `jest --ci` numbers from the S3 board run. | — | repo | README diff + jest output |
| AC-305 | `docs/DATABASE_SETUP.md` contains no instruction to run `docs/migration_add_profiles.sql`; it states the canonical schema is `supabase/migrations/` and that the installed signup-trigger correction is owned by the BIM-004 pre-flight rider (CE-2). The old Step-4 SQL block, if retained, is labeled as historical. | — | repo | diff |
| AC-306 | `docs/setup.sql`, `supabase/setup.sql`, `docs/migration_add_profiles.sql` each begin with the line `-- SUPERSEDED (RRM-003, <date>): not the installed schema. Canonical chain: supabase/migrations/. Do not run. Trigger correction: see agent_docs/DB_BASELINE.md.` and are otherwise byte-identical to baseline. `supabase/migrations/**` byte-identical. | — | repo | head + diff |
| AC-307 | `agent_docs/DB_BASELINE.md` ends with an appended, dated section "Installed `handle_new_user` — confirmed 2026-09-20" stating: role assigned from `raw_user_meta_data->>'role'` else `member`; name from `full_name`; containment = Supabase "allow new users to sign up" disabled (Director DA-2; record its status as PRESENT or NOT YET at this module's date, from `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/`); permanent correction = backend migration (fixed `member`, `full_name`), BIM-004 pre-flight rider, verified at APPLY SESSION. No claim that the correction is applied. Existing text above the section unchanged. | — | repo | diff |
| AC-308 | Signup prose: `docs/ARCHITECTURE.md`, `docs/AUTHORIZATION.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHENTICATION.md` no longer describe public self-registration as a current flow; each carries at most a short note that it was removed in RRM-001. `grep -rniE "sign ?up|register" docs/` hits are either inside such a note, inside a changelog under `docs/change_logs/`, or listed as allowed exceptions with a reason. | — | repo | grep + diffs |

## AC-400 — Preserved behavior

| AC | Required observable behavior | Boundary | Evidence |
|---|---|---|---|
| AC-401 | `git diff --stat <baseline> -- src/services src/types src/mocks src/components/owedbook src/app/api src/app/(auth) src/app/profile src/app/owedbook src/proxy.ts src/utils supabase scripts package.json package-lock.json` → empty. `src/app/(admin)` diff = the one `not-found.tsx` line only. | repo | diff transcript |
| AC-402 | Every pre-existing test suite passes unmodified: `DataTable.test.tsx`, `MultiSelect` tests, `drawer-apply.integration.test.tsx`, `OwedBookScreen.disclosure.test.tsx`, `SummaryUnattributedNote.test.tsx`, `owedbook.test.ts`, `Navbar.invariant.test.tsx`, `AuthPage.test.tsx`, `actions.test.ts`, `proxy.test.ts`. | Jest + repo | jest + diff |
| AC-403 | Page-local sort semantics unchanged: no sort parameter on `getRows`; the sort block in `OwedBookScreen.tsx` byte-identical. | repo | diff |
| AC-404 | OBS-1 disposition recorded in `RULINGS_ADDENDUM.md` (flag-only → Phase 8 hardening, or as ruled); `src/utils/supabase/actions.ts` byte-identical. | repo | addendum + diff |

## AC-500 — Board, metrics, hygiene

| AC | Required observable behavior | Evidence |
|---|---|---|
| AC-501 | End of S1, S2, S3: `npx tsc --noEmit` 0 errors (after a fresh build if stale `.next/` types interfere) · `npx eslint .` 0 errors (warning count recorded) · `npx jest --ci` all pass, zero skipped (suites/tests recorded) · S3 additionally: `next build` exit 0 with blank Supabase env and with placeholder env (route count recorded; expect 17). | `EXECUTION_LOG.md` |
| AC-502 | `ENVIRONMENT_PREFLIGHT.md` PF-01…PF-17 recorded PASS at P2 start (`evidence/PREFLIGHT_P2.txt`). | evidence |
| AC-503 | `EXECUTION_LOG.md` §Metrics filled: P2 start/end timestamps; per-stage start/end; checks executed; self-repair attempts (count and what); Director touches between P2 start and the staging block (expected 0); stop conditions hit (expected none). | log |
| AC-504 | `git status --porcelain` empty after the Director's single commit; candidate SHA recorded; `.env.local` not edited (Engineer states it); no local server left running. | log |

## Required regression and constraints

- Suites in AC-402 stay green unmodified. Journeys: keyboard walk (AC-107); header capture before/after; 404 pages render without debug text; `/auth`, `/owedbook`, `/admin-portal` load unchanged.
- Mocks: OwedBook and adminDemo stay mock. Real auth only in the QA walk.
- Unavailable boundaries that do not block acceptance: deployment (waived); the live trigger correction (AC-307 records, never verifies).
- Test counts recorded, never a pass criterion alone.

## Acceptance gates

Every AC needs independent evidence. Ambiguity or failure → QA Lead; scope → Architect/Director. Engineer green ≠ Gate Q. This certificate, when issued, certifies neither the installed signup trigger nor deployment caching behavior beyond the served standalone build.

## Erratum lane (append-only; empty at freeze)

| Date | AC | Original requirement | Ruling / rationale | Authority | Verification consequence |
|---|---|---|---|---|---|
| 2026-09-28 | AC-102 | "(preventDefault)" | Native button activation; no explicit handler. See A-05. | Director | AC-107 adds the no-scroll check |
| 2026-09-28 | AC-202 | served from the standalone build | Standalone requires `.next/static` and `public/` copied in; chunk capture must be HTTP 200. See A-02. | Director | S2 captures record status |
| 2026-09-28 | AC-304 | `TESTING.md` | `docs/TESTING.md`. See A-04. | Director | none |
| 2026-09-29 | AC-401 | path list includes `supabase` | `supabase/migrations`; `supabase/setup.sql` banner is AC-306. See A-13. | Director | QA grades AC-401 on the corrected list |
