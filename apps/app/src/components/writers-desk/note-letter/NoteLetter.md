# NoteLetter

Dark stacked-sheet founder letter: three offset layers (framer-motion) + typographic body.

## Modules

| File | Role |
|------|------|
| `NoteLetterShell` | Motion sheets + card chrome |
| `NoteLetterContent` | Title, paragraphs (`boldPrefix`), signature |
| `NoteLetter` | Composed letter with defaults |
| `NoteWidget` | Compact letter + rich-text notes editor |

## Props (`NoteLetter`)

| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | Introducing Interfere |
| `paragraphs` | `NoteParagraph[]` | fixture copy |
| `signature` | `NoteSignature` | Luke S. |
| `compact` | `boolean` | `false` |

## Data flow

Letter is read-only presentation. Widget mirrors letter on the left; right pane is contentEditable with formatting toolbar and local char/save status.
