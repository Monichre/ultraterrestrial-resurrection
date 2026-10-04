---
title: Disclosure Visual Language
description: Generated visual grammar and agent-ingestion guide for the design-reference laboratory.
type: guide
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [visual-language, design-lab, prompts, tokens, interfaces, generated]
generated_from: language/visual-language.json
---

# Disclosure Visual Language

Turn visual research into a repeatable design grammar that agents can load before designing prompts, tokens, components, or interfaces.

**Position:** Visual system first. Narrative and mythological theater are optional amplifiers, never substitutes for composition, typography, material, hierarchy, or usability.

**Origin:** Ultraterrestrial is the originating context and primary proving ground. The visual lab may generalize useful discoveries, but it does not erase where they came from.

> **Lab test:** Can this visual decision be observed, named, tokenized, prompted, and reproduced without improvisation?

**Originating creative test:** Make the impossible feel investigable.

**Revision:** `2026-08-16.2`

This file is generated. Edit `language/visual-language.json`, then run
`python3 scripts/visual_language.py render`.

## Core Laws

- **Treat the vault as a visual laboratory: observe, compare, formalize, test, and only then canonize.** A mood board becomes useful when its decisions survive prompts, tokens, and interfaces.
- **The interface must work without narrative theater; atmosphere may deepen the task but may not carry it.** Lore cannot rescue weak hierarchy, illegible type, or generic component composition.
- **Choose the product surface family before retrieving narrower visual references.** A reference family is evidence for a design decision, not an app architecture.
- **Let the evidence object, image, diagram, or research action dominate; apparatus and commentary remain subordinate.** The system is credible when the visual hierarchy belongs to the material being investigated.
- **Assign typography by role and surface instead of forcing one global typewriter voice.** Archival metadata, readable body copy, classification, annotation, and modern controls have different jobs.
- **Use chroma as information: one cold signal, one warm intervention, or one classification state—not ambient decoration.** Restrained color makes anomalies legible and prevents generic sci-fi spectacle.
- **Texture must be felt before it is noticed and must never compete with text or controls.** Materiality creates credibility only while remaining subordinate to reading and interaction.
- **Favor one monumental field and a microscopic apparatus; avoid filling every middle scale with cards.** The tension between macro form and micro evidence is a distinctive compositional signature.
- **Every new interface direction must name at least three source documents or Gold Extractions that justify its visual choices.** Agents should retrieve the visual system, not improvise a flattering description after the fact.

## The Three Visual Lanes

The three tangible product surface families that operate alongside one another in Ultraterrestrial. They are stable interface environments, not themes, epistemic tiers, output channels, or picker-controlled skins.

Visual Lanes determine the kind of surface being designed. The narrower source modes survive as retrieval labels for locating relevant material; agents do not carry all of them as competing app styles.

| Lane | Plain name | Job | Maturity |
|---|---|---|---|
| **Core Interface** | The App | Provide the native product experience: navigation, search, reading, forms, state, commands, settings, and ordinary interaction. | emerging |
| **Evidence Archive** | The Archive | Present records, files, photographs, polaroids, testimony, artifacts, citations, and other evidence as readable material with provenance and history. | established |
| **Tactical Spatial** | The Field | Render spatial, military, sensor, orbital, temporal, and systems-level investigation where advanced technology meets existential cosmic scale and dread. | developing |

### Core Interface — The App (`core-interface`)

A slick, minimal, near-future interface whose precision and restraint make the product feel advanced without performing science fiction.

- **Job:** Provide the native product experience: navigation, search, reading, forms, state, commands, settings, and ordinary interaction.
- **Maturity:** emerging
- **Owns:** global shell, navigation, search and command surfaces, forms and controls, loading, empty, error, and system states, general reading chrome
- **Visual character:** clean geometric hierarchy, large quiet fields, thin exact dividers, low-chroma surfaces, selective cold illumination, minimal radius, high-quality motion with little ornament
- **Motion:** Fast, precise, and state-driven. Motion communicates continuity, focus, hierarchy, and spatial consequence; it does not simulate machinery for its own sake.
- **Default narrative theater:** 0/3
- **Reference families:** technical-blueprint, public-release
- **Palette:** void-black, charcoal-ink, document-white, dead-silver, cold-saucer-light
- **Type roles:** ui-body, official-display, archival-metadata
- **Textures:** none by default
- **Avoid:** generic SaaS defaults, archival props used as global chrome, constant HUD ornament, neon cyberpunk, over-rounded component kits, pretending this emerging lane is already fully solved
- **Gold references:** interface-gallery-overview, near-black-geometry, ethereal-quote-landing, prometheus-line-studies
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/Design Canon/DESIGN_SYSTEM.md, design/design-lab/UiDesignBrief.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace

