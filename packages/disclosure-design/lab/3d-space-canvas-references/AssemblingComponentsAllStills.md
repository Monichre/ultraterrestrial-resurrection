---
title: Assembling Components All Stills
description: Architecture for the 471-still Pillow + cluster vision catalog. Desk tokens unchanged.
type: note
created: 2026-08-13
author: agent
tags:
  - note
  - assembling-components
  - images
  - all-stills
---
# AssemblingComponentsAllStills

Pixel-sample **all 471 stills**. Vision-sample unread clusters. Catalog every file. Do not retokenize desk SoT.

## Modules

| Module | Role |
| --- | --- |
| [sample-stills.py](./notes/sample-stills.py) | Pillow walk: median, dominant, 3–5 swatches, chroma_peak, luma, dimensions |
| [generate-stills-catalog.py](./notes/generate-stills-catalog.py) | Cluster + vision flags + human tables |
| [stills-pixel-sample.json](./notes/stills-pixel-sample.json) | Machine per-file record (also `.csv` / `.jsonl`) |
| [stills-cluster-summary.json](./notes/stills-cluster-summary.json) | 72 clusters, file lists, vision_n |
| [stills-vision-sample.json](./notes/stills-vision-sample.json) | Paths opened this pass vs prior |
| [stills-full-catalog.md](./notes/stills-full-catalog.md) | Every still = one catalog row with Pillow hex |
| [midjourney-image-catalog](./notes/midjourney-image-catalog.md) | Hub: takes, embeds, competing systems |
| Root / `design/` `.ok/frontmatter.yml` | Collection counts + desk sampled_palette |

## Process

1. Walk vault for png/jpg/jpeg/webp. Skip `.git` / `.ok` / `.specstory` / `node_modules`. Assert 471.
2. Stream-open each still with Pillow. Do not copy binaries. Write JSON/CSV/JSONL incrementally.
3. Cluster by directory + Midjourney/Liam_Ellis stem (uuid stripped) → 72 clusters.
4. Mark prior 20 vision paths. Open unread clusters (stratified on large batches) — **92** this pass.
5. Catalog row for every file includes Pillow palette even if not vision-read.
6. If Pillow contradicts brass `#b49c60` / desk `#0f181c`, document; retokenize only for a second visual system (namespace). **Not done.**

## Data flow

```
still pixels → Pillow hex → stills-pixel-sample.json
                           → cluster summary
                           → stills-full-catalog.md (every file)
                           → hub (vision takes + embeds)
                           → assembling-components reads hub; queries JSON for hex
```

MP4s are out of scope. WebP vision thumbs went to `/tmp/still-vision-thumbs/` only.

## Contradiction log

| Observation | Action |
| --- | --- |
| ~148 stills dominant near `#0f181c` | Confirms desk ground |
| ~20 chroma_peak near `#b49c60` | Confirms chroma scarcity — keep brass as primary |
| Cosmic portals spectral cyan/magenta | Illustration — no token |
| Face/pyramid emerald+orange | Cinematic — no token |
| Mood collages cobalt/poetry/forest | Photo mood — no token |
| Height/luma `#000`/`#fff` | Texture — no token |
| Archive map `#E5A21A` / `#B21F1F` vs `#d89024` / `#aa5d4f` | Close; leave `--du-*` |
| Socorro `#e67329` | Case-file accent — namespace if needed, do not overwrite primary |
| Gateway teal→red ladder | Explainer semantics, not brand |

## Tokens / CSS

**Unchanged.** Live SoT remains desk `#0f181c` + brass `#b49c60` from the prior 19. This pass did not edit `tokens.css` or `globals.css`.

## Evidence

| Claim | Count |
| --- | --- |
| Pixel-sampled | **471 / 471** |
| Vision this pass | **92** |
| Vision prior | **20** |
| Unique vision frames | **112** |
| Catalog rows missing palette | **0** |
| Unprocessed | **0** |
| Unreadable / corrupt / missing | **0** |
| Clusters with ≥1 vision sample | **72 / 72** |
