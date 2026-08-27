# BIM-000 — QA PROCESS JOURNAL
## Third-Eye Process Telemetry for the First Real Cyber Pharma BIM Gate Q

**Project:** Cyber Pharma v1  
**Module:** BIM-000-CYBER-PHARMA — Stage Prep & Hygiene  
**Purpose:** Observe the QA process itself while Gate Q is executed. This journal does **not** determine the product verdict. It records misunderstandings, handoff friction, doctrine gaps, useful discoveries, coordinator overhead, and process improvements for later harvest into Phase 3 lessons learned / Factory doctrine.

---

## Operating Rule

Two lanes stay separate:

1. **QA Evidence Lane** — AC1–AC9 verification, findings, regression evidence, and the Gate Q verdict.
2. **Process Journal Lane** — how well the Factory process worked while producing that verdict.

A product defect is not automatically a process defect.  
A confusing or wasteful process step is not automatically a product failure.

---

## What We Will Capture

For every meaningful friction point or useful discovery:

- **Moment / Stage**
- **What happened**
- **What Tony understood or misunderstood**
- **What caused the confusion or friction**
- **Whether the doctrine/documentation was clear enough**
- **Whether QA lost time or required an improvised ruling**
- **Keep / Change / Drop**
- **Candidate playbook or handoff improvement**
- **Resolved / Open**

---

## Starting Observations — Before Gate Q

> **Canonical consolidation:** rebuilt at PRE-Q close from all live journal revisions. This file supersedes transient `LIVE_v*` working copies.

---

### PJ-001 — Acceptance Spec lifecycle was initially unclear
- **Moment / Stage:** QA preparation
- **What happened:** Tony repeatedly questioned whether the seeded ACCEPTANCE_SPEC and the evidence-filled ACCEPTANCE_SPEC were two files.
- **Observed confusion:** It was not immediately obvious that the Architect seeds one file before implementation and the Engineer later fills evidence into that same file.
- **Process implication:** The doctrine is logically sound, but the handoff language can make a single evolving artifact sound like two separate artifacts.
- **Candidate improvement:** Add a one-line lifecycle banner to the template:
  `SEEDED → ENGINEER EVIDENCE-FILLED → QA-VERIFIED`
- **Status:** Resolved before Gate Q.

---

### PJ-002 — "Where is the evidence?" exposed a handoff-verification need
- **Moment / Stage:** QA intake preparation
- **What happened:** Tony received an earlier seeded copy containing placeholder evidence fields and reasonably questioned where Claudy's proof was.
- **Process implication:** A FINALIZED label should never be trusted without checking the actual Evidence blocks.
- **Candidate improvement:** Add a Coordinator pre-QA intake check:
  `No [command outputs] / [grep counts] / [file excerpt] placeholders remain.`
- **Status:** Resolved. Evidence-filled spec is now present.

---

### PJ-003 — Gate Q intake package was not initially obvious
- **Moment / Stage:** QA intake preparation
- **What happened:** It took discussion to establish that Sol needs more than the acceptance criteria alone for AC7.
- **Required package clarified:** finalized ACCEPTANCE_SPEC + Engineer handoff/done report + DB_BASELINE + Coordinator's original catalog evidence + committed branch/terminal access.
- **Process implication:** Module handoff doctrine may benefit from a standard `QA_INTAKE_CHECKLIST`.
- **Status:** Open candidate for doctrine improvement.

---

### PJ-004 — Campaign journal staging gap already surfaced
- **Moment / Stage:** BIM-000 engineering / handoff
- **What happened:** The campaign journal was described as live but was not yet present in the project repo.
- **Process implication:** A campaign telemetry artifact needs to exist before Module 0 starts or early friction must be reconstructed later.
- **Candidate improvement:** Journal staging becomes a campaign-launch prerequisite.
- **Status:** Already captured in the Phase 3 Campaign Journal; retain for final harvest.

---

### PJ-005 — Verification predicate itself was faulty
- **Moment / Stage:** BIM-000 engineering evidence
- **What happened:** The numbered-color predicate reported five hits, but four were substrings inside translate/slide utilities and one was the comment banning numbered colors; real violations were zero.
- **Process implication:** The Factory must verify its verification instruments.
- **Candidate improvement:** Predicate definitions require boundary-safe matching and a one-time sanity check before becoming acceptance gates.
- **Status:** Carried forward; AC8 keeps the original baseline for this module.

