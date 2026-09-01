-- BIM-002 · 0019 · businesses — T-1 read + T-3 role-gated write.
-- SELECT is created FIRST and the write SECOND, in this file, by law:
-- Proto 06 FINDINGS F-1 — Postgres evaluates an UPDATE's WHERE under SELECT-read
-- semantics, so a write policy on a table with no SELECT policy silently affects
-- zero rows. That defect is invisible at review time and indistinguishable from
-- a legitimate deny at runtime.
-- SELECT uses formulation C (X2, adopted by evidence): the set-returning DEFINER
-- helper is hashed once by the planner instead of invoked per row.
-- UPDATE keeps the scalar helper: write predicates resolve few rows, and the role
-- gate reads the junction's role column (Gap-6), never user_roles.
do $$
begin
  if to_regclass('public.businesses') is null then
    raise exception 'BIM-002/0019 ASSERT: public.businesses missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.businesses'::regclass) then
    raise exception 'BIM-002/0019 ASSERT: RLS not enabled on businesses.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0019 ASSERT: junction-first law — user_businesses needs its SELECT policy (0017) before any tenant policy lands.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='businesses') then
    raise exception 'BIM-002/0019 ASSERT: businesses already carries a policy.'; end if;
end $$;

create policy "business_select_member"
  on public.businesses for select to authenticated
  using (id in (select public.my_business_ids()));

create policy "business_update_admin"
  on public.businesses for update to authenticated
  using (public.is_admin_of(id))
  with check (public.is_admin_of(id));
