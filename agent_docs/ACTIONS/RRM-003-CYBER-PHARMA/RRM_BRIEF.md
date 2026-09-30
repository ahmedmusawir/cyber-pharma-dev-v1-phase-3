# RRM-003-CYBER-PHARMA — Access, Cache, Hygiene, Docs — Brief

**Version:** 1.0 · 2026-09-28 · **Architect** authored · **Director approval:** campaign map §6 (2026-09-20) + carried items from RRM-001 (OBS-1, OBS-2, A-06) · **Pilot:** controlled one-shot Engineering run per the QA Lead's field note (2026-09-28)
**Code baseline:** post-RRM-002 `main` (RRM-002 merge commit; SHA recorded at P1) · **Branch:** `phase-3-rrm003` · **Ledger rows:** R-006, R-010 (accept); R-013, R-018 README (accept); R-014, R-017 (docs quarantine only); R-010b (Report control: retain, D5)

## Why this module exists

Three of the four items are the last "current defect" findings both reviewers agreed on: mouse-only sort headers and untrapped modals (a Phase-2 contract the code never met), a cache header that throws away immutable bundles on every reload (now measured, not inferred), and starter-kit residue. The fourth closes a documentation trap: three legacy SQL files and one setup doc still describe two schema lineages, one of which installs the trigger that trusts signup metadata for role. This module quarantines the docs; the permanent trigger fix stays with BIM-004 (CE-2).

It is also the pilot for one-shot Engineering: one plan stop, one continuous build, one commit.

## Inputs and reconciliation

| Input | Specimen | Status |
|---|---|---|
| Astra A-005 · Fable F10 (headers) | export / sibling repo | re-verified on disk (recon R2); requirement on disk `agent_docs/PHASE_2.1/UI_SPEC.md:132-134` |
| Fable F6 | sibling repo | **measured** on served asset (recon R3): `/_next/static/chunks/*.js` returns `no-store` |
| Fable F13 · R-018 README drift | sibling repo / recon | debug strings at `src/app/not-found.tsx:14`, `src/app/(admin)/not-found.tsx:14`; README badge stale |
| Astra A-002/A-008 (docs half) | export | legacy files present (recon R4); installed trigger confirmed by Director 2026-09-20; migrations 0001–0047 do not replace it |
| RRM-001 OBS-1 | Engineer S1 | `src/utils/supabase/actions.ts` is `"use server"`, so `protectPage` is a registered Server Action — disposition in this module (Plan Mode reports; Architect rules) |
| RRM-001 OBS-2 | Engineer S2 | orphans: `src/components/common/PaginationControls.tsx` (zero consumers), `TabsContent` export in `src/components/ui/tabs.tsx` |
| RRM-001 A-06 | Director | remaining signup prose in `docs/ARCHITECTURE.md`, `docs/AUTHORIZATION.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHENTICATION.md` → this module's docs pass |

## Approved work and boundaries

**Accepted:**
- **S1 Keyboard/focus (R-010):** `src/components/common/DataTable.tsx` — each sortable header exposes a focusable control (a `<button>` inside the `<th>`, or `tabIndex=0` + `role="button"` on the `<th>`), Enter and Space toggle sort exactly as click does, `aria-sort` truthful, non-sortable headers not focusable, mobile card mode unchanged. `src/components/layout/AuthedShell.tsx` drawer — on open, focus moves to the first focusable element inside; Tab/Shift-Tab contained (`inert` on the page behind, or an equivalent guard); Escape closes; on close, focus returns to the trigger; existing body-scroll lock kept. `src/components/common/MultiSelect.tsx` — opening moves focus to the search input; Tab/Shift-Tab contained in the panel; Escape closes and returns focus to the trigger; click-outside kept; nested inside the drawer, Escape closes only the picker first. New tests for each.
- **S2 Cache header (R-006):** `next.config.js` `headers()` source no longer matches `/_next/static/*` (a negative-lookahead source such as `/((?!_next/static|_next/image|icon.png).*)` or an equivalent the Engineer proves in Plan Mode). Measured before and after on a served asset.
- **S3 Hygiene + docs (R-013, R-018, OBS-2, R-014/R-017, A-06):** remove the "This is coming from" strings in both `not-found.tsx` files (the `(admin)` one is a one-line edit inside an otherwise-preserved group) · `console.log` sweep in `src/` excluding tests (delete, or list as an allowed exception with reason) · delete `src/components/common/PaginationControls.tsx` if zero consumers confirmed; leave `src/components/ui/tabs.tsx` intact (kit primitive) · `README.md` (and `TESTING.md` if it carries counts) set to the final jest numbers · `docs/DATABASE_SETUP.md` no longer directs any reader to `docs/migration_add_profiles.sql` and states the canonical schema is `supabase/migrations/` with the trigger correction owned by BIM-004 CE-2 · top-of-file banner on `docs/setup.sql`, `supabase/setup.sql`, `docs/migration_add_profiles.sql`: `-- SUPERSEDED (RRM-003, <date>): not the installed schema. Canonical chain: supabase/migrations/. Do not run. Trigger correction: see agent_docs/DB_BASELINE.md.` · `agent_docs/DB_BASELINE.md` gains a dated section "Installed `handle_new_user` — confirmed 2026-09-20": role from `raw_user_meta_data->>'role'` else member; name from `full_name`; containment = Supabase signup disabled (Director DA-2, status as of this module); permanent correction = backend migration (fixed member, `full_name`), BIM-004 pre-flight rider, verified at APPLY SESSION; nothing claimed applied · signup prose cleanup in the four docs listed above (state that public self-registration was removed in RRM-001; keep it short; never re-describe the removed flow as current).
- **OBS-1 disposition:** Plan Mode reports exactly what a direct caller of `protectPage` (and any other export of `src/utils/supabase/actions.ts`) can obtain. Architect default: if nothing beyond the caller's own identity or a redirect is reachable, **flag-only → Phase 8 hardening**, no change in this module (auth path preserved). If Plan Mode shows more, stop condition 7.

