# Auditoria pixel-a-pixel — réplica vs. site original

**Data:** 2026-06-21
**Âmbito:** as 14 páginas (homepage + 13 subpáginas), largura 1366px, comparadas com o
site ao vivo `https://sites.google.com/view/airfa-desde-1895-copia`.
**Método:** screenshot *full-page* de cada página (réplica local vs. original, com scroll
para forçar lazy-load), diff por bandas de 360px, e **inspeção visual com zoom a resolução
total de cada candidato**. Cada diferença abaixo foi confirmada manualmente em crop ampliado.
A análise correu em paralelo (6 subagentes, um grupo de páginas cada) e todas as conclusões
foram re-verificadas à mão (vários falsos-positivos dos agentes foram descartados — ver fim).

> Nota: esta auditoria reflete o estado **depois** das correções de banners já aplicadas hoje
> (homepage + geometria dos banners das subpáginas). Lista apenas o que **ainda** difere.

## Resumo

| # | Severidade | Diferença | Páginas afetadas |
|---|-----------|-----------|------------------|
| 1 | **Alta** | Citação "Mesmo após o sucesso…" sobreposta/ilegível (overflow `nowrap`) | historia |
| 2 | **Média** | Régua/sublinhado coral fino demais (~4–5px vs ~12px) | **todas** (hero + 13 banners) |
| 3 | **Média** | Logótipo do cabeçalho "AIRFA - DESDE 1895" demasiado bold | todas (header) |
| 4 | **Média** | Banner ~104px curto demais; foto mais "zoom-in" | documentos |
| 5 | Baixa | Falta o ponto final em "…estatutos aqui**.**" | estatutos |
| 6 | Baixa | Falta os dois-pontos no fim da legenda de 2020 ("…2020**:**") | hino |
| 7 | Baixa | Lista "Descontos" sem marcadores (bullets) | actividades |
| 8 | Baixa | Indicador do colapsável: triângulo cheio ▼ vs. chevron de contorno ⌄ | banda, historia |

