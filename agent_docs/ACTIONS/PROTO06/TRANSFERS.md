# TRANSFERS.md — PROTO 06 (RLS Isolation Harness)
## The gate currency. BIM-002 authoring begins when the Architect has consumed this.

**Rig:** `phase-3-proto-6` branch, `proto-06/` tree, disposable Supabase project · **Date:** 2026-08-31
**Proven at:** 8 policies · 80-cell expectation matrix · 32-case attack battery · full proof re-run from an empty database **twice**, green both times (`proto-06/evidence/R4_full_proof_*.log`)
**Doctrine held throughout:** Gap-6 junction-only. Zero policies read `user_roles` (which does not exist on the rig) or any metadata. No superadmin policy was needed or written — no scenario asked for one.

---

# 1. THE POLICY PATTERNS (final SQL, annotated)

## 1.0 The helpers — the core of the blessed template

Every tenant-table policy calls one of these two functions. They are the pattern.

```sql
create or replace function public.is_member_of(biz uuid)
returns boolean
language sql
stable                    -- planner may cache per-arg within a scan; NOT volatile
security definer          -- MANDATORY, see F-5 — not stylistic
set search_path = ''      -- landmine §7.2: pinned, or the definer becomes a privilege hole
as $$
  select exists (
    select 1 from public.user_businesses ub   -- fully qualified: search_path is empty
    where ub.user_id = auth.uid() and ub.business_id = biz
  );
$$;

create or replace function public.is_admin_of(biz uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz and ub.role = 'admin'
  );
$$;

revoke execute on function public.is_member_of(uuid) from anon;
revoke execute on function public.is_admin_of(uuid) from anon;
grant  execute on function public.is_member_of(uuid) to authenticated;
grant  execute on function public.is_admin_of(uuid) to authenticated;
```

**Why SECURITY DEFINER is mandatory (F-5):** the helper reads `user_businesses`, which itself carries RLS (pattern T-5 below restricts each user to their own rows). A SECURITY INVOKER helper would evaluate membership *through the caller's own restricted view* and silently collapse every policy in the system to "can only see myself." This is the single subtlest correctness dependency in the pattern.

## 1.1 T-1 — Tenant SELECT

```sql
create policy "fact_select_member"
  on public.fact_data
  for select
  to authenticated
  using (public.is_member_of(business_id));
```
**Proven:** each identity sees only their stores' rows; anon sees none; cross-account reads by direct id return zero rows (attack A3).
**BIM-002 application:** this is the template for `user_data` and every `business_id`-bearing table.

## 1.2 T-2 — Tenant INSERT / UPDATE / DELETE

```sql
-- INSERT: WITH CHECK, never USING (landmine §7.4 — the most common RLS authoring error)
create policy "fact_insert_member"
  on public.fact_data
  for insert
  to authenticated
  with check (public.is_member_of(business_id));

-- UPDATE: USING gates which rows are reachable; WITH CHECK gates what they may BECOME
-- (without WITH CHECK, a member could re-home a row into a foreign business_id)
create policy "fact_update_member"
  on public.fact_data
  for update
  to authenticated
  using (public.is_member_of(business_id))
  with check (public.is_member_of(business_id));

-- DELETE: USING only — there is no new row to check
create policy "fact_delete_member"
  on public.fact_data
  for delete
  to authenticated
  using (public.is_member_of(business_id));
```
**Proven:** "business_id never from the client" is enforced by the *database*, not the service layer — an INSERT hand-supplying a foreign `business_id` fails with `42501` (attack A1). This is the rule Frank's Flask world enforced with discipline and one forgotten WHERE clause away from a breach; here it is structural.

## 1.3 T-3 — Role-gated write (junction role, never `user_roles`)

