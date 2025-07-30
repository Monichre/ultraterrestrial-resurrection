# Live Logging Quick Start Guide

## For Claude Code Agents

### 1. Import the helper module

```javascript
import { appendEntry, computeAck } from "./log.js";
```

### 2. Define your agent name

```javascript
const AGENT_NAME = "AGENT_A"; // or AGENT_B, etc.
```

### 3. Check in before starting work

```javascript
await appendEntry({
  agent: AGENT_NAME,
  type: "checkin",
  ack: computeAck(AGENT_NAME),
  sections: {
    "Summary": "- Brief description of planned work",
    "Next (awaiting approval)": [
      "1) First task",
      "2) Second task"
    ]
  }
});
```

### 4. Wait for USER approval

Look for an entry like:

```
### [agent=USER seq=N ack=M type=approve ts=...]

#### Approval
- Proceed with steps 1-2.
```

### 5. Do work and log it

```javascript
await appendEntry({
  agent: AGENT_NAME,
  type: "work", 
  ack: computeAck(AGENT_NAME),
  sections: {
    "Summary": "- What you accomplished",
    "Did": ["- Specific action 1", "- Specific action 2"],
    "Files changed": ["- file.js (+50 -10)"]
  }
});
```

## For Users

### Using npm scripts

```bash
# Check in as an agent
npm run log:checkin

# Log work done
npm run log:work  

# Approve agent work
npm run log:approve

# Watch the log in real-time
npm run log:tail
```

### Manual approval

Add directly to LOG.md:

```markdown
### [agent=USER seq=N ack=M type=approve ts=2025-07-30T10:00:00-05:00]

#### Approval
- Proceed with all steps.
```

## Key Rules

1. **Never edit existing entries** - append only
2. **Always acknowledge** - set ack to last seq from other party
3. **Wait for approval** - don't proceed without USER approval
4. **Be concise** - one-line summaries, bullet points for details
