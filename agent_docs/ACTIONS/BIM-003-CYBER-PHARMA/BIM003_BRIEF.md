# BIM003_BRIEF.md — BIM-003-CYBER-PHARMA · Audit Machinery

**Status:** FINAL 2026-09-07 (contract layer — frozen at handoff) · **Author:** JARVIS · **Ratified rulings:** R-1..R-5 (Director), R-6..R-8 (Architect, engineering)

---

## 1. Why this module exists

Phase 3 builds the vault. BIM-001 gave it walls (schema), BIM-002 gave it locks (RLS). BIM-003 gives it a camera: every read of patient-shaped data and every write to any tenant table leaves a row nobody can edit or erase. BIM-004 will seed through it; BIM-005 will read through it; the CRV walk will verify itself against it. If this module is wrong, the phase gate cannot be trusted.

## 2. What ships

1. **`audit_logs`** — one table, insert-only, RLS per R-1, immutability guard per R-6, indexes per §4.
2. **`audit_write()`** — one SECURITY DEFINER trigger function; one template; stamped AFTER INSERT/UPDATE/DELETE FOR EACH ROW on all sixteen tenant-scoped tables (R-2).
3. **`owedbook_<noun>()`** — one SECURITY DEFINER wrapper per OwedBook read query (R-4), log-then-return.
4. **`npm run audit:prove`** — extension of `scripts/rls-harness/` that runs a scripted two-tenant session and diffs the produced trail against a golden expectation (Gate G-6).
5. Migrations continuing the chain after `0027`; regenerated types (additive only).
6. Retention posture paragraph (§6) — documentation, no mechanism.

## 3. `audit_logs` row shape (R-5: shaped for future readers; nothing built for them)

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint identity` PK | monotonic; cheap ordering for future partition-by-range |
| `occurred_at` | `timestamptz NOT NULL DEFAULT now()` | indexed (R-3) |
| `actor_user_id` | `uuid NULL` | `auth.uid()`; NULL when the service role acts |
| `actor_role` | `text NOT NULL` | JWT role claim (`authenticated` / `service_role` / `anon`), read from `current_setting('request.jwt.claims', true)`; fallback `current_user` |
| `business_id` | `uuid NULL` | from NEW/OLD row when the table has it; NULL per R-8 otherwise; indexed |
| `table_name` | `text NOT NULL` | `TG_TABLE_NAME` for writes; the underlying table for read wrappers |
| `row_id` | `text NULL` | primary key of the touched row as text (writes); NULL for page reads |
| `action` | `text NOT NULL CHECK (action IN ('insert','update','delete','read_page'))` | four values, fixed |
| `old_data` | `jsonb NULL` | `to_jsonb(OLD)` on update/delete; NULL otherwise |
| `new_data` | `jsonb NULL` | `to_jsonb(NEW)` on insert/update; NULL otherwise |
| `context` | `jsonb NULL` | read wrappers: `{fn, args, page, limit, offset, filters}`; R-8 tables: their identifying key; writes: NULL |

**Not in v1 (deliberately):** request id / correlation id, IP, user agent, before/after diff computation, redaction of PHI inside `old_data`/`new_data`. The trail *is* PHI and is protected by R-1 and R-6; redaction is a Phase 8 conversation.

## 4. Indexes

`(occurred_at)` · `(business_id, occurred_at)` · `(table_name, row_id)`. Three, no more. Partial or covering indexes are a later ruling when volume exists.

## 5. Design rules the Engineer builds to

- **Trigger function is SECURITY DEFINER**, search-path pinned, owner-correct, `REVOKE EXECUTE FROM public, anon` — it must insert regardless of the invoking user's policies on `audit_logs` (tenants have no INSERT policy by R-1).
- **Immutability guard (R-6):** `BEFORE UPDATE OR DELETE ON audit_logs FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable()` which does `RAISE EXCEPTION 'audit_logs is append-only'`. No `WHEN` clause, no role check — unconditional.
- **RLS (R-1):** `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` on `audit_logs`; exactly ONE policy: SELECT for `authenticated` where the caller is a junction **admin** of `business_id` (reuse the BIM-002 role-gated helper — TV-3). No INSERT/UPDATE/DELETE policies. Service role bypasses RLS for inserts and is stopped by R-6 for mutation.
- **Wrappers (R-4):** signature `owedbook_<noun>(p_business_id uuid, <query args>)`; first statement asserts `p_business_id IN (SELECT public.my_business_ids())` else `RAISE EXCEPTION` using a fixed message `'not a member of business'`; second statement inserts the `read_page` row; then returns. One row per call regardless of page size (R-7). Return type mirrors what `services/owedbook.ts` expects per `BACKEND_SWAP_NOTES` so BIM-005's swap is a one-line change per query.
- **Grants:** wrappers `GRANT EXECUTE TO authenticated`; `REVOKE FROM public, anon`. Nothing is callable by `anon`.
- **Stamping is mechanical:** sixteen near-identical migration files (or one file with sixteen statements — Engineer chooses in Plan Mode, states why). A reviewer must be able to `diff` any two stamps and see only the table name change.
- **Never edit `0001`–`0027`.**

## 6. Retention posture (R-3 — documentation only)

Cyber Pharma retains audit rows for a **minimum of six years** from `occurred_at`, matching HIPAA §164.316(b)(2)(i). In v1 rows are retained indefinitely; no purge, archive, or partition mechanism exists. Phase 8 owns the archival mechanism; `occurred_at` is indexed now so a range-partition migration is a plain additive change. Nothing in this module may delete an audit row, including the service role.

## 7. Stages (J-05: strict order, each with its own stop rule and report)

| Stage | Builds | Stop rule |
|---|---|---|
| S1 | `audit_logs` + indexes + guard + RLS + `audit_write()` + sixteen stamps; from-scratch apply on throwaway | any migration error → revert the file, report, STOP |
| S2 | wrappers (count per TV-6) + grants; from-scratch re-apply | any wrapper whose return type cannot mirror the service contract → red flag, STOP |
| S3 | harness extension `audit:prove` + golden trail + G-3..G-6 probes; evidence fill; retrospective | any literal FAIL against the spec → report, do not patch the spec, STOP |

## 8. Exit gate (map §5, unchanged)

A scripted session produces the exact expected audit trail — reads and writes — attributable to actor + business + object; tampering attempts (UPDATE/DELETE on `audit_logs`) rejected for every role including the service role.

## 9. Dependencies and hand-offs

**Depends on:** BIM-002 closed (satisfied). **Hands to:** BIM-004 (seed reads via wrappers, AC4 there), BIM-005 (service swap onto the wrappers), APPLY SESSION (chain applied to dev backend in order). **Deferred Ledger candidates this module may surface:** redaction inside audit payloads · request/correlation id · audit viewer UI · MissionControl inbox reader.

---

🥄 *The camera does not blink. — JARVIS*
