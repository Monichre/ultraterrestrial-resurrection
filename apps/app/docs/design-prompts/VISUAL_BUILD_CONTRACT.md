# Visual Build Contract — Rive Editorial Field Notes

**Updated:** 2026-07-23 18:14 CDT  
**Source classification:** `multi-screenshot`

## Source of truth

The seven supplied portrait screenshots are the sole visual source of truth. They define
composition, crop, typography, paper color, wear, density, whitespace, and accent color.
If this contract conflicts with a screenshot, follow the screenshot. Do not use the
existing Ultraterrestrial product design system to restyle these plates.

Rename the uploaded references before giving them to v0:

| Asset | Native canvas | Subject |
| --- | ---: | --- |
| `bottle-page.png` | `682px × 1024px` | Green bottle, right-edge type fragments |
| `obscured-page.png` | `682px × 1024px` | Seated obscured figure with red scarf |
| `station-page.png` | `614px × 1024px` | Train-window photograph, Seoul ticket, blue block |
| `shore-page.png` | `614px × 1024px` | Shell, pebble, horizontal CJK text |
| `rive-cover.png` | `682px × 1024px` | Blue “Rive” publication cover |
| `lighthouse-page.png` | `614px × 1024px` | Lighthouse, pale-yellow beam, vertical CJK text |
| `bird-page.png` | `614px × 1024px` | Swallow, cloud, blue plotting marks |

## Fidelity boundary

- Recreate the references; do not redesign, modernize, simplify, normalize, or improve them.
- Do not substitute generic shadcn/ui styling, SaaS cards, glass panels, navigation chrome,
  gradients, rounded containers, iconography, or decorative animation.
- Do not invent a logo, publication story, body copy, author, metrics, testimonials, product
  claims, or brand proof.
- Preserve the unusually large negative space. Empty paper is the dominant element.
- Preserve clipped, low-opacity, partially unreadable type. Do not make it more legible merely
  because HTML permits it.
- Never render a supplied screenshot as the complete page background. The composition must be
  rebuilt as layers. When no isolated source media exists, a tightly clipped crop of the
  supplied screenshot may be used only for the photograph or illustration layer.

## Observed facts

- Every source is a borderless portrait paper plate with no visible application chrome.
- Paper is warm cream or neutral gray-white with scanned fibers, speckles, edge wear, and
  uneven ink transfer.
- Most type is monospaced/typewriter-like, approximately `8px` to `13px`, with restrained
  tracking and intentionally low contrast.
- Layouts use isolated objects, asymmetrical placement, edge-clipped text, and roughly
  `55%` to `80%` negative space.
- Corners are square at `0px`; visible UI borders and drop shadows are absent.
- Ink behaves like risograph or letterpress: imperfect opacity, slight feathering, and
  multiply-like color interaction with paper.
- Accent palettes are plate-specific: bottle green, scarf red, cobalt blue, or pale yellow.
- The visible references show no hover state, selected state, menus, controls, or animation.

## Assumptions and unknowns

- **Assumption:** The implementation is a vertically scrolling seven-plate gallery because no
  navigation shell was supplied. The gallery shell must remain visually absent.
- **Assumption:** Each plate is composed at native pixel coordinates and uniformly scaled down
  when the viewport is smaller than its native width.
- **Unknown:** Exact typefaces are not supplied. Use the closest restrained typewriter and
  high-contrast display fallbacks specified below; do not claim they are exact.
- **Unknown:** Original cutout photographs and illustrations are not supplied. Prefer isolated
  user-provided assets if available. Otherwise crop only the necessary art cluster from each
  reference without using the whole screenshot as a page background.
- **Unknown:** Motion is not visible. Treat motion as absent, not implied.
- **Unknown:** Several microtext passages are illegible. Reproduce their visual line lengths
  with `aria-hidden="true"` typographic fragments or rules; do not invent prose.

## Canvas and scaling

### Native artboards

