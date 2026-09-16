-- BIM-003-CYBER-PHARMA · 0044 · owedbook_kpis — read wrapper 1 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getKpis(filters) → OwedBookKpis (src/services/owedbook.ts:17,
-- src/types/OwedBook.ts:35-40). One row: commercial_underpaid · commercial_scripts ·
-- updated_difference · owed. Aggregates STORED user_data columns only (A-3): no rate math.
--   commercial_underpaid = sum(owed) where owed > 0      (mock: owedbook.ts:72-74)
--   commercial_scripts   = count(*)                      (mock: :77)
--   updated_difference   = sum(difference)               (mock: sum(updated_difference ?? 0), :78-80)
--   owed                 = commercial_underpaid           (mock: :81)
-- Shape rules (Brief §5): SECURITY DEFINER · search_path '' · first statement = membership
-- via my_business_ids() else RAISE 'not a member of business' · second = ONE read_page audit
-- row (R-7) · third = the read, with an explicit business_id fence (a DEFINER bypasses RLS —
-- the WHERE is the boundary). Filters mirror applyFilters (owedbook.ts:60-67):
--   from/to on date_dispensed · pbms on insurance (A-3: pbm ← insurance) · filter on status.
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0044 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0044 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0044 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_kpis' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0044 ASSERT: public.owedbook_kpis already exists.'; end if;
end $$;

create function public.owedbook_kpis(
  p_business_id uuid,
  p_from        date   default null,
  p_to          date   default null,
  p_pbms        text[] default '{}',
  p_filter      text   default null
)
returns table (
  commercial_underpaid numeric,
  commercial_scripts   bigint,
  updated_difference   numeric,
  owed                 numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 1. membership (R-4): junction membership via the DEFINER set helper; NULL is not a member
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;

  -- 2. log-then-return (R-7): exactly one read_page row per call
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',      'owedbook_kpis',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter),
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter)
    )
  );

  -- 3. the read — explicit tenant fence, stored columns only
  return query
    select
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric,
      count(*)::bigint,
      round(coalesce(sum(ud.difference), 0), 2)::numeric,
      round(coalesce(sum(ud.owed) filter (where ud.owed > 0), 0), 2)::numeric
    from public.user_data ud
    where ud.business_id = p_business_id
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter);
end;
$$;

-- Both channels closed (E-2/E-4 law), then the one grant.
revoke execute on function public.owedbook_kpis(uuid, date, date, text[], text) from public;
revoke execute on function public.owedbook_kpis(uuid, date, date, text[], text) from anon;
grant  execute on function public.owedbook_kpis(uuid, date, date, text[], text) to authenticated;
