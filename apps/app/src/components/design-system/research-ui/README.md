# Research UI Components

**Specialized document presentation components for the Ultraterrestrial Research Platform**

## Overview

The Research UI component library provides authentic, vintage-styled document components designed to present UAP/UFO research materials with historical accuracy and atmospheric immersion. Components simulate classified documents, incident reports, personnel files, and archival materials.

## Core Philosophy

- **Historical Authenticity**: Visual designs based on real declassified documents
- **Information Hierarchy**: Clear presentation of sensitive/classified information
- **Immersive Experience**: Vintage document styling with aging effects
- **Accessibility**: Screen reader support with semantic markup
- **Modularity**: Composable components for flexible document layouts

## Architecture

```
research-ui/
├── documents/               # Core document components
│   ├── types.ts            # TypeScript interfaces
│   ├── VintageDocumentCard.tsx    # Base document container
│   ├── IncidentReportCard.tsx     # Incident report specialization
│   ├── PersonnelFileCard.tsx      # Personnel file specialization
│   └── CaseFileFolder.tsx         # Case file organization
├── case-file-ui/           # Case file specific components
├── crash-retrievals/       # Crash retrieval documentation
├── notes/                  # Handwritten note components
├── report-files/           # Official report presentations
└── research-image-assets/  # Vintage imagery and textures
```

## Component Categories

### 1. Document Foundation
- **VintageDocumentCard**: Base container with classification badges, aging effects, and vintage styling
- **ClassificationBadge**: Security classification indicators (Unclassified → Top Secret)
- **TopSecretBanner**: Full-width classification headers

### 2. Specialized Documents
- **IncidentReportCard**: UFO sighting and encounter reports
- **PersonnelFileCard**: Military/civilian personnel documentation
- **TechnicalDiagramDocument**: Technical blueprints and schematics
- **HandwrittenNote**: Personal annotations and marginalia

### 3. Visual Elements
- **Polaroid**: Vintage photograph presentation
- **DistressedPhoto**: Aged/damaged photograph effects
- **TypedParagraph**: Typewriter-style text blocks

### 4. Interactive Components
- **DocumentLibrary**: Searchable document collection
- **CaseFileFolder**: Expandable file organization
- **SpyFilesArchiveViewer**: Archive browsing interface

## Design System Integration

### Color Palette
```css
/* From DESIGN_SYSTEM.md */
--bg-paper: #f4f1e8;
--bg-paper-aged: #e8e2d5;
--ink-black: #1a1a1a;
--ink-faded: #4a4a4a;
```

### Typography
- **Primary**: Courier New (monospace) for official documents
- **Handwritten**: Kalam (cursive) for annotations
- **Classification**: Bold, uppercase, tracked lettering

### Visual Effects
- Paper texture overlays
- Subtle aging spots and stains
- Masking tape attachment simulation
- Classification color coding
- Vintage photograph filters

## Usage Examples

### Basic Document
```tsx
import { VintageDocumentCard } from '@/components/design-system/research-ui'

<VintageDocumentCard
  classification="top-secret"
  title="PROJECT BLUE BOOK INCIDENT REPORT"
  date="15 JULY 1947"
  location="ROSWELL, NEW MEXICO"
>
  <p>Classified incident details...</p>
</VintageDocumentCard>
```

### Personnel File
```tsx
import { PersonnelFileCard } from '@/components/design-system/research-ui'

<PersonnelFileCard
  document={{
    type: "personnel",
    name: "MAJ. JESSE MARCEL",
    rank: "Intelligence Officer",
    serviceNumber: "0-1677509",
    classification: "secret",
    title: "509th Composite Group Personnel File",
    date: "1947-07-08"
  }}
/>
```

### Document Collection
```tsx
import { DocumentLibrary } from '@/components/design-system/research-ui'

<DocumentLibrary
  documents={[...documents]}
  searchable={true}
  filterByClassification={true}
/>
```

## Classification System

### Security Levels
- **UNCLASSIFIED** (Green): Public information
- **CONFIDENTIAL** (Yellow): Limited access required
- **SECRET** (Orange): National security sensitive
- **TOP SECRET** (Red): Highest classification level

### Visual Indicators
- Color-coded badges with rotation effects
- Border styling variations
- Typography weight adjustments
- Background tint modifications

## Storybook Integration

All components include comprehensive Storybook stories:
- Component variations and states
- Interactive controls for all props
- Accessibility testing scenarios
- Usage documentation and examples

View stories: `bun run storybook`

## Accessibility Features

- Semantic HTML structure
- ARIA labels for classification levels
- High contrast text/background ratios
- Keyboard navigation support
- Screen reader friendly content structure

## Component Development

### Creating New Documents
1. Extend `BaseDocumentData` interface in `types.ts`
2. Create component following `VintageDocumentCard` patterns
3. Add Storybook stories with comprehensive examples
4. Export from appropriate `index.ts` files

### Styling Guidelines
- Use design system color variables
- Implement hover/focus states
- Add subtle animations (≤300ms)
- Maintain vintage aesthetic consistency
- Test accessibility contrast ratios

## Integration Notes

- Components work with existing mindmap/research systems
- Compatible with dark/light theme switching
- Optimized for responsive layouts
- Integrates with database document models

## File Structure Reference

Key files for component development:
- `types.ts`: Type definitions
- `VintageDocumentCard.tsx`: Base component
- `*.stories.tsx`: Storybook documentation
- `research-image-assets/`: Vintage textures and imagery
- `case-file-docs.css`: Specialized styling