# RRM-002-CYBER-PHARMA — Ledger Truth — Engineer Front Door

**Status:** Director-approved scope (D3 disclosure; standing direction on the seven money rules; ledger R-015, R-020; flags for R-003, R-008). Executable after DA-1 (branch cut from post-RRM-001 `main`), DA-2 (pack committed), DA-3 (clean tree) and Director approval of the Plan Mode output **including the audit rulings**.
**Seats:** Architect · Engineer · QA Lead · QA Executor · Director. Seats are positions; the brain behind a seat may change without changing its authority.
**Repo:** `cyber-pharma-dev-v1-phase-3` · **Code baseline:** post-RRM-001 `main` — the `--no-ff` merge commit of `qa/phase-3-rrm001`. The Engineer records its full SHA at P1; every "diff vs baseline" in this pack means that commit. No literal SHA is written here on purpose (RRM-001 lesson A-01/A-02).
**Engineering branch:** `phase-3-rrm002` · **QA branch (Director-cut after P3):** `qa/phase-3-rrm002`
**Pack folder:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/` · **Campaign:** `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §5

## Mission

Two things, both about the ledger telling the truth without inventing math.

1. **Disclosure.** The Summary tab silently drops underpaid dollars on claims that have no PBM yet. Those claims are real (Frank's Ruling 5: unmatched claims sit in "Take Action" until a key is created). Add one footer line on the Summary tab that says how many dollars are missing from the breakdown — computed from two aggregates the service already returns, over the same filtered dataset, never from a new formula. Hidden when there is nothing to disclose, when results are pending, rejected, or stale.
2. **Fixture and copy audit.** Mock fixtures and screen wording are checked against the Director's seven locked money rules. In Plan Mode you **report**; the Director **rules** each row; you **apply only ruled corrections**. You never recompute a money value on your own. Conflicts you cannot resolve without a business decision are **flagged** with an owner and a gate, not fixed.

What this module does **not** do: change `getKpis`/`getSummary`, the service interface, or any certified wrapper; add an "Unattributed" bucket (Phase 5); change the aggregate Owed KPI definition (Phase 5); touch sort, keyboard, cache headers, docs quarantine or dependencies (RRM-003/004); touch the Report control (D5).

## Read in order

1. Root `CLAUDE.md` (its protocol — session log, `CHANGELOG.md`, `agent_docs/RESPONSES/` — wins over this pack where they collide; RRM-001 A-10)
2. `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §2, §5, §8, §10
3. `AUTHORITY_POINTER.md`
4. `RRM_BRIEF.md`
5. `ACCEPTANCE_SPEC.md`
6. `CLAUDY_PROMPTS.md`
7. Evidence inputs: `agent_docs/RECON/RRM001_RECON_2026-09-18.md` R2 (`services/owedbook.ts`), R5 (wrapper contracts, divergences D3–D5), R7 (`owedbook.test.ts` pins), R2-ADDENDUM (F8 counts); `agent_docs/ASTRA_CODE_REVIEW.md` A-004 and §8 "Financial decisions"; `agent_docs/FABLE_CODE_REVIEW.md` F3, F8; `agent_docs/RRM_DIRECTOR_DECISIONS.md` D3 + the seven money rules; `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/WRAPPER_CONTRACT.md`

Report contradictions before writing. Disk is the fact; the contract gets a `RULINGS_ADDENDUM.md` row.

## Rules of the road

- Plan Mode first (P1). The audit table in your plan is the Director's decision input; nothing in `src/mocks/` or copy moves until a ruled erratum row exists for that exact path:line.
- No money recomputation. If a fixture row's `expected` does not equal `qty × medicaid_rate + 10.64`, you report the row; you do not fix it unless ruled.
- No formula beyond `round2(K − S)` (defined in the spec). No new service method. No wrapper change.
- Read-only Git. Mutating Git, dashboard and live database: Director. GIT REMINDER at every stage end with a selective staging block (no `git add -A`).
- `EXECUTION_LOG.md` as you go; every fixture/copy hunk cites its erratum ID. `QA_HANDOFF.md` at completion (P3). You do not certify QA. During QA you act only on an approved repair instruction on `qa/phase-3-rrm002`.
- Placeholder Supabase env only if any build/serve is needed; never real keys in the shell; `.env.local` untouched; temp-then-move for any redirect into a tracked file.
- Full file paths. YOU / ENGINEER / QA LEAD labels. One terminal step per message when the Director must act.

## Preserved (byte-identical or test-green at handoff)

`src/services/owedbook.ts` (whole file) · `src/types/OwedBook.ts` · `src/components/owedbook/columns.tsx` (D5) · `src/components/owedbook/KpiTiles.tsx` · `src/components/owedbook/FilterRail.tsx` · `src/components/owedbook/OwedBookContext.tsx` · `src/components/common/**` · `src/app/(admin)/**` · `src/services/adminDemo.ts` · `src/mocks/adminDemo.ts` · all auth paths · `supabase/**` · `scripts/**` · `package.json` / lockfile · `next.config.js` · `src/__tests__/services/owedbook.test.ts` (unmodified; its `:23` equality assertion must still pass).

## Protected (never touch)

`RECOVERY.md` until P5 · `agent_docs/SESSIONS/**` beyond your own session log · `agent_docs/ACTIONS/BIM-*`, `FIX-001`, `PROTO06`, `RRM-001-CYBER-PHARMA` (closed history) · `.env.local`.
