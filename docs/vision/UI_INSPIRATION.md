---
status: live
role: design
spine: want
updated: 2026-08-15
---

register: inspiration

# UI Inspiration — External Reference Links

Curated external UI/UX references worth stealing from. Not canon, not
contracts — a mood board of links with notes on what each one does well and
why it's relevant to Ultraterrestrial. Add to it freely; promote anything that
becomes a real design decision into [`DESIGN.md`](DESIGN.md) or the
appropriate [`docs/vision/`](docs/vision/) artifact.

Every entry gets a **Goes** tag: the surface we would actually put this
interaction on, not a vibe label.

| Tag | Meaning |
| --- | --- |
| `research-canvas` | Mindmap / Research Canvas chrome, nodes, connections, backdrops |
| `documents` | File/dossier/stack UI (records, folders, paper, terminal cards) |
| `spacetime` | Geographic / temporal canvas (`/spacetime`) |
| `tours` | Guided-tour waypoints and interstitial beats |
| `3d` | R3F / globe / spatial-gallery substrate |
| `chrome` | App shell, command palette, HUD overlays |

---

## Fable 5 Showcase — elder-plinius

A fleet experiment: 57 self-contained creative web demos (generative art,
simulations, instruments, worlds), each a **single HTML file with zero
dependencies**, designed/built/QA'd end-to-end by Claude Fable 5 agents in one
day. The whole collection is the index; the entries below are the ones most
relevant to this project's registers.

**Index:** <https://elder-plinius.github.io/FABLE-SHOWCASE/>

Why the collection matters here: every piece is one file, no build step, no
deps — the same "cheap to drop in, cheap to throw away" discipline this repo's
canvas prototypes already follow. Good source of procedural-atmosphere
techniques that could seed research-canvas backdrops or tour interstitials
without pulling in a heavy 3D dependency.

### Infinite Cathedral
<https://elder-plinius.github.io/FABLE-SHOWCASE/infinite-cathedral/index.html>

An endless nave rendered from a **single signed-distance equation** raymarched
in one fragment shader — no model, no texture, no asset. Camera self-directs;
votives you click into the dark drift away down the nave.

- **Goes:** `research-canvas` / `tours` — mythopoetic canvas backdrop or tour
  interstitial, not a product page.
- **Steal:** procedural atmosphere from pure math (SDF + raymarch) as a
  candidate backdrop for the "mythopoetic" register — cathedral-as-cosmos is
  on-voice for Ultraterrestrial without being literal.
- **Caveat:** fragment-shader cost; needs a reduced-motion / low-power path.

### Ink Flow
<https://elder-plinius.github.io/FABLE-SHOWCASE/ink-flow/index.html>

A darkroom aquarium: drag to release ink, curl-noise current unspools strokes
into glowing filaments, caustics shimmer on the floor. Never the same twice.

- **Goes:** `research-canvas` — in-flight agent inferences / connection trails
  on the canvas, not a standalone viz.
- **Steal:** the "alive before you lift your finger" responsiveness — input
  leaves a residue. Relevant to how agent inferences / in-flight connections
  could *trail* on the canvas instead of snapping into place.
- **Steal:** caustic shimmer as a low-cost ambient texture for dark surfaces.

### Starforge — Stellar Cartography Division
<https://elder-plinius.github.io/FABLE-SHOWCASE/starforge/index.html#Vharil-9>

A deterministic universe from a single 32-bit seed: star, planets, rings,
moons, catalog names, and a hand-written survey report. Same seed → identical
system. Hover a planet for telemetry.

- **Goes:** `tours` / `research-canvas` — shareable entity/tour seeds plus
  filed-report synthesis, not a planet generator.
- **Steal:** **seed-as-shareable-link** is exactly the provenance pattern we
  want for entity/tour states — a deterministic, copy-pasteable handle to a
  whole configuration. Maps cleanly onto `?entity=events:uuid` and tour seeds.
