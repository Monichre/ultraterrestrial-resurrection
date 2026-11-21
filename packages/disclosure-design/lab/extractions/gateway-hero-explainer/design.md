---
title: Design — gateway-hero-explainer
description: GOLD tier — vision-written 2026-08-13 (self). Landing/explainer — component candidate.
type: note
created: 2026-08-13
author: agent
tags: [folderize, design, gold, vision-self]
version: anydesign-1
name: Gateway — From Reading to Seeing explainer
source: extractions/gateway-hero-explainer/gateway-hero-explainer.png
captured_at: 2026-08-13
colors:
  surface: "#f4f1ea"
  ink: "#171715"
  obsidian: "#030404"
  obsidian-soft: "#42433d"
  amber: "#f59e0b"
typography:
  display:
    fontFamily: "serif-display, Georgia, serif"
    fontStyle: italic
  label:
    fontFamily: "ui-monospace, monospace"
    textTransform: uppercase
    letterSpacing: 0.15em
  body:
    fontFamily: "Inter, system-ui, sans-serif"
spacing:
  base: 4px
rounded:
  sm: 4px
  md: 8px
---

# Design Analysis — Gateway: From Reading to Seeing

> Vision-written gold pass. Date: 2026-08-13. Emphasis: mixed (landing explainer with embedded UI mockups).

## Source

- **Source type**: local image · **Path**: `extractions/gateway-hero-explainer/gateway-hero-explainer.png` (2160×3240)
- **Capture method**: direct vision
- **Detected limitations**: mockup micro-text partly illegible; amber hex from canon, not pixel (chroma-scarce sampler frame).

## TL;DR

A before/after manifesto poster: flat cream document-world (01) against a glowing obsidian graph-world (02), closed by a dark CTA band. The polarity flip IS the pitch — the product sells the moment reading becomes seeing.

## 1. Visual identity

**Personality**: revelatory, didactic, cinematic, editorial.
**Mood**: epiphany — drudgery transformed into wonder.
**Detectable stylistic references**: editorial serif-display posters, Linear/Vercel-style dark product panels, NYT-style explainer graphics.
**Information density**: balanced; each panel carries one idea.
**Implicit positioning**: researchers who live in PDFs and suspect there's a better instrument.
**Confidence**: ✅ high.

### 1.2 Brand voice

The design believes the archive is not the product — *insight* is. Panel 01 is deliberately clerical (flat cards, list rows, keyword box) so panel 02 can feel like a revelation. Serif italic display type borrows the authority of print essays; the dark graph panel borrows the awe of planetariums.

### 1.3 The ONE brand thing

- **The thing**: the light→dark polarity flip between 01 and 02.
- **Why it carries the brand**: the transformation narrative collapses if both panels share a surface.
- **How everything else supports it**: cream stays flat and matte; obsidian panel gets the only glow; amber appears once, at the CTA.
- **Where it appears**: hero/explainer surfaces; product UI stays dark-side. ✅ high.

## 2. Design system (tokens)

| Token | Hex | Role | Confidence |
| --- | --- | --- | --- |
| `surface` | `#f4f1ea` | light panel ground | ⚠️ visual (sampler read `#171715` dark-dominant overall) |
| `ink` | `#171715` | text on cream | ✅ pixel |
| `obsidian` | `#030404` | dark panel | ✅ pixel |
| `obsidian-soft` | `#42433d` | dark panel secondary | ✅ pixel |
| `amber` | `#f59e0b` | CTA + graph glow | ⚠️ canon |

Typography: serif italic display (headline), uppercase mono micro-labels in mockups, neutral sans body. Spacing: generous editorial margins; 4px base assumed.

## 3. Components inventory

Generic: mock PDF card, list rows, search input, CTA button (amber, dark band). Signature: **polarity-flip comparison panels** — the 01/02 numbered before/after with embedded mini-UIs; and the **glowing node-graph constellation** (asset-class).

## 4. Layout & composition

Vertical triptych: headline block → split comparison → dark CTA band. Portrait poster 2:3. Single viewport; responsive behavior not observable.

## 5. Reconstruction notes

Quick wins: two-surface palette + serif/mono pairing + one amber CTA. Tricky bits: graph constellation is an asset (or canvas render); serif italic face needs licensing decision. Implicit states: CTA hover, search focus — unobserved ❓.

| Layer | Confidence | Why |
| --- | --- | --- |
| Identity | ✅ | polarity argument explicit |
| Colors | ⚠️ | light surface read visually |
| Typography | ⚠️ | faces inferred |
| Layout | ✅ | single clear poster grid |

## 6. Do's and Don'ts

**Do** — keep 01 flat and matte; let 02 own all glow; reserve amber for the single CTA; set the headline in serif italic.

**Don't** — don't put the graph on cream; don't add a second accent; don't equalize panel heights mechanically — 02 may loom.

## 7. Open questions

- Is the serif face canonical (which family)? Is amber `#f59e0b` the same as plate-047's amber? (Likely — shared canon.)

## 8. Companion files

- [x] `source.md` · [x] `design-tokens.md` · [x] `image-to-prompt.md` · [x] `component.tsx` (GatewayExplainer)
