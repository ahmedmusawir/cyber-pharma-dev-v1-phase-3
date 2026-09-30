🔵 ENTERING PLAN MODE
Task: RRM-003 P5 final closeout on `qa/phase-3-rrm003`: docs, evidence and bounded QA cleanup only. The input is SOL's Gate Q PASS certification, relayed by the Director. The Architect is unavailable.

**Authority gap.** `CLAUDY_PROMPTS.md` P5 is "RESERVED FOR THE ARCHITECT". No Architect prompt exists, so this plan derives P5 from the reserved-slot text, SOL's closeout scope and the RRM-002 P5 precedent (`session_2026-09-28.md`, 19:58–20:02). Your approval stands in for the Architect's prompt.

**Verified premises**
- HEAD `1a94277` equals SOL's stated QA HEAD.
- `git diff --name-only 21ea108 HEAD` touches only `agent_docs/**` and `CHANGELOG.md`, so there has been no product change since the candidate.
- The whole QA lane (report, matrix, plan, inventory, observations, `evidence/`) plus 2 QA RESPONSES files are **untracked**, the same pattern as RRM-002. Removing an untracked file is unrecoverable, so I archive first.
- No `QA_CERTIFICATION.md` exists yet. No QA-seat or Architect-seat journal text for RRM-003 exists anywhere.
- Next free erratum: **E-17**.

📋 PLAN:
1. **File the certificate:** `QA/QA_CERTIFICATION.md` gets SOL's pasted text **verbatim** under a one-line provenance header. The QA Lead's words are preserved, never paraphrased.
2. **Bounded cleanup (J-19):**
   - Remove only the three disposable helpers: `evidence/browser/qa_ac107.cjs`, `qa_pbm_probe.cjs` and `sanitize_trace.py`. Each is cited only by `ARTIFACT_INVENTORY.json`, which is the RRM-002 precedent (helpers removed).
   - Archive them outside the repo first (scratchpad tarball + SHA-256 list).
   - **Keep** every attempt1/attempt2 raw matrix and trace, because they are the QA-F01/QA-F02 evidence. Keep all 8 screenshots, the final traces, board/static/headers and `GOVERNING/`.
   - Rebuild `ARTIFACT_INVENTORY.json` minus the 3 entries.
   - Write `QA/QA_CLEANUP_REPORT.md` (removed / retained / hashes / citation check).
3. **Ledger** `RRM_FINDINGS_DISPOSITION_LEDGER.md`:
   - Append "certified `21ea108…` (SOL, Gate Q PASS 2026-09-29; QA HEAD `1a94277`; closeout / merge: Director)" to resolution rows R-006, R-010, R-013, R-014, R-017 and R-018. These are in-place cell appends in the same shape as the RRM-001 R-012 row. No disposition wording changes.
   - Errata **E-17**: QA-F01. SCRATCH was unavailable, and the Director authorized the main dev Supabase for the login-only AC-107 walk (no data, user, role or config changes).
   - Errata **E-18**: QA-F02. Enter on the closed PBM trigger does not open it and Space does. SOL ruled it a NON-BLOCKING OBSERVATION, not an RRM-003 defect → backlog for a future accessibility review.
4. **Map** `RRM_CAMPAIGN_MAP_v1_0.md` §0:
   - Add a "Status at v1.0.3 (2026-09-29)" line.
   - Scoreboard RRM-003 → `CLOSED — Gate Q PASS 2026-09-29 @ 21ea108 (QA HEAD 1a94277); closeout + merge: Director`.
   - Fill RRM-002's merge SHA **`3d2e655`**. This is verified on `main` and has been owed since 2026-09-28.
