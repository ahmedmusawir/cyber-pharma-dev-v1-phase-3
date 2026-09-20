# RRM CAMPAIGN — DIRECTOR DECISIONS OF RECORD

**Placement:** `agent_docs/RRM_DIRECTOR_DECISIONS.md` · **Authority:** Tony Stark (Director), 2026-09-20. Supersedes the Architect's earlier proposals (retain signup/Moose with authorization; dash for the Report control; future removal gate; single five-stage module). Proposals live in the journal as history; scope comes only from these rulings.

## D1 — Remove public signup now
Remove all public self-registration: forms, links, nav entries, signup-only components, `/api/auth/signup`, signup-only code/tests/config with no remaining consumer. Preserve existing-user login, logout, session refresh, password recovery/update and any shared auth callback. Public self-registration must also be disabled on the Supabase project (Director dashboard action DA-2); the packet may not claim it has happened. The installed `handle_new_user()` still assigns role from metadata: disabling signup is **containment**, not repair. Three distinct evidence items — application removal, Supabase containment, permanent migration — none proves the others.

## D2 — Remove Moose portal now
Remove the complete feature: routes, layouts, pages, Server Actions, components, nav links, feature-flag wiring, Moose-only helpers/tests/docs. Trace consumers before deleting anything shared. Preserve auth, `user_roles`, `profiles`, legitimate accounts and utilities other features need. Reconcile the 2026-07-14 "blessed infrastructure" ruling explicitly (E-04). Security objective = privileged entry points gone and unreachable by old URL or direct action invocation. BIM-004 no longer creates test users via Moose (CE-1); BIM-005 "Moose intact" superseded (CE-3); post-RRM `main` is the future comparison baseline.

## D3 — Missing-PBM disclosure approved
Summary tab discloses underpaid dollars omitted from the PBM breakdown. Complete filtered dataset, identical filters for both aggregates, no claim count. Rounding noise, stale responses and unavailable totals never mislabeled as missing-PBM money; zero-gap and error behavior defined in ACs. No pricing engine, no Unattributed bucket, no change to certified backend formulas.

## D4 — Dependency remediation inside the campaign
Next.js/sharp remediation is its own final module; all gates rerun. Verify exact targets and advisory applicability at implementation time, including installed transitive image-processing packages. Remove or narrow Cloudinary config based on actual supported image sources.

## D5 — Report button stays exactly as it is
Not hidden, disabled, relabeled, dashed or implemented. Retained inert until the report feature. Keyboard repairs elsewhere remain in scope.

## D6 — Naming
`RRM-00N-CYBER-PHARMA` · `phase-3-rrm00N` · `qa/phase-3-rrm00N`. Existing `phase-3-rrm-ffm` renamed by the Director (DA-1). Tony retains Git authority.

## D7 — Future removal plan superseded
Signup and Moose removal happen now (RRM-001). Replacement test-user workflow: DA-5 interim; BIM-004 seed with explicit role writes (CE-1).

## D8 (shape, 2026-09-20) — RRMs are a campaign
Architect writes a campaign map listing one module per bounded scope; a campaign journal grows with the work; one pack per module under `agent_docs/ACTIONS/`; nothing else in `ACTIONS/`. Engineer hands EXECUTION_LOG + ACCEPTANCE_SPEC + QA_HANDOFF to the QA lead; Claudy and Cody juggle rework inside the repo on the QA line; SOL certifies; Claudy closes out; Director commits, pushes, merges.

## Standing direction retained
Aggregate Owed KPI deferred to Phase 5 (mock ↔ wrapper stay in agreement) · seven money rules apply to the fixture/copy audit only; no frontend pricing engine; flag existing money math, never silently rewrite or relocate · preserve negative owed values; presentation deferred · global sort Phase 5c; keyboard access to current sort in scope · FIX-001 findings resolved, regression-protected · signup-recovery/confirmation UI work withdrawn · quarantine obsolete SQL setup docs; keep owner/gate for the permanent trigger correction · no deployment investigation (waived).

## Director-locked money rules (2026-09-20)
1. **FEE** — $10.64, one value, every path. No 11.85 in mocks or copy.
2. **OWED** — expected − paid. Positive means PBM owes pharmacy. Never clamp to zero. (Coach-locked 09-20.)
3. **EXPECTED** — quantity × per-unit rate + fee, every pricing method; no flat-fee exception.
4. **PRICING ORDER** — AAC → derive from WAC (brand ×0.96, generic ×1.0) → FUL ceiling for generics only. U&C out of scope.
5. **METHOD VOCABULARY** — AAC, FUL, GWAC, BWAC, Take Action, Manual Override.
6. **PBM KEY** — computed from BIN-PCN-group, never user-editable. Example: BIN 004146 → `4146`.
7. **POINT-IN-TIME** — retain fee and prices as of the claim's fill date; never reprice historical claims with current values.

Still unresolved, outside this campaign's implementation (owners/gates in the map §10): negative-owed display · brand/generic authority · reversals/partial fills · U&C · aggregate KPI semantics and rounding.
