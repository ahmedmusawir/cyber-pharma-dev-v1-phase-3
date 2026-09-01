# RLS_TEMPLATES.md — the blessed policy templates
## Campaign authority · authored at BIM-002 close, 2026-09-01 · review-by-diff source

Every SQL body below is **byte-identical to the shipped migration text** in `supabase/migrations/0016–0027`. Diff this file against those migrations; they must never disagree.

**Governing law:** Gap-6 (membership reads `user_businesses` ONLY — no policy or helper consults `user_roles`, `profiles`, `user_metadata`, `raw_user_meta_data`, or `accounts.owner_user_id`; there is no superadmin policy in OwedBook). Platform oversight is service role, server-side, audited.

---

## 0. Helpers — the core (migration 0016)

Four helpers. All four: `language sql` · `stable` · `security definer` · `set search_path = ''` · fully-qualified references · **revoked from BOTH `public` AND `anon`** · granted to `authenticated`.

```sql
create or replace function public.is_member_of(biz uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz
  );
$$;

create or replace function public.is_admin_of(biz uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_businesses ub
    where ub.user_id = auth.uid() and ub.business_id = biz and ub.role = 'admin'
  );
$$;

create or replace function public.my_business_ids()
returns setof uuid language sql stable security definer set search_path = ''
as $$
  select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid();
$$;

create or replace function public.is_account_member(acct uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.user_businesses ub
    join public.businesses b on b.id = ub.business_id
    where ub.user_id = auth.uid() and b.account_id = acct
  );
$$;

-- BOTH revokes are required (ERRATUM E-4). `from public` alone is NOT sufficient:
-- pg_default_acl grants function EXECUTE to anon EXPLICITLY, so a freshly created
-- function carries `anon=X` even after PUBLIC is revoked. Two channels, two revokes.
revoke execute on function public.is_member_of(uuid)       from public;
revoke execute on function public.is_admin_of(uuid)        from public;
revoke execute on function public.is_account_member(uuid)  from public;
revoke execute on function public.my_business_ids()        from public;
revoke execute on function public.is_member_of(uuid)       from anon;
revoke execute on function public.is_admin_of(uuid)        from anon;
revoke execute on function public.is_account_member(uuid)  from anon;
revoke execute on function public.my_business_ids()        from anon;

grant execute on function public.is_member_of(uuid)        to authenticated;
grant execute on function public.is_admin_of(uuid)         to authenticated;
grant execute on function public.is_account_member(uuid)   to authenticated;
grant execute on function public.my_business_ids()         to authenticated;
```

**Why `SECURITY DEFINER` is mandatory, not stylistic:** these helpers read `user_businesses`, which itself carries RLS (T-5 restricts each user to their own rows). A `SECURITY INVOKER` helper would evaluate membership *through the caller's own restricted view* and silently collapse every policy in the system to "can only see myself."

**Verification (AC8) is only valid after a from-scratch drop-and-apply** — `create or replace` preserves an existing ACL, so an incremental re-apply can show a clean grant a fresh database would not reproduce.

---

## 1. T-1 — Tenant SELECT (formulation **C**, adopted by measurement)

```sql
create policy "user_data_select_member"
  on public.user_data for select to authenticated
  using (business_id in (select public.my_business_ids()));
```

Applies to every `business_id`-scoped table (`user_data`, `report_files`); on `businesses` the key is the row's own id:

```sql
create policy "business_select_member"
  on public.businesses for select to authenticated
  using (id in (select public.my_business_ids()));
```

**Why the set-returning helper and not the scalar one:** the planner evaluates it **once** and hashes the result (`Filter: (ANY (business_id = (hashed SubPlan 1).col1))`, `SubPlan 1 → ProjectSet`), instead of invoking a scalar helper per candidate row. Measured at 100k rows: **29.6 ms vs 1,685 ms** unqualified (53.8×), **18.3 ms vs 562.8 ms** qualified (30.3×), **1,641 vs 101,640 buffers**.

**The RLS predicate is a security boundary, not a query optimizer.** Even under C the unqualified read scans the table — every application query against a tenant table must carry its own `business_id`/date filter.

## 2. T-2 — Tenant INSERT / UPDATE / DELETE

```sql
create policy "user_data_insert_member"
  on public.user_data for insert to authenticated
  with check (public.is_member_of(business_id));

create policy "user_data_update_member"
  on public.user_data for update to authenticated
  using (public.is_member_of(business_id))
  with check (public.is_member_of(business_id));

create policy "user_data_delete_admin"
  on public.user_data for delete to authenticated
  using (public.is_admin_of(business_id));
```

- **INSERT uses `WITH CHECK`, never `USING`** — the most common RLS authoring error. This is what makes *"`business_id` never comes from the client"* a database guarantee: a hand-supplied foreign id fails `42501`.
- **UPDATE needs both.** `USING` gates which rows are reachable; `WITH CHECK` gates what they may **become** — without it a legitimate member can re-home a row into a foreign tenant. Proven at BIM-002 X4/A3.1.
- Writes keep the **scalar** helper deliberately: they resolve few rows, so the per-row cost is nil, and write legality must not depend on what the caller can *see*.

## 3. T-3 — Role-gated write (junction role)

