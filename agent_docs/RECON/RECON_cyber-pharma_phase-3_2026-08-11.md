# RECON REPORT — Cyber Pharma, Phase 3

- **Repo:** `cyber-pharma-dev-v1-phase-3` · branch `phase-3-1` · HEAD `6f6e63d` ("audit passed, build tested, ready for phase 3")
- **Recon run:** 2026-08-11 19:47–19:55 by the Engineer (stark-recon v1.1)
- **Docs verified against disk:** `README.md`, `docs/*` (9 files + 3 SQL), `CHANGELOG.md`, `agent_docs/KIP_REGISTRY.md`
- **Repo state:** working tree carries uncommitted protocol-scaffold changes (CLAUDE.md, CHANGELOG.md, agent_docs/, RECOVERY.md, WINDSURF.md deleted) — no `src/` changes; recon left `src/` byte-for-byte untouched, zero git mutations.

---

## Section 0 — Day-0 Ground-Truth Sweep

**Forbidden-zone greps** (EVIDENCE, commands run 19:48):

- `: any` / `as any` in **production** src: **2 sites** — `src/components/ui/command.tsx:35` (`{children as any}`, shadcn primitive) and `src/utils/supabase/server.ts:6` (`(await cookies()) as any` — this is **KIP-1's** exact site). Remaining 20 hits are all under `src/__tests__/` (mock casts — tolerated zone).
- `dangerouslySetInnerHTML`: **none** — EVIDENCE (grep, zero hits).
- `user_metadata` **role** smells: **none in production code** — EVIDENCE. The 4 production hits are profile-name-only: `moose-portal/users/actions.ts:129-132,185` writes `full_name`; `profile/ProfileForm.tsx:28` reads `full_name`. Consistent with AUTHENTICATION.md's "profile data yes, authorization never" rule. One test mock (`__tests__/member/ProfileForm.test.tsx:31`) plants `role: 'member'` in `user_metadata` — INFERENCE: harmless fixture noise, but a smell to keep out of copied fixtures.
- **Env ground truth** — DRIFT: code consumes `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` (2 sites: `moose-portal/layout.tsx:15`, `Navbar.tsx:49`) but `.env.example` **omits it** — EVIDENCE. `.env.local` (live) carries 7 keys `.env.example` doesn't: the moose flag + 6 `STRIPE_*` keys. **No `process.env.STRIPE_*` reader exists anywhere in `src/`** — EVIDENCE (grep). `NEXT_PUBLIC_API_BASE_URL` is in both env files but consumed nowhere in `src/` — EVIDENCE.
- **Test runner:** Jest 30 + ts-jest (+ Playwright for e2e) — EVIDENCE `package.json` scripts. No Vitest anywhere.
- **Build route table:** build **passes clean** (8.0s compile, TS 3.1s, 16 static pages). 22 routes — **exactly matches ROUTES_AND_SURFACES.md**, no fossil routes (no `/demo`, `/template`, `/api/ghl`) — EVIDENCE (route table below).

```
ƒ /                                ○ /auth
○ /_not-found                      ○ /error
○ /access-denied                   ○ /icon.png
ƒ /admin-portal                    ƒ /moose-portal
ƒ /admin-portal/audit              ƒ /moose-portal/users
ƒ /admin-portal/billing            ƒ /moose-portal/users/add-member
ƒ /admin-portal/settings           ƒ /moose-portal/users/edit/[id]
ƒ /admin-portal/stores/[id]        ƒ /owedbook
ƒ /admin-portal/stores/[id]/invite ƒ /profile
ƒ /api/auth/{confirm,login,logout,signup}     ƒ Proxy (Middleware)
```

---

## Section 1 — Stack Versions

All EVIDENCE — `package.json`:

- **Next.js:** ^16.2.1 (App Router; `src/proxy.ts` present, no `middleware.ts` — correct for Next 16)
- **React:** ^19.2.4 · **react-dom** ^19.2.4
- **Tailwind:** **^3.4.1** → token mechanic: **HSL vars + tailwind.config.ts** (NOT v4 @theme/OKLCH)
- **TypeScript:** ^5 (strict: true, noEmit)
- **Node:** **not pinned** — GAP (no `.nvmrc`, no engines field)
- **Test:** jest ^30.0.5, ts-jest ^29.4.1, @playwright/test ^1.59.1 (`test:e2e` scripts wired)
- **State:** zustand ^4.5.4 · **Auth/DB:** @supabase/ssr ^0.6.1, supabase-js ^2.44.0
- **Notable:** `stripe` ^22.1.0 (⚠️ see Surprises), `sass` ^1.77.6 (⚠️ see Surprises), next-themes ^0.4.6, zod, react-hook-form, cva/clsx/tailwind-merge, lucide + heroicons
- **npm audit:** **0 vulnerabilities** — EVIDENCE (run 19:50)

---

## Section 2 — Kit Structure vs Doc Claims

**Confirmed on disk** (all EVIDENCE via `ls`/`find`):

- `src/utils/app-role.ts` + `get-user-role.ts` + `supabase/` — present
- `src/services/` = `adminDemo.ts`, `owedbook.ts` (both mock-backed — the Phase-3 swap points)
- `src/store/` = `useAuthStore.ts`, `useAdminDemoStore.ts`
- `src/types/` = `adminDemo.ts`, `OwedBook.ts`, `tailwind-merge.d.ts` — types live in `/types` per doctrine ✓
- Route groups: `(public)`, `(auth)`, `(admin)` + ungrouped `owedbook/`, `profile/`, `moose-portal/`, `api/`, `error/`, `providers/` — matches ROUTES_AND_SURFACES.md's "no `(members)` group" claim ✓
- `/access-denied` lives at `src/app/(public)/access-denied` ✓

**DRIFT FOUND:**

1. **`phase2.md` — MISSING.** `docs/PROJECT_OVERVIEW.md:93` claims "**phase2.md (repo root)** — master Phase-2 reference + Phase-7 carry-forward flags." Not on disk (root has only CHANGELOG/CLAUDE/README/RECOVERY). GAP — the carry-forward flags it held are unlocatable in this repo.
2. **Test counts stale in BOTH docs, which also disagree with each other:** README badge says **118 passed / 25 suites**; TESTING.md says **117 passing / 25 suites**; fresh run says **120 passed / 26 suites** — EVIDENCE (jest run 19:54). Classic L26.
3. **`.env.example` incomplete** (Section 0): missing `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` that code requires for the operator tool, and carries none of the STRIPE_* keys the live env holds (defensible if Stripe is out of scope — but then the dep shouldn't ship either; see Surprises).

---

## Section 3 — Auth Pattern

- **User read via:** server: `supabase.auth.getUser()` inside `protectPage()` (`src/utils/supabase/actions.ts:8-14`); client: `useAuthStore` (login/logout) — EVIDENCE.
- **Role resolved via:** `getUserRole(userId)` → `public.user_roles` table query (`src/utils/get-user-role.ts:11`) — DB is source of truth, exactly as AUTHORIZATION.md claims ✓. Note the `data.role as AppRole` cast (unvalidated string→enum) — INFERENCE: safe while DB enum matches, brittle if a row carries an unexpected value.
- **Auth service:** **none** — auth consumed directly via kit primitives (`protectPage`, `useAuthStore`). No `authService` wrapper anywhere — EVIDENCE. DATA_CONTRACT should NOT invent one.
- **Route gating** (all EVIDENCE from layouts): `(admin)/layout` → `protectPage([ADMIN], {unauthorizedRedirect: "/owedbook"})`; `owedbook/layout` → `protectPage([ADMIN, MEMBER])`; `profile/layout` → `protectPage([ADMIN, MEMBER])`; `moose-portal/layout` → env-flag `notFound()` + `protectPage([ADMIN])`. Matches AUTHORIZATION.md ✓.
- **Auth store ACTUAL shape** (`src/store/useAuthStore.ts`): `user: SupabaseUser | null` (properly typed — the v1-era `user: any` is FIXED), `role`, `isAdmin`, `isMember`, `isAuthenticated`, `isLoading`, `login()`, `logout()`. **No `isSuperadmin`** — and AppRole enum DOES carry `SUPERADMIN` (`app-role.ts:2`), used only in tests. AUTHORIZATION.md:60 confirms "ships no superadmin surface" ✓.
- **⚠️ Store is `persist`-backed (`name: "auth-store"`) with `role` written only by `login()` — KIP-2's root cause, UNCHANGED.** See Surprises for the promotion.
- **user_metadata role smells:** none in production (Section 0) ✓.

---

## Section 4 — Design Reality

- **Tokens live in:** `src/app/globals.css` (HSL custom properties; **plain CSS, not SCSS**) — EVIDENCE. No `src/styles/`.
- **Hardcoded numbered colors:** **5 files** — `ui/dialog.tsx`, `ui/select.tsx`, `ui/toast.tsx` (shadcn primitives), `globals.css`, `(public)/HomePageContent.tsx` — EVIDENCE (grep, 5 total hits). Small reconciliation scope.
- **Dark mode:** `darkMode: ["class"]` (`tailwind.config.ts:8`) + next-themes `ThemeProvider` (`app/providers/`) — EVIDENCE.
- **Font:** Saira via `next/font/google` (`app/layout.tsx:2`) — EVIDENCE.
- **Theme toggle:** `ThemeToggler.tsx` present and mounted on **all three navbars** (NavbarHome, Navbar, NavbarLoginReg) — EVIDENCE ✓ (L20 satisfied).
- **CSS extension:** `.css` entry; the `sass` dependency has no `.scss` file to serve — see Surprises.

---

## Section 5 — Database

- **Migrations:** no `supabase/migrations/` dir. Schema ships as `supabase/setup.sql` (byte-identical copy at `docs/setup.sql` — EVIDENCE via `diff`) plus `docs/migration_add_profiles.sql`.
- **Tables:** `public.user_roles` (setup.sql:24), `public.profiles` (setup.sql:50; migration:13) — EVIDENCE.
- **Functions/triggers:** `handle_new_user()` (setup.sql:87; migration:72) + `on_auth_user_created` trigger (migration:114) — EVIDENCE.
- **RLS:** enabled on both tables; policies for own-role read, own-profile read/update; migration adds superadmin-visible profile policies — EVIDENCE.
- **QUESTION for Architect:** `docs/migration_add_profiles.sql` defines profiles/trigger/policies that **overlap** `setup.sql`'s (different policy names, superadmin variants). Which reflects the LIVE Supabase instance? Disk can't answer what's deployed — needs Operator confirmation before DATA_CONTRACT writes "tables in play."
- **Phase-3-critical GAP:** `services/owedbook.ts` BACKEND_SWAP_NOTES reference `user_data`, reference tables, and `business_id`-scoped RLS — **none of those tables exist in any SQL on disk.** The Phase-3 backend swap has no schema yet.

---

## Section 6 — Skills / Security / Env

- **Skills:** no `.claude/skills/`; `_SKILLS/` at repo root: `stark-cloud-deploy-skills`, `stark-kit-residue-cleaner-skill`, `stark-recon-skill-v1.1` — EVIDENCE. Launch CWD = repo root (`/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3`).
- **Security:** `npm audit` → **0 vulnerabilities**. No `agent_docs/security/` (GAP — no prior audit artifacts in-repo; HEAD commit message claims "audit passed" — CLAIM, no artifact on disk to cite).
- **Required env vars** (from code, the only authority): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` (optional flag). Supabase naming is the Q4-2025 publishable/secret scheme ✓ (no stale anon/service_role anywhere).
- **Pointer files:** `CLAUDE.md` + `RECOVERY.md` at root (protocol scaffold, created today). No AGENTS.md/GEMINI.md.

---

## Section 8 — Demo / Tutorial Scaffolding

- **Third-party demo APIs:** none (no jsonplaceholder/dummyjson/etc.) — EVIDENCE.
- **The mock layer is DELIBERATE, not tutorial residue** — INFERENCE from APP_ARCHITECTURE.md ("UI-FUNCTIONAL MOCK with their real-phase boundary") + BACKEND_SWAP_NOTES in both services. `adminDemo` + `owedbook` mocks are the Phase-2 deliverable that **Phase 3 exists to swap**. Do NOT scope as deletion.
  - **adminDemo cascade (24 files):** `services/adminDemo.ts` · `store/useAdminDemoStore.ts` · `types/adminDemo.ts` · `mocks/adminDemo.ts` · 14 `components/admin-portal/*` · 6 test files.
  - **owedbook cascade:** `services/owedbook.ts` · `types/OwedBook.ts` · `mocks/owedbook*` · `components/owedbook/*` · tests.
- **`/moose-portal` — flagged for deletion BY ITS OWN CODE:** 4 `TODO: REMOVE` markers (`layout.tsx:1`, `_shell/MooseShell.tsx:1`, `_shell/MooseSidebar.tsx:1`, `Navbar.tsx:48`) — EVIDENCE. ROUTES_AND_SURFACES.md confirms: "remove when test-user provisioning is done." QUESTION: is Phase 3 that moment, or does it survive as the swap's test-user tool?
- **Cross-project residue:** `temp/ghl-example.json` — the GoHighLevel fossil (the same clone-debt class Run 001 found) rides along in `temp/` — EVIDENCE. Zero `src/` references (grep clean). One-file deletion candidate.
- **Route table:** every route maps to a current feature; nothing suspect (Section 0).

---

## Section 9 — FFM Packaging & Compile Scope

- **tsconfig excludes `agent_docs/**`:** **YES** — EVIDENCE (`tsconfig.json` exclude). Already Phase-1-lesson-compliant.
- **Jest scope:** `roots: ['<rootDir>/src']` — agent_docs can never enter test scope ✓.
- **Compilable strays:** zero `.ts/.tsx` under `agent_docs/` or `_SKILLS/` — EVIDENCE (find). ⚠️ Note for FFM author: `_SKILLS/` is NOT in tsconfig exclude — currently harmless (no .ts files), but any future skill that ships `.ts` templates will enter compile scope. Add `_SKILLS/**` to exclude, or keep skill templates non-`.ts`.

---

## Section 11 — Nav & Auth-State Patterns

- **Nav variants + mounts** (all EVIDENCE): `NavbarHome` → `(public)/layout` (marketing) · `NavbarLoginReg` → `(auth)/layout` · `Navbar` → `AuthedShell` (owedbook + admin-portal), `profile/layout`, `MooseShell` · `MobileNav` + `UserMenu` → imported by `NavbarHome`.
- **Marketing nav:** has `MobileNav` (hamburger) ✓ + `ThemeToggler` ✓ + `UserMenu` auth-state region ✓ — L19/L20/L22 all structurally satisfied. **But see Surprises: the auth-state region is built on the stale-persist store.**
- **Split hero:** side-by-side engages at **`lg:`** (`HomePageContent.tsx:9`: `grid-cols-1 lg:grid-cols-[1fr_1.12fr]`) ✓ — L18 satisfied.

---

## Section 12 — Verification Predicates (current state, for FFM gate-writing)

- Numbered-color grep: 5 hits (Section 4) — the SP-close predicate baseline.
- `user_metadata` role grep: clean in production.
- Production `any` grep: 2 sites (both pre-existing, KIP-1 + shadcn).
- Fresh test baseline: **26 suites / 120 tests / 0 failures, 4.4s** — EVIDENCE (jest, 19:54). Use THIS, not the docs' numbers.
- Build: passes; TS passes; 0 audit vulns.

---

## Section 10 — SURPRISES (the gold)

1. **🔴 KIP-2 HAS GONE HOT — its promotion condition is now met.** The registry (2026-08-04) said risk was LOW-MEDIUM because "whether `MobileNav`/`UserMenu` are mounted on any live route is unverified... Risk jumps to MEDIUM+ the moment either is wired into a rendered surface." EVIDENCE: `NavbarHome.tsx:3,5` imports both, and `(public)/layout.tsx:2` mounts NavbarHome on the **live landing page**. Both components read `useAuthStore((s) => s.role)` (`MobileNav.tsx:22`, `UserMenu.tsx:23`) — the localStorage-persisted value written only by `login()`. A cookie-authenticated user with cleared localStorage gets wrong role-gated UI on the public nav — the exact Navbar-class bug the KIP predicted. **This is no longer a parked improvement; it's a live landing-page defect window.**
2. **`stripe` ^22.1.0 + 6 `STRIPE_*` env keys, zero integration.** No `process.env.STRIPE_*` reader, no import of the SDK anywhere in `src/` — the only "stripe" strings are display fields in the adminDemo billing mock. INFERENCE: dep + keys staged for a future billing phase or vestigial. QUESTION: is Stripe in Phase-3 scope? If not, the dep and the live keys are dead weight (and live secrets sitting in `.env.local` for no consumer).
3. **`sass` ^1.77.6 with no `.scss` file in the repo** — EVIDENCE (find/ls: only `globals.css`). Vestigial dep from the kit's SCSS era. Removal candidate.
4. **`phase2.md` lost** — PROJECT_OVERVIEW's named "master Phase-2 reference + Phase-7 carry-forward flags" is absent from disk. Same loss-class as the KIP registry (which was recovered today from `cyber-pharma-dev-v1/` — provenance note in `agent_docs/KIP_REGISTRY.md`). QUESTION: does `phase2.md` survive in a sibling repo, and should it be recovered before Phase-3 authoring?
5. **`temp/ghl-example.json`** — the GHL clone-debt fossil, unreferenced. One-file cleanup candidate.
6. **Test-count drift in two docs that also disagree with each other** (118 vs 117 vs actual 120) — small, but it means neither doc was regenerated at HEAD.
7. **Unused env vars:** `NEXT_PUBLIC_API_BASE_URL` defined in both env files, consumed nowhere.
8. **caniuse-lite 12 months stale** (build warning) — cosmetic, one-command fix, Operator's call.
9. **cn() helper:** present and standard (`src/lib/utils.ts` — clsx + twMerge) ✓.

---

## Recommendation to Architect

**Verified facts you can author against without re-verification:**

- Stack: Next 16.2.1 / React 19.2.4 / TS 5 strict / Tailwind **3.4.1 (HSL/config mechanic)** / Jest 30 / Zustand 4 / @supabase/ssr 0.6.1. Node unpinned.
- Auth: kit-complete via `protectPage` + `user_roles` DB lookup — **write DATA_CONTRACT to consume kit primitives directly; no authService wrapper.** Store shape as listed in §3 (has isAdmin/isMember; no isSuperadmin; persist-backed).
- Both services are mock-backed **swap points** with explicit BACKEND_SWAP_NOTES — Phase 3's real work. Not deletion targets.
- Route inventory = the 22-route table in §0, verified by build. Test baseline = 26/120 fresh.
- Packaging: tsconfig + jest already exclude agent_docs ✓.

**Drift to surface in doctrine / docs:**

- `phase2.md` missing (carry-forward flags unlocatable) · test counts stale in README + TESTING.md · `.env.example` missing the moose flag · setup.sql vs migration_add_profiles.sql overlap needs a "which is deployed?" ruling.

**Schedule into Phase 3 (Operator to prioritize):**

1. **KIP-2 fix — now promoted per its own symptom-promotion trigger** (live landing-page surface). Fix shape per registry: server-resolved identity or server-hydrated store for `MobileNav`/`UserMenu`. Verification: the registry's stale-persist auth-walk.
2. **KIP-1** remains parked unless Phase 3 touches `server.ts` (FORCED ENTRY) or bumps `@supabase/ssr`.
3. Backend swap has **no schema on disk** for `user_data`/reference tables/`business_id` RLS — DATA_CONTRACT must author it fresh.

**Cleanup candidates (ask, don't assume):** `sass` dep · `stripe` dep + STRIPE_* keys (pending scope ruling) · `temp/ghl-example.json` · `NEXT_PUBLIC_API_BASE_URL` · `/moose-portal` (its own TODOs say remove — but is Phase 3 the moment?).

**Open QUESTIONS for Operator:** ① Which SQL reflects live Supabase — setup.sql, the profiles migration, or both applied in sequence? ② Is Stripe in Phase-3 scope? ③ Recover `phase2.md` from a sibling repo? ④ Does `/moose-portal` survive Phase 3? ⑤ May `_SKILLS/**` be added to tsconfig exclude preemptively?

---

*Recon left the inspected codebase byte-for-byte unchanged. Zero git mutations. Sole writes: this report file (+ session-log bookkeeping per house protocol).*
