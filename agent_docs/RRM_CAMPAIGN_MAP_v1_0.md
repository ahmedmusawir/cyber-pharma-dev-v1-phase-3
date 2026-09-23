# RRM CAMPAIGN MAP — FFM REVIEW REWORK (v1.0)
## The Packet Spine: Module Decomposition, Gates, and Acceptance Seeds

**Project:** Cyber Pharma v1 · **Phase:** 3 — inserted campaign, Engine 2 (review and improvement of the completed FFM surface) · **Repo:** `cyber-pharma-dev-v1-phase-3`
**Version:** 1.0 — 2026-09-20 · **Author:** Fable (Architect) · **Gate:** Tony (Director) approval before each pack executes
**Doctrine:** RRM_PLAYBOOK v0.1 (HQ pilot) + BIM lifecycle as practiced BIM-000…003 · QA per project QA playbook · Sol engaged at every Gate Q · Web Factory J-11/J-19 (forward-only `qa/` line, bounded cleanup)
**Campaign baseline:** `main` @ `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` (post BIM-003 merge `f7a1d4c`; recon Rev 2 basis)
**Inputs of record:** `agent_docs/FABLE_CODE_REVIEW.md` (13 findings) · `agent_docs/ASTRA_CODE_REVIEW.md` (8 findings) · `agent_docs/RECON/RRM001_RECON_2026-09-18.md` · Director rulings D1–D7 + seven money rules (`RRM_DIRECTOR_DECISIONS.md`) · `RRM_FINDINGS_DISPOSITION_LEDGER.md`
**Exit gate of the campaign:** every ACCEPT row in the ledger has certified resolution evidence; every removed entry point is proven unreachable; the board is green on the upgraded dependency set; BIM-004 begins from post-RRM `main`.

**Placement:** this map lives beside `PHASE_3_BIM_CAMPAIGN_MAP.md` (Director stages it to the doc repo). The journal, ledger and decisions live in `agent_docs/` on `main` beside `PHASE_3_CAMPAIGN_JOURNAL.md`. Module packs live only in `agent_docs/ACTIONS/RRM-00N-CYBER-PHARMA/`.

---

## 0. Campaign status

**Status at v1.0 (2026-09-20).** Intake CLOSED (reviews reconciled, recon Rev 2, D1–D7 ruled). **RRM-001 pack AUTHORED — NEXT.** RRM-002/003/004 queued; each pack authored after its predecessor merges (verify-then-write, BIM-003 lesson). BIM-004 remains next in the backend campaign after RRM-004 closes (J-02: sequencing, not dependency).

**Status at v1.0.1 (2026-09-22).** RRM-001 CLOSED — Gate Q PASS, zero rework rounds (QA Lead 2026-09-22). **RRM-002 pack authoring NEXT.** Merge of `qa/phase-3-rrm001` → `main` and the merge SHA: Director.

Scoreboard (Director fills at each close): RRM-001 `CLOSED — Gate Q PASS 2026-09-22 @ cad164d (evidence 9ab95e5); merge SHA: Director` · RRM-002 `—` · RRM-003 `—` · RRM-004 `—`.

---

## 1. Why a campaign, and why this decomposition

Two independent reviews of the frontend-first build were reconciled against current disk and ruled by the Director. The accepted scope splits along four lines that each need a different kind of proof and a different rollback story: **removal** (security by deletion, proven by unreachability), **ledger truth** (money display and fixture audit, proven by reconciliation tests and Director errata), **access/cache/hygiene** (proven by keyboard walk and header capture), and **dependencies** (proven by advisory clearance and a full board rerun, isolated so it rolls back alone). One module each. Sequential, each certified and merged before the next branches from `main`.

Not in this campaign: BIM-004 (seed), BIM-005 (service swap), the permanent signup-trigger correction (backend, BIM-004 rider), deployment (waived), MissionControl (separate repo).

---

## 2. Lifecycle (identical to BIM practice)

`main → phase-3-rrm00N → qa/phase-3-rrm00N → main`

Architect authors the pack (CLAUDE.md, RRM_BRIEF, ACCEPTANCE_SPEC with empty erratum lane, CLAUDY_PROMPTS, AUTHORITY_POINTER, QA/, evidence/) → Director approves → Claudy Plan Mode → Director rules erratum rows → Claudy builds in stages, each ending green/reported/committed by the Director → Claudy hands **EXECUTION_LOG + ACCEPTANCE_SPEC + QA_HANDOFF** to SOL → Director cuts `qa/phase-3-rrm00N` from the committed candidate → SOL plans, Cody executes, repairs on the QA line, Cody re-pins, SOL certifies Gate Q → bounded QA Cleanup → Architect closeout prompt → Claudy closeout → Director `--no-ff` merge + push → journal entries (Architect + Sol) → next pack.

