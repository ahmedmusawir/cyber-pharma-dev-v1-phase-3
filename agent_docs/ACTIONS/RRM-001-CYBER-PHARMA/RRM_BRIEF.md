# RRM-001-CYBER-PHARMA — Removal — Brief

**Version:** 1.0 · 2026-09-20 · **Architect:** Fable · **Director approval:** D1, D2 (2026-09-20) · **Campaign:** RRM_CAMPAIGN_MAP v1.0 §4
**Baseline:** `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` · **Branch:** `phase-3-rrm001` · **Ledger rows:** R-001 (accept by removal), R-002 (accept), R-011 (N/A by removal), R-012 (accept, reconciled per E-04)

## Why this module exists

Both reviews agreed the Moose portal's five user-admin Server Actions run with service-role credentials and never check the caller; recon confirmed it on current disk. Public signup shares the same origin (starter kit) and feeds a live trigger that trusts signup metadata for role. The Director ruled: delete both, prove they are unreachable, keep every real auth path for existing users intact. This is Engine 2 work on a completed FFM surface; its certificate covers this scope only.

## Inputs and reconciliation

| Input | Specimen | Current-source status | Limits |
|---|---|---|---|
| Fable F1, F2, F11, F12 | sibling repo, `f1113177` | Re-verified on disk (recon R2) | commit not in this repo |
| Astra A-001, A-007 | Git-free export | Re-verified on disk (recon R2) | no compiled HTTP demonstration |
| Recon Rev 2 R1/R2/R9 | this repo `5f45fb3` | basis of record | read-only + controlled build |
| Director evidence | dev DB `pg_get_functiondef`, 2026-09-20 | installed trigger assigns role from metadata | containment is DA-2, not this module |

## Approved work and boundaries

**Accepted:** delete `src/app/moose-portal/**` · delete `src/app/api/auth/signup/**` · delete `src/components/auth/RegisterForm.tsx` and any signup-only component/test the Plan Mode trace proves has no other consumer · `/auth` becomes login-only (no register tab/form/link; if the tabs wrapper is now single-tab, simplify it rather than leave a dead tab) · remove `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` wiring (`src/components/global/Navbar.tsx:49`) and the key from `.env.example` · remove the `GET` handler in `src/app/api/auth/login/route.ts` (R-002) · delete `src/app/moose-portal/_lib/admin.ts`; retain `src/utils/supabase/admin.ts` with a header comment citing ledger E-04 (blessed, zero app importers, fenced to seeding/system jobs) · delete signup/Moose-only tests · one-line "removed in RRM-001 (2026-09-20)" notes in `README.md`, `agent_docs/KIP_REGISTRY.md` and any governing doc that still directs a reader to either tool (historical module folders, journals, reviews, recon are immutable and untouched).

**Preserved behavior / invariants:** existing-user login (`POST /api/auth/login`), logout, session refresh (`src/proxy.ts`, `middleware.ts`), `GET /api/auth/confirm` (OTP/magic-link callback used by recovery), profile password update, `protectPage` and its tests, Navbar Law + FIX-001 state, `src/app/(admin)/**` byte-identical, OwedBook untouched, adminDemo service/mocks byte-identical, `OwedBookService` untouched.

**Allowed files / surfaces:** exactly the deletion/edit list above, plus `src/__tests__/**` for removed tests and any test that referenced a removed module, plus this pack's `EXECUTION_LOG.md`, `QA_HANDOFF.md`, `evidence/**`.

**Forbidden:** any edit to `src/app/owedbook/**`, `src/services/**`, `src/mocks/**`, `src/components/owedbook/**`, `src/components/common/**`, `supabase/**`, `scripts/**`, `package.json`/lockfile, `next.config.js` (RRM-003/004 own those) · adding authorization to Moose · any new registration path · touching `.env.local`, `RECOVERY.md`, `agent_docs/SESSIONS/**`.

**Business decisions resolved:** D1, D2, E-04. **Open, not blocking:** none for this module.

**Permitted tooling / environment:** local `node_modules` (present); `next build` and `next start` (or standalone) with placeholder Supabase env for the 404 matrix; tsc/eslint/jest. No `npm install`. No live Supabase call in engineering. Real-auth login walk is QA's (SOL decides project; Director authorizes SCRATCH if used).

**Restoration:** stop local servers; placeholder env scoped to the command; `.next/` gitignored.

## Stages

| Stage | Objective | Allowed work | Checks | Stop condition |
|---|---|---|---|---|
| **S0 Plan Mode** (P1) | Consumer trace for every deletion; KEEP list with proof; admin-client reconciliation; contradictions | Read-only; write `evidence/S0_PLAN.md` | none | Director approves plan; any RULINGS_ADDENDUM rows ruled |
| **S1 Moose removal** | R-001, R-012 | delete `src/app/moose-portal/**`; flag wiring; `.env.example`; tests; header on `utils/supabase/admin.ts`; docs notes | tsc · eslint · jest (zero skipped) · build (route table) · 404 matrix both flag states · greps AC-2xx | shared consumer S0 missed → stop |
| **S2 Signup removal + login probe** | D1, R-002, R-011 | delete `api/auth/signup/**`, `RegisterForm.tsx`, signup-only components/tests; `/auth` login-only; `GET` handler removed; docs notes | tsc · eslint · jest · build · curl `POST /api/auth/signup` → 404, `GET /api/auth/login` → 404/405 · greps AC-1xx · preserved-path diff empty | any auth behavior change beyond removal → stop |
| **P3 Handoff** | all ACs claimed | `EXECUTION_LOG.md` complete; `QA_HANDOFF.md`; `evidence/repair.diff`, `changed_files.txt`; QA governing snapshot copied to `QA/GOVERNING/` | full board recorded | — |

Each stage ends green, reported, and committed by the Director before the next.

## Distinct evidence items (recorded together, never conflated)

1. **Application removal** — this module's engineering + QA evidence.
2. **Supabase "Allow new users to sign up" = OFF** — Director action DA-2; evidence file `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` (redacted curl + login confirmation). Containment.
3. **Permanent `handle_new_user` correction** — **not performed here**; BIM-004 pre-flight rider CE-2; verified at APPLY SESSION.

## Handoff and exit

Claudy delivers candidate SHA, repair diff, execution log, the unchanged acceptance spec and evidence. Director cuts `qa/phase-3-rrm001`. SOL plans, Cody executes (incl. the 404 matrix from a fresh build and the real-auth login walk), repairs on the QA line, SOL certifies Gate Q, bounded cleanup, Architect closeout prompt, Claudy closeout, Director `--no-ff` merge + push, journal entries. Deployment/Gate D: outside this module.
