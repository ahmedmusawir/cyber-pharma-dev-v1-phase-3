-- PROTO-06 · h0_helpers — THE membership helpers (the blessed template's core).
-- Gap-6 law: junction-only. No user_roles (doesn't exist here), no metadata.
-- SECURITY DEFINER: owner (postgres) reads the junction unrestricted — which is
-- the point; the junction's own RLS (T-5, self-visibility) must not blind the
-- membership evaluation. Landmine §7.2 discipline: search_path pinned to '',
-- fully-qualified references, STABLE, EXECUTE revoked from anon.

create or replace function public.is_member_of(biz uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz
  );
$$;

create or replace function public.is_admin_of(biz uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz and ub.role = 'admin'
  );
$$;

revoke execute on function public.is_member_of(uuid) from anon;
revoke execute on function public.is_admin_of(uuid) from anon;
grant execute on function public.is_member_of(uuid) to authenticated;
grant execute on function public.is_admin_of(uuid) to authenticated;
