---
title: Root providers
description: ThemeProvider (data-theme) and ToastProvider wrap the assembled app; tokens.css loads before globals.css.
type: concept
created: 2026-08-13
author: agent
tags: [concept, providers, theming, assembling-components]
skill_chain_stage: theming
tokens:
  - "--color-*"
framework: any
motion: none
source_repo: assembling-components
---

# Root providers

## Definition

The assembled entry point wraps the tree in `ThemeProvider` (sets `data-theme` on `<html>`, persists to `localStorage`, supports `light` | `dark` | `system`) and `ToastProvider` (feedback skill). Token CSS is imported **before** any component CSS.

Vite (`src/main.tsx`):

```tsx
import './styles/tokens.css'
import './styles/globals.css'
import { ThemeProvider } from '@/context/theme-provider'
import { ToastProvider } from '@/components/feedback'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
```

Next.js (`src/app/layout.tsx`): import `@/styles/tokens.css` then `./globals.css`; wrap `<body>` with the same providers; `suppressHydrationWarning` on `<html>`. Do **not** put `data-theme` in `index.html` — JS owns it.

Python/Rust SSR templates load `/static/css/tokens.css` in `base.html` before page CSS. Theme toggle still sets `data-theme` on the document element.

## Why it matters for assembling-components

If tokens load late, first paint uses untokenized fallbacks. If `data-theme` is static, system preference and toggle both fail. If Toast is rendered without `ToastProvider`, feedback wiring is incomplete.

## Constraints

- Import order: tokens → globals → components.
- `useTheme` throws outside `ThemeProvider`.
- Dark theme must override the full color set, not a subset.
- Focus rings use `--color-border-focus` or `--shadow-focus` (or `--color-primary` as in the Next template).

## Related

- [Token-first assembly](./token-first-assembly.md)
- [Reduced motion](./reduced-motion.md)
- [Framework selection](./framework-selection.md)
- [Skill chain](./skill-chain.md)
