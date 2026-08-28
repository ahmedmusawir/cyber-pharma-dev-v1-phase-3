-- BIM-001 · 0013_user_data — the PHI fact table (prescription/dispensing records).
-- FRANK_API FULL column set (models.py:661-735 via FRANK_API-02 catalog;
-- TRIANGULATION §3.2: "Use FRANK_API's column set as canonical" — the demo's
-- 11-column subset would lose the audit trail). Ratified divergences:
--   · pcn, group_field, pbm_key, owed columns added   [manager §5 row 9 — the
--     pbm_key inputs the demo-era claims never carried, Format Map Finding 2]
--   · medicaid_method NULLable + CHECK on the seven MATH_SPEC §9 values;
--     the desktop's Path-A empty-string maps to NULL AT IMPORT (importer
--     mapping documented here, IMPLEMENTED in BIM-004); 'Portal' excluded
--     (commented-out code is not vocabulary); widening only via spec AC10's
--     amendment path              [Architect ruling 2026-08-28 — medicaid_method]
--   · business_id is uuid FK; "Never accept business_id from client; always
--     derive from authenticated session" (catalog models.py:672) — service-layer
--     law for BIM-005+, recorded at the schema for the reader.
-- Money NUMERIC everywhere a dollar lives (law §6.2). NDC/script/bin/pcn/
-- group_field TEXT (law §6.3). RLS policies are BIM-002's — none here.

create table public.user_data (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),

  -- claim identity + dispensing facts (source-file-driven)
  date_dispensed date,
  script text,                       -- Rx number, de-facto claim key (dedup key in upsert, catalog)
  drug_name text,
  drug_ndc text,
  qty numeric,
  insurance text,
  source_file text,
  status text,
  bin text,
  pcn text,                          -- pbm_key input [manager §5 row 9]
  group_field text,                  -- pbm_key input [manager §5 row 9]
  pbm_key text,                      -- canonical match key COLUMN; derivation is Phase 5's

  -- money (all NUMERIC, law §6.2)
  medicaid_rate numeric,
  acq numeric,
  acq_net numeric,
  difference numeric,
  total_paid numeric,
  payment numeric,                   -- check-payments concept (Format Map §4)
  new_paid numeric,
  expected_paid numeric,
  new_owed numeric,
  owed numeric,                      -- [manager §5 row 9]

  -- medicaid method: constrained vocabulary [Architect ruling 2026-08-28]
  medicaid_method text check (medicaid_method in
    ('AAC', 'FUL', 'GWAC', 'BWAC', 'Take Action', 'Manual Override', 'Legacy')),

  -- desktop-side enrichment (catalog verbatim)
  customer_name text,
  first_name text,
  last_name text,
  customer_id text,
  day_supply integer,
  authorization_number text,
  customer_group_number text,
  script_pcn text,
  compound text,
  drug_340b text,
  drug_preferred_vendor text,
  insurance_rejection_codes text,
  primary_network_reimbursement_id text,
  gpi text,
  nadac numeric,
  awp numeric,
  payer_type text,

  -- rate-recalc audit trail (catalog verbatim; the columns the demo lost)
  aac_date_used date,
  wac_date_used date,
  ful_year_used integer,
  ful_month_used integer,
  rate_source text,
  medicaid_rate_calculated_at timestamptz,
  medicaid_rate_original numeric,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_user_data_business_id on public.user_data (business_id);

alter table public.user_data enable row level security;

create trigger set_updated_at
  before update on public.user_data
  for each row execute function public.update_updated_at();
