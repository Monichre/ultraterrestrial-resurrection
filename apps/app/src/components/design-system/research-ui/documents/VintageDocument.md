# VintageDocument

Refined 2026-07-19 via impeccable polish against PRODUCT/DESIGN Microfilm Dark.

## Scene

Manila personnel sheet under a night desk lamp on a dark blotter. Paper is the subject.

## Changes

| Before | After |
|--------|--------|
| CSS-dot fake texture | `/textures/paper/*` tooth (twill, groove, grid) |
| Saturated pill stamps | Bracketed mono `[ TOP SECRET ]` |
| Masking tape + hover scale | Clipped dossier corner, static depth |
| Side-stripe witness blocks | Bordered `vd-witness` inserts |
| SaaS demo chrome | `vd-blotter` filing table |

## Modules

- `vintage-document.css` — blotter, card, stamps, diagrams
- `VintageDocumentCard` — shared shell
- `PersonnelFileCard` — Cooper-style dense dossier (optional polaroid via `showPhoto`)
- `IncidentReportCard` — Roswell report without left accents
- `VintageDocumentsDemo` — Storybook staging

## Storybook

`Documents/VintageDocumentsDemo` → Docs / Default
