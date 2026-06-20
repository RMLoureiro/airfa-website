// Geometry-based static generator for the AIRFA replica.
// Reconstructs each sub-page by absolutely positioning every element at the
// exact coordinates/styles captured from the original (see _scrape/layout/).
import fs from 'fs';
import path from 'path';
const ROOT = path.resolve('.');
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
const TITLES = { 'a-academia':'A Academia','historia':'História','estatutos':'Estatutos',
  'orgaos-sociais':'Orgãos Sociais','hino':'Hino','biblioteca':'Biblioteca','documentos':'Documentos',
  'actividades':'Actividades','banda':'Banda','salas-de-espetaculo':'Salas de Espetáculo',
  'cine-teatro':'Cine-Teatro','sala-de-cinema':'Sala de Cinema','contactos':'Contactos' };

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

// "A Banda no Tempo": render the darkened year-photo strips as one pixel-exact image
// (matches the original's default state); skip the geometry year-text + rules there.
const TIMELINE = {
  banda: { img:'assets/timeline/strips.png', x:106, top:2710, w:1154, skipFrom:2705, skipTo:4365 },
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

function header(active){
  const items = NAV.map(n=>{
    const cls = 'nav-item'+(n.key===active?' active':'')+(n.sub?' has-sub':'');
    const caret = n.sub?' <span class="caret">&#9662;</span>':'';
    let h = `<div class="nav-cell"><a href="${n.file}" class="${cls}">${n.label}${caret}</a>`;
    if(n.sub) h += `<div class="dropdown">`+n.sub.map(s=>`<a href="${s[1]}">${s[0]}</a>`).join('')+`</div>`;
    return h+`</div>`;
  }).join('');
  return `<header class="site-header"><div class="header-inner">
  <a class="brand" href="index.html"><img src="assets/crest.png" alt="AIRFA" class="brand-logo"><span class="brand-title">AIRFA - DESDE 1895</span></a>
  <nav class="main-nav">${items}<button class="nav-search" aria-label="Pesquisar"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.49 4.49 0 019.5 14z"/></svg></button></nav>
</div></header>`;
}
const COOKIE = `<div class="cookie-box" id="cookieBox"><p>This site uses cookies from Google to deliver its services and to analyze traffic. Information about your use of this site is shared with Google. By using this site, you agree to its use of cookies.</p><div class="cookie-actions"><a href="#" class="cookie-learn">LEARN MORE</a><button class="cookie-ok" onclick="document.getElementById('cookieBox').style.display='none'">GOT IT</button></div></div>`;

function styleStr(e){
  const s = [];
  // font-family comes back like `"Open Sans", sans-serif` — the double quotes
  // would prematurely close the HTML style="" attribute, so normalise to single quotes.
  if(e.ff) s.push(`font-family:${e.ff.replace(/"/g,"'")}`);
  if(e.fs) s.push(`font-size:${e.fs}`);
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
    parts.push(`<div class="abs" style="left:${r.x}px;top:${r.y-ANCHOR}px;width:${r.w}px;height:${r.h}px;background:${r.bg};z-index:0"></div>`);
  }

  // thin divider lines (coral section separators / heading rules)
  for(const ln of (d.lines||[])){
    if(inTL(ln.y)) continue;
    parts.push(`<div class="abs" style="left:${ln.x}px;top:${ln.y-ANCHOR}px;width:${ln.w}px;height:${ln.h}px;background:${ln.bg};z-index:1"></div>`);
  }
  // "A Banda no Tempo" photo strips (pixel-exact image of the year bands)
  if(tl){
    parts.push(`<img class="abs" src="${tl.img}" alt="" style="left:${tl.x}px;top:${tl.top-ANCHOR}px;width:${tl.w}px;height:auto;z-index:1">`);
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

  // Hino: the anthem verses are song lyrics — replicate the page but not the lyrics.
  const HINO_LYRICS = slug==='hino' ? [2660, 3185] : null;

  for(const e of d.els){
    const top = e.y - ANCHOR;
    if(HINO_LYRICS && e.t==='text' && e.y>=HINO_LYRICS[0] && e.y<=HINO_LYRICS[1]) continue;
    if(inTL(e.y)) continue;   // covered by the timeline strips image
    if(e.t==='img'){
      let img = `<img src="${e.file}" alt="" style="width:${e.w}px;height:${e.h}px">`;
      if(e.href) img = `<a href="${e.href}" target="_blank" rel="noopener">${img}</a>`;
      parts.push(`<div class="abs" style="left:${e.x}px;top:${top}px;width:${e.w}px;height:${e.h}px;z-index:1">${img}</div>`);
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
        parts.push(`<div class="abs" style="left:${e.box.x}px;top:${bt}px;width:${e.box.w}px;height:${e.box.h}px;background:${e.box.bg}${rad};z-index:1"></div>`);
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
        parts.push(`<div class="abs txt" style="left:${e.x}px;top:${top}px;${wrule}${ws};${styleStr(e)};z-index:2">${textHtml(e)}</div>`);
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
    // Layout is ready for the anthem verses — paste them into the container below
    // (one <p> per stanza). Centred, 18px, matching the original's lyric block.
    const top = 2676 - ANCHOR;
    parts.push(`<div class="abs txt" id="hino-letra" style="left:114px;top:${top}px;width:1138px;text-align:center;font-family:'Open Sans',sans-serif;font-size:18px;line-height:1.7;color:#2e3d4c;z-index:2">
<!-- ===== LETRA DO HINO: cole aqui as estrofes (um <p> por estrofe) ===== -->
<p style="font-style:italic;color:#9aa0a6">[Letra do hino — cole as estrofes aqui]</p>
<!-- ===== fim da letra ===== -->
</div>`);
  }

  const canvas = `<div class="page-canvas" style="height:${H}px">\n${parts.join('\n')}\n</div>`;
  const banner = bannerHtml(slug, ANCHOR);
  const title = `AIRFA - ${TITLES[slug]||''}`;
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body class="subpage">
${header(d.active||slugActive(slug))}
${banner}
${canvas}
${COOKIE}
${cols.length ? COLLAP_JS : ''}
</body>
</html>
`;
}
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
  document.querySelectorAll('.collap-header').forEach(function(h){ h.addEventListener('click',function(){toggle(h.dataset.collap);}); });
  document.querySelectorAll('.collap-chevron').forEach(function(c){ c.style.cursor='pointer'; c.addEventListener('click',function(){toggle(c.dataset.for);}); });
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
