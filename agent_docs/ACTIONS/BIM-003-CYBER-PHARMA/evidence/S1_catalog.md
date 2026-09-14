# S1 catalog evidence — BIM-003-CYBER-PHARMA
Generated 2026-09-14T06:50:44.307Z by `scripts/rls-harness/audit-catalog.mjs` against host `aws-1-us-west-1.pooler.supabase.com` (scratch throwaway, ENV_NOTE.md). Every mutation below ran inside a rolled-back transaction.

## RISK-1 — definer owner can insert through FORCE RLS
| current_user | rolbypassrls | rolsuper |
|---|---|---|
| postgres | true | false |
- ✅ RISK-1 GREEN: migration role has BYPASSRLS, so SECURITY DEFINER inserts into the FORCED, policy-less audit_logs succeed — (first observed read-only 2026-09-14 13:1x before S1; re-confirmed here)

## AC-102 — audit_logs columns, in order
| attnum | attname | type | notnull | dflt |
|---|---|---|---|---|
| 1 | id | bigint | null | null |
| 2 | occurred_at | timestamp with time zone | null | now() |
| 3 | actor_user_id | uuid | null | null |
| 4 | actor_role | text | null | null |
| 5 | business_id | uuid | null | null |
| 6 | table_name | text | null | null |
| 7 | row_id | text | null | null |
| 8 | action | text | null | null |
| 9 | old_data | jsonb | null | null |
| 10 | new_data | jsonb | null | null |
| 11 | context | jsonb | null | null |
- ✅ exactly these eleven columns in Brief §3 order (11 found)

## AC-103 — action CHECK: exactly four values; a fifth is rejected
| conname | def |
|---|---|
| audit_logs_action_check | CHECK ((action = ANY (ARRAY['insert'::text, 'update'::text, 'delete'::text, 'read_page'::text]))) |
- ✅ positive: action='insert' accepted
- ✅ positive: action='update' accepted
- ✅ positive: action='delete' accepted
- ✅ positive: action='read_page' accepted
- ✅ negative: action='archive' rejected — 23514 new row for relation "audit_logs" violates check constraint "audit_logs_action_check"

## AC-104 — indexes beyond the primary key
| indexname | indexdef |
|---|---|
| idx_audit_logs_business_occurred | CREATE INDEX idx_audit_logs_business_occurred ON public.audit_logs USING btree (business_id, occurred_at) |
| idx_audit_logs_occurred_at | CREATE INDEX idx_audit_logs_occurred_at ON public.audit_logs USING btree (occurred_at) |
| idx_audit_logs_table_row | CREATE INDEX idx_audit_logs_table_row ON public.audit_logs USING btree (table_name, row_id) |
- ✅ exactly three: (occurred_at) · (business_id, occurred_at) · (table_name, row_id)

## AC-105 — BEFORE UPDATE OR DELETE trigger calling a function that raises unconditionally
| tgname | def |
|---|---|
| audit_logs_immutable | CREATE TRIGGER audit_logs_immutable BEFORE DELETE OR UPDATE ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable() |
| audit_logs_no_truncate | CREATE TRIGGER audit_logs_no_truncate BEFORE TRUNCATE ON public.audit_logs FOR EACH STATEMENT EXECUTE FUNCTION audit_logs_immutable() |
```sql
begin
  raise exception 'audit_logs is append-only';
end;
```
- ✅ BEFORE UPDATE OR DELETE … FOR EACH ROW → audit_logs_immutable()
- ✅ function body is a bare RAISE EXCEPTION — no IF, no WHEN, no role check
- ✅ plus BEFORE TRUNCATE statement trigger (row triggers never see TRUNCATE) — addition, reported in S1

## AC-107 — RLS enabled AND forced
| relrowsecurity | relforcerowsecurity |
|---|---|
| true | true |
- ✅ relrowsecurity = true, relforcerowsecurity = true

## AC-108 — exactly one policy: SELECT to authenticated; zero INSERT/UPDATE/DELETE
| policyname | cmd | roles | permissive | qual |
|---|---|---|---|---|
| audit_logs_select_admin | SELECT | {authenticated} | PERMISSIVE | is_admin_of(business_id) |
- ✅ one policy, SELECT, {authenticated}
- ✅ zero write policies
Table privileges (RF-3 — UPDATE/DELETE revoked from anon and authenticated; INSERT left to RLS):
| grantee | privs |
|---|---|
| anon | INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE |
| authenticated | INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE |
| postgres | DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE |
| service_role | DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE |
- ✅ anon: UPDATE=false DELETE=false (both false) — INSERT=true SELECT=true kept — RLS decides
- ✅ authenticated: UPDATE=false DELETE=false (both false) — INSERT=true SELECT=true kept — RLS decides

