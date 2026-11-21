# Reference Prototype Migration — Pseudocode

**Goal:** Migrate only document/presentation components from `docs/design/reference-prototype` into `apps/app`, without the donor Next shell, shadcn `ui/*` kit (except `PhotoCaption`), or `theme-provider`.

## Target layout

```
apps/app/src/components/design-system/research-ui/documents/reference-prototype/
  types/documents.ts
  PhotoCaption.tsx
  DocumentFrame.tsx
  DocumentOne.tsx
  DocumentA.tsx
  DocumentB.tsx
  classified-documents/{ClassifiedDocument,UFODocument,UFODispatchDocument,WeatheredClassifiedDocument,index}.tsx|ts
  layouts/{DocumentShowcase,MixedDocumentLayout,ResponsiveDocumentGrid}.tsx
  vintage-posters/{VintagePosterA-D,index}.tsx|ts
  index.ts                          # barrel
  ReferencePrototypeMigration.md    # post-migration docs
```

## Steps

1. CREATE target directory tree (do not touch existing `documents/ClassifiedDocument.tsx` / `PhotoCaption.tsx`).
2. COPY `types/documents.ts` from donor.
3. COPY component sources listed above (exclude `theme-provider`, exclude `components/ui/*` except PhotoCaption).
4. REWRITE imports in each migrated file:
   - `@/types/documents` | `@/types/document` → relative `./types/documents` or `../types/documents`
   - `@/components/ui/PhotoCaption` → relative `../PhotoCaption` or `./PhotoCaption`
   - `@/components/Document{A,B,One,Frame}` → relative sibling imports
   - `@/components/vintage-posters` → `../vintage-posters` or `./vintage-posters`
   - `@/lib/fonts` → `@/app/fonts` (app already exports FONT_ANTON / SPECIAL_ELITE / CAVEAT)
   - `@/lib/utils` → `@/lib/utils` (unchanged)
   - `@/components/ui/card` → `@/components/ui/card` (unchanged)
5. ADD `index.ts` barrel exporting all public components + types.
6. RETARGET Storybook `reference-document-library.stories.tsx` from `@reference/...` to the migrated barrel/paths; keep CSS quarantine wrapper for visual parity.
7. LEAVE donor at `docs/design/reference-prototype` intact (provenance).
8. VERIFY: no broken relative imports; existing research-ui ClassifiedDocument untouched.

## Non-goals

- Do not migrate shadcn primitives, hooks, app/page, globals.css, or theme-provider.
- Do not overwrite production `research-ui/documents/ClassifiedDocument.tsx`.
- Do not delete `@reference` Storybook alias yet (optional follow-up).
