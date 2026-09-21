# RRM-001-CYBER-PHARMA — Engineering Execution Log

Engineer: Claudy · Approved scope/plan: `RRM_BRIEF.md` v1.0 + `evidence/S0_PLAN.md` (Director-approved) · Start baseline: `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` · Branch: `phase-3-rrm001`

One section per stage and per QA repair round. Every grep AC lists allowed exceptions with path and reason, or "none".

## Stage S1 — Moose removal

Date/time: 2026-09-20 17:56–18:01 · Input SHA: `447463e0a190642bfcb020673852d5ef0bdedf57` (docs-only successor of `7b33756`, A-02; code diff vs `5f45fb3` empty; tree clean) · Approved: R-001, R-012 · AC-101–106 + AC-103b (A-11) · P2-S1
Approved plan of record: `agent_docs/RESPONSES/response_2026-09-20_155547_rrm001-s0-plan.md` (A-10 — not `evidence/S0_PLAN.md` as the header above says). Stage report: `agent_docs/RESPONSES/response_2026-09-20_180124_rrm001-s1-result.md`.

| File / surface | Change and reason | Ledger / AC | Preservation concern |
|---|---|---|---|
| `src/app/moose-portal/**` (14 files) | DELETED — routes, layout, pages, `users/actions.ts`, `_lib/admin.ts`, `_shell/*`, forms | R-001, R-012 · AC-101, AC-105 | no importer outside the tree (S0 §1a) |
| `src/components/global/Navbar.tsx` | removed 4 lines (`:48-51`): TODO comment + flag-gated nav link | AC-104, AC-303 | diff touches only the flag wiring; `NavbarHome`/`MobileNav`/`UserMenu` byte-identical |
| `.env.example` | removed flag comment + key + one blank line | AC-104 | 4 keys remain = `src/instrumentation.ts` REQUIRED_ENV |
| `src/utils/supabase/admin.ts` | header lines 1-4 → 9-line header citing ledger E-04; code untouched | R-012 · AC-105 | comment-only; still exports `createAdminClient`; tsc 0 |
| `src/app/(public)/loading.tsx` | comment word `(moose/admin)` → `(admin)` | AC-106 · A-05 | comment-only |
| `docs/ROUTES_AND_SURFACES.md` | route row removed; "Escape Hatch" section → one-line removal note; Cleanup Flags → "None open." | AC-106 · A-06 | — |
| `docs/PROJECT_OVERVIEW.md` · `docs/AUTHORIZATION.md` · `docs/DATABASE_SETUP.md:150` | pointer sentences → removal note (clause only in DATABASE_SETUP) | AC-106 · A-06 | DATABASE_SETUP otherwise left for RRM-003 |
| `README.md` · `agent_docs/KIP_REGISTRY.md` | one line each | AC-106 · A-06 | tool's name not used |
| `CHANGELOG.md` | one S1 entry | A-10 | — |

| Command/check | Environment | Exit/result | Evidence path |
|---|---|---|---|
| `npx tsc --noEmit` | local, after fresh build | **0 errors** (exit 0) | see Deviations 1 |
| `npx eslint .` | local | **0 errors / 35 warnings** (exit 0) | |
| `npx jest --ci` | local, mocks | **28 suites / 128 tests passed, skipped = 0** (exit 0); no test file modified, deleted or added | |
| `rm -rf .next && next build` placeholder env, flag=`true` (T) | local, no live Supabase | exit 0 · **18 routes** · no `/moose-portal*` | `evidence/S1_404_matrix.txt` |
| same, flag=`''` (U) | local | exit 0 · 18 routes · table identical to T | `evidence/S1_404_matrix.txt` |
| `rm -rf .next && next build` **blank** Supabase env | local | exit 0 · 18 routes · table identical | |
| `.next/server` action-name grep | fresh build U | **AC-103 GREEN per ruling A-12** (2026-09-20) — literal 0 not attainable, see O-1 below. `editUser` 0. `addMember` only in 6 adminDemo chunks (+maps). `getUserById`/`deleteUser` only as the Supabase SDK's `GoTrueAdminApi` method definitions in 5 chunks (+maps) | `evidence/S1_greps.txt` |
| compiled admin-API **call sites** `.auth.admin.*` / refs to `moose-portal/users/actions` | fresh build U | **0 / 0** | `evidence/S1_greps.txt` |
| 404 matrix rows 1-5, states T and U | standalone `server.js`, placeholder env, 127.0.0.1:36055 | 4× **404** + `/owedbook` **307 → /auth**, both states | `evidence/S1_404_matrix.txt` |
| AC-103b — 5 baseline action ids | baseline manifest → fresh builds T/U → `POST /` + `Next-Action` | captured 5 before deletion; **0 of 5 listed** after; 0 manifest entries reference the module; **5× 404** in T and U | `evidence/S1_action_ids.txt` |
| greps AC-103/104/105/106, AC-301, AC-303 | repo | see exceptions below; AC-104 0 · AC-105 0 · AC-301 diff empty · `src/__tests__` diff empty | `evidence/S1_greps.txt` |

