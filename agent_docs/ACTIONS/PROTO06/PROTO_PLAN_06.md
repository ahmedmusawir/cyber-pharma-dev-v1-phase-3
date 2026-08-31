# PROTO PLAN 06 — RLS ISOLATION HARNESS (v1.1)

**Program:** Cyber Pharma Prototype Rig
**Feeds:** Phase 3 (Real Schema, RLS, Audit Logging) — DIRECTLY. Run this one first.
**Depends on:** Nothing.
**Version:** 1.1 — 2026-08-31 (v1.0 body 2026-07-13, unchanged; reconciliation header added)

---

## RECONCILIATION HEADER (v1.1) — read before the body

This plan was written 2026-07-13, before three Director rulings. The body below is preserved verbatim as the technical spec. Where the body conflicts with the items in this header, the header wins. Everything else in the body stands.

**1. Gap-6 (2026-08-28) — junction-only RLS, no superadmin in OwedBook.**
- Body §3 says roles live in a `user_roles` table or `app_metadata`. For OwedBook RLS this is superseded: policies read the `user_businesses` junction ONLY. `user_roles` is a platform/MissionControl concern and does NOT exist on the rig. Do not create it.
- Body §5 seeds "one super-admin role holder." DELETED. No superadmin identity, no superadmin policy. Cross-tenant platform access is the service-role path (brief T-6), never a policy.
- Body §7 last landmine ("super-admin visibility is a policy decision") is superseded by the brief's §3 superseded-pattern clause. Record the rule as: platform oversight uses service role with audit, never an RLS clause.
- Body §4 objective 3 (JWT claims strategy) is constrained: membership is looked up live from the junction; no business list is stamped into the token. The rig may still document the staleness tradeoff as a finding.

**2. R-2 accounts spine (2026-08-28) and BIM-001 naming.**
- Table set is the brief's §4 five-table miniature: `accounts`, `businesses` (account_id), `user_businesses` (user_id, business_id, role TEXT CHECK IN ('admin','member'), is_primary), `fact_data`, `ref_data`. Body's `user_business` (singular) and `claims_sample` are renamed accordingly; `ref_data` is added to prove the platform-shared read pattern (brief T-4).
- Seed identities per the brief: Owner-of-two-stores, Admin-of-one, Member-of-one, across TWO accounts, so cross-account isolation is tested, not just cross-store. Body's four-user seed maps onto this; the multi-store case (body step 3) is carried by the Owner-of-two-stores identity.

**3. Director branch ruling (2026-08-31) — rig inside the mothership repo.**
- All rig code lives under `proto-06/`. No files under `src/`. Consequence: body §5's "ugly eyeball page" and body step 5's browser-client leg are DEFERRED from this run. The harness authenticates as each seeded user through supabase-js sessions (publishable key + sign-in), which exercises the same authenticated-client path; server-client and API-route legs are represented by the harness runner. If the Director wants the eyeball page, it rides a later lane.
- Body §5's ~100k row seed and body step 7's index gate: seed volume is at Claudy's discretion (a few thousand minimum, up to the body's 100k if cheap). EXPLAIN evidence is a required transfer (brief T-7); it is INFORMATIONAL, not a pass/fail gate, per the brief.
- Body step 6 (Storage leg) STANDS as technical detail: one bucket, tenant-pathed objects, cross-tenant download denied. It runs after the table-layer gates R1–R3 and before R4.

**Gate mapping:** body steps 1 → R1 · steps 2–3 → R2 · step 4 → R3 · steps 5–6 → R3 supplement · step 7 → T-7 evidence · step 8 → R4 · step 9 → R5 (TRANSFERS.md is the LEARNINGS doc).

---

## 1. Mission

Prove, on a small schema slice, that our Row Level Security pattern makes cross-tenant data access **impossible** — not unlikely, not unimplemented-in-the-UI, impossible at the database layer — for tables and Storage alike, under every client we ship (browser, server, and the roles-in-JWT machinery that feeds the policies). The verified pattern becomes the law every Phase 3 table is written under.

