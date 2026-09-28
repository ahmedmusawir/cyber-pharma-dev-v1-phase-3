# RRM-002-CYBER-PHARMA — Director Actions

All YOU. One terminal step per message when an agent is waiting; listed here so you see the runway.

## DA-1 — Cut the engineering branch from post-RRM-001 main
Step 1: `git checkout main && git pull`
Step 2: `git checkout -b phase-3-rrm002 && git push`
(push.default=current and autoSetupRemote are set, so no `-u origin` needed.)

## DA-2 — Place and commit the pack
`agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/` from the zip. Then:
`git add agent_docs/ACTIONS/RRM-002-CYBER-PHARMA && git commit -m "23sep2026 - RRM-002 pack authored (ledger truth)" && git push`

## DA-3 — Clean tree before every "go": `git status --porcelain` must be empty. Then paste P1.

## DA-4 — After P1: rule the audit table
The plan's §3 is your decision input. Reply to the Architect with one word per row (approve the proposed correction / flag-only / other), the Architect turns them into rows, you paste P1b to the Engineer, run his commit block. Then P2-S1.

## DA-5 — Per stage
Read the GIT REMINDER, review the diff, run the selective commit block, push, confirm clean, next prompt.

## DA-6 — After P3
`git checkout -b qa/phase-3-rrm002 && git push` · hand the QA Lead the entry brief · supply browser-only credentials for the authenticated check if asked · at most one ADMIN + one MEMBER visual spot-check yourself.

## DA-7 — After Gate Q + Cleanup + closeout
`--no-ff` merge with message, push; record implementation / evidence / closeout / merge SHAs separately; paste the final `git log --oneline -1` line to the Architect for the map scoreboard.

## Still owed from RRM-001 (not this module's gate, but still open)
**Supabase "Allow new users to sign up" OFF on the dev project (and SCRATCH).** Verify with the curl in `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/DIRECTOR_ACTIONS.md` DA-2; record `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` in the RRM-001 pack. RRM-001's certificate says NOT YET; it stays that way until you do this.
