from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import subprocess,json,os,time,socket,tempfile,shutil
Q=Path('agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM');E=Q/'evidence';(E/'images').mkdir(exist_ok=True);(E/'headers').mkdir(exist_ok=True)
origin='http://127.0.0.1:36155'; env=os.environ.copy();env.update(NEXT_PUBLIC_SUPABASE_URL='https://placeholder.invalid',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='placeholder-publishable',SUPABASE_SECRET_KEY='placeholder-secret',NEXT_PUBLIC_SITE_URL=origin,PORT='36155',HOSTNAME='127.0.0.1')
records=[]
def now():return datetime.now(ZoneInfo('Asia/Dhaka')).isoformat(timespec='seconds')
def probe(route,kind):
 args=['curl','-sS','--max-time','60']
 if kind=='head':args+=['-I']
 elif kind=='post':args+=['-X','POST','-D','-','-o','/dev/null']
 else:args+=['-D','-','-o','/dev/null']
 args+=[origin+route];r=subprocess.run(args,capture_output=True,text=True);raw=r.stdout
 lines=raw.splitlines();status=int(lines[0].split()[1]) if lines and lines[0].startswith('HTTP') else 0
 headers={line.split(':',1)[0].lower():line.split(':',1)[1].strip() for line in lines[1:] if ':' in line}
 row={'command':args,'exit_code':r.returncode,'stdout':raw,'stderr':r.stderr,'status':status,'headers':headers};records.append(row);return row
copy=subprocess.run('cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public',shell=True,capture_output=True,text=True)
assert copy.returncode==0
l=E/'images/placeholder_server.txt';summary={'start':now(),'static_public_copy_exit':copy.returncode,'server_command':'env <same placeholder build variables> PORT=36155 HOSTNAME=127.0.0.1 node .next/standalone/server.js'}
with l.open('w') as log:
 server=subprocess.Popen(['node','.next/standalone/server.js'],env=env,stdout=log,stderr=subprocess.STDOUT)
 try:
  ready=False
  for i in range(60):
   try:
    with socket.create_connection(('127.0.0.1',36155),timeout=.5):ready=True;break
   except OSError:time.sleep(.5)
  assert ready
  with tempfile.TemporaryDirectory(prefix='rrm004-q2-images-') as t:
   body=Path(t,'image.bin');url=origin+'/_next/image?url=%2Flanding%2Fowedbook-mockup.png&w=1080&q=75'
   args=['curl','-sS','--max-time','60','-o',str(body),'-D','-','-H','Accept: image/webp',url];r=subprocess.run(args,capture_output=True,text=True);blob=body.read_bytes()
   image={'command':args,'exit_code':r.returncode,'headers':r.stdout,'stderr':r.stderr,'first_16_bytes_hex':blob[:16].hex(),'bytes':len(blob),'pass':r.returncode==0 and r.stdout.startswith('HTTP/1.1 200') and 'content-type: image/webp' in r.stdout.lower() and blob[:4]==b'RIFF' and blob[8:12]==b'WEBP'}
   (E/'images/local_png.json').write_text(json.dumps(image,indent=2)+'\n')
   args=['curl','-sS','--max-time','60','-D','-',origin+'/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdyb0qa58h%2Fimage%2Fupload%2Fx.png&w=64&q=75'];r=subprocess.run(args,capture_output=True,text=True)
   negative={'command':args,'exit_code':r.returncode,'stdout':r.stdout,'stderr':r.stderr,'pass':r.returncode==0 and r.stdout.startswith('HTTP/1.1 400') and '"url" parameter is not allowed' in r.stdout}
   (E/'images/negative_host.json').write_text(json.dumps(negative,indent=2)+'\n')
  direct=[probe(p,'get') for p in ['/brand/logo-color.svg','/brand/logo-lockup.svg','/landing/owedbook-mockup.png']]
  (E/'images/direct_gets.json').write_text(json.dumps(direct,indent=2)+'\n')
  chunks=sorted(Path('.next/static/chunks').glob('*.js'));assert chunks
  chunk='/_next/static/chunks/'+chunks[0].name
  home=probe('/','head');static=probe(chunk,'head');auth=probe('/auth','head');denied=probe('/owedbook','head');empty=probe('/api/auth/login','post')
  (E/'headers/current.json').write_text(json.dumps({'chunk_from_qa_build':chunk,'captures':[home,static,auth,denied,empty]},indent=2)+'\n')
  shutil.copy2(Q.parent/'evidence/S3_serve_before.txt',E/'headers/historical_engineer_before.txt')
  cc=lambda r:r['headers'].get('cache-control','').lower()
  summary.update(image_pass=image['pass'],remote_denial_pass=negative['pass'],direct_gets_pass=all(r['exit_code']==0 and r['status']==200 and typ in r['headers'].get('content-type','') for r,typ in zip(direct,['image/svg+xml','image/svg+xml','image/png'])),header_pair_controls_pass=home['status']==200 and 'no-store' in cc(home) and static['status']==200 and ('immutable' in cc(static) or 'max-age=31536000' in cc(static)) and 'no-store' not in cc(static) and auth['status']==200 and 'no-store' in cc(auth) and denied['status']==307 and denied['headers'].get('location')=='/auth' and 'no-store' in cc(denied) and 'no-store' in cc(empty),empty_login_status_observed=empty['status'])
 finally:
  server.terminate()
  try:server.wait(timeout=10)
  except subprocess.TimeoutExpired:server.kill();server.wait()
  summary['server_exit']=server.returncode
  with socket.socket() as sock:
   sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1);sock.bind(('127.0.0.1',36155));summary['port_free']=True
  summary['end']=now();(E/'images/served_summary.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
