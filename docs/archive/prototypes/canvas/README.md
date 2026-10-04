# Canvas

Archived **visual-brainstorm screens** — diagrams, comparisons, and decision screens
rendered during design sessions and snapshotted here so the thinking is durable.

## Structure
- `STYLE.md` — the rendering contract (palette, classes, conventions). Keeps screens consistent.
- `<date>-<topic>/` — one folder per session (e.g. `2026-05-30-data-architecture/`).
  - `INDEX.md` — ordered list of screens with one-line descriptions.
  - `*.html` — the screen fragments, in render order.

## How to view
Screens are **content fragments** meant to render inside the brainstorming companion
server (started via the `brainstorming` skill). Opening a raw `.html` directly will look
partially unstyled — the server injects the frame theme + interactivity. (Making them
standalone-renderable is a parked enhancement; see `../../SCRATCHPAD.md`.)

## Who writes here
The `canvas` delegate agent renders screens during sessions. The strategist (main thread)
decides what each screen says; the agent does the HTML grunt work so the live
conversation stays lean.
