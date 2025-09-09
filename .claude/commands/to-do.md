# Custom Command: /to-do

## Command Recognition

When the user types `/to-do`, Claude Code should:

1. **Parse the command arguments**:
   - `todo "content"` - Create a to-do item with checkbox in DAILY_WORK_PLAN.md
   - `done "content"` - Mark existing to-do as completed in DAILY_WORK_PLAN.md
   - `list [number]` - Show recent to-do entries from DAILY_WORK_PLAN.md
   - `help` - Show command usage

2. **Process with these steps**:

### For `/to-do todo "content" [--priority "high|medium|low"] [--refs "references"]`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read DAILY_WORK_PLAN.md in project root
3. Find the "📝 Daily Status Tracking" section or create it if missing
4. Add under appropriate priority section or create new section:

### 🔥 High Priority Tasks [TIMESTAMP]

- [ ] [CONTENT]
  - **Priority:** High
  - **References:** [REFS] (if provided)
  - **Added:** [TIMESTAMP]

5. Confirm with: "✅ Added high-priority to-do: [CONTENT]"
```

### For `/to-do done "content"`

```markdown
Execute:
1. Read DAILY_WORK_PLAN.md
2. Search for "- [ ] [CONTENT]" (exact or partial match)
3. Replace with "- [x] [CONTENT]"
4. Add completion timestamp: "- **Completed:** [TIMESTAMP]"
5. Confirm with: "✅ Marked as done: [CONTENT]"
```

### For `/to-do list [number]`

```markdown
Execute:
1. Read DAILY_WORK_PLAN.md
2. Extract all to-do items from Daily Status Tracking section
3. Show last [number] entries (default: 5)
4. Display in chronological order (newest first)
5. Show priority and status for each item
```

### For `/to-do help`

```markdown
Display:
/to-do Command Usage:

📝 Create work tasks:
  /to-do todo "Task description"
  /to-do todo "Critical task" --priority "high"

🔗 With references:
  /to-do todo "Task" --refs "link or reference"

✅ Mark complete:
  /to-do done "Task description"

📋 View entries:
  /to-do list      # Last 5 work tasks
  /to-do list 10   # Last 10 work tasks

❓ Help:
  /to-do help
```

## Technical Implementation

- **Target File**: `DAILY_WORK_PLAN.md` in project root
- **Section**: "📝 Daily Status Tracking" or create if missing
- **Priority Levels**: High (🔥), Medium (⚡), Low (📋)
- **Timestamp Format**: `YYYY-MM-DD HH:MM:SS`
- **Markdown Compatible**: Uses standard markdown checkboxes and headers
- **Error Handling**: Create section if missing, handle permissions gracefully
- **Search Logic**: For 'done' command, use fuzzy matching on task content

## Priority Section Structure

```markdown
## 📝 Daily Status Tracking

### 🔥 High Priority Tasks

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