# QA CHECKLIST — Document Panel Specification Sheet

## Composition
- [x] Canvas aspect ≈ 0.815 at 1204px width (no browser frame)
- [x] Left specification column 376px; gutter 56px; panel 684px
- [x] Vertical divider 1px hairline, faded ends, 15px into gutter
- [x] Six gold callout badges bound to panel sections
- [x] API table spans full canvas width below both regions

## Typography
- [x] Serif `Document Panel` at 34px/38px
- [x] Italic serif subtitle at 14px
- [x] Uppercase 9px letterspaced section labels
- [x] Handwritten annotations use Caveat at 15.5–16px
- [x] API cells use monospace at 9.5px

## Document Panel
- [x] Tab strip 50px; active NOTES raised
- [x] Header 46px; toolbar 38px with five groups + Templates
- [x] Editor canvas inset; text column ≤372px; annotation margin
- [x] Highlight, underline, square bullets, checkboxes, gold clip
- [x] Linked records 2×2 charcoal cards; stickies gold/green/blue
- [x] Related notes 3 rows + New Note

## Engineering
- [x] Decomposed components + typed data module
- [x] Tokens from CSS custom properties
- [x] Tabs, sections, cards, rows, resize keyboard operable
- [x] Route `/document-panel` with light ivory shell override
