# Multi-Agent Coordination Protocol

## Overview

This protocol enables multiple Claude Code agents to work together on the same project without human intervention for every step. Agents can see each other's work, coordinate tasks, and collaborate asynchronously.

## Agent Roles & Responsibilities

### Primary Roles

- **AGENT_LEAD**: Task breakdown and coordination
- **AGENT_DEV_1**: Implementation (first developer)
- **AGENT_DEV_2**: Implementation (second developer)
- **AGENT_REVIEW**: Code review and quality checks
- **AGENT_TEST**: Testing and validation
- **AGENT_DOCS**: Documentation updates

### Communication Types

- `checkin` - Announce intended work
- `work` - Log completed work
- `question` - Ask other agents for input
- `approve` - Approve another agent's plan (agents can approve each other)
- `handoff` - Pass work to another agent
- `sync` - Share current state/findings

## Inter-Agent Workflow

### 1. Task Distribution

```markdown
### [agent=AGENT_LEAD seq=1 ack=0 type=checkin ts=...]

#### Summary
- Breaking down user story: "Add dashboard with real-time updates"

#### Next (awaiting approval)
1) AGENT_DEV_1: Create dashboard component structure
2) AGENT_DEV_2: Implement WebSocket connection
3) AGENT_TEST: Write component tests
4) AGENT_DOCS: Update component documentation

#### Questions for USER
- Any specific real-time libraries preferred?
```

### 2. Agent Acknowledgment

Other agents acknowledge and claim their tasks:

```markdown
### [agent=AGENT_DEV_1 seq=2 ack=1 type=sync ts=...]

#### Summary
- Acknowledged: Will create dashboard component structure

#### Next (awaiting approval)
1) Create src/components/Dashboard/index.tsx
2) Create Dashboard.module.css
3) Define props interface
```

```markdown
### [agent=AGENT_DEV_2 seq=3 ack=2 type=sync ts=...]

#### Summary
- Acknowledged: Will implement WebSocket after DEV_1 creates base component

#### Dependencies
- Waiting for AGENT_DEV_1 to complete dashboard structure
```

### 3. Agents Approve Each Other

```markdown
### [agent=AGENT_LEAD seq=4 ack=3 type=approve ts=...]

#### Approval
- AGENT_DEV_1: Proceed with component creation
- AGENT_DEV_2: Good plan to wait for base component
```

### 4. Parallel Work & Coordination

```markdown
### [agent=AGENT_DEV_1 seq=5 ack=4 type=work ts=...]

#### Summary
- Created base dashboard component with props interface

#### Did
- Created Dashboard component with TypeScript interfaces
- Added responsive grid layout
- Implemented loading states

#### Files changed
- src/components/Dashboard/index.tsx (+150 -0)
- src/components/Dashboard/Dashboard.module.css (+75 -0)
- src/components/Dashboard/types.ts (+25 -0)

#### Handoff
- AGENT_DEV_2: Component ready for WebSocket integration
- AGENT_TEST: Ready for unit tests
```

### 5. Dependent Agent Picks Up

```markdown
### [agent=AGENT_DEV_2 seq=6 ack=5 type=checkin ts=...]

#### Summary
- Starting WebSocket integration with Dashboard component

#### Next (awaiting approval)
1) Add WebSocket hook
2) Connect to dashboard data props
3) Implement reconnection logic
```

## Advanced Coordination Patterns

### Pattern 1: Question & Answer

```markdown
### [agent=AGENT_DEV_2 seq=10 ack=9 type=question ts=...]

#### Summary
- Need input on error handling strategy

#### Questions for AGENT_DEV_1
- How should Dashboard handle connection failures?
- Should we show inline errors or toast notifications?
```

```markdown
### [agent=AGENT_DEV_1 seq=11 ack=10 type=sync ts=...]

#### Summary
- Responding to error handling question

#### Response
- Use toast notifications for connection errors
- Dashboard should show stale data indicator
- See ErrorBoundary pattern in src/components/shared/
```

### Pattern 2: Blocker Notification

```markdown
### [agent=AGENT_TEST seq=15 ack=14 type=sync ts=...]

#### Summary
- Blocked: Cannot test WebSocket without mock server

#### Blocked by
- Need AGENT_DEV_2 to implement mock WebSocket server

#### Working on instead
- Writing tests for static dashboard rendering
```

### Pattern 3: Cross-Review

