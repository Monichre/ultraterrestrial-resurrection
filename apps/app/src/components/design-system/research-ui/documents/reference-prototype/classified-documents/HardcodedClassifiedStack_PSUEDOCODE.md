# HardcodedClassifiedStack — Pseudocode

## Goal

Migrate donor `/Users/liamellis/Downloads/classified-document.tsx` into reference-prototype as a **hardcoded visual stack**, without touching the data-driven `ClassifiedDocument.tsx`.

## Steps

1. Confirm `PhotoCaption` at `../PhotoCaption.tsx`
2. Confirm `@/components/ui/card` is the research-ui card path (keep)
3. Create `HardcodedClassifiedStack.tsx`:
   - Import `Card` from `@/components/ui/card`
   - Import `PhotoCaption` from `../PhotoCaption`
   - Named export `HardcodedClassifiedStack` (+ default re-export)
   - Preserve donor markup: UCASEWEIL card + Gordon Cooper card
4. Export from `classified-documents/index.ts`
5. Re-export from parent `reference-prototype/index.ts`
6. Add Storybook story in `reference-document-library.stories.tsx`
7. Write `HardcodedClassifiedStack.md` provenance note
