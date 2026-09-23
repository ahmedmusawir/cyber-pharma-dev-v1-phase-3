# RRM-001 QA execution report

To SOL through Tony · Cody, execution/evidence only · updated 2026-09-22.

The released independent static, fresh-build, HTTP, Server Action, regression and placeholder-browser checks remain complete without rerun. The released AC-304 live walk is now fully observed for existing ADMIN and MEMBER accounts across desktop/375px and light/dark, including A-13 logout and the post-logout guard. Evidence is Director-observed manual interaction, not Cody-controlled browser telemetry. AC-206 remains NOT YET. Both requested governing bodies are present and read; original source revision remains unavailable. No verdict, certification, repair or final cleanup approval is issued.

## Authority and identity

- Tested immutable implementation: **cad164d62a623a115541c0441302de01ff74da5b**.
- Current HEAD and `qa/phase-3-rrm001`: **9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4**. The successor changes documentation/evidence only; product/configuration diff from the tested implementation is empty.
- Engineering reference: **4965c0c56ae7f658995d8b7cd634b5cdbc697f56**.
- Code baseline: **5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9**.
- Repository: /home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3.
- SOL's forwarded instruction is preserved verbatim in [QA_TEST_PLAN.md](QA_TEST_PLAN.md). Frozen ACs/rulings/scope are preserved in [QA_INTAKE_REPORT.md](QA_INTAKE_REPORT.md). Historical handoff SHA unchanged.
- Exact engineering-reference→candidate diff: evidence/engineering-to-candidate.diff; path inventory: evidence/engineering-to-candidate.paths.txt. Product/configuration diff empty. No Git mutation occurred.

## Governing documents now supplied

Both bodies were read in full:

| Document | Actual declared version/status | SHA-256 |
|---|---|---|
| `GOVERNING/QA_PLAYBOOK.md` | v1.1 · 2026-08-10 · Active — field-tested | `b6c70f14af18bb187ca7980954317af486e43b682821245d9911f2160d5198a5` |
| `GOVERNING/WEB_FACTORY_P1_DOCTRINE_JOURNAL.md` | v0.3 · started 2026-09-05 · OPEN | `53d41dc4aefde9c849a6faea321cd1d3cf245336e75cfedbd248c2d17f84d301` |

The playbook's v1.1 version history says AC numbering was synchronized in that version; no separate AC-sync patch file was supplied. The files do not embed an original source repository path or commit, so the honest provenance is Director-supplied into this module on 2026-09-21; original source revision remains unavailable. Relevant governing consequences: evidence remains EVIDENCE/INFERENCE/CLAIM/GAP/QUESTION; findings use Acceptance Failure, Regression, Environment/Setup, Pre-Existing Defect, Follow-Up, Architecture Enhancement, or Observation; SOL owns verdict/classification; J-20 adds PASS-PENDING-ADJUDICATION and PASS WITH NOTE; J-19 requires a separate post-Gate-Q cleanup and clean-tree gate selected/released by SOL. No cleanup or certification is performed here.

Concrete unmet requirements after applying the supplied doctrine: AC-206 remains NOT YET, and original doctrine source revision/provenance was not supplied. AC-304's released live-walk evidence is complete, while adjudication/certification remains SOL's. A-13 and its acceptance-spec erratum are now recorded. The working tree is intentionally not represented as cleanup-complete or clean.

The intake arrived clean, then created its permitted report. Execution preflight found 20 tracked BIM-003 responses deleted at their original paths with byte-identical untracked copies in agent_docs/RESPONSES/_OLD/. Exact mapping/equality evidence is in evidence/preexisting-document-relocations.json; arrival status is in evidence/preflight-identity.txt. No product drift was found. The Director confirmed personally moving these files as intentional archive cleanup and approved their relocation (DIRECTOR_ARCHIVE_RULING.md). Provenance and disposition are resolved. The documentation-only successor HEAD now commits all 20 as byte-identical R100 moves. They are not a product defect or rerun trigger.

## Document relocations — exact accounting

