# PROTO-06 — RLS Isolation Rig (disposable branch `phase-3-proto-6`)

Docs/authority: `agent_docs/ACTIONS/PROTO06/` (brief + PROTO_PLAN_06 v1.1 — header wins).
DB: throwaway Supabase project via `PROTO06_DB_URL` in `.env.local` (never printed).
Transfer currency: `agent_docs/ACTIONS/PROTO06/TRANSFERS.md` (R5).

## Run-sheet

```
RIG_RESET_ALLOW=yes node proto-06/scripts/rig-reset.mjs wipe    # bare schema + pg_catalog proof
node proto-06/scripts/rig-reset.mjs migrate                     # 5 tables, RLS on, 0 policies
node proto-06/scripts/rig-seed.mjs                              # identities + 6k fact rows
node proto-06/harness/rig-harness.mjs                           # expectation matrix (evidence per run)
node proto-06/scripts/rig-reset.mjs catalog                     # inspect current pg_catalog state
```

## Layout

- `migrations/p01–p05` — the five-table miniature (accounts → businesses → user_businesses → fact_data → ref_data), each born RLS-enabled, zero policies
- `scripts/` — rig-lib (env; never prints values) · rig-reset (wipe w/ ownership fallback, migrate, catalog) · rig-seed (2 accounts / 3 stores / 3 identities / 6k+50 rows)
- `harness/` — `expectations.json` (declarative identity×table×operation matrix, S/I/U/D) · `rig-harness.mjs` (real publishable-key sessions; DENY semantics: select=0 rows, insert=RLS error, update/delete=0 affected; exit≠0 on any mismatch) · `seed-map.json` (ids only)
- `evidence/` — unique-filename logs per gate/run

## The one command (R4)

```
RIG_RESET_ALLOW=yes node proto-06/scripts/rig-prove.mjs
```
wipe → schema → 8 policies (helpers → SELECTs → writes) → seed → 80-cell matrix → 32-case attack battery. Exit ≠ 0 on any mismatch or breach. Ran twice from scratch, green both times.

## Gate state — ALL GREEN (2026-08-31)

| Gate | Result |
|---|---|
| **R1** | wipe proven bare (0/0/0 pg_catalog) · 5 tables RLS=true / 0 policies · **TOTAL DENY 80/80** |
| **R2** | T-1..T-6 landed one at a time, red→green each, zero regressions · **FINDING-1** (write policy needs paired SELECT) discovered and fixed as the 8th policy |
| **R3** | **32/32 attacks DENIED** — foreign business_id, role tampering, cross-account probes, anon sweep · tampering verified against service-role ground truth |
| **R4** | **full proof from empty database ×2, green both** (`evidence/R4_full_proof_*.log`) |
| **R5** | `agent_docs/ACTIONS/PROTO06/TRANSFERS.md` written — policies, harness, findings F-1..F-9, T-7 EXPLAIN, not-proven list, retrospective |
| T-7 | EXPLAIN captured (informational) — ⚠️ unqualified tenant reads seq-scan; see TRANSFERS §4 |
| Storage leg | **DEFERRED to Proto 01** by Director ruling — not built, recorded as owed (TRANSFERS §5 N-1) |
