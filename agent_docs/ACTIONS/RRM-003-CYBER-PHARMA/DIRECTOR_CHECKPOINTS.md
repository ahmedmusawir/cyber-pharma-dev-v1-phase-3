# RRM-003-CYBER-PHARMA — Director Checkpoints

The human stops in this module, declared before the run so none is discovered mid-run. Everything not listed here is the Engineer's or the QA Lead's to decide inside the contract.

| ID | When | What the Director does | Status |
|---|---|---|---|
| DC-1 | After P1, before P2 | Reads the plan; approves; rules any contradictions and the OBS-1 disposition; the Architect turns rulings into P1b rows; the Engineer applies them; the Director commits P1b | satisfied 2026-09-28 |
| DC-2 | End of P2 | Reviews the changed-file inventory and `git status --short`; runs the Engineer's single staging block as-is; commits once; pushes | pending |
| DC-3 | After DC-2 | Cuts `qa/phase-3-rrm003` from the committed candidate; pushes; hands the QA Lead the entry brief | pending |
| DC-4 | During QA, when the QA Executor reaches the authenticated walk | Enters SCRATCH credentials directly into the browser the QA Executor opened (never into a file or chat); performs at most one ADMIN and one MEMBER visual spot-check if asked | pending |
| DC-5 | If QA raises a scope or contract question | Rules it; the Architect writes the addendum/erratum row; the Engineer applies it | as needed |
| DC-6 | After Gate Q + cleanup + Architect closeout | Merges `--no-ff`, pushes, records SHAs, fills the scoreboard | pending |

**No checkpoint falls between the start of P2 and the staging block.** Engineering needs no credential, no destructive action and no decision the pack has not already made. If the Engineer stops mid-P2, it is a stop condition, not a checkpoint — read the stop number and the path:line, rule or repair the pack, and resume with a short instruction.

**Still owed from RRM-001, independent of this module:** Supabase "Allow new users to sign up" OFF on the dev project and SCRATCH, verified with the curl in `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/DIRECTOR_ACTIONS.md` DA-2, recorded in that pack's `evidence/`. AC-307 here records its status; doing it before P2 makes the record say PRESENT instead of NOT YET.
