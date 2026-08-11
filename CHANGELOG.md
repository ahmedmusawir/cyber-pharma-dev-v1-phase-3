# Changelog

> Documentation/playbook change log per CLAUDE.md Changelog Protocol.
> `[CC]` = Claude Code · `[TS]` = Tony Stark manual edits.

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
