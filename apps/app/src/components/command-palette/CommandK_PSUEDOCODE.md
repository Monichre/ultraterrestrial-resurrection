# Command K Pseudocode

**Updated:** 2026-07-23 16:35:00 CDT  
**Scope:** Decorative `CommandK` command-menu showcase (not the live `CommandPalette`)

## Component contract

1. Accept optional `commands` map: category → `{ name, icon }[]`.
2. Maintain local `searchQuery` string state.
3. Client-only component (`'use client'`).

## Render flow

1. Center a fixed-height stage (`440px`).
2. Overlay decorative `KeyboardKey` chips (`⌘ command`, `K`) with slight rotations.
3. Draw frosted panel (`460×304`) with inset glow, Actions badge, search input, and scrollable results.
4. For each category:
   - collapse category header when search is non-empty
   - filter items by case-insensitive name match
   - animate item height/opacity for match vs non-match

## Subcomponents

1. `CommandItem` — icon + title row; typed props (no `any`).
2. `KeyboardKey` — bordered keycap with gradient overlay.

## Storybook

1. Register under `Components/CommandK`.
2. Stories: Default (sample grouped commands), Empty.

## Verification

1. ESLint on component + story.
2. Confirm export from `command-palette/index.ts`.
