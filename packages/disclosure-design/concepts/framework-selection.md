---
title: Framework selection
description: Choose Vite SPA vs Next.js SSR, FastAPI vs Flask, Axum vs Actix, then scaffold the matching entry points.
type: concept
created: 2026-08-13
author: agent
tags: [concept, scaffolding, assembling-components]
skill_chain_stage: assembly
tokens: []
framework: any
motion: none
source_repo: assembling-components
---

# Framework selection

## Definition

Assembling-components picks a scaffold **before** wiring components. The chooser is requirement-driven, not preference-driven.

## Why it matters for assembling-components

Wrong scaffold puts `ThemeProvider` in the wrong file (`main.tsx` vs `app/layout.tsx` vs Jinja/`base.html`) and breaks token import order. `outputs.yaml` lists different `must_contain` checks per framework.

## Constraints

### React / TypeScript

| Choose | When |
| --- | --- |
| **Vite + React** | SPA, fast local builds, no SSR, max config control |
| **Next.js 14/15** | SSR/SSG, App Router, API routes, SEO, React Server Components |

Vite entry: `src/main.tsx` + `index.html` + `vite.config.ts` alias `@` → `./src`. Next entry: `src/app/layout.tsx` imports tokens first; client islands (`"use client"`) for theme toggle, toasts, charts.

### Python

| Choose | When |
| --- | --- |
| **FastAPI** | Async APIs, OpenAPI, Pydantic, high throughput |
| **Flask** | Simpler apps, Jinja2, familiar WSGI ecosystem |

Both serve `static/css/tokens.css` from the HTML base template. FastAPI is the bundled template; Flask is the documented alternative, not a second template tree.

### Rust

| Choose | When |
| --- | --- |
| **Axum** | Tower extractors, async-first, growing ecosystem (bundled template) |
| **Actix Web** | Max throughput, actor model, more mature ecosystem |

Axum uses Tera templates + `static/css/tokens.css`. Same token and `data-theme` contract as the JS apps.

```bash
python scripts/generate_scaffold.py <name> react-vite|nextjs|python-fastapi|rust-axum ./examples
```

Compatibility from library context: AI Design Components v0.2.x → React 18, Next 14/15, Python 3.11+, Rust 1.75+.

## Related

- [Root providers](./root-providers.md)
- [Barrel exports](./barrel-exports.md)
- [assembling-components skill](../references/assembling-components-skill.md)
