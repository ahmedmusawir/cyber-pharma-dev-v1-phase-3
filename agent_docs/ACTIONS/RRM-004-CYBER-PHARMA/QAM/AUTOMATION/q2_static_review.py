from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import subprocess,json,re,hashlib
Q=Path('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM');E=Q/'evidence/static';S=json.loads(Path('/tmp/rrm004_q2_state.json').read_text());B=S['baseline'];C=S['candidate'];H=S['head'];commands=[]
def git(*args):
 r=subprocess.run(['git','--no-optional-locks',*args],capture_output=True,text=True);commands.append({'command':['git',*args],'exit_code':r.returncode,'stdout':r.stdout,'stderr':r.stderr});assert r.returncode in (0,1);return r.stdout
protected=['src','supabase','scripts','docs','public','README.md','tsconfig.json','jest.config.js','eslint.config.mjs','tailwind.config.ts','postcss.config.js','.gitignore']
preserved={ref:git('diff','--stat',B,ref,'--',*protected)=='' for ref in [C,H]};preserved['working_tree']=git('diff','--stat',B,'--',*protected)==''
a=json.loads(git('show',B+':package.json'));b=json.loads(Path('package.json').read_text())
def changes(a,b,p=''):
 if isinstance(a,dict) and isinstance(b,dict):return sum([changes(a.get(k),b.get(k),p+'/'+k) for k in sorted(set(a)|set(b))],[])
 return [] if a==b else [{'path':p,'before':a,'after':b}]
pkgchanges=changes(a,b)
baseconf=git('show',B+':next.config.js');conf=Path('next.config.js').read_text();without=re.sub(r'  images: \{.*?\n  \},\n','',baseconf,flags=re.S)
config={'baseline_minus_images_equals_current':without==conf,'forbidden_config_hits':re.findall(r'remotePatterns|res\.cloudinary\.com|unoptimized|dangerouslyAllowSVG|loader\s*:|images\s*:',conf)}
cloud={ref:git('grep','-n','res.cloudinary.com',ref,'--','src','public','src/mocks','docs') for ref in [B,C]};readme_hits=git('grep','-n','res.cloudinary.com',C,'--','README.md')
exceptions=[('agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/EXECUTION_LOG.md','a93393d'),('agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/README.md','a93393d'),('agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/EXECUTION_LOG.md','a93393d'),('agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/README.md','ee4a049'),('agent_docs/RRM_CAMPAIGN_JOURNAL.md','ee4a049')]
hunks=[]
for path,commit in exceptions:
 before=git('show',commit+'^:'+path);after=git('show',commit+':'+path)
 hunks.append({'path':path,'historical_commit':git('rev-parse',commit).strip(),'baseline_equals_historical_parent':git('show',B+':'+path)==before,'candidate_equals_historical_result':git('show',C+':'+path)==after,'head_equals_historical_result':git('show',H+':'+path)==after,'working_equals_historical_result':Path(path).read_text()==after,'historical_diff':git('diff',commit+'^',commit,'--',path)})
archive=[]
for line in git('diff-tree','--no-commit-id','--name-status','-r','-M','1eb9c04').splitlines():
 status,old,new=line.split('\t');before=git('show','1eb9c04^:'+old);after=git('show','1eb9c04:'+new)
 archive.append({'status':status,'old':old,'new':new,'historical_bytes_equal':before==after,'candidate_equals_move':git('show',C+':'+new)==after,'head_equals_move':git('show',H+':'+new)==after,'working_equals_move':Path(new).read_text()==after,'sha256':hashlib.sha256(after.encode()).hexdigest()})
A=git('diff','--name-status','-M',B,C);BB=git('diff','--name-status','-M',C,H);U=git('status','--short','--untracked-files=all')
for name,body in [('A_baseline_candidate.txt',A),('B_candidate_head.txt',BB),('C_uncommitted_during_static.txt',U)]: (E/name).write_text(body)
paths=git('diff','--name-only',B,H).splitlines();classification=[]
for p in paths:
 if p in ['package.json','package-lock.json','next.config.js']: category='original AC-403 product allowlist'
 elif p.startswith(str(Q.parent)+'/'):category='original AC-403 module lane'
 elif p in [x[0] for x in exceptions]:category='A-15 historical hunk only'
 elif p in [x['new'] for x in archive]:category='A-15 byte-identical historical archive move'
 elif p in ['agent_docs/RRM_CAMPAIGN_MAP_v1_0.md','agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md']:category='original ledger/map lane; SHA-recording plan, P0 and engineering handoff'
 elif p in ['CHANGELOG.md','RECOVERY.md'] or p.startswith(('agent_docs/SESSIONS/','agent_docs/RESPONSES/')):category='root CLAUDE.md protocol records; phase/author-specific provenance'
 else:category='UNRESOLVED'
 classification.append({'path':p,'authority':category})
ledgerdiff=git('diff',B,H,'--','agent_docs/RRM_CAMPAIGN_MAP_v1_0.md','agent_docs/RRM_FINDINGS_DISPOSITION_LEDGER.md')
(E/'ledger_map_hunks.txt').write_text(ledgerdiff)
(E/'source_image_derivation.txt').write_text(git('grep','-n','-E','logo-|mockup.png|redirect\("/owedbook"\)',H,'--','src/components/global','src/app/(public)')+'\nTheme controls: src/components/global/ThemeToggler.tsx; mobile authenticated control reached through Open menu. No manifest inventory used.\n')
(E/'commands.json').write_text(json.dumps(commands,indent=2)+'\n')
result={'timestamp':datetime.now(ZoneInfo('Asia/Dhaka')).isoformat(timespec='seconds'),'baseline':B,'candidate':C,'qa_head':H,'preserved_paths':preserved,'package_changes':pkgchanges,'config':config,'cloudinary_consumers':cloud,'readme_markdown_exceptions':readme_hits,'a15_hunks':hunks,'a15_archive_moves':archive,'path_classification':classification,'unresolved_paths':[r['path'] for r in classification if r['authority']=='UNRESOLVED'],'notes':['A-15 comparisons are independent Q2 measurements; Q1b approval was not a product PASS.','Root protocol records classified under CLAUDE.md response/session/recovery/changelog protocols, not a blanket agent_docs exemption.','Original ledger/map hunks retained for review against archived SHA-recording plan, CLAUDY_PROMPTS P0 and engineering handoff.']}
(E/'summary.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'preserved':preserved,'package_changes':pkgchanges,'config':config,'a15_hunks_match':all(all(x[k] for k in ['baseline_equals_historical_parent','candidate_equals_historical_result','head_equals_historical_result','working_equals_historical_result']) for x in hunks),'archive_moves':len(archive),'archives_match':all(x['status']=='R100' and all(x[k] for k in ['historical_bytes_equal','candidate_equals_move','head_equals_move','working_equals_move']) for x in archive),'unresolved_paths':result['unresolved_paths']},indent=2))
