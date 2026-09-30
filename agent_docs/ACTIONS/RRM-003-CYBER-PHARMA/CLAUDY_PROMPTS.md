# RRM-003-CYBER-PHARMA — Engineering Prompts (one-shot pilot)

Three prompts, not six. P1 plans (read-only, one stop). P1b applies the Director's rulings (docs-only). P2 is the whole build and the QA handoff in one continuous session, ending in a single selective staging block. P4 is the QA-repair template. P5 is reserved. The Director confirms `git status --porcelain` is empty before P1 and before P2. The Engineer answers with full file paths, YOU / ENGINEER / QA LEAD labels, and one git command per line.

---

## P1 — Plan Mode (read-only, one stop)

ENGINEER — RRM-003-CYBER-PHARMA, Plan Mode. Read-only. Writes: the plan in agent_docs/RESPONSES/ (root CLAUDE.md protocol), evidence/PREFLIGHT_P1.txt, evidence/S2_headers_before.txt, your session log.

1. Run every row of agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/ENVIRONMENT_PREFLIGHT.md and write the table with results to evidence/PREFLIGHT_P1.txt. Record <baseline> (the full SHA of the RRM-002 merge on main) at the top of the plan. PF-14's two header lines go to evidence/S2_headers_before.txt. If any row fails, report it and stop — no plan on a failed preflight.

2. Read in order: CLAUDE.md, AUTHORITY_POINTER.md, DIRECTOR_CHECKPOINTS.md, RRM_BRIEF.md, ACCEPTANCE_SPEC.md; then agent_docs/RECON/RRM001_RECON_2026-09-18.md R2 (accessibility, next.config, debug strings), R3, R4, R7, R8; agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md OBS-1, OBS-2, A-06.

3. Produce the plan with these sections:
   a. **Keyboard/focus design (S1).** For DataTable: button-in-th or th-as-button, and why; how Space's preventDefault is handled; how the mobile card mode stays untouched. For AuthedShell: `inert` on the page behind vs a manual focus trap — pick one, cite browser/jsdom support, state how focus-return is implemented (stored trigger ref). For MultiSelect: focus-in target, containment mechanism, focus-return, and how the nested-Escape order (picker first, then drawer) is guaranteed without touching the drawer's own Escape handler beyond what the brief allows. Confirm no `src/components/ui/*` API changes and no `columns.tsx` change. Test list per AC with file names.
   b. **Cache header design (S2).** The exact `source` pattern you will use and a proof that Next.js `headers()` accepts it (cite the route-matching rule you rely on). List every path the new pattern still covers and every path it now excludes. State the exact curl lines for AC-202 including the three negative controls.
   c. **Hygiene inventory (S3).** Every `console.log` hit in src/ outside tests with your proposed action (delete / keep-as-exception with reason). Consumers of `PaginationControls` (expect zero). Current README/TESTING count strings.
   d. **Docs inventory (S3).** For DATABASE_SETUP.md: the lines that direct a reader to the profiles migration and what replaces them. The exact banner line for the three SQL files. The DB_BASELINE.md section text, with DA-2 status read from agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/ (PRESENT if DA-2_SUPABASE_SIGNUP_DISABLED.md exists, else NOT YET). For the four docs in A-06: each signup mention with path:line and the proposed one-line replacement.
   e. **OBS-1 report.** Every export of src/utils/supabase/actions.ts, and for each, what a direct Server Action caller (no page context) can obtain: redirect, the caller's own user, anything else. Recommend flag-only → Phase 8 or escalate. No change proposed in this module unless escalation is warranted.
   f. **Contradictions and risks.** Disk vs contract, path:line, recommended RULINGS_ADDENDUM.md row.
   g. **Stage plan.** Files per stage, tests per stage, checks per stage, the order S1 → S2 → S3 → handoff, and the evidence file you write at each stage end.

Return the plan on screen. No product changes. Await Director approval and the rulings (P1b).

---

## P1b — Apply Director rulings (documentation-only; Architect fills the rows)

ENGINEER — documentation-only step. No product changes, no builds, no Git mutations. Append the rows below to agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md (same continuous table, no blank lines); add any spec erratum rows to the lane in ACCEPTANCE_SPEC.md; add any campaign errata to agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md using the next free E-NN verified on disk. Mark DIRECTOR_CHECKPOINTS.md DC-1 as satisfied with the date. Verify each ID appears exactly once and every table is valid. Root CLAUDE.md protocol for session log and CHANGELOG. Return modified files and a selective staging/commit block, one git command per line.

ROWS: <Architect supplies after reading the plan>

---

## P2 — One-shot build and handoff (single continuous session)

ENGINEER — RRM-003-CYBER-PHARMA, one-shot build. Tree is clean; plan approved; rulings on disk; DC-1 satisfied. This is one continuous session: you move S1 → S2 → S3 → handoff on your own, stopping only on an enumerated stop condition from CLAUDE.md. No Director touch is expected until you return the staging block. Record `date -Is` at start.

PREFLIGHT (gate). Run ENVIRONMENT_PREFLIGHT.md PF-01…PF-17 again; write evidence/PREFLIGHT_P2.txt. Any FAIL → stop condition 1: report and wait. PF-12/PF-13 are the baseline pipes-alive check; do not skip them because P1 passed.

