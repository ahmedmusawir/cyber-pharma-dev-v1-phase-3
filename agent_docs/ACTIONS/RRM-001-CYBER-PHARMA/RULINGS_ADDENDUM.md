# RRM-001-CYBER-PHARMA — Rulings Addendum (append-only)

Contract layer (`CLAUDE.md`, `RRM_BRIEF.md`, `ACCEPTANCE_SPEC.md`, `CLAUDY_PROMPTS.md`) is frozen at engineering handoff. Rulings made after that — in chat, in Plan Mode review, during QA — are written here the same day, with provenance, and never edited into the frozen files (BIM-003 lesson: chat-made rulings absent from disk until flagged).

| ID  | Date | Seat | Question raised (path:line) | Ruling | Affects (AC / stage) |
| --- | ---- | ---- | --------------------------- | ------ | -------------------- |
|     |      |      |                             |        |                      |

| A-01 | 2026-09-20 | Architect (Fable) | `CLAUDY_PROMPTS.md` P1 HEAD check written before the pack was committed | Engineering starts from HEAD `88e2c33` (pack commit, docs only, parent `5f45fb3`). Code baseline for every preserved-path diff and `git diff --stat` in the spec stays `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`. P1 passes when `git rev-parse HEAD` == `88e2c33` **and** `git diff --stat 5f45fb3..HEAD -- src/ supabase/ scripts/ package.json next.config.js` is empty. | P1; AC-301; AC-402 |
