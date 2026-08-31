# Session Log: 2026-08-31 — PROTO 06 RIG LANE (dedicated runner)

> Lane-suffixed filename: two lanes ran this date. `session_2026-08-31.md` is the
> mothership BIM-001 close-out session; this file is the Proto 06 rig runner.
> **Branch `phase-3-proto-6` is disposable and slated for deletion** — this log lives
> on it. If the lane's session history matters beyond the branch, the Director copies
> it forward with the transfers (same COPY-not-merge rule).

## Project Context

- **Project:** CYBER_PHARMA — cyber-pharma-dev-v1-phase-3 · **Tool:** Claude Code
- **Lane:** Proto 06 rig (sandbox), serial, no QA seat. Gate currency = TRANSFERS.md.
- **Goal:** prove the tenant-isolation RLS patterns in miniature and hand BIM-002 artifacts it can apply verbatim.
- **Authority:** `agent_docs/ACTIONS/PROTO06/` — PROTO_06_RIG_LAUNCH_BRIEF (+ Addendum A) and PROTO_PLAN_06 v1.1 (reconciliation header supersedes body).

## Starting State

- **Branch:** `phase-3-proto-6`, cut from `53f4b63` ("Official Bim001 close out").
- **Database:** throwaway Supabase project carrying leftover BIM-001 schema (16 tables).
- **Binding, not re-derived:** Gap-6 junction-only RLS (`role TEXT CHECK IN ('admin','member')`), no policy reads `user_roles` or `raw_user_meta_data`, no superadmin policy ever, deny-by-default with one policy at a time, zero git.

## Session Progress

### [11:36] — LAUNCH RECON: BLOCKED (reported, no plan presented)

Both READ-FIRST documents absent from disk; `.env.local` held API keys only (PostgREST cannot run DDL or read `pg_catalog`); campaign journal's +65 uncommitted lines were stranded on a never-merge branch. All three surfaced rather than worked around. No plan presented — building one from the override alone would have been re-derivation.

### [12:15] — R1 PLAN (PENDING_APPROVAL → approved with 2 additions)

