# RRM-004-CYBER-PHARMA — QAM Prompts (v1.1)

Five prompts for the QA Executor, one for the Engineer. Q1 recons and drafts the plan (one stop). Q1b applies the QA Lead's amendments (docs-only). Q2 is the whole QA body in one session. Q4 is the retest template after an approved repair. Q5 is cleanup and closeout — it runs pass or fail, and certification is blocked until it is clean. P2b is the Engineer's docs-only erratum step that records the v1.1 changes against the frozen engineering contract; the Director runs it before Q1. The Director confirms `git status --porcelain` is empty before Q1 and before Q2.

---

## P2b — Engineer: record the QAM v1.1 errata (documentation-only; run after DC-2, before DC-3)

ENGINEER — documentation-only step on phase-3-rrm004 after the P2 commit. No product changes, no installs, no builds, no Git mutations. The Director has moved `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/` to `QAM/` and placed the QAM v1.1 overlay. Frozen files are not rewritten; the changes are recorded as rows. Append to agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md (same continuous table):

| A-09 | 2026-09-30 | QA Lead / Architect / Director | QAM v1.1 — folder rename | Every `QA/` path in this pack's frozen files (CLAUDE.md, RRM_BRIEF.md, ACCEPTANCE_SPEC.md AC-504/AC-600/AC-700, DIRECTOR_CHECKPOINTS.md, CLAUDY_PROMPTS.md, QA_HANDOFF.md, QAM_MANIFEST.md §7) reads `QAM/`. `QA/AGENTS.md` → `QAM/AGENTS.md`; `QA/QA_ENVIRONMENT_PREFLIGHT.md` → `QAM/QAM_PREFLIGHT.md` (QF-01…QF-18); `QA/QA_TEST_PLAN.md` → `QAM/QAM_TEST_PLAN.md`; `QA/QA_EXECUTION_REPORT.md` → `QAM/QAM_EXECUTION_REPORT.md`. Cody's model-neutral entry is `QAM/QAM_ENTRY.md`. | all QA-side references |
| A-10 | 2026-09-30 | QA Lead / Director | QAM v1.1 — credentials (Ruling 4) | DC-5 (Director types credentials into the browser) is withdrawn. Credentials come from root `.env.qa.local` (keys QA_TARGET_LABEL, QA_ADMIN_EMAIL, QA_ADMIN_PASSWORD, QA_MEMBER_EMAIL, QA_MEMBER_PASSWORD), created by the Director before Q1 for the A-07 target, loaded only via `node --env-file`, proven Git-ignored (QF-13), key-counted never printed (QF-14), authenticated once per role in Q1 (QF-16), deleted with proof at Q5 together with any browser auth state; privacy scan blocks certification on any leak. Password rotation stays Director-owned, mandatory after a detected leak. QA-side checkpoints are `QAM/QAM_CHECKPOINTS.md` QC-1…QC-5; DC-4/DC-5 in DIRECTOR_CHECKPOINTS.md are superseded by them. | AC-605, AC-606, AC-703, AC-705, AC-709, DC-4, DC-5 |
| A-11 | 2026-09-30 | QA Lead / Director | QAM v1.1 — plan authorship (Ruling 2) | The QA Executor drafts `QAM/QAM_TEST_PLAN.md` in Q1 from the frozen spec, `QAM/QAM_RISK_REQUIREMENTS.md`, the manifest and recon; the QA Lead amends and approves before Q2; the approved plan carries the Executor's draft line and the QA Lead's approval line and date. AC-702 reads: the plan's provenance names the QA Executor as drafter and the QA Lead as approver, with dates after the candidate; risk ranking and reference derivations are the QA seat's; the Engineer's handoff is cited as claims. Neither the Engineer nor the Architect writes any part of the plan. | AC-702, AC-504 |
| A-12 | 2026-09-30 | QA Lead / Director | QAM v1.1 — run shape | The QA body runs as Q1 (recon + plan draft, one stop) → Q1b → Q2 (one-shot) → Q5 (cleanup), started by the Director's commands in `QAM/QAM_CHECKPOINTS.md`. AC-709 reads: no Director instruction reaches the Executor between the Q2 command and the Executor's return except a logged Q-stop resolution. AC-705 target: Director touches during Q2 = 0; credential entries = 0. | AC-705, AC-709 |

