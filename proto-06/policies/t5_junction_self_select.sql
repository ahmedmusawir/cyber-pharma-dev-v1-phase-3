-- T-5 · Junction self-visibility: users read their OWN membership rows only.
-- Direct auth.uid() comparison — no helper needed (and using the helper here
-- would be circular). Junction writes stay service-role-only (no write policies).
create policy "ub_select_self"
  on public.user_businesses
  for select
  to authenticated
  using (user_id = auth.uid());
