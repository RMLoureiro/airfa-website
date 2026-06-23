// One-off: build index.html's mobile-view (.m-canvas) from the scraped 390px geometry
// (_scrape/mlayout/index.json) + measured red-band positions, and inject the dual-render
// wrappers into index.html. Re-runnable (idempotent).
import fs from 'fs';
const m = JSON.parse(fs.readFileSync('_scrape/mlayout/index.json', 'utf8'));
const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SOC = { facebook: 'https://www.facebook.com/AcademiaAlmadense', instagram: 'https://instagram.com/academia.almadense/', youtube: 'https://youtube.com/user/AcademiaAlmadense' };
const txt = (re) => m.els.find(e => e.t === 'text' && re.test(e.text || ''));
const T = (e, extra = '') => e ? `<div class="m-txt" style="left:${Math.round(e.x)}px;top:${Math.round(e.y)}px;width:${Math.ceil(e.w) + 1}px;font-family:${(e.ff || "'Oswald'").replace(/"/g, "'")};font-size:${e.fs};font-weight:${e.fw};color:${e.col};line-height:${e.lh};letter-spacing:${e.ls};text-transform:${e.tt};text-align:${e.ta};${extra}">${esc(e.text)}</div>` : '';

const title = txt(/ACADEMIA ALMADENSE/i);
const h131 = txt(/131 ANOS/i);
const prox = txt(/Próximas actividades/i);
const atvH = txt(/Atividades 2025/i);
const epoca = txt(/Época 2025/i);
const mais = txt(/Mais informações contacte/i);
const foot = txt(/Academia de Instrução/i);

const socRow = (y) => ['facebook', 'instagram', 'youtube'].map((n, i) =>
  `<a class="m-soc" href="${SOC[n]}" target="_blank" rel="noopener" aria-label="${n}" style="left:${137 + i * 44}px;top:${y}px;width:28px;height:28px"><img src="assets/${n}.png" alt="${n}"></a>`).join('\n');

// link inside the época line ("aqui")
const epocaHtml = epoca ? `<div class="m-txt" style="left:${Math.round(epoca.x)}px;top:${Math.round(epoca.y)}px;width:${Math.ceil(epoca.w) + 1}px;font-family:'Open Sans',sans-serif;font-size:${epoca.fs};color:${epoca.col};line-height:${epoca.lh};text-align:left">Época 2025/2026 |Consulte as actividades que temos para si, <a href="#" style="text-decoration:underline;color:inherit">aqui</a>!</div>` : '';

const canvas = `<div class="m-canvas" style="height:${m.pageH}px">
<!-- hero -->
<div class="m-hero" style="left:0;top:0;width:390px;height:844px;background:url('assets/hero-theater.jpg') center/cover"><span class="m-ov"></span></div>
${T(title, 'z-index:3;color:#fff')}
<div class="m-rule" style="left:70px;top:500px;width:250px;height:10px"></div>
${socRow(534)}
<!-- 131 -->
${T(h131, 'color:#1f1f1f')}
<!-- próximas red band -->
<div class="m-band-red" style="left:0;top:1233px;width:390px;height:152px"></div>
${T(prox, 'z-index:3;color:#fff')}
<!-- carousel -->
<div class="m-carousel" style="left:19px;top:1409px;width:352px;height:488px">
  <img class="m-slide active" src="assets/poster-prove.jpg" alt="">
  <img class="m-slide" src="assets/poster-violino.png" alt="">
  <img class="m-slide" src="assets/poster-xadrez.png" alt="">
</div>
<div class="m-dots" style="left:0;top:1925px;width:390px"><span class="m-dot active"></span><span class="m-dot"></span><span class="m-dot"></span></div>
<!-- atividades -->
<hr class="m-coral" style="left:27px;top:2030px;width:336px">
${T(atvH, 'color:#1f1f1f')}
${epocaHtml}
${T(mais, "font-family:'Open Sans',sans-serif;text-align:left")}
<!-- red spacer -->
<div class="m-band-red" style="left:0;top:2398px;width:390px;height:64px"></div>
<!-- footer -->
${socRow(2494)}
${T(foot, "font-family:'Open Sans',sans-serif;color:#212121;text-align:center")}
</div>`;

// inject into index.html: wrap hero..footer in .desktop-view, add .mobile-view after
let html = fs.readFileSync('index.html', 'utf8');
// remove any prior injection
html = html.replace(/<div class="desktop-view">\n?/,'').replace(/\n?<\/div><!--\/desktop-view-->/,'').replace(/<div class="mobile-view">[\s\S]*?<\/div><!--\/mobile-view-->\n?/,'');
const startMarker = '<!-- ===== HERO ===== -->';
const endMarker = '</footer>';
const si = html.indexOf(startMarker);
const ei = html.indexOf(endMarker) + endMarker.length;
const before = html.slice(0, si);
const middle = html.slice(si, ei);
const after = html.slice(ei);
html = before + '<div class="desktop-view">\n' + middle + '\n</div><!--/desktop-view-->\n<div class="mobile-view">\n' + canvas + '\n</div><!--/mobile-view-->' + after;
fs.writeFileSync('index.html', html);
console.log('injected index mobile-view; m-canvas height', m.pageH);
