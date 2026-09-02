# BIM-002-CYBER-PHARMA --- PRE-Q TEST PLAN

**Owner:** Sol --- QA Lead\
**Execution Agent:** Cody --- QA Engineer / execution agent\
**Director:** Tony --- credential boundary, manual hands, sole git
authority\
**QA Branch:** `qa/bim002` --- disposable, never merged\
**Observed specimen:** `53f1ac0004f40e4df9e403188382b16afb92899f`\
**Status:** PRE-Q --- independent QA attack plan

> Engineering evidence is input, not QA proof. Cody reports
> observations; Sol alone adjudicates the verdict.

## 1. Mission

Independently attack BIM-002's RLS implementation and its proof
instruments before certification. Do not simply rerun Engineering X0--X7
and call that QA.

The dev backend is OUT OF BOUNDS.

Authorized throwaways, only when the relevant phase is released: -
**SCRATCH:** Proto 06 rig throwaway; default/unprefixed harness
selection via Amendment A-1 fallback names. - **REPLICA:** clean-replica
throwaway; selected with `RLS_HARNESS_PREFIX=RLS_REPLICA_`.

## 2. Role boundaries

**Sol:** owns the plan, chooses attacks, reviews evidence, directs
One-Walk, issues PRE-Q/Gate Q verdicts.

**Cody:** reads repo, creates/runs QA-only probes, captures evidence,
reports observations/gaps, and stops at checkpoints. Cody never grades
the module and never changes product implementation to make a test pass.

**Tony:** retains git authority, credential boundary, destructive-target
confirmation, and manual hands.

## 3. Mandatory Cody response protocol

All substantive Cody checkpoint responses MUST be written to:

`agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/RESPONSE/`

Filename:

`response_YYYY-MM-DD_HHMMSS_<topic-slug>.md`

Example:

`response_2026-09-02_101500_preq-phase1-static-instrument-attack.md`

Rules: 1. Use local wall-clock timestamp at creation. 2. Never overwrite
a prior response. 3. Persist the response file BEFORE printing the
terminal summary. 4. Every response states branch, HEAD, phase,
probes/files created, commands executed, observations, evidence paths,
discrepancies, gaps, product-file modification status, and explicit STOP
state. 5. Never record credentials, tokens, passwords, secret keys, or
credential-bearing URLs. 6. Raw QA evidence uses unique filenames under
the BIM-002 `QA/` tree. 7. Terminal summary after each checkpoint
contains only: checkpoint completed, five most important observations,
response-file path, evidence paths, STOP.

## 4. Governing material

Resolve current authority from disk before testing: - BIM-002
`CLAUDE.md` - `ACCEPTANCE_SPEC.md` - `ERRATUM.md` - `RETROSPECTIVE.md` -
Proto 06 `TRANSFERS.md` - `TRANSFERS_ADDENDUM_BIM-002.md` -
`RLS_TEMPLATES.md` - Engineering X0--X7 evidence -
`QA_RECON_REPORT.md` - migrations `0016–0027` - `scripts/rls-harness/` -
`package.json`

Known ruled state to verify from disk: - AC13 STRUCK. - Four helpers. -
15 new + 3 untouched baseline policies. - Helper EXECUTE revoked from
PUBLIC and anon; authenticated explicitly granted. - Final tenant SELECT
formulation C via `my_business_ids()`. - `user_businesses` SELECT lands
first. - Errata govern explicit stale Manager/spec residue.

Surface conflicts; never silently repair them.

# PHASE 1 --- STATIC SPECIMEN & INSTRUMENT ATTACK

**AUTHORIZED only when Sol sends the launch instruction.**

Hard boundary: - NO destructive DB execution. - DO NOT run
`npm run rls:prove`. - NO DB reset or service-role mutation. - NO
product changes. - NO git operations. - If a check might contact/mutate
a DB, defer it to Phase 2.

### P1-A --- Specimen integrity

Record branch, HEAD, `git status --short`, and BIM-002 inventory.
Confirm HEAD remains:

`53f1ac0004f40e4df9e403188382b16afb92899f`

If HEAD differs, STOP immediately and report.

