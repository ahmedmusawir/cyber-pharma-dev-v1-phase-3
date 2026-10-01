# Changelog

> Documentation/playbook change log per CLAUDE.md Changelog Protocol.
> `[CC]` = Claude Code · `[TS]` = Tony Stark manual edits.

## 2026-10-01 06:29 UTC — [CC] Claude Code

- **RRM-004-CYBER-PHARMA — P2b** (docs only): QAM v1.1 errata A-09…A-12 as prescribed, plus A-13 (QA Lead corrections). Erratum rows added for AC-605/606/702/703/705/708/709/710. DC-2 satisfied (candidate `2fbc72f`); DC-4/DC-5 superseded by QC-1…QC-5. Manifest records the candidate and the docs HEAD separately, with §7 paths moved to `QAM/`.
- **Updated:** `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/` `RULINGS_ADDENDUM.md`, `ACCEPTANCE_SPEC.md` (erratum lane only), `DIRECTOR_CHECKPOINTS.md` (status cells), `DIRECTOR_ACTIONS.md` (A-13 in the letter, QC-1 Step 0 attestation, QC-4 leak wording) · `QAM/QAM_PREFLIGHT.md`:
  - reordered: repository → lane → environment → tools → browser → privacy → auth;
  - repo-root working directory, with `$QAM` for the pack path;
  - five-key validator;
  - target fingerprint check;
  - planted-secret self-test;
  - QF-16 is Q1-only and runs its own `npm ci`.
- **Updated (QAM):** `QAM_PROMPTS.md` Q1/Q2/Q5, `AGENTS.md`, `QAM_CHECKPOINTS.md`, `QAM_PILOT_CHARTER.md`, `QAM_PILOT_RESULTS.md`, `QAM_EXECUTION_REPORT.md`, `QAM_RISK_REQUIREMENTS.md` §B-8, `QAM_TEST_PLAN.md` (required-sections list), `README.md`, `QAM_MANIFEST.md`.
- **Reason:** Director's P2b instruction with the QA Lead's corrections, before DC-3.

## 2026-09-30 08:31 UTC — [CC] Claude Code

