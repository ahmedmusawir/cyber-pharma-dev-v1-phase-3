# BIM-001-CYBER-PHARMA — THE MANAGER
## Schema Migrations: The Sixteen-Table Target Schema

> **Status:** FINAL — 2026-08-28 · Launch condition: FIX-001 close-out committed (VERIFIED 2026-08-28 by Director)
> **Module type:** BIM (Backend Integration Module) · **Campaign:** Phase 3 BIM Campaign, module 3 of 7
> **Governed by:** BIM_PLAYBOOK v1.0 · SOFTWARE_FACTORY_PLAYBOOK › Module Identity & QA Handoff
> **Branch:** identity resolved from disk at PRE-Q per doctrine — never pre-named here
> **Repo:** cyber-pharma-dev-v1-phase-3

---

## 1. MISSION (one sentence)

Author and land the complete forward migration chain that takes the live database from its verified two-table baseline to the sixteen-table Cyber Pharma v1 target schema, with every new table born deny-by-default, and a one-command reset that rebuilds the chain from zero.

---

## 2. VERIFIED GROUND (build on this WITHOUT re-verification)

| Fact | Provenance |
|---|---|
| Live DB baseline: 2 tables (`user_roles`, `profiles`), 3 policies | agent_docs/DB_BASELINE.md (BIM-000 close) |
| Starter-kit functions present: `handle_new_user()`, `update_updated_at()`, `rls_auto_enable()` | DATA_CONTRACT_PHASE_1 §3 (LOCKED) |
| `rls_auto_enable()` event trigger auto-enables RLS on new tables | DATA_CONTRACT_PHASE_1 §3 |
| Board green: build 22 routes, tsc clean, jest 28 suites / 128 tests / 0 fail | FIX-001 close-out (Gate Q PASS 2026-08-27) |
| Schema authority: FRANK_API `models.py` per Triangulation ruling | TRIANGULATION_DOC §3 |
| Legacy demo Supabase = format truth only, NEVER schema authority | LEGACY_DEMO_FORMAT_MAP v1.0 |
| Fifteen-table resolution | TRIANGULATION_DOC §3.6 |
| Sixteenth table (`accounts`) ratified by Director 2026-08-28 | This manager, §4 Ruling R-2 |
| WAC formula inputs: `wac, pkg_size, pkg_size_mult, generic_indicator` | MATH_SPEC + Format Map Finding 1 |
| `pbm_key` format: `{bin}-{pcn}-{group_field}` lowercase, zeros stripped, BIN 004146 → `'4146'` | TRIANGULATION_DOC §3.3 / FRANK_DESKTOP pbm_utils |

**Disk > docs > memory.** Recon confirms the baseline before migration 0001 is written (see §7 Gate X0).

---

## 3. WHY THIS MODULE EXISTS

Phase 3's remaining modules (RLS hardening, audit, seed, Controlled Read Validation) and every phase after them require the real tables to exist. This module pours the concrete. It is schema ONLY: no service-layer wiring, no UI, no data seeding beyond what migrations structurally require. BIM-002 secures, BIM-003 audits, BIM-004 seeds, BIM-005 validates. Scope smuggling from those modules into this one is a blocking defect.

---

## 4. BINDING RULINGS (Director, 2026-08-28)

**R-1 — Cody:** Routed to the QA seat. QA staffing is QA's internal decision; this module carries NO engineering dependency on any QA execution agent. The Engineer's obligation ends at a finalized ACCEPTANCE_SPEC.md.

**R-2 — The accounts spine (NEW, sixteenth table):** Per the Director's org model and Coach's account hierarchy: one `accounts` table (organization/group spine — e.g., "Tony Pharmacy Group") sits above `businesses` (stores). Every store carries `account_id NOT NULL` referencing accounts. The account owner is `accounts.owner_user_id`. **Subscription attaches to the account, not the store** (Phase 7 consequence; `subscriptions` carries `account_id`, not `business_id`). No superadmin concept inside OwedBook — platform roles are MissionControl's domain.

