-- BIM-001 · 0007_apa_memberships — APA20 discount eligibility.
-- FRANK_API verbatim (models.py:573-636). license_number normalization
-- (strip spaces, uppercase) is APPLICATION-side per the catalog's @validates —
-- not a DB constraint here. discount_redeemed_business_id is a soft reference
-- by design (catalog: "Not a FK"); uuid type per the rebuild's PK idiom.

create table public.apa_memberships (
  id uuid primary key default gen_random_uuid(),
  license_number text not null unique,
  membership text not null,
  membership_expires date,
  first_name text not null,
  last_name text not null,
  discount_redeemed boolean not null default false,
  discount_redeemed_at timestamptz,
  discount_redeemed_business_id uuid,   -- soft reference, no FK (catalog)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apa_memberships enable row level security;

create trigger set_updated_at
  before update on public.apa_memberships
  for each row execute function public.update_updated_at();
