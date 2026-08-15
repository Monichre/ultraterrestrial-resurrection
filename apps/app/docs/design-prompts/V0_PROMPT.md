# v0.dev Prompt — Rive Editorial Field Notes

**Source type:** `multi-screenshot`

Copy everything below into v0.dev and attach the seven source screenshots renamed as:
`bottle-page.png`, `obscured-page.png`, `station-page.png`, `shore-page.png`,
`rive-cover.png`, `lighthouse-page.png`, and `bird-page.png`.

---

## Role and Mission

You are a principal visual-recreation frontend engineer. Build a runnable Next.js App Router
page that recreates the seven attached editorial plates as identically as possible.

This is translation, not design. The attached screenshots are the source of truth. Reproduce
their native geometry, sparse negative space, scanned paper, imperfect risograph ink,
typewriter microtype, clipped edge fragments, collage crops, and per-page accent colors.

Do not improve, modernize, simplify, normalize, or redesign the references. Do not substitute
another visual style. Do not add invented brand assets, logos, publication claims, body copy,
metrics, testimonials, product proof, navigation, cards, buttons, icons, or animation.

## Inputs

Use these attached assets as visual references:

- `bottle-page.png` — native `682px × 1024px`.
- `obscured-page.png` — native `682px × 1024px`.
- `station-page.png` — native `614px × 1024px`.
- `shore-page.png` — native `614px × 1024px`.
- `rive-cover.png` — native `682px × 1024px`.
- `lighthouse-page.png` — native `614px × 1024px`.
- `bird-page.png` — native `614px × 1024px`.

Source-of-truth precedence:

- Attached screenshots override every written approximation.
- Visible content overrides inferred structure.
- If text is illegible, reproduce its visual density with decorative fragments; do not invent
  prose or pretend an OCR guess is authoritative.
- Do not use a whole screenshot as a page background. Rebuild every page as HTML/CSS layers.
- When isolated source media is unavailable, a tightly clipped crop from the relevant
  screenshot is permitted only for its photograph or illustration cluster.

## Non-Negotiable Fidelity Rules

- Recreate; do not redesign, modernize, simplify, beautify, or style-substitute.
- Do not use generic SaaS styling, default shadcn cards, gradients, glassmorphism, pills,
  rounded panels, visible drop shadows, dashboard chrome, or decorative icons.
- Preserve the source density and roughly `55%` to `80%` negative space.
- Preserve square `0px` corners, borderless paper, asymmetric alignment, clipped edge text,
  fading, low contrast, ink feathering, and imperfect registration.
- Use pixel values for artboard dimensions, coordinates, type sizes, line heights, border
  widths, offsets, and breakpoint behavior.
- Prefix uncertain measurements in comments or documentation with `approx.`.
- Do not replace illegible microtype with lorem ipsum.
- Do not invent people, tickets, illustrations, landmarks, publication details, names, or
  multilingual copy.
- Do not add motion when the references do not show motion.

## Visible Design Extraction

### Visible facts

- Seven borderless portrait paper compositions with no visible app shell.
- Wide artboards are `682px × 1024px`; narrow artboards are `614px × 1024px`.
- Paper is warm cream or neutral gray-white with subtle fibers, speckles, edge wear, and
  uneven printed color.
- Most text is typewriter-like at approx. `8px` to `13px`.
- One cover uses an approx. `226px` cobalt high-contrast serif display word.
- Dominant accents are green, red, cobalt blue, violet, and pale translucent yellow.
- No visible rounded corners, conventional controls, hover states, icons, shadows, or motion.

### Assumptions

- Present the seven plates as one vertically scrolling gallery in source order.
- Keep the gallery shell visually absent.
- Compose at native pixel dimensions and uniformly scale only when needed.
- Exact fonts are unavailable; use the closest specified fallbacks.
- Original cutout media is unavailable; use isolated assets if supplied, otherwise tightly
  crop only the art clusters from the references.

### Unknowns

- Exact font files.
- Exact source copy for faint or clipped microtext.
- Original photograph and illustration files.
- Motion behavior; therefore implement none.

### Plate geometry

Use native pixel coordinates inside each artboard.

### Bottle plate

- Canvas: `682px × 1024px`; warm yellow-cream paper.
- Bottle cluster: approx. `left: 112px; top: 582px; width: 96px; height: 340px`.
- “summer / still air”: approx. `left: 103px; top: 565px`.
- Date/temperature: approx. `left: 227px; top: 854px`.
- Clipped right-edge type: approx. `left: 655px; top: 321px; width: 27px; height: 582px`.
- Preserve approx. `560px` of empty paper above the bottle.

### Obscured figure plate

