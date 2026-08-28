# ACCEPTANCE_SPEC — FIX-001-CYBER-PHARMA
## KIP-2 Kill: Server-Resolved Identity on the Public Nav (+F02)

**Owning app:** CYBER-PHARMA (repo `cyber-pharma-dev-v1-phase-3`)
**Status:** **QA-VERIFIED — GATE Q PASS** (Sol, 2026-08-27; report: `QA/GATE_Q_REPORT_FIX-001-CYBER-PHARMA.md`). All AC1–AC7 PASS, zero rework. Lifecycle complete: SEEDED → ENGINEER EVIDENCE-FILLED → **QA-VERIFIED**.
**Branch + SHA:** `phase-3-2`, base `8b260c1`. **Process note (flagged, Coordinator-accepted):** Gate Q ran against the uncommitted working tree (P1's pre-commit deferred); the Coordinator's single close-out commit — first commit after this line is written — is the certified SHA of record.
**Objective:** the public landing nav renders role-gated UI from server-resolved identity in every auth state, including the stale-persist state that defined KIP-2; one stale comment corrected.

## Scope

**IN:** `(public)/layout.tsx` redirect-free identity resolution · props threading NavbarHome → MobileNav + UserMenu · removal of their store role reads · associated test updates (documented) · `instrumentation.ts:5` comment · KIP registry closure.
**OUT:** `useAuthStore.ts` internals · `server.ts` (KIP-1 parked) · authed-shell Navbar · moose-portal · schema/SQL · numbered-color sites.

## Prerequisites (Coordinator, before Gate Q certification)

- P1. Module changes committed; branch + SHA recorded above from disk.
- P2. Two test identities available (ADMIN + MEMBER) for the reproduction walk — moose-portal provisions if needed.
- P3. This module's QA package lands in `ACTIONS/FIX-001-CYBER-PHARMA/QA/` (module-scoped artifact ruling, 2026-08-27).

## Acceptance Requirements

- **AC1 — Consumers cured.** Zero `useAuthStore` reads (role, isAdmin, isMember, or whole-store) remain in `MobileNav.tsx` and `UserMenu.tsx`; both render identity from props. Repo-wide, the only sanctioned store consumers left are the login-flow surfaces (enumerated in evidence).
  *Evidence (Engineer, 2026-08-27):* grep `useAuthStore` in the two files → UserMenu.tsx: **zero references**; MobileNav.tsx: import + `useAuthStore.getState().logout()` only (lines 8, 33 — the logout *action*, Operator-ratified at plan approval as mirroring cured `Navbar.tsx:102`; zero state/selector/role reads). Both components take `{ user: SupabaseUser | null; role: AppRole | null }` props. Repo-wide consumer enumeration post-fix: `LoginForm.tsx:45` (login action), `Logout.tsx:12` (logout action), `Navbar.tsx:102` (logout action), `MobileNav.tsx:33` (logout action) — all login-flow actions, **zero state readers anywhere**.
- **AC2 — The KIP-2 reproduction now passes.** Production mode: authenticated ADMIN with cleared localStorage + valid cookies, hard refresh on `/` → correct ADMIN nav. Same for MEMBER. Logged-out visitor renders today's logged-out nav unchanged.
  *Evidence:* **PASS — Gate Q live attack** (`QA/GATE_Q_REPORT_FIX-001-CYBER-PHARMA.md` § Live KIP-2 Attack): ADMIN and MEMBER both correct after deleting only `auth-store` with cookies preserved + hard refresh on `/`; logged-out clean, no identity/Admin-Portal leakage; client-side nav paths clean. QA ran the walk independently per the spec's own QA notes.
- **AC3 — Triad green.** Build passes; tsc clean; full jest green. Any delta from the 26/120 baseline is enumerated with per-file reason (R4).
  *Evidence:* build ✓ compiled 8.2s, 22 routes (note: `/` and `/access-denied` flip ○→ƒ — inherent to R1's server-resolved identity, flagged in the approved plan); `npx tsc --noEmit` → clean; `npm test` → **28 suites / 128 passed / 0 failures** (3.862s). **Delta table (R4):** +2 suites / +8 tests, both NEW: `src/__tests__/global/MobileNav.test.tsx` (+4: three auth states + logout action) and `src/__tests__/global/UserMenu.test.tsx` (+4: three auth states + dropdown contract) — the props-contract coverage for the cured components; zero existing tests modified or broken.
- **AC4 — Gate M holds.** 375px and desktop, light and dark, all three auth states — nav correct and unbroken.
  *Evidence:* **PASS — Gate Q** (same report): ADMIN / MEMBER / logged-out on desktop + 375px mobile, auth/nav behavior correct.
- **AC5 — F02 landed surgically.** `instrumentation.ts:5` cites `.env.example`; the file's diff is exactly that comment line.
  *Evidence:* `git diff src/instrumentation.ts` → single hunk, single line: `-// … See \`.env.local.example\` …` / `+// … See \`.env.example\` …`. Nothing else in the file.
- **AC6 — Baselines undisturbed.** Prod `any` = 2; `user_metadata` role smells = 0; forbidden zones untouched (`useAuthStore.ts`, `server.ts` byte-identical).
  *Evidence:* post-change greps → prod `any`: exactly 2 (`ui/command.tsx:35`, `utils/supabase/server.ts:6` = KIP-1); `user_metadata` role smells: 0. `git diff --stat src/store/useAuthStore.ts src/utils/supabase/server.ts` → empty (byte-identical). `supabase/**`, `.env.local`, `_SKILLS/**`, authed `Navbar.tsx`, moose-portal: no entries in `git status`.
- **AC7 — Registry truth.** KIP-2 → Closed with resolution line + evidence pointer; KIP-1 entry untouched, still parked.
  *Evidence:* `agent_docs/KIP_REGISTRY.md` — KIP-2 moved to `## Closed` as "CLOSED 2026-08-27" with resolution (server-resolved props via FIX-001), evidence pointers (this spec + the two new suites), and verbatim-history note. KIP-1 block untouched (no diff in its lines).

## QA Notes (for Sol)

The reproduction IS the test: AC2's stale-persist walk is the module's reason to exist — run it yourself with the Director as hands, don't accept the Engineer's walk log as your evidence. High-value attacks: (a) the *third* state — a user whose localStorage holds a STALE role (e.g., member-cached-as-admin) rather than none: props must win over any residual store value; (b) logged-out regression on the marketing page (the layout must not redirect or flash); (c) AC1's enumeration — hunt for any other component reading store role that Engineering's sweep missed; (d) hard-refresh vs client-side nav to `/` (both must render correctly). Per the contract-strictness ruling: attack these because they're in-contract (AC1/AC2's "every auth state"), not stricter than it.

## Verdict

*(Sol, Factory five-word vocabulary)*: **GATE Q: PASS — MOVE FORWARD.**
