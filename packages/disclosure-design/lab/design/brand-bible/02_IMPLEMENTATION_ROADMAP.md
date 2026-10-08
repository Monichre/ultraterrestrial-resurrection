# Implementation Roadmap

## Package Goal

Build a coherent, production-ready research UI design system for the Ultraterrestrial Research Platform that supports authentic archival documents, field evidence, Polaroids, classified reports, noir research workspaces, and restrained AI analysis overlays.

## Immediate Priorities

1. Normalize shared design tokens.
2. Add visual-mode taxonomy.
3. Build the Polaroid component set.
4. Refactor existing document cards to use shared classification tokens.
5. Add reduced-motion protection to all animations.
6. Add Storybook stories for each visual mode.
7. Add accessibility snapshots for document and Polaroid components.

## Phase 1: Foundations

### Deliverables

* Master color palette.
* Type scale.
* Logo/wordmark direction.
* Core prompt tokens.
* 20 reusable textures.
* 20 stamps/labels.
* 20 icons.
* Shared classification system.
* Visual mode metadata type.

### Files to Create or Update

```text
apps/app/src/components/design-system/research-ui/tokens/research-ui.tokens.ts
apps/app/src/components/design-system/research-ui/tokens/research-ui.css
apps/app/src/components/design-system/research-ui/types/visual-modes.ts
apps/app/src/components/design-system/research-ui/styles/reduced-motion.css
```

### Acceptance Criteria

* All components can consume shared color and typography tokens.
* Classification colors are not duplicated across files.
* Visual mode taxonomy is documented and exported.
* Reduced motion rules apply to all research UI animations.

## Phase 2: Polaroid + Field Evidence System

### Deliverables

* `PolaroidFrame`
* `PolaroidEvidenceCard`
* `DistressedPolaroid`
* `TapedPolaroid`
* `PolaroidStack`
* `PolaroidContactSheet`
* Shared Polaroid types.
* Shared Polaroid texture CSS.
* Storybook stories.

### Target Directory

```text
apps/app/src/components/design-system/research-ui/photography/polaroids/
```

### Acceptance Criteria

* Polaroids support caption, evidence ID, timestamp, classification, rotation, distress variant, and tape variant.
* Decorative texture elements are hidden from screen readers.
* Keyboard focus states are visible.
* Hover animation respects reduced motion.
* Component works in evidence stack, dossier page, and research board contexts.

## Phase 3: Document System Refactor

### Components to Review

```text
VintageDocumentCard.tsx
IncidentReportCard.tsx
PersonnelFileCard.tsx
TechnicalDiagramDocument.tsx
HandwrittenNote.tsx
```

### Required Updates

* Use shared classification tokens.
* Add visual mode metadata.
* Validate ARIA labels.
* Remove invalid CSS patterns.
* Normalize paper texture intensity.
* Ensure mobile layout works.
* Add Storybook states for classification levels.

### Acceptance Criteria

* All document cards use the same classification API.
* Top Secret, Secret, Confidential, and Unclassified states render correctly.
* Personnel files use photo column + data grid pattern.
* Incident reports include witness sections and timeline structure.
* Technical diagrams support blueprint backgrounds and annotations.

## Phase 4: Research Workspace / Noir Canvas

### Deliverables

* Research board layout.
* Evidence pinning system.
* Dossier stack component.
* Red string / relationship line overlay.
* Low-opacity AI HUD overlay.
* Node graph visual layer.

### Rules

* AI HUD overlays must sit at 10–20% opacity.
* HUD overlays must never reduce text contrast or obscure primary evidence.
* Neon colors are allowed only as accent signals.
* Primary content remains archival and tactile.

### Acceptance Criteria

* Research canvas feels analog first, digital second.
* Users can distinguish evidence, annotations, and AI suggestions.
* Motion is subtle and optional.
* Screen remains usable without the aesthetic layer.

## Phase 5: Content System

### Deliverables

* Phenomenon taxonomy.
* Evidence taxonomy.
* Reliability scale.
* Case file template.
* Article template.
* Myth-tech template.
* Source standards.

### Phenomenon Types

* Aerial Object.
* Orb/Light.
* Landing Trace.
* Crash/Recovery.
* Entity Encounter.
* Missing Time.
* Symbolic Recurrence.
* Consciousness Event.
* Government Program.
* Ancient Parallel.
* Material Claim.
* Signal/Transmission.

### Evidence Types

* Witness Testimony.
* Photo/Video.
* Radar/Sensor.
* Official Document.
* Physical Trace.
* Medical/Biological.
* Recovered Material.
* Historical Text.
* Mythological Correlation.
* Remote Viewing/Consciousness Claim.
* Anonymous Leak.

### Confidence / Status

* Unverified.
* Contested.
* Plausible.
* Multi-source.
* Corroborated.
* Officially Documented.
* Misidentified.
* Disinformation Suspected.
* Archived.
* Active Research.

## Phase 6: Marketing + Public Release System

### Deliverables

* Landing page.
* Social templates.
* Case drop carousel.
* Reel format.
* Launch poster.
* App store screenshots.
* Press kit graphics.

### Public Release Format Types

1. **Case Drop**: Case title, incident summary, evidence, timeline, anomalous residue, open questions.
2. **Symbol File**: Symbol title, historical source, recurring pattern, modern parallel, interpretive caution, related cases.
3. **Evidence Breakdown**: Evidence image, metadata, claimed phenomenon, supporting factors, weakening factors, current status.
4. **Disclosure Timeline**: Event, year, key document, why it matters, remaining questions.

## Phase 7: Advanced Product Features

### Feature Ideas

1. **Anomalous Residue Score**: After conventional explanations are evaluated, show what remains unexplained.
2. **Source Chain Viewer**: Visualize how a claim moves through witnesses, books, documents, podcasts, articles, and official records.
3. **Mythic Pattern Matcher**: Connect modern reports to recurring ancient motifs without claiming direct proof.
4. **Case Confidence Ledger**: Track why a case moves from unverified to contested to multi-source and beyond.
5. **Field Report Intake**: Let users submit sightings in a structured, serious format.
6. **Evidence Layer Toggle**: Switch between original, enhanced, annotated, and source-context views.
7. **Redacted Mode**: Hide unverified claims or low-confidence material based on user-selected epistemic strictness.

## Quality Control Checklist

### Visual

* Does this feel like evidence?
* Does this feel classified or merely decorative?
* Does this look grounded and plausible?
* Does this avoid generic sci-fi tropes?
* Does this have analog imperfection?
* Is there enough negative space?
* Is the typography believable?
* Does the artifact tell a story?

### UI

* Is the UI readable?
* Is hierarchy obvious?
* Are controls visually separate from texture?
* Does mystery support the task?
* Is there too much noise?
* Does the screen still work without the aesthetic layer?

### Accessibility

* Text contrast meets WCAG AA.
* Red is not the only status indicator.
* Reduced motion is supported.
* Decorative elements are screen-reader hidden.
* Touch targets are at least 44px.
* Monospace is used for metadata, not long paragraphs.

## Recommended Development Order

```text
1. Tokens
2. Visual modes
3. Reduced motion CSS
4. PolaroidFrame
5. PolaroidEvidenceCard
6. DistressedPolaroid
7. TapedPolaroid
8. PolaroidStack
9. PolaroidContactSheet
10. Storybook stories
11. Existing document refactor
12. Research workspace overlays
13. Content taxonomy integration
```
