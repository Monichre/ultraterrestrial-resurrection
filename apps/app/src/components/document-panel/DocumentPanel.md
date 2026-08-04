# DocumentPanel

**Updated:** 2026-07-25 18:00:00 CDT  
**Path:** `apps/app/src/components/document-panel/`  
**Route:** `/document-panel`

## Purpose

Printed-style design-system specification sheet for the Document Panel right-rail workspace. The attached mockup is the sole visual source of truth.

## Architecture

| Module | Role |
| --- | --- |
| `DocumentPanelSpec` | Page shell: sidebar + panel + API table |
| `SpecificationSidebar` | Anatomy / variants / behavior / a11y copy |
| `DocumentPanel` | Interactive panel state (tabs, resize, sections, save) |
| `PanelTabBar` | NOTES / INSPECTOR / PROVENANCE + close |
| `DocumentPanelHeader` | Research Notebook title + actions + save state |
| `DocumentToolbar` | Five tool groups + Templates |
| `DocumentEditorCanvas` | Serif doc, tags, highlight, clip, margin notes |
| `PanelSection` | Collapsible sections with callout badges |
| `LinkedRecordCard` / `QuickNoteCard` / `RelatedNoteRow` | Section bodies |
| `ComponentApiTable` | 10-row Prop API table |
| `styles/document-panel.css` | Tokens, grain, layout, responsive |

## Data flow

```
document-panel-data → DocumentPanel state
  → tabpanel Notes body
    → EditorCanvas (checklist edits → markEdited)
    → Linked / Quick / Related sections
  → saveState: idle → saving → saved → idle
```

## Exports

- `DocumentPanelSpec`
- `DocumentPanel`

## Review viewport

`1204 × 1770` — ivory full-bleed, no product chrome intended.

## Notes

- Route layout loads Spectral / Inter / Caveat / IBM Plex Mono and overrides the root dark shell.
- Section disclosure chevrons are intentional (collapsible behavior required by the brief).
- Tag copy matches the mock: `#hypothesis` `#nuclear` `#roswell` `#majestic12`.
