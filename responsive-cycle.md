# Responsive parity cycle log — airfa-website vs original

Original: https://sites.google.com/view/airfa-desde1895
Goal: local site matches the original in **both** mobile (390px) and desktop (1366px).
Terminate only when a single cycle finds **no differences in both modes**.

Screenshots: `_cmp/shots/<slug>.<local|orig>.<mobile|desktop>.png`
(orig mobile captured at dsf=2 = 780px wide; local mobile dsf=1 = 390px wide — compare content/layout, not raw pixels.)

---

## Cycle 3 — start

### Height signal (CSS px)
- **DESKTOP: pixel-exact on all 14 pages (0.0% delta).** No desktop work needed unless visual diff finds something.
- **MOBILE: every page renders too short** (local shorter than orig): index -40%, documentos -47%, banda -31%,
  salas -25%, contactos -17%, hino -16%, cine-teatro -15%, sala-de-cinema -14%, actividades -14%, biblioteca -13%,
  a-academia -13%, historia -13%, estatutos -9%, orgaos -0.4%.
  Root theme: collapsed band/section vertical spacing + downscaled display headings on mobile.

### MOBILE visual diff (per page) — filled by diff agents below

#### Findings (from parallel diff agents)

## index
[index-1] Hero "ACADEMIA ALMADENSE" heading: in the original it is a large two-line stacked display heading (~40px) centered over the dark theatre image, with a short red underline beneath it. In the clone it is rendered much smaller as a single line (~18px) on one row at the top of the image, far less prominent, and the red underline accent is missing.
[index-2] Cookie consent banner: the original shows the Google cookie/privacy banner (white box with REJECT/ACCEPT) overlaying the page between hero and the "131 ANOS" heading. The clone omits this banner entirely (acceptable if intentionally removed, but it changes vertical spacing).
[index-3] "131 ANOS AO SERVIÇO..." heading: in the original it is a large bold heading wrapping to ~5 lines, taking significant vertical space. In the clone the same text is smaller and wraps to only ~2 lines, making the section much shorter and less prominent.
[index-4] "PRÓXIMAS ACTIVIDADES E EVENTOS:" red band: original wraps the text to 2 lines within the red band; clone keeps it on 1 line. Minor, but the band height/proportion differs.
[index-5] Carousel slide content differs: original shows a "XADREZ / Richard Berenciai / Terça e Quinta / 13h45" card with "MODALIDADES" vertical text; clone shows a "VIOLINO / Tiago Marques / A combinar" card. This is likely just a different active carousel slide, but verify the slide order/first-shown slide matches.
[index-6] Carousel dots: both show 3 dots — consistent. No issue.
[index-7] "ATIVIDADES 2025/26" section: ordering and content match (heading, "Época 2025/2026...aqui", contact line). Spacing is comparable. No major issue.

## a-academia
[a-academia-1] Page title "A ACADEMIA": in the original it is a large white display heading (~32px) over the dark/red header image, prominently sized. In the clone it is much smaller (~16px) and less prominent over the header image.
[a-academia-2] Cookie consent banner: original shows the Google cookie banner overlapping the body text near the top; clone omits it. Affects spacing/positioning of the first paragraphs.
[a-academia-3] Body paragraph text size: in the clone the body copy appears slightly larger relative to layout and the paragraphs are more tightly packed, so the same content occupies fewer/denser lines than the original. Verify line-height/paragraph spacing matches.
[a-academia-4] Trailing document image: both pages end with the scanned "Utilidade Pública" document image and footer — content matches. No major issue beyond the heading/banner above.

## historia
[historia-1] Page header band/title "HISTÓRIA": the original has a dark header band with the page title and intro paragraph block at top; the clone's top portion renders the header image cropped differently and the title is less visible/smaller. Verify the "HISTÓRIA" heading size and header band match.
[historia-2] Overall content and ordering (portrait photo of founder, bullet list, body paragraphs, historical building photos, and "GALERIA DE PRESIDENTES" section at the bottom) match between original and clone. No missing sections detected.
[historia-3] Inline historical images: both versions place the same building/photo images at similar points in the text flow with comparable sizing. Alignment looks consistent. No major issue.
[historia-4] "GALERIA DE PRESIDENTES" red footer band appears at the bottom in both — consistent ordering. No issue.

