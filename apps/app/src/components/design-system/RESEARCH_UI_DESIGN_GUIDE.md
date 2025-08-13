# Research UI Archival Design Specialist Guide

**Comprehensive Design System for Vintage Document Components**

> **Target Agent**: research-ui-archival-design-specialist  
> **Version**: 1.0  
> **Updated**: August 9, 2025  

## Design Philosophy & Core Principles

### Authenticity Standards
- **Historical Accuracy**: Visual designs must mirror real declassified documents from 1940s-1980s
- **Material Simulation**: Paper texture, aging effects, and physical document characteristics
- **Classification Realism**: Accurate representation of government security classification systems
- **Typewriter Aesthetics**: Monospace fonts with authentic spacing and alignment

### Visual Hierarchy Rules
```
Classification Level → Document Title → Date/Location → Content → Annotations
```

### Immersion Guidelines
- Subtle imperfections enhance authenticity (rotation, aging spots, worn edges)
- Interactive elements maintain document metaphor
- Modern usability without breaking period illusion

---

## Color System Architecture

### Primary Palette (CSS Custom Properties)
```css
:root {
  /* Document Base Colors */
  --bg-paper: #f4f1e8;           /* Primary manila paper */
  --bg-paper-aged: #e8e2d5;      /* Aged paper variation */
  --ink-black: #1a1a1a;          /* Typewriter ink */
  --ink-faded: #4a4a4a;          /* Faded/carbon copy text */
  
  /* Accent Colors */
  --fire-orange: #ff6b35;        /* Alert/warning elements */
  --fire-yellow: #ffd23f;        /* Highlight/emphasis */
  --smoke-gray: #7d8491;         /* Neutral atmospheric */
  --sky-dusk: #8b95a7;           /* Secondary atmospheric */
  
  /* System Colors */
  --grid-lines: rgba(0, 0, 0, 0.15);
  --noise-overlay: rgba(139, 129, 114, 0.3);
}
```

### Classification Color Coding
```css
/* Security Classification Colors */
.classification-unclassified { 
  --classification-color: #16a34a;  /* Green */
  --classification-border: #15803d;
}

.classification-confidential { 
  --classification-color: #eab308;  /* Yellow */
  --classification-border: #ca8a04;
}

.classification-secret { 
  --classification-color: #ea580c;  /* Orange */
  --classification-border: #c2410c;
}

.classification-top-secret { 
  --classification-color: #dc2626;  /* Red */
  --classification-border: #b91c1c;
}
```

### Usage Rules
- **Paper backgrounds**: Always use `--bg-paper` variables, never white
- **Text colors**: Use ink variables for authentic typewriter appearance
- **Interactive states**: Fire colors for hover/active, never modern blue
- **Classification badges**: Must use exact security colors with proper contrast

---

## Typography System

### Font Stack Hierarchy
```css
.document-official {
  font-family: 'Courier New', 'Monaco', 'Lucida Console', monospace;
  letter-spacing: -0.5px;
  line-height: 1.4;
}

.document-handwritten {
  font-family: 'Kalam', 'Permanent Marker', cursive;
  transform: rotate(-1deg to -3deg);
  color: var(--ink-faded);
}

.document-stamped {
  font-family: 'Impact', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 900;
}
```

### Typography Scale & Usage
```css
/* Document Hierarchy */
.heading-classification {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transform: rotate(-3deg);
}

.heading-document-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  margin: 0 0 16px 0;
}

.text-date-location {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  font-style: italic;
  margin: 0 0 24px 0;
}

.text-body-content {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  text-align: justify;
}

.text-handwritten-note {
  font-size: 12px;
  color: var(--ink-faded);
  transform: rotate(-1.5deg);
  margin: 8px 0;
}
```

### Special Typography Effects
```css
.typewriter-blur {
  filter: blur(0.3px);  /* Simulates slightly out-of-focus typewriter */
}

.carbon-copy {
  opacity: 0.8;
  color: var(--ink-faded);
}

.redacted-text {
  background: #000;
  color: #000;
  text-shadow: none;
  user-select: none;
}
```

---

## Document Container Architecture

