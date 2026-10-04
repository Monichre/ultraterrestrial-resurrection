# FolderizeStills — Pseudocode

Date: 2026-08-13 · Scope: 471 stills → one folder per still, gold set = 72 cluster reps.

## Layout decision

`extractions/<slug>/` at vault root. One canonical location: the image MOVES
(`mv`, no copies — disk at 99%) into its folder as `<slug>.<ext>`. Catalogs get
repointed at folders. `notes/image-inventory-paths.txt` is deleted, not regenerated
(manifest JSON replaces it).

## Per-folder file set

```
extractions/<slug>/
  <slug>.<ext>        # the still (moved)
  source.md           # prompts/aesthetics.md format: thinkingprocess headings + dense shorthand paragraph
  design.md           # prompts/output-template.md contract, depth adapted to a still
  design-tokens.md    # assembling-components names, hex from notes/stills-pass-b/palettes.json
  image-to-prompt.md  # prompts/element-copy.md generative-prompt contract
  component.tsx       # ONLY if the still implies UI (code/hybrid per element-copy heuristic)
```

## Constants

- `PALETTES = notes/stills-pass-b/palettes.json` (471 records, swatches w/ share+sat+luma)
- `CLUSTERS = notes/stills-cluster-summary.json` (72 clusters, file lists)
- `VISION = notes/stills-vision-sample.json` (112 frames actually opened, honesty labels)
- `OUT = extractions/` · `MANIFEST = notes/folderize-manifest.json`
- `GOLD_MAP` = 72 entries: cluster → `{ base, rep_path, gold_slug, kind, component|null, take }`
  (kind ∈ ui | doc | art | texture | photo; drives component.tsx + design.md depth)

## Pipeline (notes/folderize-stills.py, functional)

```
1. load palettes + clusters + vision sample
2. assert all 471 paths exist on disk; assert slug uniqueness
3. write MANIFEST (planned): old_path → { folder, new_path, tier: gold|batch, vision: self|inherited }
4. for each still (sorted):
     slug      = gold_slug if rep else f"{base}-{index:02d}"
     mkdir extractions/<slug>
     write design-tokens.md   ← per-file Pillow hex, role assignment (below)
     write source.md          ← gold: stub marked pending-vision; batch: cluster-inherited
     write design.md          ← gold: stub; batch: cluster-inherited (links gold folder)
     write image-to-prompt.md ← gold: stub; batch: cluster-inherited
     mv old_path → extractions/<slug>/<slug>.<ext>
     update manifest entry → done
5. repoint: manifest-driven string replace in
     notes/stills-full-catalog.md, notes/midjourney-image-catalog.md, .ok/frontmatter.yml
   delete notes/image-inventory-paths.txt
6. verify: every manifest new_path exists; zero old paths remain in catalogs
```

## Token role assignment (deterministic, no resampling)

```
polarity = dark if mean_luma < 110 else light
bg-primary     = darkest (dark) | lightest (light) of dominant/median/swatches
bg-secondary   = nearest-luma neighbor of bg-primary
text-primary   = max-contrast swatch vs bg-primary
text-secondary = swatch ~60% between bg and text luma
border-primary = lowest-sat swatch near bg luma (fallback: derive)
--color-primary(accent) = highest-sat swatch IF sat ≥ 0.25 AND share ≤ 0.30, else omit + note
success/warning/error   = only if hue clearly observed, else omit (no invention)
chart-color-N  = remaining saturated swatches in share order
spacing/radius/shadow/motion/z = assembling canon (4px base, --duration-fast 150ms …)
  labeled "canon default — not observable in a still"
7 categories per file: colors, spacing, typography, borders, shadows, motion, z-index
AnyDesign rename map applied at this boundary (semantic --color-* only)
```

## Gold pass (after scaffold)

```
for each of 72 reps, in batches of ~6:
  read image (webp → /tmp jpeg first, per constraint)
  write source.md   (aesthetics.md voice: shorthand paragraph + 8 thinkingprocess headings)
  write design.md   (output-template sections 1–7, still-scoped, honest gaps)
  write image-to-prompt.md (SUBJECT/STYLE/COMPOSITION/LIGHTING/PALETTE/MOOD/BACKGROUND/AVOID + NL version)
  write component.tsx ONLY if ui/doc-with-layout (PascalCase, named export, token vars)
  if vision contradicts slug → rename folder + manifest entry
```

## Stop condition

If hard limit hit: gold complete so far + manifest stands; batch folders already have
honest cluster-inherited content (no half-empty folders). Never fabricate per-image
vision for unread files — provenance field says `self` vs `cluster-inherited`.
