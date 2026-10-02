'use strict';
// Export-only path adapter. Executes the existing validated scanner source unchanged.
// Invoke from repository root: node --env-file=.env.qa.local <this-file> <isolated-mirror> --values
// Pattern mode does not require env-file loading. No original evidence is modified.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
try {
  const mirror = path.resolve(process.argv[2]);
  const mode = process.argv[3];
  if (!['--values', '--patterns'].includes(mode)) throw new Error('mode');
  const scannerPath = path.resolve('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AUTOMATION/privacy_scan.cjs');
  const source = fs.readFileSync(scannerPath, 'utf8');
  const scannerProcess = { env: process.env, argv: ['node', scannerPath, mode], cwd: () => mirror, exitCode: 0 };
  const mirrorPath = { ...path, resolve: (...segments) => path.resolve(mirror, ...segments) };
  vm.runInNewContext(source, {
    require: name => name === 'node:path' ? mirrorPath : require(name),
    process: scannerProcess,
    console,
    Buffer,
  }, { filename: scannerPath });
  process.exitCode = scannerProcess.exitCode;
} catch {
  console.error('export-privacy-error');
  process.exitCode = 2;
}
