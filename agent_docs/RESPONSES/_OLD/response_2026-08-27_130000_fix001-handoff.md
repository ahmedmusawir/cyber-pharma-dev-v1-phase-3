# FIX-001-CYBER-PHARMA — ENGINEERING HANDOFF
**Date:** 2026-08-27 13:00 · **Branch:** phase-3-2 (base `8b260c1`, work uncommitted) · **Engineer gates G1/G3/G5/G6/G7 GREEN — G2/G4 await Coordinator eyes**

---

## Gate Board

| Gate | Requirement | Result |
|---|---|---|
| G1 | Zero store state reads in MobileNav/UserMenu | ✅ UserMenu: zero refs; MobileNav: logout action only (ratified) |
| G2 | KIP-2 repro walk passes in production mode | ⏳ **Coordinator walk — script below** |
| G3 | Triad green, delta documented | ✅ build 22 routes · tsc clean · jest **28/128/0** (+2 suites/+8 tests, both new — R4 table in spec) |
| G4 | Gate M (375px/desktop, both themes, 3 auth states) | ⏳ **Coordinator eyes — same session as G2** |
| G5 | F02 surgical | ✅ diff = exactly one comment line |
| G6 | Predicates + forbidden zones | ✅ 2 prod `any` / 0 user_metadata; `useAuthStore.ts` + `server.ts` byte-identical |
| G7 | KIP registry truth | ✅ KIP-2 → Closed w/ resolution + evidence; KIP-1 untouched |

## G2/G4 — THE COORDINATOR WALK (production mode)

```
npm run build && npm start        # http://localhost:3000
```

**G2 — the KIP-2 reproduction (per registry verification requirement):**
1. Log in as ADMIN → land on /owedbook.
2. DevTools → Application → Local Storage → delete `auth-store` (keep cookies!).
3. Navigate to `/` and hard refresh (Ctrl+Shift+R).
4. ✅ EXPECT: desktop avatar menu shows email + "admin" + **Admin portal** link; mobile (≤lg) hamburger shows **Admin portal** + Log out. (Pre-fix: wrong/role-less nav.)
5. Log out. Repeat 1–4 as MEMBER → EXPECT **OwedBook** link, never Admin portal.
6. Logged-out visitor on `/` → EXPECT Log in / Start free trial exactly as before.
7. Bonus (Sol's third state): while logged in as MEMBER, hand-edit localStorage `auth-store` role to "admin" → hard refresh `/` → EXPECT nav still shows MEMBER (props win; store is dead to these surfaces).

**G4 — Gate M:** at each state above, check 375px + desktop, light + dark themes. Cross-tab check: log out in a second tab → first tab's nav flips to logged-out within a moment (NavAuthRefresh).

## Per-Concern Commits (suggested — you run them, not me)

**Concern 1 — F01, the KIP-2 kill:**
```
git add "src/app/(public)/layout.tsx" src/components/global/NavbarHome.tsx src/components/global/MobileNav.tsx src/components/global/UserMenu.tsx src/components/global/NavAuthRefresh.tsx src/__tests__/global/MobileNav.test.tsx src/__tests__/global/UserMenu.test.tsx
git commit -m "fix(nav): server-resolved identity on public nav — KIP-2 kill (FIX-001)"
```

**Concern 2 — F02 comment fix:**
```
git add src/instrumentation.ts
git commit -m "docs(code): instrumentation comment cites .env.example (FIX-001 F02)"
```

**Concern 3 — registry + module close + protocol:**
```
git add agent_docs/ RECOVERY.md CHANGELOG.md
git commit -m "chore(protocol): FIX-001 engineering close — KIP-2 registry closure, spec evidence, retrospective, session logs"
```

## After your commits

1. Record branch + SHA in the spec's Branch+SHA field (PRE-Q re-pin note is there).
2. Run the G2/G4 walk; paste walk log into the spec's AC2/AC4 evidence slots.
3. PRE-Q per BIM-000 pattern → Sol's Gate Q (his package lands in `ACTIONS/FIX-001-CYBER-PHARMA/QA/`).

## Notes

- `/` and `/access-denied` flipped ○→ƒ (dynamic) — inherent to server-resolved identity, flagged and approved at plan time.
- Test board moved 26/120 → 28/128; delta is entirely the 2 new suites (spec AC3 table).
- P2 (ADMIN + MEMBER test identities) — moose-portal provisions if you need fresh ones.