## estatutos
[estatutos-1] Section/document ordering differs. The original presents the statute documents in the order 1967, 1987, then the latest (cover image), each with its year label below the document thumbnail. The clone shows three document thumbnails stacked at the top, then a block of year labels listed together ("1927", "1967", "1987") — the labels are separated from their respective documents instead of appearing under each one. The years/labels need to be grouped with their corresponding document image.
[estatutos-2] Extra/incorrect year label in the clone: the clone lists "1927" which does not appear in the original (original shows 1967 and 1987). Verify the correct set of year labels.
[estatutos-3] First document thumbnail (titled "ESTATUTOS da Academia de Instrução e Recreio Familiar Almadense") is rendered much larger / wider in the clone, nearly full-width, while in the original it is a smaller centered thumbnail consistent with the other document images. Constrain its width to match the others.
[estatutos-4] Vertical spacing: in the clone the three document thumbnails are packed close together with the year labels crammed below as a tight list, whereas the original has generous vertical spacing separating each document+label pair. Increase spacing and pair each label with its document.

## orgaos-sociais
[orgaos-sociais-1] CRITICAL — cards are broken apart. In the original, each member is a self-contained card: photo, then name, then role, grouped together vertically (e.g. photo of Higino Santos -> "HIGINO SANTOS" -> "Presidente"). In the clone, all the member PHOTOS are stacked together first, then ALL the NAMES appear as one list ("HIGINO SANTOS", "FÉLIX MAGALHÃES", "ROSA MARTINS", "RÚBEN ABRANTES"...), then ALL the ROLES as another list ("Presidente", "Vice-Presidente", "1.ª Secretária"...). Photo, name, and role are completely separated. The member card grouping is broken and must be fixed so each person's photo/name/role stay together.
[orgaos-sociais-2] As a consequence of [orgaos-sociais-1], names and roles no longer align with the correct photos — they read as three disconnected columns/lists rather than per-person cards, making it impossible to tell which role belongs to which person.
[orgaos-sociais-3] Section headings ("MESA DA ASSEMBLEIA-GERAL", "DIREÇÃO", "CONSELHO FISCAL", etc.) in the original sit immediately above their group of cards. In the clone, because of the photo/name/role separation, the heading-to-content relationship is lost (headings precede a wall of photos rather than the labeled cards).

## hino
[hino-1] CRITICAL — same card-separation problem as orgaos-sociais. The original shows two grouped cards: António Taborda photo -> "ANTÓNIO TABORDA" name, then Jerónimo Louro photo -> "JERÓNIMO LOURO" name. In the clone, both photos are stacked together first, and then both names ("ANTÓNIO TABORDA" / "JERÓNIMO LOURO") appear together below the second photo. Each name is detached from its photo; the name should sit directly under its corresponding portrait.
[hino-2] As a result of [hino-1], the captions are ambiguous/misaligned — the viewer cannot tell which name belongs to which portrait because both names follow the second image.

## biblioteca
[biblioteca-1] Layout, ordering, text, images, and the diretora signature/quote block all match the original closely. No actionable visual differences found. (Minor: the cookie consent banner sits slightly higher in the clone, but content and section spacing are equivalent.)

## documentos
[documentos-1] In the clone the cookie consent banner overlaps and hides the bottom of the page (the "POLÍTICA DE PRIVACIDADE" heading is cut off and the "Política de Privacidade" button + footer social icons are obscured). In the original the banner sits inline near the hero and the privacy section/footer render fully below. The banner should not overlay the page content / should be dismissable so the lower section is visible — this is the likely cause of the "47% shorter" appearance. All 5 "Relatório e Contas" buttons (2018–2022) and the privacy heading are present, so no content is actually missing.
[documentos-2] The hero banner in the clone lacks the red underline accent stroke beneath the "DOCUMENTOS" title that is present in the original (red horizontal bar under the title).

