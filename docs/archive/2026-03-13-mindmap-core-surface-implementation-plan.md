# Mindmap Core Surface Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Converge the mindmap into a graph-first single-workspace experience by fixing trust-breaking interactions, pruning competing surfaces, and simplifying the core shell architecture.

**Architecture:** Keep the graph canvas as the canonical home surface. All meaningful discovery, detail, and intelligence flows should mutate, explain, or guide graph exploration. Sequence work in three waves: trust/coherence fixes first, surface pruning second, architecture simplification third.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zustand, React Flow (`@xyflow/react`), existing mindmap context/store architecture, Vercel AI/OpenAI integrations.

---

## Canonical execution protocol

When implementing this plan in a multi-agent session:

1. **Every implementer agent must maintain a work session document** in `docs/plans/work-sessions/`.
2. Each work session doc must track:
   - task scope
   - files touched
   - progress/status
   - notes/decisions
   - validation commands and outputs
   - blockers or follow-ups
3. Use one doc per active implementation agent.
4. Naming convention:
   - `docs/plans/work-sessions/2026-03-13-<agent-label>-mindmap-core.md`
5. Spec review must happen **before** code quality review for each implementation task.

---

## Task 1: Establish implementation tracking docs

**Files:**
- Create: `docs/plans/work-sessions/2026-03-13-controller-mindmap-core.md`
- Create: `docs/plans/work-sessions/2026-03-13-<agent-label>-mindmap-core.md` for each implementation subagent

**Intent:** Ensure every implementation agent keeps a visible execution trail.

**Steps:**

1. Create the controller work-session doc.
2. Add initial sections:
   - Objective
   - Active Tasks
   - Agent Assignments
   - Progress Log
   - Validation Log
   - Open Issues
3. For each implementation agent, create a matching work-session doc before code edits begin.
4. Require each agent to update its own doc as part of task completion.

**Validation:**
- Confirm docs exist before implementation tasks start.

---

## Task 2: Fix trust-breaking core interactions

**Files:**
- Re-read before edit:
  - `apps/app/src/features/mindmap/graph.tsx`
  - `apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx`
  - `apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`
  - `apps/app/src/features/mindmap/components/node-connection-overlay.tsx`
  - `apps/app/src/features/mindmap/components/connected-records-panel.tsx`
  - `apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`

**Intent:** Make the visible graph-first surface honest, consistent, and state-mutating.

**Subtasks:**

### 2.1 Research console submission contract
- Verify the latest `research-canvas-console.tsx` no longer duplicates `runAgentQuery`.
- Verify `graph.tsx` is the single place owning graph mutation for ask/search submission.
- If needed, refactor prop names or contracts so ownership is explicit.

### 2.2 Connection affordance integrity
- Ensure node-level “add connection” actions either:
  - actually add records/edges to the graph, or
  - are hidden/disabled until implemented.
- Align `enhanced-node-poc.tsx` and `node-connection-overlay.tsx` with one canonical graph-mutation path.

### 2.3 Connected records consistency
- Ensure `connected-records-panel.tsx` uses the same graph-mutation pathway as node overlays.
- Standardize added node payload shape and edge creation expectations.

### 2.4 Empty-state honesty
- Keep `EmptyCanvas.tsx` copy aligned with currently exposed graph controls.
- Remove references to non-existent cards/actions.

**Validation:**
- Targeted lint on touched files
- Manual path review: empty state → submit query → graph mutation → add related record

---

## Task 3: Prune competing primary surfaces

**Files:**
- Re-read before edit:
  - `apps/app/src/features/mindmap/mind-map.tsx`
  - `apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`
  - `apps/app/src/features/mindmap/navigation/FullScreenMenu.tsx`
  - `apps/app/src/features/mindmap/hooks/use-navigation.ts`
  - route wrappers under `apps/app/src/app/(site)/`

**Intent:** Reduce the number of surfaces behaving like first-class products.

**Subtasks:**

### 3.1 Define the canonical core entry behavior
- Make the graph canvas the default/home behavior for the mindmap product.
- Treat search, globe, timeline, and detail as supporting lenses or subordinate routes.

### 3.2 Demote view switching
- Reduce prominence of peer view switching in primary chrome.
- If views remain, they should be framed as secondary tools/lenses rather than primary destinations.

### 3.3 Simplify full-screen menu semantics
- Update `FullScreenMenu` labels and emphasis to reinforce one core workspace.
- Avoid implying each destination is a separate equal product mode.

### 3.4 Route-wrapper audit
- Confirm route wrappers do not obscure product ownership.
- Keep aliases only where they serve a clear navigation or compatibility role.

