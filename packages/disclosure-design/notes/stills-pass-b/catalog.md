---
title: Pass B stills catalog
type: note
created: 2026-08-13
author: agent
tags: [pass-b, stills, catalog]
---

# Pass B stills catalog

Generated 2026-08-13 12:23 UTC. Namespace `notes/stills-pass-b/`. Does not own `.ok/frontmatter.yml` or `notes/midjourney-image-catalog.md`.

## Counts

- Pixel-sampled: **471/471** (Pillow). Errors: **0**.
- Catalogued: **471/471**. Leftover in this namespace: **0**.
- Vision-read (direct): **74** stills. Remaining stills inherit cluster vision + Pillow hex.
- Buckets: design 160, vision 5, root-non-mj 44, root-midjourney 262.
- Layout check: 306 vault-root + 160 `design/` + 5 `vision/`. Ext: 443 PNG + 15 WEBP + 13 JPEG.

## Visual systems (pass-b notes only — no UR token overwrite)

1. **Archival / dossier** — Archive Bone `#DAD0C7`/`#E9DDCF`, Oxidized Paper, Charcoal Ink, Classified Red `#B21F1F`/`#B72A2A`, Signal Amber. Stamps, manila, typewriter, redaction. Source: `visual-language-report-v1`, dossier-art, Document Panel spec.
2. **Temporal Observatory HUD** — near-black `#0A0A0B`, cyan `#00D2FF`/`#22D3EE`, amber `#F59E0B`, magenta `#D946EF`. Globe, temporal dial, wipe-seam, epistemic %. Source: `vision/storyboards/` + UUID mock-ups. **This is a second product visual system**, already named in repo vision docs. Not written into `ultraterrestrial-resurrection` CSS by Pass B.
3. **Adjacent, not product chrome** — Gateway cyan↔red ladder; Claude Code gold/marble; editorial mood collages; cosmic-portal brand stills; green CRT nebula.

WebP vision: Cursor image decoder lacks webp; 15 webp stills were Pillow-sampled in-place and JPEG-previewed under `/tmp/pass-b-webp-preview` (not copied into the vault).

## Clusters Pass A is likely to miss (Pass B covered first)

- All 160 `design/` stills, especially nested `textures/textures/monochrome` (30) and duplicate paper packs.
- All 5 `vision/` storyboards/prototype.
- 44 vault-root stills that are **not** `u7869492466_*` (Liam_Ellis, cosmic-portals, IMG_, numbered webp, algorithmic frame).
- 31 duplicate filenames: same Liam_Ellis binaries live at vault root **and** `design/mock-ups/`.

## Cluster index

### design

#### `dir:design/brand-bible/09_CANVAS_STUDIES` — 1 stills, 1 vision-direct

Single archive plate. Cream + charcoal + classified red.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/brand-bible/09_CANVAS_STUDIES/plate_047.png` | 2000×2800 | `#dfd8c4` | `#dbd3bf` | `#dfd8c4 #c2b9a6` | Archive plate: cream grid, circular obscura field, tally log, red FILED-NOT EXPLAINED stamp. Product archival chrome. |

#### `dir:design/design-lab/document-system/assets` — 5 stills, 2 vision-direct

Tileable paper/grid/noise assets for document chrome.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/document-system/assets/paper-diagonal.png` | 200×200 | `#c0c0c0` | `#bcbcbc` | `#c0c0c0 #a5a5a5 #f5f5f5 #808080` | pillow; cluster covered |
| `design/design-lab/document-system/assets/paper-fibers.png` | 240×240 | `#fefefe` | `#bebebe` | `#fefefe #d9d9d9 #767676 #b8b8b8 #a3a3a3` | Black field + dotted white coordinate grid (tile). |
| `design/design-lab/document-system/assets/paper-tooth.png` | 300×300 | `#d2d2d2` | `#c7c7c7` | `#d2d2d2 #b5b5b5` | pillow; cluster covered |
| `design/design-lab/document-system/assets/paper-weave.png` | 410×410 | `#b3b3b3` | `#b6b6b6` | `#b3b3b3 #d6d6d6 #9f9f9f` | pillow; cluster covered |
| `design/design-lab/document-system/assets/registry-noise.png` | 98×98 | `#c1cad4` | `#bac8d6` | `#c1cad4 #8bb9e8` | Dark charcoal diagonal diamond mesh / carbon-weave tile. |

#### `dir:design/design-lab/dossier-art` — 20 stills, 8 vision-direct

Hero dossier stills: manila, Polaroid, stamps, Roswell/Socorro/Cooper.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/dossier-art/astronaut-secret-dossier.png` | 1536×1024 | `#020201` | `#3f3225` | `#020201 #705f49 #a39075 #847159 #1e1914` | Gordon Cooper Mercury dossier: clipped portrait, TOP SECRET red stamp, circuit schematic, sepia paper on black. |
| `design/design-lab/dossier-art/astronaut-secret-files-a.png` | 1536×1024 | `#0f110b` | `#5d4a2e` | `#0f110b #8d7049 #453521 #6e5839 #a8885b` | pillow; cluster covered |
| `design/design-lab/dossier-art/astronaut-secret-files-b.png` | 1536×1024 | `#0a100c` | `#423622` | `#0a100c #58482e #7f6a4a #2e2718` | pillow; cluster covered |
| `design/design-lab/dossier-art/classified-files-noir-light.png` | 1536×1024 | `#040907` | `#3f2d14` | `#040907 #6e4f24 #a88147 #4d391b #896734` | Manila stack + Polaroid + CLASSIFIED stamp; contemporary political-dossier lighting (not product UI). |
| `design/design-lab/dossier-art/cosmic-dread-existential-angst.png` | 928×1232 | `#0c0e0f` | `#171613` | `#0c0e0f #3d3424 #261f18 #816f4e` | Painterly nebula/storm, gold break in cloud, serif OF THE GODS COMING. Hero atmosphere, not chrome. |
| `design/design-lab/dossier-art/roswell-clauson-page-a.png` | 896×1344 | `#1b1d20` | `#a5a19c` | `#1b1d20 #d1cfca #b3b0aa #797673` | Folded vintage page: eclipse stamp, nebula plate, asemic typewriter, WALDSTOR seal. |
| `design/design-lab/dossier-art/roswell-clauson-page-b.png` | 896×1344 | `#1b1d20` | `#817a74` | `#1b1d20 #dadbd6 #c4c1ba #9f9992 #5a5654` | pillow; cluster covered |
| `design/design-lab/dossier-art/roswell-clauson-page-c.png` | 896×1344 | `#c1c2bb` | `#c1c2ba` | `#c1c2bb #44494b` | pillow; cluster covered |
| `design/design-lab/dossier-art/roswell-evidence-folder-a.png` | 1024×1536 | `#15150e` | `#916b33` | `#15150e #aa8544 #89632f #6c4c23` | pillow; cluster covered |
| `design/design-lab/dossier-art/roswell-evidence-folder-b.png` | 1024×1536 | `#2a2921` | `#91763f` | `#2a2921 #bba366 #9c8047 #7b6235` | pillow; cluster covered |
| `design/design-lab/dossier-art/roswell-witness-reports-folder.png` | 480×720 | `#9c8047` | `#927640` | `#9c8047 #bba366 #292821 #796135` | pillow; cluster covered |
| `design/design-lab/dossier-art/socorro-incident-details-a.png` | 1536×1024 | `#000000` | `#361c03` | `#000000 #3c2005 #945f23 #6b3e10 #1d0e02` | pillow; cluster covered |
| `design/design-lab/dossier-art/socorro-incident-details-b.png` | 1536×1024 | `#000000` | `#3b2307` | `#000000 #1f1303 #7f521e #5f3911 #45290a` | pillow; cluster covered |
| `design/design-lab/dossier-art/socorro-incident-details-c.png` | 1536×1024 | `#000000` | `#160b01` | `#000000 #4b2b0c #2b1604 #80521e` | pillow; cluster covered |
| `design/design-lab/dossier-art/socorro-incident-folder-a.png` | 1536×1024 | `#000202` | `#241e12` | `#000202 #433825 #615238 #8b7859 #2d2618` | 1964 Socorro folder + Polaroid flaming disc + CLASSIFIED + Sheriff Chavez script. |
| `design/design-lab/dossier-art/socorro-incident-folder-b.png` | 1536×1024 | `#020201` | `#2e1d0c` | `#020201 #231608 #bc9156 #5e3d1a #8c6231` | pillow; cluster covered |
| `design/design-lab/dossier-art/ultraterrestrial-vintage-document-cover.png` | 896×1344 | `#e0dbc7` | `#c5c1b5` | `#e0dbc7 #969793 #1d1e1f #ccc7b9 #5b5e5e` | Letterboxed crash-field photo, circular seal, red triangle, garbled ULTERTAAL type. |
| `design/design-lab/dossier-art/undetect-vintage-document-a.png` | 896×1344 | `#c1c3c4` | `#5c5e5e` | `#c1c3c4 #292a2a #151414 #d5dadb #020202` | Night field + fire/smoke + UN-DECTEL DRIST targeting overlays. |
| `design/design-lab/dossier-art/undetect-vintage-document-b.png` | 896×1344 | `#e1d7be` | `#c8c1b0` | `#e1d7be #2b2d30 #bbb6a8 #9d9a93 #5d5b5d` | pillow; cluster covered |
| `design/design-lab/dossier-art/vertical-manila-folder-icon.png` | 480×720 | `#3d382d` | `#413c2c` | `#3d382d #675330 #1e1e18` | Centered bronze/manila folder on charcoal dot-grid. UI icon language. |

#### `dir:design/design-lab/gateway` — 2 stills, 2 vision-direct

Gateway Process infographics (cyan↔red). Not canvas chrome.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/gateway/gateway-hero.png` | 1024×1536 | `#1c1917` | `#0c0c0c` | `#1c1917 #42453f` | Vertical esoteric blueprint: red network → cyan lattice → torus figure → headphones/brain → waveforms. |
| `design/design-lab/gateway/gateway-process-visual-explainer.png` | 2160×3240 | `#171715` | `#0b0e0d` | `#171715 #42433d #030404` | THE GATEWAY PROCESS claim-audit infographic; teal→red Focus ladder; NOT product canvas chrome. |

#### `dir:design/design-lab/mood-references` — 7 stills, 4 vision-direct

Editorial analog collages (lightness). Off-product.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/mood-references/bird-brief-lightness-collage.jpg` | 972×1619 | `#e3dfd6` | `#e4e0d7` | `#e3dfd6` | pillow; cluster covered |
| `design/design-lab/mood-references/lighthouse-coast-fog.jpg` | 971×1619 | `#e6e0bf` | `#e7e2cf` | `#e6e0bf` | Pale yellow beam + litho lighthouse + 灯没有催促雾. Lightest design still. |
| `design/design-lab/mood-references/rive-vol01-course-cover.jpg` | 1536×2304 | `#e9d7b1` | `#e7d4ad` | `#e9d7b1 #355aa7` | Rive vol.01 course cover: distressed cobalt serif on beige. External analog, not UT product. |
| `design/design-lab/mood-references/self-obscured-masked-figure.jpg` | 1536×2304 | `#eddec0` | `#e7d7b9` | `#eddec0 #b18f7b` | Editorial collage: torn-paper face, red scarf, typewriter who is there / self obscured. |
| `design/design-lab/mood-references/seoul-platform-proof-collage.jpg` | 971×1619 | `#d9d5cb` | `#d9d5cb` | `#d9d5cb #b5b1ab` | 1974 Seoul platform proof: rain window, ticket №0487, cobalt rectangle, typewriter verse. |
| `design/design-lab/mood-references/shore-seashell-dry-wind.jpg` | 971×1619 | `#dcd0be` | `#dbcfbe` | `#dcd0be` | pillow; cluster covered |
| `design/design-lab/mood-references/summer-still-air-bottle.jpg` | 1536×2304 | `#e5d8b6` | `#e5d7b4` | `#e5d8b6 #cac69e` | pillow; cluster covered |

#### `dir:design/design-lab/process-refs` — 2 stills, 2 vision-direct

HUD observatory + Claude Code gold/marble. Process only.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/process-refs/antigravity-observatory-globe-hud.png` | 1440×900 | `#000000` | `#000000` | `#000000 #111213 #252527 #676970` | ANTIGRAVITY OBSERVATORY WebGL HUD: geodesic moon, white mono telemetry. Darkest design still (luma 8.8). |
| `design/design-lab/process-refs/claude-code-seven-instruction-layers.png` | 1625×651 | `#010101` | `#0b0905` | `#010101 #2d2517 #5c4c32` | CLAUDE CODE 7-layer gold/marble infographic. Adjacent process-ref, not Research Canvas. |

#### `dir:design/design-lab/textures` — 8 stills, 3 vision-direct

