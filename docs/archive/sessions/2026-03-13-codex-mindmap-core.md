# Codex Mindmap Core Work Session

**Last Updated:** 2026-03-13 16:29:41 CDT  
**Agent:** Codex  
**Plan Context:** `docs/plans/2026-03-13-mindmap-core-surface-review.md`, `docs/plans/2026-03-13-mindmap-core-surface-implementation-plan.md`  
**Status:** Task 2 trust/coherence fixes completed

## Objective

Implement the highest-leverage graph-surface trust fixes before broader pruning and shell simplification:

- remove duplicated ask/search submission behavior
- make visible connection affordances actually mutate graph state
- align empty-state copy with real controls
- correct stale tour date framing

## Scope

Completed work was intentionally limited to the Task 2 trust/coherence band from the implementation plan.  
No broad shell pruning, route consolidation, or context decomposition was attempted in this pass.

## Files Touched

- `apps/app/src/features/mindmap/graph.tsx`
- `apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx`
- `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`
- `apps/app/src/features/mindmap/components/node-connection-overlay.tsx`
- `apps/app/src/features/mindmap/components/connected-records-panel.tsx`
- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- `apps/app/src/contexts/mindmap/mindmap-context.tsx`
- `apps/app/src/features/mindmap/components/tours/historical-tour-controls.tsx`

## Work Completed

### 1. Single owner for ask/search submission

- `graph.tsx` now owns the active `useMindMapAgent()` state for the visible graph surface.
- `research-canvas-console.tsx` no longer executes its own duplicate `runAgentQuery()` call.
- `EmptyCanvas.tsx` and the in-graph console now receive shared agent status/analysis/tool-events from `graph.tsx`.

Result:
- one submission path
- one stream owner
- less risk of duplicate cost, duplicate latency, and graph/chat desync

### 2. Connection affordances now mutate graph state

- `node-connection-overlay.tsx` now uses the node’s visible label/title context instead of parsing `nodeId`.
- node overlay suggestions now route through `addConnectionNodesFromSearch(...)`.
- `connected-records-panel.tsx` now routes clicked suggestions through the same graph mutation helper.

Result:
- “smart connection” clicks can now add actual nodes/edges instead of stopping at `console.log(...)`
- overlay and side-panel behavior now share one graph-add pathway

### 3. Supporting graph mutation helper hardened

- `mindmap-context.tsx` `addConnectionNodesFromSearch(...)` now:
  - skips invalid records
  - skips duplicate node IDs already on canvas
  - preserves `label`, `title`, and `name` consistently
  - falls back safely when a domain color is missing
  - returns `null` when nothing new is added

Result:
- less duplicate-node noise
- more consistent payload shape across connection-entry surfaces

### 4. Enhanced node graph context refresh fixed

- `enhanced-node-poc.tsx` now derives graph context from store `nodes` rather than memoizing against `getNodes` function identity.
- overlay receives explicit `nodeLabel`.

Result:
- contextual/tour badges should track actual graph state more reliably

### 5. Empty-state and tour honesty fixes

- `EmptyCanvas.tsx` copy now references real controls instead of nonexistent guided-tour cards.
- `historical-tour-controls.tsx` now uses `CURRENT_YEAR` for the disclosure era window and modern waypoint end year.

Result:
- onboarding language is closer to reality
- tour framing is no longer hard-stale at 2024

## Validation Log

### Plan review completed

- Read: `docs/plans/2026-03-13-mindmap-core-surface-review.md`
- Read: `docs/plans/2026-03-13-mindmap-core-surface-implementation-plan.md`

### Commands run

- `git status --short`
- `date '+%Y-%m-%d %H:%M:%S %Z'`
- targeted file reads and diffs for touched mindmap files
- targeted ESLint:
  - `../../node_modules/.bin/eslint src/features/mindmap/graph.tsx src/features/mindmap/research-canvas/research-canvas-console.tsx src/features/mindmap/research-canvas/EmptyCanvas.tsx src/features/mindmap/components/node-connection-overlay.tsx`

### Validation result

- targeted ESLint passed for:
  - `graph.tsx`
  - `research-canvas-console.tsx`
  - `EmptyCanvas.tsx`
  - `node-connection-overlay.tsx`

### Known validation limitation

A broader targeted lint run across older mindmap files still reports substantial pre-existing issues, especially:

- `apps/app/src/contexts/mindmap/mindmap-context.tsx`
- `apps/app/src/features/mindmap/components/connected-records-panel.tsx`
- `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`
- `apps/app/src/features/mindmap/components/tours/historical-tour-controls.tsx`

These are mostly legacy `any`, hook-dependency, unused-import, and old suppression issues.  
They were not introduced by this pass and were left untouched to avoid collateral expansion.

## Open Issues / Follow-Ups

1. `enhanced-node-poc.tsx` still has a leftover `handleAddConnection` console log path even though the overlay now performs the actual graph mutation.
2. `connected-records-panel.tsx` still carries heavy legacy typing debt and should be cleaned if it remains a first-class surface.
3. `mindmap-context.tsx` remains oversized and should be handled under Task 5, not piecemeal during trust-fix work.
4. Empty-state timeline behavior is still keyword-triggered demo logic and may need product review if the empty canvas remains in the core path.

## Collision / Coordination Notes

- Treat `node-connection-overlay.tsx` as active refactor territory with real graph-add behavior now in place.
- Treat `connected-records-panel.tsx` as a real supporting graph surface, not a placeholder.
- Do not reintroduce local `runAgentQuery()` ownership inside `research-canvas-console.tsx`.
- If another agent takes on Task 3 or Task 4, prefer preserving the new single-owner submission contract while pruning shell complexity.
- If another agent starts Task 5, they should re-read the touched `mindmap-context.tsx` helper before extracting graph mutation utilities.

## Recommended Next Agent Targets

- Task 3: prune competing primary surfaces and demote peer view-switching
- Task 4: consolidate duplicate shell variants and hover-panel paths
- Task 5: extract graph mutation helpers from `mindmap-context.tsx` into narrower modules
