# PHASE 3 — BIM CAMPAIGN MAP (v1.1)
## The Packet Spine: Module Decomposition, Gates, and Acceptance Seeds

**Version:** 1.1 — 2026-08-31 (v1.0 body of 2026-08-11 preserved below, unchanged; patch header added at DOCTRINE SYNC)
**Home:** `agent_docs/AUTHORITY/` (campaign-level authority folder, promoted 2026-08-31)

---

## PATCH HEADER (v1.1) — rulings since 2026-08-11 that supersede the body

Where the body conflicts with an item here, this header wins. Everything else in the body stands.

**Role names.** "Coordinator" → **Director** (renamed 2026-08-27). QA seat now includes **Cody** (execution agent, adopted by QA 08-31); Sol adjudicates; Director is hands for anything credentialed.

**Campaign status at v1.1.** BIM-000 CLOSED · FIX-001 CLOSED · BIM-001 CLOSED (certified `9f8c80d`, 16 tables) · Proto 06 CLOSED (TRANSFERS consumed 08-31) · **BIM-002 NEXT** · BIM-003/004/005 queued.

**Schema (BIM-001 actuals, supersede body §3).** **Sixteen** tables, not fifteen: `accounts` added as the owner spine (R-2, 08-28) — `businesses.account_id NOT NULL`, subscriptions attach to the account, not the store. `medicaid_method` NULLable + 7-value CHECK; `''`→NULL in BIM-004. `update_updated_at()` created idempotently by the chain (X0 discrepancy, ERRATUM E-2 — see `ACTIONS/BIM-001-CYBER-PHARMA/ERRATUM.md`). `report_files` shipped minimal attested shape with a fidelity flag → BIM-004/005 touchpoint.

