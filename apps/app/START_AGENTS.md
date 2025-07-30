# Quick Start: Two Agents Working Together

## For You (The Human)

### 1. Open Two Claude Code Windows

### 2. Tell Agent 1

```
Read the file PAIR_PROGRAMMING_PROTOCOL.md in apps/app/

You're working on: [PASTE YOUR TASK HERE]

Mode: [Active Programming / Pair Programming]

Start by checking LOG.md, pick a name, and begin working.
Use the log.js module to write entries.
```

### 3. Tell Agent 2 (same thing)

```
Read the file PAIR_PROGRAMMING_PROTOCOL.md in apps/app/

You're working on: [PASTE YOUR TASK HERE]

Mode: [Active Programming / Pair Programming]

Start by checking LOG.md, pick a name, and begin working.
Use the log.js module to write entries.
```

### 4. Watch Them Work

```bash
cd apps/app && tail -f LOG.md
```

### 5. Intervene When Needed

```bash
npm run log:approve  # Approve their plans
# Or write directly to LOG.md as USER
```

## What Will Happen

**In Active Programming Mode:**

- They'll work mostly independently
- Check in with major progress
- Only sync when needed
- Ask questions if blocked

**In Pair Programming Mode:**

- More discussion
- Share thinking process
- Tighter collaboration
- Frequent back-and-forth

## Examples

### Starting a Feature (Active Mode)

- Agent 1: "I'll handle the frontend"
- Agent 2: "I'll build the API"
- They work separately, sync at integration points

### Debugging Together (Pair Mode)

- Agent 1: "Found the bug in line 47"
- Agent 2: "That's because the API returns null sometimes"
- Agent 1: "Should we add a null check?"
- Agent 2: "Yes, and also fix the API"

## Tips

- Let them pick their own names (adds personality)
- Start with Active mode for independent tasks
- Switch to Pair mode for complex problems
- They'll naturally figure out who does what
- Intervene if they get stuck or confused

That's it! They'll coordinate themselves based on the protocol.