- Wide artboard: `682px × 1024px`.
- Narrow artboard: `614px × 1024px`.
- Native clipping: `overflow: hidden`.
- Native corner radius: `0px`.
- Artboard border: `0px`.
- Artboard shadow: `none`.
- Outer document gap: approx. `48px` on desktop and `0px` below the `768px` breakpoint.
- Desktop shell padding: approx. `32px 24px`.
- Mobile shell padding: `0px`.

Implement a `ScaledArtboard` wrapper with `ResizeObserver`. Keep each inner artboard at its
native pixel size and apply one uniform transform:

```ts
const scale = Math.min(1, availableWidth / nativeWidth)
```

Set the wrapper height to `1024px * scale`. Never independently stretch the x-axis or y-axis.
The page must preserve the native portrait ratio at every viewport.

### Viewport and scrolling

- Target inspection viewport: `1440px × 1200px`.
- Minimum supported viewport: `320px × 568px`.
- Gallery scroll: native vertical document scrolling.
- Scroll snapping: `none`; it is not visible in the sources.
- Horizontal overflow: hidden at the document root.
- At widths below `768px`, each plate touches the viewport edges when its scaled width permits.
- At widths above `768px`, center the native/scaled plate without adding a frame.
- Printing: one plate per portrait sheet with `break-after: page`.

## Semantic tokens

Use CSS custom properties in `app/globals.css`. Values marked `approx.` are measured visually.

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

### Typography

- Microtype: `8px/11px`, `400`, tracking approx. `0.01em`.
- Small captions: `10px/14px`, `400`, tracking approx. `0.02em`.
- Feature captions: `12px/16px`, `400`.
- Cover display: approx. `226px/0.82`, `700` to `800`, tracking approx. `-0.055em`.
- Cover CJK line: approx. `48px/56px`, `600`, tracking approx. `0.04em`.
- Cover subtitle: approx. `16px/20px`, `400`, tracking approx. `0.07em`.
- Use antialiasing sparingly. The final ink texture should soften hard digital edges.

### Texture

Each artboard creates a stacking context with `position: relative` and `isolation: isolate`.

- Base: solid paper token.
- Fiber layer: inline SVG `feTurbulence`, `mix-blend-mode: multiply`, opacity approx. `12%`.
- Speckle layer: sparse dark flecks, opacity approx. `6%`.
- Edge wear: irregular transparent/multiply masks concentrated in the outer approx. `18px`.
- Vignette: extremely subtle, no darker than approx. `4%`.
- Ink layers: `mix-blend-mode: multiply` where it preserves the printed look.
- Do not use a visible repeating digital noise pattern.

## Layer and z-index map

| Layer | Token | Content | Stacking-context notes |
| --- | --- | --- | --- |
| Paper base | `--z-paper` | Solid paper color | Artboard root uses `isolation: isolate` |
| Grain | `--z-grain` | Fibers, speckles, edge wear | `pointer-events: none`; blend mode creates local stacking |
| Ghost type | `--z-ghost-type` | Edge fragments and faded notes | May use opacity; keep inside isolated artboard |
| Art | `--z-art` | Bottle, figure, photo, ticket, shell, lighthouse, bird | Cropped media wrappers use `overflow: hidden` |
| Captions | `--z-caption` | Legible labels and dates | Multiply blend where needed |
| Registration | `--z-registration` | Blue dots, rules, squares, cross marks | No glow or shadow |
| Focus | `--z-focus` | Skip link only | Hidden unless keyboard-focused |

No child may escape the artboard stacking context. A transform on `ScaledArtboard` creates a
stacking context intentionally. Avoid additional transforms on text unless required for
rotation.

## Component architecture

### `EditorialPlateGallery`

- Responsibility: render the seven plate sections in source order.
- Anatomy: hidden skip link, `<main>`, seven `<figure>` elements, visually hidden captions.
- State: none.
- Variants: none.

### `ScaledArtboard`

- Props: native width, accessible label, paper tone, children.
- Responsibility: native coordinate system, uniform responsive scale, isolation, clipping.
- Variants: `wide` at `682px`, `narrow` at `614px`.
- State: measured width only; no user-visible loading or transition.

### `PaperTexture`

