# PHASE 3 — CAMPAIGN JOURNAL
## Process Telemetry: How the Factory Behaves in the Real World

**Project:** Cyber Pharma v1 · **Campaign:** Phase 3 BIM Campaign (map v1.0)
**Purpose:** record how the PROCESS behaves — not what gets built (retrospectives own that). This journal is the ore for BIM_PLAYBOOK v1.1; it gets harvested at campaign close into a playbook amendment kit. Maintained by JARVIS at each module close + at friction moments; Coordinator reviews and corrects.
**Standing rule:** every future Factory campaign (Phase 4+, MissionControl backend, Payment Portal, demo portal) keeps its own journal and harvests it at close. The journal is how the factory compounds.

---

## Entry Template (per module)

```
### [MODULE-ID] — closed YYYY-MM-DD
- Playbook prescribed: (what the doctrine said should happen)
- Actually happened: (what did)
- Divergence + why: (none | description; improvised rulings the playbooks lacked)
- Gate Q cycles: N (verdicts received, in order; reasons for any FAIL/BLOCKED)
- Handoff friction: (folder freeze, AC clarity, spec disputes, restarts)
- Coordinator overhead: (git/cloud/admin actions this module demanded)
- Time shape: (sessions consumed; where time actually went vs expectation)
- Keep / Change / Drop: (one line each — the harvest seeds)
```

---

## Entry 0 — Campaign Starting Conditions (2026-08-11)

