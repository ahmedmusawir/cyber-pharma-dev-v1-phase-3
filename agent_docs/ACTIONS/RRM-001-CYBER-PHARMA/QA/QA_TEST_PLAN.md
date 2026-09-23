# RRM-001 QA plan and execution release

Authority: SOL, QA Lead; Director approves candidate selection by forwarding this instruction. Received 2026-09-21. Cody records and executes; SOL adjudicates and certifies.

Contract reference: [QA_INTAKE_REPORT.md](QA_INTAKE_REPORT.md), including complete frozen ACs, A-01–A-12 and OBS-1/OBS-2, exact protected/allowed paths and scope inventory. The historical handoff remains unchanged. Execution observations and every-AC matrix belong in QA_EXECUTION_REPORT.md and AC_EVIDENCE_MATRIX.md.

## SOL instruction (verbatim)

CODY — RRM-001 QA PLAN AND EXECUTION RELEASE
Authority: SOL, QA Lead; Director approves candidate selection by forwarding this instruction.

1. CANDIDATE RULING

Test this immutable candidate:
cad164d62a623a115541c0441302de01ff74da5b

Engineering reference:
4965c0c56ae7f658995d8b7cd634b5cdbc697f56

Code baseline:
5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9

Your intake established that engineering reference → candidate changes documentation/evidence only. Preserve that exact diff as evidence.

Record this selection in QA/QA_TEST_PLAN.md. Do not rewrite the historical handoff SHA or change branches.

Before execution, confirm HEAD and qa/phase-3-rrm001 still equal the selected candidate. The known untracked QA_INTAKE_REPORT.md is permitted QA output; it does not invalidate the documented clean arrival.

No Git mutation. Any new commit or unexpected change outside permitted QA/generated output requires reporting before further execution.

2. PLAN AND AUTHORITY

Save this instruction as SOL’s execution plan at:
agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/QA_TEST_PLAN.md

Reference the intake’s complete ACs, rulings, protected paths and scope inventory. Build an execution matrix covering every AC, including AC-103b, with evidence references and observed outcomes.

Locate the exact QA playbook and any applicable AC-sync patch used for BIM-003:
- Search current repo documents and read-only Git history.
- Follow concrete provenance references.
- If found, copy the exact governing material into this module’s QA/GOVERNING/ and record source path, source commit/version and checksum.
- Do not substitute BIM_PLAYBOOK or invent missing doctrine.
- If unavailable, report the specific missing source Tony/Fable must supply.

You are released for the evidence collection below while that document gap remains. Formal finding classifications, certification and final cleanup approval remain pending the governing rules and SOL adjudication.

If recovered doctrine conflicts with this plan, report the specific conflict before the affected operation.

3. BOUNDARIES

