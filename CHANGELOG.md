# Changelog

> Documentation/playbook change log per CLAUDE.md Changelog Protocol.
> `[CC]` = Claude Code · `[TS]` = Tony Stark manual edits.

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
