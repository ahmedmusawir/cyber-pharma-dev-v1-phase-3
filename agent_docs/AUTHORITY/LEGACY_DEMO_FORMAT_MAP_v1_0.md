# LEGACY DEMO FORMAT MAP (v1.0)
## The First-OwedBook Supabase — Structure, Conventions, and What Transfers

**Project:** Cyber Pharma v1 · **Source:** legacy demo Supabase (QR Project instance), `pharma_*` tables
**Version:** 1.0 — 2026-08-10 · **Author:** JARVIS (Architect)
**Provenance:** operator-run catalog queries, 2026-08-10; row counts + full column dump
**Purpose:** (1) format intelligence for Phase 3 seed design; (2) golden-dataset preview ahead of Frank's export; (3) mapping to the fifteen-table target schema. **Schema authority remains FRANK_API (Triangulation ruling) — this document is informational.**

---

## 1. The Six Pharma Tables (what they are)

| Legacy table | Rows | Identity | Target-schema successor |
|---|---|---|---|
| `pharma_user_data` | 7,427 | **The claims table** (Frank's real demo export, date-shifted for Phase 2 mocks) | `user_data` |
| `pharma_baseline` | 20,295 | **The AAC reference** (ndc → aac price, effective-dated) | `aac_reference` |
| `pharma_alt_rates` | 38,869 | **The WAC reference** — see Finding 1 | `wac_reference` |
| `pharma_pbm_info` | 257 | PBM directory **subset** (BIN-only matching) | `pbm_info` (FRANK_API full shape) |
| `pharma_pharmacy_members` | 1 | The junction (three-noun precursor) | `user_businesses` |
| `pharma_pharmacy_profile` | 1 | Pharmacy identity — the table sentenced to death (HIPAA hole) | `businesses` (fields migrate; table dies) |
| `pharma_report_files` | 699 | Per-script PDF registry | Phase 6 `pharma_reports` Storage + `send_log` |

---

## 2. Three Findings

**FINDING 1 — "alt_rates" mystery SOLVED: it is the WAC table.** Columns: `ndc, wac, pkg_size, pkg_size_mult, generic_indicator` — exactly the inputs of the MATH_SPEC WAC-derive formula (`(wac × 0.96) / (pkg_size × pkg_size_mult)`), including the `generic_indicator` column at the heart of divergences F-4/F-5 (brand-vs-generic authority). The desktop's "ALT_RATES_CLEANUP" archaeology likely renamed/restructured this concept later; in the demo era, alt-rates = WAC reference, fully alive at 38,869 rows. **Ledger question for Frank downgraded to trivia.**

**FINDING 2 — The demo claims table is radically simpler than the desktop's reality.** `pharma_user_data` carries NO pcn, NO group field, NO payment (check-payments) column, NO expected_paid / difference / owed, NO medicaid_rate / medicaid_method. Meaning: (a) the demo matched PBMs on **BIN alone** — sidestepping the desktop's two-algorithm matching mess entirely; (b) owed math was computed on the fly or upstream, not stored. **Consequence:** the demo shape is a *subset preview* of the golden dataset, not its equal. Frank's desktop export WILL carry more columns — and we should explicitly ask that it include **BIN + PCN + group** (the pbm_key inputs) or Phase 5's matching can't be validated against it.

**FINDING 3 — The demo export was already de-identified.** No patient name, DOB, address, phone, or member-ID columns exist anywhere in the claims table. Frank's demo-era export practice already stripped identity — which bodes well for the golden dataset arriving lean, and confirms the parity math needs nothing patient-shaped (drugs, dates, dollars, routing codes only).

---

## 3. Format Conventions To Imitate (seed generator + import contract)

- **NDC as `text`** (preserves leading zeros — correct; the Excel zero-death trap avoided). *Verify by eyeball: 10 vs 11-digit convention and hyphenation in actual values — one SELECT of 20 sample NDCs settles it.*
- **Money as `numeric`** — the demo got the money-type law right; target schema continues it.
- **`script` (rx number) as `text`, the de-facto claim key** — pairs with `pharmacy_id` for uniqueness; informs (but does not decide) the Phase 5 natural-key ruling (Liberty's fields decide, per Proto 04).
- **`bin` as `text`** — apostrophe-contamination and zero-strip lessons (MATH_SPEC doc 04) apply at import time.
- **`status` as free `text`** — target schema upgrades this to the constrained Phase-5/6 workflow enum. *Eyeball the live vocabulary: expect the five Phase-2 chips (new / underpaid / pending / emailed_pbm / recovered).*
- **`bg` (baseline) vs `generic_indicator` (alt_rates)** — two names for brand/generic in one database; target schema picks ONE name and one authority (Frank's Q-04 ruling).
- **Tenant scoping via `pharmacy_id uuid` on every data table** — the RLS pattern's precursor; target renames to `business_id`.
- **`effective_date` on AAC** — the as-of-dispense-date join key; target schema extends the pattern to all reference tables (append-only + vintage stamp per v2.0 §6).
- **Junction `role` as free text** — target moves to server-controlled `user_roles` + junction role per Gap-6 ruling.

## 4. What The Target Schema Adds That The Demo Never Had

pcn + group fields on claims · check-payments concept (`payment` sum) · stored computation columns (expected_paid, difference, owed, medicaid_rate, medicaid_method as constrained vocabulary) · **reference-provenance/vintage columns** · pcn/state/pbm_key/matching_type on pbm_info (FRANK_API full shape, `matching_type NOT NULL`) · audit logging · per-state config keys · created_at/updated_at everywhere (demo has them on only 3 of 7 tables).

## 5. Actions

1. **Seed generator (Phase 3):** imitate §3 conventions; source claim rows from this database (already de-identified, real-shaped); extend with the §4 columns per the DATA_CONTRACT.
2. **Golden-dataset ask (rider on next Frank touch):** include BIN + PCN + group columns in the export (Finding 2).
3. **Two eyeball checks (operator, 2 min):** sample NDC formats; live status vocabulary. Paste results into this doc as v1.1.
4. **Security hygiene:** legacy instance holds real-derived claims with some tables UNRESTRICTED — confirm the project is not publicly exposed; treat with PHI-grade caution regardless of age.

---

🥄 *Stark Industries — the demo was the sketch, the desktop is the sprawl, and the target schema is the synthesis. Imitate the conventions, add the missing organs, and the seed feels like Frank's book from day one.*
