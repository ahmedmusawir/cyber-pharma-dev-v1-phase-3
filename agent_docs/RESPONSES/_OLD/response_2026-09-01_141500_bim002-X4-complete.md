# BIM-002 — X4 COMPLETE · ZERO GROUND-TRUTH MISMATCHES · STOPPED before X5
**Date:** 2026-09-01

## 0. Ground truth first, as ordered

**Zero mismatches. Nothing an attack attempted ever persisted.** Every mutation case in the battery was re-read through the service role after the attempt: row counts, column values, junction membership and role, account names — all identical to their seeded values. The one case that could have been a silent success (`0 affected` with no error) is precisely the one F-4 warned about, and it was checked in every instance rather than trusted.

## 1. Board

| Instrument | Result | Evidence |
|---|---|---|
| Full matrix, final chain | **320/320 cells GREEN** | `evidence/X4-matrix_2026-09-01T0649.log` |
| Row-scoping assertion set (now permanent) | **EXACT** | `evidence/X4_scoping_2026-09-01T0649.log` |
| Attack battery | **28 cases · 0 breaches · 0 ground-truth mismatches** | `evidence/X4_attacks_2026-09-01T0649.log` |
| R-C live-session revocation | **PROVEN** | `evidence/X4_revocation_2026-09-01T0649.log` |
| Policy state after the battery | 18 policies, all four laws hold — unchanged | `policy-check` output |

## 2. Attack battery — 28 cases, all denied

| Group | Cases | Notable |
|---|---|---|
| **A1** cross-account reads by direct id | 5 | ownerB cannot read account A, subscription A, an A1 fact row, business A1, or report A1 — knowing the id buys nothing |
| **A2** client-supplied foreign `business_id` | 3 | INSERT → **42501**; UPDATE/DELETE by id → 0 affected. Ground truth: A1 still 200 rows, `"Drug A1 1"` untouched. *"business_id never comes from the client"* is now a database guarantee, not a service-layer convention |
| **A3** re-home attack | 1 | staffA, a **legitimate A1 member**, tries to move an A1 row into B1 → **42501** from `WITH CHECK`. Ground truth: `business_id` still A1. This is the case a `USING`-only UPDATE policy would have let through |
| **A4** DELETE by member | 2 | staffA and multiStore are members of A1 and are refused — the role gate is `is_admin_of`, per FLAG-6. Ground truth: 200 rows intact |
| **A5** junction role tampering | 4 | self-promotion to `admin`, inserting a fresh admin membership, self-offboarding, and reading another user's membership — all refused. Ground truth: role still `member`, junction still exactly 6 rows. Escalation is **structurally impossible**: there is no write policy on the junction at all |
| **A6** accounts read-only (R-A) | 3 | ownerA — who *is* `accounts.owner_user_id` — cannot INSERT, UPDATE, or DELETE the account. Direct proof that ownership grants nothing; only junction membership reads |
| **A7** reference tables | 2 | INSERT → 42501, UPDATE → 0 affected, `"Seed PBM"` intact. Locked by omission, as designed |
| **A8** deny-all tables | 3 | `apa_memberships`, `pending_registrations`, `audit_logs` — the log records that **the service role sees 1 row in each**, so the authenticated `0` means *refused*, not *empty*. A vacuous pass was specifically designed out |
| **A9** anonymous sweep | 5 | nothing, anywhere |

## 3. R-C — live-session revocation: **PROVEN** (closes Proto 06 N-3)

Signed in **once**, never refreshed. The access token was captured up front and asserted byte-identical across the revocation, so the result cannot be an artifact of a silent re-auth.

| Step | Observation |
|---|---|
| Before | A1 = 200 rows · B1 = 200 rows · stores `[Store A1, Store B1]` |
| Revoke | service role deletes `(multiStore, B1)`; ground truth: 1 junction row left, A1 only |
| Token | **byte-identical** — no refresh occurred between the queries |
| After, same session | **B1 = 0 immediately** · A1 = 200 · stores `[Store A1]` |
| Re-grant | membership restored → **B1 = 200 again on that same session** |

**Operationally:** offboarding a pharmacy employee takes effect **on their next query, not on their next token refresh** — no stale PHI window. And re-granting is equally immediate, so the mechanism is symmetric. Proto 06 predicted this and could not prove it; it is proven now, on the real sixteen-table chain.

## 4. Ruling compliance

- **Row-scoping promoted** into the permanent harness as `scripts/rls-harness/scoping.mjs`, a named assertion set with declared expectations — run as part of X4 and wired into `rls:prove` at X5, not a one-off script.
- **Standing law applied after instrument defect #4:** `scoping.mjs` fails closed on sign-in error *and* asserts `session.user.id` matches the identity it intended to be. `attacks.mjs` and `revocation.mjs` do the same before running a single case. A silently-failed sign-in can no longer masquerade as perfect isolation.
- **Idempotent:** the revocation case restores the junction it deleted; the matrix cleans its own probes. Policy state after the whole battery is unchanged at 18 policies with all four laws holding.

## 5. Standing

Zero git · `.env.local` untouched · no credential value in any command, log, or document · dev backend never touched · scratch only · `proto-06/` unmodified.

→ **STOPPED before X5** (one-command `rls:prove`, twice from an empty scratch, evidence identical modulo timestamps).
