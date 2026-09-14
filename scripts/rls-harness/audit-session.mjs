#!/usr/bin/env node
// BIM-003 · rls-harness/audit-session.mjs — the scripted two-tenant session (AC-302) and its probes,
// then the golden diff (AC-303/304 under ERRATUM E-2). Runs after seed.mjs + audit-seed.mjs.
//
//   watermark → six tampering probes (AC-106) → admin-A insert/update/delete on user_data (AC-116/117)
//   → svc write on an R-8 table (AC-118/119) → five wrapper calls by admin-A + one by multi (AC-204)
//   → cross-tenant wrapper attempt (AC-206) → admin-A INSERT into audit_logs (AC-113)
//   → SELECT scoping for admin-A / member-A / admin-B / multi / anon (AC-109…112, G-4)
//   → rows after the watermark, normalised to symbols, diffed row-for-row against the golden (G-6).
//
// Every claim about audit rows is ground-truthed through the service role (bypasses RLS). Every
// session is a REAL signed-in publishable-key session with its identity asserted. Fail closed.
// Symbols (E-2): actor_user_id → admin-A | member-A | admin-B | multi · business_id → A1 | A2 | B1 ·
// any other uuid → <uuid> · old_data/new_data → "present" | null (payload key set asserted here,
// not in the golden) · context deep-symbolised.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient, serviceClient } from "./lib/db.mjs";

const env = loadEnv();
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const am = JSON.parse(readFileSync(join(harnessRoot, "audit-seed-map.json"), "utf8"));
const GOLDEN_PATH = join(harnessRoot, "golden", "audit_trail_expected.json");
const evidenceDir = join(repoRoot, "agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence");
const svc = serviceClient(env);
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let fails = 0;
const check = (ok, label, detail = "") => { if (!ok) fails++; say(`  ${ok ? "ok  " : "FAIL"} ${label}${detail ? " — " + detail : ""}`); };

// ── identities: spec symbol → harness cast; fail closed, assert the identity we run as ──
const IDENT = {
  "admin-A":  ["ownerA",     m.users.ownerA,      m.cast],
  "member-A": ["staffA",     m.users.staffA,      m.cast],
  "admin-B":  ["ownerB",     m.users.ownerB,      m.cast],
  "multi":    ["multiAdmin", am.users.multiAdmin, am.cast],
};
const S = {};
for (const [sym, [key, uid, cast]] of Object.entries(IDENT)) {
  const c = anonClient(env);
  const who = cast.find((x) => x.key === key);
  const { data, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error || data?.user?.id !== uid) { console.error(`FAIL-CLOSED: sign-in ${sym} (${key}): ${error?.message ?? "identity mismatch"}`); process.exit(1); }
  S[sym] = c;
}
S.anon = anonClient(env);
const A1 = m.businesses.a1, A2 = m.businesses.a2, B1 = m.businesses.b1;

// ── symbol maps (E-2) ──
const USER_SYM = { [m.users.ownerA]: "admin-A", [m.users.staffA]: "member-A", [m.users.ownerB]: "admin-B", [am.users.multiAdmin]: "multi" };
const BIZ_SYM = { [A1]: "A1", [A2]: "A2", [B1]: "B1" };
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const symbolise = (v) => typeof v === "string" ? v.replace(UUID, (u) => BIZ_SYM[u] ?? USER_SYM[u] ?? "<uuid>") : v;
const deep = (v) => Array.isArray(v) ? v.map(deep) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)])) : symbolise(v);
const normalise = (r) => ({
  table_name: r.table_name, action: r.action, actor_role: r.actor_role,
  actor_user_id: r.actor_user_id === null ? null : (USER_SYM[r.actor_user_id] ?? "<uuid>"),
  business_id: r.business_id === null ? null : (BIZ_SYM[r.business_id] ?? "<uuid>"),
  row_id: r.row_id === null ? null : r.row_id.replace(UUID, "<uuid>"),
  old_data: r.old_data === null ? null : "present",
  new_data: r.new_data === null ? null : "present",
  context: r.context === null ? null : deep(r.context),
});
const sortKeys = (v) => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])])) : v;
const canon = (v) => JSON.stringify(sortKeys(v));

