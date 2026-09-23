# RRM-001 QA certification

Authority: SOL, QA Lead · Verdict issued 2026-09-22 · Recorded by Cody without alteration.

## Certification record

| Field | Certified disposition |
|---|---|
| Verdict | **PASS** |
| Gate | **Gate Q** |
| Tested implementation SHA | `cad164d62a623a115541c0441302de01ff74da5b` |
| Accepted documentation/evidence successor | `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4` |
| Successor scope | Documentation/evidence only; no product or configuration change |
| AC-304 | **PASS under ruling A-13** |
| AC-206 | **NOT YET — nonblocking under the frozen contract** |
| Installed signup-trigger correction | Outside this certification; remains BIM-004 CE-2/APPLY SESSION |
| Gate D | Not applicable to this removal module |
| Release-blocking findings | **None** |

This certification records SOL's verdict. Cody does not issue a different verdict or self-certify the evidence.

## Certified AC-304 result

- Existing ADMIN and MEMBER accounts logged in at `/auth` and landed on `/owedbook`.
- ADMIN reached `/admin-portal`.
- Both roles reached `/profile` and displayed the password-update form.
- Desktop and 375px, light and dark were confirmed.
- Both roles logged out to `/auth`.
- Post-logout `/owedbook` returned to `/auth`.

A-13 and the acceptance-spec erratum govern the logout result. No password, user, migration or business-data change was performed.

## Cleanup disposition

Bounded post-Gate-Q filesystem cleanup was executed under SOL's release. One-use QA scripts, superseded SCRATCH/resume attempt artifacts, stale diagnostic/handoff notes, the QA-generated TypeScript cache and both requested ZIP exports were removed. All matrix-cited accepted evidence and raw evidence required to understand or reproduce the accepted checks were retained.

The repository `.next` directory was intentionally retained because Tony's active Director-owned development server is using it. Cody did not start, stop or alter that server. `.next` is ignored generated runtime state and is not part of the selective certification commit.

Git staging, commit, push and merge remain Tony's authority. Cleanup execution is complete; clean-tree closeout remains pending Tony's selective commit.

## Retained-evidence map

| Purpose | Retained artifact |
|---|---|
| Frozen plan and intake contract | `QA_TEST_PLAN.md`; `QA_INTAKE_REPORT.md` |
| Final execution and AC mapping | `QA_EXECUTION_REPORT.md`; `AC_EVIDENCE_MATRIX.md` |
| Live-auth acceptance | `AC304_DIRECTOR_OBSERVED.md`; `AC304_WALK_RECORD.md`; `evidence/AC304_FINAL/director-observed-walk.json` |
| A-13 and frozen authority | `../RULINGS_ADDENDUM.md`; `../ACCEPTANCE_SPEC.md` |
| Archive provenance | `DIRECTOR_ARCHIVE_RULING.md`; exact mapping in `QA_EXECUTION_REPORT.md` |
| Governing doctrine and provenance | `GOVERNING/QA_PLAYBOOK.md`; `GOVERNING/WEB_FACTORY_P1_DOCTRINE_JOURNAL.md`; `GOVERNING/README.md`; `GOVERNING/SEARCH_RECORD.md` |
| Static/scope evidence | Root files under `evidence/`, including AC-301/302/303, source/consumer searches, baseline/candidate inventories and validation summary |
| Fresh-build, HTTP, actions and browser evidence | `evidence/T/`; `evidence/U/`; `evidence/blank/` |
| Regression board | `evidence/board/` |
| Follow-up attribution and integrity | `evidence/followup/`; `evidence/final-*`; `evidence/preflight-identity.txt`; `evidence/preexisting-document-relocations.json` |
| Final package inventory | `ARTIFACT_INVENTORY.json`; `QA_CLEANUP_REPORT.md`; this certification |

## Claim boundaries

