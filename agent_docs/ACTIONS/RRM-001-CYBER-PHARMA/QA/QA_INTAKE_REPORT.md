# RRM-001 QA intake and independent recon

To: SOL, QA Lead, through Tony. From: Cody, executor. Date: 2026-09-21 (Asia/Kuala_Lumpur).
Static intake only. No verdict or certification. No build, server, runtime probe, dependency installation, live service call, repair, or Git mutation was performed. Only this QA report is written.

## 1. Identity and specimen discrepancy

| Item | Independently observed |
|---|---|
| Working repository | /home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3 |
| Origin, fetch and push | https://github.com/ahmedmusawir/cyber-pharma-dev-v1-phase-3.git (no embedded credentials observed; remote output redacted for URL userinfo/token parameters) |
| Active branch | qa/phase-3-rrm001 |
| Handoff candidate | 4965c0c56ae7f658995d8b7cd634b5cdbc697f56 |
| HEAD | cad164d62a623a115541c0441302de01ff74da5b |
| refs/heads/qa/phase-3-rrm001 | cad164d62a623a115541c0441302de01ff74da5b |
| Code baseline | 5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9 |
| Initial git status --porcelain | Empty |
| Recheck immediately before report creation | Empty |

The required three-way SHA equality is NOT present. HEAD equals the QA branch, but neither equals the handoff candidate (QA_HANDOFF.md:22). One intervening commit exists: cad164d62a623a115541c0441302de01ff74da5b, “21Sep2026 - rrm-001 engineering done”. Its ten changed paths are CHANGELOG.md; module EXECUTION_LOG.md, QA/GOVERNING/README.md, QA_HANDOFF.md, RULINGS_ADDENDUM.md, evidence/changed_files.txt, evidence/repair.diff; the P3 response; campaign disposition ledger; session_2026-09-20.md. No product/configuration path changes between these two commits.

This explains the mismatch but does not resolve it. The P3 response expressly leaves the specimen decision to Tony. SOL/Tony need an explicit pin that reconciles the handoff and QA branch before execution. This report inspects baseline→handoff-candidate and separately verifies candidate→HEAD product identity; it does not silently substitute HEAD.

After creating this report the expected sole untracked path is agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/QA_INTAKE_REPORT.md. That report-created state must not be confused with the clean arrival state. Tony retains Git control.

## 2. Authority, missing doctrine, and conflicts

Read authority in the requested sequence: current handoff; complete acceptance spec; complete addendum A-01 through A-12 and OBS-1/OBS-2; brief, pointer and module CLAUDE; Director decisions; disposition ledger; referenced recon and original-review material; S0/S1/S2 reports, A-12 note, P3 report and execution log; QA/GOVERNING and root CLAUDE. Relevant source-review sections are F1/F2/F11/F12 and A-001/A-007; their original hardening proposals are superseded by D1/D2 removal. No new-authorization tests are proposed.

The frozen ACCEPTANCE_SPEC, RRM_BRIEF, module CLAUDE, AUTHORITY_POINTER and CLAUDY_PROMPTS have no diff from pack commit 88e2c33 through current HEAD. The exact AC text and entire current addendum are reproduced below; no AC was rewritten.

QA/GOVERNING contains only README.md. No QA_PLAYBOOK file was found by repository file discovery. The README:1–11 independently confirms this is a missing snapshot, requests the version used for BIM-003 and any separate AC-sync patch, and does not appoint BIM_PLAYBOOK as a replacement. The claimed sibling-repository search is inherited from Claudy, not repeated here.

Consequently the governing playbook's exact finding-class enumeration, finding-status enumeration, certification template/requirements and detailed J-19 cleanup checklist are unavailable. Do not invent them or confuse verdict vocabulary with finding statuses.

Available doctrine:
- agent_docs/AUTHORITY/BIM_PLAYBOOK.md:134–141: QA independently authors its attack; QA owns its verdict; Operator adjudicates product/scope/risk release decisions; evidence must cite file:line, payloads or reproducible steps; findings are severity-classified and explicitly blocking or nonblocking.
- Its exact verdict set is PASS / PASS WITH FOLLOW-UP FINDINGS / PASS WITH KNOWN RISK / FAIL / BLOCKED. None is issued here.
- BIM_PLAYBOOK.md:162–173 requires declared gates and board evidence, finalized spec, required environment prerequisites, independent Gate Q, Gate D or recorded N/A, adjudicated/routed findings and closeout artifacts.
- Module QA/README.md:3–7 assigns QA_TEST_PLAN.md to SOL, execution evidence to Cody, QA_CERTIFICATION.md and cleanup release to SOL. Cleanup is bounded J-19 after Gate Q; RECOVERY.md and sessions remain untouched by QA.
- RRM_CAMPAIGN_MAP_v1_0.md:35 gives forward-only QA-line repair, re-pin, SOL Gate Q, bounded cleanup, Architect closeout prompt, Claudy closeout, Tony merge/push. Deployment is waived/outside this module.
- The older Phase-3 map's One-Walk wording assigns execution to Director; this mission assigns Cody execution and SOL planning. SOL should specify the browser operator/credential handoff in the plan rather than assume credentials are available.

