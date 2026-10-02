from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import subprocess,json,re,tempfile,hashlib,base64,urllib.request,tarfile,io,shutil
Q=Path('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM'); E=Q/'evidence/deps'; S=Path('/tmp/rrm004_q2_state.json'); state=json.loads(S.read_text()); assert state.get('preflight_passed')
B=state['baseline']; records=[]; findings=[]
def now():return datetime.now(ZoneInfo('Asia/Dhaka')).isoformat(timespec='seconds')
def run(args,name,cwd=None,allowed=(0,)):
 r=subprocess.run(args,cwd=cwd,capture_output=True,text=True)
 (E/name).write_text(r.stdout)
 (E/(name+'.command.json')).write_text(json.dumps({'command':args,'cwd':str(cwd or Path.cwd()),'timestamp':now(),'exit_code':r.returncode,'stderr':r.stderr},indent=2)+'\n')
 records.append({'file':name,'exit':r.returncode})
 if r.returncode not in allowed:
  state['stop']={'number':'Q5','timestamp':now(),'command':' '.join(args),'evidence':str(E/name),'reason':'Dependency/registry measurement command failed'};S.write_text(json.dumps(state,indent=2)+'\n');raise SystemExit(1)
 return r
package=json.loads(Path('package.json').read_text())
# Completed before helper repair; retain the original successful measurement.
assert (E/'npm_ls.txt').is_file()
assert (E/'native_packages.txt').is_file()
meta=run(['node','-e',"const fs=require('fs');const p=process.platform+'-'+process.arch;const sharp=require('sharp');const sp=JSON.parse(fs.readFileSync('node_modules/sharp/package.json'));const packages={};for(const n of ['sharp-'+p,'sharp-libvips-'+p])packages[n]=JSON.parse(fs.readFileSync('node_modules/@img/'+n+'/package.json')); console.log(JSON.stringify({platform:p,versions:require('@img/sharp-libvips-'+p+'/versions'),sharpVersions:sharp.versions,sharpVersion:sp.version,optionalDependencies:sp.optionalDependencies,packages},null,2))"],'installed_metadata.json')
m=json.loads(meta.stdout); heif=m['versions']['heif']; floor=Q/'AUTOMATION/q2_version_floor.cjs'
attack=[]
for value,threshold,expected in [('1.23.1','1.23.2',1),('broken','1.23.2',2),('1.23.2','1.23.2',0),(heif,'1.23.2',0),(heif,str(int(heif.split('.')[0])+1)+'.0.0',1)]:
 r=subprocess.run(['node',str(floor),value,threshold],capture_output=True,text=True)
 attack.append({'command':['node',str(floor),value,threshold],'expected_exit':expected,'exit':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
 if r.returncode!=expected:
  (E/'instrument_attack.txt').write_text(json.dumps(attack,indent=2)+'\n');state['stop']={'number':'Q5','timestamp':now(),'command':'numeric version/floor instrument attack','evidence':str(E/'instrument_attack.txt')};S.write_text(json.dumps(state,indent=2)+'\n');raise SystemExit(1)
(E/'instrument_attack.txt').write_text(json.dumps(attack,indent=2)+'\n')
for name in ['next','sharp','eslint-config-next']:
 target={'next':'16.3.7','sharp':'0.35.5','eslint-config-next':'16.3.7'}[name]
 run(['npm','view',name+'@'+target,'version','--json'],'registry_'+name+'_version.json')
for name in ['next','sharp']:
 run(['npm','view',name,'time','--json'],'registry_'+name+'_time.json')
p1='2026-09-30T16:10:37+08:00'
# P1 report timestamp corroborated by engineering transcript/session; record cutoff explicitly.
cutoff=datetime.fromisoformat(p1); registry={}
for name,line in [('next','16.3.'),('sharp','0.35.')]:
 times=json.loads((E/('registry_'+name+'_time.json')).read_text()); versions=[]
 for v,t in times.items():
  if re.fullmatch(re.escape(line)+r'\d+',v): versions.append((v,t))
 at=[v for v,t in versions if datetime.fromisoformat(t.replace('Z','+00:00'))<=cutoff]
 registry[name]={'stable_line_publications':versions,'highest_at_p1':max(at,key=lambda v:tuple(map(int,v.split('.')))) if at else None,'p1_cutoff':p1}
base=json.loads(subprocess.check_output(['git','show',B+':package-lock.json']))
name='@img/sharp-libvips-'+m['platform']; entry=base['packages']['node_modules/'+name]
url=entry['resolved']; assert url.startswith('https://registry.npmjs.org/')
blob=urllib.request.urlopen(url,timeout=60).read(); algorithm,expected=entry['integrity'].split('-',1); actual=base64.b64encode(hashlib.new(algorithm,blob).digest()).decode();assert actual==expected
with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as tar:
 versions=json.load(tar.extractfile('package/versions.json'))
(E/'baseline_metadata.json').write_text(json.dumps({'derivation':'git show baseline:package-lock.json; fetch locked registry tarball; verify SRI; read package/versions.json without executing package','baseline':B,'package':name,'lock_entry':entry,'integrity_verified':True,'versions':versions,'timestamp':now()},indent=2)+'\n')
audit=run(['npm','audit','--json'],'audit_current.json',allowed=(0,1))
with tempfile.TemporaryDirectory(prefix='rrm004-q2-baseline-audit-') as temp:
 for name in ['package.json','package-lock.json']:
  Path(temp,name).write_bytes(subprocess.check_output(['git','show',B+':'+name]))
 baseline_audit=run(['npm','audit','--package-lock-only','--json'],'audit_baseline.json',cwd=temp,allowed=(0,1))
current=json.loads(audit.stdout); prior=json.loads(baseline_audit.stdout)
ids=['GHSA-p293-qw3h-jr36','GHSA-2xp9-vwfh-vxw4','GHSA-rgj7-g3m4-5g8c']
summary={'timestamp':now(),'pins':{'next':package['dependencies']['next'],'eslint-config-next':package['devDependencies']['eslint-config-next'],'sharp':package['overrides']['sharp']},'registry':registry,'heif_baseline':versions['heif'],'heif_after':heif,'sharp_crosscheck':m['sharpVersions']['heif'],'instrument_attack_passed':True,'audit_current_totals':current.get('metadata',{}).get('vulnerabilities'),'audit_baseline_totals':prior.get('metadata',{}).get('vulnerabilities'),'target_ids_current_absent':{x:x not in audit.stdout for x in ids},'target_ids_baseline_present':{x:x in baseline_audit.stdout for x in ids},'records':records}
(E/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