const gtCount = async (filter) => { let q = svc.from("audit_logs").select("*", { count: "exact", head: true }); q = filter ? filter(q) : q; const { count, error } = await q; if (error) throw error; return count ?? 0; };
const sessCount = async (c, filter) => { let q = c.from("audit_logs").select("*", { count: "exact", head: true }); q = filter ? filter(q) : q; const { count, error } = await q; return error ? { error } : { count: count ?? 0 }; };

say(`[audit-session] BIM-003 scripted two-tenant session — ${new Date().toISOString()} — host ${new URL(env.SUPABASE_URL).hostname}`);
const wm = (await svc.from("audit_logs").select("id").order("id", { ascending: false }).limit(1)).data?.[0]?.id ?? 0;
say(`  watermark: audit_logs.id = ${wm} (${await gtCount()} rows on the trail before the session)`);

// ── AC-106: six tampering probes, six raises, ground truth unchanged ──
say("\nAC-106 — tampering: UPDATE and DELETE on audit_logs as svc, admin-A, anon (six probes)");
const target = (await svc.from("audit_logs").select("id, actor_role").order("id").limit(1)).data?.[0];
if (!target) { say("  FAIL no audit row exists to tamper with"); fails++; }
const roleOf = async () => (await svc.from("audit_logs").select("actor_role").eq("id", target.id).single()).data?.actor_role;
const total0 = await gtCount();
for (const [sym, c, want] of [["svc", svc, "P0001"], ["admin-A", S["admin-A"], "42501"], ["anon", S.anon, "42501"]]) {
  const u = await c.from("audit_logs").update({ actor_role: "tampered" }).eq("id", target.id).select();
  check(!!u.error && u.error.code === want && (await roleOf()) === target.actor_role, `${sym} UPDATE raises`, `${u.error ? `${u.error.code} "${u.error.message}"` : "NO ERROR"} · ground truth actor_role=${await roleOf()}`);
  const d = await c.from("audit_logs").delete().eq("id", target.id).select();
  check(!!d.error && d.error.code === want && (await gtCount()) === total0, `${sym} DELETE raises`, `${d.error ? `${d.error.code} "${d.error.message}"` : "NO ERROR"} · ground truth count=${await gtCount()}`);
}

// ── AC-116/117/119: admin-A writes one of each action on a business_id table ──
say("\nAC-116/117 — admin-A INSERT → UPDATE → DELETE on user_data (A1)");
const ins = await S["admin-A"].from("user_data").insert({ business_id: A1, script: "RX-SESSION", drug_name: "session" }).select().single();
check(!ins.error, "insert", ins.error?.message ?? `id ${ins.data?.id}`);
const sid = ins.data?.id;
const upd = await S["admin-A"].from("user_data").update({ drug_name: "session-2" }).eq("id", sid).select();
check(!upd.error && upd.data?.length === 1, "update", upd.error?.message ?? "1 row");
const del = await S["admin-A"].from("user_data").delete().eq("id", sid).select();
check(!del.error && del.data?.length === 1, "delete", del.error?.message ?? "1 row");
const trail = (await svc.from("audit_logs").select("*").eq("row_id", sid).order("id")).data ?? [];
const t = (a) => trail.find((r) => r.action === a);
check(trail.length === 3 && t("insert") && t("update") && t("delete"), `three trail rows for row ${sid ? "<session-row>" : "?"}`, trail.map((r) => r.action).join(","));
check(t("insert")?.new_data && !t("insert")?.old_data && t("insert")?.business_id === A1 && t("insert")?.table_name === "user_data" && t("insert")?.row_id === sid, "insert: new_data only, business_id A1, table user_data, row_id = pk");
check(t("update")?.new_data && t("update")?.old_data, "update: old_data AND new_data");
check(t("delete")?.old_data && !t("delete")?.new_data, "delete: old_data only");
check(trail.every((r) => r.actor_user_id === m.users.ownerA && r.actor_role === "authenticated"), "AC-119: actor_user_id = admin-A, actor_role = authenticated");
check(trail.every((r) => ["id", "business_id"].every((k) => k in (r.new_data ?? r.old_data))), "payload key set carries id + business_id (E-2 stable keys)");