Allowed grep exceptions:
- AC-103 `src/` (A-04): `src/services/adminDemo.ts:225` · `src/store/useAdminDemoStore.ts:17` · `src/store/useAdminDemoStore.ts:30` — the mock store's own `addMember`. No other hit.
- AC-103 `.next/server` `addMember` (A-04) — adminDemo chunks only (each also contains `inviteMember`; none contains `/admin/users`): `chunks/ssr/src_components_0m8ipp1._.js` · `…_0svqujc._.js` · `…_0vgeznr._.js` · `…_0wa-ekr._.js` · `…_1-6yw7x._.js` · `…_1p9shf1._.js` (+ their `.map`). Chunk names are build-specific.
- AC-106 (A-05): `src/app/(admin)/layout.tsx:20` — comment; AC-301 byte-identity wins. Only hit.

**O-1 — RULED: A-12 (Architect / Director, 2026-09-20) → AC-103 GREEN.** A-12 pass test for `.next/server`, all three met and already evidenced in `evidence/S1_greps.txt` + `evidence/S1_action_ids.txt` + `evidence/S1_404_matrix.txt`: (1) compiled `.auth.admin.` call sites = **0**; (2) references to `moose-portal/users/actions` = **0**; (3) AC-103b — five baseline action IDs absent from the manifest, each `Next-Action` POST → **404** in states T and U. `getUserById`/`deleteUser` appear only as SDK definitions in the five chunks listed below, each of which contains `/admin/users` (9×); `editUser` = literal **0**. No re-run was needed or made for this marking. Original finding, as raised: AC-103 / A-04 require `getUserById`/`deleteUser` literal zero in `.next/server`. Disk: 5 server chunks (+maps) contain them — `chunks/_0llx6m_._.js`, `chunks/[root-of-the-server]__1oht-x8._.js`, `chunks/ssr/_0b9thrh._.js`, `chunks/ssr/_0p0j8_e._.js`, `chunks/ssr/_1h8yg40._.js` — exactly one definition each, inside the bundled `@supabase/auth-js` `GoTrueAdminApi` class (`node_modules/@supabase/auth-js/dist/main/GoTrueAdminApi.js`). Library code, present in any build that creates a Supabase client, present at baseline. Not reachable Moose code: 0 compiled call sites, 0 references to the deleted module, manifest clean. Literal zero is unattainable without removing supabase-js. S0 did not catch this (S0 only dry-ran the `src/` grep).

Deviations:
1. `tsc` first ran **before** the fresh build and failed with 10 × TS2307, all inside stale generated `.next/types/validator.ts` + `.next/dev/types/validator.ts` (validators for the deleted routes). Zero source errors. After `rm -rf .next` + build, tsc = 0. Order for S2: build first, then tsc.
2. Server-process check in the matrix script first used `pgrep -f 'standalone/server.js'`, which matched the wrapper shell itself (false "1"). Pattern tightened; state T re-run; transcripts show 0 listeners / 0 processes.
3. Action ids are build-salted (see `evidence/S1_action_ids.txt` Limitation).

