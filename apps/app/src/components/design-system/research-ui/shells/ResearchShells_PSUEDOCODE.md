# ResearchShells Pseudocode

**Created:** 2026-08-07  
**Design Read:** dual research-instrument shells (Reading Room archival + Research Desk techno-analytical) for investigators, leaning into existing research-ui document materiality rather than a generic SaaS dashboard.

**Dials:** VARIANCE 6 · MOTION 3 · VISUAL_DENSITY 7

## Goal

Ship two composable shell systems with typed props, Storybook stories, and shared primitives. Full layouts assemble from leaf components; leaves remain usable alone.

## Folder

```
shells/
  shared/          # register-agnostic chrome primitives
  reading-room/    # archival-material register
  research-desk/   # techno-analytical register
  assets/          # mock reference PNGs
```

## Shared primitives

```
FOR EACH primitive IN [ResearchAppChrome, StatusIndicator, UserIdentity,
  TagPill, SectionHeading, ProgressMeter, IconRail, PanelTabs, MetaList, PostItNote]:
  DEFINE typed props (required content + optional className/on* callbacks)
  EXPORT named component + props type
  RENDER with cn() + CSS variables from local tokens
```

## Reading Room data flow

```
sample-data → ReadingRoomShell
  IconRail(items)
  ArchiveNavigator(collections, activeId, query, onSelect)
  main:
    DocumentViewerHeader(title, tags, actions)
    FieldReportCanvas(document)   // structured JSON → typewriter paper
    LinkedAttachments(items)
  ReadingRoomDetails(tabs, provenance, summary, topics, related)
```

### FieldReportCanvas algorithm

```
INPUT FieldReportDocument { seal, stamp, title, fields[], body, media[] }
RENDER paper plane with paper texture
PLACE seal top-left, stamp top-right
MAP fields → underlined key/value rows (Special Elite / mono)
MAP body paragraphs → typewriter columns
MAP media → clipped/taped plates on right rail
```

## Research Desk data flow

```
sample-data → ResearchDeskShell
  ResearchAppChrome(search, user, status)
  LibrarySidebar(categories → EntityRecordCard[])
  center:
    TheoryCanvasPanel(nodes, edges, tabs)
    InsightWidgets(timeline, map, clusters, suggestions)
  ResearchNotebook(tabs, note, tags, postIts, related)
```

### TheoryCanvas algorithm

```
INPUT nodes[{id,label,category,x,y,confidence?}] edges[{from,to,label}]
ABSOLUTE-POSITION nodes on dark canvas (no React Flow dependency)
DRAW SVG edges between node centers
APPLY category color tokens (amber/teal/purple/green)
OPTIONAL confidence bar on hypothesis node
```

## Storybook plan

```
Research UI/Shells/Shared/*
Research UI/Shells/Reading Room/*  (leaf + ReadingRoomShell fullscreen)
Research UI/Shells/Research Desk/* (leaf + ResearchDeskShell fullscreen)
```

Each leaf: Default + one compositional variant. Shells: Default, Interactive (controls), Dense.

## Constraints

- Named exports only
- No Inter; use research-ui font classes (neue-haas / special-elite / caveat)
- Texture paths: `/assets/textures/...`
- Cards only where they encode interactive hierarchy (attachment tiles, record rows)
- Motion: hover/focus/active under 200ms, transform+opacity only, reduced-motion safe
- No em dashes in UI copy
