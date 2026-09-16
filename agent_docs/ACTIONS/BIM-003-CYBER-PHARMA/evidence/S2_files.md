# S2 file-level evidence — BIM-003-CYBER-PHARMA

Generated 2026-09-14T14:53:46+08:00. Read-only git only.

## AC-101 (re-proven) — from-scratch apply of the 47-file chain

`evidence/S2_apply_2026-09-14T0652.log` — 47 migrations, every line `ok`, exit 0, 16 tables on target. (An earlier S2 apply at 06:48 preceded the 0045 log-before-read fix; superseded and deleted — the file on disk is the one that was proven.)

## AC-210 — src/services/owedbook.ts, src/app, src/components, src/mocks byte-identical to dfc8a6a

```
$ git diff dfc8a6a --stat -- src/services/owedbook.ts src/app src/components src/mocks
(no output = identical)
$ git status --short -- src/
(no output = untouched)
```

## AC-121 (still holds) — 0001–0027 vs dfc8a6a

```
 supabase/migrations/0028_audit_logs_reshape.sql | 87 +++++++++++++++++++++++++
 supabase/migrations/0029_rls_audit_logs.sql     | 26 ++++++++
 2 files changed, 113 insertions(+)
(no output = identical)
```

## AC-905 — module headers on 0044–0047

```
supabase/migrations/0045_owedbook_rows.sql:1
supabase/migrations/0047_owedbook_pbm_options.sql:1
supabase/migrations/0044_owedbook_kpis.sql:1
supabase/migrations/0046_owedbook_summary.sql:1
```

## AC-904 — env fence

```
$ git status --short -- ".env*"
(no output = untouched)
```