Observation (recorded as **OBS-1** in `RULINGS_ADDENDUM.md`; carried to RRM-003 authoring; no action in RRM-001): `src/utils/supabase/actions.ts` is a `"use server"` file, so `protectPage` is itself registered as a Server Action (the only manifest entry). Preserved path — untouched.
Orphans created, not removed (S0 §1g): `src/components/common/PaginationControls.tsx` (zero consumers; `common/**` preserved).

Env restoration: placeholder env scoped to each command (`https://placeholder.invalid` etc.); nothing exported; `.env.local` not read for values, not edited; no live Supabase call; server stopped, port 36055 free; `.next/` (gitignored) left as the blank-env build. Director checkpoint SHA: `9d5fe22` (S1 commit, observed on disk 2026-09-20)
GIT REMINDER — uncommitted paths: 14 deletions under `src/app/moose-portal/` · `src/components/global/Navbar.tsx` · `src/utils/supabase/admin.ts` · `src/app/(public)/loading.tsx` · `.env.example` · `README.md` · `docs/ROUTES_AND_SURFACES.md` · `docs/PROJECT_OVERVIEW.md` · `docs/AUTHORIZATION.md` · `docs/DATABASE_SETUP.md` · `agent_docs/KIP_REGISTRY.md` · `CHANGELOG.md` · this log · `evidence/S1_404_matrix.txt` · `evidence/S1_action_ids.txt` · `evidence/S1_greps.txt` · session log · stage report.

## Stage S2 — Signup removal + login probe

Date/time: 2026-09-20 18:21–18:25 · Input SHA: `7e2eaeb43c5e1fd1122d7d369f7bb0956d6fd460` (S1 + A-12 commit; tree clean; no code drift since `9d5fe22`) · Approved: D1, R-011 (by removal), R-002 · AC-201–205, AC-301–303, AC-401 · P2-S2 under A-03, A-06, A-08, A-09, A-10
Stage report: `agent_docs/RESPONSES/response_2026-09-20_182509_rrm001-s2-result.md`.

| File / surface | Change and reason | Ledger / AC | Preservation concern |
|---|---|---|---|
| `src/app/api/auth/signup/route.ts` (+ folder) | DELETED | D1 · AC-201 | sole caller was RegisterForm |
| `src/components/auth/RegisterForm.tsx` | DELETED | D1, R-011 · AC-202 | sole importer was AuthTabs |
| `src/components/auth/AuthTabs.tsx` | DELETED — single-tab wrapper (S0 §3) | AC-202 | sole importer was the `/auth` page; `src/components/ui/tabs.tsx` kept (OwedBookScreen) |
| `src/app/(auth)/auth/page.tsx` | renders `LoginForm` directly inside the same outer box (`w-[400px] mt-16` → `p-4 border-t border-border bg-card`); `Suspense` removed; `"use client"` kept | AC-202 | `src/components/auth/LoginForm.tsx` byte-identical; `?tab=register` is now an ignored param → 200, login page |
| `src/app/api/auth/login/route.ts` | removed baseline lines 10-28 (comment + `GET` + blank). 19 deletions, 0 additions | R-002 · AC-205 | **POST handler byte-identical** to `5f45fb3` (diff of POST..EOF empty) |
| `src/app/(public)/HomePageContent.tsx:40` · `src/components/global/MobileNav.tsx:103` · `src/components/global/UserMenu.tsx:66` | href `/auth?tab=register` → `/auth`; label "Start free trial" untouched | A-03 Option B · AC-203, AC-303 | one line each; `MobileNav.test.tsx` / `UserMenu.test.tsx` pass unmodified |
| `src/__tests__/auth/AuthPage.test.tsx` | NEW — jsdom: login form renders (email, password, one button "Login"); no tablist/tab, no link, no text or markup matching the AC-203 pattern | AC-202 | `src/__tests__/jest.setup.ts` untouched |
| `docs/AUTHENTICATION.md` | one note under "### 1. Signup" — removed in RRM-001, text below is historical | A-06 | body left for RRM-003 |
| `docs/ROUTES_AND_SURFACES.md` | `/auth` row and `(auth)` bullet → login-only; one line added under "Removed Surfaces" | A-06 | — |
| `README.md` | the single S1 line extended to name public self-registration (still one line) | A-06 | — |
| `CHANGELOG.md` | one S2 entry | A-10 | — |