Dark twill/dot-grid/scanline tiles + twin-moons webp.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/textures/debut-light-paper.png` | 200×200 | `#c0c0c0` | `#bcbcbc` | `#c0c0c0 #a5a5a5 #f5f5f5 #808080` | Near-black diagonal twill/carbon tile. |
| `design/design-lab/textures/dot-grid-black.png` | 240×240 | `#fefefe` | `#bebebe` | `#fefefe #d9d9d9 #767676 #b8b8b8 #a3a3a3` | pillow; cluster covered |
| `design/design-lab/textures/dot-grid-texture.png` | 1024×1536 | `#e6cb9e` | `#e5c99c` | `#e6cb9e #d4ad78` | pillow; cluster covered |
| `design/design-lab/textures/fabric-of-squares.png` | 410×410 | `#b3b3b3` | `#b6b6b6` | `#b3b3b3 #d6d6d6 #9f9f9f` | pillow; cluster covered |
| `design/design-lab/textures/green-nebula-scanline-shader.png` | 1920×1205 | `#252d1a` | `#212a17` | `#252d1a #404c30 #11180b #717a5c` | CRT/night-vision green nebula with shadow-mask grid. |
| `design/design-lab/textures/grid-noise.png` | 98×98 | `#c1cad4` | `#bac8d6` | `#c1cad4 #8bb9e8` | pillow; cluster covered |
| `design/design-lab/textures/groove-paper.png` | 300×300 | `#d2d2d2` | `#c7c7c7` | `#d2d2d2 #b5b5b5` | pillow; cluster covered |
| `design/design-lab/textures/twin-moons-monochrome.webp` | 2912×1632 | `#2c2c2c` | `#0f0f0f` | `#2c2c2c #020202 #595959` | Two cratered moons, rim-lit chiaroscuro on void black. Cinematic texture, not UI chrome. |

#### `dir:design/design-lab/textures/research-shells` — 3 stills, 1 vision-direct

Square surveillance stills with orange crosshair.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/textures/research-shells/dc.png` | 1024×1536 | `#bbae98` | `#ab9e86` | `#bbae98 #332f29 #6b5f4f #998d79 #1a1a18` | pillow; cluster covered |
| `design/design-lab/textures/research-shells/demo-roswell.png` | 1024×1024 | `#161617` | `#323131` | `#161617 #e5dfd5 #41403f #75716d #c4bdb3` | Square UAP slab over desert; orange HUD crosshair; cream/black surveillance still. |
| `design/design-lab/textures/research-shells/press.png` | 1024×1536 | `#15150e` | `#916b33` | `#15150e #aa8544 #89632f #6c4c23` | pillow; cluster covered |

#### `dir:design/design-lab/textures/textures` — 5 stills, 0 vision-direct

Duplicate paper tiles (debut/fabric/grid/groove/inflicted).

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/textures/textures/debut-light.png` | 200×200 | `#c0c0c0` | `#bcbcbc` | `#c0c0c0 #a5a5a5 #f5f5f5 #808080` | pillow; cluster covered |
| `design/design-lab/textures/textures/fabric-of-squares.png` | 410×410 | `#b3b3b3` | `#b6b6b6` | `#b3b3b3 #d6d6d6 #9f9f9f` | pillow; cluster covered |
| `design/design-lab/textures/textures/grid-noise.png` | 98×98 | `#c1cad4` | `#bac8d6` | `#c1cad4 #8bb9e8` | pillow; cluster covered |
| `design/design-lab/textures/textures/groovepaper.png` | 300×300 | `#d2d2d2` | `#c7c7c7` | `#d2d2d2 #b5b5b5` | pillow; cluster covered |
| `design/design-lab/textures/textures/inflicted.png` | 240×240 | `#fefefe` | `#bebebe` | `#fefefe #d9d9d9 #767676 #b8b8b8 #a3a3a3` | pillow; cluster covered |

#### `dir:design/design-lab/textures/textures/monochrome` — 30 stills, 2 vision-direct

30-file height/luma/webp pack: contour, data-cloud, star-speckle, topo-waves.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_lg.webp` | 1024×1024 | `#010101` | `#0e0e0e` | `#010101 #2e2e2e #131313 #646464` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_lg_height.png` | 1024×1024 | `#010101` | `#111111` | `#010101 #242424 #666666` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_lg_luma.png` | 1024×1024 | `#010101` | `#0e0e0e` | `#010101 #2e2e2e #131313 #636363` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_md.webp` | 512×1024 | `#010101` | `#0e0e0e` | `#010101 #2d2d2d #626262` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_md_height.png` | 512×1024 | `#010101` | `#131313` | `#010101 #323232 #191919 #666666` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_md_luma.png` | 512×1024 | `#010101` | `#0e0e0e` | `#010101 #2d2d2d #131313 #626262` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_lg.webp` | 1024×2048 | `#000000` | `#161616` | `#000000 #323232 #202020 #7f8081` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_lg_height.png` | 1024×2048 | `#000000` | `#171717` | `#000000 #222222 #343434 #565656 #a8a8a8` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_lg_luma.png` | 1024×2048 | `#000000` | `#161616` | `#000000 #323232 #191919 #808080` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_md.webp` | 512×1024 | `#000000` | `#161616` | `#000000 #323332 #191919 #7f8081` | White contour-mountain HUD terrain on black; corner numeric rails. |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_md_height.png` | 512×1024 | `#000000` | `#191919` | `#000000 #262626 #393939 #5b5b5b #a9a9a9` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_md_luma.png` | 512×1024 | `#000000` | `#161616` | `#000000 #323232 #191919 #808080` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_lg.webp` | 2048×1024 | `#000000` | `#060606` | `#000000 #323232 #585858 #191919 #9b9b9b` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_lg_height.png` | 2048×1024 | `#000000` | `#070707` | `#000000 #343434 #585858 #1c1c1c #9c9c9c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_lg_luma.png` | 2048×1024 | `#000000` | `#060606` | `#000000 #323232 #585858 #191919 #9c9c9c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_md.webp` | 1024×512 | `#000000` | `#060606` | `#000000 #323232 #585858 #191919 #9c9c9c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_md_height.png` | 1024×512 | `#000000` | `#070707` | `#000000 #343434 #585858 #1d1d1d #9c9c9c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/data_cloud_landscape_md_luma.png` | 1024×512 | `#000000` | `#060606` | `#000000 #323232 #191919 #585858 #9c9c9c` | Luma/height-map sibling: neural data-cloud, white points on black. |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_lg.webp` | 2048×1024 | `#090909` | `#0c0c0c` | `#090909 #232323` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_lg_height.png` | 2048×1024 | `#181818` | `#101010` | `#181818 #040404 #2c2c2c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_lg_luma.png` | 2048×1024 | `#181818` | `#0b0b0b` | `#181818 #030303` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_md.webp` | 1024×512 | `#191918` | `#0c0c0c` | `#191918 #030303` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_md_height.png` | 1024×512 | `#212121` | `#111111` | `#212121 #050505` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/star_speckle_landscape_md_luma.png` | 1024×512 | `#030303` | `#0c0c0c` | `#030303 #191919` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_lg.webp` | 1024×2048 | `#000000` | `#060708` | `#000000 #2a3035 #191c1f #6b7d8c` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_lg_height.png` | 1024×2048 | `#000000` | `#080808` | `#000000 #1f1f1f #3a3a3a #5b5b5b #9b9b9b` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_lg_luma.png` | 1024×2048 | `#000000` | `#070707` | `#000000 #2f2f2f #585858 #171717 #999999` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_md.webp` | 512×1024 | `#000000` | `#060708` | `#000000 #2c3135 #1a1d1f #6b7d8b` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_md_height.png` | 512×1024 | `#000000` | `#080808` | `#000000 #242424 #404040 #5c5c5c #999999` | pillow; cluster covered |
| `design/design-lab/textures/textures/monochrome/topo_waves_portrait_md_luma.png` | 512×1024 | `#000000` | `#070707` | `#000000 #1c1c1c #363636 #585858 #999999` | pillow; cluster covered |

#### `dir:design/design-lab/textures/textures/paper` — 5 stills, 1 vision-direct

White-on-black paper grids (same as design/paper).

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/textures/textures/paper/debut-twill.png` | 200×200 | `#c0c0c0` | `#bcbcbc` | `#c0c0c0 #a5a5a5 #f5f5f5 #808080` | pillow; cluster covered |
| `design/design-lab/textures/textures/paper/fabric-of-squares.png` | 410×410 | `#b3b3b3` | `#b6b6b6` | `#b3b3b3 #d6d6d6 #9f9f9f` | pillow; cluster covered |
| `design/design-lab/textures/textures/paper/grid-noise.png` | 98×98 | `#c1cad4` | `#bac8d6` | `#c1cad4 #8bb9e8` | pillow; cluster covered |
| `design/design-lab/textures/textures/paper/groove-paper.png` | 300×300 | `#d2d2d2` | `#c7c7c7` | `#d2d2d2 #b5b5b5` | pillow; cluster covered |
| `design/design-lab/textures/textures/paper/inflicted-grid.png` | 240×240 | `#fefefe` | `#bebebe` | `#fefefe #d9d9d9 #767676 #b8b8b8 #a3a3a3` | Orthogonal white dotted grid on black (drafting plane). |

#### `dir:design/design-lab/ui-mockups` — 10 stills, 6 vision-direct

Product UI: canvas, ledger, hypothesis lab, Socorro case file, research desk.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/ui-mockups/case-file-socorro-landing.png` | 1312×816 | `#d9e2e3` | `#cbc7b2` | `#d9e2e3 #d1c9b5 #aeada5 #161d19 #7c776e` | Skeuomorphic Socorro case file: cream paper workspace, orange status, residue swatches as claim types. |
| `design/design-lab/ui-mockups/document-panel-component-spec.png` | 1132×1389 | `#f4f0e9` | `#e9dfd3` | `#f4f0e9 #cbc2b3 #ded4c6 #7b7669` | Document Panel spec on parchment: NOTES/INSPECTOR/PROVENANCE, gold focus, sticky notes, API table. |
| `design/design-lab/ui-mockups/evidence-ledger-claim-detail.png` | 1440×960 | `#111516` | `#131718` | `#111516 #363734` | Evidence Ledger C-0187: supporting/challenging columns, radar credibility, purple Evidence Agent. |
| `design/design-lab/ui-mockups/hypothesis-lab-competing-explanations.png` | 1440×960 | `#161a1b` | `#15181a` | `#161a1b #393b3a` | Hypothesis Lab: two-model compare, teal vs orange, coverage matrix, bounded conclusion. |
| `design/design-lab/ui-mockups/living-research-canvas-nuclear-thread.png` | 1440×960 | `#141512` | `#141512` | `#141512 #313433 #a49e8f` | Living Research Canvas: cream entity cards, wavy epistemic edges, 7.8 credibility, dark charcoal app chrome. |
| `design/design-lab/ui-mockups/research-desk-nuclear-thread-v1.png` | 1672×941 | `#201e1a` | `#1d1c19` | `#201e1a #c5b196 #95836b` | pillow; cluster covered |
| `design/design-lab/ui-mockups/research-desk-nuclear-thread-v2.png` | 1586×992 | `#10191d` | `#10181c` | `#10191d #444b45` | pillow; cluster covered |
| `design/design-lab/ui-mockups/research-desk-nuclear-thread-v3.webp` | 1586×992 | `#10181c` | `#10181b` | `#10181c #434a45` | Research Desk OSINT dashboard: theory canvas, NM map, sticky notes, Nuclear Thread 0.68. |
| `design/design-lab/ui-mockups/research-desk-theory-canvas.png` | 1586×992 | `#10191d` | `#10181c` | `#10191d #444b45` | pillow; cluster covered |
| `design/design-lab/ui-mockups/research-notebook-document-panel.png` | 1103×1426 | `#161615` | `#191917` | `#161615 #b9ab9b #a89985 #7f7b6d` | pillow; cluster covered |

#### `dir:design/design-lab/visual-language` — 3 stills, 2 vision-direct

Canonical token sheets (Archive Bone, Signal Amber, Classified Red…).

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/design-lab/visual-language/archive-territory-visual-map-board.png` | 1055×1491 | `#dcd1c0` | `#b9ac9a` | `#dcd1c0 #1b1e20 #ada190 #cabdaa #817a6e` | pillow; cluster covered |
| `design/design-lab/visual-language/archive-territory-visual-map.png` | 1055×1491 | `#dcd1c0` | `#b9ac9a` | `#dcd1c0 #1b1e20 #ada190 #cabdaa #817a6e` | Archive territory map: ARCHIVE/FIELD/BLACKSITE/MYTH-TECH/PUBLIC RELEASE + named hex tokens. |
| `design/design-lab/visual-language/visual-language-report-v1.png` | 1122×1402 | `#dcd0bf` | `#c9bdab` | `#dcd0bf #c4b7a5 #393733 #8c8173` | Visual Foundation report: 10-swatch token sheet, motif library, found-not-designed principles. |

#### `dir:design/mock-ups` — 54 stills, 9 vision-direct