// ── AC-118/119: one write on an R-8 table (service role — tenants hold no write policy there) ──
say("\nAC-118 — svc INSERT on apa_memberships (R-8: no business_id)");
const apa = await svc.from("apa_memberships").insert({ license_number: `LIC-SESSION-${Date.now()}`, membership: "APA", first_name: "S", last_name: "Ession" }).select().single();
check(!apa.error, "svc insert", apa.error?.message ?? "1 row");
const apaRow = (await svc.from("audit_logs").select("*").eq("row_id", apa.data?.id).single()).data;
check(apaRow?.business_id === null && apaRow?.context !== null && apaRow?.context?.id === apa.data?.id, "R-8 row: business_id NULL, context non-null carrying the identifying key", JSON.stringify(apaRow?.context));
check(apaRow?.actor_user_id === null && apaRow?.actor_role === "service_role", "AC-119: svc write → actor_user_id NULL, actor_role service_role");

// ── wrappers: one call per owedbook_* by admin-A on A1 (+ updated tab), one by multi on B1 ──
say("\nAC-302 — wrapper calls (log-then-return, R-10 shapes non-empty)");
const rp0 = await gtCount((q) => q.eq("action", "read_page"));
const A = S["admin-A"];
const kp = await A.rpc("owedbook_kpis", { p_business_id: A1 });
check(!kp.error && kp.data?.[0]?.commercial_scripts === 204 && Number(kp.data?.[0]?.commercial_underpaid) === 20119.5 && Number(kp.data?.[0]?.updated_difference) === 6, "owedbook_kpis(A1): 204 scripts · 20119.50 underpaid · 6.00 updated_difference (200 seed + 4 R-10)", kp.error?.message ?? JSON.stringify(kp.data?.[0]));
const rw = await A.rpc("owedbook_rows", { p_business_id: A1, p_tab: "commercial_dollars" });
check(!rw.error && rw.data?.total === 204 && rw.data?.rows?.length === 25 && rw.data?.pageCount === 9, "owedbook_rows(A1, commercial): total 204, 25 rows, 9 pages", rw.error?.message ?? `${rw.data?.total}/${rw.data?.rows?.length}/${rw.data?.pageCount}`);
const ru = await A.rpc("owedbook_rows", { p_business_id: A1, p_tab: "updated_commercial_payments" });
check(!ru.error && ru.data?.total === 2 && ru.data?.rows?.every((r) => r.new_paid !== null), "owedbook_rows(A1, updated): total 2, every row has new_paid (R-10)", ru.error?.message ?? `${ru.data?.total}`);
const sm = await A.rpc("owedbook_summary", { p_business_id: A1 });
check(!sm.error && canon(sm.data) === canon([{ pbm: "OptumRx", commercial_dollars: 10, federal_dollars: 0 }, { pbm: "Caremark", commercial_dollars: 9.5, federal_dollars: 0 }]), "owedbook_summary(A1): [OptumRx 10.00, Caremark 9.50] desc (R-10)", sm.error?.message ?? JSON.stringify(sm.data));
const po = await A.rpc("owedbook_pbm_options", { p_business_id: A1 });
check(!po.error && canon(po.data) === canon(["Caremark", "OptumRx"]), "owedbook_pbm_options(A1): [Caremark, OptumRx] (R-10)", po.error?.message ?? JSON.stringify(po.data));
const mk = await S.multi.rpc("owedbook_kpis", { p_business_id: B1 });
check(!mk.error && mk.data?.[0]?.commercial_scripts === 200, "multi → owedbook_kpis(B1): 200 scripts (second tenant in the trail)", mk.error?.message ?? JSON.stringify(mk.data?.[0]));
check((await gtCount((q) => q.eq("action", "read_page"))) === rp0 + 6, "exactly six read_page rows for six wrapper calls (R-7)");

// ── AC-206: cross-tenant wrapper attempt ──
say("\nAC-206 — admin-A → owedbook_kpis(B1)");
const rp1 = await gtCount((q) => q.eq("action", "read_page"));
const x = await A.rpc("owedbook_kpis", { p_business_id: B1 });
check(!!x.error && /not a member of business/.test(x.error.message) && (await gtCount((q) => q.eq("action", "read_page"))) === rp1, "raises 'not a member of business', zero rows inserted", x.error ? `${x.error.code} "${x.error.message}"` : "NO ERROR");

