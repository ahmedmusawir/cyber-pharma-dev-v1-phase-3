# QAM Preflight — RRM-004-CYBER-PHARMA (v1.1)

**Version:** v1.1, 2026-09-30; QA Lead corrections applied at P2b 2026-10-01 (addendum A-13) · **Ratified by the QA Lead:** <date, position> · **Frozen at:** the Director's Q1 command.

Machine-checkable, read-only except the evidence lane, no secrets printed. A gate, not a checklist.

- **When it runs:** the QA Executor runs every row as the **first act of Q1**, before any plan drafting, and again at the **start of Q2**. At Q2 every row runs except QF-16, which the Q2 authenticated walk covers (A-13 d).
- **Order:** run the rows in **file order**, not numeric order. Row IDs QF-01…QF-18 are stable references (A-09, A-10). The order is: repository → evidence lane → approved environment and credentials → toolchain and port → browser → privacy → authentication. Nothing touches a browser or the target before the repository, the lane, the approved environment and the tools are proven.
- **Where results go:** `QAM/evidence/QAM_PREFLIGHT_Q1.txt` / `QAM_PREFLIGHT_Q2.txt`, with `date -Is`. QF-01…QF-04 run before the lane exists; hold their output and write it to the file as soon as QF-12 passes.
- **On failure:** any FAIL is stop Q1. A FAIL in QF-13…QF-16 is stop Q8.
- **Placeholders:** `<qa-port>` is a free port the Executor chooses and records. `<platform>` follows Engineering PF-14, on the Executor's own machine.
- **Helpers:** in Q1 the Executor may write its helpers under `QAM/AUTOMATION/` (`privacy_scan.cjs`, `qf16_auth_probe.cjs`) before the rows that call them. Writing a helper is not an install, a build or a browser action.
- **Command format:** commands are written as plain shell lines (not table cells), so pipes are literal.
- **Working directory:** every command runs from the **repository root**, where Git pathspecs and `.env*` files resolve. Run `export QAM=agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM` once. `$QAM/` in a command is the QAM folder, and `QAM/` in prose means the same folder. A QF-03 run from inside the pack would diff nonexistent paths and pass vacuously.

## 1. Repository identity

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
`ls $QAM/QAM_ENTRY.md $QAM/AGENTS.md $QAM/QAM_PROMPTS.md $QAM/QAM_PREFLIGHT.md $QAM/QAM_RISK_REQUIREMENTS.md $QAM/QAM_MANIFEST.md $QAM/GOVERNING/PROVENANCE.md`
Pass: all listed. No `<…>` field placeholder remains in `QAM_MANIFEST.md` §1, §3 or §6; §4's `<port>`, `<tmpfile>`, `<platform>` and `<any>` are command parameters, not fields. `AGENTS.md`, `QAM_PREFLIGHT.md` and `QAM_RISK_REQUIREMENTS.md` each carry the QA Lead's ratification line.

## 2. Evidence lane

**QF-12 Evidence lane created, writable; disk.**
`mkdir -p $QAM/evidence $QAM/AUTOMATION && touch $QAM/evidence/.w && rm $QAM/evidence/.w && echo ok && df -h . | tail -1`
Pass: `ok`; ≥ 4 GB free. Write the held QF-01…QF-04 output to the preflight file now.

## 3. Approved environment and credentials (Ruling 4, A-10, A-13 b–c) — any FAIL here is stop Q8

**QF-13 QA env file present, Git-ignored, untracked.**
`test -f .env.qa.local && git check-ignore -q .env.qa.local && echo ignored && git ls-files --error-unmatch .env.qa.local 2>/dev/null; echo "tracked-exit=$?"`
Pass: `ignored` and `tracked-exit=1`. Together these show the file exists, is ignored, and is not tracked.

