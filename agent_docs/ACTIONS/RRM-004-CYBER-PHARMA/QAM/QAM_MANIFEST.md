# QAM Manifest — RRM-004-CYBER-PHARMA

**Author:** Engineer, at handoff (end of P2) · **Date:** 2026-09-30T16:31:11+08:00 · **Nature:** facts and labeled claims. **This file contains no test plan, no risk ranking, no attack order and no expected value other than the Engineer's own measurements, each marked CLAIM.** `QAM_TEST_PLAN.md` decides what is attacked, in what order, and what "correct" means; it is drafted by the QA Executor in Q1 and approved by the QA Lead (A-11). **P2b update 2026-10-01:** candidate and documentation HEAD recorded in §1; §7 paths moved to `QAM/` (A-09).

## 1. Identity

| Field | Value |
|---|---|
| Module | RRM-004-CYBER-PHARMA — Dependencies |
| Repo | `cyber-pharma-dev-v1-phase-3` |
| Code baseline | `649c36d0409c0b658cff14f779a09aad0c8e92b9` (RRM-003 `--no-ff` merge on `main`) |
| Candidate | `2fbc72f1f514049255f2b94054bd11cc77cbd158` — the Director's single P2 commit (DC-2, 2026-10-01). Verified at P2b: ancestor of HEAD; candidate→HEAD diff touches only `agent_docs/**` |
| Documentation HEAD at P2b | `2080c690f1fe9174df8c41520846d5a974d5d81c` (QAM v1.1 overlay, docs only). The P2b errata commit follows it (docs only); the QA branch is cut from that. The Executor pins its own QA HEAD at QF-01 |
| Engineering branch / QA branch | `phase-3-rrm004` / `qa/phase-3-rrm004` |
| Provenance chain | RRM-003 merge `649c36d` → SHA-recording `a93393d` → pack commit `d3ea7f7` → P0 `ee4a049` (+ `1eb9c04`, same message; RESPONSES archive move) → P1b `fe74dd9` → candidate `2fbc72f` → QAM v1.1 overlay `2080c69` (docs) → P2b errata (docs) |
| Targets (addendum A-01/A-02) | next `16.3.7` · eslint-config-next `16.3.7` · sharp override `0.35.5` |
| Director rulings applied | DD-1 `sweep` (A-05) · DD-2 `remove` (A-06) · DD-3 `main development Supabase, login-only, existing ADMIN and MEMBER accounts` (A-07) · DD-4 `confirmed` (A-08) |
| Engineer platform (PF-14) | `linux-x64` (glibc 2.39); Node `v22.14.0`; npm `10.9.2` |

## 2. Contract pointers

`../ACCEPTANCE_SPEC.md` (frozen) · `../RULINGS_ADDENDUM.md` rows A-01…A-08 · erratum lane rows: AC-103 (A-03), AC-204/AC-604 (A-04) · ledger row R-009 (resolution appended) · errata: map §9 CE-5 (A-05); no new ledger E-row

## 3. Product diff (facts)

| Path | Status | What changed |
|---|---|---|
| `package.json` | M | 3 lines: `next`, `eslint-config-next`, `overrides.sharp` |
| `package-lock.json` | M | 59 entries moved; families: `next`, `@next/env`, `@next/eslint-plugin-next`, `@next/swc-*`, `eslint-config-next`, `sharp`, `@img/*`, `@emnapi/runtime`, `@swc/helpers` (41) · DD-1: `brace-expansion`, `js-yaml`, `baseline-browser-mapping`, `browserslist`, `caniuse-lite`, `electron-to-chromium`, `node-releases`, `update-browserslist-db`, `postcss-selector-parser` (18); outside-family: none (`../evidence/S1_lockfile_moves.txt`) |
| `next.config.js` | M | `images` block removed per DD-2 = remove; `headers()` untouched |

