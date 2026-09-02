# BIM-002 PRE-Q — Phase 3 One-Walk Attempt #3 Preparation

**Timestamp:** 2026-09-02 16:07:32 +08  
**Classification carried from Sol:** attempt #2 was an instrument/timing abort only  
**Preparation status:** complete; attempt #3 not executed  
**Mutation status:** none  
**Target if later released:** SCRATCH only  
**Module verdict:** NOT ISSUED

## 1. Controller

Attempt-3 controller path:

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs`

The QA-only attempt-2 controller was updated in place with one behavioral change only: its fixed 300-second PRE→POST deadline was replaced by the ratified dynamic window. Static `node --check` passed. No controller execution or backend contact occurred.

No shipped product, migration, harness, package, or authority file was changed.

## 2. Exact dynamic deadline

At the arm point, after pre-state and the existing lifetime guard, the controller computes:

```text
allowed_window_seconds = min(
  600,
  floor((remaining_jwt_lifetime_ms - 900000 - 90000) / 1000)
)
```

Equivalent contract form:

```text
allowed_window = min(600 seconds, remaining JWT lifetime at arm - 900 seconds safety buffer - 90 seconds auth-js refresh margin)
```

The controller then:

- records `ALLOWED_POST_WINDOW_SECONDS=<computed value>`;
- requires `PRE-ALLOWED-POST-WINDOW-GUARD` to match `>=300s`;
- aborts before `PRE_STATE_CAPTURED`, `POST_WINDOW_ARMED`, and the mutation-ready prompt if the computed window is below 300 seconds;
- caps the window at 600 seconds;
- starts the deadline at `PRE_STATE_CAPTURED`;
- gives the interactive POST prompt an actual timer ending at that dynamic deadline;
- rechecks at POST that elapsed time is no greater than the recorded allowed window.

Examples:

- Remaining lifetime 3,595s → `min(600, 3595-900-90)` → allowed window 600s.
- Remaining lifetime 1,200s → allowed window 210s → arm rejected because 210s < 300s.
- Minimum remaining lifetime capable of arming the dynamic window is 1,290s.

The prior `PRE-LIFETIME-ARM-GUARD >=990s` remains in place; the new allowed-window guard is additionally stricter whenever required.

## 3. Retained controls

All attempt-2 controls remain unchanged:

- `autoRefreshToken=false`;
- `persistSession=false`;
- `detectSessionInUrl=false`;
- defensive `auth.stopAutoRefresh()`;
- `onAuthStateChange()` registered before sign-in, recording event names only;
- any `TOKEN_REFRESHED` event aborts and prevents an AC2 evidence claim;
- one multiStore sign-in with exact seeded `session.user.id` assertion;
- JWT token contents remain in memory only; only `exp` is decoded;
- 90-second expiry-margin checks;
- same Supabase client-object assertion;
- byte-identical access-token assertion;
- exact post-session identity assertion before visibility checks;
- A1/B1 pre-state, post-revoke, and post-restore visibility/count assertions;
- service-role junction ground truth;
- Tony-only guarded revoke and restore boundary;
- abort output records `AC2_EVIDENCE_CLAIMED=false`;
- no credential or token value in evidence.

## 4. Fresh attempt-3 evidence paths

All paths were confirmed absent during preparation:

- Terminal A: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_attempt3_session_2026-09-02_160732.log`
- Tony revoke: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_attempt3_2026-09-02_160732.log`
- Tony restore: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_attempt3_2026-09-02_160732.log`

Attempt #1 and #2 evidence will not be overwritten.

## 5. Exact commands reserved for a later release

### Cody — Terminal A

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session-rerun.mjs agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_attempt3_session_2026-09-02_160732.log
```

Required new arm lines include:

```text
POST_WINDOW_RULE=min(600s,remaining_at_arm-900s-90s)
ALLOWED_POST_WINDOW_SECONDS=<300 through 600>
MATCH PRE-ALLOWED-POST-WINDOW-GUARD | expected=>=300s | observed=<computed>s
POST_WINDOW_ARMED=true
STOP_POINT_BEFORE_REVOCATION=true
WAITING_FOR_TONY=...within <computed> seconds
```

### Tony — guarded exact B1 revoke

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs revoke agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_attempt3_2026-09-02_160732.log
```

Required marker: `TONY_ACTION_COMPLETE=REVOKE_EXACT_B1_ONLY`.

### Cody — same Terminal A

Type `POST` only after Tony marker and within `ALLOWED_POST_WINDOW_SECONDS`. The existing controller sequence then checks the dynamic deadline, expiry margin, no refresh event, same client, byte-identical token, exact identity, post-revoke visibility, and service ground truth.

### Tony — guarded exact B1 restore

```bash
node agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-tony-membership-action.mjs restore agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_attempt3_2026-09-02_160732.log
```

Required marker: `TONY_ACTION_COMPLETE=RESTORE_EXACT_B1_ONLY`.

### Cody — same Terminal A

Type `RESTORED` only after Tony marker. The existing restoration sequence retains the expiry-margin, no-refresh, same-client, byte-identical-token, exact-identity, restored visibility, and junction-truth checks.

## 6. Current stop state

- Tony reported SCRATCH restored after attempt #2: A1=1, B1=1, role=member, primary=false.
- Cody did not independently query or alter that state during this preparation.
- Attempt-3 controller is syntax-valid and has not been started.
- Attempt-3 evidence files remain absent.
- No revoke, restore, REPLICA/dev access, reset, or `rls:prove` occurred.

**STOP — attempt #3 prepared before controller start and before the first mutation. Awaiting Sol/Tony release. No module verdict issued.**
