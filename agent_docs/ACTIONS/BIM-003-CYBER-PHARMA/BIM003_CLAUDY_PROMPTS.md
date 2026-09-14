# BIM003_CLAUDY_PROMPTS.md — BIM-003-CYBER-PHARMA

**Status:** FINAL 2026-09-07 (contract layer) · **Rule:** the Director hands ONE prompt at a time. The next prompt is handed only after the prior stage is green, reported, and committed. Claudy does not read ahead.

**Launch-line prerequisite (Director, mechanical, before P1):** authority docs on disk at `agent_docs/AUTHORITY/` · this pack on disk at `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/` · throwaway project credentials in `.env.local` (throwaway scope only) · pooler host recorded in this folder's `evidence/ENV_NOTE.md` · repo on branch `phase-3-bim003` at a clean tree from `main` (`6171c54` or later) · Director confirms with `git status` and `ls agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/`.

---

## P1 — Plan Mode

```
You are the Engineer for module BIM-003-CYBER-PHARMA (BIM-003, Audit Machinery).

Read, in this exact order, before writing anything:
1. agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/CLAUDE.md (your front door; obey §2 seat rules)
2. agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_BRIEF.md
3. agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md
4. agent_docs/AUTHORITY/README.md, then PHASE_3_BIM_CAMPAIGN_MAP.md (patch header, then §5), then RLS_TEMPLATES.md
5. agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/CLAUDE.md §10a and TRANSFERS_ADDENDUM_BIM-002.md
6. supabase migrations 0016 through 0027 (closely), 0001 through 0015 (structure only)
7. scripts/rls-harness/ (the runner and its env handling)
8. services/owedbook.ts and its BACKEND_SWAP_NOTES (find them; report the path)

Then produce ONE plan message containing exactly what CLAUDE.md §9 lists:
- TV-1 through TV-9 answered with file:line evidence for each
- the sixteen-table stamp list split into "has business_id" and "R-8 applies"
- the wrapper list from TV-6 with proposed owedbook_<noun> names, signatures, and return shapes, and the COUNT stated as a number
- proposed migration filenames continuing the chain, one per concern
- red flags: every AC in the spec you cannot meet literally, with your proposed alternative
- your three-stage plan with the stop rule for each stage

Constraints you are under for the whole module:
- Plan Mode: no file is created or edited before I reply "approved"
- git: read-only inspection only (status, log, diff, show, branch --show-current, rev-parse); never add/commit/checkout/merge/rebase/reset/push
- cloud: none; no supabase login/link; only the throwaway credentials already in .env.local
- never edit migrations 0001–0027, services/**, app/**, components/**, mocks/**, agent_docs/AUTHORITY/**
- never change AC wording in the acceptance spec

End the plan with the line: PLAN COMPLETE — awaiting approval. Then STOP.
```

**Director after P1:** review the plan; write any red-flag acceptances into the spec's Erratum Lane (E-0 gets the sixteen names and the wrapper count N; further rows E-1.. for any I-class items) — JARVIS drafts the rows if you paste the plan back to the lab. Reply "approved" only after the lane is written.

---

## P2 — Stage 1 build (table, guard, RLS, trigger template, stamps)

```
Approved. Execute Stage 1 exactly as planned.

Build:
1. Migration: create public.audit_logs per BIM003_BRIEF.md §3 (eleven columns, action CHECK with the four values, identity PK), the three indexes in §4, ENABLE and FORCE row level security, the immutability guard trigger per §5 (BEFORE UPDATE OR DELETE, raises unconditionally, no WHEN, no role check), and the single SELECT policy for authenticated admins per R-1 using the BIM-002 role-gated helper you identified in TV-3. Header comment names BIM-003-CYBER-PHARMA.
2. Migration: create public.audit_write() per §5 — SECURITY DEFINER, search_path pinned, owner-correct, REVOKE EXECUTE FROM public AND FROM anon; handles insert/update/delete; resolves business_id from NEW/OLD when the column exists, otherwise NULL with the identifying key in context (R-8); actor_user_id from auth.uid(); actor_role from the JWT role claim with current_user fallback.
3. Stamping migrations for all sixteen tables from your approved E-0 list, mechanically identical except for the table name (AC-120).
4. Run the from-scratch apply of the full chain on the throwaway (the runner you identified in TV-8). Zero errors or STOP and revert the offending file.
5. Run npm run rls:prove. Must still pass.
6. Prove AC-101 through AC-121 with evidence written to agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S1_*.md (catalog queries and their outputs; where a query needs the dashboard, write the exact SQL for me to paste and STOP for my paste).

Stop rules: any migration error → revert, report, STOP. Any AC you cannot make PASS literally → report it, do NOT edit the spec, STOP.

Finish with: the spec's Evidence column filled for AC-101..AC-121; a stage report at agent_docs/RESPONSES/BIM003_S1_<YYYY-MM-DD>.md (plain-language summary first, then detail); RECOVERY.md updated; a GIT REMINDER block listing every uncommitted path. Then STOP. I commit.
```

