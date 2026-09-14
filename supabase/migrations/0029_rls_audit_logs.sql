-- BIM-003-CYBER-PHARMA · 0029 · audit_logs — R-1: the ONE policy.
-- Junction ADMIN of the row's business may SELECT; member denied; no tenant INSERT,
-- UPDATE or DELETE policy exists (writes land only via the SECURITY DEFINER logging
-- functions or the service role; mutation is stopped below RLS by 0028's guard).
-- Reuses BIM-002's role-gated helper (TV-3: public.is_admin_of, 0016) — no new helper.
-- Rows with business_id NULL (R-8 platform/reference writes) are visible to no tenant:
-- is_admin_of(NULL) is false by construction.
do $$
begin
  if to_regclass('public.audit_logs') is null then
    raise exception 'BIM-003/0029 ASSERT: public.audit_logs missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0029 ASSERT: audit_logs is not in the 0028 shape — 0028 must land first.'; end if;
  if not (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.audit_logs'::regclass) then
    raise exception 'BIM-003/0029 ASSERT: RLS must be ENABLED and FORCED on audit_logs (0028).'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'is_admin_of') then
    raise exception 'BIM-003/0029 ASSERT: public.is_admin_of(uuid) missing — 0016 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'audit_logs') then
    raise exception 'BIM-003/0029 ASSERT: audit_logs already carries a policy (one-per-op law).'; end if;
end $$;

create policy "audit_logs_select_admin"
  on public.audit_logs for select to authenticated
  using (public.is_admin_of(business_id));