Director retains Git, credentials, dashboard and destructive authority. `RECOVERY.md` and `agent_docs/SESSIONS/**` are Director-protected. Contract layer frozen at handoff; amendments append to the module's `RULINGS_ADDENDUM.md` / errata lane.

---

## 3. Module decomposition

| Module | Mission (one line) | Ledger rows | Weight | Depends on |
|---|---|---|---|---|
| **RRM-001-CYBER-PHARMA** — Removal | Public signup and Moose portal deleted; privileged entry points proven unreachable; auth for existing users untouched | R-001, R-002, R-011 (N/A by removal), R-012 | medium | campaign baseline |
| **RRM-002-CYBER-PHARMA** — Ledger truth | Summary discloses underpaid dollars with no PBM; fixtures and copy audited against the seven money rules, corrected only by Director erratum | R-015, R-020 (flags for R-003, R-008) | medium (Director-heavy: audit rulings) | RRM-001 merged |
| **RRM-003-CYBER-PHARMA** — Access, cache, hygiene, docs | Keyboard-operable sort/drawer/picker; cache header off static assets; debug residue gone; obsolete SQL docs quarantined; trigger fact recorded | R-006, R-010, R-013, R-014 (docs only), R-017 (docs only), R-018 (README) | medium | RRM-002 merged |
| **RRM-004-CYBER-PHARMA** — Dependencies | Next/sharp past the advisories, libheif verified on the installed package, Cloudinary per real sources, full board rerun | R-009 | light-medium, high blast radius | RRM-003 merged |

Deferred by Director ruling (not modules here): R-003 Owed KPI aggregate → Phase 5 · R-004 global sort → Phase 5c · R-008 federal sign/rounding → Phase 5 · R-016 component invalidation/error states → BIM-005 authoring · R-019 tenant/upload/report/billing seams → existing gates · Unattributed PBM bucket → Phase 5 · signup-trigger correction → BIM-004 pre-flight rider (CE-2).

---

## 4. RRM-001-CYBER-PHARMA — Removal

**Mission:** the two starter-kit tools are gone, not guarded. Security objective = the privileged Server Actions and the public signup endpoint no longer exist and cannot be reached by old URL, flag state, or direct action invocation.

**Scope:** delete `src/app/moose-portal/**` (routes, layout, pages, `users/actions.ts`, `_lib/admin.ts`, components) · delete `src/app/api/auth/signup/**`, `src/components/auth/RegisterForm.tsx`, signup-only components/tests · `/auth` becomes login-only (no register tab/form/link) · remove `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` wiring (`Navbar.tsx:49`, `.env.example`) · remove `GET /api/auth/login` `posts` probe (R-002) · admin-client reconciliation (R-012, E-04): Moose copy deleted, `src/utils/supabase/admin.ts` retained as the single blessed service-role factory with zero app importers and an updated header · one-line "removed in RRM-001" notes in README/governing docs that still direct a reader to either tool.