---

---

### PJ-006 — Canonical Gate Q execution loop clarified
- **Moment / Stage:** Pre-Gate-Q process design
- **What happened:** Tony proposed the familiar QA structure: write a test plan, decompose it into test cases, execute one by one, issue a report, cycle defects through Engineering, and repeat until clean.
- **Assessment:** This is the correct operational shape for Factory QA and should become repeatable doctrine.
- **Important routing correction:** Defects found while the current BIM is still active remain rework inside that BIM. A new FIX module is normally reserved for defects found after previously accepted/closed work, or for separately adjudicated defects outside the active module's scope.
- **Canonical loop proposed:** Acceptance Spec + Handoff → QA Test Plan → Test Cases → Execute → Findings → Coordinator/Architect adjudication when needed → Engineer rework in active module → QA retest → full regression → Gate Q verdict → QA Acceptance Report → Coordinator closure.
- **Process implication:** The QA Playbook defines independence and evidence discipline, but the live campaign benefits from a standard executable artifact set for every module.
- **Candidate improvement:** Standardize three QA artifacts for each module:
  1. `QA_TEST_PLAN.md`
  2. `QA_TEST_CASES.md`
  3. `QA_ACCEPTANCE_REPORT.md`
  The Process Journal remains separate and feeds campaign/playbook improvement.
- **Status:** Adopt for BIM-000 pilot; evaluate at close before promoting to doctrine.

---

---

### PJ-007 — Human-in-the-loop role naming standardized
- **Moment / Stage:** QA artifact design
- **Ruling:** In the App Factory, the human-in-the-loop is called the **Director** for that department. For this lane Tony is the **Director of QA**; Engineering uses Director of Development; DevOps uses Director of DevOps.
- **Candidate improvement:** QA templates/playbooks should use Director of QA where they currently use generic Operator wording for the human-in-the-loop role, while preserving campaign-level Coordinator/final-authority responsibilities where applicable.
- **Status:** Adopted for BIM-000 QA artifacts; candidate for later doctrine patch.

---

### PJ-008 — Canonical artifact naming reconciled with live QA Playbook
- **Moment / Stage:** QA plan authoring
- **What happened:** The pilot initially proposed `QA_TEST_PLAN.md` and `QA_ACCEPTANCE_REPORT.md`, but the live QA Playbook already defines `QA_PLAN.md` and `GATE_Q_REPORT.md`.
- **Ruling:** Preserve existing canonical names and add only `QA_TEST_CASES.md` as the new execution workbook.
- **Keep:** existing doctrine names.
- **Change candidate:** formally add the test-case workbook only if this pilot proves useful.
- **Status:** Adopted for BIM-000.

---

### PJ-009 — Preflight found branch-name documentation conflict
- **Moment / Stage:** QA plan authoring before command execution
- **Evidence:** Acceptance Spec prerequisite P1 names branch `bim-000-cyber-pharma`; Engineer Handoff Manifest header says `Branch: phase-3-1`.
- **Process implication:** QA intake itself caught a ground-truth ambiguity before testing.
- **Ruling:** Do not guess. TC-P1 records actual branch + HEAD from disk and resolves the conflict before Gate Q proceeds.
- **Status:** Open until TC-P1.

---

### PJ-010 — AC7 independent source evidence is not in current QA intake
- **Moment / Stage:** QA plan authoring
- **What happened:** `DB_BASELINE.md` says it was transcribed from the Coordinator's 2026-08-11 live catalog, and the Acceptance Spec explicitly requires QA to compare against that original paste. The original catalog output is not among the current uploaded QA files.
- **Process implication:** The Gate Q intake checklist should explicitly include any operator-owned source evidence referenced by an AC.
- **Ruling:** TC-011 is BLOCKED if that original source cannot be supplied or formally substituted.
- **Status:** Open.

---

### PJ-011 — AC8 exposes reproducibility problem in verification predicates
- **Moment / Stage:** QA test-case authoring
- **What happened:** The supplied spec/handoff gives the numbered-color expected count and explains the false positives, but does not reproduce the exact original predicate command.
- **Process implication:** Acceptance evidence should preserve not just the expected count but the exact reusable verification command/instrument when a gate depends on it.
- **Ruling:** Split into TC-014A (legacy exact predicate, must be recovered) and TC-014B (independent boundary-aware exploratory probe).
- **Status:** Open until execution.