Diff command: `git diff 649c36d0409c0b658cff14f779a09aad0c8e92b9..2fbc72f1f514049255f2b94054bd11cc77cbd158 -- package.json package-lock.json next.config.js` (= `../evidence/repair.diff`). Everything else: `git diff --name-only 649c36d0409c0b658cff14f779a09aad0c8e92b9..2fbc72f1f514049255f2b94054bd11cc77cbd158` lists only the above plus `agent_docs/**` and root-protocol files (`CHANGELOG.md`).

## 4. Reproduction (facts — exact commands, no interpretation)

| Step | Command |
|---|---|
| Clean install from lockfile | `rm -rf node_modules && npm ci` |
| Blank-env build | `rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= SUPABASE_SECRET_KEY= NEXT_PUBLIC_SITE_URL= npx next build` |
| Placeholder-env build | `rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL=https://placeholder.invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-publishable SUPABASE_SECRET_KEY=placeholder-secret NEXT_PUBLIC_SITE_URL=http://127.0.0.1:<port> npx next build` (Engineer used port 36055) |
| Standalone serve (RRM-003 A-02) | `cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public` then `env <same placeholders> PORT=<port> HOSTNAME=127.0.0.1 node .next/standalone/server.js` |
| Header pair + negative controls | `curl -sI http://127.0.0.1:36055/ \| grep -iE '^HTTP\|cache-control'` · `curl -sI http://127.0.0.1:36055/_next/static/chunks/<any>.js \| grep -iE '^HTTP\|cache-control'` · `curl -sI http://127.0.0.1:36055/auth \| grep -iE '^HTTP\|cache-control'` · `curl -sI http://127.0.0.1:36055/owedbook \| grep -iE '^HTTP\|cache-control\|location'` · `curl -s -o /dev/null -D - -X POST http://127.0.0.1:36055/api/auth/login \| grep -iE '^HTTP\|cache-control'` |
| Image optimizer probe | `curl -s -o <tmpfile> -D - -H 'Accept: image/webp' 'http://127.0.0.1:36055/_next/image?url=%2Flanding%2Fowedbook-mockup.png&w=1080&q=75' \| grep -iE '^HTTP\|content-type\|cache-control'` then `xxd -l 16 <tmpfile>` |
| Negative host probe | `curl -s -o <tmpfile> -w '%{http_code}\n' 'http://127.0.0.1:36055/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdyb0qa58h%2Fimage%2Fupload%2Fx.png&w=64&q=75'` then `cat <tmpfile>` (status and body, A-04) |
| Direct image GETs | `curl -s -o /dev/null -D - http://127.0.0.1:36055/brand/logo-color.svg \| grep -iE '^HTTP\|content-type'` · same for `/brand/logo-lockup.svg` · same for `/landing/owedbook-mockup.png` |
| Instrument read | `node -p "const v=require('@img/sharp-libvips-<platform>/versions'); v.heif+' vips='+v.vips"` (A-03: the package `exports` map exposes `./versions`, not `./versions.json`) |
| Board | `npx tsc --noEmit` · `npx eslint .` · `npx jest --ci` |
| Audit | `npm audit --json` |
| Version listing | `npm ls next sharp eslint-config-next` · `ls node_modules/@img/` |

Placeholder env only; no live Supabase call in any of the above. `.env.local` is not needed for engineering reproduction; it is needed only for the QA authenticated walk (target per DD-3).

## 5. Environment the QA body needs (facts)

| Item | Value |
|---|---|
| Services | npm registry (install, `npm view`, `npm audit`); `fonts.googleapis.com` at build time (`next/font/google` in `src/app/layout.tsx`); the DD-3 Supabase target for the authenticated walk only |
| Ports | one free local port for the served build (Engineer used 36055) |
| Identities and roles required | one ADMIN, one MEMBER on the DD-3 target — **verified to exist by:** Director, 2026-09-29 — A-07 verbatim: "Accounts verified to exist by Director sign-in on 2026-09-29 during the RRM-003 AC-107 walk (satisfies QF-11's 7-day window)."; named by role only here |
| Browser | any Chromium-class engine the QA Lead's plan names; RRM-003 used Playwright 1.59.1 Chromium via a QA-only driver |
| Tools | Node ≥ 20.9.0, npm, curl, Playwright (already a devDependency: `@playwright/test`) |
| Routes with images (from source, for the Executor to re-derive) | `/` (`HomePageContent.tsx`: `/landing/owedbook-mockup.png`; `NavbarHome.tsx`: `/brand/logo-lockup.svg`) · `/auth` (`NavbarLoginReg.tsx`: `/brand/logo-lockup.svg`) · authenticated routes (`Navbar.tsx`: `/brand/logo-color.svg`) — **the Executor derives this list itself; this row is a claim** |

