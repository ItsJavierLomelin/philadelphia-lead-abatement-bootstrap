import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {site} from '../config/site.mjs';
import {normalizePhone} from './phone.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=JSON.parse(await readFile(resolve(root,'source/pages.json'),'utf8'));
const phone=normalizePhone(site.phone);
const escape=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base=site.base.replace(/\/$/,'');
let menuId=0;
for(const [route,template] of Object.entries(pages)) {
 const output=route==='404.html'?route:(!route||route==='/')?'index.html':route.replace(/^\//,'').replace(/\/$/,'')+'.html'; // named .html files, so website importers keep each page's real name/slug instead of 'index'
 let html=template.replaceAll('{{ORIGIN}}',escape(site.origin+base)).replaceAll('{{PHONE_DISPLAY}}',escape(phone.display)).replaceAll('{{PHONE_TEL}}',escape(phone.tel));
 html=html.replace('<link rel="stylesheet" href="/assets/css/site.css">','<link rel="stylesheet" href="/assets/vendor/bootstrap/bootstrap.custom.min.css">\n<link rel="stylesheet" href="/assets/css/site.css">\n<link rel="stylesheet" href="/assets/css/bootstrap-fidelity.css">');
 html=html.replace('class="wrap head-in"','class="container wrap head-in"')
 .replace('class="main-nav"','class="main-nav collapse"')
 .replace('class="dd"','class="dd collapse"')
 .replace(/class="dd-btn"/g,'class="dd-btn" data-bs-toggle="collapse"')
 .replace('id="burger" class="burger"','id="burger" class="burger" data-bs-toggle="collapse" data-bs-target="#mnav"')
 .replace(/<ul class="dd collapse">/g,()=>`<ul class="dd collapse" id="submenu-${++menuId}">`);
 let target=0;
 html=html.replace(/class="dd-btn" data-bs-toggle="collapse"/g,()=>`class="dd-btn" data-bs-toggle="collapse" data-bs-target="#submenu-${++target}" aria-controls="submenu-${target}"`);
 menuId=0;
 html=html.replace(/class="wrap hero-grid"/g,'class="container wrap hero-grid row"')
 .replace(/class="hero-copy"/g,'class="hero-copy col-12 col-lg-7"')
 .replace(/class="form-card"/g,'class="form-card col-12 col-lg-5"')
 .replace(/class="(?:wrap )?grid(?: grid4)?"/g,m=>m.replace('grid','row grid'))
 .replace(/class="card"/g,'class="card col-12 col-sm-6 col-lg-3"')
 .replace(/<input (?!class="hp")/g,'<input class="form-control" ')
 .replace(/<textarea /g,'<textarea class="form-control" ')
 .replace('<script src="/assets/js/site.js" defer></script>','<script src="/assets/vendor/bootstrap/bootstrap.bundle.min.js" defer></script>\n<script src="/assets/js/site.js" defer></script>');
 // Inline hero backgrounds (literal values, no CSS vars) so website importers keep hero image and color on every viewport.
 html=html.replace(/<section class="hero">/g,'<section class="hero" style="background:linear-gradient(135deg,#e8efe9,#faf7f0)">')
 .replace(/<section class="hero hero-home" style="--hero-img:url\('([^']*)'\)">/g,(m,u)=>`<section class="hero hero-home" style="background:linear-gradient(100deg,rgba(7,38,34,.93) 0%,rgba(7,38,34,.78) 55%,rgba(7,38,34,.55) 100%),url('${u}') center/cover no-repeat #072622;color:#fff">`);
 // Portable relative links: works from file://, a local server or any folder.
 const depth=output.split('/').length-1;
 const rel=depth?'../'.repeat(depth):'./';
 const localPath=p=>{const [path,hash]=p.split('#');const file=path==='/'?'index.html':path.endsWith('/')?path.slice(1,-1)+'.html':path.slice(1);return rel+file+(hash?'#'+hash:'');};
 html=html.replace(/(href|src|action)="\/(?!\/)([^"]*)"/g,(_,attr,path)=>`${attr}="${localPath('/'+path)}"`)
 .replace(/url\('\/(?!\/)([^']*)'\)/g,(_,path)=>`url('${rel}${path}')`);
 await mkdir(dirname(resolve(root,output)),{recursive:true});
 await writeFile(resolve(root,output),html);
}
await writeFile(resolve(root,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log(`Built ${Object.keys(pages).length} Bootstrap pages. Phone: ${phone.display}`);