**Latest Director ruling (AC-304 resume, 2026-09-21):** the Director explicitly confirms personally moving all 20 byte-identical files as intentional archive cleanup and approves their relocation. They must remain in RESPONSES/_OLD/. Use the verified mapping below for historical citations. This resolves the earlier unknown-actor/unapproved-disposition observations retained below as historical context; they are no longer current gaps. These moves are not a product defect or rerun trigger. Git remains under Director control. See DIRECTOR_ARCHIVE_RULING.md for the exact ruling. No frozen AC or protected file was changed by this ruling.

All 20 pairs below were rechecked against the tested candidate. At first observation, every original was missing, every destination was untracked, and destination bytes equaled committed original bytes. In current HEAD `9ab95e5`, Git records each pair as an R100 rename. Provenance is Director-confirmed and relocation explicitly approved. Cody did not perform, revert, stage or commit these changes; archived files remain in place.

First observed: initial execution-release preflight on 2026-09-21, after clean intake. Exact first-observation clock time was not recorded. Intake report mtime: 2026-09-21T08:10:17.496Z; execution preflight capture mtime: 2026-09-21T08:31:41.171Z. These are artifact times, not the move time. Attribution was initially unavailable; it is now supported by the Director's explicit first-person confirmation, not inferred from timestamps.

| Original path | Approved archive path | Contents versus candidate |
|---|---|---|
| `agent_docs/RESPONSES/BIM003_S1_2026-09-14.md` | `agent_docs/RESPONSES/_OLD/BIM003_S1_2026-09-14.md` | Identical |
| `agent_docs/RESPONSES/BIM003_S2_2026-09-14.md` | `agent_docs/RESPONSES/_OLD/BIM003_S2_2026-09-14.md` | Identical |
| `agent_docs/RESPONSES/BIM003_S3_2026-09-14.md` | `agent_docs/RESPONSES/_OLD/BIM003_S3_2026-09-14.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_123800_session-open.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_123800_session-open.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_125225_bim003-plan.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_125225_bim003-plan.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_131702_bim003-s1-blocked-disk-mismatch.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_131702_bim003-s1-blocked-disk-mismatch.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_135344_bim003-s1-complete.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_135344_bim003-s1-complete.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_145430_bim003-s2-complete.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_145430_bim003-s2-complete.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_154208_bim003-s3-complete-pending-ac307.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_154208_bim003-s3-complete-pending-ac307.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-14_164606_bim003-s3-engineering-complete.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-14_164606_bim003-s3-engineering-complete.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_122338_session-open-qa-standby.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_122338_session-open-qa-standby.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_123634_cody-qa-recon.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_123634_cody-qa-recon.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_141710_cody-session-recovery.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_141710_cody-session-recovery.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_144404_cody-stage-a-result.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_144404_cody-stage-a-result.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_152858_cody-stage-b-result.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_152858_cody-stage-b-result.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_170730_cody-stages-c-i-preq-report.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_170730_cody-stages-c-i-preq-report.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_172400_qa-cleanup-disposition-j19.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_172400_qa-cleanup-disposition-j19.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-15_173300_qa-cleanup-result.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-15_173300_qa-cleanup-result.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-16_122057_bim003-closeout.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-16_122057_bim003-closeout.md` | Identical |
| `agent_docs/RESPONSES/response_2026-09-16_151616_bim003-merged-final.md` | `agent_docs/RESPONSES/_OLD/response_2026-09-16_151616_bim003-merged-final.md` | Identical |

Impact: these paths are historical response artifacts, outside the current QA writable lane. They are not application code, RRM-001 frozen contract files, RECOVERY.md, environment files, session files, or files inside the protected prior-module directories. Nevertheless, they are historical evidence, and their missing original paths affect references inside protected/historical documents:
- BIM-003 BIM003_ACCEPTANCE_SPEC.md:75 still cites RESPONSES/BIM003_S1_2026-09-14.md.
- BIM-003 QA/CODY_QA_RECON.md:19,152,155 and QA/QA_WORK_JOURNAL.md:26 cite moved response artifacts.
- CHANGELOG.md:63,71,79; BIM-003 evidence/S3_files.md:268–271; sessions for 2026-09-14 and 2026-09-15 retain references to the missing original paths.

Those referring files were not edited. The 26-line reference inventory is evidence/followup/relocation-references.json. Frozen contract files still match the candidate (empty evidence/followup/authority.diff). Resolve historical citations using the verified mapping above, as the Director now instructs. The archive ruling approves these document moves without changing frozen ACs or authorizing reference repairs, Git mutation, product edits or reruns.

