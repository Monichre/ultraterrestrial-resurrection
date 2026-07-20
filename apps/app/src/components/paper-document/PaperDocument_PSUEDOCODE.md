# PaperDocument Refine — Pseudocode

**Date:** 2026-07-19  
**Target:** Research Note story + shared PaperDocument shell

## Problems (from Storybook)

- Pure white flat card on void — reads as UI, not paper
- Stack layers too faint / same white
- No fiber tooth or warm stock
- Signature always renders (broken placeholder)
- Research notes lack field-meta (date, locus, classification)

## Steps

1. Add `paper-document.css` with desk + sheet + tooth using `/textures/paper/*`
2. Extend props: `variant`, `meta`, `showSignatureImage`, `className`, `embedded`
3. Warm cream stock; offset stack with slight rotation / darker under-sheets
4. Research header band: date · location · evidentiary label
5. Soft ink typography; divider as hairline rule
6. Optional signature image only when URL valid
7. Update Research Note story + docs
