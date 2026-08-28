-- X0_CATALOG.sql — BIM-001 Gate X0: live-baseline catalog
-- Run READ-ONLY in the Supabase SQL editor (or psql) against the LIVE project.
-- Paste the full output back verbatim; it is diffed against DB_BASELINE.md +
-- DATA_CONTRACT_PHASE_1 §3. Discrepancy = STOP (manager §7).

-- [1] Tables in public (expect EXACTLY: profiles, user_roles)
select table_name
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;

-- [2] RLS policies (expect EXACTLY the 3 baseline policy names)
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- [3] RLS enabled flags on baseline tables (expect: both true)
select relname, relrowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and relkind = 'r'
order by relname;

-- [4] Functions in public (expect: handle_new_user, update_updated_at, rls_auto_enable; flag anything else)
select p.proname, pg_get_function_identity_arguments(p.oid) as args
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- [5] Event triggers (expect: the rls_auto_enable event trigger; capture its exact name + enabled state)
select evtname, evtevent, evtenabled
from pg_event_trigger
order by evtname;

-- [6] Ordinary triggers on public + auth tables of interest (expect: on_auth_user_created on auth.users)
select event_object_schema, event_object_table, trigger_name, action_timing, event_manipulation
from information_schema.triggers
where event_object_schema in ('public','auth')
order by event_object_schema, event_object_table, trigger_name;

-- [7] app_role enum (expect: superadmin, admin, member)
select t.typname, e.enumlabel
from pg_type t join pg_enum e on e.enumtypid = t.oid
order by t.typname, e.enumsortorder;
