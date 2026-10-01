# RRM-004-CYBER-PHARMA — QA Handoff (Engineer → QA Lead)

**Every line below is a claim.** The QA Executor reproduces each proof from its own install and build; the QA Lead's plan decides what to attack first. The factual half of the QAM is `QA/QAM_MANIFEST.md`; this file is the narrative handoff the previous modules used, kept for continuity.

## Identity

| Field | Value |
|---|---|
| Module | RRM-004-CYBER-PHARMA — Dependencies |
| Code baseline | `649c36d0409c0b658cff14f779a09aad0c8e92b9` (RRM-003 merge commit on `main`) |
| Candidate | the Director's single P2 commit (SHA recorded at cut) |
| Engineering branch / QA branch | `phase-3-rrm004` / `qa/phase-3-rrm004` |
| Targets (addendum A-01 / A-02) | next `16.3.7` · sharp `0.35.5` · eslint-config-next `16.3.7` |
| DD rulings | DD-1 sweep (A-05) · DD-2 remove (A-06) · DD-3 main development Supabase, login-only, existing ADMIN and MEMBER accounts (A-07) · DD-4 authorship split confirmed (A-08) |
| Provenance chain | RRM-003 merge `649c36d` → SHA-recording `a93393d` → pack `d3ea7f7` → P0 `ee4a049` (+ `1eb9c04`, same message; RESPONSES archive move) → P1b `fe74dd9` → candidate |

## Contract

`CLAUDE.md` · `RRM_BRIEF.md` · `ACCEPTANCE_SPEC.md` (frozen) · `RULINGS_ADDENDUM.md` A-01…A-08 · erratum lane rows: AC-103 (instrument path, A-03), AC-204/AC-604 (negative probe status + body, A-04) · ledger: R-009 resolution row appended; errata none new · map §9: CE-5 (DD-1 sweep supersedes §7 "not fixed here")

## Changed files (`evidence/changed_files.txt`)

| Path | Status | Reason |
|---|---|---|
| `package.json` | M | three pinned lines |
| `package-lock.json` | M | 59 entries moved (41 pin + 18 DD-1); families listed in `evidence/S1_lockfile_moves.txt` |
| `next.config.js` | M | `images` block removed per DD-2 |
| `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/**` | A/M | log, evidence, handoff, manifest, governing copy |
| ledger / protocol files | M | R-009 resolution row, session log, CHANGELOG |

Product diff for QA: `git diff 649c36d0409c0b658cff14f779a09aad0c8e92b9..<candidate> -- package.json package-lock.json next.config.js` (= `evidence/repair.diff`).

## Reproduction (facts, not instructions on what to test)

- Install: `rm -rf node_modules && npm ci` (from the committed lockfile; no network beyond the registry).
- Builds: `rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= SUPABASE_SECRET_KEY= NEXT_PUBLIC_SITE_URL= npx next build`; `rm -rf .next && env NEXT_PUBLIC_SUPABASE_URL=https://placeholder.invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-publishable SUPABASE_SECRET_KEY=placeholder-secret NEXT_PUBLIC_SITE_URL=http://127.0.0.1:36055 npx next build` (17 routes claimed).
- Serve: copy `.next/static` → `.next/standalone/.next/static` and `public/` → `.next/standalone/public` (RRM-003 A-02), then `env <same placeholders> PORT=36055 HOSTNAME=127.0.0.1 node .next/standalone/server.js`.
- Header pair, negative controls, `/_next/image` probe, negative host probe, direct image GETs: exact lines in `evidence/S3_serve_after.txt`.
- Instrument (A-03): `node -p "const v=require('@img/sharp-libvips-<platform>/versions'); v.heif+' vips='+v.vips"`; baseline value `1.23.1` (vips 8.18.3) recorded at PF-16 before install; after `1.23.5` (vips 8.18.7) on `linux-x64`.
- Board: `npx tsc --noEmit` · `npx eslint .` · `npx jest --ci` (claimed 34/164, 0 skipped; eslint 0 errors / 35 warnings).
- No live Supabase call in engineering. `.env.local` untouched.

## References

Recon R6, R3 (`agent_docs/RECON/RRM001_RECON_2026-09-18.md`) · reviews F9 (`agent_docs/FABLE_CODE_REVIEW.md`), A-003 (`agent_docs/ASTRA_CODE_REVIEW.md`) · advisories GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-rgj7-g3m4-5g8c · RRM-003 A-01, A-02 (`agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md`) · P1 plan `agent_docs/RESPONSES/response_2026-09-30_161037_rrm004-p1-plan.md` · P1b `agent_docs/RESPONSES/response_2026-09-30_161800_rrm004-p1b.md` · P2 report `agent_docs/RESPONSES/response_2026-09-30_163135_rrm004-p2-oneshot.md`

## Governing snapshot

`QA/GOVERNING/` copied from `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/GOVERNING/` with a fresh `PROVENANCE.md` (chain: RRM-001 Director copy → RRM-002 → RRM-003 → RRM-004; four bodies SHA-256 identical to the source).

## Unrun by design

Authenticated image walk (AC-605, DC-5) · QA's own install/build/serve (AC-601–604) · AVIF input · Windows host.