Conflicts/gaps for SOL:
1. Candidate mismatch above; QA branch confirmation placeholder remains in handoff.
2. Required project QA playbook/AC-sync snapshot missing; exact classifications/statuses/cleanup requirements cannot be supplied.
3. AC-302's evidence-column wording (“only deletions/removed-module references”) does not mention the new AC-202 test. AC-202 explicitly requires that test and A-09 names it as a standing exception. Record the actual one-file addition; do not misreport the test diff as empty.
4. EXECUTION_LOG.md:3 still cites nonexistent evidence/S0_PLAN.md; its S1 section and A-10 explicitly identify the real RESPONSES plan. This is a documented stale header, not a missing S0 plan.
5. Root CLAUDE mandates RESPONSES/session/RECOVERY/changelog writes and prior plan approval. The present explicit mission authorizes this intake report and restricts all writes to QA; those other writes were not made. A-10 is engineering scope, not permission for Cody to write outside this mission.
6. OBS-1's direct-call behavior is an untested Architect assertion, expressly acknowledged by Claudy's A-12 note. No invocation is needed for this removal module.
7. A-12's “S1 — GREEN” and engineering log GREEN wording are engineering claims, not SOL adjudication.

## 3. Independent static findings

These are observations for adjudication, not assigned playbook finding classes or severities.

| Observation | Independent evidence and consequence |
|---|---|
| Product scope | Baseline→candidate: 27 files, 65 insertions, 1353 deletions across src/ and .env.example; 17 deleted, 9 modified, 1 added. Exact changed files below. Reviewed hunks match removal, A-03/A-05 exceptions, E-04 header and AC-202 test. |
| Moose deletion | git ls-tree at candidate and filesystem existence checks find no src/app/moose-portal. All 14 baseline files deleted, including five-action module and local admin factory. Baseline actions.ts exports at :23/:91/:122/:157/:173 are getUsers/getUserById/editUser/deleteUser/addMember. Current source has no such removed module/import. |
| Signup chain | Baseline auth/page.tsx:3,9 imports/renders AuthTabs; baseline AuthTabs.tsx:7,53 imports/renders RegisterForm; baseline RegisterForm.tsx:70 calls /api/auth/signup. All three removed-module files (AuthTabs, RegisterForm, signup route) absent at candidate and on disk. Current auth/page.tsx:3,8–10 directly renders LoginForm; query parameter is not consulted. Runtime/browser rendering remains untested. |
| Preserved paths | Literal full AC-301 path-list git diff --stat baseline→candidate is empty. Candidate→HEAD product diff is empty, extending this observation to HEAD. This includes all supabase/ and scripts/, manifests/lockfile and next.config.js, not just migrations. |
| Regression tests | All eight named AC-302 suites exist and are unchanged. Entire src/__tests__ diff is only new auth/AuthPage.test.tsx (36 lines). No existing suite modified/deleted. No removed-module import references found. No Jest run performed. |
| Navbar | Navbar.tsx baseline :48–51 removes only comment/flag-gated Moose link. NavbarHome is byte-identical. MobileNav.tsx:103, UserMenu.tsx:66 and HomePageContent.tsx:40 change only href /auth?tab=register → /auth. “Start free trial” label remains, per A-03. MobileNav:8 imports store and :33 calls logout; UserMenu has no useAuthStore reference. |
| Source action grep | getUserById, deleteUser, editUser and getUsers: zero under src/. addMember only services/adminDemo.ts:225 and store/useAdminDemoStore.ts:17,30 (A-04). scripts/ contains preserved Auth Admin seed code; scripts are outside this src-only zero criterion and were not run. |
| Feature flag | No NEXT_PUBLIC_ENABLE_MOOSE_PORTAL consumers under src/; key absent from .env.example. instrumentation.ts unchanged. No .env.local contents read or printed. |
| Admin reconciliation | Retained utils/supabase/admin.ts:1–9 cites E-04, blessed/unconsumed status and seeding/system-job fence; only header changed. Export createAdminClient retained. No utils/supabase/admin reference/importer under src/ or scripts/. Typecheck not run. |
| Moose text grep | Only src/app/(admin)/layout.tsx:20 in README.md, docs/, .env.example and src/; this is A-05's preserved comment. Historical module paths/phase2.md unchanged during engineering. |
| Signup text grep | Exactly instrumentation.ts:18 register hook and AuthPage.test.tsx:17 assertion pattern, both A-09. Zero other matches to frozen AC-203 pattern. |
| Login GET removal | route.ts loses baseline :10–28 only. Current :10 begins POST, :11 parses request JSON before constructing client. Byte comparison from “export async function POST” through EOF equals baseline. GET and posts reference absent. Empty-body 500 is inherited runtime evidence, not freshly observed. |
| Existing auth | LoginForm, NavbarHome and AC-301 infrastructure unchanged. useAuthStore.ts:27/55 still call login/logout, confirm/route.ts:20 calls verifyOtp, profile/layout.tsx:15 calls protectPage and ProfileForm.tsx:58 retains password update. This is source preservation, not proof of successful live auth. |
| New AC-202 test | AuthPage.test.tsx:19–35 asserts email/password/Login, no tablist/tab/link, one button and no forbidden text/markup. It renders the component with mocked auth store; it does not load the two actual browser URLs or demonstrate working login. |
| AC-206 | evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md is absent. NOT YET; there is no evidence here of dashboard toggle state, direct signup rejection, or existing-account login under that setting. No Supabase settings changed. |

