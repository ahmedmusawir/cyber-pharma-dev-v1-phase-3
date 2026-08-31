# BIM-001 — X0 VERDICT: CLOSED WITH ONE DISCREPANCY (STOP FIRED)
**Date:** 2026-08-28 15:41 · Full diff table: `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/X0_EVIDENCE.md`

⛔ **X0 CLOSED WITH ONE DISCREPANCY — STOP condition fired, per the manager's gate law.**

**Six of seven checks are EXACT matches:**

- Tables: exactly `profiles` + `user_roles` ✓
- Policies: all 3, byte-faithful to DB_BASELINE.md ✓
- RLS enabled on both ✓ · `on_auth_user_created` ✓ · `app_role` enum exact ✓
- RLS event trigger present and enabled — with a capture worth having: its real name is **`ensure_rls`** (the *function* is `rls_auto_enable()`), so 0001 will assert by that name.

**The discrepancy: `update_updated_at()` does not exist in the live database.** DATA_CONTRACT §3 (LOCKED) and the manager's Verified Ground both claim three starter-kit functions; the live DB has two. Disk corroborates — that function appears in no SQL file anywhere in this project's lineage. The claim was inherited from starter-kit-v2 docs, not this deployment. And it matters: Structural Law §6.5 hangs the `update_updated_at()` trigger on **all sixteen tables** — the chain can't attach a function that isn't there.

**Ruling requested (blocks 0001 only):**

- **(i) RECOMMENDED — the chain creates it:** `0001_baseline_acknowledge.sql` gains an idempotent `CREATE OR REPLACE FUNCTION update_updated_at()` with a divergence comment citing this X0 finding. X1/AC2 (scratch-from-zero) needs this code path *regardless* — an empty database has none of the three functions, so the bootstrap path must be able to create it anyway. Option (i) makes the chain self-sufficient.
- **(ii)** Director installs it manually on live pre-chain — weaker, since (i)'s code ends up required for scratch runs anyway.

**Holding for:** the (i)/(ii) ruling + scratch and baseline-replica DB URLs (X1–X4). Zero migration files authored.

---

*Also recorded this session (context for this verdict):*
- **ARCHITECT RULING — medicaid_method:** Option (a) RATIFIED — NULLable column, `CHECK (medicaid_method IN ('AAC','FUL','GWAC','BWAC','Take Action','Manual Override','Legacy'))`, `''`→NULL. Riders: importer mapping documented in 0013 / implemented in BIM-004; 'Portal' stays excluded (AC10 amendment path only); divergence comment cites the ruling.
- X0 catalog was Director-executed in the dashboard SQL editor (read-only), output pasted verbatim — the Gate-Q-precedent hands pattern.
