-- BIM-003-CYBER-PHARMA · 0045 · owedbook_rows — read wrapper 2 of 4 (R-4, E-0 N = 4).
-- Mirrors OwedBookService.getRows(tab, filters, page) → OwedBookPage (src/services/owedbook.ts:24,
-- src/types/OwedBook.ts:55-61). Returns the page ENVELOPE as jsonb — {rows, page, pageCount,
-- limit, total} — because an envelope is not a row set; each element of rows is an
-- OwedBookRow (OwedBook.ts:5-26) built from STORED user_data columns per the approved A-3 map:
--   id←id::text · date←date_dispensed · script · qty · pbm←insurance · status ·
--   original_paid←total_paid · medicaid_rate · method←medicaid_method · expected←expected_paid ·
--   owed · new_paid · updated_difference←difference ·
--   report_file, aac, federal_expected, federal_diff → NULL (Phase 5 joins/math; keys kept so
--   BIM-005's swap stays one line).
-- Tabs mirror owedbook.ts:89-93: commercial/summary = all · updated = new_paid is not null ·
-- federal = federal_expected is not null → empty in v1 (that field is NULL by A-3).
-- Pager mirrors owedbook.ts:95-98: pageCount = max(1, ceil(total/limit)); page clamped.
-- Order: date desc, then id (the fixtures are date-descending). DEFAULT_LIMIT = 25 (:55).
-- One read_page audit row per CALL regardless of page size (R-7, AC-208).
do $$
begin
  if to_regclass('public.user_data') is null then
    raise exception 'BIM-003/0045 ASSERT: public.user_data missing.'; end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'audit_logs' and column_name = 'occurred_at') then
    raise exception 'BIM-003/0045 ASSERT: audit_logs is not in the 0028 shape.'; end if;
  if not exists (select 1 from pg_proc where proname = 'my_business_ids' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0045 ASSERT: public.my_business_ids() missing (0016).'; end if;
  if exists (select 1 from pg_proc where proname = 'owedbook_rows' and pronamespace = 'public'::regnamespace) then
    raise exception 'BIM-003/0045 ASSERT: public.owedbook_rows already exists.'; end if;
end $$;

create function public.owedbook_rows(
  p_business_id uuid,
  p_tab         text,
  p_from        date    default null,
  p_to          date    default null,
  p_pbms        text[]  default '{}',
  p_filter      text    default null,
  p_page        integer default 1,
  p_limit       integer default 25
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit      integer := greatest(coalesce(p_limit, 25), 1);
  v_req_page   integer := greatest(coalesce(p_page, 1), 1);
  v_total      bigint;
  v_page_count integer;
  v_page       integer;
  v_offset     integer;
  v_rows       jsonb;
begin
  -- 1. membership (R-4)
  if p_business_id is null or not (p_business_id in (select public.my_business_ids())) then
    raise exception 'not a member of business';
  end if;
  if p_tab is null or p_tab not in ('commercial_dollars', 'updated_commercial_payments', 'federal_dollars', 'summary') then
    raise exception 'unknown tab: %', p_tab;
  end if;

  -- 2. log-then-return (R-7): one row per call, not per row returned — and BEFORE any read
  --    (Brief §5). The row carries the REQUESTED page/limit/offset; the page actually served
  --    after clamping (owedbook.ts:95-98) is in the returned envelope.
  insert into public.audit_logs
    (actor_user_id, actor_role, business_id, table_name, row_id, action, old_data, new_data, context)
  values (
    auth.uid(),
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user::text),
    p_business_id, 'user_data', null, 'read_page', null, null,
    jsonb_build_object(
      'fn',      'owedbook_rows',
      'args',    jsonb_build_object('p_business_id', p_business_id, 'p_tab', p_tab, 'p_from', p_from, 'p_to', p_to,
                                    'p_pbms', to_jsonb(p_pbms), 'p_filter', p_filter, 'p_page', p_page, 'p_limit', p_limit),
      'page',    v_req_page,
      'limit',   v_limit,
      'offset',  (v_req_page - 1) * v_limit,
      'filters', jsonb_build_object('from', p_from, 'to', p_to, 'pbms', to_jsonb(p_pbms), 'filter', p_filter, 'tab', p_tab)
    )
  );

  -- 3. the read — pager arithmetic (owedbook.ts:95-98), then the page; explicit tenant fence
  select count(*) into v_total
  from public.user_data ud
  where ud.business_id = p_business_id
    and (p_from   is null or ud.date_dispensed >= p_from)
    and (p_to     is null or ud.date_dispensed <= p_to)
    and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
    and (p_filter is null or ud.status = p_filter)
    and (p_tab <> 'updated_commercial_payments' or ud.new_paid is not null)
    and (p_tab <> 'federal_dollars');                       -- federal_expected is NULL in v1 (A-3)
  v_page_count := greatest(1, ceil(v_total::numeric / v_limit)::integer);
  v_page       := least(v_req_page, v_page_count);
  v_offset     := (v_page - 1) * v_limit;

  -- OwedBookRow shape per A-3
  select coalesce(jsonb_agg(r.row_obj), '[]'::jsonb) into v_rows
  from (
    select jsonb_build_object(
             'id',                 ud.id::text,
             'date',               ud.date_dispensed,
             'script',             ud.script,
             'qty',                ud.qty,
             'pbm',                ud.insurance,
             'status',             ud.status,
             'report_file',        null::text,
             'original_paid',      ud.total_paid,
             'medicaid_rate',      ud.medicaid_rate,
             'method',             ud.medicaid_method,
             'expected',           ud.expected_paid,
             'owed',               ud.owed,
             'new_paid',           ud.new_paid,
             'updated_difference', ud.difference,
             'aac',                null::numeric,
             'federal_expected',   null::numeric,
             'federal_diff',       null::numeric
           ) as row_obj
    from public.user_data ud
    where ud.business_id = p_business_id
      and (p_from   is null or ud.date_dispensed >= p_from)
      and (p_to     is null or ud.date_dispensed <= p_to)
      and (coalesce(array_length(p_pbms, 1), 0) = 0 or ud.insurance = any (p_pbms))
      and (p_filter is null or ud.status = p_filter)
      and (p_tab <> 'updated_commercial_payments' or ud.new_paid is not null)
      and (p_tab <> 'federal_dollars')
    order by ud.date_dispensed desc nulls last, ud.id
    offset v_offset limit v_limit
  ) r;

  return jsonb_build_object(
    'rows',      v_rows,
    'page',      v_page,
    'pageCount', v_page_count,
    'limit',     v_limit,
    'total',     v_total
  );
end;
$$;

revoke execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) from public;
revoke execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) from anon;
grant  execute on function public.owedbook_rows(uuid, text, date, date, text[], text, integer, integer) to authenticated;
