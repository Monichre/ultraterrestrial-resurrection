# PaperTextures

Tileable stocks that give writers-desk surfaces real document tooth instead of flat hex fills.

## Assets

`apps/app/public/textures/paper/`

- `fabric-of-squares.png` — micro-schematic grain
- `debut-twill.png` — fine weave / cardstock
- `inflicted-grid.png` — dark graph paper
- `groove-paper.png` — high-contrast hatch
- `grid-noise.png` — diamond technical grid

## API

```ts
import { PaperSurface, PAPER_TEXTURE, PAPER_TEXTURE_META } from '@/components/writers-desk'

<PaperSurface variant="desk">…</PaperSurface>
```

Variants: `desk` | `drafting` | `research` | `sheet` | `tooth` (+ CSS `wd-paper-note-body`).

## Where applied

| Surface | Variant |
|---------|---------|
| `/note` | `desk` |
| `/research` | `research` |
| `NoteLetterShell` | `sheet` + `tooth` |
| `NoteApp` body | `wd-paper-note-body` |
| `NoteWidget` frame | `drafting` |