## Execution results

Full every-AC mapping, including AC-103b: [AC_EVIDENCE_MATRIX.md](AC_EVIDENCE_MATRIX.md). “Observed” and “not executed” are evidence descriptions, not playbook finding classes/statuses.

| Build | Flag at build and serve | BUILD_ID | Build / routes |
|---|---|---|---|
| T | true | JqUbQDCm3XRycsZbpFzOA | exit 0 / 17 |
| U | explicit empty | znKEOX39Cj5x4RNdPD5iJ | exit 0 / 17 |
| Blank Supabase | explicit blank Supabase variables; not served | Emmo-d5HG6ZaU4CTr3R34 | exit 0 / 17 |

Each build began by checking that the exact repository .next path resolved to itself and was not a symlink, then removing only that generated directory. Each preceding run's evidence was preserved before replacement. Both served builds used the handoff synthetic placeholders for all four required keys and the same flag state as their build. Blank build explicitly overrode the three Supabase variables with empty strings; site URL remained synthetic. No environment file was edited and no real credentials were placed in commands or evidence.

Installed Next 16.2.12/local executables were used. Each served standalone tree received public and .next/static assets. Root and standalone BUILD_ID/action maps matched. PID/entry path/entry hash/port/build association is in each server-identity.json. Eighteen extracted auth-page static asset URLs returned 200 in each state. Browser routes blocked non-loopback origins; none were attempted. No live Supabase call was performed.

Both states produced the same HTTP results, with separate request/header/body records:

| Request | T | U |
|---|---|---|
| GET /moose-portal | 404 | 404 |
| GET /moose-portal/users | 404 | 404 |
| GET /moose-portal/users/add-member | 404 | 404 |
| GET /moose-portal/users/edit/x | 404 | 404 |
| GET /owedbook, no cookies | 307 → /auth | 307 → /auth |
| POST /api/auth/signup, JSON {} | 404 | 404 |
| POST /api/auth/login, empty body | 500 | 500 |
| GET /api/auth/login | 405, empty body | 405, empty body |
| Each of five historical Next-Action POSTs to / | 404 | 404 |
| GET /auth and /auth?tab=register | 200 / 200 | 200 / 200 |

The empty-body login result is the expected inherited JSON-parse failure, not a newly introduced defect: baseline and candidate POST bytes are equal and request parsing precedes client construction. Server logs preserve the parse error. No database response was returned by GET.

## Action removal evidence

Root and served standalone manifests were projected through a field allowlist excluding encryptionKey. In both builds: one node registration, protectPage, eight workers; edge empty. No deleted action filename/export/worker and none of the five historical IDs remains. Each historical POST used Next-Action, Content-Type text/plain;charset=UTF-8 and body []; each returned x-nextjs-action-not-found: 1 with body “Server action not found.”, distinguishing framework action rejection from an ordinary route 404.

Old-ID rejection is paired with source deletion/consumer evidence, complete node/edge registration inspection and compiled-code inspection. No baseline build or privileged baseline action was invoked. The old-ID capture remains explicitly inherited evidence.

Per state, 22 matching compiled files were inventoried: five SDK JS chunks plus their five maps, and six adminDemo JS chunks plus their six maps. SDK getUserById/deleteUser definitions occur with /admin/users; adminDemo addMember hits occur with its own store/invite implementation. Exact paths, hashes and snippets are in compiled-matches.json; source provenance and executable-call counts are in compiled-classification.json. Removed-module references and editUser are literal zero.

Initial broad literal search found `.auth.admin.` in five source maps. Investigation located the occurrences in @supabase/auth-js types.ts and GoTrueAdminApi.ts documentation examples. A token-scanner draft overcounted these; the QA-only classifier was corrected to inspect TypeScript AST CallExpression nodes. Final count: zero executable `.auth.admin.` calls in emitted JS and zero in recovered map sources. No product/test-suite repair was made. T's affected chunks were independently hash-equal to U's corresponding files when the refined classification ran, preserving the basis for both classifications after T output was replaced. No suspicious additional registration or renamed action implementation was observed. This is bounded removal evidence, not a general audit of all dependency behavior.

