# Paper Document Migration — Pseudocode

**Goal:** Migrate the Desktop reference-prototype aged-paper poster suite (`paper-document/`), `types/paper-document.ts`, redacted-text util, and PP Neue Montreal fonts into `apps/app`, without overwriting the existing simpler `apps/app/src/components/paper-document`.

## Target layout

```
apps/app/src/components/design-system/research-ui/documents/reference-prototype/
  types/paper-document.ts
  paper-document/
    PaperDocument.tsx
    PaperTexture.tsx / SurveyFrame.tsx / ImagePlate.tsx / Emblem.tsx
    DocHeader.tsx / DocTitle.tsx / DocFooter.tsx / TextColumns.tsx
    PageAccentMark.tsx / Marginalia.tsx / RedactedText.tsx
    documents.data.ts
    generate-redacted-text.ts   # was @/lib/redacted-text
    paper-document-motion.css   # pd-smoke / pd-ember
    index.ts
  index.ts                     # re-export paper-document + types
apps/app/public/fonts/
  PPNeueMontreal-Regular.ttf
  PPNeueMontreal-Medium.ttf
apps/app/src/app/fonts.tsx     # add FONT_PP_NEUE_MONTREAL via next/font/local
apps/app/src/app/layout.tsx    # attach CSS variable on <body>
```

## Steps

1. CONFIRM layouts / vintage-posters / classified-documents / types/documents already live under reference-prototype (prior migration). Do not overwrite production research-ui ClassifiedDocument.
2. COPY types/paper-document.ts → reference-prototype/types/
3. COPY paper-document/* from Desktop donor; COPY lib/redacted-text.ts → paper-document/generate-redacted-text.ts
4. REWRITE imports:
   - `@/types/paper-document` → `../types/paper-document`
   - `@/lib/redacted-text` → `./generate-redacted-text`
5. ADD paper-document-motion.css for optional smoke/ember keyframes; import from PaperDocument.
6. COPY PPNeueMontreal fonts → apps/app/public/fonts/
7. ADD FONT_PP_NEUE_MONTREAL to fonts.tsx (localFont paths relative to fonts.tsx); wire variable on body in layout.tsx; point `.font-pp-neue-montreal` at `--font-pp-neue-montreal`.
8. UPDATE reference-prototype barrel to export PaperDocument suite + paperDocument types/data.
9. DOCUMENT in PaperDocument.md + update ReferencePrototypeMigration.md.
10. LEAVE existing `@/components/paper-document` (letter/research/memo) untouched — different component.

## Non-goals

- Do not replace the simpler PaperDocument at components/paper-document/
- Do not migrate donor theme-provider / full shadcn ui kit / app shell
- Do not delete Desktop donor at /Users/liamellis/Desktop/reference-prototype