- Canvas: `682px × 1024px`; warm cream paper.
- Figure: approx. `left: 192px; top: 357px; width: 298px; height: 377px`.
- Red scarf: approx. `left: 279px; top: 471px; width: 178px; height: 154px`.
- “who is there”: approx. `left: 288px; top: 723px`.
- “self / obscured”: approx. `left: 421px; top: 771px`.
- “no. 05”: approx. `right: 54px; top: 39px`.
- Clipped left-edge type: approx. `left: 0px; top: 26px; width: 27px; height: 747px`.
- The face remains erased/obscured; never invent facial features.

### Station plate

- Canvas: `614px × 1024px`; neutral gray-white paper.
- Train photo: approx. `left: 269px; top: 356px; width: 194px; height: 158px`.
- White text slip: approx. `left: 267px; top: 492px; width: 98px; height: 91px`.
- Seoul ticket: approx. `left: 360px; top: 511px; width: 148px; height: 127px`.
- Cobalt block: approx. `left: 477px; top: 560px; width: 57px; height: 91px`.
- Scattered “seoul.” letters: approx. `left: 501px; top: 412px; width: 72px; height: 98px`.
- Left note: approx. `left: 53px; top: 601px; width: 120px; height: 166px`.
- Footer “platform proof”: approx. `right: 30px; bottom: 38px`.

### Shore plate

- Canvas: `614px × 1024px`; pale warm paper.
- CJK strip: approx. `left: 0px; top: 666px; width: 614px; height: 24px`.
- Shell: approx. `left: 269px; top: 626px; width: 76px; height: 63px`.
- Pebble: approx. `left: 345px; top: 681px; width: 41px; height: 31px`.
- Violet asterisk: approx. `left: 444px; top: 125px`.
- Faded upper-right note: approx. `left: 456px; top: 153px; width: 118px; height: 143px`.
- Date/shore caption: approx. `left: 56px; top: 796px`.
- Name marker: approx. `left: 55px; top: 876px`.

### Rive cover

- Canvas: `682px × 1024px`; deeper yellow-cream paper.
- “Rive”: approx. `left: 151px; top: 309px; width: 412px; height: 275px`.
- Use distressed cobalt ink with paper knocking through the letterforms.
- “vol.01”: approx. `left: 518px; top: 334px`.
- CJK title: approx. `left: 159px; top: 592px`.
- “from zero to practice”: approx. `left: 163px; top: 664px`.
- Preserve faint clipped type fragments along the left edge.
- Leave the lower third empty.

### Lighthouse plate

- Canvas: `614px × 1024px`; cool neutral paper.
- Yellow beam polygon: top edge approx. `x: 95px` to `x: 205px`; bottom edge approx.
  `x: 506px` to `x: 614px`.
- Lighthouse: approx. `left: 168px; top: 284px; width: 143px; height: 171px`.
- Vertical CJK line: approx. `left: 302px; top: 313px; height: 230px`; glyph gap
  approx. `39px`.
- Date/coast caption: approx. `left: 65px; top: 780px`.
- Name marker: approx. `left: 65px; top: 899px`.
- Ghost text blocks: approx. `left: 17px; top: 503px; width: 144px` and
  `left: 424px; top: 713px; width: 153px`.

### Bird plate

- Canvas: `614px × 1024px`; cool neutral paper.
- Cluster bounds: approx. `left: 53px; top: 296px; width: 392px; height: 375px`.
- Cloud: approx. `left: 215px; top: 360px; width: 126px; height: 66px`.
- Bird: approx. `left: 117px; top: 433px; width: 117px; height: 119px`.
- Fine `1px` arc from approx. `left: 53px; top: 624px` through the bird to approx.
  `left: 387px; top: 296px`.
- “a brief lightness.”: approx. `left: 102px; top: 351px`.
- “float”: approx. `left: 351px; top: 382px`.
- “sky”: approx. `left: 275px; top: 560px`.
- Date: approx. `left: 94px; top: 594px`.
- Add only the visible cobalt registration dots, plus, and horizontal rule.

## Implementation Target

Produce a complete, runnable project using:

- Next.js App Router.
- React with TypeScript.
- Tailwind CSS.
- CSS custom properties for semantic tokens.
- `next/image` for media.
- shadcn/ui or Radix only if a visible reference primitive requires one; none does here.
- lucide-react only if a visible icon exists; none does here.
- Framer Motion only for visible, implied, or requested motion; none exists here.

The route must run with the standard project development command without missing imports,
placeholder components, or pseudo-code.

## Component Architecture

Create this structure:

```text
app/
  page.tsx
  globals.css
components/
  editorial-plate-gallery.tsx
  scaled-artboard.tsx
  paper-texture.tsx
  plates/
    bottle-plate.tsx
    obscured-plate.tsx
    station-plate.tsx
    shore-plate.tsx
    rive-cover-plate.tsx
    lighthouse-plate.tsx
    bird-plate.tsx
public/
  references/
    bottle-page.png
    obscured-page.png
    station-page.png
    shore-page.png
    rive-cover.png
    lighthouse-page.png
    bird-page.png
```