```sql
-- The SELECT policy is NOT optional — it must exist BEFORE the write policy (see F-1)
create policy "business_select_member"
  on public.businesses
  for select
  to authenticated
  using (public.is_member_of(id));

create policy "business_update_admin"
  on public.businesses
  for update
  to authenticated
  using (public.is_admin_of(id))
  with check (public.is_admin_of(id));
```
**Proven:** ownerTwo (junction role `admin` on S1) updates S1 — 1 row affected. adminOne and memberOne (no S1 membership) are denied. anon denied. The role gate reads the junction's `role` column exclusively.

## 1.4 T-4 — Reference table (platform-shared read, service-role-only write)

```sql
create policy "ref_select_authenticated"
  on public.ref_data
  for select
  to authenticated
  using (true);
-- NO write policies. RLS is enabled, so the absence of an INSERT/UPDATE/DELETE policy
-- means only the service role can write. Locked by omission, deliberately.
```
**Proven:** all three identities read; all three are denied INSERT (`42501`), UPDATE and DELETE; anon is denied everything including SELECT.
**BIM-002 application:** `aac_reference`, `wac_reference`, `ful_reference`, `pbm_info`, `reference_dataset_versions`.

## 1.5 T-5 — Junction self-visibility

```sql
create policy "ub_select_self"
  on public.user_businesses
  for select
  to authenticated
  using (user_id = auth.uid());   -- direct comparison, NOT the helper (F-7: self-reference)
-- No write policies: junction mutations are service-role only. This is what makes
-- the role-tampering attack (A2) structurally impossible rather than merely unlikely.
```
**Proven:** ownerTwo sees exactly his 2 membership rows, adminOne 1, memberOne 1, anon 0. No identity can read another user's membership. Self-promotion to `admin` is rejected, and service-role ground truth confirmed **nothing persisted**.

## 1.6 T-6 — Service-role bypass (documented, never a policy)

No SQL. The service key bypasses RLS intrinsically; demonstrated once on the rig (it read all rows of all five tables across both tenants).