- Responsibility: grain, fiber, speckles, edge wear.
- Variants: `warm`, `neutral`, `cool-neutral`.
- State: none.

### Plate components

- `BottlePlate`
- `ObscuredPlate`
- `StationPlate`
- `ShorePlate`
- `RiveCoverPlate`
- `LighthousePlate`
- `BirdPlate`

Each owns only its absolute-positioned art, type fragments, and registration marks.

### shadcn/ui, Radix, and icon decisions

- shadcn/ui: do not use; no visible shadcn primitive exists in the references.
- Radix: do not use; no dialog, menu, tooltip, tabs, or interactive primitive exists.
- lucide-react: do not use; no interface icon appears.
- Framer Motion: do not install or use; motion is unknown and therefore absent.

## Per-plate geometry

All positions below are native artboard coordinates and are `approx.` where noted.

### Bottle plate — `682px × 1024px`

- Paper: `--paper-warm`, slightly darker and yellower than the other plates.
- Bottle cluster: approx. `left: 112px; top: 582px; width: 96px; height: 340px`.
- Bottle ink: `--ink-green`; interior remains paper-colored with coarse halftone.
- Caption “summer / still air”: approx. `left: 103px; top: 565px`.
- Date/temperature block: approx. `left: 227px; top: 854px`; two lines.
- Right-edge type rail: approx. `left: 655px; top: 321px; width: 27px; height: 582px`.
- Right-edge registration rules: approx. `18px` to `24px` long.
- Preserve at least approx. `560px` of uninterrupted paper above the bottle.

### Obscured figure plate — `682px × 1024px`

- Paper: `--paper-warm`.
- Figure cluster: approx. `left: 192px; top: 357px; width: 298px; height: 377px`.
- Red scarf region: approx. `left: 279px; top: 471px; width: 178px; height: 154px`.
- Caption “who is there”: approx. `left: 288px; top: 723px`.
- Caption “self / obscured”: approx. `left: 421px; top: 771px`.
- Folio “no. 05”: approx. `right: 54px; top: 39px`.
- Left clipped type rail: approx. `left: 0px; top: 26px; width: 27px; height: 747px`.
- Preserve the intentionally erased face; do not add facial features.

### Station plate — `614px × 1024px`

- Paper: `--paper-neutral`.
- Train-window photo: approx. `left: 269px; top: 356px; width: 194px; height: 158px`.
- White text slip overlapping photo: approx. `left: 267px; top: 492px; width: 98px; height: 91px`.
- Seoul ticket: approx. `left: 360px; top: 511px; width: 148px; height: 127px`.
- Cobalt backing block: approx. `left: 477px; top: 560px; width: 57px; height: 91px`.
- Vertical/scattered “seoul.” letters: approx. `left: 501px; top: 412px; width: 72px; height: 98px`.
- Left note block: approx. `left: 53px; top: 601px; width: 120px; height: 166px`.
- Bottom note: approx. `left: 54px; top: 776px; width: 128px`.
- Footer “platform proof”: approx. `right: 30px; bottom: 38px`.

### Shore plate — `614px × 1024px`

- Paper: `--paper-warm` with very low contrast.
- Horizontal CJK type strip: approx. `left: 0px; top: 666px; width: 614px; height: 24px`.
- Shell: approx. `left: 269px; top: 626px; width: 76px; height: 63px`.
- Pebble: approx. `left: 345px; top: 681px; width: 41px; height: 31px`.
- Violet asterisk: approx. `left: 444px; top: 125px`.
- Faded upper-right note: approx. `left: 456px; top: 153px; width: 118px; height: 143px`.
- Date/shore caption: approx. `left: 56px; top: 796px`.
- Small square and “your name”: approx. `left: 55px; top: 876px`.

### Rive cover — `682px × 1024px`

