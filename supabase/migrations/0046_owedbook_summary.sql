-- BIM-003-CYBER-PHARMA · 0046 · owedbook_summary — read wrapper 3 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getSummary(filters) → OwedBookSummaryRow[] (src/services/owedbook.ts:30,
-- src/types/OwedBook.ts:64-68): one row per PBM — commercial_dollars = sum(owed) where owed > 0
-- (mock :116), federal_dollars = sum(federal_diff) where > 0 (mock :117) → 0 in v1 because
-- federal_diff is NULL by A-3. Rows with no PBM are skipped (mock :113). Ordered by
-- commercial_dollars desc (mock :126). Rounded to 2 places (mock :122-125).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0046 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0046 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0046 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_summary' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0046 ASSERT: public.owedbook_summary already exists.'; end if;
end $$;

create function public.owedbook_summary(
  p_business_id uuid,
  p_from        date   default null,
  p_to          date   default null,
  p_pbms        text[] default '{}',
  p_filter      text   default null
)
returns table (
  pbm                text,
  commercial_dollars numeric,
  federal_dollars    numeric
)
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
      'fn',      'owedbook_summary',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter),
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter)
    )
  );

  -- 3. the read — explicit tenant fence, grouped by PBM (insurance, A-3)
  return query
    select
      ud.insurance::text,
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric,
      0::numeric                                            -- federal_diff is NULL in v1 (A-3)
    from public.user_data ud
    where ud.business_id = p_business_id
      and ud.insurance is not null
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter)
    group by ud.insurance
    order by 2 desc, 1;
end;
$$;

revoke execute on function public.owedbook_summary(uuid, date, date, text[], text) from public;
revoke execute on function public.owedbook_summary(uuid, date, date, text[], text) from anon;
grant  execute on function public.owedbook_summary(uuid, date, date, text[], text) to authenticated;
