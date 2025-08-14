# Principles for Prompting Multi‑Agent Systems

Multi-agent systems differ from single-agent systems primarily due to rapidly increasing coordination complexity. Early failures included spawning excessive subagents for simple tasks, endless web searches for nonexistent sources, and agents distracting each other with noisy updates. Because each agent is steered by prompts, prompt engineering became the main lever for improving behavior.

## Principles and Practices

1) Think like your agents

- Simulate with the exact prompts and tools, then watch step-by-step execution.
- Common failure modes: continuing after sufficient results, overly verbose queries, incorrect tool selection.
- Build a mental model of the agent to make impactful prompt changes obvious.

2) Teach the orchestrator how to delegate

- Lead agent decomposes tasks and briefs subagents with:
- Objective
- Output format
- Tool/source guidance
- Clear task boundaries
- Without detail, agents duplicate work, leave gaps, or miss key info.
- Example: “research the semiconductor shortage” was too vague—one subagent explored the 2021 automotive chip crisis while two others duplicated current 2025 supply chain searches.

3) Scale effort to query complexity

- Embed explicit scaling rules so effort matches task complexity:
- Simple fact-finding: 1 agent, 3–10 tool calls
- Direct comparisons: 2–4 subagents, 10–15 calls each
- Complex research: 10+ subagents with clearly divided responsibilities
- Prevents overinvestment on simple queries.

4) Tool design and selection are critical

- Agent-tool interfaces are as important as human-computer interfaces.
- With MCP servers exposing many external tools, quality and clarity of tool descriptions matter.
- Heuristics for agents:
- Examine available tools first
- Match tool to user intent
- Use the web for broad external exploration
- Prefer specialized tools over generic ones
- Bad descriptions mislead agents—each tool needs a distinct purpose and clear description.

5) Let agents improve themselves

- Claude 4 models can diagnose failures and suggest prompt/tool improvements.
- A tool-testing agent can repeatedly use a flawed MCP tool, then rewrite its description to avoid errors.
- Result: ~40% decrease in task completion time for future agents using improved descriptions.

6) Start wide, then narrow down

- Mirror expert research: begin with short, broad queries, assess what’s available, then progressively narrow.

7) Guide the thinking process

- Use extended thinking as a controllable scratchpad:
- Lead agent plans approach, selects tools, estimates complexity/subagent count, and defines roles.
- Subagents plan, then interleave thinking after tool results to assess quality, identify gaps, and refine queries.
- Improves instruction-following, reasoning, and efficiency.

8) Parallel tool calling transforms speed and performance

- Parallelize at two levels:
- Lead agent launches 3–5 subagents in parallel
- Subagents use 3+ tools in parallel
- Cuts research time by up to 90% on complex queries and increases coverage.

## Quick Reference Tables

Subagent task spec

| Field | What to include |
|---|---|
| Objective | Clear, outcome-focused goal for the subagent |
| Output format | Required structure, fields, and level of detail |
| Tools & sources | Which tools to use/avoid and source priorities |
| Boundaries | What is in scope, out of scope, and handoff criteria |

Effort scaling rules

| Task type | Agents | Tool calls per agent | Notes |
|---|---|---|---|
| Simple fact-finding | 1 | 3–10 | Avoid over-investment |
| Direct comparison | 2–4 | 10–15 | Define distinct slices per subagent |
| Complex research | 10+ | Varies by role | Require explicit division of labor |

Parallelization impact

| Level | Parallelization | Impact |
|---|---|---|
| Orchestration | Lead agent spawns 3–5 subagents in parallel | Faster coverage of subproblems |
| Execution | Subagents run 3+ tools in parallel | Up to 90% reduction in research time |
