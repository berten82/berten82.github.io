import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = async p => fs.readFile(path.join(root,p),'utf8');
const research = JSON.parse(await read('data/research.json'));
const abstracts = JSON.parse(await read('data/abstracts.json'));
const awards = JSON.parse(await read('data/awards.json'));
const wip = JSON.parse(await read('data/work-in-progress.json'));
const profile = JSON.parse(await read('data/profile.json'));
const coauthors = JSON.parse(await read('data/coauthors.json'));
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href = s => esc(s.startsWith('files/') ? s.split('/').map(encodeURIComponent).join('/') : s);
const a = (url,label,cls='') => `<a href="${href(url)}"${cls?` class="${cls}"`:''}>${esc(label)}</a>`;
const coauthorUrls = new Map(coauthors.flatMap(person=>[person.name,...(person.aliases||[])].map(name=>[name,person.url])));
const coauthorPattern = new RegExp([...coauthorUrls.keys()].sort((a,b)=>b.length-a.length).map(name=>name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
const linkedCoauthors = text => {
  let result='',cursor=0;
  for (const match of text.matchAll(coauthorPattern)) {
    result+=esc(text.slice(cursor,match.index))+a(coauthorUrls.get(match[0]),match[0],'coauthor-link');
    cursor=match.index+match[0].length;
  }
  return result+esc(text.slice(cursor));
};
const cv = 'files/BILGEERTEN_CV.pdf';
const nav = [['cv.html','CV'],['index.html#working-papers','Research'],['awards-grants.html','Awards and Grants'],['teaching.html','Teaching'],['policy-writing.html','Policy Writing & Blogs'],['nih-project.html','NIH Project']];
const shell = (file,title,body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Bilge Erten</title><meta name="description" content="Bilge Erten, Associate Professor of Economics and International Affairs at Northeastern University. Research on gender, health, and development economics.">
<link rel="icon" href="images/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"></head>
<body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell">
<header class="site-header"><a class="brand" href="index.html">Bilge Erten</a><nav aria-label="Main navigation">${nav.map(([url,label])=>`<a href="${url}"${file===url.split('#')[0]?' aria-current="page"':''}>${label}</a>`).join('')}</nav></header>
<main id="main" class="site-main">${body}</main><footer><span>Bilge Erten · Northeastern University</span>${a('mailto:b.erten@northeastern.edu','b.erten@northeastern.edu')}</footer></div></body></html>\n`;
const paper = p => {
  const abstract = abstracts[p.id];
  if (!abstract?.text) throw new Error(`Missing abstract: ${p.title}`);
  const titleUrl = p.pdf || p.url;
  const disclosure = `<details class="abstract"><summary>Abstract <span class="abstract-icon" aria-hidden="true"></span><span class="sr-only"> for ${esc(p.title)}</span></summary>${abstract.note?`<p class="abstract-note">${esc(abstract.note)}</p>`:''}<p>${esc(abstract.text)}</p></details>`;
  return `<li class="paper" id="${esc(p.id)}"><h3>${titleUrl?a(titleUrl,p.title):esc(p.title)}</h3>${p.coauthors?`<p class="coauthors">with ${linkedCoauthors(p.coauthors)}</p>`:''}${p.citation?`<p class="citation">${esc(p.citation)}</p>`:''}<div class="resources">${p.resources.map(r=>a(r.url,r.label==='Appendix'?'Online Appendix':r.label)).join('')}</div>${disclosure}</li>`;
};
const list = (title,subtitle,id,items) => `<section class="collection" id="${id}"><div class="collection-heading"><h2>${title}</h2><p>${subtitle}</p></div><ul class="paper-list" role="list">${items.map(paper).join('')}</ul></section>`;
const featuredTitles = ['Female Leaders and Intrahousehold Dynamics','Trade-offs? The Impact of WTO Accession on Intimate Partner Violence in Cambodia','Mental Health Costs of Lockdowns: Evidence from Age-specific Curfews in Turkey'];
const featured = featuredTitles.map(t=>research.find(p=>p.title.startsWith(t)));
const scholar=profile.google_scholar;
const intro = `<section class="profile" aria-labelledby="profile-title"><h1 id="profile-title">Bilge Erten</h1><img class="portrait" src="images/bilge-erten.jpg" alt="Portrait of Bilge Erten" width="200" height="200"><h2>Bio</h2>
<p>I am an Associate Professor of ${a('https://cssh.northeastern.edu/economics/','Economics')} and ${a('https://cssh.northeastern.edu/internationalaffairs/','International Affairs')} at ${a('https://www.northeastern.edu/','Northeastern University')} and a Research Fellow at ${a('https://www.iza.org/','IZA')}. My research primarily focuses on violence against women and children, mental health, gender and household economics, and health economics. I am also interested in the effects of industrial policies on labor markets, structural transformation, and gender inequality. I am a Co-Editor of the <em>${a('https://link.springer.com/journal/11150','Review of Economics of the Household')}</em>, an Associate Editor of <em>${a('https://www.tandfonline.com/toc/rfec20/current','Feminist Economics')}</em>, and a Faculty Scholar at Northeastern's ${a('https://bouve.northeastern.edu/institute-of-health-equity-social-justice-research/','Institute for Health Equity and Social Justice Research')}.</p>
<div class="profile-links">${a('mailto:b.erten@northeastern.edu','Email')}${a('https://cssh.northeastern.edu/faculty/bilge-erten/','Northeastern')}${a('https://www.iza.org/person/27939/bilge-erten','IZA@LISER')}${a(cv,'CV (PDF)')}${scholar?a(scholar,'Google Scholar'):''}${a('https://bsky.app/profile/bilgeerten.bsky.social','Bluesky')}${a('https://x.com/BilgeErten','X')}</div></section>
<section class="featured" aria-labelledby="featured-heading"><h2 id="featured-heading">Featured research</h2><ul role="list">${featured.map(p=>`<li>${a('#'+p.id,p.title)}<span>${esc(p.citation.split(',')[0])}</span></li>`).join('')}</ul><a class="browse" href="#publications">Browse all publications <span aria-hidden="true">↓</span></a></section>`;
const publications = list('Publications','Published research, newest first','publications',research.filter(p=>p.category==='publication'));
const working = list('Working papers','Current research','working-papers',research.filter(p=>p.category==='working'));
const progress = `<section class="collection" id="work-in-progress"><div class="collection-heading"><h2>Work in progress</h2></div><ul class="paper-list" role="list">${wip.map(t=>{const [title,authors]=t.split(' (with ');return `<li class="paper"><h3>${esc(title)}</h3><p class="coauthors">with ${linkedCoauthors(authors.replace(/\)$/,''))}</p></li>`}).join('')}</ul></section>`;
await fs.writeFile(path.join(root,'index.html'),shell('index.html','Research',intro+working+publications+progress));
const cvBody=`<div class="page-heading"><p class="eyebrow">Curriculum vitae</p><h1>CV</h1><p>Appointments, education, research, teaching, and professional service.</p>${a(cv,'Download CV (PDF)','button')}</div><object class="cv-document" data="${cv}" type="application/pdf" aria-label="Bilge Erten’s curriculum vitae"><p>${a(cv,'Open the CV as a PDF')} to read the full document.</p></object>`;
await fs.writeFile(path.join(root,'cv.html'),shell('cv.html','CV',cvBody));
const grantRows=awards.filter(r=>/\$|Research Grant/.test(r.description));
const honorRows=awards.filter(r=>!grantRows.includes(r));
const rows=items=>`<dl class="timeline">${items.map(r=>`<div><dt>${esc(r.year)}</dt><dd>${esc(r.description)}</dd></div>`).join('')}</dl>`;
const awardsBody=`<div class="page-heading"><p class="eyebrow">Research support & recognition</p><h1>Awards and Grants</h1><p>Research funding, fellowships, and honors.</p></div><section class="collection"><div class="collection-heading"><h2>Research grants</h2></div>${rows(grantRows)}</section><section class="collection"><div class="collection-heading"><h2>Awards and fellowships</h2></div>${rows(honorRows)}</section>`;
await fs.writeFile(path.join(root,'awards-grants.html'),shell('awards-grants.html','Awards and Grants',awardsBody));
const courses=[['2014–present','Northeastern University',['Principles of Macroeconomics','Applied Development Economics (graduate)','Applied Econometrics (undergraduate)','International Economic Development (graduate)']],['Spring 2013','Barnard College',['Development Economics']],['Fall 2013','Columbia University · School of International and Public Affairs',['Macroeconomics of Development (graduate)']],['2010–2011','Drew University',['Money and Banking','International Trade','History of Economic Thought','Intermediate Macroeconomics','Introductory Macroeconomics','International Business']],['2007–2008','University of Massachusetts Amherst',['Development Economics','Intermediate Macroeconomics']]];
const teachingBody=`<div class="page-heading"><p class="eyebrow">Teaching</p><h1>Teaching</h1></div><div class="teaching-list">${courses.map(([year,institution,courses])=>`<section class="course-group"><p class="year">${esc(year)}</p><div><h2>${esc(institution)}</h2><ul>${courses.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div></section>`).join('')}</div>`;
await fs.writeFile(path.join(root,'teaching.html'),shell('teaching.html','Teaching',teachingBody));
const policyLinks = new Map();
const policyMetadata = JSON.parse(await read('data/policy-writing.json'));
const policyDateFormat = new Intl.DateTimeFormat('en-US', {month:'short', day:'numeric', year:'numeric', timeZone:'UTC'});
for (const p of research) {
  for (const resource of p.resources) {
    if (!/\b(voxdev\.org|voxeu\.org|globaldev\.blog)\b/.test(resource.url)) continue;
    if (!policyLinks.has(resource.url)) policyLinks.set(resource.url, {url:resource.url, outlet:resource.label || 'VoxDev', papers:[]});
    const entry=policyLinks.get(resource.url);
    if (!entry.papers.some(item=>item.id===p.id)) entry.papers.push(p);
  }
}
const policyBody=`<div class="page-heading"><h1>Policy Writing &amp; Blogs</h1></div><ul class="paper-list" role="list">${[...policyLinks.values()].map(entry=>{
  const metadata=policyMetadata[entry.url];
  if(!metadata?.date) throw new Error(`Missing policy publication date: ${entry.url}`);
  const date=policyDateFormat.format(new Date(metadata.date+'T00:00:00Z'));
  return `<li class="paper"><h2>${a(metadata.source || entry.url,entry.outlet)}, <time datetime="${esc(metadata.date)}">${esc(date)}</time></h2><p class="coauthors">Related research</p>${entry.papers.map(p=>`<p>${a('index.html#'+p.id,p.title)}</p>`).join('')}</li>`;
}).join('')}</ul>`;
await fs.writeFile(path.join(root,'policy-writing.html'),shell('policy-writing.html','Policy Writing & Blogs',policyBody));
const project=JSON.parse(await read('data/nih-project.json'));
const projectPapers=project.paper_ids.map(id=>{
  const entry=research.find(p=>p.id===id);
  if(!entry) throw new Error(`Missing NIH project paper: ${id}`);
  return entry;
});
const projectBody=`<div class="page-heading"><p class="eyebrow">NIH Project</p><h1>${esc(project.title)}</h1></div><section aria-labelledby="project-summary"><h2 id="project-summary">${esc(project.summary_label)}</h2>${project.summary.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}<ol type="i">${project.interventions.map(item=>`<li>${esc(item)}</li>`).join('')}</ol></section>${list('Project papers','Research findings','project-papers',projectPapers)}`;
await fs.writeFile(path.join(root,'nih-project.html'),shell('nih-project.html',project.title,projectBody));
console.log('Built all six website pages.');
