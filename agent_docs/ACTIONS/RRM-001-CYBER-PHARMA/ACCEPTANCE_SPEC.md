# RRM-001-CYBER-PHARMA — Removal — Acceptance Specification

**Version:** 1.0 · 2026-09-20 · **Architect:** Fable · **Director approval:** D1, D2 · **Contract freezes at:** engineering handoff (P3). Post-freeze rulings append to `RULINGS_ADDENDUM.md` and the erratum lane below; frozen text is never rewritten.
**Scope:** removal of the Moose portal and public signup; login GET probe removal; admin-client reconciliation. Baseline `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`.

Requirements are agreed before implementation. Claudy delivers this file unchanged with his execution evidence. QA verdicts belong to SOL. Grep criteria are literal: zero means zero; any allowed exception is listed in `EXECUTION_LOG.md` with path and reason.

## AC-100 — Moose portal removed (D2, R-001, R-012)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-101 | `src/app/moose-portal/` does not exist (routes, layout, pages, `users/actions.ts`, `_lib/`, components). | — | repo | `ls` transcript |
| AC-102 | `next build` (placeholder env) route table contains no `/moose-portal*`. On the served build, `GET /moose-portal`, `/moose-portal/users`, `/moose-portal/users/add-member`, `/moose-portal/users/edit/x` each return **404**, run twice: with `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=true` exported and with it unset. | Negative: unauthenticated `GET /owedbook` returns a redirect to `/auth` (server alive). | `next start` or standalone, placeholder env, curl | route table + curl transcripts ×2 |
| AC-103 | No removed Server Action survives: `grep -rn "getUserById\|addMember\|deleteUser\|editUser" src/` → 0; after a **fresh** build (`rm -rf .next` first) `grep -rln "getUserById\|addMember\|deleteUser" .next/server/` → 0. | Negative: `protectPage` present; `src/__tests__/**/actions.test.ts` passes. | fresh build | grep transcripts |
| AC-104 | `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` has zero consumers under `src/` (wiring at `src/components/global/Navbar.tsx:49` removed); key removed from `.env.example`; `src/instrumentation.ts` byte-identical to baseline. | — | repo | grep + diff |
| AC-105 | `src/app/moose-portal/_lib/admin.ts` deleted. `src/utils/supabase/admin.ts` retained; `grep -rn "utils/supabase/admin" src/ scripts/` → 0 importers; file still exports `createAdminClient` and typechecks; its header comment cites ledger E-04 and states: blessed, zero app consumers, fenced to seeding/system jobs. | — | repo | grep + `head -n 12` |
| AC-106 | `grep -rni "moose" README.md docs/ .env.example src/` → 0. `agent_docs/KIP_REGISTRY.md` and any governing doc that still directs a reader to Moose carries a one-line "removed in RRM-001 (2026-09-20)" note. Historical module folders, journals, reviews and recon are excluded from the grep and untouched. | — | repo | grep + diff |

