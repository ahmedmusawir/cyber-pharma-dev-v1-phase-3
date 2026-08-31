# PROTO 06 RIG LAUNCH — RECON RESULT: BLOCKED BEFORE PLAN
**Date:** 2026-08-31 11:36 · **Branch:** phase-3-proto-6 (cut from `53f4b63` "Official Bim001 close out" — clean provenance ✓) · **Status:** R1 plan CANNOT be presented; 2 blockers + 1 stranding risk surfaced

## BLOCKER-1 — Both READ-FIRST documents are absent from disk

`agent_docs/PROTO/06/PROTO_06_RIG_LAUNCH_BRIEF.md` and `PROTO_PLAN_06.md` do not exist — the `agent_docs/PROTO/` directory itself does not exist on this branch, and a machine-wide sweep (`find` across the repo + siblings) finds no PROTO_06 artifacts anywhere. This is the same doc-staging failure class as BIM-001's FLAG-A (authority in the Architect's lab, not the runner's repo) — third occurrence this campaign.

**Consequence:** the launch order says the PLAN's technical detail defines R1 and wins conflicts. Without it I know only the Director-override slice of R1 ("reset throwaway to completely empty public schema incl. functions/triggers/policies; confirm via pg_catalog") — not the rig's table set, first policy target, harness shape, or red-green loop mechanics. Presenting an "R1 plan" from the override alone would be re-derivation, which the launch order forbids.

**Need:** the two documents staged at `agent_docs/PROTO/06/` (Director copy-in, like the BIM-001 AUTHORITY package).

## BLOCKER-2 — .env.local cannot execute the R1 reset (API keys ≠ DDL access)

Key NAMES present (values untouched, per override): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (+ site/api-base/moose/stripe-publishable keys).

The R1 reset is DDL (`DROP` of tables/functions/triggers/policies) and the empty-state check reads `pg_catalog`. **The service-role API key cannot do either** — PostgREST executes no DDL and exposes no pg_catalog, and the leftover BIM-001 schema ships no exec-SQL RPC. The BIM-001 gate runs worked because the Director supplied **postgres connection strings** (pooler URLs); those are absent here.

**Need (one of):**
1. Throwaway project's pooler `DB_URL` added to `.env.local` (e.g. as `PROTO06_DB_URL`) — rig harness reads it, never prints it; or
2. Director-as-hands runs the reset + catalog SQL I stage (the X0 pattern).

Option 1 recommended — the rig's red-green harness will need direct SQL continuously, not just at R1; hands-mode per policy-step would be painfully serial.

## RISK-3 — Campaign journal edit is stranded on a never-merge branch

`agent_docs/PHASE_3_CAMPAIGN_JOURNAL.md` carries **+65 uncommitted lines** (the BIM-001 journal entry, presumably JARVIS's) riding in the working tree of `phase-3-proto-6` — a branch declared disposable and never merged. If it's committed here (or the branch is deleted with it uncommitted), the entry dies with the branch — the exact KIP-registry loss-class from the phase-3 cut. **Recommend:** Director commits the journal entry on `phase-3-2` (mainline) before any Proto-06 commit lands on this branch.

## Noted in passing (out of this lane's scope)

`.env.local` now carries `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_API_BASE_URL` key names again (post-BIM-000-purge era names differ from the purged `STRIPE_*` six, but the env contract from BIM-000's AC3 may want a re-look at next hygiene pass). Not touching it from this lane.

## What I did NOT do

No plan presented (insufficient authority), no build, no DB connection, no git, no writes outside `agent_docs/` protocol paths. Binding rules from the launch order (Gap-6 junction-only, no user_roles/raw_user_meta_data in policies, deny-by-default one-policy-at-a-time red-green, no superadmin policies) are absorbed and will govern the R1 plan the moment the documents land.

**Holding for:** ① PROTO/06 documents staged · ② DB access ruling (pooler URL vs hands) · ③ journal-stranding decision.
