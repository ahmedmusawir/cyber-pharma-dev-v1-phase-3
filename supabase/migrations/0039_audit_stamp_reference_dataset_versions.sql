-- BIM-003-CYBER-PHARMA · 0039 · audit stamp · reference_dataset_versions
-- One identical stamp per table (R-2, E-0 = thirteen). Reviewed by diff: any two stamp
-- files differ only in the table name and this header's number (AC-120).
do $$
begin
  if to_regclass('public.reference_dataset_versions') is null then
    raise exception 'BIM-003 STAMP ASSERT: public.reference_dataset_versions missing.'; end if;
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'public' and p.proname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.audit_write() missing — 0030 must land first.'; end if;
  if exists (select 1 from pg_trigger
             where tgrelid = 'public.reference_dataset_versions'::regclass and tgname = 'audit_write') then
    raise exception 'BIM-003 STAMP ASSERT: public.reference_dataset_versions already carries the audit_write trigger.'; end if;
end $$;

create trigger audit_write
  after insert or update or delete on public.reference_dataset_versions
  for each row execute function public.audit_write();
