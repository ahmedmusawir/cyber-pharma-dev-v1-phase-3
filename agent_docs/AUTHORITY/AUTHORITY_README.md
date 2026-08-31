# AUTHORITY/ — PHASE 3 CAMPAIGN AUTHORITY FOLDER

## Campaign-level home, promoted 2026-08-31 at DOCTRINE SYNC (was `ACTIONS/BIM-001-CYBER-PHARMA/AUTHORITY/`, staged 2026-08-28 to resolve BIM-001 plan FLAG-A)

**Destination:** `agent_docs/AUTHORITY/` · Director-committed. Every Phase 3 module reads from HERE. Modules never re-stage authority into their own folders; they cite this path.
**Launch-line prerequisite (REQUIRED):** before any runner's first message, the Director confirms every file listed below is present on disk on the runner's branch. Four launches in a row (BIM-000, BIM-001, PROTO06 docs, PROTO06 credential) started with an input missing. This folder and this README exist so that stops.

---

## Contents & Precedence (highest first)

1. **Module manager rulings** (`ACTIONS/<MODULE>/CLAUDE.md`, R-numbered) — override everything below where they speak, for that module only.
2. **PHASE_3_BIM_CAMPAIGN_MAP.md (v1.1)** — module decomposition, gates, AC seeds, campaign rules. Its PATCH HEADER carries every Director ruling since 08-11 and wins over the v1.0 body where they conflict. Key items: sixteen tables; Gap-6 junction-only RLS with NO superadmin policy in OwedBook; Proto 06 transfers bind BIM-002; Storage policies deferred to Proto 01; Phase 3 APPLY SESSION sits between BIM-004 and BIM-005.
3. **ACTIONS/PROTO06/TRANSFERS.md + FINDINGS.md** — proven RLS policy patterns, helper SQL, harness, findings F-1..F-9, not-proven list N-1..N-6. Binding input to BIM-002 and BIM-005 (see the map's patch header for the non-negotiables). Not in this folder; cited here so it is never missed.
4. **TRIANGULATION_DOC.md §3** — the fifteen-table resolution + per-table decisions (§3.6). Where it resolves a FRANK_API-vs-demo conflict, its resolution stands. **§5.4's sample `super_admins_see_all` policy is DEAD** under Gap-6 — do not port it.
5. **FRANK_API-02-ARCHITECTURE-MAP.md** — the models.py catalog. Column types/constraints copied verbatim where migration-relevant. Where a column appears here but the manager/Triangulation excludes the table (deferred tables), the exclusion wins. `report_files` columns were never enumerated here; BIM-001 shipped a minimal attested shape with a fidelity flag — verify vs models.py:826-849 at BIM-004/005.
6. **LEGACY_DEMO_FORMAT_MAP_v1_0.md** — format truth + adopt/reject conventions list + seed source for BIM-004. NEVER schema authority.
7. **DATA_CONTRACT_PHASE_1.md** — baseline objects (user_roles, profiles, the functions) migration 0001 acknowledges. **Read with `ACTIONS/BIM-001-CYBER-PHARMA/ERRATUM.md`:** §3's `update_updated_at()` claim was starter-kit residue; the chain creates it idempotently (E-2). The contract amendment is owed to the doc repo by the Director.
8. **BIM_PLAYBOOK.md (v1.0)** — the governing build methodology for every BIM module. In-campaign amendments (walk-first Gate Q order, One-Walk, PRE-Q, execution-agent release rule, launch-line prerequisite) are recorded in `agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md` and the map's patch header until harvested into v1.1 at campaign close.

**Schema truth, in order:** disk (`supabase/migrations/` as certified at `9f8c80d`, `src/types/supabase.ts`) > these documents > anyone's memory. When disk and a document disagree, disk wins and the document gets an erratum the same day.

---

## Carried rules from the BIM-001 staging (still in force)

**medicaid_method vocabulary** — RATIFIED at BIM-001: NULLable, CHECK on `AAC, FUL, GWAC, BWAC, Take Action, Manual Override, Legacy`; `Portal` excluded; `''`→NULL mapping implemented in BIM-004. Frank's five rulings may widen it (amendment path stands).

**Fidelity rule** — "Verbatim" means: column names and semantic types from the catalog, translated to Postgres/Supabase idiom (SQLAlchemy Integer PK → uuid or identity per Triangulation's per-table ruling; String(n) → text unless a length is load-bearing; DateTime → timestamptz). Every deliberate divergence from the catalog gets a one-line comment in the migration file naming its authority (R-ruling, Triangulation §, Format Map item, or Proto 06 finding). Unattributed divergence is a defect.

**Credential boundary** — the Engineer session never holds credentials scoped wider than throwaway. Live catalog reads are Director-as-hands dashboard pastes. Types generation is Director login→gen→logout in the Director's own terminal. Pooler host generation (`aws-1-us-west-1` for current projects) is recorded in each module manager, never recalled.

🥄
