#!/usr/bin/env node
// QA helper (Cody, BIM-003 dynamic campaign) — Stages C–G attack probes.
//   node helpers/qa-probes.mjs <C|D|E|F|G>
// Real signed-in publishable-key sessions (fail closed, identity-asserted), all audit-row
// claims ground-truthed through the service role. Never prints secrets. SCRATCH only.
//   C — D-1 direct member read of user_data vs wrapper read (audit delta)
//   D — forgery / immutability attacks (authenticated + service role + owner channel)
//   E — tenant/membership boundary matrix across the four wrappers
//   F — service-role wrapper call (untested surface, OBSERVATION only)
//   G — attribution proof incl. a safe supabase-js session refresh
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, harnessRoot, repoRoot, CAST_PASSWORD } from "../../../../../scripts/rls-harness/lib/env.mjs";
import { anonClient, serviceClient, pgClient } from "../../../../../scripts/rls-harness/lib/db.mjs";

const QA = dirname(fileURLToPath(import.meta.url)); // .../QA/helpers
const STAGE = process.argv[2];
if (!["C", "D", "E", "F", "G"].includes(STAGE)) { console.error("usage: qa-probes.mjs <C|D|E|F|G>"); process.exit(2); }
const env = loadEnv();
const m = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const am = JSON.parse(readFileSync(join(harnessRoot, "audit-seed-map.json"), "utf8"));
const svc = serviceClient(env);
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let fails = 0;
const check = (ok, label, detail = "") => { if (!ok) fails++; say(`  ${ok ? "ok  " : "FAIL"} ${label}${detail ? " — " + detail : ""}`); };

const signIn = async (key, uid, sym) => {
  const c = anonClient(env);
  const who = (m.cast.find((x) => x.key === key)) ?? am.cast.find((x) => x.key === key);
  const { data, error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error || data?.user?.id !== uid) { console.error(`FAIL-CLOSED sign-in ${sym}: ${error?.message ?? "identity mismatch"}`); process.exit(1); }
  return c;
};
const S = {}; // filled per stage
const mkIdentity = async (key, sym, map) => { S[sym] = await signIn(key, map.users[key], sym); };
const readPageCount = async (filter) => {
  let q = svc.from("audit_logs").select("*", { count: "exact", head: true }).eq("action", "read_page");
  if (filter) q = filter(q);
  const { count, error } = await q; if (error) throw error; return count ?? 0;
};
const totalAudit = async () => { const { count, error } = await svc.from("audit_logs").select("*", { count: "exact", head: true }); if (error) throw error; return count ?? 0; };
const firstRow = async () => (await svc.from("audit_logs").select("id, actor_role, old_data, new_data, context").order("id").limit(1)).data?.[0];

const A1 = m.businesses.a1, A2 = m.businesses.a2, B1 = m.businesses.b1;
const errShape = (e) => e ? `${e.code} "${e.message}"` : "NO ERROR";