5. **Journal** `RRM_CAMPAIGN_JOURNAL.md`: add the headings for the RRM-003 Architect entry, the QA-logged (QA Lead) entry and the friction log, each with the placeholder `[entry to be supplied by the <seat>; not authored by another seat]` (the RRM-001 precedent). **I do not write either seat's text.** Candidate facts for the Architect (pilot metrics, QA-F01/F02, stop count) go in the closeout report as input only.
6. **Pack records:**
   - `EXECUTION_LOG.md`: append a `## Closeout` table (candidate / QA HEAD / closeout commit: Director / merge: Director).
   - `README.md` (pack): one-line status.
   - `DIRECTOR_CHECKPOINTS.md`: DC-4 → `satisfied 2026-09-29 (main dev auth target per Director authorization, not SCRATCH; no spot-check requested)`. **Needs your confirmation (see D3).**
7. **Root protocol:** update `CHANGELOG.md` and `RECOVERY.md` (permitted at P5), close the session-log entry, and write the closeout report in `agent_docs/RESPONSES/`.
8. **Verify, read-only:**
   - `git diff --stat 21ea108 -- src/ supabase/ scripts/ package.json package-lock.json next.config.js` must be empty, including the working tree and untracked files.
   - Every path cited by the certificate, report, matrix and inventory must resolve.
   - `ARTIFACT_INVENTORY.json` must parse.
   - Secret-pattern scan on the QA lane must be 0.
   - No build, test or browser rerun.
9. **Return** a selective staging/commit block for you (one command per line, explicit paths, no `-A`), plus the `--no-ff` merge lines. I run none of it.

FILES TO MODIFY:
- `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md`: resolution rows plus E-17 and E-18
- `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md`: §0 v1.0.3, the scoreboard and the RRM-002 merge SHA
- `agent_docs/RRM_CAMPAIGN_JOURNAL.md`: three RRM-003 headings with placeholders only
- `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/{EXECUTION_LOG,README,DIRECTOR_CHECKPOINTS}.md`
- `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/ARTIFACT_INVENTORY.json`: minus the 3 helper entries
- `CHANGELOG.md`, `RECOVERY.md` and `agent_docs/SESSIONS/session_2026-09-29.md`

FILES TO CREATE:
- `QA/QA_CERTIFICATION.md` (SOL verbatim)
- `QA/QA_CLEANUP_REPORT.md`
- the closeout report in `agent_docs/RESPONSES/`

FILES TO REMOVE (archived first):
- `QA/evidence/browser/qa_ac107.cjs`
- `QA/evidence/browser/qa_pbm_probe.cjs`
- `QA/evidence/browser/sanitize_trace.py`

FILES I WILL NOT TOUCH:
- `src/`, `supabase/`, `scripts/`, `package*.json` and `next.config.js`: certified product
- `ACCEPTANCE_SPEC.md`, `RULINGS_ADDENDUM.md` and `QA_HANDOFF.md`: frozen contract
- `QA_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `ONE_SHOT_QA_OBSERVATIONS.md`, `QA_TEST_PLAN.md` and `QA/README.md`: QA-seat text
- `QA/GOVERNING/**`, `evidence/**` (engineering) and the two QA RESPONSES files

DECISIONS FOR YOU (defaults in bold):
- **D1 Journal seats:** **placeholders for both seats + friction log**. SOL can paste a QA entry and I'll file it verbatim; the Architect entry waits for Fable. Alternative: I draft an Architect entry *in the closeout report only*, marked "Engineer draft for Architect ratification".
- **D2 Cleanup:** **remove the 3 helpers (archived)**. Alternative: remove nothing and keep the helpers as reproducibility aids.
- **D3 DC-4:** **you entered the ADMIN/MEMBER credentials in the QA browser on 2026-09-29** → mark it satisfied with the substitution noted. Correct me if that's wrong.

ASSUMPTIONS:
1. SOL's pasted text is the final, complete certificate to file verbatim.
2. E-17/E-18 rows are authored "2026-09-29 / Tony", with authority "QA Lead (Gate Q 2026-09-29); Director", because no Architect is available.
3. The closeout commit SHA and merge SHA stay "Director" until you paste them.

RISKS:
- The Architect may later want P5 worded differently. Every change is docs-only and easy to amend on the next opening commit.
- The helper removal is irreversible in git (untracked). The scratchpad archive is temporary, so copy it out if you want it kept.

→ Awaiting approval before proceeding ("go", or give D1–D3 answers).
