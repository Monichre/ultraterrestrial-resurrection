---
description: Manage research queue entries (add, prioritize, categorize, mark done, list, search)
argument-hint: [action] [content] | add | priority | category | done | list | search | help
---

# Add to Research Queue

Update the research queue with: **$ARGUMENTS**

## Actions
- `add "content"` add a research item to `RESEARCH_QUEUE.md`
- `priority "content" --level high|medium|low` add with priority
- `category "content" --type documents|witnesses|events|theory|technology|disclosure` add with category
- `done "content"` mark an item completed
- `list [n]` show recent entries
- `search "keyword"` search queue
- `help` show usage

## Steps
1. Locate or create `RESEARCH_QUEUE.md` at repo root.
2. Parse $ARGUMENTS to determine action and options.
3. Apply the update:
   - Append new items with timestamp, priority, and category when provided.
   - For `done`, mark the matching item as completed.
   - For `list`, show the latest entries (default 10).
   - For `search`, surface matching items with context.
4. Return a concise confirmation summary.

## Output Format (append)
- `- [ ] <content> | priority: <level> | category: <type> | added: <date>`
- When done: `- [x] <content> | completed: <date>`
