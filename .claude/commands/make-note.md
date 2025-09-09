# Custom Command: /make-note

## Command Recognition

When the user types `/make-note`, Claude Code should:

1. **Parse the command arguments**:
   - `note "content"` - Create a note entry in NOTES.md
   - `todo "content"` - Create a to-do item with checkbox in NOTES.md
   - `done "content"` - Mark existing to-do as completed in NOTES.md
   - `list [number]` - Show recent entries from NOTES.md
   - `help` - Show command usage

2. **Process with these steps**:

### For `/make-note note "content" [--refs "references"]`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create NOTES.md in project root
3. Append this structure:

## Note [TIMESTAMP]

[CONTENT]

**References:** [REFS] (if provided)

4. Confirm with: "📝 Added note: [CONTENT preview...]"
```

### For `/make-note todo "content" [--refs "references"]`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create NOTES.md in project root
3. Append this structure:

## To-Do [TIMESTAMP]

- [ ] [CONTENT]
  - **References:** [REFS] (if provided)

4. Confirm with: "✅ Added personal to-do: [CONTENT]"
```

### For `/make-note done "content"`

```markdown
Execute:
1. Read NOTES.md
2. Search for "- [ ] [CONTENT]" (exact or partial match)
3. Replace with "- [x] [CONTENT]"
4. Confirm with: "✅ Marked as done: [CONTENT]"
```

### For `/make-note list [number]`

```markdown
Execute:
1. Read NOTES.md
2. Show last [number] entries (default: 5)
3. Display in chronological order (newest first)
```

### For `/make-note help`

```markdown
Display:
/make-note Command Usage:

📝 Create personal entries:
  /make-note note "Note content"
  /make-note todo "Personal task"

🔗 With references:
  /make-note note "Note" --refs "link or reference"
  /make-note todo "Task" --refs "documentation link"

✅ Mark complete:
  /make-note done "Task description"

📋 View entries:
  /make-note list      # Last 5 personal entries
  /make-note list 10   # Last 10 personal entries

❓ Help:
  /make-note help
```

## Technical Implementation

- **Target File**: `NOTES.md` in project root
- **Timestamp Format**: `YYYY-MM-DD HH:MM:SS`
- **Markdown Compatible**: Uses standard markdown checkboxes and headers
- **Error Handling**: Create file if missing, handle permissions gracefully
- **Search Logic**: For 'done' command, use fuzzy matching on task content
- **Content Types**: Notes (research, ideas, links) and personal to-dos

## Usage Examples

```bash
# Create a research note
/make-note note "Jacques Vallée methodology analysis" --refs "research/ufo-researchers-methodologies.md"

# Create a personal to-do
/make-note todo "Review the Prometheus AI integration"

# Mark a task as complete
/make-note done "Test the new to-do command functionality"

# List recent entries
/make-note list 3
```

## File Structure Example

```markdown
# NOTES.md

Personal notes and to-do items for the Ultraterrestrial project.

---

## Note [2025-01-08 14:30:00]

Research findings on advanced propulsion technologies.

**References:** packages/knowledge-base/sources/files/advanced-tech.md

## To-Do [2025-01-08 14:35:00]

- [ ] Analyze Brown intelligence disclosure claims
  - **References:** intelligence-analysis/brown-disclosure.md

## To-Do [2025-01-08 14:40:00]

- [x] Complete entity extraction analysis
  - **Completed:** 2025-01-08 16:20:00
```