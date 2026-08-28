-- BIM-001 · 0012_pbm_info — PBM directory.
-- FRANK_API FULL shape (models.py:851-863: bin/pbm_name/pcn/state/email —
-- the demo's subset missed pcn+state, TRIANGULATION §3.3) plus the manager's
-- ratified columns: pbm_key (the canonical match key COLUMN; its derivation
-- function `{bin}-{pcn}-{group_field}` + BIN 004146 → '4146' is Phase 5's,
-- forbidden here per manager §8) and matching_type NOT NULL.
-- bin/pcn TEXT: leading zeros are data (law §6.3). Provenance per §6.4.

create table public.pbm_info (
  id uuid primary key default gen_random_uuid(),
  bin text not null,
  pbm_name text,
  pcn text,
  state text,
  email text,
  pbm_key text,                      -- column ships; derivation logic does NOT (Phase 5)
  matching_type text not null,
  source_file text,
  imported_at timestamptz,
  dataset_version_id uuid references public.reference_dataset_versions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pbm_info enable row level security;

create trigger set_updated_at
  before update on public.pbm_info
  for each row execute function public.update_updated_at();
