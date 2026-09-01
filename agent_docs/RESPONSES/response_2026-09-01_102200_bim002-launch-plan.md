# BIM-002-CYBER-PHARMA — LAUNCH PLAN (Plan Mode, ONE message)
**Date:** 2026-09-01 · **Branch (disk):** `phase-3-bim002` (confirmed `git branch --show-current`) · **Status:** PENDING_APPROVAL
**Authority read in precedence order:** `agent_docs/AUTHORITY/AUTHORITY_README.md` → manager §4 (R-A…R-E + inherited) → `ACTIONS/PROTO06/TRANSFERS.md` §1–§3 + `FINDINGS.md` → map v1.1 → BIM_PLAYBOOK → BIM-001 package.
**Amendment A-1 honored:** `PROTO06_DB_URL` used for X0–X5; `RLS_HARNESS_*` rename happens at the R-D port, where I hand you exact `.env.local` lines. I never edit that file; no credential value appears in any command output, log, or document.

---

## 1. X0 EVIDENCE — scratch staged and verified

Executed: wipe in **F-6 order** (event trigger → `DROP SCHEMA public CASCADE` → re-grants) → baseline bootstrap → certified chain `0001–0015` via BIM-001's `db:reset` (the sanctioned scratch path) → `pg_catalog` read.
Evidence: `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/X0_catalog_2026-09-01.log`

| X0 requirement | Result |
|---|---|
| Sixteen tables present | ✅ 16 (accounts, apa_memberships, businesses, user_businesses, subscriptions, pending_registrations, user_data, report_files, aac/wac/ful_reference, pbm_info, audit_logs, reference_dataset_versions, + baseline user_roles, profiles) |
| All `rowsecurity = true` | ✅ 16/16 |
| Exactly three policies, baseline tables only | ✅ `profiles` UPDATE + SELECT ("… owner or superadmins"), `user_roles` SELECT ("Users can read their own role"), all `{authenticated}` |
| Zero policies on the fourteen new tables | ✅ 0 |
| `ensure_rls` event trigger | ✅ present |
| `storage.objects` policy baseline (AC11 reference) | ✅ **0 policies** — recorded now so the after-diff is meaningful |
| Pooler host | ✅ `aws-1-us-west-1` (connection succeeded; `aws-0` is the dead generation) |
| Authority + transfers on disk | ✅ `agent_docs/AUTHORITY/` (7 files incl. map v1.1, BIM_PLAYBOOK, TRIANGULATION, FRANK_API-02, FORMAT_MAP, DATA_CONTRACT) · `ACTIONS/PROTO06/` (TRANSFERS, FINDINGS, brief, plan) |

### Tenant-key columns confirmed on disk (manager §5.2)

| Table | Tenant key | Verdict |
|---|---|---|
| `accounts` | `id` (self); `owner_user_id` exists but is **forbidden** as a policy input (R-A) | ✅ `is_account_member(id)` |
| `businesses` | `account_id` uuid NOT NULL; keyed by `id` for membership | ✅ |
| `user_businesses` | `user_id` + `business_id`, both uuid NOT NULL | ✅ |
| `subscriptions` | `account_id` uuid NOT NULL; **no `business_id`** | ✅ matches R-2 |
| `user_data` | `business_id` uuid NOT NULL | ✅ |
| `report_files` | `business_id` uuid NOT NULL | ✅ |
| `pending_registrations` | `business_id` uuid **NULLABLE** (exists) | ✅ recon note — stays deny-all per §5.2 row 6; the column existing is not a reason to policy it |
| **`apa_memberships`** | **NO `business_id`.** Only `discount_redeemed_business_id` (uuid, NULLABLE, no FK) | ⛔ **FLAG-1 — see below** |
| Reference ×5, `audit_logs` | none (by design) | ✅ |

### Index check (T-7 medicine) — **no gap, nothing to add**