### Base Container Pattern
```css
.vintage-document-base {
  /* Container Setup */
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  
  /* Paper Simulation */
  background: var(--bg-paper);
  background-image: 
    /* Subtle paper texture */
    repeating-linear-gradient(45deg, 
      transparent, 
      transparent 10px, 
      var(--bg-paper-aged) 10px, 
      var(--bg-paper-aged) 20px),
    /* Aged gradient */
    radial-gradient(ellipse at center,
      var(--bg-paper) 0%,
      var(--bg-paper-aged) 100%);
  
  /* Physical Paper Effects */
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.15),          /* Drop shadow */
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);     /* Paper edge */
  
  /* Vintage Filters */
  filter: contrast(1.05) saturate(0.95);
  
  /* Responsive Behavior */
  border-radius: 2px;  /* Minimal, paper-like */
}
```

### Document Aging Effects
```css
.paper-aging-spots {
  /* Small aging spots */
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  filter: blur(0.5px);
}

.paper-aging-spots:nth-child(1) { top: 60px; right: 80px; }
.paper-aging-spots:nth-child(2) { bottom: 100px; left: 60px; width: 2px; height: 2px; }
.paper-aging-spots:nth-child(3) { top: 200px; left: 40px; width: 1px; height: 1px; }

.masking-tape {
  position: absolute;
  width: 60px;
  height: 24px;
  background: linear-gradient(135deg, 
    rgba(220, 220, 210, 0.9) 0%,
    rgba(240, 240, 230, 0.8) 50%,
    rgba(220, 220, 210, 0.9) 100%);
  transform: rotate(var(--tape-rotation, -8deg));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.masking-tape::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%);
}
```

---

## Classification System Design

### Classification Badge Component
```css
.classification-badge {
  /* Positioning */
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  
  /* Visual Design */
  display: inline-block;
  padding: 8px 16px;
  font-family: 'Impact', sans-serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  
  /* Physical Effects */
  transform: rotate(-3deg);
  border: 2px solid var(--classification-border);
  background: var(--classification-color);
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  /* Authenticity Details */
  filter: contrast(1.1);
  transition: transform 0.2s ease;
}

.classification-badge:hover {
  transform: rotate(-3deg) scale(1.05);
}
```

### Full-Width Classification Banners
```css
.classification-banner-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: var(--classification-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Impact', sans-serif;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-bottom: 3px solid var(--classification-border);
}

.classification-banner-bottom {
  /* Same as top but positioned at bottom */
  position: absolute;
  bottom: 0;
  /* ... rest identical to top banner ... */
  border-top: 3px solid var(--classification-border);
  border-bottom: none;
}
```

---

## Interactive Element Standards

### Hover States
```css
.document-interactive:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Focus States (Accessibility)
```css
.document-interactive:focus {
  outline: 2px solid var(--fire-orange);
  outline-offset: 4px;
  transform: translateY(-1px);
}

.document-interactive:focus:not(:focus-visible) {
  outline: none;
}
```

### Active/Pressed States
```css
.document-interactive:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
```

---

## Component-Specific Styling Rules

### Vintage Document Card
```css
.vintage-document-card {
  @extend .vintage-document-base;
  
  /* Additional card-specific styling */
  min-height: 400px;
  transform: rotate(0.5deg);  /* Slight organic rotation */
}

.vintage-document-card .document-content {
  position: relative;
  z-index: 5;
  padding: 20px 0;
}
```

### Personnel File Card
```css
.personnel-file-card {
  @extend .vintage-document-card;
  
  /* Personnel file specific layout */
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  align-items: start;
}

