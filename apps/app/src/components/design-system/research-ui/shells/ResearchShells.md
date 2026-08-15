# ResearchShells

**Created:** 2026-08-07  
**Location:** `apps/app/src/components/design-system/research-ui/shells/`  
**Registers:** archival-material (Reading Room) + techno-analytical (Research Desk)

## Purpose

Composable research instrument shells matching the Declassified Reading Room and Research Desk mockups. Leaf components are independently storyable; shells assemble them through typed props.

## Design Read

Reading Room / Research Desk for investigators, archival + clinical language, built on research-ui document materiality (Special Elite paper, Caveat marginalia, OKLCH tokens) rather than a generic dashboard kit.

**Dials:** VARIANCE 6 · MOTION 3 · VISUAL_DENSITY 7

## Architecture

```
shells/
├── shared/                 # register-agnostic chrome
│   ├── ResearchAppChrome
│   ├── IconRail, PanelTabs, MetaList
│   ├── TagPill, StatusIndicator, UserIdentity
│   ├── ProgressMeter, SectionHeading, PostItNote
│   └── tokens.ts           # PAPER_TEXTURES + register palettes
├── reading-room/           # archival-material register
│   ├── ArchiveNavigator
│   ├── DocumentViewerHeader
│   ├── FieldReportCanvas   # JSON → typewriter paper
│   ├── LinkedAttachments
│   ├── ReadingRoomDetails
│   └── ReadingRoomShell
└── research-desk/          # techno-analytical register
    ├── LibrarySidebar + EntityRecordCard
    ├── TheoryCanvasPanel + CanvasEntityNode
    ├── InsightWidgets
    ├── ResearchNotebook
    └── ResearchDeskShell
```

## Data flow

```
sample-data → Shell props → leaf components
FieldReportDocument → FieldReportCanvas (seal, stamp, fields, body, media)
CanvasNodeData[] + CanvasEdgeData[] → TheoryCanvasPanel (SVG edges + absolute nodes)
```

## Key props contracts

| Component | Required props |
|-----------|----------------|
| `ArchiveNavigator` | `query`, `onQueryChange`, `mode`, `onModeChange`, `nodes`, `onSelect` |
| `FieldReportCanvas` | `document: FieldReportDocument` |
| `ReadingRoomShell` | `navigator`, `documentHeader`, `document`, `attachments`, `details` |
| `TheoryCanvasPanel` | `tabs`, `activeTabId`, `onTabChange`, `nodes`, `edges` |
| `EntityRecordCard` | `record: EntityRecord` |
| `ResearchDeskShell` | `library`, `canvas`, `insights`, `notebook` |
| `PostItNote` | `content`, optional `color` / `rotation` / `author` |

All components accept optional `className`. Interactive leaves expose `onSelect` / `on*Change` callbacks rather than owning global store state.

## Storybook

| Title | Stories |
|-------|---------|
| `Research UI/Shells/Shared/Primitives` | TagPillRow, StatusAndUser, ProgressAndMeta, PostItBoard, TabsAndRail, ChromeLeather, ChromeDesk |
| `Research UI/Shells/Reading Room/ReadingRoomShell` | Default (interactive), FieldReportOnly, NavigatorOnly, ViewerChrome, DetailsPanel |
| `Research UI/Shells/Research Desk/ResearchDeskShell` | Default (interactive), TheoryCanvasOnly, LibraryOnly, EntityCards, InsightStrip, NotebookOnly, SingleCanvasNode |

## Assets

- Mock references: `shells/assets/*-mock.png`
- Sample media (public): `/assets/research-shells/{demo-roswell,press,dc}.png`
- Paper textures: `/assets/textures/paper/*`

## Notes

- Theory canvas is a positioned SVG/HTML composition for Storybook isolation (no React Flow dependency). Wire to mindmap canvas later if product needs live graph physics.
- Shells are design-system presentational; they do not fetch Neon data.
- Prefer composing leaves in product routes over copying shell markup.
