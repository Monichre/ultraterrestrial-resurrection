---
title: Design — bust-geometry-reverse
description: GOLD tier — vision-written 2026-08-13 (self). Bust with wireframe-geometry head.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Bust Geometry Reverse
source: extractions/bust-geometry-reverse/bust-geometry-reverse.png
captured_at: 2026-08-13
colors:
  umber-deep: "#272624"
  charcoal: "#3f3f3b"
  stone: "#5b5d5b"
  bone: "#9f9f94"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Bust Geometry Reverse

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mood / art direction.

## Source

- **Source type**: local image · **Path**: `extractions/bust-geometry-reverse/bust-geometry-reverse.png` (928×1232)
- **Capture method**: direct vision
- **Detected limitations**: the polyhedral head's exact facet count and any fine internal edges are below reliable resolution — described as a class (wireframe cage), not a specific polyhedron.

## TL;DR

A museum bust with its head replaced by a wireframe polyhedral cage — the monument's interior logic exposed. The conceptual hinge of the vault's bust cluster.

## 1. Visual identity

**Personality**: cerebral, uncanny, analytic, sculptural, inverted.
**Mood**: productive unease — the familiar made structural.
**Detectable stylistic references**: surrealist substitution (Magritte-adjacent), wireframe drafting, classical bust photography.
**Information density**: balanced — one figure, one substitution, no noise.
**Implicit positioning**: identity-grade plate; the cluster's thesis image.
**Confidence**: ✅ high.

### 1.2 Brand voice

The brand believes the mind is architecture: not a face but a structure under continuous construction. Replacing the head with its blueprint is not violence but honesty — the design trusts the viewer to find the substitution beautiful rather than grotesque, which is exactly the audience filter the vault wants.

### 1.3 The ONE brand thing

- **The thing**: the substitution — geometry precisely where the head should be.
- **Why it carries the brand**: positional accuracy is what makes it uncanny rather than abstract; a wireframe *near* a bust would be illustration, a wireframe *as* the head is a thesis.
- **How everything else supports it**: museum convention everywhere else — pose, lighting, centered composition — so the single violation carries all the meaning.
- **Where it appears**: covers, identity moments, cluster-defining decks. ⚠️ medium (usage inferred).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `umber-deep` | `#272624` | field / deepest mass | ✅ pixel |
| `charcoal` | `#3f3f3b` | shadow modeling | ✅ pixel |
| `stone` | `#5b5d5b` | mid planes | ✅ pixel |
| `bone` | `#9f9f94` | lit stone + wireframe lines | ✅ pixel |

Typography: none observed.

## 3. Components inventory

Signature: **substituted bust** (classical figure + geometric head). Generic: none — art plate, not UI.

## 4. Layout & composition

Portrait field; bust centered, frontal, museum-conventional; the geometric head occupies the exact cranial volume — shock by position, not by arrangement.

## 5. Reconstruction notes

As UI: asset-class. The wireframe head is code-able (SVG/canvas polyhedron) and a hybrid treatment — photographic base + live wireframe — is a genuine candidate for an interactive identity moment; not built here (art plate, not a screen). Quick wins: four-step warm-grey scale. Tricky bits: the seam where wireframe meets neck is the whole illusion — lighting continuity between raster stone and vector cage needs hand-tuning.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | substitution read is unambiguous |
| Colors | ✅ | pixel-grounded warm-grey scale |
| Typography | — | no type present |

## 6. Do's and Don'ts

**Do** — keep the substitution positionally exact; light the wireframe to match the stone; preserve museum convention in everything except the head.

**Don't** — don't add a second surreal move (one violation per plate); don't color the wireframe; don't rotate the bust off frontal — the convention is the setup.

## 7. Open questions

- Which polyhedron is the head? Facet count unresolved at this size — worth identifying if the cluster ever names the construction in copy.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md`
- [ ] `component.tsx` — skipped: art plate, not a UI screen (hybrid wireframe treatment noted in Reconstruction).
