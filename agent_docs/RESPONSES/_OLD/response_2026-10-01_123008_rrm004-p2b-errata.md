# RRM-004 P2b — QAM v1.1 errata and QA Lead corrections (docs only)

**Branch:** `phase-3-rrm004` · **HEAD:** `2080c690f1fe9174df8c41520846d5a974d5d81c` · **Started:** 2026-10-01 12:21 +06:00 · **Done:** 12:30 · Nothing committed.

✅ EXECUTION COMPLETE

## What changed

**Rulings.** A-09 to A-12 are appended to the addendum word for word as P2b gave them, with the date 2026-09-30 kept as written. New row **A-13** (2026-10-01) records the QA Lead's corrections. No existing row was touched.

**Spec.** No frozen text was changed. Eight erratum rows were added: AC-605, 606, 702, 703, 705, 708, 709 and 710. Each one cites the A-row behind it.

**Director checkpoints.** DC-2 is marked satisfied with the candidate SHA. DC-4 and DC-5 now read "superseded by QAM_CHECKPOINTS.md QC-1…QC-5 (A-10)".

**Manifest (my file).** The candidate SHA and the docs HEAD are now in separate rows. The diff command uses the real SHA, and the §7 evidence paths point to `QAM/` with the right filenames. The governing documents are untouched.

**QA Lead corrections, applied to the unfrozen QAM files:**

- **Preflight order.** The preflight now runs in this order: repository → evidence folders → approved environment and credentials → tools and port → browser → privacy → login. Row IDs QF-01 to QF-18 keep their numbers, so A-09, A-10 and the erratum rows still point at the right rows; the file order is the run order. QF-12 now creates the evidence folders, because they don't exist yet and the preflight results file goes there.
- **Target.** QF-15 now has three checks:
  - the label;
  - nothing overrides `.env.local`, neither a higher-priority env file nor a shell variable;
  - a SHA-256 fingerprint of the Supabase project ID resolved from `.env.local` matches the approved one, `8ca83fc75bdf9fbc`.

  SCRATCH and replicas are banned. No value is ever printed.
- **Credentials.** QF-14 is now a small checker that prints counts only, never a key name or a value. It fails on missing, duplicate, empty, malformed or unexpected keys. I tested it on fake files. QF-13 proves the env file is ignored by Git and not tracked.
- **Login.** QF-16 runs at Q1 only, as the last row, and does its own clean install first. At Q2 it is recorded as "covered by the walk". The metrics count sign-ins per phase (Q1 and Q2 separately), and the target for Director credential entries is 0.
- **Privacy.** The scanner's self-test must catch a fake planted secret in plaintext, base64, base64url and URL-encoded form, and must read 0 on a clean control file. The value scan covers the same encodings. A key name or the word "password" in documentation is listed as a "documentation mention", not counted as a leak.
- **Cleanup.** The order is: value scan → sanitize → delete the env file → delete auth state and temporary browser profiles (including raw-artifact folders, which the old `grep -v /raw/` skipped, and OS temp paths) → verify they're gone → pattern scan. Every leak is recorded with how it was resolved.
- **Consistency.**
  - The certificate is `QAM_CERTIFICATION.md` everywhere.
  - Preflight results go to `QAM_PREFLIGHT_Q1.txt` / `QAM_PREFLIGHT_Q2.txt`.
  - The execution-report template says QF-01…QF-18 (it said QF-14).
  - QF-04 checks for unfilled `<…>` placeholders only in manifest §1/§3/§6. §4's `<…>` are command parameters, so the old rule would have failed on them.
  - AGENTS.md now says outright that the Executor cannot change a frozen AC or mark its own plan approved.
- **A bug I found and fixed: the commands ran from the wrong folder.** Some preflight commands used pack-relative paths (`ls QAM/...`), while others used repo-root paths (`git diff -- src/`, `.env.qa.local`). Run from the pack folder, QF-03's diff would always come back empty and pass by mistake. Every command now runs from the repo root, with `export QAM=agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM`.

**Runway.** In DIRECTOR_ACTIONS.md:
- the QA Lead letter now cites A-01…A-13;
- QC-1 has a new Step 0 for attesting the target;
- the QC-4 wording now says "0 leaks".

## ⚠️ Credential-safety warning (seen at 12:31)

`.env.qa.local.swp` appeared at the repo root while I was finishing. It looks like a vim swap file, so `.env.qa.local` is probably open in an editor right now. `.gitignore`'s `.env*.local` does **not** match `.swp`, so Git shows the swap file as untracked (`git check-ignore` exit 1), and it may hold the QA credentials.

- I have not opened, read or deleted it.
- My staging block names explicit paths, so it won't pick the file up.
- **Never run `git add -A` or `git add .` while it exists.**
- Close the editor so the swap file disappears before `git status --porcelain`. That check will print it otherwise.
- QC-1 (creating the env file) comes *after* DC-3 and P2b. If this is QC-1 started early, nothing is broken, but QF-18/Q5 don't look for editor swap or backup files (`*.swp`, `*~`). Consider adding a `.gitignore` rule for them (a later docs ruling, not done here).

## Open items needing a ruling

