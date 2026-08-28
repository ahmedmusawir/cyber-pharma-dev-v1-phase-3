-- BIM-001 · 0015_audit_logs — the HIPAA audit trail.
-- FRANK_API verbatim (models.py:885-948): record_id VARCHAR(128) kept exactly
-- (numeric AND Stripe cs_test_* identifiers — TRIANGULATION §3.4 ruling);
-- username NOT NULL carries system actors ('system_event_listener',
-- 'stripe_webhook', ...); user_id nullable for system actions; action
-- vocabulary left as free text per catalog (String(50), no CHECK documented —
-- none invented). The three catalog indexes ship. Audit TRIGGERS and per-read
-- RPC wrappers are BIM-003's mission (manager §8, R-4) — structure only here.

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),   -- nullable: system actions
  username text not null,
  table_name text,
  record_id varchar(128),
  field_name text,
  old_value text,
  new_value text,
  action text,                        -- 'create'/'update'/'delete'/'activate'/'verify'/'sync'/'process'/'error' (catalog, unconstrained)
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_audit_logs_table_record on public.audit_logs (table_name, record_id);
create index idx_audit_logs_user_id on public.audit_logs (user_id);
create index idx_audit_logs_created_at on public.audit_logs (created_at);

alter table public.audit_logs enable row level security;

create trigger set_updated_at
  before update on public.audit_logs
  for each row execute function public.update_updated_at();
