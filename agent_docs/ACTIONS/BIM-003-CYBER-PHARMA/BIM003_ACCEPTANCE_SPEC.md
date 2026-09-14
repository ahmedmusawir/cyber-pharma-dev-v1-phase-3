# BIM003_ACCEPTANCE_SPEC.md — BIM-003-CYBER-PHARMA · Audit Machinery

**Status:** SEEDED 2026-09-07 (AC text is contract — frozen at handoff; Engineer fills **Evidence** only; QA appends to the **Erratum Lane**; nobody rewrites AC text)
**Grading rule:** QA grades each AC **as literally written**. Status vocabulary: PASS · FAIL · UNTESTED · BLOCKED · PASS-PENDING-ADJUDICATION · PASS WITH NOTE.
**Counts fixed at write time:** sixteen tables · four `action` values · three indexes · one SELECT policy on `audit_logs` · zero INSERT/UPDATE/DELETE policies on `audit_logs` · wrapper count = **N** where N is stated by the Engineer in Plan Mode (TV-6) and recorded in the erratum lane row E-0 before build.

**Identities used by all harness ACs (seeded by the harness, throwaway only):** `admin-A` (junction admin of business A) · `member-A` (junction member of A) · `admin-B` (admin of B) · `multi` (admin of A and B) · `svc` (service-role connection) · `anon` (no session).

---

## Stage 1 — table, guard, RLS, trigger template, stamps

| AC | Statement (literal) | Method | Evidence |
|---|---|---|---|
| AC-101 | The full migration chain applies from scratch on a clean throwaway project with exit code 0 and zero `ERROR` lines in the log. | from-scratch runner log | |
| AC-102 | `public.audit_logs` exists with exactly these eleven columns in this order: `id, occurred_at, actor_user_id, business_id, actor_role, table_name, row_id, action, old_data, new_data, context` — **or** the order stated in `BIM003_BRIEF.md` §3 (either order passes; the set must match). | `pg_catalog` column query | |
| AC-103 | `audit_logs.action` carries a CHECK constraint permitting exactly the four values `insert`, `update`, `delete`, `read_page`; a fifth value is rejected. | SQL positive + negative | |
| AC-104 | Exactly three indexes exist on `audit_logs` beyond the primary key, covering `(occurred_at)`, `(business_id, occurred_at)`, `(table_name, row_id)`. | `pg_indexes` | |
| AC-105 | A trigger `BEFORE UPDATE OR DELETE` exists on `audit_logs` calling a function that raises unconditionally. | `pg_trigger` + function source | |
| AC-106 | `UPDATE audit_logs` as `svc` raises; `DELETE FROM audit_logs` as `svc` raises; both as `admin-A` raise; both as `anon` raise. (Six negative probes, six raises.) | harness | |
| AC-107 | RLS is ENABLED and FORCED on `audit_logs`. | `pg_class.relrowsecurity`, `relforcerowsecurity` | |
| AC-108 | Exactly one policy exists on `audit_logs`; its command is SELECT; its role is `authenticated`. Zero policies exist for INSERT, UPDATE, or DELETE. | `pg_policies` | |
| AC-109 | `admin-A` SELECT on `audit_logs` returns only rows whose `business_id` is A's; count equals the harness's expected A-count. | harness | |
| AC-110 | `member-A` SELECT on `audit_logs` returns zero rows. | harness | |
| AC-111 | `admin-B` SELECT returns only B's rows; `multi` SELECT returns A's plus B's rows and no others. | harness | |
| AC-112 | `anon` SELECT on `audit_logs` returns zero rows or is denied (either passes). | harness | |
| AC-113 | `admin-A` INSERT into `audit_logs` is denied by RLS (no INSERT policy). | harness negative probe | |
| AC-114 | Function `public.audit_write()` exists, is SECURITY DEFINER, has `search_path` pinned in its `proconfig`, and has EXECUTE revoked from `public` and from `anon`. | `pg_proc`, `has_function_privilege` | |
| AC-115 | Exactly sixteen tables carry a trigger executing `audit_write()`; the trigger on each is `AFTER INSERT OR UPDATE OR DELETE ... FOR EACH ROW`. The sixteen table names match the list recorded in erratum row E-0. | `pg_trigger` query, count = 16 | |
| AC-116 | On any stamped table that has a `business_id` column: one INSERT produces one `audit_logs` row with `action='insert'`, `new_data` non-null, `old_data` null, `business_id` equal to the inserted row's, `table_name` equal to the table, `row_id` equal to the new primary key as text. | harness, at least one table | |
| AC-117 | On the same table: one UPDATE produces one row with `action='update'`, both `old_data` and `new_data` non-null; one DELETE produces one row with `action='delete'`, `old_data` non-null, `new_data` null. | harness | |
| AC-118 | On a table listed under R-8 (no `business_id`): a write produces one row with `business_id` null and `context` non-null. | harness | |
| AC-119 | A write performed by `svc` produces an audit row with `actor_user_id` null and `actor_role='service_role'`; a write by `admin-A` produces `actor_user_id` = A's uuid and `actor_role='authenticated'`. | harness | |
| AC-120 | Any two stamping migrations differ, under `diff`, only in the table name (and filename header if present). | `diff` of two stamp files | |
| AC-121 | Migrations `0001` through `0027` are byte-identical to their state at `dfc8a6a`. | `git diff dfc8a6a -- supabase/migrations/00[0-2]*` empty (read-only git) | |

## Stage 2 — read wrappers

