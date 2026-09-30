// QA-only, login-only browser driver. Credentials are entered by the Director
// into the visible browser before tracing or evidence collection begins.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const role = process.argv[2];
if (!['ADMIN', 'MEMBER'].includes(role)) throw new Error('role must be ADMIN or MEMBER');
process.umask(0o077);
const base = 'http://127.0.0.1:38417';
const out = path.join(__dirname, 'raw');
const shots = path.join(__dirname, 'screenshots');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(shots, { recursive: true });
const result = { role, authorizedTarget: 'main development Supabase',
  credentialValuesRecorded: false, authStateSaved: false, checks: [], screenshots: [],
  consoleErrorCount: 0, pageErrorCount: 0, hydrationErrorCount: 0, failedLocalRoutes: [] };
let browser, context, page, tracing = false;

function record(name, passed, details = {}) {
  result.checks.push({ name, passed: !!passed, ...details });
  if (!passed) console.log('CHECK_FAIL ' + role + ' ' + name);
}
function assert(name, condition, details = {}) {
  record(name, condition, details);
  if (!condition) throw new Error('QA assertion failed: ' + name);
}
async function activeIs(locator) {
  return locator.evaluate(el => document.activeElement === el);
}
async function activeInside(locator) {
  return locator.evaluate(el => el.contains(document.activeElement));
}
async function tabTo(page, locator, max = 150) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  let steps = 0;
  for (; steps < max; steps++) {
    await page.keyboard.press('Tab');
    if (await activeIs(locator)) return steps + 1;
  }
  return 0;
}
async function setTheme(page, theme) {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('menuitem', { name: theme === 'dark' ? 'Dark' : 'Light' }).click();
  await page.waitForFunction(wantDark => document.documentElement.classList.contains('dark') === wantDark,
    theme === 'dark');
  record('theme_' + theme, true);
}
async function owedValues(table) {
  const texts = await table.locator('tbody tr td:nth-child(8)').allTextContents();
  return texts.map(text => Number(text.replace(/[^0-9.-]/g, '')));
}
function ordered(values, direction) {
  return values.every((value, i) => i === 0 ||
    (direction === 'asc' ? values[i - 1] <= value : values[i - 1] >= value));
}
async function desktopWalk(page, theme) {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto(base + '/owedbook', { waitUntil: 'domcontentloaded' });
  const table = page.getByTestId('datatable-desktop');
  await table.locator('tbody tr').first().waitFor({ timeout: 30000 });
  const headers = table.locator('th');
  const buttonCount = await headers.locator('button[type=button]').count();
  assert('desktop_' + theme + '_sortable_header_controls', buttonCount === await headers.count(),
    { buttonCount });
  const owed = table.getByRole('columnheader', { name: /Owed/ }).getByRole('button');
  const tabSteps = await tabTo(page, owed);
  assert('desktop_' + theme + '_tab_reaches_owed', tabSteps > 0, { tabSteps });
  const before = await owedValues(table);
  await page.keyboard.press('Enter');
  const asc = await owedValues(table);
  assert('desktop_' + theme + '_enter_ascending',
    await table.getByRole('columnheader', { name: /Owed/ }).getAttribute('aria-sort') === 'ascending'
      && ordered(asc, 'asc') && asc.length > 1,
    { rowCount: asc.length, reorderedFromInitial: JSON.stringify(before) !== JSON.stringify(asc) });

  // QA-only scrollable body makes the Space no-scroll control meaningful.
  await page.evaluate(() => { document.body.style.minHeight = '2000px'; });
  await owed.focus();
  await page.evaluate(() => window.scrollTo(0, 400));
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Space');
  const scrollAfter = await page.evaluate(() => window.scrollY);
  const desc = await owedValues(table);
  assert('desktop_' + theme + '_space_descending_no_scroll',
    await table.getByRole('columnheader', { name: /Owed/ }).getAttribute('aria-sort') === 'descending'
      && ordered(desc, 'desc') && scrollBefore > 0 && scrollAfter === scrollBefore
      && JSON.stringify(asc) !== JSON.stringify(desc),
    { scrollBefore, scrollAfter, rowCount: desc.length });
  await page.evaluate(() => { document.body.style.minHeight = ''; window.scrollTo(0, 0); });
  await owed.click();
  const clickAsc = await owedValues(table);
  assert('desktop_' + theme + '_mouse_sort',
    await table.getByRole('columnheader', { name: /Owed/ }).getAttribute('aria-sort') === 'ascending'
      && ordered(clickAsc, 'asc'));
  const shot = role.toLowerCase() + '_desktop_' + theme + '_table.png';
  await table.screenshot({ path: path.join(shots, shot) });
  result.screenshots.push(shot);

  await page.getByRole('tab', { name: 'Summary' }).click();
  await table.locator('tbody tr').first().waitFor({ timeout: 30000 });
  const nonSortable = await table.locator('th').evaluateAll(ths => ths.every(th =>
    !th.querySelector('button') && !th.hasAttribute('tabindex') && th.getAttribute('role') !== 'button'));
  assert('desktop_' + theme + '_nonsortable_no_fake_controls', nonSortable);
}
async function mobileWalk(page, theme) {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base + '/owedbook', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'OwedBook' }).waitFor();
  const trigger = page.getByRole('button', { name: 'Open Filters' });
  const tabSteps = await tabTo(page, trigger);
  assert('mobile_' + theme + '_tab_reaches_filter_trigger', tabSteps > 0, { tabSteps });
  await page.keyboard.press('Enter');
  const drawer = page.getByTestId('sidebar-drawer');
  await drawer.waitFor();
  const close = drawer.getByRole('button', { name: 'Close' });
  assert('mobile_' + theme + '_focus_moves_inside', await activeIs(close));
  const last = drawer.getByRole('button', { name: 'Get Fresh Data' });
  await last.focus();
  await page.keyboard.press('Tab');
  assert('mobile_' + theme + '_tab_wrap', await activeIs(close));
  await page.keyboard.press('Shift+Tab');
  assert('mobile_' + theme + '_shift_tab_wrap', await activeIs(last));
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    assert('mobile_' + theme + '_tab_containment_' + i, await activeInside(drawer));
  }
  const pickerTrigger = drawer.getByTestId('multiselect-trigger');
  const panel = drawer.getByTestId('multiselect-panel');
  const panelCountBeforeKey = await panel.count();
  const expandedBeforeKey = await pickerTrigger.getAttribute('aria-expanded');
  record('mobile_' + theme + '_picker_pre_key_state', true,
    { panelCountBeforeKey, expandedBeforeKey });
  if (panelCountBeforeKey) {
    await pickerTrigger.focus();
    await page.keyboard.press('Escape');
  }
  await pickerTrigger.focus();
  const pickerFocusedBeforeKey = await activeIs(pickerTrigger);
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  const panelCountAfterKey = await panel.count();
  const expandedAfterKey = await pickerTrigger.getAttribute('aria-expanded');
  assert('mobile_' + theme + '_picker_keyboard_open_space',
    pickerFocusedBeforeKey && panelCountAfterKey === 1 && expandedAfterKey === 'true',
    { pickerFocusedBeforeKey, panelCountAfterKey, expandedAfterKey });
  await panel.waitFor({ timeout: 5000 });
  const search = panel.getByPlaceholder('Search PBMs...');
  assert('mobile_' + theme + '_picker_focus_search', await activeIs(search));
  const lastOption = panel.locator('input[type=checkbox]').last();
  assert('mobile_' + theme + '_picker_options_present', await lastOption.count() > 0);
  await lastOption.focus();
  await page.keyboard.press('Tab');
  assert('mobile_' + theme + '_picker_tab_wrap', await activeIs(search));
  await page.keyboard.press('Shift+Tab');
  assert('mobile_' + theme + '_picker_shift_tab_wrap', await activeIs(lastOption));
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    assert('mobile_' + theme + '_picker_tab_containment_' + i, await activeInside(panel));
  }
  const shot = role.toLowerCase() + '_mobile_' + theme + '_drawer.png';
  await drawer.screenshot({ path: path.join(shots, shot) });
  result.screenshots.push(shot);
  await page.keyboard.press('Escape');
  assert('mobile_' + theme + '_nested_escape_picker_first',
    await panel.count() === 0 && await drawer.isVisible() && await activeIs(pickerTrigger));
  await page.keyboard.press('Escape');
  assert('mobile_' + theme + '_second_escape_drawer_and_focus_return',
    await drawer.count() === 0 && await activeIs(trigger));
}
async function routeAndLogout(page) {
  await page.setViewportSize({ width: 1440, height: 700 });
  for (const route of role === 'ADMIN' ? ['/profile', '/admin-portal'] : ['/profile']) {
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    record('route_' + route, response && response.status() < 400 && new URL(page.url()).pathname === route,
      { status: response?.status() || 0 });
  }
  await page.goto(base + '/owedbook', { waitUntil: 'domcontentloaded' });
  await page.locator('header button.cursor-pointer').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.waitForURL(url => new URL(url).pathname === '/auth', { timeout: 30000 });
  record('logout_destination_auth', true);
  const protectedResponse = await page.goto(base + '/owedbook', { waitUntil: 'domcontentloaded' });
  assert('logout_terminates_session', new URL(page.url()).pathname === '/auth',
    { protectedStatus: protectedResponse?.status() || 0 });
}

