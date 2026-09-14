# S1 file-level evidence — BIM-003-CYBER-PHARMA

Generated 2026-09-14T13:52:38+08:00. Read-only git only.

## AC-101 — from-scratch apply

`evidence/S1_apply_2026-09-14T0546.log` — 43 migrations, every line `ok`, exit 0, 16 tables on target. Re-proven by `rls:prove` stage 1 (`evidence/rls-prove/S1_prove_*.log`).

## AC-120 — any two stamp files differ only in table name (+ header number)

```
$ diff supabase/migrations/0031_audit_stamp_businesses.sql supabase/migrations/0043_audit_stamp_pbm_info.sql
1c1
< -- BIM-003-CYBER-PHARMA · 0031 · audit stamp · businesses
---
> -- BIM-003-CYBER-PHARMA · 0043 · audit stamp · pbm_info
6,7c6,7
<   if to_regclass('public.businesses') is null then
<     raise exception 'BIM-003 STAMP ASSERT: public.businesses missing.'; end if;
---
>   if to_regclass('public.pbm_info') is null then
>     raise exception 'BIM-003 STAMP ASSERT: public.pbm_info missing.'; end if;
12,13c12,13
<              where tgrelid = 'public.businesses'::regclass and tgname = 'audit_write') then
<     raise exception 'BIM-003 STAMP ASSERT: public.businesses already carries the audit_write trigger.'; end if;
---
>              where tgrelid = 'public.pbm_info'::regclass and tgname = 'audit_write') then
>     raise exception 'BIM-003 STAMP ASSERT: public.pbm_info already carries the audit_write trigger.'; end if;
17c17
<   after insert or update or delete on public.businesses
---
>   after insert or update or delete on public.pbm_info
```

Mechanical proof across all thirteen: substituting the table name and the header number out of every stamp yields thirteen byte-identical files:

```
ad591307b61eeb14378b0396b5dedeff  0031_audit_stamp_businesses.sql
ad591307b61eeb14378b0396b5dedeff  0032_audit_stamp_user_businesses.sql
ad591307b61eeb14378b0396b5dedeff  0033_audit_stamp_pending_registrations.sql
ad591307b61eeb14378b0396b5dedeff  0034_audit_stamp_user_data.sql
ad591307b61eeb14378b0396b5dedeff  0035_audit_stamp_report_files.sql
ad591307b61eeb14378b0396b5dedeff  0036_audit_stamp_accounts.sql
ad591307b61eeb14378b0396b5dedeff  0037_audit_stamp_subscriptions.sql
ad591307b61eeb14378b0396b5dedeff  0038_audit_stamp_apa_memberships.sql
ad591307b61eeb14378b0396b5dedeff  0039_audit_stamp_reference_dataset_versions.sql
ad591307b61eeb14378b0396b5dedeff  0040_audit_stamp_aac_reference.sql
ad591307b61eeb14378b0396b5dedeff  0041_audit_stamp_wac_reference.sql
ad591307b61eeb14378b0396b5dedeff  0042_audit_stamp_ful_reference.sql
ad591307b61eeb14378b0396b5dedeff  0043_audit_stamp_pbm_info.sql
```

## AC-121 — 0001–0027 byte-identical to dfc8a6a

```
$ git diff dfc8a6a --stat -- "supabase/migrations/00[0-2]*"
(no output = identical)
```

## AC-905 — every module migration header names BIM-003-CYBER-PHARMA

```
supabase/migrations/0029_rls_audit_logs.sql:1
supabase/migrations/0031_audit_stamp_businesses.sql:1
supabase/migrations/0028_audit_logs_reshape.sql:1
supabase/migrations/0033_audit_stamp_pending_registrations.sql:1
supabase/migrations/0035_audit_stamp_report_files.sql:1
supabase/migrations/0032_audit_stamp_user_businesses.sql:1
supabase/migrations/0036_audit_stamp_accounts.sql:1
supabase/migrations/0040_audit_stamp_aac_reference.sql:1
supabase/migrations/0034_audit_stamp_user_data.sql:1
supabase/migrations/0038_audit_stamp_apa_memberships.sql:1
supabase/migrations/0030_audit_write.sql:1
supabase/migrations/0037_audit_stamp_subscriptions.sql:1
supabase/migrations/0042_audit_stamp_ful_reference.sql:1
supabase/migrations/0041_audit_stamp_wac_reference.sql:1
supabase/migrations/0039_audit_stamp_reference_dataset_versions.sql:1
supabase/migrations/0043_audit_stamp_pbm_info.sql:1
```

## AC-210 / AC-904 (running check) — src fence and env fence

```
$ git diff dfc8a6a --stat -- src/services/owedbook.ts src/app src/components src/mocks
(no output = identical)
$ git status --short -- ".env*"
(no output = untouched)
```
