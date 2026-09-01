# BIM-002-CYBER-PHARMA — X7 + ENGINEERING HANDOFF
**Date:** 2026-09-01 · **Branch:** `phase-3-bim002` · **All gates X0–X7 GREEN**

---

## 1. X7 — board and fences

| Check | Result |
|---|---|
| `npm run build` | ✅ compiled, **22 routes** |
| `npx tsc --noEmit` | ✅ clean |
| `npm test` | ✅ **28 suites / 128 tests / 0 failures** — identical to the BIM-001 baseline |
| `git diff src/types/supabase.ts` vs **certified `9f8c80d`** | ✅ **EMPTY** — policies don't change types, proven not assumed (read-only git) |
| Gap-6 grep over `0016–0027`, comments stripped | ✅ **zero** `user_roles` / `user_metadata` / `raw_user_meta_data` / `profiles` / `owner_user_id` in any policy or helper body |
| `storage.objects` policies | ✅ **0 before and after, on both targets**; zero buckets (R-E) |
| Admin-client fence (AC19) | ✅ BIM-002 introduced **exactly one** service-role site: `scripts/rls-harness/lib/db.mjs`. The app-side sites (`src/utils/supabase/admin.ts`, `src/app/moose-portal/**`) are **inherited and untouched** — `git diff HEAD` on them is empty |
| `src/**` writes | ✅ **ZERO.** This module changed `package.json`, added `scripts/rls-harness/`, and added twelve migrations. Nothing else |

Two harness improvements landed this gate, both approved: `prove.mjs` now takes a **phase label** (X6's sub-logs keep their names and internal references — the X6 report's file map is the record), and **`--compare-behaviour`** strips env banners and identity counts for cross-target diffs but **never the pooler host**.

## 2. Close-out artifacts

| # | Artifact | Contents |
|---|---|---|
| 1 | `agent_docs/AUTHORITY/RLS_TEMPLATES.md` | Four helpers in E-4 form · T-1 (C form) · T-2 · T-3 · T-4 · T-5 · R-A · deny-all section with the per-table reasoning · **B documented as the anti-pattern with its shield-test table** · the six structural laws. SQL bodies byte-identical to `0016–0027` |
| 2 | `agent_docs/ACTIONS/PROTO06/TRANSFERS_ADDENDUM_BIM-002.md` | **F-10** revoke-from-anon is a no-op (correction to TRANSFERS §1.0) · **F-11** inline junction subquery is invoker-blinded; C is the fix (closes §4's A/B question) · **F-12** privilege assertions require a from-scratch apply · **F-13** membership is live; revocation *and re-grant* land on the next query (closes N-3). Plus notes for BIM-005. **`TRANSFERS.md` and `FINDINGS.md` untouched** |
| 3 | `ACCEPTANCE_SPEC.md` | **ENGINEER EVIDENCE-FILLED** — AC1–AC20 each with evidence paths; **AC13 annotated STRUCK** (E-3); prose re-read against E-1…E-5 before handoff, nothing weakened |
| 4 | `RETROSPECTIVE.md` | Seven things that fought back; the headline being that **every defect found was in an instrument or the inherited template — never in a policy** |
| 5 | Manager §10a | **CF-1…CF-7** carried flags, each with an owner |
| 6 | This file | Commit lists below |

## 3. What was built

- **`supabase/migrations/0016–0027`** — four helpers + **15 policies across 11 tables**, one migration per table, SELECT before write inside each file, assert-then-create preambles that refuse the wrong shape and (on C-formulated files) refuse unless the junction SELECT policy exists.
- **`scripts/rls-harness/`** — `lib/{env,db,verdict}.mjs` · `expectations.json` · `payloads.mjs` · `seed.mjs` · `harness.mjs` (320 cells) · `scoping.mjs` · `attacks.mjs` (28 cases) · `revocation.mjs` · `policy-check.mjs` (L1–L4) · `ac8-check.mjs` · `x3-red-green.mjs` · `prove.mjs` · `npm run rls:prove`.
- **Three independent from-scratch proofs**: scratch ×2 (normalised diff byte-identical) and clean replica ×1 (three explained non-behavioural differences).

## 4. PER-CONCERN COMMITS — prepared, never run

**Concern 1 — helpers + templates**
```bash
git add supabase/migrations/0016_rls_helpers.sql agent_docs/AUTHORITY/RLS_TEMPLATES.md
git commit -m "feat(rls): membership helpers + blessed policy templates (BIM-002 X1/X2; formulation C, E-2/E-4 grants)"
```

**Concern 2 — policy migrations**
```bash
git add supabase/migrations/0017_rls_user_businesses.sql \
        supabase/migrations/0018_rls_accounts.sql \
        supabase/migrations/0019_rls_businesses.sql \
        supabase/migrations/0020_rls_subscriptions.sql \
        supabase/migrations/0021_rls_user_data.sql \
        supabase/migrations/0022_rls_report_files.sql \
        supabase/migrations/0023_rls_aac_reference.sql \
        supabase/migrations/0024_rls_wac_reference.sql \
        supabase/migrations/0025_rls_ful_reference.sql \
        supabase/migrations/0026_rls_pbm_info.sql \
        supabase/migrations/0027_rls_reference_dataset_versions.sql
git commit -m "feat(rls): 15 tenant-isolation policies across 11 tables, junction-first, SELECT-before-write (BIM-002 X3)"
```

**Concern 3 — harness port + npm task** *(no CI — AC13 struck)*
```bash
git add scripts/rls-harness/ package.json
git commit -m "feat(rls): isolation harness at scripts/rls-harness + npm run rls:prove (BIM-002 R-D)"
```

**Concern 4 — evidence, spec, erratum, retrospective, responses, session log**
```bash
git add agent_docs/
git commit -m "chore(protocol): BIM-002 engineering close — X0-X7 evidence, spec evidence-filled, erratum E-1..E-5, retrospective, TRANSFERS addendum F-10..F-13"
```

**Do not commit:** nothing to exclude — `supabase/.temp/` is absent this module, and `.env.local` is untracked.

## 5. Director post-commit

1. Pin the certified SHA into the spec's Branch+SHA line at PRE-Q.
2. **Live application is still deferred** — the dev backend stays at the 2-table baseline through BIM-004. Both throwaways hold the full post-chain state for QA replay: scratch `jmzwhgnyunwssamrqyhp` (aws-1-us-west-1), replica `ihgcsrypblqkwommrkgj` (aws-1-ap-south-1); the replica runs via `RLS_HARNESS_PREFIX=RLS_REPLICA_`.
3. Work CF-1…CF-6 (manager §10a) — notably **credential rotation** on all four throwaway projects, and the `proto-06/` + `phase-3-proto-6` deletion now that the port is complete.
4. PRE-Q → Sol's Gate Q. `QA/` folder is present and empty, ready for his package.

## 6. Standing

Zero git commands run · `.env.local` never edited · no credential value in any command, log, document, or evidence file · dev backend never touched · scratch and replica are disposable throwaways · `proto-06/` unmodified.

**Engineering complete. STOP.**
