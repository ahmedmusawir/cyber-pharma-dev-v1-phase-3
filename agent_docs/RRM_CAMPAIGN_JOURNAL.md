# RRM CAMPAIGN JOURNAL — FFM REVIEW REWORK

**Project:** Cyber Pharma v1 · **Campaign:** RRM (Phase 3, inserted) · **Started:** 2026-09-20 · **Owner:** Architect (Fable) for Architect entries; SOL for QA-logged entries; Tony is the merge point.
**Rules (same as `PHASE_3_CAMPAIGN_JOURNAL.md`):** two-seat append-only; narrative, never rewritten; one Architect entry and one QA-logged (Sol) entry per module at closeout; a friction log filed by the Architect from Director observations; doctrine-level rulings are distilled separately into `CYBER_PHARMA_P3_DOCTRINE_JOURNAL.md` for doc-stack intake (this file is the ore, not the sync input).

---

### RRM CAMPAIGN — intake closed 2026-09-20 (Architect)

- **Playbook prescribed:** HQ RRM_PLAYBOOK v0.1 — Architect inventories reviews and specimens, reconciles against current source, proposes one disposition per material finding, Director rules, Architect authors the executable module from the kit. Recon before writing is mandatory; reports about old code cannot establish today's defect by themselves.
- **Actually happened:** Package received 17 Sep (HQ operating model, playbook, reviewer candidate, kit, both review archives). Both reviews read end to end 18 Sep; 21 raw findings deduplicated to ~17 topics; first disposition proposal same day, with the Owed-KPI formula traced to the legacy demo extraction (`TONY_DEMO_04`) rather than invented. Director supplied repo facts (same repo except FIX-001 and the BIM migrations) and the Phase 3 records. Claudy recon (skill `stark-recon-skill-v1.1`, augmented by a nine-lane Architect prompt) landed as Revision 2 on 18 Sep: 17 claims VERIFIED on disk, F5/F7 CHANGED (closed by FIX-001), four details moved; the reviews had targeted the **sibling** repo `cyber-pharma-dev-v1`, so commit equivalence is unprovable and disk re-verification became the basis of record. Recon also read the certified BIM-003 wrappers and found they **mirror** the mock's KPI equality and null-PBM drop by contract — two "mock bugs" became Phase 5 contract rulings. Director ran `pg_get_functiondef` on the dev database 20 Sep: the installed `handle_new_user()` assigns role from signup metadata (A-002 live); chain 0001–0047 does not replace it. Director issued final rulings D1–D7 the same day, amending five of the Architect's seven proposals: remove public signup and Moose outright rather than harden; disclosure approved; dependencies inside the campaign; Report control retained exactly; numbered naming; future-removal gate superseded. Architect's first packet was a single module with five stages; Director corrected the shape to the factory grammar — a campaign map listing one module per bounded scope, a journal, and one pack per module under `ACTIONS/`. Campaign map v1.0 (four modules) and RRM-001 pack authored 20 Sep.
- **Divergence + why:** (1) The Architect assumed "one review cycle = one module" and stacked four kinds of work into stages; the factory's unit of certification is the module, and four proofs with four rollback stories are four modules. Rule: **decompose by proof type and rollback boundary, exactly as BIM decomposition does.** (2) Review claims were treated as applicable until disk said otherwise — correct; three of 21 would have been false work without recon. (3) Certified backend contracts had ratified frontend mock behavior; the Architect nearly proposed changing the mock alone. Rule: **read the certified contracts before classifying a mock finding.** (4) A live backend exposure surfaced inside a frontend intake; it was routed out as three separately-evidenced items (application removal / Supabase containment / trigger migration) rather than absorbed. (5) The Phase-2.1 specs on disk are v1.0; the code cites v1.3/v1.4 never located. Nullable `pbm` was settled from Frank's Ruling 5 (unmatched → Take Action is a real state) instead of a version hunt — behavior question answered, document question dropped.
- **Gate Q cycles:** n/a (intake).
- **Handoff friction:** the HQ package's `00_START_HERE` read order worked. The Architect's first pack put a register file inside `ACTIONS/` and would have confused engineers who only expect module folders there. Astra's export lacked the 47 migrations, so its two SQL findings were about legacy files, not the canonical chain — reviewer manifests must state which trees were excluded. Fable's F5/F7 were already closed by FIX-001 four days before the review was written — reviews of a sibling checkout lag the working repo.
- **Director overhead:** repo-state briefing; two dashboard reads (trigger body, signup/confirmation settings); five rulings plus the seven money rules in one sitting; one shape correction; branch already cut (`phase-3-rrm-ffm`, to be renamed).
- **Time shape:** 17 Sep package → 18 Sep proposal + recon → 20 Sep rulings + campaign authoring. Three sessions.
- **Keep:** disk re-verification with file:line as the equivalence evidence · dedupe before counting · trace finding IDs end to end (F/A → R → module → AC) · read certified contracts during intake · route out-of-scope exposures with named owners and distinct evidence · the Architect proposes, the Director rules, scope comes only from rulings.
- **Change:** author RRMs as a campaign from the first proposal · reviewer manifests state excluded trees · recon prompt asks for certified-contract cross-checks by default.
- **Drop:** "one module with five stages" as an RRM shape · any statement that a review commit matches the working repo without proof · "already resolved" without a regression AC.
- **Doctrine-harvest seeds:** RRM decomposition rule (proof type × rollback boundary) · certified-contract-before-classification · three-evidence-item pattern for exposures found outside the module's reach · sibling-repo reviews need disk reconciliation, not SHA matching.

### Friction log — RRM intake (Director-observed, filed by Architect)

- 2026-09-18 — Reviews targeted `cyber-pharma-dev-v1`; working repo is `cyber-pharma-dev-v1-phase-3`. `f1113177` absent. Resolved by disk re-verification.
- 2026-09-18 — Phase-2.1 specs dropped on disk were v1.0; later versions cited by code not located. Resolved by ruling on the behavior (E-03).
- 2026-09-18 — Claudy recon deviated from the literal "unset env" instruction because `.env.local` auto-loads; used blank-string overrides instead and said so. Correct behavior.
- 2026-09-20 — Director confirmed A-002 live via `pg_get_functiondef`. Containment (dashboard toggle) separated from correction (migration).
- 2026-09-20 — First packet shape rejected: single module, five stages, register file inside `ACTIONS/`. Rebuilt as campaign map + journal + one pack per module.

---

### Entry template (one Architect entry + one QA-logged (Sol) entry per module at closeout)

**`### RRM-00N-CYBER-PHARMA — closed <date> (Architect)`**
- **Playbook prescribed:** · **Actually happened:** · **Divergence + why:** · **Gate Q cycles:** · **Handoff friction:** · **Director overhead:** · **Time shape:** · **Keep:** · **Change:** · **Drop:** · **Doctrine-harvest seeds:**

**`### RRM-00N-CYBER-PHARMA — QA engagement closed <date> (QA-logged (Sol))`** — same headings, SOL's seat, never edited by the Architect.

**`### Friction log — RRM-00N (Director-observed, filed by Architect)`** — dated one-liners.
