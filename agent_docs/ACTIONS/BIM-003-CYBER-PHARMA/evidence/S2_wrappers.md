# S2 wrapper probes — BIM-003-CYBER-PHARMA
Generated 2026-09-14T06:53:09.426Z by `scripts/rls-harness/audit-wrappers.mjs` against host `jmzwhgnyunwssamrqyhp.supabase.co` after `seed.mjs`. Identities: admin-A = ownerA (admin of A1), member-A = staffA (member of A1), anon. Business A = store A1, business B = store B1 (200 seeded user_data rows each).

## AC-204 — admin-A calls every wrapper with p_business_id = A: returns, and inserts exactly one read_page row
- ✅ owedbook_kpis(A) as admin-A — 1 row {"commercial_underpaid":20100,"commercial_scripts":200,"updated_difference":0,"owed":20100}; audit +1; row: business_id=A actor=admin-A role=authenticated table=user_data context.fn=owedbook_kpis
- ✅ owedbook_rows(A) as admin-A — page 1/8 limit 25 total 200 rows 25; audit +1; row: business_id=A actor=admin-A role=authenticated table=user_data context.fn=owedbook_rows
- ✅ owedbook_summary(A) as admin-A — 0 item(s); audit +1; row: business_id=A actor=admin-A role=authenticated table=user_data context.fn=owedbook_summary
- ✅ owedbook_pbm_options(A) as admin-A — 0 item(s); audit +1; row: business_id=A actor=admin-A role=authenticated table=user_data context.fn=owedbook_pbm_options

## AC-205 — member-A calls every wrapper with p_business_id = A: returns, and inserts exactly one read_page row
- ✅ owedbook_kpis(A) as member-A — 1 row {"commercial_underpaid":20100,"commercial_scripts":200,"updated_difference":0,"owed":20100}; audit +1; row: business_id=A actor=member-A role=authenticated table=user_data context.fn=owedbook_kpis
- ✅ owedbook_rows(A) as member-A — page 1/8 limit 25 total 200 rows 25; audit +1; row: business_id=A actor=member-A role=authenticated table=user_data context.fn=owedbook_rows
- ✅ owedbook_summary(A) as member-A — 0 item(s); audit +1; row: business_id=A actor=member-A role=authenticated table=user_data context.fn=owedbook_summary
- ✅ owedbook_pbm_options(A) as member-A — 0 item(s); audit +1; row: business_id=A actor=member-A role=authenticated table=user_data context.fn=owedbook_pbm_options

## AC-206 — admin-A calls every wrapper with p_business_id = B: raises 'not a member of business', inserts zero rows
- ✅ owedbook_kpis(B) as admin-A — P0001 "not a member of business"; audit +0
- ✅ owedbook_rows(B) as admin-A — P0001 "not a member of business"; audit +0
- ✅ owedbook_summary(B) as admin-A — P0001 "not a member of business"; audit +0
- ✅ owedbook_pbm_options(B) as admin-A — P0001 "not a member of business"; audit +0

## AC-207 — anon calls every wrapper: denied (no EXECUTE), inserts zero rows
- ✅ owedbook_kpis(A) as anon — 42501 "permission denied for function owedbook_kpis"; audit +0
- ✅ owedbook_rows(A) as anon — 42501 "permission denied for function owedbook_rows"; audit +0
- ✅ owedbook_summary(A) as anon — 42501 "permission denied for function owedbook_summary"; audit +0
- ✅ owedbook_pbm_options(A) as anon — 42501 "permission denied for function owedbook_pbm_options"; audit +0

## AC-208 — one wrapper call returning K ≥ 2 rows inserts exactly one row, not K
- ✅ owedbook_rows(A, page 1, limit 25) as admin-A — K = 25 rows served (total 200, pageCount 8); audit +1
- ✅ context carries page/limit/offset/filters — {"fn":"owedbook_rows","args":{"p_to":null,"p_tab":"commercial_dollars","p_from":null,"p_page":1,"p_pbms":[],"p_limit":25,"p_filter":null,"p_business_id":"ab947d1f-0b6f-4469-be7b-0fbcfdd6da6a"},"page":1,"limit":25,"offset":0,"filters":{"to":null,"tab":"commercial_dollars","from":null,"pbms":[],"filter":null}}
- ✅ each row carries exactly the 17 OwedBookRow keys — row[0] = {"id":"0270883c-5e48-4764-8a4c-b7ab87f5f36b","aac":null,"pbm":null,"qty":1,"date":"2026-09-14","owed":150,"method":null,"script":"RX-A1-150","status":null,"expected":600,"new_paid":null,"report_file":null,"federal_diff":null,"medicaid_rate":null,"original_paid":null,"federal_expected":null,"updated_difference":null}
- ✅ envelope carries rows/page/pageCount/limit/total

## Shape spot-checks (return types mirror the service contract)
- ✅ owedbook_kpis → OwedBookKpis keys — {"commercial_underpaid":20100,"commercial_scripts":200,"updated_difference":0,"owed":20100}
- ✅ owedbook_summary → OwedBookSummaryRow[] (0 rows; seed carries no insurance so 0 is expected) — []
- ✅ owedbook_pbm_options → string[] (0) — []
- ✅ tabs + pager: updated total=0 (seed has no new_paid), federal total=0 (NULL by A-3), page 99 clamps to 8/8 with 25 rows
- ✅ unknown tab raises — unknown tab: nope

## Verdict
**S2 WRAPPER PROBES GREEN** — every assertion above holds.
