# S3 evidence — AC-301…309 and AC-901…906 — BIM-003-CYBER-PHARMA

Generated 2026-09-14T15:40:24+08:00. Read-only git only; no credential value appears in any file below.

## AC-301 — `npm run audit:prove` exists and exits 0 after a from-scratch apply

```
$ grep -n "prove" package.json
18:    "rls:prove": "node scripts/rls-harness/prove.mjs",
19:    "audit:prove": "node scripts/rls-harness/audit-prove.mjs"

$ npm run audit:prove   → S3_audit_prove_2026-09-14T0738.log
[audit:prove] audit-trail proof from an empty scratch — 2026-09-14T0738
[audit:prove] ✓ TRAIL PROVEN — chain 0001-0047 + immutability (6 probes) + write trail + R-8 + six wrapper reads + cross-tenant deny + admin-only visibility + golden match, from an empty database.
(stage 1 of the runner IS the from-scratch apply: db-reset reset, 47 migrations)
```

## AC-302 — the scripted session covers every required element

Runner source: `scripts/rls-harness/audit-session.mjs`. Log: `S3_audit_prove_2026-09-14T0738.log`, stage 4/4.

```
  ok  drop event trigger (pre-drop)
  ok  drop schema public
  ok  re-grant public schema privileges
  ok  bootstrap baseline (scratch-only, X0 rider 3)
  ok  0001_baseline_acknowledge.sql
  ok  0002_accounts.sql
  ok  0003_businesses.sql
  ok  0004_user_businesses.sql
  ok  0005_pending_registrations.sql
  ok  0006_subscriptions.sql
  ok  0007_apa_memberships.sql
  ok  0008_reference_dataset_versions.sql
  ok  0009_aac_reference.sql
  ok  0010_wac_reference.sql
  ok  0011_ful_reference.sql
  ok  0012_pbm_info.sql
  ok  0013_user_data.sql
  ok  0014_report_files.sql
  ok  0015_audit_logs.sql
  ok  0016_rls_helpers.sql
  ok  0017_rls_user_businesses.sql
  ok  0018_rls_accounts.sql
  ok  0019_rls_businesses.sql
  ok  0020_rls_subscriptions.sql
  ok  0021_rls_user_data.sql
  ok  0022_rls_report_files.sql
  ok  0023_rls_aac_reference.sql
  ok  0024_rls_wac_reference.sql
  ok  0025_rls_ful_reference.sql
  ok  0026_rls_pbm_info.sql
  ok  0027_rls_reference_dataset_versions.sql
  ok  0028_audit_logs_reshape.sql
  ok  0029_rls_audit_logs.sql
  ok  0030_audit_write.sql
  ok  0031_audit_stamp_businesses.sql
  ok  0032_audit_stamp_user_businesses.sql
  ok  0033_audit_stamp_pending_registrations.sql
  ok  0034_audit_stamp_user_data.sql
  ok  0035_audit_stamp_report_files.sql
  ok  0036_audit_stamp_accounts.sql
  ok  0037_audit_stamp_subscriptions.sql
  ok  0038_audit_stamp_apa_memberships.sql
  ok  0039_audit_stamp_reference_dataset_versions.sql
  ok  0040_audit_stamp_aac_reference.sql
  ok  0041_audit_stamp_wac_reference.sql
  ok  0042_audit_stamp_ful_reference.sql
  ok  0043_audit_stamp_pbm_info.sql
  ok  0044_owedbook_kpis.sql
  ok  0045_owedbook_rows.sql
  ok  0046_owedbook_summary.sql
  ok  0047_owedbook_pbm_options.sql
AC-106 — tampering: UPDATE and DELETE on audit_logs as svc, admin-A, anon (six probes)
  ok   svc UPDATE raises — P0001 "audit_logs is append-only" · ground truth actor_role=postgres
  ok   svc DELETE raises — P0001 "audit_logs is append-only" · ground truth count=629
  ok   admin-A UPDATE raises — 42501 "permission denied for table audit_logs" · ground truth actor_role=postgres
  ok   admin-A DELETE raises — 42501 "permission denied for table audit_logs" · ground truth count=629
  ok   anon UPDATE raises — 42501 "permission denied for table audit_logs" · ground truth actor_role=postgres
  ok   anon DELETE raises — 42501 "permission denied for table audit_logs" · ground truth count=629
AC-116/117 — admin-A INSERT → UPDATE → DELETE on user_data (A1)
  ok   insert — id 750373e9-e7c5-449e-b1fe-1eaa4c9828dd
```

