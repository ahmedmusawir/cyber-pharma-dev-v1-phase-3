# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-09-14 — **BIM-003 · STAGE 2 COMPLETE (uncommitted)** · S1 committed `011eada`
**Branch:** **`phase-3-bim003`** @ **`011eada`** (S1) — S2 work is on top, **uncommitted**.
**Session log:** `agent_docs/SESSIONS/session_2026-09-14.md`

**Last action:** **BIM-003 S2** — wrappers `0044_owedbook_kpis` · `0045_owedbook_rows` · `0046_owedbook_summary` · `0047_owedbook_pbm_options` (E-0 N = 4, mapping A-3). Chain 47/47 from scratch · S2 catalog GREEN (AC-201…203) · session probes GREEN (AC-204…208) · `WRAPPER_CONTRACT.md` (AC-209) · src diff empty (AC-210). Mid-stage fix: 0045 now logs before any read (Brief §5). Report: `agent_docs/RESPONSES/BIM003_S2_2026-09-14.md`.

**S1 (committed `011eada`):** `0028` audit_logs reshape (drop 0015 shape, Brief §3, guard, FORCE RLS, RF-3 revokes) · `0029` one SELECT policy · `0030` `audit_write()` · `0031–0043` thirteen stamps (E-0). From-scratch apply 43/43 ok · catalog GREEN (`evidence/S1_catalog.md`) · **`rls:prove` GREEN** with the trail live (19 policies, 320 cells, 28 attacks, revocation). RF-7 harness edits + E-3 db-verify line applied. RISK-1 (BYPASSRLS) GREEN. Report: `agent_docs/RESPONSES/BIM003_S1_2026-09-14.md`.

**Pending:** Director commit of S2 → S3 prompt (`audit:prove`, symbolic golden E-2, `multiAdmin` E-4, RUN_NOTES.md, README, triad, types regen by Director).
**Rulings after S1:** TRUNCATE guard kept (R-6 amendment) · db:verify AC7 = **CF-9** (QA Cleanup) · **E-6** corrects E-3 to line 178. **Open from S2:** seed writes no insurance/new_paid/status — S3 golden session must seed those · CF-9 and R-6 amendment not yet written into the pack on disk.

**Next step:** wait for "S3 go". Plan of record: `agent_docs/RESPONSES/response_2026-09-14_125225_bim003-plan.md`; rulings in the spec's erratum lane E-0…E-5.

**⚠️ UNCOMMITTED:** all of S2 (4 migrations, `audit-catalog.mjs` + `audit-wrappers.mjs`, `seed-map.json`, spec evidence cells AC-201…210, `evidence/WRAPPER_CONTRACT.md` + S2_*, reports, this file, session log, CHANGELOG). Operator commits — agent never does.

_(prior state — BIM-002 CLOSED · Gate Q PASS @ `dfc8a6a`, close batch `6171c54`, proto-06 landing zone removed `5c51fff` — preserved below)_
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

- **HEAD:** `0e4e17e` on **`phase-3-bim003`** (= `main` `5c51fff` + the BIM-003 pack). Last certified: `dfc8a6a` (BIM-002).
- **Working:** Everything — board last certified **22 routes · tsc clean · jest 28/128/0** (BIM-002; S3 re-runs the triad); chain now `0001–0047` (16 tables, **19** RLS policies, 4 helpers, `audit_write()` on 13 tables, immutable `audit_logs`, 4 `owedbook_*` read wrappers); `npm run rls:prove` GREEN on 2026-09-14 with the audit chain.
- **Broken:** Nothing known. KIP-2 is CLOSED (FIX-001). KIP-1 remains parked.
- **Dev backend:** untouched, still at the 2-table baseline (LIVE APPLY DEFERRED through
  BIM-004).
