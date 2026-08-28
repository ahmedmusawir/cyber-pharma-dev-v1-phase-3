-- BIM-001 · 0010_wac_reference — Wholesale Acquisition Cost.
-- FRANK_API shape (models.py:737-775, UK (ndc, effective_date)) with the
-- ratified divergences:
--   · pkg_size / pkg_size_mult / generic_indicator adopted from TONY_DEMO
--     alt_rates — the WAC-derive formula inputs [TRIANGULATION §3.3 + MATH_SPEC;
--     Format Map Finding 1: alt_rates IS the WAC table]
--   · Computed column wac_by_unit DROPPED — derive in app [TRIANGULATION §3.3
--     smell resolution; cross-driver portability burn]
--   · one brand/generic name: generic_indicator; `bg` never enters (law §6.6)

create table public.wac_reference (
  id uuid primary key default gen_random_uuid(),
  ndc text not null,
  effective_date date not null,
  wac numeric,
  pkg_size numeric,
  pkg_size_mult numeric,
  generic_indicator text,
  drug_name text,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_wac_reference_ndc_date unique (ndc, effective_date)
);

alter table public.wac_reference enable row level security;

create trigger set_updated_at
  before update on public.wac_reference
  for each row execute function public.update_updated_at();