Then add erratum-lane rows to ACCEPTANCE_SPEC.md for AC-605 (login via env-file identities, one sign-in per role, no DC-5), AC-606 (add: no env value, no auth state; scanner per QF-17), AC-702 (per A-11), AC-703 (QF-01…QF-18 in `QAM/QAM_PREFLIGHT.md`, run at Q1 and Q2), AC-705 and AC-709 (per A-12), each citing its A-row. Mark DIRECTOR_CHECKPOINTS.md DC-4 and DC-5 status "superseded by QAM_CHECKPOINTS.md QC-1…QC-5 (A-10)". Update `QAM/QAM_MANIFEST.md` §7 paths from `QA/` to `QAM/` (your own file). Verify each ID appears once and every table is valid. Root CLAUDE.md protocol. Return modified files and ONE selective staging/commit block, one git command per line, message `30sep2026 - RRM-004 QAM v1.1 errata A-09..A-12, spec lane, DC-4/5 superseded`. Do not commit.

---

## Q1 — Recon + plan draft (one stop)

QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q1. Read agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md, then AGENTS.md. Record `date -Is`. Work from the repository root (`export QAM=agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM`). Writes: QAM/evidence/QAM_PREFLIGHT_Q1.txt, QAM/evidence/entry_gate.json, `$QAM/AUTOMATION/qf16_auth_probe.cjs` and `privacy_scan.cjs`, QAM/QAM_TEST_PLAN.md (draft), your recon report `agent_docs/RESPONSES/response_<YYYY-MM-DD>_<HHMMSS>_rrm004-qam-q1-recon.md` (root CLAUDE.md protocol; permitted by AGENTS.md), your session log.

1. Run QAM_PREFLIGHT.md QF-01…QF-18 in **file order** (repository → evidence lane → approved environment and credentials → toolchain, network and port → the QA-owned `npm ci` (§4a, recorded under QF-16 setup) → browser → privacy → QF-16 authentication last, building on that same install). Write `privacy_scan.cjs` and `qf16_auth_probe.cjs` before the rows that call them. Write the table with results. Any FAIL: stop with its Q-number (QF-13…QF-16 → Q8). No plan is drafted on a failed preflight.
2. Read: ../CLAUDE.md, ../ACCEPTANCE_SPEC.md + ../RULINGS_ADDENDUM.md (all rows incl. A-09…A-12 and the erratum lane), QAM_PILOT_CHARTER.md, QAM_RISK_REQUIREMENTS.md, QAM_MANIFEST.md, ../QA_HANDOFF.md, GOVERNING/. Engineer output is claims.
3. Draft QAM/QAM_TEST_PLAN.md with the header `Drafted by: QA Executor (Q1), <date -Is> · Approved by: <QA Lead, pending>` and these sections: entry and stop gates · risk ranking with the requirement each attack satisfies (§A/§B/§C of QAM_RISK_REQUIREMENTS.md by number) · independent execution per AC group with the derivation rule for every reference value · negative controls · the deliberate instrument attack · the authenticated image walk (roles × viewports × theme per §C; login via env-file identities, one sign-in per role, logout, trace after login) · evidence and status rules · pilot-process rows (AC-700) recorded separately · retest rule.
4. Contradiction report: anything where the manifest, the spec, the rulings or the disk disagree, with path:line and the ruling you would need. Anything the plan cannot grade without a ruling → ADJUDICATE row now, not in Q2.
5. Return: preflight summary, the plan draft on screen, the contradiction report, the QF-16 result (role labels only; Q1 sign-ins ADMIN 1 / MEMBER 1), `git status --short` (only your files dirty; HEAD unchanged). Stop. Await the QA Lead's amendments and approval (Q1b). You do not mark the plan approved.

---

## Q1b — Apply the QA Lead's amendments (documentation-only)

QA EXECUTOR — Q1b, documentation-only. Apply the QA Lead's amendments below to QAM/QAM_TEST_PLAN.md exactly; do not re-rank or add attacks of your own. Set the header to `Approved by: QA Lead, <date>` with the QA Lead's approval line verbatim. If the Architect supplied addendum rows, they go to the Engineer (P-series), not to you — note them in the plan as cited rulings only. Return the final plan on screen and `git status --short`. Stop.

