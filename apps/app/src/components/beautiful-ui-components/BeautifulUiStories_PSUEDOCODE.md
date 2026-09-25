# BeautifulUiStories — Pseudocode

1. Confirm no existing `*.stories.tsx` under `beautiful-ui-components/`.
2. Add `beautiful-ui-theme.css` with Turbo showcase tokens + keyframes + Tailwind `@theme` color/shadow/radius bridges.
3. Add story decorator root `.beautiful-ui-root` (light/dark) so `text-ink`, `bg-field`, etc. resolve without colliding with writers-desk tokens globally.
4. Add CSF stories: gallery + per-component Defaults; variant stories for LoadingState / ThinkingState / TaskRows.
5. Copy Dev UI archive iframe embeds into `design-system/lab-prototypes/dev-ui-embeds/`.
6. Add fullscreen Storybook stories for each embed.
7. Document architecture in `BeautifulUiStories.md`.