1. Application entry-point removal is certified by Gate Q PASS.
2. Supabase public signup disabled remains AC-206 NOT YET and nonblocking; application signup 404 does not prove it.
3. The permanent `handle_new_user` correction is not certified here and remains assigned to BIM-004.


## QA Cleanup release

Written at closeout (P5) by the Engineer, 2026-09-23, verifying Cody's SOL-released cleanup above. Nothing above this heading was altered.

| Check | Result |
|---|---|
| Product / test / config / harness unchanged by cleanup | `git diff --stat cad164d..HEAD -- src/ supabase/ scripts/ package.json package-lock.json next.config.js` → **empty** (no output). Working tree vs HEAD on the same paths: empty. |
| Retained-set duplicate scan (md5 over every file under `QA/`) | 29 byte-identical groups. All but three are per-flag-state pairs (`evidence/T/` vs `evidence/U/`), same-body 404/405 responses across matrix rows, root vs standalone action manifests, or empty-file "pass" artifacts — each is a distinct cited observation and is retained. The three true raw-log duplicates — `evidence/final-identity.txt` = `evidence/followup/identity.txt`, `evidence/final-status.txt` = `evidence/followup/status.txt`, `evidence/final-tracked.diff` = `evidence/followup/tracked.diff` — are **retained**, because `evidence/final-*` is cited by `AC_EVIDENCE_MATRIX.md:27`, `QA_EXECUTION_REPORT.md:208` and the certificate's retained-evidence map, and both sets are listed in `ARTIFACT_INVENTORY.json`. Removing them would require rewriting QA Lead-released text. Director may rule otherwise. |
| Removals made at P5 by the Engineer | **None.** The partial/aborted runs (`evidence/SCRATCH/`, `evidence/AC304_RESUME/`), one-use helpers, stale notes and ZIP exports were already removed by Cody under SOL's release (see "Cleanup disposition" and `QA_CLEANUP_REPORT.md`); they are uncommitted deletions in the working tree, recoverable from `9ab95e5`. |
| Secrets / keys / PHI in retained evidence | Pattern scan (JWT prefix, `service_role`, `sk_live/test`, `*KEY=`, PEM header, `apikey`, Bearer, inline passwords) → only placeholder values (`placeholder-*`, `sb_*_your_*`), source comments about the service-role key, and the `.env.example` key names inside `evidence/engineering-to-candidate.diff`. Email addresses: one fictional seed-persona example and one form placeholder inside the same diff; the DA-2 probe address is a documented `.invalid` placeholder. **No secrets, keys or PHI.** |
| Governing snapshot | `GOVERNING/QA_PLAYBOOK.md` (v1.1, SHA-256 recorded) and `GOVERNING/WEB_FACTORY_P1_DOCTRINE_JOURNAL.md` (v0.3) retained with `GOVERNING/README.md` + `GOVERNING/SEARCH_RECORD.md`. **`GOVERNING/PROVENANCE.md` is not on disk**; the provenance record is `GOVERNING/README.md` (Director-supplied 2026-09-21, ledger E-11). Not created by the Engineer. |
| Reproduction helpers | The nine tracked `.cjs` helpers are deleted in the working tree by Cody's release; the Architect's P5 instruction lists "reproduction helpers" among the keep set. Not restored by the Engineer (would override a QA Lead-released action); recoverable via `git show 9ab95e5:agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/<name>.cjs`. **Director to rule** before the closeout commit. |

**Identity of record:** repo `cyber-pharma-dev-v1-phase-3` · code baseline `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9` · pack commit `88e2c33` · certified implementation `cad164d62a623a115541c0441302de01ff74da5b` · accepted evidence successor `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4` · closeout commit `2ccf4503de228e43f00ef03975606cdc05564ce3` · merge SHA `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b` (recorded 2026-09-23 from the Director's `git log` paste). Verdict: **Gate Q PASS, zero rework rounds, QA Lead 2026-09-22.** AC-206 remains **NOT YET**.
