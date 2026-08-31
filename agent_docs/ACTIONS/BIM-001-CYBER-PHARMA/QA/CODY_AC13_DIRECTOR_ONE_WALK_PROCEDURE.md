# CODY QA — AC13 Director-Witnessed One-Walk Procedure

- Prepared: 2026-08-28 (Asia/Kuala_Lumpur)
- Branch: `qa/bim-001-cody-01`
- Tested HEAD: `fefde109fe50eb55839dee4dd29129b2ea3de90c`
- Target: disposable SCRATCH only
- Project reference: `jmzwhgnyunwssamrqyhp`
- Session pooler: `aws-1-us-west-1.pooler.supabase.com:5432/postgres`
- Required pooler username: `postgres.jmzwhgnyunwssamrqyhp`
- Secrets: never place the connection string in this file or in returned evidence

## Director action

From repository root, with the scratch session-pooler URL already held securely in `SCRATCH_POOLER_DB_URL`, the Director personally executes and witnesses this single documented reset command:

```bash
DB_URL="$SCRATCH_POOLER_DB_URL" DB_RESET_ALLOW=yes npm run db:reset
```

Immediately afterward, clear the transient variable:

```bash
unset SCRATCH_POOLER_DB_URL DB_URL
```

## Expected observable result

- Command exit code: `0`
- Migration range: 15 files, `0001_baseline_acknowledge.sql` through `0015_audit_logs.sql`
- Every migration reports `ok`
- Final public-table count: `16`
- Exact sorted inventory:
  - `aac_reference`
  - `accounts`
  - `apa_memberships`
  - `audit_logs`
  - `businesses`
  - `ful_reference`
  - `pbm_info`
  - `pending_registrations`
  - `profiles`
  - `reference_dataset_versions`
  - `report_files`
  - `subscriptions`
  - `user_businesses`
  - `user_data`
  - `user_roles`
  - `wac_reference`

## Observation to return to Cody

Return only:

1. confirmation that the Director personally executed and witnessed the command;
2. exit code;
3. whether all 15 migrations reported `ok`;
4. sanitized final table count and inventory.

Do not return the connection string, username/password pair, access keys, or other credentials.

## Current status

`DIRECTOR ONE-WALK — AWAITING MANUAL OBSERVATION`

Cody's two deterministic resets are separately preserved in `CODY_AC02_AC13_SCRATCH_RESETS_20260828101509.log`; they do not impersonate or replace this manual witness.
