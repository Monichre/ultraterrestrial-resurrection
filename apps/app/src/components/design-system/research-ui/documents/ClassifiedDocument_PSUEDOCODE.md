# ClassifiedDocument — Pseudocode

## Goal

Port Dropover `classified-document.tsx` into research-ui documents as a reusable aged-paper composition with taped polaroids and PhotoCaption footers.

## Structure

```
ClassifiedDocument
├── PaperCard (shared aged paper shell)
│   ├── UCASEWEIL document
│   │   ├── header + typed gibberish columns
│   │   └── PolaroidFrame × 2 (tape + PhotoCaption)
│   └── Gordon Cooper / Mercury 9 document
│       ├── mission header
│       ├── PolaroidFrame (external archival image)
│       └── CLASSIFIED stamp
└── PhotoCaption (labelTop + captionNote)
```

## Steps

1. Add `PhotoCaption` with polaroid-footer + optional overlay styles
2. Port document markup → named export `ClassifiedDocument`
3. Storybook `Documents/ClassifiedDocument`
4. Export from `documents/index.ts`
5. Document architecture in `ClassifiedDocument.md`
