---
title: Midjourney / design-lab image catalog
description: All 471 stills pixel-sampled. 72 clusters with vision samples. Query JSON/CSV/full catalog. Desk SoT unchanged.
type: note
created: 2026-08-13
author: agent
tags:
  - note
  - midjourney
  - visual-sot
  - assembling-components
skill_chain_stage: theming
framework: nextjs
motion: composition-rhythm
---
# Midjourney / design-lab image catalog

**471/471** stills have a Pillow palette. **0** catalog rows missing. Path lists are not the catalog — this hub + the machine files are.

> **Images have been folderized** — each lives in `extractions/<slug>/` with `source.md` / `design.md` / `design-tokens.md` / `image-to-prompt.md`. This catalog links there. 18 files were never on disk and are marked **missing**.

Query files (every still, real hex):

- [stills-full-catalog.md](./stills-full-catalog.md) — per-cluster tables, every file
- [stills-pixel-sample.json](./stills-pixel-sample.json) — per-file dimensions + median/dominant/swatches
- [stills-pixel-sample.csv](./stills-pixel-sample.csv)
- [stills-pixel-sample.jsonl](./stills-pixel-sample.jsonl)
- [stills-cluster-summary.json](./stills-cluster-summary.json)
- [stills-vision-sample.json](./stills-vision-sample.json) — which frames were opened

Scripts: [sample-stills.py](./sample-stills.py) · [generate-stills-catalog.py](./generate-stills-catalog.py). Architecture: [AssemblingComponentsAllStills](../AssemblingComponentsAllStills.md).

## Counts

| Where | Stills | Notes |
| --- | --- | --- |
| Vault total | **471** | 443 png, 15 webp, 13 jpg. Plus **39 mp4** (out of scope). |
| Vault root (this collection) | 306 stills + 39 mp4 | `item_count: 345`. 301 `u7869492466_*` (262 png + 39 mp4) |
| `design/` | 160 | mock-ups 54, height/luma 30, dossier-art 20, ui-mockups 10 |
| `vision/` | 5 | storyboards 4 + interface gallery |

Pixel-sampled: **471**. Errors/corrupt/missing: **0**. Vision this pass: **92**. Prior pass: **20**. Unique vision frames: **112**. Clusters: **72**, all with ≥1 vision sample. Unprocessed: **0**.

## Tokens (unchanged)

Desk / product SoT from the prior 19 still stands. Pillow of all 471 did **not** retokenize `--du-*`.

| Token | Hex | Role |
| --- | --- | --- |
| desk base | `#0f181c` | live app ground |
| brass | `#b49c60` | `--color-primary` (chroma-scarce) |
| paper bone | `#e2dbc7` | archival plates |
| charcoal ink | `#1c1c1c` | report + document panel |
| classified red | `#aa5d4f` | stamp (sampled) |
| archival amber | `#d89024` | VL report swatch |

~148 stills have dominant near desk `#0f181c`. ~20 have chroma_peak near brass `#b49c60`. Chroma scarcity holds.

## Competing systems (do not overwrite desk SoT)

| System | Typical hex | Treat as |
| --- | --- | --- |
| Cosmic portals | spectral cyan/magenta/orange on `#000` | illustration |
| Face / pyramid | sickly emerald + orange | cinematic illustration |
| Mood collages | cream paper; Rive `#2554B5`; Seoul `#2b3da1`; forest `#2E5D3E` | photo mood, not chrome |
| Height / luma maps | `#000` / `#fff` | technical texture |
| Archive territory map | published SIGNAL AMBER `#E5A21A` vs token `#d89024`; CLASSIFIED RED `#B21F1F` vs `#aa5d4f` | close — leave tokens |
| Socorro mockup | burnt orange `#e67329` | case-file accent |
| Gateway process | teal → red evidence ladder | explainer, not brand primary |
| NASA 1978 dossier | magenta cancellation | decorative |

## Decorative / technical (catalogued, do not token from)

- `design/design-lab/textures/textures/monochrome/*` height/luma maps
- ~~cosmic-portals-*.png~~ — **missing** (all 10 never on disk)
- `design/design-lab/mood-references/*`
- phone ~~IMG_3458.JPG~~ / ~~IMG_3460.JPG~~ — **missing**
- Midjourney mp4 clips

## Clusters (72) — vision take + Pillow

Every cluster below has ≥1 opened frame. Remaining files in the cluster inherit the take; every file still has its own Pillow row in the full catalog.

