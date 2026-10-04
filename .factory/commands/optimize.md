---
description: Analyze and optimize orchestrations to remove bottlenecks and improve throughput
argument-hint: [scope] | --workflow <name> | --id <orchestration-id> | --report
---

# Orchestration Optimize

Optimize orchestration workflows based on: **$ARGUMENTS**

## Quick Usage

- `/orchestration/optimize analyze --id <orchestration-id>`
- `/orchestration/optimize optimize --workflow <name> --goals throughput`
- `/orchestration/optimize report --scope <team|project> --format summary`

## What to Do

1. **Identify Target**
   - Use `--workflow`, `--id`, or `--scope` from $ARGUMENTS to set focus.
2. **Analyze**
   - Gather metrics: cycle/lead time, wait states, utilization, handoffs, rework, throughput.
   - Map bottlenecks and dependency chains; compare to baselines if provided.
3. **Optimize**
   - Recommend actions: parallelize independents, reduce handoffs, automate repeats, cap WIP, simplify approvals.
   - Safety first: simulations, feature flags/canaries, rollback plan.
4. **Report**
   - Return summary (and visuals if requested), prioritized actions with owners, success criteria, and risk notes.

## Options

- `--workflow <name>` focus on named workflow
- `--id <orchestration-id>` analyze specific orchestration
- `--scope <team|project|pipeline>` define boundary
- `--window <time>` time window for metrics
- `--goals <throughput|efficiency|cost>` optimization goals
- `--constraints <text>` resource/policy limits
- `--format <summary|detailed|json>` report format

## Outputs

- Bottleneck map, key metrics, prioritized recommendations
- Risk/impact notes and rollback guidance