## AC-200 — Public signup removed (D1, R-011, R-002)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-201 | `src/app/api/auth/signup/` does not exist. On the served build `POST /api/auth/signup` → **404**. | Negative: `POST /api/auth/login` with an empty body returns a non-404 status (route exists). | served build, curl | curl transcript |
| AC-202 | `src/components/auth/RegisterForm.tsx` and every signup-only component identified in S0 are deleted. `/auth` and `/auth?tab=register` render the login form only: no register tab, no register form, no "create account" affordance. Login form fields and submit unchanged. | Negative: a jsdom test asserts the login form renders and no register affordance exists. | jsdom + QA browser | test + screenshot |
| AC-203 | `grep -rniE "sign ?up|register|create (an )?account" src/` → 0 outside the allowed-exception list (an orphaned string with no consumer is not an allowed exception — delete it). | — | repo | grep |
| AC-204 | Signup-only tests deleted; no test references a removed module; `jest --ci` passes with zero skipped. | — | Jest | jest output |
| AC-205 | `GET` handler removed from `src/app/api/auth/login/route.ts`; the file contains no reference to `posts`; served build `GET /api/auth/login` → 404 or 405, never a database-backed response. | Negative: `POST` handler byte-identical to baseline. | served build | grep + curl + diff |
| AC-206 | **Director-owned evidence item (not Claudy's):** Supabase dev project has "Allow new users to sign up" disabled; a direct `POST {SUPABASE_URL}/auth/v1/signup` returns a signups-not-allowed error; a known existing account still logs in. Recorded (redacted) at `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md`. Absence of this file blocks nothing in engineering; SOL records it as PRESENT / NOT YET in certification without inferring anything from AC-201. | — | Supabase dashboard + curl (Director) | evidence file |

## AC-300 — Preserved behavior

| AC | Required observable behavior | Controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-301 | `git diff 5f45fb3..<candidate> --stat -- src/proxy.ts src/utils/supabase/middleware.ts src/utils/supabase/actions.ts src/app/api/auth/logout src/app/api/auth/confirm src/app/(auth)/layout.tsx src/app/profile src/app/(admin) src/app/owedbook src/services src/mocks src/components/owedbook src/components/common src/instrumentation.ts supabase scripts package.json package-lock.json next.config.js` → **empty**. | — | repo | diff transcript |
| AC-302 | `Navbar.invariant.test.tsx`, `InviteMemberForm.test.tsx`, `actions.test.ts` (protectPage), `proxy.test.ts`, `MobileNav.test.tsx`, `UserMenu.test.tsx`, `owedbook.test.ts`, `drawer-apply.integration.test.tsx` pass **unmodified** (a modification requires an addendum row). | — | Jest | jest output + `git diff --stat -- src/__tests__` showing only deletions/removed-module references |
| AC-303 | `src/components/global/Navbar.tsx` diff vs baseline touches only the flag-wiring lines; `NavbarHome`, `MobileNav`, `UserMenu` byte-identical (FIX-001 state). `grep -rn "useAuthStore" src/components/global/MobileNav.tsx src/components/global/UserMenu.tsx` shows only the logout call. | — | repo | diff + grep |
| AC-304 | **One-Walk (QA, real auth on a project SOL trusts; Director authorizes):** existing admin and member log in at `/auth`, land on `/owedbook`; admin reaches `/admin-portal`; both reach `/profile` and the password-update form renders; logout returns to `/`; unauthenticated `/owedbook` → `/auth`. Desktop and 375px, light and dark (Gate M). | — | browser + real auth | walk record |

## AC-400 — Board and hygiene

| AC | Required observable behavior | Evidence |
|---|---|---|
| AC-401 | End of S1 and S2: `npx tsc --noEmit` 0 errors · `npx eslint .` 0 errors (warning count recorded) · `npx jest --ci` all suites pass, zero skipped (suites/tests recorded) · `next build` exit 0 with **blank** Supabase env and with placeholder env; route count recorded. | `EXECUTION_LOG.md` |
| AC-402 | `git status --porcelain` empty after each Director stage commit; candidate SHA recorded at P3; `.env.local` not edited (Claudy states it). | log |

## Required regression and constraints

- Suites in AC-302 stay green unmodified. Journeys in AC-304 plus the 404 matrix in AC-102/201/205 are mandatory.
- Mocks: OwedBook and adminDemo untouched. Real auth only in the QA walk.
- Unavailable boundaries that do not block acceptance: deployment; live database state (AC-206 is Director evidence; the trigger correction is BIM-004's and is neither claimed nor verified here).
- Test counts are recorded, never a pass criterion on their own.

## Acceptance gates

Every AC needs independent evidence. Ambiguity or failure → SOL; scope → Architect/Director. Engineer green ≠ Gate Q. This certificate, when issued, does not certify that the installed signup trigger has been corrected.

## Erratum lane (append-only; empty at freeze)

| Date | AC | Original requirement | Ruling / rationale | Authority | Verification consequence |
|---|---|---|---|---|---|
| | | | | | |
