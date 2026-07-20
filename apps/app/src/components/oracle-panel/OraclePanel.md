# OraclePanel

**Created:** 2026-07-18  
**Location:** `apps/app/src/components/oracle-panel/`

## Purpose

Self-contained reconstruction of a GenSpark-style **Oracle Recipe** panel: view a multi-step workflow, edit/reorder/remove steps, confirm & run, or duplicate & re-run with a new goal.

## Architecture

```
OraclePanelDemo          Interactive harness (event log + progress ring)
└── OraclePanel          Goal · task list · meta · action bar
    ├── OracleTaskList   View mode | DnD edit mode
    │   ├── OracleTaskItem      Status chip + clamped text + %
    │   └── EditableTaskRow     Drag handle + textarea + remove toggle
    └── CircularProgressBar     SVG companion ring
```

## Data flow

1. Parent supplies `OraclePanelData` (`oracleChain` + `taskStatusMap`).
2. View mode renders statuses from the map; scroll buttons move the list.
3. **Edit** / **Duplicate** seeds `editingList` from `workflow_list`.
4. Confirm / Duplicate emit typed payloads (`ConfirmRunPayload` | `DuplicateRunPayload`); panel exits edit mode.
5. Demo harness updates local state and simulates stream progress.

## Key modules

| File | Role |
|------|------|
| `types.ts` | Task / panel / payload contracts |
| `fixtures.ts` | Roswell-flavored sample recipe |
| `OraclePanel.tsx` | Shell + goal + action chrome |
| `OracleTaskList.tsx` | View vs `@dnd-kit` sortable edit |
| `OraclePanelDemo.tsx` | Stateful component demo |
| `OraclePanel.stories.tsx` | Storybook catalog |

## Storybook

Title: **Components/OraclePanel**

- `Default` — mixed task statuses
- `InteractiveDemo` — full confirm / duplicate loop
- `TaskStatuses` / `ProgressRing` — isolated pieces

```bash
cd apps/app && bun run storybook
# → Components / OraclePanel / Interactive Demo
```

## Constraints

- UI-only demo; no live oracle stream / graph node wiring.
- Light neutral chrome matches source; Microfilm Dark restyle is a follow-up.
- `no_need_replan` follows source semantics: `true` when the recipe list/text changed.
