# RRM-004-CYBER-PHARMA — AC Evidence Matrix (QA Executor)

Executor: QA Executor · Q2 attempt 1 · 2026-10-01T17:19:15+06:00 · Candidate: `2fbc72f1f514049255f2b94054bd11cc77cbd158` · QA HEAD: `6b6cad642f69314904938e9df1ec8fdfbe08f15a` · linux-x64/glibc 2.39; Node 22.14.0/npm 10.9.2.

Measured results below are QA inputs, not certification. PASS for historical process rows means verified artifact content, explicitly not witnessed execution. AC-606 updated from actual Q5 cleanup evidence on 2026-10-02; all other Q2 grades are carried unchanged. Original Q1/Q1b history is preserved in the execution report.

## Product (Gate Q input)

| AC | Status | Evidence path (relative to QAM/) | Note |
|---|---|---|---|
| AC-101 | PASS | `evidence/deps/summary.json`; `evidence/deps/registry_next_version.json`; `evidence/deps/reference_provenance.txt` | Exact 16.3.7 pin; highest stable 16.3.x at P1. Later 16.3.8 publication recorded as observation. |
| AC-102 | PASS | `evidence/deps/summary.json`; `evidence/deps/registry_sharp_version.json`; `evidence/deps/registry_eslint-config-next_version.json` | sharp 0.35.5 exact; eslint-config-next 16.3.7 exact. |
| AC-103 | PASS | `evidence/deps/baseline_metadata.json`; `evidence/deps/installed_metadata.json`; `evidence/deps/instrument_attack.txt` | Baseline locked tarball SRI verified, heif 1.23.1; QA install 1.23.5, sharp cross-check equal. Invalid controls rejected; historical install not claimed. |
| AC-104 | PASS | `evidence/deps/audit_current.json`; `evidence/deps/audit_baseline.json` | Current total zero; all three target GHSA IDs absent. Independent baseline audit contains all three. |
| AC-105 | PASS | `evidence/deps/audit_current.json`; `evidence/static/engineering_artifacts.txt`; `evidence/static/summary.json` | Sweep current total zero; historical cmp content verified; QA measured exactly three package value changes. |
| AC-106 | PASS | `evidence/static/lockfile_moves.json` | 59 moves: 41 pin / 18 sweep; zero outside families, zero additions/removals. |
| AC-107 | PASS | `evidence/deps/npm_ls.txt`; `evidence/deps/installed_metadata.json`; `evidence/deps/native_packages.txt` | npm ls exit 0, sharp overridden; linux-x64 native package versions exactly match installed sharp optionalDependencies. |
| AC-201 | PASS | `evidence/static/summary.json`; `evidence/static/commands.json` | No images/remotePatterns/Cloudinary config; no baseline/candidate runtime consumers; README Markdown exceptions listed. |
| AC-202 | PASS | `evidence/static/summary.json`; `evidence/static/commands.json` | Baseline minus images block equals current config; headers, standalone and strict mode preserved. |
| AC-203 | PASS | `evidence/static/summary.json` | No unoptimized/dangerouslyAllowSVG/loader override. |
| AC-204 | PASS | `evidence/images/local_png.json`; `evidence/images/negative_host.json` | PNG optimizer 200 image/webp, RIFF/WEBP bytes; host rejection 400 plus required URL-denial body. |
| AC-205 | PASS | `evidence/images/direct_gets.json` | Two SVGs and one PNG return 200 with matching MIME types. |
| AC-301 | PASS | `evidence/board/build_blank.txt`; `evidence/board/build_blank.json`; `evidence/board/build_placeholder.txt`; `evidence/board/build_placeholder.json` | Both QA builds exit 0, 17 routes each. |
| AC-302 | PASS | `evidence/board/tsc.command.json`; `evidence/board/eslint.txt`; `evidence/board/jest_results.json`; `evidence/board/baseline_test_inventory.json`; `evidence/static/summary.json` | tsc 0; eslint 0 errors/35 warnings; Jest 34 suites/164 tests, zero failed/pending/todo; source unchanged. |
| AC-303 | PASS | `evidence/headers/current.json`; `evidence/headers/historical_engineer_before.txt`; `evidence/images/served_summary.json` | QA home/chunk pair and all three negative controls pass. Empty login POST 500 observed, no invented status requirement. Before capture is historical. |
| AC-304 | PASS | `evidence/board/baseline_test_inventory.json`; `evidence/static/summary.json` | Baseline source/config derives 34/164; measured files/totals match unchanged README and TESTING counts. |
| AC-401 | PASS | `evidence/static/summary.json`; `evidence/static/commands.json` | Complete protected path list unchanged at candidate, QA HEAD and working tree. |
| AC-402 | PASS | `evidence/static/summary.json` | Exactly next, eslint-config-next and overrides.sharp value replacements; no other package changes. |
| AC-403 | PASS | `evidence/static/summary.json`; `evidence/static/byte_identity.json`; `evidence/static/A_baseline_candidate.txt`; `evidence/static/B_candidate_head.txt`; `evidence/static/C_uncommitted_during_static.txt`; `evidence/q2_final_checks.json` | Independent Q2 classification under original allowlist plus A-15: five exact historical hunks, twelve byte-identical moves; no unresolved paths. QA outputs classified separately. |
| AC-404 | PASS | `evidence/static/summary.json`; `evidence/q2_final_checks.json` | No product-code edit; no repair by QA. |
| AC-405 | PASS | `evidence/static/summary.json`; `evidence/static/commands.json` | headers() preserved byte-for-byte; only images block removed. |
| AC-501 | PASS | `evidence/static/engineering_artifacts.json`; `evidence/static/engineering_artifacts.txt` | Verified historical artifact content: 21/21 preflight rows and baseline captures before install; not independently witnessed prior execution. |
| AC-502 | PASS | `evidence/static/engineering_artifacts.json`; `evidence/static/engineering_artifacts.txt` | Verified historical metrics fields and content; prior check counts/touches/durations remain engineering claims. |
| AC-503 | PASS | `evidence/static/engineering_artifacts.json`; `evidence/entry_gate.json`; `evidence/images/served_summary.json`; `evidence/browser/server_shutdown.json` | Verified historical hygiene statements and candidate record; current clean entry/server shutdown independently observed. Prior env handling/scratch deletion not witnessed. |
| AC-504 | PASS | `evidence/static/engineering_artifacts.json` | Manifest completeness and claims-only authorship verified as artifact content. |
| AC-601 | PASS | `evidence/deps/install.txt`; `evidence/deps/summary.json`; `evidence/deps/installed_metadata.json`; `evidence/deps/audit_current.json` | Fresh QA install and independent dependency/audit/metadata measurements; same committed product candidate. |
| AC-602 | PASS | `evidence/board/build_blank.json`; `evidence/board/build_placeholder.json`; `evidence/board/board_summary.json`; `evidence/board/eslint.txt` | Independent QA builds and full regression board passed, 17 routes / 34 suites / 164 tests. |
| AC-603 | PASS | `evidence/headers/current.json`; `evidence/images/served_summary.json` | Independent served header pair and controls passed. |
| AC-604 | PASS | `evidence/images/local_png.json`; `evidence/images/negative_host.json`; `evidence/images/direct_gets.json` | Independent local PNG encoding, attributable remote denial and direct image GETs passed. |
| AC-605 | PASS | `evidence/browser/walk.json`; `evidence/browser/walk_command.txt`; `evidence/browser/server_shutdown.json`; `evidence/static/source_image_derivation.txt` | 24 contracted cells plus 4 public-home controls, both themes and widths; ADMIN 1/MEMBER 1 sign-ins and logouts; zero image/console/page errors; profiles removed. |
| AC-606 | PASS | `evidence/Q5/privacy_after_values.json`; `evidence/Q5/privacy_after_deletion.json`; `evidence/Q5/env_removal.json`; `evidence/Q5/removal_proof.json`; `QAM_CLEANUP_REPORT.md` | Q5 value scan 0 leaks before env deletion; deletion verified; all recorded auth/profile paths absent; post-deletion pattern scan 0 leaks. No retained auth state/raw authenticated trace. Executor result, not certification. |