1. **Target attestation (Director, before Q1). QF-15 fails until this is done.** No file in the repo records which Supabase project is "main dev". `supabase/.temp/linked-project.json` is tracked in Git (the E-8 hygiene item) and names a *different* project from the one `.env.local` points to, so it can't be used as the reference. I read `.env.local` read-only, without printing anything, and computed the fingerprint `8ca83fc75bdf9fbc`. You need to confirm this is the main dev project. Tell me "attested" and I'll fill in the `Director attestation:` line, or the QA Lead can add it while ratifying.
2. **QA Lead should confirm the A-13 wording.** I wrote A-13 myself from the corrections you passed on; it is attributed "QA Lead / Director". Three parts are my own fixes, not the QA Lead's words:
   - QF-16 does its own `npm ci` in Q1, to keep §A-5's "never reuse the Engineer's node_modules";
   - the repo-root working directory rule;
   - clause (i): the QF numbers cited in A-03 and A-07 refer to the old v1.0 preflight, and account existence is now proven by QF-16.
3. **Commit message.** P2b's prescribed message names only A-09..A-12 and is dated 30sep. The block below uses `01oct2026` and adds A-13. Your call.
4. **For the Executor to settle in Q1 recon:** QF-16 serves a production build against the real target. How the standalone server gets that target's runtime env isn't spelled out anywhere. RRM-003's walk is the precedent.

## Candidate verification

- `git merge-base --is-ancestor 2fbc72f1f514049255f2b94054bd11cc77cbd158 HEAD` → ancestor ✅
- Candidate→HEAD diff on `src/ package.json package-lock.json next.config.js supabase/ scripts/` → **empty**. The only later commit, `2080c69`, is docs only.
- Product diff after this P2b → empty.

## Changed files (18)

| File | Change |
|---|---|
| `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md` | + A-09…A-13 |
| `…/ACCEPTANCE_SPEC.md` | + 8 erratum rows (lane only) |
| `…/DIRECTOR_CHECKPOINTS.md` | DC-2 / DC-4 / DC-5 status cells |
| `…/DIRECTOR_ACTIONS.md` | letter A-13, QC-1 Step 0, QC-4 wording |
| `…/QAM/QAM_MANIFEST.md` | candidate + docs HEAD, provenance, §3 SHA, §7 paths |
| `…/QAM/QAM_PREFLIGHT.md` | reordered; QF-04/12/13/14/15/16/17/18 corrected; `$QAM` working directory |
| `…/QAM/QAM_PROMPTS.md` | Q1, Q2, Q5 (P2b section untouched) |
| `…/QAM/AGENTS.md` | phases, Q2 order, Q8, target, working directory, never-list |
| `…/QAM/QAM_CHECKPOINTS.md` | QC-1 attestation + five unique keys, QC-4, QC-5 |
| `…/QAM/QAM_PILOT_CHARTER.md` | `QAM_CERTIFICATION.md`, per-phase sign-ins, success criteria |
| `…/QAM/QAM_PILOT_RESULTS.md` | metric rows (sign-ins by phase, credential entries, self-test, leaks) |
| `…/QAM/QAM_EXECUTION_REPORT.md` | preflight section, auth walk line |
| `…/QAM/QAM_RISK_REQUIREMENTS.md` | §B-8 |
| `…/QAM/QAM_TEST_PLAN.md` | required-sections items 1 and 6 |
| `…/QAM/README.md` | preflight row, credentials paragraph |
| `CHANGELOG.md` | P2b entry |
| `agent_docs/SESSIONS/session_2026-10-01.md` | P2b entries |
| `agent_docs/RESPONSES/response_2026-10-01_123008_rrm004-p2b-errata.md` | this report (new) |

**Not touched:** the frozen engineering text (pack `CLAUDE.md`, `RRM_BRIEF.md`, `CLAUDY_PROMPTS.md`, `QA_HANDOFF.md`, `ENVIRONMENT_PREFLIGHT.md`, `AUTHORITY_POINTER.md`, and spec text outside the erratum lane) · `QAM/GOVERNING/` · historical RRM-003 `QA/` paths · ratification lines (still `<date, position>`) · `RECOVERY.md` (protected until P5) · product, lockfile, config · `.env.local` (read only, nothing printed).

## git status --short

```
 M CHANGELOG.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/ACCEPTANCE_SPEC.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_ACTIONS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_CHECKPOINTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_MANIFEST.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_CHARTER.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_RESULTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PROMPTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/README.md
 M agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md
 M agent_docs/SESSIONS/session_2026-10-01.md
?? .env.qa.local.swp          ← not mine; see the warning above; do not stage
?? agent_docs/RESPONSES/response_2026-10-01_123008_rrm004-p2b-errata.md
```

## Staging block: run it yourself; I won't

```bash
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/ACCEPTANCE_SPEC.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/DIRECTOR_ACTIONS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_MANIFEST.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PREFLIGHT.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PROMPTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_CHECKPOINTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_CHARTER.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_PILOT_RESULTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_RISK_REQUIREMENTS.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md
git add agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/README.md
git add CHANGELOG.md
git add agent_docs/SESSIONS/session_2026-10-01.md
git add agent_docs/RESPONSES/response_2026-10-01_123008_rrm004-p2b-errata.md
git status --short
git commit -m "01oct2026 - RRM-004 P2b: QAM v1.1 errata A-09..A-13, spec lane, DC-4/5 superseded, QA Lead corrections"
git push
git status --porcelain
```

After the commit, `git status --porcelain` must print nothing once the `.swp` file is gone (close the editor first). Next: target attestation (open item 1), then DC-3. Stopping here.