- Paper: `--paper-warm-deep`.
- Main “Rive” word: approx. `left: 151px; top: 309px; width: 412px; height: 275px`.
- Display color: `--ink-blue`; distressed print knocks paper through the letterforms.
- Folio “vol.01”: approx. `left: 518px; top: 334px`.
- CJK title: approx. `left: 159px; top: 592px`.
- Subtitle “from zero to practice”: approx. `left: 163px; top: 664px`.
- Faded vertical type fragments: left edge from approx. `top: 78px` to `bottom: 82px`.
- Do not add any content below the subtitle.

### Lighthouse plate — `614px × 1024px`

- Paper: `--paper-neutral-cool`.
- Pale-yellow beam polygon: approx. top edge from `x: 95px` to `x: 205px`, extending to
  approx. `x: 506px` to `x: 614px` at the bottom edge.
- Lighthouse image: approx. `left: 168px; top: 284px; width: 143px; height: 171px`.
- Vertical CJK line: approx. `left: 302px; top: 313px; height: 230px`; glyph interval
  approx. `39px`.
- Lower-left caption: approx. `left: 65px; top: 780px`.
- Lower-left name marker: approx. `left: 65px; top: 899px`.
- Ghost text blocks: approx. `left: 17px; top: 503px; width: 144px` and
  `left: 424px; top: 713px; width: 153px`.

### Bird plate — `614px × 1024px`

- Paper: `--paper-neutral-cool`.
- Main cluster occupies approx. `left: 53px; top: 296px; width: 392px; height: 375px`.
- Cloud: approx. `left: 215px; top: 360px; width: 126px; height: 66px`.
- Bird crop: approx. `left: 117px; top: 433px; width: 117px; height: 119px`.
- Fine arc: starts approx. `left: 53px; top: 624px`, passes through the bird, and exits
  approx. `left: 387px; top: 296px`; stroke approx. `1px`.
- “a brief lightness.”: approx. `left: 102px; top: 351px`.
- “float”: approx. `left: 351px; top: 382px`.
- “sky”: approx. `left: 275px; top: 560px`.
- Date: approx. `left: 94px; top: 594px`.
- Cobalt registration marks: two dots approx. `6px`, one plus approx. `10px`, and one
  horizontal rule approx. `26px × 1px`.

## Media and icon rules

- Use no icons.
- Keep source media rectangular unless the source visibly contains a cutout silhouette.
- Crop with fixed pixel wrappers and `overflow: hidden`; do not use rounded masks.
- Preserve grayscale, halftone, paper show-through, and imperfect edges.
- If extracted assets are available, use them with transparent backgrounds.
- If only screenshots are available, crop the smallest possible source region and use CSS
  masks/multiply blending to suppress the crop boundary.
- Never generate replacement people, landmarks, tickets, shells, birds, clouds, or bottles.

## Motion and interaction

**Motion status:** `unknown`; no motion is visible, implied, or requested.

- Render all plates statically.
- No entrance fades, parallax, hover lift, grain animation, cursor effects, or smooth scrolling.
- Keyboard and touch scrolling remain native.
- Under `prefers-reduced-motion: reduce`, retain the same static rendering and disable any
  framework-level smooth scrolling if introduced accidentally.

## Accessibility and responsiveness

- Use `<main>`, `<section>`, and `<figure>` semantics.
- Give each plate an accessible title via `aria-labelledby`.
- Give meaningful art imagery concise alt text; mark grain, registration marks, illegible
  microtype, and purely decorative fragments `aria-hidden="true"`.
- Do not put OCR guesses into alt text.
- Include a skip link that is visually hidden until focused.
- Focus ring: `2px` solid `--focus-ring` with `3px` offset.
- There are no controls, so do not invent keyboard interactions or touch targets.
- If future controls are added, minimum target size is `44px × 44px`.
- Verify text/paper contrast for meaningful captions; intentionally ghosted decorative type
  is excluded from semantic reading.
- In forced-colors mode, preserve semantic labels even if textures and art disappear.
- The artwork must not trigger horizontal scrolling at `320px` viewport width.

## Acceptance condition

At native dimensions, a difference overlay should show the main object clusters, captions,
rules, and page edges within approx. `4px` of the supplied references. Texture and distressed
ink may vary, but their density, contrast, and spatial distribution must remain perceptually
equivalent.
