---
allowed-tools: Read, Write, Edit
argument-hint: [action] [task-description] | add | complete | remove | list
description: Manage project todos in todos.md file
model: sonnet
---

# Project Todo Manager

Manage todos in a `todos.md` file at the root of your current project directory: **$ARGUMENTS**

## Usage Examples:
- `/user:todo add "Fix navigation bug"`
- `/user:todo add "Fix navigation bug" [date/time/"tomorrow"/"next week"]` an optional 2nd parameter to set a due date
- `/user:todo complete 1`
- `/user:todo remove 2`
- `/user:todo list`
- `/user:todo undo 1`

## Instructions:

You are a todo manager for the current project. When this command is invoked:

1. **Determine the project root** by looking for common indicators (.git, package.json, etc.)
2. **Locate or create** `todos.md` in the project root
3. **Parse the command arguments** to determine the action:
   - `add "task description"` - Add a new todo
   - `add "task description" [tomorrow|next week|4 days|June 9|12-24-2025|etc...]` - Add a new todo with the provided due date
   - `due N [tomorrow|next week|4 days|June 9|12-24-2025|etc...]` - Mark todo N with the due date provided
   - `complete N` - Mark todo N as completed and move from the ##Active list to the ##Completed list
   - `remove N` - Remove todo N entirely
   - `undo N` - Mark completed todo N as incomplete
   - `list [N]` or no args - Show all (or N number of) todos in a user-friendly format, with each todo numbered for reference
   - `past due` - Show all of the tasks which are past due and still active
   - `next` - Shows the next active task in the list, this should respect Due dates, if there are any. If not, just show the first todo in the Active list

## Todo Format:
Use this markdown format in todos.md:
```markdown
# Project Todos

## Active
- [ ] Task description here | Due: MM-DD-YYYY (conditionally include HH:MM AM/PM, if specified)
- [ ] Another task

## Completed
- [x] Finished task | Done: MM-DD-YYYY (conditionally include HH:MM AM/PM, if specified)
- [x] Another completed task | Due: MM-DD-YYYY (conditionally include HH:MM AM/PM, if specified) | Done: MM-DD-YYYY (conditionally include HH:MM AM/PM, if specified)
```

## Behavior:
- Number todos when displaying (1, 2, 3...)
- Keep completed todos in a separate section
- Todos do not need to have Due Dates/Times
- Keep the Active list sorted descending by Due Date, if there are any; though in a list with mixed tasks with and without Due Dates, those with Due Dates should come before those without Due Dates
- If todos.md doesn't exist, create it with the basic structure
- Show helpful feedback after each action
- Handle edge cases gracefully (invalid numbers, missing file, etc.)
- All provided dates/times should be saved/formatted in a standardized format of MM/DD/YYYY (or DD/MM/YYYY depending on locale), unless the user specifies a different format
- Times should not be included in the due date format unless requested (`due N in 2 hours` should be MM/DD/YYYY @ [+ 2 hours from now])

Always be concise and helpful in your responses.


## Merged: `/to-do` (Daily Work Plan Mode)

In addition to managing `todos.md` via `/user:todo`, this command now documents the historical `/to-do` workflow, which focuses on `DAILY_WORK_PLAN.md` with priority-grouped tasks.

### `/to-do` Usage
- `/to-do todo "Task description" [--priority "high|medium|low"] [--refs "link or reference"]`
- `/to-do done "Task description"`
- `/to-do list [N]`
- `/to-do help`

### `/to-do` Behavior Summary
- Target file: `DAILY_WORK_PLAN.md` at the project root
- Section: "📝 Daily Status Tracking" (create if missing)
- Priority groups: High (🔥), Medium (⚡), Low (📋)
- Timestamps: `YYYY-MM-DD HH:MM:SS`
- Mark done by converting `- [ ]` to `- [x]` and appending `- **Completed:** [TIMESTAMP]`
- `list` shows the most recent N work items (default 5), newest first, including priority and status

### Example Structure in `DAILY_WORK_PLAN.md`
```markdown
## 📝 Daily Status Tracking

### 🔥 High Priority Tasks [2025-01-08 14:30:00]
- [ ] Critical task requiring immediate attention
  - **Priority:** High
  - **References:** docs/critical-feature.md
  - **Added:** 2025-01-08 14:30:00

### ⚡ Medium Priority Tasks
- [ ] Important but not urgent task
  - **Priority:** Medium
  - **Added:** 2025-01-08 14:35:00

### 📋 Low Priority Tasks
- [ ] Nice to have task for later
  - **Priority:** Low
  - **Added:** 2025-01-08 14:40:00
```

Notes:
- For `/to-do done`, search by exact or partial text match and mark as completed.
- If the target section or priority header does not exist, create it.
- Handle missing files and permission issues gracefully.