// ── Stage C — D-1 direct member read ─────────────────────────────────────────
if (STAGE === "C") {
  await mkIdentity("staffA", "member-A", m);
  const wm = (await svc.from("audit_logs").select("id").order("id", { ascending: false }).limit(1)).data?.[0]?.id ?? 0;
  say(`[stage C / D-1] member-A = staffA (junction MEMBER of A1) — audit watermark id=${wm}`);
  // staffA's authorized business set via service role (junction is the law)
  const mine = (await svc.from("user_businesses").select("business_id").eq("user_id", m.users.staffA)).data.map((r) => r.business_id);
  say(`  staffA junction memberships (svc): ${mine.map((b) => (b === A1 ? "A1" : b === A2 ? "A2" : b === B1 ? "B1" : "<uuid>")).join(", ")}`);

  const rp0 = await readPageCount();
  const direct = await S["member-A"].from("user_data").select("*").order("id");
  const rp1 = await readPageCount();
  const svcA1 = (await svc.from("user_data").select("id", { count: "exact" }).eq("business_id", A1)).count;
  const allMine = (direct.data ?? []).every((r) => mine.includes(r.business_id));
  say(`  DIRECT user_data SELECT: allowed=${!direct.error} rows=${direct.data?.length ?? 0} new read_page=${rp1 - rp0}`);
  if (direct.error) say(`    error: ${errShape(direct.error)}`);
  check(!direct.error, "member-A direct SELECT on user_data is ALLOWED under BIM-002 RLS (the D-1 bypass premise)", errShape(direct.error));
  check((direct.data?.length ?? 0) === svcA1, `returned rows == svc ground truth for A1 (${direct.data?.length} vs ${svcA1})`);
  check(allMine, "every returned row's business_id ∈ staffA's junction set (no cross-tenant leakage)");
  check(rp1 - rp0 === 0, "ZERO read_page rows created by the direct read");

  const w = await S["member-A"].rpc("owedbook_kpis", { p_business_id: A1 });
  const rp2 = await readPageCount();
  say(`  WRAPPER owedbook_kpis(A1) as member-A: allowed=${!w.error} result=${w.error ? errShape(w.error) : `1 row ${JSON.stringify(w.data?.[0])}`} new read_page=${rp2 - rp1}`);
  check(!w.error && rp2 - rp1 === 1, "wrapper read is allowed AND audited (+1 read_page)");
  const last = (await svc.from("audit_logs").select("actor_user_id, actor_role, business_id").eq("action", "read_page").order("id", { ascending: false }).limit(1)).data?.[0];
  check(last?.actor_user_id === m.users.staffA && last?.actor_role === "authenticated" && last?.actor_role, `wrapper audit row: actor_user_id=staffA, actor_role=${last?.actor_role}`);
  say(`\n[stage C verdict] DIRECT=${!direct.error ? `ALLOWED (${direct.data?.length} rows, +${rp1 - rp0} read_page)` : `DENIED`} vs WRAPPER=${!w.error ? `ALLOWED (+${rp2 - rp1} read_page)` : "DENIED"}`);
}

