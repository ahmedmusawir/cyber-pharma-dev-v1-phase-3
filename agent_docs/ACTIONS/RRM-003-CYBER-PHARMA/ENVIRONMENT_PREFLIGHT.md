# RRM-003-CYBER-PHARMA — Environment Preflight

Machine-checkable, read-only, no secrets printed. The Engineer runs every row at the start of P1 (report) and again at the start of P2 (gate). Any FAIL at P2 is stop condition 1: write the table to `evidence/PREFLIGHT_P2.txt`, report, wait. Do not begin S1 on a failed preflight.

| # | Check | Command (read-only) | Pass condition |
|---|---|---|---|
| PF-01 | Branch | `git rev-parse --abbrev-ref HEAD` | `phase-3-rrm003` |
| PF-02 | Baseline identity | `git log --oneline --merges -3 main` | the `--no-ff` merge of `qa/phase-3-rrm002` is found; its full SHA recorded as `<baseline>` |
| PF-03 | Baseline is an ancestor | `git merge-base --is-ancestor <baseline> HEAD && echo ok` | `ok` |
| PF-04 | Nothing above baseline but docs | `git diff --stat <baseline>..HEAD -- src/ supabase/ scripts/ package.json next.config.js` | empty |
| PF-05 | Clean tree | `git status --porcelain` | empty |
| PF-06 | Node / npm | `node -v && npm -v` | Node ≥ 20 |
| PF-07 | Dependencies installed | `test -d node_modules && npx next --version && npx jest --version && npx tsc --version && npx eslint --version` | all four print a version; no install performed |
| PF-08 | Env key names present (names only) | `grep -cE '^(NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\|SUPABASE_SECRET_KEY\|NEXT_PUBLIC_SITE_URL)=' .env.local` | `4` (values never read or printed) |
| PF-09 | Port free | `ss -ltn \| grep -c ':36055 '` | `0` |
| PF-10 | Evidence lane writable | `touch agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/evidence/.w && rm agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/evidence/.w && echo ok` | `ok` |
| PF-11 | Disk headroom | `df -h . \| tail -1` | ≥ 2 GB free |
| PF-12 | Baseline board is green (pipes-alive) | `rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL=https://placeholder.invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-publishable SUPABASE_SECRET_KEY=placeholder-secret NEXT_PUBLIC_SITE_URL=http://127.0.0.1:36055 npx next build` then `npx tsc --noEmit` then `npx jest --ci` | build exit 0 (record route count; expect 17) · tsc 0 · jest all pass, zero skipped (record suites/tests; expect 31/144 after RRM-002) |
| PF-13 | Standalone server boots and answers | `env <same placeholders> PORT=36055 HOSTNAME=127.0.0.1 node .next/standalone/server.js &` then `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:36055/` then stop it and confirm PF-09 again | `200`, server stopped, port free |
| PF-14 | Baseline header capture (the before) | with the server up: `curl -sI http://127.0.0.1:36055/ \| grep -i cache-control` and `curl -sI http://127.0.0.1:36055/_next/static/chunks/<any>.js \| grep -i cache-control` | both lines recorded verbatim to `evidence/S2_headers_before.txt`; expected: both contain `no-store` (that is the defect) |
| PF-15 | Governing QA snapshot source exists | `ls agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/GOVERNING/` | lists `QA_PLAYBOOK.md` and `PROVENANCE.md` |
| PF-16 | Legacy SQL files present (docs quarantine targets) | `ls docs/setup.sql supabase/setup.sql docs/migration_add_profiles.sql docs/DATABASE_SETUP.md agent_docs/DB_BASELINE.md` | all five exist |
| PF-17 | No Director checkpoint pending mid-run | read `DIRECTOR_CHECKPOINTS.md` | DC-1 satisfied (plan approved, rulings on disk); no other checkpoint falls inside P2 |

Engineering needs no browser, no real credentials and no live service. The authenticated keyboard walk is QA's; the QA Lead runs their own preflight for the test accounts on SCRATCH before the QA Executor opens a browser.