### Evidence Archive — The Archive (`evidence-archive`)

Source material feels handled, catalogued, and physically credible while remaining legible enough for sustained research.

- **Job:** Present records, files, photographs, polaroids, testimony, artifacts, citations, and other evidence as readable material with provenance and history.
- **Maturity:** established
- **Owns:** document library, record and case views, dossiers and folders, photographs and polaroids, evidence cards, citations, captions, and provenance
- **Visual character:** paper and photographic materiality, institutional document structure, measured wear, solid sourced boundaries, metadata rails, controlled stamps, redaction, annotation, tape, and clips
- **Motion:** Material and deliberate: reveal, unfold, stack, focus, inspect, and return. Avoid novelty page theatrics that slow access to evidence.
- **Default narrative theater:** 1/3
- **Reference families:** archive-document, field-evidence, noir-research-canvas
- **Palette:** archive-bone, oxidized-paper, document-white, charcoal-ink, faded-graphite, classified-red
- **Type roles:** ui-body, archival-metadata, classification, field-annotation, damaged-document
- **Textures:** paper-grain, halftone, fold-seam, redaction
- **Avoid:** turning the entire app into a scrapbook, uniform grunge, typewriter monoculture, fake classification on ordinary controls, decorative redaction, generated imagery masquerading as archival evidence
- **Gold references:** plate-047-brand-bible, dossier-art-covers, nasa-dossier-1978, case-file-dossier-covers, roswell-clauson-page
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/03_POLAROIDS_COMPONENT_SPEC.md, design/brand-bible/Design Canon/RESEARCH_UI_DESIGN_GUIDE.md

**Resolved palette**

- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `oxidized-paper` #B9AE95 — older scans, page edges, and secondary paper
- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `faded-graphite` #4A4A44 — secondary text, diagrams, and quiet apparatus
- `classified-red` #A1231E — classification, correction, and institutional intervention

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `classification` — stamps, classifications, short warnings, and identifiers only; Anton, Impact-like condensed sans, stencil display
- `field-annotation` — brief handwritten corrections, witness notes, and marginalia; Caveat, Just Another Hand, Kalam
- `damaged-document` — short artifact text and atmospheric document moments, never the whole application; Special Elite, distressed typewriter face

### Tactical Spatial — The Field (`tactical-spatial`)

A stunning but disciplined operational field: military-grade precision confronting something cosmically larger than the instrument built to measure it.

- **Job:** Render spatial, military, sensor, orbital, temporal, and systems-level investigation where advanced technology meets existential cosmic scale and dread.
- **Maturity:** developing
- **Owns:** HUD and sensor views, maps, globes, and spatial canvases, timelines and trajectories, 3D and orbital scenes, military and aerospace systems, signal analysis, clearly labeled reconstruction and high-intensity investigative moments
- **Visual character:** deep spatial fields, fine military and aerospace geometry, sensor traces, coordinates and targeting apparatus, monumental scale, cold light, controlled warning chroma, darkness that implies unmeasured depth
- **Motion:** Scanning, tracking, triangulating, orbiting, locking, resolving, and revealing scale. Motion may be cinematic, but every analytical signal must retain a real meaning.
- **Default narrative theater:** 2/3
- **Reference families:** technical-blueprint, blacksite, myth-tech, noir-research-canvas, dystopian-collage, ai-war-room
- **Palette:** void-black, black-budget-green, dead-silver, cold-saucer-light, signal-amber, classified-red
- **Type roles:** ui-body, official-display, archival-metadata, classification
- **Textures:** scanlines, background-glyph, halftone
- **Avoid:** video-game HUD clutter, generic neon cyberpunk, random reticles, military cosplay without operational data, spectacle obscuring controls, cinematic reconstruction presented as sourced evidence
- **Gold references:** globe-hud-process-refs, geometric-grid-hud, hud-line-geometry, spy-lab-war-room-moodboard, dystopian-cosmic-dread, near-black-geometry
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/05_PROMPT_TOKENS.md, design/brand-bible/09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md, design/brand-bible/Design Canon/RESEARCH_CANVAS_AESTHETIC.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `black-budget-green` #1B2A24 — dark technical surfaces and military undertone
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance
- `signal-amber` #F06A2A — warm intervention, warning, and energy accent
- `classified-red` #A1231E — classification, correction, and institutional intervention

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `classification` — stamps, classifications, short warnings, and identifiers only; Anton, Impact-like condensed sans, stencil display

