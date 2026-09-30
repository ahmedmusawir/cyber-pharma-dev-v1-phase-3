🔵 PLAN — record the RRM-003 closeout and merge SHAs (docs only)

Verified on disk:
- The merge commit is `649c36d` (on `main`, pushed).
- The closeout commit is `7309a2f`.
- Candidate `21ea108` is an ancestor of `main`.
- The product diff `21ea108..main` is empty.
- The tree is clean.

📋 PLAN — replace the "Director" placeholders with the real SHAs:
1. RRM-003:
   - `RRM_CAMPAIGN_MAP_v1_0.md` §0 status line and scoreboard → `closeout 7309a2f; merged to main 649c36d`.
   - The 6 R-rows in `RRM_FINDINGS_DISPOSITION_LEDGER.md` → `closeout 7309a2f; merge 649c36d`.
   - `ACTIONS/RRM-003-CYBER-PHARMA/EXECUTION_LOG.md` Closeout table → closeout `7309a2f` and merge `649c36d`.
   - `RECOVERY.md` → RRM-003 MERGED, nothing pending for the Director on this module.
2. RRM-002 SHAs still owed. These are in `ACTIONS/RRM-002-CYBER-PHARMA/README.md`, `EXECUTION_LOG.md`, and the ledger R-015/R-020 rows (if they carry the placeholder): closeout `9cb56e9`, merge `3d2e655`. Both are verified on `main`.
3. Update `CHANGELOG.md`, `agent_docs/SESSIONS/session_2026-09-30.md` and the RESPONSES report.

WILL NOT TOUCH:
- `RRM-002/evidence/repair.diff`: it contains the placeholder string, but it is sealed evidence.
- `session_2026-09-28.md`: historical log.
- Any product path.
- The journal placeholders: they belong to Fable and SOL.

WHERE IT LANDS: I'd edit on `main` in the working tree and leave the changes uncommitted. Precedent is that you commit this touch with the RRM-004 opening commit, after you cut the RRM-004 branch from `main`. If you'd rather cut `phase-3-rrm004` first, tell me and I'll wait.

RISKS: none to product. This only changes docs strings.

Also your call, no action from me: retire `phase-3-rrm003` and `qa/phase-3-rrm003`. Both are fully merged.

→ Awaiting approval ("go").
