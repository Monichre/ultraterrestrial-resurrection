---
title: DesignPortfolio Component Pseudocode
description: High-level flow for animated portfolio folders + image lightbox
created: 2026-01-20T00:00:00Z
lastUpdated: 2026-01-20T00:00:00Z
author: AI Agent
version: 1.0.0
---

## Goal

Create a reusable client component that renders an animated portfolio grid:

- Each category is a "folder" card with layered 3D animation and project preview cards.
- Hovering a folder animates multiple mini card previews into view.
- Clicking a preview card opens a full-screen lightbox with animated expansion from card position.
- Lightbox supports keyboard navigation (arrows, escape) and next/prev controls.
- Page-level layout includes a theme toggle with `prefers-color-scheme` initialization.

## Data & Types

- **Project**
  - `id: string`
  - `image: string`
  - `title: string`

- **Portfolio section config**
  - `title: string`
  - `gradient: string` (CSS gradient string for folder theming)
  - `projects: Project[]`

- **Constants**
  - `PLACEHOLDER_IMAGE` URL for when an image fails to load.

## Utility

- `cn(...classes)`
  - Accepts `ClassValue[]` (from `clsx`/`tailwind-merge`).
  - Returns merged Tailwind-aware className string.

## ProjectCard

**Props**

- `image`, `title`
- `delay`: number (staggered animation)
- `isVisible`: boolean (hover state)
- `index`, `totalCount` (for layout math)
- `onClick`: () => void
- `isSelected`: boolean (hide when active in lightbox)

**Logic**

- Compute `middleIndex = (totalCount - 1) / 2`.
- Compute `factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0`.
- From `factor` derive:
  - `rotation = factor * 25`
  - `translationX = factor * 85`
  - `translationY = abs(factor) * 12`
- When `isVisible`:
  - Use CSS transform combining translation/rotation and scale(1).
  - Apply opacity 1 and staggered transition `delay`.
- When not visible:
  - Reset transform to centered stack and scale(0.4), opacity 0.
- If `isSelected`:
  - Force opacity 0 to hide card while lightbox is open.
- Render:
  - Wrapper `div` absolutely positioned above folder front.
  - Inner `img` with gradient overlay + small title text.
  - `onError` fallback swaps to `PLACEHOLDER_IMAGE`.

## ImageLightbox

**Props**

- `projects: Project[]`
- `currentIndex: number` (controlled index from folder)
- `isOpen: boolean`
- `onClose: () => void`
- `sourceRect: DOMRect | null` (origin position from clicked card)
- `onCloseComplete?: () => void` (cleanup callback)
- `onNavigate: (index: number) => void` (delegate index changes to parent)

**State**

- `animationPhase: "initial" | "animating" | "complete"`
- `isClosing: boolean`
- `shouldRender: boolean` (mount/unmount control)
- `internalIndex: number` (current slide for CSS transform)
- `isSliding: boolean` (debounce slide transition)

**Derived**

- `totalProjects = projects.length`
- `hasNext`, `hasPrev`
- `currentProject = projects[internalIndex]`

**Effects & Handlers**

1. **Sync slide index on `currentIndex` changes**
   - If `isOpen` and `currentIndex !== internalIndex` and not sliding:
     - Set `isSliding = true`.
     - After 400ms timeout, update `internalIndex` to `currentIndex`, set `isSliding = false`.

2. **Reset internal index when lightbox is opened**
   - On `[isOpen, currentIndex]` change:
     - If `isOpen`, set `internalIndex = currentIndex` and `isSliding = false`.

3. **Navigation callbacks**
   - `navigateNext`:
     - Guard if at last index or `isSliding`.
     - Call `onNavigate(internalIndex + 1)` (parent updates `currentIndex`).
   - `navigatePrev`:
     - Guard if at index 0 or `isSliding`.
     - Call `onNavigate(internalIndex - 1)`.

4. **Close handler**
   - Set `isClosing = true`.
   - Call `onClose()` (parent sets open flag false).
   - After 500ms timeout:
     - Reset `isClosing`, `shouldRender`, `animationPhase` to initial.
     - Call `onCloseComplete?.()`.

5. **Keyboard + body scroll lock**
   - On mount:
     - Add `keydown` listener:
       - `Escape` → close.
       - `ArrowRight` → next.
       - `ArrowLeft` → prev.
     - If `isOpen`, set `document.body.style.overflow = "hidden"`.
   - On cleanup:
     - Remove listener, reset overflow.

6. **Entrance animation from sourceRect**
   - On `[isOpen, sourceRect]`:
     - If open and rect provided:
       - Set `shouldRender = true`, reset `animationPhase` and `isClosing`.
       - Use `requestAnimationFrame` twice to transition `animationPhase` to `"animating"`.
       - After ~700ms, set `animationPhase = "complete"`.

