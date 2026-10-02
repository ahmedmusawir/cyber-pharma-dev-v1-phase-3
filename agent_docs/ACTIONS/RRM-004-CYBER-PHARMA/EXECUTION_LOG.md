# RRM-004-CYBER-PHARMA — Engineering Execution Log

Engineer · Approved scope/plan: `RRM_BRIEF.md` v1.0 + the P1 plan in `agent_docs/RESPONSES/response_2026-09-30_161037_rrm004-p1-plan.md` (Director-approved 2026-09-30) + rulings A-01…A-08 · Code baseline `649c36d0409c0b658cff14f779a09aad0c8e92b9` (RRM-003 merge commit; recorded at P1) · Targets: next `16.3.7` · sharp `0.35.5` · Branch: `phase-3-rrm004` (P2 started at `fe74dd9b4a9ecf6de4fd9b5aedd68cf342d39324`, P1b) · Run shape: one-shot (P2 single session) · Platform: `linux-x64` (glibc 2.39), Node v22.14.0, npm 10.9.2

## Preflight

P1: `evidence/PREFLIGHT_P1.txt` — 20/21 PASS; PF-21 N/A at P1 by design (DC-1 was the P1 approval); PF-16's literal command threw `ERR_PACKAGE_PATH_NOT_EXPORTED` → ruled A-03 (exported subpath) · P2: `evidence/PREFLIGHT_P2.txt` — 21/21 PASS (PF-05 literally empty; PF-16 per A-03 = `1.23.1 vips=8.18.3`; PF-19 re-captured into `evidence/S3_serve_before.txt`)

## Stage S1 — Pin + install + proof

Start: 2026-09-30T16:21:55+08:00 · Install start / end: 2026-09-30T16:22:02+08:00 / 2026-09-30T16:24:39+08:00 · `npm audit fix` start / end: 2026-09-30T16:24:39+08:00 / 2026-09-30T16:25:54+08:00 · End: 2026-09-30T16:26:32+08:00

| Item | Value | AC | Evidence |
|---|---|---|---|
| package.json lines changed | 3 (`next` `^16.2.1` → `16.3.7`, `eslint-config-next` `^16.2.9` → `16.3.7`, `overrides.sharp` `^0.35.3` → `0.35.5`); byte-identical across `npm audit fix` (cmp exit 0) | AC-101, AC-102, AC-402 | `evidence/S1_versions.txt` |
| `npm ls next sharp eslint-config-next` | `├── eslint-config-next@16.3.7` · `└─┬ next@16.3.7` · `  └── sharp@0.35.5 overridden` (exit 0; no invalid/missing/extraneous) · `node_modules/@img/`: `sharp-linux-x64` 0.35.5, `sharp-libvips-linux-x64` 1.3.4 (= sharp@0.35.5 `optionalDependencies`) | AC-107 | `evidence/S1_versions.txt` |
| `@img/sharp-libvips-linux-x64` versions (A-03 read) heif — BASELINE / AFTER | `1.23.1` (vips 8.18.3, package 1.3.2) / `1.23.5` (vips 8.18.7, package 1.3.4) · method: installed package metadata (`versions.json` shipped inside the `@img/sharp-libvips-*` package, read via its exported `./versions` subpath), cross-checked against the advisory's fixed-version statement (sharp 0.35.4 → libvips 1.3.3 → libheif 1.23.2); second read `require('sharp').versions.heif` = `1.23.5` | AC-103 | `evidence/S1_versions.txt` |
| `npm audit` totals before / after (critical · high · moderate · low) | 1 · 4 · 1 · 1 (7) / 0 · 0 · 0 · 0 (0) · target IDs GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-rgj7-g3m4-5g8c: present before, absent after | AC-104, AC-105 | `evidence/S1_audit_before.json`, `evidence/S1_audit_after.json` |
| Remaining advisories (DD-1 = sweep) | `found 0 vulnerabilities` (`metadata.vulnerabilities.total` = 0) | AC-105 | log |
| Lockfile moves: count / families / outside-family entries | 59 (41 pin: `next`, `@next/env`, `@next/eslint-plugin-next`, `@next/swc-*` ×8, `eslint-config-next`, `sharp`, `@img/*` ×25, `@emnapi/runtime`, `@swc/helpers` · 18 DD-1: `brace-expansion` ×9, `js-yaml` ×2, `baseline-browser-mapping`, `browserslist`, `caniuse-lite`, `electron-to-chromium`, `node-releases`, `update-browserslist-db`, `postcss-selector-parser`) / 0 outside / 0 entries added or removed — identical to the P1 dry run | AC-106, AC-403 | `evidence/S1_lockfile_moves.txt` |

Allowed exceptions: none · Self-repairs: none · Deviations: none. `npm install` printed `npm warn ERESOLVE overriding peer dependency` for `react-remove-scroll@2.5.7` ↔ `@types/react`; warning only, exit 0, not in a pinned family's dependency path.