| Required by AC-302 | Where |
|---|---|
| one write per action type on a business_id table by admin-A | § AC-116/117 — insert/update/delete on user_data (A1) |
| one write on an R-8 table | § AC-118 — svc INSERT on apa_memberships |
| one wrapper call per owedbook_* by admin-A | § AC-302 — kpis, rows ×2, summary, pbm_options (+ multi → kpis B1) |
| one cross-tenant wrapper attempt | § AC-206 — admin-A → owedbook_kpis(B1) |
| the six AC-106 tampering probes | § AC-106 — svc/admin-A/anon × UPDATE/DELETE |

## AC-303 — comparison + failure path

Source: `audit-session.mjs` § "golden diff" — rows with `id > watermark`, `order by id`, `id`/`occurred_at` excluded, normalised per E-2, compared row-for-row (sorted-key JSON), non-zero exit on any difference (3 from the stage, 8 from the runner). Deliberately broken run: `evidence/S3_failure_path.md` — exit 8, `DIFF at row 1` with expected and produced.

## AC-304 — the golden file

`scripts/rls-harness/golden/audit_trail_expected.json` — committed with the module, 10 rows, one JSON object per line. Every row carries `table_name`, `action`, `actor_role`, `business_id` (symbol A1/A2/B1 or null — E-2 reads "uuid or null" as "symbol or null"):

```
user_data · insert · authenticated · admin-A · A1 · 
user_data · update · authenticated · admin-A · A1 · 
user_data · delete · authenticated · admin-A · A1 · 
apa_memberships · insert · service_role ·  ·  · 
user_data · read_page · authenticated · admin-A · A1 · owedbook_kpis
user_data · read_page · authenticated · admin-A · A1 · owedbook_rows
user_data · read_page · authenticated · admin-A · A1 · owedbook_rows
user_data · read_page · authenticated · admin-A · A1 · owedbook_summary
user_data · read_page · authenticated · admin-A · A1 · owedbook_pbm_options
user_data · read_page · authenticated · multi · B1 · owedbook_kpis
```

## AC-305 — `npm run rls:prove` still exits 0 after the full chain

