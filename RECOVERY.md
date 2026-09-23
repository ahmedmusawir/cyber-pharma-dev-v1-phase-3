# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-09-23 — **RRM-001-CYBER-PHARMA · CLOSED — GATE Q PASS (QA Lead, 2026-09-22, zero rework rounds) · MERGED TO `main`**
**Branch:** `main` @ `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b` (`1cd6e46`, `--no-ff` merge of `qa/phase-3-rrm001`, pushed to `origin/main`). **Certified implementation:** `cad164d62a623a115541c0441302de01ff74da5b` · evidence successor `9ab95e5` · closeout commit `2ccf450` · code baseline `5f45fb3` · pack commit `88e2c33`.
**Last action:** merge SHA recorded (2026-09-23) in campaign map §0, ledger resolution rows, `EXECUTION_LOG.md` Closeout, pack README, `QA_CERTIFICATION.md` § QA Cleanup release, `CLOSEOUT_CHECKLIST.md`. The nine deleted `.cjs` QA helpers: removal accepted by the Director (committed as staged in `2ccf450`). Session log: `agent_docs/SESSIONS/session_2026-09-23.md`.
**Pending (Director):** (1) commit this SHA-recording touch with the RRM-002 opening commit · (2) DA-2 Supabase signup OFF + `evidence/DA-2_SUPABASE_SIGNUP_DISABLED.md` (AC-206 stays NOT YET) · (3) doc-repo sync of the Phase 3 map errata · (4) `qa/phase-3-rrm001` retirement is the Director's call.
**Next step:** **RRM-002 pack authoring (Architect)** — RRM-002 branches from `main` @ `1cd6e46`. QA Lead's "QA-logged" journal entry for RRM-001 still owed (SOL).
**⚠️ UNCOMMITTED:** only this SHA-recording touch (map, ledger, execution log, README, certification, checklist, RECOVERY, CHANGELOG, session log, one RESPONSES record). Dev backend still at the 2-table baseline (LIVE APPLY DEFERRED through BIM-004).

**Prior state (2026-09-18):** **RRM-001 RECON AUGMENT delivered** (read-only) on `phase-3-rrm-ffm` @ `5f45fb3` (== `main`). Report: `agent_docs/RECON/RRM001_RECON_2026-09-18.md`. Session log: `agent_docs/SESSIONS/session_2026-09-18.md`.
**Pending:** Director — (1) live `handle_new_user` body: run `select pg_get_functiondef('public.handle_new_user()'::regprocedure);` in the Supabase SQL editor (settles A-002/A-008) · (2) later Phase-2.1 spec versions — on-disk copies are v1.0, code cites v1.3/v1.4 · (3) email-confirmation setting (F11/A-007). Recon **Revision 2** done: F1..F13 + A-001..A-008 mapped; deploy facts waived.
**Next step:** Architect reviews the recon → RRM-001 packet authoring. No source touched; nothing approved for implementation. **Session closed for restart** — full write-up in the session log's "End of Session State".
**⚠️ UNCOMMITTED:** `RECOVERY.md` · `agent_docs/RECON/RRM001_RECON_2026-09-18.md` · `agent_docs/SESSIONS/session_2026-09-18.md` · Operator-dropped `agent_docs/FABLE_CODE_REVIEW.md`, `ASTRA_CODE_REVIEW.md`, `PHASE_2.1/`, `PHASE_2.2/`. HEAD still `5f45fb3`.

**Prior state (2026-09-16):** **BIM-003-CYBER-PHARMA · CLOSED — GATE Q PASS (Sol, 2026-09-15) · MERGED TO `main`**
**Certified SHA:** **`c45949ece1a17f1a3fbb299f5551f911f869c21e`** (`c45949e`) — zero implementation defects across QA Stages A–I; engineering S1 `011eada` · S2 `c2d9348` · S3 `c45949e`.
**Branch:** **`main`** @ **`f7a1d4c`** — the J-19 merge commit ("16sep2026 - merge qa/phase-3-bim003 - BIM-003 CLOSED (Gate Q PASS @ c45949e)"), pushed. **Close batch `60ce6bd`** on `qa/phase-3-bim003` (QA package + closeout docs), pushed. Certified specimen `c45949e` is an ancestor of both. `qa/phase-3-bim003` retirement is the Director's call (as `qa/bim002`).
**Session log:** `agent_docs/SESSIONS/session_2026-09-16.md` (QA day: `session_2026-09-15.md` · engineering: `session_2026-09-14.md`)

**Last action:** **BIM-003 repository closeout** (docs only, 2026-09-16): RECOVERY final · session entry · CHANGELOG close entry · `RULINGS_ADDENDUM.md` + ratified CF-10 (Sol D-1) and E-8 note. Implementation diff vs `c45949e` re-verified **EMPTY** after the edits. No standalone Gate Q report file exists in `QA/` — verdict recorded in `QA/QA_WORK_JOURNAL.md` row 15 + campaign position; Director may paste Sol's text for verbatim filing.

