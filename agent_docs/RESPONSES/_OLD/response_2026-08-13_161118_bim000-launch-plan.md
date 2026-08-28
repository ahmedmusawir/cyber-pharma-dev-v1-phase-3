# BIM-000-CYBER-PHARMA — Launch Plan (Plan Mode, ONE message per manager §9)

**Date:** 2026-08-13 16:11 · **Branch:** phase-3-1 · **Status:** PENDING_APPROVAL

---

## (1) T1–T4 Verification Results — fresh at working tree

| # | Fact | Verdict | Evidence |
|---|---|---|---|
| T1/V2 | `sass` ^1.77.6 in dependencies | ✓ CONFIRMED | `package.json:39`; `find . -name "*.scss"` → 0 files |
| T1/V3 | `stripe` ^22.1.0, zero readers | ✓ CONFIRMED | `package.json:40`; grep STRIPE in src → only comment `src/instrumentation.ts:9`; 6 `STRIPE_*` key names present in `.env.local` (names-only grep, R2 respected) |
| T1/V4 | `temp/ghl-example.json` exists, unreferenced | ✓ CONFIRMED | `ls temp/` → 1125 bytes; grep "ghl-example" src/, package.json, next.config → 0 |
| T1/V5 | `NEXT_PUBLIC_API_BASE_URL` dead | ✓ CONFIRMED | present in `.env.example` + `.env.local`; grep src/ + next.config → 0 consumers |
| T1/V6 | `ENABLE_MOOSE_PORTAL` consumed, missing from example | ✓ CONFIRMED | `src/app/moose-portal/layout.tsx:15`, `src/components/global/Navbar.tsx:49`; `.env.example` → 0 |
| — | Full src env sweep | exactly 5 vars | `process.env.*` grep: SITE_URL(3), SUPABASE_URL(7), SUPABASE_PUBLISHABLE_KEY(5), SUPABASE_SECRET_KEY(4), ENABLE_MOOSE_PORTAL(2) — matches AC3 list exactly |
| T2 | No other sass consumer | ✓ CONFIRMED | no `sassOptions` in next.config; no `.module.scss`; sole "scss" string = comment `globals.css:118` |
| T3 | No stripe type imports | ✓ CONFIRMED | grep `from 'stripe'`/`require('stripe')` repo-wide incl. tests → 0 |
| T4 | Stale count lines pinned | ✓ | `README.md:8` (badge 118/25), `README.md:134` (table 118/25), `docs/TESTING.md:10` (117/25), `docs/TESTING.md:117` (117/25) |
| V7 | tsconfig exclude | ✓ CONFIRMED | `tsconfig.json:39-42` = node_modules + `agent_docs/**` only |
| V10 | Baseline predicates | ✓ re-pinned | 2 prod `any` (`ui/command.tsx:35`, `utils/supabase/server.ts:6`); 0 user_metadata role smells; numbered-color predicate → **exactly 5 hits** (see FLAG-2) |

## (2) File-Change List

| Path | Change |
|---|---|
| `package.json` + `package-lock.json` | remove `sass` + `stripe` via `npm uninstall sass stripe` |
| `temp/ghl-example.json` | DELETE (file only; empty `temp/` left for Coordinator) |
| `.env.example` | remove `NEXT_PUBLIC_API_BASE_URL` line; add `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=false` + one-line comment |
| `tsconfig.json` | exclude gains `"_SKILLS/**"` |
| `README.md` (L8 badge, L134 table) | counts → live triad board (expected 120 tests / 26 suites) |
| `docs/TESTING.md` (L10, L117) | same correction |
| `agent_docs/DB_BASELINE.md` | CREATE — V9 verbatim: tables `public.user_roles` + `public.profiles`; policies byte-faithful ("Profiles are updatable by owner or superadmins", "Profiles are viewable by owner or superadmins", "Users can read their own role"); interpretation setup.sql base + migration overlay; catalog date 2026-08-11; R3 sibling-note placeholder |
| `ACTIONS/BIM-000.../ACCEPTANCE_SPEC.md` | finalize evidence per AC1–AC9 |
| `ACTIONS/BIM-000.../RETROSPECTIVE.md` | CREATE at close |
| `CHANGELOG.md` | [CC] entry |
| session file + `RECOVERY.md` | protocol bookkeeping (incl. FLAG-4 path fix) |

**Zero writes:** `src/**`, `.env.local`, `supabase/**`, `docs/*.sql`, `_SKILLS/**`. **Zero git.**

## (3) Command Sequence

1. `npm uninstall sass stripe` (rewrites package.json + lockfile)
2. `npm ls sass && npm ls stripe` → G1 evidence
3. `rm temp/ghl-example.json` → G4
4. Edits: `.env.example`, `tsconfig.json`, `README.md`, `docs/TESTING.md`
5. `npm ci` → AC1 lockfile-consistency proof
6. `npm run build` · `npx tsc --noEmit` · `npm test` → G2 triad (expect 26/120/0)
7. G8 predicate greps (2 any / 0 user_metadata / 5 numbered-color)
8. Author `DB_BASELINE.md` → finalize `ACCEPTANCE_SPEC.md` → `RETROSPECTIVE.md` → handoff manifest (per-concern file lists + suggested commit messages)

## (4) FLAGS — conflicts surfaced, NOT resolved

- **FLAG-1:** `PHASE_3_CAMPAIGN_JOURNAL.md` — manager §1 calls it "live"; **not found on disk** (find, maxdepth 3). Handoff friction notes have no destination. Coordinator: supply path or create.
- **FLAG-2:** V10's "5 numbered-color sites" is a **grep artifact**. The recon predicate (`slate-|zinc-|gray-|red-[56]|green-6|blue-6|purple-6|amber-6`) reproduces exactly 5 hits, but 4 match `tran**slate**-`/`**slide**-` substrings and the 5th is the comment banning numbered colors (`globals.css:10`). Real numbered-color utility count: **0**. G8 passes as written; the campaign map's SP-close predicate should be rebuilt eventually.
- **FLAG-3:** `src/instrumentation.ts:5` comment cites `.env.local.example`; the actual file is `.env.example`. src write-forbidden this module — flag only.
- **FLAG-4:** Operator renamed `agent_docs/recon/` → `agent_docs/RECON/`; RECOVERY.md + session_2026-08-11 cite the old lowercase path. Will fix RECOVERY.md's pointer at close (protocol file, in scope).

→ Awaiting "plan approved" before building.
