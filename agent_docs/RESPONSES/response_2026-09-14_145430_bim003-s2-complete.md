# BIM003_S2 — STAGE 2 COMPLETE · four owedbook_* read wrappers

**Module** BIM-003-CYBER-PHARMA · **Branch** `phase-3-bim003` (base `011eada`) · **Target** scratch per `evidence/ENV_NOTE.md` · **Date** 2026-09-14
**Verdict:** AC-201…AC-210 all GREEN · chain of 47 applies from scratch with zero errors · zero git · zero cloud · no credential printed · `src/**` untouched.

## 1. What landed

| # | File | Mirrors | Returns |
|---|---|---|---|
| 0044 | `supabase/migrations/0044_owedbook_kpis.sql` | `getKpis` → `OwedBookKpis` | `table(commercial_underpaid, commercial_scripts, updated_difference, owed)` — 1 row |
| 0045 | `0045_owedbook_rows.sql` | `getRows` → `OwedBookPage` | `jsonb` envelope `{rows: OwedBookRow[17 keys], page, pageCount, limit, total}` |
| 0046 | `0046_owedbook_summary.sql` | `getSummary` → `OwedBookSummaryRow[]` | `table(pbm, commercial_dollars, federal_dollars)` |
| 0047 | `0047_owedbook_pbm_options.sql` | `getPbmOptions` → `string[]` | `setof text` |

Every wrapper: `plpgsql` · SECURITY DEFINER · `search_path = ''` · `p_business_id uuid` first · statement 1 membership via `my_business_ids()` (NULL never a member) else `raise 'not a member of business'` · statement 2 exactly one `read_page` row with `context {fn, args, filters[, page, limit, offset]}` · statement 3 the read with an explicit `where ud.business_id = p_business_id` · revoke public + anon, grant authenticated. Mapping per approved A-3; the four NULL fields (`report_file`, `aac`, `federal_expected`, `federal_diff`) are NULL by construction. **`evidence/WRAPPER_CONTRACT.md`** documents each with file:line into `src/services/owedbook.ts` and `src/types/OwedBook.ts` (AC-209).

**Instruments:** `scripts/rls-harness/audit-catalog.mjs` now takes a stage (`S1` | `S2`) — S2 adds AC-201…203 plus a body-shape check (membership < raise < insert < read, exactly one audit insert, explicit fence). New `scripts/rls-harness/audit-wrappers.mjs` runs AC-204…208 through real signed-in sessions (admin-A = ownerA, member-A = staffA, anon) with every audit-row claim ground-truthed via the service role.

## 2. Gates

| AC | Result | Evidence |
|---|---|---|
| AC-101 (re-proven) | 47/47 ok, exit 0 | `S2_apply_2026-09-14T0652.log` |
| AC-201 | 4 functions, names = E-0 | `S2_catalog.md` |
| AC-202 | secdef · pinned · anon=false / authenticated=true · no PUBLIC entry · anon refused live 42501 ×4 | `S2_catalog.md` |
| AC-203 | `p_business_id uuid` first, ×4 | `S2_catalog.md` |
| AC-204 / AC-205 | admin-A and member-A ×4: returns, audit +1, row fields exact, `context.fn` = name | `S2_wrappers.md` |
| AC-206 | admin-A → B ×4: `P0001 not a member of business`, audit +0 | `S2_wrappers.md` |
| AC-207 | anon ×4: `42501 permission denied for function`, audit +0 | `S2_wrappers.md` |
| AC-208 | 25 rows served, audit +1; context carries page/limit/offset/filters | `S2_wrappers.md` |
| AC-209 | contract doc, file:line | `WRAPPER_CONTRACT.md` |
| AC-210 | `git diff dfc8a6a` empty on all four paths | `S2_files.md` |
| S1 invariants | 1 policy · RLS enabled+forced · 13 stamps; S1 catalog re-run GREEN | `S2_catalog.md`, `S1_catalog.md` |

Seed-shaped sanity in the probes: KPIs over A1 = 200 scripts / 20 100 owed; `owedbook_rows` pages 200 rows as 8 × 25; page 99 clamps to 8/8; updated and federal tabs return 0 (seed has no `new_paid`; federal is NULL by A-3); summary and pbm_options are empty because the seed writes no `insurance`. Unknown tab raises.

## 3. Mid-stage correction (reported, not hidden)

My first cut of `owedbook_rows` ran the pager's `COUNT` **before** the audit insert so the log could carry the clamped page. The S2 catalog's body-shape check flagged it against Brief §5's letter (membership → log → read). Fixed in `0045`: the audit row is written before any read and carries the **requested** `page/limit/offset`; the served page lives in the envelope. The chain was re-applied from scratch and every probe re-run after the fix; the superseded 06:48 apply log was deleted so only the proven run is on disk. `WRAPPER_CONTRACT.md` says the same.

## 4. Things I didn't touch

`src/**` (empty diff, AC-210) · `0001`–`0043` · AC wording (10 evidence cells filled, zero words removed) · `.env*` · `agent_docs/AUTHORITY/**` · the harness cast · `prove.mjs`.

## 5. Potential concerns

1. **Seed coverage:** the BIM-002 seed writes no `insurance`, `new_paid`, or `status`, so summary/pbm_options/updated-tab paths are exercised as *empty-but-correct*. S3's scripted session should seed a few rows with those columns so the golden trail (and BIM-005) sees non-empty shapes. Noting for the S3 golden design.
2. **Types (AC-307):** Director-run regen will add four `Functions` entries plus the reshaped `audit_logs` table under `Tables`. `owedbook_rows` returns `Json`; the other three get typed rows.
3. **Not on disk yet:** CF-9 and the R-6 TRUNCATE amendment were ruled in chat; I don't see them in the manager or brief. Not blocking — flagging so the pack catches up before QA.

## 6. Uncommitted paths (AC-901 fence respected)

```
supabase/migrations/0044–0047                                     (4 new)
scripts/rls-harness/audit-catalog.mjs (stage switch) · audit-wrappers.mjs (new) · seed-map.json (rewritten by seed)
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/{WRAPPER_CONTRACT.md,S2_catalog.md,S2_wrappers.md,S2_files.md,S2_apply_2026-09-14T0652.log,S1_catalog.md (re-run)}
agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/BIM003_ACCEPTANCE_SPEC.md  (evidence cells AC-201…210 only)
agent_docs/RESPONSES/BIM003_S2_2026-09-14.md (+ response_ copy) · session log · RECOVERY.md · CHANGELOG.md
```

🔔 GIT REMINDER — uncommitted work: the paths above.
Suggested: git add -A && git commit -m "14sep2026 - BIM-003 S2 - four owedbook_* wrappers (0044-0047), wrapper contract, AC-201..210 green from scratch"
→ Your call. I will not run it.

**Next:** S3 — `audit:prove`, symbolic golden (E-2), `multiAdmin` (E-4), RUN_NOTES.md + README, triad, retrospective, types-regen request. **STOP.**
