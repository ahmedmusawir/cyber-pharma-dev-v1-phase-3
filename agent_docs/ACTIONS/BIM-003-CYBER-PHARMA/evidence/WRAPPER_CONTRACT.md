# WRAPPER_CONTRACT.md — BIM-003-CYBER-PHARMA (AC-209)

Four `owedbook_*` read wrappers (E-0, N = 4), one per read query in `src/services/owedbook.ts`. Each mirrors the **return type** of the service method it will replace so BIM-005's swap is a one-line `rpc()` per query. The service file is untouched (AC-210).

**Common contract (Brief §5, R-4, R-7):** `language plpgsql` · `security definer` · `set search_path = ''` · first parameter `p_business_id uuid` · statement 1 asserts `p_business_id in (select public.my_business_ids())` (NULL is never a member) else `raise exception 'not a member of business'` · statement 2 inserts exactly **one** `audit_logs` row: `action = 'read_page'`, `table_name = 'user_data'`, `business_id = p_business_id`, `actor_user_id = auth.uid()`, `actor_role` = JWT role claim (fallback `current_user`), `row_id/old_data/new_data = NULL`, `context = {fn, args, …}` · statement 3 is the read with an explicit `where business_id = p_business_id` (a DEFINER bypasses RLS; the WHERE is the fence) · `revoke execute … from public` and `from anon`, `grant execute … to authenticated`.

**Column map (A-3, Director-approved 2026-09-14)** — `OwedBookRow` (`src/types/OwedBook.ts:5-26`) ← `public.user_data` (`supabase/migrations/0013_user_data.sql`):

| OwedBookRow field | OwedBook.ts | user_data column | Note |
|---|---|---|---|
| `id` | :6 | `id::text` | |
| `date` | :7 | `date_dispensed` | ISO date |
| `script` | :8 | `script` | |
| `qty` | :9 | `qty` | |
| `pbm` | :10 | `insurance` | PBM name as stored; pbm_info matching is Phase 5 |
| `status` | :11 | `status` | free text in v1 |
| `report_file` | :12 | — | **NULL** — report_files join is Phase 6 |
| `original_paid` | :14 | `total_paid` | |
| `medicaid_rate` | :15 | `medicaid_rate` | |
| `method` | :16 | `medicaid_method` | |
| `expected` | :17 | `expected_paid` | |
| `owed` | :18 | `owed` | |
| `new_paid` | :20 | `new_paid` | |
| `updated_difference` | :21 | `difference` | |
| `aac` | :23 | — | **NULL** — reference join is Phase 5 |
| `federal_expected` | :24 | — | **NULL** — rate math is Phase 5 (scope firewall) |
| `federal_diff` | :25 | — | **NULL** — as above |

Filters (`OwedBookFilters`, `OwedBook.ts:48-53`; mock `applyFilters`, `owedbook.ts:60-67`): `from`/`to` → `date_dispensed` range · `pbms[]` → `insurance = any(p_pbms)` when non-empty · `filter` → `status = p_filter` when given.

---

## 1. `owedbook_kpis` — `supabase/migrations/0044_owedbook_kpis.sql`

- **Mirrors:** `OwedBookService.getKpis(filters): Promise<OwedBookKpis>` — `src/services/owedbook.ts:17` (notes :14-16; mock body :70-83).
- **Type:** `OwedBookKpis` — `src/types/OwedBook.ts:35-40`.
- **Signature:** `owedbook_kpis(p_business_id uuid, p_from date default null, p_to date default null, p_pbms text[] default '{}', p_filter text default null)`
- **Returns:** `table (commercial_underpaid numeric, commercial_scripts bigint, updated_difference numeric, owed numeric)` — exactly one row.
  - `commercial_underpaid` = `round(sum(owed) filter (where owed > 0), 2)` (mock :72-74)
  - `commercial_scripts` = `count(*)` (mock :77)
  - `updated_difference` = `round(sum(difference), 2)` (mock :78-80, `updated_difference ?? 0`)
  - `owed` = `commercial_underpaid` (mock :81)
