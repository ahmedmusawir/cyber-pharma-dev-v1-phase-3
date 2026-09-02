# BIM-002 PRE-Q — Phase 3 Controlled One-Walk Rerun Preparation

**Timestamp:** 2026-09-02 15:14:55 +08  
**Classification carried from Sol:** attempt #1 was an instrument/timing failure only  
**Preparation status:** complete; rerun not started  
**Mutation status:** no revocation or restoration executed in this preparation  
**Target if later released:** SCRATCH only  
**Module verdict:** NOT ISSUED

## 1. QA-only controller

Updated controller:

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs`

Static validation: `node --check` completed successfully. The controller has not been executed and no attempt-2 evidence file exists yet.

The existing Tony-only boundary remains unchanged:

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs`

No shipped product, migration, harness, package, or authority file was changed.

## 2. Exact hardening and guards

### Client/session construction

- Constructs one publishable-key Supabase client with explicit `autoRefreshToken: false`, `persistSession: false`, and `detectSessionInUrl: false`.
- Calls `client.auth.stopAutoRefresh()` immediately after construction.
- Registers `onAuthStateChange()` before sign-in and records event names only.
- `TOKEN_REFRESHED` sets an abort flag, writes the event/abort signal, releases a guard watched by prompts and API operations, and prevents any AC2 evidence claim.
- Signs in multiStore once and asserts the returned `session.user.id` equals the seeded database identity.
- Stores the original access token only in process memory. It never prints or writes token contents or a fingerprint.
- Retains an object anchor and proves the same client object at POST and RESTORED.

### Lifetime guard

- Decodes only the JWT `exp` claim in memory.
- Auth-js refresh margin: **90 seconds**.
- Required buffer beyond that margin: **15 minutes / 900 seconds**.
- Minimum remaining lifetime before arming Tony's mutation: **990 seconds / 16 minutes 30 seconds**.
- Evidence records only remaining whole seconds/minutes.
- If remaining lifetime is below 990 seconds after pre-state queries, the controller aborts before displaying the mutation-ready checkpoint.

### Deadline guard

- `preStateCapturedAt` is set at the `PRE_STATE_CAPTURED` checkpoint.
- POST deadline is exactly `preStateCapturedAt + 300,000 ms`.
- The Terminal A prompt has an actual timer; it aborts if POST is not received within five minutes.
- After POST input and before `getSession()` or any post-revocation query, the controller rechecks elapsed time `<=300s`, remaining lifetime `>90s`, no refresh event, and same client object.

### Continuity order at POST

1. Deadline check.
2. Expiry-margin check.
3. `TOKEN_REFRESHED` absence check.
4. Same-client-object check.
5. `getSession()` through the refresh-event race guard.
6. Recheck no refresh event.
7. Assert access token byte-identical to the in-memory original.
8. Assert exact seeded user identity.
9. Only then query post-revocation visibility and service-role ground truth.

Any failed lifetime, deadline, auth-event, client, token, or identity assertion writes `AC2_EVIDENCE_CLAIMED=false` and aborts. If Tony already revoked B1, the abort evidence explicitly directs Tony to run the guarded restore before leaving SCRATCH.

## 3. Unique attempt-2 evidence paths

All were confirmed absent during preparation and will not overwrite attempt #1:

- Terminal A session evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_rerun_session_2026-09-02_151455.log`
- Tony revoke evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_rerun_2026-09-02_151455.log`
- Tony restore evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_rerun_2026-09-02_151455.log`

## 4. Exact controlled rerun sequence

This is prepared only. Sol must separately release execution.

### Step 1 — Cody starts Terminal A

From repository root, Cody runs:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_rerun_session_2026-09-02_151455.log
```

Expected pre-state checkpoint before any mutation:

```text
AUTH_OPTIONS autoRefreshToken=false persistSession=false detectSessionInUrl=false
AUTH_STOP_AUTO_REFRESH_CALLED=true
AUTH_EVENT_LISTENER_REGISTERED_BEFORE_SIGN_IN=true
MATCH PRE-SESSION-IDENTITY | expected=exact-seeded-id=true | observed=exact-seeded-id=true
MATCH PRE-NO-TOKEN-REFRESH | expected=false | observed=false
MATCH PRE-VISIBLE-BUSINESSES | expected=Store A1,Store B1 | observed=Store A1,Store B1
MATCH PRE-USER-DATA | expected=A1=200,B1=200 | observed=A1=200,B1=200
MATCH PRE-JUNCTION-TRUTH | expected=A1=1,B1=1 | observed=A1=1,B1=1
MATCH PRE-QUERY-NO-TOKEN-REFRESH | expected=false | observed=false
TOKEN_LIFETIME_AT_ARM_SECONDS=<at least 990; no token value>
TOKEN_LIFETIME_AT_ARM_MINUTES=<remaining whole minutes>
MATCH PRE-LIFETIME-ARM-GUARD | expected=>=990s | observed=<at least 990>s
PRE_STATE_CAPTURED=true
POST_WINDOW_ARMED=true
STOP_POINT_BEFORE_REVOCATION=true
WAITING_FOR_TONY=run guarded revoke in Terminal B; then type POST here within 300 seconds
```

Only event names such as `INITIAL_SESSION` and `SIGNED_IN` may also appear. `TOKEN_REFRESHED` must not appear.