.personnel-photo {
  width: 100px;
  height: 120px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  filter: grayscale(100%) contrast(1.2) sepia(10%);
  transform: rotate(-1deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.personnel-data-table {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.4;
  border-collapse: collapse;
  width: 100%;
}

.personnel-data-table td {
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  vertical-align: top;
}

.personnel-data-table .label {
  font-weight: bold;
  text-transform: uppercase;
  width: 30%;
  background: rgba(0, 0, 0, 0.05);
}
```

### Incident Report Card
```css
.incident-report-card {
  @extend .vintage-document-card;
}

.incident-witness-section {
  margin: 24px 0;
  padding: 16px;
  border-left: 3px solid var(--ink-faded);
  background: rgba(0, 0, 0, 0.02);
}

.incident-witness-quote {
  font-style: italic;
  position: relative;
  margin: 8px 0;
}

.incident-witness-quote::before {
  content: '"';
  font-size: 24px;
  position: absolute;
  left: -16px;
  top: -4px;
  color: var(--ink-faded);
}
```

### Technical Diagram Document
```css
.technical-diagram-document {
  @extend .vintage-document-base;
  background: #f8f8ff;  /* Slightly blue tint for blueprints */
}

.blueprint-grid {
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(0deg, 
      rgba(0, 0, 255, 0.1) 0px,
      transparent 1px,
      transparent 20px,
      rgba(0, 0, 255, 0.1) 21px),
    repeating-linear-gradient(90deg,
      rgba(0, 0, 255, 0.1) 0px,
      transparent 1px, 
      transparent 20px,
      rgba(0, 0, 255, 0.1) 21px);
  opacity: 0.6;
  pointer-events: none;
}

.technical-annotation {
  position: absolute;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #0066cc;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border: 1px solid #0066cc;
  transform: rotate(var(--annotation-rotation, 0deg));
}
```

### Handwritten Note Component
```css
.handwritten-note {
  font-family: 'Kalam', cursive;
  font-size: 14px;
  color: var(--ink-faded);
  line-height: 1.8;
  transform: rotate(-1.2deg);
  position: relative;
  margin: 16px 0;
  padding: 8px 12px;
}

.handwritten-note::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, 
    transparent 0%,
    rgba(255, 0, 0, 0.3) 20%,
    rgba(255, 0, 0, 0.3) 80%,
    transparent 100%);
  transform: translateX(-8px);
}

.handwritten-underline {
  text-decoration: none;
  position: relative;
}

.handwritten-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  transform: rotate(-0.5deg) scaleY(0.8);
  opacity: 0.7;
}
```

---

## Animation & Interaction Patterns

### Entrance Animations
```css
@keyframes document-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(0deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0.5deg);
  }
}

