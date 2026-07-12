---
name: goal
description: Set the goal for this app's next loop run — accepts a Linear ticket ID or inline text
---

Set or update `GOAL.md` at this app's root. This is the fence around autonomous work — one objective, one done condition, clear constraints.

## Input

- If the argument looks like a Linear ticket ID (e.g. `DMGD-83`), fetch the ticket via the Linear GraphQL API and build the goal from its title, description, and labels.
- Otherwise, treat the argument as the goal statement directly.
- If no argument given, read the current `GOAL.md` and ask what to update.

## Fetching a Linear ticket

Use `curl` against the Linear GraphQL API. The API key is in the environment variable `LINEAR_API_KEY`.

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ issue(id: \\\"TICKET_ID\\\") { id identifier title description state { name } priority project { id name } labels { nodes { name } } } }\"}"
```

Parse the JSON response. Use:
- `title` → Objective
- `description` → expand into Done when + Constraints
- `identifier` → Source
- `labels` → note in Constraints if relevant

If `LINEAR_API_KEY` is not set, ask the user to provide the ticket details inline instead.

## Write GOAL.md with exactly these sections:

- **Objective** — one sentence: what to achieve.
- **Source** — the Linear ticket ID/URL, or `inline`.
- **Done when** — the verifiable condition that proves completion (tests pass, build green, feature works as described).
- **Constraints** — what must not change, scope boundaries, files off-limits.
- **Progress** — append-only table: `| Date | Run | Result |`.

## Rules

- Do NOT implement anything. That is `/loop`'s job.
- Only edit `GOAL.md`.
- If the objective is vague, ask one focused question to clarify the done condition.