AMENDMENTS: <QA Lead supplies>

---

## Q2 — One-shot QA body

QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q2. Tree is clean; plan APPROVED on disk; QC-2 satisfied. One continuous session; stop only on an enumerated Q-stop in AGENTS.md. No Director touch is expected until you return. Record `date -Is`.

1. Entry gate → QAM/evidence/entry_gate.json (branch, HEAD, porcelain, candidate ancestry, docs-only successor diff).
Work from the repository root (`export QAM=agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM`).

2. Rerun QAM_PREFLIGHT.md in file order → QAM/evidence/QAM_PREFLIGHT_Q2.txt, every row except QF-16. This includes the phase's fresh `npm ci` (§4a) before the browser rows; it is Q2's only install. Record `QF-16 covered-by-walk (A-13 d)`; step 5 is Q2's authentication evidence. Any FAIL → stop.
3. On the step-2 install (no second `npm ci`): copy its `date -Is`, `node -v` and platform record → QAM/evidence/deps/. Then `npm ls next sharp eslint-config-next`, `npm audit --json`, the A-03 instrument read on your platform, `ls node_modules/@img/`.
4. Execute QAM_TEST_PLAN.md in its approved risk order: blank-env and placeholder-env builds (route table quoted), tsc, eslint, jest --ci with --json totals → QAM/evidence/board/. Serve the placeholder-env build with the standalone static/public copy `cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public`, then `env <the same placeholder vars> PORT=<qa-port> HOSTNAME=127.0.0.1 node .next/standalone/server.js` (manifest §4; RRM-003 A-02 is the precedent for the copy). Capture the header pair + negative controls → QAM/evidence/headers/; `/_next/image` probe with hex dump, negative host probe with body (A-04), direct image GETs → QAM/evidence/images/; diffs vs baseline and changed paths → QAM/evidence/static/; the deliberate instrument attack with its recorded non-zero failure.
5. Authenticated image walk. This is a separate real-target build; never reuse the placeholder build. Stop the placeholder server first.
   - Build: `rm -rf .next && npx next build`, with no placeholder variables in the shell; the app reads the approved `.env.local`.
   - Copy: `cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public`.
   - Serve: `PORT=<qa-port> HOSTNAME=127.0.0.1 node --env-file=.env.local .next/standalone/server.js`. This hands the server its runtime configuration; `.env.qa.local` is never given to the server.
   - Walk: `node --env-file=.env.qa.local $QAM/AUTOMATION/<walk driver>.cjs <ROLE>` per role — one sign-in per role (counted as Q2 sign-ins, separate from Q1's QF-16), login through the form, the plan's matrix, per-route `<img>` `complete && naturalWidth > 0`, zero failed image requests, zero console errors, expected inventory from source, logout, session gone. Trace starts after login; sanitized traces and cropped screenshots only → QAM/evidence/browser/. Stop the server; port free.
6. Write AC_EVIDENCE_MATRIX.md (every AC-100…700 row), QAM_EXECUTION_REPORT.md, ARTIFACT_INVENTORY.json, QAM_PILOT_RESULTS.md §1–§3. Any product FAIL → REPAIR_PROPOSAL.md from the template (a proposal, not a work order).
7. Recheck HEAD and `git status --short` (HEAD unchanged; only your files dirty; no `.env.qa.local`, no `node_modules`, no `.next` in the list). `date -Is`.

Return to the QA Lead: matrix totals, findings by class, stops hit (expected none), Director touches (expected 0), the recommendation. No verdict. Then wait for the Q5 command.

---

## Q4 — Retest after an approved repair (template; Architect fills per round)

QA EXECUTOR — Q4, retest round <N> on qa/phase-3-rrm004. HEAD has moved by the Director's repair commit <sha>; re-pin it and verify the candidate→HEAD product diff is exactly the approved repair scope <files>. Rerun only: <retest scope the QA Lead named> plus regression rows <list>. Update AC_EVIDENCE_MATRIX.md in place, marking each rerun row "round <N>". Append to QAM_EXECUTION_REPORT.md "Retest round <N>". No new attacks. Return to the QA Lead.

---

## Q5 — Cleanup and closeout (runs pass or fail; certification is blocked until this is clean)

QA EXECUTOR — Q5. Record `date -Is`. Work from the repository root (`$QAM` as in QAM_PREFLIGHT.md). The order matters (A-13 f):
- The value scan needs the env file, so it runs first.
- The env file and auth state are deleted after it, then the removal is verified.
- The pattern scan of the retained evidence runs last.

A leak is a credential, token or env value, or its encoding. A key name or a word such as "password" in documentation is a **documentation mention**: list it with path:line, but it is not a leak (A-13 e).

1. **Value scan, then sanitize (env file still present):** `node --env-file=.env.qa.local $QAM/AUTOMATION/privacy_scan.cjs --values`. The scanner:
   - loads the four credential values from `process.env` and builds their required encodings **in process memory only**: never emitted, persisted, logged or included in an exception (errors are caught and reduced to a fixed word); the process ends after scanning (A-14);
   - scans `$QAM/**` (raw-artifact directories included), agent_docs/RESPONSES/<your files>, your session log, and every temp path you recorded. It never opens credential editor swap/backup files (step 3);
   - looks for each value in plaintext, base64, base64url and URL-encoded form.

   Result → QAM/evidence/privacy_audit.json (counts and paths only; never a value or a hash). For any hit: record it as a leak, remove or sanitize the offending content, record the resolution, and rerun until it reads 0. A hit you cannot remove without losing evidence → stop Q6, and the QA Lead rules. Certification is blocked until this reads 0 leaks. Any detected leak also triggers QC-5 rotation.
2. **Delete the env file and verify:** `rm -f .env.qa.local && test ! -e .env.qa.local && echo env-gone` → `env-gone`; `git status --porcelain -- .env.qa.local` → empty (never tracked). Record in QAM_CLEANUP_REPORT.md with `date -Is`.
3. **Delete all QA-created auth state and browser profiles, then verify:** run the QF-18 `find` (raw-artifact directories included) and delete each result. Also delete every temporary browser profile or user-data directory you created, inside or outside the repo (OS temp included), using the paths you recorded. Rerun QF-18 → `leftover-exit=1`, and `test ! -e` each recorded profile path. Record every deleted path in QAM_CLEANUP_REPORT.md.
   - **Credential editor files:** run QF-18's editor check (`.env.qa.local.swp`, `.env.qa.local~`, …). For each file found:
     - report it by name only in QAM_CLEANUP_REPORT.md;
     - never read it into any output, never stage it, never delete it automatically (it may be an active editor recovery file);
     - the Director removes it at QC-4.
   - Cleanup stays limited to identified QA credential and auth artifacts (A-14).
4. **Pattern scan of the retained evidence (env file gone):** `node $QAM/AUTOMATION/privacy_scan.cjs --patterns`. It looks for:
   - `password=` or any `QA_(ADMIN|MEMBER)_` key followed by a non-placeholder value;
   - `storageState` content;
   - `sb-.*-auth-token` cookies;
   - JWT-shaped strings;
   - Supabase key prefixes.

   Classify each hit as leak or documentation mention, and append to privacy_audit.json. Leaks must read 0, with any leak and its resolution recorded; documentation mentions are listed with path:line.
5. J-19 bounded cleanup per GOVERNING/: nothing outside your lane; build output and transient server assets out of the inventory; every retained helper listed with the reason to keep it.
6. ARTIFACT_INVENTORY.json final (paths, sizes, SHA-256); QAM_PILOT_RESULTS.md §1–§3 final (wall-clock Q1/Q2/Q5, Executor active time, Director touches by class, stops, preflight failures, findings by class, repair rounds, helpers written/promoted/retained, evidence count, privacy hits).
7. Recheck HEAD and `git status --short`; `date -Is`. Return to the QA Lead with the cleanup report and results. The QA Lead certifies only after reading the matrix, the evidence map and this cleanup report — and only if privacy_audit.json reads 0 leaks in both modes (documentation mentions are listed, not counted).
