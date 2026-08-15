# Visual QA Checklist — Rive Editorial Field Notes

**Updated:** 2026-07-23 18:14 CDT  
**Source classification:** `multi-screenshot`

## Source control

- [ ] All seven screenshots are attached and mapped to the correct plate.
- [ ] The screenshots are declared the sole visual source of truth.
- [ ] The implementation does not use an entire screenshot as a page background.
- [ ] The implementation contains no redesign, modernization, simplification, beautification,
      style substitution, or generic component styling.
- [ ] No logo, publication history, author, metrics, testimonial, body copy, product claim, or
      brand proof has been invented.
- [ ] Visible facts, assumptions, and unknowns remain explicitly separated.
- [ ] Every uncertain measurement is labeled `approx.` in code comments or implementation
      notes.

## Build and stack

- [ ] The output is a runnable Next.js App Router project.
- [ ] Components use React and TypeScript with no missing types or imports.
- [ ] Styling uses Tailwind CSS and CSS custom properties.
- [ ] The page runs with the standard development command.
- [ ] shadcn/ui is absent because no visible primitive requires it.
- [ ] Radix is absent because no visible interaction primitive requires it.
- [ ] lucide-react is absent because no visible icon exists.
- [ ] Framer Motion is absent because motion is unknown.
- [ ] Components use named exports and imports remain at module top.
- [ ] Repeated decorative fragments are data-driven rather than duplicated manually.

## Artboard and viewport

- [ ] Wide plates render at native `682px × 1024px`.
- [ ] Narrow plates render at native `614px × 1024px`.
- [ ] The inner artboard always remains `1024px` high before uniform scaling.
- [ ] The x-axis and y-axis use the same scale factor.
- [ ] No composition element independently reflows when the page scales.
- [ ] Artboards use `overflow: hidden` and `isolation: isolate`.
- [ ] Artboard radius is `0px`.
- [ ] Artboard border is `0px`.
- [ ] Artboard shadow is `none`.
- [ ] Desktop gallery padding is approx. `32px 24px`.
- [ ] Desktop plate gap is approx. `48px`.
- [ ] Below the `768px` breakpoint, horizontal gallery padding is `0px`.
- [ ] Below the `768px` breakpoint, the inter-plate gap is `0px`.
- [ ] The `320px × 568px` viewport has no horizontal overflow.
- [ ] The `1440px × 1200px` viewport centers plates without enlarging them above native size.
- [ ] Vertical scroll is native; scroll snapping and smooth scrolling are absent.
- [ ] Print CSS places one plate per page using `break-after: page`.

## Tokens

- [ ] Paper, ink, accent, focus, radius, border, shadow, and z-index values are semantic CSS
      custom properties.
- [ ] Warm paper is close to `#e7dfbd`.
- [ ] Deep warm cover paper is close to `#ded2a9`.
- [ ] Neutral paper is close to `#e7e5de`.
- [ ] Cool neutral paper is close to `#e5e5e1`.
- [ ] Charcoal ink is close to `#34342f`.
- [ ] Bottle ink is close to `#3f7f53`.
- [ ] Scarf ink is close to `#b43a31`.
- [ ] Cobalt ink is close to `#1754c9`.
- [ ] Violet annotations are close to `#6f5b8f`.
- [ ] Yellow beam remains near `24%` opacity and does not glow.
- [ ] Focus ring is `2px` with `3px` offset.
- [ ] CSS z-index values are documented as unitless by CSS specification.

## Texture and material

- [ ] Paper is a material, not a flat beige fill.
- [ ] Fiber texture is visible at approx. `12%` multiply opacity.
- [ ] Sparse speckles are visible at approx. `6%` opacity.
- [ ] Edge wear is concentrated in the outer approx. `18px`.
- [ ] Vignette contrast stays below approx. `4%`.
- [ ] Grain is static.
- [ ] Grain does not form an obvious repeating digital tile.
- [ ] Printed inks use multiply blending where it matches the source.
- [ ] Ink edges have slight feathering or distress rather than perfect vector sharpness.
- [ ] “Rive” includes paper knock-through and imperfect ink density.
- [ ] No glass, blur panel, glossy highlight, neon glow, or drop shadow is present.

## Typography

