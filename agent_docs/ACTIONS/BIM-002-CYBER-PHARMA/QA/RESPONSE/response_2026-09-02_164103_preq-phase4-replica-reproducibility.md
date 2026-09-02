# BIM-002 PRE-Q — Phase 4 Replica Reproducibility

**Timestamp:** 2026-09-02 16:41:03 +08  
**Scope:** focused REPLICA-only reset/apply, catalog comparison, and minimal smoke  
**Module verdict:** NOT ISSUED

## 1. Target-selection attestation

Before the destructive reset, the selector was checked by environment key names and resolver outcome only:

- `INTENDED TARGET: REPLICA`
- `RLS_HARNESS_PREFIX=RLS_REPLICA_` resolved exactly.
- All four `RLS_REPLICA_*` logical keys were present: 4/4.
- Amendment A-1 fallback was not used.
- The publishable and secret inputs resolved and remained distinct through the fail-closed loader.
- No credential value, URL, host, database name, password, key, token, or connection string was printed. The reset runner's normal host/database banner was replaced with `target=REPLICA (host/db redacted)`.

No target ambiguity was observed.

## 2. Reset / exact baseline / apply

The authorized REPLICA reset used the existing certified reset runner with the replica DB input and destructive confirmation scoped to this run.

Observed sequence:

- event trigger dropped before schema removal;
- `public` schema rebuilt and Supabase-standard grants restored;
- exact baseline bootstrap applied;
- migrations `0001` through `0027` applied in order;
- every migration reported `ok`;
- exit code `0`;
- final inventory reported 16 public tables.

`RESET-APPLY-EXIT` and `CHAIN-THROUGH-0027` both matched.

## 3. Live helper and catalog comparison

All catalog reads used `pg_catalog`/`pg_policies`. Replica observations matched the preserved SCRATCH Phase-2 shape:

| Security-significant item | REPLICA observation | SCRATCH comparison |
|---|---|---|
| Public tables | 16, exact expected names | Same |
| Helpers | 4 exact names | Same |
| Helper owner | `postgres` for all four | Same |
| Helper mode | `SECURITY DEFINER`, `STABLE`, empty search path | Same |
| Helper EXECUTE | PUBLIC=false, anon=false, authenticated=true | Same |
| Public policies | 18 exact table/command/name entries | Same |
| BIM-002 policies | 15 | Same |
| Baseline policies | 3 with preserved baseline semantics | Same |
| Policy roles | all `{authenticated}` | Same |
| Deny-all tables | zero policies on `pending_registrations`, `apa_memberships`, `audit_logs` | Same |
| Storage | zero `storage.objects` policies | Same |
| Formulation C | exactly 3: `businesses`, `report_files`, `user_data` SELECT | Same |
| Inline formulation B | zero | Same |
| Forbidden sources | zero BIM-policy/helper references | Same |
| BIM predicates | zero normalized differences | Same |

Forbidden-source scanning covered `user_roles`, `user_metadata`, `raw_user_meta_data`, `profiles`, and `owner_user_id`. The three inherited baseline policies on `user_roles`/`profiles` were excluded from the BIM-policy forbidden-source test, as they were on SCRATCH.

The complete normalized policy inventory, commands, roles, `qual`, and `with_check` values are retained in raw evidence.

## 4. Minimal behavioral smoke

Only the necessary replica state was seeded: one confirmed identity, one account, two businesses, one A1 junction membership, and one `user_data` row in each of A1/B1.

| Probe | Observation |
|---|---|
| Exact authenticated identity | sign-in succeeded; returned user ID equaled seeded ID |
| Own-tenant direct-ID read | no error, 1 row |
| Known foreign-tenant direct-ID read | no error, 0 rows |
| Anonymous `my_business_ids()` | denied with `42501` |
| Authenticated `my_business_ids()` | no error, 1 membership, exact set A1 |

No One-Walk or broad Red Team battery was repeated.

## 5. Instrument discrepancy and correction

The initial focused raw run logged one smoke mismatch and then a derived shape mismatch:

- authenticated `my_business_ids()` returned `code=none,count=1`, but the new inline probe assumed each row was an object with a `my_business_ids` property;
- this target/client returned the single row as a scalar UUID string;
- the initial probe therefore labeled the set `unexpected`, despite the successful one-row response.

This was not silently reconciled. A separate non-mutating correction reused Phase 2's established normalization:

```text
typeof row === object ? Object.values(row)[0] : row
```

The correction observed `RPC_RESPONSE_SHAPE=string`, preserved no value, and matched the normalized result to the service-ground-truthed A1 membership. Exact session identity and junction pre-state were reconfirmed. The correction recorded `security_significant_difference=false`.

Classification for Sol: **QA instrument response-shape assumption only**. No migration, helper, policy, ACL, tenant-read, or authenticated membership-set difference was observed.

## 6. SCRATCH-vs-REPLICA differences

Security-significant differences after correcting the probe decoder: **zero observed**.

Comparison source: `QA/evidence/P2_scratch_attack_2026-09-02_111045.log`, especially helper lines 69–73 and catalog lines 158–188. Generated IDs, timestamps, timings, existing-auth purge counts, and target identifiers were ignored as directed.

The initial raw mismatch remains preserved; the correction is a second evidence file rather than an overwrite.

## 7. Declared gaps

- Full SCRATCH attack-battery behavior was not replayed on REPLICA by scope.
- The Phase-3 One-Walk was not repeated.
- Exact remote JWT lifetime and non-security project settings were not compared.
- REPLICA retains the minimal smoke seed for Sol/Tony inspection; no post-run destructive cleanup was authorized or performed.
- Dev backend was not contacted.

## 8. Product-file modification status

No shipped product, migration, harness, package, CI, or authority file was modified. Only QA evidence and this QA response were created. A temporary two-line QA probe placeholder created during a failed patch attempt was removed; it contained no executable probe or product content.

## 9. Evidence index

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P4_replica_reproducibility_2026-09-02_163539.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P4_replica_rpc_shape_correction_2026-09-02_163539.log`
- SCRATCH reference: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P2_scratch_attack_2026-09-02_111045.log`

**STOP — Phase 4 focused REPLICA reproducibility work is complete. No module verdict issued. Awaiting Sol.**
