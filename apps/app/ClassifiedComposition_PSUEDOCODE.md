Goal:
Create an experimental graphic composition with a military documentary aesthetic in a black/white monochrome palette featuring overlapping elements, distressed textures, cryptic typography (including Japanese), an official-looking stamp, and technical-document styling.

High-Level Structure:
- Page (app/experimental/page.tsx)
  - Header with small control panel (grain, scratches intensity).
  - ClassifiedComposition component instance.

- Components:
  1) ClassifiedComposition
     - Relative container with dark background and faint grid overlay.
     - Layers:
       - Background grid (technical document vibe).
       - Image stack:
         - Top: “football-shaped” objects image strip (slight tilt, frame).
         - Center: Explosive combat scene with smoke (largest, central).
         - Bottom: Nighttime fire photo (anchoring base).
       - Type fragments:
         - Japanese vertical text, cryptic codes, coordinates, timestamps.
       - Official stamp bottom-right (round, distressed).
       - Overlays:
         - Film grain layer (multiply).
         - Scratches layer (screen).
     - Caption labels and “document codes” around images (small monospace).

  2) LayerImage
     - Renders an image card with:
       - Subtle border frame.
       - Slight rotation and shadow.
       - Caption number and code bar.

  3) TypeFragments
     - Scattered absolute-positioned blocks:
       - Japanese text column (vertical, rotated).
       - Technical document headers (e.g., “AFTER-ACTION REPORT”).
       - Cryptic fragments and coordinates.

  4) OfficialStamp
     - Bottom-right stamp graphic with rotation and multiply blend.
     - “CLASSIFIED” text and a date code nearby.

Assets:
- /images/footballs.png  (floating oval objects)
- /images/explosion.png  (central explosion smoke)
- /images/night-fire.png (bottom fire)
- /images/stamp.png      (distressed round stamp)
- /images/grain.png      (film grain texture)
- /images/scratches.png  (film scratches texture)

State:
- grainOpacity (0..1)
- scratchOpacity (0..1)

Behavior:
- Sliders adjust overlay opacity.
- Images are grayscale and high-contrast.
- Typography fragments statically placed for composition balance.

Responsive:
- Stack layout gracefully on small screens with reduced rotations.
- Maintain legibility and alt text.

Pseudocode:
- Component ClassifiedComposition(props?: none)
  - const [grainOpacity, setGrainOpacity] = useState(0.35)
  - const [scratchOpacity, setScratchOpacity] = useState(0.45)
  - container <main> relative, bg-[#0a0a0a], text-white, min-h-screen
  - grid overlay via inline style with repeating-linear-gradient for faint lines
  - <section> relative collage area with max-w and padding
    - <LayerImage> top strip (footballs), slight rotate, small height, positioned top-left
    - <LayerImage> central main (explosion), bigger, slight different rotate, centered
    - <LayerImage> bottom (night-fire), wide, slightly rotated opposite, bottom-left
    - <TypeFragments />
    - <OfficialStamp />
    - overlays:
      - <img src="/images/grain.png" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply" style={{opacity: grainOpacity}} />
      - <img src="/images/scratches.png" class="absolute inset-0 w-full h-full object-cover mix-blend-screen" style={{opacity: scratchOpacity}} />
  - export named components.

- LayerImage({ src, alt, widthClass, heightClass, rotateClass, positionClasses, label })
  - <figure> absolute container with translate/rotate
  - inner frame div with border, overflow-hidden, grayscale filters
  - <img src=... alt=... />
  - caption: tiny monospace code and index

- TypeFragments()
  - blocks:
    - vertical Japanese text at left
    - header “AFTER-ACTION REPORT // FILE: …”
    - coordinate string
    - cryptic hash codes
    - a small “confidential” banner rotated

- OfficialStamp()
  - bottom-right absolute
  - <img src="/images/stamp.png" class="mix-blend-multiply opacity-75 rotate-[-12deg]" />
  - adjacent small monospace date code.

- Page
  - control panel (Slider for grain, scratch)
  - render <ClassifiedComposition /> passing state setters down or lifting state here.

End Conditions:
- All assets referenced via /images.
- Alt text provided.
- Composition renders in both light/dark (we enforce dark background).
- Sliders optional but present.