---

---

### PJ-012 — Gate Q preflight correctly stopped before testing
- **Moment / Stage:** TC-P1 — candidate branch and commit identity
- **Observed evidence:** Current HEAD reported as `87d39b468da97b9bd65e92066df278dd1fe888dcd`. `git status --short` showed BIM-000 changes still modified/deleted/untracked, including `.env.example`, `README.md`, `package*.json`, `tsconfig.json`, `agent_docs/DB_BASELINE.md`, module docs, and related protocol files.
- **QA ruling:** P1 is not satisfied because the candidate is not yet committed. Gate Q must not continue into product acceptance testing.
- **Additional gap:** The branch name was not visible in the supplied screenshot, so the branch-name conflict remains unresolved.
- **Process lesson:** The preflight gate prevented QA from grading a moving target. This validates the new prerequisite-first execution pattern.
- **Status:** Open. Resolve branch identity, complete Coordinator commits, then rerun TC-P1 from a stable candidate.

---

---

### PJ-013 — Director prefers one final commit after QA
- **Moment / Stage:** Gate Q preflight after TC-P1
- **Director preference:** Complete QA and any rework first, then commit the finished BIM-000 candidate once rather than committing the current working tree before QA.
- **Doctrine tension:** Acceptance prerequisite P1 says the module changes are committed before Gate Q execution, because QA should grade a fixed revision.
- **Safe operating ruling for this pilot:** Split the activity into two stages:
  1. **Pre-commit QA execution cycle** against the working tree — run the full plan, capture findings, allow BIM-000 rework.
  2. **Official Gate Q finalization** after the Director commits the finished candidate — rerun branch/HEAD/status, committed-diff integrity, and the required final regression checks before issuing the Gate Q verdict.
- **Why this preserves intent:** QA can find defects before creating commit churn, while the final verdict still certifies an immutable committed SHA rather than a moving working tree.
- **Candidate doctrine improvement:** Clarify whether Factory QA formally permits a `PRE-Q` verification cycle before the committed Gate Q candidate. If retained, name the two states explicitly to avoid treating pre-commit results as the official verdict.
- **Status:** Adopted for BIM-000 pilot; evaluate at module close.

---

---

### PJ-014 — P2 verified safely by Director attestation
- **Moment / Stage:** TC-P2 — Stripe secret cleanup prerequisite
- **Evidence:** Director of QA attested that all six `STRIPE_*` keys were removed from `.env.local` and the secrets were rotated/revoked out-of-band.
- **QA ruling:** TC-P2 PASS.
- **Process lesson:** Secret-related prerequisites can be verified without asking the Director to expose `.env.local` contents or secret values.
- **Keep:** attestation-only verification for secret cleanup/rotation prerequisites.
- **Status:** Closed.

---

---

### PJ-015 — P3 correctly blocked on an unresolved Coordinator prerequisite
- **Moment / Stage:** TC-P3 — `phase2.md` recovery verdict
- **Observed evidence:** `agent_docs/DB_BASELINE.md` lines 40–45 still record the sibling `phase2.md` verdict as `PENDING`.
- **QA ruling:** TC-P3 is BLOCKED until the Coordinator either recovers the file into `agent_docs/` or explicitly rules it unrecoverable and updates the Sibling Note.
- **Process lesson:** Preflight is catching administrative/document-state incompleteness before acceptance testing begins; this prevents QA from silently inheriting unresolved campaign setup.
- **Next action:** perform a read-only sibling-repo search before declaring the artifact unrecoverable.
- **Status:** Open.

---

---

### PJ-016 — P3 recovery artifact existed; documentation state lagged behind reality
- **Moment / Stage:** TC-P3 — `phase2.md` recovery prerequisite
- **Observed evidence:** Read-only sibling search found `../cyber-pharma-dev-v1/phase2.md` and also found `agent_docs/phase2.md` already present in the current Phase 3 repo.
- **QA interpretation:** The recovery action appears to have occurred, but `DB_BASELINE.md` still reports the verdict as `PENDING`.
- **Process lesson:** Coordinator housekeeping can complete on disk while the governing status document remains stale. QA must verify both artifact presence and status-document closure.
- **Next action:** compare the two `phase2.md` files byte-for-byte; if identical, update the Sibling Note to the recovered destination and recheck TC-P3.
- **Candidate improvement:** prerequisite checklists should pair every action with its required status-document update, not treat them as separate memory tasks.
- **Status:** Open pending byte comparison + baseline-note update.

