# RETROSPECTIVE — FIX-001-CYBER-PHARMA
## KIP-2 Kill (+F02) · Engineer close, 2026-08-27

> What fought back, what the next module should know, amendment-kit friction included.

---

## What fought back

1. **Radix dropdowns don't open on `fireEvent.pointerDown` in jsdom.** The
   UserMenu suite's two dropdown tests failed on first run — jsdom has no real
   pointer events, and Radix's trigger ignored the synthetic pointerdown.
   Cure: keyboard activation (`fireEvent.keyDown(trigger, { key: "Enter" })`),
   which Radix handles natively. **Pattern note for future suites:** test Radix
   menus via keyboard, or assert on synchronous render only (the existing
   Navbar suites already quietly follow this rule — none of them open the
   avatar dropdown).
2. **G1's letter vs the cured pattern's own grammar.** The gate says "zero
   `useAuthStore` reads (role/isAdmin/isMember or whole-store)" — but the
   gold-standard cured `Navbar.tsx:102` itself retains
   `useAuthStore.getState().logout()`. Interpreted action-invocation ≠ state
   read; flagged at plan time, Operator ratified keeping the logout call in
   MobileNav. **Doctrine suggestion for the amendment kit:** gate wording
   should say "state reads" explicitly when actions are sanctioned, so the
   grep method is unambiguous.
3. **Both nav variants are always mounted** (CSS-hidden, not conditionally
   rendered), so the old per-component auth listeners would have double-fired
   `router.refresh()` after the props conversion. Resolved with one new
   ~25-line `NavAuthRefresh.tsx` mounted once in NavbarHome — flagged at plan
   time as a file beyond the manager's literal list, Operator ratified.

## What went smoothly

- The manager's T1–T5 pre-verification list matched disk perfectly — zero
  drift between the 2026-08-27 stamp and execution same-day.
- The cured `profile/layout.tsx` → `Navbar` pattern transplanted cleanly to the
  redirect-free public case; `protectPage` correctly NOT reused (V5), raw
  `createClient` + `getUserRole` consumption instead.
- Board: 26/120 → **28/128**, zero existing tests touched — the delta is
  purely the new props-contract coverage (R4 table in the spec).

## Flagged consequence (as planned, worth restating)

`/` and `/access-denied` flipped ○→ƒ (static → dynamic) in the build output —
`cookies()` in the public layout makes the group per-request SSR. This is the
inherent cost of server-resolved identity on a public surface; the route count
stays 22.

## Amendment-kit / process friction (campaign journal is listening)

- The SEEDED spec's evidence slots for AC2/AC4 (Coordinator-eyes gates) have no
  "PENDING" convention — this module wrote "PENDING Coordinator walk" into the
  slots. If that's the pattern, the kit should name it (Engineer fills unit
  gates; manual gates get PENDING + walk-script pointer at engineering close).
- Branch+SHA "recorded at PRE-Q" field: engineering close happens pre-commit,
  so the field can only carry disk truth + a re-pin note. Kit could split it
  into "engineering-close disk state" and "PRE-Q pinned SHA".
