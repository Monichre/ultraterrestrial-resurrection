# VISUAL BUILD CONTRACT — Document Panel Specification Sheet

## 1. Source type
mockup (single raster reference image).

## 2. Source-of-truth declaration
The attached image is the sole source of visual truth. No external brand kit,
screenshot, or product knowledge was used beyond the brief.

## 3. Visible facts
- Warm ivory full-bleed canvas, paper grain, no browser chrome, no window frame.
- Two-region upper composition + one full-width lower API table region.
- Left: printed specification sheet (eyebrow, serif title, italic subtitle, intro,
  rule, ANATOMY ×6, VARIANTS ×3 with thumbnails, BEHAVIOR ×4, ACCESSIBILITY ×4).
- Gutter: faint 1px vertical divider + six gold numbered badges aligned to the panel.
- Right: rounded floating document panel — tab strip (NOTES active, INSPECTOR,
  PROVENANCE, ✕), header (`Research Notebook ⌄`, `+`, `⋮`), 5-group icon toolbar +
  `Templates` button, inset paper editor canvas, `Linked Records` (2×2 dark cards),
  `Quick Notes` (gold/green/blue stickies), `Related Notes` (3 rows + `＋ New Note`).
- Editor canvas: serif title, 4 tag pills + `+`, three numbered sections, yellow
  highlight run, underlined phrase, square bullets, empty checkboxes, gold vertical
  clip at the left edge, ✦ mark, free handwritten note, boxed handwritten note.
- Bottom table: Prop / Type / Required / Default / Description, 10 rows, ruled grid.

## 4. Assumptions
- Design width ≈ 1204px (reference × 2.0).
- Fonts: Spectral (editorial), Inter (interface), Caveat (handwritten),
  IBM Plex Mono (technical).
- Tag labels `#hypothesis / #nuclear / #roswell / #majestic12`.
- Toolbar glyph identities inferred from silhouettes.
- Section disclosure chevrons added to satisfy collapsible behavior.

## 5. Canvas / panel measurements
| Token | Value |
| --- | --- |
| Canvas max width | 1204px |
| Spec column / gutter / panel | 376px / 56px / 684px |
| Panel radius / pad-x | 14px / 28px |
| Tab strip / header / toolbar | 50px / 46px / 38px |
| Editor text column | max-width 372px |
| Callout badge | 18×18, left −42px |

## 6. Color tokens
`--canvas #f1ebde` · `--paper #fbf7ee` · `--paper-panel #f3ede0` · `--paper-tab #e8e0ce`
`--ink #2c2721` · `--gold #ac8547` · `--highlight #f4dc93` · `--record-surface #2f2a24`

## 7. Implementation path
- Components: `apps/app/src/components/document-panel/`
- Styles: `apps/app/src/styles/document-panel.css`
- Route: `/document-panel`
