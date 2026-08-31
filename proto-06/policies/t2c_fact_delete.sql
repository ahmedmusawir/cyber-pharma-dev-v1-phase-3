-- T-2c · Tenant DELETE: USING only (no new row to check).
create policy "fact_delete_member"
  on public.fact_data
  for delete
  to authenticated
  using (public.is_member_of(business_id));
