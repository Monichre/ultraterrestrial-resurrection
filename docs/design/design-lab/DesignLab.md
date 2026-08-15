# DesignLab

**Package / path:** `docs/design/design-lab/` (historical note: once mirrored under `packages/design-lab`)  
**Updated:** 2026-08-01  
**Role:** Visual sandbox + reference archive for Ultraterrestrial research surfaces (not a publishable app).

## Architecture

```
docs/design/design-lab/
├── document-system/     # ⚠ UNFINISHED — paper register specimen + CSS (needs work)
├── prototypes/          # Interactive HTML surface concepts (if present locally)
├── ui-mockups/          # Product UI screenshots & component specs
├── visual-language/     # Style guides / archive territory maps
├── dossier-art/         # Generated classified folder / document stills
├── textures/            # Paper, grid, fabric, shader backgrounds
├── mood-references/     # External poetic collage inspiration
├── gateway/             # Gateway process / hero visuals
├── process-refs/        # Meta process / observatory / tooling refs
├── DesignLab.md         # This inventory
├── DesignLabRename_PSUEDOCODE.md
├── UiDesignBrief.md     # Full UI brief (skill structure)
├── DesignLabUiBrief.md  # Architecture / module / data-flow summary
└── DesignLabUiBrief_PSUEDOCODE.md
```

> **⚠ `document-system/` is unfinished.** See [`document-system/README.md`](./document-system/README.md). Do not treat it as shipping canon until status flips to `live`.

## Naming contract

- **kebab-case**, no spaces / parentheses / generator IDs
- Prefer **subject** over Midjourney remix hashes, Twitter CDN IDs, UUIDs
- Variants: `-a` / `-b` / `-c` or semantic (`-cover`, `-annotated`, `-v1`)
- Exact binary duplicates removed during rename (6 pairs)

## Modules (asset classes)

| Folder | Process | Data flow |
|---|---|---|
| `document-system/` | **UNFINISHED** — paper register specimen + shared CSS | Needs wiring to prototypes + React handoff; see README |
| `prototypes/` | Static HTML artboards for four instruments | Read → brief → port IA into `apps/app` (also mirrored under `docs/vision/prototypes/`) |
| `ui-mockups/` | High-fidelity product UI captures | Compare against live Research Canvas |
| `visual-language/` | Canon visual DNA boards | Token / motif source for design system |
| `dossier-art/` | Archival materiality stills | Paper/folder texture + composition refs |
| `textures/` | Tiling / ambient surfaces | CSS backgrounds, shader mood |
| `mood-references/` | Non-product poetic collages | Typography / negative-space inspiration |
| `gateway/` | Onboarding / process explainer art | Marketing / entry surfaces |
| `process-refs/` | Agent / 3D / tooling stills | Meta process, not product UI |

## Inventory

### document-system/ — UNFINISHED / NEEDS WORK

| File | Contents | Status |
|---|---|---|
| [`README.md`](./document-system/README.md) | Status flag + needed-work checklist | **unfinished** |
| `index.html` | Paper Document System specimen | unfinished (stale nav) |
| `ut-document-system.css` | Shared paper / register stylesheet | unfinished (consumers broken) |
| `assets/*` | Paper textures | present |

Canon status file: [`document-system/README.md`](./document-system/README.md).

### prototypes/

| File | Contents |
|---|---|
| `01-living-research-canvas.html` | Spatial investigation canvas |
| `02-evidence-ledger.html` | Claim support/challenge ledger |
| `03-temporal-geospatial-observatory.html` | Map + chronology instrument |
| `04-hypothesis-lab.html` | Competing explanations lab |
| `interface-gallery-overview.png` | Gallery still of surface concepts |

### ui-mockups/