## Regression board

Local TypeScript --noEmit exited 0 with no errors. ESLint . exited 0 with 0 errors and 35 warnings. Jest --ci --no-cache --maxWorkers=2 exited 0: 29 suites, 130 tests passed; zero skipped/pending/todo. Parallel board commands ran only after the final build completed. Raw logs, exits and Jest JSON are under evidence/board/.

All eight AC-302 suites exist, are byte-identical at baseline/candidate/working tree and passed:

| Suite under src/__tests__/ | Tests passed |
|---|---|
| global/Navbar.invariant.test.tsx | 2 |
| admin-portal/InviteMemberForm.test.tsx | 3 |
| actions.test.ts | 7 |
| proxy.test.ts | 2 |
| global/MobileNav.test.tsx | 4 |
| global/UserMenu.test.tsx | 4 |
| services/owedbook.test.ts | 9 |
| owedbook/drawer-apply.integration.test.tsx | 1 |

The only application-test diff from baseline is the required new AuthPage.test.tsx, whose two tests passed. No existing regression test was changed. QA helpers are .cjs files outside Jest's src roots and are also excluded by the existing agent_docs ESLint ignore; no configuration was changed.

Static intake evidence was reused where valid. Durable pin-specific transcripts now include exact AC-301 empty diff and path list, named-test hashes, A-03 navbar/href diff, unchanged login POST comparison, allowed grep hits, removed consumers and full scope inventories separating pre-engineering documentation from implementation.

## Actual browser evidence

Installed Chromium via existing Playwright was available; no tooling was installed. Both T/U were inspected at 1440×900 and 375×900, light/dark, at /auth and /auth?tab=register. Every view had email/password fields and one Login submit, zero tabs and no signup/create-account affordance. Empty-field submission triggered local validation, demonstrating hydration without account authentication. Both themes were confirmed on the html element. No page exception was recorded and no auth-view horizontal overflow was measured.

HomePageContent and desktop UserMenu trial links both target /auth; opening the hydrated mobile menu exposed MobileNav's /auth link as well. Labels remain “Start free trial” by A-03. There are 12 screenshots per state: eight auth views and four home/CTA views, 24 total. Screenshots include local validation messages after the safe empty-field interaction. Browser records and screenshots are under evidence/T/ and evidence/U/. Representative images were visually inspected; all combinations have DOM assertions and saved screenshots. These checks do not prove real login or the authenticated Gate M journey.

## Observations for SOL, with reproduction and attribution

1. **Director-approved document relocations (AC-402 context, provenance resolved).** Twenty byte-identical relocations were absent at intake and present before execution. The Director has now confirmed performing and approving this archive cleanup. Preserve the files and use the exact mapping above for citations. Not a product defect or rerun trigger.
2. **Source-map grep ambiguity (AC-103/A-12).** Search literal .auth.admin. across .next/server. Actual: five maps contain SDK documentation examples; emitted JS and AST call-site checks contain zero calls. Expected A-12 executable call sites: zero. This is an instrument distinction, not evidence of surviving Moose actions. Reproduce via run-build.cjs and audit-compiled.cjs; each match is recorded.
3. **Empty login POST (AC-201 control).** Send no request body. Expected non-404; actual 500 with JSON parse error. POST is baseline-identical. No new regression asserted.
4. **Governing sources supplied after the search.** The exhausted search record remains historical. Tony later supplied QA_PLAYBOOK v1.1 and Doctrine Journal v0.3; checksums and applicability are recorded above and in GOVERNING/README.md. No separate AC-sync patch or original source commit/path was supplied. Formal adjudication remains SOL's.

OBS-1/OBS-2 and the ruled CTA label were not promoted into new RRM-001 defects. No repair was attempted.

## AC-304 final live-auth result and historical SCRATCH context

Tony confirmed the intended normal local Supabase project before authentication and started the application on port 3000. Cody did not start, stop or reconfigure that server. The served repository was tied to current HEAD `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`; its diff from tested implementation `cad164d62a623a115541c0441302de01ff74da5b` is documentation/evidence only, with an empty product/configuration diff.

Using existing accounts and browser-only credential entry, the Director-observed walk produced:

