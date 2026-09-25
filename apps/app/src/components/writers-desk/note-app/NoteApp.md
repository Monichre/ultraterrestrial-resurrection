# NoteApp

Warm cream filing-cabinet notes UI: folder tabs (Notes / Projects / Archive), sidebar list, and a large title + body editor.

## Props

| Prop | Type | Default |
|------|------|---------|
| `initialNotes` | `DeskNote[]` | `INITIAL_NOTES` |
| `initialTab` | `NoteTab` | `'Notes'` |
| `initialSelectedId` | `string` | `'1'` |
| `className` | `string` | — |

## Process

1. Tabs switch visual context (state only; same note store for now).
2. Sidebar selects a note; selected row uses `note-selected`.
3. Title/content inputs mutate the selected note; content updates `preview`.
4. Plus creates an untitled note; refresh updates its timestamp.

## Tokens

`note-canvas`, `note-tab-*`, `note-text*`, `note-border`, `note-selected`.
