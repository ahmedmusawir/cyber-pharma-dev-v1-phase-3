-- BIM-001 · 0005_pending_registrations — manual-verification onboarding.
-- FRANK_API verbatim (models.py:354-493). Built now per manager §5 row 6:
-- Frank's onboarding-approval confirm is pending; the table costs nothing empty.
-- Divergences: verified_by_user_id references auth.users (no custom users table,
-- TRIANGULATION §3.1); uuid PK per fidelity rule.

create table public.pending_registrations (
  id uuid primary key default gen_random_uuid(),
  ncpdp text not null,
  npi text not null,
  email text not null,
  pharmacy_name text,
  phone text,
  address text,
  address_line2 text,
  city text,
  state text,
  zip text,
  fax text,
  contact_person text,
  contact_person_last_name text,
  pharmacy_license_number text,
  pharmacist_license text,
  country text,
  pharmacy_software_system text,
  role_in_pharmacy text,
  mobile_number text,
  website_url text,
  -- desktop-converter linking (existing business gaining a new admin)
  activation_key text,
  desktop_username text,
  is_desktop_converter boolean not null default false,
  business_id uuid references public.businesses (id),
  status text not null default 'pending_verification'
    check (status in ('pending_verification', 'approved', 'rejected', 'expired', 'completed')),
  verified_by_user_id uuid references auth.users (id),
  verified_at timestamptz,
  verification_notes text,
  activation_token text unique,      -- secrets.token_urlsafe(32) grammar, 7-day TTL (catalog)
  activation_token_expires_at timestamptz,
  activation_link_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_pending_reg_email_business unique (email, ncpdp, npi)  -- catalog
);

create index idx_pending_registrations_email on public.pending_registrations (email);
create index idx_pending_registrations_status on public.pending_registrations (status);

alter table public.pending_registrations enable row level security;

create trigger set_updated_at
  before update on public.pending_registrations
  for each row execute function public.update_updated_at();
