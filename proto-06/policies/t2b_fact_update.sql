-- T-2b · Tenant UPDATE: USING gates which rows are reachable; WITH CHECK gates
-- what they may become (blocks re-homing a row into a foreign business_id).
create policy "fact_update_member"
  on public.fact_data
  for update
  to authenticated
  using (public.is_member_of(business_id))
  with check (public.is_member_of(business_id));
