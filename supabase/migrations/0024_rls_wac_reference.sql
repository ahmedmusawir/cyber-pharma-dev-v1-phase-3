-- BIM-002 · 0024 · wac_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.wac_reference') is null then
    raise exception 'BIM-002/0024 ASSERT: public.wac_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.wac_reference'::regclass) then
    raise exception 'BIM-002/0024 ASSERT: RLS not enabled on wac_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='wac_reference') then
    raise exception 'BIM-002/0024 ASSERT: wac_reference already carries a policy.'; end if;
end $$;

create policy "wac_reference_select_authenticated"
  on public.wac_reference for select to authenticated
  using (true);
