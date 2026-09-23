# RRM-002-CYBER-PHARMA — Ledger Truth — Acceptance Specification

**Version:** 1.0 · 2026-09-23 · **Architect** authored · **Director approval:** D3 + money rules · **Contract freezes at:** engineering handoff (P3). Post-freeze rulings append to `RULINGS_ADDENDUM.md` and the erratum lane below; frozen text is never rewritten.
**Scope:** Summary-tab missing-PBM disclosure; fixture/copy audit corrections ruled by Director erratum. **Code baseline:** post-RRM-001 `main` merge commit (`<baseline>` below; SHA recorded at P1).

Requirements are agreed before implementation. The Engineer delivers this file unchanged with execution evidence. QA verdicts belong to the QA Lead. Grep and diff criteria are literal; allowed exceptions are listed in `EXECUTION_LOG.md` with path and reason.

## Definitions

- `filters` — the committed `OwedBookFilters` object from `OwedBookContext` at the time of a request.
- `K` — `getKpis(filters).commercial_underpaid` (number, 2 dp).
- `S` — `Σ getSummary(filters)[i].commercial_dollars` over every returned row.
- `gap` — `round2(K − S)` using the existing `round2` helper (`src/services/owedbook.ts` exports it or an equivalent is imported from `format.ts`; no new rounding logic).
- **Same-filters pair** — a `K` and an `S` whose requests were issued for the identical `filters` reference (object identity or a filters key derived once per commit), both resolved, neither superseded by a later filters change.
- **Precision premise** — every fixture `owed` value is an exact 2-dp number, so `K` and `S` are exact sums and `gap` carries no rounding noise. Verified in S0 (AC-105). Carried to BIM-005 as a contract note for the SQL wrappers.

## AC-100 — Missing-PBM disclosure (D3, R-015)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-101 | On the Summary tab, when a same-filters pair exists and `gap ≥ 0.01`, exactly one element `data-testid="summary-unattributed-note"` renders the text **"$X in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown."** where `X = usd(gap)` via the existing `usd` formatter. The string is static copy in one place. | Positive, unfiltered: the test **derives** the expected X from `owedBookFixtures` as `round2(Σ owed where pbm === null && owed > 0)` and asserts equality — no literal dollar figure in the test. Positive, filtered: a date range that isolates at least one null-PBM row with positive owed → footer present, X = that subset's derived value. | jsdom | test + QA screenshot |
| AC-102 | When `gap < 0.01` — including exactly 0 and any negative — the element does not render. `$0.00` is never displayed. | Negative: PBM filter set to named PBMs only → no footer. Negative: injected summary whose S exceeds K by 0.004 → no footer. Negative: injected pair with gap −5.00 → no footer. | jsdom with injected service responses | tests |
| AC-103 | The footer renders only from a same-filters pair. If either request is pending, rejected, or was issued for a previous `filters` value, no footer renders. On a filters change, any visible footer disappears until the new pair resolves. Loading skeleton state shows no footer. | Negative: rejected `getKpis` → no footer and the existing `ZERO_KPIS` fallback unchanged. Negative: `getSummary` deferred until after a filters change, then resolved → no footer from the stale pair. Negative: `getKpis` resolves for filters A, `getSummary` resolves for filters B → no footer. | jsdom, deferred promises | tests |
| AC-104 | Footer absent on Commercial, Updated and Federal tabs regardless of gap. Switching from Summary to another tab removes it; switching back re-renders it from the still-valid pair without a new request (or with one — either is acceptable; state it). | — | jsdom | tests |
| AC-105 | Precision premise recorded: `evidence/S0_PRECISION.txt` lists every fixture row whose `owed` has more than 2 decimal places (expected: none). If any exist, they are reported in the audit table (AC-201) and the footer AC-101 test still passes with derived values. | — | repo | evidence file |
| AC-106 | No arithmetic beyond `round2(K − S)`. `git diff <baseline> -- src/services/owedbook.ts src/types/OwedBook.ts` is empty. No new service method, no wrapper change, no new rounding helper. | — | repo | diff transcript |

## AC-200 — Fixture and copy audit (R-020, rules 1–7)