S1 — KEYBOARD/FOCUS (AC-101–106). Implement per approved plan §a in src/components/common/DataTable.tsx, src/components/layout/AuthedShell.tsx, src/components/common/MultiSelect.tsx; new tests per §a. Do not touch columns.tsx or any src/components/ui/* API. Stage exit: tsc 0 (after a fresh build if stale .next types interfere) · eslint 0 errors (warning count) · jest all pass, zero skipped, existing suites unmodified · `git diff <baseline> -- src/components/owedbook/columns.tsx src/components/ui` empty. Write evidence/S1_diffs.txt (the three component diffs + test file list + jest summary). Record S1 start/end in EXECUTION_LOG.md. Only then proceed.

S2 — CACHE HEADER (AC-201–203). Apply the approved `source` pattern in next.config.js, headers() only. Fresh build with placeholder env (`https://placeholder.invalid`, placeholder keys, NEXT_PUBLIC_SITE_URL=http://127.0.0.1:36055); start `node .next/standalone/server.js` on 127.0.0.1:36055; capture `curl -sI` Cache-Control for `/`, one `/_next/static/chunks/*.js` from the build output, `/auth`, `/owedbook` (unauthenticated), and `POST /api/auth/login` with an empty body; stop the server; prove the port is free. Stage exit: `/` and the negative controls contain `no-store`; the static chunk contains `immutable` or `max-age=31536000` and no `no-store`; `git diff <baseline> -- next.config.js` confined to headers(). If the pattern cannot achieve this inside next.config.js → stop condition 4. Write evidence/S2_headers_after.txt. Record S2 in the log. Only then proceed.

S3 — HYGIENE + DOCS (AC-301–308). Per approved plan §c and §d: remove the two "This is coming from" strings; console.log sweep (delete or list exceptions); delete PaginationControls.tsx if zero consumers; DATABASE_SETUP.md pointer; the SUPERSEDED banner on the three SQL files (first line, otherwise byte-identical); DB_BASELINE.md appended section with DA-2 status; signup-prose cleanup in the four docs; README/TESTING counts set to the final jest numbers from this stage's board. Stage exit: AC-301/302/303/308 greps clean or exceptions listed · AC-306 head + diff · `git diff <baseline> -- supabase/migrations` empty · **full board**: fresh build blank Supabase env exit 0, fresh build placeholder env exit 0 (route count), tsc 0, eslint 0 errors, jest all pass zero skipped · AC-401 preserved-path diff empty · AC-403 sort block diff empty · AC-404 actions.ts diff empty. Write evidence/S3_greps.txt and evidence/S3_docs_diffs.txt. Record S3 in the log.

HANDOFF (same session). Assemble agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA_HANDOFF.md with every field filled: contract paths; RULINGS_ADDENDUM rows; ledger resolution rows appended to agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md for R-006, R-010, R-013, R-014 (docs half), R-017 (docs half), R-018 (README) with candidate = "Director's P2 commit, SHA recorded at cut" and evidence paths; references (recon R2/R3/R4/R7/R8, reviews A-005/F6/F10/F13, RRM-001 OBS-1/OBS-2/A-06, your P1/P2 reports); evidence/changed_files.txt (`git diff --name-status <baseline>` against the working tree — state that the candidate SHA is assigned by the Director's commit) and evidence/repair.diff (temp-then-move); reproduction (board commands, header-capture method, placeholder env, no live Supabase call); QA/GOVERNING/ copied from agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/GOVERNING/ with a new PROVENANCE.md; regression list for the QA Lead: AC-107 authenticated keyboard walk (SCRATCH, MEMBER and ADMIN, desktop and 375px, light and dark; agent-driven browser per the field note; Director enters credentials in the browser, never in a file), AC-202 header re-capture from a build the QA Executor makes, AC-401–404; unrun by design: browser walk, real-auth login. Fill EXECUTION_LOG.md Completion claim and §Metrics (timestamps, checks, self-repairs, Director touches = 0 expected, stop conditions hit = none expected). Root CLAUDE.md protocol: session log, CHANGELOG (one entry for the module), completion report in agent_docs/RESPONSES/.

RETURN: `date -Is` at end; the exact changed-file inventory (added / modified / deleted); `git status --short`; and ONE selective staging block — every path explicit, one `git add` per line group, then the commit line — for the Director to run as-is:
   git add <product files>
   git add <test files>
   git add <docs files>
   git add <pack files>
   git add <protocol files>
   git status --short
   git commit -m "<date> - RRM-003 one-shot: keyboard/focus (R-010), cache header (R-006), hygiene, docs quarantine + QA handoff"
Do not commit. Do not self-certify. Stop after returning.

---

## P4 — QA-directed repair (template; Architect fills per round)

ENGINEER — RRM-003 QA repair round <N> on qa/phase-3-rrm003. Implement only the approved ruling package <QA Lead reference>. Findings/ACs: <…>. Allowed files: <…>. Forbidden: frozen AC text, columns.tsx, ui primitives' APIs, auth paths, migrations, unrelated cleanup. Run: tsc · eslint · jest · build · the specific retest the QA Lead named (header re-capture if S2 is touched). Append to EXECUTION_LOG.md "Repair round <N>". Return a selective staging block; Director commits; QA Executor re-pins and retests; QA Lead re-adjudicates. No self-certification.

---

## P5 — Final closeout

RESERVED FOR THE ARCHITECT after the QA Lead's Gate Q and QA Cleanup. Will specify: map §0 scoreboard line, ledger final dispositions, RRM_CAMPAIGN_JOURNAL.md Architect entry with the pilot metrics (QA Lead writes theirs; neither edits the other), certified SHA / evidence commit / closeout commit recorded separately, RECOVERY.md update (permitted at P5), and the Director's `--no-ff` merge line. Not permission to close out early.
