# BIM-000-CYBER-PHARMA — THE MANAGER
## Stage Prep & Hygiene

> One module, one manager. Read this file and you know everything. Small module: brief and contract are folded in here per BIM_PLAYBOOK §4.

---

## 1. Status

**FINAL — stamped 2026-08-11 by JARVIS (Architect), approved by Tony (Coordinator).**
**Launch condition:** immediately launchable. First module of the Phase 3 campaign (map v1.0).
**Campaign journal:** PHASE_3_CAMPAIGN_JOURNAL.md is live; process friction gets reported in your handoff notes.

## 2. Mission

A clean, documented stage so no later Phase 3 module trips on residue — recon-verified cleanup only, zero feature work, zero schema work.

## 3. Verified Ground (build on WITHOUT re-verification; provenance: stark-recon report 2026-08-11 @ HEAD 6f6e63d, and Coordinator's live-DB catalog run 2026-08-11)

- V1. Repo `cyber-pharma-dev-v1-phase-3`, branch `phase-3-1`, HEAD `6f6e63d`; build passes (22 routes), tsc clean, jest fresh baseline **26 suites / 120 tests / 0 failures**, npm audit 0 vulns.
- V2. `sass` ^1.77.6 in package.json; **zero `.scss` files on disk** (recon find).
- V3. `stripe` ^22.1.0 in package.json; **zero `process.env.STRIPE_*` readers and zero SDK imports in `src/`** (recon grep). Six `STRIPE_*` keys exist in `.env.local` only.
- V4. `temp/ghl-example.json` exists; **zero `src/` references** (recon grep).
- V5. `NEXT_PUBLIC_API_BASE_URL` present in `.env.example` and `.env.local`; **consumed nowhere in `src/`** (recon grep).
- V6. Code consumes `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` (`moose-portal/layout.tsx:15`, `Navbar.tsx:49`); `.env.example` omits it.
- V7. tsconfig excludes `agent_docs/**` but NOT `_SKILLS/**`; `_SKILLS/` currently contains no `.ts` files.
- V8. README badge claims 118 tests / 25 suites; TESTING.md claims 117 / 25 — both stale vs V1's fresh 26/120.
- V9. Live Supabase baseline (Coordinator catalog, 2026-08-11): tables `public.user_roles`, `public.profiles`; policies exactly: `profiles` → "Profiles are updatable by owner or superadmins", "Profiles are viewable by owner or superadmins"; `user_roles` → "Users can read their own role". Interpretation (Architect): `setup.sql` base + `docs/migration_add_profiles.sql` overlay applied in sequence; migration's profile policies are live.
- V10. Grep predicates at baseline: 2 production `any` sites (`ui/command.tsx:35`, `utils/supabase/server.ts:6` = KIP-1), 0 `user_metadata` role smells in production, 5 numbered-color sites.

## 4. Rulings (decided; flag disagreement, don't silently deviate)

| # | Ruling | Authority |
|---|---|---|
| R1 | `stripe` dep + STRIPE env keys leave this repo. Payment Portal is a separate app (plan v2.0 §1); billing is Phase 7, there. | Coordinator, 2026-08-11 |
| R2 | Engineer NEVER touches `.env.local` (real secrets). Engineer edits `.env.example` only; Coordinator purges `.env.local` keys and rotates the Stripe secrets out-of-band. | Standing doctrine (placeholders-from-first-keystroke) |
| R3 | `phase2.md` recovery from the sibling repo is a **Coordinator prerequisite**, not Engineer scope (Engineer has no sibling-repo access). If Coordinator marks it unrecoverable, Engineer records that verdict in `agent_docs/DB_BASELINE.md`'s sibling note and AC3 closes on the documented verdict. | Architect, 2026-08-11 |
| R4 | Numbered-color reconciliation (5 sites) is **NOT this module's scope** — predicates must remain unchanged (V10). | Campaign map §1 |
| R5 | `/moose-portal` survives Phase 3 (CRV test-user provisioning tool). Its TODO markers stay. | Coordinator recon ruling #4 |
| R6 | `_SKILLS/**` joins the tsconfig exclude preemptively. | Coordinator recon ruling #5 |

