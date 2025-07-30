# How to Make Claude Code Agents Use the Live Logging System

## Quick Start

### 1. **For Immediate Use - Add to Your Prompt**

When giving instructions to a Claude Code agent, include this:

```
IMPORTANT: You must use the live logging system for coordination. 

Before starting any work:
1. Run: node claude-agent-protocol.js
2. Import: import { appendEntry, computeAck } from "./log.js"
3. Check in with your planned work
4. Wait for approval in LOG.md
5. Only then proceed with implementation

After completing work, log what you did.
```

### 2. **Agent Names**

Assign each Claude instance a unique agent name:

- SOCRATES - Primary development
- ARISTOTLE - Code review/refactoring  
- AGENT_C - Testing
- AGENT_D - Documentation

### 3. **Enforcement Methods**

#### Option A: System Prompt (Most Effective)

Add to Claude's system prompt or `.cursorrules`:

```
You are SOCRATES. You MUST use the live logging system located in apps/app/log.js.

Before ANY code changes:
1. Check in using appendEntry() with type="checkin"
2. Wait for USER approval (type="approve" with ack >= your seq)
3. Only then make changes

After changes:
- Log work using appendEntry() with type="work"

This is MANDATORY. Do not skip this protocol.
```

#### Option B: Pre-Task Instructions

Before each task, remind the agent:

```
Remember to:
1. Check LOG.md for other agents' work
2. Create a checkin entry before starting
3. Wait for my approval
4. Log your work when done

Use the helper: npm run log:checkin
```

#### Option C: Automated Wrapper

Create a task wrapper that enforces the protocol:

```javascript
// In your instructions to Claude:
"For this task, use the startWork() and completeWork() 
functions from claude-agent-protocol.js"
```

### 4. **Monitoring**

As the USER, you can:

```bash
# Watch the log in real-time
npm run log:tail

# Check current status
npm run log:status

# Approve work
npm run log:approve

# See last 20 entries
npm run agent:status
```

### 5. **Example Workflow**

```
USER: "Add a new dashboard component"

SOCRATES: [Checks in]
### [agent=SOCRATES seq=1 ack=0 type=checkin ts=...]
#### Summary
- Plan to create dashboard component
#### Next (awaiting approval)
1) Create Dashboard.tsx
2) Add styling
3) Write tests

USER: [Approves]
### [agent=USER seq=2 ack=1 type=approve ts=...]
#### Approval
- Proceed with all steps

SOCRATES: [Does work, then logs]
### [agent=SOCRATES seq=3 ack=2 type=work ts=...]
#### Summary  
- Created dashboard component with tests
#### Did
- Created src/components/Dashboard.tsx
- Added Dashboard.module.css
- Wrote Dashboard.test.tsx
#### Files changed
- src/components/Dashboard.tsx (+245 -0)
- src/components/Dashboard.module.css (+87 -0)
- src/components/Dashboard.test.tsx (+156 -0)
```

## Best Practices

### 1. **Clear Task Boundaries**

Always define clear start/end points for tasks so agents know when to check in and log work.

### 2. **Regular Approvals**

Check LOG.md frequently to approve pending work. Agents will wait indefinitely without approval.

### 3. **Descriptive Summaries**

Encourage agents to write clear, one-line summaries that explain the work at a glance.

### 4. **File Change Tracking**

Ensure agents include accurate file change counts in the format:

```
- path/to/file.ext (+lines_added -lines_removed)
```

### 5. **Coordination Between Agents**

If using multiple agents:

- Each must have a unique name
- They should check each other's work via LOG.md
- Use ack to acknowledge seeing others' entries

## Troubleshooting

### Agent Not Using the System?

1. **Be explicit** - Add logging requirements to every request
2. **Show examples** - Point to this file or agent-example.js
3. **Enforce breaks** - Ask "Have you checked in?" before they start
4. **Review together** - Ask to see their log entries

### No Entries Appearing?

Check:

- Is the agent in the correct directory? (`apps/app`)
- Does `.log.seq` exist and contain a number?
- Are there any permission issues with file writing?

### Agent Proceeded Without Approval?

- Remind them of the protocol
- Ask them to add a retrospective log entry
- Emphasize waiting for approval next time

## Integration with Your Workflow

### For Feature Development

```
1. YOU: Define feature requirements
2. AGENT: Checks in with implementation plan
3. YOU: Review plan and approve
4. AGENT: Implements and logs work
5. YOU: Review implementation
6. Repeat for iterations
```

### For Bug Fixes

```
1. YOU: Report bug
2. AGENT: Checks in with fix approach
3. YOU: Approve approach
4. AGENT: Fixes and logs changes
```

### For Code Reviews

```
1. SOCRATES: Logs completed work
2. ARISTOTLE: Checks in to review code
3. YOU: Approve review
4. ARISTOTLE: Reviews and logs findings
```

## Making It Stick

The key to adoption is **consistency**:

1. **Always ask** - "Did you check in before starting?"
2. **Always check** - Look at LOG.md regularly
3. **Always approve** - Don't leave agents waiting
4. **Always enforce** - Don't let them skip the protocol

Over time, this becomes second nature and provides excellent coordination and history of all work done on your project.