// ── AC-113: admin-A INSERT into audit_logs ──
say("\nAC-113 — admin-A INSERT into audit_logs");
const tot1 = await gtCount();
const ai = await A.from("audit_logs").insert({ table_name: "user_data", action: "insert", actor_role: "authenticated" }).select();
check(!!ai.error && ai.error.code === "42501" && (await gtCount()) === tot1, "denied by RLS (42501), count unchanged", ai.error ? `${ai.error.code} "${ai.error.message}"` : "NO ERROR");

// ── AC-109…112 / G-4: SELECT scoping on the trail itself ──
say("\nAC-109…112 — audit_logs SELECT scoping (junction ADMIN of the row's business only)");
const inSet = (ids) => (q) => q.in("business_id", ids);
const outSet = (ids) => (q) => q.not("business_id", "in", `(${ids.join(",")})`);
const expA = await gtCount(inSet([A1, A2])), expB = await gtCount(inSet([B1])), expM = await gtCount(inSet([A1, B1]));
const cA = await sessCount(A), cAout = await sessCount(A, outSet([A1, A2])), cAnull = await sessCount(A, (q) => q.is("business_id", null));
check(cA.count === expA && cAout.count === 0 && cAnull.count === 0, `AC-109 admin-A: ${cA.count} rows = expected A-count ${expA} (A1+A2, ownerA is admin of both); outside A = ${cAout.count}; NULL-business = ${cAnull.count}`);
const cS = await sessCount(S["member-A"]);
check(cS.count === 0, `AC-110 member-A: ${cS.count} rows (expected 0)`);
const cB = await sessCount(S["admin-B"]), cBout = await sessCount(S["admin-B"], outSet([B1]));
check(cB.count === expB && cBout.count === 0, `AC-111 admin-B: ${cB.count} rows = expected B-count ${expB}; outside B = ${cBout.count}`);
const cM = await sessCount(S.multi), cMout = await sessCount(S.multi, outSet([A1, B1]));
check(cM.count === expM && cMout.count === 0, `AC-111 multi: ${cM.count} rows = expected A1+B1 count ${expM}; outside = ${cMout.count}`);
const cN = await sessCount(S.anon);
check(cN.error || cN.count === 0, `AC-112 anon: ${cN.error ? `denied (${cN.error.code})` : `${cN.count} rows`}`);

// ── G-6 / AC-303: the golden trail ──
say("\nAC-303 — golden diff (rows after the watermark, ordered by id, id/occurred_at excluded, symbolised per E-2)");
const produced = ((await svc.from("audit_logs").select("*").gt("id", wm).order("id")).data ?? []).map(normalise);
const golden = JSON.parse(readFileSync(GOLDEN_PATH, "utf8"));
let diffs = 0;
const n = Math.max(produced.length, golden.length);
for (let i = 0; i < n; i++) {
  const p = produced[i], g = golden[i];
  if (canon(p) !== canon(g)) {
    diffs++;
    say(`  DIFF at row ${i + 1}:`);
    say(`    expected: ${g === undefined ? "<no row>" : JSON.stringify(g)}`);
    say(`    produced: ${p === undefined ? "<no row>" : JSON.stringify(p)}`);
  }
}
check(produced.length === golden.length, `row count: produced ${produced.length}, golden ${golden.length}`);
check(diffs === 0, `${diffs} differing row(s) against golden/audit_trail_expected.json`);

say(`\n[audit-session] ${fails === 0 ? "TRAIL EXACT — every probe green and the produced trail matches the golden row-for-row" : `${fails} FAILURE(S)`}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(evidenceDir, `S3_audit_session_${ts}.log`), out.join("\n") + "\n");
writeFileSync(join(evidenceDir, `S3_audit_session_${ts}.produced.json`), JSON.stringify(produced, null, 2) + "\n");
for (const [k, c] of Object.entries(S)) if (k !== "anon") await c.auth.signOut();
process.exit(fails === 0 ? 0 : 3);