- [ ] Microtype is approx. `8px/11px` and typewriter-like.
- [ ] Small captions are approx. `10px/14px`.
- [ ] Feature captions do not exceed approx. `12px/16px` unless visibly required.
- [ ] “Rive” is approx. `226px` with high-contrast serif construction and tight tracking.
- [ ] The CJK cover title is approx. `48px/56px`.
- [ ] The cover subtitle is approx. `16px/20px`.
- [ ] The chosen typewriter face is restrained and not a modern geometric sans.
- [ ] CJK glyphs use appropriate CJK font fallbacks.
- [ ] Faint and clipped text remains faint and clipped.
- [ ] Illegible source text is represented as decorative line fragments, not invented prose.
- [ ] No lorem ipsum appears.

## Layer and stacking audit

- [ ] Paper uses `--z-paper`.
- [ ] Grain uses `--z-grain` and `pointer-events: none`.
- [ ] Ghost type uses `--z-ghost-type`.
- [ ] Art uses `--z-art`.
- [ ] Captions use `--z-caption`.
- [ ] Registration marks use `--z-registration`.
- [ ] The focus-only skip link uses `--z-focus`.
- [ ] The artboard root owns the isolated stacking context.
- [ ] The `ScaledArtboard` transform creates only the intended outer stacking context.
- [ ] No unnecessary wrapper transform, filter, or opacity creates accidental layer inversion.
- [ ] Station photo, text slip, ticket, and cobalt block overlap in source order.
- [ ] All cropped media remains clipped inside the artboard.

## Bottle plate

- [ ] Canvas is `682px × 1024px`.
- [ ] Bottle cluster is approx. `112px` from the left and `582px` from the top.
- [ ] Bottle bounds are approx. `96px × 340px`.
- [ ] “summer / still air” sits approx. `17px` above the bottle.
- [ ] Date/temperature begins approx. `227px` from the left and `854px` from the top.
- [ ] Right-edge type occupies only approx. `27px` of visible width.
- [ ] At least approx. `560px` of paper remains uninterrupted above the bottle.
- [ ] Bottle ink is green, coarse, and paper-permeable rather than a polished SVG fill.

## Obscured figure plate

- [ ] Canvas is `682px × 1024px`.
- [ ] Figure begins approx. `192px` from the left and `357px` from the top.
- [ ] Figure bounds are approx. `298px × 377px`.
- [ ] Red scarf occupies approx. `178px × 154px` in the figure center.
- [ ] The face remains erased with no added eyes, nose, mouth, or skin detail.
- [ ] “who is there” aligns near approx. `top: 723px`.
- [ ] “self / obscured” aligns near approx. `left: 421px; top: 771px`.
- [ ] “no. 05” remains small at approx. `right: 54px; top: 39px`.
- [ ] Left-edge body text is clipped rather than moved inward.

## Station plate

- [ ] Canvas is `614px × 1024px`.
- [ ] Train photo is approx. `194px × 158px` at `left: 269px; top: 356px`.
- [ ] White text slip overlaps the lower-left photo area.
- [ ] Seoul ticket is approx. `148px × 127px` at `left: 360px; top: 511px`.
- [ ] Cobalt block is approx. `57px × 91px` behind the ticket.
- [ ] “seoul.” letters descend/scatter through approx. `72px × 98px`.
- [ ] Left note begins near approx. `left: 53px; top: 601px`.
- [ ] “platform proof” sits approx. `30px` from the right and `38px` from the bottom.
- [ ] Collage media remains grayscale except for the cobalt registration block and letters.

## Shore plate

- [ ] Canvas is `614px × 1024px`.
- [ ] CJK strip spans the complete `614px` width near approx. `top: 666px`.
- [ ] Shell is approx. `76px × 63px` at `left: 269px; top: 626px`.
- [ ] Pebble is approx. `41px × 31px` at `left: 345px; top: 681px`.
- [ ] The shell, pebble, and text strip overlap on the same horizontal axis.
- [ ] Violet asterisk sits near approx. `left: 444px; top: 125px`.
- [ ] Upper-right note remains barely visible.
- [ ] Date/shore caption sits near approx. `left: 56px; top: 796px`.
- [ ] Name marker sits near approx. `left: 55px; top: 876px`.

## Rive cover