```
[rls:prove] full isolation proof from an empty scratch — 2026-09-14T0737
  total policies in public: 19
[policy-check] ALL LAWS HOLD
[scoping] SCOPING EXACT
[attacks] 28 cases · 0 breach(es) · 0 ground-truth mismatch(es) → ALL DENIED, NOTHING PERSISTED
[revocation] R-C PROVEN — revocation and re-grant both take effect immediately, with no token refresh
[rls:prove] ✓ ISOLATION PROVEN — chain + 18 policies + AC8 + four laws + 320 cells + scoping + 28 attacks + live-session revocation, from an empty database.
```
Log: `evidence/rls-prove/S3_prove_2026-09-14T0737.log` (moved from the sub-runners' hardcoded BIM-002 path — CF-8 addition).

## AC-306 — triad

```
✓ Compiled successfully in 8.0s
build exit: 0
tsc exit: 0
Test Suites: 28 passed, 28 total
Tests:       128 passed, 128 total
jest exit: 0
routes (app): 22
```
Log: `evidence/S3_triad.log`. Baseline (VG-9): 22 routes · tsc clean · 28 suites / 128 tests / 0 failures — **unchanged**.

## AC-307 — regenerated types (Director-run)

**PENDING the Director's paste.** Command sequence: `evidence/S3_types_regen.md`. Verified against `011eada`'s `src/types/supabase.ts` after the paste; the verification block is appended to this file then.

## AC-308 — README and RUN_NOTES carry the identical command strings

```
$ grep -n "npm run audit:prove\|npm run rls:prove" README.md RUN_NOTES.md
README.md:137:| `npm run rls:prove`         | BIM-002 RLS isolation proof — wi
README.md:138:| `npm run audit:prove`       | BIM-003 audit-trail proof — wipe
RUN_NOTES.md:7:| `npm run rls:prove` | BIM-002 tenant isolation: chain from scra
RUN_NOTES.md:8:| `npm run audit:prove` | BIM-003 audit trail: chain from scratch
RUN_NOTES.md:15:- **Re-point** — set `RLS_HARNESS_PREFIX=<PREFIX>_` and provid
```

## AC-309 — RETROSPECTIVE.md

```
5:## Keep
14:## Change
21:## Drop
26:## Deferred Ledger candidates (routed, not built)
```

## AC-901 — surface

```
$ git status --short   (S3, on top of c2d9348)
 M README.md
 M agent_docs/SESSIONS/session_2026-09-14.md
 M package.json
 M scripts/rls-harness/seed-map.json
?? RUN_NOTES.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0734.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0734.normalised.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0736.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0736.normalised.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0738.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0738.normalised.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0735.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0735.produced.json
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0737.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0737.produced.json
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0739.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0739.produced.json
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_failure_path.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_files.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_triad.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/S3-matrix_2026-09-14T0738.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/S3_prove_2026-09-14T0737.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/S3_prove_2026-09-14T0737.normalised.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/X4_attacks_2026-09-14T0738.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/X4_revocation_2026-09-14T0738.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/X4_scoping_2026-09-14T0738.log
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/X5_ac8_fresh_2026-09-14T0737.log
?? scripts/rls-harness/audit-prove.mjs
?? scripts/rls-harness/audit-seed-map.json
?? scripts/rls-harness/audit-seed.mjs
?? scripts/rls-harness/audit-session.mjs
?? scripts/rls-harness/golden/

$ git diff c2d9348 --stat
 agent_docs/SESSIONS/session_2026-09-14.md |  5 +++++
 package.json                              |  3 ++-
 scripts/rls-harness/seed-map.json         | 26 +++++++++++++-------------
 4 files changed, 22 insertions(+), 14 deletions(-)
```
Every path is inside AC-901's list (+ E-3's `scripts/db-verify.mjs` at S1, + `RUN_NOTES.md` at root as listed).

## AC-902 / AC-903 — Director attestation (transcript) + host grep

Engineer-side statement: no mutating git command and no Supabase CLI login/link/dashboard action was run in any of the three stages; the only credentials read were the throwaway's, via `.env.local`, values never printed. Mechanical half of AC-903:

```
$ git diff c2d9348 | grep -c "supabase\.co"   (staged+unstaged vs the S2 commit)
0
$ git status --short --untracked-files=all | awk "{print \$2}" | xargs grep -l "supabase\.co" 2>/dev/null
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0734.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0734.normalised.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0736.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0736.normalised.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0738.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_prove_2026-09-14T0738.normalised.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0735.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0737.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_audit_session_2026-09-14T0739.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S3_failure_path.md
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/S3_prove_2026-09-14T0737.log
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/rls-prove/S3_prove_2026-09-14T0737.normalised.log
(only pooler HOST names may appear, in evidence logs and ENV_NOTE — never a key; keys never transit files)
```

## AC-904 — env fence

```
$ git status --short -- ".env*"
(no output = untouched)
```

## AC-905 — every module migration header names BIM-003-CYBER-PHARMA

