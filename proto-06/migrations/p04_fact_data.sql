-- PROTO-06 · p04_fact_data — tenant fact table stand-in (user_data miniature):
-- business_id + two dummy columns. Synthetic rows only, never PHI-shaped.
create table public.fact_data (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  label text,
  amount numeric
);
create index idx_fact_business on public.fact_data (business_id);
alter table public.fact_data enable row level security;
