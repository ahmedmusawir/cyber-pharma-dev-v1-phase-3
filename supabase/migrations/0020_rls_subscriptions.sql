-- BIM-002 · 0020 · subscriptions — R-A mirror: account-scoped read.
-- Stripe state mirror, no secrets. Writes are webhook territory (service role).
-- Phase 7 may tighten this to admin-only — flagged in the manager, NOT decided here.
do $$
begin
  if to_regclass('public.subscriptions') is null then
    raise exception 'BIM-002/0020 ASSERT: public.subscriptions missing.'; end if;
  if not (select relrowsecurity from pg_class where oid = 'public.subscriptions'::regclass) then
    raise exception 'BIM-002/0020 ASSERT: RLS not enabled on subscriptions.'; end if;
  if exists (select 1 from pg_policies where schemaname='public' and tablename='subscriptions') then
    raise exception 'BIM-002/0020 ASSERT: subscriptions already carries a policy.'; end if;
end $$;

create policy "subscription_select_account_member"
  on public.subscriptions for select to authenticated
  using (public.is_account_member(account_id));
