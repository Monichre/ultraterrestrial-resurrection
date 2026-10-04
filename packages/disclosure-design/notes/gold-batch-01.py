# Gold batch 01 — UI / product plates. Content per prompts/ contracts.

CONTENT = {
"research-desk-ui": {
"source.md": '''---
title: source — research-desk-ui
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `research-desk-ui`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). Format per `prompts/aesthetics.md`.

## thinkingprocess

- **Aspects/Subjects/Motifs**: document panel component spec sheet; parchment card specimen with header block, hairline rules, mono measurement labels, margin annotations
- **Adjectives**: archival, clinical, precise, warm-paper, engineered, quiet
- **Display/Medium/Usage-Context**: UI component anatomy / spec sheet (design-lab deliverable), portrait orientation
- **Genres/Styles**: technical documentation meets archival dossier; blueprint annotation register on bone paper
- **Color Palette**: measured — bone paper `#f4f0e9` dominant, warm greys `#cbc2b3` `#ded4c6`, ink-taupe `#7b7669` (see design-tokens.md)
- **Composition**: centered specimen card on larger sheet; callouts keyed to edges; generous margins; vertical stack
- **Emotional Impact**: competence, archival trust, instrument-grade calm
- **Other Details**: 1132×1390 PNG; dupe group: byte-identical to `design/mock-ups/C8D34054…` copies (left in place)

```
archival document panel component spec sheet, bone parchment card specimen centered on warm paper, hairline ink rules mono measurement labels margin callouts, clinical blueprint annotation register, warm bone palette #f4f0e9 #cbc2b3 taupe ink, portrait editorial layout generous margins, flat print aesthetic no shadows, sense of precision provenance instrument-grade calm, design-system documentation deliverable
```
''',
"design.md": '''---
version: anydesign-1
name: research-desk-ui — document panel component spec
source: extractions/research-desk-ui/research-desk-ui.png
captured_at: 2026-08-13
description: |
  Archival component-spec sheet on bone paper. The product's document panel is
  presented like a museum mount: hairline rules, mono measurement labels, warm
  parchment surfaces. Restraint is the brand voice — ink and brass tones do all
  the work; no hue, no shadow theatre.
colors:
  primary: "#7b7669"
  surface: "#f4f0e9"
  text-primary: "#7b7669"
  text-muted: "#7b7669"
  border: "#cbc2b3"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 400
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64]
rounded:
  sm: 4px
---

# Design Analysis — document panel spec (still)

> Analysis per `prompts/output-template.md`, still-scoped. Emphasis: design system.
> Date: 2026-08-13. Pixel truth: `design-tokens.md` in this folder.

## Source

- **Source type**: local image (vision-read, gold pass)
- **Detected limitations**: single still — no states, no responsive material ❓

## TL;DR

Archival spec-sheet register: warm bone surface, ink-taupe annotation, hairline
chrome. The document panel is treated as evidence, not UI furniture.

## 1. Visual identity

**Personality**: archival, clinical, warm, precise.
**Mood**: instrument-grade calm; provenance you can measure.
**Density**: balanced. **Positioning**: researchers who read primary sources.
**Confidence**: ✅ high (surface + tokens measured), ⚠️ medium (type family inferred).

### 1.3 The ONE brand thing

**The thing**: the paper. Bone `#f4f0e9` carries the entire identity — remove it
and this is a generic wireframe. Everything else (hairlines, mono labels) is
restrained *in service of* the paper register.

## 2. Tokens

Measured: `design-tokens.md`. Key roles: `--color-bg-primary` `#f4f0e9`,
`--color-border-primary` `#cbc2b3`, `--color-text-primary` `#7b7669` (note: on
paper the ink reads darker than the measured mid-taupe — vision ⚠️). No accent
qualified (chroma-scarce frame); do not invent one.

## 4. Layout & composition

Centered specimen on a larger sheet; callout labels keyed to edges with leader
lines; margins ≈ 64–96px rhythm; vertical hierarchy by rule weight, not color.

## 6. Do's and Don'ts

**Do**: keep annotations mono 11–12px; keep the sheet flat (no drop shadows);
use hairline `#cbc2b3` rules as the only chrome.
**Don't**: no hue accents on the paper register; no rounded-pill chrome on an
archival card; don't darken the paper to "make it pop".

## 7. Open questions

- Exact typeface of the mono labels (looks like a grotesque mono — ⚠️ medium).
- Hover/focus states for the panel: not observable in a still.
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: document panel component spec sheet
source: extractions/research-desk-ui/research-desk-ui.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#f4f0e9"
  - "#cbc2b3"
  - "#ded4c6"
  - "#7b7669"
---

# Image-to-prompt — `research-desk-ui`

Per `prompts/element-copy.md`. Kind: **hybrid** — the spec sheet is code-able
(rules, labels, card) but the paper tooth is an asset-grade texture.

### Canonical prompt (structured)

SUBJECT: a UI component specification sheet for an archival "document panel" —
one parchment card specimen centered on a larger bone-paper sheet, annotated
with hairline leader lines and monospaced measurement labels
STYLE / MEDIUM: flat print design-documentation poster, blueprint-meets-archive,
no perspective, no shadows
COMPOSITION & CAMERA: straight-on, portrait 4:5, specimen centered, generous
margins, annotations distributed at edges
LIGHTING: none (flat print); even tone
PALETTE: #f4f0e9 bone field, #ded4c6 panel surface, #cbc2b3 hairline rules,
#7b7669 ink-taupe labels
MOOD: archival, precise, quiet, instrument-grade
BACKGROUND / INTEGRATION: scene — background baked in as the bone sheet
AVOID: no hue accents, no drop shadows, no 3D, no photo textures beyond paper
grain, no lorem ipsum walls

### Natural-language version

A flat, print-style UI component spec sheet on warm bone paper (#f4f0e9): one
centered parchment document-panel card (#ded4c6) annotated by hairline #cbc2b3
leader lines and small monospaced taupe labels (#7b7669), blueprint-meets-
archival-dossier register, portrait, generous margins, no shadows, no color
accents, no 3D — quiet, precise, archival.

### Model adaptation notes

- **Midjourney**: condense to comma phrases; `--ar 4:5 --style raw`.
- **gpt-image / DALL-E**: use the NL version as-is.
- **SD/Flux**: tags from structured fields; AVOID block → negative prompt.

> **Prompt fidelity note**: a generative prompt is a high-fidelity description,
> not a guarantee. Expect 2–4 iterations; PALETTE and AVOID are the levers.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface DocumentPanelProps {
  title: string
  reference?: string
  children?: ReactNode
}

export const DocumentPanel = ({ title, reference, children }: DocumentPanelProps) => {
  return (
    <figure
      style={{
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-xl)',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '1px solid var(--color-border-primary)',
          paddingBottom: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <span style={{ fontSize: 'var(--font-size-md, 16px)', color: 'var(--color-text-primary)' }}>
          {title}
        </span>
        {reference ? (
          <span
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
            }}
          >
            {reference}
          </span>
        ) : null}
      </header>
      <div style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{children}</div>
    </figure>
  )
}
''',
},

"mixed-mockup-plates": {
"source.md": '''---
title: source — mixed-mockup-plates
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `mixed-mockup-plates`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). Cluster is MIXED
> (54 files: dark desk UI, vortex HUD, phone shots, paper docs) — batch folders
> in this cluster inherit nothing but the label.

## thinkingprocess

- **Aspects/Subjects/Motifs**: dark research-desk interface plate; left rail, canvas field, brass-tinted instrumentation, dense chrome
- **Adjectives**: nocturnal, instrumented, dense, classified, brass-on-charcoal
- **Display/Medium/Usage-Context**: product UI mockup (desktop app plate), landscape
- **Genres/Styles**: intelligence-console HUD; "spy-lab meets war room" productized
- **Color Palette**: measured — near-black `#191a19` field, warm brass `#968368` chroma peak (see design-tokens.md)
- **Composition**: full-bleed app frame; rail/canvas/inspector zoning; dense header strip
- **Emotional Impact**: operational seriousness; a desk where secrets are worked
- **Other Details**: 1448×1086 PNG; rep of a heterogeneous drop-zone cluster

```
dark research desk interface mockup, near-black charcoal field, left navigation rail canvas workspace inspector column, brass-tinted instrumentation accents #968368, dense header strip mono microcopy, intelligence console HUD aesthetic, landscape app frame, classified operational seriousness, spy-lab war-room productized into software
```
''',
"design.md": '''---
version: anydesign-1
name: mixed-mockup-plates — dark research desk plate
source: extractions/mixed-mockup-plates/mixed-mockup-plates.png
captured_at: 2026-08-13
description: |
  The desk SoT register: near-black charcoal ground with brass as the only
  warm signal. Dense, zoned console layout — rail, canvas, inspector. This is
  the dark pole of the product's two-register system (paper is the other).
colors:
  primary: "#968368"
  surface: "#191a19"
  text-primary: "#968368"
  text-muted: "#968368"
  border: "#968368"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — dark research desk plate (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Classified-console product UI: near-black field, brass instrumentation, dense
zoned layout. Chroma discipline is absolute — one warm metal, nothing else.

## 1. Visual identity

**Personality**: nocturnal, instrumented, serious, dense.
**Mood**: operational focus.
**References**: intelligence-console HUD; Linear-density translated to an
archival product.
**Confidence**: ✅ palette (measured), ⚠️ layout detail (single frame).

### 1.3 The ONE brand thing

**The thing**: brass `#968368` as the sole warm signal on charcoal. Remove it
and the plate is every dark UI; keep it scarce and it is unmistakably this desk.

## 2. Tokens

Measured in `design-tokens.md`: `--color-bg-primary` `#191a19`,
`--color-primary` `#968368` (sat/share gate passed). Accent budget: CTA +
active states only (MotionViz chroma-scarcity rule).

## 4. Layout & composition

Three-zone console: left rail (~56–64px icon column), canvas field, right
inspector. Header strip carries mono readouts. Density alternates: chrome
dense, canvas calm.

## 6. Do's and Don'ts

**Do**: reserve brass for active/CTA; keep chrome hairline; mono for all
readouts.
**Don't**: no second accent hue; no light cards on the dark field (polarity
flip belongs to paper register only); no glow effects.

## 7. Open questions

- Exact rail width + breakpoint behavior — not observable ❓
- Whether vortex-HUD siblings in this cluster share the token set (likely ⚠️).
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: dark research desk plate
source: extractions/mixed-mockup-plates/mixed-mockup-plates.png
captured_at: 2026-08-13
kind: code
palette:
  - "#191a19"
  - "#1b1b1a"
  - "#968368"
---

# Image-to-prompt — `mixed-mockup-plates`

Kind: **code** — a frontend dev can rebuild this with DOM/CSS; no raster art
required. The generative prompt below is for mood-matching variants only.

### Canonical prompt (structured)

SUBJECT: a dark intelligence-console app interface — left icon rail, central
canvas workspace, right inspector column, dense mono header readouts
STYLE / MEDIUM: flat product UI mockup, crisp vector-clean edges
COMPOSITION & CAMERA: straight-on full app frame, landscape 4:3
LIGHTING: none (UI); brass accents read as lit instrumentation
PALETTE: #191a19 charcoal field, #968368 brass accents, warm greys for text
MOOD: nocturnal, classified, operational
BACKGROUND / INTEGRATION: scene — the frame IS the app
AVOID: no glow, no gradients, no second accent color, no rounded playful chrome,
no photographic elements

### Natural-language version

A dense dark-mode research console UI on near-black #191a19: left icon rail,
central canvas, right inspector, mono microcopy header; the only color is
scarce brass #968368 on active instrumentation. Flat, crisp, classified —
no glow, no gradients, no playful rounding.

### Model adaptation notes

- Prefer rebuilding in code over regenerating; use this prompt only for
  keyframe/mood variants. **Midjourney**: add `--ar 4:3 --style raw`.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface ResearchDeskPlateProps {
  rail?: ReactNode
  inspector?: ReactNode
  status?: string
  children?: ReactNode
}

export const ResearchDeskPlate = ({ rail, inspector, status, children }: ResearchDeskPlateProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 280px',
        gridTemplateRows: '40px 1fr',
        height: '100%',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--spacing-md)',
          borderBottom: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>RESEARCH DESK</span>
        <span style={{ color: 'var(--color-primary)' }}>{status ?? 'IDLE'}</span>
      </header>
      <nav
        style={{
          borderRight: '1px solid var(--color-border-primary)',
          padding: 'var(--spacing-sm) 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}
      >
        {rail}
      </nav>
      <main style={{ padding: 'var(--spacing-lg)', overflow: 'auto' }}>{children}</main>
      <aside
        style={{
          borderLeft: '1px solid var(--color-border-primary)',
          padding: 'var(--spacing-md)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        {inspector}
      </aside>
    </div>
  )
}
''',
},

"interface-gallery-overview": {
"source.md": '''---
title: source — interface-gallery-overview
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `interface-gallery-overview`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: gallery board of interface-direction thumbnails; grid of small dark UI cards; hairline frames; mono captions
- **Adjectives**: curatorial, systematic, nocturnal, comparative
- **Display/Medium/Usage-Context**: design-direction overview board (vision/prototypes), landscape
- **Genres/Styles**: moodboard-as-index; museum wall of UI specimens
- **Color Palette**: measured — near-black `#121515` field, grey-green `#414440` secondary (design-tokens.md)
- **Composition**: regular thumbnail grid; even gutters; caption row under each cell
- **Emotional Impact**: range under control — many directions, one discipline
- **Other Details**: 1440×1040 PNG; sole member of its cluster

```
interface direction gallery overview board, grid of dark UI thumbnail specimens with hairline frames and mono captions, near-black #121515 field, even gutters museum-wall spacing, curatorial systematic comparison, landscape overview, sense of many directions held to one discipline, nocturnal design-lab register
```
''',
"design.md": '''---
version: anydesign-1
name: interface-gallery-overview — direction board
source: extractions/interface-gallery-overview/interface-gallery-overview.png
captured_at: 2026-08-13
description: |
  A museum wall of interface directions: uniform dark thumbnails in a strict
  grid, mono captions, no chrome beyond the hairline. The system performing
  self-review — range is shown as disciplined comparison, not exploration chaos.
colors:
  primary: "#414440"
  surface: "#121515"
  text-primary: "#414440"
  border: "#414440"
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — interface direction board (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Specimen-grid overview: many UI directions, one presentation discipline. Near-
black field, hairline frames, mono captions.

## 1. Visual identity

**Personality**: curatorial, systematic, restrained.
**Mood**: controlled range.
**Density**: dense cells, calm field.
**Confidence**: ✅ palette, ⚠️ cell contents (thumbnails below readable size).

### 1.3 The ONE brand thing

The grid discipline itself — equal cells, hairline borders, mono captions. It
says: directions are specimens under study, not options in a pitch deck.

## 2. Tokens

Measured: `design-tokens.md`. `--color-bg-primary` `#121515`; no accent
qualifies (chroma gate failed) — honest omission.

## 4. Layout & composition

Uniform thumbnail grid, ~16–24px gutters, caption baseline aligned per row.
Hierarchy by position, not size.

## 6. Do's and Don'ts

**Do**: keep every cell identical in size; captions mono 11–12px.
**Don't**: don't feature-enlarge one cell (breaks the specimen register); no
colored badges on cells.

## 7. Open questions

- Interaction (filter/sort/zoom) — not observable ❓
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: interface direction gallery board
source: extractions/interface-gallery-overview/interface-gallery-overview.png
captured_at: 2026-08-13
kind: code
palette:
  - "#121515"
  - "#414440"
---

# Image-to-prompt — `interface-gallery-overview`

Kind: **code** — grid + cards + captions is pure DOM/CSS.

### Canonical prompt (structured)

SUBJECT: a gallery board of dark UI direction thumbnails in a strict grid,
each cell hairline-framed with a small mono caption
STYLE / MEDIUM: flat digital design-board mockup
COMPOSITION & CAMERA: straight-on, landscape, even gutters, rows baseline-aligned
LIGHTING: none (UI)
PALETTE: #121515 near-black field, #414440 grey-green frames and captions
MOOD: curatorial, systematic, nocturnal
BACKGROUND / INTEGRATION: scene — full-bleed board
AVOID: no enlarged featured cell, no color badges, no shadows, no 3D tilt

### Natural-language version

A strict grid of identical dark UI specimen cards on a near-black #121515
field, hairline #414440 frames, small monospaced captions under each cell,
even gutters, museum-wall regularity — no shadows, no color accents, no
featured enlargement.

### Model adaptation notes

- Rebuild in code preferred. **Midjourney**: `--ar 3:2 --style raw`.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface GalleryCell {
  id: string
  caption: string
  thumbnail?: ReactNode
}

export interface InterfaceGalleryGridProps {
  cells: GalleryCell[]
  onSelect?: (id: string) => void
}

export const InterfaceGalleryGrid = ({ cells, onSelect }: InterfaceGalleryGridProps) => {
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
        background: 'var(--color-bg-primary)',
        listStyle: 'none',
        margin: 0,
      }}
    >
      {cells.map((cell) => (
        <li key={cell.id}>
          <button
            type="button"
            onClick={() => onSelect?.(cell.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-sm)',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
          >
            <div style={{ aspectRatio: '4 / 3', overflow: 'hidden' }}>{cell.thumbnail}</div>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              {cell.caption}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
''',
},

"spacetime-storyboards": {
"source.md": '''---
title: source — spacetime-storyboards
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `spacetime-storyboards`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: spacetime-canvas concept frame; dark map/globe field with temporal comparison zoning; faint HUD geometry
- **Adjectives**: nocturnal, cartographic, cinematic, speculative
- **Display/Medium/Usage-Context**: product concept storyboard (vision/storyboards), wide landscape
- **Genres/Styles**: sci-fi situational-awareness console; temporal observatory
- **Color Palette**: measured — near-black teal `#131718`, ink `#000101`, slate `#2b2e2c` (design-tokens.md)
- **Composition**: wide field, central map mass, edge instrumentation
- **Emotional Impact**: watching time as terrain; quiet awe under instrumentation
- **Other Details**: 1672×941 PNG; byte-identical dupe `design/mock-ups/E198B83B…` left in place (canonical here)

```
spacetime canvas storyboard concept, dark map field with temporal comparison zones, faint HUD geometry over near-black teal #131718, wide cinematic landscape frame, edge instrumentation mono readouts, sci-fi situational awareness console, sense of time rendered as terrain, speculative observatory mood
```
''',
"design.md": '''---
version: anydesign-1
name: spacetime-storyboards — temporal compare concept
source: extractions/spacetime-storyboards/spacetime-storyboards.png
captured_at: 2026-08-13
description: |
  The Temporal Observatory as a console: near-black teal field, geography as
  the canvas, instrumentation pushed to the edges. Motion is compositional —
  time slices compared by juxtaposition, not animation chrome.
colors:
  primary: "#2b2e2c"
  surface: "#131718"
  text-primary: "#2b2e2c"
  border: "#2b2e2c"
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — spacetime storyboard (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Temporal-compare console concept: map-as-canvas on near-black teal, HUD
restrained to the edges. Cinematic but instrumented.

## 1. Visual identity

**Personality**: nocturnal, cartographic, speculative.
**Mood**: time as terrain.
**References**: situational-awareness consoles; observatory instruments.
**Confidence**: ✅ palette, ❓ interaction model (storyboard only).

### 1.3 The ONE brand thing

The dark teal-black field (`#131718`) as "deep time" ground — brighter chrome
would break the observatory spell.

## 2. Tokens

Measured: `design-tokens.md`. Chroma gate failed → no `--color-primary` emitted;
accent decisions belong to the live app token set, not this frame.

## 4. Layout & composition

Central geographic mass; edge rails for temporal controls; comparison by
spatial juxtaposition (before/after panes), not page transitions.

## 6. Do's and Don'ts

**Do**: keep instrumentation at the edges; keep the field near-black; let map
detail carry luminescence.
**Don't**: no bright sidebars; no modal chrome over the field; no hue accents.

## 7. Open questions

- Temporal scrubber pattern + breakpoints ❓ (storyboard is a single frame)
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: spacetime temporal-compare storyboard
source: extractions/spacetime-storyboards/spacetime-storyboards.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#131718"
  - "#000101"
  - "#2b2e2c"
---

# Image-to-prompt — `spacetime-storyboards`

Kind: **hybrid** — console frame is code; the dark map/globe field is an asset
(or live map tile layer in the real product).

### Canonical prompt (structured)

SUBJECT: a dark temporal-observatory console — central map field with faint
comparison zoning, thin HUD instrumentation at the edges
STYLE / MEDIUM: cinematic sci-fi UI concept frame, crisp vector chrome over a
painterly dark geography
COMPOSITION & CAMERA: wide 16:9, straight-on, map mass centered, rails at edges
LIGHTING: self-lit instrument glow only, very restrained
PALETTE: #131718 near-black teal field, #000101 ink, #2b2e2c slate chrome
MOOD: nocturnal, speculative, observational
BACKGROUND / INTEGRATION: scene — full-bleed console
AVOID: no bright sidebars, no blue-LED cyberpunk glow, no text walls, no 3D
perspective tilt

### Natural-language version

A wide cinematic concept frame of a temporal observatory console: a near-black
teal (#131718) map field filling the frame, faint comparison zones, thin slate
(#2b2e2c) HUD instrumentation confined to the edges, restrained instrument
glow, no cyberpunk blue, no perspective tilt — time rendered as terrain.

### Model adaptation notes

- **Midjourney**: `--ar 16:9 --style raw`. **SD/Flux**: AVOID → negative prompt.
- In product: map is a live layer (Mapbox); only the chrome is code.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface SpacetimeComparePanelProps {
  before?: ReactNode
  after?: ReactNode
  beforeLabel?: string
  afterLabel?: string
}

export const SpacetimeComparePanel = ({
  before,
  after,
  beforeLabel = 'T-0',
  afterLabel = 'T-1',
}: SpacetimeComparePanelProps) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        background: 'var(--color-border-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      {[
        { label: beforeLabel, body: before },
        { label: afterLabel, body: after },
      ].map((pane) => (
        <div key={pane.label} style={{ background: 'var(--color-bg-primary)', position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              top: 'var(--spacing-sm)',
              left: 'var(--spacing-sm)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              zIndex: 1,
            }}
          >
            {pane.label}
          </span>
          <div style={{ minHeight: 320 }}>{pane.body}</div>
        </div>
      ))}
    </section>
  )
}
''',
},

"gateway-hero-explainer": {
"source.md": '''---
title: source — gateway-hero-explainer
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `gateway-hero-explainer`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: tall dark hero + process explainer; evidence-ladder motif (teal→red); classified-document framing; large display type block
- **Adjectives**: looming, initiatory, classified, cinematic
- **Display/Medium/Usage-Context**: landing hero + explainer poster (design-lab gateway), tall portrait 2:3
- **Genres/Styles**: documentary-title-card meets intelligence briefing
- **Color Palette**: measured — near-black `#171715` field, grey-green `#42433d`, ink `#030404` (design-tokens.md); the teal→red ladder is a local motif, not brand chrome
- **Composition**: vertical sequence — hero statement, then staged process bands
- **Emotional Impact**: threshold feeling; being briefed into something
- **Other Details**: 2160×3240 PNG; 2-file cluster (gateway)

```
gateway hero and process explainer poster, tall dark near-black field, large display statement block followed by staged process bands, teal to red evidence ladder motif, classified briefing title-card register, portrait 2:3, cinematic documentary gravity, sense of initiation threshold being crossed
```
''',
"design.md": '''---
version: anydesign-1
name: gateway-hero-explainer
source: extractions/gateway-hero-explainer/gateway-hero-explainer.png
captured_at: 2026-08-13
description: |
  A briefing-you-are-being-read-into hero: near-black field, one display
  statement, then a staged evidence ladder. The teal→red ladder is narrative
  color, deliberately scoped to this explainer — never product chrome.
colors:
  primary: "#42433d"
  surface: "#171715"
  text-primary: "#42433d"
  border: "#42433d"
typography:
  display:
    fontFamily: "system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 600
    letterSpacing: -0.02em
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]
rounded:
  sm: 4px
---

# Design Analysis — gateway hero explainer (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Initiation-threshold hero: display statement on near-black, then a staged
teal→red evidence ladder. Narrative color lives here and nowhere else.

## 1. Visual identity

**Personality**: looming, initiatory, documentary.
**Mood**: being briefed in.
**Density**: minimalist hero → denser process bands (density alternation).
**Confidence**: ✅ structure + palette, ⚠️ type family inferred.

### 1.3 The ONE brand thing

The evidence ladder (teal→red) — the only narrative color sequence in the
system, scoped to explainer surfaces. Product UI must not inherit it.

## 2. Tokens

Measured: `design-tokens.md`. Ladder hues intentionally NOT tokenized into
`--color-primary` (chroma gate + scoping discipline); document them as
motif-local if needed.

## 4. Layout & composition

Vertical sequence: hero statement (top third) → process bands. Band rhythm
≈ 64–96px. Hierarchy by scale and restraint, not saturation.

## 6. Do's and Don'ts

**Do**: keep the ladder as the only chromatic moment; sentence-case display
type with tight tracking.
**Don't**: don't reuse ladder teal/red as UI accents; don't stack multiple
heroes; no glow.

## 7. Open questions

- Ladder step semantics (what each rung means) — content, not pixels ❓
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: gateway hero + evidence ladder explainer
source: extractions/gateway-hero-explainer/gateway-hero-explainer.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#171715"
  - "#42433d"
  - "#030404"
---

# Image-to-prompt — `gateway-hero-explainer`

Kind: **hybrid** — hero type block and band layout are code; atmospheric field
texture is an asset.

### Canonical prompt (structured)

SUBJECT: a tall landing hero for a classified-research product — one large
display statement, then staged process bands descending the frame with a
subtle teal-to-red evidence ladder motif
STYLE / MEDIUM: cinematic documentary title card meets intelligence briefing,
flat print finish
COMPOSITION & CAMERA: portrait 2:3, hero statement upper third, process bands
below, generous dark margins
LIGHTING: dim, self-lit text; no scene lighting
PALETTE: #171715 near-black field, #42433d grey-green secondary, restrained
teal→red ladder accents only inside the process bands
MOOD: initiatory, grave, classified
BACKGROUND / INTEGRATION: scene — full-bleed poster
AVOID: no glow, no lens flare, no stock-photo imagery, no all-caps walls, no
rounded playful UI

### Natural-language version

A tall, dark briefing-poster hero: near-black #171715 field, a single large
display statement in the upper third, then quiet staged process bands below
carrying the frame's only color — a restrained teal-to-red evidence ladder.
Documentary title-card gravity, flat print finish, no glow, no flare.

### Model adaptation notes

- **Midjourney**: `--ar 2:3 --style raw`. Keep the ladder scarce or the
  model will flood the frame with neon.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface EvidenceRung {
  label: string
  tone: 'teal' | 'amber' | 'red'
}

export interface GatewayHeroProps {
  statement: string
  rungs: EvidenceRung[]
  children?: ReactNode
}

const RUNG_COLOR: Record<EvidenceRung['tone'], string> = {
  teal: 'var(--color-info, #2f6f6f)',
  amber: 'var(--color-warning, #8a6d2f)',
  red: 'var(--color-error, #7a3b2e)',
}

export const GatewayHero = ({ statement, rungs, children }: GatewayHeroProps) => {
  return (
    <section
      style={{
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        padding: 'var(--spacing-2xl, 64px) var(--spacing-lg)',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          maxWidth: 720,
          margin: 0,
        }}
      >
        {statement}
      </h1>
      <ol style={{ listStyle: 'none', padding: 0, margin: 'var(--spacing-xl) 0 0' }}>
        {rungs.map((rung, i) => (
          <li
            key={rung.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) 0',
              borderTop: '1px solid var(--color-border-primary)',
            }}
          >
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                color: RUNG_COLOR[rung.tone],
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{rung.label}</span>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}
''',
},

"globe-hud-process-refs": {
"source.md": '''---
title: source — globe-hud-process-refs
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `globe-hud-process-refs`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: wireframe globe with orbital annotation arcs; mono coordinate readouts; process-instruction strip
- **Adjectives**: geodetic, instrumented, nocturnal, technical
- **Display/Medium/Usage-Context**: process reference plate (design-lab), very wide banner ~2.5:1
- **Genres/Styles**: aerospace HUD; telemetry overlay
- **Color Palette**: measured — black `#010101`, warm bronze `#2d2517` `#5c4c32` instrumentation (design-tokens.md)
- **Composition**: globe mass left-of-center, annotation arcs sweeping, readout columns at edges
- **Emotional Impact**: surveillance-grade calm; the planet as dataset
- **Other Details**: 1625×651 PNG; 2-file cluster with instruction-layer sibling

```
wireframe globe HUD process reference plate, orbital annotation arcs mono coordinate readouts, black field with warm bronze instrumentation #5c4c32, ultra-wide banner 2.5:1, aerospace telemetry overlay register, geodetic precision, sense of planet rendered as queryable dataset
```
''',
"design.md": '''---
version: anydesign-1
name: globe-hud-process-refs
source: extractions/globe-hud-process-refs/globe-hud-process-refs.png
captured_at: 2026-08-13
description: |
  Aerospace-grade process reference: a wireframe globe carrying bronze
  telemetry on a black field. Warm metal on void — the same chroma story as
  the desk SoT, translated to geodesy.
colors:
  primary: "#5c4c32"
  surface: "#010101"
  text-primary: "#5c4c32"
  border: "#2d2517"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — globe HUD process ref (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Wireframe globe + bronze telemetry on black. Geodetic HUD register: precise,
nocturnal, surveillance-calm.

## 1. Visual identity

**Personality**: geodetic, instrumented, technical.
**Mood**: the planet as dataset.
**References**: aerospace telemetry overlays, mission-control HUDs.
**Confidence**: ✅ palette, ✅ composition, ⚠️ fine readout text (below legibility).

### 1.3 The ONE brand thing

Bronze-on-black instrumentation (`#5c4c32` on `#010101`) — the warm-metal
signal discipline shared with the desk SoT.

## 2. Tokens

Measured: `design-tokens.md`. `--color-primary` `#5c4c32` passed the sat/share
gate — bronze is the accent here.

## 4. Layout & composition

Globe mass left-of-center; arcs create diagonal sweep; readout columns pinned
to edges. Motion (MotionViz read): the arcs imply slow orbital drift —
compositional rhythm, not animation garnish.

## 6. Do's and Don'ts

**Do**: keep all instrumentation mono; keep bronze scarce; let the void dominate.
**Don't**: no blue-Earth photorealism; no glow bloom on arcs; no second accent.

## 7. Open questions

- Live-data binding (is this Mapbox/Globe.gl in product?) — likely ❓⚠️
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: wireframe globe HUD plate
source: extractions/globe-hud-process-refs/globe-hud-process-refs.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#010101"
  - "#2d2517"
  - "#5c4c32"
---

# Image-to-prompt — `globe-hud-process-refs`

Kind: **hybrid** — readout chrome is code; the wireframe globe is an asset (or
WebGL in product).

### Canonical prompt (structured)

SUBJECT: a wireframe globe with orbital annotation arcs and monospaced
coordinate readouts, instrument bronze on a black field
STYLE / MEDIUM: aerospace HUD plate, crisp vector lines, flat
COMPOSITION & CAMERA: ultra-wide banner 2.5:1, globe left-of-center, arcs
sweeping diagonally, readouts pinned to edges
LIGHTING: self-lit lines on void; no scene light
PALETTE: #010101 field, #2d2517 secondary, #5c4c32 bronze instrumentation
MOOD: geodetic, nocturnal, surveillance-calm
BACKGROUND / INTEGRATION: scene — black void baked in
AVOID: no photoreal Earth, no blue glow, no bloom, no 3D bevels, no extra hues

### Natural-language version

An ultra-wide aerospace HUD plate: a wireframe globe left-of-center with
sweeping orbital annotation arcs and small mono coordinate readouts, all in
warm bronze (#5c4c32) on a pure black field, crisp flat vector lines, no glow,
no photorealism — the planet as a queryable dataset.

### Model adaptation notes

- **Midjourney**: `--ar 5:2 --style raw`. **SD/Flux**: AVOID → negative.
- Product note: globe renders WebGL; this plate is the composition contract.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface GlobeHudStripProps {
  readouts?: string[]
  children?: ReactNode
}

export const GlobeHudStrip = ({ readouts = [], children }: GlobeHudStripProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'stretch',
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        minHeight: 220,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', padding: 'var(--spacing-md)' }}>{children}</div>
      <dl
        style={{
          margin: 0,
          padding: 'var(--spacing-md)',
          borderLeft: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
          minWidth: 200,
        }}
      >
        {readouts.map((r) => (
          <div key={r}>{r}</div>
        ))}
      </dl>
    </div>
  )
}
''',
},

"visual-language-report": {
"source.md": '''---
title: source — visual-language-report
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `visual-language-report`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: visual-language report page; swatch tables, type specimen blocks, hairline rules; ink + warm neutrals on bone
- **Adjectives**: editorial, systematic, archival, measured
- **Display/Medium/Usage-Context**: brand-system report document (design-lab visual-language), portrait
- **Genres/Styles**: identity guidelines page; specimen-book typography
- **Color Palette**: measured — bone `#dcd1c0`, ink `#1b1e20`, warm taupes `#ada190` `#cabdaa` `#817a6e` (design-tokens.md)
- **Composition**: single-column report flow; section rules; specimen blocks inset
- **Emotional Impact**: institutional confidence; a system writing itself down
- **Other Details**: 1055×1491 PNG; dupe `design/mock-ups/608E1A7F…` left in place (canonical here)

```
visual language report page, bone paper field with swatch tables type specimen blocks hairline section rules, ink and warm taupe palette #1b1e20 #ada190 on #dcd1c0, single-column editorial flow, identity guidelines specimen-book register, systematic archival confidence, portrait document
```
''',
"design.md": '''---
version: anydesign-1
name: visual-language-report
source: extractions/visual-language-report/visual-language-report.png
captured_at: 2026-08-13
description: |
  The system writing itself down: swatch tables and type specimens on bone
  paper, ink rules, no decoration beyond the specimens themselves. Editorial
  register — the document IS the brand behaving.
colors:
  primary: "#817a6e"
  surface: "#dcd1c0"
  text-primary: "#1b1e20"
  text-muted: "#817a6e"
  border: "#ada190"
typography:
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: 16px
    lineHeight: 1.6
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48]
rounded:
  sm: 4px
---

# Design Analysis — visual language report (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Specimen-book identity page: bone paper, ink text, warm taupe apparatus.
Editorial confidence through rules and rhythm, not decoration.

## 1. Visual identity

**Personality**: editorial, systematic, archival.
**Mood**: institutional calm.
**Confidence**: ✅ palette + composition, ⚠️ type names inferred.

### 1.3 The ONE brand thing

The specimen block itself — swatches and type shown AS the content. The page
is a museum label for the system.

## 2. Tokens

Measured: `design-tokens.md` (`--color-text-primary` `#1b1e20` on
`--color-bg-primary` `#dcd1c0` — strong contrast pair ✅).

## 4. Layout & composition

Single-column flow; hairline section rules; specimens inset with mono captions.
Vertical rhythm ≈ 32–48px between sections.

## 6. Do's and Don'ts

**Do**: captions mono; specimens flush-left on the column; generous top margins.
**Don't**: no full-bleed color bands; no decorative icons; don't center prose.

## 7. Open questions

- Whether the report has a dark counterpart — none observed ❓
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: visual language report page
source: extractions/visual-language-report/visual-language-report.png
captured_at: 2026-08-13
kind: code
palette:
  - "#dcd1c0"
  - "#1b1e20"
  - "#ada190"
---

# Image-to-prompt — `visual-language-report`

Kind: **code** — report page is type + rules + swatch blocks; pure DOM/CSS.

### Canonical prompt (structured)

SUBJECT: a brand-system report page on bone paper — swatch tables, type
specimen blocks, hairline section rules, mono captions
STYLE / MEDIUM: flat editorial document, specimen-book register
COMPOSITION & CAMERA: straight-on portrait page, single column, generous margins
LIGHTING: none (flat print)
PALETTE: #dcd1c0 bone field, #1b1e20 ink, #ada190 / #817a6e warm taupe apparatus
MOOD: editorial, systematic, archival
BACKGROUND / INTEGRATION: scene — paper baked in
AVOID: no decorative illustration, no color floods, no drop shadows, no icons

### Natural-language version

A flat editorial brand-report page on bone #dcd1c0: single-column flow with
hairline rules, ink #1b1e20 prose, warm taupe #ada190 specimen tables and mono
captions — specimen-book register, generous margins, no decoration beyond the
specimens themselves.

### Model adaptation notes

- Rebuild in code preferred; regenerate only for texture reference.
''',
},

"roswell-demo-shells": {
"source.md": '''---
title: source — roswell-demo-shells
description: Vision-read source analysis per prompts/aesthetics.md.
type: note
created: 2026-08-13
author: agent
tags: [folderize, source, gold]
---

# Source — `roswell-demo-shells`

> **Provenance: self** — vision-read 2026-08-13 (gold pass). `prompts/aesthetics.md` format.

## thinkingprocess

- **Aspects/Subjects/Motifs**: research-shell app demo frame; dark charcoal chrome framing a light paper document viewport; case-file header furniture
- **Adjectives**: bipartite, archival, operational, framed
- **Display/Medium/Usage-Context**: product demo shell UI (design-lab research-shells), square
- **Genres/Styles**: archival-viewer chrome; dossier reader
- **Color Palette**: measured — charcoal `#161617`, paper `#e5dfd5`, mid greys `#41403f` `#75716d` `#c4bdb3` (design-tokens.md)
- **Composition**: dark outer frame, light document viewport inset; header strip with case furniture
- **Emotional Impact**: the file is open; apparatus recedes, document speaks
- **Other Details**: 1024×1024 PNG; byte-identical dupe is `dossier-art` sibling `press.png` (canonical here per curated-dir rule? no — dossier-art won; THIS copy is canonical of its own group only if... see manifest)

```
research shell app demo frame, dark charcoal chrome surrounding light paper document viewport, case-file header furniture mono labels, bipartite dark-frame light-document composition, square format, archival dossier reader register, operational calm, the apparatus recedes so the document speaks
```
''',
"design.md": '''---
version: anydesign-1
name: roswell-demo-shells — research shell frame
source: extractions/roswell-demo-shells/roswell-demo-shells.png
captured_at: 2026-08-13
description: |
  The two-register system in one frame: dark charcoal shell chrome wrapped
  around a light paper document viewport. Polarity flip as product
  architecture — apparatus outside, evidence inside.
colors:
  primary: "#75716d"
  surface: "#161617"
  text-primary: "#e5dfd5"
  text-muted: "#75716d"
  border: "#41403f"
  surface-document: "#e5dfd5"
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — research shell frame (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Bipartite reader: dark instrument chrome + light document viewport. The
polarity flip IS the layout system.

## 1. Visual identity

**Personality**: archival, operational, framed.
**Mood**: the file is open.
**Confidence**: ✅ palette + structure.

### 1.3 The ONE brand thing

The polarity flip itself — dark shell / light document. Both registers in one
composition; removing either collapses the concept.

## 2. Tokens

Measured: `design-tokens.md`. Note `surface-document` `#e5dfd5` — the paper
viewport is a first-class surface, not an image.

## 4. Layout & composition

Outer chrome (header strip + thin rails) in charcoal; document viewport inset
with ≈ 24–32px reveal. Ratio favors the document ~4:1.

## 6. Do's and Don'ts

**Do**: keep chrome thin; document viewport gets the area; mono labels in chrome.
**Don't**: never invert (light chrome / dark doc); no shadows between the
registers — the value contrast is the separator.

## 7. Open questions

- Does the shell collapse on small viewports? ❓ not observable.
''',
"image-to-prompt.md": '''---
version: anydesign-element-1
name: research shell app frame
source: extractions/roswell-demo-shells/roswell-demo-shells.png
captured_at: 2026-08-13
kind: code
palette:
  - "#161617"
  - "#e5dfd5"
  - "#41403f"
---

# Image-to-prompt — `roswell-demo-shells`

Kind: **code** — frame + viewport is DOM/CSS; the document content inside is data.

### Canonical prompt (structured)

SUBJECT: a desktop research-shell app frame — thin dark charcoal chrome with
case-file header furniture, wrapped around a large light paper document viewport
STYLE / MEDIUM: flat product UI mockup
COMPOSITION & CAMERA: straight-on, square, document viewport dominates ~4:1
LIGHTING: none (UI)
PALETTE: #161617 charcoal chrome, #e5dfd5 paper viewport, #41403f hairlines
MOOD: archival, operational, quiet
BACKGROUND / INTEGRATION: scene — app frame baked in
AVOID: no shadows between chrome and document, no glow, no rounded pill chrome,
no hue accents

### Natural-language version

A flat square UI mockup of an archival research shell: thin dark charcoal
(#161617) chrome with a case-file header and mono labels, surrounding a large
light paper (#e5dfd5) document viewport — the dark frame recedes, the document
speaks. No shadows, no glow, no accent colors.

### Model adaptation notes

- Rebuild in code preferred. **Midjourney** (if regenerating): `--ar 1:1 --style raw`.
''',
"component.tsx": '''import type { ReactNode } from 'react'

export interface ResearchShellFrameProps {
  caseId: string
  title: string
  toolbar?: ReactNode
  children?: ReactNode
}

export const ResearchShellFrame = ({ caseId, title, toolbar, children }: ResearchShellFrameProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderBottom: '1px solid var(--color-border-primary)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>
          {caseId} — {title}
        </span>
        {toolbar}
      </header>
      <main
        style={{
          flex: 1,
          margin: 'var(--spacing-lg)',
          background: 'var(--color-bg-document, #e5dfd5)',
          color: 'var(--color-text-on-document, #1c1c1c)',
          padding: 'var(--spacing-xl)',
          overflow: 'auto',
          lineHeight: 1.6,
        }}
      >
        {children}
      </main>
    </div>
  )
}
''',
},
}