## AC-114 — audit_write(): SECURITY DEFINER, search_path pinned, EXECUTE revoked from public and anon
| proname | prosecdef | cfg | acl | rettype |
|---|---|---|---|---|
| audit_write | true | {"search_path=\"\""} | {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres} | trigger |
- ✅ prosecdef = true (SECURITY DEFINER)
- ✅ proconfig pins search_path — {"search_path=\"\""}
- ✅ no bare =X/ (PUBLIC) and no anon=X in proacl; has_function_privilege(anon) = false — authenticated=true service_role=true (trigger firing never checks EXECUTE)

## AC-115 — thirteen tables carry audit_write, AFTER INSERT OR UPDATE OR DELETE … FOR EACH ROW (E-0)
| relname | def |
|---|---|
| aac_reference | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.aac_reference FOR EACH ROW EXECUTE FUNCTION audit_write() |
| accounts | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION audit_write() |
| apa_memberships | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.apa_memberships FOR EACH ROW EXECUTE FUNCTION audit_write() |
| businesses | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION audit_write() |
| ful_reference | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.ful_reference FOR EACH ROW EXECUTE FUNCTION audit_write() |
| pbm_info | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.pbm_info FOR EACH ROW EXECUTE FUNCTION audit_write() |
| pending_registrations | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.pending_registrations FOR EACH ROW EXECUTE FUNCTION audit_write() |
| reference_dataset_versions | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.reference_dataset_versions FOR EACH ROW EXECUTE FUNCTION audit_write() |
| report_files | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.report_files FOR EACH ROW EXECUTE FUNCTION audit_write() |
| subscriptions | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION audit_write() |
| user_businesses | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.user_businesses FOR EACH ROW EXECUTE FUNCTION audit_write() |
| user_data | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.user_data FOR EACH ROW EXECUTE FUNCTION audit_write() |
| wac_reference | CREATE TRIGGER audit_write AFTER INSERT OR DELETE OR UPDATE ON public.wac_reference FOR EACH ROW EXECUTE FUNCTION audit_write() |
- ✅ pg_trigger count = 13
- ✅ the thirteen names match E-0 exactly
- ✅ every stamp is AFTER INSERT OR DELETE OR UPDATE … FOR EACH ROW (pg_get_triggerdef prints events in catalog order and omits the schema when it is on the search path)
Not stamped (by ruling): audit_logs, profiles, user_roles
- ✅ exactly audit_logs (self), profiles, user_roles (baseline) are unstamped

## Smoke walk (rolled back) — the trigger writes what R-2/R-8 say, and the guard holds for the owner
| table_name | action | actor_role | actor_user_id | business_id | row_id | context | has_old | has_new |
|---|---|---|---|---|---|---|---|---|
| accounts | insert | postgres | null | null | 26fef845-a034-433d-b941-dbba5ab433e0 | [object Object] | false | true |
| businesses | insert | postgres | null | 5bde6b2a-458c-4b6c-a570-f5452b4dc16e | 5bde6b2a-458c-4b6c-a570-f5452b4dc16e | null | false | true |
| user_data | insert | postgres | null | 5bde6b2a-458c-4b6c-a570-f5452b4dc16e | 0921c7d8-1f77-4f79-b113-810f9f4d3e2d | null | false | true |
| user_data | update | postgres | null | 5bde6b2a-458c-4b6c-a570-f5452b4dc16e | 0921c7d8-1f77-4f79-b113-810f9f4d3e2d | null | true | true |
| user_data | delete | postgres | null | 5bde6b2a-458c-4b6c-a570-f5452b4dc16e | 0921c7d8-1f77-4f79-b113-810f9f4d3e2d | null | true | false |
- ✅ accounts (R-8): business_id NULL, context carries {id}
- ✅ businesses special-case: business_id = the row's own id
- ✅ user_data insert: business_id from row, row_id = pk, new_data only
- ✅ user_data update: old_data AND new_data
- ✅ user_data delete: old_data only
- ✅ direct-connection writes: actor_role = 'postgres' (current_user fallback), actor_user_id NULL
- ✅ exactly five trail rows for five writes (5)
- ✅ owner UPDATE audit_logs raises (R-6, below RLS) — P0001 audit_logs is append-only
- ✅ owner DELETE audit_logs raises (R-6) — P0001 audit_logs is append-only
- ✅ owner TRUNCATE audit_logs raises (statement guard) — P0001 audit_logs is append-only
- ✅ authenticated UPDATE audit_logs → 42501 permission denied (RF-3 revoke) — 42501 permission denied for table audit_logs
- ✅ authenticated DELETE audit_logs → 42501 permission denied (RF-3 revoke) — 42501 permission denied for table audit_logs
- ✅ authenticated INSERT audit_logs → 42501 RLS violation (no policy — AC-113 shape) — 42501 new row violates row-level security policy for table "audit_logs"

## Verdict
**S1 CATALOG GREEN** — every assertion above holds.