| Role | Login | Authorized routes | Presentation coverage | Logout/session |
|---|---|---|---|---|
| ADMIN | `/auth` → `/owedbook` | `/admin-portal`; `/profile` with password-update form | Desktop and 375px; light and dark | Logout → `/auth`; subsequent `/owedbook` → `/auth` |
| MEMBER | `/auth` → `/owedbook` | `/profile` with password-update form; no ADMIN portal entry | Desktop and 375px; light and dark | Logout → `/auth`; subsequent `/owedbook` → `/auth` |

No password was submitted or changed, and no user, migration or business-data operation occurred. Evidence attribution and checkpoint detail are in AC304_DIRECTOR_OBSERVED.md, AC304_WALK_RECORD.md and evidence/AC304_FINAL/director-observed-walk.json. This completes the released AC-304 observations; SOL retains adjudication and certification.

A-13 is recorded in `RULINGS_ADDENDUM.md`, and the matching 2026-09-22 erratum is recorded in `ACCEPTANCE_SPEC.md`. It requires logout to end the session and land on `/auth`, followed by unauthenticated `/owedbook` → `/auth`. Both roles matched it; the former `/` wording is an Architect drafting error and no product correction is required.

### Historical SCRATCH checkpoints — superseded for AC-304 completion

The following paragraphs preserve the earlier SCRATCH attempt and diagnostic trail. They are not current gaps and are not the basis for the completed normal-local walk.

Final handoff evidence: Tony now confirms he manually logged in successfully on port 3000. This is recorded as Director-observed evidence in AC304_DIRECTOR_OBSERVED.md. The existing QA checkpoint identifies the requested context as ADMIN / 1440px / light, but it captured `/auth` and zero completed journey records. Therefore the completed evidence is limited to successful authentication of an existing account in Tony's manual run. Runtime role, `/owedbook` landing, `/admin-portal`, both roles' `/profile` password form, 375px/dark variants, logout destination, session termination, and post-logout `/owedbook` redirect remain unrecorded. No port-3000 server currently listens. The exact next Director action is: start the app as in the successful run, log in with the existing ADMIN account, stop after navigation, and report the address-bar pathname; do not navigate or logout yet.

Historical authority check at that checkpoint: the addendum then ended at A-12 and the erratum lane was empty, so the logout destination remained pending adjudication. This was later superseded by recorded A-13 and the 2026-09-22 acceptance-spec erratum described above; no product correction was required.

Current disposition after manual comparison: QA server PID 854804 stopped at the Director's request, exited, and port 37169 is free. The Director reports successful manual login on port 3000. That repository development build's compiled artifacts contain the normal .env.local Supabase URL/key, not the distinct RLS_REPLICA URL/key intentionally used for QA SCRATCH. This establishes differing configured endpoints, not why SCRATCH authentication failed. No successful SCRATCH journey is claimed, and the Director's running server was left untouched. AC304_LOGIN_DIAGNOSTIC.md records the comparison. Subsequent paragraphs describe earlier checkpoints. No product repair or broad rerun occurred.

Latest diagnostic update: the Director reports unsuccessful local login despite successful login on a cloud deployment described as using the same database. Actual browser access is confirmed by that attempt, but the page is now closed and zero journeys are complete. Exact error text and cloud URL are requested; cause remains unestablished. Read-only server-bundle inspection confirms configured SCRATCH URL/public key, with no normal main/dev URL/key matches. See AC304_LOGIN_DIAGNOSTIC.md. The next paragraph and earlier open-window descriptions are the preceding handoff state, not current browser availability. No new build, login retry, broad test or repair was performed.

Latest resume checkpoint: see AC304_WALK_RECORD.md and evidence/AC304_RESUME/. HEAD and QA branch remain cad164d62a623a115541c0441302de01ff74da5b; existing SCRATCH build s4iaFo_APq_hkuAgPqZXi passed identity/reuse checks and was reopened without rebuilding. The graphical window and QA-owned loopback server remain open awaiting actual Director visibility/usability confirmation and ADMIN sign-in. Earlier server-stop statements below describe the previous attempt, not this active resumed session. No live journey is claimed yet. Actual logout destination and ended session will be recorded separately; the frozen homepage destination remains pending Architect/Director ruling.