**R-3 — Gap-6 role precedence (RATIFIED):**
- `user_roles` (exists in baseline) gates app-wide/platform surfaces. OwedBook UI never surfaces it.
- Junction role on `user_businesses` gates per-store capability. **Exactly two values in v1: `admin`, `member`** — enforced as `TEXT` + `CHECK (role IN ('admin','member'))`, NOT an enum. The CHECK is the v2 seam: GHL-style alterable permissions (Director-confirmed roadmap, post-MVP) will widen this without a type migration.
- **RLS membership reads the junction ONLY.** No policy may consult `user_roles`. (BIM-002 enforces; BIM-001 must not create policies that violate it.)

**R-4 — Pre-loaded BIM-003 rulings (do NOT implement here, do not contradict):** read-audit = per-page-read RPC wrappers; tenant audit visibility = internal-only in v1.

---

## 5. SCOPE — THE SIXTEEN TABLES

Migration chain creates fourteen new tables (two exist in baseline). Order respects FK dependencies.

| # | Table | Source authority | Key structural notes |
|---|---|---|---|
| 1 | `accounts` | R-2 (NEW) | `id uuid PK`, `name`, `owner_user_id` FK→auth.users, timestamps |
| 2 | `businesses` | FRANK_API verbatim + additions | `account_id NOT NULL` FK→accounts · composite UNIQUE `(ncpdp, npi)` · lifecycle status · `pharmacy_slug` (TONY_DEMO) · `has_used_trial` · Stripe customer fields per Triangulation |
| 3 | `user_roles` | EXISTS — baseline | Migration 0001 acknowledges; NO structural change |
| 4 | `profiles` | EXISTS — baseline | Acknowledge only; NO role column ever (AUTH_MANUAL v1.3) |
| 5 | `user_businesses` | FRANK_API junction | `user_id` + `business_id` + `role TEXT CHECK IN ('admin','member')` + `is_primary` · UNIQUE `(user_id, business_id)` |
| 6 | `pending_registrations` | FRANK_API | Built now; Frank's onboarding-approval confirm pending — table costs nothing empty |
| 7 | `subscriptions` | StarkReads pattern + R-2 | **`account_id` FK→accounts** (NOT business_id) · Stripe state mirror · Phase 7 consumer |
| 8 | `apa_memberships` | FRANK_API verbatim | UNIQUE `license_number` · `discount_redeemed` flag |
| 9 | `user_data` | FRANK_API FULL column set | The PHI fact table · `business_id NOT NULL` · includes `bin`, `pcn`, `group_field`, `pbm_key`, `payment`, `expected_paid`, `difference`, `owed`, `medicaid_rate` · `medicaid_method TEXT CHECK` (constrained vocabulary per campaign map) · rate-recalc provenance columns (`aac_date_used`, `wac_date_used`, `ful_year_used`, `ful_month_used`, `rate_source`) |
| 10 | `report_files` | FRANK_API | Phase 6 consumer; built now, empty |
| 11 | `aac_reference` | FRANK_API | UNIQUE `(ndc, aac_date)` · `effective_date` join-key pattern |
| 12 | `wac_reference` | FRANK_API + TONY_DEMO cols | `pkg_size`, `pkg_size_mult`, `generic_indicator` adopted · `wac_by_unit` computed column DROPPED (derive in app) |
| 13 | `ful_reference` | FRANK_API | UNIQUE `(ndc, year, month)` |
| 14 | `pbm_info` | FRANK_API FULL shape | `bin`, `pcn`, `state`, `email`, `pbm_key`, `matching_type NOT NULL` |
| 15 | `audit_logs` | FRANK_API verbatim | HIPAA trail · `record_id VARCHAR(128)` (Stripe id support) · indexes `(table_name, record_id)`, `user_id`, `created_at` |
| 16 | `reference_dataset_versions` | FRANK_API | checksum + row_count per dataset |

**Deferred (do NOT create):** `desktop_client_versions`, `local_desktop_users`, `password_reset_tokens` (Supabase Auth native).

---

## 6. STRUCTURAL LAWS (apply to every migration in the chain)

