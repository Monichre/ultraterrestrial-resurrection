# CommandK

**Updated:** 2026-07-23 16:40:00 CDT  
**Path:** `apps/app/src/components/command-palette/command-k.tsx`

## Purpose

Decorative ⌘K command-menu showcase with floating keycaps, frosted panel, and animated search filtering. Not the production palette (`CommandPalette` + cmdk + Zustand store).

## Architecture

| Module | Role |
| --- | --- |
| `CommandK` | Search state + panel layout |
| `CommandItem` | Filtered row (height/opacity transition) |
| `KeyboardKey` | Decorative keycap chrome |

## Data flow

```
commands[category][] → map → filter by searchQuery → CommandItem(isActive)
```

## Exports

- `CommandK`
- `CommandKProps`

## Storybook

`Components/CommandK` — Default, Empty

## Notes

Keep this visual demo separate from `CommandPalette.tsx` so product wiring stays on the store-backed path.
