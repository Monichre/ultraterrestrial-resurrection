# Pair Programming Protocol

## How to Work Together

### 1. Choose Your Name

First time you write to LOG.md, pick any name you want.

### 2. Before Every Action

- Read the last entry in LOG.md
- Ask yourself: "Does this affect what I'm about to do?"
  - **No** → Continue your work, log your progress
  - **Yes** → Respond to it first

### 3. When You're Blocked

If you need information from the other agent:

```markdown
### [agent=YOUR_NAME seq=N ack=M type=question ts=...]

#### Summary
- Blocked: Need clarification on X

#### Questions for OTHER_AGENT
- How should I handle Y?
- Which approach for Z?

#### Blocked
- Cannot proceed with [task] until answered
```

Then WAIT for their response before continuing.

### 4. When You See a Blocking Question

Drop what you're doing and answer it:

```markdown
### [agent=YOUR_NAME seq=N ack=M type=sync ts=...]

#### Summary  
- Answering blocking question

#### Response
- Handle Y by doing...
- For Z, use approach...
```

### 5. Writing to LOG.md

- Check if `.log.lock` exists
- If it does, wait a few seconds and check again
- If not, write your entry
- The lock is automatic via log.js

### 6. Two Modes

#### Active Programming Mode

- Work independently on your parts
- Log major progress: "Completed X", "Starting Y"
- Only sync when something affects the other agent
- Check LOG.md every few minutes

#### Pair Programming Mode  

- Tighter collaboration
- Log your thinking: "Considering approach A because..."
- Check LOG.md more frequently
- More back-and-forth discussion

### 7. What to Log

Always log:

- Starting new work: "Beginning implementation of X"
- Major decisions: "Chose library Y because..."
- Completions: "Finished component Z"
- Blockers: "Can't proceed without..."
- Questions: "How should we handle..."

### 8. The Flow

```
You: Read last entry → Not blocking → Work → Log progress
                    ↓
                    Blocking? → Ask question → Wait
                                            ↓
Other: Sees question → Answers → Continues work
                              ↓
You: See answer → Unblocked → Continue
```

## Example

```markdown
### [agent=ALICE seq=1 ack=0 type=work ts=...]
#### Summary
- Starting frontend components for user dashboard

### [agent=BOB seq=2 ack=1 type=work ts=...]  
#### Summary
- Building API endpoints for dashboard data

### [agent=ALICE seq=3 ack=2 type=question ts=...]
#### Summary
- Need API endpoint structure
#### Questions for BOB
- What's the response format for /api/dashboard?
#### Blocked
- Can't create TypeScript interfaces without knowing API shape

### [agent=BOB seq=4 ack=3 type=sync ts=...]
#### Summary
- API response structure
#### Response  
- Returns { user: User, stats: Stats[], recentActivity: Activity[] }
- See types in api/types/dashboard.ts

### [agent=ALICE seq=5 ack=4 type=work ts=...]
#### Summary
- Thanks! Creating interfaces and continuing with components
```

## Remember

- **Don't wait unnecessarily** - Only wait if truly blocked
- **Be clear about blockers** - Say exactly what you need
- **Answer blocking questions fast** - They're waiting on you
- **Log meaningful progress** - Not every line of code, but major steps

The goal: Work smoothly together, help when needed, stay out of each other's way when not.
