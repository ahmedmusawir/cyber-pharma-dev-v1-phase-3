# RRM-002-CYBER-PHARMA — AC evidence matrix

QA Executor record for SOL adjudication, 2026-09-28. “Collected” means independent evidence exists, not a QA verdict. Paths are relative to this `QA/` directory.

| AC | Independent evidence | Observation / limit | Evidence state |
|---|---|---|---|
| AC-101 | Literal-fixture JS and decimal probes; candidate Jest; Chrome component harness | One Summary note and exact frozen copy; derived unfiltered `$20.27`, isolated date `$12.94` | Collected: `raw/fixture_js_calculation.json`, `raw/fixture_calculation.json`, `raw/jest.json`, `raw/race_browser.json`, screenshots |
| AC-102 | Candidate boundary tests; named-PBM candidate test; source inspection | 0, +0.004, S>K by 0.004, and −5.00 hide note; named PBM hides note | Collected: `raw/jest.json`, `raw/source_inspection.json` |
| AC-103 | Candidate deferred tests; QA rejected-Summary/double-clear tests; actual Chrome slow-Summary race | Pending/rejected/mixed/stale pairs hidden; old note removed on filter change; late result did not revive it; Clear twice safe | Collected: `raw/jest.json`, `raw/qa_edges_jest.txt`, `raw/race_browser.json`, `traces/race_browser.zip` |
| AC-104 | Candidate tab tests and source guard | Note restricted to Summary; return re-requests per A-03 | Collected: `raw/jest.json`, `raw/source_inspection.json` |
| AC-105 | Independent literal precision scan over 150 rows | No money literal beyond 2 dp; rate precision excluded | Collected: `raw/fixture_calculation.json` |
| AC-106 | Baseline service/types diff; expression comparison | Preserved diff empty; exact `+n.toFixed(2)` expression per A-01 | Collected: `raw/scope.json`, `raw/source_inspection.json` |
| AC-201 | Independent audit counts and search; audit-row/ledger inspection | Required rows present; 1/149 rule-3, 28 negative owed, method/federal counts match recorded flags | Collected: `raw/audit_review.json`, `raw/fixture_js_calculation.json` |
| AC-202 | Literal source/docs/README search | `11.85` zero; `10.64` only E-12 comment | Collected: `raw/audit_review.json` |
| AC-203 | Baseline mock hunk and all-row/money comparison | One E-12 comment hunk; all 150 rows byte-identical, zero money changes | Collected: `raw/scope.json`, `raw/fixture_calculation.json` |
| AC-204 | Audit flags vs campaign map §10 and E-13/E-14 | Flag-only owner/gate retained; no corresponding product edit | Collected: `raw/audit_review.json`, `raw/scope.json` |
| AC-301 | Full changed-path and preserved-path diff | Six intended `src/` paths; preserved diff empty | Collected: `raw/scope.json`, `raw/identity.json` |
| AC-302 | Git blob comparison and full Jest JSON | Service test blob identical; seven-PBM/equality pins intact; suite green | Collected: `raw/scope.json`, `raw/jest.json` |
| AC-303 | Full screen diff and effect/sort inspection; browser race | Only permitted additions/callback rewrites; sort untouched; cancellation guards; stale result suppressed | Collected: `raw/scope.json`, `raw/source_inspection.json`, `raw/race_browser.json` |
| AC-304 | Director-entered ADMIN/MEMBER browser sessions; automated Playwright 2 roles × 2 viewports × 2 themes × default/named-PBM states; DOM transition probe; double Clear and tab checks | Both roles reached `/owedbook`; 16 Summary states observed; exact `$20.27` default copy, zero named-PBM notes, zero stale notes after applied filter change, no 375px horizontal overflow; prior auth delay classified Environment / Setup Issue | Collected: `raw/ac304_environment.json`, `raw/auth_admin_matrix.json`, `raw/auth_member_matrix.json`, 16 authenticated screenshots, two sanitized traces |
| AC-401 | Fresh blank/placeholder builds, tsc, eslint, full Jest | Exit 0 each; 17 routes each; 0 TS errors; 0 ESLint errors/35 warnings; 31 suites/144 tests, zero pending/todo | Collected: `raw/board_summary.json`, `raw/versions.txt`, raw command logs |
| AC-402 | Read-only commit ancestry, successor diff, tracked status | Candidate exact parent of HEAD; successor docs-only; current tracked tree clean before QA writes. Historical stage-commit porcelain is an Engineering claim. | Partial independent record: `raw/identity.json`, `raw/scope.json`, `EXECUTION_LOG.md` outside QA |

SOL handoff: adjudicate the completed AC-304 evidence and QA-F01's resolved environment/setup classification alongside the frozen board. No Gate Q recommendation or certification is made here. Cleanup waits for SOL's Gate Q and the Architect's bounded closeout release.