| Command/check | Environment | Exit/result | Evidence path |
|---|---|---|---|
| `rm -rf .next && next build` **blank** Supabase env | local | exit 0 · **17 routes** | `evidence/S2_404_matrix.txt` (header) |
| same, placeholder env, flag=`true` (T) | local, no live Supabase | exit 0 · 17 routes · no `/api/auth/signup`, no `/moose-portal*` | `evidence/S2_404_matrix.txt` |
| same, placeholder env, flag=`''` (U) | local | exit 0 · 17 routes · table identical to T and blank | `evidence/S2_404_matrix.txt` |
| `npx tsc --noEmit` (after the build — S1 lesson) | local | **0 errors** | |
| `npx eslint .` | local | **0 errors / 35 warnings** (unchanged from S1) | |
| `npx jest --ci` | local, mocks | **29 suites / 130 tests passed, skipped = 0** (+1 suite, +2 tests = the new file) | |
| 404 matrix rows 1-8, states T and U | standalone `server.js`, placeholder env, 127.0.0.1:36055 | rows 1-4 **404** · row 5 **307 → /auth** · row 6 `POST /api/auth/signup` **404** · row 7 `POST /api/auth/login` empty body **500** (baseline control: `Unexpected end of JSON input`, non-404 ✓) · row 8 `GET /api/auth/login` **405**, 0-byte body — identical in both states | `evidence/S2_404_matrix.txt` |
| `/auth` and `/auth?tab=register` | served build | **200 / 200**, both states | `evidence/S2_404_matrix.txt` |
| AC-103b regression | served build | 5 × 404, both states | `evidence/S2_404_matrix.txt` |
| AC-203 grep | repo | 2 hits = the two A-09 exceptions; 0 after excluding them; `tab=` → 0 | `evidence/S2_greps.txt` |
| AC-204 | repo | no test references a removed module (0) | `evidence/S2_greps.txt` |
| AC-205 | repo | `posts` → 0; only export is `POST`; diff = 19 deletions, 0 additions; POST byte-identical | `evidence/S2_greps.txt` |
| AC-301 preserved-path diff vs `5f45fb3` | repo | **EMPTY** (also empty for `LoginForm.tsx`, `Logout.tsx`, `NavbarLoginReg.tsx`, `NavbarHome.tsx`, `useAuthStore.ts`, `jest.setup.ts`) | `evidence/S2_greps.txt` |
| AC-302 | repo | tracked diff under `src/__tests__` empty; only untracked = `src/__tests__/auth/AuthPage.test.tsx` | `evidence/S2_greps.txt` |
| AC-303 | repo | Navbar = the 4 flag-wiring lines; MobileNav / UserMenu = the href line only; `useAuthStore` in those two = import + logout call only | `evidence/S2_greps.txt` |

Allowed grep exceptions:
- AC-203 (A-09): `src/instrumentation.ts:18` (`export function register()` — Next.js hook, file byte-identical) · `src/__tests__/auth/AuthPage.test.tsx:17` (the AC-202 assertion pattern). No other hit.
- Carried from S1, re-checked on this tree: AC-103 `src/` (A-04) three adminDemo lines · AC-106 (A-05) `src/app/(admin)/layout.tsx:20`.

Deviations: none from the approved plan. Notes: (1) `git diff --stat 5f45fb3 -- src/__tests__` prints nothing until the new test is committed (untracked) — shown via `git ls-files --others` instead; after the Director's commit it will list exactly that one file. (2) README: A-06 allows one line; the S1 line was extended rather than a second line added.
Auth behaviour change beyond removal: **none observed** — login POST, logout, confirm, proxy, middleware, protectPage, LoginForm and useAuthStore are byte-identical to baseline.
Dead code left in place, not removed (ask before deleting): `TabsContent` export in `src/components/ui/tabs.tsx` (no consumer now) · `src/components/common/PaginationControls.tsx` (from S1).