**Preserved:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/confirm`, `src/proxy.ts`, `src/utils/supabase/middleware.ts`, `protectPage`, `(auth)` layout, profile password update, Navbar Law/FIX-001 state, `src/app/(admin)/**`, adminDemo service + mocks, OwedBook untouched.

**Exit gate:** on a running build with the flag exported `true` **and** unset, every old Moose URL and `POST /api/auth/signup` return 404; a fresh `.next/server` contains none of the removed action names; grep sweeps for moose/signup/register in `src/`, `README.md`, `docs/`, `.env.example` are empty; existing admin and member log in, land on `/owedbook`, reach `/admin-portal` (admin) and `/profile`, log out — desktop and 375px, both themes (Gate M).

**AC seeds:** AC1 `src/app/moose-portal/` absent · AC2 route table has no `/moose-portal*`, no `api/auth/signup`; 404 matrix in both flag states · AC3 `grep -rln "getUserById\|addMember\|deleteUser" .next/server/` = 0 after fresh build · AC4 flag has zero consumers; removed from `.env.example`; `instrumentation.ts` unchanged · AC5 `_lib/admin.ts` gone; `utils/supabase/admin.ts` retained, zero importers, header cites E-04 · AC6 `/auth` login-only; `grep -rniE "sign ?up|register|create (an )?account" src/` = 0 (listed exceptions only) · AC7 `GET /api/auth/login` removed; no `posts` reference · AC8 preserved-path diff vs baseline empty (`proxy.ts`, `middleware.ts`, `src/app/(admin)/**`, `src/services/adminDemo.ts`, `src/mocks/adminDemo.ts`, `src/services/owedbook.ts`, `src/components/owedbook/**`) · AC9 `Navbar.invariant`, `InviteMemberForm`, `actions` (protectPage), `proxy`, `MobileNav`, `UserMenu` suites pass unmodified · AC10 board green (tsc 0 / eslint 0 errors / jest all pass zero skipped / build exit 0 blank-env and placeholder-env) · AC11 One-Walk login/logout journey (QA, real auth on an authorized project).

**Distinct evidence items (none proves the others):** (1) application removal — this module; (2) Supabase "Allow new users to sign up" off — Director containment DA-2, recorded in `RRM-001/evidence/DA-2_*.md`; (3) permanent `handle_new_user` correction — BIM-004 rider (CE-2), **not** this module.

**Dependencies:** DA-1 branch rename, DA-3/DA-4 clean tree. **Est. weight:** medium (deletion is easy; proving unreachability and preserving auth is the work).

---

## 5. RRM-002-CYBER-PHARMA — Ledger truth

**Mission:** the Summary tab tells the truth about underpaid dollars that have no PBM yet, and the mock world stops contradicting the Director's locked money rules — without a frontend pricing engine and without moving the mock out of step with the certified wrappers.

**Scope:** (a) **Disclosure (D3, R-015):** footer on the Summary tab when `gap = round2(K − S) ≥ 0.01`, where `K = getKpis(filters).commercial_underpaid` and `S = Σ getSummary(filters)[i].commercial_dollars` over the **same** filters snapshot; text "$X in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown."; no footer on gap < 0.01 (incl. 0 and negative), on pending, rejected or stale results, or on other tabs; no count; `getKpis`/`getSummary`/interface byte-identical. (b) **Fixture/copy audit (R-020):** Plan Mode produces a report-only table against rules 1–7 (every `11.85`/`10.64`; rows satisfying `expected = qty × medicaid_rate + 10.64` counted, not fixed; `method` values vs vocabulary; negative-owed rows and `posNeg`; `federal_expected = aac × qty` with no fee; any PBM-key/repricing copy). Director rules each row into the erratum lane; Claudy applies **only** ruled corrections; no money value recomputed; flag-only items recorded with owners/gates (R-003, R-008 → Phase 5; brand/generic → Frank rider).

**Preserved:** `OwedBookService` interface, `getKpis`/`getSummary` bodies (they mirror certified wrappers `0044`/`0046`), page-local sort, cancellation flags, Report control (D5), `owedbook.test.ts:23` equality assertion.

**Exit gate:** footer tests pass with the expected X **derived** in the test from fixtures (sum of positive `owed` where `pbm === null`), never a literal; zero/negative/named-only/rejected/stale cases render no footer; every fixture or copy hunk in the diff has an erratum ID; `git diff -- src/services/owedbook.ts` vs baseline empty; board green.

**AC seeds:** AC1 footer present/absent matrix (unfiltered, null-only date filter, named-only, gap 0, gap −0.004, rejected KPI, stale summary via deferred promise, loading) · AC2 `data-testid="summary-unattributed-note"` only on Summary tab · AC3 service and interface diff empty · AC4 `grep -rn "11\.85" src/ docs/ README.md` = 0 · AC5 every `src/mocks/owedbook.ts` hunk ↔ erratum row · AC6 `evidence/FIXTURE_AUDIT.md` lists flag-only items with owner/gate · AC7 board green · AC8 browser check of footer at desktop/375px (QA).

**Dependencies:** RRM-001 merged. **Est. weight:** medium; Director time is the audit rulings, one sitting.

---

## 6. RRM-003-CYBER-PHARMA — Access, cache, hygiene, docs

**Mission:** every OwedBook control works from the keyboard as the Phase-2 contract already required; the cache header stops throwing away immutable bundles; starter-kit residue is gone; nobody can follow an obsolete SQL setup doc into the unsafe trigger.

**Scope:** (a) **Keyboard/focus (R-010, A-005, UI_SPEC v1.0 §8):** sortable headers focusable, Enter/Space sort, `aria-sort` truthful; filter drawer moves focus in, traps (`inert` or equivalent), Escape closes, focus returns to trigger; MultiSelect focus-in/contained/return, nested Escape closes picker before drawer. (b) **Cache header (R-006):** `next.config.js` `headers()` no longer matches `/_next/static/*`; measured on a served asset before/after. (c) **Hygiene (R-013, R-018):** not-found debug strings removed (both files, one-line edit permitted in `(admin)`); `console.log` sweep; README/TESTING counts match the final jest run. (d) **Docs (R-014, R-017):** `docs/DATABASE_SETUP.md` no longer points at `migration_add_profiles.sql`; `docs/setup.sql`, `supabase/setup.sql`, `docs/migration_add_profiles.sql` carry a SUPERSEDED banner (or relocate to `docs/legacy/` by erratum); `agent_docs/DB_BASELINE.md` gains the dated "installed `handle_new_user` — confirmed 2026-09-20" section (metadata role, `full_name`; containment DA-2; correction = BIM-004 rider; nothing claimed applied).

**Preserved:** `src/components/owedbook/columns.tsx` byte-identical (D5); `src/app/(admin)/**` except the not-found string; sort semantics; `supabase/migrations/**` untouched.

**Exit gate:** QA keyboard walk at desktop and 375px (Tab order, Enter/Space sort, drawer trap and return, picker trap and return); `curl -sI /_next/static/chunks/<x>.js` shows `immutable`/`max-age=31536000` and no `no-store`, while `/` still shows `no-store`; greps clean; banners present; board green.

**AC seeds:** AC1–AC3 keyboard/focus per control with tests · AC4 `columns.tsx` diff empty · AC5 header capture pair · AC6 debug strings/console sweep · AC7 README counts = jest · AC8 SQL doc quarantine · AC9 DB_BASELINE section · AC10 board green · AC11 QA walk.

**Dependencies:** RRM-002 merged. **Est. weight:** medium.

---

## 7. RRM-004-CYBER-PHARMA — Dependencies

**Mission:** the installed image-processing stack no longer matches published critical/high advisories, remote image sources are exactly what the app uses, and the whole board is green on the new set.

**Scope:** pin `next` ≥ 16.3.3 and the `sharp` override ≥ 0.35.4 to exact versions verified against the registry at implementation time; `npm install`; record installed `@img/sharp-libvips-*` versions and **how** libheif ≥ 1.23.2 was verified (installed package metadata or the advisory's fixed-version statement — attack the instrument); `npm audit` zero critical/high on next/sharp/@img, remaining advisories listed by ID and not fixed here; Cloudinary `images.remotePatterns` removed if the Plan Mode scan of `src/`, `public/`, `src/mocks/`, `README.md`, `docs/`, `next.config.js` finds no runtime source, else narrowed to exact host + path prefix; list every incidental lockfile move; `images.unoptimized` not introduced without erratum.

**Preserved:** everything — this module changes config and lockfile only. Any product-code change forced by the upgrade is a stop-and-report.

**Exit gate:** `npm ls next sharp` at target; audit clean for the named packages; blank-env and placeholder-env builds exit 0 with recorded route count; tsc 0; eslint 0 errors; jest all pass; header capture pair repeated (RRM-003's fix survives); every image that rendered at baseline still renders on `/`, `/auth`, `/owedbook`, `/admin-portal` (QA walk).

**AC seeds:** AC1 versions · AC2 libheif verification method recorded · AC3 audit summary · AC4 Cloudinary ruling applied · AC5 incidental moves listed · AC6 dual build · AC7 board · AC8 header pair · AC9 image walk.

**Dependencies:** RRM-003 merged. **Est. weight:** light-medium; isolated because it is the only module that can break everything at once.

---

## 8. Director runway (all YOU)

| ID | Action | When |
|---|---|---|
| DA-1 | `git branch -m phase-3-rrm-ffm phase-3-rrm001` then `git push -u origin phase-3-rrm001` (old remote branch can be deleted later, optional, non-destructive to work) | before RRM-001 Plan Mode |
| DA-2 | Supabase dev project → Authentication → email sign-in settings → **"Allow new users to sign up" OFF**. Verify with the read-only curl in `RRM-001/DIRECTOR_ACTIONS.md`; record redacted result in `RRM-001/evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md`. Containment only — not trigger repair. | today; does not block authoring |
| DA-3 | Place campaign docs + `ACTIONS/RRM-001-CYBER-PHARMA/` and commit (`20sep2026 - RRM campaign map/journal/ledger + RRM-001 pack`) | before Plan Mode |
| DA-4 | `git status --porcelain` empty before every "go" | every stage |
| DA-5 | Test users until BIM-004 seed: Supabase dashboard → Auth → Users → Add user (auto-confirm); trigger assigns member; promote via SQL editor `update public.user_roles set role='admin' where user_id='<uuid>'`; never use role-in-metadata as the mechanism | as needed |
| DA-6 | After each RRM's P3: `git checkout -b qa/phase-3-rrm00N && git push -u origin qa/phase-3-rrm00N`; authorize SCRATCH for SOL's real-auth walk if required | per module |
| DA-7 | After Gate Q + Cleanup + closeout: `--no-ff` merge with message, push; record implementation / evidence / closeout / merge SHAs separately; fill the scoreboard | per module |

---

## 9. Errata to `PHASE_3_BIM_CAMPAIGN_MAP.md` (Director stages; binding via D1/D2 now)

- **CE-1 — BIM-004 §6 test users:** the five seed identities are created by the seed script (service role, sanctioned exception) via the Auth admin API followed by **explicit** `user_roles`/`profiles` writes — never via `raw_user_meta_data.role`. Interim: DA-5. No public route, no Moose replacement.
- **CE-2 — BIM-004 pre-flight ruling 8, trigger correction:** installed `handle_new_user()` confirmed (Director, `pg_get_functiondef`, 2026-09-20) to assign role from signup metadata and read `full_name`; 0001–0047 do not replace it. BIM-004 authors a migration (next free number, verified on disk at authoring) redefining it with fixed `member` + `full_name`, SECURITY DEFINER, pinned `search_path`; applied and verified at APPLY SESSION (`pg_get_functiondef` + negative test: signup with `{"role":"admin"}` yields member). Legacy setup SQL files are quarantined by RRM-003 and are not inputs.
- **CE-3 — BIM-005 §7 AC2/AC5:** AC2 baseline = post-RRM-campaign `main`; AC5 = adminDemo byte-identical to post-RRM `main` **and** `/moose-portal` absent (route table + 404). Parity notes for the swap: Summary tiebreak, empty-string PBM, JS vs SQL rounding (recon R5 D3–D5). Carry R-016 (A-006): BIM-005 brief rules component invalidation and error states before real reads.
- **CE-4 — status line + carry-forward:** RRM campaign (RRM-001…004) inserted after BIM-003 CLOSED, before BIM-004 NEXT by Director priority; 8-phase plan §2 carried-forward "/moose-portal seeding tool" → removed (RRM-001); "KIP-2 stale-persist" → closed by FIX-001, regression-protected.

---

## 10. Deferred ledger (owners and gates)

| Item | Destination | Owner |
|---|---|---|
| Owed KPI aggregate semantics; `commercial_scripts` federal exclusion; legacy demo formula as candidate | Phase 5 parity harness (mock and wrapper move together) | Architect |
| Federal sign convention; one-cent rounding; rounding law | Phase 5, before validation week | Architect / Frank |
| Negative-owed / overpayment display | Phase 5 UI ruling | Director / Frank |
| Brand/generic authority · reversals/partial fills · U&C | Frank riders R3, R5, R4 / Golden Data | Coach → Frank |
| Unattributed PBM bucket (wrapper change) | Phase 5 | Architect |
| Global/server sort | Phase 5c | Architect |
| Component invalidation + error states before real reads (A-006) | BIM-005 authoring | Architect |
| Tenant scoping, upload validation, signed report URLs, billing seams | BIM-005 / Phase 5–7 (existing gates) | Architect |
| Playwright config/specs (installed, unused) | QA doctrine / Phase 8 | SOL |
| Permanent `handle_new_user` correction | BIM-004 rider (CE-2), APPLY SESSION verify | Architect / Director |

---

## 11. Version history

| Ver | Date | Change |
|---|---|---|
| 1.0 | 2026-09-20 | Initial map: four-module decomposition from ruled ledger; lifecycle mirrors BIM practice; Director runway; Phase 3 map errata CE-1…4; deferred ledger. |
| 1.0.1 | 2026-09-22 | §0 status only; §3 'candidate future triggers' language superseded by Director ruling 2026-09-21 (no further reviews until all phases complete) |
