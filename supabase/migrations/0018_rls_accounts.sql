-- BIM-002 · 0018 · accounts — R-A: read-only, junction-derived.
-- Any user holding a junction row on ANY business under the account may read it.
-- NEVER derived from accounts.owner_user_id (Gap-6 forbids it, and ownership is
-- not membership). No INSERT/UPDATE/DELETE policy for any app role in v1 —
-- account writes are billing territory (Payment Portal → service role).
do $$
begin
  if to_regclass('public.accounts') is null then
    raise exception 'BIM-002/0018 ASSERT: public.accounts missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.accounts'::regclass) then
    raise exception 'BIM-002/0018 ASSERT: RLS not enabled on accounts.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='accounts') then
    raise exception 'BIM-002/0018 ASSERT: accounts already carries a policy.'; end if;
end $$;

create policy "account_select_member"
  on public.accounts for select to authenticated
  using (public.is_account_member(id));
