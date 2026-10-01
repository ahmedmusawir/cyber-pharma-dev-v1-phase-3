# RRM-004-CYBER-PHARMA — QAM Test Plan

Drafted by: QA Executor (Q1), 2026-10-01T13:47:12+06:00

Approved by: QA Lead / JARVIS, 2026-10-01. Approval recorded through the Director’s Q1b instruction; includes A-15’s bounded AC-403 reconciliation and checkpoint export requirement. Q2 execution requires the Director’s commit, clean-tree verification and Q2 command.

Q1b amendments applied by: QA Executor, 2026-10-01T16:51:01+06:00. Original draft provenance retained; the unamended draft and original Q1 report remain in the reviewed `HANDOFFS/RRM004_QAM_Q1_REVIEW.zip` (SHA-256 `34787660dd6c43c821e9ccf3689ebd7bd4762aec3f9c7b3f2128fe7c2161bc02`).

Candidate: `2fbc72f1f514049255f2b94054bd11cc77cbd158` · Q1 HEAD: `5362b79ca724e454011e77aeaf4b11101176d0b5` · Baseline: `649c36d0409c0b658cff14f779a09aad0c8e92b9`.

**APPROVED PLAN — Q1b amendments recorded; Q2 NOT RUN.** Q1 readiness was accepted by the QA Lead through the Director’s Q1b instruction. Q1-C01’s interpretation stop is resolved by the Engineer-recorded `../RULINGS_ADDENDUM.md` A-15 and the `../ACCEPTANCE_SPEC.md` AC-403 erratum; AC-403 product compliance remains unmeasured in Q2 and is not PASS. Q2 awaits the Director’s commit, clean-tree verification and explicit Q2 command. Authority: frozen acceptance spec plus A-01–A-15 and its erratum lane; risk requirements §A/§B/§C; governing playbook v1.1 and journal J-09/11/12/15/18–22. The checkpoint export amendment in §7.1 is the Director-relayed QA Lead instruction, distinct from A-15’s contract reconciliation. Manifest/handoff measurements remain claims.

## 1. Entry and stop gates

Run from repository root; `QAM=agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM`. At Q2 pin branch, full HEAD, candidate ancestry and clean porcelain; inspect the complete candidate→HEAD path list, including tests and configuration. Only documentation successors are permitted; A-15 adds no product-successor permission. Record commands, exits, timestamps, Node/npm and platform. Keep the approved main-dev target and existing credentials under A-07/A-14; recheck fingerprint `8ca83fc75bdf9fbc` at Q2 QF-15. No further Director manual login is requested, and SCRATCH/replica substitution is forbidden.

Rerun preflight in file order: QF-01/02/03/04/12/13/14/15/05/06/07/11 → fresh `rm -rf node_modules .next && npm ci` → QF-08/09/10/18/17. Record QF-16 as covered by the Q2 walk, not another sign-in. This is Q2's only install. Use free loopback port 36155, subject to its new QF-11 check. Q1 measured linux-x64, glibc 2.39, Node 22.14.0, npm 10.9.2, Playwright 1.59.1; rederive at Q2.

Stops retain AGENTS.md meanings: Q1 failed preflight; Q2 missing/inoperative credential or unapproved authenticated action; Q3 forbidden mutation; Q4 unresolved contract-dependent grade; Q5 untrusted instrument, registry failure, unreproducible build or missing native package; Q6 evidence/privacy blocker; Q7 changed HEAD/product successor; Q8 credential, target or QF-16 failure. Save evidence and log timestamp, command/path:line and required resolution in the execution report. Product failures without a Q-stop get evidence and a repair proposal while unaffected approved checks continue.

## 2. Risk ranking

| Order | Attack and reason | Risk requirements |
|---|---|---|
| 1 | Dependency identity, lockfile acceptance, advisory state and version instrument: establish the actual installed stack | A-1/3/5; B-3/4/5; C1/C2/C4 |
| 2 | Build prerequisites, then native PNG optimization and remote-host rejection: exercise sharp and prove attributable rejection | A-1/5/6/7; B-2/6; C1/C2 |
| 3 | Cache header pair and all three controls: detect loss of RRM-003 behavior | A-6/7; B-1; C1 |
| 4 | Independent board, immutable-source/config diffs and engineering-artifact review: complete remaining regression and scope criteria | A-2/4/9/10; C1 |
| 5 | Real-target image walk, privacy and phase cleanup: prove role/browser coverage without retaining identity data | A-8/11; B-7/8/9; C3/C6 |

