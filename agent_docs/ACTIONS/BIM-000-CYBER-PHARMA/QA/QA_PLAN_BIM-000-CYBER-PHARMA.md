# QA PLAN — BIM-000-CYBER-PHARMA
## Gate Q: Stage Prep & Hygiene

**Status:** READY FOR DIRECTOR OF QA REVIEW — execution not started  
**Module:** BIM-000-CYBER-PHARMA  
**QA Lead:** Sol  
**Human-in-the-loop:** Director of QA (Tony)  
**Gate:** Q — Pre-Deployment Quality Gate  
**Primary contract:** `ACCEPTANCE_SPEC.md` finalized by Engineering on 2026-08-13

---

## 1. Mission

Independently prove or disprove Engineering's claim that BIM-000 established a clean, truthful Phase 3 starting baseline without changing application source behavior.

This is a hygiene module. The main failure modes are **omission, accidental side effect, documentation drift, environment-contract drift, and scope violation** rather than user-facing feature defects.

Engineering evidence is treated as a claim package, not as the QA verdict.

---

## 2. Contract

Verify Acceptance Requirements **AC1–AC9** from the finalized BIM-000 `ACCEPTANCE_SPEC`.

### In Scope

- Sass and Stripe dependency removal
- `.env.example` parity
- deletion of `temp/ghl-example.json`
- `tsconfig.json` exclusions
- README / TESTING count corrections
- `agent_docs/DB_BASELINE.md`
- baseline static predicates
- proof that `src/**` was untouched
- handoff / commit concern integrity

### Out of Scope

Per the Acceptance Spec, QA must not fail BIM-000 merely because these remain unchanged:

- implementation changes under `src/**`
- `.env.local` content itself
- SQL/schema implementation
- numbered-color remediation
- Moose Portal changes
- KIP-1
- KIP-2

Out-of-scope discoveries may be recorded as non-blocking follow-up findings when real and relevant.

---

## 3. Sources of Truth

Order used for this engagement:

1. Finalized `ACCEPTANCE_SPEC — BIM-000-w-EVIDENCE`
2. Current filesystem / committed branch
3. `DB_BASELINE — Phase 3 Migration-Chain Starting Truth`
4. Current repo/recon ground truth
5. Environment configuration, without exposing secrets
6. `BIM-000-CYBER-PHARMA — HANDOFF MANIFEST`
7. KIP Registry
8. Phase 3 Campaign Journal
9. Prior conversation / recollection

### Governing Factory Doctrine

- `QA_PLAYBOOK.md` v1.1
- `TESTING_PLAYBOOK.md`
- `BUG_FIX_PLAYBOOK.md` for defect classification/routing only
- Phase 3 campaign doctrine

---

## 4. Environment Readiness / Gate Q Prerequisites

Gate Q execution does not begin until P1–P3 are resolved.

### P1 — Committed candidate

Required:
- BIM-000 changes committed.
- QA records current branch and HEAD SHA before testing.

**Current documentation conflict to resolve at preflight:**  
The Acceptance Spec names branch `bim-000-cyber-pharma`, while the Engineer Handoff Manifest says `Branch: phase-3-1`. QA will not guess which is authoritative; current disk state + Director/Coordinator ruling resolves it.

### P2 — Stripe local-secret cleanup

Required:
- Director/Coordinator attests that the six `STRIPE_*` keys were purged from `.env.local`.
- Secrets were rotated out-of-band.

**Safety rule:** QA does **not** read or request `.env.local` secret values.

### P3 — `phase2.md` verdict

Required:
- recovered into `agent_docs/`, **or**
- explicitly ruled unrecoverable.
- `DB_BASELINE.md` Sibling Note updated from `PENDING` to the actual verdict.

---

## 5. Risk Review

| Risk | Level | QA Response |
|---|---|---|
| Dependency removal breaks runtime/build | Medium | clean install + build + typecheck + full Jest regression |
| `.env.example` omits a real consumer outside `src/` | Medium | independent repo/config/script env sweep |
| Dead env variables remain documented | Low-Medium | compare consumed key set to `.env.example` key set |
| DB baseline is a bad transcription | High for future Phase 3 work | compare to Director/Coordinator's original live catalog evidence |
| Documentation counts drift from real board | Low | compare docs to fresh Jest result |
| Engineer changed forbidden `src/**` | High for module integrity | diff from Phase 3 starting SHA to QA candidate |
| Static predicate passes for wrong reason | Medium process risk | re-run legacy predicate where available + independent boundary-aware probe |
| Handoff/branch identity is ambiguous | Medium | resolve before execution; record actual branch + SHA |
| QA exposes secrets while verifying P2/env | High | key-name-only checks; no secret contents in evidence |

---

## 6. Acceptance Traceability