### P1-B --- Authority reconciliation

Build a ruled-state table for helper count, policy count, AC13, helper
ACL law, final A/B/C predicate, junction-first order, forbidden sources,
deny-all tables, and baseline-policy preservation.

Classify discrepancies as: - documentary residue; - implementation
conflict; - unresolved authority conflict.

Do not fix them.

### P1-C --- Migration attack

Independently challenge migrations `0016–0027`:

1.  Four helpers exist.
2.  Required helpers are SECURITY DEFINER.
3.  Required helpers are STABLE.
4.  Empty search path is enforced.
5.  Required references are fully qualified.
6.  PUBLIC EXECUTE revoked.
7.  anon EXECUTE separately revoked.
8.  authenticated EXECUTE explicitly granted.
9.  `user_businesses` SELECT is 0017 and precedes dependent policies.
10. Tenant SELECTs use final formulation C, not inline B.
11. INSERT uses WITH CHECK.
12. UPDATE uses USING + WITH CHECK.
13. `user_data` DELETE is admin-gated.
14. accounts/subscriptions use ruled account-membership logic.
15. reference tables expose authenticated SELECT only.
16. pending_registrations, apa_memberships, audit_logs remain deny-all.
17. user_roles/profiles untouched by BIM-002.
18. no BIM-002 Storage policy.
19. no forbidden membership source in helper/policy bodies:
    `user_roles`, `user_metadata`, `raw_user_meta_data`, `profiles`,
    `owner_user_id`.
20. no unintended table-structure change in 0016--0027.

Use boundary-aware checks; comments must not create false positives.

### P1-D --- Attack the harness

Treat `scripts/rls-harness/` as code under test.

Determine from source:

1.  Does every authenticated instrument assert returned
    `session.user.id` equals intended seed identity?
2.  Resolve the conflict: QA Recon says main matrix lacks this;
    Engineering says every instrument asserts it.
3.  Which denied mutations receive service-role ground truth?
4.  Which matrix mutations can be called DENY from zero affected without
    ground truth?
5.  Can empty/missing rows false-green?
6.  Does seed guarantee non-vacuous data?
7.  Can cleanup/restoration hide residue?
8.  Are volume claims count-based?
9.  Is any limited `.select()` treated as exhaustive?
10. Does Auth cleanup paginate beyond 1,000 users?
11. Can fallback env selection target something unexpected?
12. Is there an independent project/target allowlist before destructive
    reset?
13. Does AC8 anon execution directly probe all four helpers or only a
    subset?
14. Can `seed-map.json` mutation cause stale-identity/evidence coupling?
15. Can normalization hide a security-significant difference?
16. Does evidence labeling reliably identify scratch vs replica?
17. Does harness fail closed on sign-in error?
18. Does it fail closed on identity mismatch where checked?
19. Is service role confined to seed/system/ground-truth/cleanup rather
    than policy evaluation?
20. Identify other credible false-green mechanisms.

QA-only static probes/scripts are allowed. Do not modify the shipped
harness.

### P1-E --- Engineering evidence challenge

Inspect rather than rerun. Focus on: - AC18 raw build/tsc/Jest/type-diff
evidence gap; - AC20 byte-for-byte template claim without standalone
diff; - final Storage inventory claim; - X6 evidence-label drift; - X2
interim B (§4) vs final C (§7); - stale three-helper / 17-policy / CI
wording.

Classify each: - sufficient direct artifact for later QA
consideration; - weak/summary-only; - contradictory; - requires
independent QA execution later.

This is not a module verdict.

## Phase 1 required response

Write:

`QA/RESPONSE/response_<timestamp>_preq-phase1-static-instrument-attack.md`

Include: - observation table: ID, target, observation, evidence,
HIGH/MEDIUM/LOW/INFORMATIONAL QA-planning severity, recommended Phase-2
follow-up; - instrument trust assessment: `TRUST FOR DIRECT USE`,
`TRUST WITH INDEPENDENT GROUND TRUTH`, or `DO NOT TRUST YET`; - concrete
Phase-2 attack recommendations; - declared gaps; - explicit confirmation
whether product files changed; - STOP.

