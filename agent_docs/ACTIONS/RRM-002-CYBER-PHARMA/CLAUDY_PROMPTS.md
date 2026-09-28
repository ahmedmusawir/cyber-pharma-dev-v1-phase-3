# RRM-002-CYBER-PHARMA — Ledger Truth — Engineering Prompts

Paste-ready. The Director sends one at a time and confirms `git status --porcelain` is empty before each. The Engineer answers with full file paths, YOU / ENGINEER / QA LEAD labels, one terminal step per message when the Director must act, a selective staging block (never `git add -A` on product paths), and a GIT REMINDER at every stage end. The Director types the git. Rulings that arrive after P1 are applied by the Engineer as documentation-only steps, never pasted by hand.

---

## P1 — Plan Mode (S0)

ENGINEER — RRM-002-CYBER-PHARMA, Plan Mode. Read-only. Writes: the plan in agent_docs/RESPONSES/ (root CLAUDE.md protocol), evidence/S0_PRECISION.txt, evidence/FIXTURE_AUDIT.md (report-only draft), your session log.

Baseline identity first. Confirm branch == phase-3-rrm002. Find the RRM-001 merge commit on main: `git log --oneline --merges -3 main` and record the full SHA of the `--no-ff` merge of qa/phase-3-rrm001 as <baseline>. Confirm `git merge-base --is-ancestor <baseline> HEAD` is true and `git diff --stat <baseline>..HEAD -- src/ supabase/ scripts/ package.json next.config.js` is empty (only the pack commit sits above the baseline). If any of that fails, stop and report. Write <baseline> at the top of the plan; every diff in this module uses it.

Read in order: agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/CLAUDE.md, AUTHORITY_POINTER.md, RRM_BRIEF.md, ACCEPTANCE_SPEC.md; then agent_docs/RECON/RRM001_RECON_2026-09-18.md R2, R5, R7, R2-ADDENDUM; agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/WRAPPER_CONTRACT.md; agent_docs/RRM_DIRECTOR_DECISIONS.md (D3 + money rules).

Produce the plan with these sections:

1. **Disclosure design.** Which component holds the footer (inline in OwedBookScreen.tsx or a small SummaryUnattributedNote.tsx). How the same-filters pair is guaranteed (AC-103): the mechanism for tagging each K and S with the filters it was requested for, and how a stale or partial pair is excluded. Where the summary fetch lives today (it runs only on the Summary tab) and how K from the KPI effect and S from the summary effect meet. Confirm `round2` and `usd` are importable without a new helper; if not, report. Test list for AC-101–104 with the derivation formula for the expected X.
2. **Precision premise (AC-105).** Scan src/mocks/owedbook.ts: list every `owed` value with more than 2 decimal places (expect none); write evidence/S0_PRECISION.txt. State plainly whether `gap` can carry rounding noise with the current fixtures.
3. **Fixture/copy audit (AC-201) — report only, no edits.** Table: rule → path:line → current value/text → classification {CORRECT / COPY-CORRECTION PROPOSED / VALUE-CONFLICT FLAGGED / FLAG-ONLY (deferred)} → proposed bounded resolution (for the Director to rule). Cover at minimum:
   - every `11.85` and `10.64` in src/, docs/, README.md (rule 1);
   - per-row `expected == round2(qty × medicaid_rate + 10.64)` over all 150 rows — counts pass/fail, failing rows listed by id; do not fix (rule 3);
   - distinct `method` values in fixtures vs {AAC, FUL, GWAC, BWAC, Take Action, Manual Override}; which relabels would need brand/generic authority → FLAG-ONLY (rules 4–5);
   - negative `owed` rows: count, and where `posNeg` colors them → FLAG-ONLY, presentation deferred (rule 2);
   - `federal_expected = aac × qty` with no fee → FLAG-ONLY → Phase 5 (rule 3 vs federal math);
   - any copy in src/ implying a user-editable PBM key or repricing historical claims at current prices (rules 6–7);
   - any fixture whose `owed` ≠ `expected − original_paid` (rule 2 row-level) — listed, not fixed.
   Propose nothing that requires brand/generic authority, a new formula, or recomputing money.
4. **Contradictions and risks.** Disk vs contract, path:line, recommended RULINGS_ADDENDUM.md row. Include: whether the seven-PBM test pin at owedbook.test.ts:12 would be affected by any proposed audit correction; whether any proposed correction changes a value that owedbook.test.ts asserts.
5. **Stage file plan.** Files per S1 (disclosure) and S2 (ruled corrections), tests per stage, checks per stage.

Return the plan on screen. No product changes. Await Director approval of the plan and the Director's rulings on §3 — those arrive as a documentation-only instruction you apply to RULINGS_ADDENDUM.md, the spec erratum lane, and agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md (next free E-NN, verified on disk).

---

## P1b — Apply Director rulings (documentation-only; Architect fills the rows)

ENGINEER — documentation-only step, no product changes, no builds, no Git mutations. Append the rows below to agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/RULINGS_ADDENDUM.md (same continuous table, no blank lines), the spec erratum lane in ACCEPTANCE_SPEC.md, and the campaign errata table in agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md using the next free E-NN verified on disk. Verify each ID appears exactly once and the tables are structurally valid. Root CLAUDE.md protocol for session log and CHANGELOG. Return modified files and a selective staging/commit block.

ROWS: <Architect supplies after reading the plan>

---

## P2-S1 — Disclosure

