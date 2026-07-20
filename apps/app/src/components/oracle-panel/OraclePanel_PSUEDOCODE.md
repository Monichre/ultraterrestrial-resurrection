# OraclePanel — Pseudocode

Reconstructed from minified GenSpark-style Oracle Recipe panel.

## Types

```
TaskStatus = 'done' | 'in_progress' | 'pending'
EditorStatus = null | 'normal' | 'duplicate'

OracleTask:
  id, order, task, executed, response[], percentage?

OraclePanelData:
  oracleChain: { id, requirement, workflow_list: OracleTask[] }
  taskStatusMap: Record<taskId, TaskStatus>
```

## State (OraclePanel)

```
editingList: OracleTask[]          // working copy while editing
checkedTaskIds: string[]           // tasks marked for removal
goalDraft: string                  // editable goal in duplicate mode
editorStatus: EditorStatus         // view | edit | duplicate
progressScale: 0..1                // fill behind action bar
isGenerating: boolean
```

## Flows

### Confirm & Run (editorStatus === 'normal')

1. Build nextList = (existing non-pending tasks) + (editingList minus checked)
2. Re-number order 1..n
3. If nextList empty → toast error "Please keep at least 1 task"
4. Detect no_need_replan if list length/tasks unchanged vs original
5. Emit onConfirmRun({ workflow_list, no_need_replan, requirement })
6. Clear edit state, exit editor

### Duplicate & Re-run (editorStatus === 'duplicate')

1. Filter editingList minus checked
2. If empty → error; if goalDraft empty → error
3. Reset executed/response/percentage on tasks
4. Emit onDuplicateRun({ requirement: goalDraft, workflow_list })
5. Clear edit state

### Insert step

1. order = max(editingList.order) + 1
2. Push { id: uuid, order, task: '', executed: false, response: [] }

### Task list modes

- View: map workflow_list → OracleTaskItem(status from map); click expands text
- Edit: dnd-kit SortableContext; drag reorder; textarea edit; toggle-check to remove

## UI Layout

```
[Goal label + requirement / input]
[OracleTaskList h-48 scroll]
[meta: recipeLabel · Share]
[action bar + progress fill]
  view: [↑ ↓ Scroll] [⎘ Re-run]
  edit: [+] [Cancel] [Confirm & Run | Duplicate & Re-run | Generating...]
```

## Subcomponents

- CircularProgressBar — SVG ring from value/min/max
- OracleTaskItem — status chip + clamped task + % badge
- OracleTaskList — view vs sortable edit list
- EditableTaskRow — drag handle + textarea + remove toggle
