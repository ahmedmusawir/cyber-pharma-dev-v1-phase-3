# CODY BIM-003 — STAGES C–I PRE-Q REPORT (consolidated, for SOL adjudication)

**Date:** 2026-09-15 17:07 · **Agent:** Cody (QA execution; session resumed after a CLI bounce at ~16:55, Stages H+I completed by the replacement session) · **Authorization:** SOL's autonomous Stages C–I release (Director-carried) · **Scope:** Stages C–I only. No repair. No Gate Q verdict. No git mutation. No REPLICA contact.

> **Format note for SOL:** the release text carrying the stop conditions and the 12-section report format did not survive the bounce (not on disk; not re-pasted). The twelve sections below are reconstructed from the Stage A/B artifacts and the recon structure. If SOL's numbering differs, the content maps 1:1 by stage — re-slot, don't re-run.

## 1. SPECIMEN

| Item | Value |
|---|---|
| Branch | `qa/phase-3-bim003` ✅ (re-pinned at 17:01 after the bounce and again at 17:06 at close) |
| HEAD | `c45949ece1a17f1a3fbb299f5551f911f869c21e` ✅ — unchanged across the whole campaign |
| Product tree | **untouched** — tracked changes are exactly `RECOVERY.md` + the two seed maps (harness runtime state, SOL-carried) |
| Golden | SHA-256 `c30bfcddf88b164d912f656369edd73e7b0eb79b512f58bc819eb095894ccd4f` at close · `git diff` on `golden/` **EMPTY** |

## 2. AUTHORIZATION, STOP CONDITIONS, AND THE BOUNCE

- **Release:** Stages C–I autonomous. C–G executed in the prior session (16:35–16:47), H+I in this one (17:02–17:06).
- **Stop conditions:** cross-tenant PHI leakage, persistent mutation of audit history through a forbidden channel, golden false-green, rls:prove regression, triad regression. **None fired.**
- **The bounce:** Stage H attempted ~16:50 pre-bounce reached the matrix stage then the CLI died. Two partial files (matrix GREEN, ac8 GREEN, no prove/scoping/attacks/revocation) relocated to `QA/rls-prove/ABORTED-*T0855.log` — audit trail only, **not** proof evidence. Engineering's folder verified clean before the real run.
- **Instrument repair (pre-C, journal row 6):** `qa-probes.mjs` client-shape bug, 2 lines, instrument only, crash was pre-mutation.

## 3. STAGE C — D-1 DIRECT MEMBER READ vs WRAPPER (exit 0)

| Channel | Identity | Result | read_page delta | Attribution |
|---|---|---|---|---|
| DIRECT `user_data` SELECT | member-A (staffA, MEMBER of A1 only) | **ALLOWED — 204 rows** = svc ground truth; every row in staffA's set | **+0** | none |
| WRAPPER `owedbook_kpis(A1)` | member-A | **ALLOWED** | **+1** | staffA / authenticated |

