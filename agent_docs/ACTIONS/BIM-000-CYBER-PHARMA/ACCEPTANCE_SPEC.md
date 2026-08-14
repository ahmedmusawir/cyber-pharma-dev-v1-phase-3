# ACCEPTANCE_SPEC — BIM-000-CYBER-PHARMA
## Stage Prep & Hygiene

**Owning app:** CYBER-PHARMA (Cyber Pharma v1, repo `cyber-pharma-dev-v1-phase-3`)
**Status:** FINALIZED with evidence by Engineer 2026-08-13 (all AC1–AC9 evidenced; no requirement added/removed/weakened/redefined). Prerequisites P1–P3 remain Coordinator-side and unverified by Engineer. Awaiting Gate Q (Sol).
**Objective:** recon-verified residue removed; env contract truthful; docs match the live board; the DB migration-chain starting truth recorded.

## Scope

**IN:** dependency removals (sass, stripe) · `temp/ghl-example.json` deletion · `.env.example` parity fixes · tsconfig `_SKILLS/**` exclude · README/TESTING.md count corrections · `agent_docs/DB_BASELINE.md` authorship.
**OUT:** all `src/` writes · `.env.local` · any SQL/schema · numbered-color sites · moose-portal · KIP-1 · KIP-2.

## Prerequisites (Coordinator setup, before Gate Q execution)

- P1. Coordinator has committed the module's changes per concern to branch `bim-000-cyber-pharma`.
- P2. Coordinator has purged the six `STRIPE_*` keys from `.env.local` and rotated those secrets out-of-band (R2) — QA verifies absence by Coordinator attestation, not by reading the file.
- P3. Coordinator has executed the phase2.md verdict (recovered into `agent_docs/`, or ruled unrecoverable) per R3.

## Acceptance Requirements

- **AC1** — `npm ls sass` and `npm ls stripe` both return not-installed; `package.json` contains neither; lockfile consistent (`npm ci` clean).
  *Evidence (Engineer, 2026-08-13):* `npm ls sass stripe` → `└── (empty)`. `grep -c '"sass"\|"stripe"' package.json` → 0. `npm ci` → "added 832 packages, and audited 833 packages in 17s … found 0 vulnerabilities". Post-ci: `ls node_modules/sass node_modules/stripe` → both "No such file or directory". NOTE: `npm uninstall` alone left `sass@1.77.8` installed as next's optional peer; the `node_modules/sass` node was removed from package-lock.json (optional peers may be absent) and `npm ci` validated the result clean.
- **AC2** — Full triad green at unchanged baseline: `npm run build` passes; `tsc --noEmit` clean; jest **26 suites / 120 tests / 0 failures**.
  *Evidence:* build → 22 routes emitted, exits clean; `npx tsc --noEmit` → no output (clean); `npm test` → "Test Suites: 26 passed, 26 total · Tests: 120 passed, 120 total · Time: 4.356 s".
- **AC3** — `.env.example` ↔ code parity holds: contains every env var `src/` consumes (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL`); contains zero vars `src/` does not consume (`NEXT_PUBLIC_API_BASE_URL` and all `STRIPE_*` absent).
  *Evidence:* full `process.env.*` sweep of `src/` + `next.config` + proxy → exactly 5 vars consumed: SITE_URL (3 sites), SUPABASE_URL (7), SUPABASE_PUBLISHABLE_KEY (5), SUPABASE_SECRET_KEY (4), ENABLE_MOOSE_PORTAL (2 — `moose-portal/layout.tsx:15`, `Navbar.tsx:49`). Final `.env.example` contains exactly those 5 keys; `NEXT_PUBLIC_API_BASE_URL` and `STRIPE_*` absent. Sol's probe pre-answered: `next.config` and `src/proxy.ts` consume no additional env vars (same sweep covered them); `src/instrumentation.ts` REQUIRED_ENV list = 4 of the 5 (MOOSE_PORTAL optional by design).
- **AC4** — `temp/ghl-example.json` does not exist on disk.
  *Evidence:* `rm temp/ghl-example.json`; `ls -la temp/` → empty dir (dir itself left for Coordinator's call); `git status` → `D temp/ghl-example.json`.
- **AC5** — `tsconfig.json` exclude array contains both `agent_docs/**` and `_SKILLS/**`; tsc remains clean.
  *Evidence:* tsconfig.json:39–43 → `"exclude": ["node_modules", "agent_docs/**", "_SKILLS/**"]`; `npx tsc --noEmit` after the edit → clean.
- **AC6** — README test badge and TESTING.md counts equal the AC2 board's numbers exactly.
  *Evidence:* README.md:8 badge `Jest-118%20passed%20%2F%2025%20suites` → `Jest-120%20passed%20%2F%2026%20suites`; README.md:134 `(118 tests / 25 suites)` → `(120 tests / 26 suites)`; TESTING.md:10 `25 test suites, 117 passing tests` → `26 test suites, 120 passing tests`; TESTING.md:117 `(117 / 25)` → `(120 / 26)`. AC2 board = 26/120 ✓ exact match.
- **AC7** — `agent_docs/DB_BASELINE.md` exists and records, byte-faithful: the two live tables, the three live policy names, the setup.sql+profiles-migration interpretation, and the catalog date 2026-08-11.
  *Evidence:* file created 2026-08-13; records `public.user_roles` + `public.profiles`; policies verbatim: "Profiles are updatable by owner or superadmins", "Profiles are viewable by owner or superadmins", "Users can read their own role"; interpretation = setup.sql base + migration_add_profiles.sql overlay; catalog date 2026-08-11; R3 sibling note = PENDING Coordinator verdict. Coordinator to diff against own catalog paste at Gate Q.
- **AC8** — Baseline grep predicates unchanged: production `any` count = 2 (`ui/command.tsx`, `utils/supabase/server.ts`); `user_metadata` role smells in production = 0; numbered-color sites = 5.
  *Evidence:* post-change greps → `any`: exactly 2 (`ui/command.tsx:35`, `utils/supabase/server.ts:6`); `user_metadata` role: 0; numbered-color predicate (recon-original pattern): 5. All three match baseline. FLAG (not a deviation): 4 of the 5 numbered-color hits are `translate-`/`slide-` substring artifacts, 5th is the globals.css:10 comment — real numbered-color utility count is 0; predicate left as-is per R4.
- **AC9** — Zero writes under `src/**`; zero git commands executed; handoff includes per-concern file lists + suggested commit messages.
  *Evidence:* `git status --short` (read-only) shows no `src/**` entries — modified: `.env.example`, `README.md`, `docs/TESTING.md`, `package.json`, `package-lock.json`, `tsconfig.json`, protocol files; deleted: `temp/ghl-example.json`; new: `agent_docs/DB_BASELINE.md`, module docs. Zero mutating git commands run (status/diff read-only only). Handoff manifest with per-concern commits: `agent_docs/RESPONSES/response_2026-08-13_163000_bim000-handoff.md`.

## QA Notes (for Sol)

This is a hygiene module: the attack surface is *omission and side-effect*, not features. Highest-value checks: (a) AC2/AC8 prove the removals changed nothing at runtime; (b) AC3's parity table is the env contract's new ground truth — probe it for a var the Engineer's grep might have missed (e.g., vars consumed in `next.config`, `proxy.ts`, or scripts, not just `src/`); (c) AC7 against the Coordinator's own catalog paste, not the Engineer's transcription.

## Verdict

*(Sol, Factory five-word vocabulary)*: __________
