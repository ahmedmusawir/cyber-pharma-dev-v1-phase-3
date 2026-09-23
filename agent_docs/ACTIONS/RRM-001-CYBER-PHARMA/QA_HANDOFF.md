# RRM-001-CYBER-PHARMA — QA Handoff

Engineer: Claudy · QA Lead: SOL · Executor: Cody · Director: Tony · Assembled at P3, 2026-09-20 18:34. **Every line is a claim for independent verification.**

## Contract and authority

- Brief: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RRM_BRIEF.md` (v1.0)
- Acceptance spec: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` (v1.0) — **text unchanged since freeze**: `git diff --stat 88e2c33..4965c0c -- agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` is empty (same for `RRM_BRIEF.md`, `CLAUDE.md`, `CLAUDY_PROMPTS.md`, `AUTHORITY_POINTER.md`). Its erratum lane is empty; all post-freeze rulings are in the addendum.
- Authority pointer: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/AUTHORITY_POINTER.md`
- Addendum: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` — rows **A-01 … A-12, OBS-1, OBS-2** (14 rows, one table, each ID once). Read the ACs *with* these: A-03 narrows AC-303 · A-04 + A-12 redefine the AC-103 pass test · A-05 lists the AC-106 exception · A-08 defines "flag unset" and the server · A-09 lists the AC-203 exceptions · A-10 moves plans/reports to `agent_docs/RESPONSES/` · A-11 adds AC-103b.
- Ledger resolution rows appended for R-001, R-002, R-011, R-012 in `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md`: **yes** (candidate SHA, evidence paths, ACs claimed; "Independent check" and "Final disposition" left empty for SOL / closeout).

## References

- Source reviews and recon: `agent_docs/FABLE_CODE_REVIEW.md` · `agent_docs/ASTRA_CODE_REVIEW.md` · `agent_docs/RECON/RRM001_RECON_2026-09-18.md`
- Engineering reports: S0 plan `agent_docs/RESPONSES/response_2026-09-20_155547_rrm001-s0-plan.md` · S1 `agent_docs/RESPONSES/response_2026-09-20_180124_rrm001-s1-result.md` · S2 `agent_docs/RESPONSES/response_2026-09-20_182509_rrm001-s2-result.md` · A-12/OBS-1 note `agent_docs/RESPONSES/response_2026-09-20_181908_rrm001-a12-obs1.md` · this handoff `agent_docs/RESPONSES/response_2026-09-20_183418_rrm001-p3-handoff.md`
- Execution log and evidence: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S1_404_matrix.txt` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S1_action_ids.txt` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S1_greps.txt` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S2_404_matrix.txt` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S2_greps.txt` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/repair.diff` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/changed_files.txt`
  - The template's `evidence/S0_PLAN.md` does **not** exist by ruling A-10 — the plan is `agent_docs/RESPONSES/response_2026-09-20_155547_rrm001-s0-plan.md`.

## Identity

- Repo `cyber-pharma-dev-v1-phase-3` · Baseline `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` · **Candidate full SHA: `4965c0c56ae7f658995d8b7cd634b5cdbc697f56`** · Handoff branch `phase-3-rrm001` · QA branch `qa/phase-3-rrm001` confirmed by Director: <Director fills when cut>
- Provenance (A-02): `5f45fb3` (code baseline) → `08ff9a7` (docs) → `88e2c33` (pack) → `7b33756` (A-01) → `74fc44f` (S0 plan) → `447463e` (A-02…A-11) → `9d5fe22` (S1) → `7e2eaeb` (A-12, OBS-1) → `4965c0c` (S2 = candidate). The P3 documentation commit that carries this file will sit on top of the candidate and changes no product file.
- Size of the change, product paths only (`git diff --shortstat 5f45fb3..4965c0c -- src/ .env.example`): 27 files · 65 insertions · 1353 deletions — 17 deleted, 9 modified, 1 added (the AC-202 test).

## Governing QA instructions, repo-local

- `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/` — **NOT YET.** The project QA playbook (`QA_PLAYBOOK.md`, cited as v1.1 by BIM-000's QA plan) is not on disk in this repo or its siblings, and BIM-003's QA lane has no `GOVERNING/` folder, so there was nothing to copy. See `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/README.md`. **Director action** to supply it. Repo-local QA doctrine that does exist: `agent_docs/AUTHORITY/BIM_PLAYBOOK.md` v1.0 §9.

## Reproduction

Board (run the build first — `tsc` includes `.next/types`, which goes stale when routes are deleted):

```
rm -rf .next && env <env> npx next build
npx tsc --noEmit
npx eslint .
npx jest --ci
```

Engineering results at the candidate: build exit 0 with blank env and with placeholder env, **17 routes**, identical tables · tsc 0 · eslint 0 errors / 35 warnings · jest **29 suites / 130 tests, 0 skipped**.

Placeholder env used (never real keys; scoped to each command, nothing exported; `.env.local` not edited and not read for values):

```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.invalid
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-publishable
SUPABASE_SECRET_KEY=placeholder-secret
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:36055
```

Blank-env build: `NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= SUPABASE_SECRET_KEY=` (explicit empty strings — `.env.local` is auto-loaded by Next and would otherwise supply real values).

Build-and-serve method (A-08) — once per flag state, T = `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=true`, U = `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=` (explicit empty; `.env.local` defines the key, and `NEXT_PUBLIC_*` is inlined at build, so the state must be set for the build **and** the serve):

```
rm -rf .next
env <placeholders> NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=<state> npx next build
env <placeholders> NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=<state> PORT=36055 HOSTNAME=127.0.0.1 node .next/standalone/server.js
```

404 matrix, `B=http://127.0.0.1:36055`, each via `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n"`:

