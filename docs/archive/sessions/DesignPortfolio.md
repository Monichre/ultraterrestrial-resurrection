---
title: DesignPortfolio Component
description: Animated portfolio folders with image lightbox and theme toggle
created: 2026-01-20T00:00:00Z
lastUpdated: 2026-01-20T00:00:00Z
author: AI Agent
version: 1.0.0
---

## Overview

**DesignPortfolio** is a client-side showcase component that renders an animated design portfolio grid:

- Folder-style cards representing portfolio categories (Branding, Web Design, etc.).
- Hover interactions that fan out mini project cards with smooth 3D transforms.
- A fullscreen lightbox that animates from the clicked card's on-screen position.
- Keyboard navigation (Escape, Left/Right arrows) and a simple theme toggle.

This file documents the key modules, data flow, and integration points so the component can be reused or adapted in other parts of the app.

---

## Key Modules

- **`DesignPortfolio`** (main named export)
  - Public component intended to be used by routes or other feature shells.
  - Owns page-level layout (header, hero, grid) and theme toggle behavior.

- **`AnimatedFolder`**
  - Visual representation of a single portfolio category.
  - Handles hover state, 3D folder animation, preview card layout, and lightbox orchestration.

- **`ImageLightbox`**
  - Fullscreen, animated lightbox for browsing all projects within a folder.
  - Responsible for:
    - Entry/exit transitions using `sourceRect` → viewport transform.
    - Keyboard handlers and body scroll lock.
    - Internal slide index and navigation controls.

- **`ProjectCard`**
  - Small, stacked preview card used inside a folder.
  - Computes position/rotation based on index and count.
  - When clicked, passes control up so the folder can open the lightbox.

- **Utility: `cn`**
  - Tailwind-aware `className` helper built from `clsx` + `tailwind-merge`.

---

## Component Responsibilities & Data Flow

### Data Model

- **`Project` interface**
  - `id: string`
  - `image: string`
  - `title: string`

- **`portfolioData`**
  - Local constant array with shape:
    - `title: string`
    - `gradient: string`
    - `projects: Project[]`
  - Acts as the static data source for the initial implementation.

### DesignPortfolio

- **State**
  - `isDark: boolean` — theme mode.

- **Effects**
  - On mount:
    - Reads `prefers-color-scheme: dark` via `matchMedia` to initialize `isDark`.
  - On `isDark` change:
    - Adds/removes `dark` class from `document.documentElement`.

- **Render**
  - `<main>` with theme-aware background/foreground classes.
  - Sticky `<header>` containing a theme toggle button with `Sun`/`Moon` icons.
  - Hero section with title and description.
  - `<section>` with responsive grid:
    - Maps each entry in `portfolioData` to an `AnimatedFolder`.

### AnimatedFolder

- **State**
  - `isHovered` — hover state for animations.
  - `selectedIndex` — currently open project index in the lightbox (or `null` when closed).
  - `sourceRect` — DOMRect captured from the clicked `ProjectCard`.
  - `hiddenCardId` — ID of the card currently represented by the open lightbox (to avoid visual duplication).
  - `cardRefs` — array of `HTMLDivElement | null` references for preview cards.

- **Flow**
  1. Render folder visuals: back panel, tab, front panel, glossy overlay.
  2. Render up to 5 `ProjectCard`s stacked on top, wired with `ref` callbacks into `cardRefs`.
  3. On `ProjectCard` click:
     - Lookup DOMRect from `cardRefs[index]`.
     - Set `sourceRect`, `selectedIndex`, and `hiddenCardId`.
  4. Render `ImageLightbox` with:
     - `projects`, `currentIndex = selectedIndex ?? 0`, `isOpen = selectedIndex !== null`.
     - `sourceRect` and navigation/close callbacks.
  5. When lightbox closes:
     - Clear `selectedIndex` and `sourceRect`, and later clear `hiddenCardId` via `onCloseComplete`.

### ImageLightbox

- **Inputs**
  - `projects`, `currentIndex`, `isOpen`, `onClose`, `sourceRect`, `onCloseComplete`, `onNavigate`.

- **Internal State**
  - `animationPhase: "initial" | "animating" | "complete"`.
  - `isClosing`, `shouldRender`.
  - `internalIndex` for slider position.
  - `isSliding` to avoid overlapping slide transitions.

- **Behavior**
  - When opened:
    - Uses `sourceRect` to compute initial CSS transform (scale + translation) from card position.
    - Animates to centered, scaled-up view with rounded corners.
  - Listens to keyboard:
    - `Escape` → close.
    - `ArrowLeft` / `ArrowRight` → prev/next.
  - Locks body scroll while open.
  - Shows animated close/prev/next buttons and slide indicator dots.
  - Emits `onNavigate` to the parent instead of mutating external state directly.

---

## Integration & Usage

### Basic Usage

```tsx
import { DesignPortfolio } from "@/components/DesignPortfolio"

export default function PortfolioDemo() {
  return <DesignPortfolio />
}
```

### Composition Guidelines

- **Client-only**:
  - Component uses `window`, `document`, `useLayoutEffect`, and `useState`/`useEffect`.
  - Must only be used from client components or pages that include `"use client"`.

- **Styling & Design System**
  - Relies on Tailwind + app theme tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.).
  - Folder gradients are provided via plain CSS gradient strings; can be swapped or extended to match brand colors.

- **Accessibility**
  - Close button has explicit icon but no ARIA label; can be enhanced if required.
  - Lightbox uses Escape + arrows; tab order and focus management can be extended in future iterations.

---

## Extension Points

- **Dynamic Data**
  - `portfolioData` is currently static; can be converted into a prop:
    - e.g. `<DesignPortfolio sections={sectionsFromDB} />`.
  - `Project` interface is already exported for reuse.

- **Routing**
  - The "View Project" button is currently visual-only; consumers can:
    - Add a `link` field to `Project`.
    - Wire a `router.push` or `<Link>` around the button based on that URL.

- **Theming**
  - Theme toggle writes to `documentElement.classList`.
  - Could be moved to a global theme context or synced with existing app-wide theming if needed.

---

## Files Touched

- **Created**
  - `apps/app/src/components/DesignPortfolio.tsx`
  - `docs/work_logs/DesignPortfolio_PSUEDOCODE.md`
  - `docs/work_logs/DesignPortfolio.md` (this file)

