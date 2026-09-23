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

Date/time: 2026-09-23 18:09 +08 · Input SHA: `3187546` (Director's S1 commit) · Approved: R-020 · AC-201–204 · P2-S2 · Rulings applied: E-12 (the only correction); E-13, E-14 flag-only

| File / surface | Change and reason | Ledger / AC | Preservation concern |
|---|---|---|---|
| `src/mocks/owedbook.ts:8` | **E-12** — one comment line typed verbatim from the ruling: "expected/owed are a demo spread and do NOT satisfy rule 3 (qty × rate + 10.64); see RRM-002 FIXTURE_AUDIT A-2." Inserted after the "Demo:" sentence inside the header block. | E-12 · AC-203 | zero money values changed; 150 rows byte-identical; `+1/−0` |
| `evidence/FIXTURE_AUDIT.md` | finalized: header FINAL (S2); every row shows its ruling or `flag-only: owner/gate` (AC-204 wording); A-2b → APPLIED at S2 (E-12) | AC-201, AC-204 | — |
| `evidence/S2_fixture_hunks.txt` | NEW (temp-then-move): full `git diff <baseline> -- src/mocks/owedbook.ts`, single hunk labeled E-12; AC-202 grep; AC-301/302 transcripts | AC-202, AC-203 | — |

| Command/check | Environment | Exit/result | Evidence path |
|---|---|---|---|
| `git diff <baseline> -- src/mocks/owedbook.ts` hunk count | repo | **1 hunk** ↔ E-12 · numstat `1 0` | `evidence/S2_fixture_hunks.txt` |
| AC-202 `grep -rn "11\.85" src/ docs/ README.md` | repo | **0 hits** (`10.64` appears once — inside the E-12 comment naming the rule; not a fee literal in data or copy) | `evidence/S2_fixture_hunks.txt` |
| `npx tsc --noEmit` | local | **0 errors** | |
| `npx eslint .` | local | **0 errors / 35 warnings** (unchanged from S1) | |
| `npx jest --ci` | local, mocks | **31 suites / 144 tests / 0 skipped** (== S1) | |
| S1 disclosure suites in isolation (`src/__tests__/owedbook` + `services/owedbook.test.ts`) | local, mocks | 8 suites / 34 tests green — derived expectations unchanged by E-12 (comment only) | |
| AC-301 preserved-path diff | repo | **empty** | `evidence/S2_fixture_hunks.txt` |
| AC-302 `git diff <baseline> -- src/__tests__/services/owedbook.test.ts` | repo | **empty**; tracked `__tests__` diff vs baseline lists only the two S1 additions | `evidence/S2_fixture_hunks.txt` |

Statement: no existing test was modified in S2; no test broke; no stop condition hit. Allowed exceptions: none · Deviations: none · Env restoration: no build in S2; nothing exported; `.env.local` untouched; no live Supabase call · Director checkpoint SHA: <S2 commit, filled at P3>
GIT REMINDER — uncommitted paths: `src/mocks/owedbook.ts` · `evidence/FIXTURE_AUDIT.md` · `evidence/S2_fixture_hunks.txt` · this log · `CHANGELOG.md` · session log · S2 report `agent_docs/RESPONSES/response_2026-09-23_180905_rrm002-s2-result.md`

## Completion claim

Candidate SHA: <...> · Repair diff: `evidence/repair.diff` · Changed files: `evidence/changed_files.txt` · AC coverage claims: <AC IDs → evidence paths>
Limitations / not run: authenticated browser check (QA); wrapper-side precision (BIM-005 note)
QA handoff: `QA_HANDOFF.md`

Engineering evidence, not independent QA certification.