| # | AC | Request | Engineering result (T and U identical) |
|---|---|---|---|
| 1-4 | AC-102 | `GET $B/moose-portal`, `/moose-portal/users`, `/moose-portal/users/add-member`, `/moose-portal/users/edit/x` | 404 × 4 |
| 5 | AC-102 control | `GET $B/owedbook` (no cookies) | 307 → `/auth` |
| 6 | AC-201 | `-X POST $B/api/auth/signup -H 'content-type: application/json' --data '{}'` | 404 |
| 7 | AC-201 control | `-X POST $B/api/auth/login` (empty body) | 500 — baseline behaviour: `req.json()` throws "Unexpected end of JSON input" before any client is built; POST handler byte-identical to baseline. Non-404 ✓ |
| 8 | AC-205 | `GET $B/api/auth/login` | 405, 0-byte body |

AC-103 / AC-103b method (A-04, A-11, A-12):
- Five baseline action IDs were read from the baseline `.next/server/server-reference-manifest.json` **before** deletion (`agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S1_action_ids.txt`; the manifest's `encryptionKey` field was deliberately not copied).
- **Action IDs are salted per build** — `protectPage` had a different ID in every build. So "old ID not listed" is weak on its own. What carries the proof: (a) zero manifest entries whose filename or worker path contains `moose-portal`; (b) `POST $B/ -H "Next-Action: <old id>" -H 'Content-Type: text/plain;charset=UTF-8' --data '[]'` → 404 for all five, both states; (c) zero compiled `.auth.admin.` call sites and zero references to `moose-portal/users/actions` in `.next/server`.
- No positive control was run: invoking an old ID against a baseline server would execute a service-role action. Not approved, not done.
- `getUserById` / `deleteUser` **do** appear in `.next/server` — as `GoTrueAdminApi` method definitions from `@supabase/auth-js`, in chunks that also contain `/admin/users`. Present at baseline. Ruled in A-12. Chunk file names are build-specific; Cody's will differ from mine.

**No live Supabase call was made in engineering.** `https://placeholder.invalid` cannot resolve (RFC 6761); rows 5 and 7 make no outbound call by construction.

## Three distinct evidence items — kept separate, none proves another

1. **Application removal** — this handoff: engineering evidence above. Claimed, not certified.
2. **Supabase "Allow new users to sign up" disabled** — Director's `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md`: **NOT YET** (file absent at 18:34, 2026-09-20). Not created by engineering. AC-201's 404 says nothing about the Supabase toggle, and the toggle says nothing about AC-201.
3. **Permanent `handle_new_user` correction** — **not performed.** BIM-004 pre-flight rider CE-2, verified at the APPLY SESSION. This module neither claims nor verifies it.

## Required regression for SOL

- AC-301 preserved-path diff · AC-302 named suites green and unmodified · AC-303 (as narrowed by A-03) · **AC-304 One-Walk with real auth** (project per SOL; Director authorizes SCRATCH if used) — the only place existing-user preservation is proven live.
- The 404 matrix rows 1-8 in **both** flag states **from a build Cody makes himself**, not mine.
- AC-103b by the method above.
- A browser glance at the "Start free trial" CTAs — `src/app/(public)/HomePageContent.tsx:40`, `src/components/global/MobileNav.tsx:103`, `src/components/global/UserMenu.tsx:66` — which now land on `/auth` per A-03 (label untouched; destination/label deferred to the onboarding module).

## Unrun by design / limitations

- Browser walk; real-auth login (AC-304); Gate M viewports and themes — QA's.
- Deployment — waived by the Director.
- AC-206 — Director-owned.
- Known, carried, not acted on: OBS-1 (`protectPage` is registered as a Server Action because `src/utils/supabase/actions.ts` is a `"use server"` module — the OBS-1 sentence about what a direct call yields is the Architect's and was **not** exercised by engineering) · OBS-2 (two orphans left in preserved paths).

## Environment restoration

Local servers stopped; port 36055 free; placeholder env scoped per command; `.env.local` untouched; `.next/` (gitignored) left as the last state-U build.

## Lanes

QA writable lane: `QA/**` · Protected: see `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/CLAUDE.md`; `RECOVERY.md` (untouched until P5 per A-10). Session log: written by engineering every stage per A-10.

SOL authors `QA/QA_TEST_PLAN.md`; Cody executes; SOL certifies in `QA/QA_CERTIFICATION.md`. Prior-review findings are not pre-accepted; engineering results are not independently proven.
