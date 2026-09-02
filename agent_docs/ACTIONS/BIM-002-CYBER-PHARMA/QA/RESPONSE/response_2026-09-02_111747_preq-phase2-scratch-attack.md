# BIM-002 PRE-Q — Phase 2 SCRATCH Destructive RLS Attack

**Checkpoint:** PRE-Q Phase 2 only  
**Execution agent:** Cody  
**Local response timestamp:** 2026-09-02 11:17:47 +0800  
**Branch:** `qa/bim002` (resolved without a Git command)  
**HEAD:** `53f1ac0004f40e4df9e403188382b16afb92899f`  
**Released target:** SCRATCH only  
**Phases 3 and 4:** LOCKED; neither executed  
**QA posture:** Observations only. No module verdict is issued.

## 1. Target-selection attestation

The following was persisted before the first destructive operation:

**INTENDED TARGET: SCRATCH**

Non-secret resolver observations:

- No `RLS_HARNESS_PREFIX` process override was active.
- No replica prefix was active.
- No `RLS_REPLICA_*` process key name was present.
- Default `RLS_HARNESS_*` key names were absent: 0 of 4.
- All Amendment A-1 fallback key names were present: 4 of 4.
- Resolver selection was unambiguous under Sol’s released SCRATCH plan.
- Expected signal observed: `[env] A-1 fallback in use` for all four logical inputs.
- The reset tool’s host/database output was redacted in QA evidence.

No credential value, URL, key value, password, token, or connection string was printed or persisted.

