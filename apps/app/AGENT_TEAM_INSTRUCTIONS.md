# Agent Team Instructions

## You Are Part of a Team

You are working with other AI agents on the same codebase. Here's how to coordinate:

## Your Team Members

- **AGENT_LEAD**: Coordinates tasks and makes architectural decisions
- **AGENT_FRONTEND**: Handles UI/UX implementation
- **AGENT_BACKEND**: Handles API and server-side logic
- **AGENT_TEST**: Writes tests and ensures quality
- **AGENT_DOCS**: Updates documentation
- **AGENT_REVIEW**: Reviews code and suggests improvements

## How to Work Together

### 1. When You Start

```javascript
// Check what tasks are assigned to you
import { MultiAgentCoordinator } from './multi-agent-coordinator.js';
const coordinator = new MultiAgentCoordinator();
const myTasks = await coordinator.findTasksForAgent("YOUR_AGENT_NAME");
```

### 2. See What Others Are Doing

Always read LOG.md first to see:

- What other agents have completed
- What they're currently working on  
- Any questions directed at you
- Any handoffs for you

### 3. Communicate Your Work

```javascript
import { AgentBase } from './agent-base.js';
const agent = new AgentBase("YOUR_AGENT_NAME", "your role");

// Starting work
await agent.checkIn("Working on user auth", [
  "Create login form",
  "Add validation"
]);

// Ask questions
await agent.askQuestion(
  "Need help with API endpoint",
  ["What format for auth tokens?"],
  "AGENT_BACKEND"
);

// Hand off work
await agent.handoff("Login form ready", [
  "AGENT_BACKEND: Ready for API integration",
  "AGENT_TEST: Ready for testing"
]);
```

### 4. Respond to Others

If you see questions for you:

```javascript
await agent.syncState("Responding to API question", {
  "Response": ["Use JWT tokens with 1h expiry"]
});
```

### 5. Approve Other Agents' Work

You can approve other agents:

```javascript
await agent.approveOthers([
  "AGENT_FRONTEND: Good plan, proceed",
  "AGENT_TEST: Approved for test writing"
]);
```

## Quick Commands

```bash
# See your tasks
node -e "import('./multi-agent-coordinator.js').then(({MultiAgentCoordinator}) => {
  const c = new MultiAgentCoordinator();
  c.findTasksForAgent('YOUR_NAME').then(console.log);
})"

# Check status
npm run log:status

# See recent activity  
tail -50 LOG.md
```

## Important Rules

1. **Always acknowledge tasks** assigned to you
2. **Communicate blockers** immediately
3. **Hand off work** clearly when done
4. **Ask questions** when unsure
5. **Read the log** before starting work

## Example Workflow

1. LEAD assigns you a task
2. You acknowledge with `syncState`
3. You start work after approval
4. You ask questions if needed
5. You complete and hand off
6. Next agent picks up your work

Remember: The log is your shared brain. Use it!