**The fencing rule, for standing doctrine / ANTI_PATTERNS:**
> The service role is the MissionControl/platform path. It is server-side only, never reachable from a browser or client bundle, and **every use is audited** (BIM-003's trail is the fence). It is never a substitute for a policy, and it is never the answer to "this policy is inconvenient." Platform oversight is service role with audit — never an RLS clause.

## 1.7 The two structural laws

1. **Exactly one permissive policy per operation per table.** Multiple permissive policies OR together and silently widen access. Enforced mechanically on the rig by `rig-policy.mjs`, which fails the run if any table+operation count exceeds 1. Final rig state: 8 policies, all singletons. **BIM-002 should run the same check after every policy lands.**
2. **Tables are born with RLS enabled and zero policies.** Deny-by-default was proven at R1 before a single policy existed: 80/80 cells denied.

---

# 2. THE HARNESS (the second transfer, as valuable as the policies)

## 2.1 What it is

| File | Role |
|---|---|
| `proto-06/harness/expectations.json` | The declarative matrix: identities × tables × operations, `default` + `overrides` |
| `proto-06/harness/rig-harness.mjs` | Runs every cell as a **real signed-in session** (publishable key), asserts ALLOW/DENY, one uniquely-named evidence file per run, exit ≠ 0 on any mismatch |
| `proto-06/harness/rig-attacks.mjs` | The 32-case attack battery (foreign business_id, role tampering, cross-account probes, anon sweep) |
| `proto-06/harness/rig-explain.mjs` | T-7 EXPLAIN capture under an impersonated `authenticated` role |
| `proto-06/scripts/rig-prove.mjs` | **The one command**: wipe → schema → 8 policies in order → seed → matrix → attacks |
| `proto-06/scripts/rig-policy.mjs` | Lands one policy file, then enforces the one-per-operation law |
| `proto-06/scripts/rig-reset.mjs` | wipe (with ownership fallback) / migrate / catalog, all with `pg_catalog` proofs |
| `proto-06/scripts/rig-seed.mjs` | Identities + tenants + synthetic rows; writes `seed-map.json` (ids only, no secrets) |

## 2.2 Expectations format

```jsonc
{
  "phase": "FINAL-8-policies",         // labels the evidence file
  "identities": ["anon", "ownerTwo", "adminOne", "memberOne"],
  "tables": ["accounts", "businesses", "user_businesses", "fact_data", "ref_data"],
  "operations": ["select", "insert", "update", "delete"],
  "default": "DENY",                   // deny-by-default in the TEST too, not just the DB
  "overrides": {
    "ownerTwo": { "fact_data": { "select": "ALLOW", "insert": "ALLOW" } }
  }
}
```
Every cell not named in `overrides` must be DENY. **The red-green discipline:** flip the expectation first (matrix goes RED, proving the test can fail), then land the policy (matrix goes GREEN, proving the policy did it). A policy that lands green without a red first proves nothing.

## 2.3 How BIM-002 and BIM-005 re-point it (config swap, not a rewrite)

1. **Credentials:** the harness reads `PROTO06_DB_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` from `.env.local` via `scripts/rig-lib.mjs::loadEnv()`. Point that at the target project — rename the URL key or generalize `loadEnv` to accept a prefix. **No values are ever printed.**
2. **Tables:** edit `expectations.json` → `tables` to the real sixteen. The matrix scales automatically (identities × tables × 4 ops).
3. **Payloads:** `rig-harness.mjs` carries a `payloads` map (one insert row + one update patch per table). Add an entry per real table. This is the only per-table code, and it is data, not logic.
4. **Identities:** `rig-seed.mjs` creates them and writes `seed-map.json`. BIM-005 (CRV) can substitute real provisioned test users by writing the same `seed-map.json` shape — the harness reads ids from that file only.
5. **Guards worth keeping:** the publishable-key-≠-secret-key assertion (catches a harness accidentally wired as service role and "proving" isolation that isn't there), fail-closed env checks, repo-root anchoring, unique evidence filenames.

**Known limitation to carry (F-2):** at mothership volumes, `.select()` silently caps at 1,000 rows. Volume assertions must use `{ count: 'exact', head: true }` or pagination — otherwise a test can read 1,000 rows of its own tenant out of 50,000 and "prove" isolation it never exercised.

---

# 3. FINDINGS LEDGER

Full text: `proto-06/FINDINGS.md`. Summary, in transfer priority order:

| # | Finding | Consequence for BIM-002 |
|---|---|---|
| **F-1** ⭐ | **A write policy without a paired SELECT policy silently no-ops.** Postgres evaluates the rows referenced by an UPDATE/DELETE `WHERE` under SELECT-read semantics. `business_update_admin` was present, correct, and affected 0 rows until `business_select_member` landed. No error, no warning — indistinguishable from a working deny. | **MANDATE: land the SELECT policy before any write policy, on every tenant table.** A missing read path passes "is the policy there?" review and fails silently in production. |
| **F-8** | **Policy landing ORDER is part of the deliverable.** `rig-prove.mjs` encodes it: helpers → SELECT policies → write policies. Surfaced by R4 — the from-scratch runner had to be authored with SELECT-before-write or the proof would not reproduce. | Ship BIM-002's migrations in that order; don't leave it to chance. |
| **F-4** | **Deny semantics differ by operation:** SELECT → 0 rows (no error) · INSERT → `42501` · UPDATE/DELETE → 0 affected (no error). And "0 affected" is not proof nothing persisted — the rig confirmed the role-tampering attack against service-role ground truth. | A harness that only catches thrown errors will score UPDATE/DELETE denials as passes for the wrong reason. Mutation attacks need ground-truth verification. |
| **F-5** | **SECURITY DEFINER on the membership helper is mandatory, not stylistic** — SECURITY INVOKER would read the RLS-protected junction through the caller's own restricted view and collapse every policy to "myself only." Pin `search_path`, qualify everything, revoke from `anon`. | Copy the helper verbatim, including the modifiers. |
| **F-2** | **PostgREST caps responses at 1,000 rows by default** — silently. | Count-based assertions or pagination in CRV/BIM-005. |
| **F-3** | `information_schema` is privilege-filtered (hides objects the connecting role doesn't own) — read `pg_catalog`/`pg_policies` instead. Carried from BIM-001, re-applied here. | All verification instruments read pg_catalog. |
| **F-6** | Drop the `ensure_rls` event trigger **before** any schema wipe, or it orphans and breaks subsequent DDL. Carried from BIM-001. | Reset tooling ordering. |
| **F-7** | Junction self-visibility must use `auth.uid()` directly, never the helper (self-reference). | T-5 as written. |

---

# 4. T-7 — EXPLAIN EVIDENCE (INFORMATIONAL, no gate) ⚠️ contains a real scale warning

Captured under an impersonated `authenticated` role with a live `auth.uid()` claim, at the 6,000-row seed. Full plans: `proto-06/evidence/T7_explain_*.log`.

| Path | Plan | Time | Reading |
|---|---|---|---|
| **A.** `select * from fact_data` (policy predicate only) | **Seq Scan**, `Filter: is_member_of(business_id)`, 10,256 buffers | **125 ms** for 4,000 visible rows | ⚠️ The policy predicate **is not index-driving on its own.** The helper is evaluated per row. |
| **B.** `select ... where business_id = $1` (policy + explicit filter) | **Index Scan** using `idx_fact_business`, 4,024 buffers | **42 ms** for 2,000 rows | The application's own filter drives the index; the policy then filters what survives. |
| **C.** `update ... where id = $1` (policy USING + WITH CHECK) | Index Scan on pkey, 24 buffers | **0.8 ms** | Point writes are cheap — the predicate runs on one row. |
| **D.** helper alone | — | **0.3 ms** | The helper itself is fast; the cost is *how many times* it runs. |

**The warning for Phase 3:** at 6,000 rows an unqualified tenant-table read costs 125 ms. `user_data` at a real pharmacy is 10–100× that, and the cost is linear in rows scanned. **Every application query against a tenant table must carry its own `business_id` (or date/store) filter — the RLS policy is a security boundary, not a query optimizer.** Index requirements confirmed as expected medicine: `(business_id)` on each tenant table, `(user_id, business_id)` on the junction. Both were present and used in plan B.

**Untested alternative worth evaluating in BIM-002 (NOT benchmarked on this rig):** formulating the policy as `business_id in (select business_id from public.user_businesses where user_id = auth.uid())` may let the planner build a hash semi-join once instead of calling a function per row. It may also lose the helper's single-point-of-truth ergonomics. Recommend a one-hour A/B on the mothership at realistic volume before the sixteen tables are policy-written. Flagged rather than decided.

---

# 5. NOT PROVEN ON THIS RIG (owed elsewhere — do not assume these work)

| # | Not proven | Owed to | Why |
|---|---|---|---|
| **N-1** | **Storage RLS leg** — bucket policies on tenant-pathed objects, cross-tenant download denial | **PROTO 01** (Director ruling, 2026-08-31) | Deferred by ruling. Table-layer isolation says nothing about Storage: it is a separate policy surface on `storage.objects` with its own path-parsing semantics. **BIM-002/Phase-4 must not infer Storage safety from this document.** |
| **N-2** | **Browser-client leg** — the same guarantees through a real browser session in a rendered page | a later lane | Deferred by the in-repo branch ruling (no `src/` files from this lane). Mitigation: the harness authenticates through the same `@supabase/supabase-js` publishable-key path a browser client uses, so the *auth mechanism* is exercised; what is untested is cookie/SSR session handling in Next.js middleware and server components. |
| **N-3** | **Junction revocation against a LIVE session** — remove a user from `user_businesses` while their session is active; does visibility drop immediately, or at token refresh? | BIM-002 or CRV (BIM-005) | Plan body step 3 called for it; the rig proved membership *composition* (multi-store user sees exactly their two stores) but never exercised mid-session revocation. **This matters for offboarding a pharmacy employee.** Expected behavior: immediate, because membership is looked up live in the junction rather than stamped into the JWT — but expected ≠ proven. |
| **N-4** | **Volume behavior beyond 6,000 rows** | BIM-002 / CRV | T-7 measured a small seed. The 125 ms unqualified-read figure extrapolates linearly, but planner behavior can change at scale. |
| **N-5** | **Multi-policy interaction with the real sixteen-table graph** | BIM-002 | The rig has 5 tables and 8 policies. Cross-table policy interactions (e.g. a policy on `user_data` whose helper reads a junction that itself has policies, three levels deep through `accounts`) are not exercised at the real schema's fan-out. |
| **N-6** | **`accounts`-level access** | BIM-002 | Deliberate: R-2 says owner access flows through junction rows, not account-ownership shortcuts. The rig therefore has **no policy on `accounts` at all** — it stayed fully denied to every identity in all 80 cells. If Phase 3 needs an account-level read (e.g. an owner's multi-store dashboard), that policy does not exist yet and must be designed under Gap-6 (junction-derived, not `owner_user_id`-derived). **This is the most likely place BIM-002 will need a new pattern.** |

---

# 6. RIG RETROSPECTIVE — what fought back

1. **The launch documents weren't on disk, and neither was the DB credential.** Fourth doc-staging miss of the campaign (BIM-000 journal, BIM-001 authority, PROTO/06 path, `PROTO06_DB_URL`). Cost: one full recon cycle spent producing a blocked-status report instead of a plan. The pattern is now unmistakable — **staging the runner's inputs should be a launch-line prerequisite, mechanically checked, not a memory task.**
2. **The pooler host in the launch order was wrong** (`aws-0-us-west-1` → tenant not found; `aws-1-us-west-1` works). Caught by recon before it burned a gate run, because BIM-001's evidence had already recorded the `aws-1` generation. Prior findings paid for themselves.
3. **F-1 — the silent no-op — is why this rig exists.** A correct, present, well-reviewed policy that does nothing. It would have shipped into BIM-002 unnoticed, because the failure mode is indistinguishable from success at review time and from a legitimate deny at runtime. Prediction P3 ("the transfer gate will hold BIM-002 by some days and be worth it") is **supported**: this one finding justifies the lane.
4. **The harness needed to be self-cleaning before it could be honest.** The first DELETE probe consumed a fixed seed row, so a second run would have tested different ground than the first. Chaining each identity's update/delete to the row its own insert created made the suite idempotent — which is what let R4 run twice from scratch with identical results.
5. **A verification instrument lied once here too** (`r.names.join is not a function` — `array_agg` over the pg driver), echoing BIM-001's information_schema false-fail. Third instrument defect this campaign. **Instruments deserve the same skepticism as the code they check.**
6. **Deferred by ruling, not by drift:** Storage (N-1) and the browser leg (N-2) were cut deliberately and are recorded as owed. Nothing was quietly dropped.

---

# 7. CHECKPOINT — git commands for the Director (prepared, NOT run)

```bash
# from repo root, on branch phase-3-proto-6 (disposable, never merged)
git add proto-06/ agent_docs/ACTIONS/PROTO06/ agent_docs/RESPONSES/ agent_docs/SESSIONS/session_2026-08-31.md
git commit -m "31aug2026 - PROTO 06 checkpoint - R1-R5 green: 8 policies, 80-cell matrix, 32-case attack battery, TRANSFERS written"
```
Notes: the branch is a checkpoint only — **never merge it.** Transfers are COPIED forward by the Director (`agent_docs/ACTIONS/PROTO06/TRANSFERS.md` → wherever BIM-002 authoring consumes it). `.env.local` is untracked and must stay that way; nothing in `proto-06/` contains a credential (only `seed-map.json` ids and the synthetic rig password constant). The throwaway project's credentials should be rotated when the lane closes.

🥄 *The scout bled. The army has the map.*
