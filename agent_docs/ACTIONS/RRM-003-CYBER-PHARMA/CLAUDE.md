# RRM-003-CYBER-PHARMA — Access, Cache, Hygiene, Docs — Engineer Front Door

**Status:** Director-approved scope (ledger R-006, R-010, R-013, R-014/R-017 docs only, R-018 README; carried OBS-1, OBS-2 and the docs pass from RRM-001 A-06; D5 Report control untouched). **Controlled one-shot Engineering pilot** per the QA Lead's field note of 2026-09-28. Executable after DA-1 (branch from post-RRM-002 `main`), DA-2 (pack committed), DA-3 (clean tree), a green `ENVIRONMENT_PREFLIGHT.md`, and Director approval of the Plan Mode output with any rulings on disk.
**Seats:** Architect · Engineer · QA Lead · QA Executor · Director. Positions, not names.
**Repo:** `cyber-pharma-dev-v1-phase-3` · **Code baseline:** post-RRM-002 `main` — the `--no-ff` merge commit of `qa/phase-3-rrm002`. The Engineer records its full SHA at P1; every "diff vs baseline" in this pack means that commit.
**Engineering branch:** `phase-3-rrm003` · **QA branch (Director-cut after handoff):** `qa/phase-3-rrm003`
**Pack folder:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/` · **Campaign:** `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §6

## Mission

Four small repairs that share one proof style (a keyboard walk, a header capture, a grep, a diff) and one rollback story (revert the branch). Together they close the last review findings before the dependency bump.

1. **Keyboard and focus.** Sortable table headers work from the keyboard. The mobile filter drawer moves focus in, keeps it in, and returns it on close. The PBM picker does the same, and a nested Escape closes the picker before the drawer. The Phase-2 UI spec already required all of this.
2. **Cache header.** The global `no-store` header stops applying to hashed static bundles. Measured on a served asset, not inferred.
3. **Hygiene.** Debug strings out of the 404 pages, stray `console.log` gone, one orphaned component deleted, README test counts made true.
4. **Docs quarantine.** Nobody can follow an old setup document into the unsafe signup trigger. Three legacy SQL files get a SUPERSEDED banner, `DATABASE_SETUP.md` stops pointing at the unsafe migration, `DB_BASELINE.md` records what is actually installed, and the leftover signup prose from RRM-001 gets cleaned up.

What this module does **not** do: change sort semantics (Phase 5c) · touch the Report control (D5) · touch the shadcn primitives' APIs · touch any auth path, service, type, fixture, migration or dependency (RRM-004 owns dependencies) · apply anything to a database.

## How this run works (the pilot)

- **P1 Plan Mode** is unchanged: read-only, contradictions surfaced, Director rules, rulings land on disk. This stop stays because it caught real pack errors in both previous modules.
- **P2 is one continuous session.** After the plan is approved you receive one prompt covering every stage. You run `ENVIRONMENT_PREFLIGHT.md` first and stop if it fails. Then you move through S1 → S2 → S3 on your own: each stage ends with its checks green and its evidence written to `evidence/` **before** the next stage begins. At the end you assemble the QA handoff in the same session and return one selective staging block. The Director commits once.
- **You stop only on an enumerated stop condition** (below). Not on nervousness, not on a judgment call you can make inside the allowed files. If you are unsure whether something is a stop condition, it is — stop and report.
- **Metrics** go in `EXECUTION_LOG.md` §Metrics: timestamps per stage, checks run, self-repairs, and the count of Director touches (zero expected between P2 start and the staging block).

## Enumerated stop conditions (P2)

1. Any `ENVIRONMENT_PREFLIGHT.md` check fails.
2. Any edit is needed outside the allowed files in `RRM_BRIEF.md`.
3. An existing test fails after your change and the only fix would be to modify that test.
4. The cache-header fix cannot be achieved inside `next.config.js` alone.
5. A keyboard/focus fix would require touching `src/components/owedbook/columns.tsx`, `src/app/(admin)/**`, or the exported API of any `src/components/ui/*` primitive.
6. The board (tsc / eslint errors / jest / build) is still red after two in-scope self-repair attempts on the same failure.
7. Disk and contract disagree on a point not already covered by `RULINGS_ADDENDUM.md`.
8. Anything would require a live database, dashboard, credential, or Git mutation.

On a stop: write what you have to `EXECUTION_LOG.md`, save evidence, report the stop with its number and the exact path:line, and wait.

## Read in order

1. Root `CLAUDE.md` (its protocol wins over this pack where they collide)
2. `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §2, §6, §8, §10
3. `AUTHORITY_POINTER.md` · `ENVIRONMENT_PREFLIGHT.md` · `DIRECTOR_CHECKPOINTS.md`
4. `RRM_BRIEF.md` · `ACCEPTANCE_SPEC.md` · `CLAUDY_PROMPTS.md`
5. Evidence inputs: `agent_docs/RECON/RRM001_RECON_2026-09-18.md` R2 (accessibility, next.config, debug strings), R3 (header capture), R4 (SQL legacy files), R7 (Playwright, README counts), R8 (UI_SPEC §8 on disk); `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` OBS-1, OBS-2, A-06; `agent_docs/ASTRA_CODE_REVIEW.md` A-005; `agent_docs/FABLE_CODE_REVIEW.md` F6, F10, F13

## Rules of the road

- Read-only Git. Mutating Git, dashboard, live database: Director.
- Placeholder Supabase env only for any build or serve; never real keys in the shell; `.env.local` untouched; temp-then-move for any redirect into a tracked file; stop any local server you start and prove the port is free.
- `EXECUTION_LOG.md` as you go, per stage. `QA_HANDOFF.md` at the end of P2. You do not certify QA. During QA you act only on an approved repair instruction on `qa/phase-3-rrm003`.
- Full file paths. YOU / ENGINEER / QA LEAD labels. Selective staging blocks, one git command per line.

## Preserved (byte-identical or test-green at handoff)

`src/components/owedbook/columns.tsx` (D5) · `src/components/owedbook/OwedBookScreen.tsx` sort block (page-local sort stays) · `src/components/owedbook/SummaryUnattributedNote.tsx` · `src/services/**` · `src/types/**` · `src/mocks/**` · `src/app/(admin)/**` except the one-line `not-found.tsx` string · all auth paths (`src/proxy.ts`, `src/utils/supabase/**`, `src/app/api/auth/**`, `src/app/(auth)/**`, `src/app/profile/**`) · `src/components/ui/*` exported APIs · `supabase/migrations/**` · `scripts/**` · `package.json` / lockfile · `next.config.js` except the `headers()` source pattern · every existing test file.

## Protected (never touch)

`RECOVERY.md` until P5 · `agent_docs/SESSIONS/**` beyond your own session log · closed module folders under `agent_docs/ACTIONS/` · `.env.local` · `supabase/migrations/0001_baseline_acknowledge.sql`.
