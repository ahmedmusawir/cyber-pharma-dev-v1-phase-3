# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-08-14 13:50
**Branch:** phase-3-1
**Session log:** `agent_docs/SESSIONS/session_2026-08-14.md`

---

**Last action:** **BIM-000-CYBER-PHARMA CLOSED — Gate Q PASS** (Sol, 2026-08-14, report:
`agent_docs/QA/GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`). All AC1–AC9 + P1–P3 PASS, no
rework. Coordinator closeout commit `432cf5a` + push. Manager flipped to CLOSED with
deliverables map. Campaign Journal now live at `agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md`
(FLAG-1 resolved). Board certified green: build ✓ (22 routes), tsc ✓, jest 26/120/0,
lint 0 err / 34 legacy warn.

**Pending:** NONE for BIM-000. Untracked at close-out: Gate Q report + this session's
close bookkeeping (Operator commits when ready).

**Next step:** Phase 3 advances — next module per campaign map: **FIX-001** (KIP-2
stale-persist fix; MobileNav/UserMenu read localStorage-persisted role on the live
landing page — promotion trigger fired per recon). Non-blocking carries: numbered-color
predicate rebuild, `instrumentation.ts:5` comment fix at first src-writable module.

**⚠️ UNCOMMITTED:** package.json, package-lock.json, .env.example, tsconfig.json,
README.md, docs/TESTING.md modified; temp/ghl-example.json deleted; agent_docs/ additions
(ACTIONS/, RECON/, DB_BASELINE.md, new session + responses); CHANGELOG.md, RECOVERY.md.
Operator commits — agent never does.

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

- **HEAD:** `87d39b4` — "11aug2026 - session ready - claude.md updated"
- **Working:** BIM-000 complete on top of HEAD; triad green (build 22 routes, tsc clean,
  jest 26/120/0, `npm ci` 0 vulns) verified 2026-08-13 16:28.
- **Broken:** Nothing known.