Whole-tree scope accounting: baseline→candidate also includes campaign setup, source review/spec/recon additions and RECOVERY.md. git log attributes RECOVERY.md's only change in this range to 08ff9a7 (“going to rrm 1”), before the module pack/engineering start. The engineering interval 7b33756→4965c0c has no RECOVERY/history-module/phase2.md changes. Session/changelog/response writes during engineering are expressly excepted by A-10. Thus the whole baseline diff must not be described as “only allowed product paths” or RECOVERY byte-identical to baseline; the historical change is recorded, not retroactively authorized by this report. Current QA made none of those changes.

Exact product change inventory:
- Deleted Moose files: _lib/admin.ts; _shell/MooseShell.tsx; _shell/MooseSidebar.tsx; layout.tsx; loading.tsx; page.tsx; users/AdminPortalPageContent.tsx; users/DeleteUserButton.tsx; users/actions.ts; users/add-member/AddMemberForm.tsx; users/add-member/page.tsx; users/edit/[id]/EditUserForm.tsx; users/edit/[id]/page.tsx; users/page.tsx (all under src/app/moose-portal/).
- Other deletions: src/app/api/auth/signup/route.ts; src/components/auth/AuthTabs.tsx; src/components/auth/RegisterForm.tsx.
- Modified: .env.example; src/app/(auth)/auth/page.tsx; src/app/(public)/HomePageContent.tsx; src/app/(public)/loading.tsx; src/app/api/auth/login/route.ts; src/components/global/MobileNav.tsx; src/components/global/Navbar.tsx; src/components/global/UserMenu.tsx; src/utils/supabase/admin.ts.
- Added: src/__tests__/auth/AuthPage.test.tsx.
- A-06 documentation: README.md; agent_docs/KIP_REGISTRY.md; docs/AUTHENTICATION.md; docs/AUTHORIZATION.md; docs/DATABASE_SETUP.md; docs/PROJECT_OVERVIEW.md; docs/ROUTES_AND_SURFACES.md. Reviewed changes stay within the ruled notes, pointer removals and clause edits.

## 4. Server Action proof and limitations

Installed Next is 16.2.12 (node_modules/next/package.json:3); package.json requests ^16.2.1. next.config.js:3 sets output: standalone; build script invokes next build (engineering used Turbopack). No dependency/configuration changes from baseline.

Local implementation and bundled official documentation were inspected:
- dist/shared/lib/turbopack/manifest-loader.js:124–169 loads per-page server-reference-manifest.json fragments, merges node/edge action entries retaining filename, exportedName and workers, and writes .next/server/server-reference-manifest.json and .js. These are action registrations; route-table absence alone is insufficient.
- dist/server/load-components.js:119 reads the server-reference JSON; dist/server/app-render/manifests-singleton.js constructs runtime mappings/worker selection. Compiled action entry modules and server chunks are additional implementation evidence.
- Standalone carries its own .next/server/server-reference-manifest.json. Inspect both build root and the artifact actually served; do not assume a stale root manifest identifies a different server process.
- dist/server/app-render/action-handler.js:380–391 produces 404, “Server action not found.” and the action-not-found response header for unrecognized fetch actions; :1015–1033 looks up IDs in the module map. Record headers/body as well as status to distinguish an action rejection from an unrelated route/proxy 404.
- Bundled docs dist/docs/01-app/02-guides/data-security.md:285–290 explicitly describe non-deterministic action IDs and build/cache regeneration. SWC options.js:168 accepts hashSalt; webpack-config.js:417 supplies encryptionKey; Turbopack impl.js:63,109 passes encryptionKey to its project. encryption-utils-server.js:27–107 supports cache reuse/expiry and an environment override. Therefore “IDs always change on every build” is too absolute; fresh builds CAN invalidate old IDs even when the action survives. Do not log manifest encryptionKey or environment values.

Existing .next artifacts were read only through a field allowlist: both root and standalone manifests presently have node={one protectPage entry}, edge={}, matching action ID 60ae04ae2150340aa38bb16c4cfe8e5e11e80cf9e6, filename src/utils/supabase/actions.ts, eight workers. No removed action/worker is registered in those inspected files. These are inherited, gitignored artifacts of unverified build provenance; this observation cannot satisfy the fresh-build AC.

Five old IDs have traceable documentary evidence in evidence/S1_action_ids.txt:3–15: original manifest path, mtime, baseline code statement, BUILD_ID muJ3N16y80matgd-W6R12, filename/export/worker mapping. They match the five baseline source exports:
| Export | Baseline ID |
|---|---|
| deleteUser | 402dc37b2b824c1412b54c07a6754d1f00f781c2dc |
| addMember | 404e90d686531af573f3973524ae30e48d42564fdb |
| getUsers | 40d73ff364e71e0ded6e2d8bdbd18d3449dc317cad |
| getUserById | 40e1008514ac7084cf1a567948a2afe66cb4986f22 |
| editUser | 60fe6f04c7baf4ba561914ff2157c6d7071a99ff7e |

