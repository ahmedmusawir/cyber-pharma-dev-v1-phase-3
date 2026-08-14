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

*(appended at each module close)*

---

## Friction Log

*(timestamped one-liners captured hot, any time the process — not the product — fights us)*

- **2026-08-13 (BIM-000 Plan Mode):** Engineer FLAG-1 — journal file not on disk in the project repo; manager cited it as "live" but pre-flight item 1 (doc-repo staging) hadn't executed. Capture mechanism gap: the journal must be STAGED before the first module launches, or friction notes have no destination. → v1.1 candidate: "journal staging is a launch precondition of module zero."
- **2026-08-13 (BIM-000 Plan Mode):** Engineer FLAG-2 — the campaign's numbered-color grep predicate is an artifact (substring matches on `translate-`/`slide-` + the banning comment itself); real violation count 0, not 5. Process lesson: verification predicates need word-boundary discipline and must themselves be verified before being written into gates. Ruled: gate stands as written this module; predicate rebuilt at campaign level. First live P4 evidence (improvised ruling, no playbook coverage).

---

## Harvest (at campaign close)

*(graded predictions P1–P5 · Keep/Change/Drop rollup · the BIM_PLAYBOOK v1.1 amendment kit draft)*