| n | vis | cluster | take |
| --- | --- | --- | --- |
| 54 | 5 | dir:design/mock-ups | UUID/Generated/IMG/imgi plates: dark desk, vortex HUD, phone UI |
| 31 | 3 | mj:Prometheus Titan_a | Identity line drawings; hairline grid; dark + paper registers |
| 30 | 4 | dir:…/monochrome | Height/luma/speckle maps; near-black technical, not UI chrome |
| 24 | 2 | mj:6BrTXcbs5o8 | Line/geometry HUD variants; mixed dark field + paper |
| 20 | 5 | dir:…/dossier-art | Manila folders, Socorro/Roswell covers, noir files |
| 18 | 1 | mj:sjmQUspjdoU | Classical bust + starfield + construction overlay |
| 16 | 2 | mj:sZhUawvy0ak geome | Daedalus/line geometry; DEDALUS bar; teal construction |
| 12 | 2 | mj:case_file dossier | Person-of-interest covers; archival stamps |
| 10 | 9 | dir:…/ui-mockups | Product desk SoT (v2/v3, theory, living canvas, ledger) |
| 10 | 3 | root:cosmic-portals | Spectral illustration; not product palette |
| 9 | 1 | mj:ie059vi5HP8 | Dark sphere / forest / VOLLEKS; blue–amber split |
| 8 | 2 | dir:…/textures | Nebula scanline, dot-grid, paper tooth siblings |
| 8 | 1 | mj:Crumpled journal | Dot-grid engineering journal, crumpled paper |
| 8 | 1 | mj:dot-grid Pap | Journal page, paper tooth |
| 8 | 1 | mj:dot-grid hand | Hand-annotated journal |
| 8 | 2 | mj:spy-lab moodboard | Evidence wall, manila + stamp red |
| 8 | 1 | mj:BWpx9goK2Yw | Line/geometry sibling batch |
| 8 | 1 | mj:DzfcExb-EEs×6BrT | Reverse-prompt HUD batch |
| 8 | 1 | mj:MZMhansvdqw×iWhjn | Prometheus/geometry mix |
| 8 | 1 | mj:nzkeht Using_elements | Near-black element collage |
| 8 | 1 | mj:nzkeht×9fO88Nx | Lighter construction variant |
| 7 | 7 | dir:…/mood-references | Photo collages (Rive/Seoul/coast/forest) — mood only |
| 5 | 1 | dir:…/document-system/assets | Paper tooth asset |
| 5 | 1 | dir:…/textures/textures | Debut light paper |
| 5 | 1 | dir:…/textures/paper | Debut twill |
| 5 | 2 | dir:design/paper | Groove + inflicted grid |
| 5 | 1 | le:geometric grid | Grid HUD (prior + this pass) |
| 4 | 2 | dir:vision/storyboards | Spacetime / temporal-compare concepts |
| 4 | 1 | mj:1978 NASA dossier | Magenta RECEIVED stamp — decorative |
| 4 | 1 | mj:Prometheus portrait | Titan portrait + arrow |
| 4 | 1 | mj:Martian pyramid | Interior vast hall, cinematic |
| 4 | 1 | mj:Marcus Aurelius | Contemplative bust, dusk field |
| 4 | 1 | mj:Face and pyramid | Sickly green/orange ruins |
| 4 | 1 | mj:resplendent Mind | Cosmic mind plate |
| 4 | 1 | mj:6YMM spy-lab | Spy-lab variant |
| 4 | 1 | mj:8kto5yFzLuA | Line batch |
| 4 | 1 | mj:DHycsUHpR3w | Line batch |
| 4 | 1 | mj:HJ9pS-yZ | Line batch |
| 4 | 1 | mj:MZMhansvdqw sketch | Prometheus sketch sibling |
| 4 | 1 | mj:PyHLQ ethereal cosmic | Ethereal cosmic background |
| 4 | 1 | mj:PzHS2D693k4×sjmQU | Bust/geometry reverse |
| 4 | 1 | mj:V7TOfpZZ8fc | Line batch |
| 4 | 1 | mj:pC26JKid3xA | Line batch |
| 4 | 1 | mj:vXtf5VcgeXU Make_more | Near-black geometry |
| 4 | 1 | mj:vXtf5VcgeXU×AT2kt | Geometry sibling |
| 4 | 1 | mj:astronaut double-exposure | High-key paper illustration |
| 3 | 1 | dir:…/research-shells | Roswell demo shell |
| 3 | 2 | dir:…/visual-language | VL report + archive territory map |
| 3 | 1 | le:vintage ULTRATERRESTRIAL | Archival document lettering |
| 3 | 1 | le:fire / Disclosure | Fire identity plate |
| 3 | 1 | mj:journal hand-d | Journal crop |
| 3 | 1 | mj:Prometheus Titan_and | VOLLUID sphere + statues + grid |
| 3 | 1 | root:numbered-webp | Paper/scan stills |
| 3 | 2 | root:phone-jpg | Snapshot photos, not chrome |
| 2 | 2 | dir:…/gateway | Hero + process explainer (teal→red ladder) |
| 2 | 2 | dir:…/process-refs | Globe HUD + instruction layers |
| 2 | 1 | le:dystopian cosmic dread | Eye-storm cinematic |
| 2 | 1 | le:dystopian scene | 2052 / THE OLD ONS COMING |
| 2 | 1 | le:ethereal landing | Quote landing (prior) |
| 2 | 1 | le:merciful (short stem) | Lovecraft dossier split |
| 2 | 1 | le:H5VQ split bust | Split classical bust |
| 1 | 1 | dir:…/plate_047 | Brand-bible paper plate (SoT) |
| 1 | 1 | dir:vision/prototypes | Interface gallery overview |
| 1 | 1 | le:Roswell Clauson | Faded Clauson page |
| 1 | 1 | le:geometric line (long) | Extra HUD still |
| 1 | 1 | le:merciful (full) | Black/cream Lovecraft split page |
| 1 | 1 | le:USS Roosevelt | Metallic sphere encounter |
| 1 | 1 | le:monochrome umbrella | Low-angle umbrella PNG |
| 1 | 1 | le:sjmQU ht | Bust + nebula HUD (Liam_Ellis) |
| 1 | 1 | mj:ie059 …_h | VOLLEKS forest-sphere sibling |
| 1 | 1 | mj:sZhUaw geometr | DEDALUS hatched bust |
| 1 | 1 | root:algorithmic self portrait | Dark seed-004 portrait |

