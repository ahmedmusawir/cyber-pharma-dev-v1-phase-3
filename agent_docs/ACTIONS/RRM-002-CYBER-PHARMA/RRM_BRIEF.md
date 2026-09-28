# RRM-002-CYBER-PHARMA — Ledger Truth — Brief

**Version:** 1.0 · 2026-09-23 · **Architect** authored · **Director approval:** D3 (2026-09-20) + standing direction on the seven money rules · **Campaign:** `RRM_CAMPAIGN_MAP_v1_0.md` §5
**Code baseline:** post-RRM-001 `main` (RRM-001 merge commit; SHA recorded by the Engineer at P1) · **Branch:** `phase-3-rrm002` · **Ledger rows:** R-015 (accept — disclosure), R-020 (accept — bounded audit); R-003 and R-008 flagged only (Phase 5)

## Why this module exists

Both the mock service and the certified BIM-003 wrapper drop null-PBM claims from the Summary tab by contract. Astra reproduced it: every filter that includes an unmatched claim shows a KPI total that the PBM breakdown cannot reconcile to. The Director approved a disclosure, not a bucket. Separately, the Director locked seven money rules on 2026-09-20; the mock world and screen copy predate them and must be audited so the demo stops contradicting the rules Frank has now confirmed — without building any pricing logic into the frontend. Engine 2 work on the completed FFM surface; the certificate covers this scope only.

## Inputs and reconciliation

| Input | Specimen | Status | Limits |
|---|---|---|---|
| Astra A-004 (+ §8 financial decisions) | Git-free export | Mechanism re-verified on disk (recon R2/R5); dollar figures not re-run | test derives figures from fixtures, never from the review |
| Fable F3, F8 | sibling repo | Deferred to Phase 5; this module flags, does not fix | — |
| Recon Rev 2 R5 | `0044`/`0046`, `WRAPPER_CONTRACT.md` | wrapper mirrors mock (equality, null-PBM drop); divergences D3–D5 recorded | BIM-005 contract note |
| Director money rules 1–7 | `RRM_DIRECTOR_DECISIONS.md` | binding for the audit | no brand/generic authority, no rates, no effective dates supplied |
| Ledger E-03 | nullable `pbm` governs | premise for the disclosure | v1.3/v1.4 contracts not located; behavior ruled |

## Approved work and boundaries

**Accepted:**
(a) **Disclosure (D3, R-015).** On the Summary tab only, a single footer element when `gap ≥ 0.01`, where `K = getKpis(filters).commercial_underpaid`, `S = Σ getSummary(filters)[i].commercial_dollars`, `gap = round2(K − S)` using the service's existing `round2`/`usd` helpers, both aggregates requested for the **same** `filters` snapshot. Text: **"$X in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown."** No count. Hidden on gap < 0.01 (incl. 0 and negative), on pending, rejected or superseded results, and on every other tab.
(b) **Fixture/copy audit (R-020).** Plan Mode produces a report-only table against rules 1–7 (see P1 §3). The Director rules each row into the campaign ledger errata lane (next free `E-NN`, verified on disk) and the spec's erratum lane. Only ruled corrections are applied. No money value recomputed by the Engineer. Flag-only items get owner + gate.

**Preserved behavior / invariants:** `OwedBookService` interface and `getKpis`/`getSummary` bodies byte-identical (they mirror certified wrappers `0044`/`0046`) · page-local sort · `cancelled`-flag pattern on read effects · Report control byte-identical (D5) · `owedbook.test.ts` unmodified incl. `:23` equality and `:12` seven-PBM pin · KPI tiles, filter rail, context untouched · adminDemo and Admin Portal byte-identical · all auth paths byte-identical.