### Component contracts

- `EditorialPlateGallery`: semantic `<main>` and source-ordered `<figure>` sections; no visible
  controls or shell.
- `ScaledArtboard`: props for native width, paper tone, accessible title, and children. Keep
  inner height at `1024px`. Use `ResizeObserver` to compute one uniform scale:
  `Math.min(1, availableWidth / nativeWidth)`. Update wrapper height to `1024px * scale`.
- `PaperTexture`: CSS-only fiber, speckle, edge wear, and subtle vignette. Variants:
  `warm`, `warmDeep`, `neutral`, `coolNeutral`.
- Each plate component: one responsibility, absolute-positioned layers only.

Use named exports. Keep imports at module top. Prefer data arrays and `.map()` for repeated
microtype fragments or registration marks. Do not create classes.

### Anatomy and states

- Artboard anatomy: paper base → grain → ghost type → art → captions → registration marks.
- Artboard variants: `wide` at `682px`; `narrow` at `614px`.
- Paper variants: warm, deep warm, neutral, cool neutral.
- Visible states: static only.
- Loading state: reserve exact geometry; do not display skeleton cards, spinners, or layout
  shifts.
- Error state: omit missing decorative media while preserving semantic plate title; do not
  show a generic error panel inside the artwork.

### Primitive decisions

- Do not use shadcn/ui.
- Do not use Radix.
- Do not use lucide-react.
- Do not use Framer Motion.
- Build custom, reference-specific components because no visible design-system primitive
  matches these plates.

## Layout, Tokens, and Styling

### Gallery shell

- Desktop inspection viewport: `1440px × 1200px`.
- Minimum viewport: `320px × 568px`.
- Native vertical scrolling; `scroll-snap-type: none`.
- Desktop gallery padding: approx. `32px 24px`.
- Desktop plate gap: approx. `48px`.
- Below the `768px` breakpoint: `0px` horizontal padding and `0px` inter-plate gap.
- Hide horizontal overflow.
- No page frame, radius, border, or shadow.
- Add print CSS with one plate per page and `break-after: page`.

### CSS variables

Add these to `app/globals.css`:

```css
:root {
  --paper-warm: #e7dfbd;
  --paper-warm-deep: #ded2a9;
  --paper-neutral: #e7e5de;
  --paper-neutral-cool: #e5e5e1;
  --ink-charcoal: #34342f;
  --ink-faint: rgb(52 52 47 / 28%);
  --ink-ghost: rgb(52 52 47 / 14%);
  --ink-green: #3f7f53;
  --ink-red: #b43a31;
  --ink-blue: #1754c9;
  --ink-blue-dim: #3d4d9c;
  --ink-violet: #6f5b8f;
  --beam-yellow: rgb(226 218 105 / 24%);
  --focus-ring: #1754c9;

  --font-typewriter: "Courier Prime", "Courier New", monospace;
  --font-display: "Bodoni Moda", "Times New Roman", serif;
  --font-cjk-serif: "Noto Serif CJK SC", "Songti SC", serif;
  --font-cjk-sans: "Noto Sans CJK KR", "Apple SD Gothic Neo", sans-serif;

  --radius-paper: 0px;
  --radius-media: 0px;
  --border-paper: 0px;
  --focus-width: 2px;
  --focus-offset: 3px;
  --shadow-paper: none;
  --grain-opacity: 0.16;

  /* z-index values are unitless by CSS specification. */
  --z-paper: 0;
  --z-grain: 10;
  --z-ghost-type: 20;
  --z-art: 30;
  --z-caption: 40;
  --z-registration: 50;
  --z-focus: 100;
}
```

### Type

- Load `Courier Prime`, `Bodoni Moda`, `Noto Serif SC`, and `Noto Sans KR` through
  `next/font/google` when available.
- Microtype: `8px/11px`, weight `400`.
- Small captions: `10px/14px`, weight `400`.
- Feature captions: `12px/16px`, weight `400`.
- Cover display: approx. `226px/0.82`, weight `700` to `800`,
  `letter-spacing: -0.055em`.
- Cover CJK: approx. `48px/56px`, weight `600`, `letter-spacing: 0.04em`.
- Cover subtitle: approx. `16px/20px`, weight `400`, `letter-spacing: 0.07em`.
- Do not substitute a modern geometric sans for typewriter microtype.

### Paper and print texture

- Every artboard root uses `position: relative`, `overflow: hidden`, and
  `isolation: isolate`.
