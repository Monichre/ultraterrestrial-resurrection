# Ultraterrestrial Design System

A comprehensive design system for UFO disclosure documents and dystopian interfaces, featuring aged paper aesthetics, classified document styling, and data visualization components.

## Overview

This design system creates authentic-looking UFO/UAP disclosure documents with:
- **Aged paper textures** and vintage document styling
- **Classification markings** and redacted information effects  
- **Data visualization** components for coordinates, timestamps, and case files
- **Special effects** including glitch animations, blur filters, and scan lines
- **Typography system** with handwritten annotations and monospace data
- **Responsive layouts** optimized for document display

## Core Principles

1. **Authenticity**: Every component should feel like it belongs in a real classified document
2. **Hierarchy**: Clear information hierarchy using typography, spacing, and color
3. **Accessibility**: Maintain readability while preserving aesthetic effects
4. **Consistency**: Unified color palette and spacing system throughout
5. **Responsiveness**: Components work across all device sizes

## Related Docs

* [`RESEARCH_UI_DESIGN_GUIDE.md`](./RESEARCH_UI_DESIGN_GUIDE.md) — primary implementation reference (CSS, components, accessibility, performance).
* [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — cinematic collage visuals and effects (hero scenes only).
* [`ARCHIVAL_DYSTOPIAN_AESTHETIC.md`](./ARCHIVAL_DYSTOPIAN_AESTHETIC.md) — image-generation prompt language.
* [`RESEARCH_CANVAS_AESTHETIC.md`](./RESEARCH_CANVAS_AESTHETIC.md) — research workspace / AI war room direction.
* `../00_MASTER_BRAND_BIBLE.md` and `../06_DESIGN_TOKENS.ts` — consolidated brand system and tokens.

## Visual Modes

The design system supports six primary research visual modes. Every component declares one primary mode and at most one secondary accent mode:

* `archive-document` — authentic declassified documents.
* `field-evidence` — Polaroids, photos, recovered fragments and witness material.
* `technical-blueprint` — schematics, diagrams and anomalous technology analysis.
* `noir-research-canvas` — corkboards, red string, desk evidence and investigation walls.
* `ai-war-room` — modern analytical HUD overlays and graph interfaces.
* `dystopian-collage` — cinematic classified poster/case-cover compositions.

## Classification Colors

```css
:root {
  --classification-unclassified: #16a34a;
  --classification-confidential: #eab308;
  --classification-secret: #ea580c;
  --classification-top-secret: #dc2626;
}
```

## Components

### Typography System

The typography system provides specialized text components for document creation:

```tsx
import { Typography, Heading, DataLabel, HandwrittenNote } from '@/components/design-system'

// Main document heading
<Heading>UFO DISCLOSURE PROJECT</Heading>

// Classified document heading  
<Typography variant="heading-classified">TOP SECRET</Typography>

// Data labels and values
<DataLabel>CASE FILE NO.</DataLabel>
<DataValue>UFO-1947-07-08-001</DataValue>

// Handwritten annotations
<HandwrittenNote rotation={-2}>
  "Definitely not conventional aircraft" - Agent Smith
</HandwrittenNote>

// Special effects
<Typography variant="redacted">████████████</Typography>
<Typography glitch>SIGNAL CORRUPTED</Typography>
```

#### Typography Variants

- **heading-main**: Large, bold document titles
- **heading-distorted**: Skewed headings with transform effects  
- **heading-classified**: Red classification headings
- **subheading**: Section headers with optional glitch effects
- **data-label**: Uppercase labels for structured data
- **data-value**: Monospace values for precise information
- **coordinates**: Formatted GPS and location data
- **timestamp**: UTC timestamps and dates
- **handwritten**: Rotated handwritten-style annotations
- **body**: Standard document text
- **code**: Monospaced code blocks
- **redacted**: Blacked-out classified information
- **blurred**: Slightly out-of-focus text
- **faded**: Aged, faded document text

### Color System

The color palette reflects aged paper documents and UFO phenomena:

```tsx
import { ColorPalette, ColorSwatch } from '@/components/design-system'

<ColorPalette />
<ColorSwatch color="#ff6b35" name="fire-orange" />
```

#### Color Categories

**Paper Colors**
- `bg-paper` (#f4f1e8): Main document background
- `bg-paper-aged` (#e8e2d5): Aged document background

**Ink Colors**  
- `ink-black` (#1a1a1a): Primary text color
- `ink-faded` (#4a4a4a): Faded annotations

**Fire & Energy**
- `fire-orange` (#ff6b35): UFO energy effects
- `fire-yellow` (#ffd23f): Highlights and energy cores

**Classification**
- `danger-red` (#dc2626): Top Secret, Classified
- `warning-amber` (#f59e0b): Confidential warnings
- `secret-black` (#000000): Redacted information

### Layout & Spacing

Consistent spacing system based on Tailwind CSS scale:

```tsx
import { SpacingDemo, LayoutGrid, DocumentMargins } from '@/components/design-system'

<SpacingDemo />        // Show spacing scale
<LayoutGrid />         // Document grid examples  
<DocumentMargins />    // Margin and padding examples
```

#### Spacing Guidelines

- **Document padding**: Use `p-8` (32px) for main content areas
- **Compact data**: Use `p-2` (8px) for dense information
- **Section spacing**: Use `space-y-4` to `space-y-6` between sections
- **Nested content**: Use `pl-8` for indented sections

## Usage Examples

### Complete Document Layout

```tsx
{/* Use design tokens (06_DESIGN_TOKENS.ts / CSS variables), not generic Tailwind colors */}
<div className="max-w-2xl p-8 shadow-xl bg-[var(--bg-paper)] border border-[var(--grid-lines)]">
  {/* Header */}
  <div className="text-center mb-8 border-b-2 border-red-600 pb-4">
    <Typography variant="heading-classified" as="h1" className="mb-2">
      CLASSIFIED DOCUMENT  
    </Typography>
    <DataLabel>CASE FILE: UFO-1947-001</DataLabel>
  </div>
  
  {/* Metadata Grid */}
  <div className="grid grid-cols-2 gap-4 mb-6 p-4 border border-gray-300 bg-white/50">
    <div>
      <DataLabel>DATE</DataLabel>
      <DataValue>July 8, 1947</DataValue>
    </div>
    <div>
      <DataLabel>LOCATION</DataLabel>
      <Typography variant="coordinates">Roswell, NM</Typography>
    </div>
  </div>
  
  {/* Content */}
  <Typography variant="body" className="mb-4">
    At approximately 1530 hours, multiple witnesses reported...
  </Typography>
  
  <HandwrittenNote rotation={-1}>
    "Unlike anything I've seen before" - Major Marcel
  </HandwrittenNote>
</div>
```

### Data Table Layout

```tsx
<div className="grid grid-cols-4 gap-1 bg-white border border-gray-300 p-4">
  <DataLabel className="bg-gray-100 p-2 border">FIELD</DataLabel>
  <DataLabel className="bg-gray-100 p-2 border">VALUE</DataLabel>
  <DataLabel className="bg-gray-100 p-2 border">STATUS</DataLabel>
  <DataLabel className="bg-gray-100 p-2 border">NOTES</DataLabel>
  
  <Typography variant="data-value" className="p-2 border">Date</Typography>
  <Typography variant="data-value" className="p-2 border">1947-07-08</Typography>
  <Typography variant="data-value" className="p-2 border text-red-600">CLASSIFIED</Typography>
  <Typography variant="redacted" className="p-2 border">█████</Typography>
</div>
```

## Special Effects

### Glitch Animation

Add glitch effects to simulate corrupted transmissions:

```tsx
<Typography variant="heading-main" glitch>
  SIGNAL CORRUPTED
</Typography>
```

### Rotation Effects

Rotate text to simulate stamps and handwritten notes:

```tsx
<Typography rotation={-15}>Rotated stamp</Typography>
<HandwrittenNote rotation={2}>Handwritten note</HandwrittenNote>
```

### Redacted Information

Create authentic redacted text blocks:

```tsx
<Typography variant="body">
  The witness stated that{' '}
  <Typography variant="redacted" as="span">
    classified information removed
  </Typography>{' '}
  and then proceeded to describe the craft.
</Typography>
```

## Storybook Documentation

All components include comprehensive Storybook stories with:
- Interactive controls for all props
- Multiple usage examples  
- Responsive behavior demonstrations
- Complete document layout examples
- Color palette showcases
- Spacing scale visualizations

Access the Storybook with:
```bash
bun run storybook
```

Navigate to:
- **Design System/Typography** - All typography components
- **Design System/Colors** - Color palette and swatches
- **Design System/Layout & Spacing** - Spacing and grid systems

## Accessibility

The design system maintains accessibility while preserving visual effects:

- **Color contrast**: All text meets WCAG AA standards
- **Focus indicators**: Clear focus states for interactive elements
- **Screen readers**: Semantic HTML and ARIA labels where needed
- **Responsive text**: Scales appropriately on mobile devices
- **Alternative text**: Decorative elements properly marked

## CSS Integration

The design system includes custom CSS for special effects:

```css
/* Import typography effects */
@import '@/components/design-system/typography/typography.css';
```

Key CSS features:
- Glitch animations with clip-path effects
- Paper texture overlays
- Scan line animations  
- Classification stamp effects
- Redacted text styling

## Browser Support

- **Modern browsers**: Full feature support including CSS animations
- **Safari**: All features supported with vendor prefixes
- **Firefox**: Complete compatibility
- **Chrome/Edge**: Optimal experience with all effects

## Performance

- **CSS-in-JS**: Uses Tailwind classes for optimal performance
- **Lazy loading**: Special effects only loaded when needed
- **Small bundle**: Core typography system is ~8KB gzipped
- **No dependencies**: Self-contained with minimal external requirements

## Contributing

When adding new components:

1. Follow existing naming conventions
2. Add comprehensive Storybook stories
3. Include TypeScript types
4. Test across different screen sizes
5. Verify accessibility standards
6. Document usage examples

## Migration from v1

If migrating from the original CSS-only design system:

```tsx
// Old CSS classes
<div className="heading-main">TITLE</div>
<div className="data-label">FIELD:</div>

// New component system  
<Heading>TITLE</Heading>
<DataLabel>FIELD:</DataLabel>
```

The new system provides:
- Better TypeScript integration
- Consistent prop interfaces
- Improved accessibility
- Enhanced customization options