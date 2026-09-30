# RRM-003-CYBER-PHARMA — P1b rulings applied

**ENGINEER** · 2026-09-28 · branch `phase-3-rrm003` @ `a59f069` · documentation only. No product change, no build, no test, no git mutation.

## Modified files

| File | Change |
|---|---|
| `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md` | A-01…A-12 appended, continuous table, no blank lines |
| `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/ACCEPTANCE_SPEC.md` | erratum lane: AC-102, AC-202, AC-304 |
| `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md` | DC-1 → `satisfied 2026-09-28` |
| `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` | **E-16** inserted directly after E-15 (`:48`). E-16 was free on disk: 0 hits before the edit. |
| `CHANGELOG.md` | one `[CC]` entry |
| `agent_docs/SESSIONS/session_2026-09-28.md` | APPROVED → IN PROGRESS and COMPLETE entries |

Also for this commit (from P1): `evidence/PREFLIGHT_P1.txt`, `evidence/S2_headers_before.txt`, the P1 plan, the 20:50 session-ack response, and this report.

## Verification

- Addendum: 12 rows, 6 columns each, IDs A-01…A-12 each exactly once.
- Spec erratum lane: 3 rows, 6 columns.
- Ledger errata: E-01…E-16 in sequence, 7 columns each, E-16 exactly once.
- `git diff --stat -- src supabase next.config.js package.json scripts` → empty.

## For P2: one design change from the plan

Ruling A-06 replaces plan §a's nested-Escape mechanism:
- MultiSelect's Escape uses `preventDefault` + `stopPropagation`.
- AuthedShell gets `if (e.defaultPrevented) return;` at `:49`.
- The nested test asserts behavior only.

P2 will follow the ruling, not the plan text.

## Your changes in the tree (not mine, not in my block)

- Nine RRM-002 response files are moved to `agent_docs/RESPONSES/_OLD/`. Git shows them as ` D` plus `??`.
- `agent_docs/PHASE_2.1/`, `agent_docs/PHASE_2.2/` are restored and **already staged** (`A`). They will ride along in any commit you make now.
- A-03 says "absent at HEAD". That becomes historical once the restore is committed. The citation in A-03 still resolves either way.

`RECOVERY.md` is not touched: the pack protects it until P5.

## Staging block: P1 + P1b (mine)

```bash
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/ACCEPTANCE_SPEC.md
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/evidence/PREFLIGHT_P1.txt
git add agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/evidence/S2_headers_before.txt
git add agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md
git add CHANGELOG.md
git add agent_docs/SESSIONS/session_2026-09-28.md
git add agent_docs/RESPONSES/response_2026-09-28_205049_session-start-protocol-ack.md
git add agent_docs/RESPONSES/response_2026-09-28_210200_rrm003-p1-plan.md
git add agent_docs/RESPONSES/response_2026-09-28_212503_rrm003-p1b-rulings.md
```

Optional, your cleanup (the `_OLD` move), if you want it in the same commit:

```bash
git add -A agent_docs/RESPONSES/_OLD
git add -u agent_docs/RESPONSES
```

Then:

```bash
git commit -m "28sep2026 - RRM-003 P1b: rulings A-01..A-12, spec errata, E-16, DC-1 satisfied"
git push
git status --porcelain
```

`git status --porcelain` must be empty before P2 (A-01). Your call. I will not run any of it.

→ Waiting for P2.
