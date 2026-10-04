# RcP0ToolCards

**Date:** 2026-08-10  
**Status:** plan / approve — not implemented  
**Ticket:** T-053 / Linear DMGD-219 · phase **RC-P0**  
**Canon epic:** `docs/plans/2026-08-09-research-canvas-genui.md`  
**Implementation plan:** `docs/plans/2026-08-10-rc-p0-tool-cards.md`  
**Pseudocode:** `.scratch/RcP0ToolCards_PSUEDOCODE.md`

## What

Smallest dogfoodable Gen-UI MVP on `/research-canvas`: replace `EnhancedAnimatedChat` processing pills with expandable **ToolCards** driven by the existing `AgentToolEvent` SSE stream.

## Architecture

```
SSE /api/disclosure/mindmap
  → useMindMapAgent (aggregates AgentToolEvent[])
  → Graph (pass-through)
  → ResearchCanvasConsole | EmptyCanvas
  → EnhancedAnimatedChat
      → AgentToolEventList
          → ToolCard (expandable)
```

### Modules

| Module | Responsibility |
| --- | --- |
| `tool-event-summary.ts` | Pure: label, query text, hit counts, error text from `AgentToolEvent` |
| `tool-card.tsx` | Presentational expandable card (status + summary) |
| `agent-tool-event-list.tsx` | Maps `agentToolEvents` → cards; scroll container |
| `EnhancedAnimatedChat.tsx` | Host: remove pills; mount list |

### Data flow

- **In:** `AgentToolEvent { tool, status, parameters?, result?, message? }` — unchanged.
- **Out:** UI only. No Zustand writes, no API body changes, no graph write changes.

### Process

1. Stream appends events → React re-renders chat.
2. List renders each event (or collapsed processing→complete pair if polished).
3. User expands card → sees params + count/error.
4. Graph continues to consume the same run result for nodes/edges independently.

## Non-architecture

Session AgentState, Deep Research mode, dossier, waypoints — deferred to RC-P1–P4.
