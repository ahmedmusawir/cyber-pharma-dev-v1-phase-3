'use strict';
// Q1 only: one form sign-in per role, no captures, no persisted authentication.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const QAM = path.resolve('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM');
const evidence = path.join(QAM, 'evidence');
const origin = 'http://127.0.0.1:36155';
const summary = { phase: 'Q1', roles: [], profiles_removed: false };
let browser, temporary, stage = 'setup';
function check(ok) { if (!ok) throw new Error('probe'); }
async function runRole(role) {
  const row = { role, sign_ins: 0, auth: 'not-run', logout: 'not-run', console_errors: 0, page_errors: 0 };
  summary.roles.push(row);
  const context = await browser.newContext();
  const page = await context.newPage();
  let submitted = false;
  page.on('console', message => { if (message.type() === 'error') row.console_errors++; });
  page.on('pageerror', () => { row.page_errors++; });
  try {
    stage = 'form';
    check((await page.goto(origin + '/auth', { waitUntil: 'networkidle' })).status() === 200);
    const email = process.env['QA_' + role + '_EMAIL'];
    const password = process.env['QA_' + role + '_PASSWORD'];
    check(Boolean(email && password));
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    stage = 'login';
    submitted = true;
    row.sign_ins++;
    const [response] = await Promise.all([
      page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/login' && r.request().method() === 'POST'),
      page.getByRole('button', { name: 'Login', exact: true }).click(),
    ]);
    check(response.status() === 200);
    const result = await response.json();
    check(result.data?.role === role.toLowerCase());
    // Source sends both roles to /owedbook; explicitly load the required role route.
    await page.waitForURL(origin + '/owedbook');
    stage = 'protected-route';
    const route = role === 'ADMIN' ? '/admin-portal' : '/owedbook';
    const loaded = await page.goto(origin + route, { waitUntil: 'networkidle' });
    check(loaded?.status() === 200 && new URL(page.url()).pathname === route);
    check(row.console_errors === 0 && row.page_errors === 0);
    row.auth = 'ok';
    row.protected_status = loaded.status();
    stage = 'logout';
    const logout = await context.request.post(origin + '/api/auth/logout');
    check(logout.status() === 200);
    const denied = await context.request.get(origin + '/owedbook', { maxRedirects: 0 });
    check([302, 303, 307, 308].includes(denied.status()));
    check(new URL(denied.headers().location, origin).pathname === '/auth');
    await page.goto(origin + '/owedbook', { waitUntil: 'networkidle' });
    check(new URL(page.url()).pathname === '/auth');
    check(row.console_errors === 0 && row.page_errors === 0);
    row.logout = 'ok';
    row.protected_after_logout_status = denied.status();
    console.log(role + ' auth=ok logout=ok');
  } catch {
    row.failed_stage = stage;
    console.log(role + ' auth=' + row.auth + ' logout=' + row.logout + ' probe=failed stage=' + stage);
    throw new Error('role');
  } finally {
    if (submitted && row.logout !== 'ok') {
      try { row.cleanup_logout_status = (await context.request.post(origin + '/api/auth/logout')).status(); }
      catch { row.cleanup_logout_status = 'failed'; }
    }
    await context.close();
  }
}
(async () => {
  try {
    check(process.env.QA_TARGET_LABEL === 'main-dev');
    check(!process.env.DEBUG && !process.env.PWDEBUG);
    temporary = fs.mkdtempSync(path.join(evidence, 'qf16-browser-temp-'));
    const ledger = path.join(evidence, 'temp_paths.json');
    const prior = fs.existsSync(ledger) ? JSON.parse(fs.readFileSync(ledger, 'utf8')) : [];
    fs.writeFileSync(ledger, JSON.stringify([...prior, temporary], null, 2) + '\n');
    process.env.TMPDIR = temporary;
    const browserEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('QA_')));
    browser = await chromium.launch({ env: browserEnv });
    await runRole('ADMIN');
    await runRole('MEMBER');
  } catch {
    console.error('qf16-probe-failed');
    process.exitCode = 1;
  } finally {
    try {
      if (browser) await browser.close();
      if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
      summary.profiles_removed = !temporary || !fs.existsSync(temporary);
      check(summary.profiles_removed);
      fs.writeFileSync(path.join(evidence, 'qf16_result.json'), JSON.stringify(summary, null, 2) + '\n');
    } catch {
      console.error('qf16-cleanup-failed');
      process.exitCode = 1;
    }
  }
})();
