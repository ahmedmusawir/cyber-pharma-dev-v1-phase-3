# Frank pilot: full-history secrets scan (Gitleaks)

**Date:** 2026-10-09, 14:41 +06:00. **Authorized by:** Director instruction (secrets-scan step).
**Result:** **5 findings, all rule `generic-api-key`, in 3 files. All 5 are still present at `main` HEAD.** There were no execution errors. The findings are **flagged for review**: nothing was rotated, deleted, rewritten or suppressed.

This report contains safe metadata only. No secret values, matched lines or raw findings are reproduced here.

---

## 1. Working repo at entry (preserved)

| Item | Value |
|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3` |
| Branch | `pilot-recon-r1` |
| HEAD | `a4c82e1ae9d603a83021831d39c4c3f1ea73aaff` |

Dirty files at entry, left untouched:
```
 M agent_docs/SESSIONS/session_2026-10-09.md
?? agent_docs/RECON/FRANK_PILOT/response_2026-10-09_134222_pilot-recon-r1.md
?? agent_docs/RESPONSES/response_2026-10-09_132928_pilot-recon-r1-plan.md
?? agent_docs/RESPONSES/response_2026-10-09_142653_gitleaks-install-instruction.md
```

## 2. Scanner and target

| Item | Value |
|---|---|
| Scanner | Gitleaks **8.30.1** (`~/.local/bin/gitleaks`; Director reports the checksum verified) |
| Rules | **default built-in config.** No `-c`, no `GITLEAKS_CONFIG` or `GITLEAKS_CONFIG_TOML` env (verified unset), and no `.gitleaks.toml` in the clone or anywhere in its history. |
| Source | `https://github.com/ahmedmusawir/cyber-pharma-dev-v1-phase-3.git`, cloned `--no-local --no-recurse-submodules` (no `.gitmodules` exists) |
| Scratch | `/tmp/cyph-secrets-scan.EltKoB` (mode 700, outside the repo) |
| Scanned `main` SHA | `5234abe9ee4a076e0ddacdc69353e9f08246b4cd` (clone not shallow) |

**Commands** (help checked first with `gitleaks --help`, `git --help` and `dir --help`):
- **History:** `gitleaks git --no-banner --no-color --redact --ignore-gitleaks-allow -i <empty dir> --log-opts="--all" --report-format json --report-path <scratch>/out/history.json <clone>`
- **Checked-out `main` files:** `gitleaks dir` with the same flags (minus `--log-opts`), writing to `<scratch>/out/tree.json`.

**Suppression controls neutralised.** Nothing was excluded or suppressed:
- `--ignore-gitleaks-allow` means inline `gitleaks:allow` comments are not honoured. There are 0 such comments in the HEAD tree in any case.
- `-i <empty dir>` means no `.gitleaksignore` is applied. None exists in the clone or its history.
- No baseline (`-b`) was used.

## 3. Refs and coverage

| Item | Value |
|---|---|
| Refs scanned (`--all`) | 21: `refs/heads/main`, `origin/HEAD`, 18 `origin/*` branches (`main`, `phase-3-1`, `phase-3-2`, `phase-3-bim001…003`, `phase-3-doc-sync`, `phase-3-rrm-ffm`, `phase-3-rrm001…004`, `qa/phase-3-bim003`, `qa/phase-3-rrm001…004`), 2 tags (`archive/proto-06`, `archive/qa-bim002`) |
| Commits reachable | 73: 68 non-merge and 5 merge |
| Commits scanned (Gitleaks) | **65** |
| Gap explained | The 5 merge commits are not scanned (`git log -p` default). 3 non-merge commits add no text lines (deletions/renames only): `1eb9c04`, `5c51fff`, `638bd72`. 68 − 3 = 65. Gitleaks scans added lines, so every line ever introduced on a non-merge commit was covered. |
| Volume | history ~11.80 MB; `main` tree ~10.06 MB |

**Limitations:**
- **Merge commits:** content introduced only in a merge commit (for example, a conflict resolution) is not scanned.
- **Archives and size:** archives were not traversed (`--max-archive-depth` 0, the default), and no size cap was set.
- **`dir` and `.git/`:** whether `dir` also walked the clone's `.git/` internals was not verified. All tree findings sit in tracked paths.
- **`.gitignore`:** the repo `.gitignore` affects only what Git tracks. Gitleaks scans what is committed, so it does not reduce history coverage.
- **Not covered: local-only work outside the clone.** That includes:
  - the working clone's unpushed commit `a4c82e1` on `pilot-recon-r1`, and its dirty and untracked files
  - ignored local files such as `.env.local`
  - stashes, other local branches, and anything not on `origin`
  - other repos, including `cyph-v1-dev`

## 4. Exit codes: findings vs. execution errors

| Scan | Exit | Meaning | Execution errors |
|---|---|---|---|
| History (`git`) | **1** | leaks found (`WRN leaks found: 5`) | **none** (0 ERR/FTL lines in the log) |
| `main` tree (`dir`) | **1** | leaks found (`WRN leaks found: 5`) | **none** |

Exit 1 in both cases comes from findings, not failures. Both JSON reports were checked: every `Secret` field reads `REDACTED`.

## 5. Findings (safe metadata only)

**Count by rule:** `generic-api-key` = **5** in history, and **5** in the `main` tree (the same 5 locations).

| # | Rule ID | File | Line | Commit (introduced) | Still at `main` HEAD |
|---|---|---|---|---|---|
| 1 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs` | 103 | `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` | yes |
| 2 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs` | 123 | `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` | yes |
| 3 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs` | 222 | `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` | yes |
| 4 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs` | 254 | `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` | yes |
| 5 | generic-api-key | `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/evidence/QAM_Q1B_DOCUMENT_CHECKS.json` | 201 | `6b6cad642f69314904938e9df1ec8fdfbe08f15a` | yes |

- Both commits are ancestors of `main`: `dfc8a6a` is the BIM-002 certified SHA (2026-09-02), and `6b6cad6` is the RRM-004 Q1b commit (2026-10-01). Both are on `origin`.
- Findings 1–4 share one Gitleaks entropy score (3.64); finding 5 scores 3.84. **This suggests, but does not show, that 1–4 are the same value repeated.**
- `generic-api-key` is a heuristic rule. **Whether any of these is a live credential, a throwaway-project key, or a false positive was not assessed.** Doing so needs a reviewer to look at the values, which this step forbids.

## 6. Disposition

**Flagged for review.**
- No credential was rotated, and no file was deleted or edited. History was not rewritten, and nothing was suppressed or added to an ignore file or baseline.
- **Until reviewed, this history is not cleared for guest access.**
- Questions for the reviewer:
  - Are findings 1–5 live, throwaway, or false positives?
  - If any is live, does it need rotation?
  - Should history be rewritten, or the files removed going forward?

**Scratch retained:** the raw reports and logs (`history.json`, `tree.json`, `history.log`, `tree.log`) and the clone are in `/tmp/cyph-secrets-scan.EltKoB/` (private, mode 700) for the reviewer. The values are redacted in them as well. Deleting them is the Director's call.
