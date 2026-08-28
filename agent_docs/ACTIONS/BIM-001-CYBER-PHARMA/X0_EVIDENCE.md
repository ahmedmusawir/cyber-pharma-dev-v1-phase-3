# X0 EVIDENCE — BIM-001 Baseline Recon
**Date:** 2026-08-28 · **Source:** Director-executed `X0_CATALOG.sql` against LIVE project (dashboard SQL editor, read-only), output pasted verbatim · **Diffed against:** `agent_docs/DB_BASELINE.md` + `AUTHORITY/DATA_CONTRACT_PHASE_1.md` §3

## Verdict: ⛔ DISCREPANCY — STOP CONDITION FIRED (1 finding)

| # | Check | Expected | Live | Verdict |
|---|---|---|---|---|
| 1 | public tables | exactly `profiles`, `user_roles` | `profiles`, `user_roles` | ✅ EXACT |
| 2 | policies | 3, byte-faithful names | "Profiles are updatable by owner or superadmins" (UPDATE/authenticated) · "Profiles are viewable by owner or superadmins" (SELECT/authenticated) · "Users can read their own role" (SELECT/authenticated) | ✅ EXACT |
| 3 | RLS enabled | both true | both true | ✅ |
| 4 | public functions | `handle_new_user`, `update_updated_at`, `rls_auto_enable` | `handle_new_user`, `rls_auto_enable` — **`update_updated_at` ABSENT** | ⛔ **DISCREPANCY** |
| 5 | RLS event trigger | rls_auto_enable's trigger present + enabled | **`ensure_rls`** on `ddl_command_end`, enabled ('O'/origin) — exact name captured; other 6 event triggers are Supabase-internal | ✅ (name = `ensure_rls`) |
| 6 | auth trigger | `on_auth_user_created` | `auth.users` AFTER INSERT `on_auth_user_created` | ✅ |
| 7 | app_role enum | superadmin, admin, member | exact match; all other enums are Supabase-internal (auth/storage/realtime); no unexpected custom enums | ✅ |

## The Discrepancy — `update_updated_at()` does not exist in the live database

- DATA_CONTRACT_PHASE_1 §3 (🔒 LOCKED) lists three starter-kit functions and says "Verify they exist after deployment."
- Manager §2 Verified Ground carries the same three as fact.
- **Live DB has two.** Corroborating disk evidence: `update_updated_at` appears in NO SQL on disk (`supabase/setup.sql`, `docs/setup.sql`, `docs/migration_add_profiles.sql` — grep clean). The function appears never to have existed in this project's lineage; the DATA_CONTRACT claim was inherited from starter-kit-v2 documentation, not this deployment. DB_BASELINE.md (BIM-000) is not contradicted — it recorded tables/policies only, never functions.
- **Why it matters:** Structural Law §6.5 attaches the `update_updated_at()` trigger to every one of the sixteen tables. The chain cannot attach a function that doesn't exist.

## Ruling requested (blocks 0001 authoring — nothing else)

- **(i) RECOMMENDED:** the chain creates it — `0001_baseline_acknowledge.sql` gains a `CREATE OR REPLACE FUNCTION update_updated_at() ... LANGUAGE plpgsql` (standard `NEW.updated_at = now()` trigger fn), with a divergence comment citing this X0 finding + ruling. 0001's assertion set asserts `handle_new_user` + `rls_auto_enable` + `ensure_rls` event trigger (as found), and creates-or-replaces `update_updated_at`. Idempotent, replayable, self-healing on scratch DBs (X1 needs the function on empty databases anyway — the bootstrap path must create it regardless).
- **(ii)** Director installs the function manually on live pre-chain; 0001 asserts all three. Weaker: scratch-from-zero (X1/AC2) still needs the chain to create it, so (ii) ends up needing (i)'s code anyway.

## Additional X0 capture (for 0001's assertion set)

- RLS event trigger's exact name is **`ensure_rls`** (not "rls_auto_enable") — 0001 asserts by this name.
- Baseline policies' cmd/roles captured above for BIM-002's future reference.
