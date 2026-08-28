-- BIM-001 · 0002_accounts — the organization/group spine (NEW, ruling R-2).
-- Sits above businesses (stores); subscription attaches HERE, not to stores.
-- No superadmin concept inside OwedBook — platform roles are MissionControl's.

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security; -- deny-by-default at birth (law §6.1); ensure_rls is the net, this is the belt

create trigger set_updated_at
  before update on public.accounts
  for each row execute function public.update_updated_at();
