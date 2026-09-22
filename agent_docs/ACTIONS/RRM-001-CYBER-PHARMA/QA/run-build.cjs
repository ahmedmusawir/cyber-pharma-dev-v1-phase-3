// SOL-released QA build/HTTP collector; all durable evidence stays under QA.
const fs=require('fs'), path=require('path'), cp=require('child_process'), net=require('net'), crypto=require('crypto');
const root='/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3';
const qa=path.join(root,'agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA');
const state=process.argv[2]; if(!['T','U','blank'].includes(state)) throw Error('T/U/blank required');
const out=path.join(qa,'evidence',state);fs.mkdirSync(out,{recursive:true});
const save=(n,d)=>fs.writeFileSync(path.join(out,n),typeof d==='string'?d:JSON.stringify(d,null,2)+'\n');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(...a)=>cp.execFileSync('git',a,{encoding:'utf8'}).trim();
const candidate='cad164d62a623a115541c0441302de01ff74da5b';
if(fs.realpathSync('.')!==root||git('rev-parse','HEAD')!==candidate||git('rev-parse','refs/heads/qa/phase-3-rrm001')!==candidate)throw Error('Pin/path drift');
const drift=git('diff','--name-only').split('\n').filter(Boolean);
const expected=JSON.parse(fs.readFileSync(path.join(qa,'evidence/preexisting-document-relocations.json'))).map(x=>x.original);
if(JSON.stringify(drift.sort())!==JSON.stringify(expected.sort()))throw Error('Unexpected tracked changes');
const next=path.join(root,'.next');
if(fs.existsSync(next)&&(fs.lstatSync(next).isSymbolicLink()||fs.realpathSync(next)!==next))throw Error('Unsafe .next target');
save('fresh-cleanup.json',{target:next,symlink:false,resolved:fs.existsSync(next)?fs.realpathSync(next):next,candidate,date:new Date().toISOString()});
// Only the exact authorized generated directory is removed, after validation.
fs.rmSync(next,{recursive:true,force:true});
const flag=state==='T'?'true':'';
const env={...process.env,NEXT_PUBLIC_SUPABASE_URL:state==='blank'?'':'https://placeholder.invalid',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:state==='blank'?'':'placeholder-publishable',SUPABASE_SECRET_KEY:state==='blank'?'':'placeholder-secret',NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:36055',NEXT_PUBLIC_ENABLE_MOOSE_PORTAL:flag,NEXT_TELEMETRY_DISABLED:'1'};
// Environment values are never dumped. Handoff placeholders override local files.
const run=(exe,args,e=env)=>new Promise(resolve=>{let log='';const child=cp.spawn(exe,args,{cwd:root,env:e,stdio:['ignore','pipe','pipe']});child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);child.on('error',err=>{log+=err.message;});child.on('close',code=>resolve({code,log}));});
const ids=['402dc37b2b824c1412b54c07a6754d1f00f781c2dc','404e90d686531af573f3973524ae30e48d42564fdb','40d73ff364e71e0ded6e2d8bdbd18d3449dc317cad','40e1008514ac7084cf1a567948a2afe66cb4986f22','60fe6f04c7baf4ba561914ff2157c6d7071a99ff7e'];
function files(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(d,x.name)):[path.join(d,x.name)]);}
function projection(p){const m=JSON.parse(fs.readFileSync(p));return Object.fromEntries(['node','edge'].map(k=>[k,Object.entries(m[k]||{}).map(([id,v])=>({id,filename:v.filename,exportedName:v.exportedName,workers:v.workers}))]));}
async function main(){
 console.log('Building fresh state '+state);
 const build=await run(path.join(root,'node_modules/.bin/next'),['build']);save('build.log',build.log);save('build-result.json',{exit:build.code,state,candidate,routes:build.log.split('\n').filter(x=>/^[┌├└]/.test(x.trim()))});console.log('Build '+state+' exit '+build.code);
 if(build.code!==0)return;
 const buildId=fs.readFileSync(path.join(next,'BUILD_ID'),'utf8').trim();save('BUILD_ID.txt',buildId+'\n');
 if(state==='blank')return;
 for(const [name,p] of [['root',path.join(next,'server/server-reference-manifest.json')],['standalone',path.join(next,'standalone/.next/server/server-reference-manifest.json')]])save(name+'-actions.json',projection(p));
 const compiled=[];for(const p of files(path.join(next,'server'))){if(!/\.(js|map)$/.test(p))continue;const s=fs.readFileSync(p,'utf8');const names=['getUserById','deleteUser','editUser','addMember'];const hits=names.filter(n=>s.includes(n));const calls=s.includes('.auth.admin.');const moduleRef=s.includes('moose-portal/users/actions');if(hits.length||calls||moduleRef)compiled.push({path:path.relative(root,p),sha256:hash(s),hits,authAdminCallLiteral:calls,removedModuleReference:moduleRef,containsAdminUsers:s.includes('/admin/users'),containsAdminDemo:s.includes('inviteMember')||s.includes('useAdminDemoStore'),snippets:hits.flatMap(n=>[...s.matchAll(new RegExp(n,'g'))].slice(0,3).map(m=>s.slice(Math.max(0,m.index-110),m.index+200)))});}
 save('compiled-matches.json',compiled);
 const regs=projection(path.join(next,'server/server-reference-manifest.json'));const entries=[...regs.node,...regs.edge];save('action-checks.json',{historicalIdsAbsent:ids.every(id=>entries.every(e=>e.id!==id)),removedRegistrationsAbsent:entries.every(e=>!JSON.stringify(e).includes('moose-portal')&&!['getUsers','getUserById','addMember','deleteUser','editUser'].includes(e.exportedName)),registrations:entries.length,authAdminLiteralMatches:compiled.filter(x=>x.authAdminCallLiteral).length,removedModuleMatches:compiled.filter(x=>x.removedModuleReference).length,editUserMatches:compiled.filter(x=>x.hits.includes('editUser')).length});
 fs.cpSync(path.join(root,'public'),path.join(next,'standalone/public'),{recursive:true});fs.cpSync(path.join(next,'static'),path.join(next,'standalone/.next/static'),{recursive:true});
 const port=await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
 const url='http://127.0.0.1:'+port;let log='';let exited=false;
 const server=cp.spawn(process.execPath,[path.join(next,'standalone/server.js')],{cwd:root,env:{...env,PORT:String(port),HOSTNAME:'127.0.0.1'},stdio:['ignore','pipe','pipe']});server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);server.on('exit',()=>exited=true);
 const summary={candidate,state,buildId,port,pid:server.pid,entry:path.join(next,'standalone/server.js'),entryHash:hash(fs.readFileSync(path.join(next,'standalone/server.js'))),standaloneBuildId:fs.readFileSync(path.join(next,'standalone/.next/BUILD_ID'),'utf8').trim(),sameFlagAtBuildAndServe:true};
 try{
  let ready=false;for(let i=0;i<100;i++){if(exited)break;try{const r=await fetch(url+'/auth');if(r.status===200){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}
  save('server-identity.json',summary);if(!ready)throw Error('Standalone boot failure: stop; no fallback');
  const requests=[...['/moose-portal','/moose-portal/users','/moose-portal/users/add-member','/moose-portal/users/edit/x','/owedbook'].map(p=>({p,method:'GET'})),{p:'/api/auth/signup',method:'POST',headers:{'content-type':'application/json'},body:'{}'},{p:'/api/auth/login',method:'POST'},{p:'/api/auth/login',method:'GET'},...ids.map(id=>({p:'/',method:'POST',headers:{'Next-Action':id,'Content-Type':'text/plain;charset=UTF-8'},body:'[]'})),{p:'/auth',method:'GET'},{p:'/auth?tab=register',method:'GET'}];
  const result=[];for(let i=0;i<requests.length;i++){const q=requests[i],r=await fetch(url+q.p,{method:q.method,headers:q.headers,body:q.body,redirect:'manual'});const body=await r.text();const headers=Object.fromEntries([...r.headers].filter(([k])=>['location','content-type','x-nextjs-action-not-found','x-action-redirect','cache-control'].includes(k)));save('http-'+String(i+1).padStart(2,'0')+'.body.txt',body);result.push({request:q,status:r.status,headers,bodyFile:'http-'+String(i+1).padStart(2,'0')+'.body.txt',bytes:Buffer.byteLength(body)});}save('http-results.json',result);
  const html=await(await fetch(url+'/auth')).text();const assetPaths=[...new Set([...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(m=>m[1]))];const assets=[];for(const p of assetPaths){const r=await fetch(url+p);assets.push({path:p,status:r.status,contentType:r.headers.get('content-type')});}save('assets.json',assets);
  console.log('HTTP/action checks collected for '+state+'; starting installed Chromium');
  const browser=await run(process.execPath,[path.join(qa,'browser-check.cjs'),url,out]);save('browser-run.log',browser.log);save('browser-exit.json',{exit:browser.code});
 }finally{
  if(!exited)server.kill('SIGTERM');for(let i=0;i<50&&!exited;i++)await new Promise(r=>setTimeout(r,100));if(!exited){server.kill('SIGKILL');await new Promise(r=>server.once('exit',r));}
  const free=await new Promise(resolve=>{const s=net.createServer();s.once('error',()=>resolve(false));s.listen(port,'127.0.0.1',()=>s.close(()=>resolve(true)));});save('server.log',log);save('server-stop.json',{pid:server.pid,exited,port,portFree:free});console.log('Stopped QA server '+server.pid+'; port free='+free);
 }
}
main().catch(err=>{save('collector-error.txt',err.stack);console.error(err.message);process.exitCode=1;});
