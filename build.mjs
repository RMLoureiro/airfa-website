// Geometry-based static generator for the AIRFA replica.
// Reconstructs each sub-page by absolutely positioning every element at the
// exact coordinates/styles captured from the original (see _scrape/layout/).
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const ROOT = path.resolve('.');
// Cache-bust the stylesheet: nginx serves styles.css with a 7-day cache, so a
// content hash in the URL forces returning visitors to fetch the updated CSS
// (otherwise a stale stylesheet drops the dual-render rules and the mobile
// reconstruction stacks at the bottom of every page).
const CSS_VER = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'styles.css'))).digest('hex').slice(0, 8);
const LAY = path.join(ROOT, '_scrape', 'layout');
const ANCHOR_DEFAULT = 341;    // header(56) + banner(285) => content canvas top
const ANCHOR_BY_SLUG = { documentos: 896 };  // documentos has a tall cover banner

const NAV = [
  { label:'Início', file:'index.html', key:'inicio' },
  { label:'A Academia', file:'a-academia.html', key:'a-academia', sub:[
    ['História','historia.html'],['Estatutos','estatutos.html'],['Orgãos Sociais','orgaos-sociais.html'],
    ['Hino','hino.html'],['Biblioteca','biblioteca.html'],['Documentos','documentos.html'] ]},
  { label:'Actividades', file:'actividades.html', key:'actividades' },
  { label:'Banda', file:'banda.html', key:'banda' },
  { label:'Salas de Espetáculo', file:'salas-de-espetaculo.html', key:'salas', sub:[
    ['Cine-Teatro','cine-teatro.html'],['Sala de Cinema','sala-de-cinema.html'] ]},
  { label:'Contactos', file:'contactos.html', key:'contactos' },
];
const SOCIAL = {
  facebook:'https://www.facebook.com/AcademiaAlmadense',
  instagram:'https://instagram.com/academia.almadense/',
  youtube:'https://youtube.com/user/AcademiaAlmadense',
};
// Letra do Hino (versão do 117.º aniversário, 27 de Março de 2012), transcrita
// verbatim do site original. Uma entrada por estrofe; cada linha é um verso.
const HINO_ESTROFES = [
  ['Foi em noventa e cinco','A vinte e sete, ditoso dia','Que em Março, com afinco','Se fundou em Almada a nossa Academia'],
  ['Foi de muita coragem','O gesto dos nossos percursores,','Cantemos em homenagem','E respeito pelos nossos fundadores'],
  ['Salve! Viva a nossa Academia','De Instrução e Recreio Almadense','Entoemos pois com alegria','Este hino que só a nos pertence'],
  ['Académicos, com honra e glória','Defendei sempre a nossa Bandeira','Trabalhemos honrando a memória','De José Maria de Oliveira.'],
];
const TITLES = { 'a-academia':'A Academia','historia':'História','estatutos':'Estatutos',
  'orgaos-sociais':'Orgãos Sociais','hino':'Hino','biblioteca':'Biblioteca','documentos':'Documentos',
  'actividades':'Actividades','banda':'Banda','salas-de-espetaculo':'Salas de Espetáculo',
  'cine-teatro':'Cine-Teatro','sala-de-cinema':'Sala de Cinema','contactos':'Contactos' };

// ===== SEO =====
const SITE = 'https://airfa.pt';
const ORG_NAME = 'Academia de Instrução e Recreio Familiar Almadense';
// Per-page meta descriptions (~150 chars). Every description repeats the official
// name + the "Academia Almadense"/"AIRFA" variants people actually search for.
const DESCRIPTIONS = {
  'a-academia':'Conheça a Academia de Instrução e Recreio Familiar Almadense (AIRFA, Academia Almadense): história, estatutos, órgãos sociais e atividades em Almada desde 1895.',
  'historia':'História da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), colectividade fundada em 1895 em Almada.',
  'estatutos':'Estatutos da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'orgaos-sociais':'Órgãos sociais da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'hino':'Hino da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), colectividade almadense desde 1895.',
  'biblioteca':'Biblioteca da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'documentos':'Documentos da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'actividades':'Atividades e eventos da Academia Almadense (AIRFA): desporto, cultura e formação na Academia de Instrução e Recreio Familiar Almadense, em Almada.',
  'banda':'Banda Filarmónica da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), com mais de um século de história em Almada.',
  'salas-de-espetaculo':'Salas de espetáculo da Academia Almadense (AIRFA): Cine-Teatro e Sala de Cinema da Academia de Instrução e Recreio Familiar Almadense, em Almada.',
  'cine-teatro':'Cine-Teatro da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'sala-de-cinema':'Sala de Cinema da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense), em Almada.',
  'contactos':'Contactos da Academia de Instrução e Recreio Familiar Almadense (AIRFA / Academia Almadense): Rua Capitão Leitão nº64, 2800-068 Almada. Tel. 212 729 750.',
};
// Organization structured data — emitted on every page so Google ties the whole
// site to one entity. alternateName carries every spelling people search for.
const ORG_JSONLD = JSON.stringify({
  '@context':'https://schema.org','@type':'Organization',
  name: ORG_NAME,
  alternateName:['AIRFA','Academia Almadense','Academia de Recreio e Instrução Familiar Almadense'],
  url: SITE + '/',
  logo: SITE + '/assets/crest.png',
  image: SITE + '/assets/hero-theater.jpg',
  foundingDate:'1895',
  email:'academia.almadense@gmail.com',
  telephone:'+351212729750',
  address:{'@type':'PostalAddress',streetAddress:'Rua Capitão Leitão, nº64',postalCode:'2800-068',addressLocality:'Almada',addressCountry:'PT'},
  sameAs:['https://www.facebook.com/AcademiaAlmadense','https://instagram.com/academia.almadense/','https://youtube.com/user/AcademiaAlmadense'],
});
function seoHead(slug, title, desc){
  const url = `${SITE}/${slug}.html`;
  const img = `${SITE}/assets/hero-theater.jpg`;
  return `<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Academia Almadense (AIRFA)">
<meta property="og:locale" content="pt_PT">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
<script type="application/ld+json">${ORG_JSONLD}</script>`;
}

