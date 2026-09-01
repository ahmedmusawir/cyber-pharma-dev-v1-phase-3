-- BIM-002 · 0022 · report_files — T-1 read only.
-- The Phase 6 PDF pipeline writes via service role; no write policy in v1.
-- Carries BIM-001's fidelity flag (columns never enumerated in the FRANK
-- catalog) — untouched here, rides to BIM-004/005.
do $$
begin
  if to_regclass('public.report_files') is null then
    raise exception 'BIM-002/0022 ASSERT: public.report_files missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.report_files'::regclass) then
    raise exception 'BIM-002/0022 ASSERT: RLS not enabled on report_files.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0022 ASSERT: junction-first law — 0017 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='report_files') then
    raise exception 'BIM-002/0022 ASSERT: report_files already carries a policy.'; end if;
end $$;

create policy "report_files_select_member"
  on public.report_files for select to authenticated
  using (business_id in (select public.my_business_ids()));
