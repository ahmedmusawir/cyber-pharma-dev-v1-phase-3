# Recovery State

> **3-second recovery doc.** Open this first after any crash or new session.
> Updated after every plan completion. If this file is stale, the session log in
> `agent_docs/SESSIONS/` is the fallback source of truth.

**Last updated:** 2026-08-11 19:27
**Branch:** phase-3-1
**Session log:** `agent_docs/SESSIONS/session_2026-08-11.md`

---

**Last action:** Created protocol scaffold — `RECOVERY.md`, `agent_docs/RESPONSES/`,
`agent_docs/SESSIONS/`, `agent_docs/KIP_REGISTRY.md`. Relocated session logs from project
root to `agent_docs/SESSIONS/`. Amended CLAUDE.md to codify the new location.

**Pending:** NONE

**Next step:** Awaiting Phase 3 task assignment.

---

## Where Things Live

| Artifact | Path |
| --- | --- |
| Recovery state (this file) | `RECOVERY.md` — project root |
| Session logs | `agent_docs/SESSIONS/session_YYYY-MM-DD.md` |
| Response artifacts | `agent_docs/RESPONSES/response_<date>_<time>_<slug>.md` |
| Known issues / pitfalls | `agent_docs/KIP_REGISTRY.md` |
| Protocols | `CLAUDE.md` — project root |

## Known Good State

- **HEAD:** `6f6e63d` — "11aug2026 - audit passed, build tested, ready for phase 3"
- **Working:** Phase 2 complete; audit passed, build verified as of that commit.
- **Broken:** Nothing known.