## 2. Why This Needs a Prototype

Phase 3's own risk table names cross-tenant leakage as its top risk and declares the phase unshippable without isolation tests passing. Meanwhile the brain drain caught our own demo doing this wrong in a way that must never recur: **TONY_DEMO stored role flags in `user_metadata`, which is client-mutable** — a user could promote themselves. The triangulation ruling is roles in a server-controlled `user_roles` table or `app_metadata`, never `user_metadata`. Frank's Flask world, for its part, achieves isolation by remembering to put a `business_id` filter on every query — discipline-based security, one forgotten WHERE clause from a breach. RLS flips that: the database enforces it even when application code forgets. But an RLS policy is only as good as the JWT claims and helper functions feeding it, and THAT interplay — three-noun schema, junction-table membership, Supabase auth claims, three client types — is what has never been proven end to end in our stack. Fifteen PHI-bearing tables are about to be built on this pattern. Prove it on two tables first.

## 3. What We Already Know (Ground Truth)

- **The three-noun model is canonical:** `businesses`, `users`, `user_business` junction (Frank's proven structure). A user's tenancy is junction-derived — a user can belong to multiple stores (Frank's staff do).
- **Roles must be server-controlled:** `user_roles` table or `app_metadata`. `user_metadata` is banned (TONY_DEMO's confirmed flaw). *(See header item 1: for OwedBook RLS, junction only.)*
- **`business_id` never comes from the client.** It derives from auth context, always (roadmap doctrine, echoed in the import pipeline design).
- Three Supabase client types exist in the target architecture (browser / server / admin), and the admin client bypasses RLS by design — which is exactly why its use must be exceptional and audited.
- Supabase cookie adapter uses `getAll`/`setAll` (current doctrine); env naming per Q4-2025 scheme.

## 4. Learning Objectives

1. **The policy pattern itself:** One blessed template for junction-based tenancy — a helper (`is_member_of(business_id)` or equivalent security-definer function reading the junction) that every table policy calls. Verified for SELECT, INSERT, UPDATE, DELETE separately.
2. **Multi-store membership:** A user in two businesses sees both and only both. Removal from the junction revokes visibility immediately (or we learn the token-refresh caveat and write it down).
3. **JWT claims strategy:** What lives in the token (role, maybe a business list) vs. what's looked up live in the junction — and the staleness tradeoff of each. Ruling with rationale. *(Header item 1 constrains this.)*
4. **Client matrix:** The same denial guarantees hold through the browser client, the server client, and API routes. The admin client's bypass is demonstrated once, deliberately, to prove why it's fenced. *(Header item 3 defers the browser leg.)*
5. **Storage RLS:** The same tenancy logic gating a Storage bucket path scheme (feeds PROTO 01 directly).
6. **Write-path spoofing:** An INSERT that hand-supplies someone else's `business_id` is rejected by policy — the "never from the client" rule enforced by the database, not the service layer.
7. **Performance sanity:** Junction-lookup policies on a table seeded with ~100k rows — is the policy predicate index-friendly, or does isolation cost us the query planner?
8. **Repeatable proof:** A scripted test suite (SQL + a thin Jest/Playwright layer using real user sessions) that Phase 3 can inherit as its isolation gate.

## 5. Build Scope (Minimal)

- Tables: `businesses`, `user_business` junction, `user_roles`, and ONE representative PHI-shaped table (`claims_sample`) — that's the whole schema slice. *(Header item 2 replaces this table set.)*
- Seed: two businesses (Pharmacy A, Pharmacy B), four users — owner-A, staff-A, owner-B, and **multi-store-user** (member of both) — plus one super-admin role holder. *(Header items 1 and 2 replace this seed.)*
- ~100k synthetic rows in `claims_sample` split across the two tenants (performance objective needs volume).
- One Storage bucket with tenant-pathed objects.
- The test suite: every cell of the access matrix asserted as pass/deny.
- One ugly page that logs in as each seeded user and dumps what they can see — the human-eyeball complement to the scripted suite. *(Deferred — header item 3.)*

Out of scope: the full 15-table schema, audit logging design (Phase 3 proper), MissionControl surfaces, any UI beyond the eyeball page.

## 6. Step Sequence (Gated)

1. **Schema slice + seed.** Tables, junction, roles, seed users and rows. RLS ENABLED on every table from the first migration — never a window where a table exists unprotected. *Gate: with no policies written yet, authenticated users see zero rows (deny-by-default proven).*
2. **The helper + first policies.** Membership helper function; four policies (S/I/U/D) on the fact table calling it. *Gate: owner-A sees only A rows; staff-A same; owner-B only B.*
3. **Multi-store case.** Multi-store-user sees A+B and nothing else; remove them from B's junction row; re-test. *Gate: visibility tracks the junction, revocation behavior documented (including any token/session caveat).*
4. **Spoof drills.** As staff-A: INSERT with `business_id = B`, UPDATE a B row by id, SELECT a B row by direct id. *Gate: all three rejected at the database.*
5. **Client matrix.** Repeat the core assertions through browser client, server client, and an API route. Demonstrate admin-client bypass once; write the fencing rule. *Gate: matrix table complete, all cells as expected.*
6. **Storage leg.** Bucket policies on tenant-pathed objects; cross-tenant download denied. *Gate: A cannot fetch B's object.*
7. **Volume probe.** EXPLAIN the policy-filtered queries at volume; add the junction/business indexes the planner wants. *Gate: policy predicate uses indexes; query times recorded.*
8. **Package the proof.** The scripted suite runs green start-to-finish on a fresh reset. *Gate: one-command isolation proof.*
9. **LEARNINGS doc.** The blessed policy template, helper SQL, claims ruling, revocation caveats, index requirements, and the suite itself.

## 7. Landmines and Tips

- **Deny-by-default is step one's whole point.** Enabling RLS with zero policies should black-hole the table. If anything is visible at that moment, the client is sneaking through as service role — find it before writing a single policy.
- **Security-definer helpers need care.** The membership function must be owned correctly and search-path-pinned, or it becomes its own privilege hole. Small detail, classic CVE-shaped mistake.
- **Policies don't compose the way you hope.** Multiple permissive policies OR together — a sloppy extra policy can silently widen access. The harness should end with exactly one policy per operation per table, and the Phase 3 packet should mandate the same.
- **INSERT policies use WITH CHECK, not USING.** The spoof-INSERT drill exists because this asymmetry is the most common RLS authoring mistake.
- **The junction lookup is a per-row predicate.** At volume this is where RLS performance dies or lives. A `(business_id)` index on the data table and a `(user_id, business_id)` index on the junction are the expected medicine; verify rather than assume.
- **Test with real sessions, not the SQL editor.** The Supabase dashboard SQL editor runs as postgres and lies to you about RLS. The suite must authenticate as the seeded users and query through the real clients.
- **Super-admin visibility is a policy decision, not a bypass decision.** *(SUPERSEDED — header item 1. Platform oversight is service role with audit, never an RLS clause.)*

## 8. Success Criteria

- Every cell of the access matrix (identities × operations × tables + Storage) asserted and green.
- All spoof drills rejected at the database layer.
- Policy performance EXPLAIN evidence recorded (informational).
- A one-command, re-runnable isolation suite ready to become Phase 3's shipping gate.

## 9. What Transfers Back to the Mothership

- The blessed policy template + helper SQL: every one of Phase 3's tables gets written against it.
- The isolation test suite: inherited as Phase 3's TEST_PLAN centerpiece — it proves RLS with real authenticated consumers even before any app screen reads real data.
- The claims/JWT ruling into the Phase 3 APP_BRIEF.
- The index requirements into the Phase 3 DATA_CONTRACT.
- The admin-client fencing rule into standing doctrine (ANTI_PATTERNS candidate).

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-07-13 | Initial plan. Flagged as first prototype to execute. |
| 1.1 | 2026-08-31 | Reconciliation header: Gap-6, R-2 accounts spine, in-repo branch ruling. Body preserved. |