const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Collapsible widgets (Google Sites "collapsible text"): rendered collapsed by
// default with a chevron; click expands the content and pushes content below down.
const COLLAPSIBLES = {
  banda: [{
    header: 'MAESTRO FRANCISCO PINTO',
    id: 'collap-maestro',
    delta: 308, shiftAbove: 2300, left: 114, top: 2326, width: 842,
    style: "font-family:'Open Sans',sans-serif;font-size:13.3333px;line-height:16px;color:rgb(46,61,76)",
    paras: [
      'Francisco Pereira Pinto nasceu a 23 de Abril de 1964 em Guimarães. Aos 13 anos de idade começou os seus estudos musicais na filarmónica das Caldas das Taipas. Continuou a desenvolver a sua aprendizagem no Conservatório de Música da Fundação Calouste Gulbenkian em Braga.',
      'Em 1983, fez concurso para admissão na Banda da Guarda Nacional Republicana, onde presentemente tem o posto de sargento-mor.',
      'Concluiu o curso de Clarinete no Conservatório em Lisboa, tendo como professores: António Saiote, Jorge Trindade e Manuel Jerónimo, em Clarinete; Salomé Leal, em Formação Musical; Paulo Brandão, Jorge Peixinho e Eurico Carrapatoso, em Análise e Técnicas de Composição; Francisco Melo, em Acústica; Fernanda Melo, em História da Música e Peres Newton em Música de Câmara.',
      'Frequentou em 1990, em Setúbal um curso de Música de Câmara orientado pela Pianista Olga Prats. Participou em várias orquestras, nomeadamente: Orquestra Sinfónica Juvenil, Orquestra Portuguesa da Juventude, Orquestra das Escolas Particulares e Orquestra "os insólitos". É membro fundador do Quarteto de Clarinetes Chalumeau, onde já actuou por todo o País e Arquipélago dos Açores onde ministrou cursos de aperfeiçoamento de Clarinetistas. Leccionou ainda Clarinete na Academia Luisa Todi em Setúbal e no Conservatório Silva Marques em Alhandra.',
      'Em 2008, foi condecorado pela Câmara Municipal do Seixal com a medalha de mérito cultural. No campo do ensino da Música em Colectividades, dirigiu a Banda da Sociedade Filarmónica Timbre Seixalense, a Banda da Sociedade Filarmónica da Gançaria, a Banda da Sociedade Filarmónica Gualdim Pais de Tomar e a Orquestra do Clube Recreativo da Cruz de Pau. Actualmente dirige a Banda da Associação Desportiva e Recreativa "o Paraíso", em Vale do Paraíso, Azambuja, e a Banda Filarmónica da Academia de Instrução e Recreio Familiar Almadense.',
    ],
  }],
  historia: [{
    header: 'GALERIA DE PRESIDENTES',
    id: 'collap-galeria',
    delta: 1297, shiftAbove: 4960, left: 0, top: 4985, width: 1366,
    image: 'assets/galeria/gallery.png',
  }],
};

// "A Banda no Tempo": an accordion of darkened year-photo bands. Each band shows a
// collapsed strip by default; clicking swaps to the enlarged photo and pushes content
// below down. Skip the geometry year-text + rules in this region (baked into images).
const TIMELINE = {
  banda: {
    x:106, w:1154, startTop:2710, bandH:150, skipFrom:2705, skipTo:4365,
    years:[
      {y:'1902',big:484},{y:'1920',big:448},{y:'1935',big:448},{y:'1948',big:430},
      {y:'1955',big:430},{y:'1966',big:430},{y:'1980',big:430},{y:'1988',big:430},
      {y:'1998',big:430},{y:'2010',big:430},{y:'2017',big:430},
    ],
  },
};

