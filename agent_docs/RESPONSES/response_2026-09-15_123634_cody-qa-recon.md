# CODY_QA_RECON — BIM-003-CYBER-PHARMA · Independent QA Recon (STATIC ONLY)

**Agent:** Cody (QA execution) · **For:** SOL (QA Lead, adjudicator) · **Date:** 2026-09-15
**Scope:** recon only — no destructive command, no db:reset / rls:prove / audit:prove / migration run, no product-file modification. Read-only git inspection only.
**Specimen:** `qa/phase-3-bim003` @ `c45949ece1a17f1a3fbb299f5551f911f869c21e` (Engineering handoff candidate `c45949e`). **No PASS/FAIL adjudication is issued here — SOL decides.**

---

## 1. SPECIMEN PIN

| Item | Value |
|---|---|
| pwd | `/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3` |
| Branch | `qa/phase-3-bim003` ✅ |
| HEAD | `c45949ece1a17f1a3fbb299f5551f911f869c21e` ✅ (resolves to the `c45949e` candidate) |
| `git log -3` | `c45949e` (S3) · `c2d9348` (S2) · `011eada` (S1) — matches RECOVERY/session narrative |

**Working tree:** `M RECOVERY.md` + 2 untracked session-open protocol files
(`agent_docs/RESPONSES/response_2026-09-15_122338_session-open-qa-standby.md`, `agent_docs/SESSIONS/session_2026-09-15.md`).
Judged **expected** (today's 12:23 standby write, pre-recorded in the session log and the
Director's git status snapshot). Product tree is clean. **No BLOCK.**

## 2. CONTRACT READ

All six contract files read in the prescribed order, fully:

- `ACTIONS/BIM-003-CYBER-PHARMA/CLAUDE.md` (manager) — read
- `BIM003_BRIEF.md` — read (Brief §3 row shape, §5 design rules, §6 retention)
- `BIM003_ACCEPTANCE_SPEC.md` — read; AC ranges observed: AC-101…121 (S1), AC-201…210 (S2), AC-301…309 (S3), AC-901…906 (hygiene). Every AC carries an Engineering evidence pointer.
- `RULINGS_ADDENDUM.md` — read (R-6a TRUNCATE · R-8a businesses own-id · R-10 seed rows · CF-9 · CF-8 additions). **Confirmed on disk at `c45949e`** — S2's concern #3 ("not on disk yet") is resolved.
- `AUTHORITY_POINTER.md` — read (precedence: disk > pack > AUTHORITY > memory).
- `QA/README.md` — read (lane rules; journal duty honored).

**Erratum Lane observed:** E-0…E-7 all Director-approved, all treated as rulings of record. Known-red `db:verify` AC7 = CF-9, pre-existing from BIM-002 — **not classified as a BIM-003 finding** (confirmed in `evidence/S1_db-verify.log`).

---

## 3. ENGINEERING CLAIM MAP

| Stage | Major claimed proofs | Where Engineering's evidence lives |
|---|---|---|
| S1 | 43/43 from-scratch apply; 11-col reshape; action CHECK; 3 indexes; immutability guard (+TRUNCATE, R-6a); RLS enabled+forced; 1 SELECT policy; `audit_write()` secdef/pinned/revoked; 13 stamps = E-0; AC-120 stamp-diff; AC-121 fence; rls:prove green with trail live | `evidence/S1_apply_2026-09-14T0546.log`, `S1_catalog.md`, `S1_files.md`, `S1_db-verify.log`, `rls-prove/S1_prove_…0550.log`, `rls-prove/S1-matrix_…0551.log` |
| S2 | 47/47 from-scratch; 4 wrappers = E-0; secdef/pinned/grants; p_business_id first; session probes AC-204…208 incl. cross-tenant deny and anon refusal; WRAPPER_CONTRACT; src untouched | `evidence/S2_apply_…0652.log`, `S2_catalog.md`, `S2_wrappers.md`, `WRAPPER_CONTRACT.md`, `S2_files.md` |
| S3 | audit:prove TRAIL PROVEN (first run), failure path (exit 8, DIFF row 1, golden restored), AC-109…112 scoping, 10-row symbolic golden match, rls:prove re-green, triad 22/0/28-128, AC-307 verified, README/RUN_NOTES | `evidence/S3_audit_prove_…0738.log` (+ 0734 first run, 0736 failure run), `S3_failure_path.md`, `rls-prove/S3_prove_…0737.log`, `S3_triad.log`, `S3_files.md`, `S3_types_regen.md`, `RETROSPECTIVE.md` |

Claims were **not accepted as proof**; the instruments and migrations behind them were read directly (§4).

## 4. IMPLEMENTATION DELTA (independent, from `git diff 0e4e17e..c45949e`)

Base note: `dfc8a6a..c45949e` conflates the BIM-002 close batch (proto-06 removals at `5c51fff`); the module's own delta is measured from `0e4e17e` (branch start). Delta = 93 files, +6923/−152, **entirely inside AC-901's fence** except one path (D-3 below).

**Audit machinery actually present (code-verified, not prose-verified):**

| Element | File(s) | Verified by me |
|---|---|---|
| `audit_logs` reshape (11 cols, identity PK, 3 indexes) | `0028` (assert-empty → drop → recreate; E-1) | read; matches Brief §3 order |
| Immutability guard | `0028:63-80` — bare-RAISE `audit_logs_immutable()`, BEFORE UPDATE/DELETE **row** trigger + BEFORE TRUNCATE **statement** trigger (R-6/R-6a) | read |
| RLS | `0028:83-84` enable+force; `0029` the ONE policy `audit_logs_select_admin` → `is_admin_of(business_id)`; asserts predecessor state | read |
| Grants | `0028:87` revoke UPDATE/DELETE from anon+authenticated (RF-3); INSERT left to RLS | read |
| `audit_write()` | `0030` — secdef, `search_path=''`, JWT-role → `current_user` fallback, businesses special-case (R-8a), R-8 NULL + context `{id, account_id?}`; revoke public + anon | read |
| 13 stamps | `0031`–`0043`, one per E-0 table | **all 13 md5-identical after normalizing number + table name** (my own recomputation of AC-120 — not taken from prose) |
| 4 wrappers | `0044` kpis · `0045` rows · `0046` summary · `0047` pbm_options — membership → ONE read_page insert → explicit `where ud.business_id = p_business_id` fence; revoke public+anon, grant authenticated | read line-by-line |
| Harness | `audit-prove.mjs` (4 stages, exit 8 on any failure), `audit-seed.mjs` (E-4 multiAdmin + R-10), `audit-session.mjs` (watermark → 6 tamper probes → write trail → wrapper calls → cross-tenant → AC-113 → scoping → golden diff, exit 3 on any check failure), `audit-catalog.mjs` (rolled-back pg_catalog evidence + body-shape check), `audit-wrappers.mjs` (AC-204…208, service-role ground truth) | read fully |
| Golden | `scripts/rls-harness/golden/audit_trail_expected.json` — 10 rows, symbolic per E-2 | read |
| RF-7 edits | `seed.mjs` (audit_logs out of wipe list, seed insert removed), `payloads.mjs` (new-shape probe, target 0), `expectations.json` (ownerA/ownerB audit_logs SELECT ALLOW), `attacks.mjs` (A8.3 → staffA) | diff vs `0e4e17e` — matches plan RF-7 exactly |
| E-3/E-6 | `scripts/db-verify.mjs` — one line: skip list gains `audit_logs` (line 178) | diff = 1 line changed |
| Types | `src/types/supabase.ts` — removed lines confined to old `audit_logs` Row/Insert/Update keys, `PostgrestVersion`, generic-constraint parenthesization; added: reshaped audit_logs + 4 `owedbook_*` + 4 BIM-002 helpers + `PostgrestVersion: "14.5"` | diff inspected (E-7 classes hold) |
| Docs | `package.json` scripts block (+`audit:prove` only), `README.md:137-138`, `RUN_NOTES.md` (new, root) | read |

## 5. STATIC ATTACK SURFACE

**Trust boundaries:**
- Tenant session (anon/authenticated JWT) → PostgREST → policies + grants + guards. `anon` has no EXECUTE on wrappers/audit_write; `authenticated` has no INSERT policy on audit_logs and no UPDATE/DELETE privilege (revoked).
- Service role: bypasses RLS; mutation blocked **below RLS** by the unconditional guard (row + TRUNCATE).
- Direct pg connection (postgres, BYPASSRLS): outside the tenant trust boundary; actor_role falls back to `current_user` (RISK-3, documented).
- SECURITY DEFINER functions: `audit_write`, `audit_logs_immutable`, 4 wrappers — all `search_path=''` pinned, all references schema-qualified (`public.*`, `auth.uid()`), owner = migration role (postgres).

**Privilege boundaries verified in code:**
- Wrappers: first statement = membership via `my_business_ids()` (NULL never a member) else `raise 'not a member of business'`; the read carries an explicit business_id WHERE (the DEFINER bypasses RLS — the WHERE is the fence). `owedbook_rows` also validates `p_tab` against a fixed set.
- Both revoke channels closed per BIM-002 E-2/E-4 law (PUBLIC + explicit anon).

**Likely high-risk areas (for dynamic stage):**
1. **Read-wrapper bypass** (D-1 below) — the highest-value static finding.
2. Pager/filter edge inputs on `owedbook_rows` (`p_page`/`p_limit` extremes, null `p_tab`).
3. `svc`-invoked wrappers (EXECUTE is *not* revoked from service_role — read_page row with NULL actor) — untested surface.
4. `multi`-vs-`admin-A` business-set asymmetry (multiAdmin: A1+B1; ownerA: A1+A2) — boundary probes can distinguish them.

## 6. PROOF-INSTRUMENT REVIEW (question G — false-green)

**Strengths (verified in source, not prose):**
- `audit-prove.mjs` exits non-zero (8) on **any** stage failure; `audit-session.mjs` accumulates `check` failures → exit 3. No swallowed errors found; every probe ground-truthed via the service role; identities fail closed with an ID assert before any probe.
- Golden diff: compares **max(produced, golden)** row-by-row with sorted-key canon; separate length check. **Missing-row and extra-row mutations are caught** (DIFF `<no row>` + count FAIL). Failure path evidence (row-1 alteration → exit 8 → restored, re-parsed) is coherent with the three retained logs (0734 first success, 0736 broken, 0738 restored — spec cites 0738).
- `audit-catalog.mjs`: pg_catalog only (F-3), every mutation inside rolled-back transactions/savepoints; AC-115 checks the **negative set too** (`notStamped` must be exactly audit_logs/profiles/user_roles); RISK-1 BYPASSRLS asserted.
- Scoping AC-109…111: expected counts computed from the live DB via svc at run time (not hardcoded) — self-consistent ground truth.
- Normalisation maps only the 4 cast users and 3 businesses to symbols; any *other* uuid (including a wrong cast member) → `<uuid>` ≠ expected symbol → caught.

**Residual false-green risks (observations, not verdicts):**

| # | Risk | Detail |
|---|---|---|
| G-1 | Golden-oracle scope | Golden covers only rows **after the watermark**. The ~600 seed/audit-seed writes (actor `postgres`) are excluded by design (RISK-3) — the golden proves the *session's* trail, not that every seed write trails. AC-116-style verification of seed-time rows rests on the catalog smoke + matrix, not the golden. |
| G-2 | Payload depth | `old_data`/`new_data` compared as `"present"`/null plus a stable-key check (`id`, `business_id`) per E-2. A bug logging a **wrong but present** payload would pass the golden; content beyond the two stable keys is unverified (accepted by E-2 — SOL awareness only). |
| G-3 | Oracle authorship | The golden was authored by Engineering, committed in the **same commit** (`c45949e`) as the runner and wrappers — "written by hand before the first run" is a procedural claim not separable from git history (three S3 logs all post-date the commit). Independence is procedural, not technical. See H below. |
| G-4 | AC-112 permissiveness | `anon` scoping accepts error **or** 0 rows — explicitly permitted by AC-112's "either passes". Correct, but the *observed* mode (denied vs empty) is not pinned, so a regression from "denied" to "empty" would be invisible. |
| G-5 | `update().select()` probe shape | Tamper probes rely on `42501`/`P0001` **plus** ground-truth re-reads — solid; no weakness found here. Listed for completeness. |

**Question H — golden independence:** adequate under E-2 for drift *detection* (any wrapper/shaper change forces a golden diff), but same-author same-commit circularity (G-3) means the oracle cannot certify the *semantics* it encodes — it certifies that producer matches oracle. SOL may accept this under E-2, or require an independently-authored golden / spot-check row in dynamic QA.

## 7. DISCREPANCIES (provisional classes only — SOL adjudicates)

| # | Observation | Evidence | Affected AC | Provisional class |
|---|---|---|---|---|
| **D-1** | **Direct-table read bypasses read auditing.** BIM-002's certified `user_data_select_member` (`0021_rls_user_data.sql:28-30`) allows **any junction member** (member or admin) to SELECT `user_data` — the PHI fact table — directly through PostgREST. The `owedbook_*` wrappers are therefore *not* the only read channel: a member reading `user_data` directly leaves **zero** `read_page` rows. The module's mission prose ("every read of patient-shaped data … leaves a row", Brief §1) overstates what the mechanism enforces; R-4/R-7 as written define wrappers but never close direct reads. Implementation matches the contract; the *contract* may under-close the threat. | `supabase/migrations/0021_rls_user_data.sql:28-30` vs `0044–0047` | AC-201…208 (read-audit completeness); mission prose in Brief §1 | **contract-spec** |
| **D-2** | `audit_write()` ACL carries `authenticated=X` (from the rig's default-ACL channel, `db-reset.mjs:98`). AC-114's letter ("revoked from public and anon") is literally satisfied, and a trigger function cannot be invoked directly by any caller, so there is **no forge path** — but the implicit authenticated EXECUTE exists on the rig and is visible in Engineering's own evidence. | `S1_catalog.md:83`; `scripts/db-reset.mjs:95-99`; `0030:80-81` | AC-114 (letter satisfied); AC-103/C forge question | informational |
| **D-3** | `supabase/.temp/cli-latest` modified (v2.116.0 → v2.117.0) by the Director's types regen; the path is **not** in AC-901's permitted list. | `git diff 0e4e17e..c45949e -- supabase/.temp/cli-latest` | AC-901, AC-307 (E-7) | QA-instrument / informational (likely needs an erratum-lane row) |
| **D-4** | `PostgrestVersion` reads `14.5` post-regen vs `14.17` pre-module — a downgrade-looking artifact from the same regen; E-7 rules version-string hunks non-module, but a 5.5-version drop on the same project is worth the Director's one look (regen target/API-path consistency). | `src/types/supabase.ts` diff vs `0e4e17e` | AC-307 (E-7) | informational |
| **D-5** | Spec identity note: admin-A's "A" = A1+A2 while `multi`'s "A" = A1+B1 (E-4). Both stated in the session log; counts grade correctly, but the asymmetry is a live reading hazard for QA and later readers. | `S3` report §6.1; `audit-session.mjs:148-156` | AC-109/AC-111 | informational |
| — | Known-red `db:verify` AC7 (zero non-baseline policies) | `S1_db-verify.log`; CF-9 | — | pre-existing (BIM-002) — **not a finding** |

**Implementation defects found: zero.** Every AC-mechanism claim I could check in code (stamp identities, counts, grants, fence ordering, guard shape, golden diff logic) matches the frozen contract and its erratum lane.

## 8. PROPOSED DYNAMIC ATTACKS (next stage — NOT executed)

Priority order; each is independent of Engineering's evidence:

1. **Independent re-execution of `audit:prove`** on the scratch throwaway (destructive on target — needs authorization): confirms reproducibility, evidence freshness, and that no committed evidence was produced under different conditions. Compare `.normalised.log` twins byte-for-byte.
2. **Extended golden-tamper matrix:** beyond row 1 — delete one golden row, append an extra row, mutate `action`, mutate `business_id` symbol, swap two rows. Each must fail non-zero naming the exact row. Proves the diff loop's missing/extra/ordering detection live (G-1/G-2 confidence).
3. **Wrapper-bypass probe (D-1, live):** as `member-A` (a *member*, not admin), SELECT `user_data` directly → expect ALLOW per BIM-002 with **zero** new `read_page` rows; as `member-A`, SELECT `audit_logs` → expect 0. Documents the contract-spec gap with live evidence for SOL's ruling.
4. **Forge probes as authenticated:** direct `insert` into audit_logs (expect 42501), `update`/`delete` own-visible row (expect 42501 revoke), and a direct attempt to invoke `audit_write()` (expect not-callable/denied — checks D-2's ACL entry is harmless in practice).
5. **Wrapper input fuzz on `owedbook_rows`:** `p_page=0/-1/999999`, `p_limit=0/1/1_000_000`, `p_tab` wrong-cased/null, `p_pbms` null — verify no crash, envelope sane, audit context records the *requested* values, no cross-business leakage.
6. **Membership-boundary matrix:** member-A→B, admin-A→B, multi→A2 (multiAdmin is NOT in A2 — must raise), admin-B→A1. Confirms `my_business_ids()` is the sole membership channel and the raise fires *before* any insert in every case.
7. **Service-role wrapper call:** svc calling `owedbook_kpis(A1)` — expect allowed (no revoke from service_role) and a `read_page` row with `actor_user_id` NULL / `actor_role='service_role'`. Currently untested anywhere.
8. **svc tamper breadth:** svc UPDATE of `old_data`/`new_data`/`context` (not just `actor_role`), svc DELETE by non-id predicate, and a live svc `TRUNCATE audit_logs` (catalog smoke proved it rolled-back; dynamic proves it live) — all expect P0001, ground truth unchanged.
9. **Attribution probe:** a write through a real signed-in session must carry `actor_role='authenticated'` and the right uuid even after a supabase-js token refresh mid-session (re-pins the session; verifies no `TOKEN_REFRESHED`-class attribution loss).
10. **Instrument hygiene re-check:** re-run `audit-catalog.mjs S1|S2` and confirm outputs reproduce green; verify `db:verify` red scope is *exactly* AC7/CF-9 and nothing else.

## 9. BLOCKERS / REQUIRED DIRECTOR INPUT

- **Destructive-target authorization:** items 1, 2, 4, 8, 10 wipe/replay the scratch throwaway; item 3 writes nothing but reads live data. SOL/Director must confirm the same throwaway (per `evidence/ENV_NOTE.md`) remains authorized, and whether credentials still resident in `.env.local` may be reused for QA runs (rotation status CF-4 is unknown to me).
- **New throwaway?** If SOL wants item 1 on a *fresh* project for independence, project creation is Director-only (cloud credential boundary).
- **Ruling needed:** D-1 (contract-spec: read-audit bypass) and D-3 (AC-901 erratum for `supabase/.temp/cli-latest`) — erratum-lane rows vs informational, per the erratum process.
- None of the above blocks recon; recon is complete.

## 10. FINAL STATE

`git status --short` at recon close:

```
 M RECOVERY.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/CODY_QA_RECON.md
?? agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/QA_WORK_JOURNAL.md
?? agent_docs/RESPONSES/response_2026-09-15_122338_session-open-qa-standby.md
?? agent_docs/RESPONSES/response_2026-09-15_<recon>.md   (protocol mirror of this report)
?? agent_docs/SESSIONS/session_2026-09-15.md
(+ session-file update)
```

No product file, migration, harness file, or AC text was touched. No destructive command was executed. No credential was read or printed.

**STOP — recon complete. Awaiting SOL's adjudication before any dynamic execution.**

---

🥄 *I looked at the camera from every angle I could without turning it on. — Cody*