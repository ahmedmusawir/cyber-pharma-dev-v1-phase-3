# PROTO 06 — RIG LAUNCH BRIEF
## RLS Harness: Prove the Policy Patterns Before BIM-002 Bets On Them

> **Status:** FINAL — 2026-08-28 · **Lane:** rig (sandbox), URGENT-parallel to BIM-001
> **Companion:** PROTO_PLAN_06 (project stack) — stage it into the rig repo alongside this brief; where the two disagree, the PLAN's technical detail wins and the conflict is flagged to the Architect
> **Consumer:** BIM-002-CYBER-PHARMA (HARD-GATED on this proto's transfers)
> **Runner:** a dedicated Claudy session in the rig repo — NOT the mothership BIM-001 session; two lanes, two terminals
> **Prediction under test:** P3 — "the Proto 06 transfer gate will hold BIM-002 by some days and be worth it (zero policy rework downstream)"

---

## ADDENDUM A — DIRECTOR RULING 2026-08-31 (supersedes the Runner line above, §9 "any mothership repo file", and §10)

- The rig runs INSIDE the mothership repo on disposable branch `phase-3-proto-6` (cut from `53f4b63`). The branch is never merged and is deleted after transfers are copied out.
- Rig code, migrations, seeds, and harness scripts live under `proto-06/` at repo root ONLY. `src/`, `supabase/`, and `agent_docs/` outside `agent_docs/PROTO/06/` are untouchable from this lane.
- Database: a throwaway Supabase project (was BIM-001's replay throwaway; contains leftover schema). R1 step one wipes `public` to empty, including functions, triggers, and policies, and proves it via `pg_catalog` before any rig object is created.
- Credentials: `.env.local` holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `PROTO06_DB_URL` (session pooler string, throwaway project only). The harness reads them; nothing prints them.
- Transfers are COPIED by the Director into `agent_docs/PROTO/06/` on the mainline branch. Never merged.
- Serial, no QA seat. Gate currency remains TRANSFERS.md, consumed by the Architect.
- Precedence: Director rulings post-dating the PLAN (Gap-6, R-2 accounts spine, this addendum) override the PLAN where they conflict. On everything else, the PLAN's technical detail wins per the companion line above.

---

## 1. MISSION (one sentence)

On a disposable Supabase project, build the Cyber Pharma tenant-isolation RLS patterns in miniature and attack them with a repeatable test harness until they provably hold, producing transfer artifacts BIM-002 applies verbatim.

## 2. WHY A PROTO, NOT RECON

Nothing here is fact-finding. The risk register is explicit: RLS policies leaking cross-tenant data is Phase 3's top risk, and Sol's QA loop has never gated database-shaped deliverables (journal Entry 0, risk 5). We do not learn RLS on tables that will hold PHI. The rig bleeds first.

## 3. BINDING DOCTRINE (inherited — do not re-derive)

- **Gap-6 (Director-ratified 2026-08-28):** RLS membership reads the `user_businesses` junction ONLY. No policy consults `user_roles`. Junction role: TEXT CHECK IN ('admin','member').
- **SUPERSEDED PATTERN — do not port:** TRIANGULATION_DOC §5.4's sample `super_admins_see_all` policy (reads `user_roles.is_super_admin` inside RLS) is DEAD under Gap-6 + the Director's no-superadmin-in-OwedBook ruling. Platform/MissionControl access is a service-role concern, never an RLS policy concern. If the harness "needs" a superadmin policy to pass a scenario, the scenario is wrong — flag it.
- **FORBIDDEN:** any policy reading `raw_user_meta_data` (recon Q3.4 smell / F-041).
- **Deny-by-default:** the rig mirrors BIM-001's law — tables born with RLS enabled, zero policies, then policies added ONE at a time with the harness red-green around each.
- **Accounts spine (R-2):** the rig miniature includes `accounts` above `businesses`; owner access flows through junction rows, not through account ownership shortcuts in policies (v1 law — if that proves painful, that pain is a FINDING, not a license to deviate).

## 4. THE RIG MINIATURE (build this, only this)

Five tables, minimal columns: `accounts`, `businesses` (account_id), `user_businesses` (user_id, business_id, role CHECK, is_primary), `fact_data` (stand-in for user_data: business_id + two dummy columns), `ref_data` (stand-in for reference tables: no business_id — platform-shared). Three test identities minimum: Owner-of-two-stores, Admin-of-one, Member-of-one. Two accounts so cross-ACCOUNT isolation is testable, not just cross-store.

## 5. POLICY PATTERNS TO PROVE (the transfer candidates)

- **T-1 Tenant SELECT:** authenticated reads on `fact_data` scoped by junction membership.
- **T-2 Tenant INSERT/UPDATE/DELETE:** WITH CHECK derived from junction; business_id never trusted from the client.
- **T-3 Role-gated write:** admin-only mutation on a tenant table (junction role = 'admin').
- **T-4 Reference-table read:** platform-shared read for authenticated, write locked to service role.
- **T-5 Junction self-visibility:** users read their own membership rows only.
- **T-6 Service-role bypass:** confirmed + documented as the MissionControl/admin path.
- **T-7 Performance shape:** the junction subquery pattern at modest scale (a few thousand fact rows) — EXPLAIN evidence that policies don't table-scan into oblivion. (Informational transfer; no perf gate.)

## 6. THE HARNESS (the second transfer, as valuable as the policies)

A scripted, repeatable attack suite runnable with one command against any Supabase project: per-identity JWT contexts; for each table × identity × operation, assert ALLOWED or DENIED per a declared expectation matrix; deliberate attack cases (client-supplied foreign business_id, tampered role value, cross-account probes, anon access to everything); unique evidence filenames; repo-root fail-closed runner (BIM-000 lessons apply on the rig too). The harness must be transferable: BIM-002 and BIM-005 (CRV) point it at the mothership with a swapped config, not a rewrite.

## 7. GATES (rig-grade — lightweight, honest)

- **R1:** miniature schema up, RLS enabled, zero policies → harness proves TOTAL deny for all identities.
- **R2:** T-1..T-6 each red-green: expectation matrix passes fully after each policy lands; no earlier case regresses.
- **R3:** attack cases all DENIED with evidence.
- **R4:** harness reruns clean from scratch (drop + rebuild + full suite) in one command.
- **R5:** TRANSFERS.md written (see §8) + rig retrospective (what fought back).

## 8. TRANSFER MANIFEST (what BIM-002 receives — the gate currency)

`TRANSFERS.md` containing: (1) final policy SQL per pattern T-1..T-6, annotated; (2) the harness (scripts + expectation matrix format + runner); (3) the findings ledger — every surprise, dead end, and Supabase behavior quirk; (4) EXPLAIN notes from T-7; (5) explicit statement of anything that could NOT be proven on the rig and must be re-verified on the mothership. BIM-002 authoring begins only when this file exists and the Architect has consumed it.

## 9. FORBIDDEN ZONES

Real schema column sets (miniature only) · any mothership repo file (SUPERSEDED — see Addendum A: mothership files outside `proto-06/` and `agent_docs/PROTO/06/`) · real keys or PHI-shaped data (synthetic rows only) · policies reading user_roles or user metadata · seed tooling beyond what the harness needs · git/cloud on the mothership (rig project is disposable; Director still runs any git the rig branch needs).

## 10. LAUNCH

(Superseded by Addendum A and the Director's launch order of 2026-08-31.) Separate Claudy session, Plan Mode first, ONE message, plan opens with rig-recon (what exists on the branch right now). Response Logging Protocol in force.

**Director launch line:** *"Claudy — Proto 06, rig lane. Read the brief and PROTO_PLAN_06. Plan Mode. R1 first."*

🥄 *The scout bleeds so the army doesn't.*
