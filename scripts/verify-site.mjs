import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const pages=['index.html','cv.html','awards-grants.html','teaching.html','policy-writing.html','nih-project.html'];
const errors=[];
let checked=0;
for(const page of pages){
  const html=await fs.readFile(path.join(root,page),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length) errors.push(`${page}: duplicate IDs`);
  if((html.match(/aria-current="page"/g)||[]).length!==1) errors.push(`${page}: navigation current-page marker`);
  if((html.match(/<h1\b/g)||[]).length!==1) errors.push(`${page}: expected one h1`);
  for(const match of html.matchAll(/\b(?:href|src|data)="([^"]+)"/g)){
    const url=match[1].replace(/&amp;/g,'&');
    if(/^(https?:|mailto:)/.test(url)) continue;
    checked++;
    const [file,hash]=url.split('#');
    const target=path.join(root,decodeURIComponent((file||page).split('?')[0]));
    try{
      const stat=await fs.stat(target);
      if(!stat.size) errors.push(`${page}: empty file ${url}`);
      if(hash){const targetHtml=await fs.readFile(target,'utf8');if(!targetHtml.includes(`id="${hash}"`))errors.push(`${page}: missing anchor ${url}`);}
    }catch{errors.push(`${page}: missing file ${url}`);}
  }
}
const research=JSON.parse(await fs.readFile(path.join(root,'data/research.json'),'utf8'));
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const abstracts=JSON.parse(await fs.readFile(path.join(root,'data/abstracts.json'),'utf8'));
if(html.indexOf('id="working-papers"')>html.indexOf('id="publications"')) errors.push('Working papers must precede publications');
if(/>PDF<\/a>/.test(html)) errors.push('Redundant PDF link');
if((html.match(/<details class="abstract">/g)||[]).length!==research.length) errors.push('Expected an abstract disclosure for every paper');
if(research.filter(p=>p.category==='publication').length!==31) errors.push('Publication count changed');
if(/<ol\b/.test(html))errors.push('Publication lists must not be numbered');
for(const entry of research){
  if(!html.includes(`id="${entry.id}"`))errors.push(`Missing paper: ${entry.title}`);
  if(!entry.citation)errors.push(`Missing citation/status: ${entry.title}`);
  if(!abstracts[entry.id]?.text)errors.push(`Missing abstract: ${entry.title}`);
}
const jpg=await fs.readFile(path.join(root,'images/bilge-erten.jpg'));
if(jpg[0]!==0xff||jpg[1]!==0xd8)errors.push('Portrait is not a JPEG');
if(errors.length)throw new Error(errors.join('\n'));
console.log(`PASS: ${pages.length} pages; ${checked} local links/assets; all 36 papers and abstract disclosures; working papers first; no redundant PDF links; navigation and anchors.`);