**Preserved behavior / invariants:** page-local sort and its click behavior (existing DataTable tests green unmodified) · drawer Apply behavior (`drawer-apply.integration.test.tsx` green unmodified) · MultiSelect selection and "All" handling · Report control byte-identical (D5) · Summary disclosure from RRM-002 byte-identical · `/`, `/auth`, `/owedbook`, `/admin-portal`, `/profile` still carry `no-store` on the HTML response · all auth paths byte-identical · `supabase/migrations/**` untouched · `src/components/ui/*` exported APIs unchanged.

**Allowed files:** `src/components/common/DataTable.tsx` · `src/components/common/MultiSelect.tsx` · `src/components/layout/AuthedShell.tsx` · `src/app/not-found.tsx` · `src/app/(admin)/not-found.tsx` (one line) · `src/components/common/PaginationControls.tsx` (delete) · any `src/` file only to delete a `console.log` line · `next.config.js` (headers source only) · `README.md`, `TESTING.md` (counts) · `docs/DATABASE_SETUP.md`, `docs/setup.sql`, `supabase/setup.sql`, `docs/migration_add_profiles.sql` (banner / pointer only), `docs/ARCHITECTURE.md`, `docs/AUTHORIZATION.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHENTICATION.md` (signup prose only) · `agent_docs/DB_BASELINE.md` (append) · new tests under `src/__tests__/common/` and `src/__tests__/layout/` · root-protocol files per root `CLAUDE.md` · this pack's `EXECUTION_LOG.md`, `QA_HANDOFF.md`, `evidence/**`, `QA/GOVERNING/**` (copy) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §0 and `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` resolution rows when instructed.

**Forbidden:** sort semantics or a sort parameter on the service · `columns.tsx` · `src/app/(admin)/**` beyond the one string · any `src/components/ui/*` API change · services, types, fixtures, migrations, scripts, dependencies · `next.config.js` beyond the `headers()` source · `images.*` · any database or dashboard action · any auth-path edit (OBS-1 is report-then-rule) · `RECOVERY.md` before P5.

**Permitted tooling / environment:** local `node_modules`; tsc/eslint/jest; `next build` + standalone `server.js` with placeholder env for header capture; no `npm install`; no live Supabase call; no browser required in engineering (jsdom tests only — the live keyboard walk is QA's).

## Stages (inside the single P2 session)

| Stage | Objective | Exit (all must hold before the next stage starts) | Evidence written |
|---|---|---|---|
| **S1 Keyboard/focus** | AC-101–106 | tsc 0 · eslint 0 errors · jest all pass zero skipped incl. new tests · existing DataTable/drawer/MultiSelect tests unmodified · `git diff <baseline> -- src/components/owedbook/columns.tsx src/components/ui` empty | `evidence/S1_diffs.txt` (component diffs + test list) |
| **S2 Cache header** | AC-201–203 | fresh build placeholder env exit 0 · served: `/` has `no-store`, `/_next/static/chunks/<x>.js` has `immutable` or `max-age=31536000` and no `no-store` · server stopped, port free | `evidence/S2_headers_before.txt` (from preflight), `evidence/S2_headers_after.txt` |
| **S3 Hygiene + docs** | AC-301–308 | greps clean · README counts = final jest · banners present · DB_BASELINE section present · `git diff <baseline> -- supabase/migrations` empty · full board rerun green (blank env + placeholder env builds) | `evidence/S3_greps.txt`, `evidence/S3_docs_diffs.txt` |
| **Handoff** (same session) | `QA_HANDOFF.md`, ledger rows, `changed_files.txt`, `repair.diff`, `QA/GOVERNING/` copy + `PROVENANCE.md`, `EXECUTION_LOG.md` §Metrics | one selective staging block, one git command per line | — |

Order is S1 → S2 → S3 because S3's README counts need the final test numbers and S3's board rerun is the last gate.

## Handoff and exit

Engineer delivers candidate (the Director's single commit), repair diff, execution log with metrics, unchanged acceptance spec and evidence. Director cuts `qa/phase-3-rrm003`. QA Lead plans, QA Executor executes (including the authenticated keyboard walk on SCRATCH at desktop and 375px, light and dark — agent-driven browser per the field note), repairs on the QA line, QA Lead issues Gate Q, bounded cleanup, Architect closeout, Engineer closeout, Director `--no-ff` merge + push, journal entries with the pilot metrics. Deployment / Gate D: outside this module.