---

---

### PJ-017 — Recovered `phase2.md` copy is not byte-identical to sibling source
- **Moment / Stage:** TC-P3 — recovery verification
- **Observed evidence:** `cmp -s ../cyber-pharma-dev-v1/phase2.md agent_docs/phase2.md` returned `DIFFERENT`.
- **QA ruling:** Do not overwrite either file and do not mark P3 PASS. Determine whether the current Phase 3 copy contains intentional later edits, accidental drift, or is the wrong artifact.
- **Process lesson:** "Artifact exists" is insufficient recovery evidence. Recovery provenance needs an integrity check or an explicit transformation note.
- **Next action:** inspect a read-only unified diff before choosing which file is authoritative or updating `DB_BASELINE.md`.
- **Candidate improvement:** recovery prerequisites should specify whether "recovered" means byte-faithful copy or approved adapted copy, and require provenance when adapted.
- **Status:** Open.

---

---

### PJ-018 — Director challenged an apparently impossible recovery mismatch
- **Moment / Stage:** TC-P3 — recovery integrity check
- **Director context:** The Director states `agent_docs/phase2.md` was copied directly from the Phase 2 sibling source, so a semantic/content mismatch should be impossible absent later modification or a copy-time transformation.
- **QA response:** Do not assume the Director is wrong and do not assume `cmp` proves meaningful content drift. `cmp` proves only byte-level difference; line-ending normalization alone can trigger it.
- **Process lesson:** When evidence contradicts a known operator action, verify the verification instrument and distinguish byte identity from semantic/text identity before escalating.
- **Next action:** compare hashes and run a line-ending-normalized diff. Only escalate if meaningful text differences remain.
- **Status:** Open.

---

---

### PJ-019 — QA nearly over-tested beyond the contract
- **Moment / Stage:** TC-P3 — `phase2.md` recovery prerequisite
- **What happened:** After confirming `agent_docs/phase2.md` exists, QA began checking byte-for-byte identity against the sibling source with `cmp`.
- **Director context:** The file was intentionally reconstructed by copying the raw GitHub text into a fresh local `phase2.md`, which can legitimately change invisible bytes/line endings.
- **Contract review:** P3 requires only that `phase2.md` be recovered into `agent_docs/` or ruled unrecoverable. It does **not** require byte-faithful recovery.
- **QA correction:** Stop the byte-identity investigation. Do not invent a stronger acceptance requirement than the approved contract.
- **Process lesson:** Adversarial QA must be strict against the contract, not stricter than the contract. Exploratory checks may discover useful information, but they cannot silently become new pass/fail requirements.
- **Remaining P3 action:** update `DB_BASELINE.md` Sibling Note from `PENDING` to the actual recovered destination.
- **Status:** Corrected; pending status-document update only.

---

---

### PJ-020 — Time-boxing and contract fidelity
- **Moment / Stage:** TC-P3 closeout
- **Ruling:** For the recovered Markdown artifact, content fidelity satisfies P3; byte identity is irrelevant because the acceptance contract did not require it.
- **Director signal:** Avoid low-value rabbit holes during Gate Q; preserve rigor but keep the execution moving.
- **Process lesson:** QA should time-box exploratory checks and stop when they no longer affect an acceptance decision.
- **Status:** Adopted.

---

---

### PJ-021 — TC-002 partial evidence; QA resists substituting adjacent commands
- **Moment / Stage:** TC-002 — AC1 clean-install dependency proof
- **Observed evidence:** `npm ls sass stripe` returned `(empty)`; direct `node_modules/sass` and `node_modules/stripe` paths were absent; `npm audit` reported 0 vulnerabilities.
- **Gap:** The planned `npm ci` clean-install step and the post-`npm ci` `npm ls sass stripe` verification were not yet executed in this QA cycle.
- **QA ruling:** Do not treat `npm audit` as a substitute for `npm ci`; TC-002 remains PENDING until the clean reinstall is executed and the dependency absence is rechecked afterward.
- **Process lesson:** Adjacent evidence can be useful without satisfying the actual test case. Preserve test intent and avoid accidental green-by-substitution.
- **Status:** Open.

---

---