(async () => {
  try {
    browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    context = await browser.newContext({ viewport: { width: 1440, height: 700 }, colorScheme: 'light' });
    page = await context.newPage();
    await page.goto(base + '/auth', { waitUntil: 'domcontentloaded' });
    console.log('READY_' + role + '_LOGIN: enter credentials directly in the visible browser');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'OwedBook' })
      .waitFor({ state: 'visible', timeout: 900000 });
    console.log('AUTHENTICATED_' + role);
    const isAdmin = await page.getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Admin Portal' }).count() > 0;
    assert('role_nav_matches_' + role, isAdmin === (role === 'ADMIN'));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        result.consoleErrorCount++;
        if (/hydrat/i.test(msg.text())) result.hydrationErrorCount++;
      }
    });
    page.on('pageerror', err => {
      result.pageErrorCount++;
      if (/hydrat/i.test(String(err))) result.hydrationErrorCount++;
    });
    page.on('response', response => {
      if (response.status() < 400) return;
      try {
        const url = new URL(response.url());
        if (url.origin === base) result.failedLocalRoutes.push({ path: url.pathname, status: response.status() });
      } catch {}
    });
    await context.tracing.start({ screenshots: false, snapshots: false, sources: false });
    tracing = true;
    for (const theme of ['light', 'dark']) {
      await setTheme(page, theme);
      await desktopWalk(page, theme);
      await mobileWalk(page, theme);
    }
    await routeAndLogout(page);
    record('no_console_or_hydration_errors', result.consoleErrorCount === 0 &&
      result.pageErrorCount === 0 && result.hydrationErrorCount === 0);
    record('no_failed_local_routes', result.failedLocalRoutes.length === 0);
    console.log('MATRIX_COMPLETE_' + role);
  } catch (err) {
    result.errorCategory = String(err).replace(/https?:\/\/[^\s]+/g, '[url]').slice(0, 300);
    console.log('MATRIX_INCOMPLETE_' + role + ': ' + result.errorCategory);
    process.exitCode = 1;
  } finally {
    if (tracing) {
      try { await context.tracing.stop({ path: path.join('/tmp', 'rrm003_ac107_' + role.toLowerCase() + '_raw.zip') }); }
      catch { result.traceStopFailed = true; }
    }
    fs.writeFileSync(path.join(out, role.toLowerCase() + '_matrix.json'), JSON.stringify(result, null, 2) + '\n');
    if (browser) await browser.close();
  }
})();
