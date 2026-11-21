# Typography System

Comprehensive typography components for UFO disclosure documents and dystopian interfaces.

## Components

### Typography (Base Component)

The core typography component with extensive customization options:

```tsx
import { Typography } from '@/components/design-system/typography'

<Typography 
  variant="heading-main"
  as="h1" 
  glitch={true}
  rotation={-5}
  className="mb-4"
>
  UFO DISCLOSURE
</Typography>
```

**Props:**
- `variant`: Predefined styling variants
- `size`: Text size override ('xs' to '6xl') 
- `weight`: Font weight ('light' to 'black')
- `align`: Text alignment ('left', 'center', 'right', 'justify')
- `transform`: Text transformation ('uppercase', 'lowercase', etc.)
- `as`: HTML element to render ('p', 'h1', 'span', etc.)
- `glitch`: Enable glitch animation effect
- `rotation`: Rotation angle in degrees (-45 to 45)

### Convenience Components

Pre-configured components for common use cases:

```tsx
import { 
  Heading, 
  SubHeading, 
  DataLabel, 
  DataValue, 
  HandwrittenNote, 
  Code 
} from '@/components/design-system/typography'

<Heading>ROSWELL INCIDENT</Heading>
<SubHeading>Investigation Summary</SubHeading>
<DataLabel>CASE FILE NO.</DataLabel>
<DataValue>UFO-1947-07-08-001</DataValue>
<HandwrittenNote rotation={-2}>Agent's personal note</HandwrittenNote>
<Code>const classified = "PROJECT_BLUE_BOOK";</Code>
```

## Variants

### Document Headings

**heading-main**
- Usage: Primary document titles
- Style: 6xl-7xl, black weight, uppercase, tracking-tighter
- Effects: Hover scale transition

**heading-distorted** 
- Usage: Dramatic emphasis headings
- Style: 5xl-6xl, black weight, wide tracking
- Effects: Scale-x and skew transforms

**heading-classified**
- Usage: Classification markings  
- Style: 4xl-5xl, black weight, red color
- Effects: Relative positioning for stamps

### Subheadings

**subheading**
- Usage: Section headers
- Style: 2xl-3xl, bold, uppercase, wide tracking

**subheading-glitch**
- Usage: Corrupted section headers
- Style: Same as subheading with glitch-text class

### Data Elements

**data-label**
- Usage: Field labels in forms and tables
- Style: xs, mono font, uppercase, wide tracking, faded

**data-value**
- Usage: Values corresponding to data labels
- Style: sm, mono font, wide tracking, semibold

**coordinates**
- Usage: GPS coordinates and location data
- Style: xs, mono font, tabular numbers, tight tracking

**timestamp**
- Usage: Date/time stamps
- Style: xs, mono font, faded color

### Annotations

**handwritten**
- Usage: Personal notes and annotations
- Style: sm, handwriting font family, faded, rotated

**annotation**
- Usage: Small marginal notes
- Style: xs, faded, rotated, italic

### Body Text

**body**
- Usage: Main document content
- Style: base, relaxed leading

**body-small**
- Usage: Smaller body text
- Style: sm, relaxed leading

**body-large**
- Usage: Larger body text  
- Style: lg, relaxed leading

### Interface Elements

**button**
- Usage: Button text
- Style: sm, semibold, uppercase, wide tracking

**caption**
- Usage: Image captions and small text
- Style: xs, tight leading

**code**
- Usage: Code snippets
- Style: sm, mono font, background, padding, border

### Special Effects

**blurred**
- Usage: Out-of-focus text effects
- Style: base with blur filter

**faded** 
- Usage: Aged document text
- Style: base, faded color and opacity

**redacted**
- Usage: Classified information
- Style: Black background, transparent text, not selectable

## Special Effects CSS

### Glitch Animation

Components with `glitch={true}` prop get CSS glitch effects:

```css
.glitch-element {
  animation: glitch-skew 1s infinite linear alternate-reverse;
}

.glitch-element::before,
.glitch-element::after {
  content: attr(data-text);
  position: absolute;
  /* Animated clip-path effects */
}
```

### Text Rotation

Components with `rotation` prop get CSS transforms:

```tsx
<Typography rotation={-15}>Rotated stamp text</Typography>
// Renders with: style={{ transform: 'rotate(-15deg)' }}
```

### Custom CSS Classes

Additional utility classes available:

- `.text-fragment`: Subtle blur and letter-spacing
- `.text-aged`: Contrast and sepia filters
- `.text-typewriter`: Typewriter animation effect
- `.text-on-paper`: Paper texture overlay
- `.classified-stamp`: Classification stamp styling
- `.redacted-text`: Animated redaction effect
- `.scan-line-text`: Scanning animation overlay
- `.text-shadow-glow`: Glowing text effect
- `.text-gradient-fire`: Fire gradient text
- `.text-gradient-classified`: Classification gradient

## Typography Scale

The system uses a consistent scale:

| Size | Tailwind | rem | px (16px base) |
|------|----------|-----|----------------|
| xs   | text-xs  | 0.75 | 12px |
| sm   | text-sm  | 0.875 | 14px |
| base | text-base| 1    | 16px |
| lg   | text-lg  | 1.125| 18px |
| xl   | text-xl  | 1.25 | 20px |
| 2xl  | text-2xl | 1.5  | 24px |
| 3xl  | text-3xl | 1.875| 30px |
| 4xl  | text-4xl | 2.25 | 36px |
| 5xl  | text-5xl | 3    | 48px |
| 6xl  | text-6xl | 3.75 | 60px |

## Font Families

- **Default**: System font stack
- **Mono**: 'JetBrains Mono', 'Courier New', monospace
- **Handwriting**: 'Kalam', cursive, sans-serif

Fonts are loaded via Google Fonts in typography.css.

## Responsive Behavior

Typography automatically scales on different screen sizes:

```tsx
// Responsive heading sizes
<Typography variant="heading-main" className="text-4xl md:text-6xl lg:text-7xl">
  Responsive Title
</Typography>
```

Variants include responsive breakpoints:
- Mobile: Smaller font sizes
- Tablet (md:): Medium sizes  
- Desktop (lg:): Full sizes

## Accessibility

- **Color contrast**: All text meets WCAG AA standards
- **Focus indicators**: Focusable elements have clear focus states
- **Screen readers**: Semantic HTML elements with proper roles
- **Reduced motion**: Respects prefers-reduced-motion for animations

## Examples

### Case File Header

```tsx
<div className="text-center border-b-2 border-red-600 pb-4">
  <Typography variant="heading-classified" as="h1">
    CLASSIFIED DOCUMENT
  </Typography>
  <DataLabel className="mt-2">UFO-1947-001</DataLabel>
</div>
```

### Data Table Row

```tsx
<div className="grid grid-cols-4 gap-2">
  <DataLabel>DATE</DataLabel>
  <DataValue>1947-07-08</DataValue>
  <DataLabel>STATUS</DataLabel>
  <Typography variant="redacted">ˆˆˆˆˆˆˆˆ</Typography>
</div>
```

### Annotated Document

```tsx
<Typography variant="body" className="mb-4">
  The witness reported seeing an unusual craft at approximately 2300 hours.
</Typography>

<HandwrittenNote rotation={-2} className="mb-2">
  "Definitely not conventional aircraft" - Agent Smith  
</HandwrittenNote>

<Typography variant="annotation" rotation={1}>
  Follow-up investigation scheduled for 0800 hours
</Typography>
```

### Glitch Effect

```tsx
<Typography 
  variant="heading-main" 
  glitch={true}
  className="text-center"
>
  SIGNAL CORRUPTED
</Typography>
```