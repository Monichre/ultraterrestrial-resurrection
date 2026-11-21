# FolderInteraction

**Updated:** 2026-08-05

## Summary

Click-to-open folder UI: three spring-animated pages fan out; a frosted SVG flap rotates on X.

## Modules

| File | Role |
|---|---|
| `FolderInteraction.tsx` | Component + page stub |
| `FolderInteraction.stories.tsx` | Storybook: Default / Open / Controlled |
| `index.ts` | Named + default exports |

## Props

- `open` / `defaultOpen` / `onOpenChange` — controlled or uncontrolled
- `className` — outer wrapper

## Storybook

`Components/FolderInteraction`

## Not done

- Visual dogfood in running Storybook (UNVERIFIED).
- Wiring into research-canvas case-files (separate from existing `folder-open`).
