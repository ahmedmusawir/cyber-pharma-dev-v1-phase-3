# ERRATUM — BIM-001-CYBER-PHARMA
**Dated:** 2026-08-28 · **Authored per Architect ruling** (X0 discrepancy, rider 2)

## E-1 — Manager §2 Verified Ground: starter-kit function row

**Manager says:** "Starter-kit functions present: `handle_new_user()`, `update_updated_at()`, `rls_auto_enable()`" (provenance DATA_CONTRACT_PHASE_1 §3).

**Disk/live truth (X0, 2026-08-28):** the live database has **two** of the three — `handle_new_user()` and `rls_auto_enable()` (whose event trigger is named **`ensure_rls`**). **`update_updated_at()` is absent from the live DB and from every SQL file in this project's lineage.** The DATA_CONTRACT §3 claim was inherited from starter-kit-v2 documentation, not from this deployment.

**Resolution (ruled):** `0001_baseline_acknowledge.sql` creates `update_updated_at()` via idempotent `CREATE OR REPLACE`, with a divergence comment citing `X0_EVIDENCE.md`. Corrected ground: **two live functions + one chain-created.**

## E-2 — DATA_CONTRACT_PHASE_1 §3 amendment (for the Director to stage)

§3's inventory ("The starter kit ships with three database functions. Verify they exist after deployment") needs an amendment in the canonical doc-repo copy: `update_updated_at()` was never deployed with this project; as of BIM-001 it is **created by migration 0001**, not shipped by the starter kit. The 🔒 LOCKED note should record 0001 as its provenance going forward. Staging that amendment is Director/Architect work in the doc repo — this erratum is the pointer.

## E-3 — Event-trigger name

Anywhere doctrine refers to the RLS auto-enable event trigger by the function's name: the trigger's real name is **`ensure_rls`** (calling function `rls_auto_enable()`). 0001 asserts by trigger name `ensure_rls` per rider 1.