## Stage S2 — Config

Start / End: 2026-09-30T16:26:45+08:00 / 2026-09-30T16:26:46+08:00

| File | Change and reason | AC | Preservation |
|---|---|---|---|
| `next.config.js` | `images` block (baseline lines 5–12, Cloudinary `remotePatterns`) removed per DD-2 = remove (A-06); `reactStrictMode: true,` is followed directly by `async headers() {` | AC-201–203 | `headers()`, `output`, `reactStrictMode` byte-identical: baseline minus lines 5–12 `diff` = identical (AC-202/405); AC-203 grep 0; `remotePatterns`/`res.cloudinary.com`/`images` in config 0; control `grep -rn res.cloudinary.com src public src/mocks docs` 0 (README.md 4 Markdown lines = listed exception) |

## Stage S3 — Board + served proofs

Start / End: 2026-09-30T16:26:57+08:00 / 2026-09-30T16:28:53+08:00

| Command/check | Exit/result | AC | Evidence |
|---|---|---|---|
| blank-env build · placeholder-env build (routes) | 0 (17) · 0 (17) | AC-301 | `evidence/S3_board.txt` |
| tsc · eslint (errors/warnings) · jest (suites/tests/skipped) | 0 · 0/35 · 34/164/0 | AC-302 | `evidence/S3_board.txt` |
| `git diff --stat <baseline> -- src src/__tests__ README.md docs/TESTING.md` · AC-401 path set | empty · empty; README/TESTING counts 164 / 34 = jest | AC-302, AC-304, AC-401 | `evidence/S3_board.txt` |
| `/` · chunk · `/auth` · `/owedbook` · `POST /api/auth/login` (status + Cache-Control) | 200 no-store · 200 `public, max-age=31536000, immutable` · 200 no-store · 307 → `/auth` no-store · 500 no-store (pre-existing, RRM-003 A-12 R3; same status in RRM-003 engineering and QA captures) | AC-303 | `evidence/S3_serve_after.txt` (+ `S3_serve_before.txt`) |
| `/_next/image` PNG probe (status, content-type, first 16 bytes, Cache-Control) | 200 · `image/webp` · `5249 4646 2e6c 0000 5745 4250 5650 3820` (`RIFF….WEBPVP8 `) · `public, max-age=14400, must-revalidate` · 27702 bytes, sharp-decoded webp 1080×626; body deleted after read | AC-204 | `evidence/S3_serve_after.txt` |
| negative Cloudinary host probe | 400, body `"url" parameter is not allowed` (A-04) | AC-204 | `evidence/S3_serve_after.txt` |
| direct GETs: 2 SVG + 1 PNG | 200 `image/svg+xml` · 200 `image/svg+xml` · 200 `image/png` | AC-205 | `evidence/S3_serve_after.txt` |
| server stopped, port free | free | AC-503 | `evidence/S3_serve_after.txt` |

## Metrics (AC-502)

| Metric | Value |
|---|---|
| P2 start / end (`date -Is`) | 2026-09-30T16:20:41+08:00 / 2026-09-30T16:31:56+08:00 |
| Wall-clock P2 | 11m15s (start → staging block) |
| Install wall-clock (`npm install`, and `npm audit fix` if DD-1 = sweep) | `npm install` 2m37s · `npm audit fix` 1m15s |
| Per-stage durations preflight / S1 / S2 / S3 / handoff | 1m06s / 4m37s / 0m01s / 1m56s / 2m54s (inter-stage gaps: 8s, 13s, 11s, 9s) |
| Checks executed (count) | 80 = preflight 22 (21 rows + PF-09 after stop) · S1 18 (3-line diff, install, audit fix, cmp, npm ls, `@img` listing, A-03 read, 2 package versions, `next --version`, `sharp.versions`, audit json, 3 target-ID absences, 3 target-ID presences before, move inventory) · S2 7 (diff, headers identity diff, AC-203 grep, AC-201 grep, control grep, README grep, config load) · S3 26 (2 builds + 2 route counts, tsc, eslint, jest, 3 stat diffs, AC-401 diff, AC-304 grep; boot, 5 header probes, image probe, hex dump, decode, negative status, negative body, 3 direct GETs, port) · handoff 7 (4 governing SHA-256 pairs as 1, ledger column check, changed-file inventory, repair diff, secrets scan, node_modules/.next absent from status, final status) |
| Self-repair attempts (count; list) | 0 |
| Director touches between P2 start and staging block | 0 |
| Stop conditions hit | none |
| Preflight failures (P1 / P2) | P1: 0 FAIL (PF-16 instrument path ruled A-03; PF-21 N/A by design) / P2: 0 |
| Lockfile entries moved (pin / sweep) | 41 / 18 (59) |

## Completion claim

