# Setting Up Multi-Agent Coordination

## Quick Setup for Agent Teams

### 1. Assign Agent Roles

When you have multiple Claude Code instances open, assign each one a role:

**Window 1 - Lead Agent:**

```
You are AGENT_LEAD. Your role is to break down tasks and coordinate other agents.
Use the agent-base.js module to communicate. Start by checking LOG.md.
```

**Window 2 - Frontend Agent:**

```
You are AGENT_FRONTEND. You handle all UI/React components.
Check LOG.md for tasks assigned to you by AGENT_LEAD.
Use agent-base.js to acknowledge tasks and communicate.
```

**Window 3 - Backend Agent:**

```
You are AGENT_BACKEND. You handle APIs and server logic.
Check LOG.md for your tasks and coordinate with AGENT_FRONTEND.
```

### 2. Start a Multi-Agent Task

Tell AGENT_LEAD:

```
Break down this task for the team: "Add user profile page with edit functionality"

Assign specific parts to:
- AGENT_FRONTEND: UI components
- AGENT_BACKEND: API endpoints
- AGENT_TEST: Test coverage

Use the agent coordination system in LOG.md.
```

### 3. Agents Work in Parallel

Each agent will:

1. See their assigned tasks in LOG.md
2. Acknowledge with `syncState()`
3. Ask questions to other agents if needed
4. Complete work and hand off

### 4. Monitor Progress

```bash
# Watch live coordination
npm run log:tail

# Check status
npm run log:status

# See summary
node -e "import('./multi-agent-coordinator.js').then(({MultiAgentCoordinator}) => {
  new MultiAgentCoordinator().getCoordinationSummary().then(s => {
    console.log('Pending:', s.pendingApprovals);
    console.log('Questions:', s.questions);
  });
})"
```

## Real Example Script

Save this as `start-team-task.js`:

```javascript
import { AgentBase } from './agent-base.js';

async function startTeamTask(taskDescription) {
  const lead = new AgentBase("AGENT_LEAD", "coordinator");
  
  // Break down the task
  await lead.checkIn(
    `Planning: ${taskDescription}`,
    [
      "AGENT_FRONTEND: Design and implement UI components",
      "AGENT_BACKEND: Create API endpoints and data models",
      "AGENT_TEST: Write comprehensive test suite",
      "AGENT_DOCS: Update documentation"
    ]
  );
  
  console.log(`
Team task started! Tell each agent:

AGENT_FRONTEND: Check LOG.md for your UI tasks
AGENT_BACKEND: Check LOG.md for your API tasks  
AGENT_TEST: Check LOG.md for testing requirements
AGENT_DOCS: Check LOG.md for documentation needs

They should acknowledge with syncState() and begin work.
  `);
}

// Usage: node start-team-task.js "Add shopping cart feature"
const task = process.argv[2] || "Implement new feature";
startTeamTask(task);
```

## Benefits of Multi-Agent Teams

### 1. **True Parallel Development**

- Frontend works on UI while backend builds APIs
- No waiting for sequential completion

### 2. **Specialized Expertise**

- Each agent can be prompted with role-specific knowledge
- Better quality through specialization

### 3. **Natural Handoffs**

```
FRONTEND: "UI complete, ready for backend integration"
BACKEND: "API ready, here are the endpoints"
```

### 4. **Async Problem Solving**

```
FRONTEND: "How should we handle loading states?"
BACKEND: "Use optimistic updates, here's how..."
```

### 5. **Automatic Documentation**

- LOG.md becomes a complete history
- Perfect for understanding decisions

## Advanced Patterns

### Pattern 1: Dependency Chains

```javascript
await agent.checkIn("Building feature", 
  ["Step 1: Create models"],
  ["Waiting for: Database schema approval"]
);
```

### Pattern 2: Broadcast Questions

```javascript
await agent.askQuestion(
  "Best approach for real-time sync?",
  ["WebSockets vs SSE?", "Scaling considerations?"],
  null // asks ALL agents
);
```

### Pattern 3: Task Delegation

```javascript
// LEAD can reassign tasks
await lead.syncState("Reassigning tasks", {
  "Changes": [
    "- AGENT_TEST: Also handle performance testing",
    "- AGENT_FRONTEND: Focus only on mobile UI"
  ]
});
```

## Tips for Success

1. **Clear Task Boundaries** - Be specific about what each agent should do
2. **Regular Sync** - Agents should update status frequently  
3. **Ask Questions Early** - Don't let agents get stuck
4. **Use Handoffs** - Make it clear when work is ready for next agent
5. **Review Together** - Check LOG.md to see the full picture

## Try It Now

1. Open 3 Claude Code windows
2. Assign each one an agent name
3. Run: `node example-multi-agent-task.js`
4. Watch them coordinate in LOG.md

The future is multi-agent development! 🚀