## Pilot process (separate from Gate Q)

| AC | Status | Evidence path (relative to QAM/) | Note |
|---|---|---|---|
| AC-701 | PASS | `evidence/static/engineering_artifacts.json` | Engineer manifest reviewed as facts/claims; no test plan or risk ranking authored there. |
| AC-702 | PASS | `evidence/entry_gate.json` | Committed plan retains Executor draft provenance and QA Lead / JARVIS approval, after candidate; A-15 applied. |
| AC-703 | PASS | `evidence/QAM_PREFLIGHT_Q1.txt`; `evidence/QAM_PREFLIGHT_Q2.txt`; `evidence/deps/install.txt` | Q1 18/18 and Q2 17 measured rows in required order; QF-16 covered by Q2 walk; one fresh install per phase. |
| AC-704 | PASS | `evidence/deps/helper_repair_01.json`; `evidence/entry_gate.json` | No enumerated Q-stop in Q2. Original Q1 Q4 and A-15 resolution preserved in report; helper self-repair explicitly logged. |
| AC-705 | PASS | `evidence/browser/walk.json` | Zero Director interventions/credential entries inside Q2; automated ADMIN 1/MEMBER 1. |
| AC-706 | PASS | `evidence/deps/install.txt`; `evidence/board/build_blank.json`; `evidence/board/build_placeholder.json`; `evidence/board/build_main_dev.json` | QA-owned clean install and three separate builds, platform/time recorded. |
| AC-707 | PASS | `evidence/q2_final_checks.json` | No product FAIL, no REPAIR_PROPOSAL.md (template only); no QA product edits. |
| AC-708 | PASS | `evidence/q2_final_checks.json` | Pilot metrics recorded with provenance and explicit limits: Director active time not instrumented; continuous elapsed is an upper bound on Executor active time. |
| AC-709 | PASS | `evidence/entry_gate.json`; `evidence/q2_final_checks.json` | Exact Director Q2 command retained in results; no further Director instruction during Q2. |
| AC-710 | PASS | `QAM/QAM_CERTIFICATION.md` | QA Lead, 2026-10-02: "AC-710: PASS through this QA Lead review and certification." Recorded by the Engineer at P5 (transcription, not certification). Executor's Q2 entry was NOT RUN, `evidence/q2_final_checks.json`: reserved for the QA Lead after Q5 and review of the matrix, evidence map and cleanup report; no self-certification. |

Totals — product: **31 PASS / 0 FAIL / 0 BLOCKED / 0 NOT RUN / 0 ADJUDICATE**. Process: **9 PASS / 0 FAIL / 0 BLOCKED / 1 NOT RUN / 0 ADJUDICATE**. AC-606 has Q5 cleanup evidence; AC-710 remains QA Lead-owned.

P5 update (Engineer, 2026-10-02, from the QA Lead's certification): AC-710 → PASS, so process totals are now **10 PASS / 0 FAIL / 0 BLOCKED / 0 NOT RUN / 0 ADJUDICATE**. The Executor's line above is kept as recorded at Q2/Q5.
