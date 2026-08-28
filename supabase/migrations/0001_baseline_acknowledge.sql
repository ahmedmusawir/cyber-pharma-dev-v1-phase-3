-- BIM-001 · 0001_baseline_acknowledge
-- The chain never pretends the database is empty (manager §6.7).
-- Assert-then-create (X0 ruling rider 3): asserts every baseline object the
-- live catalog confirmed (X0_EVIDENCE.md, 2026-08-28), creates ONLY
-- update_updated_at() — absent from the live DB and from every SQL file in
-- this lineage; DATA_CONTRACT §3's three-function claim was inherited from
-- starter-kit-v2 docs, not this deployment (see ERRATUM.md E-1).

do $$
begin
  -- [1] baseline tables
  if to_regclass('public.user_roles') is null then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: table public.user_roles missing. This chain applies on the DB_BASELINE.md baseline (or after the reset script''s bootstrap path). Refusing to continue.';
  end if;
  if to_regclass('public.profiles') is null then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: table public.profiles missing. See DB_BASELINE.md.';
  end if;

  -- [2] the three baseline policies, byte-faithful names (DB_BASELINE.md)
  if (select count(*) from pg_policies
      where schemaname = 'public'
        and policyname in ('Profiles are updatable by owner or superadmins',
                           'Profiles are viewable by owner or superadmins',
                           'Users can read their own role')) <> 3 then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: expected the 3 baseline policies of DB_BASELINE.md; found a different set. Catalog the DB and reconcile before migrating.';
  end if;

  -- [3] baseline functions confirmed live at X0 (two, not three — ERRATUM E-1)
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'handle_new_user') then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: function public.handle_new_user() missing.';
  end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'rls_auto_enable') then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: function public.rls_auto_enable() missing.';
  end if;

  -- [4] the RLS auto-enable event trigger, by its REAL name (X0 ruling rider 1)
  if not exists (select 1 from pg_event_trigger where evtname = 'ensure_rls') then
    raise exception 'BIM-001/0001 BASELINE ASSERT FAILED: event trigger ensure_rls (fn rls_auto_enable) missing.';
  end if;
end $$;

-- [5] the one chain-created baseline object (X0 ruling: option (i) ratified).
-- Attached to every table this chain creates (structural law §6.5).
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
