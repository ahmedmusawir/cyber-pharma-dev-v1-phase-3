-- BIM-003-CYBER-PHARMA · 0030 · audit_write() — the ONE write-audit trigger function (R-2).
-- Stamped AFTER INSERT OR UPDATE OR DELETE FOR EACH ROW on thirteen tables (0031-0043).
--
-- SECURITY DEFINER is mandatory: tenants hold no INSERT policy on audit_logs (R-1) and RLS
-- is FORCED there, so the insert must run as the function owner, whose BYPASSRLS carries it
-- (RISK-1 verified). search_path is pinned to '' and every reference is schema-qualified.
--
-- business_id (R-8 + the approved businesses special-case):
--   · the row's own business_id when the table carries that column
--   · businesses: the row's own id IS the business (0019's predicate uses id the same way)
--   · otherwise NULL, with the identifying key carried in context {id, account_id?}
-- actor_role: the JWT role claim when the write came through PostgREST/supabase-js
--   (authenticated / service_role / anon); the session role otherwise (e.g. postgres for a
--   direct connection). actor_user_id = auth.uid(), NULL when no user is behind the write.
-- old_data/new_data: to_jsonb(OLD)/to_jsonb(NEW) per action (Brief §3). Payloads ARE PHI and
-- are protected by R-1 (admin-only read) and R-6 (no mutation); redaction is Phase 8.

do $$
begin
  if to_regclass('public.audit_logs') is null then
    raise exception 'BIM-003/0030 ASSERT: public.audit_logs missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0030 ASSERT: audit_logs is not in the 0028 shape — 0028 must land first.'; end if;
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003/0030 ASSERT: public.audit_write() already exists — refusing to redefine outside a migration edit.'; end if;
end $$;

create function public.audit_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  j             jsonb;
  v_old         jsonb;
  v_new         jsonb;
  v_business_id uuid;
  v_context     jsonb;
  v_role        text;
begin
  if tg_op = 'DELETE' then
    j := to_jsonb(old);  v_old := j;              v_new := null;
  elsif tg_op = 'UPDATE' then
    j := to_jsonb(new);  v_old := to_jsonb(old);  v_new := j;
  else
    j := to_jsonb(new);  v_old := null;           v_new := j;
  end if;

  if tg_table_name = 'businesses' then
    v_business_id := (j ->> 'id')::uuid;
    v_context     := null;
  elsif j ? 'business_id' then
    v_business_id := (j ->> 'business_id')::uuid;
    v_context     := null;
  else
    v_business_id := null;                                              -- R-8
    v_context     := jsonb_strip_nulls(jsonb_build_object('id', j ->> 'id', 'account_id', j ->> 'account_id'));
  end if;

  v_role := coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    current_user::text
  );

  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values
    (auth.uid(), v_role, v_business_id, tg_table_name, j ->> 'id', lower(tg_op), v_old, v_new, v_context);

  return null;  -- AFTER trigger: the return value is ignored
end;
$$;

-- Both channels closed (BIM-002 E-2/E-4 law): PUBLIC's default EXECUTE and the schema's
-- explicit default-ACL grant to anon. Trigger firing never checks EXECUTE, so nothing
-- legitimate depends on either grant.
revoke execute on function public.audit_write() from public;
revoke execute on function public.audit_write() from anon;
