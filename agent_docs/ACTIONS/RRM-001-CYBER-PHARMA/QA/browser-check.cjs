// QA-only browser probe; never submits account credentials or calls live services.
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const [url,out]=process.argv.slice(2);const save=(n,d)=>fs.writeFileSync(path.join(out,n),JSON.stringify(d,null,2)+'\n');
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
for(const width of [1440,375])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
 const external=[];await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==url){external.push(u.origin);return route.abort();}return route.continue();});
 await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/auth','/auth?tab=register']){
  await page.goto(url+route,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Login',exact:true}).waitFor();
  const result={width,theme,route,email:await page.getByLabel('Email',{exact:true}).getAttribute('type'),password:await page.getByLabel('Password',{exact:true}).getAttribute('type'),loginButtons:await page.getByRole('button',{name:'Login',exact:true}).count(),tabs:await page.getByRole('tab').count(),forbidden:/sign ?up|register|create (an )?account/i.test(await page.locator('body').innerText()),documentWidth:await page.evaluate(()=>document.documentElement.scrollWidth),themeClass:await page.locator('html').getAttribute('class')};
  // Empty fields trigger only local validation; evidence of interactive hydration.
  await page.getByRole('button',{name:'Login',exact:true}).click();await page.getByText('Email is required',{exact:true}).waitFor();result.localValidation=true;
  const filename='auth-'+(route.includes('?')?'query':'plain')+'-'+width+'-'+theme+'.png';await page.screenshot({path:path.join(out,filename),fullPage:true});result.screenshot=filename;results.push(result);
 }
 await page.goto(url+'/',{waitUntil:'networkidle'});
 if(width===375)await page.getByRole('button',{name:'Open menu',exact:true}).click();
 const links=await page.getByRole('link',{name:/Start free trial/i}).evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href'),visible:!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)})));
 const filename='cta-'+width+'-'+theme+'.png';await page.screenshot({path:path.join(out,filename),fullPage:true});results.push({width,theme,route:'/',trialLinks:links,errors,blockedExternalOrigins:[...new Set(external)],screenshot:filename});
 await context.close();
}
save('browser-results.json',results);console.log('Browser evidence: '+results.length+' records');
}finally{await browser.close();}})().catch(e=>{save('browser-error.json',{message:e.message});console.error(e.message);process.exitCode=1;});