**Module delivered:** `audit_logs` reshaped to Brief §3 (0028; immutability guard incl. R-6a TRUNCATE; FORCE RLS; UPDATE/DELETE revoked from anon+authenticated) · one admin SELECT policy (0029) · `audit_write()` SECURITY DEFINER trigger fn (0030) · thirteen write stamps (0031–0043, E-0) · four `owedbook_*` read wrappers (0044–0047, A-3 mapping) · `npm run audit:prove` (audit-prove/seed/session + symbolic golden, E-2/E-4/R-10) · README + `RUN_NOTES.md` · `RETROSPECTIVE.md` · `src/types/supabase.ts` regenerated (E-7). Errata E-0…E-8 in the spec lane; rulings R-6a/R-8a/R-10 + CF-8/9/10 in `RULINGS_ADDENDUM.md`.

**Campaign board:** BIM-000 ✅ · FIX-001 ✅ · BIM-001 ✅ · PROTO 06 ✅ · BIM-002 ✅ · **BIM-003 ✅** → **next: BIM-004 (seed factory)** → **Phase 3 APPLY SESSION** (Director applies chains 001→002→003→004 to the dev backend with `db:apply`, catalog check after each, harness run after 002) → BIM-005 (CRV).

**Carried flags (owners):** **CF-10** direct member SELECT on `user_data` is unaudited at the DB layer → BIM-005 routes every app read through `owedbook_*`; DB-layer closure = later permissions ruling · **CF-9** `db-verify.mjs` AC7 red since BIM-002 → QA Cleanup re-baseline · **CF-8** (+ additions) harness evidence root by module, `prove.mjs` "18 policies" text, real env prefix for scratch → BIM-005 · **CF-1…CF-7** as recorded in BIM-002's manager §10a · E-8 hygiene: add `supabase/.temp/` to `.gitignore` in a later module · Director: credential rotation on throwaways, `qa/bim002` / `phase-3-proto-6` deletion.

**LIVE APPLY: STILL DEFERRED.** Dev backend remains at the 2-table baseline; the BIM-001→003 chain (`0001–0047`) has been proven from scratch only on throwaways. Applied to the dev backend only in the named Phase 3 APPLY SESSION, after BIM-004.

**⚠️ UNCOMMITTED:** only this SHA-recording touch (RECOVERY, session log, one RESPONSES record). Everything else — QA lane, cleanup, closeout — is in `60ce6bd`, merged at `f7a1d4c`, on `origin/main`.

_(prior module: BIM-002 CLOSED · Gate Q PASS @ `dfc8a6a`, close batch `6171c54`, proto-06 landing zone removed `5c51fff` — preserved below)_
---

**Last action:** **BIM-001-CYBER-PHARMA CLOSED — GATE Q PASS** (Sol, 2026-08-31:
"CLEARED FOR CLOSE-OUT · ENGINEERING REWORK: ZERO", certified SHA `9f8c80d`). Close-out
batch executed: spec AC3/AC12 wording patched per ratified ERRATUM-Q1/Q2 → lifecycle
**QA-VERIFIED** with SHA pinned; manager → **CLOSED** with deliverables map + verdict;
retrospective completed (FLAG-C note + Gate Q addendum + spec-wording process lesson);
QA/ verified holding Sol's report + Cody's full battery (first live QA-execution-agent
run). Board certified green at close: build 22 · tsc · jest 28/128/0. **Live DB still
untouched — live apply is the Director's, post-close.**

**Module history:** BIM-000 CLOSED (`432cf5a`) · FIX-001 CLOSED (`70b38ef`, KIP-2 dead) ·
BIM-001 CLOSED (`9f8c80d`, 16-table schema).

**Also closed since:** **PROTO 06 rig lane** (R1–R5 green: 8 policies, 80-cell matrix,
32-case attack battery, reproducible from empty DB ×2). TRANSFERS.md + FINDINGS.md
consumed by the Architect and copied forward to `agent_docs/ACTIONS/PROTO06/`; policies
and harness on main. Headline: **F-1 — a write policy without a paired SELECT policy
silently no-ops** (binding on BIM-002).

**Pending (Director, carried — status unconfirmed):** **LIVE apply of the BIM-001 chain**
(`db:apply` path, Director only, at the Phase 3 APPLY SESSION) · DATA_CONTRACT §3
amendment staging (**BIM-001's** ERRATUM E-2 — not to be confused with BIM-002's E-2,
which concerns helper grants) · throwaway-credential rotation · delete `phase-3-proto-6`
and `proto-06/` now that BIM-002's harness port is complete.

