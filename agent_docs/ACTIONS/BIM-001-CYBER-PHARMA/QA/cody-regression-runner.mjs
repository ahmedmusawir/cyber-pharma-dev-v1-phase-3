#!/usr/bin/env node
// QA-only AC14/AC15 regression board. Captures actual outputs and exit codes in
// unique module-scoped evidence files without modifying product sources.

import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..", "..", "..");
const runId = new Date().toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14);
const ansi = /\x1b\[[0-9;]*m/g;
const header = (probe, command) => [
  `CODY QA EVIDENCE — ${probe}`,
  `timestamp=${new Date().toISOString()}`,
  "branch=qa/bim-001-cody-01",
  "tested_head=fefde109fe50eb55839dee4dd29129b2ea3de90c",
  "target_class=local non-destructive regression",
  `command=${command}`,
];

async function run(label, command, args, filename) {
  console.log(`START ${label}: ${command} ${args.join(" ")}`);
  const result = await new Promise((resolve) => {
    const child = spawn(command, args, { cwd: repo, env: process.env });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => { stdout += d; process.stdout.write(d); });
    child.stderr.on("data", (d) => { stderr += d; process.stderr.write(d); });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
  const clean = `${result.stdout}\n${result.stderr}`.replace(ansi, "");
  const extra = [];
  if (label === "JEST") {
    const suites = clean.match(/Test Suites:\s+(?:(\d+) failed,\s+)?(?:(\d+) passed,\s+)?(\d+) total/);
    const tests = clean.match(/Tests:\s+(?:(\d+) failed,\s+)?(?:(\d+) passed,\s+)?(\d+) total/);
    extra.push(`parsed_suite_failures=${suites?.[1] || 0}`, `parsed_suite_passes=${suites?.[2] || 0}`, `parsed_suite_total=${suites?.[3] || "UNPARSED"}`,
      `parsed_test_failures=${tests?.[1] || 0}`, `parsed_test_passes=${tests?.[2] || 0}`, `parsed_test_total=${tests?.[3] || "UNPARSED"}`);
  }
  if (label === "BUILD") {
    const routeLines = clean.split("\n").filter((line) => /^\s*[┌├└] [○ƒ] \//.test(line));
    extra.push(`parsed_route_count=${routeLines.length}`, `parsed_routes=${JSON.stringify(routeLines.map((x) => x.trim()))}`);
  }
  const path = join(here, `${filename}_${runId}.log`);
  writeFileSync(path, [...header(label, `${command} ${args.join(" ")}`), `exit_code=${result.code}`,
    ...extra, "stdout_begin", result.stdout.trimEnd(), "stdout_end", "stderr_begin", result.stderr.trimEnd(), "stderr_end", ""].join("\n"));
  console.log(`EVIDENCE ${path}`);
  return { ...result, path };
}

const tsc = await run("TYPESCRIPT", "npx", ["tsc", "--noEmit"], "CODY_REGRESSION_TSC");
const jest = await run("JEST", "npm", ["test", "--", "--runInBand"], "CODY_REGRESSION_JEST");
const build = await run("BUILD", "npm", ["run", "build"], "CODY_REGRESSION_BUILD");
console.log(`REGRESSION_EXIT_CODES tsc=${tsc.code} jest=${jest.code} build=${build.code}`);
if ([tsc, jest, build].some((r) => r.code !== 0)) process.exit(3);
