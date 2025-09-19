# Custom Command: /add-to-research

## Command Recognition

When the user types `/add-to-research`, Claude Code should:

1. **Parse the command arguments**:
   - `add "content"` - Add a research item to RESEARCH_QUEUE.md
   - `priority "content" --level "high|medium|low"` - Add with priority level
   - `category "content" --type "documents|witnesses|events|theory|technology|disclosure"` - Add with category
   - `done "content"` - Mark existing research item as completed
   - `list [number]` - Show recent research queue entries
   - `search "keyword"` - Search research queue for keyword
   - `help` - Show command usage

2. **Process with these steps**:

### For `/add-to-research add "content" [--refs "references"] [--level "priority"] [--type "category"]`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create RESEARCH_QUEUE.md in project root
3. Find the "🔬 Active Research Queue" section or create it if missing
4. Add under appropriate priority section or create new section:

### 🚨 High Priority Research [TIMESTAMP]

- [ ] [CONTENT]
  - **Priority:** High
  - **Category:** [TYPE] (if provided)
  - **References:** [REFS] (if provided)
  - **Added:** [TIMESTAMP]
  - **Status:** Active

5. Confirm with: "🔬 Added to research queue: [CONTENT]"
```

### For `/add-to-research priority "content" --level "high|medium|low"`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create RESEARCH_QUEUE.md
3. Add to appropriate priority section:
   - High: "🚨 High Priority Research"
   - Medium: "⚡ Medium Priority Research" 
   - Low: "📋 Low Priority Research"
4. Include priority level in metadata
5. Confirm with: "🔬 Added [LEVEL]-priority research: [CONTENT]"
```

### For `/add-to-research category "content" --type "documents|witnesses|events|theory|technology|disclosure"`

```markdown
Execute:
1. Get current timestamp in format: YYYY-MM-DD HH:MM:SS
2. Read or create RESEARCH_QUEUE.md
3. Add research item with category metadata
4. Categories:
   - documents: 📄 Document research
   - witnesses: 👥 Witness research  
   - events: 📅 Event research
   - theory: 🧠 Theoretical research
   - technology: 🔬 Technology research
   - disclosure: 🏛️ Disclosure research
5. Confirm with: "🔬 Added [CATEGORY] research: [CONTENT]"
```

### For `/add-to-research done "content"`

```markdown
Execute:
1. Read RESEARCH_QUEUE.md
2. Search for "- [ ] [CONTENT]" (exact or partial match)
3. Replace with "- [x] [CONTENT]"
4. Add completion timestamp: "- **Completed:** [TIMESTAMP]"
5. Move to "✅ Completed Research" section at bottom
6. Confirm with: "✅ Research completed: [CONTENT]"
```

### For `/add-to-research list [number]`

```markdown
Execute:
1. Read RESEARCH_QUEUE.md
2. Extract all research items from Active Research Queue section
3. Show last [number] entries (default: 10)
4. Display in priority order: High → Medium → Low
5. Show priority, category, and status for each item
6. Include count of active vs completed items
```

### For `/add-to-research search "keyword"`

```markdown
Execute:
1. Read RESEARCH_QUEUE.md
2. Search through all research items for keyword matches
3. Return matching items with context
4. Show both active and completed matches
5. Highlight keyword in results
```

### For `/add-to-research help`

```markdown
Display:
/add-to-research Command Usage:

🔬 Add research items:
  /add-to-research add "Research topic or question"
  /add-to-research add "Wilson memo analysis" --refs "packages/knowledge-base/sources/files/wilson-memo.pdf"

📊 With priority:
  /add-to-research priority "Urgent Pentagon disclosure review" --level "high"
  /add-to-research priority "Background research on Vallée" --level "low"

🏷️ With category:
  /add-to-research category "Analyze Fravor testimony" --type "witnesses"
  /add-to-research category "Research antigravity patents" --type "technology"

✅ Mark complete:
  /add-to-research done "Wilson memo analysis"

📋 View and search:
  /add-to-research list      # Show 10 active research items
  /add-to-research list 20   # Show 20 active research items  
  /add-to-research search "Wilson"  # Search for specific topic

❓ Help:
  /add-to-research help
```

## Technical Implementation

- **Target File**: `RESEARCH_QUEUE.md` in project root
- **Priority Levels**: High (🚨), Medium (⚡), Low (📋)
- **Categories**: Documents (📄), Witnesses (👥), Events (📅), Theory (🧠), Technology (🔬), Disclosure (🏛️)
- **Timestamp Format**: `YYYY-MM-DD HH:MM:SS`
- **Markdown Compatible**: Uses standard markdown checkboxes and headers
- **Error Handling**: Create file if missing, handle permissions gracefully
- **Search Logic**: For 'done' and 'search' commands, use fuzzy matching
- **Organization**: Priority sections with metadata for each item

## Priority Section Structure

```markdown
# 🔬 UFO/UAP Research Queue

Active research items organized by priority and category for systematic investigation.

---

## 🔬 Active Research Queue

### 🚨 High Priority Research

- [ ] Analyze authenticity of Wilson-Davis memo
  - **Priority:** High
  - **Category:** Documents
  - **References:** packages/knowledge-base/sources/files/wilson-davis-memo.pdf
  - **Added:** 2025-01-09 14:30:00
  - **Status:** Active

- [ ] Review recent Pentagon UAP disclosure timeline
  - **Priority:** High  
  - **Category:** Disclosure
  - **References:** docs/timeline/pentagon-disclosures-2020-2025.md
  - **Added:** 2025-01-09 14:35:00
  - **Status:** Active

### ⚡ Medium Priority Research

- [ ] Deep dive into Jacques Vallée control system hypothesis
  - **Priority:** Medium
  - **Category:** Theory
  - **References:** research/vallee-control-system-theory.md
  - **Added:** 2025-01-09 14:40:00
  - **Status:** Active

### 📋 Low Priority Research

- [ ] Background research on John Keel's ultraterrestrial hypothesis
  - **Priority:** Low
  - **Category:** Theory
  - **References:** research/keel-ultraterrestrial-theory.md
  - **Added:** 2025-01-09 14:45:00
  - **Status:** Active

## ✅ Completed Research

### Recently Completed

- [x] Timeline analysis of 2004 Nimitz encounters
  - **Priority:** High
  - **Category:** Events
  - **References:** analysis/nimitz-2004-timeline.md
  - **Added:** 2025-01-08 10:00:00
  - **Completed:** 2025-01-09 16:20:00
  - **Status:** Complete

---

**Queue Statistics:**
- Active Items: 4
- Completed Items: 1
- High Priority: 2
- Medium Priority: 1  
- Low Priority: 1
```

## Usage Examples

```bash
# Add basic research item
/add-to-research add "Investigate Betty and Barney Hill case details"

# Add high-priority research with references
/add-to-research priority "Review Grusch congressional testimony transcripts" --level "high" --refs "transcripts/grusch-2023-congress.pdf"

# Add categorized research
/add-to-research category "Analysis of Ariel School Zimbabwe incident" --type "events"

# Mark research as complete
/add-to-research done "Betty and Barney Hill case details"

# View active research queue
/add-to-research list 15

# Search for specific topics
/add-to-research search "Grusch"
```

## Integration Notes

- **Complements existing workflows**: Works alongside `/note` for quick notes and `/to-do` for work tasks
- **Research-focused**: Specifically designed for UFO/UAP investigation topics
- **Knowledge base integration**: References can point to `packages/knowledge-base/sources/` files
- **Disclosure RAG integration**: Research items can inform RAG system queries and analysis
- **Project-specific**: Tailored for systematic paranormal/anomalous research methodology