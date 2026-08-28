-- BIM-001 · 0014_report_files — generated PDF report metadata, per business.
-- FRANK_API models.py:826-849; Phase 6 consumer, built now empty (manager §5
-- row 10). TRIANGULATION §3.6: "PDF report metadata. Storage path lives in
-- Supabase Storage" — the storage_path column points INTO the Phase-6 bucket;
-- no bucket is created here (law §6.8).
-- FIDELITY FLAG (spec'd in ACCEPTANCE evidence): the extraction does not
-- enumerate this table's exact catalog columns — shape below is the minimal
-- metadata set the corpora attest (file identity, business scoping, generator);
-- verify against models.py:826-849 verbatim when the source is staged, amend
-- via spec path if it differs.

create table public.report_files (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  file_name text,
  storage_path text,                 -- Supabase Storage object path (bucket is Phase 6's)
  report_type text,
  generated_by_user_id uuid references auth.users (id),
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_report_files_business_id on public.report_files (business_id);

alter table public.report_files enable row level security;

create trigger set_updated_at
  before update on public.report_files
  for each row execute function public.update_updated_at();