At the earlier SCRATCH checkpoint, AC-304 had no completed authenticated journey. The Director later supplied successful-login evidence from the normal port-3000 run, as recorded in the superseding final-handoff paragraph above. That establishes authentication only; the full walk remains incomplete.

A separate fresh app build of candidate cad164d62a623a115541c0441302de01ff74da5b was prepared with private in-memory mappings from .env.local: RLS_REPLICA_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL, RLS_REPLICA_PUBLISHABLE_KEY → NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and RLS_REPLICA_SECRET_KEY → SUPABASE_SECRET_KEY. The file was not edited and no configuration values were printed. Verification established HTTPS, a target different from the main/dev app URL, and agreement between the configured replica database's project and the replica Supabase URL. This identifies the Director-designated configured SCRATCH target; an administrative dashboard project label was not queried.

SCRATCH build exit 0, 17 routes, BUILD_ID **s4iaFo_APq_hkuAgPqZXi**. Client-bundle inspection confirmed the SCRATCH URL is present, main/dev URL absent, and SCRATCH secret absent. Root/standalone build IDs agree. Safe target booleans, build logs with configuration values redacted, artifact/process identity and lifecycle are in evidence/SCRATCH/. Only this new environment-specific build was run; completed placeholder and regression tests were not repeated. At completion, the QA-owned graphical browser was closed and SCRATCH server PID 851743 exited; loopback port 38299 was confirmed free. The environment file remained byte-identical.

Graphical Chromium launched successfully at the pinned SCRATCH app, initially at /auth with ADMIN/1440px/light selected. The first launch closed when its noninteractive input stream ended; that QA server stopped. The same verified build was then reopened with an interactive control channel, without rebuilding. Tony was asked to enter an existing SCRATCH ADMIN account only through the displayed browser. No password was requested in chat, read from the page or placed in evidence. At the checked handoff boundary, no successful login had reached /owedbook. No ADMIN or MEMBER journey is claimed; existing account availability and Tony's ability to use the displayed window remain unconfirmed.

Exact missing prerequisite: Director-accessible interactive browser authentication using existing SCRATCH ADMIN and MEMBER accounts. The build and configured-target binding are ready; a working auth session is not. No claim is made that the accounts do not exist. Resume the same pinned-build check and interactive sign-in, then run the eight role × viewport × theme journeys: login→/owedbook, admin→/admin-portal, both→/profile/password form, logout→/, unauthenticated /owedbook→/auth. Password form rendering only; no password changes, user creation, migration or business-data writes.

Additional static issue for SOL: frozen AC-304 says logout returns to /, whereas baseline and candidate source both navigate to /auth after logout (Logout.tsx:14; Navbar.tsx baseline :104/current :100; MobileNav.tsx:35). Navbar's SIGNED_OUT subscription also targets /auth. Evidence: evidence/followup/logout-baseline-attribution.md. This is an inherited source/contract discrepancy, not a live result, new repair instruction, or authority to rewrite the AC. Runtime logout remains untested.

The exhausted governing-document search was not repeated. Its earlier missing-body conclusion is superseded: Tony supplied QA_PLAYBOOK v1.1 and WEB_FACTORY_P1_DOCTRINE_JOURNAL v0.3, now read and checksummed above. No separate AC-sync file or original source revision/path was supplied. Classification/certification/final cleanup remain SOL's work.

Keep these three claims separate:

1. **Application entry points removed:** independent source, fresh-build, HTTP, action and browser evidence collected as above; the authenticated preservation walk is now Director-observed complete.
2. **Supabase public signup disabled:** AC-206 remains NOT YET. Existing-account login is now observed, but the Director's DA-2 evidence file is absent and the required disabled-toggle and direct signup-denial observations remain unavailable. Application 404 proves neither.
3. **Permanent handle_new_user correction:** outside this module, still BIM-004 CE-2/APPLY SESSION. Not tested, applied or certified.

## Final state and artifact inventory

Latest 2026-09-22 AC-304 update: current HEAD and QA branch are `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`; tested implementation remains `cad164d62a623a115541c0441302de01ff74da5b`. The successor is documentation/evidence only with no product/configuration change. The 20 Director-approved archive relocations are committed R100 moves and remain untouched. Cody's inactive QA browser was closed; it never started or stopped the application. Tony's port-3000 server remains Director-owned and was left untouched. No completed check or regression board was rerun.

