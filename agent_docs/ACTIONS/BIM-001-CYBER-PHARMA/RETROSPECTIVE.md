# RETROSPECTIVE — BIM-001-CYBER-PHARMA
## Schema Migrations: Sixteen-Table Target Schema · Engineer close, 2026-08-28

> What fought back. Campaign journal (P1 prediction: "BIM-001 will overrun; ≥3 ambiguities needing rulings") — grade it against this list.

---

## What fought back (chronological)

1. **The authority docs weren't on disk (plan FLAG-A).** FRANK_API catalog, TRIANGULATION_DOC, DATA_CONTRACT — all lived in the Architect's lab, none in the repo. The doc-repo/project-repo split the journal pre-registered as campaign risk #1 fired on the first heavy module. **Fixed by process:** AUTHORITY/ package staged into the module folder with a precedence README. **v1.1 candidate:** authority staging = module-launch prerequisite for schema/contract modules, like journal staging.
2. **The toolchain didn't exist (plan FLAG-B).** No supabase CLI, docker, or psql. Resolved: `npm i -D supabase pg`, node+pg runners, Director-provided throwaway projects. Board re-run after install per standing law (held green).
3. **X0 found the Verified Ground wrong:** `update_updated_at()` never existed on live or in any disk SQL — DATA_CONTRACT §3's three-function claim was starter-kit-v2 documentation, not this deployment. Ruled option (i): 0001 creates it (assert-then-create). ERRATUM.md filed; DATA_CONTRACT amendment queued for Director staging. **Lesson:** "verify they exist after deployment" checklists must be executed at deployment, not inherited as fact.
4. **The RLS event trigger's name ≠ its function's name** (`ensure_rls` vs `rls_auto_enable`). Doctrine referred to it by function name; asserts needed the trigger name. Captured at X0, ruled into rider 1.
5. **IPv6-only direct DB hosts.** `db.*.supabase.co` has no A record; this machine has no IPv6 route. Session pooler + region discovery (scratch `aws-1-us-west-1`, replica `aws-1-ap-south-1` — note the newer `aws-1-*` pooler generation; the classic `aws-0-*` sweep alone finds nothing). **Runner lesson:** pooler URLs are the portable form for engineer-side gate runs.
6. **The verify instrument false-failed a correct schema.** `information_schema.constraint_column_usage` silently hides tables the connecting role doesn't own — the auth.users FK looked missing when it wasn't. Rewritten on `pg_constraint`. This is the third instrument-defect of the BIM-000 "boundary-aware predicate" class; **v1.1 candidate:** QA/verify instruments must prefer pg_catalog over information_schema on Supabase (privilege-filtered views lie).
7. **The "factory-fresh" replica wasn't.** It carried a foreign deployment (StarkReads-shape user-scoped `subscriptions` + 4 policies, a `keepalive` table, a different policy-name lineage). STOPPED per no-silent-fixes; Director authorized the wipe explicitly; only then rebuilt. **Lesson:** target-state assertion before destructive prep is not paranoia — it caught a mischaracterized target on its first live use. (AC1's negative test banked a bonus: the loud-fail fired against that foreign state too.)
8. **`supabase gen types --db-url` hard-requires Docker** in CLI 2.116.0. Resolved by modified option (a): Director-as-hands ran login → gen types → logout, credential never entering the session. **Pattern worth naming:** the X0-catalog "Director's hands" move generalizes to any credentialed one-shot.

*(Completeness note, close-out 2026-08-31: the plan carried a third launch flag —
FLAG-C, the junction-role vocabulary conflict (catalog `'admin'|'user'` vs R-3's
`'admin'|'member'`). Pre-resolved by R-3 at plan time, kept visible so the "verbatim"
override stayed on the record; it never fought back at build or QA.)*

## Ambiguities that needed rulings (P1 scoreboard: 4 — prediction CONFIRMED)

medicaid_method vocabulary + NULL-vs-'' (ruled (a)) · update_updated_at absence (ruled (i)) · replica wipe (ruled: authorized) · X6 auth path (ruled: Director-as-hands). None required requirement changes — all were reality-vs-doc gaps, which is exactly what the flag culture is for.

## What went smoothly

- The chain itself: 15 files authored in one pass; **every gate that could run, ran green on first execution** except the two instrument/environment fights above — zero schema rework.
- Assert-then-create (rider 3) proved its worth immediately: the empty-DB abort and the foreign-schema abort both fired exactly as designed.
- AC-seed pattern (campaign P2): the seeded AC1–AC15 mapped 1:1 onto evidence with no rewriting.
- Reset twice-clean with byte-identical inventories on the first X3 attempt.

## Carried flags

- `report_files` fidelity flag (minimal attested shape — true up when models.py verbatim is staged).
- ERRATUM.md → DATA_CONTRACT §3 amendment for the doc repo (Director).
- Throwaway projects hold post-chain state for Sol's independent replay (scratch = full chain, replica = baseline→chain path).

## Gate Q outcome (close-out addendum, 2026-08-31)

**PASS, zero rework** — certified SHA `9f8c80d`. Sol's independent battery (executed by
Cody, first live run of the QA-execution-agent org proposal from BIM-000) confirmed every
gate and surfaced only two SPEC WORDING defects (ratified ERRATUM-Q1/Q2: AC3's
three-function baseline claim — the X0 phantom-function reality, wording lagged; AC12's
"all sixteen" vs manager law freezing profiles/user_roles). Both patched wording-only at
close-out; implementation stood untouched. AC13 One-Walk: Director-witnessed, exit 0,
16-table inventory. QA branch `qa/bim-001-cody-01` correctly discarded unmerged.
**Process note for the journal:** spec wording should be re-read against ERRATUM findings
at engineering close, not left for QA to catch — both Q1/Q2 were knowable from
X0_EVIDENCE/manager law at evidence-fill time.
