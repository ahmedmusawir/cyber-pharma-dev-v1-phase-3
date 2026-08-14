# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-08-14 12:30
**Branch:** phase-3-1
**Session log:** `agent_docs/SESSIONS/session_2026-08-14.md`

---

**Last action:** BIM-000 **FINAL CLEANUP** (end of PRE-Q). Deleted 4 temporary QA pilot
artifacts (qa_bim000 logs + scripts; all were untracked). Verified: zero src/ writes,
all BIM-000 changes intact, phase2.md RECOVERED at `agent_docs/phase2.md` with
DB_BASELINE sibling note updated by Coordinator. Regression re-run green: build ✓
(22 routes), tsc clean, jest 26/120/0, lint 0 errors / 34 legacy warnings. Zero git
write commands. Earlier (08-13): BIM-000 executed, all gates G1–G8 green.

**Pending:** ① Coordinator manual per-concern commits (manifest:
`agent_docs/RESPONSES/response_2026-08-13_163000_bim000-handoff.md`). ② **BLOCKED:**
`PHASE_3_CAMPAIGN_JOURNAL.md` — no canonical source exists anywhere in
`/home/moose/nextjs/CYBER_PHARMA/` (all 4 repos searched + phrase-grep); must be created
fresh, not restored. ③ STRIPE purge/rotation attestation (P2/R2). ④ Gate Q with Sol.

**Next step:** Coordinator commits → Gate Q verdict → FIX-001 (KIP-2; promotion trigger
fired per recon).

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
