import { chromium } from 'playwright-core';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root=process.env.ROOT||'/home/user/actibati';const outdir=new URL('../pdf', import.meta.url).pathname;
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end()}const hd=fs.readFileSync(f).subarray(0,2);r.writeHead(200,{'content-type':(hd[0]==0xFF&&hd[1]==0xD8)?'image/jpeg':(types[path.extname(f)]||'application/octet-stream')});fs.createReadStream(f).pipe(r)}).listen(8788);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for (const [pg,out] of [['roussillon41','Parc-Roussillon-41.pdf'],['ateliers','Acti-Sud-Nimes.pdf']]) {
  const p=await b.newPage({viewport:{width:1200,height:850}});
  await p.goto(`http://localhost:8788/${pg}/`,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager'));
  await p.waitForLoadState('networkidle'); await p.evaluate(()=>document.fonts.ready);
  await p.evaluate(()=>Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{}))));
  await p.waitForTimeout(2500);
  await p.emulateMedia({media:'print'});
  await p.pdf({path:`${outdir}/${out}`,printBackground:true,preferCSSPageSize:true});
  console.log(out, fs.statSync(`${outdir}/${out}`).size);
  await p.close();
}
await b.close(); srv.close();
