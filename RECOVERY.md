# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-09-01 (session open; BIM-002 staged)
**Branch:** `phase-3-bim002` @ `aca3d05` ("1sep2026 - bim002 has begun") — clean tree
**Session log:** `agent_docs/SESSIONS/session_2026-09-01.md`
_(prior: BIM-001 certified `9f8c80d` on phase-3-2 · PROTO 06 rig lane closed, branch `phase-3-proto-6` pending deletion)_

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

**Pending (Director, carried — status unconfirmed at this session's open):** **LIVE apply
of the BIM-001 chain** (`db:apply` path, Director only) · DATA_CONTRACT §3 amendment
staging (ERRATUM E-2) · throwaway-credential rotation (BIM-001 replay projects + the
Proto-06 rig project) · delete `phase-3-proto-6` after BIM-002's harness re-point.

**Next step:** **BIM-002 (RLS policies)** — module staged at
`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/` (manager + spec + own AUTHORITY, unread until
the launch line → Plan Mode). Junction-only membership law (Gap-6 / R-3) pre-loaded, and
PROTO 06's proven patterns + harness are the starting material. Open design gap it
inherits: **N-6 — no policy pattern exists for `accounts`-level access.** Older carries:
numbered-color predicate rebuild · QA-FINDING-001 · report_files fidelity flag.

**⚠️ UNCOMMITTED:** Only today's session file and this RECOVERY refresh. Tree was clean
at session open. Operator commits — agent never does.

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

- **HEAD:** `8b260c1` — "27aug2026 - BIM000 DONE" (BIM-000 fully committed + pushed)
- **Working:** Everything — Gate Q-certified board (build 22 routes, tsc clean,
  jest 26/120/0, lint 0 err / 34 legacy warn).
- **Broken:** Nothing known. KIP-2 defect window remains open by design until FIX-001.