### Coexistence Rules

- The Core Interface is the persistent connective tissue. It owns the shell even when another lane owns the main field.
- Evidence Archive objects retain their material identity inside Core Interface and Tactical Spatial surfaces; the surrounding app does not need to become paper.
- Tactical Spatial may take over the main field only when the task is spatial, sensor-based, military, temporal, orbital, reconstructive, or systems-level.
- One region or component has one owning lane. A surface may embed a component from another lane, but it may not blend their signals into an ambiguous hybrid.
- Visual Lanes are not themes and never appear as a mode picker. The user's task determines the lane; navigation between tasks creates the transition.
- Provenance remains invariant across all lanes: sourced material is solid, analytical inference is dashed, and cinematic or hypothetical reconstruction is explicitly labeled and visually separated.
- The narrow reference families are retrieved only after a lane is chosen. They supply examples and techniques; they do not create additional app-wide styles.

### Common Handoffs

| Surface | Owning lane | Embedded lanes | Rule |
|---|---|---|---|
| Search and discovery | `core-interface` | `evidence-archive` | The app provides search, filters, and navigation; results preview records without turning the whole screen into a dossier. |
| Record or case detail | `evidence-archive` | `core-interface` | The document becomes the reading surface while native app controls remain visually quiet and unmistakably functional. |
| Map, globe, timeline, or reconstruction | `tactical-spatial` | `core-interface`, `evidence-archive` | The operational field owns scale and movement; selected evidence opens as intact archival material within stable app chrome. |
| Home or major narrative threshold | `core-interface` | `tactical-spatial` | The entry experience may borrow Tactical Spatial scale and dread, but navigation, calls to action, and product comprehension remain Core Interface. |

## Four Priority Application Surfaces

Until these surfaces are visually coherent, new app-facing visual-system work defaults to one of them. Standalone routes, experiments, and deeper reference families do not earn separate app-wide doctrine by existing.

**Working hierarchy:** Focus surface → owning Visual Lane → intact embedded lanes → zero to two reference families → Gold Extractions and tokens.

### Home / Entry (`home-entry`)

- **Kind:** threshold
- **Job:** Orient the visitor, establish scale and confidence, and provide an unmistakable entrance into the product.
- **Route:** `/`
- **Owning lane:** `core-interface`
- **Embedded lanes:** `tactical-spatial`
- **Current state:** Live cinematic home experience with an active 3D and motion design lab; it is visually important but not a research work surface.
- **Default narrative theater:** 2/3
- **Visual question:** How can the product feel advanced, consequential, and cosmically scaled while navigation and comprehension remain effortless?
- **Default references:** `technical-blueprint`, `dystopian-collage`
- **App evidence:** `apps/app/src/app/page.tsx`, `apps/app/src/layouts/home/home-animated.tsx`, `apps/app/src/app/design-lab/home-celestial/`

### Research Canvas (`research-canvas`)

- **Kind:** primary-work-surface
- **Job:** Let a researcher assemble records, inspect relationships, and work with clearly delineated analytical inference.
- **Route:** `/research-canvas`
- **Owning lane:** `core-interface`
- **Embedded lanes:** `evidence-archive`, `tactical-spatial`
- **Current state:** Live primary graph canvas with secondary timeline, globe, search, and detail views still present inside its provider stack; the graph remains the primary surface.
- **Default narrative theater:** 1/3
- **Visual question:** What is the native Ultraterrestrial application interface when evidence objects and analytical spatial tools must coexist for hours?
- **Default references:** `noir-research-canvas`, `ai-war-room`
- **App evidence:** `apps/app/src/app/(site)/research-canvas/page.tsx`, `apps/app/src/features/mindmap/`, `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`

