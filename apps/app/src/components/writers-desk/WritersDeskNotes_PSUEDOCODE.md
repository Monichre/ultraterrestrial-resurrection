# Writers Desk Notes — Pseudocode

**Source:** `~/Desktop/lab/writers-desk/`
**Date:** 2026-07-19

## Goal

Port the note workspace UI into `apps/app`:

| Source | Destination |
|--------|-------------|
| `components/note-app/NoteApp.tsx` | `src/components/writers-desk/note-app/` |
| `components/note-letter/*` | `src/components/writers-desk/note-letter/` |
| `app/note/page.tsx` | `src/app/(site)/note/page.tsx` |
| `app/research/page.tsx` | `src/app/(site)/research/page.tsx` |

## Steps

1. Add Tailwind v4 `@theme` tokens for note cream + letter dark palettes + sheet shadows + `radius-card`
2. Port CSS helpers (`.note-scrollbar`, contenteditable placeholder)
3. Port `note-letter` (Shell, Content, Letter, Widget) with named exports + types
4. Port `NoteApp` with fixtures extracted; keep tab/editor behavior
5. Wire `/note` and `/research` routes
6. Storybook stories for NoteApp, NoteLetter, NoteWidget
7. Document in `WritersDeskNotes.md` + component PascalCase docs

## Constraints

- Named exports; `'use client'` on interactive surfaces
- framer-motion + lucide-react already in app
- Do not depend on writers-desk package paths
- Preserve visual DNA (cream filing tabs + stacked dark letter sheets)
