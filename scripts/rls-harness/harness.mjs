#!/usr/bin/env node
// BIM-002 · rls-harness/harness.mjs — the expectation matrix.
// 5 identities × 16 tables × 4 operations = 320 cells, every cell run through a
// REAL signed-in session on the publishable key (the SQL editor lies about RLS).
// Exits non-zero on any mismatch. One uniquely-named evidence file per run.
//
// Self-cleaning (Proto 06 F-9): a probe's UPDATE/DELETE prefer the row its own
// INSERT created, so a destructive test destroys only what it made and the suite
// is idempotent across runs.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, harnessRoot, CAST_PASSWORD } from "./lib/env.mjs";
import { anonClient, serviceClient } from "./lib/db.mjs";
import { payloadsFor } from "./payloads.mjs";
import { verdictFromResult, ALLOW, DENY } from "./lib/verdict.mjs";

const env = loadEnv();
const exp = JSON.parse(readFileSync(join(harnessRoot, "expectations.json"), "utf8"));
const seed = JSON.parse(readFileSync(join(harnessRoot, "seed-map.json"), "utf8"));
const payloads = payloadsFor(seed);
const label = process.argv[2] ?? exp.phase;

const lines = [];
const log = (s) => { lines.push(s); if (!process.env.RLS_QUIET) console.log(s); };
const expectationFor = (id, t, op) => exp.overrides?.[id]?.[t]?.[op] ?? exp.default;

async function sessionFor(identity) {
  const c = anonClient(env);
  if (identity === "anon") return c;
  const who = seed.cast.find((x) => x.key === identity);
  const { error } = await c.auth.signInWithPassword({ email: who.email, password: CAST_PASSWORD });
  if (error) { console.error(`FAIL-CLOSED: sign-in ${identity}: ${error.message}`); process.exit(1); }
  return c;
}

// Rows this run created and did NOT manage to delete (INSERT permitted but
// DELETE denied is a legitimate policy outcome). Without this, repeated runs
// inflate seeded counts and the suite stops being idempotent — caught at X3 by
// the row-scoping check (426 rows where 400 were seeded).
const litter = [];
// Seeded rows a permitted UPDATE mutated in place; restored from payloads.restore.
const restored = [];

async function probeTable(c, table, identity) {
  const p = payloads[table];
  const chain = {};
  const cells = {};
  for (const op of exp.operations) {
    if (op === "select") {
      cells.select = verdictFromResult(await c.from(table).select("*").limit(5));
    } else if (op === "insert") {
      const r = await c.from(table).insert(p.insert).select();
      const v = verdictFromResult(r);
      if (v.outcome === ALLOW) { chain.id = r.data[0].id; litter.push([table, r.data[0].id]); }
      cells.insert = v;
    } else {
      const id = chain.id ?? p.targetFor?.(identity) ?? p.target ?? "00000000-0000-4000-8000-0000000dead0";
      const q = op === "update" ? c.from(table).update(p.patch).eq("id", id).select()
                                : c.from(table).delete().eq("id", id).select();
      const v = verdictFromResult(await q);
      if (op === "delete" && v.outcome === ALLOW) {
        const i = litter.findIndex(([t, lid]) => t === table && lid === id);
        if (i !== -1) litter.splice(i, 1); // the probe cleaned up after itself
      }
      if (op === "update" && v.outcome === ALLOW && !chain.id) restored.push([table, id, p.restore ?? null]);
      cells[op] = v;
    }
  }
  return cells;
}

log(`[harness] ${label} — ${exp.identities.length} identities × ${exp.tables.length} tables × ${exp.operations.length} ops = ${exp.identities.length * exp.tables.length * exp.operations.length} cells`);
let mismatches = 0, cells = 0;
const failed = [];
for (const identity of exp.identities) {
  const c = await sessionFor(identity);
  // tables run concurrently; ops within a table stay ordered (insert feeds update/delete)
  const perTable = await Promise.all(exp.tables.map(async (t) => [t, await probeTable(c, t, identity)]));
  for (const [table, ops] of perTable) {
    for (const op of exp.operations) {
      cells++;
      const expected = expectationFor(identity, table, op);
      const { outcome, detail } = ops[op];
      const ok = outcome === expected;
      if (!ok) { mismatches++; failed.push(`${identity}×${table}×${op} got ${outcome} want ${expected}`); }
      log(`  ${ok ? "ok  " : "MISMATCH"} ${identity} × ${table} × ${op} → ${outcome} (${detail}) expected=${expected}`);
    }
  }
  if (identity !== "anon") await c.auth.signOut();
}
// ── restore the scratch to its seeded shape (idempotence, not cosmetics) ──
// Service-role use is confined to this file and lib/db.mjs (AC19 fence) and is
// never used to evaluate a matrix cell — only to undo what the probes did.
const svc = serviceClient(env);
let cleaned = 0, reverted = 0;
for (const [table, id] of litter) {
  const { error } = await svc.from(table).delete().eq("id", id);
  if (!error) cleaned++;
}
for (const [table, id, patch] of restored) {
  if (!patch) continue;
  const { error } = await svc.from(table).update(patch).eq("id", id);
  if (!error) reverted++;
}
log(`[harness] cleanup: ${cleaned} probe row(s) removed, ${reverted} seeded row(s) restored — scratch back to seeded shape`);

log(`[harness] ${cells} cells · ${mismatches} mismatches → ${mismatches === 0 ? "MATRIX GREEN" : "MATRIX RED"}`);
if (mismatches) for (const f of failed) log(`   RED: ${f}`);

const ts = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
const path = join(harnessRoot, "..", "..", "agent_docs", "ACTIONS", "BIM-002-CYBER-PHARMA", "evidence", `${label}_${ts}.log`);
writeFileSync(path, lines.join("\n") + "\n");
console.log(`[harness] ${mismatches === 0 ? "GREEN" : "RED"} (${cells} cells) → ${path.split("/agent_docs/")[1]}`);
process.exit(mismatches === 0 ? 0 : 3);