- [ ] Canvas is `682px × 1024px`.
- [ ] “Rive” occupies approx. `412px × 275px`.
- [ ] “Rive” begins near approx. `left: 151px; top: 309px`.
- [ ] Cobalt hue is close to `#1754c9`, not purple or cyan.
- [ ] “vol.01” begins near approx. `left: 518px; top: 334px`.
- [ ] CJK title begins near approx. `left: 159px; top: 592px`.
- [ ] Subtitle begins near approx. `left: 163px; top: 664px`.
- [ ] Lower third remains empty.
- [ ] Faded left-edge type fragments remain visible but subordinate.
- [ ] No content, badge, or footer has been added beneath the subtitle.

## Lighthouse plate

- [ ] Canvas is `614px × 1024px`.
- [ ] Yellow beam runs from approx. `x: 95px–205px` at the top to
      approx. `x: 506px–614px` at the bottom.
- [ ] Beam is a translucent polygon, not a radial gradient or glow.
- [ ] Lighthouse is approx. `143px × 171px` at `left: 168px; top: 284px`.
- [ ] Vertical CJK line begins near approx. `left: 302px; top: 313px`.
- [ ] Vertical glyph interval is approx. `39px`.
- [ ] Coast/fog caption begins near approx. `left: 65px; top: 780px`.
- [ ] Name marker begins near approx. `left: 65px; top: 899px`.
- [ ] Both ghost text blocks remain lower contrast than the lighthouse.

## Bird plate

- [ ] Canvas is `614px × 1024px`.
- [ ] Cloud is approx. `126px × 66px` at `left: 215px; top: 360px`.
- [ ] Bird is approx. `117px × 119px` at `left: 117px; top: 433px`.
- [ ] Curved path is approx. `1px` and crosses through the collage.
- [ ] “a brief lightness.” starts near approx. `left: 102px; top: 351px`.
- [ ] “float” starts near approx. `left: 351px; top: 382px`.
- [ ] “sky” starts near approx. `left: 275px; top: 560px`.
- [ ] Date starts near approx. `left: 94px; top: 594px`.
- [ ] Registration dots are approx. `6px`, the plus approx. `10px`, and the rule
      approx. `26px × 1px`.
- [ ] Blue marks are flat printed ink with no glow.

## Motion and interaction

- [ ] Motion is labeled `unknown`.
- [ ] No motion has been inferred from static screenshots.
- [ ] No entrance fade, parallax, hover lift, grain animation, smooth scrolling, scroll snap,
      or pointer-follow effect exists.
- [ ] Native keyboard, mouse, and touch scrolling works.
- [ ] `prefers-reduced-motion: reduce` disables any inherited transition or smooth scrolling.

## Accessibility

- [ ] Page uses `<main>`, `<section>`, and `<figure>` semantics.
- [ ] Every plate has a unique visually hidden heading.
- [ ] Every plate connects to its heading with `aria-labelledby`.
- [ ] Meaningful media has concise alt text.
- [ ] Decorative grain, wear, registration marks, and illegible microtype use
      `aria-hidden="true"`.
- [ ] Uncertain OCR guesses do not appear in accessible names.
- [ ] Skip link appears only on keyboard focus.
- [ ] Skip-link focus uses a `2px` ring with `3px` offset.
- [ ] No decorative layer is keyboard focusable.
- [ ] No non-interactive element has button semantics.
- [ ] If future controls exist, their touch targets are at least `44px × 44px`.
- [ ] Meaningful captions maintain readable contrast against paper.
- [ ] Forced-colors mode retains semantic headings and alt text.
- [ ] High-contrast mode does not expose decorative microtype as meaningful content.

## Pixel-comparison revision pass

- [ ] Capture each implementation at its exact native artboard size.
- [ ] Align each capture with its reference at the upper-left pixel.
- [ ] Compare with a `50%` opacity overlay or pixel-difference mode.
- [ ] Main art clusters, captions, rules, and page edges differ by no more than approx. `4px`.
- [ ] Paper hue and contrast match before evaluating small details.
- [ ] Object crop and overlap match before evaluating texture.
- [ ] Caption baselines and edge clipping match before evaluating font nuance.
- [ ] Texture density and ink distress are perceptually equivalent.
- [ ] One complete revision pass was performed after the first comparison.
- [ ] The final response states the corrections made during that revision pass.