- **Steal:** the "survey report" framing — generated prose that *reads as a
  filed report*, not a chat answer. On-voice for synthesis output.

### Terraform — Cartographer's Table
<https://elder-plinius.github.io/FABLE-SHOWCASE/terraform/index.html>

A procedural cartography engine: seed → fBm noise → domain-warped coastlines →
biomes → Sobel hillshade, rendered like a **hand-inked antique atlas plate**.
Live sea-level slider, sun compass relight, surveyor's loupe magnifier,
print-ready 2× export with cartouche + north arrow + scale bar.

- **Goes:** `spacetime` / `documents` — atlas material + artifact export for
  geographic canvas snapshots; loupe for dense canvas regions.
- **Steal:** the **antique-atlas material register** is a direct cousin of
  Microfilm Dark — warm paper, ruled borders, cartouche metadata. The export
  plate (border + cartouche + scale bar) is a template for how a canvas
  snapshot could be exported as an *artifact*, not a screenshot.
- **Steal:** surveyor's loupe = contextual magnify-on-hover, a candidate for
  dense canvas regions.
- **Caveat:** the atlas look is a *different* vintage than Microfilm Dark's
  cool-grey dossier; blend deliberately, don't mix palettes by accident.

### Biome Globe — Terra Minor
<https://elder-plinius.github.io/FABLE-SHOWCASE/biome-globe/index.html>

A pocket planet observatory: one seed grows continents (3-D noise), biomes by
heat/rain, polar ice, wind-driven clouds, night-side coastal cities. Pure
Canvas 2D, zero deps. URL hash stores the world so any planet is shareable.

- **Goes:** `spacetime` / `3d` — low-cost location/world surface; URL-hash
  for canvas pan/zoom/selection. Do not justify a full R3F scene for this.
- **Steal:** **URL-hash as state** — lighter than a route, shareable without a
  backend. Relevant for canvas pan/zoom/selection state.
- **Steal:** software-rendered globe (Canvas 2D, no WebGL) as a low-cost
  "world" surface — a candidate for location/entity orbit visualizations that
  don't justify a full R3F scene.

---

## Recent.design — Scroll-Driven Reviews Drawer

<https://recent.design/i/ovkkk8y-scroll-driven-reviews-drawer>

Edoardo Lunardi — a product-site concept where **stacked file folders open on
scroll** to reveal terminal-style testimonial cards (Lenis + Motion). Light,
typographic, black-and-white. Source:
<https://x.com/edo_lunardi/status/2085743043982897338>

- **Goes:** `documents` / `research-canvas` — the folder-open-on-scroll
  mechanic belongs on the evidence file stack
  ([`apps/app/src/components/sci-fi/holographic-file-stack.tsx`](apps/app/src/components/sci-fi/holographic-file-stack.tsx)
  and research-ui document stacks), not a reviews/testimonials surface. Terminal
  cards map to the techno-analytical overlay on archival folders.
- **Steal:** scroll as the *open* gesture for a stacked dossier — folders stay
  stacked until the viewport drives them apart, then a typed/terminal card is
  the inner record. Progressive disclosure without a drawer chrome.
- **Caveat:** the source is a light product-marketing page. Keep the mechanic;
  invert the palette into Microfilm Dark / archival folders. Do not import
  Lenis as a new scroll stack unless the existing canvas scroller cannot do it.

---

## How to use this doc

- Add a link with a one-line "what it is", a **Goes** tag from the table
  above, and at least one "steal" bullet.
- If a steal becomes a real decision, move it to [`DESIGN.md`](DESIGN.md) or
  the matching [`docs/vision/`](docs/vision/) artifact and leave a pointer here.
- Keep entries to external references only — internal surfaces belong in
  [`docs/vision/IMPLEMENTATION_SPEC.md`](docs/vision/IMPLEMENTATION_SPEC.md).
