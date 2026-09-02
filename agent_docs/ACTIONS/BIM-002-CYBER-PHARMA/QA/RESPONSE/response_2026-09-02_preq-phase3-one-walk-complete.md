# BIM-002 PRE-Q — Phase 3 One-Walk Complete

**Date:** 2026-09-02  
**Scope:** same-session membership revocation proof on SCRATCH  
**Module verdict:** NOT ISSUED

## Outcome

Phase 3 One-Walk completed successfully on attempt 3.

The first two attempts were instrument/timing aborts and did not establish an RLS failure:

- Attempt 1 aborted because the retained session token was refreshed after the human delay crossed the auth-js refresh window.
- Attempt 2 aborted because the fixed five-minute human timing guard expired before POST.
- Attempt 3 used the hardened dynamic timing guard and completed successfully.

## Attempt 3 observations

Using the same authenticated multiStore client/session:

- exact seeded session identity matched;
- no `TOKEN_REFRESHED` event occurred;
- client instance continuity matched;
- JWT remained byte-identical;
- revoke removed exactly the B1 membership;
- immediately after revoke, A1 remained visible;
- B1 businesses/user_data visibility disappeared;
- service-role junction truth confirmed A1 present and B1 absent;
- restoration reinserted exactly the B1 membership;
- same-session visibility returned for both A1 and B1;
- restoration completed without token refresh.

Observed markers included:

- `POST_REVOCATION_SAME_SESSION_CAPTURED=true`
- `RESTORATION_SAME_SESSION_CAPTURED=true`
- `ONE_WALK_OBSERVATIONS_COMPLETE=true`

## Classification

- Implementation defect: none observed.
- RLS defect: none observed.
- Contract defect: none introduced by this phase.
- Instrument findings: token-refresh behavior and human timing guard were corrected in the QA controller only.
- Product implementation remained unchanged.

## Evidence

- `QA/evidence/P3_one_walk_attempt3_session_2026-09-02_160732.log`
- `QA/evidence/P3_tony_revoke_attempt3_2026-09-02_160732.log`
- `QA/evidence/P3_tony_restore_attempt3_2026-09-02_160732.log`

Earlier aborted attempts remain preserved as evidence of instrument hardening.

**STOP — Phase 3 complete. No module verdict issued.**
