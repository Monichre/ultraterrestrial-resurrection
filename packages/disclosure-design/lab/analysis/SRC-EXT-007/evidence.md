# Evidence Analysis: SRC-EXT-007 (Hyperplex)

## Source
- **Identifier**: SRC-EXT-007
- **Path**: `/Users/liamellis/Desktop/disclosure-design-references/workers/acquisition/clones/SRC-EXT-007_hyperplex`

## Visual Evidence
### 1. Color Palette (OKLCH)
- **Light Mode**:
  - Background: `oklch(1 0 0)` (Pure White).
  - Foreground: `oklch(0.145 0 0)` (Dark Gray/Black).
  - Primary: `oklch(0.205 0 0)` (Dark Neutral).
  - Muted: `oklch(0.97 0 0)` (Off-white).
  - Border: `oklch(0.922 0 0)` (Light Gray).
- **Dark Mode**:
  - Background: `oklch(0.145 0 0)` (Dark Gray).
  - Foreground: `oklch(0.985 0 0)` (Off-white).
  - Primary: `oklch(0.922 0 0)` (Light Gray).
  - Card/Popover: `oklch(0.205 0 0)` (Deep Neutral).
  - Border: `oklch(1 0 0 / 10%)` (White 10% opacity).

### 2. Typography
- **Sans**: Manrope.
- **Mono**: Geist Mono.

### 3. Layout & Components
- **Radius**: `0.625rem` (10px) as the base `--radius`.
- **UI Framework**: Likely shadcn/ui based on the `components/ui` structure (badge, button, dialog, etc.).
- **Sidebar**: Dedicated color system (`--color-sidebar`, etc.) indicating a complex dashboard layout.
- **Scrollbars**: Custom thin scrollbars with `oklch(0.85 0 0)` thumbs.

### 4. Interaction & Effects
- **Animations**: `animate-slide-up` (0.4s ease-out) for elements transitioning from `translateY(10px)` to `0`.
- **Variants**: Explicit support for `dark` variant via `@custom-variant dark`.

## Analysis & Interpretation
- **Stance**: Modern SaaS / Professional Tooling. This is the most "conventional" of the references, utilizing OKLCH for precise color control and a standard design system approach.
- **Intent**: "The Command Center". It focuses on efficiency, accessibility, and state-management (light/dark modes), typical of a high-productivity administrative console.
- **Confidence**: High (direct CSS evidence).
