# Impeccable Live — Research Canvas Empty State — 2026-07-19

**Status:** Closed without accept (all variants discarded)  
**Session:** Impeccable live · `/research-canvas`  
**Targets:**

- `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`
- `apps/app/src/features/mindmap/research-canvas/typer/CardStack.tsx`
**Canon:** Microfilm Dark (`DESIGN.md`) · product register (`PRODUCT.md`)

---

## Summary

Two live generation rounds on the empty Research Canvas. Overdrive variants for the empty-state shell and delight variants for the topic card stack (archival dossier brief). Nothing was accepted; source files were restored and the live server stopped. Directions remain useful as a shortlist for a later design-lab or Storybook pass.

---

## Round 1 — EmptyCanvas overdrive (discarded)

**Prompt mode:** overdrive · 3 variants  
**Element:** full empty canvas shell (hero + console)

| # | Direction | Idea |
|---|---|---|
| 1 | Evidence / Registration Field | Oversized Special Elite title, Martian Mono meta, clipped dossier tray for the console, warm dot grid |
| 2 | Breach Coordinate | Asymmetric datum + reticle ghosting; console as instrument on a measured intersection |
| 3 | Declassification Desk | Split index / inquiry; case-intake sheet with optional registration annotations |

**Shared constraints (kept):** idle / loading / error states; existing `ResearchCanvasConsole` + submit; solid borders for sourced UI; `prefers-reduced-motion`; no neon / glass / hero-metric theater.

---

## Round 2 — CardStack delight (discarded)

**Prompt mode:** delight · freeform: *“Archival, dark textured folder or dossier style”*  
**Element:** topic card stack (`CardStack` / `TYPER_ITEMS`)

| # | Direction | Idea |
|---|---|---|
| 1 | Evidence Folder Stack | Layered clipped folders, file tabs, raise-on-hover as pulling a record |
| 2 | Archival Contact Sheet | 2×2 accession sheet; file refs + clipped corners |
| 3 | Case Index Rail | Overlapping cabinet folders on a horizontal evidence rail |

**Shared constraints (kept):** each topic remains a button; existing `onCardClick(command, index)`; paper texture without glow; reduced-motion safe.

---

## Round 3 — EmptyCanvas overdrive (refreshed, discarded)

Re-ran overdrive on the empty shell after Round 2 discard. Same three families, tightened naming:

1. **Registration Field** — title scale + grid knobs  
2. **Breach Desk** — index width + annotation toggle  
3. **Microfilm Gate** — circular registration gate; focus tightens aperture  

Session exited without selection. Variants discarded; markers cleaned.

---

## Outcome

- **Accepted:** none  
- **Source restored:** `EmptyCanvas.tsx`, `CardStack.tsx`  
- **Live server:** stopped  
- **Session markers:** none remaining under `apps/app/src`

---

## Recommended next (if revisiting)

1. Port one empty-state direction into `apps/app/src/app/design-lab/` (or a Storybook story) instead of live injection — easier compare + HMR.  
2. Prefer **Registration Field** or **Breach Desk** for identity fit; Gate is the most “HUD” and easiest to overdo.  
3. For topics, **Evidence Folder Stack** matches the freeform brief best; Contact Sheet scans faster for four items.  
4. Keep console interaction contract unchanged — visual shell only until a dedicated empty-state ticket.

---

## Identity lock (do not drift)

- Warm-black void, paper text, Martian Mono OCR voice, one Special Elite wordmark moment  
- Clipped dossier corners, bracketed stamps, solid = sourced / dashed = inference  
- HUD at low opacity only; no scanlines, no glassmorphism-as-default, no purple SaaS gradients
