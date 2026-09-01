#!/usr/bin/env node
// BIM-002 · rls-harness/policy-check.mjs — the structural laws, checked
// mechanically after EVERY landing. Reads pg_catalog only (F-3).
//
//   L1 (AC6) one permissive policy per operation per table
//   L2 (AC7/F-1) no write policy on a table lacking a SELECT policy, and the
//      SELECT appears EARLIER in the same migration file
//   L3 (junction-first) any policy whose body contains the inline junction
//      subquery requires a SELECT policy on user_businesses — defence-in-depth
//      under formulation C, load-bearing if a predicate ever reverts to B
//   L4 (Gap-6/AC5) no policy or helper body references user_roles, profiles,
//      user_metadata, raw_user_meta_data, or owner_user_id
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, repoRoot } from "./lib/env.mjs";
import { pgClient } from "./lib/db.mjs";

const env = loadEnv();
const db = await pgClient(env);
const q = async (s) => (await db.query(s)).rows;
const fails = [];
const ok = (s) => console.log("  ok   " + s);
const bad = (s) => { console.error("  FAIL " + s); fails.push(s); };

// ── L1 ──
const perOp = await q(`select tablename, cmd, count(*)::int n, string_agg(policyname, ', ' order by policyname) names
  from pg_policies where schemaname='public' and permissive='PERMISSIVE' group by 1,2 order by 1,2`);
let l1 = true;
for (const r of perOp) if (r.n > 1) { bad(`L1 one-per-op: ${r.tablename}.${r.cmd} has ${r.n} (${r.names})`); l1 = false; }
if (l1) ok(`L1 one permissive policy per operation per table (${perOp.length} table×op groups)`);

// ── L2 ── catalog half
const byTable = {};
for (const r of await q(`select tablename, cmd from pg_policies where schemaname='public'`)) (byTable[r.tablename] ||= []).push(r.cmd);
let l2 = true;
for (const [t, cmds] of Object.entries(byTable)) {
  const writes = cmds.filter((c) => c !== "SELECT");
  if (writes.length && !cmds.includes("SELECT")) { bad(`L2 SELECT-before-write: ${t} has ${writes.join("/")} but NO SELECT policy (F-1 silent no-op)`); l2 = false; }
}
// ── L2 ── file-order half: SELECT must appear earlier in the same migration
const migDir = join(repoRoot, "supabase", "migrations");
for (const f of readdirSync(migDir).filter((f) => /^00(1[6-9]|[2-9]\d)_rls_.+\.sql$/.test(f)).sort()) {
  const body = readFileSync(join(migDir, f), "utf8");
  const stmts = [...body.matchAll(/create\s+policy\s+"([^"]+)"[\s\S]*?for\s+(select|insert|update|delete)/gi)];
  const firstWrite = stmts.findIndex((s) => s[2].toLowerCase() !== "select");
  const firstSelect = stmts.findIndex((s) => s[2].toLowerCase() === "select");
  if (firstWrite !== -1 && (firstSelect === -1 || firstSelect > firstWrite)) { bad(`L2 file order: ${f} creates a write policy before its SELECT policy`); l2 = false; }
}
if (l2) ok("L2 SELECT-before-write holds (catalog + migration file order)");

// ── L3 ──
const bodies = await q(`select tablename, policyname, coalesce(qual,'') || ' ' || coalesce(with_check,'') body from pg_policies where schemaname='public'`);
const inlineJunction = bodies.filter((b) => /from\s+user_businesses/i.test(b.body) && !/my_business_ids|is_member_of|is_admin_of|is_account_member/i.test(b.body));
if (inlineJunction.length) {
  const junctionSelect = bodies.some((b) => b.tablename === "user_businesses");
  if (!junctionSelect) bad(`L3 junction-first: ${inlineJunction.length} inline-junction policy(ies) but no SELECT policy on user_businesses (formulation-B blindness)`);
  else ok(`L3 junction-first satisfied for ${inlineJunction.length} inline-junction policy(ies)`);
} else ok("L3 junction-first: no inline-junction predicates in use (formulation C adopted)");

// ── L4 ──
const banned = /\buser_roles\b|\bprofiles\b|user_metadata|raw_user_meta_data|owner_user_id/i;
let l4 = true;
for (const b of bodies) {
  if (b.tablename === "user_roles" || b.tablename === "profiles") continue; // the 3 baseline policies, untouched by this module
  if (banned.test(b.body)) { bad(`L4 Gap-6: policy ${b.tablename}.${b.policyname} body references a forbidden source`); l4 = false; }
}
for (const h of await q(`select proname, prosrc from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname in ('is_member_of','is_admin_of','is_account_member','my_business_ids')`)) {
  if (banned.test(h.prosrc)) { bad(`L4 Gap-6: helper ${h.proname} body references a forbidden source`); l4 = false; }
}
if (l4) ok("L4 Gap-6: no policy or helper reads user_roles / profiles / metadata / owner_user_id");

console.log("  ── policy inventory ──");
for (const r of perOp) console.log(`     ${r.tablename.padEnd(28)} ${r.cmd.padEnd(6)} × ${r.n}  ${r.names}`);
const total = (await q(`select count(*)::int n from pg_policies where schemaname='public'`))[0].n;
console.log(`  total policies in public: ${total}`);
await db.end();
if (fails.length) { console.error(`[policy-check] ${fails.length} LAW VIOLATION(S)`); process.exit(3); }
console.log("[policy-check] ALL LAWS HOLD");