### Archive / Record (`archive-record`)

- **Kind:** content-work-surface
- **Job:** Let a researcher browse, open, read, compare, and understand the provenance of records, files, photographs, testimony, and evidence.
- **Route:** `fragmented: /record-stack, /document-panel, and record/detail views`
- **Owning lane:** `evidence-archive`
- **Embedded lanes:** `core-interface`
- **Current state:** Material and component work exists, but the product surface is fragmented across a record-anatomy prototype, a specification-sheet prototype, and multiple case/detail implementations. Do not describe it as one finished library.
- **Default narrative theater:** 1/3
- **Visual question:** How does source material remain tactile, credible, and beautiful without turning research into scrapbook theater or sacrificing dense reading?
- **Default references:** `archive-document`, `field-evidence`
- **App evidence:** `apps/app/src/app/(site)/record-stack/page.tsx`, `apps/app/src/features/record-stack/`, `apps/app/src/app/document-panel/page.tsx`, `apps/app/src/components/document-panel/`

### Spacetime Observatory (`spacetime-observatory`)

- **Kind:** specialist-work-surface
- **Job:** Let a researcher investigate evidence across geography and time through maps, globes, temporal instruments, and selected event records.
- **Route:** `/spacetime`
- **Owning lane:** `tactical-spatial`
- **Embedded lanes:** `core-interface`, `evidence-archive`
- **Current state:** Implemented sibling surface with a docked observatory foundation; reconstruction, comparison, and deeper cinematic capabilities remain later milestones.
- **Default narrative theater:** 2/3
- **Visual question:** How can military-grade spatial precision meet cosmological scale and dread without becoming a game HUD or obscuring evidence?
- **Default references:** `blacksite`, `technical-blueprint`
- **App evidence:** `apps/app/src/app/(site)/spacetime/page.tsx`, `apps/app/src/features/spacetime/`, `docs/vision/TEMPORAL_OBSERVATORY.md`


## Selection Protocol

1. Select one Visual Lane from the interface's job before retrieving source references.
2. Name any embedded lane and keep its boundary legible; do not create a fourth hybrid style.
3. Retrieve at most two narrow reference families after the lane is fixed.
4. Default narrative theater to level 1; raise it only for a named reason.
5. Use Gold Extractions as visual evidence and source documents as rule evidence.
6. If no reference family fits, research a candidate beneath an existing Visual Lane instead of improvising a fourth app style.

## Narrative Theater

New interfaces default to level 1. Level 3 is prohibited for routine product surfaces.

- **0/3:** None: pure visual and functional system; no fictional framing.
- **1/3:** Trace: labels, material cues, or a restrained metaphor support the task.
- **2/3:** Expressive: narrative framing is visible but remains subordinate to usability.
- **3/3:** Heroic: cinematic or mythic theater leads; reserve for covers, campaigns, and deliberate spectacle.

## Canonical Palette

| Token | Value | Role |
|---|---:|---|
| `archive-bone` | `#D8CFB8` | aged paper and dossier fields |
| `oxidized-paper` | `#B9AE95` | older scans, page edges, and secondary paper |
| `charcoal-ink` | `#171717` | primary ink, rules, and stamps |
| `faded-graphite` | `#4A4A44` | secondary text, diagrams, and quiet apparatus |
| `burnt-umber` | `#5A3524` | dust, handling, scorch, and warm material variation |
| `signal-amber` | `#F06A2A` | warm intervention, warning, and energy accent |
| `cold-saucer-light` | `#C8D8DD` | cold signal, analytical light, and near-appearance |
| `classified-red` | `#A1231E` | classification, correction, and institutional intervention |
| `black-budget-green` | `#1B2A24` | dark technical surfaces and military undertone |
| `dead-silver` | `#A7AAA4` | metal, scanners, and neutral technical matter |
| `void-black` | `#090909` | deep blacksite and cinematic negative space |
| `document-white` | `#EEE6D4` | cleaner archival panels and readable paper |

