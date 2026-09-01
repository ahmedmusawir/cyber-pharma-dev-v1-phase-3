-- BIM-002 · 0025 · ful_reference — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.ful_reference') is null then
    raise exception 'BIM-002/0025 ASSERT: public.ful_reference missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.ful_reference'::regclass) then
    raise exception 'BIM-002/0025 ASSERT: RLS not enabled on ful_reference.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='ful_reference') then
    raise exception 'BIM-002/0025 ASSERT: ful_reference already carries a policy.'; end if;
end $$;

create policy "ful_reference_select_authenticated"
  on public.ful_reference for select to authenticated
  using (true);
