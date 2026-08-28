# FIX-001-CYBER-PHARMA — THE MANAGER
## KIP-2 Kill: Stale-Persist Role on the Public Nav (+F02 ride-along)

> One module, one manager. FIX grammar per BUG_FIX_PLAYBOOK v0.1 + amendment kit (the kit is the active record — this module is also the first live test of that state; report any doctrine friction in your handoff for the campaign journal).

---

## 1. Status

**🔒 CLOSED — Gate Q PASS, 2026-08-27 (Sol). KIP-2 cured, zero rework. MOVE FORWARD.**
_(History: FINAL — stamped 2026-08-27 by JARVIS; launched same day on `phase-3-2`
via the Operator launch line; engineering complete 13:00 (gates G1/G3/G5/G6/G7);
Coordinator walk + Sol's independent Gate Q attack same day — all AC1–AC7 PASS.
Process note: Gate Q ran on the working tree at base `8b260c1`; the Coordinator's
single close-out commit is the certified SHA of record.)_

### Deliverables Map (module close)

| Concern | Deliverables |
|---|---|
| F01 — KIP-2 kill | `(public)/layout.tsx` (redirect-free server identity resolver) · `NavbarHome.tsx` (props + listener mount) · `MobileNav.tsx` / `UserMenu.tsx` (props render, store role reads gone) · NEW `NavAuthRefresh.tsx` (single cross-tab listener) |
| F01 tests | NEW `src/__tests__/global/MobileNav.test.tsx` + `UserMenu.test.tsx` (props contract, 3 auth states) — board 26/120 → **28/128** |
| F02 | `src/instrumentation.ts:5` — one comment line (`.env.example`) |
| Registry | `agent_docs/KIP_REGISTRY.md` — KIP-2 → Closed w/ resolution + evidence; KIP-1 still parked |
| Module package | `ACCEPTANCE_SPEC.md` (QA-VERIFIED, verdict stamped) · `RETROSPECTIVE.md` · `QA/GATE_Q_REPORT_FIX-001-CYBER-PHARMA.md` (PASS) |
| Handoff records | `agent_docs/RESPONSES/response_2026-08-27_114500_fix001-plan.md` · `…_130000_fix001-handoff.md` (walk script + commit suggestions) |

**Routed out of this module:** **QA-FINDING-001** (dark-mode login branding text
contrast — minor visual/a11y, out of FIX-001 contract) → Architect routes to the
findings ledger; NOT fixed here. **Carried process notes** (retrospective → campaign
journal / amendment harvest): jsdom/Radix keyboard-activation pattern; G1 "state
reads" gate-wording; PENDING-slot convention for Coordinator-eyes gates; pre-commit
vs Gate Q ordering (P1) honored-in-the-breach this run.

## 2. Mission

Role-gated UI on the public landing nav becomes server-resolved, killing the live KIP-2 defect window; one stale comment rides along.

## 3. Diagnosis (why this module exists — the named mechanism)

`role` lives in localStorage-persisted Zustand state (`auth-store`), written ONLY by `login()`. A valid Supabase cookie session with cleared/absent localStorage (new browser, new device, cleared site data) leaves `role: null` while authenticated. `MobileNav` and `UserMenu` read that persisted role — and both are mounted on the LIVE public landing page via `NavbarHome` — so an authenticated user in that state gets wrong role-gated nav UI on `/`. This is the exact bug class that hit the primary Navbar on 2026-08-04 (cured there by server-resolved identity props); these two consumers were flagged out of that fix's scope, KIP-2 parked them, and recon 2026-08-11 met the promotion trigger (live mount). The cure is the Navbar Law: **identity is server-resolved and passed as props, never gated on client-persisted state.**

**F02 ride-along (ratified in-scope):** `src/instrumentation.ts:5` comment cites `.env.local.example`; the real file is `.env.example`. One-line comment fix, bundled because this module opens `src/` (BIM-000 FLAG-3 → adjudicated here; per bundling doctrine each finding keeps its own gate).

## 4. Verified Ground (provenance: stark-recon 2026-08-11 · KIP_REGISTRY.md restored 2026-08-11 · BIM-000 Gate Q PASS 2026-08-14)

- V1. Consumers: `src/components/global/MobileNav.tsx:22` and `src/components/global/UserMenu.tsx:23` — both `useAuthStore((s) => s.role)`.
- V2. Mount chain: `NavbarHome.tsx:3,5` imports both; `src/app/(public)/layout.tsx:2` mounts NavbarHome on the public group (marketing/landing).
- V3. Root cause file: `src/store/useAuthStore.ts` — persist name `auth-store`; `role` written only by `login()`. Store is properly typed; `isAdmin`/`isMember` derived; no `isSuperadmin`.
- V4. Kit primitives (the sanctioned identity source): server `supabase.auth.getUser()` (pattern at `src/utils/supabase/actions.ts:8-14` inside `protectPage`) and `getUserRole(userId)` → `public.user_roles` (`src/utils/get-user-role.ts:11`). DB is role truth.
- V5. `protectPage` REDIRECTS unauthenticated users — therefore it is NOT usable on the public layout (logged-out visitors are legitimate there). Identity resolution on the public layout must be redirect-free.
- V6. The primary `Navbar` (authed shell) already receives server-resolved identity props — the proven in-repo pattern to mirror.
- V7. Baseline board: build green (22 routes) · tsc clean · jest 26/120/0 · predicates 2 prod `any` / 0 `user_metadata` role smells.
- V8. KIP-1 (`server.ts` cookie adapter) FORCED-ENTRY trigger: this module does NOT touch `src/utils/supabase/server.ts` — KIP-1 stays parked. Creating a server client via existing utilities is consumption, not modification.

