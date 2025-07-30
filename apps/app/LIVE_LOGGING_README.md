# Live Logging System for Claude Code Agents

A bare-bones, append-only coordination log system for Claude Code agents without git dependencies.

## Overview

This system provides a clean, deterministic way for multiple Claude Code agents to coordinate their work through a simple file-based logging mechanism.

### What you create

```
/your-project
  LOG.md        # append-only coordination log
  .log.seq      # single integer: last used global sequence
  .log.lock     # ephemeral lock during writes
  log.js        # helper module for log operations
```

No branches, no SHAs, no gitattributes. Just a file, a counter, and a lock.

## Entry Format

Every entry is a single block with one header line plus standard sections.

### Header (required, exact key order)

```
### [agent=AGENT_A seq=42 ack=41 type=work ts=2025-07-30T09:15:04-05:00]
```

- **agent**: AGENT_A | AGENT_B | USER
- **seq**: global, strictly increasing (from .log.seq)
- **ack**: the latest seq from the other party you have read & considered
- **type**: checkin | work | error | question | approve
- **ts**: ISO-8601 timestamp

### Body sections (markdown)

```markdown
#### Summary
- One line on what happened / intent.

#### Did
- Short bullets (or omit for checkin/questions).

#### Working
- …

#### Not working / risks
- …

#### Files changed
- path/to/file.ext (+12 −3)
- …

#### Next (awaiting approval)
1) …
2) …

#### Questions for USER
- …

#### Approval
- Proceed with Next steps 1–2. Hold 3.
```

Omit any section you don't need. Keep the headings as written for easy machine parsing.

## Protocol (per agent)

1. **Observe**: Read LOG.md. Find the last entry not by me; set ack to its seq.
2. **Check in**: Append a type=checkin with proposed "Next (awaiting approval)".
3. **Wait**: Do not proceed until a type=approve appears from USER with seq >= your last seq.
4. **Do work**.
5. **Record**: Append a type=work entry with Summary / Did / Files / Working / Not / Next.

### Hard rules

- Append-only. Never edit old entries.
- One entry = one header + sections.
- If you see a newer entry from the other agent before writing, re-read, recompute ack, then write.

## Usage Examples

### Using the helper module

```javascript
import { appendEntry, computeAck } from "./log.js";

const agent = "AGENT_A"; // or AGENT_B

// 1) Checkin
await appendEntry({
  agent,
  type: "checkin",
  ack: computeAck(agent),
  sections: {
    "Summary": "- Plan to add entity node + rel edges without breaking layout.",
    "Next (awaiting approval)": ["1) Add schema fields", "2) Write migration", "3) Wire UI"],
    "Questions for USER": ["OK to defer perf tests?"]
  }
});

// 2) Wait for USER approval (poll LOG.md or have your runner notify)

// 3) Work entry
await appendEntry({
  agent,
  type: "work",
  ack: computeAck(agent),
  sections: {
    "Summary": "- Implemented schema + UI binding; basic tests green.",
    "Did": ["- Added /lib/entity.ts", "- Updated mindmap reducer"],
    "Working": ["- Node appears; edges render"],
    "Not working / risks": ["- Drag jitter on dense graphs"],
    "Files changed": ["apps/app/lib/entity.ts (+88 −0)", "apps/app/components/map.tsx (+14 −3)"],
    "Next (awaiting approval)": ["1) Optimize drag handler", "2) Add regression test"]
  }
});
```

### USER approval entry

```markdown
### [agent=USER seq=43 ack=42 type=approve ts=2025-07-30T09:18:12-05:00]

#### Approval
- Proceed with Next steps 1–2. Hold 3.
```

## Behavior Contract

Copy this into both agents:

- Before acting, read LOG.md and set ack = last seq not by me.
- Propose work via type=checkin → wait for USER type=approve.
- After changes, write type=work with concise details.
- Append-only; never edit old entries.
- If a newer entry appears mid-flight, re-read, recompute ack, and log again.

## Example Entries

```markdown
### [agent=AGENT_A seq=1 ack=0 type=checkin ts=2025-07-30T09:00:00-05:00]

#### Summary
- Plan to add "Entity" node type and basic create flow.

#### Next (awaiting approval)
1) Add schema
2) Minimal UI
3) Wire create action

#### Questions for USER
- OK to skip undo history on v1?

### [agent=USER seq=2 ack=1 type=approve ts=2025-07-30T09:02:00-05:00]

#### Approval
- Proceed with 1–2. Hold 3 pending UX note.

### [agent=AGENT_B seq=3 ack=2 type=checkin ts=2025-07-30T09:03:00-05:00]

#### Summary
- Will prepare migration + seed for Entities.
```

## Notes

- **Real-time feel**: you can tail -f LOG.md while they work.
- **Stale lock**: auto-reclaimed after 30s; adjust in code if needed.
- **Timestamps** are for humans; seq is the ground truth.

## Helper Module API

### appendEntry(options)

Appends a new entry to the log file.

Options:

- `agent` (string, required): Agent name (e.g., "AGENT_A", "AGENT_B", "USER")
- `type` (string, required): Entry type ("checkin", "work", "error", "question", "approve")
- `ack` (number, required): Acknowledgment sequence number
- `ts` (string, optional): ISO timestamp (auto-generated if not provided)
- `sections` (object, optional): Key-value pairs for body sections

### computeAck(agentName)

Returns the sequence number of the last entry not by the specified agent.

### Internal Functions

- `withLock(fn, ttlMs)`: Executes a function with file locking
- `nextSeq()`: Gets and increments the global sequence counter
- `getLastOtherSeq(me)`: Finds the last sequence from another agent