### PJ-022 — AC1 independently verified after clean reinstall
- **Moment / Stage:** TC-002 — dependency removal
- **Observed evidence:** `npm ci` completed cleanly; post-install `npm ls sass stripe` returned `(empty)`.
- **QA ruling:** TC-002 PASS. Combined with TC-001, AC1 is independently verified.
- **Process lesson:** Rechecking dependency absence after a clean install is the decisive proof; pre-existing node_modules state alone is insufficient.
- **Status:** Closed.

---

---

### PJ-023 — Production build independently passed
- **Moment / Stage:** TC-003 — AC2 regression triad
- **Observed evidence:** `npm run build` completed successfully and returned to the shell prompt; route output rendered normally.
- **QA ruling:** TC-003 PASS.
- **Process lesson:** After dependency removal and clean reinstall, the production build remains a high-value regression gate before deeper static/document checks.
- **Status:** Closed.

---

---

### PJ-024 — TypeScript validation independently passed
- **Moment / Stage:** TC-004 — AC2/AC5 regression validation
- **Observed evidence:** `npx tsc --noEmit` completed with no errors.
- **QA ruling:** TC-004 PASS.
- **Process lesson:** Brief plain-English explanation before technical commands helps the Director understand what each gate is proving without slowing execution materially.
- **Status:** Closed.

---

---

### PJ-025 — Full regression triad independently green
- **Moment / Stage:** TC-005 — AC2 Jest regression
- **Observed evidence:** Jest completed with `26 passed / 26 total` suites and `120 passed / 120 total` tests, 0 failures, runtime 3.369s.
- **QA ruling:** TC-005 PASS. Combined with TC-003 and TC-004, AC2 is independently verified.
- **Process lesson:** The frozen triad board is functioning as a clean module-to-module regression contract.
- **Status:** Closed.

---

---

### PJ-026 — `.env.example` key contract independently matched
- **Moment / Stage:** TC-006 — AC3 env contract
- **Observed evidence:** `.env.example` exposed exactly five keys: `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`.
- **QA ruling:** TC-006 PASS. No `STRIPE_*` or `NEXT_PUBLIC_API_BASE_URL` key appeared.
- **Process lesson:** Key-name-only extraction is a safe, fast way to verify env contract shape without exposing values.
- **Status:** Closed.

---

---

### PJ-027 — Dynamic env access prevented a premature AC3 PASS
- **Moment / Stage:** TC-007 — independent env-consumer sweep
- **Observed evidence:** Named `process.env.*` usages visible in the sweep map to the expected contract keys. A bracket-style dynamic access was independently found at `src/instrumentation.ts:20` as `process.env[key]`.
- **QA ruling:** TC-007 remains PENDING until the key list feeding that dynamic access is inspected. A simple named-key grep cannot prove parity when dynamic lookup exists.
- **Process lesson:** The bracket-access probe adds real value; verification must follow dynamic indirection to the actual key source rather than assuming the named grep is complete.
- **Status:** Open pending instrumentation key-list inspection.

---

---