Target preflight evidence:

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P2_target_preflight_2026-09-02_111045.log`

## 2. Files/probes created

- QA-only live probe: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase2-scratch-attack.mjs`
- Unique raw evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P2_scratch_attack_2026-09-02_111045.log`
- This mandatory response artifact.

The probe did not invoke the shipped broad matrix and did not rewrite its `seed-map.json`. It used the shipped environment/client libraries and reset chain, then supplied independent QA seeding, exact identity assertions, existing-row targets, operation-specific denial checks, service-role before/after truth, and an independent policy allowlist.

## 3. Destructive scope actually executed

On the attested SCRATCH selection only:

1. Dropped the SCRATCH public schema in the established event-trigger-first order.
2. Rebuilt the baseline and applied migrations 0001–0027 from empty public schema.
3. Independently purged pre-existing Auth users with repeated page-1 batches of at most 1,000 until empty; 4 were observed and removed.
4. Created the four cast identities and non-vacuous two-account/three-store seed.
5. Ran helper, identity, tenant, mutation, deny-all, and catalog attacks.
6. Captured service-role ground truth before cleanup; signed out sessions only and retained the seeded SCRATCH database.

No revocation/re-grant action was performed. Replica and dev backend were not contacted.

## 4. Fresh helper security observations

All observations came after the fresh reset/apply.

| Helper | Owner | SECURITY DEFINER | Volatility | Search path | PUBLIC EXECUTE | anon EXECUTE | authenticated EXECUTE | service-role privilege |
|---|---|---:|---|---|---:|---:|---:|---:|
| `is_member_of(uuid)` | `postgres` | true | STABLE | empty | false | false | true | true |
| `is_admin_of(uuid)` | `postgres` | true | STABLE | empty | false | false | true | true |
| `is_account_member(uuid)` | `postgres` | true | STABLE | empty | false | false | true | true |
| `my_business_ids()` | `postgres` | true | STABLE | empty | false | false | true | true |

Privilege distinction:

- PUBLIC denial was established from each function’s expanded ACL: no PUBLIC EXECUTE grant existed.
- Direct execution as `anon` was attempted for all four helpers. Every call was refused with `42501` permission denial; this was not ordinary false-result behavior.
- Direct execution as `authenticated`, under ownerA’s database claim, succeeded for all four:
  - membership: A1 true, B1 false;
  - admin: A1 true;
  - account membership: Account A true;
  - `my_business_ids()`: exactly A1 and A2.
- The anon RPC call to `my_business_ids()` was separately refused with `42501` and a function-permission message.

## 5. Exact session identity results

Before any authenticated policy observation, each publishable-key session was compared to the independently seeded expected user ID.

| Identity | Sign-in error | Returned ID equals seeded expected ID |
|---|---:|---:|
| ownerA | none | true |
| staffA | none | true |
| ownerB | none | true |
| multiStore | none | true |

No identity mismatch occurred. Raw evidence stores the exact relationship result without printing IDs or tokens.

## 6. Tenant-isolation observations

### Exact allowed counts

| Identity | businesses | own junction rows | user_data | report_files | accounts | subscriptions |
|---|---:|---:|---:|---:|---:|---:|
| ownerA | 2 | 2 | 400 | 2 | 1 | 1 |
| staffA | 1 | 1 | 200 | 1 | 1 | 1 |
| ownerB | 1 | 1 | 200 | 1 | 1 | 1 |
| multiStore | 2 | 2 | 400 | 2 | 2 | 2 |

Every observed count matched the independently constructed seed relationship.

### Foreign direct-ID/relationship reads

- ownerA, staffA, and ownerB each received zero rows with no error for a known foreign business, `user_data` row, report file, another user’s junction rows, account, and subscription.
- multiStore received zero rows with no error for known foreign A2 business, `user_data`, report file, and another user’s junction rows.
- A foreign account/subscription case is not available for multiStore in this seed because multiStore intentionally belongs to a business under each of the only two accounts; this is declared as N/A, not silently scored.

### Formulation C result sets

Authenticated RPC calls to live `my_business_ids()` returned:

- ownerA: A1, A2
- staffA: A1
- ownerB: B1
- multiStore: A1, B1

All matched the independently seeded membership sets. Catalog predicates showed C on businesses, `user_data`, and `report_files`; no inline formulation B was found.

## 7. Existing-row mutation attacks and denial shapes

All critical denials below used an existing/valid target or valid insert payload. Ground truth was captured before any cleanup.

| Attack | Contract expectation | Observed user-under-test result | Service-role before → after | Observation |
|---|---|---|---|---|
| ownerB foreign-business `user_data` INSERT into A1 | `42501` | `42501`; RLS message | A1 count 200 → 200 | Shape and truth matched. |
| staffA UPDATE re-home existing A1 row to B1 | zero affected, no error | **`42501`**; RLS `WITH CHECK` message | business A1 → A1 | Row stayed unchanged, but denial shape contradicted AC3 prose. |
| staffA member DELETE existing A1 row | zero affected, no error | zero rows, no error | row count 1 → 1 | Shape and truth matched. |
| ownerA admin DELETE dedicated existing A1 row | allowed, one affected | one row, no error | row count 1 → 0 | Admin/member distinction observed. |
| staffA self-promotes existing junction to admin | zero affected, no error | zero rows, no error | role member → member | Shape and truth matched. |
| ownerA UPDATE existing Account A | zero affected, no error | zero rows, no error | name unchanged | Shape and truth matched. |
| ownerA UPDATE existing `pbm_info` reference row | zero affected, no error | zero rows, no error | value unchanged | Shape and truth matched. |

### Re-home discrepancy

The live implementation denied the re-home and preserved ground truth, but the response shape was `42501`, not the Acceptance Spec’s “0 affected” statement.

This is not new behavior relative to Engineering’s raw evidence: both inspected X4 attack logs record A3.1 as `error 42501` with unchanged business ID. The Acceptance Spec’s AC3 prose says “0 affected,” while its Engineering evidence table only says “re-home refused” and does not repeat the code. The generic Engineering DENY classifier accepted either outcome, so it did not surface this contract-shape mismatch.

Classification for Sol: **live behavior / Acceptance Spec / Engineering-summary discrepancy**. Phase 2 observed no authorization widening or persisted mutation in this case. No code or criterion was changed.

## 8. False-green controls

- Every authenticated session ID matched the independently seeded ID before policy observations.
- Every critical UPDATE/DELETE denial targeted a service-role-confirmed existing row.
- Foreign INSERT used a valid payload and required code `42501`; arbitrary errors were not accepted.
- UPDATE/DELETE expected denials required zero rows, no error, and unchanged service truth. This is what exposed the re-home shape discrepancy.
- The three deny-all tables each contained one service-role-visible row before ownerA’s zero-row/no-error read was accepted.
- Raw evidence preserves identity-to-store labels, exact counts, expected/observed shapes, and before/after relationships without UUID normalization.
- Service-role cleanup did not run before ground truth. Only session sign-out occurred after evidence capture; the seeded SCRATCH state remains.

## 9. Policy, baseline, Storage, and forbidden-source catalog

The independent live allowlist comparison observed:

- Exactly 18 public policies, matching the independently constructed table/command/name allowlist.
- Exactly 15 BIM-002 policies.
- Exactly 3 baseline policies with expected names, commands, authenticated roles, and baseline predicate semantics:
  - `Users can read their own role`
  - `Profiles are viewable by owner or superadmins`
  - `Profiles are updatable by owner or superadmins`
- Zero policies on `pending_registrations`, `apa_memberships`, and `audit_logs`.
- Zero policies on `storage.objects` after the fresh chain.
- Exactly three live C predicates: business, `user_data`, and report-file SELECT.
- Zero live inline-B predicates, including schema-qualified junction-source search.
- Zero forbidden BIM-002 policy/helper references to `user_roles`, `profiles`, `user_metadata`, `raw_user_meta_data`, or `owner_user_id`.

Catalog queries used `pg_catalog`/`pg_policies`, not `information_schema`.

## 10. Instrument findings

1. **P1-04 independently controlled:** the QA probe rejected the shipped matrix’s missing session-ID assertion by checking every identity first. All four identities were exact on this run.
2. **P1-05 confirmed as consequential:** the generic Engineering classifier accepts any API error as DENY. It accepted A3.1’s `42501` even though AC3 prose specified zero affected/no error, hiding a denial-shape mismatch.
3. **P1-06 independently controlled:** the QA probe used existing rows for critical UPDATE/DELETE attacks. Missing-sentinel rows were not used for those conclusions.
4. **P1-10 independently controlled operationally:** selection was gated and persisted before reset, but the shipped reset path still lacks an independent project allowlist. Tony’s released A-1 selection remained the authority boundary.
5. Engineering’s dedicated attack ground truth correctly recorded the re-home row unchanged, but its broad DENY vocabulary was too coarse to enforce the Acceptance Spec’s stated operation shape.

Instrument classification remains **TRUST WITH INDEPENDENT GROUND TRUTH**; this is not a module verdict.

## 11. Implementation findings

- No access-control widening or cross-tenant persistence was observed in the released Phase-2 attack set.
- Fresh helper shape, ownership, ACLs, direct execution, C membership sets, exact tenant counts, foreign direct-ID reads, selected existing-row mutations, policy allowlist, baseline policies, deny-all policy counts, Storage count, and forbidden-source checks all matched the ruled implementation expectations.
- One implementation behavior differs from the literal AC3 denial-shape prose: UPDATE re-home returns `42501` while remaining securely unchanged. Raw Engineering X4 evidence shows the same behavior. Sol must classify/adjudicate the contract significance; Cody issues no verdict.

## 12. Discrepancies

| ID | Discrepancy | Sources |
|---|---|---|
| P2-D1 | AC3 says UPDATE re-home → 0 affected; fresh QA and both checked X4 logs observe `42501`, with row unchanged. | Acceptance Spec AC3; QA raw evidence `MUT-REHOME`; X4 attack logs A3.1 |
| P2-D2 | Engineering’s generic DENY classifier cannot distinguish P2-D1 from the stipulated UPDATE zero/no-error shape. | `lib/verdict.mjs`; Engineering X4 log; Phase-1 P1-05 |

No discrepancy was silently reconciled or repaired.

## 13. Declared gaps

- Phase 3 same-session revocation/One-Walk was not executed or altered.
- Replica and dev backend were not contacted.
- PUBLIC denial was proven from expanded live ACL state, with anon direct calls confirming no inherited EXECUTE. A temporary synthetic PUBLIC-only role was not created.
- multiStore has no foreign account/subscription in the two-account seed because it is intentionally a member under both; that pair is N/A for multiStore.
- This run observed only 4 pre-existing Auth identities. The QA purge logic paginates/repeats beyond 1,000, but an actual >1,000-user target was not manufactured.
- Baseline preservation was checked by exact policy allowlist plus predicate semantics after fresh apply, not by a pre/post byte snapshot within this same run.
- Board commands, replica reproducibility, and One-Walk remain outside Phase 2.
- The seeded SCRATCH state remains for Sol/Tony review; no assumption is made that it remains unchanged after this response.

## 14. Product-file modification status

**No shipped product, migration, harness, package, authority, Engineering evidence, environment, or Git metadata file was modified.**

Phase-2 writes are confined to QA debris:

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase2-scratch-attack.mjs`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P2_target_preflight_2026-09-02_111045.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P2_scratch_attack_2026-09-02_111045.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/RESPONSE/response_2026-09-02_111747_preq-phase2-scratch-attack.md`

The database operation intentionally changed only the authorized SCRATCH throwaway.

## 15. STOP

**STOP — Phase 2 complete. Phase 3 One-Walk and Phase 4 replica remain LOCKED. Awaiting Sol.**
