---
title: Design — ethereal-quote-landing
description: GOLD tier — vision-written 2026-08-13 (self). Ethereal landing page.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Ethereal Quote Landing — Mist & Peak
source: extractions/ethereal-quote-landing/ethereal-quote-landing.png
captured_at: 2026-08-13
colors:
  fog: "#deded6"
  fog-median: "#d3d2cc"
  ink: "#2d2e31"
  grey: "#9e9d99"
typography: {}
spacing:
  base: 4px
rounded:
  none: 0px
---

# Design Analysis — Ethereal Quote Landing (Mist & Peak)

> Vision-written gold pass. Date: 2026-08-13. Emphasis: the light, welcoming register of the aesthetic.

## Source

- **Source type**: local image · **Path**: `extractions/ethereal-quote-landing/ethereal-quote-landing.png` (1024×1024)
- **Capture method**: direct vision
- **Detected limitations**: small nav/CTA text at the edge of legibility (labels read confidently: DISCLOSURE, FILE, PROFILE, SIGN UP, Begin Survey, View Evidence); body copy absent.

## TL;DR

A minimal ethereal landing page: a luminous mist-dissolved mountain peak, a centered serif headline ("The frontiers of knowledge are stunning, yet haunting"), a thin nav, and two quiet CTAs. The light, welcoming register of the disclosure aesthetic — and a genuine, buildable UI.

## 1. Visual identity

**Personality**: ethereal, hushed, reverent, weightless.
**Mood**: awed calm — the sublime made gentle.
**Detectable stylistic references**: quiet-luxury editorial web, minimal SaaS landing, gallery/museum sites, Kinfolk-style whitespace.
**Information density**: very low — one image, one line, two buttons.
**Implicit positioning**: the airy counterweight to the dossier/HUD darkness; proof the aesthetic can welcome as well as withhold.
**Confidence**: ✅ high.

### 1.2 Brand voice

Reverence without menace. The brand can invite — framing the unknown as beautiful and worth approaching slowly, not just as a redacted threat.

### 1.3 The ONE brand thing

- **The thing**: negative space as the design — a single misty peak, a single line of type, and air.
- **Why it carries the brand**: it distills the disclosure theme to its calmest form; restraint here reads as confidence, not emptiness.
- **How everything else supports it**: the chroma-scarce fog palette and fine serif/mono type mix do quiet, precise work.
- **Where it appears**: the actual landing/hero, campaign pages, chapter-zero onboarding, anywhere a first impression must be calm. ✅ high (it *is* a landing).

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `fog` | `#deded6` | page ground | ✅ pixel |
| `fog-median` | `#d3d2cc` | median / panel | ✅ pixel |
| `ink` | `#2d2e31` | headline, nav, primary CTA | ✅ pixel |
| `grey` | `#9e9d99` | secondary text, lit ridge | ✅ pixel |

Typography: a high-contrast serif (Didone/Modern class) for the headline; a wide-tracked uppercase mono for nav and CTAs. ⚠️ medium (classes inferred).

## 3. Components inventory

Signature: **ethereal hero** (misty image + centered serif headline + CTA pair). Generic: top nav, button (filled/outline) — all present. This folder earns a `component.tsx`.

## 4. Layout & composition

Square frame; strong vertical center stack — nav top, headline upper-center, CTA pair below it, mountain mass lower two-thirds dissolving into the fog ground. Enormous negative space; the peak anchors the bottom, the type floats above.

## 5. Reconstruction notes

As UI: fully buildable — see `component.tsx` (`QuoteHero`). The mountain is a raster/art asset behind a centered stack; type uses `--color-text-primary` on `--color-bg-primary`. Tricky bits: the mountain must dissolve into the ground (a `mask-image` gradient or an asset with baked fade) or the seam shows; keep tracking wide on the mono labels.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | landing-page read unambiguous |
| Colors | ✅ | pixel-grounded fog set |
| Typography | ⚠️ | serif + mono classes inferred |

## 6. Do's and Don'ts

**Do** — protect the negative space; keep the headline to one breath; let the peak dissolve; keep CTAs quiet.

**Don't** — don't add a second image or a card grid; don't brighten to pure white; don't enlarge the CTAs into loud buttons.

## 7. Open questions

- Should the mountain be a video/slow-mist asset in production? A barely-moving peak would deepen the ethereal register.

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md` · [x] `component.tsx`
