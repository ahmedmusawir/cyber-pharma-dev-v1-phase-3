-- BIM-003-CYBER-PHARMA · 0028 · audit_logs reshape — the HIPAA trail takes its Brief §3 shape.
--
-- 0015 (BIM-001) created audit_logs in the FRANK_API catalog shape (uuid PK, username,
-- record_id varchar(128), old_value/new_value text, free-text action, ip/user-agent,
-- created_at/updated_at + a set_updated_at trigger). BIM-003 rules R-1..R-8 and the
-- Brief §3 row shape replace that design. 0015 is read-only (chain law), so this file
-- drops and recreates (ERRATUM E-1, Director-approved 2026-09-14). It refuses to drop
-- a table that holds rows: nothing in this module may delete an audit row (Brief §6).
--
-- Shape (Brief §3, eleven columns, this order): id · occurred_at · actor_user_id ·
-- actor_role · business_id · table_name · row_id · action · old_data · new_data · context.
-- Indexes (Brief §4, exactly three beyond the PK).
-- Immutability (R-6): BEFORE UPDATE OR DELETE raises unconditionally — no WHEN clause, no
-- role check — so even the service role (which bypasses RLS) cannot alter or remove a row.
-- A BEFORE TRUNCATE statement trigger closes the one path row triggers cannot see.
-- RLS: ENABLED + FORCED; zero policies here (0029 lands the single SELECT policy).
-- Grants: UPDATE and DELETE revoked from anon and authenticated (RF-3, Director-approved)
-- so a tenant's tampering attempt is a loud 42501 rather than a silent 0-affected;
-- INSERT is left to RLS (no policy → denied) so AC-113 reads "denied by RLS".
-- The definer trigger/wrappers insert through their owner's BYPASSRLS (RISK-1, verified
-- 2026-09-14: postgres rolbypassrls = true on the target).

do $$
declare
  n bigint;
begin
  if to_regclass('public.audit_logs') is null then
    raise exception 'BIM-003/0028 ASSERT: public.audit_logs missing — apply chain 0001-0027 first.';
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0028 ASSERT: public.audit_logs already carries occurred_at — reshape already applied; refusing to re-run.';
  end if;
  execute 'select count(*) from public.audit_logs' into n;
  if n <> 0 then
    raise exception 'BIM-003/0028 ASSERT: public.audit_logs holds % row(s) — refusing to drop a non-empty audit trail (Brief §6). Reshape applies to an empty table only (E-1).', n;
  end if;
end $$;

-- E-1: the 0015 shape goes, taking its three indexes and its set_updated_at trigger with it.
drop table public.audit_logs;

create table public.audit_logs (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  actor_user_id uuid null,                       -- auth.uid(); NULL when the service role acts
  actor_role    text not null,                   -- JWT role claim; fallback current_user
  business_id   uuid null,                       -- from the row when the table has it; NULL per R-8
  table_name    text not null,
  row_id        text null,                       -- touched row's PK as text; NULL for page reads
  action        text not null check (action in ('insert', 'update', 'delete', 'read_page')),
  old_data      jsonb null,
  new_data      jsonb null,
  context       jsonb null
);

-- Brief §4: three indexes, no more.
create index idx_audit_logs_occurred_at       on public.audit_logs (occurred_at);
create index idx_audit_logs_business_occurred on public.audit_logs (business_id, occurred_at);
create index idx_audit_logs_table_row         on public.audit_logs (table_name, row_id);

-- R-6: immutability below RLS. Unconditional. Only a migration can drop this.
create or replace function public.audit_logs_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_logs is append-only';
end;
$$;

create trigger audit_logs_immutable
  before update or delete on public.audit_logs
  for each row execute function public.audit_logs_immutable();

-- Row triggers never see TRUNCATE; this statement trigger closes that path for every role.
create trigger audit_logs_no_truncate
  before truncate on public.audit_logs
  for each statement execute function public.audit_logs_immutable();

-- R-1: RLS enabled AND forced (the table owner is not exempt). Policies: none here.
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

-- RF-3: tampering by a tenant or an anonymous caller is a privilege error, not a silent no-op.
revoke update, delete on public.audit_logs from anon, authenticated;