**Governing doctrine at campaign open:** BIM_PLAYBOOK v1.0 (ACTIVE; pilot-tested on ADK Harness, six modules, rig conditions) · FEAT_PLAYBOOK v1.0 (ACTIVE; unused so far) · BUG_FIX_PLAYBOOK v0.1 + amendment kit (NOT finalized — base file still missing; FIX-001 will run on the amendment kit as active record) · QA_PLAYBOOK + AC-sync patch (patch NOT yet applied to live repo — pre-flight item 2) · SOFTWARE_FACTORY_PLAYBOOK + module-identity insert kit (same status) · Campaign Map v1.0 (this campaign's own invention — the map itself is an untested artifact class).

**What is untested about the doctrine (the campaign's process-risk register):**
1. BIM_PLAYBOOK has never run outside the rig — mothership conditions add: real repo history, a live deployed surface, KIP registry interplay, doc-repo/project-repo split, and a Coordinator juggling three principals.
2. FIX modules have never run under the amendment-kit-only state (no finalized base playbook). FIX-001 is the live test of whether that's workable or clunky.
3. The AC-seed pattern (map pre-seeds ACs → module ACCEPTANCE_SPEC refines) is new — invented in the Campaign Map. Nobody knows if pre-seeded ACs help Sol or fight him.
4. The parallel rig lane (Proto 06 running during BIM-000..001 with a hard transfer-gate on BIM-002) is the first simultaneous rig+mothership operation. Coordination cost unknown.
5. Sol's QA loop has never gated database-shaped deliverables (migrations, policies, seeds) — everything pilot-tested was app-code-shaped. The five-word vocabulary may need interpretation guidance for "the migration replayed clean but the shadow project diff has a naming nit."
6. Two-lab operation (this Architect lab + Engineer terminal + QA lane) at campaign scale — context-transfer overhead between labs is the standing suspect for where time silently goes.

**Pre-registered predictions (so the harvest is honest — graded at close):**
- P1: BIM-001 will overrun its estimate; migration authoring against a 15-table contract will surface at least three DATA_CONTRACT ambiguities requiring Architect rulings mid-module.
- P2: The AC-seed pattern will save net time but at least one module's seeds will need rewriting because the build revealed the seed tested the wrong thing.
- P3: The Proto 06 transfer gate will hold BIM-002 authoring by some days — and it will be worth it (zero policy rework downstream).
- P4: At least one improvised process ruling will be needed that no playbook covers (candidate: how migration files are reviewed at Gate Q — diff-reading vs replay-evidence).
- P5: The journal itself will get skipped at least once under momentum and need backfilling (meta-prediction; if it happens, the v1.1 amendment needs a cheaper capture mechanism).

**Starting facts:** repo `cyber-pharma-dev-v1-phase-3` @ 6f6e63d, triad green at 26/120, DB baseline documented (2 tables / 3 policies), pre-flight checklist items 1–5 open at time of writing.

---

## Module Entries

### BIM-000-CYBER-PHARMA — closed 2026-08-14 (Gate Q PASS; final close-out batch committed 2026-08-27 post-Coordinator-absence)

- **Playbook prescribed:** author FINAL from recon → Coordinator scope approval → Engineer ONE-message Plan Mode → plan-QA → build → spec finalized with evidence → Coordinator commits per concern → Gate Q against committed SHA → verdict → close.
- **Actually happened:** prescribed path held end-to-end with ONE structural improvisation: Gate Q split into **PRE-Q on the working tree, then certification** (Director ruling — QA/rework before one final commit). Engineer surfaced 4 plan-mode flags instead of resolving; all ruled by Architect/Coordinator. Spec finalized with evidence; Sol built a 23-case plan with declared gaps and ran it with the Director as hands. Verdict: **PASS, zero rework** — first-attempt clean.
- **Divergence + why:** (1) PRE-Q invention — playbook's commit-then-QA sequence fought the Director's preference for a single clean close commit; ruled live, worked well, v1.1 candidate. (2) Branch drift — spec said `bim-000-cyber-pharma`, disk said `phase-3-1`; disk won; single-branch small-module pattern needs a playbook sentence. (3) QA intake was assembled ad hoc (spec + handoff + baseline + missing catalog paste) — the intake-checklist gap. (4) Coordinator hospitalization froze the machine one commit from close for ~13 days; the freeze was CLEAN — recap + RECOVERY + journal rebuilt full context in one session. Disaster drill passed by accident.
- **Gate Q cycles:** 1 (PASS). Within the cycle: one QA self-correction (contract-overreach on phase2.md, ruled back to contract-strictness) and one evidence substitution (missing 08-11 catalog paste → fresh read-only catalog, documented not hidden).
- **Handoff friction:** spec-lifecycle ambiguity (seeded vs finalized perceived as two artifacts — banner fix queued); stale-log/evidence-filename confusion; runner cwd false-failures. All logged with candidate rules.
- **Coordinator overhead:** 7 per-concern commits + close batch; Stripe key purge/rotation; phase2.md sibling recovery; journal staging (missed pre-launch — P5); PRE-Q adjudications; Gate Q terminal execution as Sol's hands.
- **Time shape:** authoring <1 session · plan+build 1 session (2026-08-13) · PRE-Q+Gate Q ~1 day (08-13→14) · close-commit latency 13 days (external, hospitalization — not process cost). Est. "light (one session)" held for build; QA end-to-end roughly doubled wall time — expected for the ritual's maiden run.
- **Keep:** AC-seed pattern (Sol consumed the seeded ACs directly into traceability — zero friction; P2 partially unsupported so far) · plan-mode flag culture (caught a defective instrument pre-build) · PRE-Q · attestation-vs-observation discipline in QA evidence.
- **Change:** journal staging = campaign-launch prerequisite · QA_INTAKE_CHECKLIST standard · Coordinator source evidence preserved inside the module package · spec lifecycle banner · unique evidence filenames · repo-root fail-closed runners · boundary-aware predicates.
- **Drop:** nothing yet — no prescribed step proved dead weight on a light module; re-evaluate on BIM-001's heavier run.
- **Prediction scoreboard after module 1:** P4 CONFIRMED (multiple improvised rulings: PRE-Q, contract-strictness, evidence substitution) · P5 CONFIRMED (staging failure, self-caught) · P2 leaning against (seeds held) · P1/P3 pending (BIM-001/002 not yet run).
- **New org proposal surfaced (route to Coordinator decision before BIM-001):** "Cody" — dedicated QA execution agent for deterministic scripting/collection; Sol retains adjudication; Director retains git. Origin: runner-cwd + evidence-log pain.

---

## Friction Log

### 2026-08-13 — BIM-000 Plan Mode (pre-build; Architect-logged)

- **Engineer FLAG-1 — journal not staged:** manager cited the journal as "live"; it wasn't on disk in the project repo (pre-flight item 1 unexecuted). First P5 signal, later confirmed at PRE-Q (see below).
- **Engineer FLAG-2 — predicate artifact discovered at plan time:** the numbered-color grep's 5 hits are `translate-`/`slide-` substrings + the banning comment itself; real violations 0. Ruled: gate stands frozen for comparability this module; instrument rebuilt at campaign level. First live P4 evidence — caught before a single build line, by the plan-mode verification ritual.

### 2026-08-13–14 — BIM-000 PRE-Q / first live Gate Q friction

- **Acceptance Spec lifecycle ambiguity:** seeded spec vs Engineer-evidence-filled spec was initially perceived as two artifacts. Candidate fix: lifecycle banner `SEEDED → ENGINEER EVIDENCE-FILLED → QA-VERIFIED`.
- **QA intake incompleteness:** Gate Q needed finalized spec + handoff + DB baseline + Coordinator-owned source evidence. Candidate fix: standard `QA_INTAKE_CHECKLIST`.
- **Branch-name drift:** Acceptance Spec named `bim-000-cyber-pharma`; disk/handoff branch was `phase-3-1`. Disk truth won; document drift logged.
- **PRE-Q ruling:** Director prefers QA/rework before one final commit. Pilot split into PRE-Q on working tree, then official Gate Q certification against committed SHA.
- **Contract overreach caught:** QA began byte-comparing recovered `phase2.md` even though P3 required only recovery into `agent_docs/`. Ruling: adversarial QA must be strict to the contract, not silently stricter.
- **Historical evidence retention gap:** original 2026-08-11 DB catalog paste was unavailable at Gate Q. Fresh read-only catalog matched baseline, but historical byte-faithful comparison was impossible. Candidate fix: preserve Coordinator-owned source captures inside the module evidence package.
- **Verification-instrument defect:** frozen numbered-color grep still returns 5 artifacts while true violations are 0. Keep frozen predicate for comparability; design corrected boundary-aware instrument for future modules.
- **QA runner cwd defect:** first scripted runner assumed repo-root execution and produced false failures when launched from `scripts/`. Candidate rule: resolve repo root, print runner version/root, fail closed on missing anchors.
- **Predicate semantic-scope defect:** generic greps counted test fixtures/comments as production violations. Candidate rule: QA instruments must encode semantic scope, not just keywords.
- **Evidence-log confusion:** generic log names caused a stale invalid run to be pasted as current evidence. Candidate rule: unique test-specific evidence filenames.
- **Execution-agent opportunity:** deterministic QA scripting/collection should move to a dedicated QA execution agent ("Cody"), while Sol retains adjudication and the Director retains commit/push authority.
- **Pre-commit cleanup handoff:** after QA, Engineering/QA execution agent performs bounded cleanup + regression and returns a clean working-tree report; Director performs git writes manually.
- **Campaign-journal staging failure:** the canonical journal existed in the Architect workspace but was never staged into the repo, validating prediction P5. Candidate rule: journal presence is a campaign-launch prerequisite, not a module-close memory task.


---

## Harvest (at campaign close)

*(graded predictions P1–P5 · Keep/Change/Drop rollup · the BIM_PLAYBOOK v1.1 amendment kit draft)*
