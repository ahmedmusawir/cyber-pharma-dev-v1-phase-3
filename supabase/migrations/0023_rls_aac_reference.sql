-- BIM-002 · 0023 · aac_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.aac_reference') is null then
    raise exception 'BIM-002/0023 ASSERT: public.aac_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.aac_reference'::regclass) then
    raise exception 'BIM-002/0023 ASSERT: RLS not enabled on aac_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='aac_reference') then
    raise exception 'BIM-002/0023 ASSERT: aac_reference already carries a policy.'; end if;
end $$;

create policy "aac_reference_select_authenticated"
  on public.aac_reference for select to authenticated
  using (true);
