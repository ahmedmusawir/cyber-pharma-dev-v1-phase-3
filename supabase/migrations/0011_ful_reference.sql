-- BIM-001 · 0011_ful_reference — Federal Upper Limit.
-- FRANK_API shape (models.py:778-799): UK (ndc, year, month); aca_ful
-- Numeric(12,6) kept at catalog precision. Provenance per law §6.4.

create table public.ful_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  year integer not null,
  month integer not null,
  aca_ful numeric(12, 6),
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_ful_reference_ndc_year_month unique (ndc, year, month)
);

alter table public.ful_reference enable row level security;

create trigger set_updated_at
  before update on public.ful_reference
  for each row execute function public.update_updated_at();