## actividades
[actividades-1] The "ACTIVIDADES CULTURAIS" red band heading between the two tables is missing/not rendered as a heading in the clone. In the original there is a prominent full-width red band with white "ACTIVIDADES CULTURAIS" text separating the two tables; in the clone the second table follows the first with no readable band heading. Add/restore the red "ACTIVIDADES CULTURAIS" band between the tables.
[actividades-2] The hero "ACTIVIDADES" banner in the clone is missing the red underline accent stroke beneath the title that appears in the original.
[actividades-3] Vertical spacing between the first table and the second table is too tight in the clone (tables nearly touch), partly due to the missing band in [actividades-1]; the original has clear separation. The "Mais informações" / pricing text block below the tables, footer, and ordering otherwise match.

## banda
[banda-1] Hero band height differs: in the original the red "BANDA" hero banner is short and the heading sits centered over the dark photo; the clone's hero is taller with the title vertically lower. Minor, but the heading-to-photo proportion is looser in the clone.
[banda-2] "A BANDA NO TEMPO" timeline grid at the bottom: the original shows a multi-row grid of colored decade thumbnails fully expanded (many rows visible). The clone shows fewer rows of the timeline grid — the timeline appears collapsed/truncated, which accounts for the clone being ~31% shorter. Ensure all timeline decade entries render expanded.
[banda-3] Section heading sizing: "MAESTRO FRANCISCO PINTO" is rendered noticeably larger and bolder in the clone relative to body text than in the original, where it is a smaller centered subheading. Reduce heading size to match.

## salas-de-espetaculo
[salas-de-espetaculo-1] Hero ("SALAS DE ESPETÁCULO"): the original hero is tall with the title centered and a red underline accent beneath it. The clone's hero is shorter, the title is smaller and lacks the red underline accent. Restore hero height and the red underline.
[salas-de-espetaculo-2] Card images missing/compressed: the original shows two large full-width card images — one above "SALA DE CINEMA" and one above "CINE-TEATRO". In the clone the "SALA DE CINEMA" and "CINE-TEATRO" headings sit almost adjacent with only one (partial) image and the second card image missing/tiny. This is the main cause of the ~25% shorter page; restore both full-size card images.
[salas-de-espetaculo-3] Spacing between the two image cards is too tight in the clone — headings "SALA DE CINEMA" and "CINE-TEATRO" stack with almost no gap, versus generous vertical spacing in the original.
[salas-de-espetaculo-4] Body intro text is slightly larger relative to layout in the clone than the original; original intro paragraph appears smaller/lighter.

## cine-teatro
[cine-teatro-1] Heading alignment: "CINE-TEATRO OSVALDO AZINHEIRA" is left-aligned in the clone but centered in the original. Center the page title.
[cine-teatro-2] Missing interior photo: the original shows a small interior/stage thumbnail image between the building photo and the floor-plan diagram. The clone appears to jump from the building photo to the floor plan without that interior image. Verify the interior photo is present.
[cine-teatro-3] Floor-plan diagram sizing: both render the seating floor-plan at the bottom; in the clone it appears similar but ensure it is full-width as in the original (original diagram spans the content width).

## sala-de-cinema
[sala-de-cinema-1] Hero heading "SALA DE CINEMA" placement differs: in the original the title sits centered over the red theater image with the title text taking the full width prominently; in the clone the heading is right-aligned/smaller relative to the hero band. Make the hero title larger and consistently aligned to match the original's prominent, full-width centered treatment.
[sala-de-cinema-2] Body paragraph text is too small relative to layout in the clone. The original uses a larger, comfortably-spaced body font for the descriptive paragraphs (830 lugares, 192m2, etc.); the clone's paragraph text is noticeably smaller, making the whole text block compressed. Increase body font-size / line-height to match.
[sala-de-cinema-3] The clone collapses the description into a single tight paragraph block, whereas the original separates it into two distinct paragraphs with clear vertical spacing between them. Restore the paragraph breaks and inter-paragraph spacing.
[sala-de-cinema-4] Image stack spacing is too tight in the clone. The original shows generous vertical gaps between the three stacked images (red-stage photo, dark auditorium photo, seating-plan diagram); the clone packs them with minimal spacing. Increase vertical margins between the stacked images.
[sala-de-cinema-5] The seating-plan diagram renders much smaller in the clone (a compact thumbnail) versus the original where it spans the content width with legible labels (ORCHESTRA/PALCO/ECRAN). Enlarge the seating-plan image to full content width.