## 5. Per-Fix Design (rulings made; flag disagreement, don't silently deviate)

**F01 — KIP-2 kill:**
- R1. `src/app/(public)/layout.tsx` becomes the identity resolver: server-side, redirect-free — resolve `user` (may be null) and, when present, `role` via `getUserRole`. Pass down as props: `NavbarHome` → `MobileNav` / `UserMenu`.
- R2. Both consumer components drop their `useAuthStore` role reads entirely and render from props. Logged-out visitors (`user = null`) render the logged-out nav exactly as today.
- R3. `useAuthStore` itself is NOT rewritten this module — the store survives for the login flow; the fix fences the last stale-persist *consumers*, per the standing ruling (deeper store rework is Phase 7's if ever). No new global state, no context providers.
- R4. Tests referencing the two components may be updated to the props contract; test-count changes are permitted but must be documented in the spec (board green is the law, not the frozen count — BIM-000's frozen-count rule was hygiene-specific).

**F02 — comment fix:** `src/instrumentation.ts:5` comment string corrected to `.env.example`. Zero behavior change.

## 6. TO VERIFY FIRST (your ONE plan message opens with these, file:line evidence each)

- T1. Re-pin V1/V2 at your HEAD (exact read sites, import chain, mount).
- T2. Enumerate EVERY consumer of `useAuthStore` role/`isAdmin`/`isMember` repo-wide — confirm MobileNav + UserMenu are the ONLY remaining stale-persist readers (the primary Navbar excluded per V6). If more exist: FLAG, don't expand scope silently.
- T3. Confirm the public layout's current shape (server vs client component; what it renders) and the props path to both consumers.
- T4. Identify all test files touching MobileNav/UserMenu/NavbarHome and their store-mock patterns.
- T5. Pin `instrumentation.ts:5` current text.

## 7. Scope

**IN:** `(public)/layout.tsx` identity resolution · props threading through `NavbarHome` → `MobileNav` + `UserMenu` · removal of their store role reads · associated test updates · `instrumentation.ts:5` comment (F02) · KIP_REGISTRY update at close (KIP-2 → Closed with resolution line).
**OUT (said loud):** `useAuthStore.ts` internals (R3) · `src/utils/supabase/server.ts` (KIP-1 parked, V8) · the authed-shell `Navbar` (already cured) · `moose-portal` · any schema/SQL · numbered-color sites · new state libraries/providers.

## 8. Forbidden Zones (path-level)

`src/store/useAuthStore.ts` (read-only) · `src/utils/supabase/server.ts` · `supabase/**` · `.env.local` · `_SKILLS/**` · git commands (git-zero).

## 9. Hard Gates (each mapped to reproduction; verification method attached)

- G1. Grep: zero `useAuthStore` reads (role/isAdmin/isMember or whole-store) in `MobileNav.tsx` + `UserMenu.tsx`. [unit: grep output]
- G2. **The KIP-2 reproduction walk, now passing (the registry's own verification requirement):** production mode (`npm run build && npm start`) — login as ADMIN → clear localStorage (keep cookies) → hard refresh `/` → nav renders correct ADMIN state; repeat as MEMBER; logged-out visitor unchanged. [manual: Coordinator eyes, evidence = walk log]
- G3. Triad green: build · tsc · full jest; any test-count delta from 26/120 documented with reason per R4. [unit]
- G4. Gate M: public nav correct at 375px AND desktop, both themes, all three auth states (admin / member / logged-out). [manual: Coordinator eyes]
- G5. F02: `instrumentation.ts:5` cites `.env.example`; zero other diff in that file. [unit: diff]
- G6. Predicates: prod `any` = 2, `user_metadata` role smells = 0 (unchanged). [unit: grep]
- G7. KIP_REGISTRY.md: KIP-2 moved to Closed with resolution + evidence pointer; KIP-1 untouched and still parked. [manual]

## 10. Launch Procedure (Plan Mode — ONE message)

(1) T1–T5 evidence · (2) exact file-change list · (3) test-update plan (which files, what changes, expected board) · (4) command sequence · (5) any disk-vs-manager conflict FLAGGED. Folder freezes at your launch. Await "plan approved."

## 11. Definition of Done

G1–G7 green → `ACCEPTANCE_SPEC.md` finalized with evidence → handoff (per-concern file lists + suggested commit messages; zero git) → `RETROSPECTIVE.md` (what fought back, incl. any amendment-kit doctrine friction — the campaign journal is listening) → STOP. Then: Coordinator commits, PRE-Q on working tree per the BIM-000 pattern, Sol's Gate Q (his package lands in this folder's `QA/`), verdict, close, tombstone.

## 12. The Operator Launch Line

**"Claudy — read FIX-001-CYBER-PHARMA/CLAUDE.md and enter Plan Mode."**

---

*On close this manager flips to CLOSED with a deliverables map. KIP-2 dies where it was born — on the record.*