Candidate: the Director's single P2 commit, SHA recorded at cut · Repair diff: `evidence/repair.diff` · Changed files: `evidence/changed_files.txt` · AC coverage claims: AC-101–107 → `evidence/S1_*` · AC-201–203 → `evidence/S2_config_diff.txt` · AC-204–205, AC-303 → `evidence/S3_serve_after.txt` (+ `S3_serve_before.txt`) · AC-301–302, AC-304 → `evidence/S3_board.txt` · AC-401–405 → `evidence/changed_files.txt`, `evidence/S3_board.txt`, `evidence/S2_config_diff.txt` · AC-501 → `evidence/PREFLIGHT_P2.txt` · AC-502 → §Metrics · AC-503 → Director's commit (`.env.local` not edited by the Engineer — only its key names were counted by PF-08; no local server left running; P1 scratch copy deleted) · AC-504 → `QA/QAM_MANIFEST.md`
Limitations / not run: authenticated image walk (QA, AC-605); QA's own install/build/serve (AC-601–604); AVIF input not exercised (no AVIF source; pin + libheif read are the proof); Windows-host advisory closed by version alone
QA handoff: `QA_HANDOFF.md` · QAM manifest: `QA/QAM_MANIFEST.md`

Engineering evidence, not independent QA certification.

## Closeout (P5, 2026-10-02 — docs only; transcribed from the QA Lead's certification, the Engineer certifies nothing)

| Field | Value |
|---|---|
| Verdict | **Gate Q PASS** for the tested product candidate. 31 product ACs PASS, zero unresolved product failures or blockers. QA Cleanup ACCEPTED; product repair NONE REQUIRED; zero repair rounds. QA Lead (JARVIS), 2026-10-02 (`QAM/QAM_CERTIFICATION.md`). AC-501–504 include verification of historical engineering records, not independently witnessed actions |
| Repo | `cyber-pharma-dev-v1-phase-3` |
| Code baseline | `649c36d0409c0b658cff14f779a09aad0c8e92b9` (RRM-003 merge) |
| Pack commit | `d3ea7f7` |
| Certified candidate | `2fbc72f1f514049255f2b94054bd11cc77cbd158` |
| QA HEAD | `6b6cad642f69314904938e9df1ec8fdfbe08f15a` (QA execution HEAD) |
| Evidence commit | `0463086c5fb125b6a69518778a83207f56e85662` (Q2 evidence + Q5 cleanup; documentation-only successor, not runtime-tested). `git diff --stat 2fbc72f..HEAD -- src package.json package-lock.json next.config.js supabase scripts` → empty at P5 |
| Review packages | `QAM/HANDOFFS/RRM004_QAM_Q2_REVIEW.zip` SHA-256 `89ed2b6697379a370c3fca2dcd4cd43467c24671f0551603611dd4c85e4c84d6` · `QAM/HANDOFFS/RRM004_QAM_Q5_REVIEW.zip` SHA-256 `9cffdbf1691b8fed4981343ee128185c6ca3d0512cc7b96df814064e47917d13` (verified at P5) |
| Closeout commit | `2e3eac9b7f0c3adf4e6eca7e3bbf60f9691d6a02` |
| Merge SHA | `a474a195e4388b6d999669041a206aed4339e9b1` (`--no-ff` merge of `qa/phase-3-rrm004` into `main`, pushed; recorded 2026-10-02) |
| QAM pilot verdict | **PARTIAL SUCCESS** under the charter's recorded-Q-stop rule (Q1 contract/scope stop resolved by A-15 and Q1b). Q2 one-shot execution SUCCEEDED: 0 Director interventions, 1 automated sign-in per role, 0 Q2 stops, 1 QA helper correction (Q2-SR01). Body 10m08s; release elapsed 17m21s. AC-701–710 PASS (`QAM/QAM_PILOT_RESULTS.md` §4) |
| QA cleanup (Q5) | Value scan before deletion, 0 leaks; `.env.qa.local` deleted with proof; no editor recovery files; post-deletion pattern scan 0 leaks; 8 helpers retained with reasons; inventory `QAM/ARTIFACT_INVENTORY.json`. Detail: `QAM/QAM_CLEANUP_REPORT.md` |
| Rulings | A-01…A-15 (`RULINGS_ADDENDUM.md`) and the erratum lane (`ACCEPTANCE_SPEC.md`) |

**Deferred, with owners:**

| Item | Owner | Gate |
|---|---|---|
| DA-2 Supabase signup OFF — **NOT YET** (`agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` absent at P5) | Director | carried from RRM-001 |
| QC-5 rotate the two dedicated QA passwords and record the actual date (`QAM/QAM_PILOT_RESULTS.md` §5) | Director | after certification |
| DC-7 merge, SHAs, scoreboard; acknowledge the pilot and decide adopt/amend/drop (`QAM/QAM_PILOT_RESULTS.md` §5) | Director | after this closeout |
| E-18 PBM trigger Enter behavior | Architect | future accessibility review (backlog) |
| Later Next patch published after the P1 cutoff | — | informational only under the approved targets (A-01) |

No product, configuration, contract or test byte changed at P5. No build or test was rerun.
