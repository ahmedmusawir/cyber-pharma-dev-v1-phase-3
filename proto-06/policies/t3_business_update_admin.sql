-- T-3 · Role-gated write: admin-only mutation on a tenant table.
-- Landed on businesses.UPDATE (not fact_data) so the one-policy-per-operation
-- law holds — fact_data's write ops are already owned by T-2's member policies.
-- The role gate reads the JUNCTION role via is_admin_of (Gap-6), never user_roles.
create policy "business_update_admin"
  on public.businesses
  for update
  to authenticated
  using (public.is_admin_of(id))
  with check (public.is_admin_of(id));