**QF-14 Exactly five unique, nonempty keys; values never printed.**
`node -e 'const W=["QA_TARGET_LABEL","QA_ADMIN_EMAIL","QA_ADMIN_PASSWORD","QA_MEMBER_EMAIL","QA_MEMBER_PASSWORD"];const L=require("fs").readFileSync(".env.qa.local","utf8").split(/\r?\n/).filter(l=>l.trim()&&!/^\s*#/.test(l));const P=L.map(l=>{const i=l.indexOf("=");return i<1?null:[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^(["\x27])(.*)\1$/,"$2")]});const K=P.filter(Boolean).map(p=>p[0]);console.log("lines="+L.length+" malformed="+P.filter(p=>!p).length+" unique="+new Set(K).size+" dup="+K.filter((k,i)=>K.indexOf(k)!==i).length+" missing="+W.filter(w=>!K.includes(w)).length+" unexpected="+K.filter(k=>!W.includes(k)).length+" empty="+P.filter(p=>p&&!p[1]).length)'`
Pass: `lines=5 malformed=0 unique=5 dup=0 missing=0 unexpected=0 empty=0`. The command prints counts only, never a key name or a value. Any other output is stop Q8. The Director fixes the file; the Executor never opens it.

**QF-15 Resolved application target is the approved project.**
The label alone is insufficient (A-13 b). All three checks must pass:
1. `node --env-file=.env.qa.local -e "console.log('label='+process.env.QA_TARGET_LABEL)"` → `label=main-dev`. The label is the only env value ever printed.
2. Resolution: `grep -lE '^NEXT_PUBLIC_SUPABASE_URL=' .env.production.local .env.local .env.production .env 2>/dev/null; node -e "console.log('shell-override='+('NEXT_PUBLIC_SUPABASE_URL' in process.env))"` → exactly `.env.local`, then `shell-override=false`. This proves no file or shell variable with higher precedence redirects the build.
3. Identity: `node -e 'const u=require("fs").readFileSync(".env.local","utf8").match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/m)[1].trim().replace(/^(["\x27])(.*)\1$/,"$2");console.log("target-fp="+require("crypto").createHash("sha256").update(new URL(u).hostname.split(".")[0]).digest("hex").slice(0,16))'` → `target-fp=8ca83fc75bdf9fbc`. This is the first 16 hex characters of the SHA-256 of the Supabase project ref.

Also check reachability: `node -e "const u=require('fs').readFileSync('.env.local','utf8').match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/m)[1].trim();fetch(u+'/auth/v1/health').then(r=>console.log('health='+r.status)).catch(()=>console.log('health=unreachable'))"` → `health=<any HTTP status>`, not `unreachable`.

**Approved fingerprint:** `8ca83fc75bdf9fbc` · **Director attestation:** PENDING (QC-1). The Engineer computed it at P2b (2026-10-01) from the working `.env.local`. The **Director attests at QC-1** that this is the main development Supabase project (A-07): `QAM_CHECKPOINTS.md` QC-1 records the attestation, and until then QF-15 is FAIL. SCRATCH or a replica is never substituted. `supabase/.temp/linked-project.json` is not an identity source (it names a different project). No URL, ref or key value is printed.

## 4. Toolchain, network, port

