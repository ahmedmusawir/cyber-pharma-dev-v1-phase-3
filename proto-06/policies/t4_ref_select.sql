-- T-4 · Reference-table read: platform-shared read for authenticated;
-- writes stay locked (no write policies — service role is the only writer).
create policy "ref_select_authenticated"
  on public.ref_data
  for select
  to authenticated
  using (true);