```sql
-- The SELECT policy is NOT optional and MUST be created first (see §7 law 1).
create policy "business_select_member"
  on public.businesses for select to authenticated
  using (id in (select public.my_business_ids()));

create policy "business_update_admin"
  on public.businesses for update to authenticated
  using (public.is_admin_of(id))
  with check (public.is_admin_of(id));
```

The role gate reads the **junction's** `role` column (`TEXT CHECK ('admin','member')`), never `user_roles`.

## 4. T-4 — Reference table (platform-shared read)

```sql
create policy "aac_reference_select_authenticated"
  on public.aac_reference for select to authenticated
  using (true);
-- NO write policy. RLS is enabled, so writes are locked to the service role
-- BY OMISSION — deliberate, not an oversight.
```

Applies to `aac_reference`, `wac_reference`, `ful_reference`, `pbm_info`, `reference_dataset_versions`.

## 5. T-5 — Junction self-visibility

```sql
create policy "ub_select_self"
  on public.user_businesses for select to authenticated
  using (user_id = auth.uid());
-- No write policies: junction mutations are service-role only, which is what makes
-- role-tampering structurally impossible rather than merely unlikely.
```

**Direct `auth.uid()` comparison, never a helper** — a helper here would be self-referential.

## 6. R-A — Account access (junction-derived)

```sql
create policy "account_select_member"
  on public.accounts for select to authenticated
  using (public.is_account_member(id));

create policy "subscription_select_account_member"
  on public.subscriptions for select to authenticated
  using (public.is_account_member(account_id));
```

Read-only for any user holding a junction row on **any** business under the account. **Never derived from `accounts.owner_user_id`** — ownership is not membership, and BIM-002 X4/A6 proves it directly: the account owner can read but cannot INSERT, UPDATE, or DELETE their own account. Account writes are billing territory (service role).

`is_account_member` stays a helper rather than an inline join: its inline form would depend on **two** policies (`user_businesses` *and* `businesses`) instead of one.

## 7. Deny-all — locked and documented, not dropped

`apa_memberships`, `pending_registrations`, `audit_logs` carry **zero policies**: RLS is enabled, nothing is granted, so only the service role reaches them.

| Table | Why |
|---|---|
| `apa_memberships` | **No tenant key exists.** Its only candidate, `discount_redeemed_business_id`, is nullable with no FK and is an audit stamp of which store redeemed a discount — a membership belongs to a licence, not a store. Confirmed at BIM-002 X0. |
| `pending_registrations` | Registration is Phase 4; the server route uses the service role. The table *does* have a nullable `business_id` — its presence is not a reason to policy it. |
| `audit_logs` | BIM-003's mission. Deny-all until then. |

A deny-all table must still be **seeded with a row** when tested, or its `0 rows` verdict is vacuous — "refused" and "empty" look identical to a harness.

## 8. ⚠️ Formulation B — the ANTI-PATTERN. Adopted nowhere. Do not use.

```sql
-- DO NOT SHIP THIS
create policy "..." on public.user_data for select to authenticated
  using (business_id in (
    select ub.business_id from public.user_businesses ub where ub.user_id = auth.uid()
  ));
```

An inline junction subquery inside a policy is **invoker-evaluated**, so it is silently blinded by the junction's own RLS. It matches B's performance exactly, and it is **wrong** whenever the junction's self-visibility policy is missing, not yet landed, or later tightened — returning **zero rows with no error**.

**Shield test, BIM-002 X2** — junction SELECT policy dropped, same identity, same data:

| Formulation | Rows visible | |
|---|---|---|
| A — scalar DEFINER helper | 66,667 | ✅ shielded |
| **B — inline subquery** | **0** | ❌ **blinded, silent total deny** |
| C — `my_business_ids()` DEFINER set | 66,667 | ✅ shielded |

C gives B's plan shape (+0.8% / +0.7%, identical buffers) *and* A's independence. There is no case for B.

## 9. The structural laws

1. **SELECT before write, on every tenant table, in the same migration file.** Postgres evaluates an UPDATE/DELETE's `WHERE` under SELECT-read semantics, so a write policy on a table with no SELECT policy **silently affects zero rows** — invisible at review time, indistinguishable from a legitimate deny at runtime.
2. **Landing order is law:** helpers → **junction SELECT** → other SELECTs → writes.
3. **Exactly one permissive policy per operation per table.** Multiple permissive policies OR together and silently widen access. Check mechanically after every landing.
4. **Every policy is `to authenticated`.** No policy grants `anon` anything, anywhere.
5. **Deny-by-default at birth:** tables are created with RLS enabled and zero policies; policies arrive one at a time, red-then-green.
6. **Assert-then-create:** each policy migration asserts the target table exists with `rowsecurity = true` and no conflicting policy, and (for C-formulated files) that the junction SELECT policy already exists — `RAISE EXCEPTION` otherwise. Silent failure becomes loud.

## 10. Verification instruments

`scripts/rls-harness/` — `policy-check.mjs` enforces laws 1–3 plus Gap-6 against `pg_catalog` (never `information_schema`, which is privilege-filtered and lies). `ac8-check.mjs` asserts helper shape and both grant channels, valid only after a from-scratch apply. `npm run rls:prove` runs the whole proof from an empty database.
