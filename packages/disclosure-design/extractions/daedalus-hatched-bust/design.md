---
title: Design — daedalus-hatched-bust
description: GOLD tier — vision-written 2026-08-13 (self). Engraved hatched bust frontispiece.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Daedalus Hatched Bust — Engraved Frontispiece
source: extractions/daedalus-hatched-bust/daedalus-hatched-bust.png
captured_at: 2026-08-13
colors:
  plate: "#c1c1c1"
  hatch-mid: "#a2a4a5"
  hatch-deep: "#3f3f3f"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Daedalus Hatched Bust (Engraved Frontispiece)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: figuration built from the line language.

## Source

- **Source type**: local image · **Path**: `extractions/daedalus-hatched-bust/daedalus-hatched-bust.png` (1856×2464)
- **Capture method**: direct vision
- **Detected limitations**: fine hatch detail at the edge of resolution; "DÆDALUS" caption legible, any smaller text not.

## TL;DR

A classical bearded bust rendered entirely in fine engraved cross-hatching, with geometric construction lines ghosted behind the head and a "DÆDALUS" caption at the base. The vault's line language applied to figuration — a face built from the same marks as the journals and geometry plates.

## 1. Visual identity

**Personality**: scholarly, patient, neoclassical, virtuosic.
**Mood**: quiet mastery.
**Detectable stylistic references**: copperplate engraving, neoclassical frontispieces, treatise portraits, construction-geometry underlay.
**Information density**: high in the figure (dense hatch), low around it (generous margins).
**Implicit positioning**: the maker-archetype plate — Daedalus as the vault's patron of constructed form.
**Confidence**: ✅ high.

### 1.2 Brand voice

Craft as lineage. The brand traces itself to the engraver's burin and the geometer's compass — a face is just another construction, built line by line.

### 1.3 The ONE brand thing

- **The thing**: figuration-from-hatching — a believable face conjured purely from engraved parallel/cross lines, geometry ghosted behind.
- **Why it carries the brand**: it proves the line language is generative, able to build a *likeness*, not just decorate — the strongest argument for the whole approach.
- **How everything else supports it**: the cool plate-grey palette and plate margins give it frontispiece formality.
- **Where it appears**: frontispieces, author/maker plates, about-the-method pages, covers for treatises. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `plate` | `#c1c1c1` | paper / plate ground | ✅ pixel |
| `hatch-mid` | `#a2a4a5` | hatch mid-tones | ✅ pixel |
| `hatch-deep` | `#3f3f3f` | deepest hatch + caption | ✅ pixel |

Typography: a small engraved serif (old-style caps with the Æ ligature) for the caption — a Caslon/Granjon-class face. ⚠️ medium (class inferred, caption small).

## 3. Components inventory

Signature: **engraved hatched portrait** + ghosted construction geometry. Generic: plate caption. None UI.

## 4. Layout & composition

Portrait; bust centered and frontal in the middle two-thirds, generous plate margins, construction geometry radiating faintly behind the head, caption centered at the base. Formal, symmetrical, frontispiece-still.

## 5. Reconstruction notes

As UI: asset-class. The transferable idea is the *underlay* — faint construction geometry behind a figure as a "method halo" (usable behind any portrait as a `--color-text-secondary` SVG layer). Tricky bits: engraving hatch is not worth simulating in CSS; keep it raster. The cool grey register distinguishes it from the warm journal pages — don't warm it.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | engraved bust unambiguous |
| Colors | ✅ | pixel-grounded cool grey set |
| Typography | ⚠️ | engraved serif class inferred |

## 6. Do's and Don'ts

**Do** — present with plate margins and the caption; keep the grey cool and printed; let the construction geometry stay faint.

**Don't** — don't crop tight on the face; don't warm the palette; don't add color; don't over-sharpen the hatch.

## 7. Open questions

- Is there a companion engraved bust (a second figure)? A pair would make strong facing frontispieces.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: engraved art plate, not a UI screen.
