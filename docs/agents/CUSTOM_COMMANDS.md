# CUSTOM_COMMANDS.md - Project-Specific Commands

Custom commands for the Ultraterrestrial Resurrection project.

## Personal Productivity Commands

### `/to-do` Command

**Command Definition**:
```yaml
---
command: "/to-do"
category: "Personal Productivity & Note-taking"
purpose: "Quick note and task management with timestamps"
wave-enabled: false
performance-profile: "optimization"
---
```

**Functionality**:
- **Auto-Persona**: Scribe
- **MCP Integration**: None (lightweight operation)
- **Tool Orchestration**: [Read, Edit, Write]
- **Target File**: `NOTES.md` in project root

**Usage Patterns**:

#### Create To-Do Item
```
/to-do todo "Fix the database connection issue"
/to-do todo "Review PR #123" --refs "https://github.com/..."
```
**Output Format**:
```markdown
## To-Do [2025-08-13 20:15:21]

- [ ] Fix the database connection issue

## To-Do [2025-08-13 20:16:45]

- [ ] Review PR #123
  - **References:** https://github.com/...
```

#### Create Note Entry
```
/to-do note "Meeting notes from today's standup - discussed RAG implementation"
/to-do note "Architecture decision: using triple RAG system" --refs "docs/PLANS/FEATURES.md"
```
**Output Format**:
```markdown
## Note [2025-08-13 20:17:30]

Meeting notes from today's standup - discussed RAG implementation

## Note [2025-08-13 20:18:12]

Architecture decision: using triple RAG system

**References:** docs/PLANS/FEATURES.md
```

#### Mark To-Do as Done
```
/to-do done "Fix the database connection issue"
```
**Behavior**: Finds the matching to-do item and changes `- [ ]` to `- [x]`

#### List Recent Entries
```
/to-do list
/to-do list 10  # Show last 10 entries
```
**Behavior**: Displays recent entries from NOTES.md

#### Show Command Help
```
/to-do help
```

**Implementation Strategy**:
1. **File Management**: Always append to `NOTES.md` in project root
2. **Timestamp Format**: `YYYY-MM-DD HH:MM:SS` in section headers
3. **Entry Structure**: Markdown-compatible with consistent formatting
4. **Reference Handling**: Optional `--refs` parameter for additional context
5. **Search & Replace**: For `done` functionality, search for exact match and update checkbox

**Command Processing Logic**:
```
1. Parse command arguments (todo|note|done|list|help)
2. Extract content and optional --refs parameter
3. Generate timestamp
4. Read existing NOTES.md (create if doesn't exist)
5. Append formatted entry or modify existing (for 'done')
6. Confirm action with user
```

**Error Handling**:
- Invalid command format → Show help
- Missing content → Prompt for content
- File permissions → Report error
- Duplicate 'done' marking → Inform user

**Integration with SuperClaude Framework**:
- Lightweight operation (no wave mode needed)
- Auto-activates Scribe persona for formatting
- Uses project-local NOTES.md file
- Maintains consistency with markdown standards