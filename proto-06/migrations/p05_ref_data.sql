-- PROTO-06 · p05_ref_data — platform-shared reference stand-in: NO business_id.
-- T-4 will prove authenticated read / service-role-only write. Born deny-by-default.
create table public.ref_data (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  value text
);
alter table public.ref_data enable row level security;
