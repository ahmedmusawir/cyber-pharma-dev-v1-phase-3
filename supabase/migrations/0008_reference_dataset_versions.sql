-- BIM-001 · 0008_reference_dataset_versions — dataset-vintage registry.
-- FRANK_API shape (models.py:802-824): checksum + row_count + latest_upload_at
-- per dataset. Created FIRST in the reference family so the four reference
-- tables can carry their provenance FK (structural law §6.4).

create table public.reference_dataset_versions (
  id uuid primary key default gen_random_uuid(),
  dataset_name text not null unique,   -- per-dataset identity (aac / wac / ful / pbm_info)
  checksum text,
  row_count integer,
  latest_upload_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reference_dataset_versions enable row level security;

create trigger set_updated_at
  before update on public.reference_dataset_versions
  for each row execute function public.update_updated_at();
