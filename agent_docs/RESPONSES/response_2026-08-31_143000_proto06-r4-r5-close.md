# PROTO 06 — R4 + R5 CLOSE: RIG COMPLETE, TRANSFERS DELIVERED
**Date:** 2026-08-31 · **Deliverable:** `agent_docs/ACTIONS/PROTO06/TRANSFERS.md`

## R4 — one command, twice from an empty database, green both times

```
RIG_RESET_ALLOW=yes node proto-06/scripts/rig-prove.mjs
```
wipe → schema (5 tables, RLS on, 0 policies) → **8 policies in mandated order** (helpers → SELECTs → writes, per F-8) → seed → 80-cell matrix → 32-case attack battery. Exits non-zero on any mismatch or breach.

| Run | Wipe | Schema | Policies | Seed | Matrix | Attacks | Verdict |
|---|---|---|---|---|---|---|---|
| 1 (`R4_full_proof_…T0621.log`) | 0/0/0 bare | 5 tables RLS=true | 9/9 applied | 6000+50 | **80 cells, 0 mismatches** | **32 cases, 0 breaches** | ✓ GREEN |
| 2 (`R4_full_proof_…T0622.log`) | 0/0/0 bare | 5 tables RLS=true | 9/9 applied | 6000+50 | **80 cells, 0 mismatches** | **32 cases, 0 breaches** | ✓ GREEN |

Identical results — the proof is genuinely reproducible, not a survivor of accumulated state.

## T-7 EXPLAIN (informational) — with a real scale warning

| Path | Plan | Time |
|---|---|---|
| `select * from fact_data` (policy only) | **Seq Scan** + per-row `is_member_of` | **125 ms** / 4,000 rows |
| `... where business_id = $1` | **Index Scan** on `idx_fact_business` | 42 ms / 2,000 rows |
| `update ... where id = $1` | Index Scan on pkey | 0.8 ms |
| helper alone | — | 0.3 ms |

**The policy predicate does not drive an index by itself.** At 6k rows an unqualified tenant read costs 125 ms and scales linearly — `user_data` will be 10–100× that. Application queries must carry their own `business_id` filter; the policy is a security boundary, not an optimizer. An alternative `IN (subquery)` formulation might let the planner hash-join once instead of calling a function per row — **flagged for a BIM-002 A/B, deliberately not benchmarked here** (beyond authorized scope).

## R5 — TRANSFERS.md delivered (brief §8, all five sections + retrospective)

1. **Policy SQL, annotated** — helpers (with the SECURITY DEFINER rationale), T-1..T-6, and the 8th policy, plus the two structural laws (one permissive policy per operation per table; born RLS-on/zero-policies).
2. **The harness** — file map, expectations format, the red-green discipline, and a 5-step re-point recipe for BIM-002/BIM-005 (config + payload data, no logic rewrite), including the guards worth keeping.
3. **Findings F-1..F-9** — headed by F-1 (write policy without paired SELECT silently no-ops) with the BIM-002 mandate; F-8 (policy landing order) and F-9 (harness idempotence) added by R4.
4. **T-7 EXPLAIN evidence** with index confirmations and the scale warning.
5. **Not-proven list N-1..N-6** — Storage leg (deferred to Proto 01 by ruling), browser-client leg, **live-session junction revocation** (offboarding-relevant), volume beyond 6k, multi-policy fan-out at sixteen tables, and **N-6: no policy exists on `accounts` at all** — the most likely place BIM-002 needs a pattern that doesn't exist yet.

Plus a six-item rig retrospective (what fought back), including the honest note that four campaign launches in a row have missed staging the runner's inputs.

## Storage leg

**DEFERRED to Proto 01 by Director ruling — not built.** Recorded in TRANSFERS §5 as N-1 with an explicit warning that table-layer isolation implies nothing about `storage.objects`.

## Git — PREPARED, NOT RUN (TRANSFERS §7)

```bash
git add proto-06/ agent_docs/ACTIONS/PROTO06/ agent_docs/RESPONSES/ agent_docs/SESSIONS/session_2026-08-31.md
git commit -m "31aug2026 - PROTO 06 checkpoint - R1-R5 green: 8 policies, 80-cell matrix, 32-case attack battery, TRANSFERS written"
```
Checkpoint only — **never merge this branch.** Transfers are copied forward, not merged. `.env.local` stays untracked; nothing under `proto-06/` holds a credential. Rotate the throwaway project's keys when the lane closes.

**PROTO 06 R1–R5 COMPLETE. STOPPED.** The gate currency is on the Architect's desk; BIM-002 authoring is unblocked when he's consumed it.