| File | Contents |
|---|---|
| `research-desk-theory-canvas.png` | Research Desk + theory graph |
| `research-desk-nuclear-thread-v1.png` | Roswell nuclear-thread desk (capture 1) |
| `research-desk-nuclear-thread-v2.png` | Same desk, denser sidebar (capture 2) |
| `research-desk-nuclear-thread-v3.webp` | Same desk (webp capture) |
| `research-notebook-document-panel.png` | Document panel / notebook workspace |
| `document-panel-component-spec.png` | Document Panel anatomy + API sheet |
| `hypothesis-lab-competing-explanations.png` | Hypothesis Lab dual-model compare |
| `evidence-ledger-claim-detail.png` | Evidence Ledger claim C-0187 |
| `living-research-canvas-nuclear-thread.png` | Living canvas graph + inspector |
| `case-file-socorro-landing.png` | Case file dossier UI (Socorro) |

### visual-language/

| File | Contents |
|---|---|
| `visual-language-report-v1.png` | Full Visual Language Report v1.0 |
| `archive-territory-visual-map.png` | Archive territory map (compact) |
| `archive-territory-visual-map-board.png` | Archive territory board (annotated) |

### dossier-art/

| File | Contents |
|---|---|
| `roswell-evidence-folder-{a,b}.png` | Roswell evidence folder variants |
| `socorro-incident-folder-{a,b}.png` | Socorro folder variants |
| `socorro-incident-details-{a,b,c}.png` | Socorro detail sheets |
| `astronaut-secret-files-{a,b}.png` | Astronaut files stack |
| `astronaut-secret-dossier.png` | Astronaut dossier cover |
| `classified-files-noir-light.png` | Classified stack under noir light |
| `roswell-witness-reports-folder.png` | UNCLASSIFIED witness-reports folder |
| `roswell-clauson-page-{a,b,c}.png` | Faded Roswell Clauson pages |
| `ultraterrestrial-vintage-document-cover.png` | Vintage ULTRATERRESTRIAL cover |
| `undetect-vintage-document-{a,b}.png` | Undetect-series vintage docs |
| `cosmic-dread-existential-angst.png` | Cosmic dread mood still |
| `vertical-manila-folder-icon.png` | Vertical manila folder on dot grid |

### textures/

| File | Contents |
|---|---|
| `debut-light-paper.png` | Light paper texture |
| `fabric-of-squares.png` | Fabric squares pattern |
| `groove-paper.png` | Groove paper texture |
| `grid-noise.png` | Fine grid noise |
| `dot-grid-texture.png` | Dot grid (light) |
| `dot-grid-black.png` | Dot grid on black |
| `twin-moons-monochrome.webp` | Twin cratered moons render |
| `green-nebula-scanline-shader.png` | Green scanline nebula |

### mood-references/

| File | Contents |
|---|---|
| `shore-seashell-dry-wind.jpg` | Seashell / shore collage |
| `lighthouse-coast-fog.jpg` | Lighthouse / fog collage |
| `bird-brief-lightness-collage.jpg` | Bird + sky cutout |
| `seoul-platform-proof-collage.jpg` | Seoul platform ticket collage |
| `self-obscured-masked-figure.jpg` | Masked figure collage |
| `summer-still-air-bottle.jpg` | Green bottle / summer still air |
| `rive-vol01-course-cover.jpg` | Rive vol.01 cover (external) |

### gateway/

| File | Contents |
|---|---|
| `gateway-hero.png` | Gateway hero art |
| `gateway-process-visual-explainer.png` | Gateway process explainer |

### process-refs/

| File | Contents |
|---|---|
| `claude-code-seven-instruction-layers.png` | 7 instruction layers diagram |
| `antigravity-observatory-globe-hud.png` | Antigravity Observatory WebGL HUD |

## Related product path

Live design-lab route (separate from this package): `apps/app/src/app/design-lab/` → `/design-lab`

Living design ambition: `PRODUCT.md`, `docs/vision/`, this design-lab tree. Root `DESIGN.md` is **not canonical** (limited Research Canvas chrome sketch only).
