# BIM-002 FINAL CERTIFICATION SUPPORT
**Date:** 2026-09-02 17:59 · **For:** Fable (Architect) and Sol (QA Lead)
**Posture:** verification only. No file edited, no database touched, no `rls:prove`, no One-Walk, no git mutation, no verdict issued.
**Candidate:** `dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` · **PRE-Q specimen:** `53f1ac0004f40e4df9e403188382b16afb92899f`

---

## 1. Current branch
`main`

## 2. Current HEAD
`dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9` — matches the certification candidate exactly.

## 3. Protected implementation diff result

```
git diff --name-status 53f1ac0004f40e4df9e403188382b16afb92899f \
                       dfc8a6a4644081bef5a5142c27f2c77e4a6be3d9 \
  -- supabase/migrations/ scripts/rls-harness/ scripts/db-reset.mjs src/ package.json
→ NO OUTPUT
```

**PASS.** The implementation specimen PRE-Q attacked at `53f1ac0` is byte-identical to the certification candidate `dfc8a6a` across all five protected paths. Everything between the two commits is documents.

## 4. Document checklist

| Item | Result |
|---|---|
| ACCEPTANCE_SPEC — lifecycle still ENGINEER EVIDENCE-FILLED | **PASS** — `SEEDED → ENGINEER EVIDENCE-FILLED (2026-09-01) → QA-VERIFIED` |
| ACCEPTANCE_SPEC — E-1…E-6 applied | **PASS** — all six named in the governing-errata banner |
| ACCEPTANCE_SPEC — corrected AC3(b) present | **PASS** — verbatim, see §5 |
| ERRATUM — E-6 present | **PASS** (line 48) |
| TRANSFERS_ADDENDUM — F-14 present | **PASS** (line 94) |
| RETROSPECTIVE — PRE-Q section present | **PASS** (line 37) |
| RETROSPECTIVE — zero defects / zero rework reflected | **PASS** — "Outcome: zero implementation defects, zero rework." |
| CLAUDE.md — CF-8 present | **PASS** (§10a, all six candidates, owner BIM-005) |
| CLAUDE.md — PRE-Q outcome recorded | **PASS** — incl. One-Walk attempt 3, byte-identical token, no `TOKEN_REFRESHED` |
| QA/ — plan · recon · Phase 1 · Phase 2 · Phase 3 completion · Phase 4 · evidence | **PASS** — see §7 |
| RECOVERY.md — authoritative branch is `main`, completed state unambiguous | ⚠️ **PARTIAL — see §10 D-3** |
| RECOVERY.md — `qa/bim002` not presented as branch of record | **PASS** — explicitly "disposable PRE-Q execution branch only. Never merged." |

## 5. Exact wording found — E-6 / AC3(b)

**ERRATUM E-6 heading:** `## E-6 — AC3(b) denial-shape wording defect (RULED 2026-09-02, PRE-Q)`

**E-6 mechanism line, verbatim:**
> **Mechanism:** an **accessible-row** re-home is rejected by **`WITH CHECK` → `42501`**; an **unreachable-row** UPDATE is denied by **`USING` → 0 affected, no error**. Ground truth is unchanged in both.

**AC3(b) as committed, verbatim:**
> (b) UPDATE re-homing an accessible `user_data` row to a foreign `business_id` by a member of the row's store → `42501` (WITH CHECK rejection), ground truth: `business_id` unchanged. UPDATE targeting an unreachable row (no membership of the row's store) → 0 affected, no error (USING denial), ground truth unchanged. *(wording per ratified **ERRATUM E-6**, 2026-09-02 — spec prose only; implementation stood)*

Matches the ratified text.

## 6. F-14 presence

**PRESENT** — `## F-14 — denial shape depends on **which clause** denies`, credited "Surfaced by independent QA at BIM-002 PRE-Q, 2026-09-02", with the `USING`/`WITH CHECK` shape table and the classifier rule ("assert the expected shape per case, never accept any non-ALLOW outcome as a generic DENY").

## 7. QA package completeness

**COMPLETE — 30 files committed** under `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/QA/`:

- **Plan:** `BIM-002_PRE-Q_TEST_PLAN.md`
- **Recon:** `QA_RECON_REPORT.md` · plus `README.md`
- **RESPONSE ×8:** Phase 1 static/instrument attack · Phase 2 scratch attack · Phase 3 one-walk prep · Phase 3 token-continuity autopsy · Phase 3 rerun prep · Phase 3 attempt-3 prep · **`response_2026-09-02_preq-phase3-one-walk-complete.md` (successful One-Walk completion record)** · Phase 4 replica reproducibility
- **evidence ×16:** P1 static probe · P2 scratch attack + target preflight · P3 ×9 (readiness, session/rerun/attempt-3, tony revoke ×3, tony restore ×3) · P4 ×2 (reproducibility, RPC shape correction)
- **probes ×4:** `phase2-scratch-attack.mjs`, `phase3-one-walk-session.mjs`, `phase3-one-walk-session-rerun.mjs`, `phase3-tony-membership-action.mjs`

## 8. Implementation defect count

**ZERO** — stated in RETROSPECTIVE §PRE-Q and manager §10a, and corroborated independently by §3: no protected-path change between the attacked specimen and the candidate.

## 9. Engineering rework count

**ZERO** — E-6 is spec prose only ("implementation stood"); F-14 is a generalised finding; CF-8 is explicitly recorded-not-executed.

## 10. Discrepancies

Three, all **documentation-only**. None affects the implementation, and none is a certification blocker in my reading — but all three are present in the certification candidate, so they are reported rather than judged.

- **D-1 — ERRATUM E-2 heading contradicts its own body.** Heading reads `(PENDING RATIFICATION)`; the body's first line reads **`Status: RATIFIED and APPLIED 2026-09-01`**. The heading is stale. Substance correct and evidenced (`X1_AC8_helper_shape_AMENDED_2026-09-01.log`).
- **D-2 — ERRATUM E-4 never records its ratification.** Heading reads `(APPLIED, ratification requested)`; the body says `Remedy (APPLIED)` but the Director's ratification of 2026-09-01 was never written back. The implementation is correct and proven (both revokes present in `0016`; AC8 green from a from-scratch apply on three runs across two targets) — only the erratum's status text lags.
- **D-3 — RECOVERY.md at the candidate predates the merge.** It reads "PRE-Q complete; BIM-002 **awaiting certification**" and names **`phase-3-bim002`** as the authoritative module branch. Accurate when committed, but against the checklist's "authoritative branch is `main` / completed state unambiguous" it is only a partial pass. The end-of-day corrections (branch = `main` @ `dfc8a6a`, module CLOSED, refreshed Known Good State) are **uncommitted in the working tree** — `RECOVERY.md` and `agent_docs/SESSIONS/session_2026-09-02.md` both show as modified. Nothing lost; simply not in `dfc8a6a`.

*Noted, not a discrepancy:* ERRATUM sections run E-1, E-2, E-4, E-5, E-6, E-3 — out of numeric order, because E-3 was appended before later entries were inserted above it. All six present and readable.

**No edits made.** D-1, D-2 and D-3 are one-line-each fixes if Fable or Sol want them resolved before the verdict.

---

**CERTIFICATION SUPPORT: DISCREPANCY FOUND**

---

### Protocol note

This artifact was written **after** the on-screen report rather than before it — a Response Logging Protocol v1.0 miss, caught by the Operator. Content is an exact mirror of what was printed; nothing was altered in the transfer. The verification itself performed no edit, no database access and no git mutation.