Then STOP. Do not execute Phase 2.

# PHASE 2 --- SCRATCH DESTRUCTIVE RLS ATTACK

**LOCKED --- NOT AUTHORIZED YET.**

Sol releases this only after reviewing Phase 1.

When released, target SCRATCH only. Before destructive execution Cody
must record `INTENDED TARGET: SCRATCH`, confirm no replica prefix
override is active, confirm expected A-1 fallback selection without
printing values, and STOP if target selection is ambiguous.

Planned attack areas include fresh helper ACLs, PUBLIC/anon execution,
exact session identity, C-predicate isolation, cross-tenant direct-ID
and list reads, foreign INSERT, UPDATE re-home, member/admin DELETE,
account/subscription spoofing, junction rules, forbidden live policy
sources, baseline policies, deny-all tables, reference tables,
silent-zero modes, selected mutation ground truth, and Phase-1 harness
false-positive hypotheses.

# PHASE 3 --- ONE-WALK: SAME-SESSION REVOCATION

**LOCKED --- NOT AUTHORIZED YET.**

Tony is hands under Sol direction.

Candidate R-C: - establish multiStore A1+B1 visibility; - revoke B1
junction via authorized service-role path; - reuse SAME session/token; -
prove B1 disappears immediately; - prove A1 remains; - ground-truth
junction; - no token refresh.

Bank this evidence for PRE-Q/certification unless later implementation
changes invalidate it.

# PHASE 4 --- REPLICA / REPRODUCIBILITY

**LOCKED --- NOT AUTHORIZED YET.**

When released, target REPLICA only using:

`RLS_HARNESS_PREFIX=RLS_REPLICA_`

No dev backend.

# PHASE 5 --- PRE-Q ADJUDICATION

Cody does not perform adjudication. Cody returns evidence and stops.

Sol distinguishes implementation defects, contract/document defects, and
instrument defects; requests bounded follow-up attacks if needed;
declares evidence complete; and issues the PRE-Q verdict.

If PRE-Q is green: Director performs per-concern commits → SHA pin →
certification against pinned SHA.

QA branch remains unmerged.

## 5. High-value hypotheses

These are attack hypotheses, not findings:

-   **H1:** identity mismatch can false-green if the main matrix does
    not verify exact returned identity.
-   **H2:** zero-affected UPDATE/DELETE can false-green without
    independent ground truth.
-   **H3:** empty/missing rows can false-green a DENY; Engineering
    already hit this failure class in X2.
-   **H4:** helper ACL results can depend on deployment history because
    CREATE OR REPLACE preserves ACL state.
-   **H5:** `my_business_ids()` is a concentrated SECURITY DEFINER
    boundary; attack owner, grants, search path, caller semantics,
    revocation, and result isolation.
-   **H6:** target selection is operator-dependent; the harness lacks an
    independent project allowlist.
-   **H7:** one-page Auth cleanup does not prove absence beyond 1,000
    users.
-   **H8:** evidence normalization must not erase security-significant
    drift.
-   **H9:** account-level membership intentionally broadens
    authorization; attack multi-business/account edges.
-   **H10:** deny-all-by-omission can be widened by a single unexpected
    permissive policy.

## 6. Out of contract

Do not fail BIM-002 for browser/SSR session behavior (BIM-005), Storage
bucket isolation (Proto 01), audit trail (BIM-003), dev backend behavior
(APPLY SESSION), or unrelated exploratory findings.

## 7. Credential and target rules

Never print `.env.local`, connection strings, secrets, tokens,
passwords, or credential-bearing URLs. Never persist them in QA
evidence. Never target dev. Destructive work requires explicit phase
release. Ambiguous target = STOP. Service-role ground truth must never
become the user-under-test path.

## 8. Branch rules

`qa/bim002` is disposable. Cody does not commit, push, merge, rebase,
switch branches, or clean product files for merge. Tony retains git
authority. The branch is abandoned/deleted after QA.

## 9. Current release state

**Only Phase 1 may run after Sol's explicit launch instruction. Phases
2--4 are locked.**

🥄