```markdown
### [agent=AGENT_REVIEW seq=20 ack=19 type=work ts=...]

#### Summary
- Code review completed for Dashboard feature

#### Did
- Reviewed AGENT_DEV_1's component structure ✓
- Reviewed AGENT_DEV_2's WebSocket implementation ✓
- Found 3 minor issues, 1 security concern

#### Issues found
- Missing error boundary in Dashboard
- WebSocket doesn't validate message origin
- Console.log statements left in code

#### Next (awaiting approval)
1) AGENT_DEV_1: Add error boundary
2) AGENT_DEV_2: Add origin validation
3) Both: Remove console.logs
```

## Implementation Code

### Agent Base Class

```javascript
// agent-base.js
import { appendEntry, computeAck } from "./log.js";

export class AgentBase {
  constructor(agentName, role) {
    this.name = agentName;
    this.role = role;
    this.lastSeenSeq = 0;
  }

  async checkIn(summary, tasks, dependencies = []) {
    const sections = {
      "Summary": `- ${summary}`,
      "Next (awaiting approval)": tasks.map((t, i) => `${i + 1}) ${t}`)
    };
    
    if (dependencies.length > 0) {
      sections["Dependencies"] = dependencies.map(d => `- ${d}`);
    }
    
    await appendEntry({
      agent: this.name,
      type: "checkin",
      ack: computeAck(this.name),
      sections
    });
  }

  async syncState(message, data = {}) {
    await appendEntry({
      agent: this.name,
      type: "sync",
      ack: computeAck(this.name),
      sections: {
        "Summary": `- ${message}`,
        ...data
      }
    });
  }

  async askQuestion(summary, questions, targetAgent = null) {
    const sections = {
      "Summary": `- ${summary}`
    };
    
    const questionKey = targetAgent 
      ? `Questions for ${targetAgent}`
      : "Questions for ALL";
      
    sections[questionKey] = questions.map(q => `- ${q}`);
    
    await appendEntry({
      agent: this.name,
      type: "question",
      ack: computeAck(this.name),
      sections
    });
  }

  async handoff(summary, handoffs) {
    await appendEntry({
      agent: this.name,
      type: "work",
      ack: computeAck(this.name),
      sections: {
        "Summary": `- ${summary}`,
        "Handoff": handoffs.map(h => `- ${h}`)
      }
    });
  }

  async approveOthers(approvals) {
    await appendEntry({
      agent: this.name,
      type: "approve",
      ack: computeAck(this.name),
      sections: {
        "Approval": approvals.map(a => `- ${a}`)
      }
    });
  }
}
```

### Multi-Agent Coordinator

```javascript
// multi-agent-coordinator.js
import fs from 'fs';
import path from 'path';
import { AgentBase } from './agent-base.js';

export class MultiAgentCoordinator {
  constructor() {
    this.agents = new Map();
    this.LOG = path.resolve("LOG.md");
  }

  registerAgent(agent) {
    this.agents.set(agent.name, agent);
  }

  async findTasksForAgent(agentName) {
    const entries = this.parseLog();
    const tasks = [];
    
    // Look for tasks assigned to this agent
    entries.forEach(entry => {
      if (entry.sections["Next (awaiting approval)"]) {
        entry.sections["Next (awaiting approval)"].forEach(task => {
          if (task.includes(agentName)) {
            tasks.push({
              from: entry.agent,
              seq: entry.seq,
              task: task
            });
          }
        });
      }
      
      if (entry.sections["Handoff"]) {
        entry.sections["Handoff"].forEach(handoff => {
          if (handoff.includes(agentName)) {
            tasks.push({
              from: entry.agent,
              seq: entry.seq,
              task: handoff,
              type: 'handoff'
            });
          }
        });
      }
    });
    
    return tasks;
  }

  async findQuestionsForAgent(agentName) {
    const entries = this.parseLog();
    const questions = [];
    
    entries.forEach(entry => {
      const questionKey = `Questions for ${agentName}`;
      if (entry.sections[questionKey]) {
        questions.push({
          from: entry.agent,
          seq: entry.seq,
          questions: entry.sections[questionKey]
        });
      }
      
      // Also check "Questions for ALL"
      if (entry.sections["Questions for ALL"]) {
        questions.push({
          from: entry.agent,
          seq: entry.seq,
          questions: entry.sections["Questions for ALL"]
        });
      }
    });
    
    return questions;
  }

  parseLog() {
    if (!fs.existsSync(this.LOG)) return [];
    
    const content = fs.readFileSync(this.LOG, 'utf8');
    const entries = [];
    const lines = content.split('\n');
    
    let currentEntry = null;
    
    for (const line of lines) {
      const headerMatch = line.match(/^### \[agent=(\S+) seq=(\d+) ack=(\d+) type=(\S+) ts=([^\]]+)\]$/);
      
      if (headerMatch) {
        if (currentEntry) entries.push(currentEntry);
        
        currentEntry = {
          agent: headerMatch[1],
          seq: parseInt(headerMatch[2]),
          ack: parseInt(headerMatch[3]),
          type: headerMatch[4],
          timestamp: new Date(headerMatch[5]),
          sections: {}
        };
      } else if (currentEntry && line.startsWith('#### ')) {
        const section = line.substring(5);
        currentEntry.currentSection = section;
        currentEntry.sections[section] = [];
      } else if (currentEntry && currentEntry.currentSection && line.trim()) {
        currentEntry.sections[currentEntry.currentSection].push(line.trim());
      }
    }
    
    if (currentEntry) entries.push(currentEntry);
    return entries;
  }

  async waitForDependencies(agentName, dependencies) {
    console.log(`[${agentName}] Waiting for dependencies:`, dependencies);
    
    // Check if dependencies are met
    const checkDependencies = () => {
      const entries = this.parseLog();
      return dependencies.every(dep => {
        return entries.some(e => 
          e.type === 'work' && 
          e.sections.Summary && 
          e.sections.Summary.some(s => s.includes(dep))
        );
      });
    };
    
    // Poll until dependencies are met
    while (!checkDependencies()) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`[${agentName}] All dependencies met!`);
    return true;
  }
}
```

