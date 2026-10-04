---
description: Capture personal notes or todos with optional references
argument-hint: note|todo "<text>" [--refs "<references>"]
---

# Note Command

Capture quick notes or personal todos: **$ARGUMENTS**

## Actions
- `note "text" [--refs "..."]` add a note
- `todo "text" [--refs "..."]` add a personal todo

## Steps
1. Parse $ARGUMENTS to determine action (`note` or `todo`) and optional references.
2. Locate or create `NOTES.md` at the repo root.
3. Append entry with timestamp:
   - Note: `- [note] <text> | refs: <refs?> | <date>`
   - Todo: `- [ ] <text> | refs: <refs?> | <date>`
4. Return confirmation and, for todos, remind to track completion elsewhere if needed.

## Output
- Acknowledgment of the captured entry
- Pointer to `NOTES.md` for review
