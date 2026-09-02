# BIM-002 PRE-Q — Phase 3 Token-Continuity Autopsy

**Timestamp:** 2026-09-02 14:27:14 +08  
**Mode:** information-only/static autopsy  
**Execution status:** One-Walk not rerun; no revocation or restoration performed by Cody  
**Targets contacted during autopsy:** none  
**Module verdict:** NOT ISSUED

## 1. Root-cause assessment

**High-confidence cause:** the Terminal A client was retained for approximately **70 minutes 15 seconds** between initial evidence creation and the POST abort. The client factory did disable the background auto-refresh ticker, but installed `@supabase/auth-js` 2.106.1 makes a separate, synchronous refresh decision inside `getSession()`: when the stored access token is within its 90-second expiry margin, `getSession()` calls the refresh-token path even if `autoRefreshToken` is false. The controller's first post-signal operation was exactly `client.auth.getSession()`. That call returned a rotated access token, the byte comparison failed, and the controller stopped before post-revocation identity or visibility checks.

This is an **instrument/timing explanation**, not evidence of an RLS implementation defect. It does not establish the configured SCRATCH JWT lifetime directly because neither the token claims nor auth configuration were preserved in evidence. The observed interval is nevertheless fully compatible with expiry-triggered refresh and substantially longer than the common one-hour access-token lifetime. No competing token-changing call exists in the controller after pre-state.

### Timing reconstruction

- Session evidence file birth/pre-state write: `2026-09-02 13:10:55.842 +08`.
- Tony revoke evidence write: `2026-09-02 14:18:59.908 +08`.
- Session evidence POST/abort write: `2026-09-02 14:21:10.514 +08`.
- Approximate pre-state-to-POST interval: **1:10:14.671**.
- Approximate Tony-revoke-to-POST interval: **0:02:10.605**.

The evidence file is rewritten on every save and has no per-line timestamps, so birth time is a close proxy for the completed pre-state capture, not an exact sign-in timestamp.

## 2. Direct controller and client evidence

### Same process and same client object

- `phase3-one-walk-session.mjs:73` assigns `client = anonClient(env)` once.
- Lines 74–76 call `signInWithPassword()` once. There is no second sign-in anywhere in the One-Walk path.
- Lines 97–99 pause the same Node process on `readline.question()`; POST resumes the same stack and the same `client` reference.
- Line 102 calls `client.auth.getSession()` on that object. No client reconstruction or `setSession()` occurs.
- The abort proceeds through the same catch/finally path; sign-out happens only at line 149 after the mismatch.

Therefore the controller did preserve the **same Node process** and **same Supabase client object**. It also preserved the same authenticated identity through pre-state. Whether the refreshed session still reported the same user at POST was not observed: line 103's token assertion threw before line 104's post-session identity assertion. A refresh normally continues the logical session for the same user, but this specific post-refresh identity equality is an unmeasured fact and must not be silently inferred.

### Effective auth options

The controller imports and uses `anonClient()` from `scripts/rls-harness/lib/db.mjs`. That factory creates the client with:

```text
autoRefreshToken: false
persistSession: false
detectSessionInUrl: not specified (library default true)
```

- `autoRefreshToken: false` disables the proactive/background refresh ticker. It does **not** prevent the installed library's `getSession()` expired/near-expired branch from refreshing.
- `persistSession: false` gives this Node client in-memory storage. It prevents persistence across process restarts; it does not freeze token bytes or prevent refresh within the running process.
- `detectSessionInUrl` defaults true in auth-js, but URL detection is guarded by `isBrowser()`. In this Node controller there is no browser callback URL, so it is immaterial to the fingerprint change. Setting it false is still a useful explicit QA guard.

### Why `getSession()` changed the token