// ── Stage D — forgery / immutability ─────────────────────────────────────────
if (STAGE === "D") {
  await mkIdentity("ownerA", "admin-A", m);
  const t = await firstRow();
  if (!t) { console.error("no audit row on the trail — run the seeds first"); process.exit(1); }
  const n0 = await totalAudit();
  const gt = async () => (await svc.from("audit_logs").select("actor_role, old_data, new_data, context").eq("id", t.id).single()).data;

  say("[stage D — AUTHENTICATED attacks]");
  const fi = await S["admin-A"].from("audit_logs").insert({ table_name: "user_data", action: "insert", actor_role: "authenticated", business_id: A1 }).select();
  say(`  INSERT forged row: ${errShape(fi.error)}`);
  check(!!fi.error && fi.error.code === "42501" && (await totalAudit()) === n0, "forged INSERT denied (42501), trail count unchanged");
  const fu = await S["admin-A"].from("audit_logs").update({ actor_role: "forged" }).eq("id", t.id).select();
  say(`  UPDATE row ${t.id}: ${errShape(fu.error)}`);
  check(!!fu.error && fu.error.code === "42501", "authenticated UPDATE denied (privilege revoked, RF-3)");
  check((await gt()).actor_role === t.actor_role, "ground truth: actor_role unchanged");
  const fd = await S["admin-A"].from("audit_logs").delete().eq("id", t.id).select();
  say(`  DELETE row ${t.id}: ${errShape(fd.error)}`);
  check(!!fd.error && fd.error.code === "42501" && (await totalAudit()) === n0, "authenticated DELETE denied (42501), count unchanged");
  const fw = await S["admin-A"].rpc("audit_write");
  say(`  RPC audit_write() as authenticated: ${errShape(fw.error)}`);
  check(!!fw.error && (await totalAudit()) === n0, "direct invocation refused, count unchanged");

  say("[stage D — SERVICE ROLE]");
  for (const [col, val] of [["actor_role", "svc-forged"], ["old_data", { forged: true }], ["new_data", { forged: true }], ["context", { forged: true }]]) {
    const u = await svc.from("audit_logs").update({ [col]: val }).eq("id", t.id).select();
    const after = await gt();
    const unchanged = JSON.stringify(after) === JSON.stringify({ actor_role: t.actor_role, old_data: t.old_data, new_data: t.new_data, context: t.context });
    say(`  svc UPDATE ${col}: ${errShape(u.error)} · persistent state ${unchanged ? "UNCHANGED" : "CHANGED ✗"}`);
    check(!!u.error && unchanged, `svc UPDATE ${col} rejected below RLS, state unchanged`);
  }
  const d = await svc.from("audit_logs").delete().eq("id", t.id).select();
  const n1 = await totalAudit();
  say(`  svc DELETE row ${t.id}: ${errShape(d.error)} · count after=${n1}`);
  check(!!d.error && d.error.code === "P0001" && n1 === n0, "svc DELETE rejected by the R-6 guard (P0001), count unchanged");
  const db = await pgClient(env);
  try {
    await db.query("truncate public.audit_logs");
    say("  owner-channel TRUNCATE: NO ERROR ✗");
    fails++;
  } catch (e) {
    say(`  owner-channel TRUNCATE: ${e.code} "${e.message.split("\n")[0]}" · count after=${await totalAudit()}`);
    check(e.code === "P0001", "TRUNCATE rejected by the statement guard (R-6a), even for the BYPASSRLS owner");
  } finally { await db.end(); }
  const finalRow = await gt();
  check(JSON.stringify(finalRow) === JSON.stringify({ actor_role: t.actor_role, old_data: t.old_data, new_data: t.new_data, context: t.context }), "final ground truth: the tamper target row is byte-for-byte what it was");
}

// ── Stage E — tenant/membership boundaries ───────────────────────────────────
if (STAGE === "E") {
  await mkIdentity("ownerA", "admin-A", m);
  await mkIdentity("ownerB", "admin-B", m);
  await mkIdentity("staffA", "member-A", m);
  S.multi = await signIn("multiAdmin", am.users.multiAdmin, "multi");
  const CASES = [
    ["member-A", "B1", B1], ["admin-A", "B1", B1], ["admin-B", "A1", A1], ["multi", "A2", A2],
  ];
  for (const [sym, label, biz] of CASES) {
    for (const fn of ["owedbook_kpis", "owedbook_rows"]) {
      const rp0 = await readPageCount();
      const args = fn === "owedbook_rows" ? { p_business_id: biz, p_tab: "commercial_dollars" } : { p_business_id: biz };
      const r = await S[sym].rpc(fn, args);
      const rp1 = await readPageCount();
      const denied = !!r.error && /not a member of business/.test(r.error.message);
      check(denied && rp1 === rp0, `${sym} → ${fn}(${label}): refused, no PHI, +${rp1 - rp0} read_page`, r.error ? `${r.error.code} "${r.error.message}"` : `RETURNED DATA ✗ ${JSON.stringify(r.data)?.slice(0, 80)}`);
    }
  }
  const rpC0 = await readPageCount();
  const leg = await S["member-A"].rpc("owedbook_kpis", { p_business_id: A1 });
  const rpL = await readPageCount();
  check(!leg.error, "control: member-A → owedbook_kpis(A1) still succeeds", leg.error ? errShape(leg.error) : JSON.stringify(leg.data?.[0]));
  check(rpL - rpC0 === 1, "control call audited exactly one read_page row");
}