Sol/Tony must inspect this checkpoint immediately. Do not run the revoke if any line mismatches, the controller exits, remaining lifetime is under 990 seconds, or `TOKEN_REFRESHED` appears.

### Step 2 — Tony alone revokes exactly multiStore → B1

While Terminal A remains waiting and before its five-minute deadline, Tony runs in Terminal B:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs revoke agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_rerun_2026-09-02_151455.log
```

Required Tony completion marker:

```text
TONY_ACTION_COMPLETE=REVOKE_EXACT_B1_ONLY
```

The helper requires pre-state A1=1/B1=1, B1 role=member/primary=false; deletes through the exact `(multiStore, B1)` service-role predicate; and proves post-state A1=1/B1=0. Cody does not execute this action.

If the completion marker is absent, do not type POST. Tony must assess and restore safely if a mutation may have occurred.

### Step 3 — Cody sends POST to the still-running Terminal A

Cody types exactly:

```text
POST
```

The controller then performs this exact sequence:

1. proves PRE-to-POST elapsed time is at most 300 seconds;
2. proves the original JWT remains more than 90 seconds from expiry;
3. proves no `TOKEN_REFRESHED` event occurred;
4. proves the same client object is still in use;
5. calls `getSession()` under the refresh-event abort guard;
6. proves no refresh event was emitted;
7. proves the access token is byte-identical;
8. proves `session.user.id` is the exact seeded multiStore identity;
9. proves businesses visibility is Store A1 only;
10. proves `user_data` A1=200/B1=0;
11. proves service junction truth A1=1/B1=0;
12. proves no refresh event occurred during the post queries;
13. writes `POST_REVOCATION_SAME_SESSION_CAPTURED=true` before inviting restoration.

Required post-state evidence lines include:

```text
MATCH POST-DEADLINE | expected=<=300s
MATCH POST-OUTSIDE-REFRESH-MARGIN | expected=>90s
MATCH POST-PRECHECK-NO-TOKEN-REFRESH | expected=false | observed=false
MATCH POST-SAME-CLIENT-OBJECT | expected=true | observed=true
MATCH POST-GETSESSION-NO-TOKEN-REFRESH | expected=false | observed=false
MATCH POST-TOKEN-CONTINUITY | expected=byte-identical=true | observed=byte-identical=true
MATCH POST-SESSION-IDENTITY | expected=exact-seeded-id=true | observed=exact-seeded-id=true
MATCH POST-VISIBLE-BUSINESSES | expected=Store A1 | observed=Store A1
MATCH POST-USER-DATA | expected=A1=200,B1=0 | observed=A1=200,B1=0
MATCH POST-JUNCTION-TRUTH | expected=A1=1,B1=0 | observed=A1=1,B1=0
MATCH POST-QUERY-NO-TOKEN-REFRESH | expected=false | observed=false
POST_REVOCATION_SAME_SESSION_CAPTURED=true
WAITING_FOR_TONY_RESTORE=...
```

Any mismatch means no AC2 evidence claim. Do not type RESTORED until Tony's restore helper finishes with its exact marker.

### Step 4 — Tony alone restores exactly multiStore → B1

Tony runs in Terminal B:

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs restore agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_rerun_2026-09-02_151455.log
```

Required Tony completion marker:

```text
TONY_ACTION_COMPLETE=RESTORE_EXACT_B1_ONLY
```

The helper requires A1=1/B1=0; inserts only multiStore→B1 with role=member and primary=false; and proves A1=1/B1=1 with the restored attributes. Cody does not execute this action.

### Step 5 — Cody sends RESTORED to Terminal A

Only after Tony's completion marker, Cody types:

```text
RESTORED
```

The controller then:

1. proves the original token is still outside the 90-second refresh margin;
2. proves no `TOKEN_REFRESHED` event occurred;
3. proves the same client object;
4. obtains the session under the refresh-event guard;
5. proves byte-identical token and exact user identity;
6. proves businesses A1+B1, `user_data` A1=200/B1=200, and junction A1=1/B1=1;
7. proves no refresh event occurred during restore verification;
8. writes `RESTORATION_SAME_SESSION_CAPTURED=true`, `ONE_WALK_OBSERVATIONS_COMPLETE=true`, and `module_verdict=NOT_ISSUED`.

If the token reaches the 90-second margin before RESTORED, the controller aborts rather than allowing auth-js to refresh. Tony's service-role restoration evidence remains the authoritative restoration truth in that case.

## 5. Responsibility and safety boundary

| Action | Cody | Tony |
|---|---:|---:|
| Start/observe Terminal A | Yes, after release | No |
| Inspect pre-state/lifetime guards | Yes | Yes |
| Revoke multiStore→B1 | No | **Yes, exact guarded command only** |
| Type POST | Yes, only after Tony marker | No |
| Restore multiStore→B1 | No | **Yes, exact guarded command only** |
| Type RESTORED | Yes, only after Tony marker | No |

No REPLICA/dev access, reset, `rls:prove`, product change, or autonomous mutation is part of this preparation.

## 6. Current stop state

- Hardened QA controller exists and is syntax-valid.
- Attempt-2 evidence paths are reserved and absent.
- Controller has not been started.
- Tony revoke/restore helper has not been run for attempt #2.
- SCRATCH remains in Tony's reported restored state from attempt #1; this preparation did not query or alter it.

**STOP — controlled rerun prepared immediately before controller start and before the first mutation. Awaiting Sol/Tony execution release. No module verdict issued.**
