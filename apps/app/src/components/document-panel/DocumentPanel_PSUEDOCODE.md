# DocumentPanel — Pseudocode

**Updated:** 2026-07-25  
**Route:** `/document-panel`  
**Visual source:** attached mockup (sole truth)

## Goal

Ship a printed-style specification sheet for the Document Panel right-rail workspace inside `apps/app`, matching the mockup at ~1204×1770.

## Layout

```
page (/document-panel)
  layout → load Spectral / Inter / Caveat / IBM Plex Mono CSS vars
         → import document-panel.css
         → override root dark shell with ivory full-bleed
  DocumentPanelSpec
    grid: SpecificationSidebar | divider+callouts | DocumentPanel
    ComponentApiTable (full width)
```

## DocumentPanel state machine

```
open: boolean
activeTabId: notes | inspector | provenance
width: 560..780 (default 684), pointer + keyboard resize
sectionsOpen: { linked, quick, related }
activeTools: Set<ToolId>
saveState: idle → saving → saved → idle
selectedRecordId / selectedRelatedId
records / notes / related: seeded arrays, mutable via Add link / New Note
```

## Interaction map

1. Tablist: click / ←→ / Home / End, roving tabindex
2. Close → dashed restore placeholder
3. Toolbar toggles → aria-pressed + markEdited
4. Section chevrons → grid-template-rows collapse
5. Record / related select → pressed + gold border
6. Checklist → strike-through + markEdited
7. Resize handle: drag left edge; ArrowLeft grows panel

## Component decomposition

- CalloutBadge — absolute gold number, section-relative
- SpecificationSidebar — anatomy / variants / behavior / a11y
- PanelTabBar / DocumentPanelHeader / DocumentToolbar
- DocumentEditorCanvas — tags, body, clip, handwritten margin notes
- PanelSection → LinkedRecordCard | QuickNoteCard | RelatedNoteRow
- ComponentApiTable — 10-row prop table

## Fidelity constraints

- Spec column 376 / gutter 56 / panel 684
- Editor text column max 372px; annotations in right margin
- Tags from mock: #hypothesis #nuclear #roswell #majestic12
- No invented modal chrome for Templates / menus — save indicator only
