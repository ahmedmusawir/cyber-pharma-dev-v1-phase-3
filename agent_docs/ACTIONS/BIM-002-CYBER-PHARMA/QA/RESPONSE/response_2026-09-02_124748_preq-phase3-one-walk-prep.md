# BIM-002 PRE-Q — Phase 3 One-Walk Preparation

**Checkpoint:** Phase 3 preparation only  
**Execution agent:** Cody  
**Local timestamp:** 2026-09-02 12:47:48 +0800  
**Branch:** `qa/bim002`  
**HEAD:** `53f1ac0004f40e4df9e403188382b16afb92899f`  
**Intended target:** SCRATCH only  
**Mutation status:** No membership revocation or restoration executed  
**Replica/dev:** Not touched  
**QA posture:** Procedure/readiness only; no module verdict.

## 1. Architect ruling received

The launch ruling is recorded as follows:

- Option A ratified.
- Accessible-row re-home rejected by `WITH CHECK` → `42501`; ground-truth business unchanged.
- Unreachable-row UPDATE denied by `USING` → zero affected/no error; ground truth unchanged.
- P2-D1 classification: contract/spec defect only.
- Implementation defect count remains zero.
- E-6 and F-14 are named as governing certification.

Disk discrepancy: a full `agent_docs/` search found no E-6/F-14 text at preparation time, and `ACCEPTANCE_SPEC.md` AC3 still contains the stale accessible-row “0 affected” wording. The Architect ruling in this launch instruction is unambiguous for preparation, but the absent disk amendments are declared documentation residue/gap. Cody did not edit authority or implementation.

## 2. Non-destructive readiness reconfirmation

### Specimen and target

- `.git/HEAD` still resolves `qa/bim002`.
- Branch ref still equals the pinned PRE-Q SHA.
- No `RLS_HARNESS_PREFIX` or replica prefix is active.
- No `RLS_REPLICA_*` process key name is active.
- Default `RLS_HARNESS_*` key names remain absent (0/4).
- Amendment A-1 fallback key names remain present (4/4).
- Expected `[env] A-1 fallback in use` signal was observed.
- Target selection remains unambiguous: **SCRATCH**.

### Seed/session readiness

- Exactly one multiStore Auth identity exists.
- Exact preparation sign-in identity matched that Auth row.
- Store A1 and Store B1 both exist.
- Service-role junction truth:
  - multiStore → A1: one row, role `member`, primary `true`.
  - multiStore → B1: one row, role `member`, primary `false`.
- Service-role `user_data`: A1=200, B1=200.
- Preparation session visibility: businesses A1+B1; `user_data` A1=200+B1=200.
- The preparation session was signed out. The actual One-Walk will create and retain a new single session from pre-state through revoke and restore verification.

Readiness evidence:

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_readiness_2026-09-02_124447.log`

## 3. Prepared components

### Terminal A — Cody’s same-session controller

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs`

Properties:

- Revalidates branch/HEAD and A-1 SCRATCH selection before contact.
- Signs in multiStore once through the publishable client.
- Compares returned session user ID to the Auth row.
- Holds the same client/session and original access token in memory.
- Persists only a SHA-256 token fingerprint and byte-equality results, never the token.
- Captures pre-state and pauses before mutation.
- Performs no membership mutation.
- Resumes only after Tony’s explicit revoke completion.
- Reuses the same client/session without sign-in or refresh for post-revoke proof.
- Can then verify restoration on that same session.

### Terminal B — Tony-only guarded mutation helper

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs`

Properties:

- Revalidates branch/HEAD and A-1 SCRATCH selection.
- Resolves the exact multiStore, A1, and B1 rows by stable seed labels without printing IDs.
- Uses the authorized service-role client only for the mutation/truth boundary.
- Aborts revoke unless A1=1 and B1=1, and the B1 row is `member`, non-primary.
- Revocation predicate is exactly `user_id = multiStore` AND `business_id = B1`; A1 is absent from the delete predicate.
- Aborts restore unless A1=1 and B1=0.
- Restores exactly multiStore→B1 with role `member`, `is_primary=false`.
- Writes separate Tony action evidence with pre/post counts and no credentials.

Both scripts were syntax-checked only. Neither script was executed during preparation.

## 4. Reserved evidence paths for the One-Walk

The exact procedure below reserves these currently nonexistent unique paths:

- Cody session/pre/post/restore evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_session_2026-09-02_124748.log`
- Tony revoke evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_2026-09-02_124748.log`
- Tony restore evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_2026-09-02_124748.log`

If any reserved path exists before execution, stop and choose new unique timestamps; never overwrite evidence.

## 5. Exact One-Walk sequence

All commands run from repository root. Do not export a prefix. Sol/Tony must release execution before step 1.

### Step 1 — Cody starts Terminal A and captures INITIAL STATE

