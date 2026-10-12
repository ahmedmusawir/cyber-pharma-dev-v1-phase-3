# Frank pilot: secrets-scan follow-up review

**Date:** 2026-10-09, 15:21 +06:00. **Follows:** `response_2026-10-09_144142_pilot-secrets-scan.md`.
**Scratch used:** `/tmp/cyph-secrets-scan.EltKoB` (clone `main` @ `5234abe`, Gitleaks 8.30.1).
**Result:** **all 5 findings, and the 1 extra merge-commit finding, are confirmed non-credentials. 2 distinct values in total. No credential-like value; no Director action required for these locations.**

No values, matched lines or raw content are reproduced here.

## Method (private)

- Unredacted values were read only in memory: `gitleaks … --redact=0 --report-path -` was piped into a Python process. No unredacted report was written to disk.
- Python printed only derived facts: SHA-256 grouping labels, length, character classes, the key label beside each value, other files holding the same value (paths only), and boolean checks.
- No credential was tested against any service.

**Disclosure.** One context check printed two source lines (`phase3-one-walk-session.mjs:103` and `:123`) to the agent's tool output with the quoted strings masked. The flagged value was masked; the line's code template was visible. That output exists only in the session transcript, not in any repo file.

## Distinct values

The 5 locations hold **2 distinct values**:
- **V1** appears 4 times.
- **V2** appears once. The merge rescan below also hits V2 in merge commit `a474a19`.

## Per-finding classification

| # | Rule | File | Line | Commit | Value | Classification |
|---|---|---|---|---|---|---|
| 1 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs` | 103 | `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` | V1 | **confirmed placeholder/test literal** |
| 2 | generic-api-key | same file | 123 | `dfc8a6a4…` | V1 | **confirmed placeholder/test literal** |
| 3 | generic-api-key | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs` | 222 | `dfc8a6a4…` | V1 | **confirmed placeholder/test literal** |
| 4 | generic-api-key | same file | 254 | `dfc8a6a4…` | V1 | **confirmed placeholder/test literal** |
| 5 | generic-api-key | `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/evidence/QAM_Q1B_DOCUMENT_CHECKS.json` | 201 | `6b6cad642f69314904938e9df1ec8fdfbe08f15a` | V2 | **confirmed non-credential literal (file digest)** |

**V1 basis.**
- It is a 19-character value containing only lowercase letters and symbols, with no digits or uppercase. Its shape is `word-word=word`.
- I verified privately that it is the fixed status string `byte-identical=<boolean word>`. It is the expected-result argument of a probe `check()` whose labels are `POST-TOKEN-CONTINUITY` and `RESTORE-TOKEN-CONTINUITY`. Those are the BIM-002 One-Walk checks that compare a session token against itself.
- The token is compared at runtime and never embedded. The probe records a computed fingerprint, not the token.
- The same string recurs in the BIM-002 QA evidence logs and response record (5 HEAD files, paths only), which is consistent with an expected-result label.
- Gitleaks flagged it because a key-like label sits next to a quoted string.

**V2 basis.**
- It is 64 lowercase hex characters, and its key is a filename (`qf16_auth_probe.cjs`).
- **It equals the SHA-256 of `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AUTOMATION/qf16_auth_probe.cjs` at HEAD**, which I verified by hashing the file.
- The same digest appears in 3 other RRM-004 hash inventories (`ARTIFACT_INVENTORY.json`, `Q2_preserved/ARTIFACT_INVENTORY.json`, `Q5/prevalue_source_hashes.json`). These are integrity records, not secrets.

**Unresolved:** none.

## Merge-commit coverage gap: closed

- **Command:** `gitleaks git --no-banner --no-color --redact --ignore-gitleaks-allow -i <empty dir> --log-opts="--all -m" --report-format json --report-path <scratch>/out/history_m.json <clone>`.
  - Git's `-m` makes `git log -p` emit merge diffs against each parent. Redaction is full, and there are no exclusions or suppressions.
- **Coverage:** **70 commits scanned**, up from 65. That is the 65 already scanned plus all 5 merges (`a474a19`, `649c36d`, `3d2e655`, `1cd6e46`, `f7a1d4c`). About 19.25 MB was scanned, across all 21 refs.
  - The 3 commits that add no text lines (`1eb9c04`, `5c51fff`, `638bd72`) remain unscanned by design; nothing in them was added.
  - `git show --cc` on each merge prints 0 lines, so **no merge introduced its own content** (no conflict resolutions).
- **Exit 1** (findings). **0 ERR/FTL lines.** Every `Secret` field is `REDACTED`.
- **Findings:** 6. These are the 5 originals, none missing, plus **1 additional**: `generic-api-key` at `QAM_Q1B_DOCUMENT_CHECKS.json:201` in merge `a474a195e4388b6d999669041a206aed4339e9b1`. That is the merge's diff against its first parent bringing in the same file. **It is the same value as V2 (privately verified) and gets the same classification.**
- The raw redacted report and log are at `<scratch>/out/history_m.json` and `history_m.log`.

## Recommendation

- **These six hits do not block guest access to history.** All are confirmed non-credentials; none needs rotation, deletion or history rewriting.
- **Clearance remains bounded by the original scan's limits.**
  - Gitleaks default rules only.
  - No archive traversal.
  - Local-only work is not covered: unpushed `a4c82e1`, `.env.local`, stashes and `cyph-v1-dev`.
  - Any commit pushed after `5234abe` needs a rescan before sharing.
- **Optional, Director/Architect call:** record V1 and V2 in a reviewed Gitleaks baseline (`-b`), so future scans report only new findings. That would be a suppression, so it was not done here.
- **Scratch:** `/tmp/cyph-secrets-scan.EltKoB` is no longer needed for these findings. Deleting it is the Director's call.
