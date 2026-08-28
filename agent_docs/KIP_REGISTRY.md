# KIP Registry — Kit/Known Improvement Proposals

> Parked, deliberate improvements. NOT bugs, NOT a to-do list — each entry stays
> parked until one of its **trigger conditions** fires. Entries are numbered
> KIP-N in discovery order and are never renumbered or deleted; closed entries
> move to the Closed section with a resolution line.
>
> **Standing rule (CLAUDE.md):** at session start, when touching auth files, or
> when opening a new module, check this registry and surface any KIP whose
> triggers are met.

_Registry created: 2026-08-04. Format: mechanism · risk · triggers · verification._

> **Provenance note (2026-08-11):** this registry was absent from the
> `cyber-pharma-dev-v1-phase-3` working copy — it never made it across the phase-3
> branch cut. Restored verbatim from `cyber-pharma-dev-v1/agent_docs/KIP_REGISTRY.md`.
> Both open KIPs re-verified against phase-3 on restore: all four referenced files are
> present, and `server.ts` + `useAuthStore.ts` are byte-identical to the v1 copies —
> **both KIPs remain fully live in this branch.**

---

## Open

### KIP-1 — `server.ts` cookie modernization

- **File:** `src/utils/supabase/server.ts`
- **Origin:** linting pass
- **Mechanism:** the server Supabase client uses the deprecated per-cookie
  `get`/`set`/`remove` adapter from `@supabase/ssr` instead of the current
  `getAll`/`setAll` interface, plus an `as any` cast on the `cookies()` store to
  paper over the Next.js async-cookies type. Works today; each `@supabase/ssr`
  or Next.js upgrade raises the odds of a silent auth-session break (cookie
  writes failing quietly inside the try/catch).
- **Risk:** MEDIUM — auth session persistence is load-bearing for every
  protected surface, but the deprecated path is currently functional and the
  failure mode (stale/missing session) is loud in manual testing.
- **Triggers:**
  - Batched auth-hygiene session
  - FORCED ENTRY when touching `src/utils/supabase/server.ts` for any reason
  - Symptom promotion: any unexplained session-loss / random-logout report, or
    an `@supabase/ssr` major-version bump in a dependency pass
- **Verification requirement:** manual auth-walk — login (ADMIN + MEMBER),
  cross-surface nav, hard refresh on each surface, logout, re-login — in
  production mode (`npm run build && npm start`), then repeated on staging.

---

## Closed

### KIP-2 — `useAuthStore.role` stale-persist (remaining consumers) — CLOSED 2026-08-27

- **Resolution:** FIX-001-CYBER-PHARMA. `(public)/layout.tsx` now server-resolves
  identity (redirect-free `supabase.auth.getUser()` + `getUserRole`) and passes
  `user`/`role` as props through `NavbarHome` → `MobileNav` + `UserMenu`; both
  components' `useAuthStore((s) => s.role)` reads and client identity fetches
  removed (the only store use left is MobileNav's logout *action*, mirroring the
  cured Navbar). Cross-tab reactivity preserved via single `NavAuthRefresh`
  listener. The registry's stale-persist verification walk is FIX-001's Gate G2.
- **Evidence:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md`
  (AC1/AC2) + new suites `src/__tests__/global/MobileNav.test.tsx`,
  `UserMenu.test.tsx` (props-contract, all three auth states). Board at close:
  build ✓ · tsc ✓ · jest 28/128/0.
- **Original entry (verbatim history):** files `MobileNav.tsx:22`,
  `UserMenu.tsx:23`; origin 2026-08-04 navbar fix (consumers flagged out of
  scope); mechanism: role in localStorage-persisted Zustand written only by
  `login()` — valid cookie session + cleared localStorage → wrong role-gated UI;
  risk was promoted to HOT by recon 2026-08-11 (live mount on `/` via NavbarHome).