UUID storyboards (HUD) + Generated archive UIs + Liam_Ellis dupes of vault-root + motion stills.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/mock-ups/201550d4-7331-4d15-a196-ec468b3dc1e0.png` | 1672×941 | `#040608` | `#05080b` | `#040608 #28363b` | UUID storyboard CONCEPT 01 Spacetime Canvas: globe + temporal dial + cyan/amber/magenta HUD. |
| `design/mock-ups/3233F523-CFD4-4713-874B-B508B558E8FF.png` | 1586×992 | `#10191d` | `#10181c` | `#10191d #444b45` | pillow; cluster covered |
| `design/mock-ups/3E5B7E93-80D9-460C-B565-019C5F56F189.png` | 1672×941 | `#131718` | `#04080a` | `#131718 #000101 #2b2e2c` | UUID storyboard CONCEPT 03 Temporal Compare: wipe seam 1947/1982, difference legend. |
| `design/mock-ups/608E1A7F-550E-4420-BA3D-2D7DFF3ED885.png` | 1122×1402 | `#dcd0bf` | `#c9bdab` | `#dcd0bf #c4b7a5 #393733 #8c8173` | pillow; cluster covered |
| `design/mock-ups/7ffe681d-4eb0-437e-b58b-bb4fb6cdf04c.png` | 1586×992 | `#10191d` | `#10181c` | `#10191d #444b45` | pillow; cluster covered |
| `design/mock-ups/92475F84-E7FA-4F15-8753-75EDE1C6AA92.png` | 1672×941 | `#040709` | `#04090c` | `#040709 #232f37` | pillow; cluster covered |
| `design/mock-ups/A0D345E3-3C6E-4561-9E6A-106373671B67.png` | 1103×1426 | `#161615` | `#191917` | `#161615 #b9ab9b #a89985 #7f7b6d` | pillow; cluster covered |
| `design/mock-ups/ADF4195A-40C9-428F-A6E3-DB03721EAFD0.png` | 1672×941 | `#201e1a` | `#1d1c19` | `#201e1a #c5b196 #95836b` | pillow; cluster covered |
| `design/mock-ups/C0F15A18-C58F-4782-B531-254F9B035982.png` | 1055×1491 | `#dcd1c0` | `#b9ac9a` | `#dcd1c0 #1b1e20 #ada190 #cabdaa #817a6e` | pillow; cluster covered |
| `design/mock-ups/C8D34054-45DD-47C2-96DF-643E7873F26C copy.png` | 1132×1389 | `#f4f0e9` | `#e9dfd3` | `#f4f0e9 #cbc2b3 #ded4c6 #7b7669` | pillow; cluster covered |
| `design/mock-ups/C8D34054-45DD-47C2-96DF-643E7873F26C.png` | 1132×1389 | `#f4f0e9` | `#e9dfd3` | `#f4f0e9 #cbc2b3 #ded4c6 #7b7669` | Duplicate Document Panel spec (warm beige #f4f0e9). Same system as design-lab spec. |
| `design/mock-ups/E198B83B-4860-4ABE-A222-C82B7B7F4216.png` | 1672×941 | `#040608` | `#05080b` | `#040608 #28363b` | pillow; cluster covered |
| `design/mock-ups/FF38FD0C-5437-4508-9916-0AF6BA02F0DC.png` | 1672×941 | `#111516` | `#04080a` | `#111516 #000102 #252a2a` | UUID storyboard CONCEPT 02 Guided Investigation: nuclear-thread waypoints. |
| `design/mock-ups/Generated image 1 (1).png` | 1023×1537 | `#101112` | `#1a1a18` | `#101112 #c6b4a0 #292520 #756a5a` | pillow; cluster covered |
| `design/mock-ups/Generated image 1 (2).png` | 1586×992 | `#10191d` | `#10181c` | `#10191d #444b45` | pillow; cluster covered |
| `design/mock-ups/Generated image 1.png` | 1448×1086 | `#191a19` | `#1b1b1a` | `#191a19 #968368` | Official Disclosure Files Archive: dark catalog grid + manila folders + inspector PDF scan. |
| `design/mock-ups/Generated image 2.png` | 1448×1086 | `#1f1e1b` | `#25241f` | `#1f1e1b #a8947e #b9a791 #847360` | pillow; cluster covered |
| `design/mock-ups/Generated image 3 (1).png` | 1024×1536 | `#090a0b` | `#111110` | `#090a0b #ccbca7 #23201d #7d7864` | pillow; cluster covered |
| `design/mock-ups/Generated image 3.png` | 1448×1086 | `#131414` | `#1e1915` | `#131414 #a49177 #332a21 #78664e` | Skeuomorphic archive cabinet: manila folders + card catalog drawers + Roswell dossier. |
| `design/mock-ups/Generated image 4.png` | 1448×1086 | `#131313` | `#1c1c19` | `#131313 #8d7c67 #453e33` | pillow; cluster covered |
| `design/mock-ups/IMG_0131.png` | 1312×816 | `#d9e2e3` | `#cbc7b2` | `#d9e2e3 #d1c9b5 #aeada5 #161d19 #7c776e` | Phone-capture of Socorro case-file UI (same surface as case-file-socorro-landing). |
| `design/mock-ups/IMG_0135.png` | 1440×960 | `#141512` | `#141512` | `#141512 #313433 #a49e8f` | pillow; cluster covered |
| `design/mock-ups/IMG_0136.png` | 1440×960 | `#161a1b` | `#15181a` | `#161a1b #393b3a` | pillow; cluster covered |
| `design/mock-ups/imgi_11_motion-32.png` | 1742×988 | `#000000` | `#000000` | `#000000 #121926 #3e6b87` | Motion still: cyan cosmic vortex/tunnel on black. |
| `design/mock-ups/imgi_134_bg-motion-41.jpg` | 1764×1176 | `#588593` | `#060913` | `#588593 #03060f #0d2a27` | pillow; cluster covered |
| `design/mock-ups/imgi_150_motion-41.png` | 1920×1284 | `#1f3f35` | `#102626` | `#1f3f35 #08141c #326049 #6fb389` | pillow; cluster covered |
| `design/mock-ups/imgi_59_bg-20260520-113543.jpg` | 1920×1080 | `#0c2a49` | `#0e2430` | `#0c2a49 #071a2e #323e4b #806f5e` | Night knoll + vintage CRT TV as warm portal; not product chrome. |
| `design/mock-ups/imgi_9_bg-20260506-1.jpg` | 1920×1080 | `#10120f` | `#10120f` | `#10120f #52554e` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_0.png` | 928×1232 | `#2c3023` | `#292b1f` | `#2c3023 #625535 #111a16 #a09466` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_1.png` | 928×1232 | `#62563d` | `#382e24` | `#62563d #4e412f #27211c #8b7d5a` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_2026_dystopian_scene._dark_cosmic_dread_and_the_we_f5fe7322-ba6f-4288-929e-2c925b09b028_0.png` | 928×1232 | `#555b57` | `#2d3335` | `#555b57 #292e30 #3d4444 #8d8c7c` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_2026_dystopian_scene._dark_cosmic_dread_and_the_we_f5fe7322-ba6f-4288-929e-2c925b09b028_3.png` | 928×1232 | `#5a5341` | `#282f2b` | `#5a5341 #232a28 #3f3f35 #111316 #8f7c59` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_0.png` | 896×1344 | `#ded5bf` | `#c3baab` | `#ded5bf #1b1c1e #cac1b0 #b5aea0 #938e85` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_1.png` | 896×1344 | `#dcd4be` | `#bdb8a8` | `#dcd4be #2e3136 #b2ada0 #8d8b84 #55595c` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_2.png` | 896×1344 | `#e2dac4` | `#ccc5b3` | `#e2dac4 #c3bcab #1d2126 #4e5254 #97948b` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Design_an_old_faded_page_from_the_Roswell_Clauson__4d09b284-ed01-400c-be88-35efcd3d2f35_3.png` | 896×1344 | `#3d4143` | `#c3c3bb` | `#3d4143 #c5c5bd #9da19f` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_ethereal_landing_page_featuring_this_quot_55cebec1-5073-4561-a10d-8e094fc9461b_1.png` | 1024×1024 | `#2d2e31` | `#d3d2cc` | `#2d2e31 #deded6 #c7c6c0 #9e9d99` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_ethereal_landing_page_featuring_this_quot_55cebec1-5073-4561-a10d-8e094fc9461b_3.png` | 1024×1024 | `#11191f` | `#bfc0b7` | `#11191f #d7d9d2 #a7a79e #4d4f4b` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_089ad411-540b-47ab-b57d-7066b6132f79_1.png` | 1536×768 | `#101010` | `#030303` | `#101010 #d6d5d6 #545454` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_1 (1).png` | 1536×768 | `#201f1d` | `#30312f` | `#201f1d #646b6d #353736 #bec0ba` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_1.png` | 1536×768 | `#201f1d` | `#30312f` | `#201f1d #646b6d #353736 #bec0ba` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_2.png` | 1536×768 | `#a19e97` | `#a19d97` | `#a19e97 #bfbeb6 #393435 #8a8682` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_3.png` | 1536×768 | `#feffff` | `#f0f0f0` | `#feffff #d7d7d7 #babbba #e9e9e9 #3a3d41` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_line_f3d847f9-1ec9-4c3b-9b0c-4891ae2df47b.png` | 3072×1536 | `#1e1d1b` | `#2e2f2e` | `#1e1d1b #62686b #333433 #434647 #bdbeba` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU__0caaac09-32fe-4d3c-9bba-bf535e9851d4_2.png` | 1024×1024 | `#b6b7ad` | `#626862` | `#b6b7ad #20282a #46504f #838781` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU__0caaac09-32fe-4d3c-9bba-bf535e9851d4_3.png` | 1024×1024 | `#0e1414` | `#171c1b` | `#0e1414 #272b2b #6b6a63` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_ht_dab5a33f-a36e-4288-8e50-f2d5374a8098.png` | 1856×2464 | `#100e0c` | `#20201f` | `#100e0c #242423 #aca699 #373938 #706e6a` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_1.png` | 1024×1024 | `#000101` | `#868b85` | `#000101 #e9e3c3 #1f2123 #5a5f5e #b2afa0` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_2.png` | 1024×1024 | `#bdb6a7` | `#9fa096` | `#bdb6a7 #212325 #0c0e0e #454b4c #878a83` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_754da163-7f72-4361-a4c3-14595212511d_0.png` | 1024×1024 | `#beb8a6` | `#67625b` | `#beb8a6 #343236 #756e64 #585450 #dddccf` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_th_4cbdb52d-4efa-4794-ab29-40e590463c20_3.png` | 928×1232 | `#22201e` | `#211f1d` | `#22201e #998f86` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_th_ec3c35af-94a3-4bf3-b687-1ad76d0a3fa0_3.png` | 1024×1024 | `#dddcd8` | `#dddbd7` | `#dddcd8 #36373b #a4a3a2` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_the__b54c016b-3331-47a8-8299-3219c1fa34da.png` | 1856×2464 | `#c3baaa` | `#908a7e` | `#c3baaa #191817 #2d2b29 #a7a092 #666259` | pillow; cluster covered |
| `design/mock-ups/Liam_Ellis_USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe_986f31ce-71d2-43ca-bcd0-ce319ca09cee_2.png` | 1232×928 | `#4c4941` | `#373532` | `#4c4941 #a09d8d #262424 #6c685b` | pillow; cluster covered |

#### `dir:design/paper` — 5 stills, 1 vision-direct

Five paper tiles mirrored from design-lab textures.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `design/paper/debut-twill.png` | 200×200 | `#c0c0c0` | `#bcbcbc` | `#c0c0c0 #a5a5a5 #f5f5f5 #808080` | Same dark twill family as design-lab/textures (duplicate paper pack). |
| `design/paper/fabric-of-squares.png` | 410×410 | `#b3b3b3` | `#b6b6b6` | `#b3b3b3 #d6d6d6 #9f9f9f` | pillow; cluster covered |
| `design/paper/grid-noise.png` | 98×98 | `#c1cad4` | `#bac8d6` | `#c1cad4 #8bb9e8` | pillow; cluster covered |
| `design/paper/groove-paper.png` | 300×300 | `#d2d2d2` | `#c7c7c7` | `#d2d2d2 #b5b5b5` | pillow; cluster covered |
| `design/paper/inflicted-grid.png` | 240×240 | `#fefefe` | `#bebebe` | `#fefefe #d9d9d9 #767676 #b8b8b8 #a3a3a3` | pillow; cluster covered |

### vision

#### `dir:vision/prototypes` — 1 stills, 1 vision-direct

2×2 interface directions — product surface map.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `vision/prototypes/interface-gallery-overview.png` | 1440×1040 | `#121515` | `#141617` | `#121515 #414440` | Four product surfaces: Canvas / Ledger / Observatory / Hypothesis Lab. Canonical product map. |

#### `dir:vision/storyboards` — 4 stills, 4 vision-direct

Temporal Observatory concepts 01–04. Second visual system (HUD).

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `vision/storyboards/concept-01-spacetime-canvas.png` | 1672×941 | `#040608` | `#05080b` | `#040608 #28363b` | CONCEPT 01 Temporal Observatory: globe → dial → Roswell inspector → reconstruction + epistemic %. |
| `vision/storyboards/concept-02-guided-investigation.png` | 1672×941 | `#111516` | `#04080a` | `#111516 #000102 #252a2a` | CONCEPT 02: choose tour → globe waypoints → narrative waypoint → synchronized evidence. |
| `vision/storyboards/concept-03-temporal-compare.png` | 1672×941 | `#131718` | `#04080a` | `#131718 #000101 #2b2e2c` | CONCEPT 03: pin frame → load hypothesis → draggable seam → difference analysis. |
| `vision/storyboards/concept-04-flap-playback.png` | 1672×941 | `#040709` | `#04090c` | `#040709 #232f37` | CONCEPT 04 flap playback: filter corridor → animate types → speed/step → AI synthesis. |

### root-non-mj

#### `le:2026_dystopian_cosmic_dread_and_the_weight_of_exis` — 2 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_0.png` | 928×1232 | `#2c3023` | `#292b1f` | `#2c3023 #625535 #111a16 #a09466` | Two silhouettes under gold nebula; OLD GODS COMING poster family. |
| `Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_1.png` | 928×1232 | `#62563d` | `#382e24` | `#62563d #4e412f #27211c #8b7d5a` | pillow; cluster covered |

#### `le:2026_dystopian_scene._dark_cosmic_dread_and_the_we` — 2 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_2026_dystopian_scene._dark_cosmic_dread_and_the_we_f5fe7322-ba6f-4288-929e-2c925b09b028_0.png` | 928×1232 | `#555b57` | `#2d3335` | `#555b57 #292e30 #3d4444 #8d8c7c` | pillow; cluster covered |
| `Liam_Ellis_2026_dystopian_scene._dark_cosmic_dread_and_the_we_f5fe7322-ba6f-4288-929e-2c925b09b028_3.png` | 928×1232 | `#5a5341` | `#282f2b` | `#5a5341 #232a28 #3f3f35 #111316 #8f7c59` | pillow; cluster covered |

#### `le:A_vintage_document_with_the_text_ULTRATERRESTRIAL_` — 3 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_0.png` | 896×1344 | `#ded5bf` | `#c3baab` | `#ded5bf #1b1c1e #cac1b0 #b5aea0 #938e85` | Letterboxed crash disc + asemic UT type on parchment. Duplicated under design/mock-ups/. |
| `Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_1.png` | 896×1344 | `#dcd4be` | `#bdb8a8` | `#dcd4be #2e3136 #b2ada0 #8d8b84 #55595c` | pillow; cluster covered |
| `Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_2.png` | 896×1344 | `#e2dac4` | `#ccc5b3` | `#e2dac4 #c3bcab #1d2126 #4e5254 #97948b` | pillow; cluster covered |

#### `le:Design_an_old_faded_page_from_the_Roswell_Clauson_` — 1 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_Design_an_old_faded_page_from_the_Roswell_Clauson__4d09b284-ed01-400c-be88-35efcd3d2f35_3.png` | 896×1344 | `#3d4143` | `#c3c3bb` | `#3d4143 #c5c5bd #9da19f` | pillow; cluster covered |

#### `le:Generate_ethereal_landing_page_featuring_this_quot` — 2 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_Generate_ethereal_landing_page_featuring_this_quot_55cebec1-5073-4561-a10d-8e094fc9461b_1.png` | 1024×1024 | `#2d2e31` | `#d3d2cc` | `#2d2e31 #deded6 #c7c6c0 #9e9d99` | pillow; cluster covered |
| `Liam_Ellis_Generate_ethereal_landing_page_featuring_this_quot_55cebec1-5073-4561-a10d-8e094fc9461b_3.png` | 1024×1024 | `#11191f` | `#bfc0b7` | `#11191f #d7d9d2 #a7a79e #4d4f4b` | pillow; cluster covered |

#### `le:Generate_the_grid_based_design_with_a_geometric_li` — 5 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_089ad411-540b-47ab-b57d-7066b6132f79_1.png` | 1536×768 | `#101010` | `#030303` | `#101010 #d6d5d6 #545454` | pillow; cluster covered |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_1 (1).png` | 1536×768 | `#201f1d` | `#30312f` | `#201f1d #646b6d #353736 #bec0ba` | pillow; cluster covered |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_1.png` | 1536×768 | `#201f1d` | `#30312f` | `#201f1d #646b6d #353736 #bec0ba` | pillow; cluster covered |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_2.png` | 1536×768 | `#a19e97` | `#a19d97` | `#a19e97 #bfbeb6 #393435 #8a8682` | pillow; cluster covered |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_3.png` | 1536×768 | `#feffff` | `#f0f0f0` | `#feffff #d7d7d7 #babbba #e9e9e9 #3a3d41` | pillow; cluster covered |

#### `le:Generate_the_grid_based_design_with_a_geometric_line` — 1 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_line_f3d847f9-1ec9-4c3b-9b0c-4891ae2df47b.png` | 3072×1536 | `#1e1d1b` | `#2e2f2e` | `#1e1d1b #62686b #333433 #434647 #bdbeba` | Panoramic dark HUD: white data-burst, copper graphs, planetary insets. |

#### `le:I_once_brought_you_fire._Now_I_bring_you_Disclosur` — 3 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_1.png` | 1024×1024 | `#000101` | `#868b85` | `#000101 #e9e3c3 #1f2123 #5a5f5e #b2afa0` | Classical bust + DISSCOURE type + ink splatter on cream. Prometheus/disclosure poster. |
| `Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_2.png` | 1024×1024 | `#bdb6a7` | `#9fa096` | `#bdb6a7 #212325 #0c0e0e #454b4c #878a83` | pillow; cluster covered |
| `Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_754da163-7f72-4361-a4c3-14595212511d_0.png` | 1024×1024 | `#beb8a6` | `#67625b` | `#beb8a6 #343236 #756e64 #585450 #dddccf` | pillow; cluster covered |

#### `le:The_most_merciful_thing_in_the_world_I_think_is_th` — 2 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_th_4cbdb52d-4efa-4794-ab29-40e590463c20_3.png` | 928×1232 | `#22201e` | `#211f1d` | `#22201e #998f86` | pillow; cluster covered |
| `Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_th_ec3c35af-94a3-4bf3-b687-1ad76d0a3fa0_3.png` | 1024×1024 | `#dddcd8` | `#dddbd7` | `#dddcd8 #36373b #a4a3a2` | pillow; cluster covered |

#### `le:The_most_merciful_thing_in_the_world_I_think_is_the_` — 1 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_the__b54c016b-3331-47a8-8299-3219c1fa34da.png` | 1856×2464 | `#c3baaa` | `#908a7e` | `#c3baaa #191817 #2d2b29 #a7a092 #666259` | pillow; cluster covered |

#### `le:USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe` — 1 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe_986f31ce-71d2-43ca-bcd0-ce319ca09cee_2.png` | 1232×928 | `#4c4941` | `#373532` | `#4c4941 #a09d8d #262424 #6c685b` | Night water + haze + cream HUD crosshair; encounter atmosphere. |

#### `le:httpss.mj.runDmF9DdUIsmM_a_monochrome_low_angle_cl` — 1 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_httpss.mj.runDmF9DdUIsmM_a_monochrome_low_angle_cl_e325289f-6b51-460d-bf97-052e6c2a7f33_0.PNG` | 928×1232 | `#2e2c31` | `#222127` | `#2e2c31 #0e0f17 #56555a` | Glitch portrait + umbrella on head; same family as IMG_3458. |

#### `le:httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU_` — 2 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU__0caaac09-32fe-4d3c-9bba-bf535e9851d4_2.png` | 1024×1024 | `#b6b7ad` | `#626862` | `#b6b7ad #20282a #46504f #838781` | pillow; cluster covered |
| `Liam_Ellis_httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU__0caaac09-32fe-4d3c-9bba-bf535e9851d4_3.png` | 1024×1024 | `#0e1414` | `#171c1b` | `#0e1414 #272b2b #6b6a63` | pillow; cluster covered |

#### `le:httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_ht` — 1 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `Liam_Ellis_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_ht_dab5a33f-a36e-4288-8e50-f2d5374a8098.png` | 1856×2464 | `#100e0c` | `#20201f` | `#100e0c #242423 #aca699 #373938 #706e6a` | pillow; cluster covered |

#### `root:cosmic-portals` — 10 stills, 2 vision-direct

Black-hole / corona brand stills with garbled UT type.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `cosmic-portals-1.png` | 1232×928 | `#000000` | `#120e0e` | `#000000 #5f4d48 #3b2622 #b29779 #18181c` | Black-hole ring, gold/cyan fiber flow, garbled ULTRATERRESTRIAL wordmark. |
| `cosmic-portals-13.png` | 1456×816 | `#050f27` | `#10081e` | `#050f27 #3e0f22 #3c4353 #2a2134` | pillow; cluster covered |
| `cosmic-portals-14.png` | 1456×816 | `#0b2a3f` | `#2c2026` | `#0b2a3f #340e16 #5f2a27 #8e745b #4c4044` | pillow; cluster covered |
| `cosmic-portals-15.png` | 1456×816 | `#101f36` | `#21182a` | `#101f36 #280e1e #38324b #561f32 #846578` | pillow; cluster covered |
| `cosmic-portals-16.png` | 1456×816 | `#281522` | `#2b1e2c` | `#281522 #51232d #755768` | pillow; cluster covered |
| `cosmic-portals-2.png` | 1232×928 | `#000000` | `#000305` | `#000000 #1f1b1d #6f6051` | pillow; cluster covered |
| `cosmic-portals-3.png` | 1232×928 | `#000000` | `#010103` | `#000000 #2b1d21 #dbb17a #784942` | pillow; cluster covered |
| `cosmic-portals-4.png` | 1232×928 | `#00040c` | `#080a11` | `#00040c #1d1318 #41272f #8d6764` | pillow; cluster covered |
| `cosmic-portals-5.png` | 1456×816 | `#000000` | `#010102` | `#000000 #24161a #6e4638` | pillow; cluster covered |
| `cosmic-portals-6.png` | 1456×816 | `#06020a` | `#11151b` | `#06020a #0f1f2a #42393b #978272 #361f25` | Eclipse + radial burst, cool-left/warm-right, motion-brand still. |

#### `root:numbered-webp` — 3 stills, 2 vision-direct

Parchment helix + forensic skull composites.

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `1164423244-img-1-01e94ca9.webp` | 1600×2400 | `#b3a27a` | `#cbb98e` | `#b3a27a #e0cfa3 #cebc91 #908366` | Da Vinci parchment double-helix / spiral-stair study. |
| `2357421291-img-3-9a06994d.webp` | 1600×2400 | `#d9d9d9` | `#d9d9d9` | `#d9d9d9 #383939 #a1a3a3` | pillow; cluster covered |
| `2357421291-img-4-f2619e35.webp` | 1600×2400 | `#f6f6f6` | `#c9c3b9` | `#f6f6f6 #a9a69d #cecac0 #857f75 #383532` | T. rex skull in sand + forensic red/green sensor overlays. |

#### `root:other:liam_algorithmic_self_portrait_seed_004.png` — 1 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `liam_algorithmic_self_portrait_seed_004.png` | 1400×1800 | `#090909` | `#090909` | `#090909 #2b2927` | Near-empty black field, nested cream+copper frames only. |

#### `root:phone-jpg` — 3 stills, 1 vision-direct

Surreal umbrella portraits (IMG_3458–3460).

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `IMG_3458.JPG` | 880×1184 | `#2b2f32` | `#2a2e31` | `#2b2f32 #090c10 #606265` | Surreal B/W portrait: umbrella balanced on forehead, inverted rain/splash. |
| `IMG_3459.JPG` | 880×1184 | `#2b2f32` | `#2b2f32` | `#2b2f32 #0e1115 #515557` | pillow; cluster covered |
| `IMG_3460.JPG` | 880×1184 | `#4f5458` | `#3d4145` | `#4f5458 #03070a #36393d #202427 #84878a` | pillow; cluster covered |

### root-midjourney

#### `mj:1._imagine_1978_NASA_dossier_cover_stamped_RECEIV` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_0.png` | 1232×928 | `#b2968c` | `#b6a490` | `#b2968c #c3b698 #dacba8 #836d6f #8c8b7c` | Folded NASA-ish dossier: magenta RESCINED/1972 stamps, barcodes, industrial insets. |
| `u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_1.png` | 1232×928 | `#9c8168` | `#9e8972` | `#9c8168 #7f6859 #b7a388 #cab99c #623c47` | pillow; cluster covered |
| `u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_2.png` | 1232×928 | `#c6b192` | `#bdab8f` | `#c6b192 #aa9f8b #98897a #854260 #d2cab9` | pillow; cluster covered |
| `u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_3.png` | 1232×928 | `#d8d0be` | `#cbbfad` | `#d8d0be #c6b8a5 #a29289 #885e70` | pillow; cluster covered |

#### `mj:1._imagine_Crumpled_dot-grid_engineering_journal_` — 8 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_0.png` | 1232×928 | `#1a1b1b` | `#a79a87` | `#1a1b1b #b8aa97 #d9cbb8 #71695c` | Crumpled cream journal + halftone planet window + dark numeric rail. |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_1.png` | 1232×928 | `#1a1b19` | `#676158` | `#1a1b19 #d2c7b2 #423f39 #9d9281` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_2.png` | 1232×928 | `#181b1a` | `#817766` | `#181b1a #d9ccb2 #afa189 #47443c` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_3.png` | 1232×928 | `#14120e` | `#2c2822` | `#14120e #c2b49c #dfd2b9 #38332d #7d7467` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__5b76bf35-3130-4514-ae3d-540c368dbeac_0.png` | 1232×928 | `#e5dbc7` | `#292927` | `#e5dbc7 #262524 #55504a #bdb3a2` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__5b76bf35-3130-4514-ae3d-540c368dbeac_1.png` | 1232×928 | `#171715` | `#4d483e` | `#171715 #b9a98e #d2c1a3 #2e2c27 #857966` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__5b76bf35-3130-4514-ae3d-540c368dbeac_2.png` | 1232×928 | `#171816` | `#433d36` | `#171816 #33302b #dac9b0 #bead94 #706558` | pillow; cluster covered |
| `u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__5b76bf35-3130-4514-ae3d-540c368dbeac_3.png` | 1232×928 | `#191817` | `#736758` | `#191817 #d6c9b0 #423c35 #9f927d` | pillow; cluster covered |

#### `mj:1._imagine_dot-grid_engineering_journal_page._Pap` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_34e3c082-7306-409a-a513-c4819f90738b_0.png` | 928×1232 | `#c3a796` | `#91715f` | `#c3a796 #0a0707 #a0806d #7b5b4a #39251d` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_34e3c082-7306-409a-a513-c4819f90738b_1.png` | 928×1232 | `#4e4e4e` | `#212222` | `#4e4e4e #151616 #323232 #959594` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_34e3c082-7306-409a-a513-c4819f90738b_2.png` | 928×1232 | `#12161a` | `#b9b9b9` | `#12161a #c1c2c2 #d6d6d6 #9e9e9e #4b4e50` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_34e3c082-7306-409a-a513-c4819f90738b_3.png` | 928×1232 | `#00030b` | `#00060d` | `#00030b #635e57` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_6feb8eda-2772-49fb-8119-8b4085c05361_0.png` | 928×1232 | `#f9faf4` | `#f8faf3` | `#f9faf4 #4e463c` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_6feb8eda-2772-49fb-8119-8b4085c05361_1.png` | 928×1232 | `#d0ccba` | `#b4b1a1` | `#d0ccba #9c9a8c #b9b7a6 #807f73 #353733` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_6feb8eda-2772-49fb-8119-8b4085c05361_2.png` | 928×1232 | `#e1dfd4` | `#cec9bb` | `#e1dfd4 #030709 #bbb4a5 #675e51` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_6feb8eda-2772-49fb-8119-8b4085c05361_3.png` | 928×1232 | `#cfd1ce` | `#c4c5c2` | `#cfd1ce #b5b6b2 #979691` | pillow; cluster covered |

#### `mj:1._imagine_dot-grid_engineering_journal_page_hand` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_2bace0f6-d3ab-42e3-b644-f74bd801626c_0.png` | 1232×928 | `#dad0bf` | `#cec3b2` | `#dad0bf #151515 #afa596 #c6bcab #706a60` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_2bace0f6-d3ab-42e3-b644-f74bd801626c_1.png` | 1232×928 | `#1c1a16` | `#c4b39c` | `#1c1a16 #d3c5ad #b6a58f #817668 #3b3730` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_2bace0f6-d3ab-42e3-b644-f74bd801626c_2.png` | 1232×928 | `#201e1c` | `#bfb198` | `#201e1c #dccfb6 #a09480 #b7a992 #686054` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_2bace0f6-d3ab-42e3-b644-f74bd801626c_3.png` | 1232×928 | `#d3c8b0` | `#c7bba5` | `#d3c8b0 #242421 #bdb19d #3f3c37 #948979` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_87f75a98-2733-460e-9a15-4d769eb39a0f_0.png` | 1232×928 | `#1f1d1b` | `#b5a78f` | `#1f1d1b #cdbfa6 #aea089 #61594c` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_87f75a98-2733-460e-9a15-4d769eb39a0f_1.png` | 1232×928 | `#1e1d1b` | `#bbae97` | `#1e1d1b #dbcfb6 #b3a690 #9f9480 #615a4f` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_87f75a98-2733-460e-9a15-4d769eb39a0f_2.png` | 1232×928 | `#232220` | `#bbad97` | `#232220 #cec0a6 #9a8f7c #b1a58f #5f584d` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_87f75a98-2733-460e-9a15-4d769eb39a0f_3.png` | 1232×928 | `#c8baa1` | `#b7aa95` | `#c8baa1 #1c1c1a #968a78 #ada18c #d9cdb6` | pillow; cluster covered |

#### `mj:1._imagine_dot-grid_engineering_journal_page_hand-d` — 3 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand-d_961739e4-ca6b-4a7a-81bb-d9f6ae81affa.png` | 2464×1856 | `#1f1e1c` | `#bfb19a` | `#1f1e1c #d7c8ae #9f9381 #b7a993 #675f54` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand-d_db95fd23-b54b-4529-99c8-50dae6bd0346.png` | 2464×1856 | `#161515` | `#b5a890` | `#161515 #d0c1a5 #ada08a #958a77 #5d564b` | pillow; cluster covered |
| `u7869492466_1._imagine_dot-grid_engineering_journal_page_hand-d_e76b1e85-961c-4621-bf48-3edc15be15d4.png` | 2464×1856 | `#1b1c1a` | `#cabda6` | `#1b1c1a #d1c4ac #928878 #36332f` | pillow; cluster covered |

#### `mj:A_potrait_of_Prometheus_the_Titan_and_demi_god_in` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_0.png` | 928×1232 | `#e0dfd9` | `#dfdfd9` | `#e0dfd9 #9b9fa1` | Engraved Prometheus head pierced by arrow in geometric/alchemical frame. |
| `u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_1.png` | 928×1232 | `#171818` | `#171818` | `#171818 #555149` | pillow; cluster covered |
| `u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_2.png` | 928×1232 | `#161b1a` | `#171c1b` | `#161b1a #47453f` | pillow; cluster covered |
| `u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_3.png` | 928×1232 | `#beaf93` | `#beaf93` | `#beaf93 #938773 #a89b81 #766d5d` | pillow; cluster covered |

#### `mj:A_sketched_line_drawing_of_Prometheus_the_Titan_a` — 31 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_0.png` | 928×1232 | `#888888` | `#595959` | `#888888 #535353 #101111 #6d6d6d #2d2d2d` | Grayscale statue + temple + Fibonacci overlay. Largest MJ cluster (31). |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_1.png` | 928×1232 | `#262626` | `#2e2e2e` | `#262626 #9a9b9b #0e0e0f #7c7c7c #bcbdbd` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_2.png` | 928×1232 | `#c1c1c1` | `#848585` | `#c1c1c1 #767777 #12171c #ababac #303336` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_3.png` | 928×1232 | `#434442` | `#3b3b3a` | `#434442 #2d2e2d #131517 #8b8b87` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_0.png` | 928×1232 | `#ffffff` | `#fdfeff` | `#ffffff #eceded` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_1.png` | 928×1232 | `#ffffff` | `#ffffff` | `#ffffff #dbdbdb #aaa9aa` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_2.png` | 928×1232 | `#ffffff` | `#ffffff` | `#ffffff #ebecec #cdcdcd` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_3.png` | 928×1232 | `#ffffff` | `#ffffff` | `#ffffff #dbdbdc` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_70deacdb-63d1-4c73-ab16-660e306f3863_0.png` | 928×1232 | `#242424` | `#453e38` | `#242424 #a29b81 #8b7f68 #beb897 #5c5c52` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_70deacdb-63d1-4c73-ab16-660e306f3863_1.png` | 928×1232 | `#bdb297` | `#988c74` | `#bdb297 #121618 #a49980 #2d2725 #736858` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_70deacdb-63d1-4c73-ab16-660e306f3863_2.png` | 928×1232 | `#0e0d0c` | `#0f0e0d` | `#0e0d0c #c0b49e #332f2a` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_70deacdb-63d1-4c73-ab16-660e306f3863_3.png` | 928×1232 | `#161b1d` | `#1d282b` | `#161b1d #324143 #899385` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_7d33466f-0435-4dd7-83a5-bc407660200e_0.png` | 928×1232 | `#515152` | `#2b2c2d` | `#515152 #2e2f30 #141516 #7c7d7e` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_7d33466f-0435-4dd7-83a5-bc407660200e_1.png` | 928×1232 | `#0a0d14` | `#25282c` | `#0a0d14 #737373 #8b8c8b #393a3b #5c5c5c` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_7d33466f-0435-4dd7-83a5-bc407660200e_2.png` | 928×1232 | `#545556` | `#7f8080` | `#545556 #8a8b8b #babbbc #cecfd0 #3c3e3f` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_b7a46dc9-58d2-491e-89cb-a48117b2e1ba_0.png` | 928×1232 | `#181715` | `#1b1917` | `#181715 #4a423a #b39f84` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_b7a46dc9-58d2-491e-89cb-a48117b2e1ba_1.png` | 928×1232 | `#616961` | `#15232a` | `#616961 #061018 #1d2b31 #374446 #a79e85` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_b7a46dc9-58d2-491e-89cb-a48117b2e1ba_2.png` | 928×1232 | `#010001` | `#2a221f` | `#010001 #a8917d #907967 #68584e #3b332f` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_b7a46dc9-58d2-491e-89cb-a48117b2e1ba_3.png` | 928×1232 | `#232321` | `#302e2a` | `#232321 #9d8e6d #686051 #45413a` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_dc230aef-6be0-4168-85fd-87ea56da081d_0.png` | 928×1232 | `#ffffff` | `#feffff` | `#ffffff #eaebeb #d5d5d5` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_dc230aef-6be0-4168-85fd-87ea56da081d_1.png` | 928×1232 | `#ffffff` | `#feffff` | `#ffffff #ebecec #d4d4d5` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_dc230aef-6be0-4168-85fd-87ea56da081d_2.png` | 928×1232 | `#ffffff` | `#fefeff` | `#ffffff #eceded #d9d9da` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_dc230aef-6be0-4168-85fd-87ea56da081d_3.png` | 928×1232 | `#ffffff` | `#feffff` | `#ffffff #e8e8e9 #d4d4d5` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_e37d0e86-90da-4e1c-b7ba-e7888e6c16e3_0.png` | 928×1232 | `#ffffff` | `#ffffff` | `#ffffff #dadada #b8b8b8` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_e37d0e86-90da-4e1c-b7ba-e7888e6c16e3_1.png` | 928×1232 | `#ffffff` | `#ffffff` | `#ffffff #dfe0e2` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_e37d0e86-90da-4e1c-b7ba-e7888e6c16e3_2.png` | 928×1232 | `#ffffff` | `#feffff` | `#ffffff #d9d9d9 #ebebeb #ababac` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_e37d0e86-90da-4e1c-b7ba-e7888e6c16e3_3.png` | 928×1232 | `#d7cfcb` | `#e6e2df` | `#d7cfcb #efe9e3 #aaa29f` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_ea3472ef-a700-4664-ae2c-37357f6f35ca_0.png` | 928×1232 | `#0b0f16` | `#282a2d` | `#0b0f16 #727473 #585a59 #8f908f #383a3a` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_ea3472ef-a700-4664-ae2c-37357f6f35ca_1.png` | 928×1232 | `#777777` | `#2b2e31` | `#777777 #0c1017 #5c5c5c #8e8e8e #3e3f3f` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_ea3472ef-a700-4664-ae2c-37357f6f35ca_2.png` | 928×1232 | `#0c1118` | `#292c2e` | `#0c1118 #69696a #38393a #505051 #808080` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_ea3472ef-a700-4664-ae2c-37357f6f35ca_3.png` | 928×1232 | `#6e6e6e` | `#1f2124` | `#6e6e6e #16191e #01060c #545454 #2b2c2e` | pillow; cluster covered |

#### `mj:A_sketched_line_drawing_of_Prometheus_the_Titan_and` — 3 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_and_1fd39068-c15f-430a-9f1a-fb1eaf4e76ec.png` | 1856×2464 | `#0a0d12` | `#8b8e91` | `#0a0d12 #838689 #b8bbbd #a4a7aa #707376` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_and_55084de8-e5c1-435b-a585-64ee36af56ec.png` | 1856×2464 | `#0a0d11` | `#85888b` | `#0a0d11 #7c8083 #9ea1a3 #b2b4b6 #cecfd1` | pillow; cluster covered |
| `u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_and_b07ef3ef-9a86-40e5-b11a-e1a7e5f03b56.png` | 1856×2464 | `#090c12` | `#232529` | `#090c12 #888888 #707070 #59595a #373738` | pillow; cluster covered |

#### `mj:Help_me_design_spy-lab_meets_AI-war_room_moodboar` — 8 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_0.png` | 928×1232 | `#c8c2b4` | `#998d79` | `#c8c2b4 #9c9a91 #947f61 #171513 #e1ded5` | Spy-lab evidence wall: TOP SECRET red, legal pad, lab glass, fog figure. |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_1.png` | 928×1232 | `#1e1c1a` | `#918881` | `#1e1c1a #c4c4c5 #b6aaa5 #090909 #e0e3e6` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_2.png` | 928×1232 | `#272825` | `#7f7056` | `#272825 #ab9e80 #877d66 #bdb49b #695e4b` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_3.png` | 928×1232 | `#222120` | `#5d4f42` | `#222120 #020303 #a5896c #b6a993 #d7d3c7` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_e68c2b60-897a-4b5a-b924-9a05985172df_0.png` | 928×1232 | `#000000` | `#191013` | `#000000 #eae5dc #8c7866 #b3a99f #262525` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_e68c2b60-897a-4b5a-b924-9a05985172df_1.png` | 928×1232 | `#000000` | `#1f1c18` | `#000000 #23221d #ba8f5f #c8b38d #4b3b30` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_e68c2b60-897a-4b5a-b924-9a05985172df_2.png` | 928×1232 | `#0e100f` | `#2e4135` | `#0e100f #8d6f53 #d0ddde #495950 #99aba7` | pillow; cluster covered |
| `u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_e68c2b60-897a-4b5a-b924-9a05985172df_3.png` | 928×1232 | `#b89f78` | `#696050` | `#b89f78 #040000 #5f423c #bdc1b3 #dfd5c3` | pillow; cluster covered |

#### `mj:Interior_of_the_ancient_Martian_pyramid--vast_hal` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_0.png` | 1344×896 | `#553928` | `#27140a` | `#553928 #100402 #3c2214 #9c816d` | Hieroglyph hall, amber portal mist, ancient-alien interior. |
| `u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_1.png` | 1344×896 | `#21110f` | `#321a16` | `#21110f #4c2620 #6c4c47 #bba8a4` | pillow; cluster covered |
| `u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_2.png` | 1344×896 | `#3c1e18` | `#211613` | `#3c1e18 #1a0b0a #403832 #8f8f85` | pillow; cluster covered |
| `u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_3.png` | 1344×896 | `#070505` | `#181314` | `#070505 #463e3d #161b23 #818181` | pillow; cluster covered |

#### `mj:Marcus_Aurelius_poses_contemplatively_late_in_his` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_0.png` | 1232×928 | `#302518` | `#371e14` | `#302518 #5e3720 #160e0c #4b1411 #9c7951` | Baroque oil emperor: crimson robe, gold crown, chiaroscuro. |
| `u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_1.png` | 1232×928 | `#110a0c` | `#270f0f` | `#110a0c #773827 #691d17 #a07054 #32080d` | pillow; cluster covered |
| `u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_2.png` | 1232×928 | `#110f0f` | `#2b1312` | `#110f0f #8c5045 #6c2c27 #311d18 #ae8373` | pillow; cluster covered |
| `u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_3.png` | 1232×928 | `#342313` | `#391a11` | `#342313 #110a0c #6b3f28 #a67552` | pillow; cluster covered |

#### `mj:The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_0.png` | 1680×720 | `#0c191a` | `#0f201e` | `#0c191a #0c3b22 #512522 #584930` | Ultrawide pyramid split green/red night lighting. |
| `u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_1.png` | 1680×720 | `#26341e` | `#282918` | `#26341e #19120b #4e4c27 #58822d` | pillow; cluster covered |
| `u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_2.png` | 1680×720 | `#26342e` | `#0d191b` | `#26342e #0b1f1e #4a6d4e` | pillow; cluster covered |
| `u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_3.png` | 1680×720 | `#164731` | `#1e3a28` | `#164731 #041817 #a19d69 #312c1e #624c2e` | pillow; cluster covered |

#### `mj:httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of_` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of__77cab51b-64ea-4382-b797-908d3bfd1c43_0.png` | 1232×928 | `#3a4346` | `#3c4141` | `#3a4346 #0a070d #907d66 #222122 #4b352e` | pillow; cluster covered |
| `u7869492466_httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of__77cab51b-64ea-4382-b797-908d3bfd1c43_1.png` | 1232×928 | `#2c3539` | `#2d3334` | `#2c3539 #0f050b #90826e #504840 #1b2124` | pillow; cluster covered |
| `u7869492466_httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of__77cab51b-64ea-4382-b797-908d3bfd1c43_2.png` | 1232×928 | `#414746` | `#44423e` | `#414746 #5f5c54 #05050e #2d3333 #251a17` | pillow; cluster covered |
| `u7869492466_httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of__77cab51b-64ea-4382-b797-908d3bfd1c43_3.png` | 1232×928 | `#5a5b54` | `#4a4a44` | `#5a5b54 #0e0b0f #373935 #291d1b #998b77` | pillow; cluster covered |

#### `mj:httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs` — 24 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_01a5095e-da53-4d20-882c-c10fac25f9dc_0.png` | 928×1232 | `#c8bcaa` | `#a09380` | `#c8bcaa #0b0c0b #aa9d8a #8d816f #434037` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_01a5095e-da53-4d20-882c-c10fac25f9dc_1.png` | 928×1232 | `#b0a799` | `#b9ac9f` | `#b0a799 #d6caba #71695d #201e1a` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_01a5095e-da53-4d20-882c-c10fac25f9dc_2.png` | 928×1232 | `#908a77` | `#969280` | `#908a77 #0f0c09 #b5b9b0 #cbd1cc #3e362a` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_01a5095e-da53-4d20-882c-c10fac25f9dc_3.png` | 928×1232 | `#0f1010` | `#b8b0a8` | `#0f1010 #e2d7cd #c3bab2 #9c958e #393734` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6b1c3302-fa64-4fd8-b8df-cb9187240900_0.png` | 928×1232 | `#0a0c0e` | `#413d3e` | `#0a0c0e #a29f97 #bcb8ad #292726 #ddd7c8` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6b1c3302-fa64-4fd8-b8df-cb9187240900_1.png` | 928×1232 | `#161d25` | `#8f806d` | `#161d25 #7d6e5b #c6b8a6 #9c8d7a #d6caba` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6b1c3302-fa64-4fd8-b8df-cb9187240900_2.png` | 928×1232 | `#d7cab5` | `#cdbda7` | `#d7cab5 #10171b #beab92 #736b5e` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6b1c3302-fa64-4fd8-b8df-cb9187240900_3.png` | 928×1232 | `#0c0f10` | `#8b887b` | `#0c0f10 #c5beb2 #9f9b92 #414340` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6d4d128f-834c-4718-91ed-c743a66acb93_0.png` | 928×1232 | `#1d2124` | `#d0ba9b` | `#1d2124 #dcc7a8 #b69e81 #eaddc2 #6b6052` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6d4d128f-834c-4718-91ed-c743a66acb93_1.png` | 928×1232 | `#000000` | `#b8a68b` | `#000000 #2e2922 #ebdabe #cbb89c #80725e` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6d4d128f-834c-4718-91ed-c743a66acb93_2.png` | 928×1232 | `#d9cebb` | `#c9bba9` | `#d9cebb #1a1e22 #a59788 #bfb19f #635a52` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6d4d128f-834c-4718-91ed-c743a66acb93_3.png` | 928×1232 | `#c6b7a4` | `#b7a38f` | `#c6b7a4 #0b0808 #b49b84 #694938` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_a690c1fa-f6ac-40aa-b1e0-d419bff63adf_0.png` | 928×1232 | `#141414` | `#beb7ad` | `#141414 #ddd5cc #c7c0b6 #979086 #31302d` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_a690c1fa-f6ac-40aa-b1e0-d419bff63adf_1.png` | 928×1232 | `#0e0f0f` | `#b9b0a2` | `#0e0f0f #c0bab0 #d7d0c7 #9f968b #3a3c3a` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_a690c1fa-f6ac-40aa-b1e0-d419bff63adf_2.png` | 928×1232 | `#121313` | `#bbb3a8` | `#121313 #c4bbb0 #e0d9d0 #a49a8f #3f3f3b` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_a690c1fa-f6ac-40aa-b1e0-d419bff63adf_3.png` | 928×1232 | `#090907` | `#bcb2a6` | `#090907 #c4bbaf #e4dbcf #9c9285 #25221c` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_fb6dc59e-6947-4f4b-8945-b9e07997a773_0.png` | 928×1232 | `#cdc5bc` | `#c2b9ae` | `#cdc5bc #14141c #bbb2a7 #a59b90 #594f4a` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_fb6dc59e-6947-4f4b-8945-b9e07997a773_1.png` | 928×1232 | `#a6a79f` | `#a2a096` | `#a6a79f #131312 #d3d7d1 #5f615a #bfc1ba` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_fb6dc59e-6947-4f4b-8945-b9e07997a773_2.png` | 928×1232 | `#171717` | `#a8a092` | `#171717 #c8beae #f1e8d7 #67645d` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_fb6dc59e-6947-4f4b-8945-b9e07997a773_3.png` | 928×1232 | `#e0dad2` | `#c1bbb5` | `#e0dad2 #090b11 #cac4bd #aeaaa5 #303138` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_feff7687-3260-49c2-8a52-35e9b933f741_0.png` | 928×1232 | `#d3cfc9` | `#bdb7ae` | `#d3cfc9 #242220 #b6afa6 #a19a92 #6c6760` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_feff7687-3260-49c2-8a52-35e9b933f741_1.png` | 928×1232 | `#d9d5cf` | `#ccc5bb` | `#d9d5cf #88827b #a9a299 #c2bbb1 #2c2c2b` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_feff7687-3260-49c2-8a52-35e9b933f741_2.png` | 928×1232 | `#30312f` | `#bcb4a9` | `#30312f #d8d1c5 #afa89d #c2bcb3 #73706c` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_feff7687-3260-49c2-8a52-35e9b933f741_3.png` | 928×1232 | `#c3bbb0` | `#bbb3a9` | `#c3bbb0 #e4ddd2 #857d75 #a59f97 #413e3b` | pillow; cluster covered |

#### `mj:httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m_03dbcb17-e2e7-43e2-87c2-8e6a6c3cec83_0.png` | 928×1232 | `#3a3732` | `#37342f` | `#3a3732 #e2d6b6 #000000 #141414 #978a75` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m_03dbcb17-e2e7-43e2-87c2-8e6a6c3cec83_1.png` | 928×1232 | `#000000` | `#231f1e` | `#000000 #1d1819 #5d5548 #e1dacd #322b27` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m_03dbcb17-e2e7-43e2-87c2-8e6a6c3cec83_2.png` | 928×1232 | `#000101` | `#2e2724` | `#000101 #221b1a #665447 #d9ceab #3b3733` | pillow; cluster covered |
| `u7869492466_httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m_03dbcb17-e2e7-43e2-87c2-8e6a6c3cec83_3.png` | 928×1232 | `#585147` | `#433c36` | `#585147 #262728 #e7dec5 #050606 #8d8475` | pillow; cluster covered |

#### `mj:httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo_d9f2e26d-3546-41bc-83ae-55d772e7a488_0.png` | 928×1232 | `#dad1c4` | `#c8beb3` | `#dad1c4 #b5aba0 #0e0e0e #907e6c` | pillow; cluster covered |
| `u7869492466_httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo_d9f2e26d-3546-41bc-83ae-55d772e7a488_1.png` | 928×1232 | `#d3ccc2` | `#c0bab2` | `#d3ccc2 #000000 #b0aba3 #907e66` | pillow; cluster covered |
| `u7869492466_httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo_d9f2e26d-3546-41bc-83ae-55d772e7a488_2.png` | 928×1232 | `#838386` | `#887f7e` | `#838386 #979597 #504641 #997550 #bdbbbb` | pillow; cluster covered |
| `u7869492466_httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo_d9f2e26d-3546-41bc-83ae-55d772e7a488_3.png` | 928×1232 | `#212222` | `#b4afa2` | `#212222 #c9c6b8 #605e59` | pillow; cluster covered |

#### `mj:httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_240d94a9-d69a-423f-936b-2ffc68f17ff7_0.png` | 1232×928 | `#0a0b0b` | `#7f7165` | `#0a0b0b #b9a490 #938373 #5a544d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_240d94a9-d69a-423f-936b-2ffc68f17ff7_1.png` | 1232×928 | `#0e0e0e` | `#3d3e3c` | `#0e0e0e #676762 #313130 #4b4b47 #d2d3cc` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_240d94a9-d69a-423f-936b-2ffc68f17ff7_2.png` | 1232×928 | `#858686` | `#a3a4a4` | `#858686 #b7b8b8 #9d9e9e #626262` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_240d94a9-d69a-423f-936b-2ffc68f17ff7_3.png` | 1232×928 | `#000000` | `#78746d` | `#000000 #f1e0c8 #a9a193 #686661 #ccbfad` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_241eec57-c0aa-457f-b549-c849d94c29fe_0.png` | 1232×928 | `#000000` | `#000101` | `#000000 #c8c1af #e2d6c1 #3f3e3e #96938b` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_241eec57-c0aa-457f-b549-c849d94c29fe_1.png` | 1232×928 | `#cbc2a8` | `#b7ad95` | `#cbc2a8 #1a1a1a #a9a08b #5a5751` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_241eec57-c0aa-457f-b549-c849d94c29fe_2.png` | 1232×928 | `#8e8578` | `#968d7e` | `#8e8578 #000101 #bdad93 #d1c1a4 #5b564e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_241eec57-c0aa-457f-b549-c849d94c29fe_3.png` | 1232×928 | `#292c2d` | `#5c5843` | `#292c2d #666148 #7e7655 #c3b683 #9e9367` | pillow; cluster covered |

#### `mj:httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk_2749385a-059c-4e09-a965-94f33a1d96ee_0.png` | 1232×928 | `#000000` | `#2c2c2b` | `#000000 #f1d1a9 #9d8165` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk_2749385a-059c-4e09-a965-94f33a1d96ee_1.png` | 1232×928 | `#f7edd9` | `#c1a79a` | `#f7edd9 #b4978d #9f796f #440702 #cfb9aa` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk_2749385a-059c-4e09-a965-94f33a1d96ee_2.png` | 1232×928 | `#17181c` | `#9c8773` | `#17181c #a69380 #d2c2ab #bcaa95 #e6d9c3` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk_2749385a-059c-4e09-a965-94f33a1d96ee_3.png` | 1232×928 | `#010101` | `#b5a496` | `#010101 #aa9888 #8f7a6c #d8d4cd #bcafa2` | pillow; cluster covered |

#### `mj:httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_59469168-febd-443f-9f67-082732d15bfc_0.png` | 1232×928 | `#0c0c0c` | `#bbac97` | `#0c0c0c #daccb6 #c5b6a0 #a7917b #3f332c` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_59469168-febd-443f-9f67-082732d15bfc_1.png` | 1232×928 | `#060606` | `#bc9a77` | `#060606 #dcd2c3 #c2a383 #c6baa9 #a6876a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_59469168-febd-443f-9f67-082732d15bfc_2.png` | 1232×928 | `#000101` | `#cbbeab` | `#000101 #dfd6c7 #c2b5a3 #a49a8b #1b1a17` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_59469168-febd-443f-9f67-082732d15bfc_3.png` | 1232×928 | `#d4ccbd` | `#ccc2b0` | `#d4ccbd #0a0a09 #998c7d #332b25` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_ceb33309-73e4-4c35-9539-0fdbc1e6f342_0.png` | 928×1232 | `#000000` | `#171817` | `#000000 #ebe6da #121312 #262625 #b4b0a7` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_ceb33309-73e4-4c35-9539-0fdbc1e6f342_1.png` | 928×1232 | `#050706` | `#7f7c70` | `#050706 #d3cfbe #a3a398 #bcbaac #89897e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_ceb33309-73e4-4c35-9539-0fdbc1e6f342_2.png` | 928×1232 | `#010303` | `#a09e97` | `#010303 #c8c8c0 #a8a79f #918e87 #494c4a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_ceb33309-73e4-4c35-9539-0fdbc1e6f342_3.png` | 928×1232 | `#111212` | `#c1b6a5` | `#111212 #b8ae9e #dfd4c0 #262522 #8b7f70` | pillow; cluster covered |

#### `mj:httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc_3b292746-7af6-4c9d-96b1-bbc0b69122fa_0.png` | 1232×928 | `#d6d4d4` | `#cecac9` | `#d6d4d4 #c4c1bf #b2aeae #555763` | pillow; cluster covered |
| `u7869492466_httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc_3b292746-7af6-4c9d-96b1-bbc0b69122fa_1.png` | 1232×928 | `#dbd7d4` | `#ccbcab` | `#dbd7d4 #a3917f #d4c5b5 #897767 #bbab9a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc_3b292746-7af6-4c9d-96b1-bbc0b69122fa_2.png` | 1232×928 | `#1c1c1c` | `#1d1e1e` | `#1c1c1c #d0c9c3 #e4dfda #605e5d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc_3b292746-7af6-4c9d-96b1-bbc0b69122fa_3.png` | 1232×928 | `#000001` | `#b6b2af` | `#000001 #b0aca8 #c6c2bf #90857d #1f1816` | pillow; cluster covered |

#### `mj:httpss.mj.runMZMhansvdqw_A_sketched_line_drawing_` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runMZMhansvdqw_A_sketched_line_drawing__7c01ff1c-f95b-4406-bbb8-22444f308fc8_0.png` | 928×1232 | `#b5b5af` | `#abaaa4` | `#b5b5af #a0a099 #34383d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_A_sketched_line_drawing__7c01ff1c-f95b-4406-bbb8-22444f308fc8_1.png` | 928×1232 | `#9e9e99` | `#adada8` | `#9e9e99 #c2c2bc #888886 #2c2e31` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_A_sketched_line_drawing__7c01ff1c-f95b-4406-bbb8-22444f308fc8_2.png` | 928×1232 | `#9c9b97` | `#8c8b87` | `#9c9b97 #7c7b77 #696865 #181c20` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_A_sketched_line_drawing__7c01ff1c-f95b-4406-bbb8-22444f308fc8_3.png` | 928×1232 | `#babab3` | `#a7a7a2` | `#babab3 #989893 #848581 #2c2f32` | pillow; cluster covered |

#### `mj:httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_49468e14-3558-4d52-8cff-211708dea5b0_0.png` | 928×1232 | `#13171a` | `#545551` | `#13171a #9d9d95 #888780 #6b6b65 #c0c1ba` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_49468e14-3558-4d52-8cff-211708dea5b0_1.png` | 928×1232 | `#c9ccc5` | `#a2a6a2` | `#c9ccc5 #8c908d #a6aaa5 #1d1f22 #6b6e6e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_49468e14-3558-4d52-8cff-211708dea5b0_2.png` | 928×1232 | `#908d84` | `#5c5f5f` | `#908d84 #7b7b75 #272e34 #4f5456 #666866` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_49468e14-3558-4d52-8cff-211708dea5b0_3.png` | 928×1232 | `#9fa6a4` | `#868b88` | `#9fa6a4 #6e716d #8a918d #565855 #121417` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_aff6331e-cd76-4059-af46-ffa3721eb41b_0.png` | 928×1232 | `#a0a39b` | `#80837c` | `#a0a39b #0c1115 #878a81 #595c59 #747771` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_aff6331e-cd76-4059-af46-ffa3721eb41b_1.png` | 928×1232 | `#9fa49c` | `#777a76` | `#9fa49c #191d23 #6e716e #595d5c #353a3d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_aff6331e-cd76-4059-af46-ffa3721eb41b_2.png` | 928×1232 | `#a6a9a2` | `#7b8280` | `#a6a9a2 #0d1215 #838a87 #6e7675 #515b5c` | pillow; cluster covered |
| `u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_aff6331e-cd76-4059-af46-ffa3721eb41b_3.png` | 928×1232 | `#a4a59a` | `#7b807b` | `#a4a59a #0f1417 #6f7572 #838882 #51595a` | pillow; cluster covered |

#### `mj:httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_0.png` | 1232×928 | `#0d0e0e` | `#0e100f` | `#0d0e0e #252b29 #5d6258` | Profile dissolving into orange embers + cyan datastream; DADLIUS. |
| `u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_1.png` | 1232×928 | `#080b0c` | `#101111` | `#080b0c #607168 #798c80 #25221f` | pillow; cluster covered |
| `u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_2.png` | 1232×928 | `#050809` | `#070a0b` | `#050809 #3b4039` | pillow; cluster covered |
| `u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_3.png` | 1232×928 | `#090b0a` | `#090b0b` | `#090b0a #3b3f3a` | pillow; cluster covered |

#### `mj:httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU_835e966b-de12-44cb-966a-3ffa352290c7_0.png` | 928×1232 | `#272624` | `#2a2a27` | `#272624 #3f3f3b #5b5d5b #9f9f94` | pillow; cluster covered |
| `u7869492466_httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU_835e966b-de12-44cb-966a-3ffa352290c7_1.png` | 928×1232 | `#070b0e` | `#101315` | `#070b0e #b7ae9d #2f2d2d #797066` | pillow; cluster covered |
| `u7869492466_httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU_835e966b-de12-44cb-966a-3ffa352290c7_2.png` | 928×1232 | `#0d1114` | `#191c1d` | `#0d1114 #2a2b2a #c6b89a #5a564e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU_835e966b-de12-44cb-966a-3ffa352290c7_3.png` | 928×1232 | `#2b2e32` | `#4b4e51` | `#2b2e32 #c4b6a0 #a29a8e #e2cfac #6a6a6a` | pillow; cluster covered |

#### `mj:httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE_0e9dbe55-1f26-4ae5-961c-aa3665d4b446_0.png` | 1232×928 | `#151616` | `#6f6b64` | `#151616 #d9d0bc #3b3a37 #9d978a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE_0e9dbe55-1f26-4ae5-961c-aa3665d4b446_1.png` | 1232×928 | `#151616` | `#ada491` | `#151616 #bab19d #d3cbb5 #6d685f` | pillow; cluster covered |
| `u7869492466_httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE_0e9dbe55-1f26-4ae5-961c-aa3665d4b446_2.png` | 1232×928 | `#d3ccbb` | `#ada697` | `#d3ccbb #232323 #bbb4a4 #77736b` | pillow; cluster covered |
| `u7869492466_httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE_0e9dbe55-1f26-4ae5-961c-aa3665d4b446_3.png` | 1232×928 | `#dad4c3` | `#444443` | `#dad4c3 #2f2f30 #191a1a #605f5c` | pillow; cluster covered |

#### `mj:httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI` — 9 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_15038641-5418-4c82-9188-8597024123e0_0.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_15038641-5418-4c82-9188-8597024123e0_1.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_15038641-5418-4c82-9188-8597024123e0_2.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_15038641-5418-4c82-9188-8597024123e0_3.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_aa7822f0-5004-40ad-ab07-1bb0b9e5b5f3_0.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_aa7822f0-5004-40ad-ab07-1bb0b9e5b5f3_1.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_aa7822f0-5004-40ad-ab07-1bb0b9e5b5f3_2.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_aa7822f0-5004-40ad-ab07-1bb0b9e5b5f3_3.png` | 1456×816 | `#161c2a` | `#19212c` | `#161c2a #293543 #47545e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_f7cfb06d-b3d9-4250-8566-b3fb6975c61c_0.png` | 1456×816 | `#020206` | `#0a0c10` | `#020206 #1a1f24 #374a4f` | pillow; cluster covered |

#### `mj:httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_h` — 1 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_h_84b044ed-2eb0-4bda-badf-5b5625e8ba33.png` | 2912×1632 | `#131a27` | `#161e29` | `#131a27 #25323f #424f5a` | pillow; cluster covered |

#### `mj:httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_3ca388dd-f5ca-402c-b343-3224baa2a2b9_0.png` | 1232×928 | `#00050f` | `#000912` | `#00050f #0e2029 #484c49` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_3ca388dd-f5ca-402c-b343-3224baa2a2b9_1.png` | 1232×928 | `#081418` | `#081418` | `#081418 #484b41` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_3ca388dd-f5ca-402c-b343-3224baa2a2b9_2.png` | 1232×928 | `#00020a` | `#00020b` | `#00020a #746e65` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_3ca388dd-f5ca-402c-b343-3224baa2a2b9_3.png` | 1232×928 | `#0e1c22` | `#000911` | `#0e1c22 #00060f #5d564b` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_672b7772-7e92-4050-b5b8-de64abf1460d_0.png` | 1232×928 | `#000104` | `#02060a` | `#000104 #131a1f #5e5f60` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_672b7772-7e92-4050-b5b8-de64abf1460d_1.png` | 1232×928 | `#00030a` | `#00050b` | `#00030a #6e6d64` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_672b7772-7e92-4050-b5b8-de64abf1460d_2.png` | 1232×928 | `#00040f` | `#000510` | `#00040f #5e6562` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_672b7772-7e92-4050-b5b8-de64abf1460d_3.png` | 1232×928 | `#00020d` | `#020c19` | `#00020d #1e262f #846f64` | pillow; cluster covered |

#### `mj:httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ` — 8 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_1807df27-3dff-4617-84c1-ffe6747d2019_0.png` | 1232×928 | `#c5c7c4` | `#bebfbd` | `#c5c7c4 #0c1118 #8b9295 #48545d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_1807df27-3dff-4617-84c1-ffe6747d2019_1.png` | 1232×928 | `#c4c6c3` | `#bfc2bf` | `#c4c6c3 #0d0d15 #2c3843 #7f898e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_1807df27-3dff-4617-84c1-ffe6747d2019_2.png` | 1232×928 | `#b3b5b3` | `#bec0be` | `#b3b5b3 #495156 #c5c8c5` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_1807df27-3dff-4617-84c1-ffe6747d2019_3.png` | 1232×928 | `#c6c8c5` | `#c6c8c5` | `#c6c8c5 #303c44 #acb1b0` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_fb00c0d5-e316-4893-ac27-d2c471e3da9e_0.png` | 1232×928 | `#c3c5c2` | `#a7a8a7` | `#c3c5c2 #78797a #8f908f #abadac #2a2d31` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_fb00c0d5-e316-4893-ac27-d2c471e3da9e_1.png` | 1232×928 | `#c6c7c3` | `#c5c6c3` | `#c6c7c3 #2c363e #a8acab` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_fb00c0d5-e316-4893-ac27-d2c471e3da9e_2.png` | 1232×928 | `#c5c7c4` | `#c5c7c4` | `#c5c7c4 #5f6265` | pillow; cluster covered |
| `u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_fb00c0d5-e316-4893-ac27-d2c471e3da9e_3.png` | 1232×928 | `#c6c7c3` | `#c5c7c3` | `#c6c7c3 #38454c` | pillow; cluster covered |

#### `mj:httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do_944948e4-a8be-47d6-9a8b-4c26d38dcbae_0.png` | 1232×928 | `#c6c0b6` | `#aea598` | `#c6c0b6 #a3998c #111418 #000000 #71685d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do_944948e4-a8be-47d6-9a8b-4c26d38dcbae_1.png` | 1232×928 | `#000306` | `#918677` | `#000306 #cec1ae #a29787 #766d61 #393733` | pillow; cluster covered |
| `u7869492466_httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do_944948e4-a8be-47d6-9a8b-4c26d38dcbae_2.png` | 1232×928 | `#b8ae9e` | `#141618` | `#b8ae9e #111315 #cec6b8 #80796e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do_944948e4-a8be-47d6-9a8b-4c26d38dcbae_3.png` | 1232×928 | `#b5ada3` | `#86796c` | `#b5ada3 #070a0d #95897c #504841` | pillow; cluster covered |

#### `mj:httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome` — 16 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_6638cef2-5849-4324-b780-5dd1871baa3a_0.png` | 928×1232 | `#928a7a` | `#8f8777` | `#928a7a #63544b` | DADALUS constructivist HUD: taupe ground, red vertical, gold circle. |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_6638cef2-5849-4324-b780-5dd1871baa3a_1.png` | 928×1232 | `#c7c8c8` | `#bdbdbd` | `#c7c8c8 #b0b0b0 #525353` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_6638cef2-5849-4324-b780-5dd1871baa3a_2.png` | 928×1232 | `#c3c3c3` | `#c3c2c2` | `#c3c3c3 #434444 #acaeaf` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_6638cef2-5849-4324-b780-5dd1871baa3a_3.png` | 928×1232 | `#c3c3c3` | `#c2c2c2` | `#c3c3c3 #222222 #919292` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_857cc86c-eed1-42e6-844d-1a29209f3c78_0.png` | 928×1232 | `#252525` | `#252525` | `#252525 #676d70` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_857cc86c-eed1-42e6-844d-1a29209f3c78_1.png` | 928×1232 | `#0c0d0d` | `#08090b` | `#0c0d0d #282d2f` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_857cc86c-eed1-42e6-844d-1a29209f3c78_2.png` | 928×1232 | `#141515` | `#151515` | `#141515` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_857cc86c-eed1-42e6-844d-1a29209f3c78_3.png` | 928×1232 | `#000000` | `#000000` | `#000000 #211f1c #413d33 #56644a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_bc9862bd-0a2e-41f3-9821-ac45e92d30c5_0.png` | 928×1232 | `#c7c7c7` | `#c7c7c7` | `#c7c7c7 #474848 #b1b1b1` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_bc9862bd-0a2e-41f3-9821-ac45e92d30c5_1.png` | 928×1232 | `#c1c1c1` | `#c1c1c1` | `#c1c1c1 #484949 #acaeae` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_bc9862bd-0a2e-41f3-9821-ac45e92d30c5_2.png` | 928×1232 | `#c5c5c5` | `#c5c5c5` | `#c5c5c5 #4c4d4d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_bc9862bd-0a2e-41f3-9821-ac45e92d30c5_3.png` | 928×1232 | `#c0c0c0` | `#c0c0bf` | `#c0c0c0 #525252` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_f3178295-8aa4-4efa-808b-3d6070070819_0.png` | 928×1232 | `#c5c5c3` | `#c4c5c1` | `#c5c5c3 #a9abaa #636464` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_f3178295-8aa4-4efa-808b-3d6070070819_1.png` | 928×1232 | `#c8c9c6` | `#c7c7c5` | `#c8c9c6 #636668 #abadad` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_f3178295-8aa4-4efa-808b-3d6070070819_2.png` | 928×1232 | `#494c4e` | `#bcbdbb` | `#494c4e #bdbebb #9b9c9c` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_f3178295-8aa4-4efa-808b-3d6070070819_3.png` | 928×1232 | `#c7c7bf` | `#c7c7be` | `#c7c7bf #aaaba5 #3f4445 #888987` | pillow; cluster covered |

#### `mj:httpss.mj.runsZhUawvy0ak_Make_more_line_and_geometr` — 1 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geometr_537f4ec9-9395-4099-b8ba-830fcf61c132.png` | 1856×2464 | `#c1c1c1` | `#c1c1c1` | `#c1c1c1 #3f3f3f #a2a4a5` | pillow; cluster covered |

#### `mj:httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4` — 18 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_3cd6a84a-3cbd-4231-a4a3-7c7d20d6c316_0.png` | 928×1232 | `#1c2427` | `#182023` | `#1c2427 #303839 #a19676` | Marble titan bust + gold nebula + crosshair on navy. 18-still cluster. |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_3cd6a84a-3cbd-4231-a4a3-7c7d20d6c316_1.png` | 928×1232 | `#192225` | `#182123` | `#192225 #343d3d #a09676` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_3cd6a84a-3cbd-4231-a4a3-7c7d20d6c316_2.png` | 928×1232 | `#141c1f` | `#161e21` | `#141c1f #404644 #a89c7a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_3cd6a84a-3cbd-4231-a4a3-7c7d20d6c316_3.png` | 928×1232 | `#131a1b` | `#171f22` | `#131a1b #3d4240 #b2a37e` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7e3e3b4d-dc58-445f-b93d-6202e2a18811_0.png` | 928×1232 | `#1a1d20` | `#222328` | `#1a1d20 #413d44 #787270` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7e3e3b4d-dc58-445f-b93d-6202e2a18811_1.png` | 928×1232 | `#12110f` | `#242421` | `#12110f #292927 #b0a99a #3d3e3e #76746d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7e3e3b4d-dc58-445f-b93d-6202e2a18811_2.png` | 928×1232 | `#434b55` | `#1f252b` | `#434b55 #13181c #2d353d #8b8a88` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7e3e3b4d-dc58-445f-b93d-6202e2a18811_3.png` | 928×1232 | `#0e1014` | `#191f25` | `#0e1014 #4c545b #1e252b #2f3840 #938f87` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7f11a006-758f-49ae-bebf-a9ead8a1e537_0.png` | 928×1232 | `#101216` | `#24262d` | `#101216 #5f697a #2d2f38 #454c5a #9ea4a2` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7f11a006-758f-49ae-bebf-a9ead8a1e537_1.png` | 928×1232 | `#313131` | `#212120` | `#313131 #181918 #4f4f4e #a09e98` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7f11a006-758f-49ae-bebf-a9ead8a1e537_2.png` | 928×1232 | `#2a2a2a` | `#161616` | `#2a2a2a #131414 #6d6b68` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7f11a006-758f-49ae-bebf-a9ead8a1e537_3.png` | 928×1232 | `#baab91` | `#31302d` | `#baab91 #1e1e1c #3b3a37 #9d9382 #625f59` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_9e685170-b950-4cf0-a1b6-048f0ac9375a_2.png` | 928×1232 | `#232320` | `#272725` | `#232320 #ccc9b1 #424442 #757772` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_9e685170-b950-4cf0-a1b6-048f0ac9375a_3.png` | 928×1232 | `#13171d` | `#31312e` | `#13171d #e2e2cd #41403d #706c60 #b3ac95` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_fc02f90c-6f86-4bba-861b-b12dcff3161d_0.png` | 928×1232 | `#191b1b` | `#1b1d1d` | `#191b1b #49473f #9f9378` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_fc02f90c-6f86-4bba-861b-b12dcff3161d_1.png` | 928×1232 | `#1b2023` | `#191e21` | `#1b2023 #bfb194 #59574d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_fc02f90c-6f86-4bba-861b-b12dcff3161d_2.png` | 928×1232 | `#111616` | `#1c2120` | `#111616 #766d58 #b9aa8d #3d3d35` | pillow; cluster covered |
| `u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_fc02f90c-6f86-4bba-861b-b12dcff3161d_3.png` | 928×1232 | `#171d1f` | `#262b2b` | `#171d1f #cec0a5 #2d3130 #52504a #a79b84` | pillow; cluster covered |

#### `mj:httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome_4ea5a644-ecc8-45c5-b97b-29dc77f09e94_0.png` | 928×1232 | `#000000` | `#000000` | `#000000 #50504f #1f1e1c` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome_4ea5a644-ecc8-45c5-b97b-29dc77f09e94_1.png` | 928×1232 | `#000000` | `#000000` | `#000000 #1c1c1b` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome_4ea5a644-ecc8-45c5-b97b-29dc77f09e94_2.png` | 928×1232 | `#000000` | `#000000` | `#000000 #171613 #36352d` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome_4ea5a644-ecc8-45c5-b97b-29dc77f09e94_3.png` | 928×1232 | `#000000` | `#000000` | `#000000 #39362d` | pillow; cluster covered |

#### `mj:httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo` — 4 stills, 0 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo_47adeae6-e618-4a12-a0ac-18b9e4c9f787_0.png` | 928×1232 | `#000000` | `#000000` | `#000000 #191a1a #343433 #565656` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo_47adeae6-e618-4a12-a0ac-18b9e4c9f787_1.png` | 928×1232 | `#ffffff` | `#e3e3e2` | `#ffffff #000000 #bbbbbb #4a4a4a` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo_47adeae6-e618-4a12-a0ac-18b9e4c9f787_2.png` | 928×1232 | `#000000` | `#000000` | `#000000 #1e2020` | pillow; cluster covered |
| `u7869492466_httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo_47adeae6-e618-4a12-a0ac-18b9e4c9f787_3.png` | 928×1232 | `#000000` | `#000000` | `#000000 #2c2d2d` | pillow; cluster covered |

#### `mj:imagine_A_double-exposure_illustration_of_an_astr` — 4 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_0.png` | 1456×816 | `#d5ccb5` | `#d5ccb5` | `#d5ccb5 #806259 #d1bb92` | Halftone astronaut/sunset double exposure on beige. |
| `u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_1.png` | 1456×816 | `#d1cbbb` | `#d0cbb9` | `#d1cbbb #5b4c49 #dfb26c` | pillow; cluster covered |
| `u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_2.png` | 1456×816 | `#d7cfbf` | `#d7cfbe` | `#d7cfbf #5d463a #95805f` | pillow; cluster covered |
| `u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_3.png` | 1456×816 | `#fbe6b5` | `#fbe6b5` | `#fbe6b5 #fdd67a #c36739` | pillow; cluster covered |

#### `mj:imagine_case_file_research_dossier_on_person_of_i` — 12 stills, 1 vision-direct

| path | px | dominant | median | swatches | vision |
| --- | --- | --- | --- | --- | --- |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_0.png` | 928×1232 | `#c1b49a` | `#a2957b` | `#c1b49a #ad9e84 #5e5443 #151512 #2a2923` | Sepia POI silhouette over intake-form grids. |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_1.png` | 928×1232 | `#070807` | `#a58d6a` | `#070807 #99805e #caba99 #ae9874 #d9cfb7` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_2.png` | 928×1232 | `#938776` | `#a39582` | `#938776 #d7ceba #0b0b0a #c6b9a3 #74695a` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_3.png` | 928×1232 | `#c2b8a5` | `#a9a18e` | `#c2b8a5 #9a9180 #2e2d2a #131413 #6a6257` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_988b5f6f-bd72-48a6-a524-ec92cb7d4bbd_0.png` | 928×1232 | `#101211` | `#101211` | `#101211 #796351` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_988b5f6f-bd72-48a6-a524-ec92cb7d4bbd_1.png` | 928×1232 | `#a59c8a` | `#88765c` | `#a59c8a #816e54 #2e2329 #b6b2a8 #4b3b38` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_988b5f6f-bd72-48a6-a524-ec92cb7d4bbd_2.png` | 928×1232 | `#4d565c` | `#2d3438` | `#4d565c #171c1e #050506 #b8bbb5 #374044` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_988b5f6f-bd72-48a6-a524-ec92cb7d4bbd_3.png` | 928×1232 | `#121117` | `#0f0e14` | `#121117 #a6926e #000000 #6e6553` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_a11a688c-4725-4901-885f-fe9ed4120d29_0.png` | 1232×928 | `#2b3d47` | `#293b45` | `#2b3d47 #b9c7ce #cfdbe0 #4b5a63` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_a11a688c-4725-4901-885f-fe9ed4120d29_1.png` | 1232×928 | `#4d4a41` | `#28241c` | `#4d4a41 #231f18 #3b362c #070805 #807a6a` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_a11a688c-4725-4901-885f-fe9ed4120d29_2.png` | 1232×928 | `#000000` | `#0e0d17` | `#000000 #e1c39e #63544a` | pillow; cluster covered |
| `u7869492466_imagine_case_file_research_dossier_on_person_of_i_a11a688c-4725-4901-885f-fe9ed4120d29_3.png` | 1232×928 | `#000101` | `#705f51` | `#000101 #b9ada2 #d8d5d1 #777471 #a58776` | pillow; cluster covered |

## Integrity

- palettes.json stills: 471
- inventory.txt lines should equal 471
- corrupt/unreadable: none (error_count=0)
- vision-direct paths: 74