**Allowed files / surfaces:** `src/components/owedbook/OwedBookScreen.tsx` (footer only) · a new presentational component under `src/components/owedbook/` if the Engineer prefers (e.g. `SummaryUnattributedNote.tsx`) · `src/components/owedbook/format.ts` only if a formatter is missing (report first) · `src/mocks/owedbook.ts` and copy strings **only** for corrections carrying an erratum row · new tests under `src/__tests__/owedbook/` · root-protocol files per root `CLAUDE.md` (session log, `CHANGELOG.md`, `agent_docs/RESPONSES/`) · this pack's `EXECUTION_LOG.md`, `QA_HANDOFF.md`, `evidence/**` · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §0 status line and `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` resolution rows (docs-only steps when instructed).

**Forbidden:** any edit to `src/services/**`, `src/types/**`, `columns.tsx`, `KpiTiles.tsx`, `FilterRail.tsx`, `OwedBookContext.tsx`, `src/components/common/**`, `supabase/**`, `scripts/**`, `package.json`/lockfile, `next.config.js`, auth paths · any new formula, service method, wrapper change, Unattributed bucket, aggregate KPI redefinition · any fixture money value changed without an erratum row · any relocation of existing money math · touching protected paths.

**Business decisions resolved:** D3; rules 1–7; E-03 (nullable `pbm`). **Ruled during this module:** the audit rows (Director, after P1). **Open, not blocking (owners in map §10):** negative-owed display · brand/generic authority · reversals/partial fills · U&C · aggregate KPI semantics · rounding law.

**Permitted tooling / environment:** local `node_modules`; tsc/eslint/jest; `next build` with placeholder env for the board (no serve required by this module). No `npm install`. No live Supabase call in engineering. Browser check of the footer is QA's (authenticated; QA Lead decides project and method — Playwright per the RRM-001 lesson if the QA Lead adopts it; Director supplies browser-only credentials).

**Restoration:** placeholder env scoped per command; `.env.local` untouched; `.next/` gitignored.

## Stages

| Stage | Objective | Allowed work | Checks | Stop condition |
|---|---|---|---|---|
| **S0 Plan Mode** (P1) | Baseline identity; disclosure design (same-filters pairing, staleness, precision premise); **audit table** (report only); contradictions | Read-only; plan to `agent_docs/RESPONSES/` | none | Director approves plan **and** rules every audit row (erratum rows on disk) before S1 |
| **S1 Disclosure** | R-015 · AC-101–106 | `OwedBookScreen.tsx` (+ optional note component); tests | tsc · eslint · jest (zero skipped) · build blank + placeholder env · `git diff --stat <baseline> -- src/services src/types src/components/owedbook/columns.tsx` empty | any need for a new formula, service change or fixture edit → stop |
| **S2 Audit corrections** | R-020 · AC-201–204 | only fixture/copy edits with a ruled erratum ID; `evidence/FIXTURE_AUDIT.md` finalized with flag-only items | tsc · eslint · jest · `git diff <baseline> -- src/mocks/owedbook.ts` hunk-by-hunk ↔ erratum IDs · existing `owedbook.test.ts` unmodified and green | a ruled correction breaks an existing test → stop and report (the Director rules whether the test or the fixture is wrong; no silent test edit) |
| **P3 Handoff** | all ACs claimed | `EXECUTION_LOG.md` complete; `QA_HANDOFF.md`; `evidence/repair.diff`, `changed_files.txt`; `QA/GOVERNING/` copied from RRM-001's snapshot with updated `PROVENANCE.md` | full board recorded | — |

S1 before S2 so the disclosure is tested against unmodified fixtures first; if S2 changes fixture values, the derived-expected test in S1 must still pass (it derives, never hard-codes).

## Handoff and exit

Engineer delivers candidate SHA, repair diff, execution log, unchanged acceptance spec and evidence. Director cuts `qa/phase-3-rrm002`. QA Lead plans, QA Executor executes (incl. the authenticated Summary-tab check at desktop and 375px), repairs on the QA line, QA Lead issues Gate Q, bounded cleanup, Architect closeout prompt, Engineer closeout, Director `--no-ff` merge + push, journal entries. Deployment/Gate D: outside this module.
