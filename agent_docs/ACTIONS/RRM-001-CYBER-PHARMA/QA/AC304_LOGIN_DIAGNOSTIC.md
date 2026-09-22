# AC-304 interactive login boundary — 2026-09-21

## Follow-up: manual port-3000 comparison

Director reports successful manual login on port 3000. Read-only checks identify PID 862022 as the repository's development-mode Next server. Candidate HEAD and QA branch remain cad164d62a623a115541c0441302de01ff74da5b. Its initial process environment does not contain the two public Supabase variables; .env.local is the only present file among the standard development env-file candidates examined.

The manual development artifacts in .next/dev contain the normal .env.local NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in eight JavaScript/source-map files each, including six server JavaScript chunks. Zero examined development files contain the configured RLS_REPLICA URL or publishable key (257 files inspected). These normal and replica URL values differ. By comparison, the prior QA standalone server artifacts contain the replica URL/key in five JavaScript files each and no normal URL/key matches. The QA launcher explicitly maps the RLS_REPLICA variables into the app public variables for the Director-requested SCRATCH walk.

Thus the manually successful development build and QA standalone build are configured for different Supabase endpoints; the port number alone is not the material difference. This establishes a configuration mismatch between the compared runs, not the root cause of SCRATCH's failed login, nor the cloud deployment's target. Account existence, key validity, connectivity and session behavior at SCRATCH remain unproven. No credentials were read or retried, and no remote auth/database request was made by this comparison. A local unauthenticated /auth GET returned 200; its 23 initial script responses did not contain either URL/key, so those initial scripts alone were inconclusive. The positive configuration comparison comes from the compiled development/server files, not that initial HTML check.

The QA server was stopped at the Director's request before this comparison: PID 854804 exited and port 37169 was confirmed free (evidence/AC304_RESUME/server-stop.json). The Director's port-3000 server was not stopped, reconfigured or authenticated by QA. No build or broad test rerun was performed. The normal development artifacts were created by the Director's manual workflow, not by a new QA build.

Communication correction: QA should have made the intentional SCRATCH overrides explicit during handoff and captured a safe error/status on the failed interactive attempt. No application defect or successful AC-304 journey is inferred from these results.

## Earlier attempt record

Director reports trying the local browser login unsuccessfully, while the same credentials work in a cloud deployment described as using the same database. This is user-reported evidence; no local rejection status/body was captured. The cloud URL and exact displayed error have been requested, without credentials.

The attempt establishes that the Director could access the window. Subsequent helper status: pathname /auth, windowOpen false, completed journeys 0. The browser page is now closed; this does not reveal the failure's cause. The QA-owned server remains available for a coordinated retry. No repeated browser launch or build occurred.

Read-only compiled-server inspection of .next/standalone/.next/server examined 164 JavaScript files. Five contain the configured SCRATCH URL and five the configured SCRATCH publishable key; zero contain the normal main/dev URL or normal main/dev public key. The SCRATCH and normal public keys differ. SCRATCH uses a publishable-format key, whose project ownership was not independently established by offline JWT inspection. No key, URL value, credential, cookie or token was printed or saved. Build ID remains s4iaFo_APq_hkuAgPqZXi.

Local source evidence: src/store/useAuthStore.ts submits the login form to the same-origin /api/auth/login endpoint. src/app/api/auth/login/route.ts:14 invokes signInWithPassword and :19–24 returns authentication errors as HTTP 400. src/utils/supabase/server.ts:10–12 supplies the public Supabase URL/key; :7–8 derives cookie security from site URL. These facts do not establish which stage failed in the Director's attempt. The QA browser route filter allows the local origin, so it does not intentionally block the form's local login POST.

KIP-1 documents inherited cookie-adapter modernization risk. It is not a demonstrated cause of this failure and no repair is authorized. Prior evidence already establishes the login POST is unchanged; this incident is not classified as a newly introduced RRM-001 defect.

Exact diagnostic inputs missing: displayed error text and public cloud app URL/environment identity. A cloud URL alone may not establish private deployment configuration; if necessary, the Director must confirm its Supabase project through an approved non-secret comparison. No assumption that credentials are wrong, accounts are absent, or the cloud uses main/dev is made.

AC-304 is incomplete: zero authenticated journeys. Logout destination/session termination are untested; frozen homepage destination still awaits Architect/Director ruling. No credential retry, auth-service probe, database operation, product/configuration edit, installation, Git mutation or broad test rerun was performed during this diagnosis.
