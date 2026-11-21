# PaperDocument (Reference Prototype)

**Date:** 2026-07-23  
**Source:** `/Users/liamellis/Desktop/reference-prototype/components/paper-document`  
**Target:** `apps/app/src/components/design-system/research-ui/documents/reference-prototype/paper-document/`

## Purpose

Aged-paper poster / redacted-dossier suite driven by per-variant data records. Five variants recreate the donor mockups: `ashfield`, `undefeat`, `ultrerial`, `ulteresal`, `undectel`.

All “redacted” glyph noise is decorative only — never real copy.

## Architecture

```
PaperDocument
  ├── PaperTexture          (grain / vignette / halftone)
  ├── ImagePlate + Emblem   (duotone plate, seal/halo/crosshair)
  ├── SurveyFrame           (misregistered technical frames)
  ├── DocHeader / DocTitle / TextColumns / DocFooter
  ├── PageAccentMark        (scarce red triangle / yellow logo)
  └── Marginalia            (optional handwritten scrawl)
```

Data: `documents.data.ts` → `paperDocuments` / `paperDocumentList`  
Types: `../types/paper-document.ts`  
Noise util: `generate-redacted-text.ts`  
Motion: `paper-document-motion.css` (opt-in via `enableMotion`)

## Usage

```tsx
import {
  PaperDocument,
  paperDocuments,
} from '@/components/design-system/research-ui/documents/reference-prototype'

<PaperDocument variant={paperDocuments.ashfield} />
<PaperDocument variant={paperDocuments.ultrerial} enableMotion />
```

## Collision note

The simpler letter/memo `PaperDocument` at `apps/app/src/components/paper-document/` is a **different** component and was left untouched. Prefer the namespaced import above for archival posters.

## Fonts

PP Neue Montreal lives in `apps/app/public/fonts/` and is exposed as `FONT_PP_NEUE_MONTREAL` / `--font-pp-neue-montreal` / `.font-pp-neue-montreal`.

## Storybook

`Design Sources/Reference Prototype/Paper Document`
