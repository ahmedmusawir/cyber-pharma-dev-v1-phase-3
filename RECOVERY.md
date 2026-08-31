# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-08-31 (BIM-001 CLOSED)
**Branch:** phase-3-2 @ `9f8c80d` (BIM-001 certified SHA)
**Session log:** `agent_docs/SESSIONS/session_2026-08-31.md`

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

**Pending:** ONE Director close-out commit (batch in
`agent_docs/RESPONSES/response_2026-08-31_bim001-closeout.md`). Post-commit Director
duties: **LIVE apply of the chain** (db:apply path, Director only) · DATA_CONTRACT §3
amendment staging (ERRATUM E-2) · throwaway-credential rotation.

**Next step:** BIM-002 (RLS policies) — the campaign's next module; junction-only
membership law (R-3) already pre-loaded in the BIM-001 manager. Carries: numbered-color
predicate rebuild · QA-FINDING-001 · report_files fidelity flag.

**⚠️ UNCOMMITTED:** BIM-001 close-out batch only — Gate Q FINAL PASS report (untracked),
spec/manager/retrospective patches, session_2026-08-31.md, this file, CHANGELOG,
close-out response. Operator commits — agent never does.

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