## Typography Roles

| Role | Use | Families |
|---|---|---|
| `ui-body` | navigation, controls, long product copy, and accessibility-critical text | PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui |
| `archival-metadata` | case numbers, timestamps, coordinates, captions, and procedural metadata | Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace |
| `official-display` | clean official headings and technical display text | PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans |
| `classification` | stamps, classifications, short warnings, and identifiers only | Anton, Impact-like condensed sans, stencil display |
| `field-annotation` | brief handwritten corrections, witness notes, and marginalia | Caveat, Just Another Hand, Kalam |
| `damaged-document` | short artifact text and atmospheric document moments, never the whole application | Special Elite, distressed typewriter face |

## Interface Tokens

- **Spacing base:** `4px`
- **Spacing scale:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`
- **Radii:** `none=0px`, `small=2px`, `card=4px`, `soft=8px`
- **Motion:** `fast=120ms`, `standard=220ms`, `slow=480ms`, `archival=900ms`
- **Classification:** `unclassified=#16A34A`, `confidential=#EAB308`, `secret=#EA580C`, `top-secret=#DC2626`

### Motion Rules

- Movement should feel like inspection, repositioning, focusing, scanning, or revealing—not decorative performance.
- One orchestrated transition beats hover motion scattered across every component.
- Ambient loops require a functional signal role and must disable under reduced motion.
- The archival duration is reserved for deliberate page, plate, or document transitions.

## Texture Budget

- **paper-grain:** 5-12%
- **scanlines:** 3-8%
- **halftone:** 5-15%
- **fold-seam:** 8-20%
- **handwriting:** 20-60%
- **background-glyph:** 3-10%
- **redaction:** 85-100%
- **rule:** Use only textures justified by the selected Visual Lane and retrieved reference family. Three simultaneous texture treatments is a warning; five is costume.

## Composition Disciplines

### Evidentiary Sublime

A composition discipline for indexing the immeasurable through patient repetition, calibrated material, and a monumental-to-microscopic scale jump.

- The page is an instrument, not a stage.
- The impossible is indexed rather than illustrated.
- Rhythm carries the anomaly; the anomaly is a break in cadence.
- Color is a finding, not decoration.
- Hierarchy belongs to the evidence, never the commentary.
- **Source:** `design/brand-bible/09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md`

## Source Reference Families

These are deeper retrieval labels, not eight competing app styles. Choose a Visual Lane first, then retrieve no more than two relevant families.

### Archive Document (`archive-document`)

A readable document that feels handled, indexed, and institutionally credible before it feels cinematic.

- **Use for:** case files, articles, source material, reports, document panels
- **Narrative theater:** 1/3
- **Material:** aged paper, hairline rules, fold or handling evidence, measured redaction
- **Composition:** official header block, central evidence window, side metadata rail, bottom microtext, sparse-dense contrast
- **Palette:** archive-bone, document-white, charcoal-ink, faded-graphite, classified-red
- **Type roles:** ui-body, archival-metadata, classification, field-annotation
- **Textures:** paper-grain, fold-seam, redaction
- **Avoid:** making every paragraph typewritten, redaction as decoration, fake classification on ordinary controls, uniform grunge
- **Gold references:** plate-047-brand-bible, visual-language-report, dossier-art-covers, nasa-dossier-1978
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/Design Canon/RESEARCH_UI_DESIGN_GUIDE.md

**Resolved palette**

- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `faded-graphite` #4A4A44 — secondary text, diagrams, and quiet apparatus
- `classified-red` #A1231E — classification, correction, and institutional intervention

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `classification` — stamps, classifications, short warnings, and identifiers only; Anton, Impact-like condensed sans, stencil display
- `field-annotation` — brief handwritten corrections, witness notes, and marginalia; Caveat, Just Another Hand, Kalam

### Field Evidence (`field-evidence`)

The captured object or photograph dominates while labels, coordinates, and handling marks establish chain-of-custody credibility.

