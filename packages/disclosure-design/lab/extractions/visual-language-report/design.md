---
version: anydesign-1
name: visual-language-report
source: extractions/visual-language-report/visual-language-report.png
captured_at: 2026-08-13
description: |
  The system writing itself down: swatch tables and type specimens on bone
  paper, ink rules, no decoration beyond the specimens themselves. Editorial
  register — the document IS the brand behaving.
colors:
  primary: "#817a6e"
  surface: "#dcd1c0"
  text-primary: "#1b1e20"
  text-muted: "#817a6e"
  border: "#ada190"
typography:
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: 16px
    lineHeight: 1.6
  caption-mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: 12px
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48]
rounded:
  sm: 4px
---

# Design Analysis — visual language report (still)

> Per `prompts/output-template.md`, still-scoped. Date: 2026-08-13.

## TL;DR

Specimen-book identity page: bone paper, ink text, warm taupe apparatus.
Editorial confidence through rules and rhythm, not decoration.

## 1. Visual identity

**Personality**: editorial, systematic, archival.
**Mood**: institutional calm.
**Confidence**: ✅ palette + composition, ⚠️ type names inferred.

### 1.3 The ONE brand thing

The specimen block itself — swatches and type shown AS the content. The page
is a museum label for the system.

## 2. Tokens

Measured: `design-tokens.md` (`--color-text-primary` `#1b1e20` on
`--color-bg-primary` `#dcd1c0` — strong contrast pair ✅).

## 4. Layout & composition

Single-column flow; hairline section rules; specimens inset with mono captions.
Vertical rhythm ≈ 32–48px between sections.

## 6. Do's and Don'ts

**Do**: captions mono; specimens flush-left on the column; generous top margins.
**Don't**: no full-bleed color bands; no decorative icons; don't center prose.

## 7. Open questions

- Whether the report has a dark counterpart — none observed ❓
