-- BIM-003-CYBER-PHARMA · 0047 · owedbook_pbm_options — read wrapper 4 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getPbmOptions() → string[] (src/services/owedbook.ts:37, :129-133):
-- distinct non-null PBM names, sorted. The service signature takes no filters; the wrapper
-- adds only the mandatory p_business_id (R-4). pbm ← insurance (A-3).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0047 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0047 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0047 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_pbm_options' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0047 ASSERT: public.owedbook_pbm_options already exists.'; end if;
end $$;

create function public.owedbook_pbm_options(
  p_business_id uuid
)
returns setof text
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 1. membership (R-4)
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;

  -- 2. log-then-return (R-7)
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',   'owedbook_pbm_options',
      'args', jsonb_build_object('p_business_id', p_business_id)
    )
  );

  -- 3. the read — explicit tenant fence
  return query
    select distinct ud.insurance::text
    from public.user_data ud
    where ud.business_id = p_business_id
      and ud.insurance is not null
    order by 1;
end;
$$;

revoke execute on function public.owedbook_pbm_options(uuid) from public;
revoke execute on function public.owedbook_pbm_options(uuid) from anon;
grant  execute on function public.owedbook_pbm_options(uuid) to authenticated;