7. **Dot navigation**
   - `handleDotClick(idx)`:
     - If `isSliding` or `idx === internalIndex`, ignore.
     - Call `onNavigate(idx)` to re-use parent control channel.

**Layout & Transitions**

- If `!shouldRender` or no `currentProject`, render `null`.
- Compute `getInitialStyles()` using `sourceRect` + viewport:
  - Infer target width/height in center.
  - Compute scale and translation to map source card center → lightbox center.
  - Return transform + opacity + borderRadius.
- `getFinalStyles()` resets to identity transform, full opacity and larger radius.
- Main wrapper:
  - Fullscreen fixed container with fade-in/out of backdrop.
  - Close, previous, and next buttons animated in from edges.
  - Inner container:
    - Combines current styles, shrinks slightly on closing.
    - Houses:
      - Slider strip:
        - `translateX(-internalIndex * 100%)`.
        - Each slide is a full-size image with gradient overlay.
      - Metadata footer:
        - Title, project index, dot controls, and "View Project" button.

## AnimatedFolder

**Props**

- `title: string`
- `projects: Project[]`
- `className?: string`
- `gradient?: string`

**State**

- `isHovered: boolean`
- `selectedIndex: number | null` (lightbox control)
- `sourceRect: DOMRect | null`
- `hiddenCardId: string | null` (to hide clicked card)
- `cardRefs: HTMLDivElement[]` (refs for preview cards)

**Derived**

- `previewProjects = projects.slice(0, 5)` (limit visible cards).
- `backBg`, `tabBg`, `frontBg` computed from `gradient` or CSS vars.

**Handlers**

- `handleProjectClick(project, index)`:
  - Read DOMRect from `cardRefs[index]`.
  - Set `sourceRect` from DOMRect.
  - Set `selectedIndex = index`.
  - Set `hiddenCardId = project.id`.

- `handleCloseLightbox()`:
  - `selectedIndex = null`, `sourceRect = null`.

- `handleCloseComplete()`:
  - Reset `hiddenCardId = null`.

- `handleNavigate(newIndex)`:
  - Update `selectedIndex = newIndex`.
  - Update `hiddenCardId = projects[newIndex]?.id`.

**Render**

- Folder card container:
  - 3D-styled back panel, front panel, tab, and glossy overlay.
  - On hover:
    - Scale + rotate the entire folder slightly.
    - Animate back/front panels and tab with perspective transforms.
    - Fade in radial accent background.
- Preview cards:
  - Render `ProjectCard` components stacked over the folder front.
  - Wire up `ref` assignments into `cardRefs`.
  - Pass `isVisible = isHovered`.
- Text:
  - Folder title and project count under the folder.
  - "Hover" hint pill that fades/moves when hovered.
- Lightbox:
  - Render `ImageLightbox` with:
    - `projects`, `currentIndex = selectedIndex ?? 0`.
    - `isOpen = selectedIndex !== null`.
    - `sourceRect` and callbacks wired.

## portfolioData

- Static array defining 6 categories:
  - Branding, Web Design, UI/UX Design, Photography, Illustration, Motion.
- Each entry:
  - `title`, `gradient`, `projects: Project[]` (3–6 images each).
- Image URLs use Unsplash `photo-...` ids with `auto=format&fit=crop&q=80&w=800`.

## DesignPortfolio (main exported component)

**State**

- `isDark: boolean` (theme state).

**Effects**

1. On mount:
   - If `window.matchMedia('(prefers-color-scheme: dark)')` matches, set `isDark = true`.

2. On `isDark` change:
   - If true → `document.documentElement.classList.add('dark')`.
   - Else → remove `dark` class.

**Handlers**

- `toggleTheme()`:
  - `setIsDark(prev => !prev)`.

**Layout**

- Wrap whole view in `<main>` with:
  - `min-h-screen`, theme-aware background/foreground, selection styling.
- Header:
  - Sticky top bar with backdrop blur, border.
  - Right-aligned theme toggle button:
    - Shows `Sun` in dark mode, `Moon` in light mode.
- Hero:
  - Centered title "Design Portfolio" with accent span and entrance animation.
  - Subtitle describing hover interaction.
- Grid section:
  - Responsive grid (1/2/3 columns).
  - Map `portfolioData` to `AnimatedFolder`:
    - Use index for staggered entrance animation delay.
    - Pass title, projects, gradient, and width class.

## Usage

- Import and render in a client context:

```tsx
import { DesignPortfolio } from "@/components/DesignPortfolio"

export default function DemoPage() {
  return <DesignPortfolio />
}
```

