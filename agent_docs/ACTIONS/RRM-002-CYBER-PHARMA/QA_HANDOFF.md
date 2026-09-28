# RRM-002-CYBER-PHARMA — QA Handoff

Engineer → QA Lead (QA Executor executes; Director holds Git). Assembled at P3, 2026-09-23. **Every line is a claim for independent verification.** Prior-review findings are not pre-accepted; engineering results are not independently proven.

## Identity

| Field | Value |
|---|---|
| Repo | `cyber-pharma-dev-v1-phase-3` |
| Baseline | `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b` — RRM-001 `--no-ff` merge of `qa/phase-3-rrm001` on `main` |
| Candidate | `34e6fb6fd8c4e5c6610f4b0f49177abcb6cc0731` — Director's S2 commit (S1 checkpoint `3187546`; P1b `6f543a8`; pack `91a951e`) |
| Handoff branch | `phase-3-rrm002` |
| QA branch | `qa/phase-3-rrm002` — Director cuts from the committed candidate; confirmed by Director: _(date, Director fills)_ |

## Contract and rulings

- Brief: `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/RRM_BRIEF.md` — unchanged since the pack commit.
- Acceptance spec: `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — **text unchanged since freeze apart from the erratum lane** (`git diff 91a951e -- ACCEPTANCE_SPEC.md` = two added lane rows, zero removed lines): AC-106 (`round2` in `format.ts`, A-01) · AC-104 (tab switch re-requests, A-03).
- Authority pointer: `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/AUTHORITY_POINTER.md` — unchanged.
- Rulings addendum: `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/RULINGS_ADDENDUM.md` rows **A-01…A-05**.
- Campaign errata used: **E-12** (applied — one comment line, `src/mocks/owedbook.ts:8`) · **E-13** (flag-only — rule-3 fixtures → BIM-004 seed) · **E-14** (flag-only — Ruling 5 status vocabulary → Phase 5), in `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md`.
- Ledger resolution rows appended for **R-015** and **R-020** (independent-check column empty for the QA Lead); **R-003** and **R-008** rationale annotated "flagged in RRM-002 evidence/FIXTURE_AUDIT.md; Phase 5" — no disposition change: **yes**.

## References

- `agent_docs/ASTRA_CODE_REVIEW.md` A-004 (§6) and §8 "Financial decisions"
- `agent_docs/FABLE_CODE_REVIEW.md` F3, F8
- `agent_docs/RECON/RRM001_RECON_2026-09-18.md` R2, R2-ADDENDUM, R5 (D3–D5), R7
- Engineer reports: `agent_docs/RESPONSES/response_2026-09-23_150109_rrm002-s0-plan.md` (S0) · `response_2026-09-23_160316_rrm002-p1b-rulings.md` (P1b) · `response_2026-09-23_164131_rrm002-s1-result.md` (S1) · `response_2026-09-23_180905_rrm002-s2-result.md` (S2) · the P3 completion report beside them

## Execution log and evidence

`agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` (S0, S1, S2, Completion claim) · `evidence/S0_PRECISION.txt` · `evidence/FIXTURE_AUDIT.md` (FINAL) · `evidence/S1_diffs.txt` · `evidence/S2_fixture_hunks.txt` · `evidence/repair.diff` · `evidence/changed_files.txt`.

**Diff scope note.** `repair.diff` and `changed_files.txt` are the literal `git diff [--name-status] <baseline>..<candidate>`. They include the Director's docs-only commits above the baseline: RRM-001 SHA recording (`50b1d2d`) and the RESPONSES `_OLD/` archive reshuffle (`91a951e`). The product subset is `git diff <baseline>..<candidate> -- src/`: six files — `src/components/owedbook/format.ts` (M) · `src/components/owedbook/OwedBookScreen.tsx` (M) · `src/components/owedbook/SummaryUnattributedNote.tsx` (A) · `src/__tests__/owedbook/SummaryUnattributedNote.test.tsx` (A) · `src/__tests__/owedbook/OwedBookScreen.disclosure.test.tsx` (A) · `src/mocks/owedbook.ts` (M, +1 comment line, E-12).

## Governing QA instructions

Repo-local: `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/GOVERNING/` — copied (not moved) from `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/` on 2026-09-23: `QA_PLAYBOOK.md` (v1.1) · `WEB_FACTORY_P1_DOCTRINE_JOURNAL.md` (v0.3) · `SEARCH_RECORD.md` · `README.md`. `QA/GOVERNING/PROVENANCE.md` records "copied from RRM-001/QA/GOVERNING/ on 2026-09-23; original provenance per that file" with SHA-256 of each copy (all byte-identical to source). The pack's 239-byte placeholder `README.md` was replaced by RRM-001's `README.md` in the copy.

## Reproduction

Board (placeholder env scoped per command; nothing exported):

```bash
rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= SUPABASE_SECRET_KEY= NEXT_PUBLIC_SITE_URL= npx next build
rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL=https://placeholder.invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-publishable SUPABASE_SECRET_KEY=placeholder-secret NEXT_PUBLIC_SITE_URL=http://localhost:3000 npx next build
npx tsc --noEmit
npx eslint .
npx jest --ci
```

Engineering results (claims): builds exit 0 · 17 routes each · tsc 0 · eslint 0 errors / 35 warnings · jest 31 suites / 144 tests / 0 skipped.

Footer expected value — derive it yourself from the fixtures on the candidate: **X = `usd(round2(Σ owed over owedBookFixtures where pbm === null && owed > 0 && row passes the active filters))`**. Unfiltered, the four null-PBM rows are `claim_134`, `claim_088`, `claim_006`, `claim_001`. The screen computes `round2(K − S)` from `getKpis(filters).commercial_underpaid` and `Σ getSummary(filters)[i].commercial_dollars`; the identity holds because both aggregates sum only positive `owed` and the summary skips null PBM (`src/services/owedbook.ts:73,113,116`).

**No live Supabase call was made in engineering.** `.env.local` was not read for values and not edited.

## Carry-forward to BIM-005 (contract note, not a finding)

The precision premise (AC-105: every fixture money value exact to 2 dp, so `gap` has no rounding noise) and the mock↔wrapper divergences **D3** (summary tiebreak), **D4** (empty-string PBM skipped by truthiness vs `is not null`), **D5** (JS `toFixed` vs SQL `round(numeric, 2)`) must be re-verified against `owedbook_kpis` / `owedbook_summary` before the swap. A D4 empty-string PBM would be kept by the wrapper's summary and change `S`.

## Required regression for the QA Lead

- AC-301 preserved-path diff empty · AC-302 `owedbook.test.ts` byte-identical and green (`:12` seven PBMs, `:23` equality) · AC-303 page-local sort and `cancelled` guards.
- **AC-304 authenticated Summary-tab check**: MEMBER login on the QA Lead's chosen project → Summary tab shows the footer unfiltered → named-PBM-only filter removes it → clear restores it → desktop and 375px, light and dark → no layout shift on the other tabs. **Playwright recommended** (RRM-001 lesson). Director supplies browser-only credentials on request.
- Architect risk notes in `QA/README.md`: race a slow summary against a filter change in the browser, not only in jsdom; derive X yourself; confirm every fixture hunk has an erratum ID.

## Unrun / limitations

Unrun by design: authenticated browser check (AC-304) · real-auth login. Deployment waived. Wrapper-side precision is a BIM-005 note.

## Environment restoration

None needed beyond stopping any local server. `.next/` (gitignored) left as the S1 placeholder-env build. `.env.local` untouched.

## Lanes

QA writable lane: `QA/**`. Protected: see `CLAUDE.md` — `RECOVERY.md`, `agent_docs/SESSIONS/**` (Director-protected).

The QA Lead authors `QA/QA_TEST_PLAN.md`; the QA Executor executes; the QA Lead certifies in `QA/QA_CERTIFICATION.md`.
