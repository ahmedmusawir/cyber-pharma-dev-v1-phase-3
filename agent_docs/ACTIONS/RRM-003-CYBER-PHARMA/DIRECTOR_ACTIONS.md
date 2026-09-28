# RRM-003-CYBER-PHARMA — Director Actions

All YOU. Numbered, one command per block. Agents prepare; you type the git.

## DA-1 — Cut the engineering branch from post-RRM-002 main (after RRM-002 has merged)

Step 1:
```
git checkout main
```
Step 2:
```
git pull
```
Step 3:
```
git checkout -b phase-3-rrm003
```
Step 4:
```
git push
```

## DA-2 — Place and commit the pack

Drop the folder at `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/`. Then:

Step 1:
```
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA
```
Step 2:
```
git commit -m "<date> - RRM-003 pack authored (one-shot pilot)"
```
Step 3:
```
git push
```

## DA-3 — Clean tree, then P1

```
git status --porcelain
```
Must print nothing. Then paste P1 from `CLAUDY_PROMPTS.md` to the Engineer.

## DC-1 — After P1

Send the plan to the Architect. The Architect returns the P1b rows. Paste P1b to the Engineer, run his staging/commit block, push, confirm clean, then paste P2.

## DC-2 — After P2 (one commit)

Run the Engineer's single staging block exactly as returned, then:
```
git status --short
```
Then his commit line, then:
```
git push
```
Then:
```
git status --porcelain
```

## DC-3 — QA branch

Step 1:
```
git checkout -b qa/phase-3-rrm003
```
Step 2:
```
git push
```
Then hand the QA Lead the entry brief the Architect supplies.

## DC-4 — During QA

When the QA Executor opens the browser for the authenticated walk, you type the SCRATCH credentials into the browser. Not into a file, not into chat. One ADMIN and one MEMBER visual spot-check at most, if asked.

## DC-6 — After Gate Q + cleanup + closeout

`--no-ff` merge with message, push, record implementation / evidence / closeout / merge SHAs separately, paste the final `git log --oneline -1` line to the Architect.

## Still owed from RRM-001

Supabase "Allow new users to sign up" OFF on dev and SCRATCH; curl verification per RRM-001 `DIRECTOR_ACTIONS.md` DA-2; evidence file in RRM-001's `evidence/`. Do it before P2 and AC-307 records PRESENT instead of NOT YET.