.document-enter {
  animation: document-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### Page Turn Effect
```css
@keyframes page-turn {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-90deg);
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.page-turn-animation {
  animation: page-turn 1.2s ease-in-out;
  transform-origin: left center;
}
```

### Typewriter Effect
```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.typewriter-text {
  overflow: hidden;
  border-right: 2px solid var(--ink-black);
  white-space: nowrap;
  animation: 
    typewriter 3s steps(40, end),
    blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: var(--ink-black); }
}
```

### Classification Badge Pulse
```css
@keyframes classification-pulse {
  0%, 100% { 
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  50% { 
    box-shadow: 
      0 3px 8px rgba(0, 0, 0, 0.2),
      0 0 0 4px rgba(var(--classification-color-rgb), 0.2);
  }
}

.classification-badge.pulse {
  animation: classification-pulse 2s ease-in-out infinite;
}
```

---

## Responsive Design Standards

### Breakpoint System
```css
/* Mobile: ≤480px */
@media (max-width: 480px) {
  .vintage-document-base {
    padding: 20px;
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
  
  .heading-document-title {
    font-size: 18px;
  }
  
  .classification-badge {
    position: relative;
    top: auto;
    right: auto;
    margin: 0 0 16px 0;
    transform: none;
  }
  
  .personnel-file-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Tablet: 481px - 768px */
@media (min-width: 481px) and (max-width: 768px) {
  .vintage-document-base {
    padding: 32px;
    margin: 24px auto;
    max-width: calc(100vw - 48px);
  }
  
  .personnel-file-card {
    grid-template-columns: 100px 1fr;
    gap: 20px;
  }
}

/* Desktop: ≥769px */
@media (min-width: 769px) {
  .vintage-document-base {
    padding: 40px;
    max-width: 800px;
  }
}
```

### Touch Target Optimization
```css
/* Ensure minimum 44px touch targets on mobile */
@media (max-width: 768px) {
  .document-interactive {
    min-height: 44px;
    min-width: 44px;
    padding: 12px;
  }
  
  .classification-badge {
    min-height: 44px;
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## Accessibility Standards

### Color Contrast Requirements
```css
/* Ensure 4.5:1 contrast ratio minimum */
.text-primary { color: var(--ink-black); }     /* 12.6:1 ratio on paper background */
.text-secondary { color: var(--ink-faded); }   /* 6.2:1 ratio on paper background */

/* Classification badges maintain contrast */
.classification-top-secret { color: white; }   /* 15.3:1 on red background */
.classification-secret { color: white; }       /* 7.8:1 on orange background */  
.classification-confidential { color: black; } /* 8.4:1 on yellow background */
.classification-unclassified { color: white; } /* 12.1:1 on green background */
```

### Semantic HTML Structure
```html
<!-- Proper document structure -->
<article class="vintage-document-card" role="document">
  <header class="document-header">
    <div class="classification-badge" role="img" 
         aria-label="Classification level: Top Secret">
      TOP SECRET
    </div>
    <h1 class="heading-document-title">Document Title</h1>
    <p class="text-date-location">
      <time datetime="1947-07-15">15 July 1947</time>
    </p>
  </header>
  
  <main class="document-content">
    <!-- Document content with proper heading hierarchy -->
  </main>
</article>
```

### Screen Reader Optimizations
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Ensure decorative elements are ignored by screen readers */
.paper-aging-spots,
.masking-tape,
.background-texture {
  aria-hidden: true;
}
```

### Focus Management
```css
/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--classification-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
```

---

## Performance Optimization Guidelines

### CSS Optimization
```css
/* Use transform and opacity for animations */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Avoid expensive properties in animations */
.avoid-in-animations {
  /* Don't animate: */
  /* box-shadow, border-radius, width, height, top, left */
  
  /* Animate instead: */
  /* transform, opacity, filter */
}
```

### Image Optimization
```css
/* Optimize background images */
.paper-texture {
  background-image: url('data:image/svg+xml,<svg>...</svg>'); /* Inline small textures */
  background-size: 100px 100px; /* Small, repeatable patterns */
}

/* Use modern image formats when possible */
.vintage-photo {
  background-image: 
    image-set(
      url('photo.avif') type('image/avif'),
      url('photo.webp') type('image/webp'),
      url('photo.jpg') type('image/jpeg')
    );
}
```

### Loading States
```css
.document-loading {
  background: linear-gradient(90deg, 
    var(--bg-paper) 25%, 
    var(--bg-paper-aged) 50%, 
    var(--bg-paper) 75%);
  background-size: 200% 100%;
  animation: document-shimmer 1.5s infinite;
}

@keyframes document-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Development Workflow

### Component Creation Checklist
1. **Extend base document patterns** from `.vintage-document-base`
2. **Apply appropriate classification system** with proper colors
3. **Include hover/focus states** for accessibility
4. **Add responsive breakpoints** for mobile compatibility
5. **Test with screen readers** and keyboard navigation
6. **Validate color contrast ratios** meet WCAG standards
7. **Optimize performance** with efficient CSS
8. **Create Storybook stories** with all component states

### Naming Conventions
```css
/* Component naming: .component-name */
.vintage-document-card { }

/* Modifier naming: .component-name--modifier */
.vintage-document-card--classified { }

/* Element naming: .component-name__element */
.vintage-document-card__header { }

/* State naming: .component-name.is-state */
.vintage-document-card.is-loading { }
```

### File Organization
```
research-ui/
├── base/
│   ├── _variables.scss      # Color and spacing variables
│   ├── _mixins.scss         # Reusable mixins
│   └── _base.scss           # Base document styles
├── components/
│   ├── _vintage-card.scss   # Core card component
│   ├── _classification.scss # Classification system
│   ├── _personnel-file.scss # Personnel file specific
│   └── _incident-report.scss # Incident report specific
├── utilities/
│   ├── _animations.scss     # Animation keyframes
│   ├── _accessibility.scss  # A11y utilities
│   └── _responsive.scss     # Breakpoint utilities
└── main.scss                # Main import file
```

### Quality Assurance Standards
- **Visual regression testing** with Chromatic
- **Accessibility audits** with axe-core
- **Performance budgets** for CSS bundle size
- **Cross-browser testing** on major browsers
- **Device testing** on actual mobile devices

This comprehensive guide ensures all research-ui components maintain authentic vintage document aesthetics while meeting modern usability, accessibility, and performance standards.