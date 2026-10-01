# QAM Preflight — RRM-004-CYBER-PHARMA (v1.1)

**Version:** v1.1, 2026-09-30 · **Ratified by the QA Lead:** <date, position> · **Frozen at:** the Director's Q1 command.

Machine-checkable, read-only, no secrets printed. The QA Executor runs every row as the **first act of Q1** (before any install, build, plan drafting or browser action) and again at the **start of Q2** (gate). Results with `date -Is` go to `QAM/evidence/QAM_PREFLIGHT_Q1.txt` / `QAM_PREFLIGHT_Q2.txt`. Any FAIL is stop Q1 (rows QF-13…QF-16 are stop Q8). A gate, not a checklist. `<qa-port>` is a free port the Executor chooses and records. `<platform>` per Engineering PF-14, on the Executor's own machine. Commands are written as plain shell lines (not table cells) so pipes are literal.

## Repository

**QF-01 Branch, HEAD, tree.**
`git rev-parse --abbrev-ref HEAD && git rev-parse HEAD && git status --porcelain`
Pass: `qa/phase-3-rrm004`; HEAD recorded; porcelain empty.

**QF-02 Candidate pinned and ancestral.**
`git merge-base --is-ancestor <candidate from QAM_MANIFEST.md §1> HEAD && echo ok`
Pass: `ok`.

**QF-03 Docs-only successor.**
`git diff --stat <candidate>..HEAD -- src/ package.json package-lock.json next.config.js supabase/ scripts/`
Pass: empty.

**QF-04 Manifest complete; QAM files present.**
`ls QAM/QAM_ENTRY.md QAM/AGENTS.md QAM/QAM_PROMPTS.md QAM/QAM_RISK_REQUIREMENTS.md QAM/QAM_MANIFEST.md QAM/GOVERNING/PROVENANCE.md`
Pass: all listed; every field cell of `QAM_MANIFEST.md` is non-placeholder (no `<…>` left in §1, §3, §4, §6); `QAM_RISK_REQUIREMENTS.md` carries the QA Lead's ratification line.

## Toolchain and network

