# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-09-02 (PRE-Q complete; BIM-002 awaiting certification)
**Authoritative module branch:** **`phase-3-bim002`** — the branch of record for BIM-002
close-out.
**Implementation specimen base SHA:** **`53f1ac0`** ("bim002 done waiting for qa and close
out") — the BIM-002 implementation batch, committed.
**`qa/bim002`:** disposable **PRE-Q execution branch only. Never merged.** QA's artifacts
were **copied** from it onto `phase-3-bim002` for permanent close-out (copy-not-merge,
the same rule used for the Proto 06 transfers).
**Session log:** `agent_docs/SESSIONS/session_2026-09-02.md`
_(prior: BIM-001 certified `9f8c80d` · PROTO 06 rig lane closed, `phase-3-proto-6` pending deletion)_

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

**Awaiting, in order:** Director commit of the staged close-out package → **certified SHA
pinned** into the spec → Sol's certification / Gate Q verdict → module close (spec →
QA-VERIFIED, manager → CLOSED with deliverables map, CHANGELOG / RECOVERY / session log,
tombstone) → route carried flags **CF-1…CF-8** (manager §10a), notably credential rotation
on all four throwaway projects and deletion of `proto-06/` + branch `phase-3-proto-6`.

**Next step:** Gate Q → BIM-002 close → **BIM-003 (audit)**. Dev backend remains at the
2-table baseline through BIM-004 (LIVE APPLY DEFERRED). Older carries: numbered-color
predicate rebuild · QA-FINDING-001 · report_files fidelity (CF-3).

**⚠️ UNCOMMITTED (staged on `phase-3-bim002`, documents only):** the PRE-Q bookkeeping
package — spec / manager / erratum / retrospective edits, the transfers addendum, QA's
copied-forward artifacts under `ACTIONS/BIM-002-CYBER-PHARMA/QA/`, today's responses,
session log, and this file. **The BIM-002 implementation batch itself is already
committed at `53f1ac0`** — migrations, harness, `package.json` and templates are in
history and were NOT touched by the bookkeeping pass. Operator commits — agent never does.

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

- **HEAD:** `53f1ac0` on **`phase-3-bim002`** — "bim002 done waiting for qa and close out"
  (BIM-002 implementation batch committed; this is the specimen PRE-Q ran against).
- **Working:** Everything — board **build 22 routes · tsc clean · jest 28 suites / 128
  tests / 0 failures**; sixteen-table chain `0001–0027` with 18 RLS policies; isolation
  harness at `scripts/rls-harness/` (`npm run rls:prove`).
- **Broken:** Nothing known. KIP-2 is CLOSED (FIX-001). KIP-1 remains parked.
- **Dev backend:** untouched, still at the 2-table baseline (LIVE APPLY DEFERRED through
  BIM-004).
