'use strict';
// Approved Q2 image-only walk. Never serialize credentials, cookies, DOM text or network bodies.
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require('playwright');
const Q = path.resolve('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM');
const E = path.join(Q, 'evidence/browser');
const origin = 'http://127.0.0.1:36155';
const known = ['/brand/logo-color.svg','/brand/logo-lockup.svg','/landing/owedbook-mockup.png'];
const result = {phase:'Q2', attempt:1, roles:[], cells:[], timeline:[], profiles_removed:false};
let browser, temp, stage='setup';
const check = (condition, label) => { if (!condition) {stage=label; throw new Error('walk');} };
function safeSource(value) {
  try {const u=new URL(value,origin); const source=u.pathname==='/_next/image'?u.searchParams.get('url'):u.pathname;
    return known.includes(source)?source:'<unexpected-image>';
  } catch {return '<unresolved-image>';}
}
async function theme(page, name) {
  let buttons=page.getByRole('button',{name:'Toggle theme',exact:true});
  if (!await buttons.count()) {
    const open=page.getByRole('button',{name:'Open menu',exact:true});
    if(await open.count()) await open.click();
    buttons=page.getByRole('button',{name:'Toggle theme',exact:true});
  }
  if(await buttons.count()) {
    await buttons.first().click();
    await page.getByRole('menuitem',{name:name==='dark'?'Dark':'Light',exact:true}).click();
  } else {
    await page.evaluate(value=>localStorage.setItem('theme',value),name);
    await page.reload({waitUntil:'networkidle'});
  }
  await page.waitForFunction(value=>document.documentElement.classList.contains(value),name);
}
async function cell(page, counters, role, route, viewport, shade, expected) {
  stage='image-cell';
  const row={role,requested_route:route,viewport,theme:shade,expected_sources:expected,errors:[]};
  const before={...counters};
  try {
    await page.setViewportSize(viewport);
    const response=await page.goto(origin+route,{waitUntil:'networkidle'});
    row.final_route=new URL(page.url()).pathname;
    row.status=response?.status();
    await theme(page,shade);
    row.effective_theme=await page.evaluate(()=>document.documentElement.classList.contains('dark')?'dark':'light');
    const images=page.locator('img');
    for(let i=0;i<await images.count();i++) {
      if(await images.nth(i).isVisible()) await images.nth(i).scrollIntoViewIfNeeded();
    }
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    const raw=await images.evaluateAll(imgs=>imgs.map(img=>({source:img.currentSrc||img.src,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})));
    row.images=raw.map(img=>({...img,source:safeSource(img.source)}));
    row.image_count=row.images.length;
    row.inventory_matches=JSON.stringify(row.images.map(img=>img.source).sort())===JSON.stringify([...expected].sort());
    row.all_decoded=row.images.every(img=>img.complete&&img.naturalWidth>0);
    row.route_matches=row.final_route===(role!=='SIGNED_OUT'&&route==='/'?'/owedbook':route);
    row.captures=[];
    if(row.inventory_matches&&row.all_decoded) for(let i=0;i<row.images.length;i++) {
      if(!await images.nth(i).isVisible()) continue;
      const name=role.toLowerCase()+'_'+(route==='/'?'home':route.slice(1))+'_'+viewport.width+'_'+shade+'_'+i+'.png';
      await images.nth(i).screenshot({path:path.join(E,name)});
      row.captures.push('evidence/browser/'+name);
    }
  } catch {row.errors.push('cell-incomplete');}
  row.console_errors=counters.console-before.console; row.page_errors=counters.page-before.page;
  row.failed_image_requests=counters.failed-before.failed; row.image_http_errors=counters.http-before.http;
  row.pass=row.status===200&&row.route_matches&&row.effective_theme===shade&&row.inventory_matches&&row.all_decoded&&row.errors.length===0&&!row.console_errors&&!row.page_errors&&!row.failed_image_requests&&!row.image_http_errors;
  result.cells.push(row);
  if(role!=='SIGNED_OUT')result.timeline.push({role,action:'image-cell',route,viewport:viewport.width,theme:shade,result:row.pass?'PASS':'FAIL'});
  fs.writeFileSync(path.join(E,'walk.json'),JSON.stringify(result,null,2)+'\n');
}
async function matrix(page,counters,role,routes) {
  for(const route of routes)for(const viewport of [{width:1280,height:900},{width:375,height:812}])for(const shade of ['light','dark']) {
    const expected=role==='SIGNED_OUT'?(route==='/'?['/brand/logo-lockup.svg','/landing/owedbook-mockup.png']:['/brand/logo-lockup.svg']):['/brand/logo-color.svg'];
    await cell(page,counters,role,route,viewport,shade,expected);
  }
}
async function roleWalk(role) {
  const row={role,sign_ins:0,auth:'NOT RUN',logout:'NOT RUN'};result.roles.push(row);
  const context=await browser.newContext();const page=await context.newPage();
  const counters={console:0,page:0,failed:0,http:0};
  page.on('console',m=>{if(m.type()==='error')counters.console++;});page.on('pageerror',()=>counters.page++);
  page.on('requestfailed',r=>{if(r.resourceType()==='image')counters.failed++;});
  page.on('response',r=>{if(r.request().resourceType()==='image'&&r.status()>=400)counters.http++;});
  try {
    if(role==='ADMIN')await matrix(page,counters,'SIGNED_OUT',['/auth','/']);
    stage='login-form';
    await page.goto(origin+'/auth',{waitUntil:'networkidle'});
    const email=process.env['QA_'+role+'_EMAIL'], secret=process.env['QA_'+role+'_PASSWORD'];
    check(email&&secret,'missing-credential');
    await page.locator('input[type="email"]').fill(email);await page.locator('input[type="password"]').fill(secret);
    row.sign_ins++;stage='login';
    const [response]=await Promise.all([page.waitForResponse(r=>new URL(r.url()).pathname==='/api/auth/login'&&r.request().method()==='POST'),page.getByRole('button',{name:'Login',exact:true}).click()]);
    check(response.status()===200,'login-status');
    const payload=await response.json();check(payload.data?.role===role.toLowerCase(),'login-role');
    await page.waitForURL(origin+'/owedbook');row.auth='PASS';result.timeline.push({role,action:'authenticated-walk-start'});
    await matrix(page,counters,role,role==='ADMIN'?['/','/owedbook','/admin-portal']:['/','/owedbook']);
    stage='logout';const responseOut=await context.request.post(origin+'/api/auth/logout');check(responseOut.status()===200,'logout-status');
    const denied=await context.request.get(origin+'/owedbook',{maxRedirects:0});
    row.after_logout_status=denied.status();check(denied.status()===307&&new URL(denied.headers().location,origin).pathname==='/auth','logout-denial');
    await page.goto(origin+'/owedbook',{waitUntil:'networkidle'});check(new URL(page.url()).pathname==='/auth','logout-route');
    row.logout='PASS';result.timeline.push({role,action:'logout',result:'PASS',protected_status:denied.status()});
  } catch {row.failed_stage=stage;result.stop={number:'Q2',stage,role};throw new Error('role-walk');}
  finally {
    if(row.sign_ins&&row.logout!=='PASS')try{row.cleanup_logout_status=(await context.request.post(origin+'/api/auth/logout')).status();}catch{row.cleanup_logout_status='failed';}
    row.counters=counters;await context.close();
  }
}
(async()=>{
 try {
  fs.mkdirSync(E,{recursive:true});check(process.env.QA_TARGET_LABEL==='main-dev','target-label');check(!process.env.DEBUG&&!process.env.PWDEBUG,'debug-enabled');
  temp=fs.mkdtempSync(path.join(E,'q2-browser-temp-'));const ledger=path.join(Q,'evidence/temp_paths.json');
  const prior=JSON.parse(fs.readFileSync(ledger,'utf8'));fs.writeFileSync(ledger,JSON.stringify([...prior,temp],null,2)+'\n');
  process.env.TMPDIR=temp;const browserEnv=Object.fromEntries(Object.entries(process.env).filter(([key])=>!key.startsWith('QA_')));
  browser=await chromium.launch({env:browserEnv});await roleWalk('ADMIN');await roleWalk('MEMBER');
 } catch {process.exitCode=1;result.failed_stage=stage;}
 finally {
  try {if(browser)await browser.close();if(temp)fs.rmSync(temp,{recursive:true,force:true});result.profiles_removed=!temp||!fs.existsSync(temp);check(result.profiles_removed,'profile-removal');}
  catch {result.cleanup_failed=true;process.exitCode=1;}
  result.completed_at=new Date().toISOString();fs.writeFileSync(path.join(E,'walk.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({roles:result.roles.map(r=>({role:r.role,sign_ins:r.sign_ins,auth:r.auth,logout:r.logout})),cells:result.cells.length,failed_cells:result.cells.filter(c=>!c.pass).length,profiles_removed:result.profiles_removed,stop:result.stop||null}));
 }
})();