**Last action (2026-09-01):** **BIM-002 ENGINEERING COMPLETE — all gates X0–X7 GREEN.**
15 RLS policies across 11 tables + 4 helpers (`0016–0027`), isolation harness at
`scripts/rls-harness/` with `npm run rls:prove`. Proven three times from empty on two
throwaway projects: 320-cell matrix, exact row-scoping, 28-case attack battery with every
mutation ground-truthed, and **live-session revocation proven with a byte-identical
token**. Board 28/128/0, types diff vs certified `9f8c80d` EMPTY, zero `src/**` writes.
Errata E-1…E-5; new findings F-10…F-13 in `ACTIONS/PROTO06/TRANSFERS_ADDENDUM_BIM-002.md`.
Templates at `AUTHORITY/RLS_TEMPLATES.md`. Spec ENGINEER EVIDENCE-FILLED (AC13 struck).

**Current state (2026-09-02): PRE-Q COMPLETE — ZERO IMPLEMENTATION DEFECTS, ZERO REWORK.**
Independent QA executed PRE-Q on the disposable `qa/bim002` branch against the throwaway
targets; the specimen cleared with **one spec-prose defect and one generalised finding,
no implementation or harness change**. One-Walk proven on attempt 3 with a byte-identical
token and **no `TOKEN_REFRESHED` event**.

Doc-only bookkeeping applied on this branch: **ERRATUM E-6** (AC3(b) denial-shape wording)
· **F-14** (denial shape depends on which clause denies) · **CF-8** (six QA harness
candidates, owner BIM-005, recorded not executed) · retrospective § PRE-Q. Spec lifecycle
deliberately remains **ENGINEER EVIDENCE-FILLED** — the QA-VERIFIED flip belongs to
certification.

**BIM-002 CLOSED — GATE Q PASS** (Sol, 2026-09-02), certified at **`dfc8a6a`**. Spec
**QA-VERIFIED** with the SHA pinned; manager **CLOSED** with deliverables map; Gate Q
report filed in `ACTIONS/BIM-002-CYBER-PHARMA/QA/`; errata **E-1…E-6** all ruled and
applied; findings **F-10…F-14** in the PROTO06 addendum.
Campaign board: BIM-000 ✅ · FIX-001 ✅ · BIM-001 ✅ · PROTO 06 ✅ · **BIM-002 ✅** →
next: **BIM-003 (audit)**.

**Post-close Director duties (carried, CF-1…CF-8):** credential rotation on **four**
throwaway projects · delete `proto-06/`, `phase-3-proto-6`, and `qa/bim002` · **APPLY
SESSION: re-verify E-4's premise on the dev backend** (CF-2) · CF-1 `owner_user_id`
delete behaviour → BIM-004/Phase 4 · CF-8 harness candidates → BIM-005.

**Next step:** Gate Q → BIM-002 close → **BIM-003 (audit)**. Dev backend remains at the
2-table baseline through BIM-004 (LIVE APPLY DEFERRED). Older carries: numbered-color
predicate rebuild · QA-FINDING-001 · report_files fidelity (CF-3).

**⚠️ UNCOMMITTED:** only this end-of-day RECOVERY/session-log update. Everything else —
implementation, harness, QA package, close-out docs — is committed and merged at
`dfc8a6a`. Operator commits — agent never does.

---

## Where Things Live

| Artifact | Path |
| --- | --- |
| Recovery state (this file) | `RECOVERY.md` — project root |
| Session logs | `agent_docs/SESSIONS/session_YYYY-MM-DD.md` |
| Response artifacts | `agent_docs/RESPONSES/response_<date>_<time>_<slug>.md` |
| Known issues / pitfalls | `agent_docs/KIP_REGISTRY.md` |
| Recon reports | `agent_docs/RECON/` (Operator renamed from `recon/` 2026-08-11) |
| Phase-3 DB starting truth | `agent_docs/DB_BASELINE.md` |
| Module managers | `agent_docs/ACTIONS/<module>/CLAUDE.md` + `ACCEPTANCE_SPEC.md` |
| Protocols | `CLAUDE.md` — project root (sole authority; `WINDSURF.md` deleted 2026-08-11) |

## Standing Rules

- **Git is Operator-only.** The agent runs no mutating git command — ever. It reminds; you decide.

## Known Good State

- **HEAD:** `c45949e` on **`qa/phase-3-bim003`** — the BIM-003 certified SHA (Gate Q PASS 2026-09-15). `main` = `5c51fff` until the J-19 merge. Prior certified: `dfc8a6a` (BIM-002), `9f8c80d` (BIM-001).
- **Working:** Everything — board last certified **22 routes · tsc clean · jest 28/128/0** (BIM-002; S3 re-runs the triad); chain now `0001–0047` (16 tables, **19** RLS policies, 4 helpers, `audit_write()` on 13 tables, immutable `audit_logs`, 4 `owedbook_*` read wrappers); `npm run rls:prove` and `npm run audit:prove` both GREEN on 2026-09-14 after the 47-file chain; board re-certified 22 routes · tsc clean · jest 28/128/0.
- **Broken:** Nothing known. KIP-2 is CLOSED (FIX-001). KIP-1 remains parked. CF-9/CF-10 are carried flags, not breaks.
- **Dev backend:** untouched, still at the 2-table baseline (LIVE APPLY DEFERRED through
  BIM-004).
