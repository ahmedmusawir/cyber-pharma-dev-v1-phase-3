#!/usr/bin/env node
// BIM-003 · rls-harness/audit-wrappers.mjs — Stage 2 session probes for the four owedbook_*
// wrappers (AC-204…208). Every call goes through a REAL signed-in session on the publishable
// key (the SQL editor lies about auth.uid()); every audit-row claim is ground-truthed through
// the service role, which bypasses RLS. Runs after seed.mjs. Fails closed on auth.
//   node scripts/rls-harness/audit-wrappers.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient, serviceClient } from "./lib/db.mjs";

const WRAPPERS = ["owedbook_kpis", "owedbook_rows", "owedbook_summary", "owedbook_pbm_options"];
const env = loadEnv();
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const svc = serviceClient(env);
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let fails = 0;
const check = (ok, label, detail = "") => { if (!ok) fails++; say(`- ${ok ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`); };

// spec identities → harness cast: admin-A = ownerA (admin A1+A2) · member-A = staffA (member A1) · anon
const sessions = {};
for (const [role, key] of [["admin-A", "ownerA"], ["member-A", "staffA"]]) {
  const c = anonClient(env);
  const who = m.cast.find((x) => x.key === key);
  const { data, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error || data?.user?.id !== m.users[key]) { console.error(`FAIL-CLOSED: sign-in ${role}/${key}: ${error?.message ?? "identity mismatch"}`); process.exit(1); }
  sessions[role] = { c, uid: data.user.id, key };
}
sessions.anon = { c: anonClient(env), uid: null, key: "anon" };
const A = m.businesses.a1, B = m.businesses.b1;

const args = (fn, biz) => fn === "owedbook_rows" ? { p_business_id: biz, p_tab: "commercial_dollars" } : { p_business_id: biz };
const readPageCount = async () => (await svc.from("audit_logs").select("*", { count: "exact", head: true }).eq("action", "read_page")).count ?? 0;
const lastReadPage = async () => (await svc.from("audit_logs").select("*").eq("action", "read_page").order("id", { ascending: false }).limit(1)).data?.[0];

say(`# S2 wrapper probes — BIM-003-CYBER-PHARMA`);
say(`Generated ${new Date().toISOString()} by \`scripts/rls-harness/audit-wrappers.mjs\` against host \`${new URL(env.SUPABASE_URL).hostname}\` after \`seed.mjs\`. Identities: admin-A = ownerA (admin of A1), member-A = staffA (member of A1), anon. Business A = store A1, business B = store B1 (200 seeded user_data rows each).`);
say();

for (const [ac, role] of [["AC-204", "admin-A"], ["AC-205", "member-A"]]) {
  say(`## ${ac} — ${role} calls every wrapper with p_business_id = A: returns, and inserts exactly one read_page row`);
  const s = sessions[role];
  for (const fn of WRAPPERS) {
    const before = await readPageCount();
    const { data, error } = await s.c.rpc(fn, args(fn, A));
    const after = await readPageCount();
    const row = await lastReadPage();
    const shape = fn === "owedbook_kpis" ? `1 row ${JSON.stringify(data?.[0])}`
      : fn === "owedbook_rows" ? `page ${data?.page}/${data?.pageCount} limit ${data?.limit} total ${data?.total} rows ${data?.rows?.length}`
      : Array.isArray(data) ? `${data.length} item(s)` : String(data);
    const ok = !error && after === before + 1 && row?.action === "read_page" && row?.business_id === A && row?.actor_user_id === s.uid
      && row?.actor_role === "authenticated" && row?.table_name != null && row?.context?.fn === fn;
    check(ok, `${fn}(A) as ${role}`, error ? `ERROR ${error.code} ${error.message}` : `${shape}; audit +${after - before}; row: business_id=${row?.business_id === A ? "A" : row?.business_id} actor=${row?.actor_user_id === s.uid ? role : row?.actor_user_id} role=${row?.actor_role} table=${row?.table_name} context.fn=${row?.context?.fn}`);
  }
  say();
}

say(`## AC-206 — admin-A calls every wrapper with p_business_id = B: raises 'not a member of business', inserts zero rows`);
for (const fn of WRAPPERS) {
  const before = await readPageCount();
  const { error } = await sessions["admin-A"].c.rpc(fn, args(fn, B));
  const after = await readPageCount();
  check(!!error && /not a member of business/.test(error.message) && after === before, `${fn}(B) as admin-A`, `${error ? `${error.code} "${error.message}"` : "NO ERROR"}; audit +${after - before}`);
}
say();

