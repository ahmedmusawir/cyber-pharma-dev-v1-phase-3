-- BIM-003-CYBER-PHARMA · 0036 · audit stamp · accounts
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.accounts') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.accounts missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.accounts'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.accounts already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.accounts
  for each row execute function public.audit_write();