This is a transcribed, committed engineering capture, not an independently witnessed original baseline manifest or HTTP-positive-control result. No raw baseline manifest/build hash attestation is supplied. S1 evidence also shows protectPage changing IDs while surviving. Rebuilding baseline now would not recover these historical IDs. Do not invoke baseline privileged actions to manufacture a control.

Keep AC-103b exactly as frozen: all five old IDs absent and each old-ID POST returns 404. Pair it with independent fresh-build checks of all node AND edge registrations, filenames/exports/workers; deleted source and inbound-consumer trace; compiled .auth.admin. call-site and removed-module zero checks; editUser literal zero; and classification of each allowed SDK/adminDemo hit per A-04/A-12. Search renamed/aliased action implementation where a suspicious registration appears. A mere string grep can miss minified/aliased calls; the independent layers strengthen the claim without changing the AC. SDK method names or /admin/users alone are not application entry points.

## 5. Proposed instruments for SOL's execution plan (not executed)

1. Resolve specimen, preserve clean-start status, pin full SHA and record read-only diff/hash evidence.
2. Use local installed executables, no install. Build one fresh standalone output for flag=true and a separate fresh output for flag explicitly empty, setting that state for BOTH build and serve (A-08). A shell-unset key can be restored by Next's .env.local loading. Any future cleanup of .next must be explicitly scoped to the verified repo-generated directory in SOL's plan; no deletion was done now.
3. Override the four instrumentation.ts:11–15 required environment keys per process with the handoff's synthetic placeholder configuration. Never print real environment values or read .env.local into a transcript. Use loopback host/port. Blank-Supabase build is a separate AC-401 build; do not expect its server to boot because instrumentation rejects blank required keys.
4. Capture build exit, complete route table/count, BUILD_ID, safe action-map projection and compiled grep results before replacing either build. Start that build's standalone/server.js, confirm process/build association; boot failure stops that run, per A-08.
5. Per state, use no-cookie HTTP requests: four old Moose GETs→404; /owedbook→/auth redirect; signup POST JSON {}→404; login POST empty body→non-404; login GET→404/405 with no DB response. Send each old-ID POST to / with Next-Action and text/plain;charset=UTF-8, body [], recording request shape, status, relevant headers and body. /auth and /auth?tab=register need both HTTP and browser evidence; 200 alone proves no form content.
6. For browser checks, standalone assets need deliberate preparation: bundled output.md:36–41 says public and .next/static are not copied by default. SOL should include copying the existing public and fresh static output into standalone's corresponding locations (generated output only), then verify assets load. Otherwise an unstyled/non-hydrated page is not valid Gate M evidence.
7. After fresh build (to replace stale generated route types), run local tsc --noEmit, eslint, jest --ci, record exits/counts/skips/warnings and unchanged named-test hashes. AC-401 stage results remain historical engineering evidence; fresh QA verifies the selected candidate, not a retroactive rerun of S1.
8. Use jsdom as the specified component instrument plus real browser inspection for login-only URLs, all three CTA destinations and AC-304 at desktop/375px, light/dark. Playwright package is installed; no project Playwright config was found. Browser executable/session availability was not tested. SOL should specify existing manual/automation access without dependency installation.
9. Record only relevant redacted evidence under QA. At run end stop only QA-owned servers, confirm port release, restore command-scoped environment, record generated artifacts and status. Detailed certification/cleanup must await the missing governing playbook and SOL release.

AC-304 requires a SOL-trusted, Director-authorized project/environment and network access, correct app auth configuration supplied securely by Tony, existing valid ADMIN and MEMBER accounts with their canonical roles, and an accessible browser that can reach that app and capture redacted evidence. A placeholder build cannot prove live login. Public build-inlined Supabase configuration means a later real-auth walk needs a separately prepared matching build/environment. Tony can enter credentials interactively or provide an approved existing browser session; do not request passwords in the report or put real credentials in shell commands. The walk must still demonstrate each account's login, not merely inspect a preauthenticated page. Password form rendering is required; password mutation is not required. No new account creation or database setup is implied. If SCRATCH is chosen, Director authorization is explicitly required.

## 6. Evidence map

| Claim / AC | Inherited engineering evidence | Independent intake evidence / still needed |
|---|---|---|
| 101,104,105,106 | S1_greps.txt, S1 result/log | Tree deletion, consumer greps, reviewed header/nav/docs diffs; fresh compilation/typecheck remains |
| 102 | S1/S2_404_matrix.txt | No runtime check; own two builds and HTTP controls required |
| 103/103b | S1_action_ids.txt, S1_greps.txt, matrices; A-12 interpretation | Baseline exports and current source absence; installed framework proof; inherited manifest inspection only; fresh maps/chunks/POSTs remain |
| 201,205 | S2 matrix/greps | Signup source absent; GET deleted; POST byte-equal; HTTP remains |
| 202/203/204 | S2 greps, new test, log 29 suites/130 tests | Login-only component and allowed grep hits independently observed; tests/browser remain |
| 206 | Handoff says NOT YET | Evidence file independently absent; Director must supply actual toggle/rejection/login evidence |
| 301/302/303 | S2_greps/log | Exact preserved diff empty; all existing tests unchanged; href-only proof; test execution remains |
| 304 | Explicitly unrun by engineering | Source preservation only; authorized environment/accounts/browser walk remains |
| 401 | S1 28/128; S2 29/130; 35 lint warnings, builds and tsc reported green | No board run this pass; log tables are claims, not independent executions/full raw console records |
| 402 | Stage clean-tree/.env.local statements | Current arrival clean and full SHAs independently read; historical .env.local non-edit cannot be proved from Git status on an ignored file |