**D-1 CONFIRMED LIVE.** Implementation matches the frozen contract (BIM-002's `user_data_select_member`); Brief §1 prose overstates. **Class stays CONTRACT-SPEC / THREAT-MODEL — not an implementation defect.**

## 4. STAGE D — FORGERY / IMMUTABILITY (exit 0 · 10/10 attack invocations denied · state UNCHANGED after each)

| # | Channel | Attack | Observed | Ground truth after |
|---|---|---|---|---|
| 1 | auth | forged INSERT | **42501** RLS | count unchanged |
| 2 | auth | UPDATE row 1 | **42501** privilege revoked (RF-3) | actor_role unchanged |
| 3 | auth | DELETE row 1 | **42501** | count unchanged |
| 4 | auth | **D-2:** direct RPC `audit_write()` | **PGRST202** function not found in schema cache | never reached SQL |
| 5–8 | svc | UPDATE actor_role / old_data / new_data / context | **P0001** "append-only" each | row byte-identical |
| 9 | svc | DELETE row 1 | **P0001** | count 640 unchanged |
| 10 | owner | `TRUNCATE audit_logs` | **P0001** (R-6a statement guard) | count unchanged |

**Zero persistent mutations.** Count note: the log carries 10 attack invocations plus two ground-truth re-reads; journal row 8's "12 attacks" counts the re-reads. The log is authoritative. **D-2 shape:** refused at PostgREST function-resolution, so the implicit `authenticated=X` ACL is unreachable via the API. AC-114's letter satisfied.

## 5. STAGE E — TENANT BOUNDARY MATRIX (exit 0 · 8/8 refused · control green)

| Caller → target | kpis | rows | PHI | read_page |
|---|---|---|---|---|
| member-A → B1 · admin-A → B1 · admin-B → A1 · multi → A2 | P0001 "not a member" | P0001 | none | +0 |
| **control** member-A → `owedbook_kpis(A1)` | ✅ expected envelope | — | own tenant | **+1** |

Every refusal fires pre-read. D-5's asymmetry handled live (multi correctly refused on A2).

## 6. STAGE F — SERVICE-ROLE WRAPPER OBSERVATION (exit 0)

`svc.rpc owedbook_kpis(A1)` and `(B1)` → **DENIED, P0001**, +0 read_page. **Disproves recon §5 item 3's static expectation.** With service_role, `auth.uid()` is NULL → `my_business_ids()` empty → fence raises before any read. **No unaudited service-role wrapper read channel exists.** Recommend recording as a positive finding.

## 7. STAGE G — ATTRIBUTION incl. REAL TOKEN REFRESH (exit 0)

Audited write attributed correctly (admin-A / authenticated / A1 / insert / pk). Real `refreshSession()` succeeded. Both wrapper read_page rows carry the **same identity across the refresh**. Tidy delete audited. Residue rows = mechanism working as designed.

## 8. STAGE H — `npm run rls:prove` post-destructive — exit 0

Evidence: `QA/rls-prove/X5_prove_2026-09-15T0902.log` (+normalised) and 5 siblings (T0903/T0904), relocated; Engineering folder clean.

- **Verdict:** `✓ ISOLATION PROVEN` · 17:02:51 → 17:04:23
- 8/8 stages: chain **47/47** · AC8 from scratch GREEN · **19 policies** · **320 cells / 0 mismatches** · SCOPING EXACT · **28 attacks / 0 breaches / 0 ground-truth mismatches** · **R-C PROVEN** on a byte-identical token
- A8.3: staffA reads `audit_logs` → DENY while svc sees 634 rows.
- Twin vs Stage A: one runtime line (`purged 5` vs `4 pre-existing auth.users`); every proof line identical.

## 9. STAGE I — TRIAD + FINAL `audit:prove`

Exact S3 commands, `QA/evidence/QA_I_triad_2026-09-15T1705.log`:

| Command | Expected | Observed | Exit |
|---|---|---|---|
| `npm run build` | 22 routes | **22 routes**, tree identical to S3 | **0** |
| `npx tsc --noEmit` | 0 | 0 | **0** |
| `npm test` | 28 / 128 / 0 | **28 passed / 128 passed / 0** | **0** |

**Final `npm run audit:prove`** — exit 0 · 17:05:36 → 17:06:38 · `QA/evidence/S3_audit_prove_2026-09-15T0905.log` (+3 siblings), relocated; Engineering folder clean.

- **Verdict:** `✓ TRAIL PROVEN` · 6 tamper probes green · write trail + attribution · R-8 · six wrapper calls → six read_page rows · cross-tenant deny · AC-113 · scoping admin-A 421 / member-A 0 / admin-B 206 / multi 424 / anon 0 · **golden produced 10 / golden 10 / 0 diffs → TRAIL EXACT**
- **Twins:** vs Stage A (T0642) and vs Engineering committed (T0738) → **timestamp line only, both.** Three from-empty runs across two days, byte-identical evidence bodies.

## 10. FINDING BOARD (provisional — SOL adjudicates)

| ID | Dynamic outcome | Class | Ask |
|---|---|---|---|
| **D-1** | CONFIRMED LIVE (Stage C) | **contract-spec / threat-model** | Erratum amending Brief §1 wording, or follow-on module. Not a BIM-003 defect. |
| **D-2** | PGRST202; ACL unreachable via API; no forge path | informational | Record shape |
| **D-3** | static only | QA-instrument / informational | AC-901 erratum row, Director's call |
| **D-4** | static only | informational | Director one-look at regen target |
| **D-5** | multi→A2 refused; scoping counts grade correctly | informational, no live hazard | None |
| **F-obs** | svc wrapper DENIED, no unaudited channel | positive finding | Note in WRAPPER_CONTRACT |
| G-1/G-2 | Stage B live-proved 5/5 | bounded, non-blocking | None |
| CF-9 | not encountered | pre-existing BIM-002, not a finding | None |

**Implementation defects found across Stages A–I: ZERO.**

## 11. ENVIRONMENT / RESTORATION / WORKING TREE

- **SCRATCH:** now holds the final audit:prove's seeded state. All wipes authorized. **REPLICA untouched** (A-1 fallback → unprefixed SCRATCH only). **Golden byte-untouched.**
- **Seed maps:** regenerated again by Stage H and final audit:prove. Disposition = QA Cleanup, not restored by me.
- **Credentials:** none read or printed.
- **Working tree:** `M RECOVERY.md` + 2 seed maps; untracked `QA/` (evidence ×47, rls-prove ×16, helpers ×3, recon, journal), `RESPONSES/` ×6, session log. **No product file modified.**
- **Infra:** zero classifier timeouts in the resumed session.

## 12. EVIDENCE MAP + CLOSE

All under `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/`: A → `evidence/QA_A_*`, `rls-prove/*T0638-39*`, `evidence/S3_*T0642-43*` · B → `evidence/QA_B_*`, `S3_*T0714…T0726*` · C–G → `evidence/QA_{C,D,E,F,G}_probes_*` · H → `rls-prove/*T0902-04*` + `ABORTED-*T0855*` · I → `evidence/QA_I_triad_*T1705*`, `S3_*T0905-06*` · journal rows 1–14.

**Bookkeeping asks for SOL:** (a) D-1 ruling; (b) D-3 erratum row; (c) seed-map disposition; (d) `ABORTED-*` partials keep/delete; (e) runner evidence-path hard-coding as CF-8 candidate.

**PRE-Q C–I COMPLETE — AWAITING SOL ADJUDICATION**

---

```
🔔 GIT REMINDER — uncommitted work:
  Entire QA lane (campaign A–I evidence, helpers, journal, recon, C–I report),
  6 RESPONSES artifacts, session log, RECOVERY.md, 2 seed maps (by-design regen).
Suggested: git add -A && git commit -m "15sep2026 - BIM-003 QA - Cody stages A-I green, C-I pre-Q report, awaiting SOL"
→ Your call. I will not run it.
```
