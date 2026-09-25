---
version: anydesign-1
name: mixed-mockup-plates — dark research desk plate
source: extractions/mixed-mockup-plates/mixed-mockup-plates.png
captured_at: 2026-08-13
description: |
  The desk SoT register: near-black charcoal ground with brass as the only
  warm signal. Dense, zoned console layout — rail, canvas, inspector. This is
  the dark pole of the product's two-register system (paper is the other).
colors:
  primary: "#968368"
  surface: "#191a19"
  text-primary: "#968368"
  text-muted: "#968368"
  border: "#968368"
typography:
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32]
rounded:
  sm: 4px
---

# Design Analysis — dark research desk plate (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Classified-console product UI: near-black field, brass instrumentation, dense
zoned layout. Chroma discipline is absolute — one warm metal, nothing else.

## 1. Visual identity

**Personality**: nocturnal, instrumented, serious, dense.
**Mood**: operational focus.
**References**: intelligence-console HUD; Linear-density translated to an
archival product.
**Confidence**: ✅ palette (measured), ⚠️ layout detail (single frame).

### 1.3 The ONE brand thing

**The thing**: brass `#968368` as the sole warm signal on charcoal. Remove it
and the plate is every dark UI; keep it scarce and it is unmistakably this desk.

## 2. Tokens

Measured in `design-tokens.md`: `--color-bg-primary` `#191a19`,
`--color-primary` `#968368` (sat/share gate passed). Accent budget: CTA +
active states only (MotionViz chroma-scarcity rule).

## 4. Layout & composition

Three-zone console: left rail (~56–64px icon column), canvas field, right
inspector. Header strip carries mono readouts. Density alternates: chrome
dense, canvas calm.

## 6. Do's and Don'ts

**Do**: reserve brass for active/CTA; keep chrome hairline; mono for all
readouts.
**Don't**: no second accent hue; no light cards on the dark field (polarity
flip belongs to paper register only); no glow effects.

## 7. Open questions

- Exact rail width + breakpoint behavior — not observable ❓
- Whether vortex-HUD siblings in this cluster share the token set (likely ⚠️).
