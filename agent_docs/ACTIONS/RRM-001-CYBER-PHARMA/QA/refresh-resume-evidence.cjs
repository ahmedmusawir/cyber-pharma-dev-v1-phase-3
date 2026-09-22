// Read-only repository snapshot and QA-only inventory refresh; no tests or cleanup.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const qa=__dirname,out=path.join(qa,'evidence/AC304_RESUME');
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:10e6});
const save=(name,value)=>fs.writeFileSync(path.join(out,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');
const candidate='cad164d62a623a115541c0441302de01ff74da5b';
const identity=git('rev-parse','HEAD','refs/heads/qa/phase-3-rrm001');
if(!identity.trim().split('\n').every(x=>x===candidate))throw Error('Candidate changed; stop affected work');
save('current-identity.txt',identity);
save('current-status.txt',git('status','--porcelain','--untracked-files=all'));
save('current-tracked.diff',git('diff','--no-ext-diff','--binary',candidate));
save('current-scope.json',{candidate,trackedChangedPaths:git('diff','--name-only',candidate).trim().split('\n').filter(Boolean),archiveProvenance:'Director-confirmed and approved; DIRECTOR_ARCHIVE_RULING.md',testsRepeated:false,generatedBuildReused:true});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const prior=JSON.parse(fs.readFileSync(path.join(qa,'ARTIFACT_INVENTORY.json'))),origins=new Map(prior.files.map(x=>[x.path,x.origin]));
const files=walk(qa).filter(p=>p!==path.join(qa,'ARTIFACT_INVENTORY.json')).map(p=>({path:path.relative(qa,p),bytes:fs.statSync(p).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),origin:origins.get(path.relative(qa,p))||'created during AC-304 resume'}));
fs.writeFileSync(path.join(qa,'ARTIFACT_INVENTORY.json'),JSON.stringify({note:'Excludes own recursive checksum. Snapshot during AC-304 resume; active walk files may subsequently change. Generated SCRATCH build reused; lifecycle in evidence/AC304_RESUME/.',files},null,2)+'\n');
console.log(JSON.stringify({candidate,artifacts:files.length,screenshots:files.filter(x=>x.path.endsWith('.png')).length}));
