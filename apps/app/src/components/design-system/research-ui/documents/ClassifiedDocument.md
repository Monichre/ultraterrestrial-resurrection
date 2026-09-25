# ClassifiedDocument

**Created:** 2026-07-18  
**Location:** `apps/app/src/components/design-system/research-ui/documents/`  
**Source:** Dropover `classified-document.tsx`

## Purpose

Vintage classified-paper composition for research UI: aged grainy cards, masking-tape polaroids, and archival captions. Two stacked documents (UCASEWEIL + Gordon Cooper / Mercury 9).

## Architecture

```
ClassifiedDocument
├── AgedPaperCard          noise texture + tilt + stains
│   ├── UCASEWEIL dossier
│   │   └── PolaroidFrame → PhotoCaption
│   └── Mercury 9 debrief
│       └── PolaroidFrame (blob image) → PhotoCaption
└── PhotoCaption           labelTop + handwritten captionNote
```

## Key modules

| File | Role |
|------|------|
| `ClassifiedDocument.tsx` | Full dossier composition |
| `PhotoCaption.tsx` | Reusable plate label + note |
| `ClassifiedDocument.stories.tsx` | Storybook catalog |
| `ClassifiedDocument_PSUEDOCODE.md` | Port plan |

## Storybook

`Documents/ClassifiedDocument` — `Default`, `CaptionOnly`

## Notes

- External Mercury 9 image uses `<img>` (blob host not in next/image remotePatterns).
- PhotoCaption fonts: mono label + Caveat-style note (falls back if Caveat unloaded).
- Distinct from TipTap `classified-document-viewer` (interactive annotation viewer).
