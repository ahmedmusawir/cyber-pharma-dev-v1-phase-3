-- BIM-002 · 0026 · pbm_info — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.pbm_info') is null then
    raise exception 'BIM-002/0026 ASSERT: public.pbm_info missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.pbm_info'::regclass) then
    raise exception 'BIM-002/0026 ASSERT: RLS not enabled on pbm_info.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='pbm_info') then
    raise exception 'BIM-002/0026 ASSERT: pbm_info already carries a policy.'; end if;
end $$;

create policy "pbm_info_select_authenticated"
  on public.pbm_info for select to authenticated
  using (true);
