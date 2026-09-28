# RRM-002-CYBER-PHARMA — QA Cleanup Report (J-19)

**Engineer** · P5, 2026-09-28 · branch `qa/phase-3-rrm002` @ `cb9f7b7` · after Gate Q PASS (QA Lead, 2026-09-28). Bounded cleanup of the QA lane only; no product, configuration, contract or QA Lead text changed.

## Pre-condition note

The P5 instruction expected only `QA_CERTIFICATION.md` and `SOL_QA_JOURNAL_ENTRY.md` to be untracked. On disk the whole QA-lane output was untracked; only `QA/README.md` and `QA/GOVERNING/` are committed at `cb9f7b7`. Removed files therefore have no copy in git history. Before removal, all 18 were archived to a tar.gz outside the repository (Engineer scratchpad, session-scoped), verified by listing against the manifest, with the SHA-256 of each file recorded below.

## Removed (18)

| Path | Bytes | SHA-256 | Reason |
|---|---|---|---|
| `QA/browser_harness/bundle.js` | 1425354 | `36af3ae17d28eef5597331aeac5957baa2558ef0efe5db53b32fa60f8c2c750d` | generated webpack bundle of the race instrument (build output) |
| `QA/browser_harness/index.html` | 168 | `d56b085429c1584e3ead9c05967f62a252999b415417547480ce6e709a703706` | generated harness page for the bundle (build output) |
| `QA/helpers/ac304_health.cjs` | 1988 | `fbece3af8525ae474eed6ea4d51159f1453f1ca347f722f15a2868ad23295abd` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/ac304_start_app.cjs` | 1494 | `1044f1146a0d8b042fcdf3b0606901d5d79c9c8bc9b09c355f53b09fdba4cd23` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/audit_probe.py` | 2522 | `2f618f7d88178cf071a494bd804cb0efde4671cb8b4f8817a53b0f79e3c5e787` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/browser_entry.tsx` | 1773 | `8ee8aec16aa647344d698a5a9e6f0a2dffef103026743fa6e24d98a9200627cb` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/bundle_browser.cjs` | 1191 | `c3eaab29d41f46007c4ff237df145489990c1fbe08811b0ff22ec6ce51553891` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/capture_auth.cjs` | 1074 | `c40b7961418049e5cce534291d5078f07bdb4df4c86fee7d2a2eded65d8c4859` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/fixture_js_probe.cjs` | 3179 | `94065aa220e196607829efc541c73b50c765238a366b6c82d7cfd32aa2b021be` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/inventory.py` | 2600 | `bb0d77d2e8950308b2ec133829a9f2eb1059d1d6b43ebf3b3fb481866ba2a11e` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/qa_edges.test.tsx` | 2225 | `e03b724c4bd27d0ceb3ecb68f45561bef5585b6a6f5acab9644f8f123a5aea90` | QA-only test instrument; its result is retained in raw/qa_edges_jest.txt |
| `QA/helpers/race_browser.cjs` | 6138 | `c3ce58d4ef833337bb3c0b52f192b59e123de779f248f27725729c45c57d8908` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/run_auth_matrix.cjs` | 7310 | `fc000a7c7168dce9ea21a53d92b00e83b8d1abfea70ab0cc07e5bbb0fcdd6ed0` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/run_board.sh` | 2436 | `76015d5d29b623b4e0b29e0a61779c937187b9fbf1cdd014e1f1891bb67696f1` | board runner; results retained in raw/build_*.txt, tsc/eslint/jest logs; placeholder-literal coincidence recorded in raw/config_value_scan.json |
| `QA/helpers/sanitize_auth_trace.py` | 2135 | `7b7640f0f78ac4c541f308ae65d45ef1ea2bd0727804e93819f4288273a992e1` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/source_probe.py` | 2939 | `03794f9b17594596e5ebb3e4534f56c2f31d36c77d1564bb1dd25cae7f51d556` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/static_probe.py` | 6490 | `98070eec85666680274260c9a8f1063b793e723514155a7cfac2d225637334ee` | disposable QA instrument; its output is retained under raw/ |
| `QA/helpers/ts_loader.cjs` | 322 | `1629f1a2077029a03b9a0ac32da27754b2f5d07359896013d913dbd5fb7a2061` | disposable QA instrument; its output is retained under raw/ |

Removal was file by file from the resolved manifest, then `rmdir` of the two emptied directories. No recursive delete was used.

## Retained (59 files, excluding this report)

| Group | Count | Why retained |
|---|---|---|
| Certificate, execution report, AC matrix, test plan, handoff note, QA Lead journal entry, README | 7 | Seat records; cited by the certificate chain |
| `ARTIFACT_INVENTORY.json`, `SCREENSHOT_TRACE_INVENTORY.json` | 2 | Final inventories (the first rebuilt at P5) |
| `raw/` | 21 | Raw result records cited by the report and matrix |
| `screenshots/` | 21 | 16 authenticated + 5 race captures, each cited |
| `traces/` | 3 | Two sanitized auth traces + race trace |
| `GOVERNING/` | 5 | Governing snapshot + provenance (committed) |

**Byte-duplicates retained:** seven ADMIN/MEMBER screenshot pairs are byte-identical, because the main pane renders the same for both roles. Each file is cited individually by `SCREENSHOT_TRACE_INVENTORY.json` and by the certificate's 21-screenshot count, so none is an uncited duplicate.

**Temporary runtime debris:** none found in the lane. Authenticated storage states and raw traces were kept outside the repository by the QA Executor.

## Citation check

| Source | Cited paths | Unresolved |
|---|---|---|
| `QA_CERTIFICATION.md` | 1 | 0 |
| `QA_EXECUTION_REPORT.md` | 25 | 0 |
| `AC_EVIDENCE_MATRIX.md` | 16 | 0 |
| `SOL_HANDOFF_NOTE.md` | 7 | 0 |
| `SCREENSHOT_TRACE_INVENTORY.json` | 24 | 0 |
| `QA_TEST_PLAN.md` | 18 | 7 — pre-execution evidence names (`raw/*.txt`, `raw/disclosure_browser.json`, `raw/auth_browser.json`, `raw/precision.txt`) that were never produced; the plan's own Director-amendment paragraph records the actual `.json` paths. Not caused by cleanup. |

`ARTIFACT_INVENTORY.json` rebuilt: 58 entries (every retained file except the inventory itself and this report), schema unchanged (`candidate`, `head`, `note`, `artifacts[path, kind, bytes, sha256]`). The prior inventory listed 74 entries; 18 removed, 2 added (`QA_CERTIFICATION.md`, `SOL_QA_JOURNAL_ENTRY.md`).

## Security check

Retained lane scanned for JWT fragments, Supabase secret/publishable key prefixes, `service_role`, Stripe keys, bearer tokens, cookie headers, Supabase auth-token names, `supabase.co` hosts, password assignments and email addresses: **0 hits**. The three trace archives were listed and their contents scanned for tokens, cookies, authorization headers and passwords: **0 hits**. No PHI: fixtures are anonymized claims; no patient identifiers appear in raw records or screenshots of the main pane.
