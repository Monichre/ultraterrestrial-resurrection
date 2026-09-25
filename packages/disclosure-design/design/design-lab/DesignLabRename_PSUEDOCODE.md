## Status

**Executed 2026-07-24.** Full inventory lives in [`DesignLab.md`](./DesignLab.md).

---

# Design Lab Rename — Pseudocode

**Date:** 2026-07-24  
**Scope:** `packages/design-lab/` asset dump (HTML prototypes + reference imagery)

## Goal

Replace opaque dumps (UUIDs, Twitter CDN hashes, Midjourney remix IDs, timestamp screenshots) with kebab-case, content-descriptive names. Group by role. Drop exact binary duplicates.

## Taxonomy (subdirectories)

```
prototypes/          # Interactive HTML concepts + gallery still
ui-mockups/          # Product UI screenshots & component specs
visual-language/     # Style guides / archive territory maps
dossier-art/         # Generated classified folder / document stills
textures/            # Paper, grid, fabric, shader backgrounds
mood-references/     # External poetic collage inspiration
gateway/             # Gateway process / hero visuals
process-refs/        # Meta process / observatory / tooling refs
```

## Algorithm

```
1. COMPUTE md5 for every image; DELETE exact duplicates (keep canonical name)
2. FOR each remaining file:
     CLASSIFY by visual content OR by recoverable label in old name
     MAP to kebab-case: {category}-{subject}-{variant?}.{ext}
3. mkdir taxonomy folders
4. git mv / mv into folders with new names (preserve content)
5. VERIFY: no orphan opaque names remain at package root (except docs)
6. WRITE DesignLab.md inventory
```

## Naming rules

- lowercase kebab-case
- no spaces, no parentheses, no apostrophes
- prefer subject over generator junk (`remix_01k…`, UUID, `Liam_Ellis_`)
- variants: `-a`, `-b`, `-c` or semantic (`-cover`, `-interior`, `-annotated`)
- keep already-good names when they fit (`gateway-hero.png`, `debut-light.png`)

## Duplicate deletions (keep first)

| Keep | Delete |
|------|--------|
| fabric-of-squares.png | fabric-of-squares (1).png |
| gateway-hero.png | gateway-process-visual-source-art.png |
| visual-language-report-v1.png (from 156d64d0…) | screenshot_1784839241612.png |
| research-desk-theory-canvas.png (from bf895e64…) | screenshot_1784839225880.png |
| research-notebook-panel.png (from 2682de1a…) | screenshot_1784839218934.png |
| hypothesis-lab-competing-explanations.png | screenshot_1784839226399.PNG |

## Rename map (old → new)

See `DesignLab.md` for the executed inventory after apply.