---

## P3 — Stage 2 build (wrappers)

```
Stage 1 is committed at <SHA>. Execute Stage 2 exactly as planned.

Build:
1. Migration(s) for the N owedbook_* wrappers from E-0. Each: SECURITY DEFINER, search_path pinned, first parameter p_business_id uuid, first statement asserts p_business_id IN (SELECT public.my_business_ids()) else RAISE EXCEPTION 'not a member of business', second statement inserts exactly one audit_logs row with action='read_page' and context containing at least {fn, args} plus page/limit/offset/filters where applicable, then returns the page. Return shape mirrors the services/owedbook.ts type you documented (AC-209). GRANT EXECUTE TO authenticated; REVOKE FROM public, anon.
2. Write agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/WRAPPER_CONTRACT.md: one section per wrapper — signature, return shape, the service type it mirrors with file:line, the underlying table_name it logs.
3. From-scratch apply of the full chain on the throwaway. Zero errors or STOP.
4. Prove AC-201 through AC-210 with evidence in evidence/S2_*.md.

Do not touch services/owedbook.ts or any file under services/, app/, components/, mocks/. The swap is BIM-005's.

Stop rules: any wrapper whose return type cannot mirror the service contract without changing the service → red flag, STOP. Any literal FAIL → report, don't patch the spec, STOP.

Finish with: Evidence column filled for AC-201..AC-210; stage report BIM003_S2_<date>.md; RECOVERY.md; GIT REMINDER. STOP. I commit.
```

---

## P4 — Stage 3 build (harness, golden trail, board, handoff)

```
Stage 2 is committed at <SHA>. Execute Stage 3 exactly as planned.

Build:
1. Extend scripts/rls-harness/ with an audit runner exposed as npm run audit:prove (AC-301). It seeds the six identities if absent, runs the scripted session in AC-302, collects audit_logs rows ordered by id, strips id and occurred_at, and diffs against scripts/rls-harness/golden/audit_trail_expected.json (AC-303, AC-304). Non-zero on any difference. Reuse the existing harness auth and env re-pointing (TV-7); add no new env names unless unavoidable — if unavoidable, list them in RUN_NOTES.
2. Prove the failure path once: temporarily alter one expected row, run, capture the non-zero exit and diff output into evidence/S3_failure_path.md, restore the golden file.
3. Run npm run rls:prove and npm run audit:prove on a fresh from-scratch apply. Both exit 0.
4. Triad: next build, tsc --noEmit, jest. Record counts (AC-306).
5. Types: write the exact login → gen → logout command sequence for me to run in MY terminal (credential boundary), STOP for my paste, then verify AC-307 against the pre-module SHA.
6. README + RUN_NOTES: add npm run audit:prove with the identical command string (AC-308).
7. Prove AC-301..AC-309 and AC-901..AC-906 with evidence in evidence/S3_*.md.
8. Write agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/RETROSPECTIVE.md: Keep / Change / Drop, one line each, plus any Deferred Ledger candidates you surfaced.

Finish with: every AC in the spec carrying an Evidence pointer; stage report BIM003_S3_<date>.md whose first section is a plain-language summary for an audio-first reader; RECOVERY.md; a final GIT REMINDER. Then the line: ENGINEERING COMPLETE — ready for the Director to open qa/phase-3-bim003. STOP. You do not self-certify.
```

---

## P5 — Repair on the QA line (only if SOL's ruling package names fixes)

```
We are on qa/phase-3-bim003 at <SHA>. SOL's ruling package is at agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/<file>. Apply ONLY the items marked IMPLEMENTATION FIX REQUIRED, touching ONLY the files the package names. Do not touch any AC text, any erratum row, or any file outside the named list. Re-run npm run rls:prove, npm run audit:prove, and the triad. Report the repair diff summary and a GIT REMINDER. STOP. I commit; Cody re-pins.
```

---

🥄 *One prompt, one stage, one commit. — JARVIS*
