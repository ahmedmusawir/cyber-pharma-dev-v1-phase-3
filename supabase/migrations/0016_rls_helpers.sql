-- BIM-002 · 0016_rls_helpers — the membership helpers. Landing order law (F-8):
-- helpers precede every policy file in the chain.
--
-- Gap-6 (BIM-001 R-3, ratified): membership is read from public.user_businesses
-- ONLY. No helper or policy consults user_roles, profiles, user_metadata,
-- raw_user_meta_data, or accounts.owner_user_id. No superadmin clause exists in
-- OwedBook — platform oversight is the service-role path, audited by BIM-003.
--
-- SECURITY DEFINER is MANDATORY, not stylistic (Proto 06 FINDINGS F-5): these
-- functions read user_businesses, which itself carries RLS (0019 restricts each
-- user to their own rows). A SECURITY INVOKER helper would evaluate membership
-- through the caller's restricted view and silently collapse every policy in the
-- system to "can only see myself". search_path is pinned to '' with every
-- reference fully qualified, or the definer becomes its own privilege hole.
--
-- is_member_of / is_admin_of: verbatim from PROTO06 TRANSFERS §1.0 (proven on the
-- rig: 80-cell matrix, 32-case attack battery, twice from scratch).
-- is_account_member: NEW per Director ruling R-A (closes Proto 06 N-6) — account
-- read access is junction-derived, never derived from accounts.owner_user_id.

-- assert-then-create (manager §6.5): the tables these helpers read must exist
-- with RLS enabled before any membership logic is introduced.
do $$
begin
  if to_regclass('public.user_businesses') is null then
    raise exception 'BIM-002/0016 ASSERT FAILED: public.user_businesses missing. Apply chain 0001-0015 first.';
  end if;
  if to_regclass('public.businesses') is null then
    raise exception 'BIM-002/0016 ASSERT FAILED: public.businesses missing. Apply chain 0001-0015 first.';
  end if;
  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in ('user_businesses','businesses')
      and c.relrowsecurity
    having count(*) = 2
  ) then
    raise exception 'BIM-002/0016 ASSERT FAILED: user_businesses and businesses must both have RLS enabled (deny-by-default law).';
  end if;
end $$;

-- T-1/T-2 membership: is the caller a junction member of this business?
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

-- T-3 role gate: is the caller an ADMIN member of this business? The role comes
-- from the junction's own role column (TEXT CHECK 'admin'|'member', BIM-001 R-3).
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

-- THE TENANT SELECT PREDICATE (formulation C, adopted at X2 by evidence).
-- Returns the caller's business ids as a set, so the planner evaluates it ONCE
-- and hashes it (plan: `Filter: (ANY (business_id = (hashed SubPlan 1).col1))`)
-- instead of calling a scalar helper once per candidate row.
--   measured at 100k rows: 29.6ms vs 1685ms for is_member_of(business_id)
--   — 57x faster unqualified, 31x qualified, 1,641 vs 101,640 buffers.
-- SECURITY DEFINER is what separates this from the inline-subquery formulation:
-- an inline `select ... from user_businesses where user_id = auth.uid()` inside a
-- policy is INVOKER-evaluated and is silently blinded by the junction's own RLS,
-- returning zero rows (proven at X2 — see evidence/X2_AB_DECISION.md §7).
-- Usage: using (business_id in (select public.my_business_ids()))
create or replace function public.my_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid();
$$;

-- R-A account read: any user holding a junction row on ANY business under the
-- account. Reads businesses (which carries RLS), so F-5 applies here too.
create or replace function public.is_account_member(acct uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_businesses ub
    join public.businesses b on b.id = ub.business_id
    where ub.user_id = auth.uid() and b.account_id = acct
  );
$$;

-- DIVERGENCE from TRANSFERS §1.0 (authority: BIM-002 ERRATUM E-2, ratified
-- 2026-09-01): the template's `revoke ... from anon` is a NO-OP — Postgres grants
-- EXECUTE to PUBLIC by default and anon inherits it. PUBLIC is the mechanism; the
-- revoke must target it. Proto 06 missed this because its matrix asserted table
-- access, where anon was denied anyway, masking the grant.
-- BOTH revokes are required (authority: ERRATUM E-4). `from public` alone is
-- NOT sufficient: pg_default_acl for functions in this schema grants EXECUTE to
-- anon EXPLICITLY, so a freshly created function carries `anon=X` even after
-- PUBLIC is revoked. Two independent channels, two revokes. Verified by dropping
-- and re-creating these helpers from scratch (evidence:
-- X2_FINDING_fresh_create_anon_grant.log).
revoke execute on function public.is_member_of(uuid) from public;      -- ERRATUM E-2
revoke execute on function public.is_admin_of(uuid) from public;       -- ERRATUM E-2
revoke execute on function public.is_account_member(uuid) from public; -- ERRATUM E-2
revoke execute on function public.my_business_ids() from public;       -- ERRATUM E-2
revoke execute on function public.is_member_of(uuid) from anon;        -- ERRATUM E-4
revoke execute on function public.is_admin_of(uuid) from anon;         -- ERRATUM E-4
revoke execute on function public.is_account_member(uuid) from anon;   -- ERRATUM E-4
revoke execute on function public.my_business_ids() from anon;         -- ERRATUM E-4

grant execute on function public.is_member_of(uuid) to authenticated;
grant execute on function public.is_admin_of(uuid) to authenticated;
grant execute on function public.is_account_member(uuid) to authenticated;
grant execute on function public.my_business_ids() to authenticated;