- **Use for:** evidence cards, witness media, incident pages, locations, recovered materials
- **Narrative theater:** 1/3
- **Material:** photographic print, contact sheet, field notebook, tape or clip used sparingly
- **Composition:** one dominant image, small catalog marker, edge annotations, empty inspection space
- **Palette:** document-white, charcoal-ink, faded-graphite, classified-red, dead-silver
- **Type roles:** ui-body, archival-metadata, field-annotation
- **Textures:** halftone, paper-grain
- **Avoid:** scrapbook clutter, red string by default, decorative evidence labels, multiple equal hero images
- **Gold references:** case-file-dossier-covers, roswell-clauson-page, uss-roosevelt-sphere, dossier-art-covers
- **Rule sources:** design/brand-bible/03_POLAROIDS_COMPONENT_SPEC.md, design/brand-bible/00_MASTER_BRAND_BIBLE.md

**Resolved palette**

- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `faded-graphite` #4A4A44 — secondary text, diagrams, and quiet apparatus
- `classified-red` #A1231E — classification, correction, and institutional intervention
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `field-annotation` — brief handwritten corrections, witness notes, and marginalia; Caveat, Just Another Hand, Kalam

### Technical Blueprint (`technical-blueprint`)

Fine-line geometry, measured intervals, and diagrammatic hierarchy make the interface feel constructed rather than themed.

- **Use for:** schematics, process explanations, system diagrams, measurement interfaces, technical analysis
- **Narrative theater:** 0/3
- **Material:** graph field, vellum overlay, fine technical line, registration marks
- **Composition:** one dominant diagram, micro labels, coordinate rails, asymmetric measurement apparatus
- **Palette:** void-black, document-white, charcoal-ink, dead-silver, cold-saucer-light
- **Type roles:** official-display, archival-metadata, ui-body
- **Textures:** scanlines, background-glyph
- **Avoid:** generic HUD rings, random crosshairs, equal-weight annotations, engineering cosplay without data
- **Gold references:** hud-line-geometry, prometheus-line-studies, geometric-grid-hud, globe-hud-process-refs
- **Rule sources:** design/brand-bible/Design Canon/README.md, design/brand-bible/09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance

**Resolved typography**

- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui

### Blacksite (`blacksite`)

A quiet dark instrument with thin structure, low chroma, and precise signals—not a neon command-center fantasy.

- **Use for:** analysis tools, dashboards, maps, timelines, signal workspaces
- **Narrative theater:** 1/3
- **Material:** dark graphite, cold glass trace, fine grid, subtle scanner noise
- **Composition:** large working field, narrow apparatus rails, few elevated panels, controlled density gradient
- **Palette:** void-black, black-budget-green, dead-silver, cold-saucer-light, signal-amber
- **Type roles:** ui-body, official-display, archival-metadata
- **Textures:** scanlines, background-glyph
- **Avoid:** neon cyberpunk overload, glow on every object, dense equal-weight panels, green-terminal cliché
- **Gold references:** research-desk-ui, spy-lab-war-room-moodboard, near-black-geometry, roswell-demo-shells
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/Design Canon/RESEARCH_CANVAS_AESTHETIC.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `black-budget-green` #1B2A24 — dark technical surfaces and military undertone
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance
- `signal-amber` #F06A2A — warm intervention, warning, and energy accent

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace

### Myth-Tech (`myth-tech`)

Ancient or symbolic forms are treated as analyzable structures, with measurement and restraint preventing fantasy illustration.

- **Use for:** symbol analysis, comparative mythology, theory pages, consciousness research, anomalous diagrams
- **Narrative theater:** 2/3
- **Material:** faded diagram ink, mineral paper, constellation trace, archaeological notation
- **Composition:** one symbolic system, concentric or relational geometry, measured callouts, large contemplative margins
- **Palette:** archive-bone, charcoal-ink, burnt-umber, cold-saucer-light, signal-amber
- **Type roles:** official-display, archival-metadata, ui-body
- **Textures:** paper-grain, background-glyph
- **Avoid:** fantasy ornament, fake alien alphabet, sacred geometry wallpaper, claims presented as proof
- **Gold references:** prometheus-geometry-mix, resplendent-mind-plate, martian-pyramid-interior, bust-starfield-construction
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/05_PROMPT_TOKENS.md