## 5. TO VERIFY FIRST (your plan opens with these, each with file:line evidence)

- T1. Confirm V2/V3/V4/V5/V6 by fresh grep/find at your HEAD (the recon is one day old; working tree carried uncommitted protocol scaffold — re-pin the facts).
- T2. Confirm no OTHER consumer of `sass` exists (no `sassOptions` in next.config, no `.module.scss`, no scss imports).
- T3. Confirm removing `stripe` breaks no type imports (grep `from 'stripe'` / `from "stripe"` across repo incl. tests).
- T4. Pin current README badge line numbers + TESTING.md count line numbers for the doc corrections.

## 6. Scope

**IN:** remove `sass` + `stripe` from package.json (+ lockfile via install) · delete `temp/ghl-example.json` · remove `NEXT_PUBLIC_API_BASE_URL` from `.env.example` · add `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=false` (with one-line comment) to `.env.example` · add `_SKILLS/**` to tsconfig exclude · correct README + TESTING.md test counts to the live board's numbers at your HEAD · author `agent_docs/DB_BASELINE.md` recording V9 verbatim (tables, policies, interpretation, catalog date) as Phase 3's migration-chain starting truth.

**OUT (said loud):** anything under `src/` beyond zero files (this module writes NO application code) · `.env.local` (Coordinator-only, R2) · schema/SQL of any kind · numbered-color sites (R4) · `/moose-portal` (R5) · KIP-1's `server.ts` (parked; FORCED-ENTRY rule untriggered) · KIP-2 (that's FIX-001's mission) · phase2.md retrieval (R3, Coordinator).

## 7. Forbidden Zones (hard stops, path-level)

`src/**` (write-forbidden this module) · `.env.local` · `supabase/**` · `docs/setup.sql`, `docs/migration_add_profiles.sql` (read-only history) · `_SKILLS/**` contents (the tsconfig line references it; never edit inside) · git commands of any kind (git-zero standing doctrine).

## 8. Hard Gates (numbered; verification method attached)

- G1. `npm ls sass stripe` → both report "(empty)" / not found. [unit: command output in handoff]
- G2. Full triad green at SAME baseline: build passes, tsc clean, jest **26/120/0** (test counts unchanged — nothing this module does may alter test outcomes). [unit: command outputs]
- G3. `.env.example` ↔ code parity: every `NEXT_PUBLIC_*`/`SUPABASE_*` var consumed in `src/` present; zero dead vars. [unit: grep table in handoff]
- G4. `temp/ghl-example.json` absent; `git status` shows the deletion staged-ready for Coordinator. [manual: file listing]
- G5. tsconfig exclude contains `agent_docs/**` AND `_SKILLS/**`; tsc still clean. [unit]
- G6. README + TESTING.md counts match the G2 board exactly. [manual: quoted lines]
- G7. `agent_docs/DB_BASELINE.md` exists; its policy inventory is byte-faithful to V9's three policy names. [manual: Coordinator diff vs their own catalog output]
- G8. V10 grep predicates unchanged (2 any / 0 user_metadata-role / 5 numbered-color). [unit: grep counts]

## 9. Launch Procedure (Plan Mode — ONE message)

Your single plan message contains, in order: (1) T1–T4 verification results with file:line evidence; (2) the exact file-change list (path → change, one line each); (3) the command sequence (installs, greps, test runs) you will execute; (4) any conflict between this manager and disk, FLAGGED — you do not resolve it. The folder freezes at your launch. Await "plan approved" before building.

## 10. Definition of Done

All gates G1–G8 green → `ACCEPTANCE_SPEC.md` finalized with evidence per AC → handoff: per-concern file lists + suggested commit messages (zero git by you) → `RETROSPECTIVE.md` written (what fought back) → STOP. Coordinator then: commits per concern, purges/rotates `.env.local` Stripe keys (R2), executes the phase2.md verdict (R3), and Gate Q engages Sol on the spec.

## 11. The Operator Launch Line

**"Claudy — read BIM-000-CYBER-PHARMA/CLAUDE.md and enter Plan Mode."**

---

*Manager flips to CLOSED with a deliverables map at module close. Until then: this is the only order sheet.*