**Gap-6 RATIFIED (08-28) — supersedes body §3 open ruling AND body §4's superadmin clause.** RLS membership reads the `user_businesses` junction ONLY. `user_roles` is platform/MissionControl-only and is never consulted by an OwedBook policy. Junction `role TEXT CHECK ('admin','member')`. **No superadmin policy in OwedBook** — the body's BIM-002 line "superadmin oversight as explicit audited policy clause" is DEAD; platform oversight is the service role, server-side only, audited (BIM-003's trail is the fence). Body §6's seed cast drops the "superadmin" identity.

**Proto 06 transfers landed (08-31) — bind BIM-002.** Read `ACTIONS/PROTO06/TRANSFERS.md` in full before authoring. Non-negotiables it adds to body §4: (a) **SELECT policy before any write policy on every tenant table** (F-1 silent no-op); (b) landing order helpers → SELECTs → writes is law (F-8); (c) helper is SECURITY DEFINER, search-path-pinned, anon-revoked (F-5); (d) one permissive policy per operation per table, enforced mechanically after each landing; (e) harness re-points by config; (f) deny semantics differ by operation — mutation attacks need ground-truth verification (F-4). **Owed to BIM-002 pre-flight rulings:** the `accounts` access pattern (N-6, no policy exists yet — must be junction-derived); the `IN (subquery)` vs helper A/B at realistic volume (T-7). **Owed to BIM-002 or CRV:** live-session junction revocation (N-3).

**Storage policies (body §4) — DEFERRED.** Proto 06's Storage leg was deferred to Proto 01 (Director, 08-31). BIM-002 keeps the buckets at deny-all (as born in BIM-001); real Storage policies land when Proto 01 transfers exist. BIM-002's exit gate does NOT include Storage isolation.

**BIM-002 exit gate wording (body §4) — amended.** "REAL authenticated clients (browser + server + API route)" → the harness authenticates through supabase-js publishable-key sessions (server/API-equivalent); the **browser/SSR leg is owed to BIM-005's eyes-on CRV**, not BIM-002. The "100k-row EXPLAIN" seed is a target, not a gate — EXPLAIN evidence is required, index-backed predicates on filtered queries are required, unqualified-read latency is recorded and routed to the app-query rule (every tenant read carries its own `business_id` filter).

**Gate Q lifecycle (body §0, §8) — amended by doctrine invented in-campaign.** Walk-first order is law: PRE-Q on the working tree → **One-Walk** (QA Lead directs, Director executes once, evidence serves both PRE-Q and certification) → per-concern commits → SHA pin → certification against the SHA. Execution agent is released only on the QA Lead's evidence-complete signal. Module-scoped `QA/` folder homes. Journal is two-seat append-only (Architect + Sol), repo copy canonical.

**LIVE APPLY DEFERRED (Director, 08-31) — new campaign step.** The dev backend stays at its 2-table baseline through the build modules. Each module certifies on the clean throwaway. **A named "Phase 3 APPLY SESSION" sits between BIM-004 close and BIM-005 authoring:** Director applies all chains (BIM-001 → 002 → 003 → 004 seed) to the dev backend in order with `db:apply` semantics (never reset), catalog check after each, harness run after 002. BIM-005 (CRV) then reads the dev backend. Rationale: focus — no mid-stream live touches during the throwaway/red-team lane.

**Launch-line prerequisite (REQUIRED, from four consecutive staging misses).** Before any runner's first message: authority docs on disk at `agent_docs/AUTHORITY/`, module package on disk, credentials in `.env.local` (throwaway scope only), pooler host recorded in the module manager. Mechanically checked by the Director, not remembered.

**Scoreboard.** P1 CONFIRMED · P2 CONFIRMED · P3 SUPPORTED (final grade at BIM-002 Gate Q) · P4 CONFIRMED · P5 CONFIRMED (four hits).

---

# PHASE 3 — BIM CAMPAIGN MAP (v1.0 BODY — preserved verbatim)
## The Packet Spine: Module Decomposition, Gates, and Acceptance Seeds

**Project:** Cyber Pharma v1 · **Phase:** 3 — Real Schema, RLS, Audit Logging (ACTIVE)
**Version:** 1.0 — 2026-08-11 · **Author:** JARVIS (Architect) · **Gate:** Tony (Coordinator) approval required before packet authoring
**Doctrine:** BIM_PLAYBOOK v1.0 · QA per QA_PLAYBOOK + AC-sync patch · Sol engaged at every Gate Q
**Repo:** `cyber-pharma-dev-v1-phase-3` @ `6f6e63d` · **DB baseline (verified live 2026-08-11):** `user_roles` + `profiles`, 3 policies (setup.sql base + profiles-migration overlay), `handle_new_user` trigger
**Exit gate of the phase:** Controlled Read Validation (v2.0 §5)

---

## 0. Campaign Shape

Seven modules, strictly ordered, one active at a time. Each runs the stage-gate lifecycle (author → build → Gate Q → Coordinator merge), hands off an `ACCEPTANCE_SPEC.md` with numbered ACs seeded below, freezes its folder at handoff, and ends with a retrospective feeding the next module's authoring. Claudy is git-zero/cloud-zero throughout; Tony is sole committer; Sol owns verdicts.

```
BIM-000 STAGE PREP ─► FIX-001 KIP-2 ─► BIM-001 SCHEMA ─► BIM-002 RLS ─► BIM-003 AUDIT ─► BIM-004 SEED ─► BIM-005 CRV
                                            ▲
                              (Proto 06 rig transfers land here)
```

**Parallel rig lane:** Proto 06 (RLS Harness) runs on the sandbox during BIM-000/FIX-001/BIM-001 and MUST deliver its transfers (policy template, helper SQL, index findings, revocation ruling, isolation suite) before BIM-002 authoring finalizes.

---

## 1. BIM-000-CYBER-PHARMA — Stage Prep & Hygiene

**Mission:** a clean, documented stage so no later module trips on residue. All items are recon-verified facts, not speculation.

**Scope:** remove `sass` dep (no .scss on disk) · remove `stripe` dep + purge 6 `STRIPE_*` keys from `.env.local` (Payment Portal is a separate app; Coordinator rotates the keys on principle) · delete `temp/ghl-example.json` fossil · remove unused `NEXT_PUBLIC_API_BASE_URL` from both env files · add `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL` to `.env.example` · add `_SKILLS/**` to tsconfig exclude · recover `phase2.md` from sibling repo into `agent_docs/` (Coordinator action — carry-forward flags) · correct stale test counts in README + TESTING.md to fresh baseline (26 suites / 120 tests) · document the live-DB baseline (the 3-policy inventory) in `agent_docs/DB_BASELINE.md`.

**Exit gate:** build + tsc + jest green at the same fresh baseline; grep predicates unchanged (2 known `any` sites, 0 `user_metadata` role smells, 5 numbered-color sites untouched — reconciliation is NOT this module's scope).
**AC seeds:** AC1 `npm ls` shows no sass/stripe · AC2 `.env.example` ↔ code consumption parity (moose flag present, no dead vars) · AC3 `phase2.md` present in `agent_docs/` OR documented-unrecoverable with Coordinator sign-off · AC4 DB_BASELINE.md matches live `pg_policies` output verbatim · AC5 full triad green.
**Dependencies:** none. **Est. weight:** light (one session).

---

## 2. FIX-001-CYBER-PHARMA — KIP-2: Stale-Persist Role on Public Nav

**Mission:** close the live landing-page defect window. Identity on `MobileNav`/`UserMenu` becomes server-resolved, per the Navbar Law (identity is server-resolved and passed as props, never gated on client-persisted state).

**Scope:** `(public)/layout.tsx` (server component) resolves user + role via kit primitives (`getUser` + `getUserRole`) and passes props down through `NavbarHome` → `MobileNav`/`UserMenu`; the two components drop their `useAuthStore` role reads; `useAuthStore` persist survives for login-flow state only (KIP-2 registry updated: root cause fenced, not globally re-architected — Phase 7 owns any deeper store rework). Registry's stale-persist auth-walk is the verification script.

**Exit gate:** the KIP registry auth-walk passes: cookie-authenticated user with cleared localStorage sees correct role UI on `/` in both themes at 375px and desktop (Gate M applies — public nav is a visual surface).
**AC seeds:** AC1 grep: zero `useAuthStore` role reads in `MobileNav`/`UserMenu` · AC2 auth-walk: cleared-localStorage + valid-cookie renders correct nav state · AC3 logged-out visitor unchanged · AC4 no regression in the 3 navbar mount points · AC5 triad green; KIP_REGISTRY.md updated to CLOSED with evidence.
**Dependencies:** BIM-000 merged. **Est. weight:** light-medium.

---

## 3. BIM-001-CYBER-PHARMA — Schema Migrations

**Mission:** migration-as-code becomes law. The fifteen v1 tables + future-phase tables born as version-controlled Supabase migrations building forward from the documented baseline — never dashboard SQL.

**Scope:** `supabase/migrations/` chain: 0001 acknowledges baseline (no-op guard asserting `user_roles`/`profiles`/policies exist as documented) · three-noun spine (`businesses`, `user_businesses` junction with `role` text + CHECK (not enum — v2 permission seam) + `is_primary`; NO `auth.users` shadow) · `user_data` claims table per DATA_CONTRACT (incl. **reference-provenance columns**, `medicaid_method` constrained vocabulary, pcn/group fields the demo lacked, NUMERIC money everywhere) · reference tables (`aac_reference`, `wac_reference`, `ful_reference`, `pbm_info` FRANK_API full shape with `matching_type NOT NULL`) as append-only/effective-dated shapes · `system_config` (fee + multiplier rows per-state-keyed, Frank Q-01 value slot) · future-phase tables (`reference_dataset_versions`, `apa_licenses`/`apa_memberships` + single-use constraint, `send_log`, `pending_registrations`) · Storage buckets (`pharma_reports`, `reference-data`) created with deny-all policies (real policies in BIM-002) · `created_at`/`updated_at` everywhere · **RLS ENABLED in the same statement block as every CREATE TABLE (deny-by-default from birth)** — policies come next module; tables are black holes until then · one-command reset-and-reseed script skeleton · legacy `pharmacy_profile` pattern explicitly absent (fields live on `businesses`).

**Exit gate:** fresh-project replay test — migrations run clean on an empty shadow project start to finish; schema diff vs DATA_CONTRACT is empty.
**AC seeds:** AC1 replay green on shadow project · AC2 every table shows `rowsecurity = true` in `pg_tables` at creation commit · AC3 zero float/real money columns (catalog query) · AC4 `medicaid_method` CHECK rejects an out-of-vocabulary insert · AC5 junction role CHECK rejects unknown role · AC6 provenance columns present on `user_data` · AC7 authenticated non-policy user sees zero rows everywhere (deny-by-default proven).
**Open ruling folded in:** Gap-6 role precedence — the DATA_CONTRACT states it (recommendation: `user_roles` gates app-wide surfaces incl. superadmin; junction `role` gates per-store capability; **RLS membership reads the junction only**) — Coordinator ratifies at module authoring.
**Dependencies:** FIX-001 merged. **Est. weight:** heavy (the phase's biggest module).

---

## 4. BIM-002-CYBER-PHARMA — RLS Policy Campaign

**Mission:** isolation becomes database law. One blessed template stamped across every tenant-scoped table; review = diffing against the template, never reasoning about bespoke policies.

**Scope:** `is_member_of(business_id)` security-definer helper (search-path-pinned, correctly owned — Proto 06's verbatim SQL) · one policy per operation per table, INSERT via WITH CHECK, no multiple-permissive stacking · mutation policies enforce server-derived `business_id` (spoof-INSERT rejected at DB) · superadmin oversight as explicit audited policy clause, never admin-client · reference tables admin-write-only (Q5 fix) · Storage bucket policies (tenant-pathed, per Proto 01/06 findings) · the junction/business indexes Proto 06's volume probe demands · Proto 06's scripted isolation suite lands in-repo as a permanent CI gate (runs on every future migration).

**Exit gate:** the full access matrix green through REAL authenticated clients (browser + server + API route — never the SQL editor), on a seeded two-tenant fixture; EXPLAIN shows index-backed policy predicates at volume.
**AC seeds:** AC1 owner-A/staff-A see only A; owner-B only B; multi-store user sees both and only both · AC2 junction-removal revocation behaves per the Proto 06 documented ruling · AC3 all three spoof drills rejected at DB layer · AC4 admin-client fenced: grep zero `createAdminClient` outside seed/system paths · AC5 isolation suite is one command, green on fresh reset, wired to CI · AC6 100k-row EXPLAIN uses indexes; timings recorded.
**Dependencies:** BIM-001 merged + **Proto 06 transfers delivered (hard gate on authoring).** **Est. weight:** heavy.

---

## 5. BIM-003-CYBER-PHARMA — Audit Machinery

**Mission:** every PHI touch leaves a trace. Write-auditing via triggers; read-auditing via security-definer RPC wrappers (the technically-possible design, per v2.0's correction).

**Scope:** `audit_logs` table (insert-only: no UPDATE/DELETE policy for anyone; own RLS; six-year retention posture documented for Phase 8) · write triggers on PHI tables · `get_claims_page(...)`-style log-then-return RPC wrappers for the OwedBook PHI read paths (the handful CRV needs — not every table read in the app) · wrappers are the seam BIM-005's service swap calls · reference-write audits ride the same machinery (feeds the ruled MissionControl corrections inbox later).

**Exit gate:** a scripted session produces the exact expected audit trail — reads and writes — attributable to actor + business + object; tampering attempts (UPDATE/DELETE on audit_logs) rejected.
**AC seeds:** AC1 every CRV read path emits exactly one audit row per page-read with actor/business/object · AC2 write trigger fires on user_data INSERT/UPDATE/DELETE · AC3 audit_logs UPDATE/DELETE rejected for every role incl. superadmin · AC4 audit rows tenant-scoped by RLS (A's admin can never read B's audit) · AC5 wrapper functions search-path-pinned, owner-correct.
**Open rulings folded in (packet decides, Coordinator ratifies):** read-audit granularity = per-page-read (not per-row) recommendation · tenant visibility of audit logs in v1 = internal-only, viewer deferred (recommendation).
**Dependencies:** BIM-002 merged. **Est. weight:** medium.

---

## 6. BIM-004-CYBER-PHARMA — Seed Factory

**Mission:** two believable pharmacies from real-shaped ore. The legacy demo's 7,427 claims become scrubbed, curated seed for Pharmacy A and Pharmacy B per the Format Map's conventions.

**Scope:** seed script (migration-adjacent, part of the one-command reset ritual; admin-client use HERE is sanctioned — the fence's explicit exception) · source = legacy demo export → scrub pass (verify de-identification; strip/regenerate anything identity-shaped) → map to new schema (add pcn/group/status-enum/provenance defaults per Format Map §4) → split across A/B tenants · seed users: owner-A, staff-A, owner-B, multi-store user, superadmin (mirroring Proto 06's cast; moose-portal provisions them) · dataset curated to exercise every status chip, both money signs, multiple PBMs, AAC-hit and AAC-miss rows · same fixture source of truth as Phase 2's mocks (no drift between mock world and seed world).

**Exit gate:** one-command reset-and-reseed lands a fully populated two-tenant database that renders correctly through the BIM-003 wrappers in a raw SQL smoke check.
**AC seeds:** AC1 reseed idempotent (run twice = identical state) · AC2 zero patient-identity values in any seeded column (scripted scan) · AC3 row distribution: both tenants ≥ N claims spanning all statuses and both signs · AC4 seed reads correctly via the audit wrappers (not raw table SELECTs) · AC5 fixture-source provenance documented.
**Dependencies:** BIM-003 merged. **Est. weight:** medium.

---

## 7. BIM-005-CYBER-PHARMA — Controlled Read Validation (THE PHASE GATE)

**Mission:** the operator's ruling made real. OwedBook — first and only surface — reads real Supabase rows: read-only, seed only, no writes, nothing else switches. The seam (schema ↔ RLS ↔ audit ↔ seed ↔ service ↔ UI contract) validated while blast radius is one screen.

**Scope:** `services/owedbook.ts` internals swap from mocks to the BIM-003 RPC wrappers per its own BACKEND_SWAP_NOTES — **component layer untouched** (the Phase 2 service-seam bet, cashed) · all four tabs + KPIs + filters + pager against seed · `adminDemo` service stays mock (assert unchanged) · moose-portal survives (assert intact) · Sol's QA engagement runs the full ACCEPTANCE_SPEC · the phase retrospective + doctrine trickle-up closes the campaign.

**Exit gate — the CRV, eyes-on, human-speed (Gate M applies):** Tony logs in as owner-A → sees only A's claims across every tab/KPI/filter at desktop AND 375px, both themes → logs in as owner-B → only B's → multi-store user → both → every read verified in `audit_logs` → spoof attempts still rejected → isolation suite green in CI.
**AC seeds:** AC1 zero imports from `mocks/owedbook*` in the service (grep) · AC2 component diff vs pre-swap = empty (types unchanged, screens untouched) · AC3 the eyes-on walk passes for all three test identities · AC4 audit_logs shows the walk's reads, correctly attributed · AC5 adminDemo + moose-portal byte-identical (grep/diff) · AC6 triad + isolation suite green · AC7 retrospective written; KIP/ledger updates filed.
**Dependencies:** BIM-004 merged. **Est. weight:** medium — the risk was retired upstream; this module is the harvest.

---

## 8. Campaign-Level Rules

- **One module active at a time.** Commit + push between modules, every time (the 8-day-gap lesson is law).
- **Restart-before-wobble:** heavy modules (BIM-001, BIM-002) get fresh Engineer sessions at authoring, resuming from committed state.
- **Flag-don't-deviate:** any disk-vs-packet conflict surfaces to the Coordinator; the losing document is corrected same-day.
- **Sol's five-word vocabulary is the only verdict channel.** No module merges on Engineer self-assessment.
- **Scope firewall:** upload pipelines, Liberty, math, billing, permissions-v2 asks route to the Deferred Ledger on sight. Phase 3 builds the vault, not the loading dock.

## 9. Pre-Flight Checklist (Coordinator, before BIM-000 authoring)

1. ☐ Commit v2.0 plan (patched) + this map to the doc repo; retire v1.2 same-day.
2. ☐ Apply the two Factory patch kits to the live playbooks (standing item).
3. ☐ Rotate the orphaned STRIPE_* keys (BIM-000 will purge them from env).
4. ☐ Locate `phase2.md` in the sibling repo (BIM-000 recovers it).
5. ☐ Green-light Proto 06 on the rig (Claudy mission; runs parallel to BIM-000/FIX-001/BIM-001).

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-08-11 | Initial campaign map. Seven modules, Proto 06 parallel lane, AC seeds per module, open rulings assigned to their deciding modules. |
| 1.1 | 2026-08-31 | Patch header: Director rename, 16 tables, Gap-6 (superadmin clause dead), Proto 06 transfers bind BIM-002, Storage deferred, exit-gate amendments, walk-first Gate Q lifecycle, Phase 3 APPLY SESSION between BIM-004 and BIM-005, launch-line prerequisite, scoreboard. Body preserved. |

---

🥄 *Stark Industries — seven modules, one vault, zero guesswork.*
