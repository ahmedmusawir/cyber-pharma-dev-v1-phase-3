# RRM-001-CYBER-PHARMA — Removal — Engineering Prompts

Paste-ready. The Director sends one at a time and confirms `git status` is clean before "go". Claudy answers with full file paths, YOU / CLAUDY / SOL labels, one terminal step per message when the Director must act, and a GIT REMINDER at every stage end. Tony types the git.

---

## P1 — Plan Mode (S0)

CLAUDY — RRM-001-CYBER-PHARMA, Plan Mode. Read-only; the only file you write is `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/S0_PLAN.md` (plus your session log).

Read in order: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/CLAUDE.md`, `AUTHORITY_POINTER.md`, `RRM_BRIEF.md`, `ACCEPTANCE_SPEC.md`, then `agent_docs/RECON/RRM001_RECON_2026-09-18.md` sections R1, R2, R9. Confirm `git rev-parse HEAD` == `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` and branch == `phase-3-rrm001`; if either differs, stop and report — do not plan on a moved baseline.

Produce `S0_PLAN.md`:

1. **Deletion consumer trace.** For each of: `src/app/moose-portal/**`, `src/app/api/auth/signup/**`, `src/components/auth/RegisterForm.tsx`, any component used only by the register tab, the flag read at `src/components/global/Navbar.tsx:49`, the `GET` handler in `src/app/api/auth/login/route.ts`, and every test under `src/__tests__/` that imports any of these — list every importer/reference in `src/`, `scripts/`, `README.md`, `docs/`, `.env.example`, and governing docs in `agent_docs/` (not historical module folders). Mark each DELETE / EDIT / KEEP with a reason.
2. **KEEP list with proof.** `src/proxy.ts`, `src/utils/supabase/middleware.ts`, `src/utils/supabase/actions.ts`, `POST /api/auth/login`, `api/auth/logout`, `api/auth/confirm`, `(auth)/layout.tsx`, the login form component(s), `NavbarLoginReg`, `src/app/profile/**` — for each, name its remaining consumer(s).
3. **`/auth` after removal.** State how the page becomes login-only (what the tabs wrapper becomes if single-tab; what `?tab=register` resolves to).
4. **Admin-client reconciliation.** Confirm `src/utils/supabase/admin.ts` has zero importers in `src/` and `scripts/`, and `src/app/moose-portal/_lib/admin.ts` has exactly one (Moose). Draft the retained file's new header text citing ledger E-04.
5. **404 matrix method.** Which server you will use (`next start` warns under `output: "standalone"`; the standalone `server.js` is acceptable — say which), the placeholder env values (never real keys), and the exact curl list for AC-102, AC-201, AC-205 in both flag states.
6. **Contradictions and risks.** Anything where disk and contract disagree, with path:line and a recommended `RULINGS_ADDENDUM.md` row.
7. **Stage file plan.** Files per stage S1 (Moose) and S2 (signup + login GET), tests per stage, checks per stage.

Return the plan on screen. No product changes. Await Director approval.

---

## P2-S1 — Moose removal

CLAUDY — RRM-001 Stage S1 on `phase-3-rrm001`. Tree confirmed clean by the Director. Implement only R-001 and R-012 per the approved S0 §1, §2, §4: delete `src/app/moose-portal/**` (including `_lib/admin.ts`); remove the flag wiring at `src/components/global/Navbar.tsx:49` and the key from `.env.example`; delete Moose-only tests; update the header comment in `src/utils/supabase/admin.ts` per S0 §4; add the one-line "removed in RRM-001 (2026-09-20)" notes to `README.md`, `agent_docs/KIP_REGISTRY.md` and any governing doc S0 marked EDIT. Touch nothing on the KEEP list beyond removing a dead reference.

Checks (all into `EXECUTION_LOG.md`): `npx tsc --noEmit` · `npx eslint .` · `npx jest --ci` (zero skipped) · `rm -rf .next && next build` with placeholder env — paste the route table and confirm no `/moose-portal*` · `grep -rln "getUserById\|addMember\|deleteUser" .next/server/` → 0 · greps for AC-103, AC-104, AC-105, AC-106 with transcripts · 404 matrix per S0 §5 with the flag exported `true` **and** unset; save to `evidence/S1_404_matrix.txt`; stop the server.

Stop conditions: a consumer S0 missed; any edit outside the allowed list; any change needed in protected paths. GIT REMINDER; do not commit.

---

## P2-S2 — Signup removal + login probe

CLAUDY — RRM-001 Stage S2 on `phase-3-rrm001`, after the Director's S1 commit. Implement only D1, R-011 (by removal) and R-002 per approved S0 §1–§3: delete `src/app/api/auth/signup/**`, `src/components/auth/RegisterForm.tsx` and the signup-only components/tests from S0; make `/auth` login-only per S0 §3; remove the `GET` handler from `src/app/api/auth/login/route.ts` leaving `POST` byte-identical; add the "removed in RRM-001" doc notes S0 marked for signup. Preserve `api/auth/logout`, `api/auth/confirm`, `(auth)/layout.tsx`, the login form, `src/app/profile/**`.

Add a jsdom test asserting `/auth` renders the login form and no register affordance (AC-202).

Checks: tsc · eslint · jest (zero skipped; record suites/tests) · `rm -rf .next && next build` with **blank** Supabase env and with placeholder env (both exit 0; route count) · served build: `POST /api/auth/signup` → 404, `GET /api/auth/login` → 404/405, `POST /api/auth/login` (empty body) → non-404; save to `evidence/S2_404_matrix.txt`; stop the server · greps AC-203 · preserved-path diff for AC-301 (`git diff 5f45fb3..HEAD --stat -- <the AC-301 path list>`) must be empty; paste it · AC-303 grep. Append to the log; GIT REMINDER; no commit.

---

## P3 — Engineering completion handoff

CLAUDY — RRM-001 completion, after the Director's S2 commit. Record the candidate SHA (`git rev-parse HEAD`). Assemble `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA_HANDOFF.md`, every field filled:

- Paths of `RRM_BRIEF.md`, `ACCEPTANCE_SPEC.md` (text unchanged — state it), `AUTHORITY_POINTER.md`, `RULINGS_ADDENDUM.md` rows (if any).
- Ledger resolution rows: append to `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` "Resolution evidence" for R-001, R-002, R-011, R-012: module, candidate SHA, evidence paths, ACs claimed. (Independent check column stays empty for SOL.)
- References: `agent_docs/FABLE_CODE_REVIEW.md`, `agent_docs/ASTRA_CODE_REVIEW.md`, `agent_docs/RECON/RRM001_RECON_2026-09-18.md`.
- `EXECUTION_LOG.md` complete; `evidence/changed_files.txt` from `git diff --name-status 5f45fb3..<candidate>`; `evidence/repair.diff`.
- Exact repo `cyber-pharma-dev-v1-phase-3`, baseline `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`, candidate SHA, handoff branch `phase-3-rrm001`.
- Reproduction: board commands; 404 matrix commands in both flag states; placeholder env values used; statement that no live Supabase call was made.
- Governing QA instructions: copy the project QA playbook BIM-003 QA used into `QA/GOVERNING/` with version and source path.
- Three distinct evidence items, kept separate: (1) application removal — yours; (2) Supabase signup disabled — Director's `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` (PRESENT / NOT YET — do not create it); (3) permanent trigger correction — not done, BIM-004 rider CE-2.
- Regression for SOL: AC-301–304 + the 404 matrix from a fresh build.
- Unrun: browser walk, real-auth login (QA).

Treat completion statements as claims. Hand to the Director to cut `qa/phase-3-rrm001`. GIT REMINDER for `QA_HANDOFF.md`, ledger and evidence files.

---

## P4 — QA-directed repair (template; Architect fills per round)

CLAUDY — RRM-001 QA repair round <N> on `qa/phase-3-rrm001`. Implement only the approved ruling package <SOL reference>. Findings/ACs: <…>. Allowed files: <…>. Forbidden: frozen AC text, protected paths, anything outside the allowed list, unrelated cleanup. Run: tsc · eslint · jest · build + the specific retest SOL named. Append to `EXECUTION_LOG.md` "Repair round <N>". GIT REMINDER; Director commits; Cody re-pins and retests; SOL re-adjudicates. No self-certification.

---

## P5 — Final closeout

RESERVED FOR THE ARCHITECT after SOL's Gate Q and QA Cleanup. Will specify: campaign map §0 scoreboard line, ledger final-disposition column, `RRM_CAMPAIGN_JOURNAL.md` Architect entry (Sol writes hers), Phase 3 map errata CE-1/CE-3 placement reminder, certified SHA / evidence commit / closeout commit recorded separately, and the Director's `--no-ff` merge line. Not permission to close out early.
