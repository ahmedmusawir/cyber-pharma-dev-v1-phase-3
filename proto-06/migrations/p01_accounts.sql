-- PROTO-06 · p01_accounts — rig miniature (R-2 spine stand-in). Minimal columns.
-- Deny-by-default law: RLS enabled at birth, ZERO policies (R2 adds them one at a time).
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users (id)
);
alter table public.accounts enable row level security;
