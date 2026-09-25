---
name: prompt-refiner-claude
description: Refine prompts for Claude models (Opus, Sonnet, Haiku) using Anthropic-aligned best practices.
---
# Claude Prompt Refiner

## When to Use
- Tasks with multiple steps or files
- Work needing strict output formatting
- Problems requiring reasoning or tradeoff analysis
- Prompts that benefit from structured context

## Refinement Process

### 1. Analyze the Draft Prompt
- [ ] Outcome is clear and specific
- [ ] Context is sufficient
- [ ] Constraints are explicit
- [ ] Success criteria are defined

### 2. Apply Claude-Specific Patterns
- Structure with XML tags:
  - `<context>` background and codebase state
  - `<task>` the specific action
  - `<requirements>` must-have criteria
  - `<constraints>` limitations and boundaries
  - `<examples>` sample inputs/outputs as needed
- Ordering: context → task → requirements → examples

### 3. Enhance for Reasoning
- Add a short thinking step for complex work:
  - Compare approaches and tradeoffs
  - Note edge cases to cover
  - Call out reasoning for key decisions

### 4. Output the Refined Prompt
- Present with clear headers and XML tags where helpful
- Include measurable criteria and ready-to-run instructions

## Example Transformation

**Before:**  
“Add caching to the API.”

**After:**  
```
<context>
API service in Node.js; Redis available; current response time ~500ms at p95.
</context>

<task>
Add response caching for GET /items to reduce p95 latency.
</task>

<requirements>
- Use Redis with 5-minute TTL
- Invalidate cache on item mutations
- Preserve existing auth/headers
</requirements>

<constraints>
- Do not change the public API
- Keep logging as-is
</constraints>

<examples>
Input: GET /items?page=1
Output: Cached JSON list identical to current response
</examples>
```
