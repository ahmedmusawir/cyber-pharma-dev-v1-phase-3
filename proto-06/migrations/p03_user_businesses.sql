-- PROTO-06 · p03_user_businesses — THE junction (Gap-6: the ONLY membership
-- source any policy may read; role vocabulary per R-3).
create table public.user_businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  is_primary boolean not null default false,
  unique (user_id, business_id)
);
create index idx_ub_user_business on public.user_businesses (user_id, business_id);
alter table public.user_businesses enable row level security;
