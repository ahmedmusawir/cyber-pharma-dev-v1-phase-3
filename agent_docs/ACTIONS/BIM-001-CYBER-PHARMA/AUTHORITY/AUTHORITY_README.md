# AUTHORITY/ — BIM-001-CYBER-PHARMA
## Staged by the Architect, 2026-08-28 · Resolves plan FLAG-A

**Destination:** `agent_docs/ACTIONS/BIM-001-CYBER-PHARMA/authority/` · Director-committed before build.

## Contents & Precedence (highest first)

1. **Manager R-1..R-4 rulings** (in the module CLAUDE.md) — override everything below where they speak (e.g., R-3 role vocabulary overrides models.py's `admin|user`; R-2 accounts spine and `subscriptions.account_id` override Triangulation's per-store subscription shape).
2. **TRIANGULATION_DOC.md §3** — the fifteen-table resolution + per-table decisions (§3.6). Where it resolves a FRANK_API-vs-demo conflict, its resolution stands.
3. **FRANK_API-02-ARCHITECTURE-MAP.md** — the models.py catalog. Column types/constraints copied verbatim where migration-relevant. This is the "FRANK_API verbatim / FULL column set" source the manager cites. Where a column appears here but the manager/Triangulation excludes the table (deferred tables), the exclusion wins.
4. **LEGACY_DEMO_FORMAT_MAP_v1_0.md** — format truth + adopt/reject conventions list. NEVER schema authority.
5. **DATA_CONTRACT_PHASE_1.md** — baseline objects (user_roles, profiles, the 3 functions) migration 0001 must acknowledge.

## medicaid_method vocabulary — DERIVE, SURFACE, WAIT

The constrained vocabulary values are NOT in this folder. Derive the candidate list from the MATH_SPEC extraction already on this machine (`pharmacybooks-desktop-main/_EXTRACTIONS/MATH_SPEC/` — the calculators' method vocabulary). **Surface the derived list as a flag for Architect ratification BEFORE authoring 0013_user_data.sql.** Do not invent, widen, or narrow it silently. (Known future amendment path: Frank's five rulings may widen it — spec AC10 already carries that clause.)

## Fidelity rule

"Verbatim" means: column names and semantic types from the catalog, translated to Postgres/Supabase idiom (SQLAlchemy Integer PK → uuid or identity per Triangulation's per-table ruling; String(n) → text unless a length is load-bearing; DateTime → timestamptz). Every deliberate divergence from the catalog gets a one-line comment in the migration file naming its authority (R-ruling, Triangulation §, or Format Map item). Unattributed divergence is a defect.

🥄