- Base color uses the matching paper token.
- Add inline SVG `feTurbulence` fiber at approx. `12%` multiply opacity.
- Add sparse speckles at approx. `6%` opacity.
- Concentrate irregular wear in the outer approx. `18px`.
- Keep the vignette below approx. `4%` contrast.
- Apply `mix-blend-mode: multiply` to printed ink and media where it matches the source.
- Distress the “Rive” word with a static mask so paper shows through.
- Grain must remain static; never animate it.

### Layer and stacking contract

The scaled artboard transform and artboard `isolation: isolate` intentionally create local
stacking contexts. CSS z-index values are unitless by specification.

- Paper: `var(--z-paper)`.
- Grain: `var(--z-grain)`, `pointer-events: none`.
- Ghost type: `var(--z-ghost-type)`.
- Art: `var(--z-art)`.
- Captions: `var(--z-caption)`.
- Registration marks: `var(--z-registration)`.
- Focus-only skip link: `var(--z-focus)`.

Do not introduce nested stacking contexts with unnecessary transforms, filters, or opacity
on wrappers. Keep filters on the individual art layer that needs them.

### Media rules

- Use no icons.
- Use square media crops and silhouette masks exactly as visible; `border-radius: 0px`.
- Prefer transparent isolated assets if supplied.
- If only the full references exist, crop the smallest art cluster and suppress its paper
  boundary with a mask and multiply blend.
- Never synthesize replacement media.

## Motion and Interaction

**Motion status:** `unknown`.

The screenshots show no visible, implied, or requested motion. Render statically:

- No entrance transition.
- No parallax.
- No hover animation.
- No animated grain.
- No scroll snapping.
- No smooth scrolling.
- No pointer-follow effects.

Native vertical mouse, keyboard, and touch scrolling is the only interaction. Under
`prefers-reduced-motion: reduce`, keep the same static output and explicitly disable any
accidentally inherited smooth scrolling or transition.

## Accessibility and Responsiveness

- Use `<main>`, `<section>`, and `<figure>`.
- Give every plate a unique visually hidden heading and connect it with `aria-labelledby`.
- Use concise alt text for meaningful bottle, figure, station, shell, lighthouse, bird, and
  cloud imagery.
- Mark grain, edge wear, decorative microtype, and registration marks `aria-hidden="true"`.
- Do not include uncertain OCR guesses in accessible names.
- Include a skip link hidden until keyboard focus.
- Focus style: `2px` solid `--focus-ring` with `3px` offset.
- There are no visible controls. Do not invent tab stops or keyboard shortcuts.
- If controls are later introduced, enforce a minimum `44px × 44px` touch target.
- Meaningful captions should satisfy readable contrast; ghost type is decorative and excluded
  from semantic content.
- In `forced-colors: active`, hide decorative texture while retaining headings and alt text.
- At `320px` viewport width, no horizontal overflow is allowed.
- Scale uniformly; never reflow or independently resize internal composition layers.
- At widths below `768px`, remove gallery side padding.
- At widths above `768px`, center the plate and preserve native size when space permits.

## Output Format

Return:

- Complete runnable Next.js App Router code, not pseudo-code.
- Every created or changed file in separate fenced code blocks with its full path as the
  heading.
- All imports, types, CSS variables, font setup, and asset references.
- A concise file tree.
- A short assumptions and unknowns list.
- A visual QA checklist.
- No marketing explanation, alternative design direction, or optional redesign.

Do not return only a plan. Do not omit code behind comments such as “implementation here.”

## Self-Audit and Revision Pass

Before finalizing, render at the native `682px × 1024px` and `614px × 1024px` sizes and
perform one explicit revision pass:

- Compare each render to its matching screenshot at equal size.
- Use a `50%` opacity overlay or pixel-difference view.
- Correct object bounds, whitespace, caption baselines, paper hue, crop, and edge clipping.
- Main object clusters, captions, rules, and page edges should land within approx. `4px`.
- Confirm the “Rive” title is not too clean, too small, too modern, or too blue-purple.
- Confirm the figure face remains erased.
- Confirm the station ticket overlaps the cobalt block and photo in the correct order.
- Confirm the shore CJK strip runs through the shell/pebble axis.
- Confirm the lighthouse beam is a broad translucent polygon, not a gradient glow.
- Confirm the bird arc is approx. `1px` and registration marks do not glow.
- Confirm paper grain is visible but does not resemble a repeating digital texture.
- Confirm no redesign, modernization, simplification, style substitution, invented copy,
  invented assets, generic components, icons, motion, radius, border, or drop shadow slipped
  into the build.
- Confirm responsive scaling at `320px`, `768px`, and `1440px` viewport widths.
- Confirm reduced-motion and forced-colors behavior.
- State what changed during the revision pass.
