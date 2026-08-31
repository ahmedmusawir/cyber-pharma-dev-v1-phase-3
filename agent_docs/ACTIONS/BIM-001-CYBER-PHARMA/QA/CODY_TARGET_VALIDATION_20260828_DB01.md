# CODY QA EVIDENCE — BIM-001 Throwaway Target Validation

- Probe identity: `CODY-BIM001-TARGET-VALIDATION-DB01`
- Timestamp: 2026-08-28 (Asia/Kuala_Lumpur)
- Branch: `qa/bim-001-cody-01`
- Tested HEAD: `fefde109fe50eb55839dee4dd29129b2ea3de90c`
- Procedure: Director-provided direct URLs accepted in memory; expected project references checked; read-only catalog queries executed through the Engineering-handoff regional poolers.
- Secrets: no password or connection string is stored in this artifact.

## Sanitized identities and observations

### SCRATCH

- Project reference: `jmzwhgnyunwssamrqyhp`
- Direct host identity: `db.jmzwhgnyunwssamrqyhp.supabase.co`
- Working connection path: `aws-1-us-west-1.pooler.supabase.com`, database `postgres`
- Direct-path observation: `ENETUNREACH` (IPv6-only endpoint from this runner), consistent with Engineering handoff
- Pooler observation: connected read-only
- Initial state: exactly 16 expected public tables; 3 expected baseline policies; contract functions `handle_new_user`, `rls_auto_enable`, `update_updated_at`
- Role consistency: consistent with disposable full-chain/reset surface

### REPLICA

- Project reference: `ihgcsrypblqkwommrkgj`
- Direct host identity: `db.ihgcsrypblqkwommrkgj.supabase.co`
- Working connection path: `aws-1-ap-south-1.pooler.supabase.com`, database `postgres`
- Direct-path observation: `ENETUNREACH` (IPv6-only endpoint from this runner), consistent with Engineering handoff
- Pooler observation: connected read-only
- Initial state: exactly 16 expected public tables; 3 expected baseline policies; contract functions `handle_new_user`, `rls_auto_enable`, `update_updated_at`
- Role consistency: consistent with disposable baseline-to-chain replay surface preserved post-replay

Initial public table inventory on both targets:

`aac_reference, accounts, apa_memberships, audit_logs, businesses, ful_reference, pbm_info, pending_registrations, profiles, reference_dataset_versions, report_files, subscriptions, user_businesses, user_data, user_roles, wac_reference`

Initial policy inventory on both targets:

- `profiles.Profiles are updatable by owner or superadmins`
- `profiles.Profiles are viewable by owner or superadmins`
- `user_roles.Users can read their own role`

## Target-validation result

Both Director-declared targets are distinguishable, reachable through their documented poolers, and their observed initial state is consistent with their assigned disposable BIM-001 roles. Destructive QA execution may proceed against these two targets only.

## QA-instrument failures before validation

1. The first interactive credential loader queued multiple `read` setup lines at once. The shell consumed setup text as input and later treated the supplied URLs as commands. No database connection or filesystem change occurred, but the URLs appeared in transient tool output. Corrective status: loader abandoned; credentials should be rotated after QA.
2. The first corrected Node validator exited on a JavaScript regular-expression syntax error before reading credentials. Corrective status: simplified validator reran.
3. The direct database endpoints returned `ENETUNREACH`. Corrective status: rerun through the handoff-specified regional session poolers succeeded.