ENGINEER — RRM-002 Stage S1 on phase-3-rrm002. Tree is clean; plan approved; rulings on disk. Implement only R-015 per approved S0 §1–§2 and AC-101–106: the Summary-tab footer, its tests, nothing else. `src/services/owedbook.ts`, `src/types/OwedBook.ts`, `columns.tsx`, `KpiTiles.tsx`, `FilterRail.tsx`, `OwedBookContext.tsx` untouched. No fixture edits in this stage.

Tests: AC-101 (derived expected X from fixtures — never a literal; unfiltered and a null-PBM-isolating date range), AC-102 (gap 0, gap −0.004, gap −5.00, named-PBM-only filter), AC-103 (rejected KPI; deferred summary resolving after a filters change; K for filters A with S for filters B; loading), AC-104 (other tabs; tab switch). Existing suites unmodified.

Checks: fresh build blank env + placeholder env (exit 0; route count) · tsc (after the build) · eslint (warning count) · jest (zero skipped; suites/tests) · `git diff --stat <baseline> -- <AC-301 path list>` empty · AC-302 test diff shows only added files · AC-303 grep for the cancelled-flag pattern. Record in EXECUTION_LOG.md. Stop on any need for a formula, service change or fixture edit. GIT REMINDER; do not commit.

---

## P2-S2 — Audit corrections

ENGINEER — RRM-002 Stage S2 on phase-3-rrm002, after the Director's S1 commit. Implement only the fixture/copy corrections that carry a ruled erratum row (E-NN + addendum). Each hunk in EXECUTION_LOG.md cites its erratum ID. Type ruled values from the ruling; never derive or recompute. Finalize evidence/FIXTURE_AUDIT.md: every row now shows its ruling or "flag-only: owner/gate" per AC-204.

Checks: tsc · eslint · jest (all pre-existing suites unmodified — if a ruled correction breaks owedbook.test.ts or any other existing test, STOP and report the exact assertion; the Director rules which side is wrong; no silent test edit) · `git diff <baseline> -- src/mocks/owedbook.ts` pasted hunk-by-hunk with erratum IDs · AC-202 grep · AC-301 diff empty · the S1 footer tests still pass on the corrected fixtures (derived expectations). GIT REMINDER; do not commit.

---

## P3 — Engineering completion handoff

ENGINEER — RRM-002 completion, after the Director's S2 commit. Record the candidate SHA. Assemble agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA_HANDOFF.md with every field filled:
- Paths of RRM_BRIEF.md, ACCEPTANCE_SPEC.md (text unchanged since freeze — state it), AUTHORITY_POINTER.md, RULINGS_ADDENDUM.md rows, the E-NN errata used.
- Append "Resolution evidence" rows to agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md for R-015 and R-020 (module, candidate SHA, evidence paths, ACs claimed); independent-check column left for the QA Lead. R-003 and R-008 rows: add "flagged in RRM-002 evidence/FIXTURE_AUDIT.md; Phase 5" to their rationale — no disposition change.
- References: agent_docs/ASTRA_CODE_REVIEW.md A-004, agent_docs/FABLE_CODE_REVIEW.md F3/F8, agent_docs/RECON/RRM001_RECON_2026-09-18.md, your S0/S1/S2 reports in agent_docs/RESPONSES/.
- EXECUTION_LOG.md complete; evidence/changed_files.txt from `git diff --name-status <baseline>..<candidate>`; evidence/repair.diff.
- Repo cyber-pharma-dev-v1-phase-3, <baseline> full SHA, candidate full SHA, handoff branch phase-3-rrm002.
- Reproduction: board commands; the derivation formula for the footer's expected value; placeholder env values; statement that no live Supabase call was made.
- Governing QA instructions: copy agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/* into this pack's QA/GOVERNING/ and write a new PROVENANCE.md stating "copied from RRM-001/QA/GOVERNING/ on <date>; original provenance per that file".
- BIM-005 contract note (carry-forward): precision premise (AC-105) and the mock↔wrapper divergences D3–D5 must be re-verified against `owedbook_kpis`/`owedbook_summary` before the swap.
- Regression for the QA Lead: AC-301–304; the authenticated Summary-tab check (AC-304) at desktop/375px, light/dark — Playwright recommended per the RRM-001 lesson; Director supplies browser-only credentials on request.
- Unrun by design: browser check; real-auth login.
Treat completion statements as claims. Hand to the Director to cut qa/phase-3-rrm002. GIT REMINDER for QA_HANDOFF.md, ledger and evidence files.

---

## P4 — QA-directed repair (template; Architect fills per round)

ENGINEER — RRM-002 QA repair round <N> on qa/phase-3-rrm002. Implement only the approved ruling package <QA Lead reference>. Findings/ACs: <…>. Allowed files: <…>. Forbidden: frozen AC text, services/types, columns.tsx, fixtures without an erratum, protected paths, unrelated cleanup. Run: tsc · eslint · jest · build + the specific retest the QA Lead named. Append to EXECUTION_LOG.md "Repair round <N>". GIT REMINDER; Director commits; QA Executor re-pins and retests; QA Lead re-adjudicates. No self-certification.

---

## P5 — Final closeout

RESERVED FOR THE ARCHITECT after the QA Lead's Gate Q and QA Cleanup. Will specify: map §0 scoreboard line, ledger final dispositions, RRM_CAMPAIGN_JOURNAL.md Architect entry (QA Lead writes theirs; neither edits the other), certified SHA / evidence commit / closeout commit recorded separately, RECOVERY.md update (permitted at P5), and the Director's `--no-ff` merge line. Not permission to close out early.
