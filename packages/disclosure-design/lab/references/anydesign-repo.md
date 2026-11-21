---
title: AnyDesign repo
description: uxKero/anydesign — extract design.md, DTCG tokens, and element.md from images, URLs, and Figma.
type: reference
created: 2026-08-13
author: agent
tags: [reference, anydesign, assembling-components]
source_repo: anydesign
source_url: https://github.com/uxKero/anydesign
source_path: SKILL.md
captured_at: 2026-08-13
skill_chain_stage: theming
framework: any
motion: tokenized
---

# AnyDesign repo

## Summary

Public MIT skill ([uxKero/anydesign](https://github.com/uxKero/anydesign)): point it at anything visual, get a machine-readable design system. Full mode emits `design.md` + `design-tokens.json` (DTCG `$value`/`$type`). Element mode emits `element.md` (code rebuild prompt, token-grounded image prompt, or hybrid). Inventing tokens is treated as worse than saying "not enough info". Confidence markers: high / medium / low.

## Key points

Mandatory workflow: identify source → capture (vision / HTML+CSS vars / Playwright / Figma MCP) → six analysis layers (Identity, System, Components, Layout, Reconstruction, Brand rules) → Art Direction QA pass → generate files → lint `design.md`.

Token philosophy ([`references/token-extraction.md`](https://github.com/uxKero/anydesign/blob/main/references/token-extraction.md)): a token is a named reusable decision; repetition ≥3 times; semantic roles not "color 1"; 4px/8px/16px base-unit inference.

Output contract ([`references/output-template.md`](https://github.com/uxKero/anydesign/blob/main/references/output-template.md)): YAML frontmatter token map + `{token.ref}` in prose; sections 1–7 including Do's/Don'ts and Open Questions.

Scripts: `extract_css_vars.py`, `capture_site.py`, `extract_colors.py`, `check_contrast.py`, `lint_design_md.py`, `verify_design.py`, `export_for_claude_design.py` (emits `tokens.css` + Tailwind config).

Worked example: `examples/vercel-landing/` extracted 808 CSS custom properties from vercel.com and exported `claude-design-bundle/tokens.css` including `--motion-duration-*` and `--motion-ease-*`.

## Citations

- URL: [https://github.com/uxKero/anydesign](https://github.com/uxKero/anydesign)
- Path: `SKILL.md`
- Path: `README.md`
- Path: `references/token-extraction.md`
- Path: `references/analysis-framework.md`
- Path: `references/output-template.md`
- Path: `references/element-copy.md`
- Path: `examples/vercel-landing/claude-design-bundle/tokens.css`
- Path: `examples/landing-example/design.md`

Ingested 2026-08-13 via shallow clone of `main` (16 commits on the GitHub index page at ingest time). Clones were not vendored into this vault.

## Mapping to assembling-components

See [AnyDesign assembly bridge](../concepts/anydesign-assembly-bridge.md) and [rename map](./anydesign-token-rename-map.md). `export_for_claude_design.py`'s `tokens.css` is an input to rename, not a drop-in `src/styles/tokens.css`.

## Where this is used

- [AnyDesign assembly bridge](../concepts/anydesign-assembly-bridge.md)
- [Token-first assembly](../concepts/token-first-assembly.md)
- [AnyDesign artifact](./anydesign-artifact.md)