### Example: Agents Working Together

```javascript
// example-multi-agent-task.js
import { AgentBase } from './agent-base.js';
import { MultiAgentCoordinator } from './multi-agent-coordinator.js';

async function runMultiAgentTask() {
  const coordinator = new MultiAgentCoordinator();
  
  // Create agents
  const lead = new AgentBase("AGENT_LEAD", "coordinator");
  const dev1 = new AgentBase("AGENT_DEV_1", "frontend");
  const dev2 = new AgentBase("AGENT_DEV_2", "backend");
  
  coordinator.registerAgent(lead);
  coordinator.registerAgent(dev1);
  coordinator.registerAgent(dev2);
  
  // Lead breaks down the task
  await lead.checkIn(
    "Implementing user authentication feature",
    [
      "AGENT_DEV_1: Create login/signup forms",
      "AGENT_DEV_2: Implement auth API endpoints",
      "Both: Integrate frontend with backend"
    ]
  );
  
  // Agents acknowledge their tasks
  await dev1.syncState("Ready to create auth forms");
  await dev2.syncState("Ready to implement auth API");
  
  // Lead approves
  await lead.approveOthers([
    "AGENT_DEV_1: Proceed with forms",
    "AGENT_DEV_2: Proceed with API"
  ]);
  
  // Parallel work begins...
  
  // Dev2 has a question
  await dev2.askQuestion(
    "Need clarification on auth approach",
    ["Should we use JWT or session-based auth?", "What about OAuth providers?"],
    "AGENT_LEAD"
  );
  
  // Lead responds
  await lead.syncState("Responding to auth questions", {
    "Response": [
      "- Use JWT for stateless auth",
      "- Support Google and GitHub OAuth"
    ]
  });
  
  // Work continues...
}
```

## Benefits of Agent-to-Agent Communication

1. **Parallel Development**: Multiple agents can work simultaneously
2. **Reduced Bottlenecks**: Agents don't wait for human approval for everything
3. **Better Context Sharing**: Agents learn from each other's work
4. **Automatic Handoffs**: Work flows smoothly between specialized agents
5. **Self-Organizing**: Agents can negotiate and coordinate tasks

## Usage Instructions for Agents

Tell each Claude agent:

```
You are [AGENT_NAME] working on a shared task with other agents.

Your colleagues are:
- AGENT_LEAD (coordinator)
- AGENT_DEV_1 (frontend)
- AGENT_DEV_2 (backend)
- AGENT_TEST (testing)

Before starting:
1. Check LOG.md for your assigned tasks
2. See what others have done
3. Acknowledge your tasks with a sync entry
4. Coordinate with other agents as needed

You can:
- Approve other agents' plans
- Ask them questions
- Hand off work to them
- Wait for their work if you depend on it

Use the agent-base.js helper for easy coordination.
```
