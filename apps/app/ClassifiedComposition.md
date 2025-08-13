Title: ClassifiedComposition — Experimental Military Documentary Collage

Overview
ClassifiedComposition is a single-screen graphic composition that interprets wartime/military-document aesthetics in a monochrome palette. It layers multiple distressed textures, overlapping documentary-style photographs, cryptic multilingual typography, and an official stamp to evoke tension, conflict, and a “classified technical report” mood.

Key Modules
- Page: app/experimental/page.tsx
  - Hosts the composition and a compact control panel to tune texture intensity.

- Component: components/classified-composition/ClassifiedComposition.tsx
  - Orchestrates visual layers:
    - Grid background (technical document feel).
    - Three primary imagery layers (top football-like objects, center explosion, bottom fire).
    - Typographic fragments (Japanese vertical text, headers, coordinates).
    - Official stamp (bottom-right).
    - Distressed overlays (film grain, scratches).
  - Exposes grain and scratch opacity via props (internal state when needed).

- Utilities within component
  - LayerImage: consistent framed/tilted image cards with captions.
  - TypeFragments: scattered cryptic text blocks.
  - OfficialStamp: classified seal and date code.

Process and Component Architecture
- The composition uses absolute positioning for precise collage layout on a relative container with a faint engineering-style line grid.
- Image layers employ grayscale, contrast, and blend modes to harmonize into a single monochrome texture.
- Overlays for grain and scratches are placed on top with multiply/screen to simulate film wear and tear.
- Typography uses monospace and tightly tracked uppercase for technical resonance, with Japanese characters to enhance the mysterious, multi-sourced dossier feel.
- The official stamp anchors authenticity and adds a “classified” cue.

Data Flow
- Page controls update local component state controlling:
  - grainOpacity: opacity of film grain overlay.
  - scratchOpacity: opacity of scratches overlay.
- Static assets are loaded from /images.

Customization Tips
- Replace /images/*.jpg and /images/*.png to change the narrative while retaining the layout.
- Adjust rotations and positions via Tailwind classes on LayerImage instances for different tension and rhythm.
- For print-friendly output, set background to white, invert blend modes, and increase resolution assets.

Accessibility
- Alt text for all images.
- Semantic main and header.
- Controls labeled with sr-only text where needed.

Notes
- Palette strictly monochrome; avoid color to maintain documentary austerity.
- No external fonts; rely on system stack for reliability in preview environments.
