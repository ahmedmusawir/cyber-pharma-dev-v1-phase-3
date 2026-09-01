-- BIM-002 · 0027 · reference_dataset_versions — T-4 platform-shared reference read.
-- Every authenticated identity reads; NO write policy exists, so writes are
-- locked to the service role BY OMISSION — deliberate, not an oversight.
-- Reference data is not tenant-scoped: it has no business_id and never should.
do $$
begin
  if to_regclass('public.reference_dataset_versions') is null then
    raise exception 'BIM-002/0027 ASSERT: public.reference_dataset_versions missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.reference_dataset_versions'::regclass) then
    raise exception 'BIM-002/0027 ASSERT: RLS not enabled on reference_dataset_versions.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='reference_dataset_versions') then
    raise exception 'BIM-002/0027 ASSERT: reference_dataset_versions already carries a policy.'; end if;
end $$;

create policy "reference_dataset_versions_select_authenticated"
  on public.reference_dataset_versions for select to authenticated
  using (true);