## 6. Engineer measurements (CLAIMS — the Executor derives its own)

| Measurement | CLAIM | Engineer evidence |
|---|---|---|
| `npm ls` | CLAIM: `eslint-config-next@16.3.7` · `next@16.3.7` → `sharp@0.35.5 overridden` (exit 0) | `../evidence/S1_versions.txt` |
| heif BASELINE / AFTER | CLAIM: `1.23.1` (vips 8.18.3) / `1.23.5` (vips 8.18.7), platform `linux-x64` | `../evidence/S1_versions.txt` |
| audit totals before / after | CLAIM: 1 critical · 4 high · 1 moderate · 1 low (7) / 0 (`found 0 vulnerabilities`) | `../evidence/S1_audit_*.json` |
| lockfile moves | CLAIM: 59 (41 pin families + 18 DD-1 families), 0 outside | `../evidence/S1_lockfile_moves.txt` |
| builds (routes) · tsc · eslint · jest | CLAIM: 0/0 (17) · 0 · 0 errors / 35 warnings · 34/164/0 skipped | `../evidence/S3_board.txt` |
| header pair + negative controls | CLAIM: `/` 200 no-store · chunk 200 `public, max-age=31536000, immutable` · `/auth` 200 no-store · `/owedbook` 307 → `/auth` no-store · `POST /api/auth/login` (empty body) 500 no-store (same status in RRM-003's captures) | `../evidence/S3_serve_after.txt` |
| image probe | CLAIM: 200 · `image/webp` · first 16 bytes `5249 4646 2e6c 0000 5745 4250 5650 3820` · Cache-Control `public, max-age=14400, must-revalidate` | `../evidence/S3_serve_after.txt` |
| negative host probe | CLAIM: 400, body `"url" parameter is not allowed` | `../evidence/S3_serve_after.txt` |
| direct GETs | CLAIM: 200 `image/svg+xml` ×2 · 200 `image/png` | `../evidence/S3_serve_after.txt` |
| P2 metrics | CLAIM: see §Metrics — install 2m37s + audit fix 1m15s · checks 80 · self-repairs 0 · Director touches 0 · stops 0 | `../EXECUTION_LOG.md` §Metrics |

## 7. Evidence schema the Executor fills

`QAM/evidence/QAM_PREFLIGHT_Q1.txt` · `QAM/evidence/QAM_PREFLIGHT_Q2.txt` · `QAM/evidence/entry_gate.json` · `QAM/evidence/deps/` (npm ls, audit json, versions read per A-03, platform) · `QAM/evidence/board/` (both builds, tsc, eslint, jest json + totals, versions) · `QAM/evidence/headers/` · `QAM/evidence/images/` (probe headers, hex dump, negative host with body per A-04, direct GETs) · `QAM/evidence/browser/` (readiness, per-role matrices, cropped screenshots, sanitized traces, server shutdown) · `QAM/evidence/static/` (diffs vs baseline, changed paths) · `QAM/evidence/privacy_audit.json` · helpers in `QAM/AUTOMATION/`. File names per `QAM/QAM_PROMPTS.md` Q1/Q2/Q5 and A-13 (g).

## 8. Governing snapshot

`GOVERNING/` copied from `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/GOVERNING/`; chain in `GOVERNING/PROVENANCE.md`.

## 9. Not done by engineering (facts)

Authenticated image walk · any install/build/serve on a machine other than the Engineer's · AVIF input · Windows host · deployment.