Original Fable review is a sibling-repo specimen; Astra is a Git-free export. Recon rechecks baseline applicability; none constitutes current candidate QA certification. Inherited repair.diff/changed_files.txt are supporting records; independent git diff is the intake scope authority.

## 7. Exact missing inputs and separate claims

Needed before execution/certification planning is complete:
- Tony/SOL resolution of candidate 4965c0c… versus HEAD/QA branch cad164d… and corresponding unambiguous execution pin.
- Actual governing QA_PLAYBOOK version/source snapshot and AC-sync patch (if separate), including finding classes/statuses, certification rules and full cleanup requirements.
- SOL's QA_TEST_PLAN and release defining permitted build/output writes, instruments, environment, browser operator and evidence collection.
- AC-304 authorized project selection, securely prepared environment, available existing admin/member accounts and browser access. No password values are requested here.
- Director AC-206 evidence file; record NOT YET independently of application tests. Frozen AC says absence blocks nothing in engineering and SOL records PRESENT/NOT YET; Cody makes no acceptance policy.
- Stronger historical ID provenance, if SOL requires it: a retained redacted original manifest tied to the baseline build. Current capture is traceable but inherited; this is a proof limitation, not an invented new AC.

Three claims remain separate:
1. Application entry points removed: source removal independently observed; fresh compiled/runtime/browser evidence pending.
2. Supabase public signup disabled: NOT YET evidenced; application 404 cannot establish this.
3. Permanent handle_new_user correction: outside RRM-001, still BIM-004 pre-flight rider CE-2, verified at APPLY SESSION. Neither removal nor containment certifies it.

Intake stops here. SOL adjudicates and certifies; Claudy handles approved repairs; Tony controls Git and credentials.

## Appendix A — Complete frozen acceptance specification (verbatim)

# RRM-001-CYBER-PHARMA — Removal — Acceptance Specification

**Version:** 1.0 · 2026-09-20 · **Architect:** Fable · **Director approval:** D1, D2 · **Contract freezes at:** engineering handoff (P3). Post-freeze rulings append to `RULINGS_ADDENDUM.md` and the erratum lane below; frozen text is never rewritten.
**Scope:** removal of the Moose portal and public signup; login GET probe removal; admin-client reconciliation. Baseline `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`.

Requirements are agreed before implementation. Claudy delivers this file unchanged with his execution evidence. QA verdicts belong to SOL. Grep criteria are literal: zero means zero; any allowed exception is listed in `EXECUTION_LOG.md` with path and reason.

## AC-100 — Moose portal removed (D2, R-001, R-012)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-101 | `src/app/moose-portal/` does not exist (routes, layout, pages, `users/actions.ts`, `_lib/`, components). | — | repo | `ls` transcript |
| AC-102 | `next build` (placeholder env) route table contains no `/moose-portal*`. On the served build, `GET /moose-portal`, `/moose-portal/users`, `/moose-portal/users/add-member`, `/moose-portal/users/edit/x` each return **404**, run twice: with `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL=true` exported and with it unset. | Negative: unauthenticated `GET /owedbook` returns a redirect to `/auth` (server alive). | `next start` or standalone, placeholder env, curl | route table + curl transcripts ×2 |
| AC-103 | No removed Server Action survives: `grep -rn "getUserById\|addMember\|deleteUser\|editUser" src/` → 0; after a **fresh** build (`rm -rf .next` first) `grep -rln "getUserById\|addMember\|deleteUser" .next/server/` → 0. | Negative: `protectPage` present; `src/__tests__/**/actions.test.ts` passes. | fresh build | grep transcripts |
| AC-104 | `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` has zero consumers under `src/` (wiring at `src/components/global/Navbar.tsx:49` removed); key removed from `.env.example`; `src/instrumentation.ts` byte-identical to baseline. | — | repo | grep + diff |
| AC-105 | `src/app/moose-portal/_lib/admin.ts` deleted. `src/utils/supabase/admin.ts` retained; `grep -rn "utils/supabase/admin" src/ scripts/` → 0 importers; file still exports `createAdminClient` and typechecks; its header comment cites ledger E-04 and states: blessed, zero app consumers, fenced to seeding/system jobs. | — | repo | grep + `head -n 12` |
| AC-106 | `grep -rni "moose" README.md docs/ .env.example src/` → 0. `agent_docs/KIP_REGISTRY.md` and any governing doc that still directs a reader to Moose carries a one-line "removed in RRM-001 (2026-09-20)" note. Historical module folders, journals, reviews and recon are excluded from the grep and untouched. | — | repo | grep + diff |

## AC-200 — Public signup removed (D1, R-011, R-002)