Blockers cleared by Director (docs staged at `ACTIONS/PROTO06/` — disk wins over the launch order's path; journal committed on mainline; DB URL supplied). Plan flags: **F1** `PROTO06_DB_URL` absent from `.env.local` and I may never edit that file (BIM-000 R2 doctrine) — Director added it; **F2** the pasted pooler host was wrong (`aws-0` → tenant not found; **`aws-1-us-west-1`** connects, verified read-only); **F3** leftover `auth.users` identities survive a public-schema wipe (inert, noted). Director additions: matrix carries S/I/U/D from R1 onward; ownership fallback in the wipe.

### [R1] — COMPLETE, GATE GREEN

Wipe → `pg_catalog` proof **0 tables / 0 functions / 0 policies**, `ensure_rls` absent (CASCADE path held; fallback unused). Migrate → 5 tables, **RLS=true on all, zero policies**. Seed → 3 identities across 2 accounts / 3 stores, 6,000 fact + 50 ref rows. **Gate: TOTAL DENY, 80/80 cells, 0 mismatches.**

### [R2] — COMPLETE WITH FINDING

Helpers landed first (no-drift proof: matrix unchanged at 80/80 deny), then T-1 → T-2a/b/c → T-3 → T-4 → T-5 → T-6, each with a **red→green cycle and its own evidence pair**, zero regressions at any step. One-per-operation law enforced mechanically after every landing.

**🔴 FINDING-1 discovered:** `business_update_admin` was present and correct but affected 0 rows — Postgres evaluates an UPDATE's `WHERE` under SELECT-read semantics, and `businesses` had no SELECT policy. **A write policy without a paired read path is a silent no-op.** Held RED and flagged rather than fixing unapproved scope.

### [R3] — COMPLETE

FINDING-1 ruled APPROVED → `business_select_member` landed as the 8th policy (SELECT — different operation, law intact). RED 4 → **GREEN 80/80**; T-3 then discriminated correctly (ownerTwo updates S1, others denied).

**Attack battery: 32 cases, 0 breaches** — foreign `business_id` across all write ops, junction role tampering, cross-account probes by direct id, full anon sweep. Role-tampering result verified against **service-role ground truth** (role still `member`, junction still 4 rows) because "0 affected" is not proof nothing persisted.

Findings ledger written (`proto-06/FINDINGS.md`).

### [R4 + R5] — COMPLETE, LANE DONE

**R4:** `rig-prove.mjs` — one command, wipe → schema → 8 policies in mandated order → seed → matrix → attacks. **Ran twice from an empty database, green both times, identical results.**

**T-7 EXPLAIN** (informational): unqualified tenant read = Seq Scan with per-row helper, **125 ms at 6k rows**; with explicit `business_id` filter = Index Scan, 42 ms; point UPDATE 0.8 ms. Scale warning recorded; an alternative `IN (subquery)` formulation flagged for BIM-002 but deliberately **not** benchmarked (beyond authorized scope).

**R5:** `agent_docs/ACTIONS/PROTO06/TRANSFERS.md` — all five brief §8 sections plus retrospective. Storage leg **deferred to Proto 01 by ruling**, recorded as owed (N-1), not built. Git checkpoint commands prepared, never run.

### [CLOSED] — Director, 2026-08-31

TRANSFERS.md and FINDINGS.md consumed by the Architect; policies and harness copied forward to main; journal close entry committed. Branch to be deleted after BIM-002's harness re-point. **No further work in this lane.**

## Lessons Learned

- **F-1 is why rigs exist.** A correct, present, well-reviewed policy that does nothing — indistinguishable from success at review time and from a legitimate deny at runtime. It would have shipped into BIM-002 unseen.
- **Instruments lie as readily as code.** Third instrument defect of the campaign (`array_agg` over the pg driver, after BIM-001's privilege-blind `information_schema`). Verification tooling deserves the same skepticism as the thing it verifies.
- **A destructive test must destroy only what it created.** Chaining each probe's update/delete to its own inserted row is what made the twice-from-scratch requirement pass identically.
- **Policy landing order is a deliverable,** not an implementation detail: helpers → SELECTs → writes.
- **Fourth consecutive launch missed staging the runner's inputs** (BIM-000 journal · BIM-001 authority · PROTO/06 path · `PROTO06_DB_URL`). This is a process defect, not bad luck — input staging belongs in the launch line, mechanically checked.

## End of Session State

- **Working:** Everything the rig set out to prove. 8 policies, 80-cell matrix, 32-case battery, reproducible from an empty database.
- **Broken:** Nothing.
- **Owed elsewhere (TRANSFERS §5):** Storage leg → Proto 01 · browser-client leg → later lane · live-session junction revocation, volume beyond 6k, multi-policy fan-out, and **`accounts`-level access (no policy exists — the likeliest new pattern BIM-002 needs)** → BIM-002/CRV.
- **Housekeeping for the Director:** rotate the throwaway project's credentials (they transited chat) when the branch is deleted.
- **Next Steps:** none in this lane. BIM-002 authoring is unblocked.

## Files Changed This Session (all rig-owned or protocol paths)

- `proto-06/migrations/p01–p05.sql` — the five-table miniature
- `proto-06/policies/` — `h0_helpers.sql` + 8 policy files
- `proto-06/scripts/` — `rig-lib`, `rig-reset`, `rig-seed`, `rig-policy`, `rig-prove`
- `proto-06/harness/` — `expectations.json`, `rig-harness`, `rig-attacks`, `rig-explain`, `seed-map.json`
- `proto-06/evidence/` — 25+ gate logs (R1, R2 red/green pairs, R3, R4 ×2, T-7)
- `proto-06/README.md`, `proto-06/FINDINGS.md`
- `agent_docs/ACTIONS/PROTO06/TRANSFERS.md` — the gate currency
- `agent_docs/RESPONSES/` — 5 lane artifacts (blocked report, R1 plan, R1/R2/R3 boards, R4+R5 close)
- **Untouched:** `src/`, `supabase/`, `scripts/`, `.env.local`, all `agent_docs/` outside PROTO06 + protocol paths. Zero git commands, ever.

🥄 *The scout bled. The army has the map.*
