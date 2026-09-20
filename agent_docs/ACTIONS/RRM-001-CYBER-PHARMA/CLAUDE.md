# RRM-001-CYBER-PHARMA — Removal — Engineer Front Door

**Status:** Director-approved scope (D1, D2, D6; ledger R-001, R-002, R-011, R-012; errata E-01, E-02, E-04). Executable after DA-1 (branch rename), DA-3 (pack committed), DA-4 (clean tree) and Director approval of the Plan Mode output.
**Architect:** Fable · **Engineer:** Claudy · **QA Lead:** SOL · **QA Executor:** Cody · **Director:** Tony
**Repo:** `cyber-pharma-dev-v1-phase-3` · **Baseline:** `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` (== `main` at recon, post BIM-003 merge `f7a1d4c`)
**Engineering branch:** `phase-3-rrm001` · **QA branch (Director-cut after P3):** `qa/phase-3-rrm001`
**Pack folder:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/` · **Campaign:** `RRM_CAMPAIGN_MAP_v1_0.md` §4

## Mission

Public self-registration and the Moose portal are starter-kit tools kept to create test users. They are being **removed**, not hardened. When you are done, the privileged Server Actions and the signup endpoint no longer exist, cannot be reached by old URL in either flag state, and cannot be invoked directly; and every existing user still logs in, moves around and logs out exactly as before.

## Read in order

1. `agent_docs/` governing instructions · `PHASE_3_BIM_CAMPAIGN_MAP.md` (+ CE-1…4 once staged) · `RRM_CAMPAIGN_MAP_v1_0.md` §2–§4
2. `AUTHORITY_POINTER.md` (which rulings and ledger rows bind this pack)
3. `RRM_BRIEF.md`
4. `ACCEPTANCE_SPEC.md`
5. `CLAUDY_PROMPTS.md`
6. Evidence inputs: `agent_docs/RECON/RRM001_RECON_2026-09-18.md` R1, R2 (Moose, admin clients, login GET, RegisterForm), R9 (flag consumers); `agent_docs/FABLE_CODE_REVIEW.md` F1/F2/F11/F12; `agent_docs/ASTRA_CODE_REVIEW.md` A-001/A-007

Report contradictions before writing. Disk is the fact; the contract gets a `RULINGS_ADDENDUM.md` row — you do not silently pick one.

## Rules of the road

- Removal only. No authorization added to code that is being deleted. No new signup route. No Moose under another name. No changes to OwedBook, Admin Portal, services, mocks, migrations or harness.
- Trace consumers before deleting anything; shared auth infrastructure stays (see Preserved).
- Read-only Git is fine. Mutating Git, Supabase dashboard, live database: Tony. Every stage ends with a **GIT REMINDER** (changed/uncommitted paths + suggested dated commit line). One terminal step per message when the Director must run something. Full file paths. YOU / CLAUDY / SOL labels.
- Plan Mode first (P1). No build until the Director approves. `EXECUTION_LOG.md` as you go. At completion, hand `EXECUTION_LOG.md` + the unchanged `ACCEPTANCE_SPEC.md` + `QA_HANDOFF.md` to SOL (P3). You do not certify QA. During QA you act only on an approved repair instruction (P4) on `qa/phase-3-rrm001`.
- Placeholder Supabase env only for any local build/serve; never real keys in the shell; `.env.local` untouched; no `> tracked_file` redirects (temp-then-move).

## Preserved (must be byte-identical or test-green at handoff)

`src/proxy.ts` · `src/utils/supabase/middleware.ts` · `src/utils/supabase/actions.ts` (`protectPage`) · `src/app/api/auth/login/route.ts` **POST** handler · `src/app/api/auth/logout/**` · `src/app/api/auth/confirm/**` · `src/app/(auth)/layout.tsx` · `src/app/profile/**` · `src/components/global/Navbar.tsx` except the flag wiring at `:49` · `NavbarHome`, `MobileNav`, `UserMenu` (FIX-001 state) · `src/app/(admin)/**` · `src/app/owedbook/**` · `src/services/**` · `src/mocks/**` · `src/components/owedbook/**` · `src/components/common/**` · `supabase/migrations/**` · `scripts/**` · `src/instrumentation.ts`.

## Protected (never touch)

`RECOVERY.md` · `agent_docs/SESSIONS/**` · `agent_docs/ACTIONS/BIM-*`, `FIX-001`, `PROTO06` (history) · `.env.local`.
