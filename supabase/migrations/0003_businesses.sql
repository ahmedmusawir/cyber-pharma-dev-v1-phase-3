-- BIM-001 · 0003_businesses — the store/tenant entity.
-- FRANK_API `businesses` verbatim (models.py:13-183 via FRANK_API-02 catalog),
-- Postgres idiom per AUTHORITY_README fidelity rule (Integer PK → uuid,
-- String(n) → text, DateTime → timestamptz). Deliberate divergences:
--   · account_id NOT NULL FK → accounts        [ruling R-2: the accounts spine]
--   · pharmacy_slug (unique)                   [TONY_DEMO adoption, TRIANGULATION §3.1]
--   · subscription-STATE fields moved OUT to subscriptions(account_id):
--     stripe_subscription_id, stripe_checkout_session_id, subscription_status,
--     promotion_code, trial_end_date, current_period_end, cancel_at_period_end
--                                              [TRIANGULATION §3.5 + ruling R-2]
--   · stripe_customer_id + has_used_trial stay here (customer identity + the
--     one-trial-per-NCPDP+NPI anti-abuse flag)  [manager §5 row 2]
--   · legacy pharmacy_profile table: never created [TRIANGULATION §3.1 — DROP]

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id),
  ncpdp text not null,                -- TEXT: leading zeros are data (law §6.3)
  npi text not null,
  pharmacy_name text not null,
  address text,
  address_line2 text,
  city text,
  state text,
  zip text,
  phone text,
  fax text,
  email text,
  pharmacy_license_number text,
  pharmacist_license text,
  contact_person text,
  contact_person_last_name text,
  business_email text,
  website_url text,
  time_zone text,
  preferred_contact_method text,
  country text,
  pharmacy_software_system text,
  role_in_pharmacy text,
  mobile_number text,
  ghl_contact_id text,
  ghl_company_id text,
  date_of_registration timestamptz,
  -- lifecycle vocabulary as documented in the catalog (pending → active; suspended valid)
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  pharmacy_slug text unique,
  stripe_customer_id text,
  has_used_trial boolean not null default false,
  activation_key text unique,        -- set NULL after consumption (catalog business.py:899)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_businesses_ncpdp_npi unique (ncpdp, npi)  -- catalog _ncpdp_npi_uc
);

create index idx_businesses_account_id on public.businesses (account_id);

alter table public.businesses enable row level security;

create trigger set_updated_at
  before update on public.businesses
  for each row execute function public.update_updated_at();
