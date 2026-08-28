# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-08-27 13:00 (FIX-001 engineering complete)
**Branch:** phase-3-2 (from phase-3-1 @ `8b260c1`; FIX-001 work uncommitted)
**Session log:** `agent_docs/SESSIONS/session_2026-08-27.md`

---

**Last action:** **BIM-000-CYBER-PHARMA CLOSED — Gate Q PASS** (Sol, 2026-08-14, report:
`agent_docs/QA/GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`). All AC1–AC9 + P1–P3 PASS, no
rework. Coordinator closeout commit `432cf5a` + push. Manager flipped to CLOSED with
deliverables map. Campaign Journal now live at `agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md`
(FLAG-1 resolved). Board certified green: build ✓ (22 routes), tsc ✓, jest 26/120/0,
lint 0 err / 34 legacy warn.

**Last action:** **FIX-001-CYBER-PHARMA CLOSED — Gate Q PASS** (Sol, 2026-08-27:
"GATE Q: PASS — MOVE FORWARD.", zero rework). KIP-2 independently verified cured
(stale-localStorage attack, ADMIN/MEMBER/logged-out, desktop + 375px). Report filed at
`agent_docs/ACTIONS/FIX-001-CYBER-PHARMA/QA/`; spec → QA-VERIFIED with verdict; manager
→ CLOSED with deliverables map. Board: build ✓ 22 routes · tsc ✓ · jest **28/128/0**.
**QA-FINDING-001** (dark-mode login branding contrast, minor a11y) → Architect routes to
findings ledger; NOT fixed in this module.

**Last action (2026-08-28):** **BIM-001 ENGINEERING COMPLETE — ALL GATES X0–X7 GREEN.**
Sixteen-table migration chain (0001–0015) authored from the AUTHORITY package and proven
on two throwaway projects: X1 from-zero ✓, X2 baseline-replica ✓ (after Director-authorized
wipe of a not-actually-fresh target), X3 reset×2 identical ✓, X4 deny-by-default + ensure_rls
✓, X5 type laws ✓, X6 types regenerated (Director-as-hands) + tsc clean ✓, X7 board
28/128/0 ✓. X0 closed with ruled discrepancy (update_updated_at never deployed → 0001
creates it; ERRATUM filed). Spec ENGINEER EVIDENCE-FILLED (AC1–AC15). **Live DB untouched.**

**Pending:** Director — ① 4 per-concern commits (manifest:
`agent_docs/RESPONSES/response_2026-08-28_170129_bim001-handoff.md`; exclude
`supabase/.temp/`), ② SHA into spec at PRE-Q, ③ DATA_CONTRACT §3 amendment staging
(ERRATUM E-2), ④ Sol's Gate Q (throwaway projects hold post-chain state; pooler regions
in handoff), ⑤ post-Gate-Q LIVE apply (Director only), ⑥ rotate throwaway credentials.

**Next step:** PRE-Q → Gate Q → BIM-001 close → BIM-002 (RLS policies). Carries:
numbered-color predicate rebuild · QA-FINDING-001 · report_files fidelity flag.

**⚠️ UNCOMMITTED:** Entire BIM-001 batch — supabase/migrations/ (15 files), 3 scripts,
package.json+lock, src/types/supabase.ts, module folder (spec/erratum/retro/evidence),
6 RESPONSES, session log, this file, CHANGELOG. Operator commits — agent never does.

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