**QF-05 Node / npm.**
`node -v && npm -v`
Pass: Node ≥ 20.9.0 (both targets' `engines`). That also covers `--env-file`, which needs Node ≥ 20.6.

**QF-06 Registry reachable, targets resolvable.**
`npm view next@<target-next> version && npm view sharp@<target-sharp> version`
Pass: both print (targets from `../RULINGS_ADDENDUM.md` A-01 / A-02).

**QF-07 Build-time font fetch reachable.**
`curl -s -o /dev/null -w '%{http_code}\n' 'https://fonts.googleapis.com/css2?family=Saira:wght@400&display=swap'`
Pass: `200`.

**QF-11 Port free.**
`node -e "require('net').createServer().listen(<qa-port>,'127.0.0.1').on('listening',function(){this.close();console.log('free')}).on('error',()=>console.log('busy'))"`
Pass: `free`.

## 5. Browser

**QF-08 Browser engine present.**
`npx playwright --version && node -e "const p=require('playwright').chromium.executablePath(); require('fs').accessSync(p, require('fs').constants.X_OK); console.log('chromium ok')"`
Pass: version prints; `chromium ok`. (Or the equivalent for the engine the plan names.)

**QF-09 Headless launch smoke.**
`node -e "(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.goto('about:blank');await b.close();console.log('launch ok')})()"`
Pass: `launch ok`. No display is required in v1.1, because credentials come from the env file rather than from a human at a visible browser.

**QF-10 Known-instrument probe (RRM-003 QA-F02 lesson).**
`node -e "(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.setContent('<button id=b>x</button>');await p.evaluate(()=>{window.n=0;document.getElementById('b').addEventListener('click',()=>window.n++)});await p.focus('#b');await p.keyboard.press('Enter');await p.keyboard.press('Space');console.log('clicks='+await p.evaluate(()=>window.n));await b.close()})()"`
Pass: `clicks=2`. Native Enter and Space both click a focused button in this engine, so any Enter finding is attributable to the app, not the driver.

## 6. Privacy

**QF-18 No leftover auth state from a previous phase.**
`find $QAM \( -iname '*storage*state*' -o -iname '*.har' -o -iname 'auth*.json' -o -iname '*cookies*' -o -type d \( -iname '*profile*' -o -iname '*user-data*' \) \) -print | grep . ; echo "leftover-exit=$?"`
Pass: `leftover-exit=1` (nothing found). Raw-artifact directories are included (A-13 f).

**QF-17 Privacy scanner proves it can see a leak.**
`node --env-file=.env.qa.local $QAM/AUTOMATION/privacy_scan.cjs --self-test`
Pass: exit 0 and the line `planted=detected control=clean forbidden-values=4`. The self-test runs in a throwaway temp directory, which it deletes afterwards:
- It generates a **synthetic** random secret at run time (never a real credential). It plants that secret in plaintext, base64, base64url and URL-encoded form in one file, and must detect all four.
- A clean control file must read 0 hits.
- It then loads the four credential values from `process.env` and keeps only their SHA-256 in memory. The scanner never writes a value or a hash to disk.

A scanner that misses the planted secret, or flags the control, is an untrusted instrument (stop Q5).

## 7. Authentication (Q1 only; any FAIL is stop Q8)

**QF-16 Both QA identities can log in and log out.**
Runs last, and only at Q1. At Q2, record `QF-16 covered-by-walk (A-13 d)`; the Q2 walk is the authentication evidence.
1. Install and build: `rm -rf node_modules .next && npm ci` (the Executor's own install, §A-5; record `date -Is`, `node -v`). Then build the candidate with the app's own `.env.local`, the target QF-15 approved (`npx next build`). Apply the A-02 static copy and serve on `<qa-port>`.
2. Probe: run `node --env-file=.env.qa.local $QAM/AUTOMATION/qf16_auth_probe.cjs`. For each role:
   - Open `/auth`, fill the form from `process.env`, and submit.
   - Assert the post-login route loads (`/owedbook` for MEMBER, `/admin-portal` for ADMIN) with HTTP 200 and no console error.
   - `POST /api/auth/logout`, then assert `/owedbook` redirects to `/auth` again.
   - No tracing, no screenshots, no `storageState`, no persistent profile. Close the context after each role.

Pass: `ADMIN auth=ok logout=ok` and `MEMBER auth=ok logout=ok`, with role labels only. Count it as Q1 sign-ins: ADMIN 1, MEMBER 1. Stop the server and rerun QF-11 (`free`).

The placeholder-env builds and the measured board are not preflight rows: they run in Q2 after the gate passes, from Q2's own fresh `npm ci`. The Director is asked for nothing during the preflight.
