# Note Command Implementation

## Command: /note

Personal note-taking and task management system for the Ultraterrestrial project.

### Usage Patterns

```bash
# Create notes
/note note "Research insight or observation" [--refs "reference"]

# Create personal todos  
/note todo "Personal task to complete" [--refs "reference"]

# Mark todos complete
/note done "Task description to mark complete"

# List recent entries
/note list [number]    # Default: 5 entries

# Show help
/note help
```

### Implementation Logic

When `/note` command is detected:

1. **Parse Arguments**:
   - Extract subcommand: note, todo, done, list, help
   - Extract content string (quoted)
   - Extract optional --refs parameter

2. **Execute Based on Subcommand**:

#### /note note "content" [--refs "references"]
```
1. Get timestamp: YYYY-MM-DD HH:MM:SS
2. Read/create NOTES.md
3. Append new note section:
   ## Note [TIMESTAMP]
   
   [CONTENT]
   
   **References:** [REFS] (if provided)
   
4. Confirm: "📝 Added note: [preview...]"
```

#### /note todo "content" [--refs "references"]  
```
1. Get timestamp: YYYY-MM-DD HH:MM:SS
2. Read/create NOTES.md
3. Append new todo section:
   ## To-Do [TIMESTAMP]
   
   - [ ] [CONTENT]
     - **References:** [REFS] (if provided)
   
4. Confirm: "✅ Added personal to-do: [CONTENT]"
```

#### /note done "content"
```
1. Read NOTES.md
2. Search for "- [ ] [CONTENT]" (fuzzy match)
3. Replace with "- [x] [CONTENT]"
4. Add completion timestamp
5. Confirm: "✅ Marked as done: [CONTENT]"
```

#### /note list [number]
```
1. Read NOTES.md  
2. Extract last [number] Note/To-Do sections (default: 5)
3. Display chronologically (newest first)
```

#### /note help
```
Display usage information and examples
```

### File Structure

Target: `NOTES.md` in project root

Append entries after existing content, maintaining:
- Timestamp format: YYYY-MM-DD HH:MM:SS
- Markdown headers for sections  
- Standard checkbox format for todos
- Optional references section

### Error Handling

- Create NOTES.md if missing
- Handle file permissions gracefully
- Fuzzy matching for 'done' command
- Clear error messages for malformed commands