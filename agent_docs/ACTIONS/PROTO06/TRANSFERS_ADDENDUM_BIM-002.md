# TRANSFERS ADDENDUM — findings from BIM-002's use of the Proto 06 package
## Authored 2026-09-01 at BIM-002 close · **`TRANSFERS.md` and `FINDINGS.md` are NOT edited** — this file is the delta

Proto 06 handed BIM-002 a policy template, a harness, and findings F-1…F-9. Applying them to the real sixteen-table schema surfaced four more. Two are **corrections to the transferred package itself** and matter to anyone who inherits it — BIM-005 (CRV) most of all.

---

## F-10 — `revoke execute … from anon` is a no-op; revoke from `public` — and from `anon` too

**Correction to TRANSFERS §1.0.** The shipped helper template ends with `revoke execute on function … from anon`. That line does nothing on its own.

Two independent grant channels exist, and the template closed neither reliably:
1. **PUBLIC** — Postgres grants EXECUTE on every new function to `PUBLIC` by default; `anon` inherits through it. Revoking from `anon` specifically leaves the PUBLIC grant intact. (BIM-002 X1: raw ACL `{=X/postgres, …}` — that leading `=X` is PUBLIC; `has_function_privilege('anon', …)` returned **true** after the template's revoke, and an impersonated `anon` session **executed the helper**.)
2. **`pg_default_acl`** — the schema's default privileges grant function EXECUTE to `anon` **explicitly**, so a freshly created function carries `anon=X` even after PUBLIC is revoked. (BIM-002 X2.)

**Correct form — both revokes, then the grant:**
```sql
revoke execute on function public.<fn>(<args>) from public;
revoke execute on function public.<fn>(<args>) from anon;
grant  execute on function public.<fn>(<args>) to authenticated;
```

**Why the rig missed it:** Proto 06's matrix asserted *table* access, where `anon` was denied everywhere because no policy granted `anon` anything. Table-level denial masked the grant defect entirely. F-5 covered `SECURITY DEFINER`; nothing ever asserted the helper's own EXECUTE privilege.

**Severity:** not a data leak — `auth.uid()` is NULL for `anon`, so the helpers return `false`. It is a privilege-surface defect: an unauthenticated caller could invoke a `SECURITY DEFINER` function that reads a PHI-adjacent table.

**Action for inheritors:** treat TRANSFERS §1.0's revoke line as defective. The corrected helper block lives in `agent_docs/AUTHORITY/RLS_TEMPLATES.md` §0 and in `supabase/migrations/0016_rls_helpers.sql`.

---

## F-11 — an inline junction subquery in a policy is invoker-evaluated and silently blinded

**Extends TRANSFERS §4's open A/B question, and closes it against B.**

Proto 06 flagged `business_id in (select business_id from user_businesses where user_id = auth.uid())` as a possibly-faster alternative worth benchmarking. It is faster. **It is also conditionally wrong.**

Inside a policy, that subquery runs as the **invoker**, so it is subject to the junction's own RLS. With no SELECT policy on `user_businesses` it returns the empty set and the policy **denies everything, with no error** — `SubPlan 1 → One-Time Filter: false`. BIM-002's first A/B run measured B at "160× faster" before the row counts revealed it was returning zero rows.

This is the F-1 family with the polarity reversed: F-1 is a write policy that silently permits nothing; F-11 is a read policy that silently denies everything.

**The resolution — formulation C.** A `SECURITY DEFINER`, `STABLE`, set-returning helper:
```sql
create or replace function public.my_business_ids()
returns setof uuid language sql stable security definer set search_path = ''
as $$ select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid(); $$;

-- usage:  using (business_id in (select public.my_business_ids()))
```

Measured at 100,000 rows, warm median, row-count parity asserted before comparing:

| | A — scalar helper | B — inline subquery | **C — `my_business_ids()`** |
|---|---|---|---|
| Unqualified read | 1,685 ms · 101,640 buffers | 29.4 ms · 1,641 | **29.6 ms · 1,641** |
| `where business_id = $1` | 563 ms · 35,001 | 18.2 ms · 1,669 | **18.3 ms · 1,669** |
| Plan | per-row function call | `hashed SubPlan` | **`hashed SubPlan`, `ProjectSet` run once** |
| Shield test (junction policy dropped) | 66,667 ✅ | **0 ❌** | **66,667 ✅** |

**C gives B's plan shape and A's independence.** B is adopted nowhere and is documented as an anti-pattern.

**Action for inheritors:** use C for tenant SELECT predicates; keep scalar helpers for role-gated writes, `WITH CHECK`, and any join-based predicate (`is_account_member`), where per-row cost is nil and the DEFINER shield spans two tables.

---

## F-12 — privilege assertions are only valid after a **from-scratch** apply

`create or replace function` **preserves the existing ACL**. BIM-002's X1 passed its anon-grant assertion because an earlier revision of the same migration had already cleared the grant across two applies — a fresh database reproduced the defect immediately.

**Rule:** any acceptance criterion that inspects grants, ownership, or ACLs must be evidenced **after a drop-and-apply on an empty database**, never after an incremental re-apply. BIM-002 put the check inside the one-command proof (`ac8-check.mjs`, stage 3 of `rls:prove`) so it cannot be skipped, and proved it twice on two separate projects.

**Generalises to:** anything where the *history* of applies can differ from the *state* a fresh deploy produces.

---

## F-13 — junction membership is evaluated live: revocation **and re-grant** land on the next query

**Closes Proto 06 N-3, which was "expected immediate, never proven".**

One session, signed in once, access token captured and asserted **byte-identical** across the whole test so the result cannot be an artifact of a silent refresh:

| Step | Observation |
|---|---|
| Before | A1 = 200 rows · B1 = 200 rows · stores `[A1, B1]` |
| Service role deletes `(multiStore, B1)` | ground truth: 1 junction row left |
| Same session, no refresh | **B1 = 0 immediately** · A1 = 200 · stores `[A1]` |
| Membership restored | **B1 = 200 again, same session** |

**Operationally:** offboarding a pharmacy employee takes effect on their **next query**, not their next token refresh — there is no stale-PHI window. The mechanism is **symmetric**: re-granting is equally immediate, so access changes need no session management at all.

This holds because membership is looked up live in the junction and nothing is stamped into the JWT — the constraint Gap-6 imposed for correctness turns out to buy immediate revocation for free.

---

## F-14 — denial shape depends on **which clause** denies

**Surfaced by independent QA at BIM-002 PRE-Q, 2026-09-02.**

F-4 established that denial looks different per *operation*. PRE-Q sharpened it: denial also looks different depending on **which policy clause does the denying**, within the same operation on the same table.

| Denying clause | Shape | Example (BIM-002 X4) |
|---|---|---|
| **`USING`** — the row is unreachable to this caller | **0 affected, NO error** | `A2.2` ownerB updates an A1 row it has no membership for |
| **`WITH CHECK`** — the row is reachable, but the proposed new row is illegal | **`42501`** | `A3.1` staffA re-homes an A1 row it *can* reach into B1 |

Both leave ground truth unchanged, and both are correct. An UPDATE policy carrying both clauses can therefore produce **either** shape depending on the case, and a spec or harness that names only one will misdescribe the other — which is exactly what happened to BIM-002's AC3(b) (ERRATUM E-6).

**Rule for any denial-shape classifier:** assert the **expected shape per case**, never accept any non-ALLOW outcome as a generic DENY. "Not allowed" is not a verdict; *"denied by `USING` with 0 affected"* and *"denied by `WITH CHECK` with 42501"* are different assertions, and collapsing them hides the case where a policy denies for the wrong reason — or where a `WITH CHECK` clause is missing entirely and a re-home silently succeeds under a permissive `USING`.

## Notes for BIM-005 (CRV), which inherits this harness

- The harness now lives at `scripts/rls-harness/` with `loadEnv(prefix)`; point it at another project by adding a prefixed key set and running `RLS_HARNESS_PREFIX=<PREFIX>_ npm run rls:prove`. No code change.
- **Fail closed on auth, and assert the identity you ran as.** A silently-failed sign-in reads as "0 rows" and scores as perfect isolation. This bit BIM-002 once (a scoping script that ignored the sign-in error while the seed had orphaned the identity). Every instrument now asserts `session.user.id` matches the intended identity before running a case.
- **Seed a row into every table you assert `DENY` on.** Otherwise "refused" and "empty" are indistinguishable.
- **Ground-truth every mutation denial** via the service role (F-4's corollary): `0 affected` is not proof that nothing persisted.
- A destructive probe must destroy only what it created — and where a policy legitimately permits INSERT but denies DELETE, the harness must clean up after itself or the suite stops being idempotent.
