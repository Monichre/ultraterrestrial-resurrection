# WritersDeskNotes

**Ported:** 2026-07-19 from `~/Desktop/lab/writers-desk`

## Purpose

Filing-cabinet note workspace + stacked founder-letter sheets from Writers Desk, adapted for Ultraterrestrial’s Next.js app.

## Architecture

```
components/writers-desk/
  note-app/          → cream tabbed editor (NoteApp)
  note-letter/       → dark stacked letter + dual widget
  writers-desk-notes.css
  index.ts
```

### Data flow

- **NoteApp:** local React state for notes list + selected id; title/content edits update preview; add/refresh are client-only.
- **NoteLetter:** presentational — shell (framer-motion sheets) + content (title, paragraphs, signature).
- **NoteWidget:** left = compact NoteLetter; right = contentEditable rich-text with toolbar (`document.execCommand`).

### Routes

| Path | Surface |
|------|---------|
| `/note` | Full-page NoteLetter on dark canvas |
| `/research` | NoteApp + NoteWidget on dotted cream ground |

### Theme tokens

Added to `globals.css` `@theme`: `canvas*`, `ink*`, `divider*`, `note-*`, `shadow-sheet*`, `radius-card`.

### Paper textures (2026-07-19)

Tileable stocks in `public/textures/paper/`:

| File | Role |
|------|------|
| `fabric-of-squares.png` | Micro-schematic grain on dark desks |
| `debut-twill.png` | Fine weave / cardstock tooth |
| `inflicted-grid.png` | Graph-paper drafting |
| `groove-paper.png` | High-contrast hatch on letter sheets |
| `grid-noise.png` | Diamond technical grid |

Surfaces via `PaperSurface` / CSS: `desk`, `drafting`, `research`, `sheet`, `tooth`, `wd-paper-note-body`.

Wired into `/note` (desk), `/research` (research), `NoteLetterShell` (sheet+tooth), `NoteApp` body, `NoteWidget` (drafting).

## Storybook

- `Writers Desk/NoteApp`
- `Writers Desk/NoteLetter` (+ Compact, Widget)
- `Writers Desk/PaperTextures`

## Key modules

- `NoteApp.tsx` — tab strip, sidebar list, title/body editor
- `NoteLetterShell.tsx` — three-layer offset card motion
- `NoteLetterContent.tsx` — typography + signature block
- `NoteWidget.tsx` — letter preview + rich notes pane
