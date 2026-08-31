#!/usr/bin/env node
// Independent AC14 comparison of generated Supabase Row types against the
// preserved post-chain pg_catalog snapshot from Cody's database attack.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const catalogPath = join(here, "CODY_AC04_AC12_STRUCTURAL_NEGATIVE_20260828101509.log");
const typesPath = join(repo, "src", "types", "supabase.ts");
const catalogText = readFileSync(catalogPath, "utf8");
const typesText = readFileSync(typesPath, "utf8");
const expectedTables = [
  "aac_reference", "accounts", "apa_memberships", "audit_logs", "businesses",
  "ful_reference", "pbm_info", "pending_registrations", "profiles",
  "reference_dataset_versions", "report_files", "subscriptions",
  "user_businesses", "user_data", "user_roles", "wac_reference",
];
const deferred = ["desktop_client_versions", "local_desktop_users", "password_reset_tokens"];

const jsonLine = (prefix) => {
  const line = catalogText.split("\n").find((x) => x.startsWith(`${prefix}=`));
  if (!line) throw new Error(`missing catalog evidence line ${prefix}`);
  return JSON.parse(line.slice(prefix.length + 1));
};
const columns = jsonLine("CATALOG_columns");
const constraints = jsonLine("AC4_constraints");

const generated = {};
let table = null;
let inRow = false;
for (const line of typesText.split("\n")) {
  const tm = line.match(/^      ([a-z][a-z0-9_]*): \{$/);
  if (tm && !inRow) {
    table = tm[1];
    generated[table] ??= {};
    continue;
  }
  if (table && line === "        Row: {") {
    inRow = true;
    continue;
  }
  if (inRow && line === "        }") {
    inRow = false;
    continue;
  }
  if (inRow) {
    const cm = line.match(/^          ([a-z][a-z0-9_]*): (.+)$/);
    if (cm) generated[table][cm[1]] = cm[2];
  }
}

const pgBaseToTs = (pgType) => {
  if (pgType === "boolean") return "boolean";
  if (pgType === "bigint" || pgType === "integer" || pgType.startsWith("numeric")) return "number";
  if (pgType === "app_role") return 'Database["public"]["Enums"]["app_role"]';
  if (pgType === "uuid" || pgType === "text" || pgType === "date" || pgType === "timestamp with time zone" || pgType.startsWith("character varying")) return "string";
  return `UNMAPPED:${pgType}`;
};

const catalogTables = [...new Set(columns.map((c) => c.table_name))].sort();
const generatedTables = Object.keys(generated).filter((t) => expectedTables.includes(t) || deferred.includes(t)).sort();
const missingTables = expectedTables.filter((t) => !generated[t]);
const deferredPresent = deferred.filter((t) => generated[t]);
const columnMismatches = [];
for (const t of expectedTables) {
  const actual = columns.filter((c) => c.table_name === t);
  const typed = generated[t] || {};
  for (const c of actual) {
    const base = pgBaseToTs(c.data_type);
    const expected = c.attnotnull ? base : `${base} | null`;
    if (!(c.column_name in typed)) columnMismatches.push(`${t}.${c.column_name}: missing from Row`);
    else if (typed[c.column_name] !== expected) columnMismatches.push(`${t}.${c.column_name}: catalog=${expected} generated=${typed[c.column_name]}`);
  }
  for (const name of Object.keys(typed)) {
    if (!actual.some((c) => c.column_name === name)) columnMismatches.push(`${t}.${name}: generated-only column`);
  }
}

const publicFkNames = constraints
  .filter((c) => c.contype === "f" && !c.definition.includes("REFERENCES auth.users"))
  .map((c) => c.conname)
  .sort();
const missingPublicRelationships = publicFkNames.filter((name) => !typesText.includes(`foreignKeyName: "${name}"`));
const generatedRelationshipNames = [...typesText.matchAll(/foreignKeyName: "([^"]+)"/g)].map((m) => m[1]).sort();
const unexpectedPublicRelationships = generatedRelationshipNames.filter((name) => !publicFkNames.includes(name));

const scope = {
  catalogTables,
  generatedTables,
  missingTables,
  deferredPresent,
  columnMismatches,
  publicFkNames,
  generatedRelationshipNames,
  missingPublicRelationships,
  unexpectedPublicRelationships,
};
const clean = missingTables.length === 0 && deferredPresent.length === 0 &&
  columnMismatches.length === 0 && missingPublicRelationships.length === 0 &&
  unexpectedPublicRelationships.length === 0 &&
  JSON.stringify(catalogTables) === JSON.stringify(expectedTables);
const runId = new Date().toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14);
const out = join(here, `CODY_AC14_TYPES_CATALOG_COMPARE_${runId}.log`);
writeFileSync(out, [
  "CODY QA EVIDENCE — AC14 TYPES/CATALOG COMPARISON",
  `timestamp=${new Date().toISOString()}`,
  "branch=qa/bim-001-cody-01",
  "tested_head=fefde109fe50eb55839dee4dd29129b2ea3de90c",
  "target_class=local types vs preserved SCRATCH post-chain pg_catalog evidence",
  "procedure=parse all generated Row fields/types/nullability and public relationships; compare to actual catalog snapshot",
  `result_detail=${JSON.stringify(scope)}`,
  `sixteen_expected_types_present=${missingTables.length === 0 && generatedTables.filter((t) => expectedTables.includes(t)).length === 16}`,
  `deferred_types_absent=${deferredPresent.length === 0}`,
  `obvious_catalog_type_drift_absent=${columnMismatches.length === 0 && missingPublicRelationships.length === 0 && unexpectedPublicRelationships.length === 0}`,
  `result=${clean ? "AC14_CATALOG_TYPES_MATCH" : "AC14_CATALOG_TYPES_DRIFT"}`,
  "",
].join("\n"));
console.log(`EVIDENCE ${out}`);
console.log(`AC14_COMPARE ${clean ? "MATCH" : "DRIFT"}`);
if (!clean) process.exit(3);
