-- T-1 · Tenant SELECT: authenticated reads on fact_data scoped by junction membership.
create policy "fact_select_member"
  on public.fact_data
  for select
  to authenticated
  using (public.is_member_of(business_id));
