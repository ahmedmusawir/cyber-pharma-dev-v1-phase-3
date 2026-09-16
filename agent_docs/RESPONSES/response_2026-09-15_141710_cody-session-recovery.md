# CODY BIM-003 SESSION RECOVERY — Orientation Report (read-only)

**Date:** 2026-09-15 14:17 · **Agent:** Cody (QA execution) · **For:** Tony (Director) / SOL (QA Lead)
**Scope:** orientation only — no dynamic command, no reset, no prove run, no product file touched. Read-only git inspection only.

## ENGINE

Cody now runs under **glm-5.3:cloud** (Claude Code harness). Previous session also glm-5.3-flash:cloud; its stop cause was a harness safety-classifier timeout, not the model's work product. Harness appears operational this session (all commands executed cleanly).

## SPECIMEN

- **branch:** `qa/phase-3-bim003` ✅ (matches expected)
- **full SHA:** `c45949ece1a17f1a3fbb299f5551f911f869c21e` ✅ (matches pinned candidate)
- **working-tree summary:** `M RECOVERY.md` + 6 untracked paths, all QA-session protocol artifacts (recon report, journal, helpers/, two response mirrors, session log). **Zero product files touched.** Identical to the tree the previous Cody left at handoff — no drift since the stop.

## HANDOFF RECOVERED

Read: `RECOVERY.md` (root, handoff block updated 2026-09-15 14:10 by prior Cody) and `agent_docs/SESSIONS/session_2026-09-15.md`.

**Exact stop point:** static recon COMPLETE (`QA/CODY_QA_RECON.md`, 12:36) · dynamic campaign STAGED (helpers written 13:15–13:20, journal row 3 at 14:10) · **Stage A NOT executed** — the first Stage A command never ran (Claude Code Auto Bash safety-classifier timeout; classified QA-EXECUTION-INFRASTRUCTURE blocked, not a BIM-003 defect). No dynamic evidence exists.

## QA ARTIFACTS RECOVERED

| Artifact | Purpose | State |
|---|---|---|
| `QA/CODY_QA_RECON.md` | Recon of record: specimen pin, contract read, claim map, implementation delta, attack surface, instrument review (G-1…G-5), D-1…D-5, 10 proposed dynamic attacks | complete, unexecuted beyond static |
| `QA/QA_WORK_JOURNAL.md` | Append-only journal (J-13): rows 1 (recon), 2 (helpers staged), 3 (session handoff) | current |
| `QA/helpers/qa-reset.mjs` | Stage A canonical reset = `db-reset.mjs reset` with DB_URL/DB_RESET_ALLOW wired via `lib/env.mjs` (identical wiring to `audit-prove.mjs:23`); writes `QA/evidence/QA_A_db_reset.log` | staged, never executed; import depth fixed (5 levels) |
| `QA/helpers/qa-golden-attack.mjs` | Stage B oracle attacks (`action\|business\|remove-row\|add-row\|payload\|status`): snapshots committed golden, corrupts one case, runs canonical `audit:prove`, requires non-zero, restores byte-exact + sha256-verified | staged, never executed |
| `QA/helpers/qa-probes.mjs` | Stages C–G: C = D-1 direct member read vs wrapper audit delta · D = forgery/immutability (auth + svc + owner TRUNCATE) · E = tenant boundary matrix (self-cancelling-counter defect fixed) · F = service-role wrapper observation · G = attribution incl. session refresh | staged, never executed |
| `QA/evidence/`, `QA/rls-prove/` | Destinations for QA-run evidence | **both empty** — confirms zero dynamic evidence |

Helper sanity verified read-only this session: all import targets exist on disk (`lib/env.mjs` exports `loadEnv/repoRoot/harnessRoot/CAST_PASSWORD`, `lib/db.mjs` exports `pgClient/serviceClient/anonClient`, `seed-map.json`, `audit-seed-map.json`, `db-reset.mjs`, golden file present). `loadEnv()` reaches the unprefixed SCRATCH block through the A-1 fallback map — the same canonical wiring Engineering's own `audit:prove` uses, so Stage A equivalence holds.

## ENVIRONMENT STATE

