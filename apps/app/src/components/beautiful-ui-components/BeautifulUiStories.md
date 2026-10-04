# BeautifulUiStories

**Updated:** 2026-08-05

## Summary

Storybook coverage for the vendored Beautiful UI (Turbo) primitives and for Dev UI archive iframe embeds.

## Modules

| Area | Path | Role |
|---|---|---|
| Theme | `beautiful-ui-theme.css` | Turbo light/dark tokens, keyframes, Tailwind `@theme` bridges |
| Decorator | `story-decorators.tsx` | `.beautiful-ui-root` wrapper for stories |
| Gallery | `BeautifulUiGallery.stories.tsx` | All 17 primitives on one canvas |
| Per-component stories | `*.stories.tsx` (colocated) | Default + Dark; variants for Loading / Thinking / Task Rows |
| Embeds | `../design-system/lab-prototypes/dev-ui-embeds/` | Copied iframe showcases + fullscreen stories |

## Storybook titles

- `Design System/Beautiful UI/*`
- `Design System/Lab Prototypes/Dev UI Embeds/*`

## Data flow

Storybook story → `withBeautifulUiTheme` (sets CSS vars) → default-exported showcase component (self-contained demo data).

Embed stories → fullscreen iframe shell (`srcDoc` HTML + CDN scripts; Unicorn Studio / Three / GSAP as originally authored).

## Run

```bash
cd apps/app && bun run storybook
```

## Not done

- Visual dogfood in running Storybook (UNVERIFIED until opened in browser).
- Production route wiring for embeds or Beautiful UI.
