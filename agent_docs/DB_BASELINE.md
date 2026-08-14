# DB_BASELINE — Phase 3 Migration-Chain Starting Truth

> Authored by BIM-000-CYBER-PHARMA (Stage Prep & Hygiene), 2026-08-13.
> Source of record: Coordinator's live-DB catalog run, **2026-08-11** (V9 of the module
> manager), transcribed byte-faithful. Every Phase 3 schema change chains forward from
> the state recorded here. Disk SQL is history; THIS is the deployed truth.

---

## Live Tables (public schema)

| Table | Notes |
| --- | --- |
| `public.user_roles` | Role truth for `protectPage`/`getUserRole` (AppRole: SUPERADMIN / ADMIN / MEMBER) |
| `public.profiles` | Profile fields; created by `handle_new_user()` trigger on auth signup |

No other application tables exist in the live instance as of the catalog date.

## Live RLS Policies (exactly three)

| Table | Policy name (byte-faithful) |
| --- | --- |
| `profiles` | Profiles are updatable by owner or superadmins |
| `profiles` | Profiles are viewable by owner or superadmins |
| `user_roles` | Users can read their own role |

## Interpretation (Architect, 2026-08-11)

The live schema is **`supabase/setup.sql` base + `docs/migration_add_profiles.sql` overlay,
applied in sequence**. The migration's profile policies are the live ones (the
superadmin-variant names above), superseding setup.sql's originals. Both SQL files are
read-only history from this point — Phase 3 schema work starts new migration files
chained on this baseline.

## Catalog Date

**2026-08-11** — Coordinator live-DB catalog run. Any drift after this date is not
captured here; re-catalog before the first Phase 3 migration is authored.

## Sibling Note — phase2.md (R3)

`phase2.md` (PROJECT_OVERVIEW.md's named master Phase-2 reference) was recovered
from the sibling repo and placed at `agent_docs/phase2.md`.
Verdict: **RECOVERED**.

---

_Known baseline facts adjacent to schema: 0 `user_metadata` role smells in production
code (roles live in `public.user_roles`, DB is role truth); backend-swap tables
(`user_data`, reference tables, `business_id` RLS) exist ONLY as BACKEND_SWAP_NOTES
comments in `src/services/` — no SQL on disk. That schema is Phase 3's to author._