// ── Stage F — service-role wrapper (OBSERVATION) ─────────────────────────────
if (STAGE === "F") {
  const rp0 = await readPageCount();
  const r = await svc.rpc("owedbook_kpis", { p_business_id: A1 });
  const rp1 = await readPageCount();
  say(`[stage F — OBSERVATION] svc.rpc owedbook_kpis(A1): allowed=${!r.error}`);
  if (r.error) say(`  error: ${errShape(r.error)}`);
  else say(`  result: ${JSON.stringify(r.data?.[0])}`);
  const row = (await svc.from("audit_logs").select("actor_user_id, actor_role, business_id, context").eq("action", "read_page").order("id", { ascending: false }).limit(1)).data?.[0];
  say(`  read_page written: +${rp1 - rp0} · last row: actor_user_id=${row?.actor_user_id} actor_role=${row?.actor_role} business_id=${row?.business_id === A1 ? "A1" : row?.business_id} fn=${row?.context?.fn}`);
  const cross = await svc.rpc("owedbook_kpis", { p_business_id: B1 });
  say(`  svc cross-tenant probe owedbook_kpis(B1) via svc (svc IS not a junction member): ${errShape(cross.error)}`);
}

// ── Stage G — attribution ────────────────────────────────────────────────────
if (STAGE === "G") {
  await mkIdentity("ownerA", "admin-A", m);
  say("[stage G] one audited write + one wrapper read by admin-A, then a real session refresh");
  const ins = await S["admin-A"].from("user_data").insert({ business_id: A1, script: "QA-ATTR", drug_name: "attr" }).select().single();
  check(!ins.error, "write succeeded", ins.error?.message);
  const arow = (await svc.from("audit_logs").select("actor_user_id, actor_role, business_id, action, table_name, row_id").eq("table_name", "user_data").eq("row_id", ins.data.id).single()).data;
  check(arow?.actor_user_id === m.users.ownerA && arow?.actor_role === "authenticated" && arow?.business_id === A1 && arow?.action === "insert",
    `write attribution: actor_user_id=admin-A(${arow?.actor_user_id === m.users.ownerA}) actor_role=${arow?.actor_role} business=A1 action=insert row_id=pk`);
  const k1 = await S["admin-A"].rpc("owedbook_kpis", { p_business_id: A1 });
  check(!k1.error, "wrapper call 1 (pre-refresh)");
  const before = (await svc.from("audit_logs").select("id").eq("action", "read_page").order("id", { ascending: false }).limit(1)).data?.[0]?.id;
  const ref = await S["admin-A"].auth.refreshSession();
  check(!ref.error, "session refreshed (supabase-js refreshSession)", ref.error?.message);
  const k2 = await S["admin-A"].rpc("owedbook_kpis", { p_business_id: A1 });
  check(!k2.error, "wrapper call 2 (post-refresh) succeeded", k2.error?.message);
  const rows2 = (await svc.from("audit_logs").select("actor_user_id, actor_role, business_id, context").eq("action", "read_page").gte("id", before).order("id")).data ?? [];
  check(rows2.length === 2 && rows2.every((r) => r.actor_user_id === m.users.ownerA && r.actor_role === "authenticated"),
    `both read_page rows carry the SAME identity across the refresh (${rows2.map((r) => r.actor_user_id === m.users.ownerA ? "admin-A" : r.actor_user_id).join(", ")})`);
  // tidy: remove the QA write row (also audited — delete is admin-legal and audited)
  await S["admin-A"].from("user_data").delete().eq("id", ins.data.id);
}

say(`\n[qa-probes ${STAGE}] ${fails === 0 ? "ALL CHECKS AS RECORDED — see log for allowed/denied facts" : `${fails} check(s) flagged — read the log lines`}`);
const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
writeFileSync(join(QA, "..", "evidence", `QA_${STAGE}_probes_${ts}.log`), out.join("\n") + "\n");
for (const [k, s] of Object.entries(S)) { try { await s.auth?.signOut?.(); } catch {} }
process.exit(fails === 0 ? 0 : 3);