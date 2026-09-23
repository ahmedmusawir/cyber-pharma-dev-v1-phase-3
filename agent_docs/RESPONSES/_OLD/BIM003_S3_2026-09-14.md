# BIM003_S3 — STAGE 3 COMPLETE · audit:prove, golden trail, board, docs, retrospective

**Module** BIM-003-CYBER-PHARMA · **Branch** `phase-3-bim003` (base `c2d9348`) · **Target** scratch per `evidence/ENV_NOTE.md` · **Date** 2026-09-14

## 1. In plain language

The vault now has its camera, and the camera has been tested from an empty database. One command, `npm run audit:prove`, wipes the throwaway, replays all 47 migrations, seeds two pharmacies with their staff, then plays a scripted session: an admin creates, edits and deletes a claim; the platform writes a reference row; the admin opens the OwedBook screens through the four read wrappers; a second-store admin opens theirs; the first admin tries to open the other store's and is refused; three different identities try to edit or erase audit rows and every attempt fails, the service role included. Afterwards the runner reads back what the trail recorded and compares it, row by row, to a committed expectation file written by hand before the first run. It matched on the first run. I then broke one expected row on purpose, ran again, watched it fail with the exact row named, and restored the file. The BIM-002 isolation proof still passes with the trail switched on, the app still builds to the same 22 routes with the same 128 green tests, and the two proof commands are documented in the README and a new RUN_NOTES. Every acceptance criterion in the spec now points at its evidence, including the regenerated TypeScript types you produced, which I verified against the pre-module file and re-type-checked.

## 2. What landed

| Item | Path |
|---|---|
| Audit runner (the one command) | `scripts/rls-harness/audit-prove.mjs` → `npm run audit:prove` (`package.json` scripts block) |
| E-4 `multi` identity + R-10 rows | `scripts/rls-harness/audit-seed.mjs` (+ `audit-seed-map.json`, ids only) |
| Scripted session, probes, golden diff | `scripts/rls-harness/audit-session.mjs` |
| Golden expectation, 10 rows, symbolic (E-2) | `scripts/rls-harness/golden/audit_trail_expected.json` |
| Docs (AC-308) | `README.md:137-138` script table · `RUN_NOTES.md` (new, root) — no new env names |
| Retrospective (AC-309) | `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md` |
| Types regen instructions (AC-307) | `evidence/S3_types_regen.md` |
| Evidence | `evidence/S3_audit_prove_2026-09-14T0738.log` (+ normalised, + produced.json) · `S3_failure_path.md` · `rls-prove/S3_prove_2026-09-14T0737.log` · `S3_triad.log` · `S3_files.md` |

## 3. Gates

| Gate / AC | Result |
|---|---|
| G-6 / AC-301…304 | `audit:prove` **TRAIL PROVEN**, exit 0, first run against the hand-written golden; failure path exit 8 with `DIFF at row 1` |
| G-3 / AC-106 | six tampering probes: svc → `P0001 audit_logs is append-only`; admin-A and anon → `42501`; ground truth unchanged |
| G-4 / AC-109…112 | admin-A = A-count (A1+A2), member-A 0, admin-B = B-count, multi = A1+B1, anon 0; nothing outside each set |
| AC-113, 116…119 | in the session log; write-trail shapes and actor fields exact; R-8 row NULL + context |
| G-5 (wrappers in the trail) | six `read_page` rows for six calls; R-10 shapes non-empty: summary `[OptumRx 10.00, Caremark 9.50]`, pbm_options `[Caremark, OptumRx]`, updated tab total 2, KPIs 204 scripts / 20 119.50 |
| AC-305 | `rls:prove` **ISOLATION PROVEN** after the 47-file chain |
| G-7 / AC-306 | build 22 routes · tsc 0 · jest 28 / 128 / 0 |
| AC-307 | **PASS** on schema content (E-7) — hunks confined to `audit_logs` + `Functions`; 11 Row keys = 0028; four `owedbook_*` entries; tsc 0 on the regenerated file (`S3_files.md` § AC-307) |
| AC-308 / AC-309 | README + RUN_NOTES identical strings; retrospective with Keep/Change/Drop + Deferred Ledger |
| AC-901…906 | `evidence/S3_files.md`; 902/903 need your attestation of the transcript |

## 4. Things I didn't touch

`src/**` (AC-210 still empty) · `0001`–`0047` after S2 · AC wording (24 cells filled this stage; the only removed words are my own S1 pointers on AC-305/AC-905, superseded by S3's) · `.env*` · `agent_docs/AUTHORITY/**` · the BIM-002 cast and `seed.mjs` · BIM-002's evidence folder (seven `rls:prove` logs moved out again).

## 5. AC-307 — verified

Director ran Route B (login → gen → logout, CLI 2.116) and pasted the diff. Verified on disk: 94+/51−, hunks only in `audit_logs` (Row/Insert/Update → the 0028 shape, `id?: never` for the identity column) and `Functions` (four `owedbook_*` one-to-one with 0044–0047, plus the four BIM-002 helpers and the PostgrestVersion/parenthesization hunks that **E-7** rules non-module). No other table added, removed or edited. `tsc --noEmit` exit 0 against the regenerated file. Block appended to `evidence/S3_files.md` § AC-307; AC-307 cell filled.

## 6. Potential concerns

1. **`multiStore` vs `multi`:** the spec's "A" for `multi` is store A1 (multiAdmin is admin of A1+B1), while admin-A's "A" is A1+A2 (ownerA is admin of both). Both are stated in the session log so QA reads the counts the same way.
2. **`audit-seed-map.json` and `seed-map.json`** are rewritten every run (ids only) — expect them modified after any proof, as in BIM-002.
3. **Three new harness files + golden** are BIM-003's to certify; `prove.mjs`'s "18 policies" verdict text and the hardcoded BIM-002 evidence path remain CF-8 (BIM-005).

## 7. Uncommitted paths (AC-901)

```
package.json (scripts block) · README.md · RUN_NOTES.md (new)
scripts/rls-harness/{audit-prove.mjs, audit-seed.mjs, audit-session.mjs, audit-seed-map.json, golden/audit_trail_expected.json} (new) · seed-map.json
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/{RETROSPECTIVE.md, BIM003_ACCEPTANCE_SPEC.md (evidence cells)}
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/{S3_*, rls-prove/S3_*}
agent_docs/RESPONSES/BIM003_S3_2026-09-14.md (+ response_ copy) · session log · RECOVERY.md · CHANGELOG.md
src/types/supabase.ts (Director-regenerated, AC-307)
```

🔔 GIT REMINDER — uncommitted work: the paths above.
Suggested: git add -A && git commit -m "14sep2026 - BIM-003 S3 - audit:prove + golden trail + failure path, rls:prove green, triad 22/0/28-128, RUN_NOTES, retrospective, types regenerated, spec fully evidence-filled"
→ Your call. I will not run it.

## 8. Definition of done (manager §11)

G-1…G-7 green (G-8 = your attestation) · every AC carries an evidence pointer · retrospective written · RECOVERY + session log current · GIT REMINDER issued.

**ENGINEERING COMPLETE — ready for the Director to open qa/phase-3-bim003. STOP.** Not self-certified: Cody executes, Sol adjudicates.