Exact cluster keys and file lists: [stills-cluster-summary.json](./stills-cluster-summary.json).

## Embedded SoT (open these)

Prior 19 (desk / paper / identity) plus this-pass unread clusters.

### Prometheus — dark technical plate

![Prometheus dark grid sketch](../extractions/prometheus-line-studies-05/prometheus-line-studies-05.png)

Take: near-black field, hairline white overlay, grain, vertical spine, **no hue**.

### Prometheus — ink on paper

![Prometheus white construction drawing](../extractions/prometheus-line-studies-08/prometheus-line-studies-08.png)

Take: `#ffffff` paper, variable line weight, concentric geometry. Light register, not the live dark app.

### Prometheus — parchment + scanline + VOLLUID

![Prometheus chiaroscuro scan](../extractions/prometheus-line-studies/prometheus-line-studies.png)

![Prometheus portrait with arrow](../extractions/prometheus-portrait-arrow/prometheus-portrait-arrow.png)

![Prometheus VOLLUID sphere](../extractions/volluid-sphere-statues/volluid-sphere-statues.png)

### Product desk (live app SoT)

![Research desk nuclear thread v2](../extractions/research-desk-ui-07/research-desk-ui-07.png)

![Research desk nuclear thread v3](../extractions/research-desk-ui-08/research-desk-ui-08.webp)

![Living research canvas](../extractions/research-desk-ui-05/research-desk-ui-05.png)

![Interface directions gallery](../extractions/interface-gallery-overview/interface-gallery-overview.png)

Take: dark teal-black desk, brass as the only loud accent, 1px cards, grain.

### Archival paper

![Plate 047](../extractions/plate-047-brand-bible/plate-047-brand-bible.png)

![Document panel spec](../extractions/research-desk-ui/research-desk-ui.png)

![Visual language report](../extractions/visual-language-report-03/visual-language-report-03.png)

![Vintage ULTRATERRESTRIAL document](../extractions/vintage-ultraterrestrial-document/vintage-ultraterrestrial-document.png)

![Groove paper texture](../extractions/paper-grain-textures/paper-grain-textures.png)

### Identity / HUD

![Grid geometric HUD](../extractions/geometric-grid-hud-03/geometric-grid-hud-03.png)

![Gateway hero](../extractions/gateway-hero-explainer-02/gateway-hero-explainer-02.png)

![Spy-lab moodboard](../extractions/spy-lab-war-room-moodboard/spy-lab-war-room-moodboard.png)

![DEDALUS line geometry](../extractions/daedalus-hatched-bust/daedalus-hatched-bust.png)

### Unread clusters sampled this pass

![Socorro incident folder](../extractions/dossier-art-covers-15/dossier-art-covers-15.png)

~~cosmic-portals-4.png~~ **missing**

![Height/luma data cloud](../extractions/monochrome-height-luma-maps-19/monochrome-height-luma-maps-19.png)

![Rive mood collage](../extractions/photo-mood-collages/photo-mood-collages.jpg)

![Spacetime storyboard 01](../extractions/spacetime-storyboards-02/spacetime-storyboards-02.png)

![Mock-up IMG_0131](../extractions/research-desk-ui-02/research-desk-ui-02.png)

![Dystopian 2052](../extractions/dystopian-2052-scene/dystopian-2052-scene.png)

![Merciful split dossier](../extractions/merciful-split-page/merciful-split-page.png)

Take: illustration / mood / case-file accents. Namespace if reused; do not overwrite brass `#b49c60` or desk `#0f181c`.

## Applied where

Hex from the **prior 19** still lives in `ultraterrestrial-resurrection/packages/disclosure-ui/styles/tokens.css`. This 471 pass **did not change tokens/CSS**.
