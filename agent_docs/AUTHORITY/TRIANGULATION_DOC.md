# TRIANGULATION_DOC.md — Frank Pharmacy SaaS v1

> **Phase 0 IGNITION — Architect's Synthesis Document**
>
> **Author:** Architect Agent (Claude) for Tony Stark
> **Date:** 2026-05-02
> **Status:** DRAFT — for Tony's review
> **Purpose:** Synthesize the four IGNITION corpora into a single source-of-truth map. Resolve smells in context. Surface decision points. Hand the resolved synthesis to the MASTER_APP_BRIEF.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Four Corpora at a Glance](#2-the-four-corpora-at-a-glance)
3. [Schema Synthesis](#3-schema-synthesis)
4. [Feature Surface Synthesis](#4-feature-surface-synthesis)
5. [Auth & RBAC Synthesis](#5-auth--rbac-synthesis)
6. [External Integrations Synthesis](#6-external-integrations-synthesis)
7. [Business Logic Synthesis](#7-business-logic-synthesis)
8. [Storage & File Pipelines Synthesis](#8-storage--file-pipelines-synthesis)
9. [Open Questions for Frank](#9-open-questions-for-frank)
10. [Cosmetic Cleanup Checklist](#10-cosmetic-cleanup-checklist-appendix)

---

## 1. Executive Summary

The Frank Pharmacy SaaS v1 rebuild has **three working systems to learn from** plus **two strategic documents** that govern scope. Together they form four corpora:

- **FRANK_DESKTOP** — 13,200-line Tkinter monolith. The reality: what 40 paying customers actually use today. Source of truth for the OwedBook math, the BIN 004146 edge case, and the import workflow.
- **FRANK_API** — Flask + Cloud SQL backend serving the desktop. 22.5K lines, 130 routes across 13 blueprints. Source of truth for the canonical SQLAlchemy schema, multi-tenant isolation pattern, Stripe + GHL + Liberty integration contracts, and 17 documented HIPAA gaps.
- **TONY_DEMO** — Next.js 15 + Supabase reverse-engineered demo. ~9,200 LOC. The UX path Coach is currently vibing on. Inferred clean target: Supabase Auth + RLS + Storage replaces 80% of the Flask API.
- **Mother Ship CSV + Meeting Notes 2026-03-19** — Strategic context. Defines what v1 IS (replace Frank's desktop, sell to other pharmacies) and IS NOT (the full 13-tier Mother Ship vision is multi-year).

The synthesis below maps every screen, table, integration, and business rule across these corpora. Each section ends with **Resolution** — the decision the rebuild's MASTER_APP_BRIEF will inherit, with evidence cited.

The rebuild is a **Next.js 15 + Supabase web SaaS, HIPAA-ready, multi-tenant by store (`business_id`), per-store Stripe subscription**. v1 ships the OwedBook + reference data ingestion + report generation + multi-store admin + billing. Out of scope: every other Mother Ship tier (filed for Phase 2+).

---

## 2. The Four Corpora at a Glance

| Corpus | Source | Type | What It Tells Us | What It Doesn't Tell Us |
|---|---|---|---|---|
| **FRANK_DESKTOP** | `pharmacybooks-desktop-main` | Python/Tkinter monolith, 13.2K LOC | The real workflow Frank's 40 users follow. Selenium scraper for AL Medicaid. Local SQLite cache. The math behind the Owed Book. BIN 004146 special-case logic. | Server-side truth (lives in FRANK_API). UX best practices (it's a desktop app from a different decade). |
| **FRANK_API** | `pharmacybooks-api-main` | Flask + Cloud SQL, 22.5K LOC | The canonical schema (16 tables in `models.py`). The integration surface (Stripe, GHL, Liberty). Multi-tenant isolation pattern (`business_id` filter on every query). The 17 HIPAA gaps. | What the user sees. What the actual UX looks like. |
| **TONY_DEMO** | `cyber-pharma-demo-for-frank` | Next.js 15 + Supabase, 9.2K LOC | The target stack working end-to-end. RLS-as-isolation pattern. Three Supabase clients (browser/server/admin). PDF + email pipelines. The OwedBook UI as inherited shape. | Real schema (no migrations committed). Stripe integration (absent — confirmed GAP). Production-grade security posture. |
| **Mother Ship + Meeting Notes** | Strategy docs | Business context | What v1 IS: Replace the desktop. Sell subscriptions. Get to 100+ pharmacies fast. JV at 60/40. APA discount $20/mo off. What v1 ISN'T: The 13-tier Mother Ship is multi-year. | Implementation specifics. Pricing math. Onboarding details (Frank to clarify). |

**Scope filter for this triangulation:** v1 IS the OwedBook product (Mother Ship Tier 1: Reimbursement Monitoring, free, the entry hook). Everything else is parked for Phase 2+. The triangulation is bounded by this scope.

---

## 3. Schema Synthesis

The most consequential triangulation. Three sources speak to schema:

- **FRANK_API `models.py`** — 16 tables, fully declared with constraints, indexes, FKs. **This is canonical.**
- **TONY_DEMO inline `from()` calls** — 6 `pharma_*` tables reverse-engineered from query usage. Schema lives outside repo.
- **FRANK_DESKTOP `helpers/sqlite_db_helper.py`** — local cache schema (9 tables, mirror of API).

### 3.1 Tenant Spine

| Concept | FRANK_API (`models.py`) | TONY_DEMO (inferred) | FRANK_DESKTOP | Resolution for Rebuild |
|---|---|---|---|---|
| Pharmacy entity | `businesses` (composite UK on `ncpdp+npi`, `id` PK, lifecycle `pending→active→suspended`, Stripe fields embedded) | `pharma_pharmacy_profile` (PK `pharmacy_id`, `pharmacy_slug` for Storage paths) | `profile` table (single-tenant, no `business_id`) | **Adopt FRANK_API's `businesses` table verbatim.** It's the proven shape. Add `pharmacy_slug` column from TONY_DEMO for Storage path use. Composite UK `(ncpdp, npi)` is correct — pharmacies are uniquely identified by their NCPDP+NPI in the real world. |
| User entity | `users` (`username` UNIQUE, `email` UNIQUE indexed, `is_admin` Boolean, `is_super_admin` Boolean, `business_id` FK nullable for super-admins) | Supabase `auth.users` only. Roles in `user_metadata` (CRITICAL flaw — see §5) | `local_desktop_users` (per-business desktop login) | **Use Supabase `auth.users` as identity layer.** Move role flags to a server-controlled `user_roles` table OR `app_metadata`. **Never use `user_metadata` for roles** (TONY_DEMO confirms this is client-mutable). Keep `username` UNIQUE for backwards compat with desktop import path. |
| User ↔ Pharmacy relationship | `user_businesses` (junction, role `'admin'\|'user'` per business, `is_primary` for default-pharmacy UX) | `pharma_pharmacy_members` (`user_id`, `pharmacy_id` — minimal) | (none — desktop is single-tenant) | **Adopt FRANK_API's `user_businesses` shape.** It already supports Frank's 7-store reality + the multi-pharmacy admin pattern Tony's billing model needs. Per-business role + is_primary are real product requirements. |

**EVIDENCE TRAIL:**
- `FRANK_API_02-ARCHITECTURE-MAP.md` — `businesses` model at `models.py:13-183`, `users` at `:185-303`, `user_businesses` at `:306-351`
- `TONY_DEMO_05-CONTEXT-AND-MEMORY.md` — `pharma_pharmacy_profile` columns (`pharmacy_id`, `pharmacy_slug`) at `api/reports/save/route.ts:138-145`
- `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md` — confirms `user_metadata`-based roles are client-mutable

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 #S30 (two `AdminSidebar` components) — irrelevant to schema, deferred to §10
- FRANK_API `pharmacy_profile` legacy single-tenant table — **DROP entirely from rebuild.** It's a known HIPAA gap (PUBLIC mass-assignment endpoint, see `FRANK_API_07-GUARDRAILS-AND-SANDBOXING.md` GAP). Replaced by `businesses` + per-pharmacy profile fields.

---

### 3.2 PHI / Fact Table

The OwedBook fact table — the one that holds prescription-level reimbursement data.

| Aspect | FRANK_API `user_data` | TONY_DEMO `pharma_user_data` | FRANK_DESKTOP `user_data` | Resolution |
|---|---|---|---|---|
| Multi-tenant column | `business_id` FK NOT NULL, indexed. Comment at `models.py:672`: *"Multi-tenant foreign key - REQUIRED for data isolation. Never accept business_id from client; always derive from authenticated session."* | `pharmacy_id` (no NOT NULL constraint visible — but RLS presumed to enforce) | **None** — single-tenant, local SQLite per install | **Adopt FRANK_API's pattern: `business_id` FK, NOT NULL, indexed. RLS policy: `business_id IN (SELECT business_id FROM user_businesses WHERE user_id = auth.uid())`. Override every mutation with `record.business_id = user.business_id` server-side.** |
| Column count | ~40 columns (full enrichment: `medicaid_rate`, `acq`, `acq_net`, `expected_paid`, `new_owed`, `aac_date_used`, `wac_date_used`, `ful_year_used`, `rate_source`, ...) | ~11 columns referenced (`script`, `pharmacy_id`, `date_dispensed`, `drug_ndc`, `drug_name`, `qty`, `total_paid`, `new_paid`, `bin`, `pdf_file`, `status`) | Mirrors FRANK_API minus a few server-side audit fields | **Use FRANK_API's column set as canonical.** The demo's 11 columns are a subset — the rebuild needs the full audit trail (rate_source, *_date_used) for HIPAA-grade audit logs and for the future "verify rate" feature visible in FRANK_DESKTOP. |
| Encryption at rest | NOT IMPLEMENTED — `FRANK_API_07` GAP confirms no column-level encryption on PHI. Cloud SQL platform-level encryption only. | NOT IMPLEMENTED — Supabase platform-level only. | NOT IMPLEMENTED. | **Phase 8 decision (HIPAA hardening), not Phase 0.** v1 relies on Supabase HIPAA add-on (BAA + platform encryption). Column-level encryption deferred. Documented gap. |

**EVIDENCE TRAIL:**
- `FRANK_API_02-ARCHITECTURE-MAP.md` — full `user_data` schema at `models.py:661-735`
- `TONY_DEMO_05-CONTEXT-AND-MEMORY.md` — reconstructed columns at `api/user-data/route.ts:17-29`
- `FRANK_DESKTOP_05-CONTEXT-AND-MEMORY.md` — local mirror at `helpers/sqlite_db_helper.py`

**🎯 STRATEGIC DISCOVERY (distributed per Way B):** The TONY_DEMO schema is the most incomplete corpus. **This is by design** — it was reverse-engineered, not declared. The rebuild's `DATA_CONTRACT.md` MUST cite FRANK_API `models.py` as canonical and treat TONY_DEMO inferences as INFORMATIONAL ONLY. *Building from the demo's column set would lose audit trail capability that Frank's existing customers depend on.*

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 #S31 (`pharma_user_data.pdf_file` writer trail) — single writer at `api/reports/email/route.ts:100`. **Keep the column, document it as the email-pipeline-only audit field, ensure new write path doesn't drift from this convention.**

---

### 3.3 Reference Data Tables

Pricing and PBM lookup data — refreshed monthly from external sources.

| Table (canonical name) | FRANK_API | TONY_DEMO | FRANK_DESKTOP | Resolution |
|---|---|---|---|---|
| `aac_reference` (Actual Acquisition Cost by NDC) | UK on `(ndc, aac_date)`. Loaded via Cloud Function `aac_import_trigger`. | `pharma_baseline` (cols: `ndc`, `aac`, `drug_name`) | `aac_reference` (NDC + week key) | **Keep FRANK_API name `aac_reference` and shape.** Drop the demo's `pharma_baseline` name — it's confusing. Schedule via Supabase Edge Function or GitHub Action (Phase 4). |
| `wac_reference` (Wholesale Acquisition Cost) | UK on `(ndc, effective_date)`. **Has a `Computed` column `wac_by_unit` with persisted SQL** — possible PostgreSQL/MySQL portability issue. | `pharma_alt_rates` (cols: `ndc`, `wac`, `pkg_size`, `pkg_size_mult`, `generic_indicator`) | `wac_reference` | **Keep FRANK_API name `wac_reference`, but flatten the `Computed` column into application-side derivation.** Supabase Postgres supports `GENERATED` columns, but cross-driver portability burned the Flask API (see `FRANK_API_09-TESTS-AND-EVALS.md` GAP — no MySQL/PG cross-driver tests). The demo's `pkg_size`/`pkg_size_mult`/`generic_indicator` columns are NEW and necessary for the brand-vs-generic AAC formula (see §7). **Adopt them.** |
| `ful_reference` (Federal Upper Limit) | UK on `(ndc, year, month)`. Loaded via Cloud Function chain (scheduler → tasks → worker). | (not present in demo — confirmed GAP) | `ful_reference` | **Keep FRANK_API shape.** Schedule pull via Supabase Edge Function (Phase 4). Source URL: Frank to provide (Open Question). |
| `pbm_info` (PBM directory by BIN) | Columns: `bin`, `pbm_name`, `pcn`, `state`, `email`. | `pharma_pbm_info` (cols: `bin`, `pbm_name`, `email` — subset) | `pbm_info` (full canonical match per `pbm_key`) | **Adopt FRANK_API's full column set.** The demo missed `pcn` and `state` — both are needed for accurate matching. **Critical:** include `pbm_key` derived/canonical column from FRANK_DESKTOP's matching logic (see §7 BIN 004146). |
| `pbm_key` (canonical match key) | Stored on both `user_data` and `pbm_info` per `helpers/pbm_utils.py` | (not surfaced in demo) | Format: `{bin}-{pcn}-{group_field}` lowercase, leading zeros stripped, **except BIN 004146 → `'4146'` BIN-only match** | **🎯 STRATEGIC DISCOVERY (distributed):** This is the BIN 004146 edge case from FRANK_DESKTOP. ~12 helper scripts and 7+ markdown summaries in the desktop repo testify to this being a **real, recurring matching problem**. The rebuild MUST include this normalization in a Postgres function or Edge Function — porting the desktop's logic verbatim. *Skipping this would silently corrupt matches for one of Frank's largest PBM populations.* |
| `apa_memberships` (Alabama Pharmacy Association) | UK on `license_number`. Drives APA20 promo discount eligibility. | (not present) | (not present) | **Adopt FRANK_API verbatim.** Per Meeting Notes: APA members get $20/mo off. This is real revenue logic that must move forward. |

**EVIDENCE TRAIL:**
- `FRANK_API_02-ARCHITECTURE-MAP.md` — `wac_reference` at `models.py:737-775`, `ful_reference` at `:778-799`, `aac_reference` at `:865-883`, `pbm_info` at `:851-863`, `apa_memberships` at `:573-636`
- `TONY_DEMO_05-CONTEXT-AND-MEMORY.md` — reconstructed `pharma_baseline`, `pharma_alt_rates`, `pharma_pbm_info`
- `FRANK_DESKTOP_02-ARCHITECTURE-MAP.md` — `pbm_key` canonical matching per `helpers/pbm_utils.py`, BIN 004146 special case

**SMELLS RESOLVED:**
- FRANK_API `wac_reference.wac_by_unit` Computed column — **Decision: drop the SQL-level computed column, derive at query time in the rebuild.** Avoids the dual-driver portability surface that hurt FRANK_API.

---

### 3.4 Audit Log

| Aspect | FRANK_API `audit_logs` | TONY_DEMO | FRANK_DESKTOP `edit_history` | Resolution |
|---|---|---|---|---|
| Existence | YES — full HIPAA audit trail. Per-row PHI access NOT logged (gap), but mutations logged. | NO — confirmed GAP. No audit log table. | YES — local `edit_history` for field-level edits | **Adopt FRANK_API's `audit_logs` schema verbatim.** The demo's GAP is a major HIPAA blocker. v1 must ship with audit logging from Day 1. |
| Auto-population | Via `models.py:998-1271` event listeners on `Business` mutations + manual logging in webhook handlers + `dashboard.py` field changes | N/A | Per-edit manual logging | **Use Supabase database triggers OR application-layer logging via service layer.** Per Cyberize doctrine (`API_AND_SERVICES_MANUAL.md`), the service layer is the right place — tighter control, easier testing. |
| `record_id` type | `String(128)` — accommodates both numeric IDs and Stripe `cs_test_*` strings | N/A | Numeric only | **Keep `String(128)`.** It's a small space cost for a much larger compatibility win. |

**🎯 STRATEGIC DISCOVERY (distributed):** FRANK_API's audit log is documented as covering "all PHI access" but the extraction CONFIRMED this is **CONTRADICTED** — `UserData` reads/writes are NOT in `audit_logs` unless via webhook flows (`FRANK_API_07-GUARDRAILS-AND-SANDBOXING.md`). *The HIPAA compliance checklist's "all PHI access logged" item is aspirational, not actual.* **Rebuild must close this gap.** Every read of `user_data` rows by an authenticated user must produce an audit log entry. This is non-negotiable for HIPAA.

---

### 3.5 Subscriptions Schema (per-store billing)

| Aspect | FRANK_API | TONY_DEMO | StarkReads Subscription Playbook | Resolution |
|---|---|---|---|---|
| Subscription state location | Embedded in `businesses` table (`stripe_customer_id`, `stripe_subscription_id`, `stripe_checkout_session_id`, `subscription_status`, `trial_end_date`, `current_period_end`, `cancel_at_period_end`, `has_used_trial`, `promotion_code`) | Absent (Stripe not integrated in demo — GAP) | Recommends a separate `subscriptions` table that joins to user OR org via FK | **HYBRID: Use a separate `subscriptions` table per StarkReads pattern, BUT join to `business_id` not `user_id`.** Per Tony's call (mission briefing message 2026-05-01): one Stripe Subscription per Store, one Admin manages all. The `subscriptions` table holds Stripe state; `businesses` has a 1:1 reference back. This decouples billing state from tenant identity (clean) but supports Frank's 7-store reality. |
| Trial logic | `has_used_trial` Boolean on `businesses` — enforces "single trial per NCPDP+NPI" | Absent | Trial period via `subscription_data.trial_period_days` on Checkout Session | **Adopt FRANK_API's `has_used_trial` flag.** Keep the "one trial per NCPDP+NPI" rule — it's a real anti-abuse measure. Implement per StarkReads playbook. |
| APA discount handling | `APAMembership` table + `discount_redeemed` flag + `SELECT FOR UPDATE` row lock during webhook | Absent | Standard Stripe Promotion Code | **Adopt FRANK_API's APA mechanism, simplified.** Use Stripe Promotion Codes + the `APAMembership.discount_redeemed` flag. The `SELECT FOR UPDATE` lock pattern is correct — port it. |

**EVIDENCE TRAIL:**
- `FRANK_API_02-ARCHITECTURE-MAP.md` — `businesses` Stripe fields at `models.py:13-183`, `apa_memberships` at `:573-636`
- `STRIPE_SUBSCRIPTIONS_PLAYBOOK.md` Section 3 — Supabase schema recipe; Section 14 — multi-tenant subscriptions roadmap (matches Tony's per-store plan)

**🎯 STRATEGIC DISCOVERY (distributed):** Tony's StarkReads Subscription Playbook §14 explicitly calls out "Multi-Tenant Subscriptions (Mothership)" as a future enhancement: *"Subscription attaches to an organization, not a user."* **The Frank rebuild IS that future enhancement.** This is the first project where the playbook's roadmap item becomes a production requirement. The rebuild's Stripe phase will produce a v2 of the playbook covering the org-scoped pattern. *Strategic value: factory IP grows from this project.*

---

### 3.6 Schema Resolution Summary

The rebuild ships with **15 tables** in v1:

| # | Table | Source pattern | Notes |
|---|---|---|---|
| 1 | `businesses` | FRANK_API | Tenant spine. Add `pharmacy_slug` column. Drop legacy `pharmacy_profile` table entirely. |
| 2 | `users` | Supabase `auth.users` (managed) | DO NOT shadow with custom `users` table. Use Supabase Auth as is. |
| 3 | `user_roles` | NEW — Cyberize doctrine | Server-controlled roles. Replaces `user_metadata` flags. (See §5) |
| 4 | `user_businesses` | FRANK_API | Junction with role + is_primary. Multi-store admin support. |
| 5 | `pending_registrations` | FRANK_API | Optional — only if onboarding requires manual approval. Frank to confirm. |
| 6 | `subscriptions` | StarkReads pattern + per-store FK | Stripe state mirror, joined to `business_id`. |
| 7 | `apa_memberships` | FRANK_API | $20/mo APA discount logic. |
| 8 | `user_data` | FRANK_API (full column set) | The PHI fact table. RLS-scoped by `business_id`. |
| 9 | `report_files` | FRANK_API | PDF report metadata. Storage path lives in Supabase Storage. |
| 10 | `aac_reference` | FRANK_API | Refreshed monthly via Edge Function. |
| 11 | `wac_reference` | FRANK_API + TONY_DEMO additions (`pkg_size`, `pkg_size_mult`, `generic_indicator`) | Computed `wac_by_unit` dropped — derive in app. |
| 12 | `ful_reference` | FRANK_API | Federal Upper Limit. |
| 13 | `pbm_info` | FRANK_API | PBM directory + canonical `pbm_key` column. BIN 004146 logic in derivation. |
| 14 | `audit_logs` | FRANK_API | Full HIPAA audit trail. Trigger-based. |
| 15 | `reference_dataset_versions` | FRANK_API | Checksum + row count per reference dataset for change detection. |

**Out of v1 scope (deferred):**
- `desktop_client_versions` — not needed if no desktop client. Defer.
- `local_desktop_users` — same. Defer.
- `password_reset_tokens` — Supabase Auth handles this natively. Drop FRANK_API's custom table.

---

## 4. Feature Surface Synthesis

Every screen in the v1 rebuild × where it came from × what it does.

### 4.1 The OwedBook (Hero Feature) — `/admin-portal`

**Inherited from:** TONY_DEMO `(admin)/admin-portal/AdminPortalContent.tsx` (748 LOC) + FRANK_DESKTOP `OpportunitiesDashboard` + `pharmacybooks.py:9339` `show_dashboard("Owed Book")` handler.

**Surface (per TONY_DEMO_04 + screenshots):**
- 4 KPI pills (sticky header): Commercial Underpaid, Commercial Scripts, Updated Difference, Owed
- 4 tabs: Commercial Dollars, Updated Commercial Payments, Federal Dollars, Summary
- Filter sidebar (left): date range, PBM dropdown, Filter (All/specific PBMs), Upload Data, Get Fresh Data, Clear Filters, Apply
- Per-row actions: per-script PDF generation, "emailed PBM" status

**Resolution:**

**Adopt the demo's UI shape verbatim.** It's a working, deployed, Coach-vibed surface. The 4-tab + 4-pill pattern is already proven UX. Don't re-invent.

**Replace the demo's data plumbing with proper service layer per Cyberize doctrine** (`API_AND_SERVICES_MANUAL.md` Section 1: *"Components render. Services fetch."*). The demo's bypass — `useUserDataStore.fetchUserData()` → direct `fetch('/api/user-data')` — is documented technical debt by the demo's own comment at `AdminPortalContent.tsx:12`: *"// Removed ClaimsServices - using Zustand store only."* **Rebuild restores `ClaimsServices` as the canonical service.**

**Adopt FRANK_DESKTOP's math** (see §7) — the demo's KPI calculations are oversimplified; the desktop's `ReimbursementComparer` (6,156 LOC) holds the production-grade logic.

**🎯 STRATEGIC DISCOVERY (distributed):** The demo's `AdminPortalContent.tsx` is 748 LOC of single-component logic. **Acceptable for a demo, NOT acceptable for v1.** Rebuild decomposes into:
- `<OwedBookHeader />` (KPI pills)
- `<OwedBookFilters />` (sidebar, with `useFiltersStore`)
- `<OwedBookTabs />` (tab switcher)
- `<CommercialDollarsTable />`, `<UpdatedPaymentsTable />`, `<FederalDollarsTable />`, `<SummaryTable />` (per-tab)
- `<PaginationControls />`, `<ReportActions />` (shared)

This is normal Cyberize component decomposition (`APP_ARCHITECTURE_MANUAL.md` patterns).

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 #S15 (748 LOC component) — decomposed in rebuild
- TONY_DEMO Doc 10 #S16 (`limit=10000` fetch with no progress UI) — **rebuild uses server-side pagination + filter pushdown.** The demo fetches 10K rows + filters client-side, which won't scale past ~50K-row pharmacies.
- TONY_DEMO Doc 10 #S34 (`skipFilters=true` query param sent but not honored) — symptom of #S16. Both go away when filters move server-side.
- TONY_DEMO Doc 10 #S35 (`ALLOWED_SORT_KEYS` defined but never enforced) — rebuild enforces sort key allowlist server-side to prevent SQL injection vector.

### 4.2 Filter Sidebar

**Inherited from:** TONY_DEMO `components/admin/FiltersPanel.tsx` + `FiltersDrawerContext.tsx`.

**Resolution:**

Adopt the visual layout. Replace the state-management shape:
- Demo uses Zustand-only filter state (`useUserDataStore.filters`)
- Rebuild uses **URL search params for shareable/bookmarkable filtered views** + Zustand for transient form state. This is per Cyberize `STATE_MANAGEMENT_MANUAL.md` patterns. Frank's pharmacists send each other links to specific filtered views — URL state matters.

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 #S29 (`dashboard/sidebar/README.md` "Phase 1 placeholder") — **Drop the placeholder folder entirely.** The demo's intended refactor never happened. Active filters live in `components/admin/FiltersPanel.tsx`. Rebuild doesn't carry the half-finished refactor.

### 4.3 Imports Workflow

**Inherited from:** FRANK_DESKTOP `data_importer.py` + `pharmacybooks.py:8657` `scan_import_folder()`. **TONY_DEMO has UI placeholder only — no implementation.**

**Surface:**
- "Upload Data" button (top of filter sidebar in TONY_DEMO)
- File picker → CSV/XLSX → server-side parse → enrichment via reference data → insert into `user_data`

**Resolution:**

**Port FRANK_DESKTOP's `data_importer.py` logic to a Supabase Edge Function.** The desktop's column mapping logic (`helpers/column_mapping_helper.py:49-83`) is non-trivial — it handles 4-5 different pharmacy software vendor formats. This is real domain logic worth preserving.

The Edge Function:
1. Receives file from authenticated user (Supabase Storage upload)
2. Detects format (column mapping)
3. Parses rows
4. Enriches each row against `aac_reference` / `wac_reference` / `pbm_info`
5. Inserts into `user_data` with `business_id` from auth context (NEVER from client)
6. Returns import summary + audit log entry

**🎯 STRATEGIC DISCOVERY (distributed):** Per Meeting Notes 2026-03-19, Frank stated "3-4 pharmacy software vendors cover 85% of the market." Frank's Action Item is to send those names. The rebuild's column mapping logic must support all 3-4 formats. *This is a v1 blocker — without it, customers can't onboard their existing data. Add to the Frank Question List.*

### 4.4 PDF Report Generation + Email

**Inherited from:** TONY_DEMO `server/reports/pdf.ts` + `/api/reports/save` + `/api/reports/email` + `/api/pbm-email`.

**Surface:**
- User clicks "Generate PDF" on a script row → POST `/api/reports/save` → server-side `pdfkit` generates PDF → uploaded to Supabase Storage `pharma_reports` bucket
- User clicks "Email PBM" → POST `/api/reports/email` → fetches PDFs from Storage → builds `.eml` via `mailcomposer` → updates `user_data.status = 'emailed'`

**Resolution:**

**Adopt the demo's pipeline shape — but fix the auth posture.** Per `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md`:
- `/api/reports/save` checks `auth.getUser()` — ✅ correct
- `/api/reports/email` does NOT check auth — ❌ HIPAA violation. **Rebuild requires auth on every report route.**

**Port to Supabase Edge Functions** for both routes (instead of Next.js API routes). Reasons:
1. Edge Functions have better cold-start characteristics for Storage-heavy operations
2. They run on Deno with explicit Node compat shim — keeps the Next.js side cleaner
3. Per Cyberize HIPAA strategy, all PHI-touching routes belong in the Supabase trust boundary

**🎯 STRATEGIC DISCOVERY (distributed):** Per Tony's mission strategy message 2026-05-01, *"reply-routing per pharmacy"* is on the Phase 6 roadmap and is *"never done before, prototype."* This is genuinely novel — we'll need a custom domain + SendGrid Inbound Parse webhook + a Postgres function that maps inbound `Reply-To` addresses back to `(business_id, user_data.id)` for audit logging. *Worth a dedicated SKILL artifact post-completion. Factory IP grows.*

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 (Open Question 5 in Doc 07) — `/api/reports/email` missing auth check. **Resolved: rebuild adds auth check.**
- TONY_DEMO Doc 10 (Open Question 6) — `noAuthDownload: true` escape hatch in `/api/reports/save`. **Resolved: drop the escape hatch entirely. No exceptions to auth on PHI download.**
- TONY_DEMO Doc 10 (separate from cited findings) — duplicate PBM email lookup (`/api/pbm-email` and inside `/api/reports/email`). **Consolidate to one Postgres function `get_pbm_email(bin)`. Both routes call it.**

### 4.5 Admin / Multi-Store Surface

**Inherited from:** TONY_DEMO `(superadmin)/superadmin-portal` (placeholder), FRANK_API `admin.py` (38 endpoints), Cyberize starter kit RBAC patterns.

**Resolution:**

v1 ships with **two admin tiers**:

1. **Pharmacy Admin** (per-store, role from `user_businesses.role = 'admin'`) — manages members of their pharmacy, views their pharmacy's data, manages billing for their pharmacy
2. **Super Admin** (`user_roles.is_super_admin`) — Cyberize internal — can see all pharmacies, override status, manually fix data, sync GHL

The rebuild's **Admin Portal** is a separate route group (`(admin)/...`) covering just the per-store admin. The **Superadmin Portal** is `(superadmin)/...` and is internal-only. Members access their own data via `(members)/...`.

**Per Tony's earlier call:** Stripe billing is per-store (one subscription per `business_id`), but one Admin user can manage all their stores via `user_businesses` junction. Frank himself is the canonical use case (7 stores, one login, one admin perspective showing 7 store cards each with their own subscription state).

**🎯 STRATEGIC DISCOVERY (distributed):** The demo's `(superadmin)/superadmin-portal` is a 10-line placeholder (per `TONY_DEMO_04-TOOL-SYSTEM.md`). FRANK_API has 38 endpoints in `admin.py` mostly for support/manual-intervention workflows. **Rebuild ports the most-used 5-8 of those endpoints in v1, defers the rest.** Frank to confirm which are actually used in practice (Open Question).

---

### 4.6 Routes That Don't Survive

A direct kill list. These routes exist in the demo and have NO place in v1:

| Route | Why It Dies | Source |
|---|---|---|
| `/template` | Dev-only scaffolding outside any role group, public | TONY_DEMO Doc 10 #S13 |
| `/(public)/old/` | Vestigial — "version history" snapshot | TONY_DEMO Doc 10 #S12 |
| `/(public)/demo/` | shadcn typography demo, Lorem ipsum content | TONY_DEMO_00 Open Q4 |
| `/api/auth/superadmin-add-user` | **CRITICAL SECURITY VECTOR** — see §5 | TONY_DEMO_07 main finding |
| `/api/auth/login` GET handler | Debug shim querying `posts` table (operator call-out 1) | TONY_DEMO_05 — `posts` orphan, `// Testing the route` annotation |
| `/api/auth/logout/route-1.ts` | Byte-identical duplicate, Next ignores | TONY_DEMO_02 inventory |

**🎯 STRATEGIC DISCOVERY (distributed):** TONY_DEMO surfaced the `posts` table query as scaffold residue from the QR starter template the demo was forked from. The `qr-next13-supabase-v1` package name in `package.json:2` confirms this. **The rebuild should NOT inherit ANYTHING from the QR-template lineage** — it's pharmacy domain only. Start the rebuild from your CURRENT `cyberbugs-nextjs-cloud-v1` starter kit (per `STARTER_PROJECT_OVERVIEW.md`), not from the demo repo.

---

## 5. Auth & RBAC Synthesis

The most security-consequential section. Three sources:

- **FRANK_API** — JWT cookie-based auth, `is_admin`/`is_super_admin` Boolean flags on `users` model, decorators (`@admin_required`, `@super_admin_required`) plus inline checks
- **TONY_DEMO** — Supabase Auth + cookie sessions, `user_metadata` Boolean flags (`is_qr_superadmin`, `is_qr_admin`, `is_qr_member`), `protectPage(allowedRoles)` server action
- **Cyberize Starter Kit** — same pattern as TONY_DEMO (it's the source — TONY_DEMO is a fork of `qr-next13-supabase-v1`)

### 5.1 Authentication

| Aspect | FRANK_API | TONY_DEMO | Resolution |
|---|---|---|---|
| Provider | Custom Flask-JWT-Extended + Authlib OAuth (Google, Microsoft) | Supabase Auth (`@supabase/ssr`) | **Supabase Auth.** Native Postgres integration, BAA-eligible (HIPAA add-on), built-in OAuth providers, native MFA support. Drop FRANK_API's custom JWT implementation entirely. |
| Cookie posture | `httpOnly=True`, `secure=True` in production, SameSite=Lax | `httpOnly: false` (required by `@supabase/ssr`), Secure based on URL protocol, SameSite=Lax | **Accept Supabase's `httpOnly: false` requirement.** It's a known limitation of the SSR pattern. Compensate with strong CSP header (see below). |
| MFA | `mfa_enabled` + `mfa_secret` columns exist; **MFA is NOT implemented** (per `FRANK_API_07-GUARDRAILS-AND-SANDBOXING.md`) | Not present | **Phase 8 (HIPAA hardening) task.** Use Supabase native MFA (TOTP). Schema is ready. |
| Session timeout | JWT 1-hour expiry per FRANK_API | Cookie-based, refresh via middleware | **Adopt Supabase pattern.** Middleware refreshes session on every request. 1-hour access token / 7-day refresh token is Supabase default; acceptable for HIPAA "automatic logoff" control. |

### 5.2 Authorization — The Critical Decisions

**🎯 CRITICAL STRATEGIC DISCOVERY (distributed but flagged):** TONY_DEMO surfaced two security findings that MUST be resolved before any code ships:

#### 5.2.1 The `/api/auth/superadmin-add-user` Self-Provisioning Vector

Per `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md`: *"`src/app/api/auth/superadmin-add-user/route.ts:1-22` is byte-identical to `src/app/api/auth/signup/route.ts:1-22`."* No role check. No admin client. Accepts arbitrary `user_metadata`. **Anyone with a JWT can call it and create a superadmin account.**

**Resolution:**
- **Delete the route entirely.** Superadmin provisioning happens via Supabase Dashboard (SQL or admin console) only.
- If superadmin self-service provisioning is genuinely needed, it gets a NEW route (different name, different file) using `createAdminClient()` and gated by both `protectPage(['superadmin'])` AND a check that the calling user has `is_super_admin = true` in `user_roles` table.

#### 5.2.2 Roles in `user_metadata` (Client-Mutable)

Per `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md`: roles are stored in `auth.users.user_metadata`. *"In a default Supabase setup, `user_metadata` can be set by the user themselves via `auth.updateUser({ data: { ... } })`."* A malicious user can self-promote.

**Resolution:**

**Move roles to a server-controlled location.** Two valid patterns:

**Pattern A — `user_roles` table** (recommended):
```sql
CREATE TABLE user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_super_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: only service-role can write. Authenticated users can read their own row.
```

Pharmacy-scoped roles stay in `user_businesses.role` (`'admin'` or `'user'`) — already correct.

**Pattern B — `app_metadata`** (Supabase-native alternative):
- Set via `auth.admin.updateUserById()` (service-role only, not callable by client)
- Read via `user.app_metadata.is_super_admin` in server code
- Same security guarantee, less custom code

**Recommended: Pattern A.** More explicit. Easier to query in RLS policies. Matches FRANK_API's `users.is_super_admin` shape — easier migration of existing super-admin accounts.

### 5.3 Authorization Architecture (final)

**Three orthogonal authorization checks:**

1. **`requireUser()`** — is there a logged-in user? (via Supabase `auth.getUser()`)
2. **`requireRole(scope, role)`** — for pharmacy-scoped: does the user have `role` in `user_businesses` for this `business_id`? For platform-level: is `is_super_admin = true` in `user_roles`?
3. **`requireSubscriptionTier(business_id, tier)`** — does the pharmacy have an active subscription at this tier? (per StarkReads playbook)

These compose. A page can require all three, or just one or two.

**Layout-level protection** (per Cyberize starter kit pattern):
```
src/app/
├── (public)/         # No protection
├── (auth)/           # No protection (login/signup live here)
├── (members)/        # requireUser + requireSubscriptionTier(...)
├── (admin)/          # requireUser + requireRole(business_id, 'admin')
└── (superadmin)/     # requireUser + requireRole(_, 'super_admin')
```

### 5.4 RLS at Database Level

**🎯 STRATEGIC DISCOVERY (distributed):** Per `FRANK_API_07-GUARDRAILS-AND-SANDBOXING.md`: *"No SQL row-level security (RLS). Multi-tenant isolation is application-enforced via `business_id` filters. **A bug in any route — or a SQL access path that bypasses application logic — leaks tenant data.**"* The same doc notes: *"GAP for migration: Supabase has built-in PostgreSQL RLS. A migration could shift tenant isolation from application-layer to DB-layer, materially reducing the cross-tenant leak surface. **The current schema is RLS-friendly: every business-owned table has `business_id`.**"*

**This is the single biggest architectural win the rebuild can claim over the legacy.** RLS at the Postgres level + Supabase Auth means **even a buggy API route cannot leak cross-tenant data**. The rebuild ships with RLS policies on every PHI-bearing table, on Day 1.

Sample policy shape:
```sql
CREATE POLICY "users_see_own_pharmacies_data" ON user_data
  FOR ALL TO authenticated
  USING (
    business_id IN (
      SELECT business_id FROM user_businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "super_admins_see_all" ON user_data
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND is_super_admin)
  );
```

### 5.5 Browser Security Headers

Per `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md`: *"GAP — No Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy headers."*

**Resolution:** Phase 8 hardening adds all of these via `next.config.js` headers section. CSP will need iteration (Supabase domains, Stripe domains, image CDN if any). **HSTS is mandatory for HIPAA.**

---

## 6. External Integrations Synthesis

What v1 keeps, what v1 replaces, what v1 drops.

| Integration | FRANK_API state | TONY_DEMO state | v1 Decision | Notes |
|---|---|---|---|---|
| **Stripe** | Two webhook handlers (one canonical at `/api/payments/webhook`, one secondary at `/api/integrations/stripe-webhook`) sharing one webhook secret. Full Customer/Checkout/Subscription/PromotionCode/Portal coverage. | **ABSENT** — confirmed GAP, no `@stripe/*` packages | **KEEP — port FRANK_API's flow per StarkReads playbook.** Per-store subscription model. Use ONE webhook URL only. | The dual-handler is itself a `FRANK_API_07` GAP — "double-processing risk if both URLs configured." Rebuild uses one. |
| **Go High Level (GHL) CRM** | Bidirectional sync. 24 custom fields. Webhooks for registration, contact-update, status-sync. **CRITICAL GAP:** Missing `GHL_WEBHOOK_SECRET` env var silently disables auth (fail-open). | Absent | **KEEP — but with the auth-fail-closed fix.** GHL drives Frank's existing customer acquisition funnel. Cannot drop. Rebuild adds env var presence check at startup; fail loudly, not silently. | Frank to confirm: which 24 GHL custom fields are critical for v1? Some may be deferrable. |
| **Liberty Software** | `liberty_client.py` HTTP client (73 LOC). Endpoints catalogued in `docs/liberty_api_endpoints.csv`. | Absent | **KEEP — port to Edge Function or Next.js API route.** Liberty is one of the 3-4 pharmacy software systems Frank flagged in Meeting Notes. Direct integration is competitive moat. | Frank to provide: which is HIS pharmacy software? (Action Item from Meeting Notes). That's the FIRST integration. Liberty may not even be Frank's. |
| **Selenium AL Medicaid Scraper** | Used in FRANK_DESKTOP only. The API does NOT scrape — it consumes scraped data via uploads. | Absent | **DROP — replace with scheduled Edge Function or GitHub Action pulling AL Medicaid published files.** The desktop's Selenium approach is fragile (browser automation against a regulator portal). The published files are the same data, more reliable, with audit trail. | Per Tony's strategy message 2026-05-01: scrapers explicitly dropped. AAC/WAC/FUL/PBM/Medicare files come from official sources. |
| **Google Cloud Storage** | PBM/AAC/WAC bulk data hosted in GCS buckets, loaded via `gcs_loader.py`. Service account auth. | Absent | **REPLACE with Supabase Storage.** Two reasons: (a) one BAA, one access model — simpler HIPAA posture; (b) reference data lives next to operational data. Migration script reads existing GCS files, uploads to Supabase Storage. One-time job. | Phase 4 deliverable. |
| **Cloud Functions (AAC/WAC/FUL imports)** | `functions/aac_import_trigger`, `functions/ful_data_pull`, `functions/ful_import_worker`, `functions/wac_import_trigger`. Cloud Scheduler → Cloud Tasks → HTTP worker → API. | Absent | **REPLACE with Supabase Edge Functions** + scheduled invocation via `pg_cron` or GitHub Action. Same logic, simpler infra. | The Cloud Functions chain is overengineered for the actual workload (one-monthly file pull). Edge Function with cron is enough. |
| **SMTP / Email** | Configurable via `SMTP_CONFIG_JSON` Secret Manager entry. Used for password resets, registration confirmations. | Absent (the demo's `/api/reports/email` builds `.eml` files but doesn't send) | **REPLACE with SendGrid** per Tony's Phase 6 plan. Reply-routing per pharmacy is the novel piece (see §4.4). | SendGrid + Inbound Parse + custom subdomain per pharmacy. Phase 6. |
| **Google Sheets (PBM Corrections)** | `pbm_corrections.py` writes to a Google Sheet via service account. Used as a manual correction inbox. | Absent | **DEFER to Phase 2+.** This is an internal Cyberize-side workflow, not customer-facing. Replace with a Supabase table + admin UI when needed. | Frank to confirm: how often is this used? If rarely, defer. |
| **OAuth (Google, Microsoft)** | Authlib integration in `auth.py:2484-2732` for SSO | Absent | **DEFER to Phase 8** unless Frank says it's a v1 customer requirement. Supabase Auth supports both natively when needed — flip a switch. | Pharmacy software customers may not need SSO at v1. |

**🎯 STRATEGIC DISCOVERY (distributed):** The Mother Ship vision (Meeting Notes 2026-03-19) lists 13 future tiers — Complaint Filing, Profit Optimization, Purchasing Optimization, Claims Reconciliation, Marketing/Website, Workflow Automation/RPA, IVR/Phone, AI Automation Layer, HR/Scheduling, Bookkeeping, Inventory Management, MedSync. **None of these are v1 integrations.** The rebuild's integration surface is: Stripe + GHL + (Frank's pharmacy software TBD) + SendGrid + Supabase Storage. That's it. *Every other Mother Ship tier is its own future project, with its own IGNITION cycle. Don't pre-build integration hooks for them.*

---

## 7. Business Logic Synthesis

The math. The constants. The edge cases.

### 7.1 The Core Math (OwedBook Calculation)

**Source of truth:** FRANK_DESKTOP's `ReimbursementComparer` class (`pharmacybooks.py:2346-8501` — 6,156 LOC). This is the production-grade reimbursement comparison engine 40 paying customers depend on.

**Demo simplification:** TONY_DEMO `/api/user-data/route.ts:198-213` reproduces a subset of the math. Key formulas:

```javascript
// AAC pricing method preference
//   1. Try aac from pharma_baseline (direct lookup)
//   2. If missing, derive from WAC:
//        Brand:   aac = (wac * 0.96) / (pkg_size * pkg_size_mult)
//        Generic: aac = wac / (pkg_size * pkg_size_mult)
//   3. If still missing, "Other" method
expected = (aac * qty) + FIXED_FEE  // FIXED_FEE = 10.64 (AL Medicaid dispensing fee)
owed = expected - originalPaid
```

**Resolution:**

**Port the demo's formulas to a Postgres function** `calculate_owed(user_data_row) RETURNS jsonb`. Rebuild does NOT inherit FRANK_DESKTOP's full 6,156 LOC — that's coupled to Tk dialog handlers. Instead, **extract the pure math** into Postgres (or a TypeScript service if Postgres is too constrained for some logic).

**Cross-validate against FRANK_DESKTOP outputs.** Frank's existing customers see specific numbers. Rebuild must produce the same numbers for the same inputs. Side-by-side comparison testing is the acceptance criterion. **Phase 5 deliverable.**

**SMELLS RESOLVED:**
- TONY_DEMO Doc 10 #S32 (`FIXED_FEE = 10.64` duplicated in `/api/user-data` and `/api/kpis`) — **Externalize to a `system_config` table OR Postgres constant.** The fee is per-state (Alabama is 10.64; other states differ). Store as `(state_code, dispensing_fee)` in a config table. Future-proof for multi-state expansion.
- TONY_DEMO Doc 10 #S33 (`0.96` brand multiplier duplicated) — **Same resolution.** Store as `(state_code, brand_multiplier)`. Currently 0.96 may not apply to all states or all brand definitions.

**🎯 STRATEGIC DISCOVERY (distributed):** The hardcoded date window `2025-07-01` to `2025-08-29` in TONY_DEMO `ReportActions.tsx:34-35` is *"the intended permanent demo window"* per Doc 03 Open Question 1. **This is a demo trick that won't survive production.** The rebuild's date-range UX must default to "last 30 days" or "current month" with a real date picker. *Coach is currently vibing on a frozen-in-time data view; he'll be confused when real production shows different numbers because it's a different date range. Communicate the change.*

### 7.2 BIN 004146 Edge Case

The most-documented edge case in FRANK_DESKTOP. ~12 helper scripts, 7+ markdown summaries. Per `FRANK_DESKTOP_02-ARCHITECTURE-MAP.md`: *"`pbm_key` is a derived canonical match key... Special case: BIN 004146 always normalized to `'4146'` and matched on BIN-only."*

**Resolution:**

**Port the BIN 004146 logic verbatim** — this is real domain logic. The 12 helper scripts represent iterative refinement against real customer data. Whatever the desktop does today is correct because it works for paying customers.

Encode as a Postgres function `derive_pbm_key(bin, pcn, group_field) RETURNS text` with the BIN 004146 special case baked in. Use this function in:
- The import pipeline (when `user_data` rows are inserted)
- The PBM matching join (`user_data.pbm_key = pbm_info.pbm_key`)

### 7.3 Activation Key Lifecycle

Per `FRANK_API_03-AGENT-LOOP.md` Lifecycle 4: when a Stripe webhook fires `checkout.session.completed`, an SQLAlchemy event listener generates a 43-char URL-safe activation key. The desktop client uses this to activate against the API.

**Resolution:**

**v1 may not need activation keys.** The original purpose was binding a desktop install to a Stripe subscription. In a web SaaS, Supabase Auth + Subscriptions cover the same role. **Defer the activation key concept** unless Frank's onboarding flow specifically requires it (Open Question).

If kept: port the event listener pattern via Postgres trigger OR the webhook handler itself.

### 7.4 APA20 Discount Lock

Per `FRANK_API_03-AGENT-LOOP.md`: webhook handler uses `SELECT FOR UPDATE` on `APAMembership.discount_redeemed` to prevent double-redemption.

**Resolution:**

**Port verbatim.** Concurrency-safe one-shot redemption is the right pattern. Postgres supports `FOR UPDATE` natively.

---

## 8. Storage & File Pipelines Synthesis

Three concerns: PDF generation, file storage, file access policies.

### 8.1 PDF Generation

| Source | How | Library |
|---|---|---|
| FRANK_API | Server-side PDF generation in `dashboard.py` for report files. Uses `reportlab`. | reportlab (Python) |
| FRANK_DESKTOP | Local PDF generation via reportlab | reportlab (Python) |
| TONY_DEMO | Server-side via `pdfkit` (Node) in `src/server/reports/pdf.ts` | pdfkit (Node) |

**Resolution:**

**Use pdfkit (the demo's choice) in a Supabase Edge Function** (Deno-compatible via Node compat shim). Reasons: (1) Tony already proved this works in the demo; (2) Edge Function keeps the PDF generation in the Supabase trust boundary; (3) consistent with TypeScript-everywhere strategy.

**OR** — if Edge Functions can't handle pdfkit Node deps cleanly, fall back to Next.js API route with `runtime = "nodejs"` (per the demo). Both routes are HIPAA-acceptable since both run server-side.

### 8.2 File Storage

| Source | Approach |
|---|---|
| FRANK_API | GCS bucket with service account auth. Bucket-level ACLs. |
| FRANK_DESKTOP | Local files on user's machine. |
| TONY_DEMO | Supabase Storage bucket `pharma_reports`. **Storage uploads use `createAdminClient()` which bypasses Storage RLS.** |

**Resolution:**

**Supabase Storage** with **per-pharmacy folder structure**: `pharma_reports/{pharmacy_slug}/{report_id}.pdf`.

**Storage RLS policy** (instead of admin client bypass):
```sql
-- Authenticated users can read their pharmacy's reports
CREATE POLICY "users_read_own_pharmacy_reports"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'pharma_reports'
    AND (storage.foldername(name))[1] IN (
      SELECT pp.pharmacy_slug
      FROM pharmacy_profile pp
      JOIN user_businesses ub ON ub.business_id = pp.business_id
      WHERE ub.user_id = auth.uid()
    )
  );
```

**🎯 STRATEGIC DISCOVERY (distributed):** TONY_DEMO uses `createAdminClient()` for Storage uploads — bypassing RLS entirely. This is **expedient but wrong for HIPAA**. The rebuild uses RLS policies on Storage exactly like on tables. Same trust model. *Per `TONY_DEMO_07-GUARDRAILS-AND-SANDBOXING.md` GAP: "Storage bucket policies for `pharma_reports` are not visible in this repo. The `/api/reports/save` route uses `createAdminClient()` which bypasses Storage RLS."* The rebuild closes this gap on Day 1.

### 8.3 Audit on File Access

**Source:** None of the corpora have this.

**Resolution:**

**Every file access produces an audit log entry.** Read OR write. The `audit_logs` table has a `table_name='storage_access'` action for this. Implement via Storage webhooks (Supabase native) or via wrapping all Storage operations in the service layer.

This is a HIPAA control (access tracking on PHI documents).

---

## 9. Open Questions for Frank

These are questions the rebuild's IGNITION phase cannot answer from the corpora. Each blocks specific phase work.

| # | Question | Blocks Phase |
|---|---|---|
| 1 | What are the 3-4 pharmacy software systems covering 85% of the market? Which is yours (the first integration)? | 4 (Reference Data Pipeline) — column mapping for imports needs the exact formats |
| 2 | What are the source URLs for AAC, WAC, FUL, PBM monthly data files? | 4 (Reference Data Pipeline) — cron can't be built without sources |
| 3 | Is the activation-key flow needed in v1, or does Supabase Auth + Subscription cover it? | 7 (Stripe + Multi-Store Admin) |
| 4 | How often is the PBM Corrections Google Sheet inbox actually used? | Defer/Drop decision |
| 5 | Which of FRANK_API's 38 admin endpoints are actually used by Cyberize internal team? | Defer/Port decision for SuperAdmin Portal |
| 6 | Is OAuth (Google/Microsoft) a v1 customer requirement? | Phase 8 |
| 7 | Does the GHL custom-field map (24 fields) have a v1 minimum? Or is full sync required? | 6 (Email/PDF Pipeline) — also relevant to onboarding |
| 8 | Are there any state-level variations Frank knows about for `FIXED_FEE` (10.64) and brand multiplier (0.96)? | 5 (Math + Imports) |
| 9 | What's Frank's preferred onboarding workflow — fully self-serve (Stripe-first) or manual approval (`pending_registrations`)? | 7 (Stripe + Admin Portal) |
| 10 | Per Meeting Notes Action Item: invite Mical to GitHub repo. Has this happened? | None — process check |

**🎯 STRATEGIC DISCOVERY (distributed):** Frank takes 7+ days to reply to email per Tony's earlier message. **These questions go out batched, not piecemeal.** Send all 10 in one email. Wait. Use the wait time to build phases 1-3 (which don't depend on Frank's answers). Per Tony's strategy: *"more they delay, the better."*

---

## 10. Cosmetic Cleanup Checklist (Appendix)

Trivia-tier smells from TONY_DEMO Doc 10 that don't tie to architectural decisions. Handle in Phase 1 sweep.

| # | Smell | Action |
|---|---|---|
| 1 | Package name `qr-next13-supabase-v1` (vestigial fork name) | Rename to `frank-pharmacy-saas-v1` or similar in `package.json:2` |
| 2 | README.md has 1 line of project description | Replace with full project README (purpose, setup, contributing) |
| 3 | 5 navbar variants in `components/global/` (only 2 imported) | Delete `Navbar-1.tsx`, `NavbarHome.tsx`, `NavbarSuperadmin.tsx` (whichever are unused after rebuild scope is set) |
| 4 | 2 hero variants in `components/home/` (`Hero-1.tsx` unused) | Delete `Hero-1.tsx` |
| 5 | `src/store/` AND `src/stores/` both exist (singular is dead) | Delete `src/store/` entirely. Update no imports needed (no live importers). |
| 6 | `app/globals.scss` AND `styles/global.scss` both exist | Consolidate to one. Per shadcn config in `components.json`, `app/globals.scss` is canonical. Delete `styles/global.scss`. |
| 7 | `app/layout-org.tsx` (older variant of `layout.tsx`) | Delete |
| 8 | `utils/supabase/server.org.ts` and `middleware.org.ts` (older variants) | Delete |
| 9 | `utils/reset_supabase_password.js` orphan | Move to `scripts/` or delete. It's dev tooling, not app code. |
| 10 | `dashboard/sidebar/README.md` "Phase 1 placeholder" | Delete the empty folder + README |
| 11 | `AdminBookingList` exported from `admin/` but never imported | Delete |
| 12 | `DashboardCard` in `dashboard/` but never imported | Delete |
| 13 | `services/postServices.ts` and `services/jsonsrvPostServices.ts` (scaffold residue from QR template) | Delete entire files, plus the related Zustand stores (`useJsonsrvPostStore`, `usePostStore`) |
| 14 | `(members)/booking/InsertForm.tsx` posts to non-existent `/api/posts` | Delete the form + page (booking is not a v1 feature) |
| 15 | Three profile forms (Personal, Contact, Organization) have no `onSubmit` handlers | Implement OR remove buttons. Per rebuild: implement properly with profile update API. |
| 16 | `SettingsContent` has no submit handler | Implement OR remove buttons. Per rebuild: implement with password reset + email change flows. |
| 17 | Hardcoded profile defaults: First="Frank", Last="Underwood", Title="Pharmacist In Charge" | Remove. Profile starts empty for new users. |
| 18 | `AdminPortalContent.tsx:30` has `email = "frank@example.com"` (declared, never read — INERT per operator call-out 2) | Remove the dead variable |
| 19 | Browser title casing inconsistency: `"Admin – Owedbook"` (en-dash, lowercase 'b') vs visible H1 `"OwedBook"` (camelCase) | Standardize on `"Pharmacy Book — OwedBook"` for consistency with brand |
| 20 | Footer placeholder content: "Marketing/Analytics/etc, © 2020 Your Company, Inc." | Replace with pharmacy-specific footer (or remove footer in v1) |
| 21 | `metadata.title = "Moose Next Framework v3"` in root layout | Replace with proper app title |
| 22 | Not-Found page debug residue: `"This is coming from /app"` | Remove the debug line |
| 23 | `RegisterForm.tsx:88` redirects to `/dashboard` (route doesn't exist) | Redirect to `/admin-portal` or `/members-portal` based on role |
| 24 | `middleware.org.ts` redirects to `/login` (route doesn't exist; canonical is `/auth`) | Delete the file (handled in #8 above) |
| 25 | `(public)/old/` route still publicly routable | Delete the folder |
| 26 | `/template` route lives outside any role group | Delete |
| 27 | `(public)/demo/` route is shadcn typography demo with Lorem ipsum | Delete (replace with proper marketing page in v1) |
| 28 | `next.config.js` global `Cache-Control: no-store` | Relax for static assets, keep for API routes. Per Cyberize cache discipline. |
| 29 | `console.debug/info/error/warn` calls in server routes leak userId/pharmacyId/slug | Phase 8 hardening — replace with structured logger that respects log level + scrubs PHI |
| 30 | Cookie diagnostic header `x-login-cookie-names` in `/api/auth/login` | Remove (information disclosure for production) |
| 31 | No `error.tsx` boundaries anywhere in App Router | Add one per route group + a global one. HIPAA app must not white-screen. |
| 32 | `AdminSidebar` exists in TWO locations (`admin/` and `layout/`) | Consolidate to one |
| 33 | `Sidebar.tsx` in `layout/` has hardcoded shortcuts (Cmd+P, Cmd+B, Cmd+S) that aren't real keybindings | Remove the visual shortcuts OR implement the keybindings properly |
| 34 | `better-sqlite3` declared in `package.json` but zero usages | Remove from dependencies |
| 35 | `EXTRACTION_SKILLS/` and `_EXTRACTIONS/` not in `.gitignore` | Add to `.gitignore` (these are factory artifacts, not app code) |

---

## 11. Synthesis Wrap

**The rebuild has a north star, evidence-grounded:**

- Stack: **Next.js 15 + Supabase + shadcn/ui** (TONY_DEMO foundation, Cyberize starter kit)
- Schema: **15 tables, FRANK_API canonical with TONY_DEMO additions** (per §3.6)
- Auth: **Supabase Auth + `user_roles` table + RLS on every PHI table** (per §5.3)
- Hero feature: **OwedBook screen, demo's UX shape, FRANK_DESKTOP's math** (per §4.1, §7.1)
- Integrations: **Stripe (per-store) + GHL + (Frank's pharmacy software) + SendGrid + Supabase Storage** (per §6)
- v1 scope: **Mother Ship Tier 1 only** (Reimbursement Monitoring) — replaces Frank's desktop, sells subscriptions to other pharmacies (per Meeting Notes 2026-03-19)

**What's locked:** Schema, auth pattern, integration list, hero feature, scope filter, smell resolutions.

**What's open:** 10 questions for Frank (§9). Stripe-first vs manual onboarding flow. Specific column mapping formats.

**Next deliverables (post-Triangulation):**
1. `MASTER_APP_BRIEF.md` — locks IGNITION
2. Per-phase APP_BRIEF skeletons (Phase 1 through Phase 7)
3. The Frank Question List as a clean ask-document
4. Phase 1 engineer-ready packet (5 docs)

---

## 📜 Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-02 | Initial Triangulation Doc. Synthesizes FRANK_DESKTOP / FRANK_API / TONY_DEMO / Mother Ship + Meeting Notes. Smell triage integrated section-by-section. Strategic discoveries distributed throughout (Way B). 35 cosmetic smells in §10 appendix. |

---

🛡️ — Cyberize Software Factory / Stark Industries