Installed auth-js defines a 30-second tick and threshold of three ticks, hence `EXPIRY_MARGIN_MS = 90,000`. Its `__loadSession()` comments explicitly cover the `autoRefreshToken`-off case, computes whether expiry is within that margin, and unconditionally calls `_callRefreshToken(currentSession.refresh_token)` when true. `_callRefreshToken()` saves the new session and emits `TOKEN_REFRESHED`.

Supabase data requests also obtain authorization through `SupabaseClient._getAccessToken()`, which calls `auth.getSession()`. Thus any data query can trigger or observe the same near-expiry refresh. In attempt #1 there were no post-wait data queries before the explicit line-102 `getSession()` call, so that explicit call is the first evidenced post-wait refresh opportunity.

### Calls and events actually observable

- Explicit calls after pre-state and before abort: only `client.auth.getSession()`.
- Explicit `signInWithPassword()` after pre-state: **none**.
- Explicit `refreshSession()` anywhere in the controller: **none**.
- Auth-state subscription: **none**; the controller never calls `onAuthStateChange()`.
- `TOKEN_REFRESHED` event in current evidence: **not observable**, because no listener recorded auth events. The local library emits that event from `_callRefreshToken()`, and the changed fingerprint is consistent with that path, but the event itself was not captured.
- Exact user identity: proven at pre-state; not evaluated after the refresh because the token assertion came first.

## 3. Contract interpretation evidence

### A. Does “same session, no manual re-login” require a byte-identical JWT?

**No, not as a general authentication concept.** A Supabase logical session can refresh its access token through the retained refresh token without a password sign-in or other user re-authentication. The client object, process, authenticated user, and logical session can remain continuous while the access-token JWT bytes change.

Byte identity is instead a strong **test control** proving that no token refresh occurred. It distinguishes live junction evaluation from a result that might be attributed to new JWT material.

### B. Does AC2/R-C literally require “no token refresh,” or only “same session / no user re-authentication”?

**The current disk contract literally requires no token refresh.** It is not limited to “no manual re-login”:

- Manager `CLAUDE.md` R-C says re-query on the SAME session **“(no token refresh)”**.
- `ACCEPTANCE_SPEC.md` AC2 says the SAME session re-queries **“without token refresh.”**
- The acceptance evidence table says AC2 was evidenced by a token asserted byte-identical.
- The PRE-Q plan says reuse the SAME session/token and **“no token refresh.”**
- Proto06 addendum F-13 says the access token was asserted byte-identical across the test and labels the post-revoke step “Same session, no refresh.”
- Engineering `revocation.mjs` likewise compares the token byte-for-byte and describes the case as signed in once, never refreshed.

`ERRATUM.md` contains E-1 through E-5 and does not amend R-C/AC2 token continuity. A current disk search found no E-6 or F-14 text and no later Architect ruling that relaxes “no token refresh.” The only on-disk mention of the Option-A/E-6/F-14 ruling is Cody's preparation response, which records the separate AC3 update-rehome ruling and the absence of those amendments from disk. It does not alter AC2.

Consequently there is **no certification ambiguity to resolve under the current text**: a refreshed JWT does not meet the literal R-C/AC2 control even if the logical auth session and user remain continuous.

If stakeholders intend “same retained authenticated session, no user re-authentication” instead, the ambiguity/change to route to Fable is exact: whether **“same session/token; no token refresh”** is a normative prohibition on access-token rotation or merely an evidentiary shorthand intended to exclude a second login. Accepting a refreshed access token would require an authority amendment/ruling because it weakens the current explicit parenthetical and the byte-identity evidence rule.

## 4. Recommended controlled rerun design

No rerun is authorized by this autopsy. If Sol later releases one, the safest QA-only design is:

