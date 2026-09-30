// Focused read-only browser probe. Director enters MEMBER credentials visibly.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
process.umask(0o077);
const base = 'http://127.0.0.1:38417';
const out = path.join(__dirname, 'raw');
const result = { role: 'MEMBER', target: 'main development Supabase', phases: [],
  credentialValuesRecorded: false, authStateSaved: false };
let browser, context, page, tracing = false;
async function probe(label, drawer) {
  const trigger = drawer.getByTestId('multiselect-trigger');
  const panel = drawer.getByTestId('multiselect-panel');
  await trigger.focus();
  await trigger.evaluate(el => {
    window.__qaPbmEvents = [];
    const collect = phase => e => {
      if (e.target === el || el.contains(e.target)) {
        window.__qaPbmEvents.push({ phase, type: e.type, key: e.key || null,
          defaultPrevented: e.defaultPrevented });
      }
    };
    for (const name of ['keydown', 'keyup', 'click']) {
      document.addEventListener(name, collect('capture'), true);
      document.addEventListener(name, collect('bubble'));
    }
  });
  const before = { expanded: await trigger.getAttribute('aria-expanded'), panelCount: await panel.count(),
    focused: await trigger.evaluate(el => document.activeElement === el),
    radixSelectState: await drawer.locator('[role=combobox]').first().getAttribute('data-state'),
    radixPopperCount: await page.locator('[data-radix-popper-content-wrapper]').count() };
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const afterEnter = { expanded: await trigger.getAttribute('aria-expanded'), panelCount: await panel.count(),
    focused: await trigger.evaluate(el => document.activeElement === el) };
  let afterSpace = null;
  if (!(await panel.count())) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    afterSpace = { expanded: await trigger.getAttribute('aria-expanded'), panelCount: await panel.count(),
      focused: await trigger.evaluate(el => document.activeElement === el) };
  }
  const events = await page.evaluate(() => window.__qaPbmEvents || []);
  result.phases.push({ label, before, afterEnter, afterSpace, events });
  if (!(await panel.count())) {
    await trigger.click();
    result.phases[result.phases.length - 1].clickFallbackPanelCount = await panel.count();
  }
  if (await panel.count()) await page.keyboard.press('Escape');
}
(async () => {
  try {
    browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    page = await context.newPage();
    await page.goto(base + '/auth', { waitUntil: 'domcontentloaded' });
    console.log('READY_MEMBER_PROBE_LOGIN: enter credentials directly in visible browser');
    await page.getByRole('heading', { name: 'OwedBook' }).waitFor({ timeout: 900000 });
    console.log('AUTHENTICATED_MEMBER_PROBE');
    await context.tracing.start({ screenshots: false, snapshots: false, sources: false });
    tracing = true;
    await page.goto(base + '/owedbook', { waitUntil: 'domcontentloaded' });
    const trigger = page.getByRole('button', { name: 'Open Filters' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const drawer = page.getByTestId('sidebar-drawer');
    await drawer.waitFor();
    await probe('fresh_drawer', drawer);
    const last = drawer.getByRole('button', { name: 'Get Fresh Data' });
    await last.focus();
    for (let i = 0; i < 20; i++) await page.keyboard.press('Tab');
    await probe('after_20_tabs', drawer);
    await page.keyboard.press('Escape');
    result.drawerClosed = await drawer.count() === 0;
    console.log('MEMBER_PROBE_COMPLETE');
  } catch (err) {
    result.errorCategory = String(err).replace(/https?:\/\/[^\s]+/g, '[url]').slice(0, 300);
    console.log('MEMBER_PROBE_INCOMPLETE: ' + result.errorCategory);
    process.exitCode = 1;
  } finally {
    if (tracing) {
      try { await context.tracing.stop({ path: '/tmp/rrm003_ac107_member_probe_raw.zip' }); }
      catch { result.traceStopFailed = true; }
    }
    fs.writeFileSync(path.join(out, 'member_pbm_probe.json'), JSON.stringify(result, null, 2) + '\n');
    if (browser) await browser.close();
  }
})();