1. **Deny-by-default at birth.** Every table: `ENABLE ROW LEVEL SECURITY`, zero permissive policies in this module. `rls_auto_enable()` is the net, not the mechanism — migrations enable RLS explicitly anyway (belt and suspenders). Verify the event trigger fires as a gate, don't rely on it.
2. **Money is NUMERIC.** No float, no real, no double precision, anywhere a dollar lives.
3. **NDC, script, bin, pcn, group_field are TEXT.** Leading zeros are data.
4. **Provenance columns on every reference table:** `source_file`, `imported_at`, dataset-vintage linkage to `reference_dataset_versions`.
5. **`created_at` / `updated_at TIMESTAMPTZ` on every table**, `update_updated_at()` trigger attached (demo had them on 3 of 7 — that gap dies here).
6. **One brand/generic name:** `generic_indicator` (the alt_rates/WAC name). The `bg` name does not enter the target schema. (Authority column question rides Frank's Q-04 ruling — the COLUMN exists regardless.)
7. **Migration 0001 acknowledges the baseline** — asserts `user_roles` and `profiles` exist as expected, fails loudly if the disk disagrees with DB_BASELINE.md. The chain never pretends the database is empty.
8. **Storage buckets: NONE created here.** Phase 4/6 own buckets. If any migration touches storage, that is scope smuggling.
9. **One-command reset skeleton:** a script (`db-reset` npm task or shell script) that drops-and-replays the full chain against a scratch database. It must run clean twice consecutively.
10. **No seed data.** Structural rows only if a migration literally cannot apply without one (expected: none).

---

## 7. GATES (engineering, module-internal)

- **X0 — Baseline recon:** live catalog query output matches DB_BASELINE.md exactly (tables, policies, functions) BEFORE authoring migration 0001. Disk wins; discrepancy = STOP and surface.
- **X1 — Chain applies clean:** full chain runs on a scratch DB from zero, exit 0.
- **X2 — Chain applies on baseline:** full chain runs on a baseline-replica DB (user_roles + profiles + 3 policies pre-existing), exit 0.
- **X3 — Idempotent reset:** one-command reset runs twice consecutively, both clean.
- **X4 — Deny-by-default proof:** post-chain, every new table has RLS enabled and `anon`/`authenticated` SELECT returns zero rows / permission denied on all sixteen.
- **X5 — Type audit:** grep-level assertion — zero float/real/double on money columns; NDC/bin/pcn/group_field/script are text.
- **X6 — Types regenerated:** `supabase gen types typescript` output committed to `src/types/supabase.ts`; tsc clean against it.
- **X7 — Board green:** build + tsc + full jest suite pass, baseline and final. (Re-run full suite after ANY dependency install — standing law.)

---

## 8. FORBIDDEN ZONES

- RLS *policies* beyond deny-by-default (BIM-002's mission)
- Audit triggers / RPC read wrappers (BIM-003)
- Seed data (BIM-004)
- Service-layer or UI wiring of new tables (BIM-005+)
- Any `pbm_key` derivation function (Phase 5; the COLUMN ships, the LOGIC doesn't)
- Storage buckets (Phase 4/6)
- Touching `user_roles`/`profiles` structure
- git / cloud commands (Claudy: zero, ever — Director is sole committer)

---

## 9. LAUNCH PROCEDURE

Plan Mode first, ONE message. The plan opens with X0 evidence (live catalog vs DB_BASELINE.md). Flags, don't deviates. Build only after Director approval of the plan. Response Logging Protocol v1.0 in force: every substantive artifact mirrors to agent_docs/RESPONSES/ before printing.

**Director launch line:** *"Claudy — BIM-001-CYBER-PHARMA. Read the manager. Plan Mode. X0 first."*

---

## 10. DEFINITION OF DONE

- [ ] X0–X7 green with evidence
- [ ] ACCEPTANCE_SPEC.md finalized (Engineer, at handoff — no silent criteria changes)
- [ ] Migration files + reset script + regenerated types staged with per-concern commit lists for the Director
- [ ] RETROSPECTIVE.md written — what fought back
- [ ] QA/ folder ready for Sol's package
- [ ] Manager flipped to CLOSED with deliverables map

🥄