### PJ-028 — Dynamic env indirection resolved cleanly
- **Moment / Stage:** TC-007 — AC3 env-consumer sweep
- **Observed evidence:** `src/instrumentation.ts` defines `REQUIRED_ENV` as exactly four keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`. The fifth contract key, `NEXT_PUBLIC_ENABLE_MOOSE_PORTAL`, is consumed directly elsewhere and is intentionally optional at boot.
- **QA ruling:** TC-007 PASS. Combined with TC-006, AC3 is independently verified.
- **Additional observation:** Future Stripe env names appear only in comments as deferred Phase 7 additions, not as active consumers.
- **Process lesson:** Follow dynamic env lookups to their key source before judging parity; comments and deferred names are not runtime consumers.
- **Status:** Closed.

---

---

### PJ-029 — Artifact persistence policy clarified during first live QA run
- **Moment / Stage:** TC-008 / QA execution
- **Observed need:** The live QA session is producing multiple journal revisions because the chat workspace does not reliably support overwriting the same generated artifact.
- **Director question:** Whether every generated file/version should be downloaded during the run.
- **Ruling:** Do not preserve every transient revision. Keep only the latest canonical working artifacts during execution, then consolidate at Gate Q close.
- **Canonical QA artifacts to preserve:** `QA_PLAN_BIM-000-CYBER-PHARMA.md`, `QA_TEST_CASES_BIM-000-CYBER-PHARMA.md`, the latest consolidated QA Process Journal, and the final `GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`.
- **Process lesson:** Factory QA needs a clear artifact-retention rule distinguishing temporary working revisions from canonical closeout artifacts.
- **Status:** Adopted for BIM-000 pilot.

---

---

### PJ-030 — GHL fossil absence independently verified
- **Moment / Stage:** TC-008 — AC4
- **Observed evidence:** Director of QA confirmed `temp/ghl-example.json` is absent using the prescribed filesystem check.
- **QA ruling:** TC-008 PASS; AC4 independently verified.
- **Status:** Closed.

---

---

### PJ-031 — Director prefers scripted QA execution over command-by-command shell work
- **Moment / Stage:** Mid-Gate-Q execution before TC-009
- **Director preference:** When a QA run contains many repeatable shell checks, package them into a safe script rather than making the Director manually type every command.
- **Ruling:** Automate deterministic, non-secret, non-adjudicative checks; keep human judgment and source-of-truth comparisons manual.
- **Pilot artifact:** `qa_bim000_remaining.sh` runs the remaining safe checks, labels test cases, and captures evidence into `qa_bim000_evidence.log`.
- **Safety constraints:** no `.env.local` reads, no git commits, no source edits, no silent substitution for AC7 human evidence or the missing AC8 legacy predicate.
- **Process lesson:** The Director should operate the QA machine, not become its command typist. Scriptable verification is a Factory asset when it preserves traceability and human gates.
- **Candidate doctrine improvement:** Add a standard per-module QA runner artifact when the test plan has several deterministic CLI checks.
- **Status:** Adopted for BIM-000 pilot.

---

---

### PJ-032 — QA runner execution-root bug produced false failures
- **Moment / Stage:** Scripted QA pilot after TC-008
- **Observed evidence:** The Director launched `qa_bim000.sh` from the repo's `scripts/` directory. The runner used relative paths and therefore searched for `scripts/tsconfig.json`, `scripts/README.md`, `scripts/src/`, etc. This produced false FAIL results for TC-009, TC-010, and TC-012 and made some git path checks unreliable.
- **QA ruling:** Discard the affected pass/fail outcomes from that runner execution. They are test-instrument failures, not BIM-000 product failures. Do not route anything to Engineering from this run.
- **Root cause:** The QA runner assumed current working directory = repo root.
- **Correction:** Runner v2 resolves the repository root with `git rev-parse --show-toplevel`, changes to that directory internally, and uses root-qualified paths. It is safe to launch from anywhere inside the repo.
- **Process lesson:** Factory QA scripts must be location-independent or fail closed with a clear preflight. A test instrument must verify its own execution context before grading the product.
- **Additional observation:** The standalone `scripts/lint-check.sh` reported 0 errors and 34 warnings, including 23 `no-explicit-any` warnings across 6 files. That lint result uses a broader/different predicate than AC8's frozen production `any` baseline and must not be substituted for AC8 without reconciling scope/predicate.
- **Candidate doctrine improvement:** Every QA runner begins with repo-root discovery + environment preflight and prints the resolved root before any test case.
- **Status:** Runner corrected; rerun required.

---

---

### PJ-033 — Corrected runner was not actually deployed; execution proved old artifact remained
- **Moment / Stage:** Immediate rerun after PJ-032
- **Observed evidence:** The second run still printed `Repo: .../scripts` rather than the corrected runner's `Repo root: ...`, proving the local `scripts/qa_bim000.sh` was still the old version.
- **QA ruling:** Discard this run's relative-path-driven results as well; no BIM-000 defect established.
- **Recovery:** Avoid another file-replacement round trip. Because the old runner is otherwise usable when launched from the repository root, run it from repo root (`cd .. && ./scripts/qa_bim000.sh`).
- **Process lesson:** When distributing revised QA tooling, include a visible version/self-identification marker and the fastest fallback execution path. Tool deployment itself is part of QA ergonomics.
- **Candidate doctrine improvement:** QA runner header should print `runner_version`, `repo_root`, and abort if required anchor files are missing.
- **Status:** Open until clean rerun.

---

---

### PJ-034 — Correct repo-root run exposed predicate-scope bugs, not product defects
- **Moment / Stage:** Batched remaining-check runner, first valid repo-root execution
- **Observed evidence:** TC-009 and TC-010 passed cleanly. The runner reported AC8 failures because its generic greps included `src/__tests__` and a CSS comment, while the frozen AC8 contract explicitly says **production** `any` = 2, **production** `user_metadata` role smells = 0, and the legacy numbered-color predicate = 5.
- **Adjudication:** The output itself shows exactly two non-test `any` hits (`src/components/ui/command.tsx`, `src/utils/supabase/server.ts`), while all remaining `any` hits are under `src/__tests__`. The sole role-smell hit is also under `src/__tests__`. The boundary-aware color probe hit only the banning comment in `src/app/globals.css`, not a runtime utility.
- **Root cause:** QA runner predicates did not encode the acceptance criterion's production/test boundary, and the exploratory color regex did not exclude comments.
- **Correction:** Use a dedicated AC8 runner that excludes test paths for the production predicates and replays the exact recon-original numbered-color grep for the frozen `5` baseline.
- **Process lesson:** A QA script must encode the criterion's semantic scope, not merely its keyword. Test code and comments can turn correct product state into false failures.
- **Status:** AC5/AC6 passed; AC8 rerun required with corrected predicates.

---

---

### PJ-035 — Evidence-log naming caused stale-log confusion
- **Moment / Stage:** AC8 rerun handoff
- **Observed evidence:** The Director pasted `scripts/qa_bim000_evidence.log` from the earlier invalid 21:21:54 run rather than the new dedicated AC8 evidence log.
- **QA ruling:** Ignore that stale log; it does not supersede the valid repo-root 21:24:28 run and it is not the requested AC8 rerun evidence.
- **Process lesson:** QA scripts should use unique, test-specific evidence filenames and print the exact output path prominently to avoid stale-log mixups.
- **Candidate doctrine improvement:** Never reuse a generic evidence filename across materially different QA runners.
- **Status:** Open until dedicated AC8 rerun evidence is received.

---

---

### PJ-036 — AC8 frozen baseline independently reproduced
- **Moment / Stage:** Dedicated AC8 rerun
- **Observed evidence:** Production `any` hits = 2 (`src/components/ui/command.tsx`, `src/utils/supabase/server.ts`); production `user_metadata` role-smell hits = 0; exact recon-original numbered-color predicate count = 5.
- **QA ruling:** TC-012 PASS, TC-013 PASS, TC-014A PASS; AC8 independently verified.
- **Important interpretation:** The numbered-color count is a frozen instrumentation baseline, not five confirmed UI defects. The matched set includes predicate artifacts such as translate classes and a comment, which is consistent with the known limitation already tracked.
- **Process lesson:** Preserve both the frozen legacy predicate for regression comparability and a corrected exploratory predicate for future instrumentation cleanup.
- **Status:** Closed.

---

---

### PJ-037 — Original AC7 catalog paste unavailable at Gate Q
- **Moment / Stage:** TC-011 / AC7
- **Observed condition:** Director no longer has the original 2026-08-11 live Supabase catalog paste that Engineering transcribed into `agent_docs/DB_BASELINE.md`.
- **QA consequence:** A byte-faithful historical diff against the original 2026-08-11 evidence cannot be performed.
- **Recovery plan:** Perform a fresh, read-only live catalog query for public tables and RLS policy names. Compare the current live state to `DB_BASELINE.md`. Treat this as substitute evidence, not as proof of the missing historical paste. If identical and there have been no known DB writes since 2026-08-11, QA may close AC7 with the evidence limitation explicitly recorded.
- **Process lesson:** Source-of-truth captures needed by Gate Q must be preserved inside the module evidence package, not left only in transient chat/terminal output.
- **Candidate doctrine improvement:** Any Coordinator-owned live catalog used to seed an acceptance criterion should be saved under the module action folder before Engineering starts.
- **Status:** Fresh read-only recatalog required.

---

---

### PJ-038 — AC7 policy half independently re-verified live
- **Moment / Stage:** TC-011 / AC7 fresh substitute catalog check
- **Observed evidence:** Fresh live `pg_policies` output shows exactly three public policies: `Profiles are updatable by owner or superadmins`, `Profiles are viewable by owner or superadmins`, and `Users can read their own role`.
- **QA ruling:** AC7 policy-name portion PASS. Table-inventory portion remains pending because only the policy result set was supplied.
- **Process lesson:** When a verification step returns multiple result sets, label the evidence expected from each so partial submissions can be graded without ambiguity.
- **Status:** Partial PASS; waiting for live public table inventory.

---

---

### PJ-039 — AC7 live catalog fully re-verified
- **Moment / Stage:** TC-011 / AC7 fresh substitute catalog check
- **Observed evidence:** Fresh live table inventory shows exactly `public.profiles` and `public.user_roles`. Fresh live policy inventory shows exactly the three expected policies.
- **QA ruling:** TC-011 PASS; AC7 independently verified against current live catalog.
- **Evidence caveat:** The original 2026-08-11 Coordinator paste is unavailable, so this is fresh substitute live evidence rather than a historical byte-for-byte comparison.
- **Process lesson:** Coordinator-owned catalog captures that seed acceptance criteria should be preserved in the module evidence package before Engineering starts.
- **Status:** Closed.

---

---

### PJ-040 — Recovered prerequisite remained stale in DB_BASELINE note
- **Moment / Stage:** Final prerequisite re-check after AC7
- **Observed evidence:** `agent_docs/DB_BASELINE.md` still records the `phase2.md` sibling verdict as `PENDING`, even though `agent_docs/phase2.md` was recovered earlier by the Coordinator.
- **QA ruling:** P3 is not formally closed until the Coordinator updates the baseline note to reflect the already-completed recovery. This is documentation state drift, not an Engineering product defect.
- **Recovery:** Update the Sibling Note verdict to `RECOVERED` and name `agent_docs/phase2.md` as the recovery destination, then re-grep the section.
- **Process lesson:** Coordinator prerequisites need an explicit close-state update in the canonical evidence artifact; completing the action without updating the record leaves Gate Q blocked.
- **Status:** Open pending note correction.

---

---

### PJ-041 — P3 prerequisite formally closed
- **Moment / Stage:** Final prerequisite re-check before AC9 closeout
- **Observed evidence:** `agent_docs/DB_BASELINE.md` now records that `phase2.md` was recovered from the sibling repo and placed at `agent_docs/phase2.md`; verdict is `RECOVERED`.
- **QA ruling:** P3 PASS.
- **Process lesson:** Coordinator prerequisite completion must be reflected in the canonical evidence artifact before Gate Q can close.
- **Status:** Closed.

---

---

## Gate Q Running Log

- PRE-Q execution completed through AC1–AC8 and P2/P3.
- AC9 pre-commit scope review completed; zero `src/**` writes observed.
- Engineering cleanup/regression handoff returned green.
- Official Gate Q finalization remains pending the Coordinator's final commit and committed-SHA certification.

---

## Gate Q Cycle Summary

- **Cycle:** 1 (PRE-Q)
- **Verdict:** PENDING OFFICIAL FINALIZATION
- **Product defects requiring Claudy rework:** 0
- **QA-tool/process defects discovered:** multiple; captured above
- **Rework loops:** process/tooling corrections only
- **Coordinator friction:** command-by-command execution, evidence-source gaps, stale status docs, cleanup ownership
- **QA-process friction:** runner cwd assumption, stale evidence filenames, predicate scope ambiguity, missing historical catalog capture

---

## Harvest — After BIM-000 Closes

### Keep
- Independent Acceptance-Spec-driven QA.
- Director attestation for secret cleanup without exposing values.
- PRE-Q execution before final commit, followed by immutable committed-SHA certification.
- Separate Engineering, QA execution, QA adjudication, and release authority.
- Regression-first closeout.

### Change
- Add a formal QA intake checklist.
- Preserve exact verification predicates with acceptance evidence.
- Preserve Coordinator-owned live evidence inside the module package.
- Make QA runners repo-root-aware, self-identifying, fail-closed, and test-specific in evidence filenames.
- Add a dedicated QA execution-agent step before final commit when mechanical checks/cleanup are substantial.
- Formalize `QA_TEST_CASES.md` alongside `QA_PLAN.md` and `GATE_Q_REPORT.md`.

### Drop
- Director manually typing long sequences of deterministic QA shell commands.
- Treating exploratory checks as stronger acceptance requirements than the frozen contract.
- Reusing generic evidence-log filenames across materially different QA runners.
- Treating QA-tool failures as product failures.

### Candidate Factory Amendments
- Formal PRE-Q state before official Gate Q.
- Standard QA execution agent ("Cody") under Sol, with Tony retaining final git/release control.
- QA runner contract and `AGENTS.md` governance.
- Campaign journal staging as campaign-launch prerequisite.
