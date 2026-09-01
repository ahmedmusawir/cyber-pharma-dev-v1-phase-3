# ERRATUM — BIM-002-CYBER-PHARMA
**Opened:** 2026-09-01 · Recorded per Director ruling (FLAG-2) and the fidelity rule: unattributed divergence is a defect.

---

## E-1 — Manager §5.2 expected policy count (RULED 2026-09-01)

**Manager says:** "Expected policy count: 17 policies + 3 helpers."
**Disk/plan truth:** the manager's own row-by-row breakdown sums to **15** new policies with `apa_memberships` deny-all (accounts 1 · businesses 2 · user_businesses 1 · subscriptions 1 · apa 0 · user_data 4 · report_files 1 · reference ×5).
**Ruling (Director/Architect, 2026-09-01):** count = **15 new policies, 18 rows in `pg_policies` at close** (15 + 3 untouched baseline). The manager's 17 was an Architect arithmetic error. AC9's "matches the plan as confirmed at X0" wording absorbs it — no spec rewrite needed.

## E-2 — Proto 06 helper template: `revoke … from anon` is ineffective (PENDING RATIFICATION)

**Discovered:** BIM-002 X1, 2026-09-01. Evidence: `evidence/X1_AC8_helper_shape_2026-09-01.log`, `evidence/X1_FINDING_anon_execute_via_public.log`.

TRANSFERS §1.0's helper template ends with `revoke execute on function … from anon`. Postgres grants `EXECUTE` on new functions to **PUBLIC** by default; `anon` inherits it through PUBLIC, so revoking from `anon` specifically is a **no-op**. Confirmed by ACL: `{=X/postgres, postgres=X/postgres, authenticated=X/postgres, service_role=X/postgres}` — the leading `=X` is PUBLIC. `has_function_privilege('anon', …)` = **true** after the template's revoke, and an impersonated `anon` session **successfully executed** the helper.

**Why Proto 06 did not catch it:** the rig's matrix asserted *table* access, where anon was denied everywhere because no policy granted anon anything. No assertion ever targeted the helper's own EXECUTE privilege, so table-level denial masked the grant defect. F-5 covered `SECURITY DEFINER`; nothing covered the grant.

**Severity:** not a data leak — `auth.uid()` is NULL for anon, so all three helpers return `false`. It is a **privilege-surface defect**: an unauthenticated caller can invoke a `SECURITY DEFINER` function that reads a PHI-adjacent table, and AC8 literally requires `anon` to lack EXECUTE.

**Remedy (proven in a rolled-back transaction, NOT applied):** `revoke execute on function public.<fn>(uuid) from public;` before the grant to `authenticated`. Post-remedy: anon=false, authenticated=true, service_role=true; impersonated anon denied with `42501`.

**Status: RATIFIED and APPLIED 2026-09-01** (Architect, Director-ratified). `0016_rls_helpers.sql` now uses `revoke execute … from public` for all three helpers, each carrying a one-line divergence comment citing this erratum. **AC8 amended by the same ruling:** the check asserts PUBLIC lacks EXECUTE (raw ACL shows no bare `=X/` entry) — an anon-only assertion is insufficient, because PUBLIC is the mechanism. X1 re-run in full: **GREEN** (`evidence/X1_AC8_helper_shape_AMENDED_2026-09-01.log`).
**Onward (at close, not now):** TRANSFERS §1.0 erratum + FINDINGS **F-10 — "revoke from anon is a no-op; revoke from public"**, noting that the rig's table-level denial masked it. BIM-005 inherits the same template.
**Port source untouched by ruling:** `proto-06/policies/` and `proto-06/scripts/` keep the defective text — they are port source and review-by-diff evidence. Corrected text lives only in `0016` and `RLS_TEMPLATES.md`.

## E-4 — `revoke … from public` is necessary but NOT sufficient (APPLIED, ratification requested)

**Discovered:** BIM-002 X2, 2026-09-01, while creating the formulation-C helper. Evidence: `evidence/X2_FINDING_fresh_create_anon_grant.log`.

E-2 diagnosed PUBLIC as *the* mechanism. It is **one of two**. `pg_default_acl` for functions in schema `public` grants EXECUTE to `anon` **explicitly** (`objtype=f → {postgres=X, anon=X, authenticated=X, service_role=X}`), so a freshly created function carries `anon=X` even after PUBLIC is revoked.

**How this hid:** X1's GREEN was an artifact of apply *history*. v1 of `0016` ran `revoke … from anon` (clearing the explicit grant); v2's `create or replace` **preserves the existing ACL** and additionally revoked PUBLIC. Net-clean — but only because both revokes had run across the two applies. Proven by dropping the helpers and re-applying `0016` fresh: all three came back with `anon=X` and `has_function_privilege('anon', …) = true`. **AC8 would have failed at X5's from-scratch run.**

**Remedy (APPLIED):** every helper carries BOTH `revoke … from public` and `revoke … from anon`, then the grant to `authenticated`. Verified on a fresh create of all four helpers: ACL `{postgres=X, authenticated=X, service_role=X}`, `anon=false`, impersonated anon denied `42501` (`X1_AC8_four_helpers_FINAL_2026-09-01.log`).

**Why applied rather than held:** the ratified AC8 requirement ("anon lacks EXECUTE") was unmeetable from scratch without it. This adds no requirement and weakens none — it is a strictly-more-restrictive grant that makes the file satisfy an already-ratified criterion. **Ratification of the wording change requested** (E-2's literal instruction was `from public` *in place of* `from anon`; evidence says both).

**Method lesson (F-12, drafted at close):** privilege assertions must be made after a **from-scratch** apply. An incremental re-apply can mask a defect because `create or replace` preserves ACLs. Applies to any AC that inspects grants.

**Also on this scratch:** the observed default privileges are set by `scripts/db-reset.mjs`'s bootstrap re-grant block. Supabase projects ship comparable defaults for `public`, so the migration must be defensive regardless — **to be re-verified on the dev backend at the Phase 3 APPLY SESSION.**

## E-5 — Formulation C adopted; `my_business_ids()` is a fourth helper (RULED + measured)

Architect ruling 2026-09-01 ordered formulation C measured before adopting B. C proved out (+0.8% / +0.7% vs B, identical plan shape and buffers, and **shielded** where B is blinded). **C is adopted for tenant SELECT predicates**; `my_business_ids()` joins `0016` under all AC8 assertions. Manager §5.2's SELECT column for `user_data`, `report_files`, and `businesses` now reads `business_id in (select public.my_business_ids())` rather than `is_member_of(...)`. Full evidence: `evidence/X2_AB_DECISION.md` §7.

## E-3 — AC13 (CI wiring) STRUCK (RULED 2026-09-01)

**Ruling (Director, FLAG-4):** no CI in this module. No `.github/` directory, no workflow file. **AC13 is struck from the spec**; CI wiring routes to the Deferred Ledger. The harness ships as the `rls:prove` npm task only, and commit grouping 3 becomes "Harness port + task" (no CI).
**Action:** the strike is annotated into `ACCEPTANCE_SPEC.md` at the evidence-fill pass (X7 close), not silently earlier.
