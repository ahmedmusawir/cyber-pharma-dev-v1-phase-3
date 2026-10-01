'use strict';
// QAM-only scanner. Matches and exceptions never leave process memory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const QAM = path.resolve('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM');
const evidence = path.join(QAM, 'evidence');
const editorName = /^\.?\.env\.qa\.local(?:\.sw[a-p]|~|\.bak|\.orig)$|^#\.env\.qa\.local#$/;
const credentialKeys = ['QA_ADMIN_EMAIL', 'QA_ADMIN_PASSWORD', 'QA_MEMBER_EMAIL', 'QA_MEMBER_PASSWORD'];
const forms = value => [value, Buffer.from(value).toString('base64'), Buffer.from(value).toString('base64url'), encodeURIComponent(value)];
const relative = p => path.relative(process.cwd(), p);
function credentials() {
  const values = credentialKeys.map(key => process.env[key]);
  if (values.some(value => !value)) throw new Error('invalid');
  return values.map(forms);
}
function rememberTemp(p) {
  const file = path.join(evidence, 'temp_paths.json');
  const prior = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  if (!prior.includes(p)) fs.writeFileSync(file, JSON.stringify([...prior, p], null, 2) + '\n');
}
function filesUnder(p) {
  if (!fs.existsSync(p) || editorName.test(path.basename(p))) return [];
  const stat = fs.lstatSync(p);
  if (stat.isSymbolicLink()) throw new Error('symlink');
  if (stat.isFile()) return [p];
  return fs.readdirSync(p).flatMap(name => filesUnder(path.join(p, name)));
}
function targets() {
  const responses = path.resolve('agent_docs/RESPONSES');
  const ownResponses = fs.readdirSync(responses).filter(name => /^response_.*_rrm004-qam-(q1|q1b|q2|q4|q5)-.*\.md$/.test(name)).map(name => path.join(responses, name));
  const sessions = path.resolve('agent_docs/SESSIONS');
  const ownSessions = fs.readdirSync(sessions).filter(name => /^session_.*_rrm004-qam-.*\.md$/.test(name)).map(name => path.join(sessions, name));
  const tempList = path.join(evidence, 'temp_paths.json');
  const temps = fs.existsSync(tempList) ? JSON.parse(fs.readFileSync(tempList, 'utf8')) : [];
  return [...new Set([QAM, ...ownResponses, ...ownSessions, ...temps].flatMap(filesUnder))];
}
function parts(file) {
  const raw = fs.readFileSync(file);
  const result = [{ name: relative(file), body: raw }];
  if (raw.subarray(0, 4).equals(Buffer.from([80, 75, 3, 4]))) {
    // Read compressed trace entries without extracting or persisting their bodies.
    const script = 'import sys,zipfile,json,base64\nwith zipfile.ZipFile(sys.argv[1]) as z:\n print(json.dumps([[i.filename,base64.b64encode(z.read(i)).decode()] for i in z.infolist() if not i.is_dir()]))';
    const entries = JSON.parse(execFileSync('python3', ['-c', script, file], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 }).toString());
    for (const [name, encoded] of entries) result.push({ name: relative(file) + '!' + name, body: Buffer.from(encoded, 'base64') });
  }
  return result;
}
function valueHits(body, forbidden) {
  return forbidden.flatMap((variants, identity) => variants.flatMap((value, encoding) => body.includes(Buffer.from(value)) ? [{ identity, encoding }] : []));
}
function selfTest() {
  const dir = fs.mkdtempSync(path.join(evidence, 'privacy-self-test-'));
  rememberTemp(dir);
  try {
    const synthetic = 'QAM-\uffff-' + crypto.randomBytes(24).toString('hex') + '+/?=&';
    const variants = forms(synthetic);
    if (new Set(variants).size !== 4) throw new Error('fixture');
    const planted = path.join(dir, 'planted.txt');
    const control = path.join(dir, 'control.txt');
    fs.writeFileSync(planted, variants.join('\n'));
    fs.writeFileSync(control, 'clean control\n');
    if (valueHits(fs.readFileSync(planted), [variants]).length !== 4 || valueHits(fs.readFileSync(control), [variants]).length !== 0) throw new Error('self-test');
    const forbidden = credentials();
    if (forbidden.length !== 4 || forbidden.some(v => v.length !== 4)) throw new Error('forbidden');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    if (fs.existsSync(dir)) throw new Error('cleanup');
  }
  console.log('planted=detected control=clean forbidden-values=4');
}
function scan(mode) {
  const forbidden = mode === '--values' ? credentials() : null;
  const hits = [], mentions = [];
  let count = 0;
  for (const file of targets()) for (const part of parts(file)) {
    count++;
    if (forbidden) {
      const matches = valueHits(part.body, forbidden);
      if (matches.length) hits.push({ path: part.name, count: matches.length });
    } else {
      part.body.toString('utf8').split(/\r?\n/).forEach((line, index) => {
        const jwt = /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/.test(line);
        const key = /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]{12,}\b/.test(line);
        const cookie = /["']?sb-[A-Za-z0-9_-]+-auth-token(?:\.\d+)?["']?\s*[:=]\s*["']?[A-Za-z0-9_-]{12,}/.test(line);
        const state = /"cookies"\s*:\s*\[\s*\{/.test(line) || /"origins"\s*:\s*\[\s*\{/.test(line);
        const assignment = [...line.matchAll(/(?:password|QA_(?:ADMIN|MEMBER)_[A-Z_]+)\s*=\s*([^\s`]+)/gi)].some(match => {
          const v = match[1].replace(/^["']|["';,]+$/g, '');
          return v.length > 0 && !/^(?:\.{3}|…)$/.test(v) && !/^(?:<|\$|placeholder|synthetic|example|redacted|process\.|undefined|null|false|true|\[|\{|\/|\(\?)/i.test(v);
        });
        if (jwt || key || cookie || state || assignment) hits.push({ path: part.name, line: index + 1, count: 1 });
        else if (/password|QA_(ADMIN|MEMBER)_|storageState|sb-.*auth-token|JWT|sb_(secret|publishable)_/i.test(line)) mentions.push({ path: part.name, line: index + 1 });
      });
    }
  }
  const file = path.join(evidence, 'privacy_audit.json');
  const audit = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const key = mode.slice(2);
  const result = { files_or_archive_entries: count, leaks: hits.reduce((n, h) => n + h.count, 0), hits, documentation_mentions: mentions };
  // Retain earlier hits and resolutions instead of overwriting the audit history.
  audit.history = [...(audit.history || []), { mode: key, ...result }];
  audit[key] = result;
  fs.writeFileSync(file, JSON.stringify(audit, null, 2) + '\n');
  console.log(key + ' leaks=' + result.leaks + ' documentation-mentions=' + mentions.length);
  if (result.leaks) process.exitCode = 1;
}
try {
  const mode = process.argv[2];
  if (mode === '--self-test') selfTest();
  else if (mode === '--values' || mode === '--patterns') scan(mode);
  else throw new Error('mode');
} catch {
  console.error('privacy-scan-error');
  process.exitCode = 2;
}