```
supabase/migrations/0028_audit_logs_reshape.sql:1
supabase/migrations/0031_audit_stamp_businesses.sql:1
supabase/migrations/0030_audit_write.sql:1
supabase/migrations/0035_audit_stamp_report_files.sql:1
supabase/migrations/0032_audit_stamp_user_businesses.sql:1
supabase/migrations/0034_audit_stamp_user_data.sql:1
supabase/migrations/0039_audit_stamp_reference_dataset_versions.sql:1
supabase/migrations/0029_rls_audit_logs.sql:1
supabase/migrations/0036_audit_stamp_accounts.sql:1
supabase/migrations/0038_audit_stamp_apa_memberships.sql:1
supabase/migrations/0037_audit_stamp_subscriptions.sql:1
supabase/migrations/0033_audit_stamp_pending_registrations.sql:1
supabase/migrations/0040_audit_stamp_aac_reference.sql:1
supabase/migrations/0042_audit_stamp_ful_reference.sql:1
supabase/migrations/0046_owedbook_summary.sql:1
supabase/migrations/0044_owedbook_kpis.sql:1
supabase/migrations/0041_audit_stamp_wac_reference.sql:1
supabase/migrations/0045_owedbook_rows.sql:1
supabase/migrations/0043_audit_stamp_pbm_info.sql:1
supabase/migrations/0047_owedbook_pbm_options.sql:1
```

## AC-906 — stage reports + GIT REMINDER blocks

```
agent_docs/RESPONSES/BIM003_S1_2026-09-14.md
agent_docs/RESPONSES/BIM003_S2_2026-09-14.md
agent_docs/RESPONSES/BIM003_S2_2026-09-14.md:1
agent_docs/RESPONSES/BIM003_S1_2026-09-14.md:1
```

## AC-307 — verification after the Director's paste (2026-09-14, Route B, CLI 2.116)

```
$ git diff --stat 011eada -- src/types/supabase.ts
 1 file changed, 94 insertions(+), 51 deletions(-)

$ git diff -U0 011eada -- src/types/supabase.ts | grep "^@@"
@@ -13 +13 @@            PostgrestVersion "14.17" → "14.5"            (E-7: non-module)
@@ -132,13 +132,11 @@    audit_logs Row      — 0015 shape → 0028 shape   (module)
@@ -147,13 +145,11 @@    audit_logs Insert   — id?: never (identity), action/actor_role/table_name required
@@ -162,13 +158,11 @@    audit_logs Update
@@ -966 +960,50 @@       Functions: [_ in never] → 8 entries         (module: 4 owedbook_* · E-7: 4 BIM-002 helpers)
@@ -985 … -1085 (10 one-line hunks)  generic-constraint parenthesization   (E-7: CLI version)
```

- **Tables:** the only table block touched is `audit_logs`; no table added, removed, or edited otherwise (`grep -E "^[-+]\s{6}[a-z_]+: \{$"` over the diff shows only the four `owedbook_*` function keys as added block keys).
- **audit_logs Row keys (11):** action · actor_role · actor_user_id · business_id · context · id (`number`) · new_data · occurred_at · old_data · row_id · table_name — the 0028 shape exactly; `Insert.id?: never` reflects `generated always as identity`.
- **Functions:** `owedbook_kpis` (typed rows[] — `OwedBookKpis` shape) · `owedbook_rows` (`Json` — the page envelope) · `owedbook_summary` (typed rows[] — `OwedBookSummaryRow` shape) · `owedbook_pbm_options` (`string[]`) — one-to-one with 0044–0047; plus `is_account_member`, `is_admin_of`, `is_member_of`, `my_business_ids` (BIM-002 helpers that 011eada's file predated — E-7).
- **Trigger functions** `audit_write` / `audit_logs_immutable` correctly absent (not RPC-callable).
- **`tsc --noEmit` against the regenerated file: exit 0.**

**AC-307: PASS on schema content (E-7).**