Cody runs:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_session_2026-09-02_124748.log
```

Expected controller observations before it pauses:

1. Branch/HEAD and SCRATCH guards accept.
2. Exact multiStore session identity is true.
3. A token fingerprint is recorded; token value is not.
4. Visible businesses are exactly `Store A1,Store B1`.
5. Same session counts are A1=200 and B1=200.
6. Service-role junction truth is A1=1 and B1=1.
7. Evidence contains `PRE_STATE_CAPTURED=true`.
8. Evidence contains `STOP_POINT_BEFORE_REVOCATION=true`.
9. Terminal A displays `WAITING_FOR_TONY` and waits. Cody does not type `POST` yet and does not close this process.

If any expectation differs, Cody stops; Tony performs no mutation.

### Step 2 — mandatory eyes-on STOP immediately before mutation

Sol/Tony inspect Terminal A and the pre-state evidence. The first revocation mutation has still not occurred.

This is the required preparation STOP boundary and the handoff point to Tony.

### Step 3 — Tony executes the exact REVOCATION in Terminal B

Only Tony runs:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs revoke agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_2026-09-02_124748.log
```

The helper’s exact service-role action is semantically:

```text
DELETE public.user_businesses
WHERE user_id = resolved multiStore
  AND business_id = resolved Store B1
RETURNING role, is_primary
```

Expected Tony evidence:

- Precondition A1=1, B1=1.
- B1 role=`member`, primary=`false`.
- Exactly one row deleted.
- Post-truth A1=1, B1=0.
- `TONY_ACTION_COMPLETE=REVOKE_EXACT_B1_ONLY`.

Tony does not alter A1, refresh Cody’s session, or run any other harness/reset command. If the helper aborts or does not print the exact completion marker, Cody does not proceed.

### Step 4 — Cody performs SAME-SESSION PROOF in Terminal A

After Tony confirms step 3 and its evidence exists, Cody types exactly:

```text
POST
```

The still-running controller must observe, without sign-in or refresh:

1. Access token byte-equal to the original; same fingerprint.
2. Session user ID still equals multiStore.
3. Visible businesses exactly `Store A1`.
4. A1 `user_data` remains 200.
5. B1 `user_data` becomes 0 immediately.
6. Service truth A1=1, B1=0.
7. Evidence contains `POST_REVOCATION_SAME_SESSION_CAPTURED=true`.

The controller then pauses for Tony’s restore. If any assertion differs, leave Terminal A/evidence intact and Sol directs recovery; Cody does not autonomously mutate.

### Step 5 — Tony executes exact RESTORE in Terminal B

Only Tony runs:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs restore agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_2026-09-02_124748.log
```

The exact service-role action is semantically:

```text
INSERT public.user_businesses
  (user_id=resolved multiStore,
   business_id=resolved Store B1,
   role='member',
   is_primary=false)
```

Expected Tony evidence:

- Precondition A1=1, B1=0.
- Exactly one B1 row inserted.
- Inserted role=`member`, primary=`false`.
- Post-truth A1=1, B1=1.
- `TONY_ACTION_COMPLETE=RESTORE_EXACT_B1_ONLY`.

### Step 6 — Cody verifies RESTORE on the SAME SESSION

After Tony confirms step 5 and its evidence exists, Cody types exactly in Terminal A:

```text
RESTORED
```

Expected controller observations:

1. Token remains byte-identical to the original; same fingerprint.
2. Session identity remains exact multiStore.
3. Visible businesses return to `Store A1,Store B1`.
4. Same-session counts return to A1=200, B1=200.
5. Service truth is A1=1, B1=1.
6. Evidence contains `RESTORATION_SAME_SESSION_CAPTURED=true` and `ONE_WALK_OBSERVATIONS_COMPLETE=true`.

Only after final evidence is saved does the controller sign out and close.

## 6. Responsibility boundary

| Step | Actor | Mutation? |
|---|---|---:|
| Start/hold one session; pre-state evidence | Cody | No |
| Inspect pre-state and authorize hands action | Sol/Tony | No |
| Delete exactly multiStore→B1 | **Tony only** | **Yes** |
| Post-revoke same-session proof | Cody | No |
| Restore exactly multiStore→B1 | **Tony only** | **Yes** |
| Post-restore same-session proof | Cody | No |

Cody never runs the Tony helper and never performs the membership mutation autonomously.

## 7. Evidence law coverage

The prepared sequence captures:

- exact pre-state relationships and counts;
- exact session identity equality;
- token fingerprint and byte equality without token value;
- A1/B1 pre-revocation visibility;
- service-role pre-junction truth;
- Tony’s exact one-row revoke scope/result;
- same-session post-revocation visibility;
- post-revocation service truth;
- Tony’s exact one-row restoration scope/result;
- same-session restored visibility and restoration truth.

No normalization is applied to these raw relation/count/equality observations.

## 8. Declared gaps / execution preconditions

- E-6/F-14 are named by the Architect ruling but are not yet found on disk; certification should not silently assume the files landed.
- The reserved One-Walk evidence files do not yet exist because execution is not authorized in this preparation step.
- SCRATCH state can change after readiness capture. Terminal A revalidates all required preconditions immediately before Tony’s mutation.
- Any branch/HEAD, prefix, target-key-name, identity, row-count, role, or primary-flag mismatch aborts before mutation.
- Replica, dev backend, full `rls:prove`, reset, and One-Walk mutation were not executed here.

## 9. Product-file modification status

No product, migration, shipped harness, package, authority, Engineering evidence, environment, or Git metadata file was modified.

Preparation writes are QA-only:

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_readiness_2026-09-02_124447.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/RESPONSE/response_2026-09-02_124748_preq-phase3-one-walk-prep.md`

## 10. STOP

**STOP — preparation complete immediately before the first revocation mutation. Awaiting Sol and Tony. No revocation executed.**
