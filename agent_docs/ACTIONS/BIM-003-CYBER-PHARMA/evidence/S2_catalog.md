# S2 catalog evidence — BIM-003-CYBER-PHARMA
Generated 2026-09-14T06:53:01.884Z by `scripts/rls-harness/audit-catalog.mjs` against host `aws-1-us-west-1.pooler.supabase.com` (scratch throwaway, ENV_NOTE.md). Every mutation below ran inside a rolled-back transaction.

## RISK-1 — definer owner can insert through FORCE RLS
| current_user | rolbypassrls | rolsuper |
|---|---|---|
| postgres | true | false |
- ✅ RISK-1 GREEN: migration role has BYPASSRLS, so SECURITY DEFINER inserts into the FORCED, policy-less audit_logs succeed — (first observed read-only 2026-09-14 13:1x before S1; re-confirmed here)

## AC-201 — exactly N = 4 functions in public whose names begin with owedbook_
| proname | args | result |
|---|---|---|
| owedbook_kpis | p_business_id uuid, p_from date, p_to date, p_pbms text[], p_filter text | TABLE(commercial_underpaid numeric, commercial_scripts bigint, updated_difference numeric, owed numeric) |
| owedbook_pbm_options | p_business_id uuid | SETOF text |
| owedbook_rows | p_business_id uuid, p_tab text, p_from date, p_to date, p_pbms text[], p_filter text, p_page integer, p_limit integer | jsonb |
| owedbook_summary | p_business_id uuid, p_from date, p_to date, p_pbms text[], p_filter text | TABLE(pbm text, commercial_dollars numeric, federal_dollars numeric) |
- ✅ pg_proc count = 4
- ✅ the four names match E-0 exactly

## AC-202 — every wrapper: SECURITY DEFINER, search_path pinned, EXECUTE to authenticated, revoked from public and anon
| proname | prosecdef | cfg | acl |
|---|---|---|---|
| owedbook_kpis | true | {"search_path=\"\""} | {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres} |
| owedbook_pbm_options | true | {"search_path=\"\""} | {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres} |
| owedbook_rows | true | {"search_path=\"\""} | {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres} |
| owedbook_summary | true | {"search_path=\"\""} | {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres} |
- ✅ owedbook_kpis: secdef=true cfg={"search_path=\"\""} anon=false authenticated=true service_role=true PUBLIC-entry=false
- ✅ owedbook_pbm_options: secdef=true cfg={"search_path=\"\""} anon=false authenticated=true service_role=true PUBLIC-entry=false
- ✅ owedbook_rows: secdef=true cfg={"search_path=\"\""} anon=false authenticated=true service_role=true PUBLIC-entry=false
- ✅ owedbook_summary: secdef=true cfg={"search_path=\"\""} anon=false authenticated=true service_role=true PUBLIC-entry=false
- ✅ anon EXECUTE owedbook_kpis refused at run time — 42501 permission denied for function owedbook_kpis
- ✅ anon EXECUTE owedbook_rows refused at run time — 42501 permission denied for function owedbook_rows
- ✅ anon EXECUTE owedbook_summary refused at run time — 42501 permission denied for function owedbook_summary
- ✅ anon EXECUTE owedbook_pbm_options refused at run time — 42501 permission denied for function owedbook_pbm_options

## AC-203 — first parameter is p_business_id uuid on all four
| proname | first_arg | first_type |
|---|---|---|
| owedbook_kpis | p_business_id | uuid |
| owedbook_pbm_options | p_business_id | uuid |
| owedbook_rows | p_business_id | uuid |
| owedbook_summary | p_business_id | uuid |
- ✅ proargnames[1] = 'p_business_id', proargtypes[0] = uuid, all four

## Body shape (Brief §5) — membership check, then ONE read_page insert, then the read
- ✅ owedbook_kpis: membership@151 < raise@198 < insert@321 < read@1350; audit inserts = 1; explicit business_id fence × 1
- ✅ owedbook_kpis: action 'read_page' and context.fn = 'owedbook_kpis'
- ✅ owedbook_pbm_options: membership@81 < raise@128 < insert@215 < read@784; audit inserts = 1; explicit business_id fence × 1
- ✅ owedbook_pbm_options: action 'read_page' and context.fn = 'owedbook_pbm_options'
- ✅ owedbook_rows: membership@328 < raise@375 < insert@869 < read@1862; audit inserts = 1; explicit business_id fence × 2
- ✅ owedbook_rows: action 'read_page' and context.fn = 'owedbook_rows'
- ✅ owedbook_summary: membership@81 < raise@128 < insert@215 < read@1221; audit inserts = 1; explicit business_id fence × 1
- ✅ owedbook_summary: action 'read_page' and context.fn = 'owedbook_summary'

## Prior-stage invariants still hold
- ✅ audit_logs: 1 policy, RLS enabled+forced; audit_write stamps = 13

## Verdict
**S2 CATALOG GREEN** — every assertion above holds.