**QF-05 Node / npm.**
`node -v && npm -v`
Pass: Node ≥ 20.9.0 (both targets' `engines`); Node ≥ 20.6 is also what `--env-file` needs.

**QF-06 Registry reachable, targets resolvable.**
`npm view next@<target-next> version && npm view sharp@<target-sharp> version`
Pass: both print (targets from `../RULINGS_ADDENDUM.md` A-01 / A-02).

**QF-07 Build-time font fetch reachable.**
`curl -s -o /dev/null -w '%{http_code}\n' 'https://fonts.googleapis.com/css2?family=Saira:wght@400&display=swap'`
Pass: `200`.

**QF-08 Browser engine present.**
`npx playwright --version && node -e "const p=require('playwright').chromium.executablePath(); require('fs').accessSync(p, require('fs').constants.X_OK); console.log('chromium ok')"`
Pass: version prints; `chromium ok`. (Or the equivalent for the engine the plan names.)

**QF-09 Headless launch smoke.**
`node -e "(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.goto('about:blank');await b.close();console.log('launch ok')})()"`
Pass: `launch ok`. No display is required in v1.1 — credentials come from the env file, not from a human at a visible browser.

**QF-10 Known-instrument probe (RRM-003 QA-F02 lesson).**
`node -e "(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.setContent('<button id=b>x</button>');await p.evaluate(()=>{window.n=0;document.getElementById('b').addEventListener('click',()=>window.n++)});await p.focus('#b');await p.keyboard.press('Enter');await p.keyboard.press('Space');console.log('clicks='+await p.evaluate(()=>window.n));await b.close()})()"`
Pass: `clicks=2` — native Enter and Space both click a focused button in this engine, so any Enter finding is attributable to the app, not the driver.

## Ports, lanes, disk

**QF-11 Port free.**
`node -e "require('net').createServer().listen(<qa-port>,'127.0.0.1').on('listening',function(){this.close();console.log('free')}).on('error',()=>console.log('busy'))"`
Pass: `free`.

**QF-12 Evidence lane writable; disk.**
`touch QAM/evidence/.w && rm QAM/evidence/.w && echo ok && df -h . | tail -1`
Pass: `ok`; ≥ 4 GB free.

## Credentials (Ruling 4) — any FAIL here is stop Q8

**QF-13 QA env file present and Git-ignored.**
`test -f .env.qa.local && git check-ignore -q .env.qa.local && echo ignored && git ls-files --error-unmatch .env.qa.local 2>/dev/null; echo "tracked-exit=$?"`
Pass: `ignored` and `tracked-exit=1` (the file exists, is ignored, and has never been tracked).

**QF-14 Exactly the expected keys, values never printed.**
`grep -cE '^QA_(ADMIN|MEMBER)_(EMAIL|PASSWORD)=' .env.qa.local && grep -cE '^QA_TARGET_LABEL=' .env.qa.local && grep -cvE '^(QA_(ADMIN|MEMBER)_(EMAIL|PASSWORD)|QA_TARGET_LABEL)=|^\s*(#|$)' .env.qa.local`
Pass: `4`, `1`, `0` — four credential keys, one label, nothing else.

**QF-15 Target label matches the approved target.**
`node --env-file=.env.qa.local -e "console.log('label='+process.env.QA_TARGET_LABEL)"` and `grep -cE '^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)=' .env.local`
Pass: `label=main-dev` (the label the Director wrote for the A-07 target; the label is the only value ever printed); `2` key names in `.env.local`; the Supabase URL value is never printed. Reachability: `node -e "const u=require('fs').readFileSync('.env.local','utf8').match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/m)[1].trim();fetch(u+'/auth/v1/health').then(r=>console.log('health='+r.status)).catch(()=>console.log('health=unreachable'))"` → `health=<any HTTP status>` (not `unreachable`).

**QF-16 Both QA identities can authenticate (login-only, then logout).**
Build the candidate with the app's own `.env.local` (the approved target; `rm -rf .next && npx next build`, then the A-02 static copy, serve on `<qa-port>`). Then, with a disposable helper under `QAM/AUTOMATION/` run as `node --env-file=.env.qa.local QAM/AUTOMATION/qf16_auth_probe.cjs`: for each role, open `/auth`, fill the form from `process.env`, submit, assert the post-login route loads (`/owedbook` for MEMBER, `/admin-portal` for ADMIN) with HTTP 200 and no console error, then `POST /api/auth/logout` and assert `/owedbook` redirects to `/auth` again. No tracing, no screenshots, no `storageState`, context closed after each role.
Pass: `ADMIN auth=ok logout=ok` and `MEMBER auth=ok logout=ok`, written to `QAM/evidence/QAM_PREFLIGHT_Q1.txt` with the two role labels only. Stop the server; re-run QF-11 (`free`).

## Privacy

**QF-17 Privacy scanner runs and knows the forbidden values.**
`node --env-file=.env.qa.local QAM/AUTOMATION/privacy_scan.cjs --self-test`
Pass: exit 0, prints `0 files, 0 hits, 4 forbidden values loaded (hashed)`. The scanner takes the four credential values from `process.env` at run time, keeps only their SHA-256, scans every file under `QAM/evidence/` and the report/matrix/results files for the plaintext and for the base64 of each, and never writes a value or a hash to disk.

**QF-18 No leftover auth state from a previous phase.**
`find QAM -iname '*storage*state*' -o -iname '*.har' -o -iname 'auth*.json' | grep -v /raw/ ; echo "leftover-exit=$?"`
Pass: `leftover-exit=1` (nothing found).

The Executor's own install (`rm -rf node_modules && npm ci`) and the placeholder-env builds come **after** rows QF-01…QF-15 pass; QF-16 is the only row that builds, because authentication needs the real target. The Director is asked for nothing during the preflight.