| AC | Acceptance Requirement | Primary Test Cases | Layer |
|---|---|---|---|
| AC1 | Sass/Stripe absent; lockfile clean | TC-001, TC-002 | Static + clean install |
| AC2 | Build, TypeScript, Jest 26/120/0 | TC-003, TC-004, TC-005 | Regression |
| AC3 | `.env.example` exactly matches consumers | TC-006, TC-007 | Static + exploratory |
| AC4 | GHL fossil absent | TC-008 | Filesystem |
| AC5 | tsconfig excludes both paths; TS clean | TC-009 | Static + regression |
| AC6 | README/TESTING counts match fresh board | TC-010 | Documentation |
| AC7 | DB baseline byte-faithful to live catalog | TC-011 | Independent evidence comparison |
| AC8 | 2 `any`; 0 role smells; legacy color predicate 5 | TC-012, TC-013, TC-014A, TC-014B | Static + exploratory |
| AC9 | no `src/**` writes; handoff/commit integrity | TC-015, TC-016, TC-017 | Git/read-only evidence |

Prerequisites P1–P3 are covered by TC-P1 through TC-P3.

---

## 7. Regression Scope

BIM-000 claims no runtime behavior change. Therefore the baseline itself is the regression target:

- production build remains green
- TypeScript remains clean
- Jest remains **26 suites / 120 tests / 0 failures**
- production `any` baseline remains exactly 2
- production `user_metadata` role-smell count remains 0
- legacy numbered-color predicate remains at its frozen BIM-000 baseline
- no `src/**` change exists in the BIM-000 diff

Any current-change regression blocks Gate Q.

---

## 8. Automated Checks

Run fresh during QA; do not copy Engineer outputs as QA evidence.

Core commands/checks:

- branch + HEAD identity
- `npm ls sass stripe`
- package manifest search
- `npm ci`
- `npm run build`
- `npx tsc --noEmit`
- `npm test`
- env-consumer key-name sweep
- filesystem absence checks
- tsconfig inspection
- documentation count inspection
- baseline static greps
- read-only git diff/log review

No retry is added merely to make a failed test green.

---

## 9. Manual / Evidence Checks

The Director of QA executes terminal steps one case at a time and returns fresh outputs to Sol.

Special manual checks:

- P2 secret cleanup is verified by Director/Coordinator attestation only.
- AC7 is compared against the **original Coordinator live catalog evidence**, not Engineering's transcription.
- AC9's claim that the Engineer ran zero mutating git commands is treated as an attestation/process-evidence claim unless an independent audit trail exists.

---

## 10. Exploratory Probes

Only seams relevant to BIM-000:

1. Search for environment consumers outside Engineering's obvious `src/` sweep, especially config/scripts.
2. Check for alternative `process.env[...]` access shapes that a simple dot-notation grep could miss.
3. Verify the numbered-color gate's known false-positive behavior separately from the frozen AC8 baseline.
4. Look for dependency-use remnants that could survive package removal without appearing in `package.json`.
5. Inspect the committed diff for unexpected files or scope creep.

Exploratory findings outside AC scope do not automatically fail the module; they are classified and routed.

---

## 11. Known Gaps Before Execution

1. **Original Coordinator live catalog output is not present in the current QA intake files.** AC7 cannot receive a clean independent PASS until that source evidence is supplied or an approved substitute is ruled.
2. **Branch naming conflict:** Acceptance Spec says `bim-000-cyber-pharma`; Handoff Manifest says `phase-3-1`. Resolve from disk before testing.
3. **AC8 legacy numbered-color predicate command is not reproduced verbatim in the supplied Acceptance Spec/Handoff.** If the original recon predicate is available in repo docs, QA uses it for TC-014A. Otherwise the missing predicate definition is recorded as a GAP and TC-014B provides an independent corrected probe.
4. P1–P3 must be confirmed from current state before Gate Q execution.

---

## 12. Finding / Rework Rule

If a test fails:

1. stop that case and capture evidence,
2. assign finding ID + severity + classification,
3. determine whether it blocks Gate Q,
4. Director of QA / Coordinator gets Architect adjudication when scope or contract intent is involved,
5. accepted defect returns to Claudy as **BIM-000 rework**,
6. QA retests the failed case,
7. QA reruns affected regression,
8. if code/config changed, rerun the full required suite,
9. Gate Q verdict is reissued.

**No new FIX module is created for an in-scope defect while BIM-000 remains open.**

---

## 13. Exit Criteria

### PASS

BIM-000 may receive PASS only when:

- P1–P3 are resolved,
- all AC1–AC9 are independently verified,
- required regression is green,
- no release-blocking defect remains,
- gaps affecting an acceptance requirement are closed,
- all findings are classified/routed,
- the final candidate branch + SHA are recorded.

Other permitted Factory verdicts:

- PASS WITH FOLLOW-UP FINDINGS
- PASS WITH KNOWN RISK
- FAIL
- BLOCKED

The QA Lead owns the Gate Q verification verdict.  
The Director/Coordinator owns final release/closure authority.

---

## 14. Outputs From This Engagement

1. `QA_PLAN_BIM-000-CYBER-PHARMA.md` — this document
2. `QA_TEST_CASES_BIM-000-CYBER-PHARMA.md`
3. Fresh QA evidence captured during execution
4. Finding records if any
5. Final `GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`
6. BIM-000 QA Process Journal updates
7. Phase 3 Campaign Journal harvest input after module closure
