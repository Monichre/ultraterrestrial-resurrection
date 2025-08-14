# Custom Command: /to-do

## Command Recognition

When the user types `/to-do`, Claude Code should:

1. **Parse the command arguments**:
   - `todo "content"` - Create a to-do item with checkbox
   - `note "content"` - Create a note entry  
   - `done "content"` - Mark existing to-do as completed
   - `list [number]` - Show recent entries
   - `help` - Show command usage

2. **Process with these steps**:

### For `/to-do todo "content" [--refs "references"]`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create NOTES.md in project root
3. Append this structure:

## To-Do [TIMESTAMP]

- [ ] [CONTENT]
  - **References:** [REFS] (if provided)

4. Confirm with: "✅ Added to-do: [CONTENT]"
```

### For `/to-do note "content" [--refs "references"]`

```markdown
Execute:
1. Get current timestamp
2. Read or create NOTES.md
3. Append this structure:

## Note [TIMESTAMP]

[CONTENT]

**References:** [REFS] (if provided)

4. Confirm with: "📝 Added note: [CONTENT preview...]"
```

### For `/to-do done "content"`

```markdown
Execute:
1. Read NOTES.md
2. Search for "- [ ] [CONTENT]" (exact or partial match)
3. Replace with "- [x] [CONTENT]"
4. Confirm with: "✅ Marked as done: [CONTENT]"
```

### For `/to-do list [number]`

```markdown
Execute:
1. Read NOTES.md
2. Show last [number] entries (default: 5)
3. Display in chronological order (newest first)
```

### For `/to-do help`

```markdown
Display:
/to-do Command Usage:

📝 Create entries:
  /to-do todo "Task description"
  /to-do note "Note content"

🔗 With references:
  /to-do todo "Task" --refs "link or reference"
  /to-do note "Note" --refs "documentation link"

✅ Mark complete:
  /to-do done "Task description"

📋 View entries:
  /to-do list      # Last 5 entries
  /to-do list 10   # Last 10 entries

❓ Help:
  /to-do help
```

## Technical Implementation

- **Target File**: `NOTES.md` in project root
- **Timestamp Format**: `YYYY-MM-DD HH:MM:SS`
- **Markdown Compatible**: Uses standard markdown checkboxes and headers
- **Error Handling**: Create file if missing, handle permissions gracefully
- **Search Logic**: For 'done' command, use fuzzy matching on task content