# AC-304 SCRATCH resumed interactive walk

Final handoff update: Tony now confirms a successful manual login on port 3000. Record this only as Director-observed authentication evidence; see AC304_DIRECTOR_OBSERVED.md. The retained checkpoint was labeled ADMIN / 1440px / light, but it captured `/auth` and zero completed journeys, so runtime role and all post-login steps remain unproved. No port-3000 server is currently listening. The next single operator action is recorded in AC304_DIRECTOR_OBSERVED.md.

Latest: Director requested shutdown; QA server PID 854804 exited and port 37169 was confirmed free. Director then reports successful manual login at port 3000. Read-only comparison shows that development build uses the normal .env.local Supabase URL/key, whereas QA intentionally used the distinct RLS_REPLICA SCRATCH URL/key. See AC304_LOGIN_DIAGNOSTIC.md. Manual success is not recorded as a completed SCRATCH journey; the precise SCRATCH login failure remains undiagnosed. The Director's server was left untouched.

Status: Director accessed the window and reports unsuccessful login despite successful login on a cloud deployment. The window is now closed; zero authenticated journeys are recorded. Exact displayed error and cloud URL are requested for diagnosis. See AC304_LOGIN_DIAGNOSTIC.md. Earlier open-window statements below describe the handoff, not current browser availability. This is not an executed journey or certification.

Candidate HEAD and QA branch were rechecked as cad164d62a623a115541c0441302de01ff74da5b. Existing SCRATCH build s4iaFo_APq_hkuAgPqZXi was reused without rebuilding: root/standalone IDs and standalone entry SHA-256 match the retained preparation evidence. Product diff remains empty. Safe target and bundle binding checks are in evidence/AC304_RESUME/; configuration values are withheld.

The reused standalone server is bound to loopback, http://127.0.0.1:37169, PID 854804. A graphical Chromium window is open at /auth, ADMIN / desktop 1440px / light. It remains available while the Director responds; a successful browser launch alone is not evidence that the Director can see or use it. Credentials must be entered only in the browser, never in chat or terminal controls.

Requested journey matrix: ADMIN and MEMBER, each at 1440px and 375px, light and dark. For each: login → /owedbook; ADMIN → /admin-portal; both → /profile with password form rendered only; logout actual destination recorded; ended session and unauthenticated /owedbook → /auth verified. Frozen logout destination / remains pending Architect/Director ruling, not automatically passed if actual destination is /auth.

No completed passing tests were repeated. No account creation, password changes, business-data writes, repairs or Git mutations are authorized. The 20 historical response archives are Director-confirmed and approved; see DIRECTOR_ARCHIVE_RULING.md and the execution report's unchanged old-to-new mapping.

Completion evidence and server-stop confirmation will be appended after interactive access is confirmed and the walk completes, or after a specific blocker is established.