- **Logs:** `table_name = 'user_data'`; `context = {fn: 'owedbook_kpis', args: {p_business_id, p_from, p_to, p_pbms, p_filter}, filters: {from, to, pbms, filter}}`.
- **BIM-005 swap:** `supabase.rpc('owedbook_kpis', {p_business_id, p_from, p_to, p_pbms, p_filter})` → `data[0] as OwedBookKpis`.

## 2. `owedbook_rows` — `supabase/migrations/0045_owedbook_rows.sql`

- **Mirrors:** `OwedBookService.getRows(tab, filters, page): Promise<OwedBookPage>` — `src/services/owedbook.ts:24` (notes :21-23; mock body :85-107).
- **Types:** `OwedBookPage` — `src/types/OwedBook.ts:55-61`; `OwedBookRow` — `:5-26`; `OwedTab` — `:42-46`.
- **Signature:** `owedbook_rows(p_business_id uuid, p_tab text, p_from date default null, p_to date default null, p_pbms text[] default '{}', p_filter text default null, p_page integer default 1, p_limit integer default 25)`
- **Returns:** `jsonb` — the page envelope `{rows: OwedBookRow[], page, pageCount, limit, total}`. An envelope is not a row set; `jsonb` mirrors the TS interface one-to-one.
  - tabs (mock :89-93): `commercial_dollars`/`summary` = all · `updated_commercial_payments` = `new_paid is not null` · `federal_dollars` = `federal_expected is not null` → **empty in v1** (NULL by A-3). Unknown tab → raise.
  - pager (mock :95-98): `pageCount = max(1, ceil(total/limit))`, `page` clamped to `[1, pageCount]`, `offset = (page-1)*limit`; `DEFAULT_LIMIT = 25` (`owedbook.ts:55`).
  - order: `date_dispensed desc nulls last, id` (fixtures are date-descending).
- **Logs:** one row per **call** regardless of page size (R-7, AC-208); `context = {fn: 'owedbook_rows', args: {…all eight}, page, limit, offset, filters: {from, to, pbms, filter, tab}}` — `page`/`offset` are the values **requested** (the audit row is written before any read, Brief §5); the page actually served after clamping is in the returned envelope.
- **BIM-005 swap:** `supabase.rpc('owedbook_rows', {p_business_id, p_tab: tab, p_from, p_to, p_pbms, p_filter, p_page: page})` → `data as OwedBookPage`.

## 3. `owedbook_summary` — `supabase/migrations/0046_owedbook_summary.sql`

- **Mirrors:** `OwedBookService.getSummary(filters): Promise<OwedBookSummaryRow[]>` — `src/services/owedbook.ts:30` (notes :28; mock body :109-127).
- **Type:** `OwedBookSummaryRow` — `src/types/OwedBook.ts:64-68`.
- **Signature:** `owedbook_summary(p_business_id uuid, p_from date default null, p_to date default null, p_pbms text[] default '{}', p_filter text default null)`
- **Returns:** `table (pbm text, commercial_dollars numeric, federal_dollars numeric)` — one row per PBM, rows without a PBM skipped (mock :113), ordered by `commercial_dollars desc` (mock :126), rounded to 2 places (mock :122-125). `federal_dollars = 0` in v1 (`federal_diff` NULL by A-3; mock :117).
- **Logs:** `context = {fn: 'owedbook_summary', args: {…}, filters: {…}}`.
- **BIM-005 swap:** `supabase.rpc('owedbook_summary', {…})` → `data as OwedBookSummaryRow[]`.

## 4. `owedbook_pbm_options` — `supabase/migrations/0047_owedbook_pbm_options.sql`

- **Mirrors:** `OwedBookService.getPbmOptions(): Promise<string[]>` — `src/services/owedbook.ts:37` (notes :34-36; mock body :129-133).
- **Type:** `string[]`.
- **Signature:** `owedbook_pbm_options(p_business_id uuid)` — the service takes no arguments; R-4 adds only the mandatory tenant key.
- **Returns:** `setof text` — distinct non-null `insurance`, sorted.
- **Logs:** `context = {fn: 'owedbook_pbm_options', args: {p_business_id}}`.
- **BIM-005 swap:** `supabase.rpc('owedbook_pbm_options', {p_business_id})` → `data as string[]`.

---

**Not wrapped (not reads):** `uploadData(file)` (`owedbook.ts:45`) and `refreshData()` (`:52`) — Phase-5 ingest mocks.
