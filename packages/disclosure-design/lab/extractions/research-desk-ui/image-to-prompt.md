---
version: anydesign-element-1
name: document panel component spec sheet
source: extractions/research-desk-ui/research-desk-ui.png
captured_at: 2026-08-13
kind: hybrid
palette:
  - "#f4f0e9"
  - "#cbc2b3"
  - "#ded4c6"
  - "#7b7669"
---

# Image-to-prompt — `research-desk-ui`

Per `prompts/element-copy.md`. Kind: **hybrid** — the spec sheet is code-able
(rules, labels, card) but the paper tooth is an asset-grade texture.

### Canonical prompt (structured)

SUBJECT: a UI component specification sheet for an archival "document panel" —
one parchment card specimen centered on a larger bone-paper sheet, annotated
with hairline leader lines and monospaced measurement labels
STYLE / MEDIUM: flat print design-documentation poster, blueprint-meets-archive,
no perspective, no shadows
COMPOSITION & CAMERA: straight-on, portrait 4:5, specimen centered, generous
margins, annotations distributed at edges
LIGHTING: none (flat print); even tone
PALETTE: #f4f0e9 bone field, #ded4c6 panel surface, #cbc2b3 hairline rules,
#7b7669 ink-taupe labels
MOOD: archival, precise, quiet, instrument-grade
BACKGROUND / INTEGRATION: scene — background baked in as the bone sheet
AVOID: no hue accents, no drop shadows, no 3D, no photo textures beyond paper
grain, no lorem ipsum walls

### Natural-language version

A flat, print-style UI component spec sheet on warm bone paper (#f4f0e9): one
centered parchment document-panel card (#ded4c6) annotated by hairline #cbc2b3
leader lines and small monospaced taupe labels (#7b7669), blueprint-meets-
archival-dossier register, portrait, generous margins, no shadows, no color
accents, no 3D — quiet, precise, archival.

### Model adaptation notes

- **Midjourney**: condense to comma phrases; `--ar 4:5 --style raw`.
- **gpt-image / DALL-E**: use the NL version as-is.
- **SD/Flux**: tags from structured fields; AVOID block → negative prompt.

> **Prompt fidelity note**: a generative prompt is a high-fidelity description,
> not a guarantee. Expect 2–4 iterations; PALETTE and AVOID are the levers.