// Banner data: render the title as live HTML (fixed font-size) over a cover
// background image, so the title never scales with window width.
const BANNERINFO = JSON.parse(fs.readFileSync(path.join(ROOT,'_scrape','bannerinfo.json'),'utf8'));
const UNDERLINES = JSON.parse(fs.readFileSync(path.join(ROOT,'_scrape','underlines.json'),'utf8'));
function bannerHtml(slug, anchor){
  const info = BANNERINFO[slug] || {};
  const ul = (UNDERLINES[slug]||{}).underline;
  const H = anchor - 56;                       // banner height below the 56px header
  const titleTop = (info.titleY||140) - 56;
  const bg = info.bgFile
    ? `<div class="banner-bg" style="inset:0;background-image:url('${info.bgFile}');background-position:${info.bgPos||'50% 50%'}"></div><div class="banner-overlay"></div>` : '';
  const rule = ul
    ? `<div class="banner-rule" style="top:${ul.y}px;width:${ul.w}px;height:${Math.min(4,ul.h)||3}px"></div>` : '';
  const ff = (info.tFf||"'Oswald'").replace(/"/g,"'");
  const title = `<h1 class="banner-title" style="top:${titleTop}px;font-size:${info.tFs};color:${info.tColor};font-family:${ff};font-weight:${info.tWeight};text-transform:${info.tTransform};letter-spacing:${info.tLs};line-height:${info.tLh}">${esc(info.title||TITLES[slug])}</h1>`;
  return `<section class="page-banner" style="height:${H}px">${bg}${rule}${title}</section>`;
}

// ===== MOBILE dual-render =====
// The desktop canvas is reconstructed from desktop geometry (_scrape/layout). The original
// reflows to a different layout on mobile, so we reconstruct that separately from mobile geometry
// captured at 390px (_scrape/mlayout). Each element is placed at its exact original mobile
// coordinate — same fidelity approach as desktop — instead of CSS-reflowing the desktop canvas.
const MLAY = path.join(ROOT, '_scrape', 'mlayout');
const hasMlay = (slug) => fs.existsSync(path.join(MLAY, `${slug}.json`));
function mtext(e){
  let t = esc(e.text);
  if(e.href) t = `<a href="${e.href}" target="_blank" rel="noopener" style="color:inherit;text-decoration:inherit">${t}</a>`;
  return t;
}
function buildMobile(slug){
  const m = JSON.parse(fs.readFileSync(path.join(MLAY, `${slug}.json`),'utf8'));
  const dimgs = JSON.parse(fs.readFileSync(path.join(LAY, `${slug}.json`),'utf8')).els.filter(e=>e.t==='img').map(e=>e.file);
  const info = BANNERINFO[slug] || {};
  const bgs = (m.bgs||[]).slice().sort((a,b)=>a.y-b.y);
  const bannerBg = bgs.find(b=>b.y<12 && b.w>=300 && b.h>=120);
  const bannerH = Math.round(bannerBg ? bannerBg.h : 314);
  const otherBgs = bgs.filter(b=>b!==bannerBg);
  const parts = [];
  // banner: local cover image with the original's exact mobile crop (size/position) + dark overlay
  const bgFile = info.bgFile;
  const bsize = (bannerBg && bannerBg.bsize) || 'cover';
  const bpos = (bannerBg && bannerBg.bpos) || info.bgPos || '50% 50%';
  parts.push(`<div class="m-banner" style="left:0;top:0;width:390px;height:${bannerH}px;${bgFile?`background-image:url('${bgFile}');background-size:${bsize};background-position:${bpos};`:''}"><span class="m-ov"></span></div>`);
  // decade/timeline band background strips (banda) -> local timeline images by order.
  // data-* attrs let the mobile script swap each strip for the enlarged photo on tap
  // (same "click the date to see the photo" behaviour as desktop).
  const tlYears = ((TIMELINE[slug]||{}).years||[]).map(y=>y.y);
  let ti=0;
  for(const b of otherBgs){
    const yr = tlYears[ti++];
    if(yr) parts.push(`<img class="m-band" src="assets/timeline/sm_${yr}.png" alt="${yr}" data-year="${yr}" data-sm="assets/timeline/sm_${yr}.png" data-big="assets/timeline/big_${yr}.png" data-smh="${b.h}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;cursor:pointer">`);
    else parts.push(`<div class="m-band" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:url('${b.url}') center/cover"></div>`);
  }
  // content elements at their exact mobile coordinates
  const collaps = COLLAPSIBLES[slug] || [];
  let imgIdx = 0; let titleEl = null;
  for(const e of m.els.slice().sort((a,b)=>a.y-b.y)){
    if(e.t==='img'){
      if(e.y < bannerH && e.w < 80 && e.h < 80) continue;        // header crest — our header draws its own
      const soc = /facebook|instagram|youtube/i.exec(e.src||'');
      if(soc || (e.w<=34 && e.h<=34)){
        if(soc){ const n=soc[0].toLowerCase(); parts.push(`<a class="m-soc" href="${SOCIAL[n]||'#'}" target="_blank" rel="noopener" aria-label="${n}" style="left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px"><img src="assets/${n}.png" alt="${n}"></a>`); }
        continue;
      }
      const file = dimgs[imgIdx++] || e.src;
      parts.push(`<img class="m-img" src="${file}" alt="${esc(e.alt||'')}" style="left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px">`);
    } else if(e.t==='iframe'){
      const src = (e.src||'').startsWith('http') ? e.src : '';
      if(src) parts.push(`<iframe class="m-if" src="${esc(src)}" loading="lazy" frameborder="0" allowfullscreen style="left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;border:0"></iframe>`);
    } else if(e.t==='text'){
      const t = (e.text||'').trim();
      if(!t) continue;
      if(/^(Skip to main content|Skip to navigation|Cookie Policy|Reject|Accept)$/i.test(t)) continue;
      if(/uses cookies from Google/i.test(t)) continue;
      // Collapsible section heading (e.g. banda Maestro, historia Galeria): the mobile scrape
      // only captured the collapsed title, so emit a tappable header + the hidden content the
      // original reveals on click. The mobile script reflows everything below on expand.
      const col = collaps.find(c=>c.header===t);
      if(col){
        const cff = (e.ff||"'Oswald'").replace(/"/g,"'");
        const hsty = `left:${e.x}px;top:${e.y}px;width:${Math.ceil(e.w)+1}px;font-family:${cff};font-size:${e.fs};font-weight:${e.fw};color:${e.col};line-height:${e.lh};text-transform:${e.tt};text-align:${e.ta};cursor:pointer`;
        parts.push(`<div class="m-txt m-collap-header" data-for="m-${col.id}" style="${hsty}">${mtext(e)} <span class="m-chev">&#9662;</span></div>`);
        const cy = Math.round(e.y + (parseFloat(e.h)||parseFloat(e.lh)||40) + 8);
        const body = col.paras ? col.paras.map(p=>`<p style="margin:0 0 12px">${esc(p)}</p>`).join('')
                               : (col.image ? `<img src="${col.image}" alt="" style="width:100%;height:auto;display:block">` : '');
        parts.push(`<div id="m-${col.id}" class="m-collap-content" style="display:none;left:27px;top:${cy}px;width:337px;font-family:'Open Sans',sans-serif;font-size:14px;line-height:1.5;color:rgb(46,61,76)">${body}</div>`);
        continue;
      }
      const isTitle = e.y < bannerH && parseFloat(e.fs) >= 28;
      if(isTitle && !titleEl) titleEl = e;
      const ff = (e.ff||"'Open Sans'").replace(/"/g,"'");
      // White text below the banner is never plain body copy — it sits on a coloured surface that
      // Google Sites paints as a section background (not captured). Wide => full-width red band
      // heading (e.g. actividades); narrow => red rounded button (e.g. documentos report buttons).
      const cm = (e.col||'').match(/(\d+),\s*(\d+),\s*(\d+)/);
      const white = cm && +cm[1]>235 && +cm[2]>235 && +cm[3]>235;
      if(white && !isTitle){
        if(e.w >= 600){
          parts.push(`<div class="m-bandhead" style="left:0;top:${Math.round(e.y-18)}px;width:390px;height:${Math.round(e.h+36)}px;font-family:${ff};font-size:${e.fs};text-transform:${e.tt}">${mtext(e)}</div>`);
        } else {
          parts.push(`<div class="m-btn" style="left:${Math.round(e.x)}px;top:${Math.round(e.y-9)}px;width:${Math.round(e.w)}px;height:${Math.round(e.h+18)}px;font-family:${ff};font-size:${e.fs};text-transform:${e.tt}">${mtext(e)}</div>`);
        }
        continue;
      }
      // URL links render in Google's link blue + underline (the scrape mis-captures their colour)
      const isUrl = e.href && /^https?:\/\//.test((e.text||'').trim());
      const col = isUrl ? 'rgb(17,85,204)' : e.col;
      const td = isUrl ? 'underline' : (e.td||'none');
      const sty = `left:${e.x}px;top:${e.y}px;width:${Math.ceil(e.w)+1}px;font-family:${ff};font-size:${e.fs};font-weight:${e.fw};font-style:${e.fsi};color:${col};line-height:${e.lh};letter-spacing:${e.ls};text-transform:${e.tt};text-align:${e.ta};text-decoration:${td}`;
      parts.push(`<div class="m-txt${isTitle?' m-title':''}" style="${sty}">${mtext(e)}</div>`);
    }
  }
  // red underline beneath the banner title (original keeps one)
  const ul = (UNDERLINES[slug]||{}).underline;
  if(titleEl){
    const uw = Math.min(250, Math.round(titleEl.w*0.9));
    const uy = Math.round(titleEl.y + titleEl.h + 10);
    parts.push(`<div class="m-rule" style="left:${Math.round(titleEl.x)}px;top:${uy}px;width:${uw}px;height:5px"></div>`);
  }
  return `<div class="m-canvas" style="height:${m.pageH}px">\n${parts.join('\n')}\n</div>`;
}

function header(active){
  const items = NAV.map(n=>{
    const cls = 'nav-item'+(n.key===active?' active':'')+(n.sub?' has-sub':'');
    const caret = n.sub?' <span class="caret">&#9662;</span>':'';
    let h = `<div class="nav-cell"><a href="${n.file}" class="${cls}">${n.label}${caret}</a>`;
    if(n.sub) h += `<div class="dropdown">`+n.sub.map(s=>`<a href="${s[1]}">${s[0]}</a>`).join('')+`</div>`;
    return h+`</div>`;
  }).join('');
  return `<header class="site-header"><div class="header-inner">
  <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
  <a class="brand" href="index.html"><img src="assets/crest.png" alt="AIRFA" class="brand-logo"><span class="brand-title">AIRFA - DESDE 1895</span></a>
  <nav class="main-nav">${items}</nav>
  <button class="nav-search" aria-label="Pesquisar"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.49 4.49 0 019.5 14z"/></svg></button>
</div></header>`;
}
const COOKIE = `<div class="cookie-box" id="cookieBox"><p>This site uses cookies from Google to deliver its services and to analyze traffic. Information about your use of this site is shared with Google. By using this site, you agree to its use of cookies. <a href="#" class="cookie-learn">Cookie Policy</a></p><div class="cookie-actions"><button class="cookie-ok" onclick="document.getElementById('cookieBox').style.display='none'">REJECT</button><button class="cookie-ok" onclick="document.getElementById('cookieBox').style.display='none'">ACCEPT</button></div></div>`;

function styleStr(e){
  const s = [];
  // font-family comes back like `"Open Sans", sans-serif` — the double quotes
  // would prematurely close the HTML style="" attribute, so normalise to single quotes.
  if(e.ff) s.push(`font-family:${e.ff.replace(/"/g,"'")}`);
  // emit the original size as a custom property so the mobile stylesheet can scale every
  // text element up uniformly (Google Sites enlarges body copy on mobile) without touching
  // the pixel-exact desktop layout, where font-size simply resolves to var(--fs).
  if(e.fs) s.push(`--fs:${e.fs};font-size:var(--fs)`);
  if(e.fw) s.push(`font-weight:${e.fw}`);
  if(e.fsi && e.fsi!=='normal') s.push(`font-style:${e.fsi}`);
  if(e.col) s.push(`color:${e.col}`);
  if(e.lh && e.lh!=='normal') s.push(`line-height:${e.lh}`);
  if(e.ls && e.ls!=='normal') s.push(`letter-spacing:${e.ls}`);
  if(e.tt && e.tt!=='none') s.push(`text-transform:${e.tt}`);
  if(e.ta) s.push(`text-align:${e.ta}`);
  if(e.td && e.td!=='none') s.push(`text-decoration:${e.td}`);
  return s.join(';');
}

function textHtml(e){
  let t = esc(e.text);
  if(e.links && e.links.length){
    for(const l of e.links){
      if(!l.text) continue; const safe=esc(l.text);
      if(t.includes(safe)) t = t.replace(safe, `<a href="${l.href}" target="_blank" rel="noopener">${safe}</a>`);
    }
  }
  if(e.href) t = `<a href="${e.href}" target="_blank" rel="noopener" style="color:inherit;text-decoration:inherit">${t}</a>`;
  return t;
}

function buildPage(slug){
  const d = JSON.parse(fs.readFileSync(path.join(LAY, `${slug}.json`),'utf8'));
  const ANCHOR = ANCHOR_BY_SLUG[slug] || ANCHOR_DEFAULT;
  const cols = COLLAPSIBLES[slug] || [];
  const tl = TIMELINE[slug];
  const inTL = (y) => tl && y>tl.skipFrom && y<tl.skipTo;
  const H = d.pageBottom - ANCHOR;
  const parts = [];

  // background rects (skip overlays / near-white / near-gray)
  for(const r of d.rects){
    const m = r.bg.match(/(\d+), (\d+), (\d+)/); if(!m) continue;
    const [rr,gg,bb]=[+m[1],+m[2],+m[3]];
    if(rr>235&&gg>235&&bb>235) continue;           // gray/white overlays
    if(r.h>=800) continue;                          // full-viewport overlays
    parts.push(`<div class="abs deco" style="left:${r.x}px;top:${r.y-ANCHOR}px;width:${r.w}px;height:${r.h}px;background:${r.bg};z-index:0"></div>`);
  }

  // thin divider lines (coral section separators / heading rules)
  for(const ln of (d.lines||[])){
    if(inTL(ln.y)) continue;
    parts.push(`<div class="abs deco" style="left:${ln.x}px;top:${ln.y-ANCHOR}px;width:${ln.w}px;height:${ln.h}px;background:${ln.bg};z-index:1"></div>`);
  }
  // "A Banda no Tempo" accordion: clickable year bands (collapsed strip -> enlarged photo)
  if(tl){
    tl.years.forEach((yr,i)=>{
      const btop = tl.startTop + i*tl.bandH - ANCHOR;
      parts.push(`<img class="abs tl-band" src="assets/timeline/sm_${yr.y}.png" alt="${yr.y}" data-year="${yr.y}" data-sm="assets/timeline/sm_${yr.y}.png" data-big="assets/timeline/big_${yr.y}.png" data-bigh="${yr.big}" style="left:${tl.x}px;top:${btop}px;width:${tl.w}px;height:${tl.bandH}px;object-fit:cover;cursor:pointer;z-index:1">`);
    });
  }

  // dedupe overlapping duplicate text (Google Sites renders headings twice);
  // drop the narrower of any same-text pair at the same y. Track original refs.
  const texts = d.els.filter(e=>e.t==='text');
  const fsz = e => parseFloat(e.fs)||0;
  const drop = new Set();
  for(let i=0;i<texts.length;i++){
    if(drop.has(texts[i])) continue;
    for(let j=0;j<i;j++){
      if(drop.has(texts[j])) continue;
      const a=texts[i], b=texts[j];
      // only a duplicate if same text, near-same y, AND overlapping horizontally
      // (same text in different columns at the same y is NOT a duplicate)
      const xover = a.x < b.x+b.w && b.x < a.x+a.w;
      if(a.text.trim()===b.text.trim() && Math.abs(a.y-b.y)<32 && xover){
        // different size => larger is the hidden artifact; same size => keep wider box
        if(Math.abs(fsz(a)-fsz(b))>1) drop.add(fsz(a)>fsz(b) ? a : b);
        else drop.add(a.w>b.w ? b : a);
        break;
      }
    }
  }

  // Some paragraphs were scraped as two overlapping nodes at the same (x,y): a narrow 1-line
  // head + the wider remaining lines. Rendered at the same top they overlap into garbled text
  // (e.g. cine-teatro, historia). Merge the head into the wide block so the paragraph flows.
  for(let i=0;i<texts.length;i++){
    for(let j=0;j<texts.length;j++){
      if(i===j || drop.has(texts[i]) || drop.has(texts[j])) continue;
      const a=texts[i], b=texts[j];
      if(Math.abs(a.x-b.x)<6 && Math.abs(a.y-b.y)<6 && a.text.trim()!==b.text.trim()
         && a.h<32 && a.w<b.w && b.h>=a.h*1.5){
        b.text = a.text.trim() + ' ' + b.text;     // a is the head line, prepend it to b
        if(a.links && a.links.length) b.links = [...a.links, ...(b.links||[])];
        drop.add(a);
      }
    }
  }

  // Hino: the anthem verses are song lyrics — replicate the page but not the lyrics.
  const HINO_LYRICS = slug==='hino' ? [2660, 3185] : null;

  for(const e of d.els){
    const top = e.y - ANCHOR;
    if(HINO_LYRICS && e.t==='text' && e.y>=HINO_LYRICS[0] && e.y<=HINO_LYRICS[1]) continue;
    if(inTL(e.y)) continue;   // covered by the timeline strips image
    if(e.t==='img'){
      let img = `<img src="${e.file}" alt="" style="width:${e.w}px;height:${e.h}px">`;
      if(e.href) img = `<a href="${e.href}" target="_blank" rel="noopener">${img}</a>`;
      // wide content images (member photos, room/seating photos) become full-width on mobile to
      // match the original; small inline thumbnails keep their size.
      const wide = e.w >= 240 ? ' img-wide' : '';
      parts.push(`<div class="abs${wide}" style="left:${e.x}px;top:${top}px;width:${e.w}px;height:${e.h}px;z-index:1">${img}</div>`);
    } else if(e.t==='social'){
      const url = SOCIAL[e.name]||'#';
      parts.push(`<a class="abs foot-soc" href="${url}" target="_blank" rel="noopener" style="left:${e.x}px;top:${top}px;width:${e.w}px;height:${e.h}px;z-index:2" aria-label="${e.name}"><img src="assets/${e.name}.png" alt="${e.name}"></a>`);
    } else if(e.t==='iframe'){
      const src = (e.src||'').startsWith('http')?e.src:'';
      if(src) parts.push(`<iframe class="abs" src="${esc(src)}" loading="lazy" frameborder="0" style="left:${e.x}px;top:${top}px;width:${e.w}px;height:${e.h}px;border:0;z-index:1" allowfullscreen></iframe>`);
    } else if(e.t==='text'){
      if(drop.has(e)) continue;
      // coloured background box behind light-coloured text (buttons / section bands)
      if(e.box){
        const bt = e.box.y - ANCHOR;
        const rad = e.box.radius && e.box.radius!=='0px' ? `;border-radius:${e.box.radius}` : '';
        parts.push(`<div class="abs deco" style="left:${e.box.x}px;top:${bt}px;width:${e.box.w}px;height:${e.box.h}px;background:${e.box.bg}${rad};z-index:1"></div>`);
      }
      // Full-width red SECTION BAND: white heading text on its own red strip (e.g. actividades
      // "MODALIDADES DESPORTIVAS"/"ACTIVIDADES CULTURAIS"). Google Sites paints the strip as a
      // section background, not a captured rect, so synthesise it: full width, 32px padding
      // (measured). The deco strip renders the band on desktop (hidden on mobile); the .band-head
      // class lets the mobile stylesheet give the text its own red background.
      const cm = (e.col||'').match(/(\d+),\s*(\d+),\s*(\d+)/);
      const isBandHead = !e.box && e.w >= 600 && cm && +cm[1] > 235 && +cm[2] > 235 && +cm[3] > 235;
      if(isBandHead){
        parts.push(`<div class="abs deco" style="left:0;top:${(e.y-32)-ANCHOR}px;width:${d.pageWidth||1366}px;height:${e.h+64}px;background:var(--red);z-index:0"></div>`);
      }
      const lh = parseFloat(e.lh) || (parseFloat(e.fs)*1.2) || 24;
      const oneLine = e.h <= lh*1.6;                 // single-line text must not wrap
      const ws = oneLine ? ';white-space:nowrap' : '';
      const wrule = oneLine ? `min-width:${e.w}px` : `width:${e.w}px`;
      const col = cols.find(c=>c.header===e.text.trim());
      if(col){
        parts.push(`<div class="abs txt collap-header" data-collap="${col.id}" data-delta="${col.delta}" data-thr="${col.shiftAbove-ANCHOR}" style="left:${e.x}px;top:${top}px;min-width:${e.w}px;white-space:nowrap;${styleStr(e)};z-index:4;cursor:pointer">${textHtml(e)}</div>`+
          `<div class="abs collap-chevron" data-for="${col.id}" style="left:1190px;top:${top}px;z-index:4">&#9662;</div>`);
      } else {
        const band = e.box ? `;--band:${e.box.bg}` : '';
        const cls = 'abs txt' + (e.box?' on-band':'') + (isBandHead?' band-head':'');
        parts.push(`<div class="${cls}" style="left:${e.x}px;top:${top}px;${wrule}${ws};${styleStr(e)}${band};z-index:2">${textHtml(e)}</div>`);
      }
    }
  }

  // hidden collapsible content blocks
  for(const col of cols){
    const ctop = col.top - ANCHOR;
    const inner = col.image
      ? `<img src="${col.image}" alt="" style="display:block;width:${col.width}px;height:auto">`
      : col.paras.map(p=>`<p style="margin:0 0 14px">${esc(p)}</p>`).join('');
    parts.push(`<div id="${col.id}" class="abs collap-content" style="display:none;left:${col.left}px;top:${ctop}px;width:${col.width}px;${col.style||''};z-index:2">${inner}</div>`);
  }

  if(HINO_LYRICS){
    // Anthem verses — one <p> per stanza, italic and centred like the original.
    const top = 2676 - ANCHOR;
    const letra = HINO_ESTROFES
      .map(st=>`<p style="margin:0 0 14px;font-style:italic">${st.map(esc).join('<br>')}</p>`)
      .join('');
    parts.push(`<div class="abs txt" id="hino-letra" style="left:114px;top:${top}px;width:1138px;text-align:center;font-family:'Open Sans',sans-serif;font-size:18px;line-height:1.6;color:#2e3d4c;z-index:2">${letra}</div>`);
  }

  // Sort into visual reading order. DOM order is irrelevant to the absolutely-positioned
  // desktop view (stacking is governed by z-index), but on mobile the canvas reflows to a
  // single static column in DOM order. A naive (top,left) sort breaks multi-column CARD
  // grids (e.g. órgãos sociais: photo row / name row / role row) into all-photos -> all-names
  // -> all-roles. So cluster narrow elements into per-column cards first, then order whole
  // cards by (top,left), keeping each card's photo/name/role together.
  const order = parts.map((html, i) => {
    const n = (k) => { const m = html.match(new RegExp('(?:^|[;\\s"])' + k + ':(-?\\d+(?:\\.\\d+)?)px')); return m ? parseFloat(m[1]) : null; };
    const left = n('left') ?? 0, top = n('top') ?? 0;
    let width = n('width'); if (width == null) width = n('min-width'); if (width == null) width = 0;
    const height = n('height') ?? 0;
    const deco = /class="[^"]*\bdeco\b/.test(html) || /\bcollap-content\b/.test(html);
    return { html, left, top, width, height, deco, i };
  });
  const WIDE = 620;                              // px: full-width flow anchors (headings, paragraphs, bands)
  const narrow = order.filter(o => !o.deco && o.width > 0 && o.width < WIDE);
  // cluster column centres (1-D gap clustering). Define columns only from reliable wide
  // anchors (photos/names, width>=180); short role-text fragments are noisy and would chain
  // adjacent columns together, so they don't define columns — they're assigned to the nearest.
  const anchors = narrow.filter(o => o.width >= 180);
  const centres = (anchors.length >= 2 ? anchors : narrow).map(o => o.left + o.width / 2).sort((a, b) => a - b);
  const clusters = centres.length ? [[centres[0]]] : [];
  for (let k = 1; k < centres.length; k++) { if (centres[k] - centres[k - 1] > 120) clusters.push([]); clusters[clusters.length - 1].push(centres[k]); }
  const colC = clusters.map(cl => cl.reduce((a, b) => a + b, 0) / cl.length);
  const colOf = (o) => { const c = o.left + o.width / 2; let best = 0, bd = 1e9; colC.forEach((cc, k) => { const d = Math.abs(cc - c); if (d < bd) { bd = d; best = k; } }); return best; };
  // A card grid is a set of photo tiles (square-ish, width&height>=180) in >=2 columns.
  // Detect row bands from the photo tops, then group every narrow element into its (row,col)
  // CARD and emit the grid row-major (photo, name, role together), instead of all-photos first.
  const photos = narrow.filter(o => o.width >= 180 && o.height >= 180);
  const isGrid = colC.length >= 2 && photos.length >= 2;
  const units = [];                              // {top,left,items:[...]} sorted/expanded later
  if (isGrid) {
    const ptops = photos.map(o => o.top).sort((a, b) => a - b);
    const rowTops = [ptops[0]];
    for (let k = 1; k < ptops.length; k++) if (ptops[k] - rowTops[rowTops.length - 1] > 150) rowTops.push(ptops[k]);
    const rowOf = (o) => { let r = 0; for (let k = 0; k < rowTops.length; k++) { if (rowTops[k] <= o.top + 30) r = k; else break; } return r; };
    const cards = {};
    for (const o of narrow) { const r = rowOf(o), c = colOf(o), key = r + '|' + c; (cards[key] ||= { top: rowTops[r], left: colC[c], items: [] }).items.push(o); }
    for (const key in cards) units.push(cards[key]);
    for (const o of order) if (o.deco || o.width === 0 || o.width >= WIDE) units.push({ top: o.top, left: o.left, items: [o] });
  } else {
    for (const o of order) units.push({ top: o.top, left: o.left, items: [o] });
  }
  units.sort((a, b) => { const t = a.top - b.top; return Math.abs(t) > 6 ? t : a.left - b.left; });
  parts.length = 0;
  for (const u of units) { u.items.sort((a, b) => { const t = a.top - b.top; return Math.abs(t) > 6 ? t : a.left - b.left; }); for (const it of u.items) parts.push(it.html); }
  const canvas = `<div class="page-canvas" style="height:${H}px">\n${parts.join('\n')}\n</div>`;
  const banner = bannerHtml(slug, ANCHOR);
  const title = `${TITLES[slug]||''} | Academia Almadense (AIRFA)`;
  const desc = DESCRIPTIONS[slug] || `${ORG_NAME} (AIRFA / Academia Almadense), em Almada desde 1895.`;
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
${seoHead(slug, title, desc)}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96.png">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${CSS_VER}">
</head>
<body class="subpage page-${slug}">
${header(d.active||slugActive(slug))}
<div class="desktop-view">
${banner}
${canvas}
</div>
${hasMlay(slug) ? `<div class="mobile-view">\n${buildMobile(slug)}\n</div>` : ''}
${NAV_JS}
${(cols.length || tl) ? COLLAP_JS : ''}
${hasMlay(slug) ? MOBILE_JS : ''}
</body>
</html>
`;
}
const NAV_JS = `<script>
(function(){
  var tog=document.querySelector('.nav-toggle'), hdr=document.querySelector('.site-header');
  if(tog){ tog.addEventListener('click',function(){ var o=hdr.classList.toggle('nav-open'); tog.setAttribute('aria-expanded',o); }); }
})();
</script>`;
const COLLAP_JS = `<script>
(function(){
  var canvas=document.querySelector('.page-canvas'); if(!canvas) return;
  var els=[].slice.call(canvas.children);
  els.forEach(function(el){ el.setAttribute('data-baset', parseFloat(el.style.top)||0); });
  var h0=parseFloat(canvas.style.height); var active={};
  function recompute(){
    var extra=0; for(var k in active) extra+=active[k]?active[k].delta:0;
    els.forEach(function(el){
      if(el.classList.contains('collap-content')) return;
      var base=parseFloat(el.getAttribute('data-baset')), off=0;
      for(var k in active){ var a=active[k]; if(a && a.thr<base) off+=a.delta; }
      el.style.top=(base+off)+'px';
    });
    canvas.style.height=(h0+extra)+'px';
  }
  function toggle(id){
    var h=document.querySelector('.collap-header[data-collap="'+id+'"]');
    var content=document.getElementById(id);
    var exp=content.style.display==='none';
    content.style.display=exp?'block':'none';
    h.classList.toggle('expanded',exp);
    // position content accounting for collapsibles above it
    var off=0; for(var k in active){ var a=active[k]; if(a && a.thr<parseFloat(content.getAttribute('data-baset'))) off+=a.delta; }
    active[id]=exp?{thr:+h.dataset.thr,delta:+h.dataset.delta}:null;
    content.style.top=(parseFloat(content.getAttribute('data-baset'))+off)+'px';
    recompute();
  }
  function toggleBand(band){
    var exp=!band.classList.contains('open');
    band.classList.toggle('open',exp);
    var bigh=+band.dataset.bigh;
    band.src=exp?band.dataset.big:band.dataset.sm;
    band.style.height=(exp?bigh:150)+'px';
    active['band'+band.dataset.year]=exp?{thr:parseFloat(band.getAttribute('data-baset')),delta:bigh-150}:null;
    recompute();
  }
  document.querySelectorAll('.collap-header').forEach(function(h){ h.addEventListener('click',function(){toggle(h.dataset.collap);}); });
  document.querySelectorAll('.collap-chevron').forEach(function(c){ c.style.cursor='pointer'; c.addEventListener('click',function(){toggle(c.dataset.for);}); });
  document.querySelectorAll('.tl-band').forEach(function(b){ b.addEventListener('click',function(){toggleBand(b);}); });
})();
</script>`;
// Mobile reconstruction is a fixed 390px canvas. (1) Scale it to the actual viewport width so the
// banner fills edge-to-edge under the (full-width) header on every phone — otherwise wider phones
// show white margins and the white burger/search icons land on that white gap and vanish.
// (2) Wire the collapsibles (Maestro) and timeline year strips that the static scrape left inert,
// reflowing everything below on expand (mirrors the desktop COLLAP_JS, in unscaled design px).
const MOBILE_JS = `<script>
(function(){
  var mv=document.querySelector('.mobile-view'); if(!mv) return;
  var mc=mv.querySelector('.m-canvas'); if(!mc) return;
  function fit(){
    var vw=document.documentElement.clientWidth;   // not innerWidth: the 390px canvas can inflate that
    if(vw<=768){
      var s=vw/390;
      mc.style.transform='scale('+s+')'; mc.style.transformOrigin='top left'; mc.style.margin='0';
      mv.style.height=(parseFloat(mc.style.height)*s)+'px'; mv.style.overflow='hidden';
    } else {
      mc.style.transform=''; mc.style.transformOrigin=''; mc.style.margin='';
      mv.style.height=''; mv.style.overflow='';
    }
  }
  var kids=[].slice.call(mc.children);
  kids.forEach(function(el){ el.setAttribute('data-mb', parseFloat(el.style.top)||0); });
  var h0=parseFloat(mc.style.height); var active={};
  function recompute(){
    var extra=0; for(var k in active){ if(active[k]) extra+=active[k].delta; }
    kids.forEach(function(el){
      if(el.classList.contains('m-collap-content')) return;
      var base=parseFloat(el.getAttribute('data-mb')), off=0;
      for(var k in active){ var a=active[k]; if(a && a.thr<base) off+=a.delta; }
      el.style.top=(base+off)+'px';
    });
    mc.style.height=(h0+extra)+'px'; fit();
  }
  mc.querySelectorAll('.m-collap-header').forEach(function(h){
    h.addEventListener('click',function(){
      var c=document.getElementById(h.dataset.for); if(!c) return;
      var exp=(c.style.display==='none'||c.style.display==='');
      c.style.display=exp?'block':'none';
      // place the revealed content below the heading's MEASURED bottom (it may wrap to >1 line)
      var hbase=parseFloat(h.getAttribute('data-mb')), off=0;
      for(var k in active){ var a=active[k]; if(a && a.thr<hbase) off+=a.delta; }
      var ctop=hbase + h.offsetHeight + 8;
      c.style.top=(ctop+off)+'px';
      active[h.dataset.for]=exp?{thr:ctop-1,delta:c.offsetHeight+24}:null;
      h.classList.toggle('open',exp);
      recompute();
    });
  });
  var bands=[].slice.call(mc.querySelectorAll('.m-band[data-big]'));
  function toggleBand(b){
    var exp=!b.classList.contains('open'); var smh=parseFloat(b.dataset.smh);
    if(exp){ b.src=b.dataset.big; b.style.height='auto'; } else { b.src=b.dataset.sm; b.style.height=smh+'px'; }
    b.classList.toggle('open',exp);
    active['b'+b.dataset.year]=exp?{thr:parseFloat(b.getAttribute('data-mb')),delta:b.offsetHeight-smh}:null;
    recompute();
  }
  bands.forEach(function(b){ b.addEventListener('click',function(){toggleBand(b);}); });
  // year labels (sometimes split into fragments) sit on top of a strip — tap them too
  mc.querySelectorAll('.m-btn').forEach(function(btn){
    var c=parseFloat(btn.getAttribute('data-mb'))+(parseFloat(btn.style.height)||0)/2, hit=null;
    bands.forEach(function(b){ var bt=parseFloat(b.getAttribute('data-mb')), bh=parseFloat(b.dataset.smh); if(c>=bt-6 && c<=bt+bh+6) hit=b; });
    if(hit){ btn.style.cursor='pointer'; btn.addEventListener('click',function(e){e.stopPropagation();toggleBand(hit);}); }
  });
  fit();
  window.addEventListener('resize',fit);
})();
</script>`;
function slugActive(slug){
  if(['historia','estatutos','orgaos-sociais','hino','biblioteca','documentos','a-academia'].includes(slug)) return 'a-academia';
  if(['cine-teatro','sala-de-cinema','salas-de-espetaculo'].includes(slug)) return 'salas';
  if(slug==='actividades') return 'actividades';
  if(slug==='banda') return 'banda';
  if(slug==='contactos') return 'contactos';
  return '';
}

const slugs = Object.keys(TITLES);
for(const slug of slugs){
  fs.writeFileSync(path.join(ROOT, `${slug}.html`), buildPage(slug));
  console.log('wrote', `${slug}.html`);
}
console.log('done');
