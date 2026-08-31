-- PROTO-06 · p02_businesses — store under an account. Minimal columns.
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id),
  name text not null
);
alter table public.businesses enable row level security;
