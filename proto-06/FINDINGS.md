# PROTO-06 — FINDINGS LEDGER
## Every surprise, dead end, and Supabase behavior quirk (feeds TRANSFERS.md §3)

---

### F-1 — Write policies require a paired SELECT policy or they silently no-op ⭐ FIRST-CLASS TRANSFER LESSON

**Discovered:** R2, T-3 landing (2026-08-31). **Director-ruled:** APPROVED, fix landed as the 8th policy.

`business_update_admin` (USING/WITH CHECK `is_admin_of(id)`) was correct, present in `pg_policies`, and **completely unreachable**: ownerTwo's UPDATE affected 0 rows. Postgres evaluates the rows referenced by an UPDATE's `WHERE` under SELECT-read semantics — `businesses` had no SELECT policy, so no row was readable, so the UPDATE matched nothing. No error, no warning: **a silent no-op that looks identical to a working deny.**

**Fix:** `business_select_member` (T-1 pattern, SELECT to authenticated using `is_member_of(id)`). A *different* operation, so the one-permissive-policy-per-operation-per-table law is untouched. Post-fix: ownerTwo UPDATEs S1 (1 row affected), adminOne/memberOne stay denied — role gating proven.

**MANDATE FOR BIM-002:** land the SELECT policy BEFORE any write policy on every tenant table. A write policy authored without its read path will pass a naive "is the policy there?" review and fail silently in production. This is the single most valuable thing the rig bled for.

---

### F-2 — PostgREST caps responses at 1,000 rows by default (harness finding)

**Discovered:** R2, T-6 service-role bypass run.

The T-6 sample query requested `limit(6000)` on `fact_data` and received 1,000 rows — PostgREST's default `max-rows` ceiling, applied silently. The resulting "spans 1 distinct business" line understated cross-tenant reach; the per-table `count: 'exact'` figures alongside it were the real proof.

**Consequences for any harness (mothership included):** (a) never infer "all rows" from a `.select()` without an explicit count or pagination — an isolation test that reads 1,000 of 50,000 rows and sees only its own tenant proves less than it appears to; (b) use `{ count: 'exact', head: true }` for volume assertions; (c) at Phase-3 volumes, CRV/BIM-005 read validation must paginate or it will silently validate a slice.

---

### F-3 — `information_schema` is privilege-filtered; use `pg_catalog` for verification (carried from BIM-001, re-confirmed here)

Not rediscovered on the rig (the rig's catalog checks were written on `pg_catalog` from the start precisely because BIM-001 was burned), but restated because it belongs in the same transfer packet: `information_schema.constraint_column_usage` hides objects the connecting role doesn't own, producing false "missing constraint" failures. All verification instruments — rig, BIM-002, CRV — read `pg_catalog`/`pg_policies` directly.

---

### F-4 — Deny semantics differ by operation (harness design law)

Observed consistently across R1–R3:

| Operation | Denial shape |
|---|---|
| SELECT | `0 rows`, **no error** |
| INSERT | explicit error **`42501`** (RLS violation) |
| UPDATE / DELETE | `0 affected rows`, **no error** |

An isolation harness that only checks for thrown errors will score UPDATE/DELETE denials as "no error → allowed" or miss them entirely. The rig's matrix treats *both* shapes as DENY and asserts the inverse for ALLOW cells. **Corollary proven at R3:** "0 affected" needed independent confirmation that nothing persisted — verified via service-role ground truth after the role-tampering attack (junction still 4 rows, role still `member`). Any future harness must do the same for mutation attacks: absence of returned rows is not proof of absence of effect.

---

### F-5 — SECURITY DEFINER helper is mandatory, not stylistic

`is_member_of` / `is_admin_of` read `user_businesses`, which itself carries RLS (T-5 restricts users to their own rows). A SECURITY INVOKER helper would evaluate membership under the caller's restricted view and collapse to "can only see myself" — quietly breaking every policy that calls it. SECURITY DEFINER + `set search_path = ''` + fully-qualified references + `STABLE` + `revoke execute ... from anon` is the shipped shape (landmine §7.2 respected).

---

### F-6 — `ensure_rls` event trigger must be dropped before a schema wipe

Carried from BIM-001, applied preemptively in `rig-reset.mjs`: dropping `public` while the event trigger exists orphans it and breaks subsequent DDL. Wipe order is: event trigger → schema → re-grants.

---

### F-8 — Policy landing ORDER is part of the deliverable (surfaced by R4)

Writing the one-command from-scratch runner forced the order to be explicit:
**helpers → SELECT policies → write policies.** Authoring `rig-prove.mjs` with the
original discovery order (T-3 write before its SELECT) would have reproduced the F-1
silent no-op on every fresh run. The order is now encoded in `POLICY_ORDER` and is a
transfer artifact in its own right: BIM-002's migrations should ship in that sequence
rather than leaving it to chance.

---

### F-9 — Harness idempotence required chaining probes to their own rows

The first DELETE probe consumed a fixed seed row, so run 2 would have tested different
ground than run 1. Each identity×table probe chain now feeds its INSERT's returned id to
its own UPDATE and DELETE, falling back to a static seed row only when no insert
succeeded. That is what made R4's twice-from-scratch requirement pass with identical
results — and it is a general law for any repeatable isolation suite: **a destructive
test must destroy only what it created.**

---

### F-7 — Junction self-visibility is not circular, but must not use the helper

`ub_select_self` uses `user_id = auth.uid()` directly. Calling `is_member_of()` from a policy *on the junction itself* would be self-referential. Direct comparison is the correct pattern for the junction; the helper is for every other tenant table.