Páginas **sem diferenças** além das sistémicas (#2, #3): a-academia, orgaos-sociais,
biblioteca, contactos, cine-teatro, sala-de-cinema, salas-de-espetaculo.

---

## Diferenças sistémicas (afetam várias páginas)

### 2. Régua/sublinhado coral fino demais — [Média]
- **Original:** a barra coral por baixo do título do banner é uma faixa **espessa (~12px)**.
- **Nossa cópia:** linha fina — `.banner-rule` tem `height:4px` (subpáginas) e
  `.hero-title::before` tem `height:5px` (homepage).
- **Medido:** a-academia/sala-de-cinema/cine-teatro → local y244–247 (4px) vs original
  y244–255 (12px), mesmo topo. Homepage → local 5px vs original ~12px.
- **Confirmado em:** `_scrape/zz_coral.png` (a barra do original é visivelmente ~3× mais grossa).
- **Correção sugerida:** `.banner-rule{height:12px}` e `.hero-title::before{height:12px}`
  (ajustar o `top` do sublinhado do hero para manter o espaço título→linha).

### 3. Logótipo do cabeçalho demasiado bold — [Média]
- **Original:** "AIRFA - DESDE 1895" em peso regular/leve, traços finos, ligeiramente maior/largo.
- **Nossa cópia:** peso pesado/bold (`.brand-title{font-weight:600}`), traços grossos.
- **Confirmado em:** `_scrape/zz_logo_local.png` vs `_scrape/zz_logo_orig.png`.
- **Correção sugerida:** baixar `.brand-title` para `font-weight:300/400` e confirmar tamanho/spacing.

### 8. Indicador dos colapsáveis (triângulo vs. chevron) — [Baixa]
- **Original:** chevron fino de contorno "⌄" (ícone Material *expand_more*).
- **Nossa cópia:** triângulo cheio pequeno "▼"/"▾".
- **Afeta:** banda (cabeçalho "MAESTRO FRANCISCO PINTO") e historia ("Galeria de Presidentes").
- **Confirmado em:** `_scrape/zz_maestro.png`.
- **Correção sugerida:** substituir o glifo `▾` por um chevron de contorno (SVG/Material icon).

---

## Diferenças por página

### Homepage (index.html)
- **[Média]** Logótipo do cabeçalho — ver sistémica #3.
- **[Média]** Sublinhado coral do hero fino — ver sistémica #2.
- Tudo o resto coincide: nav + pill "Início", banner (enquadramento da foto, título
  "ACADEMIA ALMADENSE", ícones sociais), secções "131 ANOS…", "PRÓXIMAS ACTIVIDADES…",
  carrossel, bloco "ATIVIDADES 2025/26" e rodapé.

### História (historia.html)
- **[Alta]** Citação **sobreposta/ilegível**. Os blocos em `white-space:nowrap`
  `top:1661px` ("Mesmo após o sucesso do 1º aniversário houve ainda quem dissesse: …Mas o
  segundo é que não!... -") e `top:1687px` ("há muito anos atrás.") renderizam como uma
  linha única que transborda e se sobrepõe ao texto seguinte — fica ilegível. **No original
  este texto quebra em várias linhas, limpo.** Confirmado em `_scrape/cmp_historia_band05_y1800.png`.
  - **Correção sugerida:** remover `white-space:nowrap` e juntar os fragmentos num único
    parágrafo com largura fixa (ex. `width:1138px`), como foi feito no cine-teatro.
- **[Baixa]** Chevron da "Galeria de Presidentes" — ver sistémica #8.
- (A citação fundadora "Às nove horas da noite…" quebra com métrica de fonte ligeiramente
  diferente, mas o texto é idêntico e ambas quebram limpas — não é defeito.)

### Estatutos (estatutos.html)
- **[Baixa]** "Pode consultar os estatutos aqui" — **falta o ponto final** a seguir ao link
  ("…aqui." no original). Confirmado em `_scrape/zz_estatutos.png`.

### Hino (hino.html)
- **[Baixa]** Legenda do vídeo de 2020: "…27 de Março de 2020" — **falta os dois-pontos**
  finais (":"). A legenda de 2012 tem-nos; a de 2020 do original também. A legenda está
  partida em vários `<div>` absolutos (`top:2982px`) e nenhum fragmento inclui o ":".
  Confirmado em código (`hino.html`) e `_scrape/cmp_hino_*`.
- Letra do hino, pautas e restantes legendas coincidem.

### Documentos (documentos.html)
- **[Média]** Banner **~104px curto demais**: a foto/banner termina em y896 na cópia vs
  y1000 no original (altura da secção 840px vs ~944px no original); a foto fica também um
  pouco mais "zoom-in" (palco maior, menos plateia). O título "DOCUMENTOS" e a régua coral
  estão na posição correta (y489/y574 em ambos), mas todo o conteúdo abaixo do banner fica
  ~104px acima do original. Confirmado em `_scrape/cmp_documentos_band01_y360.png`.
  - **Correção sugerida:** aumentar a `height` da secção do banner (~944px) e ajustar a
    `height` do `.banner-bg` em conformidade.

### Actividades (actividades.html)
- **[Baixa]** Lista "Descontos (não acumuláveis…)" — os itens ("Pagamento anual…", "Inscrito
  em 2 ou mais…", etc.) aparecem **sem marcadores**; no original têm bullets (•). Confirmado
  em `_scrape/zz_actividades.png`.
- Os dois banners vermelhos (MODALIDADES DESPORTIVAS / ACTIVIDADES CULTURAIS), tabelas de
  horários e restante conteúdo coincidem.

### Banda (banda.html)
- **[Baixa]** Chevron do colapsável do maestro — ver sistémica #8.
- Resto (intro, fotos, barras coral de secção, "A BANDA NO TEMPO" e todas as faixas da
  timeline por ano) coincide.

### Páginas sem diferenças próprias
- **A Academia, Órgãos Sociais, Biblioteca, Contactos, Cine-Teatro, Sala de Cinema,
  Salas de Espetáculo** — todo o conteúdo (texto, fotos, tabelas, mapas, rodapés, nav)
  coincide. Só partilham as diferenças sistémicas #2 (régua coral) e #3 (logótipo).

---

## Ignorado (não são diferenças reais)
- **Caixa de cookies** do Google — overlay transiente, presente em ambos em estados diferentes.
- **Carrossel da homepage** — mostra slides diferentes consoante o timing da auto-rotação.
- **Recompressão JPEG / brilho** das fotografias — ruído de compressão, não de layout.
- Deslocamentos **sub-pixel (<2px)** e diferença de altura total < ~5px.

## Falsos-positivos descartados na verificação
- "Régua coral ausente nos banners" (1ª passagem dos agentes) — **falso**: a régua existe
  (só é mais fina do que a do original — ver #2).
- "Ícones sociais do rodapé mais pequenos/claros" — **falso** após zoom: coincidem.
- "Overlay escuro do hero diferente" — não confirmado em revisão cuidada; é brilho da foto.
