# RRM-002-CYBER-PHARMA — Engineering Execution Log

Engineer · Approved scope/plan: `RRM_BRIEF.md` v1.0 + the S0 plan in `agent_docs/RESPONSES/` (Director-approved) · Code baseline `<baseline>` (RRM-001 merge commit; full SHA recorded at P1) · Branch: `phase-3-rrm002`

One section per stage and per QA repair round. Every fixture/copy hunk cites its erratum ID. Every grep/diff AC lists allowed exceptions with path and reason, or "none".

## Stage S0 — Plan Mode (record only)

Baseline SHA recorded: `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b` (RRM-001 `--no-ff` merge; ancestor of HEAD `91a951e`; product-path diff empty) · Precision premise result (AC-105): HOLDS — 0 of 150 `owed` values beyond 2 dp, 0 in any money field; unfiltered `round2(K − S)` = 20.27 = Σ positive null-PBM `owed` (`evidence/S0_PRECISION.txt`) · Audit rows proposed: 13 (A-1…A-12 + A-2b; `evidence/FIXTURE_AUDIT.md`) · Rulings applied at P1b: addendum A-01…A-05; spec erratum lane AC-106, AC-104; campaign errata E-12 (A-2b taken — the single S2 hunk), E-13 (rule-3 fixtures → BIM-004 seed), E-14 (Ruling 5 status vocabulary → Phase 5); ledger placeholder `E-10…` removed · S0 plan: `agent_docs/RESPONSES/response_2026-09-23_150109_rrm002-s0-plan.md`

## Stage S1 — Disclosure

Date/time: 2026-09-23 16:41 +08 · Input SHA: `6f543a8` (S0 plan + P1b rulings commit; product paths == baseline `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b`) · Approved: R-015 · AC-101–106 · P2-S1 · Rulings applied: A-01 (`round2` in `format.ts`), A-03 (AC-104 re-requests)

| File / surface | Change and reason | Ledger / AC | Preservation concern |
|---|---|---|---|
| `src/components/owedbook/format.ts` | +`export const round2` — byte-identical expression to `services/owedbook.ts:56`; the service is frozen | A-01 · AC-106 | no new rounding logic; `usd`/`count` untouched |
| `src/components/owedbook/SummaryUnattributedNote.tsx` | NEW presentational note: `S = Σ commercial_dollars`, `gap = round2(underpaid − S)`, null when `gap < 0.01`, one `<p data-testid="summary-unattributed-note">` with the D3 copy in one constant | R-015 · AC-101, AC-102 | only arithmetic is `round2(K − S)`; no service call |
| `src/components/owedbook/OwedBookScreen.tsx` | +2 imports · +2 state tags (`kpiFilters`, `summaryFilters`) · KPI effect `.then/.catch` rewritten to set the tag beside the value (catch keeps `ZERO_KPIS`, tag → null) · summary branch +`setSummaryFilters(filters)` · +1 render block after the table: `isSummary && !loading && !error && kpiFilters === filters && summaryFilters === filters` | AC-103, AC-104, AC-303 | sort block untouched (diff grep empty); `cancelled` guard on both read effects; no new request |
| `src/__tests__/owedbook/SummaryUnattributedNote.test.tsx` | NEW, 6 tests: text/testid, 0.01 boundary, gap 0, S > K by 0.004, K − S = 0.004, gap −5.00 | AC-101, AC-102 | — |
| `src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx` | NEW, 8 tests: real service — AC-101 unfiltered + filtered (expected DERIVED from fixtures), AC-102 named-PBM-only, AC-104 tabs/switch/back-after-skeleton; spied service — rejected KPI, loading, stale summary across a filters change, K for A with S for B | AC-101–104 | existing suites untouched |

| Command/check | Environment | Exit/result | Evidence path |
|---|---|---|---|
| `rm -rf .next && env <blank Supabase env> npx next build` | local, no live Supabase | exit 0 · **17 routes** | `evidence/S1_diffs.txt` header |
| `rm -rf .next && env <placeholder env> npx next build` | local, `https://placeholder.invalid` etc. | exit 0 · **17 routes** (table recorded in the S1 report) | `evidence/S1_diffs.txt` header |
| `npx tsc --noEmit` (after the fresh build) | local | **0 errors** | |
| `npx eslint .` | local | **0 errors / 35 warnings** — identical count to RRM-001's board; the two warnings in `OwedBookScreen.tsx` (`set-state-in-effect`, :79/:105) exist at baseline (:73/:91) and are the same rule, shifted by additions | |
| `npx jest --ci` | local, mocks | **31 suites / 144 tests / 0 skipped** (baseline 29/130; +2 suites, +14 tests, all new) | |
| AC-301 preserved-path diff | repo | **empty** | `evidence/S1_diffs.txt` |
| AC-106 service/types diff | repo | **empty**; `round2` sites: service :56, `format.ts` export, note component, tests | `evidence/S1_diffs.txt` |
| AC-302 `owedbook.test.ts` diff · `__tests__` tracked diff | repo | **empty** · **empty** (only 2 untracked additions) | `evidence/S1_diffs.txt` |
| AC-303 cancelled-flag grep · sort-line diff grep | repo | both read effects guarded · **no sort line in the diff** | `evidence/S1_diffs.txt` |
| whole-`src/` diff stat vs baseline | repo | `OwedBookScreen.tsx` +24/−2 · `format.ts` +4 · 3 new files | `evidence/S1_diffs.txt` |

Allowed exceptions: none · Deviations: two `findByText` → `findAllByText` in the screen test after first run (DataTable paints table + card layouts; two KPI tiles share the R-003 value) — test-only · Env restoration: placeholder/blank env scoped per command, nothing exported, `.env.local` not read for values, not edited; no live Supabase call; `.next/` (gitignored) left as the placeholder-env build · Director checkpoint SHA: <S1 commit, filled at P3>
GIT REMINDER — uncommitted paths: `src/components/owedbook/format.ts` · `src/components/owedbook/OwedBookScreen.tsx` · new `src/components/owedbook/SummaryUnattributedNote.tsx` · new `src/__tests__/owedbook/SummaryUnattributedNote.test.tsx` · new `src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx` · `evidence/S1_diffs.txt` · this log · `CHANGELOG.md` · session log · S1 report `agent_docs/RESPONSES/response_2026-09-23_164131_rrm002-s1-result.md`

## Stage S2 — Audit corrections

(same shape; include the hunk-by-hunk `git diff <baseline> -- src/mocks/owedbook.ts` with erratum IDs at `evidence/S2_fixture_hunks.txt`; AC-202 grep; statement that no existing test was modified)

## Completion claim

Candidate SHA: <...> · Repair diff: `evidence/repair.diff` · Changed files: `evidence/changed_files.txt` · AC coverage claims: <AC IDs → evidence paths>
Limitations / not run: authenticated browser check (QA); wrapper-side precision (BIM-005 note)
QA handoff: `QA_HANDOFF.md`

Engineering evidence, not independent QA certification.