`user_data(business_id)` ✅ · `report_files(business_id)` ✅ · `businesses(account_id)` ✅ (serves the `is_account_member` join) · `subscriptions(account_id)` ✅ · `user_businesses(user_id)`, `(business_id)`, and **UNIQUE `(user_id, business_id)`** ✅ (the composite the helpers' predicate wants). Manager §5.2's index clause is satisfied by BIM-001 — **no index migration proposed**, no finding raised.

---

## 2. FLAGS — every one surfaced, none resolved unilaterally

**⛔ FLAG-1 — `apa_memberships` has no tenant key. Recommend deny-all.**
The only candidate is `discount_redeemed_business_id`: nullable, no FK (FRANK catalog: *"Not a FK — soft reference"*), and semantically an **audit stamp of which store redeemed a discount**, not a tenancy key. An APA membership belongs to a pharmacist licence, not a store; rows exist before any redemption, when the column is NULL and the row would be invisible to everyone. §5.2 row 8 pre-authorizes exactly this branch ("if none → deny-all + flag"). **Proposed: zero policies, service-role only, documented not dropped.** Consequence: no `apa_memberships` migration file, and the policy count below.

**⛔ FLAG-2 — the manager's expected policy count (17) does not reconcile with its own row-by-row breakdown.**
§5.2's own list sums to 15 (with apa deny-all) or 16 (with apa policied): accounts 1 · businesses 2 · user_businesses 1 · subscriptions 1 · apa 0–1 · user_data 4 · report_files 1 · reference ×5 = 15–16, not 17. **X0-confirmed plan: 15 new policies**, plus the 3 untouched baseline = **18 rows in `pg_policies`** at close. AC9 is deliberately written as "matches the plan as confirmed at X0" (the ERRATUM-Q2 lesson), so this resolves cleanly — but I will not adopt either number silently. Please confirm 15.

**⛔ FLAG-3 — the harness port source is INCOMPLETE on this branch.**
`proto-06/policies/` is complete (all 9 SQL files — the verbatim source for `RLS_TEMPLATES.md` ✅), but **`proto-06/scripts/` was not copied forward.** Consequences: the four copied harness files all `import … from "../scripts/rig-lib.mjs"` and are **broken as they sit**, and the missing pieces are load-bearing — `rig-lib` (env/pg/password), `rig-seed`, `rig-policy` (**the one-per-op law checker → AC6**), `rig-reset`, `rig-prove` (**the one-command proof → AC12**). R-D says the port comes from *"`proto-06/harness/` + `proto-06/scripts/`"*, so the manager expects both.
**Options:** (a) you copy `proto-06/scripts/` forward from `phase-3-proto-6` (preferred — preserves proven text for review-by-diff, and I must not check out that branch per §8); or (b) I re-author the missing five in `scripts/rls-harness/` from the TRANSFERS §2 contract, which is a rewrite, not a port, and loses byte-fidelity to the certified rig. **Recommend (a).**

**⛔ FLAG-4 — no CI configuration exists in this repo.**
No `.github/workflows/`, no other CI config anywhere. AC13 requires the harness job to exist in "the CI configuration". Remote is GitHub (`github.com/ahmedmusawir/cyber-pharma-dev-v1-phase-3`), so **proposed: create `.github/workflows/rls-harness.yml`** — a new top-level directory for this repo, gated on `RLS_HARNESS_*` secrets, never executed by me (cloud execution is yours, credential boundary). Confirm GitHub Actions is the intended platform before I create the directory.

**⛔ FLAG-5 — X6 clean replica not provisioned (named as your input, not blocking).**
Candidate worth considering instead of provisioning fresh: **BIM-001's replica throwaway** (`ihg…`, pooler `aws-1-ap-south-1`) already proved the exact 2-table/3-policy baseline path at BIM-001 X2. If you want it reused, it needs its own key set (or the documented swap procedure §9 mentions). Your call; I need the connection string at X6, not before.

**FLAG-6 — `user_data` DELETE gated to `is_admin_of` is an Architect's call you may strike.** §5.2 row 9 says so explicitly. **I will build `admin`** as ruled; one word changes it to member and costs one line in one file. Raising it because a member unable to delete their own store's claim rows is a product-visible behavior, not just a policy detail.

**FLAG-7 — carried decisions I am NOT deciding:** `businesses` INSERT/DELETE stay service-role-only (no Phase 3 path needs them — BIM-004 seeds via service role, BIM-005 reads); `subscriptions` may tighten to admin-only in Phase 7 (flag, don't decide); `report_files` fidelity flag (columns never enumerated in FRANK catalog) rides to BIM-004/005 untouched here.

**FLAG-8 — cosmetic, disk wins:** the launch order and BIM-002's `AUTHORITY/README.md` both cite `agent_docs/AUTHORITY/README.md`; the file on disk is `AUTHORITY_README.md`. No impact; one-line correction when someone next edits those pointers.

**FLAG-9 — scratch-only artifact, no action:** on the scratch, `rls_auto_enable()` and `update_updated_at()` are `SECURITY INVOKER` with no pinned `search_path` (they come from my BIM-001 *bootstrap reproduction*, not the live starter kit). Inert for this module (no tables created; no structure changes permitted), and **not** the AC8 target — AC8 governs the three new helpers, which ship `SECURITY DEFINER` + pinned. Noting so nobody reads the X0 log and thinks a helper is malformed.

---

## 3. MIGRATION NUMBERING — 0016 helpers, then one file per table

Continuing the certified chain from `0015`. File order = landing order (§6.1); inside each file, SELECT precedes writes (F-1/F-8 by layout). Every file opens with an **assert-then-create** block (§6.5): target table exists, `rowsecurity = true`, zero existing policies for the operations it creates — `RAISE EXCEPTION` otherwise.

| File | Contents | Pattern |
|---|---|---|
| `0016_rls_helpers.sql` | `is_member_of`, `is_admin_of` (verbatim TRANSFERS §1.0), **`is_account_member`** (R-A, same modifiers) — all `SECURITY DEFINER` + `set search_path = ''` + `STABLE` + fully-qualified + `revoke execute from anon` + `grant to authenticated` | §1.0 + R-A |
| `0017_rls_accounts.sql` | SELECT `is_account_member(id)` | R-A |
| `0018_rls_businesses.sql` | SELECT `is_member_of(id)` → UPDATE `is_admin_of(id)` USING + WITH CHECK | T-1 → T-3 |
| `0019_rls_user_businesses.sql` | SELECT `user_id = auth.uid()` (direct, F-7) | T-5 |
| `0020_rls_subscriptions.sql` | SELECT `is_account_member(account_id)` | R-A mirror |
| `0021_rls_user_data.sql` | SELECT → INSERT (WITH CHECK) → UPDATE (USING + WITH CHECK) → DELETE (`is_admin_of`, FLAG-6) | T-1 + T-2 |
| `0022_rls_report_files.sql` | SELECT `is_member_of(business_id)` | T-1 |
| `0023_rls_aac_reference.sql` | SELECT `true` to authenticated | T-4 |
| `0024_rls_wac_reference.sql` | SELECT `true` | T-4 |
| `0025_rls_ful_reference.sql` | SELECT `true` | T-4 |
| `0026_rls_pbm_info.sql` | SELECT `true` | T-4 |
| `0027_rls_reference_dataset_versions.sql` | SELECT `true` | T-4 |

**Twelve new files. Fifteen new policies. Zero DDL beyond policies and functions** — no columns, no types, no indexes, no seed rows.

**Deny-all tables (`apa_memberships`, `pending_registrations`, `audit_logs`) get no migration file.** Their deliberate lockdown is recorded in `agent_docs/AUTHORITY/RLS_TEMPLATES.md` (§deny-all) and in the spec's AC9 evidence — "documented not dropped" satisfied by documentation rather than a no-op migration. *If you'd rather have a comment-only `0028_rls_denyall_notes.sql` for review-by-diff, say so and I'll add it; I'd rather not ship a migration that executes nothing.*

**SELECT predicate text is provisional until X2.** Every SELECT above is written with formulation (A) `is_member_of(...)`; if R-B's evidence selects (B), the inlined subquery text becomes the template for **tenant SELECT policies only** — helpers stay for role-gated writes and for `is_account_member` regardless (R-B).

---

## 4. HARNESS PORT — file map (R-D)

Ported into `scripts/rls-harness/` (permanent home), from `proto-06/harness/` + `proto-06/scripts/` (pending FLAG-3):

| New path | From | Change |
|---|---|---|
| `scripts/rls-harness/lib/env.mjs` | `rig-lib.mjs` | `loadEnv(prefix = "RLS_HARNESS_")` — generalized per R-D; fail-closed; never prints values |
| `scripts/rls-harness/lib/db.mjs` | `rig-lib.mjs` | pg client from `<PREFIX>DB_URL` |
| `scripts/rls-harness/lib/verdict.mjs` | inline in `rig-harness` | F-4 deny semantics in one place (SELECT 0 rows · INSERT `42501` · UPDATE/DELETE 0 affected) + the ground-truth helper (F-4 corollary) |
| `scripts/rls-harness/expectations.json` | `expectations.json` | tables → the sixteen real; identities → `anon, ownerA, staffA, ownerB, multiStore`; overrides per §5.2 as X0-confirmed |
| `scripts/rls-harness/payloads.json` | inline `payloads` map | one insert row + one update patch per real table (data, not logic) |
| `scripts/rls-harness/seed.mjs` | `rig-seed.mjs` | seed cast §5.3: Account A → A1, A2 · Account B → B1 · ownerA admin A1+A2 · staffA member A1 · ownerB admin B1 · multiStore member A1+B1; writes `seed-map.json` (ids only) |
| `scripts/rls-harness/harness.mjs` | `rig-harness.mjs` | the matrix: **5 identities × 16 tables × 4 ops = 320 cells**; self-cleaning probe chain (F-9); publishable-key ≠ secret-key guard |
| `scripts/rls-harness/attacks.mjs` | `rig-attacks.mjs` | battery + new cases: accounts spoof (ownerB → account A by id), subscriptions spoof, `user_data` DELETE by member, foreign-`business_id` re-home, role tampering — each ground-truthed |
| `scripts/rls-harness/revocation.mjs` | new (R-C) | multiStore sees A1+B1 → service role deletes `(multiStore, B1)` → **same session, no refresh** → B1 gone, A1 remains; junction ground truth logged |
| `scripts/rls-harness/policy-check.mjs` | `rig-policy.mjs` | one-permissive-policy-per-op law (**AC6**) + **F-1 mechanical check: no write policy on a table lacking a SELECT policy, and SELECT appears earlier in the same file (AC7)** |
| `scripts/rls-harness/explain.mjs` | `rig-explain.mjs` | impersonated `authenticated` role + real `auth.uid()` claim; serves X2 A/B and AC17 |
| `scripts/rls-harness/prove.mjs` | `rig-prove.mjs` | **the one command** → `npm run rls:prove` (AC12) |
| `scripts/rls-harness/README.md` | new | run-sheet, expectations format, re-point recipe (BIM-005 inherits) |
| `package.json` | — | `"rls:prove": "node scripts/rls-harness/prove.mjs"` |
| `.github/workflows/rls-harness.yml` | new | AC13, pending FLAG-4 |

`proto-06/` is **not modified and not deleted by me** — its removal and the `phase-3-proto-6` deletion are yours (R-D), after this port is certified.

**Env lines I will hand you at the port (you add them; I never touch `.env.local`):**
`RLS_HARNESS_DB_URL`, `RLS_HARNESS_SUPABASE_URL`, `RLS_HARNESS_PUBLISHABLE_KEY`, `RLS_HARNESS_SECRET_KEY` — throwaway-scoped only. Until then, X0–X5 run on `PROTO06_DB_URL` per A-1.

---

## 5. R-B A/B — method and time-box

**Target:** ≥100k `user_data` rows on the scratch (target, not a gate — achieved volume is recorded either way).
**Formulations, one at a time, on a temporary `user_data` SELECT policy:**
- **(A)** `using (public.is_member_of(business_id))`
- **(B)** `using (business_id in (select business_id from public.user_businesses where user_id = auth.uid()))`

**Method:** impersonate `authenticated` with a real `auth.uid()` claim (`set_config('request.jwt.claims', …, true)` + `set local role authenticated` — the proven Proto 06 pattern, since the SQL editor lies about RLS). For each formulation × two query shapes (**unqualified read** and **`business_id = $1` read**): `EXPLAIN (ANALYZE, BUFFERS)`, **3 runs, first discarded as cold, median recorded**. Temporary policies dropped after; the one-per-op law is re-checked before X3 begins so no A/B residue survives.
**Decision:** written to `evidence/X2_AB_DECISION.md` (AC16) with seeded volume, four plans, chosen predicate, one-sentence rationale. **Tie-break rule I propose:** if the two are within ~10% on both shapes, keep **(A)** — single point of truth, one template, easier review-by-diff; performance wins only on a clear margin.
**Time-box: one hour.** If the scratch cannot reach 100k or the box expires, I record achieved volume + partial evidence, keep (A), and proceed — the box is a stop rule, not a target to chase.

---

## 6. GATE SEQUENCE AND COMMANDS

| Gate | Action |
|---|---|
| **X0** | ✅ **DONE** (§1) |
| **X1** | `0016_rls_helpers.sql` → apply → `pg_proc` check: 3 helpers, `prosecdef=true`, `provolatile='s'`, `proconfig` has `search_path=`, anon lacks EXECUTE (**AC8**) |
| **X2** | seed volume → A/B → `evidence/X2_AB_DECISION.md` → SELECT template fixed (**AC16/AC17**) |
| **X3** | `0017…0027` land **one at a time, red→green each** (expectation flipped first — a policy that never went red proves nothing, §4.3.6); `policy-check.mjs` after every landing (**AC6/AC7**) |
| **X4** | full matrix (320 cells) + attack battery + revocation case; every mutation denial ground-truthed (**AC1–AC5, AC10**) |
| **X5** | `npm run rls:prove` from empty scratch, **twice**, evidence identical modulo timestamps/ids (**AC12**) |
| **X6** | clean replica (**your input, FLAG-5**) — chain `0001–0027` on the 2-table/3-policy baseline; catalog matches X5 (**AC14**) |
| **X7** | build + tsc + jest (baseline 28/128/0, re-run after any dep install) · `src/types/supabase.ts` diff vs BIM-001 **empty** · greps: zero `createAdminClient` outside the harness, zero `user_roles`/`user_metadata`/`raw_user_meta_data`/`profiles`/`owner_user_id` inside `0016+` policy bodies, boundary-aware (**AC5, AC18, AC19**) · `storage.objects` policy count still 0 (**AC11**) |

Then: `RLS_TEMPLATES.md` (AC20) → spec evidence-fill → retrospective → per-concern commit lists → **STOP**.

---

## 7. PER-CONCERN COMMIT GROUPING (prepared for you; I run no git — §8)

1. **Helpers + templates** — `supabase/migrations/0016_rls_helpers.sql` · `agent_docs/AUTHORITY/RLS_TEMPLATES.md`
2. **Policy migrations** — `supabase/migrations/0017…0027`
3. **Harness port + task + CI** — `scripts/rls-harness/**` · `package.json` · `.github/workflows/rls-harness.yml`
4. **Evidence + spec + retrospective** — `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/{evidence/,ACCEPTANCE_SPEC.md,RETROSPECTIVE.md}` · `agent_docs/RESPONSES/` · session log · `RECOVERY.md` · `CHANGELOG.md`

Exact command blocks at handoff. `proto-06/` deletion and the `phase-3-proto-6` branch deletion stay yours (R-D).

---

## 8. FORBIDDEN ZONES — restated as my working constraints (§8)

No policy on `audit_logs`, `user_roles`, `profiles`, or `storage.objects` · no policy reading `user_roles`, `user_metadata`, `raw_user_meta_data`, `profiles`, or `accounts.owner_user_id` · no superadmin/platform/oversight clause of any kind · no table-structure change, no seed data in migrations, no service-layer or UI wiring · no audit triggers or RPC wrappers · no `pbm_key` logic · **the dev backend is never touched** (scratch + replica only) · `.env.local` never edited, no credential value ever printed · **zero git commands** · `phase-3-proto-6` never merged or checked out.

---

→ **Awaiting: plan approval + FLAG-1 (apa deny-all), FLAG-2 (count = 15), FLAG-3 (copy `proto-06/scripts/` forward), FLAG-4 (GitHub Actions confirm).** FLAG-5 (replica) is needed only at X6; FLAG-6 (DELETE gate) I build as ruled unless struck. No file is authored until you approve.