| AC | Statement (literal) | Method | Evidence |
|---|---|---|---|
| AC-201 | Exactly **N** functions exist in `public` whose names begin with `owedbook_`, where N equals erratum row E-0. | `pg_proc` count | |
| AC-202 | Every `owedbook_*` function is SECURITY DEFINER, `search_path` pinned, EXECUTE granted to `authenticated`, revoked from `public` and `anon`. | `pg_proc`, `has_function_privilege`, all N | |
| AC-203 | Every `owedbook_*` function's first parameter is named `p_business_id` of type `uuid`. | `pg_proc.proargnames`, all N | |
| AC-204 | Calling any `owedbook_*` function as `admin-A` with `p_business_id` = A returns without error and inserts exactly one `audit_logs` row with `action='read_page'`, `business_id` = A, `actor_user_id` = A's uuid, `table_name` non-null, `context` non-null containing the key `fn` whose value is the function name. | harness, all N | |
| AC-205 | Calling any `owedbook_*` function as `member-A` with `p_business_id` = A behaves identically to AC-204 (members may read; only audit visibility is admin-gated). | harness, all N | |
| AC-206 | Calling any `owedbook_*` function as `admin-A` with `p_business_id` = B raises with message text `not a member of business` and inserts zero `audit_logs` rows. | harness, all N | |
| AC-207 | Calling any `owedbook_*` function as `anon` is denied (no EXECUTE) and inserts zero rows. | harness, all N | |
| AC-208 | A single wrapper call returning a page of K rows (K ≥ 2) inserts exactly one `audit_logs` row, not K. | harness, one wrapper | |
| AC-209 | Each wrapper's return shape is documented in `evidence/WRAPPER_CONTRACT.md` alongside the `services/owedbook.ts` type it mirrors, with file:line into the service. | doc + file:line | |
| AC-210 | `services/owedbook.ts`, `app/**`, `components/**`, `mocks/**` are byte-identical to `dfc8a6a`. | `git diff dfc8a6a -- <paths>` empty | |

## Stage 3 — harness, golden trail, board

| AC | Statement (literal) | Method | Evidence |
|---|---|---|---|
| AC-301 | `npm run audit:prove` exists as a package script and exits 0 on the throwaway after a from-scratch apply. | package.json + run log | |
| AC-302 | `audit:prove` executes a scripted session of at least: one write per action type on a `business_id` table by `admin-A`, one write on an R-8 table, one wrapper call per `owedbook_*` function by `admin-A`, one cross-tenant wrapper attempt, and the six AC-106 tampering probes. | runner source + log | |
| AC-303 | `audit:prove` compares the produced `audit_logs` rows (ordered by `id`, excluding `id` and `occurred_at`) against `scripts/rls-harness/golden/audit_trail_expected.json` and fails non-zero on any difference. | runner source + a deliberately broken run (evidence of the failure path) | |
| AC-304 | The golden file is committed and human-readable; each expected row carries `table_name`, `action`, `actor_role`, and `business_id` (uuid or null). | file inspection | |
| AC-305 | `npm run rls:prove` (BIM-002's harness) still exits 0 on the same throwaway after the full chain. | run log | |
| AC-306 | Triad after all stages: `next build` reports 22 routes; `tsc --noEmit` reports 0 errors; jest reports 28 suites / 128 tests / 0 failures. | run logs | |
| AC-307 | Regenerated Supabase types (Director-run) differ from the pre-module types only by additions under `Functions` (the N wrappers) and the `audit_logs` table under `Tables`; no removals, no modifications to existing entries. | `git diff` of the types file, read-only | |
| AC-308 | README and RUN_NOTES document `npm run audit:prove` with the identical command string. | grep both files | |
| AC-309 | `RETROSPECTIVE.md` exists in the module folder with Keep / Change / Drop lines. | file inspection | |

## Surface, git, hygiene

| AC | Statement (literal) | Method | Evidence |
|---|---|---|---|
| AC-901 | Files created or modified by this module are limited to: new migration files after `0027`, `scripts/rls-harness/**`, `package.json` (scripts block only), the generated types file, README, RUN_NOTES, `RECOVERY.md`, `agent_docs/SESSIONS/**`, `agent_docs/RESPONSES/**`, and `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/**`. | `git status` + `git diff --stat` (read-only) | |
| AC-902 | No mutating git command appears in the Engineer session transcript. | Director attestation | |
| AC-903 | No Supabase CLI login/link or dashboard action appears in the Engineer session transcript; no credential other than the throwaway project's appears in any committed file. | Director attestation + grep for `supabase.co` hosts in the diff | |
| AC-904 | `.env.local` and `.env*` are not in the diff. | `git diff --stat` | |
| AC-905 | Every migration authored by this module has a header comment naming the module ID `BIM-003-CYBER-PHARMA`. | grep | |
| AC-906 | Each stage ended with a GIT REMINDER block and a stage report in `agent_docs/RESPONSES/` named `BIM003_<stage>_<date>.md`. | file inspection | |

---

## Erratum Lane (append-only · AC text above never changes)

| E-# | AC | Ruling source | Literal observation | Accepted wording / disposition | Evidence pointer | Status |
|---|---|---|---|---|---|---|
| E-0 | AC-115, AC-201 | Plan Mode (TV-1, TV-6), Director-approved | *(Engineer states: the sixteen table names; the wrapper count N and names)* | *(filled at approval, before build — J-21)* | plan message | Director-approved, pending QA confirmation |

---

🥄 *Grade it as written. Fix the code or file the erratum. Never touch the words. — JARVIS*
