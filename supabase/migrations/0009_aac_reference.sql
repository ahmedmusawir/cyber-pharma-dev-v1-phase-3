-- BIM-001 · 0009_aac_reference — Actual Acquisition Cost by NDC.
-- FRANK_API shape (models.py:865-883): UK (ndc, aac_date). aac_date IS the
-- effective/as-of-dispense-date join key (manager §5 row 11 + Format Map §3 —
-- no second date column is invented). Money NUMERIC (law §6.2); NDC TEXT (§6.3).
-- Provenance trio per law §6.4.

create table public.aac_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  aac_date date not null,            -- the effective-date join key
  aac numeric,
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_aac_reference_ndc_date unique (ndc, aac_date)
);

alter table public.aac_reference enable row level security;

create trigger set_updated_at
  before update on public.aac_reference
  for each row execute function public.update_updated_at();
