# Reference Prototype Migration

**Date:** 2026-07-23 (updated evening — paper-document + fonts)  
**Scope:** Component-only migration from Desktop `reference-prototype` / `docs/design/reference-prototype` into `apps/app`.

## Verdict

Document/presentation components from the Figma Make donor now live in the Next app under a namespaced folder. Existing production `research-ui/documents/ClassifiedDocument.tsx` and `PhotoCaption.tsx` were **not** overwritten. The simpler letter/memo `apps/app/src/components/paper-document` was also left intact — the aged-paper suite lives under this package as `paper-document/`.

## Target

`apps/app/src/components/design-system/research-ui/documents/reference-prototype/`

## Modules migrated

| Module | Path |
| --- | --- |
| Types | `types/documents.ts`, `types/paper-document.ts` |
| PhotoCaption | `PhotoCaption.tsx` |
| DocumentFrame / One / A / B | root of package |
| ClassifiedDocument, UFODocument, UFODispatchDocument, WeatheredClassifiedDocument | `classified-documents/` |
| DocumentShowcase, MixedDocumentLayout, ResponsiveDocumentGrid | `layouts/` |
| VintagePosterA–D | `vintage-posters/` |
| PaperDocument suite (aged posters) | `paper-document/` |
| PP Neue Montreal | `apps/app/public/fonts/` + `FONT_PP_NEUE_MONTREAL` |
| Barrel | `index.ts` |

## Explicitly not migrated

- `theme-provider.tsx`
- Full shadcn `components/ui/*` kit (except PhotoCaption)
- Prototype `app/`, hooks, globals, donor shell
- Overwrite of existing `@/components/paper-document` (letter/research/memo)

## Architecture & data flow

```
Desktop/docs reference-prototype  (donor)
        │  one-time copy + import rewrite
        ▼
research-ui/documents/reference-prototype/
        │  @/app/fonts, @/lib/utils, @/components/ui/card
        ▼
Storybook: Design Sources/Reference Prototype/*
```

Import rewrites applied during migration:

- `@/types/documents` → relative `types/documents`
- `@/types/paper-document` → relative `../types/paper-document`
- `@/lib/redacted-text` → `./generate-redacted-text`
- `@/components/ui/PhotoCaption` / Document* / vintage-posters → package-relative
- `@/lib/fonts` → `@/app/fonts`
- `@/lib/utils`, `@/components/ui/card` unchanged

## Behavioral adaptation

- `WeatheredClassifiedDocument` default `showNavigation` set to `false` (prototype routes `/` and `/weathered` are not app routes).
- `PageAccentMark` red triangle uses `clipPath` (same visual as donor CSS-border triangle).

## Consumers

- Storybook: `reference-document-library.stories.tsx` + `paper-document/paper-document.stories.tsx`
- Import barrel:

```tsx
import {
  DocumentA,
  UFODispatchDocument,
  VintagePosterB,
  PaperDocument,
  paperDocuments,
} from '@/components/design-system/research-ui/documents/reference-prototype'
```

## Next steps (optional)

1. Promote selected components into the main `research-ui/documents` surface after visual QA.
2. Drop real scorched-terrain `imageSrc` values into `documents.data.ts` plates.
3. Wire research-canvas / mindmap nodes to the migrated components where archival UI is needed.
