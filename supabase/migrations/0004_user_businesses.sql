-- BIM-001 · 0004_user_businesses — the per-store membership/capability junction.
-- FRANK_API junction verbatim (models.py:306-351), with:
--   · user_id references auth.users — identity layer is Supabase Auth, the
--     custom users table does not exist in the rebuild [TRIANGULATION §3.1]
--   · role vocabulary 'admin'|'member' via TEXT + CHECK — NOT an enum; the
--     CHECK is the v2 seam for GHL-style alterable permissions. Catalog used
--     'admin'|'user' with default 'user'; 'user' → 'member'   [ruling R-3]
-- RLS membership reads THIS junction only; no policy may consult user_roles
-- (R-3). BIM-002 writes those policies — this module writes none.

create table public.user_businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  is_primary boolean not null default false,   -- one primary per user (app-enforced, per catalog)
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_user_business unique (user_id, business_id)  -- catalog uq_user_business
);

create index idx_user_businesses_user_id on public.user_businesses (user_id);
create index idx_user_businesses_business_id on public.user_businesses (business_id);

alter table public.user_businesses enable row level security;

create trigger set_updated_at
  before update on public.user_businesses
  for each row execute function public.update_updated_at();
