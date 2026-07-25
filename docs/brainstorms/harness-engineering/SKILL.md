---
name: harness-engineering
description: Agent-first development methodology inspired by OpenAI's Harness Engineering practice. Use this skill when building or operating autonomous code generation systems, setting up repository scaffolding for agent-driven teams, or enforcing architecture in agent-generated codebases. Focus on "humans steer, agents execute" workflows.
---

This skill implements OpenAI's Harness Engineering methodology: building software where agents do the execution while humans design environments, specify intent, and build feedback loops.

## Core Philosophy

**"Humans steer. Agents execute."**

The engineer's primary job is enabling agents, not writing code. Work through prompts—describe tasks, run agents, review PRs. When something fails, ask "what capability is missing?" not "try harder."

## The Harness Engineering Mindset

### Engineer's Role Redefined

- **Enable, don't execute** — Build environments, tools, and context that let agents succeed
- **Work depth-first** — Break goals into smaller blocks, prompt agent to construct
- **Missing capability, not effort** — When agents fail, identify what's missing (context, tools, abstractions)
- **All through prompts** — Describe task → run agent → review PR

### Application Legibility

Make the application directly accessible to agents:

- **Bootable per git worktree** — Launch isolated instance per change
- **Chrome DevTools Protocol** — DOM snapshots, screenshots, navigation
- **Ephemeral observability** — Logs, metrics, traces available to agents
- **Queryable systems** — Agents can use LogQL/PromQL

### Repository Knowledge as System of Record

Context management is the biggest challenge:

- **AGENTS.md = table of contents** (100 lines max), not encyclopedia
- **Structured docs/ directory** — Knowledge base lives here
- **Plans are first-class** — Versioned, co-located with code
- **Progressive disclosure** — Start small, teach agents where to look
- **Mechanical enforcement** — Linters + CI validate docs are fresh
- **Doc-gardening agent** — Scans for stale documentation

### Agent Legibility is the Goal

Anything the agent can't access in-context doesn't exist:

- No Google Docs, chat threads, or oral traditions
- All knowledge must be repository-local and versioned
- Organize so agent can reason over it, not overwhelm with ad-hoc instructions
- Prefer dependencies agent can fully internalize
- "Boring" technologies are better (composable, stable APIs, well-represented in training)

## Implementation Patterns

### Phase 1: Repository Foundation

- [ ] Create AGENTS.md as table of contents (100 lines max)
- [ ] Build structured docs/ knowledge base
- [ ] Index design docs with verification status
- [ ] Document architecture with domain/top-level map
- [ ] Add quality grading for domains/layers

### Phase 2: Agent Legibility

- [ ] Enable bootable git worktrees per change
- [ ] Wire Chrome DevTools Protocol for DOM/screenshot access
- [ ] Build ephemeral observability stack (logs/metrics/traces)
- [ ] Expose LogQL/PromQL querying to agents
- [ ] Ensure all critical context is repository-local

### Phase 3: Architectural Constraints

- [ ] Define fixed layer structure per domain
- [ ] Specify allowed dependency directions
- [ ] Design cross-cutting concern interfaces (Providers)
- [ ] Build custom linters for enforcement
- [ ] Write taste invariants (logging, naming, file limits)

### Phase 4: Continuous Operations

- [ ] Set up "doc-gardening" agent for stale docs
- [ ] Encode "golden principles" as mechanical rules
- [ ] Build recurring cleanup tasks for deviation scanning
- [ ] Define merge philosophy (minimal gates, fast iterations)

## Architectural Standards

### Layer Structure

Each domain follows: **Types → Config → Repo → Service → Runtime → UI**

- Strictly validated dependency directions
- Cross-cutting concerns through single explicit interface (Providers)
- Custom linters + structural tests enforce boundaries

### Taste Invariants

- Structured logging everywhere
- Naming conventions enforced
- File size limits

## Merge Philosophy

- Minimal blocking merge gates
- Short-lived PRs
- Test flakes addressed with follow-ups, not blocking
- Corrections are cheap; waiting is expensive

## Full Autonomy Cycle

Agents can end-to-end drive a feature:

1. Validate codebase state
2. Reproduce bug
3. Record video of failure
4. Implement fix
5. Validate fix via app drive
6. Record video of resolution
7. Open PR
8. Respond to feedback
9. Detect/build failure remediation
10. Escalate to human only for judgment
11. Merge

## Entropy Management

Agents replicate existing patterns (even suboptimal ones):

- "Golden principles" encoded as mechanical rules
- Continuous cleanup vs. weekly "AI slop" cleanup
- Technical debt as high-interest loan: pay continuously
- Background tasks scan for deviations daily

## Key Principles

1. Build environments, not code
2. Treat context as scarce resource
3. Make everything legible to agents
4. Encode constraints mechanically
5. Prefer continuous debt payment over bursts
6. Document everything in-repo