Durable QA writes: this module’s QA/** only.

Also permitted: normal generated build/test outputs needed by the approved commands, including .next and TypeScript caches. Inventory these separately.

No product/configuration/test-suite repairs, dependency installation, Git mutation, session-log edits, RECOVERY edits, environment-file edits or live database operations.

Use installed local executables. Never log real keys, passwords, cookies, session tokens or manifest encryption keys.

Do not modify existing regression tests. QA-only probes must stay under QA and must not accidentally enter the application test suite.

4. STATIC EVIDENCE

Preserve/reuse your independently collected intake checks where they remain valid for the pinned candidate; do not repeat checks without a reason.

Complete any missing evidence for:
- AC-101/104/105/106 removal, wiring and documentation.
- AC-203 with exactly the A-09 exceptions.
- AC-301 exact preserved-path list.
- AC-302 unchanged existing regression tests; the new AuthPage test is explicitly required by AC-202.
- AC-303 navbar changes under A-03.
- Login POST byte equality and GET removal.
- Full changed-file scope accounting, separating pre-engineering documentation changes from implementation.

Do not classify the ruled “Start free trial” label or OBS-1/OBS-2 as new RRM-001 defects without new evidence.

5. FRESH BUILDS AND HTTP CHECKS

Use the handoff’s synthetic placeholder configuration for every required environment key, scoped to each process.

Run two independently fresh placeholder builds:
T: NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=true
U: NEXT_PUBLIC_ENABLE_MOOSE_PORTAL explicitly empty

Apply the same flag state during BOTH build and serve.

Fresh-build cleanup is authorized only for this verified repository’s generated .next directory. Confirm its resolved location and that it is not a symlink before removal. Preserve relevant evidence from each run before replacing its output. No broad clean commands.

For each state:
- Record build exit, route table/count and BUILD_ID.
- Use the fresh standalone server.
- Copy public/static assets into their required generated standalone locations.
- Confirm the served process belongs to that build and assets load.
- Bind to loopback on a free port.
- Stop and report a standalone boot failure; do not silently switch server modes.

Run and capture:
- Four specified Moose URLs → 404.
- Unauthenticated /owedbook → redirect to /auth.
- POST /api/auth/signup with JSON {} → 404.
- POST /api/auth/login with an empty body → non-404.
- GET /api/auth/login → 404/405, with no database-backed response.

Capture statuses, relevant redacted headers and response bodies. Distinguish expected inherited empty-body login behavior from a newly introduced defect.

Also run the separate blank-Supabase-environment build required by AC-401. Explicitly blank the relevant process variables so local env-file loading cannot silently supply their values. Do not serve that build for live auth.

6. SERVER ACTION REMOVAL

For each fresh placeholder build:
- Inspect safe projections of both root and served standalone action manifests.
- Examine node and edge registrations, filenames, exports and workers.
- Confirm the deleted action module and its actions are absent.
- Apply A-04/A-12 compiled-code checks and document every allowed SDK/adminDemo match.
- Investigate suspicious aliases or registrations instead of relying solely on literal name searches.

Perform AC-103b exactly:
- All five documented historical IDs absent.
- POST each old ID to / using the documented Next-Action request shape.
- Each returns 404.
- Capture relevant action-rejection headers/body.

Old-ID rejection alone is insufficient proof of removal because IDs can change between builds. Pair it with the fresh manifest, compiled-code and source-consumer evidence.

Retain the historical ID capture as inherited evidence. Do not rebuild or invoke the vulnerable baseline to manufacture a positive control. No extra historical-manifest requirement is being added.

7. REGRESSION BOARD AND LOGIN UI

Run local:
- TypeScript check.
- ESLint.
- Jest in CI mode.

Record exits, errors, warnings, suites/tests and skipped counts. Zero skipped is required. Explicitly identify the eight named AC-302 suites.

Check /auth and /auth?tab=register in an actual browser:
- Login form present.
- No signup tab/form/create-account affordance.
- Existing login fields and submit preserved.
- Three changed CTAs resolve to /auth.
- Assets and hydration work.

Capture desktop and 375px views in light and dark modes.

Use an existing browser capability. If unavailable, report that boundary and continue other independent checks; do not install tooling or call HTTP-only evidence a browser pass.

8. LIVE AUTH WALK — SEPARATE CHECKPOINT

AC-304 remains mandatory.

Complete the placeholder/static/regression work without waiting for credentials.

Report readiness for the Director-assisted live walk, identifying the existing dev environment and how its served code will be tied to the pinned candidate. A placeholder build or an unidentified staging deployment cannot satisfy this check.

Tony must confirm the target environment and enter existing account credentials through the approved interactive path. Do not request credentials in reports or put them in shell commands.

Once that access is authorized and ready, execute the frozen admin/member journey at desktop and 375px, light and dark:
login → /owedbook; admin → /admin-portal; both → /profile and password form; logout → /; unauthenticated /owedbook → /auth.

Render the password form only. Do not change passwords, create accounts or modify database records.

9. SEPARATE SUPABASE EVIDENCE

AC-206 remains NOT YET unless the Director supplies evidence demonstrating all its required observations.

Application signup 404 does not prove Supabase signup is disabled.

The permanent handle_new_user correction remains outside this module. Do not test, apply or certify that correction.

10. RETURN AND STOP CONDITIONS

Proceed autonomously through independent checks within this plan. Stop only affected work for an actual blocker; continue unrelated safe checks.

Return:
- QA/QA_EXECUTION_REPORT.md
- AC evidence matrix
- Redacted raw evidence and screenshots under QA/
- Observations with reproduction steps, expected versus actual behavior, affected AC and baseline attribution
- Remaining live-walk/doctrine/Director evidence needs
- Final HEAD, tracked diff and working-tree status
- Inventory of QA-created artifacts

Stop only servers you started and confirm they have exited.

No repairs, self-certification or final cleanup sweep. Preserve durable evidence for SOL’s adjudication.