**Resolved palette**

- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `burnt-umber` #5A3524 — dust, handling, scorch, and warm material variation
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance
- `signal-amber` #F06A2A — warm intervention, warning, and energy accent

**Resolved typography**

- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui

### Noir Research Canvas (`noir-research-canvas`)

A tactile working surface where documents and relationships feel manipulated by a researcher, with digital assistance kept ghostlike.

- **Use for:** spatial research, relationship graphs, evidence boards, hypothesis workspaces, investigation assembly
- **Narrative theater:** 2/3
- **Material:** desk or board substrate, paper evidence, pins or clips only where functional, low-opacity digital trace
- **Composition:** spatial field, layered evidence clusters, clear focal investigation, inspector separated from canvas
- **Palette:** void-black, archive-bone, charcoal-ink, classified-red, cold-saucer-light
- **Type roles:** ui-body, archival-metadata, field-annotation
- **Textures:** paper-grain, scanlines
- **Avoid:** conspiracy-board parody, red string without semantic meaning, every card rotated, AI overlays louder than evidence
- **Gold references:** research-desk-ui, spy-lab-war-room-moodboard, dossier-art-covers, interface-gallery-overview
- **Rule sources:** design/brand-bible/Design Canon/RESEARCH_CANVAS_AESTHETIC.md, design/design-lab/DesignLabUiBrief.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `classified-red` #A1231E — classification, correction, and institutional intervention
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace
- `field-annotation` — brief handwritten corrections, witness notes, and marginalia; Caveat, Just Another Hand, Kalam

### Dystopian Collage (`dystopian-collage`)

A cinematic image is constrained by document structure, technical margins, and a severe palette so spectacle still feels authored.

- **Use for:** hero art, case covers, campaigns, launch visuals, dramatic editorial openers
- **Narrative theater:** 3/3
- **Material:** photocopy decay, black border, weathered paper, photographic composite
- **Composition:** one dominant anomalous image, strong horizon or central event, technical edge apparatus, large controlled negative space
- **Palette:** void-black, archive-bone, charcoal-ink, signal-amber, classified-red, cold-saucer-light
- **Type roles:** official-display, classification, archival-metadata
- **Textures:** halftone, scanlines, paper-grain
- **Avoid:** routine product screens, space-opera polish, multiple competing anomalies, superhero composition, full-spectrum color
- **Gold references:** dystopian-2052-scene, dystopian-cosmic-dread, fire-disclosure-identity, lovecraft-dossier-split
- **Rule sources:** design/brand-bible/Design Canon/DESIGN_SYSTEM.md, design/brand-bible/05_PROMPT_TOKENS.md

**Resolved palette**

- `void-black` #090909 — deep blacksite and cinematic negative space
- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `signal-amber` #F06A2A — warm intervention, warning, and energy accent
- `classified-red` #A1231E — classification, correction, and institutional intervention
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance

**Resolved typography**

- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `classification` — stamps, classifications, short warnings, and identifiers only; Anton, Impact-like condensed sans, stencil display
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace

### Public Release (`public-release`)

The broader visual language is edited into a cleaner, faster-reading public form without collapsing into generic brand minimalism.

- **Use for:** marketing, press, social graphics, onboarding, app-store imagery, public explainers
- **Narrative theater:** 1/3
- **Material:** clean archival field, single evidence crop, restrained paper trace, precise editorial rules
- **Composition:** bold readable headline, one supporting visual, clear CTA or takeaway, small metadata accent
- **Palette:** document-white, charcoal-ink, archive-bone, classified-red, cold-saucer-light
- **Type roles:** ui-body, official-display, archival-metadata
- **Textures:** paper-grain
- **Avoid:** dense dossier simulation, tiny unreadable lore, sterile corporate minimalism, marketing gradients without source evidence
- **Gold references:** gateway-hero-explainer, ethereal-quote-landing, visual-language-report, plate-047-brand-bible
- **Rule sources:** design/brand-bible/00_MASTER_BRAND_BIBLE.md, design/brand-bible/05_PROMPT_TOKENS.md

**Resolved palette**

