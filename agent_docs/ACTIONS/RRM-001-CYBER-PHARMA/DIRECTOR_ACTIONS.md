# RRM-001-CYBER-PHARMA — Director Actions

All YOU. One terminal step per message when an agent is waiting; listed here so you see the runway.

## DA-1 — Branch rename (D6). `phase-3-rrm-ffm` == `main`, zero unique commits; rename loses nothing.
Step 1: `git branch -m phase-3-rrm-ffm phase-3-rrm001`
Step 2: `git push -u origin phase-3-rrm001`
Optional later, non-destructive to work: `git push origin --delete phase-3-rrm-ffm`
Verify: `git status -sb` → `## phase-3-rrm001...origin/phase-3-rrm001`

## DA-3 — Place and commit
Campaign docs beside the Phase 3 map/journal (map → doc repo; journal, ledger, decisions → `agent_docs/`); this pack → `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/`. Then:
`git add agent_docs && git commit -m "20sep2026 - RRM campaign docs + RRM-001 pack authored"`

## DA-4 — Clean tree before every "go": `git status --porcelain` must be empty.

## DA-2 — Supabase containment (any time today; does not block authoring)
Why: our route removal does not stop direct calls to Supabase's signup endpoint, and the installed trigger honors a `role` in signup metadata. This is containment, not repair.
Do: Supabase dashboard → dev project → Authentication → email sign-in settings → **"Allow new users to sign up" OFF** (label is stable; menu placement moves). Covers staging too if it points at the same project.
Verify (read-only; placeholders are key *names* from `.env.local`, never paste values into chat):
`curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/signup" -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Content-Type: application/json" -d '{"email":"rrm001-probe@example.invalid","password":"Probe-Only-1234"}'`
Expect a signups-not-allowed error, not a user object. Then confirm a known account still logs in through the app.
Record: `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` — date, project name (no keys), redacted response, login confirmation. This is AC-206.

## DA-5 — Test users until BIM-004's seed (replaces Moose)
Supabase dashboard → Authentication → Users → Add user (auto-confirm), `{"full_name":"<Name>"}` in metadata if offered → trigger assigns member → for admin: SQL editor `update public.user_roles set role='admin' where user_id='<uuid>';` and read it back. Never use role-in-metadata as the mechanism; the permanent correction removes that path (CE-2) and BIM-004's seed writes roles explicitly (CE-1).

## During execution
After P1: approve the plan; write any addendum rows; send P2-S1. After each stage: read the GIT REMINDER, review the diff, commit dated, `git status` clean, next prompt. After P3: `git checkout -b qa/phase-3-rrm001 && git push -u origin qa/phase-3-rrm001`; hand to SOL; authorize SCRATCH if SOL's real-auth walk needs it. After Gate Q + Cleanup + closeout: `--no-ff` merge with message, push; record implementation / evidence / closeout / merge SHAs separately; fill the map §0 scoreboard.

## Not yours, not now
The permanent `handle_new_user` correction (BIM-004 rider, APPLY SESSION). Deployment / Gate D.