**Validation:**
- Targeted lint on touched files
- Verify the default user journey is graph-first and secondary views are visually/structurally demoted

---

## Task 4: Consolidate duplicate and legacy shell structures

**Files:**
- Audit and potentially modify:
  - `apps/app/src/features/mindmap/mind-map.tsx`
  - `apps/app/src/features/mindmap/smart-mindmap.tsx`
  - `apps/app/src/features/mindmap/smart-mindmap-with-auto-connections.tsx`
  - `apps/app/src/features/mindmap/smart-mindmap-with-shared-context.tsx`
  - `apps/app/src/features/mindmap/smart-graph.tsx`
  - duplicate hover-panel directories

**Intent:** Reduce confusion about canonical composition and supporting component systems.

**Subtasks:**

### 4.1 Shell variant audit
- Identify which shell is canonical for production.
- Mark legacy/alternate wrappers as deprecated or remove them if unused.

### 4.2 Hover-panel consolidation
- Audit both hover panel locations for actual usage.
- Keep one canonical implementation path.
- Update imports accordingly.

### 4.3 Duplicate action path audit
- Review `xata-to-xyflow.ts` vs `xata-to-xyflow-fixed.ts` usage.
- Decide whether deprecation, consolidation, or unification is the right move.

**Validation:**
- Repo search confirms canonical import paths
- Targeted lint/type validation on affected files

---

## Task 5: Begin context/store responsibility reduction

**Files:**
- Re-read before edit:
  - `apps/app/src/contexts/mindmap/mindmap-context.tsx`
  - `apps/app/src/contexts/mindmap/mindmap.interface.ts`
  - `apps/app/src/features/mindmap/store/mindmap-store.ts`
  - `apps/app/src/features/mindmap/store/mindmap-ui-store.ts`

**Intent:** Reduce accidental complexity in the main orchestration layer without destabilizing the feature.

**Subtasks:**

### 5.1 Extract pure helpers first
- Move pure helper logic out of `mindmap-context.tsx` into focused utility modules where safe.
- Candidates include node factories, edge factories, layout helper preparation, and semantic transformation helpers.

### 5.2 Reduce re-export ambiguity
- Clarify which behavior belongs to store, which belongs to orchestration, and which belongs to view hooks.
- Avoid further growth of context as a “god object.”

### 5.3 Document next-stage decomposition boundaries
- Capture explicit follow-up boundaries for:
  - graph boot/init
  - graph mutation actions
  - layout orchestration
  - persistence/session behavior

**Validation:**
- Targeted lint/type validation on extracted helpers and import sites
- No behavior regressions in graph bootstrap and node mutation flow

---

## Task 6: Update planning and execution tracking

**Files:**
- Update as implementation progresses:
  - `DAILY_WORK_PLAN.md`
  - `docs/plans/TODO.md` (only if scope/status materially changes)
  - `docs/plans/work-sessions/*.md`

**Intent:** Keep execution visible and aligned with the three-tier planning system.

**Steps:**

1. Record which roadmap phase is being executed.
2. Mark trust/coherence work separately from architectural simplification.
3. Ensure each implementation agent work-session doc is updated before signoff.

---

## Validation matrix

### Required per task
- targeted lint for touched files
- code review after spec compliance review
- updated work-session doc for the responsible agent

### Required before final handoff
- aggregate lint/typecheck strategy appropriate to changed files
- manual verification of:
  - empty state
  - ask/search submission
  - graph mutation
  - add-related-record flow
  - default entry surface behavior

---

## Recommended execution order

1. Task 1 — create work-session docs
2. Task 2 — trust-breaking interaction fixes
3. Task 3 — prune competing primary surfaces
4. Task 4 — consolidate duplicate shell structures
5. Task 5 — begin context/store responsibility reduction
6. Task 6 — update planning/tracking docs throughout

---

## Multi-agent execution protocol

For same-session execution:

- use **subagent-driven-development**
- assign independent tasks to fresh implementation agents
- require each agent to update its own work-session doc
- run **spec review first**, then **code-quality review**
- do not move to the next task with unresolved review findings

Potential parallelization:

- Task 2 and Task 4 can partially proceed in parallel after work-session docs exist, if files do not overlap
- Task 3 should follow once the trust-breaking baseline is fixed
- Task 5 should begin only after the canonical shell/direction is stable enough to avoid churn

---

## Definition of success

The implementation is successful when:

- the graph canvas is unmistakably the primary product surface
- visible intelligence and connection affordances materially affect graph state
- secondary surfaces no longer compete with the core experience
- the shell architecture is clearer and less duplicative
- active implementation work is fully tracked through per-agent work-session docs
