-- BIM-002 · 0021 · user_data — the PHI fact table. Full T-1 + T-2 set.
-- Order in this file IS the law (F-1/F-8): SELECT, then INSERT, UPDATE, DELETE.
--
-- SELECT  — formulation C (X2): hashed once by the planner. At 100k rows this is
--           29.6 ms vs 1,685 ms for the per-row scalar helper.
-- INSERT  — WITH CHECK, never USING (the classic RLS authoring error). This is
--           what makes "business_id never comes from the client" a DATABASE
--           guarantee rather than a service-layer convention: a hand-supplied
--           foreign business_id fails with 42501.
-- UPDATE  — USING gates which rows are reachable; WITH CHECK gates what they may
--           BECOME, blocking a re-home of a row into a foreign business_id.
-- DELETE  — is_admin_of, not is_member_of: claim deletion is an admin act
--           (manager §5.2 row 9, Architect's call; STANDS per Director FLAG-6).
-- Writes keep the scalar helper deliberately: they resolve few rows, and write
-- legality must not depend on what the caller can SEE.
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-002/0021 ASSERT: public.user_data missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.user_data'::regclass) then
    raise exception 'BIM-002/0021 ASSERT: RLS not enabled on user_data.'; end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_businesses' and cmd='SELECT') then
    raise exception 'BIM-002/0021 ASSERT: junction-first law — 0017 must land first.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='user_data') then
    raise exception 'BIM-002/0021 ASSERT: user_data already carries a policy.'; end if;
end $$;

create policy "user_data_select_member"
  on public.user_data for select to authenticated
  using (business_id in (select public.my_business_ids()));

create policy "user_data_insert_member"
  on public.user_data for insert to authenticated
  with check (public.is_member_of(business_id));

create policy "user_data_update_member"
  on public.user_data for update to authenticated
  using (public.is_member_of(business_id))
  with check (public.is_member_of(business_id));

create policy "user_data_delete_admin"
  on public.user_data for delete to authenticated
  using (public.is_admin_of(business_id));
