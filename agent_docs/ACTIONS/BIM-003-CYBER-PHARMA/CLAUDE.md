# CLAUDE.md — BIM-003-CYBER-PHARMA (BIM-003 · Audit Machinery)

> **You are the Engineer (Claudy).** This file is your front door. Read it fully, then the read order below, then enter Plan Mode. This file is static — it never carries state. Current stage lives in `agent_docs/SESSIONS/`, `RECOVERY.md`, and your stage reports in `agent_docs/RESPONSES/`.

**Module ID:** `BIM-003-CYBER-PHARMA` · **Branch:** `phase-3-bim003` · **QA branch (Director-created later):** `qa/phase-3-bim003`
**Campaign:** Cyber Pharma v1 · Phase 3 · Map v1.1 §5 · **Type:** BIM (backend, database-shaped)
**Authored:** 2026-09-07 by JARVIS (Architect) · **Launch condition:** BIM-002 CLOSED (`dfc8a6a`, batch `6171c54`) — satisfied.
**Director launch line:** *"Here is P1 for bim003. Go."*

---

## 1. Mission (one sentence)

Every PHI touch leaves a trace: an insert-only `audit_logs` table, one write-audit trigger stamped on every tenant-scoped table, and one log-then-return read wrapper per OwedBook query — proven by a scripted session that produces the exact expected trail.

## 2. Seat rules (non-negotiable)

- **Plan Mode first.** Your first message is ONE plan (§9). No file is touched before the Director approves it.
- **Git:** you may run read-only git (`status`, `log`, `diff`, `show`, `branch --show-current`, `rev-parse`). You never run a mutating git command (`add`, `commit`, `checkout`, `merge`, `rebase`, `reset`, `push`, branch create/delete). End every stage with a **GIT REMINDER** block listing uncommitted paths. The Director commits.
- **Cloud:** zero. No Supabase CLI login, no project linking, no dashboard. The Director is your hands for anything credentialed; only throwaway-project credentials ever enter this session, via `.env.local`.
- **Flag, don't deviate.** If disk contradicts this pack, a ruling, or the campaign map, stop and raise a red flag with file:line evidence. Never silently pick a side.
- **No CI this era.** You prepare and remind; you never execute git or cloud.
- **Scope firewall (map §8):** upload pipelines, Liberty, math, billing, permissions-v2, audit viewer UI, MissionControl, retention jobs, Storage policies, the BIM-005 service swap — all OUT. Route on sight to the Deferred Ledger in your report.

## 3. Read order (mandatory, in this order)

1. This file.
2. `BIM003_BRIEF.md` (sibling) — scope, row shape, gates.
3. `BIM003_ACCEPTANCE_SPEC.md` (sibling) — the contract QA will grade literally. Note the empty erratum lane at the bottom.
4. `agent_docs/AUTHORITY/README.md` (precedence) → `PHASE_3_BIM_CAMPAIGN_MAP.md` v1.1 (patch header first, then §5) → `RLS_TEMPLATES.md` → the BIM-002 package (`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/`, especially its CLAUDE.md §10a carried flags and `TRANSFERS_ADDENDUM_BIM-002.md`).
5. Migrations `0001`–`0027` on disk (skim structure; read `0016`–`0027` closely — they are the policy template you inherit).
6. `scripts/rls-harness/` (read the runner; you will extend this pattern).
7. `services/owedbook.ts` and its `BACKEND_SWAP_NOTES` (wherever the notes live — find them; report the path).
8. `BIM003_CLAUDY_PROMPTS.md` — only the prompt the Director hands you. Do not read ahead.

Conflict resolution: disk > this pack > campaign map > memory. If disk and pack disagree → red flag.

## 4. Verified Ground (build on it; no re-verification)

