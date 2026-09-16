# BIM-002 — X5 COMPLETE: one command, twice from empty, normalised diff IDENTICAL · STOPPED at X6
**Date:** 2026-09-01 · `npm run rls:prove`

## 1. The command

```
npm run rls:prove
```
→ wipe (F-6 order: event trigger → schema → re-grants) → bootstrap baseline → **chain 0001–0027** → seed → **AC8 from scratch (E-5)** → policy-check (L1–L4) → 320-cell matrix → row-scoping → 28-case attack battery → R-C revocation. Exits non-zero at the first stage that fails.

Wipe and chain **reuse BIM-001's certified `scripts/db-reset.mjs`** rather than a second copy of the drop logic — one wipe implementation, already gate-proven, no drift between tools.

## 2. Both runs

| Stage | Run 1 (`…T0654`) | Run 2 (`…T0656`) |
|---|---|---|
| 1 Wipe + chain 0001–0027 | ✅ 27 migrations + bootstrap | ✅ |
| 2 Seed (FK-safe reset) | ✅ purged 3 prior identities · cast 4 · 600 user_data | ✅ purged 4 (run 1's cast) · cast 4 · 600 |
| 3 **AC8 from scratch (E-5)** | ✅ **AC8 GREEN** | ✅ **AC8 GREEN** |
| 4 policy-check L1–L4 | ✅ ALL LAWS HOLD · **18 policies** | ✅ |
| 5 Matrix | ✅ **320/320 GREEN** | ✅ |
| 6 Scoping | ✅ **SCOPING EXACT** | ✅ |
| 7 Attacks | ✅ **28 cases · 0 breaches · 0 ground-truth mismatches** | ✅ |
| 8 Revocation (R-C) | ✅ **PROVEN**, token byte-identical | ✅ |
| Verdict | **ISOLATION PROVEN** | **ISOLATION PROVEN** |

Evidence: `evidence/X5_prove_2026-09-01T0654.log` · `evidence/X5_prove_2026-09-01T0656.log` (each with a `.normalised.log` twin).

## 3. The diff — exactly the permitted noise

**Raw diff: 4 changed lines, 8 diff lines, nothing else.**

| Line | Difference | Category |
|---|---|---|
| run banner | `…T0654` vs `…T0656` | timestamp |
| matrix evidence path | `X5-matrix_…0655.log` vs `…0657.log` | timestamp |
| attack A3.1 ground truth | two different `business_id` uuids | generated id (the A1 store is recreated each run) |
| revocation token fingerprint | `7M5rcIwBSzcw` vs `uDSp-_R3Js8Q` | generated session token |

**Normalised diff (uuids, timestamps, ms timings and token fingerprints masked): `IDENTICAL — byte-for-byte`.**

The normalised twin is produced by the runner itself, so equivalence is a byte comparison rather than a judgement call — and any future *behavioural* drift shows up immediately instead of hiding among the id churn.

## 4. From-scratch AC8 (E-5) — the assertion that only counts on a fresh database

Both runs, after a genuine drop-and-apply:

```
ok   is_member_of        secdef=true volatile=s config={"search_path=\"\""}  acl={postgres=X, authenticated=X, service_role=X}
ok   is_admin_of         (same)
ok   is_account_member   (same)
ok   my_business_ids     (same)
ok   …(uuid)/()          anon=false  authenticated=true  service_role=true   ×4
ok   anon denied at execution (42501)
[ac8] AC8 GREEN
```

No bare `=X/` entry (PUBLIC) and no `anon=X` entry on any of the four — **both channels closed, verified on a database that has never seen a `create or replace`**. This is the check that X1's incremental apply could not honestly make, and it is now inside the one command, so it can never be skipped again.

## 5. Standing

Zero git · `.env.local` untouched · no credential value in any command, log, or document · dev backend never touched · scratch only · `proto-06/` unmodified.

---

# 6. STOPPED AT X6 — env lines the Director must add (names only)

X6 needs a **second throwaway** pre-loaded with the exact 2-table / 3-policy baseline. Four lines, values never shared with this session:

```
RLS_HARNESS_DB_URL            # session pooler string for the replica project — aws-1-* generation
RLS_HARNESS_SUPABASE_URL      # replica project URL
RLS_HARNESS_PUBLISHABLE_KEY   # replica publishable (anon) key
RLS_HARNESS_SECRET_KEY        # replica service-role key
```

### ⚠️ One flag before you add them — a silent-retarget hazard

`loadEnv()` prefers prefixed keys and only falls back to the Proto 06 keys (Amendment A-1) when they are absent. **The moment `RLS_HARNESS_*` exists, every `npm run rls:prove` retargets to whatever those four point at** — including the scratch runs. If they hold replica values, X5's command silently starts wiping and proving the replica instead, with no visible signal.

Two clean ways out — **your call**:

- **(a) Recommended — name the replica set separately:**
  ```
  RLS_REPLICA_DB_URL   RLS_REPLICA_SUPABASE_URL   RLS_REPLICA_PUBLISHABLE_KEY   RLS_REPLICA_SECRET_KEY
  ```
  I run X6 as `RLS_HARNESS_PREFIX=RLS_REPLICA_ npm run rls:prove`. The prefix switch is already built into `loadEnv`. Scratch and replica stay unambiguous, and both remain reproducible afterwards.
- **(b) Literal `RLS_HARNESS_*` for the replica:** then the A-1 fallback must be retired at the same time by adding an explicit scratch set under its own prefix (e.g. `RLS_SCRATCH_*`), or the scratch becomes unreachable and X5 is no longer re-runnable as evidenced.

Either way I need the **replica pre-loaded with the baseline** (2 tables, 3 policies) — the BIM-001 replica throwaway, wiped and re-bootstrapped, is the candidate you named. Say which option and I proceed; nothing is added to `.env.local` by me.
