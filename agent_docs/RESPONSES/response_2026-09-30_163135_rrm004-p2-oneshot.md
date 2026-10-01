# RRM-004 P2 — one-shot build and handoff: COMPLETE (engineering claim, not certified)

**P2 start** `2026-09-30T16:20:41+08:00` · **P2 end** `2026-09-30T16:31:56+08:00` · **wall-clock 11m15s** · started at P1b `fe74dd9` · baseline `649c36d0409c0b658cff14f779a09aad0c8e92b9`
**Stops hit: 0 · self-repairs: 0 · Director touches: 0 · checks: 80**

## Results by stage

| Stage | Duration | Result |
|---|---|---|
| Preflight (gate) | 1m06s | **21/21 PASS**. PF-05 was literally empty; PF-16 (A-03) read `1.23.1 vips=8.18.3`; PF-19 was re-captured into `evidence/S3_serve_before.txt` |
| S1 pin + install + proof | 4m37s | See below |
| S2 config | 0m01s | See below |
| S3 board + served proofs | 1m56s | See below |
| Handoff | 2m54s | See below |

**S1 pin + install + proof** (`npm install` 2m37s, `npm audit fix` 1m15s):
- `package.json` changed on exactly 3 lines, and `cmp` showed it byte-identical across the audit fix.
- `npm ls`: `next@16.3.7`, `eslint-config-next@16.3.7`, `sharp@0.35.5 overridden`.
- **heif went from 1.23.1 to 1.23.5** (`sharp.versions` agrees).
- **Audit went from 7 to 0.** All three target GHSA IDs were present before and are absent after.
- **59 lockfile moves** (41 pin + 18 DD-1), **0 outside** the families. This is identical to the P1 dry run.

**S2 config:**
- The `images` block was removed (A-06).
- `headers()`, `output` and `reactStrictMode` are byte-identical.
- The AC-203 grep returns 0, and there are 0 `res.cloudinary.com` hits in `src`, `public`, `src/mocks` and `docs`.

**S3 board + served proofs:**
- Blank and placeholder builds both exit 0 with **17 routes**. tsc 0 · eslint **0 errors / 35 warnings** · jest **34/164, 0 skipped**. The `src`, tests, README and TESTING diffs are empty.
- `/` 200 no-store · chunk 200 `immutable` · `/auth` 200 no-store · `/owedbook` 307 → `/auth` no-store · POST login 500 no-store. The 500 is pre-existing, with the same status in RRM-003's engineering and QA captures.
- `/_next/image` returns 200 `image/webp`, `RIFF…WEBP`, and decodes as 1080×626.
- **The Cloudinary host probe returns 400 with the body `"url" parameter is not allowed`.**
- The SVG ×2 and PNG direct GETs return 200.
- The port is free afterwards.

**Handoff:**
- `QA_HANDOFF.md` and `QA/QAM_MANIFEST.md` are filled: every field, facts and CLAIMs only, with no plan, attack order or expectations.
- `QA/GOVERNING/` is copied with `PROVENANCE.md` (4 SHA-256 matches).
- The ledger has an R-009 resolution row, awaiting Gate Q.
- `changed_files.txt` and `repair.diff` are written.
- The secrets scan found 0.

## Things you should know

- **Candidate SHA:** it doesn't exist until you commit. The manifest, handoff and ledger say "Director's P2 commit, SHA recorded at cut".
- **`RECOVERY.md` shows as M in `evidence/changed_files.txt`** against the baseline. That comes from your `a93393d` SHA-recording commit on `main` before the branch cut; P2 didn't touch it. It's in the root-protocol class that AC-403 allows, and QA may ask about it.
- **`npm install` printed `npm warn ERESOLVE overriding peer dependency`** (`react-remove-scroll@2.5.7` and `@types/react`). It's a warning only: exit 0, and outside the pinned families.
- **Manifest §5** quotes A-07's attestation verbatim: Director sign-in on 2026-09-29.
- **Not run, by design:** the authenticated image walk (QA, AC-605), QA's own install/build/serve (AC-601–604), AVIF input, and a Windows host.
- **Not done:** no commit and no self-certification. `.env.local` was not edited; PF-08 read its key names only. No server is left running. `node_modules/` and `.next/` don't appear in `git status`.

## Changed-file inventory (working tree vs `fe74dd9`)

**Modified (11):**
- `package.json`
- `package-lock.json`
- `next.config.js`
- `CHANGELOG.md`
- `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md`
- `agent_docs/SESSIONS/session_2026-09-30.md`
- `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/EXECUTION_LOG.md`
- `…/QA_HANDOFF.md`
- `…/QA/QAM_MANIFEST.md`
- `…/evidence/S1_versions.txt`
- `…/evidence/S3_serve_before.txt`

**Added (14):**
- `…/QA/GOVERNING/{PROVENANCE.md, QA_PLAYBOOK.md, README.md, SEARCH_RECORD.md, WEB_FACTORY_P1_DOCTRINE_JOURNAL.md}`
- `…/evidence/{PREFLIGHT_P2.txt, S1_audit_after.json, S1_lockfile_moves.txt, S2_config_diff.txt, S3_board.txt, S3_serve_after.txt, changed_files.txt, repair.diff}`
- `agent_docs/RESPONSES/response_2026-09-30_163135_rrm004-p2-oneshot.md`

**Deleted:** none.

## `git status --short`

```
 M CHANGELOG.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/EXECUTION_LOG.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/QAM_MANIFEST.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA_HANDOFF.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_versions.txt
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_serve_before.txt
 M agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md
 M agent_docs/SESSIONS/session_2026-09-30.md
 M next.config.js
 M package-lock.json
 M package.json
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/PREFLIGHT_P2.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_audit_after.json
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_lockfile_moves.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S2_config_diff.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_board.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_serve_after.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/changed_files.txt
?? agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/repair.diff
?? agent_docs/RESPONSES/response_2026-09-30_163135_rrm004-p2-oneshot.md
```

## Staging block (DC-2): run as-is. I will not run it.

```bash
git add package.json package-lock.json next.config.js
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/EXECUTION_LOG.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA_HANDOFF.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/QAM_MANIFEST.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/PROVENANCE.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/QA_PLAYBOOK.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/README.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/SEARCH_RECORD.md agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/WEB_FACTORY_P1_DOCTRINE_JOURNAL.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/PREFLIGHT_P2.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_versions.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_audit_after.json agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S1_lockfile_moves.txt
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S2_config_diff.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_board.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_serve_before.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/S3_serve_after.txt
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/changed_files.txt agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/evidence/repair.diff
git add agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md
git add CHANGELOG.md agent_docs/SESSIONS/session_2026-09-30.md agent_docs/RESPONSES/response_2026-09-30_163135_rrm004-p2-oneshot.md
git status --short
git commit -m "30sep2026 - RRM-004 one-shot: next 16.3.7 / sharp 0.35.5 (R-009), images per DD-2, board + served proofs, QA handoff + QAM manifest"
git push
```

After the commit, `git status --short` must be empty (AC-503). Then DC-3: cut `qa/phase-3-rrm004` from that commit. Stopping here.