Env restoration: placeholder env scoped per command (`https://placeholder.invalid` …); nothing exported; `.env.local` not read for values, not edited; no live Supabase call; server stopped, port 36055 free, 0 processes; `.next/` (gitignored) left as the state-U build. Director checkpoint SHA: `4965c0c` (S2 commit, observed on disk at P3)
GIT REMINDER — uncommitted paths: 3 deletions (`src/app/api/auth/signup/route.ts`, `src/components/auth/RegisterForm.tsx`, `src/components/auth/AuthTabs.tsx`) · `src/app/(auth)/auth/page.tsx` · `src/app/api/auth/login/route.ts` · `src/app/(public)/HomePageContent.tsx` · `src/components/global/MobileNav.tsx` · `src/components/global/UserMenu.tsx` · new `src/__tests__/auth/AuthPage.test.tsx` · `README.md` · `docs/AUTHENTICATION.md` · `docs/ROUTES_AND_SURFACES.md` · `CHANGELOG.md` · this log · `evidence/S2_404_matrix.txt` · `evidence/S2_greps.txt` · session log · stage report.

## Completion claim

Assembled at P3, 2026-09-20 18:34. Stage report: `agent_docs/RESPONSES/response_2026-09-20_183418_rrm001-p3-handoff.md`.

Candidate SHA: `4965c0c56ae7f658995d8b7cd634b5cdbc697f56` · Repair diff: `evidence/repair.diff` (`git diff 5f45fb3..4965c0c`, 5753 lines, whole tree incl. docs; secrets scan 0) · Changed files: `evidence/changed_files.txt` (71 paths; product paths: 17 D · 9 M · 1 A)

AC coverage claims (AC → evidence):

| AC | Claim | Evidence |
|---|---|---|
| AC-101 | folder absent | `evidence/S1_greps.txt` |
| AC-102 | no `/moose-portal*` route; 4 × 404 + control 307, states T and U | `evidence/S1_404_matrix.txt`, `evidence/S2_404_matrix.txt` |
| AC-103 | GREEN **per A-04 + A-12** (not literal zero) | `evidence/S1_greps.txt` |
| AC-103b (A-11) | 5 ids captured pre-deletion; absent after; 5 × 404 both states | `evidence/S1_action_ids.txt`, both matrices |
| AC-104 | 0 consumers; key gone; `src/instrumentation.ts` byte-identical | `evidence/S1_greps.txt` |
| AC-105 | Moose copy deleted; 0 importers; header cites E-04 | `evidence/S1_greps.txt` |
| AC-106 | one hit = A-05 exception; notes per A-06 | `evidence/S1_greps.txt`, `evidence/S2_greps.txt` |
| AC-201 | folder absent; `POST /api/auth/signup` 404; control non-404 | `evidence/S2_404_matrix.txt` |
| AC-202 | files deleted; `/auth` + `/auth?tab=register` 200 login-only; jsdom test | `src/__tests__/auth/AuthPage.test.tsx`, `evidence/S2_greps.txt` — QA browser/screenshot **not run** |
| AC-203 | two hits = A-09 exceptions | `evidence/S2_greps.txt` |
| AC-204 | no test references a removed module; jest 29/130, 0 skipped | `evidence/S2_greps.txt`, S2 table above |
| AC-205 | `GET` gone; no `posts`; 405; POST byte-identical | `evidence/S2_greps.txt`, `evidence/S2_404_matrix.txt` |
| AC-206 | **not engineering's** — Director evidence file NOT YET | — |
| AC-301 | preserved-path diff empty | `evidence/S2_greps.txt` |
| AC-302 | named suites pass unmodified; only new file under `src/__tests__` | `evidence/S2_greps.txt` |
| AC-303 | as narrowed by A-03 | `evidence/S2_greps.txt` |
| AC-304 | **not claimed** — QA One-Walk | — |
| AC-401 | board recorded end of S1 and S2 | S1 / S2 tables above |
| AC-402 | tree clean after each Director commit (`9d5fe22`/`7e2eaeb`, `4965c0c`); candidate recorded; `.env.local` not edited — stated | this log |

Limitations / not run: browser walk and real-auth login (QA); Gate M; no live Supabase call; trigger correction not performed (BIM-004 rider CE-2); QA playbook snapshot NOT YET (`QA/GOVERNING/README.md`); OBS-1 not exercised; OBS-2 orphans left in place.
QA handoff: `QA_HANDOFF.md`

Engineering evidence, not independent QA certification.
