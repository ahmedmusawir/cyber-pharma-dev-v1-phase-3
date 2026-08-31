-- T-2a · Tenant INSERT: WITH CHECK (not USING — the classic asymmetry, landmine §7.4).
-- business_id is never trusted from the client: a foreign business_id fails membership.
create policy "fact_insert_member"
  on public.fact_data
  for insert
  to authenticated
  with check (public.is_member_of(business_id));