| AC | Required observable behavior | Positive / negative controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-201 | `src/app/api/auth/signup/` does not exist. On the served build `POST /api/auth/signup` → **404**. | Negative: `POST /api/auth/login` with an empty body returns a non-404 status (route exists). | served build, curl | curl transcript |
| AC-202 | `src/components/auth/RegisterForm.tsx` and every signup-only component identified in S0 are deleted. `/auth` and `/auth?tab=register` render the login form only: no register tab, no register form, no "create account" affordance. Login form fields and submit unchanged. | Negative: a jsdom test asserts the login form renders and no register affordance exists. | jsdom + QA browser | test + screenshot |
| AC-203 | `grep -rniE "sign ?up|register|create (an )?account" src/` → 0 outside the allowed-exception list (an orphaned string with no consumer is not an allowed exception — delete it). | — | repo | grep |
| AC-204 | Signup-only tests deleted; no test references a removed module; `jest --ci` passes with zero skipped. | — | Jest | jest output |
| AC-205 | `GET` handler removed from `src/app/api/auth/login/route.ts`; the file contains no reference to `posts`; served build `GET /api/auth/login` → 404 or 405, never a database-backed response. | Negative: `POST` handler byte-identical to baseline. | served build | grep + curl + diff |
| AC-206 | **Director-owned evidence item (not Claudy's):** Supabase dev project has "Allow new users to sign up" disabled; a direct `POST {SUPABASE_URL}/auth/v1/signup` returns a signups-not-allowed error; a known existing account still logs in. Recorded (redacted) at `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md`. Absence of this file blocks nothing in engineering; SOL records it as PRESENT / NOT YET in certification without inferring anything from AC-201. | — | Supabase dashboard + curl (Director) | evidence file |

## AC-300 — Preserved behavior

| AC | Required observable behavior | Controls | Boundary | Evidence |
|---|---|---|---|---|
| AC-301 | `git diff 5f45fb3..<candidate> --stat -- src/proxy.ts src/utils/supabase/middleware.ts src/utils/supabase/actions.ts src/app/api/auth/logout src/app/api/auth/confirm src/app/(auth)/layout.tsx src/app/profile src/app/(admin) src/app/owedbook src/services src/mocks src/components/owedbook src/components/common src/instrumentation.ts supabase scripts package.json package-lock.json next.config.js` → **empty**. | — | repo | diff transcript |
| AC-302 | `Navbar.invariant.test.tsx`, `InviteMemberForm.test.tsx`, `actions.test.ts` (protectPage), `proxy.test.ts`, `MobileNav.test.tsx`, `UserMenu.test.tsx`, `owedbook.test.ts`, `drawer-apply.integration.test.tsx` pass **unmodified** (a modification requires an addendum row). | — | Jest | jest output + `git diff --stat -- src/__tests__` showing only deletions/removed-module references |
| AC-303 | `src/components/global/Navbar.tsx` diff vs baseline touches only the flag-wiring lines; `NavbarHome`, `MobileNav`, `UserMenu` byte-identical (FIX-001 state). `grep -rn "useAuthStore" src/components/global/MobileNav.tsx src/components/global/UserMenu.tsx` shows only the logout call. | — | repo | diff + grep |
| AC-304 | **One-Walk (QA, real auth on a project SOL trusts; Director authorizes):** existing admin and member log in at `/auth`, land on `/owedbook`; admin reaches `/admin-portal`; both reach `/profile` and the password-update form renders; logout returns to `/`; unauthenticated `/owedbook` → `/auth`. Desktop and 375px, light and dark (Gate M). | — | browser + real auth | walk record |

## AC-400 — Board and hygiene

| AC | Required observable behavior | Evidence |
|---|---|---|
| AC-401 | End of S1 and S2: `npx tsc --noEmit` 0 errors · `npx eslint .` 0 errors (warning count recorded) · `npx jest --ci` all suites pass, zero skipped (suites/tests recorded) · `next build` exit 0 with **blank** Supabase env and with placeholder env; route count recorded. | `EXECUTION_LOG.md` |
| AC-402 | `git status --porcelain` empty after each Director stage commit; candidate SHA recorded at P3; `.env.local` not edited (Claudy states it). | log |

## Required regression and constraints

- Suites in AC-302 stay green unmodified. Journeys in AC-304 plus the 404 matrix in AC-102/201/205 are mandatory.
- Mocks: OwedBook and adminDemo untouched. Real auth only in the QA walk.
- Unavailable boundaries that do not block acceptance: deployment; live database state (AC-206 is Director evidence; the trigger correction is BIM-004's and is neither claimed nor verified here).
- Test counts are recorded, never a pass criterion on their own.

## Acceptance gates

Every AC needs independent evidence. Ambiguity or failure → SOL; scope → Architect/Director. Engineer green ≠ Gate Q. This certificate, when issued, does not certify that the installed signup trigger has been corrected.

## Erratum lane (append-only; empty at freeze)

| Date | AC | Original requirement | Ruling / rationale | Authority | Verification consequence |
|---|---|---|---|---|---|
| | | | | | |

## Appendix B — Complete current rulings (verbatim; A-01–A-12, OBS-1/OBS-2)

# RRM-001-CYBER-PHARMA — Rulings Addendum (append-only)

Contract layer (`CLAUDE.md`, `RRM_BRIEF.md`, `ACCEPTANCE_SPEC.md`, `CLAUDY_PROMPTS.md`) is frozen at engineering handoff. Rulings made after that — in chat, in Plan Mode review, during QA — are written here the same day, with provenance, and never edited into the frozen files (BIM-003 lesson: chat-made rulings absent from disk until flagged).

| ID  | Date | Seat | Question raised (path:line) | Ruling | Affects (AC / stage) |
| --- | ---- | ---- | --------------------------- | ------ | -------------------- |
| A-01 | 2026-09-20 | Architect (Fable) | `CLAUDY_PROMPTS.md` P1 HEAD check written before the pack was committed | Engineering starts from HEAD `88e2c33` (pack commit, docs only, parent `5f45fb3`). Code baseline for every preserved-path diff and `git diff --stat` in the spec stays `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`. P1 passes when `git rev-parse HEAD` == `88e2c33` **and** `git diff --stat 5f45fb3..HEAD -- src/ supabase/ scripts/ package.json next.config.js` is empty. | P1; AC-301; AC-402 |
| A-02 | 2026-09-20 | Architect / Director | C-01 — HEAD moved past `88e2c33` by A-01's own commit | Engineering HEAD = `7b33756` or any docs-only successor; pass test is the A-01 code-diff check. Provenance corrected (C-09): `5f45fb3` → `08ff9a7` (docs) → `88e2c33` (pack) → `7b33756` (A-01). | P1; AC-402 |
| A-03 | 2026-09-20 | Architect / Director | C-02 — `/auth?tab=register` CTAs in `HomePageContent.tsx:40`, `MobileNav.tsx:103`, `UserMenu.tsx:66` vs AC-203 zero and AC-303 byte-identity | Option B: the three hrefs become `/auth`; label "Start free trial" untouched. AC-303 narrows to "MobileNav/UserMenu diff touches only the href line"; `HomePageContent.tsx` added to allowed files (href line only). Tests stay unmodified. CTA destination/label deferred to the onboarding module (deferred ledger). | AC-202/203/302/303; S2 |
| A-04 | 2026-09-20 | Architect / Director | C-03 — AC-103 grep collides with adminDemo's own `addMember` (`useAdminDemoStore.ts:17,30`, `services/adminDemo.ts:225`) | Those three lines are standing exceptions. `.next/server` hits are allowed only in chunks that also contain the adminDemo store, each listed in EXECUTION_LOG. `getUserById`/`deleteUser`/`editUser` remain literal zero. | AC-103; S1 |
| A-05 | 2026-09-20 | Architect / Director | C-04 — AC-106 `moose` grep hits comments in `(admin)/layout.tsx:20` and `(public)/loading.tsx:4` | `(admin)/layout.tsx:20` = listed exception (AC-301 byte-identity wins). `(public)/loading.tsx:4` comment word edit permitted ("moose/admin" → "admin"). | AC-106/301; S1 |
| A-06 | 2026-09-20 | Architect / Director | C-05 — docs zero-grep vs "removed in RRM-001" notes; `docs/*.md` not in allowed list | Allowed: `docs/ROUTES_AND_SURFACES.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHORIZATION.md`, `docs/DATABASE_SETUP.md:150` (clause only), `docs/AUTHENTICATION.md` (note only), `README.md` (one line), `agent_docs/KIP_REGISTRY.md` (one line). Notes say "operator user-management portal" / "public self-registration", never the tool's name. Remaining signup prose → RRM-003 docs pass. | AC-106; S1/S2 |
| A-07 | 2026-09-20 | Architect / Director | C-06 — `agent_docs/phase2.md` "DO NOT TOUCH" lines | Historical record; untouched. | AC-106 |
| A-08 | 2026-09-20 | Architect / Director | C-07 — "flag unset" with `.env.local` auto-loaded and `NEXT_PUBLIC_*` build-inlined | "Unset" = explicit empty string on both build and serve; one fresh build per flag state; standalone `server.js` is the server (boot failure = stop and report). | AC-102; S1/S2 |
| A-09 | 2026-09-20 | Architect / Director | C-08 — AC-203 grep hits the AC-202 test itself and Next's `register()` hook in `instrumentation.ts:18` | Both standing exceptions, listed in EXECUTION_LOG. | AC-203 |
| A-10 | 2026-09-20 | Director (chat, 2026-09-20) | C-10/C-11 — root `CLAUDE.md` protocol vs pack Protected/allowed lists | Root `CLAUDE.md` base rules win: plans and completion reports live in `agent_docs/RESPONSES/`; session log allowed every stage; `CHANGELOG.md` allowed, one entry per stage; `RECOVERY.md` untouched until P5. Pack `evidence/` holds transcripts, greps, diffs only. | all stages |
| A-11 | 2026-09-20 | Architect / Director | §5 optional Server-Action-ID probe | Approved as **AC-103b**: before S1, read the five action IDs from baseline `.next/server/server-reference-manifest.json`; after S1, show the manifest no longer lists them and `POST $B/ -H "Next-Action: <old id>"` → 404 for each. Evidence → `evidence/S1_action_ids.txt`. | AC-103b; S1 |
| A-12 | 2026-09-20 | Architect / Director | O-1 — AC-103 `.next/server` grep matches `GoTrueAdminApi` method definitions from `@supabase/auth-js` (present at baseline) | Pass test for `.next/server` becomes: zero compiled `.auth.admin.` call sites **and** zero references to `moose-portal/users/actions` **and** AC-103b (five baseline action IDs absent from the manifest, each `Next-Action` POST → 404). `getUserById`/`deleteUser` hits allowed only as SDK definitions in chunks that also contain `/admin/users`. `editUser` stays literal zero. | AC-103; S1 — GREEN |
| OBS-1 | 2026-09-20 | Claudy → Architect | `src/utils/supabase/actions.ts` is a `"use server"` module, so `protectPage` is registered as a callable Server Action | Observation only; preserved path; calling it directly yields a redirect or the caller's own user. Carried to RRM-003 authoring for disposition. No action in RRM-001. | none |
| OBS-2 | 2026-09-20 | Claudy → Architect | Orphans created by removal: `TabsContent` export in `src/components/ui/tabs.tsx` (no consumer), `src/components/common/PaginationControls.tsx` (no consumer) | Left in place — both live in preserved paths. Carried to RRM-003 hygiene pass. No action in RRM-001. | none |

## Appendix C — Exact allowed, forbidden and protected scope text

The following source sections are copied verbatim. Appendix A carries the exact AC-301 preserved-path list; Appendix B supplies every ruled exception. These are engineering boundaries; this intake's writable boundary is QA/** only.

## Approved work and boundaries

**Accepted:** delete `src/app/moose-portal/**` · delete `src/app/api/auth/signup/**` · delete `src/components/auth/RegisterForm.tsx` and any signup-only component/test the Plan Mode trace proves has no other consumer · `/auth` becomes login-only (no register tab/form/link; if the tabs wrapper is now single-tab, simplify it rather than leave a dead tab) · remove `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` wiring (`src/components/global/Navbar.tsx:49`) and the key from `.env.example` · remove the `GET` handler in `src/app/api/auth/login/route.ts` (R-002) · delete `src/app/moose-portal/_lib/admin.ts`; retain `src/utils/supabase/admin.ts` with a header comment citing ledger E-04 (blessed, zero app importers, fenced to seeding/system jobs) · delete signup/Moose-only tests · one-line "removed in RRM-001 (2026-09-20)" notes in `README.md`, `agent_docs/KIP_REGISTRY.md` and any governing doc that still directs a reader to either tool (historical module folders, journals, reviews, recon are immutable and untouched).

**Preserved behavior / invariants:** existing-user login (`POST /api/auth/login`), logout, session refresh (`src/proxy.ts`, `middleware.ts`), `GET /api/auth/confirm` (OTP/magic-link callback used by recovery), profile password update, `protectPage` and its tests, Navbar Law + FIX-001 state, `src/app/(admin)/**` byte-identical, OwedBook untouched, adminDemo service/mocks byte-identical, `OwedBookService` untouched.

**Allowed files / surfaces:** exactly the deletion/edit list above, plus `src/__tests__/**` for removed tests and any test that referenced a removed module, plus this pack's `EXECUTION_LOG.md`, `QA_HANDOFF.md`, `evidence/**`.

**Forbidden:** any edit to `src/app/owedbook/**`, `src/services/**`, `src/mocks/**`, `src/components/owedbook/**`, `src/components/common/**`, `supabase/**`, `scripts/**`, `package.json`/lockfile, `next.config.js` (RRM-003/004 own those) · adding authorization to Moose · any new registration path · touching `.env.local`, `RECOVERY.md`, `agent_docs/SESSIONS/**`.

**Business decisions resolved:** D1, D2, E-04. **Open, not blocking:** none for this module.

**Permitted tooling / environment:** local `node_modules` (present); `next build` and `next start` (or standalone) with placeholder Supabase env for the 404 matrix; tsc/eslint/jest. No `npm install`. No live Supabase call in engineering. Real-auth login walk is QA's (SOL decides project; Director authorizes SCRATCH if used).

**Restoration:** stop local servers; placeholder env scoped to the command; `.next/` gitignored.


## Preserved (must be byte-identical or test-green at handoff)

`src/proxy.ts` · `src/utils/supabase/middleware.ts` · `src/utils/supabase/actions.ts` (`protectPage`) · `src/app/api/auth/login/route.ts` **POST** handler · `src/app/api/auth/logout/**` · `src/app/api/auth/confirm/**` · `src/app/(auth)/layout.tsx` · `src/app/profile/**` · `src/components/global/Navbar.tsx` except the flag wiring at `:49` · `NavbarHome`, `MobileNav`, `UserMenu` (FIX-001 state) · `src/app/(admin)/**` · `src/app/owedbook/**` · `src/services/**` · `src/mocks/**` · `src/components/owedbook/**` · `src/components/common/**` · `supabase/migrations/**` · `scripts/**` · `src/instrumentation.ts`.

## Protected (never touch)

`RECOVERY.md` · `agent_docs/SESSIONS/**` · `agent_docs/ACTIONS/BIM-*`, `FIX-001`, `PROTO06` (history) · `.env.local`.