say(`## AC-207 — anon calls every wrapper: denied (no EXECUTE), inserts zero rows`);
for (const fn of WRAPPERS) {
  const before = await readPageCount();
  const { error } = await sessions.anon.c.rpc(fn, args(fn, A));
  const after = await readPageCount();
  check(!!error && error.code === "42501" && after === before, `${fn}(A) as anon`, `${error ? `${error.code} "${error.message}"` : "NO ERROR"}; audit +${after - before}`);
}
say();

say(`## AC-208 — one wrapper call returning K ≥ 2 rows inserts exactly one row, not K`);
{
  const before = await readPageCount();
  const { data, error } = await sessions["admin-A"].c.rpc("owedbook_rows", { p_business_id: A, p_tab: "commercial_dollars", p_page: 1, p_limit: 25 });
  const after = await readPageCount();
  const K = data?.rows?.length ?? 0;
  check(!error && K >= 2 && after === before + 1, `owedbook_rows(A, page 1, limit 25) as admin-A`, error ? `ERROR ${error.message}` : `K = ${K} rows served (total ${data?.total}, pageCount ${data?.pageCount}); audit +${after - before}`);
  const row = await lastReadPage();
  check(row?.context?.page === 1 && row?.context?.limit === 25 && row?.context?.offset === 0 && row?.context?.filters?.tab === "commercial_dollars", "context carries page/limit/offset/filters", JSON.stringify(row?.context));
  const r0 = data?.rows?.[0] ?? {};
  const keys = ["id","date","script","qty","pbm","status","report_file","original_paid","medicaid_rate","method","expected","owed","new_paid","updated_difference","aac","federal_expected","federal_diff"];
  check(keys.every((k) => k in r0) && Object.keys(r0).length === keys.length, `each row carries exactly the 17 OwedBookRow keys`, `row[0] = ${JSON.stringify(r0)}`);
  check(data && ["rows","page","pageCount","limit","total"].every((k) => k in data), "envelope carries rows/page/pageCount/limit/total");
}
say();

say(`## Shape spot-checks (return types mirror the service contract)`);
{
  const s = sessions["admin-A"].c;
  const kp = (await s.rpc("owedbook_kpis", { p_business_id: A })).data?.[0];
  check(kp && ["commercial_underpaid","commercial_scripts","updated_difference","owed"].every((k) => k in kp), "owedbook_kpis → OwedBookKpis keys", JSON.stringify(kp));
  const sm = (await s.rpc("owedbook_summary", { p_business_id: A })).data;
  check(Array.isArray(sm) && sm.every((r) => ["pbm","commercial_dollars","federal_dollars"].every((k) => k in r)), `owedbook_summary → OwedBookSummaryRow[] (${sm?.length} rows; seed carries no insurance so 0 is expected)`, JSON.stringify(sm));
  const po = (await s.rpc("owedbook_pbm_options", { p_business_id: A })).data;
  check(Array.isArray(po) && po.every((x) => typeof x === "string"), `owedbook_pbm_options → string[] (${po?.length})`, JSON.stringify(po));
  const upd = (await s.rpc("owedbook_rows", { p_business_id: A, p_tab: "updated_commercial_payments" })).data;
  const fed = (await s.rpc("owedbook_rows", { p_business_id: A, p_tab: "federal_dollars" })).data;
  const p9 = (await s.rpc("owedbook_rows", { p_business_id: A, p_tab: "commercial_dollars", p_page: 99 })).data;
  check(upd?.total === 0 && fed?.total === 0 && p9?.page === p9?.pageCount && p9?.rows?.length > 0, `tabs + pager: updated total=${upd?.total} (seed has no new_paid), federal total=${fed?.total} (NULL by A-3), page 99 clamps to ${p9?.page}/${p9?.pageCount} with ${p9?.rows?.length} rows`);
  const { error: badTab } = await s.rpc("owedbook_rows", { p_business_id: A, p_tab: "nope" });
  check(!!badTab && /unknown tab/.test(badTab.message), "unknown tab raises", badTab?.message);
}
say();

say(`## Verdict`);
say(fails === 0 ? "**S2 WRAPPER PROBES GREEN** — every assertion above holds." : `**${fails} ASSERTION(S) FAILED** — see ❌ above.`);
writeFileSync(join(repoRoot, "agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/S2_wrappers.md"), out.join("\n") + "\n");
for (const s of Object.values(sessions)) if (s.uid) await s.c.auth.signOut();
process.exit(fails === 0 ? 0 : 3);
