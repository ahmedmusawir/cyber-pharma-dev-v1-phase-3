-- BIM-002 · 0017 · user_businesses — T-5 junction self-visibility.
-- LANDS FIRST (junction-first law, X2 decision §5.1): every other tenant policy
-- reasons about membership, and formulation B (adopted nowhere, but guarded
-- against) would be silently blinded without this. Direct auth.uid() comparison,
-- never a helper — a helper here would be self-referential (Proto 06 F-7).
-- Writes stay service-role only: no INSERT/UPDATE/DELETE policy exists, which is
-- what makes junction role-tampering structurally impossible rather than merely
-- unlikely (Gap-6 / BIM-001 R-3).
do $$
begin
  if to_regclass('public.user_businesses') is null then
    raise exception 'BIM-002/0017 ASSERT: public.user_businesses missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.user_businesses'::regclass) then
    raise exception 'BIM-002/0017 ASSERT: RLS not enabled on user_businesses (deny-by-default law).'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0017 ASSERT: a SELECT policy already exists on user_businesses (one-per-op law).'; end if;
end $$;

create policy "ub_select_self"
  on public.user_businesses for select to authenticated
  using (user_id = auth.uid());