- **RRM-004-CYBER-PHARMA — P2 one-shot** (Dependencies; R-009): `next` / `eslint-config-next` pinned `16.3.7`, `sharp` override `0.35.5` (A-01/A-02); DD-1 sweep → `npm audit` 0 (A-05); Cloudinary `images.remotePatterns` removed (A-06); board + served proofs green; QA handoff + QAM manifest.
- **Updated:** `package.json`, `package-lock.json`, `next.config.js` · `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/EXECUTION_LOG.md`, `QA_HANDOFF.md`, `QA/QAM_MANIFEST.md` · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (R-009 resolution row, awaiting Gate Q).
- **Added:** `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA/GOVERNING/` (copy of RRM-003's + `PROVENANCE.md`) · `evidence/PREFLIGHT_P2.txt`, `S1_audit_after.json`, `S1_lockfile_moves.txt`, `S2_config_diff.txt`, `S3_board.txt`, `S3_serve_after.txt`, `changed_files.txt`, `repair.diff` (`S1_versions.txt` AFTER block, `S3_serve_before.txt` re-captured).
- **Reason:** Director-approved P1 plan and rulings A-01…A-08; P2 prompt.

## 2026-09-30 08:18 UTC — [CC] Claude Code

- **RRM-004 P1b** (docs only; plan approved in full).
- **Updated:** `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md` (A-01 next/eslint-config-next 16.3.7 · A-02 sharp 0.35.5 · A-03 instrument subpath · A-04 negative-probe body · A-05 DD-1 sweep · A-06 DD-2 remove · A-07 DD-3 main dev login-only · A-08 DD-4 confirmed) · `ACCEPTANCE_SPEC.md` erratum lane (AC-103; AC-204/AC-604) · `DIRECTOR_CHECKPOINTS.md` (DC-1 satisfied) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §9 (CE-5: DD-1 sweep supersedes §7 "not fixed here").
- **Added (P1 evidence):** `evidence/PREFLIGHT_P1.txt`, `evidence/S1_versions.txt` (BASELINE), `evidence/S1_audit_before.json`, `evidence/S3_serve_before.txt`.
- **Reason:** Director approval of the P1 plan and rulings DD-1…DD-4.

## 2026-09-30 07:18 UTC — [CC] Claude Code

- **RRM-004 P0 — RRM-003 bookkeeping** (docs only, on `phase-3-rrm004`).
- **Updated:** `agent_docs/RRM_CAMPAIGN_JOURNAL.md` (RRM-003 Architect entry + friction log, verbatim from P0; QA Lead placeholder untouched) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` (§0 v1.0.4 status paragraph) · `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/README.md` (merged to main 649c36d). Scoreboard, ledger R-rows and RRM-003 EXECUTION_LOG SHAs already present since `a93393d` — no change.
- **Reason:** Director-instructed P0 (`agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/CLAUDY_PROMPTS.md`).

## 2026-09-30 04:47 UTC — [CC] Claude Code

- **RRM-003 / RRM-002 — SHA recording** (docs only, on `main` @ `649c36d`).
- **Updated:** `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` (§0 v1.0.3 + scoreboard: RRM-003 closeout `7309a2f`, merge `649c36d`) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (R-006/010/013/014/017/018) · RRM-003 `EXECUTION_LOG.md` Closeout · RRM-002 `EXECUTION_LOG.md` Closeout + `README.md` (closeout `9cb56e9`, merge `3d2e655`) · `RECOVERY.md` · session log.
- **Reason:** Director merged `qa/phase-3-rrm003` (2026-09-29) and pasted the merge line.

## 2026-09-29 14:35 UTC — [CC] Claude Code

- **RRM-003-CYBER-PHARMA — P5 closeout** (docs and evidence only; Director-approved plan, Architect unavailable; certified candidate `21ea108bb27b965ddc5edae29dc3b1d6971ae576`, QA HEAD `1a94277`).
- **Added:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/QA_CERTIFICATION.md` (SOL Gate Q PASS, verbatim) · `QA/QA_CLEANUP_REPORT.md` (nothing removed; helpers retained per D2; inventory 76/76; secrets 0).
- **Updated:** `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (R-006/010/013/014/017/018 certified + final dispositions; E-17 QA-F01; E-18 QA-F02) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` (§0 v1.0.3; scoreboard RRM-003; RRM-002 merge `3d2e655`) · `agent_docs/RRM_CAMPAIGN_JOURNAL.md` (RRM-003 seat placeholders only) · RRM-003 `EXECUTION_LOG.md` (§ Closeout), `README.md` (status), `DIRECTOR_CHECKPOINTS.md` (DC-4 satisfied) · `RECOVERY.md` · session log.
- **Reason:** QA Lead Gate Q PASS 2026-09-29; Director rulings D1–D3.

## 2026-09-29 06:43 UTC — [CC] Claude Code

- **RRM-003-CYBER-PHARMA — QA-entry sync** (docs only; candidate `21ea108bb27b965ddc5edae29dc3b1d6971ae576` preserved).
- **Updated:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md` (DC-2 satisfied 2026-09-28, DC-3 satisfied 2026-09-29) · `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA_HANDOFF.md` (A-01…A-14; erratum list + AC-401; QA branch confirmed 2026-09-29) · `agent_docs/SESSIONS/session_2026-09-29.md`.
- **Reason:** Director confirmation of DC-2 and DC-3, 2026-09-29.

## 2026-09-29 06:11 UTC — [CC] Claude Code

- **RRM-003-CYBER-PHARMA — QA-branch docs step** (`qa/phase-3-rrm003`; no product change, build or git mutation).
- **Updated:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md` (A-13 AC-401 path list, A-14 P2 flags 2–3) · `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/ACCEPTANCE_SPEC.md` (erratum AC-401) · candidate SHA `21ea108bb27b965ddc5edae29dc3b1d6971ae576` filled in `QA_HANDOFF.md`, `EXECUTION_LOG.md` and ledger resolution rows R-006/R-010/R-013/R-014/R-017/R-018 · `agent_docs/SESSIONS/session_2026-09-29.md` (new).
- **Reason:** Architect/Director instruction, 2026-09-29.

## 2026-09-28 13:41 UTC — [CC] Claude Code

- **RRM-003-CYBER-PHARMA P2 (one-shot build + QA handoff).** Candidate = Director's P2 commit. Preflight 17/17; S1 keyboard/focus (R-010), S2 cache header (R-006), S3 hygiene + docs quarantine (R-013, R-014/R-017 docs, R-018 README, OBS-2). Board: 17 routes · tsc 0 · eslint 0/35 · jest 34/164/0.
- **Updated (docs):** `docs/DATABASE_SETUP.md` (pointers to `supabase/migrations/`; Step-4 labelled historical) · `docs/setup.sql`, `supabase/setup.sql`, `docs/migration_add_profiles.sql` (SUPERSEDED banner, line 1) · `docs/ARCHITECTURE.md`, `docs/AUTHORIZATION.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHENTICATION.md` (signup prose; A-08/A-09) · `agent_docs/DB_BASELINE.md` (§ Installed `handle_new_user`, DA-2 NOT YET) · `README.md`, `docs/TESTING.md` (34 suites / 164 tests) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (resolution rows R-006, R-010, R-013, R-014, R-017, R-018 — awaiting Gate Q).
- **Pack:** `EXECUTION_LOG.md`, `QA_HANDOFF.md`, `evidence/**`, `QA/GOVERNING/` (copied from RRM-002 + `PROVENANCE.md`).
- **Reason:** Director P2 instruction, 2026-09-28.

## 2026-09-28 13:24 UTC — [CC] Claude Code

- **RRM-003-CYBER-PHARMA P1 + P1b.** P1 plan approved in full by the Director; P1b rulings applied (documentation only; no product change, build, test or git mutation).
- **Updated:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md` (A-01…A-12) · `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/ACCEPTANCE_SPEC.md` (erratum lane: AC-102, AC-202, AC-304) · `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/DIRECTOR_CHECKPOINTS.md` (DC-1 satisfied 2026-09-28) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (E-16, OBS-1 flag-only → Phase 8) · `agent_docs/SESSIONS/session_2026-09-28.md`.
- **Created:** `agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/evidence/PREFLIGHT_P1.txt` · `evidence/S2_headers_before.txt` · `agent_docs/RESPONSES/response_2026-09-28_210200_rrm003-p1-plan.md` · `agent_docs/RESPONSES/response_2026-09-28_205049_session-start-protocol-ack.md`.
- **Reason:** Director P1 / P1b instructions, 2026-09-28.

## 2026-09-28 12:01 UTC — [CC] Claude Code

- **RRM-002-CYBER-PHARMA closeout (P5).** Gate Q PASS @ `34e6fb6` (QA Lead 2026-09-28, zero defects, zero repair rounds); evidence HEAD `cb9f7b7`. Docs, evidence and bounded QA cleanup only; no product change, build, test or git mutation.
- **Updated:** `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (R-015/R-020 independent check + RESOLVED; E-15) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` (§0 status/scoreboard; version 1.0.2) · `agent_docs/RRM_CAMPAIGN_JOURNAL.md` (Architect entry, QA Lead entry verbatim, friction log) · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` (Closeout) · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/ARTIFACT_INVENTORY.json` (rebuilt) · `RECOVERY.md`
- **Created:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/README.md` (pack carried none) · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/QA_CLEANUP_REPORT.md` · `agent_docs/SESSIONS/session_2026-09-28.md` · closeout report in `agent_docs/RESPONSES/`
- **Removed (QA lane, J-19):** `QA/helpers/` (16) and `QA/browser_harness/` (2) — never committed; archived outside the repo before removal.
- **Reason:** Architect P5 closeout instruction, Director-relayed, 2026-09-28.

## 2026-09-23 11:32 UTC — [CC] Claude Code

- **RRM-002 P3 — engineering completion handoff.** Candidate `34e6fb6fd8c4e5c6610f4b0f49177abcb6cc0731`; baseline `1cd6e46`. Docs/evidence only; no product change, build or git mutation.
- **Updated:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA_HANDOFF.md` (every field filled) · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` (Completion claim; S1/S2 checkpoint SHAs) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` (resolution rows R-015, R-020; R-003/R-008 rationale annotated, dispositions unchanged)
- **Created:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/evidence/changed_files.txt` · `evidence/repair.diff` · `QA/GOVERNING/{QA_PLAYBOOK.md, WEB_FACTORY_P1_DOCTRINE_JOURNAL.md, SEARCH_RECORD.md}` + `README.md` replaced (copied from RRM-001) · `QA/GOVERNING/PROVENANCE.md`
- **Reason:** Architect P3 instruction, Director-relayed, 2026-09-23.

## 2026-09-23 10:09 UTC — [CC] Claude Code

- **RRM-002 Stage S2 — audit corrections.** Single ruled hunk E-12: one comment line at `src/mocks/owedbook.ts:8` (no money value changed). Board: tsc 0 · eslint 0/35 · jest 31/144/0 · AC-202 0 hits · AC-301/302 diffs empty.
- **Updated:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` — Stage S2 · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/evidence/FIXTURE_AUDIT.md` — FINAL, rulings/owner-gate per AC-204 · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/evidence/S2_fixture_hunks.txt` (new)
- **Reason:** Architect P2-S2 instruction, Director-relayed, 2026-09-23.

## 2026-09-23 08:41 UTC — [CC] Claude Code

- **RRM-002 Stage S1 — Summary-tab missing-PBM disclosure (R-015, D3).** Product: `src/components/owedbook/format.ts` (+`round2`, A-01) · new `src/components/owedbook/SummaryUnattributedNote.tsx` · `src/components/owedbook/OwedBookScreen.tsx` (two filters tags + one render block). Tests: new `src/__tests__/owedbook/SummaryUnattributedNote.test.tsx`, `OwedBookScreen.disclosure.test.tsx`. Board: builds 17 routes ×2 · tsc 0 · eslint 0/35 · jest 31/144/0.
- **Updated:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` — Stage S1 · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/evidence/S1_diffs.txt` (new)
- **Reason:** Architect P2-S1 instruction, Director-relayed, 2026-09-23.

## 2026-09-23 08:03 UTC — [CC] Claude Code

- **RRM-002 P1b — Director rulings applied (documentation-only).** S0 plan approved. No product change, build, test or git mutation.
- **Updated:** `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/RULINGS_ADDENDUM.md` — rows A-01…A-05 · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — erratum lane AC-106, AC-104 (frozen text untouched) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` — placeholder `E-10…` removed; E-12/E-13/E-14 appended · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/evidence/FIXTURE_AUDIT.md` — ruling column filled (owner/gate per AC-204) · `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md` — Stage S0 line
- **Reason:** Architect P1b instruction, Director-relayed, 2026-09-23.

## 2026-09-23 02:33 UTC — [CC] Claude Code

- **RRM-001 merge SHA recorded** — Director merged `qa/phase-3-rrm001` → `main` at `1cd6e46` (`--no-ff`); closeout commit `2ccf450`. Docs only.
- **Updated:** `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` §0 scoreboard/status · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` resolution rows R-001/R-002/R-011/R-012 · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` Closeout table · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/README.md` · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/QA_CERTIFICATION.md` (Engineer's identity line only) · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/CLOSEOUT_CHECKLIST.md` · `RECOVERY.md`
- **Reason:** Director's `git log --oneline -1` paste, 2026-09-23; P5 instruction "record the merge SHA in the map and ledger on the RRM-002 opening commit".

## 2026-09-23 01:05 UTC — [CC] Claude Code

- **RRM-001-CYBER-PHARMA closeout (P5).** Gate Q PASS @ `cad164d` (QA Lead 2026-09-22, zero rework); evidence successor `9ab95e5`. Docs and evidence only; no product change, build, test or git mutation.
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/QA_CERTIFICATION.md` — "QA Cleanup release" section (Engineer verification; QA Lead text untouched) · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` — R-001/R-002/R-011/R-012 resolution columns, R-014 closeout note, errata E-10 (A-13) + E-11 (governing bodies) · `agent_docs/RRM_CAMPAIGN_MAP_v1_0.md` — §0 scoreboard/status, version 1.0.1 · `agent_docs/AUTHORITY/PHASE_3_BIM_CAMPAIGN_MAP.md` — appended "Errata — RRM campaign" (CE-1…CE-4 + RRM-001 close line) · `agent_docs/RRM_CAMPAIGN_JOURNAL.md` — Architect entry, QA-logged placeholder heading, friction log · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` — Closeout section · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/README.md` — status CLOSED · `RECOVERY.md` — current state (A-10 lifted at P5)
- **Created:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/CLOSEOUT_CHECKLIST.md` (pack carried none) · `agent_docs/SESSIONS/session_2026-09-23.md` · closeout report in `agent_docs/RESPONSES/`
- **Reason:** Architect P5 closeout instruction, Director-relayed, 2026-09-23.

## 2026-09-22 07:58 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` — appended ruling A-13 (AC-304: logout lands on `/auth`, not `/`; Architect drafting error; no product change)
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — erratum lane row for AC-304 citing A-13; frozen AC-304 text untouched
- **Reason:** Director-approved documentation correction relayed via CLAUDY, 2026-09-22. Docs only; no product change, build, test, or git mutation.

## 2026-09-20 10:34 UTC — [CC] Claude Code

- **RRM-001 P3 — engineering completion handoff.** Candidate `4965c0c`. Docs and evidence only.
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA_HANDOFF.md` — every field filled · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` — completion claim + AC→evidence map · `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` — OBS-2 appended · `agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md` — resolution-evidence rows R-001, R-002, R-011, R-012
- **Created:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/changed_files.txt`, `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/evidence/repair.diff`, `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA/GOVERNING/README.md` (QA playbook snapshot NOT YET — file not on disk)
- **Reason:** Director P3 instruction, 2026-09-20.

## 2026-09-20 10:25 UTC — [CC] Claude Code

- **RRM-001 S2 — public self-registration removed** (D1, R-011 by removal) and the login `GET` probe removed (R-002): `src/app/api/auth/signup/`, `RegisterForm.tsx`, `AuthTabs.tsx` deleted; `/auth` is login-only; three "Start free trial" hrefs now point at `/auth` (ruling A-03); new `src/__tests__/auth/AuthPage.test.tsx` (AC-202).
- **Updated:** `docs/AUTHENTICATION.md`, `docs/ROUTES_AND_SURFACES.md`, `README.md` — "removed in RRM-001 (2026-09-20)" notes (ruling A-06)
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` — Stage S2 section; evidence `S2_404_matrix.txt`, `S2_greps.txt`
- **Reason:** Director P2-S2 instruction, 2026-09-20. Board: tsc 0 · eslint 0 errors · jest 29/130/0 · build 17 routes.

## 2026-09-20 10:19 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` — appended ruling A-12 (O-1: AC-103 `.next/server` pass test) and OBS-1 (`protectPage` registered as a Server Action → RRM-003)
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` — S1: AC-103 marked GREEN citing A-12; Director checkpoint SHA `9d5fe22` recorded
- **Reason:** Director documentation instruction after RRM-001 S1 (2026-09-20). Docs only; no product change.

## 2026-09-20 10:01 UTC — [CC] Claude Code

- **RRM-001 S1 — operator user-management portal removed** (R-001, R-012): 14 files under `src/app/moose-portal/` deleted; navbar flag wiring and `.env.example` key removed; `src/utils/supabase/admin.ts` header now cites ledger E-04.
- **Updated:** `README.md`, `docs/ROUTES_AND_SURFACES.md`, `docs/PROJECT_OVERVIEW.md`, `docs/AUTHORIZATION.md`, `docs/DATABASE_SETUP.md`, `agent_docs/KIP_REGISTRY.md` — "removed in RRM-001 (2026-09-20)" notes (ruling A-06)
- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/EXECUTION_LOG.md` — Stage S1 section; evidence `S1_404_matrix.txt`, `S1_action_ids.txt`, `S1_greps.txt`
- **Reason:** Director P2-S1 instruction, 2026-09-20. Board: tsc 0 · eslint 0 errors · jest 28/128/0 · build 18 routes.

## 2026-09-20 09:52 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/RULINGS_ADDENDUM.md` — appended Architect rulings A-02…A-11 (Director-approved, verbatim); removed the empty placeholder row and the blank line that split the table; A-01 byte-identical
- **Reason:** Director documentation-prep instruction before RRM-001 S1 (2026-09-20). Docs only; no product change.

## 2026-09-16 04:20 UTC — [CC] Claude Code

- **BIM-003-CYBER-PHARMA CLOSED** — Sol Gate Q PASS 2026-09-15, QA Cleanup PASS, MERGE-READY, certified `c45949e`, zero implementation defects. Delivered: `audit_logs` reshape (0028: Brief §3 shape, immutability guard incl. R-6a TRUNCATE, FORCE RLS, RF-3 revokes) · one admin SELECT policy (0029) · `audit_write()` (0030) · 13 write stamps (0031–0043) · 4 `owedbook_*` read wrappers (0044–0047) · `npm run audit:prove` with symbolic golden · migrations 0028–0047 · regenerated types · README/RUN_NOTES · retrospective.
- **Updated:** `RECOVERY.md` — BIM-003 status CLOSED, certified `c45949e`, Gate Q 2026-09-15; next module BIM-004; LIVE APPLY still deferred to the named APPLY SESSION
- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md` — CF-10 ratified text of record (Sol D-1, Architect) appended; E-8 note (`supabase/.temp/cli-latest`, generator artifact)
- **Created:** `agent_docs/SESSIONS/session_2026-09-16.md` — closeout entry
- **Created:** `agent_docs/RESPONSES/response_2026-09-16_*_bim003-closeout.md` — closeout report incl. the proposed map v1.1 status-line text and the Director's merge sequence
- **Reason:** Director closeout instruction 2026-09-16 (J-19: `qa/phase-3-bim003` merges to `main`). Docs only; implementation diff vs `c45949e` EMPTY.

## 2026-09-15 09:32 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RULINGS_ADDENDUM.md` — CF-10 (QA D-1 contract/threat-model gap, routed) + CF-8 QA corroboration (audit-prove evidence path)
- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md` — Deferred Ledger row for D-1 / CF-10
- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md` — Erratum Lane E-8 (D-3, `supabase/.temp/cli-latest` vs AC-901); AC text untouched
- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/` — QA Cleanup (J-19): 22 disposable files removed (20 duplicate Stage-B runner sets + 2 ABORTED partials); durable package = README + recon + journal + helpers ×3 + evidence ×26 + rls-prove ×14; `QA_WORK_JOURNAL.md` row 15
- **Restored:** `scripts/rls-harness/seed-map.json`, `audit-seed-map.json` — to certified `c45949e` bytes (QA runtime regen, not candidate changes)
- **Reason:** SOL Gate Q PASS for BIM-003 (certified `c45949e`, zero implementation defects) → QA Cleanup per SOL + Director release 2026-09-15. RECOVERY.md / SESSIONS untouched (Director-protected).

## 2026-09-14 07:42 UTC — [CC] Claude Code

- **Created:** `RUN_NOTES.md` (root) — the two proof commands, env re-pointing, reading a result, stage-by-stage (AC-308)
- **Updated:** `README.md` — script table gains `npm run rls:prove` and `npm run audit:prove` (AC-308)
- **Created:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md` — Keep / Change / Drop + Deferred Ledger (AC-309)
- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md` — remaining evidence cells filled (every AC now points at evidence; AC-307 marked PENDING Director paste); AC wording untouched
- **Created:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_*` (+ `rls-prove/S3_*`) — audit:prove logs, failure path, triad, types-regen instructions, AC-301…906 evidence
- **Created:** `agent_docs/RESPONSES/BIM003_S3_2026-09-14.md` (+ `response_` copy) — Stage 3 report
- **Updated:** `RECOVERY.md` — BIM-003 ENGINEERING COMPLETE, AC-307 verified (E-7), ready for QA
- **Reason:** BIM-003 Stage 3 executed (Director prompt of 2026-09-14, RULINGS_ADDENDUM R-6a/R-8a/R-10)

## 2026-09-14 06:54 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md` — Stage 2 evidence cells filled (AC-201…210); AC wording untouched
- **Created:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/WRAPPER_CONTRACT.md` (AC-209), `S2_catalog.md`, `S2_wrappers.md`, `S2_files.md`, `S2_apply_*.log` — Stage 2 evidence
- **Created:** `agent_docs/RESPONSES/BIM003_S2_2026-09-14.md` (+ `response_` copy) — Stage 2 report
- **Updated:** `RECOVERY.md` — BIM-003 S2 state, pending S3
- **Reason:** BIM-003 Stage 2 executed and closed (four owedbook_* wrappers, Director prompt of 2026-09-14)

## 2026-09-14 05:54 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md` — Stage 1 evidence cells filled (AC-101…105, 107, 108, 113, 114, 115, 120, 121, 305, 905); AC wording untouched
- **Created:** `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S1_catalog.md`, `S1_files.md`, `S1_apply_*.log`, `S1_db-verify.log`, `rls-prove/*` — Stage 1 evidence
- **Created:** `agent_docs/RESPONSES/BIM003_S1_2026-09-14.md` (+ `response_` copy) — Stage 1 report; `response_2026-09-14_125225_bim003-plan.md` — approved plan; two earlier session-open / block records
- **Updated:** `RECOVERY.md` — BIM-003 S1 state, pending S2, open flags
- **Reason:** BIM-003 Stage 1 executed and closed (Director-approved plan, errata E-0…E-5)

## 2026-09-02 18:00 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ERRATUM.md` — D-1: E-2 heading → RATIFIED/APPLIED, superseded by E-4; D-2: E-4 status records its 2026-09-01 ratification (both revokes). Status lines only, no wording changes
- **Updated:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — lifecycle → **QA-VERIFIED** (Sol, Gate Q PASS); certified SHA `dfc8a6a` pinned; PRE-Q specimen `53f1ac0` recorded with its empty protected-path diff
- **Updated:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/CLAUDE.md` — Status → **CLOSED** with Gate Q PASS line, certified SHA, deliverables map, post-close Director duties
- **Updated:** `RECOVERY.md` — final state: `main` @ `dfc8a6a`, Gate Q PASS, module CLOSED, branch-recovery incident RESOLVED, `qa/bim002` unmerged and slated for deletion
- **Created:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/GATE_Q_REPORT_BIM-002-CYBER-PHARMA_PASS.md` — Sol's Gate Q report, filed verbatim
- **Updated:** `agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md` — appended verbatim, append-only, two-seat rule observed: Architect's BIM-002 module-close entry · Sol's QA-logged entries for BIM-001 and BIM-002 · the 2026-09-02 branch-recovery friction entry with its new Factory doctrine
- **Reason:** BIM-002-CYBER-PHARMA documentation-close on **Gate Q PASS** (Sol, 2026-09-02) — zero implementation defects, zero engineering rework. Docs only; no implementation, migration, harness or `src/` file touched.

## 2026-09-01 16:15 UTC — [CC] Claude Code

- **Created:** `agent_docs/AUTHORITY/RLS_TEMPLATES.md` — blessed policy templates: four helpers (E-4 grant form), T-1 (formulation C), T-2, T-3, T-4, T-5, R-A, deny-all section, formulation B as documented anti-pattern, six structural laws
- **Created:** `agent_docs/ACTIONS/PROTO06/TRANSFERS_ADDENDUM_BIM-002.md` — findings **F-10…F-13** (TRANSFERS.md and FINDINGS.md deliberately untouched)
- **Created:** `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/{ERRATUM,RETROSPECTIVE}.md` + `evidence/` (60+ gate logs); **Updated:** `ACCEPTANCE_SPEC.md` → ENGINEER EVIDENCE-FILLED (AC1–AC20), manager §10a carried flags CF-1…CF-7
- **Reason:** BIM-002 engineering execution — all gates X0–X7 green. Code-side deliverables in the same module (listed for completeness): `supabase/migrations/0016–0027` (4 helpers + 15 policies), `scripts/rls-harness/` + `npm run rls:prove`. *(Entry backfilled at module close — it was missed on the day.)*

## 2026-08-31 11:15 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — AC3/AC12 wording patched per ratified ERRATUM-Q1/Q2 (wording-only); lifecycle → **QA-VERIFIED**; certified SHA `9f8c80d` pinned
- **Updated:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/CLAUDE.md` — manager flipped to CLOSED with deliverables map + Sol's verdict
- **Updated:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/RETROSPECTIVE.md` — FLAG-C completeness note + Gate Q outcome addendum (incl. spec-wording-vs-erratum process lesson)
- **Reason:** BIM-001 close-out on Gate Q PASS (Sol, 2026-08-31, zero rework). QA package verified in module QA/ (Sol's report + Cody's full battery). Zero product/schema changes per Gate Q handoff §6.

## 2026-08-28 17:05 UTC — [CC] Claude Code

- **Created:** `supabase/migrations/0001–0015` — BIM-001 sixteen-table target schema chain (deny-by-default at birth, assert-then-create baseline acknowledgment)
- **Created:** `scripts/db-bootstrap-baseline.sql` + `db-reset.mjs` + `db-verify.mjs` — one-command reset + gate-verify runners; npm `db:*` tasks
- **Updated:** `src/types/supabase.ts` — regenerated from post-chain schema (X6, Director-as-hands)
- **Updated:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — ENGINEER EVIDENCE-FILLED, AC1–AC15
- **Created:** BIM-001 `ERRATUM.md` (update_updated_at never deployed; DATA_CONTRACT §3 amendment queued), `RETROSPECTIVE.md`, `X0_CATALOG.sql`, `X0_EVIDENCE.md`, `evidence/` (11 gate logs)
- **Reason:** BIM-001 engineering execution — all gates X0–X7 green on scratch + replica throwaway projects; live DB untouched (Director applies post-Gate-Q).

## 2026-08-27 14:10 UTC — [CC] Claude Code

- **Created:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/QA/GATE_Q_REPORT_FIX-001-CYBER-PHARMA.md` — Sol's Gate Q report filed verbatim (PASS, zero rework; QA-FINDING-001 noted, routed by Architect)
- **Updated:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — status → QA-VERIFIED; AC2/AC4 evidence → Gate Q live attack; verdict stamped "GATE Q: PASS — MOVE FORWARD."; SHA process note (Gate Q ran on working tree; close-out commit = certified SHA)
- **Updated:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/CLAUDE.md` — manager flipped FINAL → CLOSED with deliverables map
- **Reason:** FIX-001 close-out on Gate Q PASS (Sol, 2026-08-27). KIP-2 is cured and closed on the record.

## 2026-08-27 13:00 UTC — [CC] Claude Code

- **Updated:** `agent_docs/KIP_REGISTRY.md` — KIP-2 moved to Closed (resolution: FIX-001 server-resolved identity props; evidence pointers to spec + new test suites); KIP-1 untouched
- **Updated:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — Engineer evidence-filled (AC1/AC3/AC5/AC6/AC7; AC2/AC4 pending Coordinator walk)
- **Created:** `agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/RETROSPECTIVE.md` — engineering close (jsdom/Radix lesson, G1-wording doctrine note)
- **Reason:** FIX-001-CYBER-PHARMA engineering execution — KIP-2 kill via server-resolved identity on the public nav (+F02 comment fix). Code changes (same module): `(public)/layout.tsx`, NavbarHome/MobileNav/UserMenu props conversion, new NavAuthRefresh, 2 new test suites; board 26/120 → 28/128.

## 2026-08-14 13:50 UTC — [CC] Claude Code

- **Updated:** `agent_docs/ACTIONS/BIM-000-CYBER-PHARMA/CLAUDE.md` — manager flipped FINAL → CLOSED with deliverables map, per its own close mechanic
- **Reason:** Gate Q PASS (`agent_docs/QA/GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`, Sol, 2026-08-14) — BIM-000 independently verified, no rework, approved to advance. Coordinator closeout commit `432cf5a`.

## 2026-08-13 16:30 UTC — [CC] Claude Code

- **Updated:** `README.md` — test badge + command table: 118/25 → 120/26 (live Jest baseline)
- **Updated:** `docs/TESTING.md` — inventory line + command comment: 117/25 → 120/26
- **Created:** `agent_docs/DB_BASELINE.md` — Phase-3 migration-chain starting truth (live tables, three policy names byte-faithful, setup.sql+migration interpretation, catalog date 2026-08-11; R3 sibling note pending)
- **Updated:** `agent_docs/ACTIONS/BIM-000-CYBER-PHARMA/ACCEPTANCE_SPEC.md` — finalized with evidence per AC1–AC9
- **Created:** `agent_docs/ACTIONS/BIM-000-CYBER-PHARMA/RETROSPECTIVE.md` — module close
- **Reason:** BIM-000-CYBER-PHARMA (Stage Prep & Hygiene) execution — plan approved 16:14. Code-side changes in same module (not docs, listed for completeness): sass+stripe removed, temp/ghl-example.json deleted, .env.example parity, tsconfig `_SKILLS/**` exclude.

## 2026-08-11 19:36 UTC — [CC] Claude Code

- **Deleted:** `WINDSURF.md` — Windsurf/Cascade config (v2.0, March 2026), a stale twin of CLAUDE.md v3.1; removed the doc-drift risk of two competing protocol files. Recoverable from git history if ever needed.
- **Updated:** `CLAUDE.md` — added "🔴 GIT IS OPERATOR-ONLY" section: mutating git commands forbidden outright, read-only inspection allowed, reminder duty defined with a copy-paste format; added failure modes #21 (git) and #22 (session log location)
- **Reason:** Operator directive — "delete windsurf file and never touch git ... only i touch git ... you can remind me of git that's all"

## 2026-08-11 19:30 UTC — [CC] Claude Code

- **Created:** `RECOVERY.md` — 3-second recovery doc at project root; seeded with current branch/HEAD state and a "where things live" map
- **Created:** `agent_docs/RESPONSES/`, `agent_docs/SESSIONS/` — Response Logging + session-log targets (both were referenced by CLAUDE.md but had never existed on disk)
- **Restored:** `agent_docs/KIP_REGISTRY.md` — was MISSING from the phase-3 working copy despite the 2026-08-04 entry below; recovered verbatim from `cyber-pharma-dev-v1/agent_docs/` and re-verified against phase-3 (KIP-1 and KIP-2 both still live)
- **Moved:** `session_2026-08-11.md` → `agent_docs/SESSIONS/`
- **Updated:** `CLAUDE.md` — session-file path now `agent_docs/SESSIONS/`; Session File Rules row changed from "Keep in project root"; added a "Protocol Directory Layout" section as the single authority on artifact paths
- **Reason:** Operator directive — build the protocol scaffold and consolidate session logs under `agent_docs/`. Surfaced the lost KIP registry in the process.

## 2026-08-04 09:50 UTC — [CC] Claude Code

- **Created:** `agent_docs/KIP_REGISTRY.md` — numbered registry of parked Kit/Known Improvement Proposals; seeded KIP-1 (server.ts cookie modernization) + KIP-2 (useAuthStore.role stale-persist consumers)
- **Updated:** `CLAUDE.md` — session-start step 5: check KIP_REGISTRY and surface any KIP whose triggers are met
- **Reason:** Operator directive after the staging nav-bug fix — give parked improvements a durable home with explicit trigger conditions instead of scattered flags
