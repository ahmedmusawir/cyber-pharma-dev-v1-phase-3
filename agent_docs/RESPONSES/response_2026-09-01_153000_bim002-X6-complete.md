# BIM-002 — X6 COMPLETE: clean replica proves the same chain · scratch untouched · STOPPED before X7
**Date:** 2026-09-01 · `RLS_HARNESS_PREFIX=RLS_REPLICA_ npm run rls:prove`

## 1. Recon before touching anything

| | Replica | Scratch |
|---|---|---|
| Project ref | **`ihgcsrypblqkwommrkgj`** | `jmzwhgnyunwssamrqyhp` |
| Pooler host | `aws-1-ap-south-1.pooler.supabase.com` | `aws-1-us-west-1.pooler.supabase.com` |
| Generation | **aws-1 ✓** | aws-1 ✓ |
| DB-URL ref ↔ API-URL ref | agree ✓ | agree ✓ |
| Distinct targets | **yes ✓** — asserted before the wipe | |

Option (a) confirmed live: all four `RLS_REPLICA_*` names present, no `RLS_HARNESS_*` keys exist, scratch still resolves through the A-1 fallback. No value printed anywhere.

**Pre-wipe state of the replica:** 16 tables — BIM-001's X2 leftovers, exactly as expected for a not-pre-baselined target.

## 2. Bootstrap catalog vs `DB_BASELINE.md` — the gate before the chain

Wipe in **F-6 order** (event trigger → `DROP SCHEMA public CASCADE` → re-grants), then bootstrap via BIM-001's certified tooling. Catalog read **before the chain started**:

Evidence: `evidence/X6_bootstrap_catalog_match.log`

| Check | Result |
|---|---|
| Tables | ✅ exactly `[profiles, user_roles]` |
| Policies | ✅ the 3 baseline names, **byte-faithful** ("Profiles are updatable/viewable by owner or superadmins", "Users can read their own role") |
| RLS enabled on both | ✅ |
| Functions | ✅ `[handle_new_user, rls_auto_enable]` — **`update_updated_at` correctly ABSENT pre-chain** (it is chain-created; ERRATUM E-1) |
| `ensure_rls` event trigger | ✅ present |
| `app_role` enum | ✅ superadmin / admin / member |
| `on_auth_user_created` on `auth.users` | ✅ present |

**MATCHES DB_BASELINE.md — no discrepancy, chain permitted to proceed.**

*Method note:* the catalog was verified on the bootstrap output, then `rls:prove` re-ran its own wipe+bootstrap from the **same** `db-bootstrap-baseline.sql` before applying the chain. The baseline the chain landed on is byte-identical to the one verified — same file, deterministic.

## 3. Pipeline board — replica, one full run

Evidence: `evidence/X6_prove_replica_2026-09-01T0725.log` (+ `.normalised.log`); sub-logs share the `T0725` timestamp.

| Stage | Result |
|---|---|
| 1 Wipe + chain 0001–0027 | ✅ bootstrap + 27 migrations |
| 2 Seed (FK-safe reset) | ✅ **purged 14 pre-existing auth identities** (BIM-001-era accumulation) then cast 4 |
| 3 **AC8 from scratch (E-5)** | ✅ **AC8 GREEN** |
| 4 policy-check L1–L4 | ✅ ALL LAWS HOLD · **18 policies** |
| 5 Matrix | ✅ **320/320 GREEN** |
| 6 Scoping | ✅ **SCOPING EXACT** |
| 7 Attacks | ✅ **28 cases · 0 breaches · 0 ground-truth mismatches** |
| 8 Revocation (R-C) | ✅ **PROVEN** |
| Verdict | **ISOLATION PROVEN** |

## 4. Normalised diff — X5 run 2 (scratch) vs X6 (replica)

**Not byte-identical, and it should not be.** Three differences, all target properties, **zero behavioural**:

| Difference | Why it is not drift |
|---|---|
| `host=aws-1-us-west-1` → `host=aws-1-ap-south-1` | different project — this line *is* the proof X6 ran where it was supposed to |
| 7 × `[env] A-1 fallback in use …` present on scratch, absent on replica | the prefix mechanism working: the replica reads explicit `RLS_REPLICA_*` keys, the scratch falls back. Evidence that option (a) took effect |
| `purged 4` → `purged 14` pre-existing auth users | the replica carried more accumulated identities; the FK-safe reset cleared them all. A property of the starting state, not of the policies |

**Everything else is byte-identical** — all eight stage banners, AC8's full output, the 18-policy inventory, the four laws, 320/320, scoping, the 28 attack verdicts with their ground-truth lines, and the whole revocation sequence.

I did not retro-fit the normaliser to mask the host or the env banner. Masking the target identity would make a cross-target comparison *look* clean while destroying the one line that proves which database ran — the honest report is the one above. (Recorded as a small improvement for the harness: an explicit `--compare-behaviour` mode that strips env banners but never the host.)

## 5. Scratch untouched during X6 — confirmed

```
SCRATCH after X6 → policies=18  tables=16  user_data=600   UNTOUCHED ✓
```
Policy count still **18**, sixteen tables, the 600 seeded rows intact. X6 never addressed it: the prefix switch pointed every stage at the replica, and the scratch's own credentials were only read to make this assertion.

## 6. Minor evidence-naming wart (flagged, not silently fixed)

`prove.mjs` hardcodes the matrix label `X5-matrix`, so X6's sub-logs are named `X5-matrix_…T0725.log` and `X5_ac8_fresh_…T0725.log`. They are unambiguous by timestamp and are referenced correctly from inside the consolidated X6 log — renaming them now would break those internal references. Fix at X7: give `prove.mjs` a phase label argument. Raising it rather than quietly renaming files that other evidence points at.

## 7. Standing

Zero git · `.env.local` untouched by me · no credential value in any command, log, or document · dev backend never touched · scratch and replica are both disposable throwaways.

→ **STOPPED before X7** (board + fences: build/tsc/jest, `src/types/supabase.ts` diff empty, `createAdminClient` fence, Gap-6 greps over `0016+`, `storage.objects` still zero).