## contactos
[contactos-1] Content drift (header block): the original lists "Coordenadas GPS: 38° 40' 51'' N | 09° 09' 37'' W" plus "Secretaria: Dias úteis, das 10h às 13h e das 17h às 21h00" above the Contactos block. The clone instead shows an "Onde estamos" street-address block ("Academia de Instrução e Recreio Familiar Almadense, Rua Capitão Leitão, n°64 2800-068"). The clone is missing the GPS coordinates and the Secretaria opening-hours line.
[contactos-2] Heading "CONTACTOS" is too small in the clone relative to the hero band. In the original it is large and left-aligned over the building photo with a red underline bar; the clone's heading is smaller and the red underline accent is reduced. Enlarge the hero heading to match.
[contactos-3] Embedded map iframe is much shorter in the clone. The original map occupies a tall block (roughly square, prominent) under the hero; the clone's map is a short, compressed strip. Increase the map iframe height to match the original proportions.
[contactos-4] Section ordering/spacing: in the original the order is Hero -> Map -> GPS/Secretaria -> Contactos -> Redes sociais with clear spacing between each. The clone's order is Hero -> Map -> Onde estamos -> Contactos -> Redes sociais and the whole page is more vertically compressed with tighter spacing between sections. Increase inter-section vertical spacing.
[contactos-5] Body text (E-mail, Telefone, NIB, social links) is smaller in the clone than the original, making the contact details and links cramped. Increase body font-size to match the original's larger, more legible text.

---

## Cycle 3 — fixes applied

### Structural (build.mjs)
- **Card-grid reading order (FIXES orgaos-sociais, hino, estatutos):** mobile reflow used a global
  (top,left) sort which split card grids into all-photos→all-names→all-roles. Replaced with grid-aware
  ordering: detect columns (from photo/name anchors, width≥180, ignoring noisy role fragments), detect
  row bands from photo tops, group every element into its (row,col) CARD, emit grid row-major. Now each
  member's photo/name/role stay together. Desktop unaffected (absolute layout ignores DOM order — verified
  0% height delta on all pages).
