# RRM-001 QA lane (SOL / Cody)

SOL authors `QA_TEST_PLAN.md` here at QA entry; Cody's execution reports and raw evidence stay here; SOL's `QA_CERTIFICATION.md` (Gate Q + Cleanup release) lands here. `GOVERNING/` receives the repo-local snapshot of the project QA playbook copied by Claudy at P3 (version + source path) so Cody needs no outside-repo read.

Architect risk notes (input, not the plan): attack the fresh-build action-name grep (AC-103) — is `.next/server` the right place, or does the standalone output hold the manifest? · run the 404 matrix in both flag states from a build you made, not Claudy's · do not let DA-2 (Supabase toggle) stand in for AC-201, or AC-201 for DA-2 · the real-auth walk is the only place existing-user preservation is proven live.

Finding classes and statuses per the project QA playbook. Bounded J-19 cleanup after Gate Q; `RECOVERY.md` and `agent_docs/SESSIONS/**` untouched.
