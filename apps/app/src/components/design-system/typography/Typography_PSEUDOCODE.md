Goal: Document plan for Storybook stories and docs for Typography component.

Scope

- Audit `Typography.tsx` variants, tokens, props.
- Create stories to visualize all variants (headings, body, research, technical, UI), colors, sizes, weights, alignments, transforms.
- Include convenience components and special effects.
- Author MDX docs describing usage, props, and examples.

Key Files

- `Typography.tsx` (component)
- `typography.css` (effects & font classes)
- `Typography.stories.tsx` (stories)
- `Typography.docs.mdx` (documentation)

Variants Matrix (from cva)

- variant: h1–h6, heading-main, heading-distorted, heading-classified, subheading, subheading-glitch,
  body, body-large, body-small, caption, data-label, data-value, coordinates, timestamp,
  code, button, typewriter, typewriter-animated, handwritten, annotation, stamp, glitch,
  redacted, scan-line, blurred, faded
- color: default, muted, destructive, primary, secondary, accent, ink-black, ink-faded,
  fire-orange, classified-red, fire-gradient, glow, hard-shadow
- size: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- weight: light, normal, medium, semibold, bold, black
- align: left, center, right, justify
- transform: none, uppercase, lowercase, capitalize

Stories

- Playground (args-driven)
- VariantsGallery (grid across variants)
- ColorsShowcase (tokens)
- SizesRow, WeightsRow (scales)
- AlignmentAndTransform (alignment + text transforms)
- SpecialEffects (glitch, redacted, scan-line, blurred, faded, stamp)
- DataDisplay (data-label/value, coordinates, timestamp, code)
- ResearchStyles (typewriter, typewriter-animated, handwritten, annotation)
- ConvenienceComponents (Heading, SubHeading, etc.)

Docs (MDX)

- Overview, usage, props table (ArgsTable), live controls, stories list.

Risks/Notes

- Storybook font variables may differ from Next layout; rely on fallbacks.
- Effects require `typography.css` imported by component; already done.