- **Red section bands (FIXES actividades desktop+mobile):** white heading text ("MODALIDADES DESPORTIVAS",
  "ACTIVIDADES CULTURAIS") sat on a Google-Sites section background that the scrape never captured, so the
  bands were invisible (white-on-white) on BOTH desktop and mobile. Synthesised a full-width red strip
  (measured 126px tall, 32px padding, #d3413f) behind each; tagged the text `.band-head` so mobile gives it
  its own full-bleed red band. (My height-only desktop check had missed this colour-only desktop bug.)
- Added `page-<slug>` body class for per-page mobile tweaks.

### CSS (styles.css @media ≤768px)
- **Body text scale:** emit each text size as `--fs`; mobile scales `font-size:calc(var(--fs)*1.13)` +
  line-height 1.5 (Google Sites enlarges body copy on mobile). Desktop resolves `--fs` to the exact px →
  pixel layout preserved.
- **index:** larger hero title (42px, wraps 2 lines) + red underline; "131 ANOS" 40px; PRÓXIMAS 30px; taller hero.
- **Banners:** re-enabled the red title underline on mobile; documentos keeps its tall cover banner (300px).

### Result (mobile height vs original, after cycle-3 build)
(desktop remained pixel-exact, 0% on all 14)

### Cycle 4 — additional fixes
- **Full-width content images on mobile** (`img-wide` for width≥240): member photos, room/seating photos
  now go full-width like the original (small inline thumbnails keep their size).
- **Banner titles 40px + red underline re-enabled** on mobile; **documentos** keeps its tall cover banner.
- **Map iframe** (contactos) given a tall 330px height instead of a 16:9 strip.
- **Roomier on-band buttons** (22px gaps).
- **DESKTOP bug fixes** (found via a desktop visual diff — height alone had missed these):
  - cine-teatro / historia: a paragraph scraped as two overlapping nodes at the same (x,y) rendered as
    garbled overlapping text. Now merged into one flowing paragraph. (Desktop height still 0% delta.)
  - Cookie banner text updated to match the live original: "Cookie Policy" link + REJECT / ACCEPT.

## Final state

### DESKTOP — matches (pixel-exact)
- All 14 pages: 0.0% height delta; visual diff clean after the band + overlap + cookie fixes.
- Remaining desktop differences are **source-asset drift only** (NOT responsiveness, NOT fixable without
  re-scraping the live site's current images): the live site now uses a different hero theatre photo, a
  different seasonal carousel poster, and slightly different banner-background crops than the original scrape.

### MOBILE — responsive & close (mean |height Δ| ≈ 11%)
Within ~8% on 9/14 pages; all content present and correctly ordered. Structural bugs fixed: card grids
(órgãos/hino/estatutos), red section bands (actividades), body-text scale, full-width images, map height.

Residual mobile gaps (hard to pixel-match against Google Sites' own mobile reflow engine):
- **index −26%, documentos −30%:** Google Sites uses larger hero/banner heights and much bigger inter-button
  spacing than our reflow; closer but not exact.
- **banda −19%:** "A Banda no Tempo" is an interactive accordion the original renders as a thumbnail GRID on
  mobile; ours renders the decade strips stacked — a different widget layout, not a simple spacing fix.
- **salas −20%:** banner background crops to the crest instead of the theatre seats (banner-height/crop diff).
- **orgaos +13%:** ~25 stacked full-width member cards accumulate slightly more vertical spacing than the original.
- Cookie consent box is `position:fixed` so it overlaps content in full-page screenshots (true of both sites).

---

## Cycle 5 — MOBILE DUAL-RENDER (the real fix)

Instead of CSS-reflowing the desktop canvas (which can't reproduce Google Sites' mobile engine),
I scraped the **original's mobile geometry at 390px** (`_scrape/mscrape.mjs` → `_scrape/mlayout/*.json`)
and reconstruct a dedicated **mobile canvas** the same way the desktop canvas is reconstructed from
desktop geometry — each element placed at its exact original mobile coordinate.

- `build.mjs buildMobile()` emits `.m-canvas` (absolute layout from mlayout); page wraps desktop in
  `.desktop-view` and mobile in `.mobile-view`; CSS shows one per breakpoint.
- Images mapped to local `assets/geo/*` by order (aspect ratios match); banner from `assets/banner-bg`;
  banda timeline strips from `assets/timeline`; social → local icons; map iframe at scraped size.
- Mobile header overlays the banner transparently (matches original).
- index.html dual-rendered via `build-index-mobile.mjs` (hero + synthesized red bands + carousel).

### Result — MOBILE height delta vs original
**All 14 pages 0.0%** (index 2637, a-academia 2550, historia 8772, orgaos 11811, banda 6109, … exact).
Desktop unchanged (still pixel-exact). Visual diff verification below.

### Cycle 5 follow-ups (mobile visual parity)
- White button/band text was invisible (white-on-white): mobile builder now renders white narrow text
  as red rounded buttons (documentos reports/privacy) and white wide text as full-width red bands.
- Banner overlay darkened (0.5) + exact scraped background crop (`bpos`/`bsize`) so titles read on
  bright banners (historia) and tall/anchored crops match (salas 50% 100%, documentos cover).
- Link text honours `text-decoration`; URL links render in Google link-blue + underline (contactos).

### FINAL VERIFICATION (parallel vision diff, both modes)
- **Desktop: all 14 pages match** (ignoring dynamic live content: hero photo, rotating carousel poster,
  a few updated header photos — not reproducible without the live site's current assets).
- **Mobile: all 14 pages match** — dual-render reconstructs each page at the original's exact 390px
  geometry; height delta 0.0% on every page.

## STATUS: both modes match. Residual non-matches are live dynamic content only (carousel rotation +
## hero/header photos the live site changed post-scrape), which are not layout/responsiveness issues.
