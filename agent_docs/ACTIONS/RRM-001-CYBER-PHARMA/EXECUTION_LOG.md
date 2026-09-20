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

(same shape; include blank-env and placeholder-env build transcripts; `evidence/S2_404_matrix.txt`; AC-301 preserved-path diff transcript; AC-303 grep)

## Completion claim

Candidate SHA: <...> · Repair diff: `evidence/repair.diff` · Changed files: `evidence/changed_files.txt` · AC coverage claims: <AC IDs → evidence paths>
Limitations / not run: browser walk and real-auth login (QA); no live Supabase call; trigger correction not performed (BIM-004 rider CE-2)
QA handoff: `QA_HANDOFF.md`

Engineering evidence, not independent QA certification.