| AC | Required observable behavior | Controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-201 | `evidence/FIXTURE_AUDIT.md` exists, produced in S0 and finalized in S2, with one row per finding: rule (1–7) → path:line → current value/text → classification {CORRECT / COPY-CORRECTION PROPOSED / VALUE-CONFLICT FLAGGED / FLAG-ONLY (deferred)} → Director ruling (erratum ID or "flag-only: owner/gate"). Minimum coverage: every `11.85` and `10.64` in `src/`, `docs/`, `README.md`; per-row check `expected == round2(qty × medicaid_rate + 10.64)` over all 150 fixture rows with counts of pass/fail (rows listed, not fixed); distinct fixture `method` values vs vocabulary {AAC, FUL, GWAC, BWAC, Take Action, Manual Override}; count of negative-`owed` rows and where `posNeg` renders them; `federal_expected = aac × qty` (no fee) as FLAG-ONLY → Phase 5; any copy implying a user-editable PBM key or repricing at current prices; any fixture `owed` beyond 2 dp (AC-105). | — | repo | evidence file |
| AC-202 | `grep -rn "11\.85" src/ docs/ README.md` → 0 after S2, **or** every remaining hit is a ruled exception with erratum ID. | — | repo | grep |
| AC-203 | Every hunk in `git diff <baseline> -- src/mocks/owedbook.ts` and every copy-string change maps to exactly one erratum row (E-NN in the campaign ledger + the lane below) naming path:line, prior value, ruled value. Zero hunks without a row. No `expected`, `owed`, `original_paid`, `new_paid`, `updated_difference`, `aac`, `federal_expected` or `federal_diff` value recomputed by the Engineer — a ruled value is typed from the ruling, never derived. | Negative: a fixture row failing the rule-3 check without a ruling remains byte-identical and is listed as VALUE-CONFLICT FLAGGED. | repo | diff + errata |
| AC-204 | Flag-only items carry owner and gate exactly as the campaign map §10 states: aggregate KPI / `commercial_scripts` federal exclusion → Phase 5 (Architect); federal sign/rounding → Phase 5 (Architect/Frank); negative-owed display → Phase 5 UI ruling (Director/Frank); brand/generic → Frank rider R3; Unattributed bucket → Phase 5. | — | evidence file | AC-201 |

## AC-300 — Preserved behavior

| AC | Required observable behavior | Boundary | Evidence |
|---|---|---|---|
| AC-301 | `git diff --stat <baseline> -- src/services src/types src/components/owedbook/columns.tsx src/components/owedbook/KpiTiles.tsx src/components/owedbook/FilterRail.tsx src/components/owedbook/OwedBookContext.tsx src/components/common src/app/(admin) src/app src/utils src/proxy.ts supabase scripts package.json package-lock.json next.config.js` → **empty**, except `src/app/**` paths are listed here only to prove no auth/route file moved (the footer lives under `src/components/owedbook/`). | repo | diff transcript |
| AC-302 | `src/__tests__/services/owedbook.test.ts` unmodified (`git diff <baseline> -- src/__tests__/services/owedbook.test.ts` empty) and green, including the `:23` `owed === commercial_underpaid` assertion and the `:12` seven-PBM pin. All pre-existing suites pass unmodified; `git diff --stat <baseline> -- src/__tests__` lists only added files. | Jest + repo | diff + jest |
| AC-303 | Sort remains page-local: no sort parameter added to `getRows`; `OwedBookScreen.tsx` sort block unchanged apart from lines the footer touches (diff shows footer additions only). `cancelled`-flag pattern present on every read effect in `OwedBookScreen.tsx`. | repo | diff + grep |
| AC-304 | **Authenticated browser check (QA):** log in as MEMBER on the QA Lead's chosen project; Summary tab shows the footer with unfiltered fixtures; apply a named-PBM-only filter → footer gone; clear → footer back; desktop and 375px, light and dark. No layout shift on the other tabs. | browser, real auth | QA record (Playwright trace or walk record) |

## AC-400 — Board and hygiene

| AC | Required observable behavior | Evidence |
|---|---|---|
| AC-401 | End of S1 and S2: `npx tsc --noEmit` 0 errors (run after a fresh build if stale `.next/` types interfere — RRM-001 lesson) · `npx eslint .` 0 errors (warning count recorded) · `npx jest --ci` all suites pass, zero skipped (suites/tests recorded) · `next build` exit 0 with blank Supabase env and with placeholder env (route count recorded; expect 17). | `EXECUTION_LOG.md` |
| AC-402 | `git status --porcelain` empty after each Director stage commit; candidate SHA recorded at P3; `.env.local` not edited (Engineer states it). | log |

## Required regression and constraints

- Suites that stay green unmodified: `owedbook.test.ts`, `KpiTiles.test.tsx`, `FilterRail.test.tsx`, `drawer-apply.integration.test.tsx`, `Navbar.invariant.test.tsx`, `AuthPage.test.tsx`, seed/state-coverage tests. A modification needs an addendum row.
- Journeys: login → OwedBook → Summary tab → footer present/absent across filters → other tabs clean.
- Mocks: OwedBook and adminDemo stay mock. Real auth only in the QA check.
- Unavailable boundaries that do not block acceptance: deployment; wrapper-side precision (BIM-005 note).
- Test counts recorded, never a pass criterion alone.

## Acceptance gates

Every AC needs independent evidence. Ambiguity or failure → QA Lead; scope → Architect/Director. Engineer green ≠ Gate Q. This certificate, when issued, does not certify aggregate KPI semantics, federal math, or wrapper behavior — all Phase 5 / BIM-005.

## Erratum lane (append-only; empty at freeze)

| Date | AC | Original requirement | Ruling / rationale | Authority | Verification consequence |
|---|---|---|---|---|---|
| 2026-09-23 | AC-106 | "no new rounding helper" | `round2` exported from `format.ts` with the service's exact expression; no new logic. See A-01. | Director | AC-106 graded on the service/types diff being empty |
| 2026-09-23 | AC-104 | "without a new request (or with one)" | With one; pinned per A-03. | Director | AC-104 test asserts skeleton then footer |