| # | Fact | Provenance |
|---|---|---|
| VG-1 | Sixteen tables exist from the BIM-001 chain; `accounts` is the owner spine; `businesses.account_id NOT NULL`. | Map v1.1 patch header; BIM-001 certified `9f8c80d`. |
| VG-2 | Membership = `user_businesses` junction only, `role TEXT CHECK ('admin','member')`. No superadmin in OwedBook. Platform oversight = service role, server-side only. | Gap-6, ratified 08-28. |
| VG-3 | Tenant SELECT predicate of record: `business_id in (select public.my_business_ids())` (Formulation C: SECURITY DEFINER, set-returning, no-arg). Role-gated writes use the Formulation A helper. `is_account_member` guards `accounts`. | BIM-002 R-B, certified `dfc8a6a`. |
| VG-4 | Every helper: SECURITY DEFINER, search-path pinned, `REVOKE ... FROM public` AND `FROM anon`. | BIM-002 E-1..E-6. |
| VG-5 | Policies live inline in migrations, one file per table, junction-first; 18 policies, 4 helpers on the certified chain. | BIM-002 R-D. |
| VG-6 | From-scratch law: privilege and policy claims count only after a from-scratch apply of the full chain on a clean throwaway. | BIM-002 errata (AC8-class). |
| VG-7 | Harness at `scripts/rls-harness/`, `npm run rls:prove`, re-points by env prefix (`RLS_HARNESS_PREFIX=`). | BIM-002 R-D. |
| VG-8 | Dev backend is at the 2-table baseline and stays there. This module certifies on a throwaway project only. LIVE APPLY is a named later session. | Map v1.1 patch header. |
| VG-9 | Board baseline: 22 routes, tsc clean, 28 suites / 128 tests / 0 failures; types diff vs `9f8c80d` empty. | BIM-002 close. |
| VG-10 | Storage is untouched (Proto 01's). | BIM-002 R-E. |

## 5. Closed rulings (Director-ratified 2026-09-07 — build to these; flag disagreement, never deviate)

| # | Ruling |
|---|---|
| R-1 | `audit_logs` access: junction-role **admin** may SELECT rows for businesses they belong to; **member** denied; **no tenant INSERT/UPDATE/DELETE policy**; writes land only via service role or the SECURITY DEFINER logging functions; **UPDATE/DELETE denied to every role, no exceptions** (see R-6). Supersedes BIM-001 R-4 "internal-only" for the DB layer; the tenant-facing *viewer* remains out of scope. |
| R-2 | Write audit: **one trigger function, one template, stamped on all sixteen tenant-scoped tables**, AFTER INSERT/UPDATE/DELETE FOR EACH ROW. Reviewed by diff against the template, exactly as BIM-002 policies were. |
| R-3 | Retention: insert-only; rows kept indefinitely in v1; six-year minimum documented in `BIM003_BRIEF.md` §6; mechanism owed to Phase 8; `occurred_at` indexed now. **No partitioning, no rotation job.** |
| R-4 | Read wrappers: **one SECURITY DEFINER function per OwedBook read query**, enumerated from `BACKEND_SWAP_NOTES`, count fixed at Plan Mode; named `owedbook_<noun>`; explicit `p_business_id`; membership checked via `my_business_ids()` before any read (raise on miss); log-then-return; search path pinned; **no generic table reader**. |
| R-5 | MissionControl consumption is **out of scope**. The row shape (Brief §3) carries what a future reader needs; nothing else is built for it. |
| R-6 (Architect, engineering) | Immutability is enforced **below RLS**: a BEFORE UPDATE OR DELETE trigger on `audit_logs` that RAISEs unconditionally, so even the service role (which bypasses RLS) cannot alter or remove a row. Only a migration can drop that trigger. |
| R-7 (Architect, engineering) | Read-audit granularity = **per page-read, one row per wrapper call** (pre-loaded from BIM-001 R-4; do not reopen). |
| R-8 (Architect, engineering) | Tables without a `business_id` column (see TV-2) record `business_id NULL` and carry their identifying key in `context` JSON. No schema change to those tables. |

## 6. TO VERIFY FIRST (your plan opens with these, each with file:line evidence)

| # | Verify | Why it matters |
|---|---|---|
| TV-1 | Enumerate the sixteen tables on disk from the chain; confirm the count is 16. If it is not, red flag — the number in the spec was fixed at write time and becomes an erratum, not a rewrite. | R-2 stamp list; AC counts. |
| TV-2 | Which of those tables lack a `business_id` column (expected: at least `accounts`; possibly the junction carries it). List them. | R-8 applies to them. |
| TV-3 | Exact name and signature of the BIM-002 **role-gated** helper used in write policies (Formulation A). | R-1 admin SELECT policy reuses it; do not author a new helper if one fits. |
| TV-4 | Exact set-returning helper signature (`public.my_business_ids()`) and its grants. | R-4 membership check. |
| TV-5 | Next migration number after `0027` and the filename convention on disk. | You continue the chain; no renumbering. |
| TV-6 | Path of `BACKEND_SWAP_NOTES`; the list of distinct read queries `services/owedbook.ts` makes (tabs, KPIs, filters, pager). **State the count.** | R-4 wrapper list and AC-2.x counts. |
| TV-7 | How `scripts/rls-harness/` authenticates and re-points (env names, runner entry). | Stage 3 extends the same pattern. |
| TV-8 | How the existing chain runners apply from scratch (the `db:apply`-class scripts), so your migrations join the ritual. | VG-6. |
| TV-9 | Whether `BIM003_ACCEPTANCE_SPEC.md` ACs you cannot meet literally exist (I-class items). List them in the plan — the Architect writes them into the erratum lane **before build** (J-21). | QA grades literally. |

## 7. Scope

**IN:** `audit_logs` table + immutability guard + RLS (R-1) · `audit_write()` trigger function + stamping on sixteen tables · `owedbook_*` wrappers (count per TV-6) · `scripts/rls-harness/` extension proving the trail (`npm run audit:prove`) · migrations continuing the chain · regenerated types (Director-run per credential boundary) · README/RUN_NOTES touches strictly for the new commands · `BIM003_ACCEPTANCE_SPEC.md` evidence fill · retrospective.

**OUT (say it loud):** any UI · any change to `services/owedbook.ts` behaviour (BIM-005 swaps it) · MissionControl · retention/rotation/partitioning · Storage · seed data (BIM-004) · touching BIM-001/002 migrations (append only; never edit `0001`–`0027`) · the dev backend (throwaway only) · CI wiring.

## 8. Forbidden zones (path-level hard stops)

- `supabase/migrations/0001*` … `0027*` — read-only.
- `services/**`, `app/**`, `components/**`, `mocks/**` — read-only (Stage 3 may read `services/owedbook.ts` for wrapper parity; never edit).
- `agent_docs/AUTHORITY/**` — read-only; contract touches are staged to the Director as proposals in your report.
- This module's contract layer (`CLAUDE.md`, `BIM003_BRIEF.md`, `BIM003_ACCEPTANCE_SPEC.md` AC text, `BIM003_CLAUDY_PROMPTS.md`) — frozen. You fill the spec's **evidence** column and append to `evidence/`; you never change AC wording.
- `.env*` — never printed, never committed, never widened beyond throwaway scope.

## 9. Plan Mode — what your ONE plan message contains

1. TV-1..TV-9 answered, each with file:line.
2. The sixteen-table stamp list (TV-1) split into "has business_id" / "R-8 applies".
3. The wrapper list (TV-6) with proposed `owedbook_<noun>` names and signatures.
4. Proposed migration filenames (continuing TV-5), one file per concern: `audit_logs` table+indexes+guard → `audit_write()` function → one stamping file per table (sixteen) → wrappers (one file per wrapper or one file total — state your choice and why).
5. Red flags: anything in this pack you cannot meet literally, with the alternative you propose.
6. Stage plan: Stage 1 (table, guard, RLS, trigger template + stamp) → Stage 2 (wrappers) → Stage 3 (harness + from-scratch proof + evidence). Each stage ends green, reported, and committed before the next prompt.
7. STOP. Wait for "approved" or corrections.

## 10. Hard gates (measurable; method in brackets)

| Gate | Statement | Method |
|---|---|---|
| G-1 | Full chain `0001`–`00NN` applies from scratch on a clean throwaway with zero errors. | from-scratch runner log (VG-6) |
| G-2 | Sixteen tables carry the `audit_write` trigger; `pg_trigger` query count = 16. | SQL, Director-as-hands paste or harness |
| G-3 | UPDATE and DELETE on `audit_logs` are rejected for `authenticated`, `anon`, AND `service_role`. | harness, three negative probes |
| G-4 | Admin-A reads only A's audit rows; member-A reads zero; admin-B reads only B's. | harness, positive + negative |
| G-5 | Every wrapper call inserts exactly one `audit_logs` row with `action='read_page'`, actor, business, and context, then returns data; a non-member call inserts zero rows and raises. | harness |
| G-6 | A scripted two-tenant session produces the **exact** expected trail (row-for-row match against a golden expectation file). | `npm run audit:prove` |
| G-7 | Board unchanged: 22 routes, tsc clean, 28/128/0; types diff vs pre-module SHA shows only additive RPC signatures. | triad + `git diff` (read-only) |
| G-8 | No mutating git, no cloud command, no credential wider than throwaway in the session transcript. | Director attestation |

## 11. Definition of done (engineering side)

All gates G-1..G-8 green · `BIM003_ACCEPTANCE_SPEC.md` evidence column filled for every AC with a pointer into `evidence/` · retrospective written · `RECOVERY.md` + session log current · GIT REMINDER issued · **STOP.** The Director commits, opens `qa/phase-3-bim003`, and QA enters. You do not self-certify.

## 12. QA lifecycle you are entering (so you are not surprised)

`main` → `phase-3-bim003` (you) → Director opens `qa/phase-3-bim003` → Cody executes, SOL adjudicates → repairs, if any, happen **on the QA branch** by you, files named in the ruling package only, Director commits, Cody re-pins → SOL Gate Q → QA Cleanup → Architect closeout instruction → you perform repository closeout → Director merges the QA branch to `main`. Checkpoint commits on the module branch before QA are encouraged (crash safety).

## 13. Carried flags from BIM-002 (awareness only; none are yours)

CF-1 `accounts.owner_user_id` blocks auth-user deletion → BIM-004/Phase 4 · APPLY SESSION must re-verify E-4's default-ACL premise · CF-8 harness-improvement candidates → BIM-005 · `report_files` fidelity → BIM-004/005.

---

🥄 *One trail, sixteen stamps, zero rewrites. — JARVIS*