- `document-white` #EEE6D4 — cleaner archival panels and readable paper
- `charcoal-ink` #171717 — primary ink, rules, and stamps
- `archive-bone` #D8CFB8 — aged paper and dossier fields
- `classified-red` #A1231E — classification, correction, and institutional intervention
- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `official-display` — clean official headings and technical display text; PP Neue Montreal, Bank Gothic / DIN-inspired sans, Eurostile-inspired sans
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace

## Secondary Reference Overlays

### AI War Room Overlay (`ai-war-room`)

A low-opacity analytical ghost layered over a stronger owning surface.

- **Use for:** AI suggestions, machine inference, live analysis, signal overlays, computed relationships
- **Narrative theater:** 1/3
- **Palette:** cold-saucer-light, dead-silver, signal-amber
- **Type roles:** ui-body, archival-metadata
- **Avoid:** using it as the whole surface, neon hologram clutter, unlabeled AI certainty, opaque panels covering source evidence
- **Gold references:** globe-hud-process-refs, geometric-grid-hud, hud-line-geometry
- **Rule sources:** design/brand-bible/Design Canon/RESEARCH_CANVAS_AESTHETIC.md

**Resolved palette**

- `cold-saucer-light` #C8D8DD — cold signal, analytical light, and near-appearance
- `dead-silver` #A7AAA4 — metal, scanners, and neutral technical matter
- `signal-amber` #F06A2A — warm intervention, warning, and energy accent

**Resolved typography**

- `ui-body` — navigation, controls, long product copy, and accessibility-critical text; PP Neue Montreal, Noto Sans, Neue Haas Grotesk, system-ui
- `archival-metadata` — case numbers, timestamps, coordinates, captions, and procedural metadata; Martian Mono, JetBrains Mono, Courier New, OCR-A-style monospace

## Global Anti-Patterns

- generic SaaS dashboard composition
- sterile corporate UI with archival decoration pasted on top
- neon cyberpunk overload
- cartoon or souvenir-shop UFO language
- fake alien glyph typography
- every surface distressed equally
- texture competing with body text
- typewriter fonts used for all copy
- red string, stamps, tape, or redaction without semantic purpose
- cinematic lore used to hide weak interaction design
- invented colors or tokens when canonical values exist
- a design direction that cannot cite its visual evidence

## Agent Context Contract

Before design work, compile a surface-specific context pack:

```bash
python3 scripts/visual_language.py context --focus-surface <home-entry|research-canvas|archive-record|spacetime-observatory> [--reference <reference-family>]
```

Every direction must return a **Visual DNA Checksum** containing:

- `focus_surface`
- `surface_family`
- `embedded_surface_family`
- `reference_families`
- `interface_job`
- `narrative_level`
- `source_citations`
- `gold_visual_references`
- `palette_tokens`
- `typography_roles`
- `texture_budget`
- `composition_law`
- `signature_move`
- `prohibited_moves`

### Mark Test

- Could another agent trace the major visual decisions to named sources?
- Would the interface still work with texture and lore removed?
- Is the owning Visual Lane obvious, with embedded lanes kept intact rather than blended into a fourth style?
- Are typography, color, texture, and composition tied to roles rather than vibes?
- Does the result look like this visual lab made it, or merely like the prompt mentioned archives?

## Source Index

- `design/brand-bible/README.md`
- `design/brand-bible/00_MASTER_BRAND_BIBLE.md`
- `design/brand-bible/03_POLAROIDS_COMPONENT_SPEC.md`
- `design/brand-bible/04_DESIGN_REVIEW_NOTES.md`
- `design/brand-bible/05_PROMPT_TOKENS.md`
- `design/brand-bible/06_DESIGN_TOKENS.ts`
- `design/brand-bible/09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md`
- `design/brand-bible/Design Canon/README.md`
- `design/brand-bible/Design Canon/DESIGN_SYSTEM.md`
- `design/brand-bible/Design Canon/RESEARCH_CANVAS_AESTHETIC.md`
- `design/brand-bible/Design Canon/RESEARCH_UI_DESIGN_GUIDE.md`
- `design/design-lab/DesignLab.md`
- `design/design-lab/DesignLabUiBrief.md`
- `design/design-lab/UiDesignBrief.md`
- `extractions/visual-language-report/design.md`