ARTIFACT_INVENTORY.json now lists **195 files excluding itself**, including 24 placeholder screenshots and no retained authenticated screenshot. Current identity/status/tracked diff are in evidence/AC304_RESUME/current-*. Historical SCRATCH servers are stopped. Tony's current port-3000 server is Director-owned and was left untouched. No broad rerun occurred. See AC304_DIRECTOR_OBSERVED.md, AC304_WALK_RECORD.md and AC304_LOGIN_DIAGNOSTIC.md.

Only QA-created durable files under this module's QA/** were written. Normal generated outputs: .next was replaced by the authorized builds and now contains the separately prepared SCRATCH build, including generated standalone assets; tsconfig.tsbuildinfo was generated/updated by the prior TypeScript check and build tooling. The previous placeholder/blank/board evidence remains preserved: all 99 files recorded for those runs match their prior SHA-256 inventory. No dependency installation, product/config/test-suite edit, environment-file edit, session/RECOVERY edit, live DB operation or Git mutation.

QA server T PID 847701 (port 37209) and U PID 848369 (port 35851) were stopped by this run. Both exited and each port was confirmed free immediately afterward (server-stop.json). SCRATCH server lifecycle is recorded separately in evidence/SCRATCH/server-identity.json and server-stop.json, including the initial closed-input launch. No unrelated server was stopped. No final cleanup sweep was performed; durable evidence remains for SOL.

The final identity/working-tree recheck is recorded under evidence/AC304_RESUME/current-*: HEAD and `qa/phase-3-rrm001` equal `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`; product/configuration diff against tested implementation `cad164d62a623a115541c0441302de01ff74da5b` is empty. A-13 and its erratum are the applicable authority additions.

Historical arrival/finalization snapshots remain in evidence/final-* and evidence/followup/*. The current HEAD/QA ref, exact successor diff and porcelain status are recorded in evidence/AC304_RESUME/current-*; artifact hashes are in ARTIFACT_INVENTORY.json. The 20 external documents are now committed R100 archive moves. Current unstaged/untracked items are QA/reporting outputs under Tony's Git control. No product diff appeared. Generated output inventory is separate and does not copy sensitive build manifests.

Current artifact inventory: 195 files excluding the inventory's recursive checksum. It includes 24 placeholder screenshots, 99 integrity-checked prior T/U/blank/board evidence files, both supplied governing bodies and checksums, the complete Director-observed AC-304 record, reports/matrix, exact archive mapping and SCRATCH lifecycle records. It contains no credential screenshot, cookie/session export, token or raw environment file. ARTIFACT_INVENTORY.json supplies current hashes; generated-output-inventory.json separately describes generated output. Current porcelain is captured in evidence/AC304_RESUME/current-status.txt.

Remaining evidence gaps: AC-206 still lacks the Director-owned disabled-toggle and direct Supabase signup-denial evidence; the original source path/revision for the supplied doctrine remains unavailable (and no separate AC-sync patch file was supplied). The doctrine bodies themselves are present. AC-304 has no remaining released walk gap, and A-13 plus its erratum are recorded. The 20 document relocations are Director-confirmed, approved and committed. No extra historical-action-manifest requirement is imposed.

Return to SOL through Tony. Independent released checks remain complete, and the AC-304 live walk is Director-observed complete. No Cody verdict, certification or final cleanup sweep.

## Post-Gate-Q disposition — 2026-09-22

SOL subsequently issued **Gate Q = PASS** for tested implementation `cad164d62a623a115541c0441302de01ff74da5b` and accepted current HEAD `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4` as a documentation/evidence-only successor. AC-304 is PASS under A-13. AC-206 remains NOT YET and explicitly nonblocking. Gate D is not applicable. The permanent `handle_new_user` trigger correction remains outside this certification under BIM-004 CE-2/APPLY SESSION. The bounded cleanup and retained-evidence disposition are recorded in QA_CLEANUP_REPORT.md and QA_CERTIFICATION.md; this note records SOL's verdict without replacing the execution evidence above.