- **SCRATCH:** NOT touched by QA. Prior session ran zero destructive commands — the blocked command never executed. Still at whatever state Engineering's 2026-09-14 runs left it. Authorized destructive target per this prompt + `evidence/ENV_NOTE.md` (credentials rotated 2026-09-14 before P1).
- **REPLICA:** untouched, not authorized, not probed this session. I did not open `.env.local`.
- **golden:** byte-untouched — `git diff --stat` on `scripts/rls-harness/golden/audit_trail_expected.json` is EMPTY (corruption in qa-golden-attack happens only transiently inside the helper, with snapshot + sha256 restore).
- **dynamic campaign executed: NO.** Zero Stage A/B/C–G evidence on disk.

## OPEN QA BOARD

- **D-1** (contract-spec, needs live proof — Stage C): BIM-002's `user_data_select_member` lets any junction member SELECT `user_data` directly with **zero** `read_page` rows — the wrappers are not the only read channel. SOL class: CONTRACT-SPEC / THREAT-MODEL, not an implementation defect.
- **D-2** (informational, Stage D observes): `audit_write()` carries implicit `authenticated=X` EXECUTE from the rig default-ACL (`db-reset.mjs:98`); trigger functions aren't directly invocable, but Stage D probes direct invocation live.
- **D-3** (pending SOL adjudication): `supabase/.temp/cli-latest` (v2.116.0→v2.117.0) changed via Director types regen; path outside AC-901's literal permitted list — likely erratum-lane row.
- **D-4** (informational): `PostgrestVersion` 14.17→14.5 in the regenerated types — regen artifact, E-7 classes version-string hunks non-module; Director look suggested.
- **D-5** (informational): identity nomenclature asymmetry — admin-A's "A" = A1+A2, `multi`'s "A" = A1+B1; reading hazard only.
- **Known red:** `db:verify` AC7 / **CF-9** — pre-existing BIM-002 issue, routed to QA Cleanup, **not** a BIM-003 finding. Not reclassified.
- **Residuals from recon (context):** G-1 golden scope (post-watermark only, seed rows excluded by design/RISK-3) · G-2 payload depth (E-2 accepts "present"-only) · G-3 oracle same-commit authorship (procedural independence only) · G-4 AC-112 denial-vs-empty mode not pinned.

## NEXT RUNG — STAGE A (on SOL release)

1. Re-pin specimen (branch / full SHA / `git status --short`).
2. `node agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/helpers/qa-reset.mjs` — canonical db:reset + chain replay on SCRATCH (env wired silently; writes `QA/evidence/QA_A_db_reset.log`).
3. `npm run rls:prove` → move its timestamped evidence into `QA/rls-prove/`.
4. `npm run audit:prove` → move its evidence into `QA/evidence/`.
5. Then Stages B–I per SOL prompt #2: golden-oracle attacks (B), D-1 direct-read experiment (C), forgery/immutability (D), tenant boundaries (E), service-role observation (F), attribution (G), BIM-002 regression, final module regression.

**Not started. This session is orientation only.**

## DISCREPANCIES

None material. Three notes, none blocking:

1. **Consistent:** prompt, RECOVERY.md, journal, and on-disk state all agree on stop point, untouched SCRATCH/golden, and empty evidence dirs.
2. **Minor file-mapping note:** the prompt calls the reset helper `QA/helpers/qa-reset.mjs` relative to the QA folder — the actual path is `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/helpers/qa-reset.mjs` (the prompt's own "locate under" clause gives the right root; this is notation only).
3. **Response-mirror gap (bookkeeping observation):** the prior session's 14:10 handoff updated `RECOVERY.md` + journal row 3 but no `response_*` artifact exists for the handoff itself — the last response mirror is 12:36 (recon). Handoff content is fully recoverable from RECOVERY.md, so nothing was lost, but the RESPONSES protocol's "write before display" was not mirrored for the handoff block. Noted for SOL; no action taken.

## READINESS

**READY FOR SOL RELEASE**

— STOP. Awaiting Tony/SOL before executing Stage A. —

🥄 *I checked the camera from every angle again. Still haven't turned it on. — Cody*