All requirements are traced below; ordering dependencies do not remove ACs. A-15 resolves the prior Q4 interpretation; the Director’s commit, clean-tree verification and Q2 command still precede execution.

## 3. Independent execution and reference derivations

| ACs | Check, reference derivation and evidence |
|---|---|
| 101–102 | Read JSON pins and query registry versions. A-01/A-02 fix Next/eslint-config-next 16.3.7 and sharp 0.35.5; reject ranges, prereleases, wrong lines or versions below frozen floors. Reconstruct P1 highest-stable selection from registry publication times and the recorded P1 timestamp; later patches are observations. Save `evidence/deps/registry.txt`. |
| 103, 107, 601 | On Q2's fresh install run `npm ls next sharp eslint-config-next`, list `node_modules/@img/`, and read `require('@img/sharp-libvips-<platform>/versions')` (A-03). Derive native package requirements from installed sharp's optionalDependencies and check installed metadata. Compare heif numerically to 1.23.2; cross-check `require('sharp').versions`. Independently derive baseline package/version/integrity from `git show <baseline>:package-lock.json`; read the corresponding registry tarball's metadata in a QA-only temporary fixture, without installing another dependency tree or executing its code. Compare with the Engineer's recorded before-install read as historical artifact content, explicitly not an observed historical execution. Require baseline below floor and changed AFTER. Save `evidence/deps/versions.txt`; remove the tarball/fixture after recording metadata and integrity checks. |
| 104–105, 601 | Capture fresh `npm audit --json`, exit and timestamp. Derive affected nodes, severity, IDs and totals directly from JSON. The three frozen GHSA IDs must be absent; no critical/high target-family advisory; sweep requires total zero. Independently audit a QA-only copy of baseline package/lock with `--package-lock-only --json` to test the positive control, without installation or fixes; inspect the historical baseline audit separately. New advisories receive publication-date and installed-package evidence and ADJUDICATE under B-5/C4, preserving any literal threshold miss. No automatic exemption or dependency repair. |
| 106 | Compare baseline and candidate lockfile package maps by full install path; list every version move plus additions/removals and classify against RRM_BRIEF.md:42 and A-05. Pin families: next, @next/env, @next/eslint-plugin-next, @next/swc-*, eslint-config-next, sharp, @img/*, @emnapi/runtime, @swc/helpers. Sweep families: brace-expansion, js-yaml, baseline-browser-mapping, browserslist, caniuse-lite, electron-to-chromium, node-releases, update-browserslist-db, postcss-selector-parser. Compute counts; 59 is a claim, not the oracle. Save `evidence/static/lockfile_moves.json`. |
| 201–203, 202/405 | Derive image consumers from source imports and rendered branches; independently scan baseline/candidate src, public and docs for Cloudinary. List README Markdown exceptions. A-06 requires no images block/remotePatterns/Cloudinary host; forbid unoptimized, dangerouslyAllowSVG and loader overrides. Compare config bytes outside the removed images block, including headers(), standalone and reactStrictMode. Save `evidence/static/config.txt`. |
| 204–205, 604 | Serve the QA placeholder build with the explicit static/public copy. GET local PNG through `/_next/image` with width 1080, quality 75 and `Accept: image/webp`: require 200, image/webp, RIFF at byte 0 and WEBP at byte 8. Record first 16 bytes and Cache-Control, without grading its observed value. Negative host request uses width 64/quality 75 and must return 400 plus the A-04 URL-denial body. Direct GET the two source-derived SVGs and PNG: require 200 and matching MIME type. Keep status/headers/hex/body-of-denial in `evidence/images/`; discard image response bodies. |
| 301, 602 | Separately clear .next and run the specified blank-env and placeholder-env builds, setting all four Supabase/site variables only on the process. Preserve both route tables and compare to the literal 17-route contract; derive route names from each build, not the manifest. Copy `.next/static` and public into standalone; serve with exactly the placeholder variables used at build. Build transcripts belong in `evidence/board/`; compiled output is transient. |
| 302, 304, 602 | Run independent `npx tsc --noEmit`, `npx eslint .`, and full `npx jest --ci --json --outputFile=<QA evidence path>`. Record errors/warnings and suites/tests passed, failed, pending/skipped and todo. Derive test inventory from baseline source/config and compare measured JSON with README.md:8/134 and docs/TESTING.md:10 (34/164). Require zero failed/skipped; prove source/tests and README/TESTING unchanged. Different totals with empty source diff trigger contract review/Q4, never an adjusted expectation. Save `evidence/board/`. |
| 303, 603 | Select an existing chunk from the QA build, record its path, then use `curl -I` for home and chunk. Require home 200/no-store; chunk 200 with immutable or max-age=31536000 and no no-store. Controls: /auth 200/no-store; signed-out /owedbook 307→/auth/no-store; empty POST /api/auth/login carries no-store. Record its status without inventing a status requirement. Read historical before-capture alongside current output; do not claim an independent baseline serve. Save `evidence/headers/`. |
| 401–405 | Compare baseline to candidate and Q2 HEAD for every preserved path listed in AC-401. Parse package.json diff: exactly the three allowed value replacements. Check complete changed-path inventory, source absence, headers byte identity, and ignored build/dependency artifacts. Measure AC-403 independently against its original allowlist plus only A-15’s five historical hunks and twelve byte-identical archive moves, as detailed in §10. Separate baseline→candidate, candidate→Q2 HEAD, and uncommitted QA outputs. Verify hunk provenance and archive byte identity; a listed path alone does not authorize other edits. Classify root-protocol/ledger/map changes against their own authority; no blanket agent_docs exemption. Q1b’s interpretation resolution supplies no product PASS. Save `evidence/static/`. |
| 501–504 | Inspect engineering preflight, timestamps/order, baseline captures, metrics, handoff and manifest for completeness/provenance; inspect read-only history and recorded cleanup. Distinguish verified artifact content from unobserved prior execution, prior tree cleanliness and .env.local handling (A-9). No historical claim becomes an independently observed fact. Save `evidence/static/engineering_artifacts.txt`. |
| 605–606 | Execute §6, then the privacy sequence in §7. Evidence under `evidence/browser/` and `evidence/privacy_audit.json`; Q1 login evidence does not replace Q2. |

Use fresh outputs as actual values throughout. Engineering warning counts, encoded-image bytes/size, heif value and lockfile totals are comparison claims; frozen floors, byte signatures, statuses and explicit test/route counts remain literal criteria. Deployment, Windows execution and AVIF-input testing retain the contract's waivers.

## 4. Negative controls

Retain the immutable static chunk alongside no-store pages and the three AC-303 controls. Retain remote-host denial status **and body**, and successful local PNG encoding. Require empty preserved-source/tests diffs with green existing suites. Include baseline vulnerable audit/package metadata as positive controls for detection; label historical evidence. Retain signed-out protected-route denial after each role's logout. A wrong MIME type, broken image or generic 400 never counts as the required result.

## 5. Deliberate instrument attack

Build a QA-only numeric semver/floor validator used by the real metadata assertion. First feed a synthetic version below 1.23.2 and malformed input: each must exit non-zero. Then pass a synthetic at-floor control: exit 0. Finally run the same validator on the independently read installed value; also compare that value to a deliberately higher synthetic floor and require non-zero. Preserve inputs (synthetic/public versions only), commands, exits and output in `evidence/deps/instrument_attack.txt`. Do not edit product or installed packages. A false green is Q5. QF-17 additionally proves the credential scanner catches four encodings of a random synthetic secret and leaves a clean control clean.

## 6. Authenticated image walk

Stop placeholder server and prove its port free. Make the separate real-target build using approved .env.local, repeat static/public copy, and start `node --env-file=.env.local .next/standalone/server.js` with loopback port/host. Only the browser/scanner helpers receive .env.qa.local through Node's env-file flag. Never print identities or save their values.

Each cell runs at 1280×900 and 375×812, light and dark: four combinations. Reuse one in-memory context and exactly one form sign-in per role; carry its session across viewport/theme changes. Assert the effective HTML theme; set only the browser theme preference when a route has no theme control.

| Role/state | Requested route and expected rendered inventory | Cells |
|---|---|---:|
| Signed out, before ADMIN login | /auth: one logo-lockup.svg | 4 |
| ADMIN signed in | / redirects to /owedbook: one logo-color.svg; /owedbook: one logo-color.svg; /admin-portal: one logo-color.svg | 12 |
| MEMBER signed in | / redirects to /owedbook: one logo-color.svg; /owedbook: one logo-color.svg | 8 |
| Additional signed-out image control, before login | /: logo-lockup.svg plus owedbook-mockup.png | 4 |

This is 24 contracted cells plus four public-home controls. Source derivation: NavbarHome.tsx:23, NavbarLoginReg.tsx:11, Navbar.tsx:124, HomePageContent.tsx:87; `(public)/page.tsx:13` redirects authenticated home requests. Record requested and final routes separately; do not assume the manifest's public-home inventory survives the authenticated redirect. Both roles initially land on /owedbook; ADMIN then navigates to /admin-portal.

Per cell record image count and normalized local source multiset (decode the optimizer URL's source), and require every DOM img to be complete with positive naturalWidth. Include all mounted images, not only visible ones; scroll to trigger lazy images and await decoding. Require zero failed image requests, image responses ≥400 and console/page errors. Record route/status/counts without message bodies or identity data. Capture tightly cropped image elements only. Start an allowlisted action timeline after login; retain only route/cell/action/result metadata, never DOM/network bodies, tokens, cookies or input values. No raw authenticated trace archive or storageState is retained.

Logout through POST /api/auth/logout, prove /owedbook redirects to /auth, close context, remove and verify recorded temporary browser paths. Stop server and prove port free. No business actions, account changes or settings writes. Q1 already used ADMIN 1 / MEMBER 1; Q2 sign-ins are a separate counter.

## 7. Evidence, status and privacy rules

Every AC has PASS/FAIL/BLOCKED/NOT RUN/ADJUDICATE, command/exits and an evidence path; no PASS from narration. Findings carry ID, AC, expected/actual, reproduction, evidence and implementation/contract/environment/instrument/observation class. Inherited behavior needs baseline proof before being called regression. Any product FAIL creates REPAIR_PROPOSAL.md for QA Lead/Architect disposition; an unresolved interpretation is ADJUDICATE, not an implementation repair.

At Q2 return write matrix, report, inventory and pilot §1–§3; recheck HEAD and ensure only authorized QA files are dirty. Do not certify. Inventory paths/sizes/SHA-256 cover selected durable records and justified helpers, excluding .next/node_modules, compiled output, caches, image bodies and raw traces.

Q5 runs only on its command: value scan with four credential values/encodings in memory → sanitize and record actual leaks/resolutions → delete .env.qa.local and all QA-created auth/profile state → verify removal → pattern scan. Scan the complete QAM lane, own responses/session logs and recorded temp paths, including archive contents. Documentation mentions are path:line records, not leaks. Report credential editor files by name without opening/deleting them. Actual leaks require Director-owned rotation; an unremovable hit is Q6. Certification waits for clean scans and QA Lead review of matrix, evidence map and cleanup report.

## 7.1. Checkpoint review export (Director-relayed QA Lead amendment)

At Q2 return or a material Q-stop, prepare one indexed, privacy-checked review ZIP under `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/HANDOFFS/`. This destination is expressly authorized by the Director. Use a checkpoint/attempt-specific name; if it exists, select a numbered revision without overwriting. Preserve prior attempts, original evidence and reports. Packaging reuses existing measurements; never rerun tests merely to prepare the review.

Use an explicit inclusion list and repository-relative paths for source files. Include a `REVIEW_START_HERE.md` stating the exact decision requested, checkpoint/attempt and timestamp/timezone, working-tree state, full baseline/candidate/current HEAD identities, what ran, blockers and NOT RUN items. Include the current execution report, AC evidence matrix, this approved plan, relevant rulings/errata, findings and their supporting evidence, and the helpers needed to interpret the measurements. Distinguish measured QA results, engineering claims and governing rulings; identify missing items and unfilled scaffolds without inventing evidence. Separate baseline→candidate, candidate→HEAD and uncommitted QA outputs.

Include `FILE_INDEX.json` listing every included file’s archive path, original repository path where applicable, purpose and SHA-256; exclude the index itself from its own hash list. Reuse the existing Q1 export’s explicit-list/index/integrity approach and its `EXPORT_EVIDENCE/scan_selected_export.cjs` path adapter with the validated `AUTOMATION/privacy_scan.cjs`, preserving the source scanner and earlier privacy records. The reviewed Q1 ZIP supplies the adapter for reuse, not a nested export member or fresh-test evidence.

Run the existing value/pattern privacy instruments over the selected contents and final released archive, including expanded members. Only the local scanner helper loads `.env.qa.local` using Node’s env-file flag; credential values and encodings stay in process memory and never appear in output or exceptions. Existing scanner validation is evidence of the instrument, not a substitute for scanning the new export. Exclude all env files and credential backups, passwords/tokens/keys/cookies, authentication state, browser profiles, raw authenticated traces, node_modules, generated builds/.next, Git internals, temporary export staging and nested archives. Verify ZIP integrity, exact archive/index membership, indexed hashes, no duplicates or unintended files, and coverage of the released contents by privacy checks; report the exact ZIP path, file count, ZIP SHA-256, actual check outcomes, missing items and exclusions. Do not claim an unrun check passed.

Keep `.env.qa.local` for authorized continuation; packaging is not Q5. If privacy or integrity blocks safe release, withhold the unsafe package and record the blocker/decision requested without exposing values. Record the material stop and available safe evidence even when an export cannot be released. Q2 execution and any stop resumption remain gated by the applicable Director command; the export grants no repair, certification or contract-edit authority.

## 8. Pilot-process rows, separately recorded

| AC | Planned process evidence |
|---|---|
| 701–702 | Manifest authorship/content; Executor draft and dated QA Lead approval after candidate; independent derivations |
| 703–704 | Ordered Q1/Q2 preflight, fresh installs and every timestamped Q-stop/resolution; original Q4/Q1-C01 stop retained; interpretation resolved in Q1b by A-15, with no Q2 compliance grade |
| 705–706 | Director touches by class, phase-specific sign-ins, zero human credential entries; independent install/build identity |
| 707 | Repair proposal iff product FAIL; prove no QA product edits |
| 708–709 | Exact phase commands, wall clocks, active-time limits, interruptions, self-repairs, helpers/evidence/privacy metrics; comparisons traced to prior journals/observations; no unlogged Q2 intervention |
| 710 | QA Lead alone records certification after reviewing the three required inputs; Executor leaves that grade pending |

AC-700 never rescues or blocks product Gate Q. QA Lead/Director result sections stay blank.

## 9. Retest rule

After an approved repair and Director commit, re-pin SHA, verify the precise approved diff, identify round N, rerun affected ACs plus the full required regression board and any evidence the repair could affect (C5/J-22). Preserve prior attempts and provenance for carried evidence. No new attack scope or QA product repair.

## 10. Q1-C01 historical stop and Q1b resolution

### Original Q1 record (historical; preserved verbatim below)

**Q1-C01 — AC-403 — contract gap — ADJUDICATE, Q4.** ACCEPTANCE_SPEC.md:47 permits only its enumerated baseline-diff paths. CLAUDY_PROMPTS.md:9–11/44 separately authorizes campaign-journal and RRM-003 closeout edits. The actual baseline→HEAD diff additionally includes RRM-002 EXECUTION_LOG.md/README.md, RRM-003 EXECUTION_LOG.md/README.md and RRM_CAMPAIGN_JOURNAL.md. History attributes these to a93393d and ee4a049. A-01–A-14 and the erratum lane do not reconcile AC-403's literal allowlist. Evidence: `evidence/recon.txt`.

Requested resolution: QA Lead/Architect disposition, recorded by the Engineer as an append-only addendum/AC-403 erratum, naming the accepted pre-candidate documentation changes and their provenance (or requiring a bounded correction). Keep the original code baseline and protected product paths. Response archives/root-protocol records must be classified explicitly during that review; do not exempt all agent_docs. The Executor applies only the resulting plan amendments in Q1b. The existing Q4 is not resolved by approving an unchanged plan.

Resolved differences: QA→QAM and plan authorship (A-09/A-11), metadata export path (A-03), denial-body requirement (A-04), credential/install/target rules (A-10/A-13/A-14), and two-theme coverage (C3) use their recorded rulings. Authenticated home redirects are source-derived walk behavior, not a claimed rendering of the public landing page. Q1 does not issue product grades or a verdict.

### Q1b disposition and bounded Q2 measurement

**Q1-C01 interpretation: RESOLVED by A-15; AC-403 product result: NOT RUN in Q2.** Resolution recorded at 2026-10-01T16:51:01+06:00. `../RULINGS_ADDENDUM.md:21` (A-15) and `../ACCEPTANCE_SPEC.md:112` (AC-403 erratum) are present and consistent with the supplied ruling recorded verbatim in `agent_docs/RESPONSES/response_2026-10-01_164136_rrm004-a15-ac403.md`. Read-only comparison confirms that the frozen AC-403 row at line 47 is unchanged; the Engineer appended the ruling and erratum. The original Q4 stop at `2026-10-01T13:42:29+06:00`, its timestamps and Q1 evidence remain intact; the execution report appends this resolution. No product criterion is waived or graded by Q1b.

The unchanged baseline is `649c36d0409c0b658cff14f779a09aad0c8e92b9`; the unchanged product candidate is `2fbc72f1f514049255f2b94054bd11cc77cbd158`. Q2 measures the original AC-403 allowlist plus exactly these A-15 exceptions:

| Historical path/activity | Only accepted hunk or move | Recorded authority/provenance |
|---|---|---|
| `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` | Existing closeout/merge SHA fills from `a93393d` | A-15; archived SHA-recording plan and Director approval, 2026-09-30 12:46 |
| `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/README.md` | Existing closeout/merge SHA fills from `a93393d` | Same SHA-recording authority |
| `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/EXECUTION_LOG.md` | Existing closeout/merge SHA fills from `a93393d` | Same SHA-recording authority |
| `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/README.md` | Existing merged-to-main suffix from `ee4a049` | A-15; `../CLAUDY_PROMPTS.md` P0 step 4; Director approval, 2026-09-30 15:09 |
| `agent_docs/RRM_CAMPAIGN_JOURNAL.md` | Existing Architect entry and friction-log updates from `ee4a049` | A-15; `../CLAUDY_PROMPTS.md` P0 step 1; same 15:09 approval |
| Twelve historical response moves into `agent_docs/RESPONSES/_OLD/` | Exactly the byte-identical moves in `1eb9c04`; no content changes | A-15 and governing J-09; historical Director archive activity |

SHA-recording authority: `agent_docs/RESPONSES/_OLD/response_2026-09-30_123954_rrm003-sha-record-plan.md` and `agent_docs/SESSIONS/session_2026-09-30.md` (12:46). P0 approval is in that session log (15:09). Inspect the cited commits independently in Q2; do not use an Engineer claim or rename label alone as proof of hunk/content compliance.

- **A. Baseline → product candidate:** inventory all changes; compare the five exception paths at hunk level with the named commits; enumerate the twelve moves from `1eb9c04` and compare each before/after content. Any additional hunk or archive content change requires its own authority; no new closed-module edits are authorized.
- **B. Product candidate → Q2 HEAD:** pin the Director’s new committed QA HEAD, check candidate ancestry and the complete successor diff. Require documentation-only successors and classify each path by the original allowlist/recorded authority. The historical exceptions do not permit new product or closed-module changes; Q7 still applies.
- **C. Uncommitted QA outputs:** require a clean tree at Q2 entry, then list all tracked/untracked outputs separately at return or stop, showing their QA lane/phase authorization. Do not silently fold QA outputs into the product candidate or treat all `agent_docs/` as allowed. Credentials and transient artifacts stay excluded from durable records/staging.

AC-403 receives its independent Q2 grade only after those measurements. Any uncovered contract-dependent interpretation returns to Q4/ADJUDICATE; evidence of a product failure follows the approved finding/retest rules. The accepted Q1 readiness evidence is not Q2 execution. The Director must commit the Engineer correction and Q1/Q1b artifacts, verify a clean tree, and issue Q2 before execution starts.
