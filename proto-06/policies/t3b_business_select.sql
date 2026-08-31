-- T-3 companion (8th policy, Director-approved 2026-08-31, FINDING-1).
-- A write policy without a paired SELECT is dead code: Postgres evaluates the
-- UPDATE's WHERE against SELECT-visible rows, so business_update_admin matched
-- zero rows until this landed. Different operation (SELECT) — one-per-op law intact.
-- T-1 pattern on businesses: members read their own stores.
create policy "business_select_member"
  on public.businesses
  for select
  to authenticated
  using (public.is_member_of(id));
