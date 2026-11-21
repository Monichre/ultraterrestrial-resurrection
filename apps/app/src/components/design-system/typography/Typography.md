---
description: Design system typography component with variants, effects, and convenience wrappers
---

Overview

- `Typography` is the core text component with class-variance-authority variants.
- Provides headings, body, data/technical mono, research/archival effects, and UI labels.
- Convenience wrappers: `Heading`, `SubHeading`, `DataLabel`, `DataValue`, `Code`, `GlitchText`, `RedactedText`, `TypewriterText`, `HandwrittenNote`, `ClassifiedStamp`.

Imports

```tsx
import {
  Typography,
  Heading,
  SubHeading,
  DataLabel,
  DataValue,
  Code,
  GlitchText,
  RedactedText,
  TypewriterText,
  HandwrittenNote,
  ClassifiedStamp,
} from '@/components/design-system/typography/Typography'
```

Common Usage

```tsx
<Heading>Document Title</Heading>
<SubHeading color='muted'>Section</SubHeading>
<Typography variant='body'>Body content...</Typography>
<Typography variant='caption' color='muted'>Caption</Typography>
<GlitchText dataText='GLITCH'>GLITCH</GlitchText>
<RedactedText>TOP SECRET</RedactedText>
<ClassifiedStamp>OPERATION</ClassifiedStamp>
```

Props

- variant: rich set including `h1`..`h6`, `heading-main`, `heading-distorted`, `heading-classified`, `subheading`, `subheading-glitch`, `body`, `body-large`, `body-small`, `caption`, `data-label`, `data-value`, `coordinates`, `timestamp`, `code`, `button`, `typewriter`, `typewriter-animated`, `handwritten`, `annotation`, `stamp`, `glitch`, `redacted`, `scan-line`, `blurred`, `faded`.
- color: `default`, `muted`, `destructive`, `primary`, `secondary`, `accent`, `ink-black`, `ink-faded`, `fire-orange`, `classified-red`, `fire-gradient`, `glow`, `hard-shadow`.
- size: `xs`..`6xl`
- weight: `light`..`black`
- align: `left`, `center`, `right`, `justify`
- transform: `none`, `uppercase`, `lowercase`, `capitalize`
- as: element override
- glitch: boolean (adds glitch layers)
- rotation: number (deg) to rotate text
- dataText: string for glitch pseudo-elements

Fonts

- Fonts and CSS variables are set in `apps/app/src/app/layout.tsx` via `next/font`.
- Fallback stacks are defined in `typography.css`.

Storybook

- See `Typography.stories.tsx` and `Typography.docs.mdx` for comprehensive examples.
