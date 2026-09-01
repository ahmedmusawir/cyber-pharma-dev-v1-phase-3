# BIM-002 — GATE X1 REPORT: helpers landed · AC8 half-RED on a real defect · STOPPED
**Date:** 2026-09-01 · **Gate:** X1 (helpers) · **Verdict: RED — one ratification needed, remedy proven**

## What landed

`supabase/migrations/0016_rls_helpers.sql` — applied clean to the scratch. Three helpers, all with an assert-then-create preamble (§6.5) that refuses to run unless `user_businesses` and `businesses` exist **with RLS enabled**:

| Helper | Source | Body |
|---|---|---|
| `is_member_of(biz uuid)` | verbatim TRANSFERS §1.0 | junction membership |
| `is_admin_of(biz uuid)` | verbatim TRANSFERS §1.0 | junction membership **+ `role = 'admin'`** |
| `is_account_member(acct uuid)` | **new, R-A** | junction row on any business under the account — `join businesses b on b.id = ub.business_id where b.account_id = acct`. **Never reads `accounts.owner_user_id`** |

Every body is fully qualified, `language sql`, `stable`, `security definer`, `set search_path = ''`, with the Gap-6 rationale and the F-5 rationale written into the file header.

## X1 evidence board

Evidence: `evidence/X1_AC8_helper_shape_2026-09-01.log` · `evidence/X1_FINDING_anon_execute_via_public.log`

| Check | Result |
|---|---|
| 3/3 helpers present | ✅ |
| `prosecdef = true` (AC8) | ✅ all three |
| `provolatile = 's'` (AC8) | ✅ all three |
| `proconfig` contains `search_path=` (AC8) | ✅ all three (`search_path=""`) |
| `authenticated` holds EXECUTE (AC8) | ✅ all three |
| **`anon` lacks EXECUTE (AC8)** | ⛔ **FAIL — `anon` HOLDS it on all three** |
| Live probe: impersonated `anon` calling the helper | ⛔ **executed successfully** (should be denied) |
| Live probe: impersonated `authenticated` with real `auth.uid()` claim | ✅ all three callable, all return `false` with no membership |
| Policy count unchanged (helpers create no policies) | ✅ 3 baseline, 0 new |

## ⛔ The defect — and it is inherited, not introduced

`revoke execute on function … from anon` **is a no-op.** Postgres grants EXECUTE on new functions to **PUBLIC** by default, and `anon` inherits through PUBLIC. Raw ACL proves it: `{=X/postgres, postgres=X/postgres, authenticated=X/postgres, service_role=X/postgres}` — that leading `=X` is PUBLIC.

**This is Proto 06's shipped template, verbatim.** The rig never caught it because its matrix asserted *table* access, where anon was denied everywhere (no policy granted anon anything) — table-level denial masked the grant. F-5 covered `SECURITY DEFINER`; nothing ever asserted the helper's own EXECUTE privilege. BIM-002's AC8 is the first check that looks directly at it.

**Severity — honest read:** *not* a data leak. `auth.uid()` is NULL for anon, so all three helpers return `false`. It is a **privilege-surface defect**: an unauthenticated caller can invoke a `SECURITY DEFINER` function that reads a PHI-adjacent table, which is precisely the "classic CVE-shaped mistake" the plan's own landmine warns about — and AC8 literally requires anon to lack EXECUTE, so the gate cannot be called green.

**Remedy — proven, NOT applied:**
```sql
revoke execute on function public.is_member_of(uuid) from public;   -- was: from anon
grant  execute on function public.is_member_of(uuid) to authenticated;
```
Tested inside a transaction and **rolled back**: post-remedy `anon=false, authenticated=true, service_role=true`, and an impersonated `anon` session was denied with `42501`. Post-rollback re-check confirms nothing persisted — the scratch still shows the defect.

**Why I did not just fix it:** the manager pins these helpers as "verbatim TRANSFERS §1.0". Strengthening pinned text is a requirement change, not within-gate iteration. Flag-don't-deviate.

## Ratification requested (one line unblocks X1)

1. **Amend the three helpers to `revoke … from public`** — replaces the ineffective `from anon` line in `0016`, plus a one-line divergence comment naming this erratum as its authority (fidelity rule).
2. **Onward:** if ratified, TRANSFERS §1.0 and FINDINGS carry an erratum / new finding **F-10**, because BIM-005 and every future module inherit that template. I'll draft both at close unless you want them sooner.

## Bookkeeping done this gate

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ERRATUM.md` opened with **E-1** (policy count = 15, ruled) · **E-2** (this defect, pending ratification) · **E-3** (AC13 struck by ruling; the spec annotation is applied at the evidence-fill pass, not silently now).

## Standing

Zero git · `.env.local` untouched · no credential value in any command, log, or document · dev backend never touched · scratch only. No policy migration authored — X3 has not begun.

→ **STOPPED at X1. Awaiting acknowledgement + the E-2 ratification.**
