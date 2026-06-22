# Auditoria pixel-a-pixel — réplica vs. site original

**Data:** 2026-06-22 (ronda fresca — **CONVERGÊNCIA CONFIRMADA**)
**Âmbito:** as 14 páginas (homepage + 13 subpáginas), 1366px, vs. o site ao vivo
`https://sites.google.com/view/airfa-desde-1895-copia`.

**Método:** screenshots *full-page* de ambos os lados (`_scrape/capboth.mjs`, com scroll de
lazy-load) → **diff exato pixel-a-pixel** (`_scrape/pxdiff.mjs`, pixelmatch, threshold 12%) →
**4 subagentes em paralelo** (grupos A–D) a percorrer cada banda de 360px com recortes
lado-a-lado etiquetados (`_scrape/banddiff.py`) → **re-verificação manual com zoom à resolução
máxima** de cada candidato em ambos os lados.

> **ESTADO: convergido.** Os 4 subagentes percorreram as 14 páginas banda-a-banda e, após
> zoom de confirmação, **não encontraram nenhuma diferença real de conteúdo / layout / tipografia
> por resolver**. Tudo o que o diff exato ainda acusa pertence às categorias "ignorar" (ver
> abaixo): recompressão JPEG das fotos, brilho dos banners com gradiente, o slide do carrossel da
> homepage (timing), o mapa Google embebido e a fonte da caixa de cookies.

## Resultado por página (diff exato pixel-a-pixel, 1366px)

| Página | totalDiff | Diferenças reais? | Resíduo (categoria "ignorar") |
|--------|-----------|-------------------|-------------------------------|
| home | 19.02% | Não | foto do hero + slide do carrossel (timing) |
| a-academia | 0.76% | Não | recompressão das fotos |
| historia | 1.17% | Não | recompressão das fotos |
| estatutos | 1.22% | Não | recompressão + caixa de cookies |
| orgaos-sociais | 0.60% | Não | recompressão (25 retratos) |
| hino | 1.32% | Não | banner com gradiente + partitura |
| biblioteca | 2.69% | Não | capas de livros (recompressão) |
| documentos | 1.09% | Não | banner |
| actividades | 6.58% | Não | banner + tabelas-imagem |
| banda | 9.17% | Não | foto de grupo + fotos da timeline |
| salas-de-espetaculo | 3.73% | Não | fotos / banner com gradiente |
| cine-teatro | 2.21% | Não | recompressão |
| sala-de-cinema | 1.71% | Não | banner com gradiente + fotos |
| contactos | 1.96% | Não | mapa Google embebido |

Alturas das páginas: 13/14 coincidem exatamente; `home` +5px e `documentos` +4px (ambos abaixo do
limiar de 5px — o desvio da home é o carrossel a mover-se durante a captura).

## Verificado e confirmado fiel (não são diferenças)
Os subagentes confirmaram, por zoom, que estes elementos coincidem com o original em todas as
páginas onde aparecem:
- **Cabeçalho / nav** — itens, pílula ativa, seta (caret) fora da pílula, espaçamento, peso da fonte.
- **Banners** — enquadramento/crop, título (texto, tamanho, posição, cor), régua coral, overlay.
- **Blocos de texto** — texto literal (incl. pontuação final), tamanho/peso/cor da fonte, itálico,
  alinhamento, quebras de linha, posição x/y; sem sobreposições nem transbordos.
- **Tabelas** (actividades) — cores das células, marcadores de dia, linhas de informação.
- **Listas** — marcadores (descontos).
- **Imagens / fotos** — presentes, com crop/posição corretos.
- **Widgets** — maestro (banda), galeria de presidentes (historia), timeline (banda).
- **Rodapé** — texto incl. o ano "2025" e os ícones sociais (círculos cinzentos).
- **Contactos** — morada, coordenadas GPS, NIB e URLs de redes sociais verificados verbatim.

## Residuais conhecidos (categoria "ignorar" — não corrigíveis sem perder fidelidade)
1. **Recompressão JPEG / brilho das fotografias** — fotos idênticas em conteúdo e posição; só
   diferem em ruído de recompressão e brilho.
2. **Banners com gradiente** (hino, sala-de-cinema) — o original escurece com um gradiente
   não-linear; um overlay plano iguala a média mas não o pixel exato.
3. **Foto do hero + carrossel da homepage** — slide diferente conforme o instante da captura
   (auto-rotação); responsável por quase todo o 19% de `home`.
4. **Mapa Google embebido** (contactos) e **texto da caixa de cookies** (Roboto real vs. fallback).
5. **Responsividade** — subpáginas ancoradas a 1366px (o original é responsivo); fora do âmbito.

## Reproduzir
```bash
python3 -m http.server 8765 --bind 127.0.0.1
node _scrape/capboth.mjs '' both              # captura local + original (14 páginas, 2 lados)
node _scrape/pxdiff.mjs <slug>                 # diff exato pixelmatch + contagem por banda
python3 _scrape/banddiff.py _scrape/v_<slug>_local.png _scrape/v_<slug>_orig.png _scrape/<pre> 360
```
(Requer `pixelmatch`, `pngjs`, `puppeteer-core` em `node_modules`; Chrome em
`/usr/bin/google-chrome-stable`; `python3` + PIL/numpy.)