1. Keep shipped migrations and `scripts/rls-harness/` unchanged. Modify or create only a QA controller under the BIM-002 QA tree.
2. Construct the publishable client explicitly with `autoRefreshToken: false`, `persistSession: false`, and `detectSessionInUrl: false`; also call `auth.stopAutoRefresh()` defensively after construction.
3. Register `onAuthStateChange()` **before sign-in**. Record event names only, never token values. Set a permanent failure flag on any `TOKEN_REFRESHED` event.
4. Sign in multiStore exactly once; verify the returned user ID; retain the same client object and access token only in process memory.
5. Decode only the JWT expiry claim in memory. Record remaining lifetime, not token contents. Refuse to arm the mutation unless comfortably outside auth-js's 90-second margin; a conservative minimum of 15 minutes is appropriate.
6. Coordinate Tony before sign-in and impose a short controller deadline (for example five minutes from pre-state to POST). If the deadline or safe expiry window is exceeded, stop before mutation or require restoration without attempting post-state proof.
7. At POST, first verify elapsed time is still before `exp - 90s` and that no `TOKEN_REFRESHED` event occurred. Then `getSession()` may be used and compared byte-for-byte; within the guarded window it should not take the refresh branch.
8. Run post-revoke RLS queries immediately, assert user ID equality, byte-identical access token, no refresh event, B1=0/A1=200, and service junction A1=1/B1=0. Preserve ground truth before any restoration.
9. Restore only through Tony's separately guarded exact-row action, then optionally verify restoration within the same remaining safe-token window.

Why this is safer than merely setting `autoRefreshToken: false`: that option is **already false** in attempt #1. The necessary controls are a fresh-token lifetime guard, a bounded human handoff window, an auth-event listener, and byte comparison before/after. `persistSession` and `detectSessionInUrl` tighten isolation but do not solve expiry-triggered `getSession()` refresh.

An alternative fixed bearer-token data client would prevent refresh mechanically, but it would introduce a second client/path and weaken the One-Walk's “same Supabase client object” evidence. It is not the preferred design.

## 5. Is an Architect ruling needed?

- **For the root cause or the controlled no-refresh rerun design:** no. The installed client behavior and current literal contract are sufficiently clear.
- **To treat attempt #1 as satisfying AC2 despite token rotation, or to redefine R-C as only no re-authentication:** yes. That would alter explicit Manager, Acceptance Spec, PRE-Q, and F-13 language and should be routed through Sol to Fable/Architect rather than silently interpreted by QA.

## 6. Declared limits and state

- The exact SCRATCH JWT lifetime was not established statically; no token or credential was decoded, printed, or preserved.
- No auth-event listener existed, so a literal `TOKEN_REFRESHED` event cannot be recovered retrospectively.
- Post-refresh user-ID equality and post-revocation RLS behavior were not observed because the controller aborted at the prior token assertion.
- Tony's restoration evidence records A1=1, B1=1, role=member, primary=false. Cody did not independently execute or alter it during this autopsy.
- No REPLICA or dev backend access; no database operation; no `rls:prove`; no product or harness modification.

## 7. Source index

- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/probes/phase3-one-walk-session.mjs`
- `scripts/rls-harness/lib/db.mjs`
- `scripts/rls-harness/revocation.mjs`
- `node_modules/@supabase/auth-js/dist/module/GoTrueClient.js` (installed 2.106.1)
- `node_modules/@supabase/auth-js/dist/module/lib/constants.js`
- `node_modules/@supabase/supabase-js/src/SupabaseClient.ts` (installed 2.106.1)
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_one_walk_session_2026-09-02_124748.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_revoke_2026-09-02_124748.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/evidence/P3_tony_restore_2026-09-02_124748.log`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/CLAUDE.md` §4.1 R-C
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ACCEPTANCE_SPEC.md` AC2 and evidence table
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/ERRATUM.md`
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/BIM-002_PRE-Q_TEST_PLAN.md` Phase 3
- `agent_docs/ACTIONS/PROTO06/TRANSFERS_ADDENDUM_BIM-002.md` F-13
- `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X4_revocation_2026-09-01T0649.log`

**STOP — static token-continuity autopsy complete. No module verdict issued. Awaiting Sol.**
