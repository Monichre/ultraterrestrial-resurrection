# Mindmap Core Surface Multi-Agent Review

**Date:** 2026-03-13  
**Scope:** `apps/app/src/features/mindmap/`, `apps/app/src/contexts/mindmap/`  
**Objective:** Prune, plan, and enhance the core mindmap surface and product UI around a coherent, trustworthy user experience.

---

## Review Goal

Conduct a multi-perspective review of the current mindmap/research-canvas product surface, identify where the product experience is fragmented or misleading, and define a clear direction for convergence.

---

## Shared Conclusion Across Reviewers

All review perspectives converged on the same core recommendation:

- the **graph canvas should be the primary product surface**
- the current system exposes **too many competing primary surfaces**
- several premium-looking surfaces currently **overpromise intelligence or completeness**
- the architecture is making it too easy to add parallel experiences instead of sharpening one coherent workspace

The product problem is primarily one of **trust and coherence**, not visual styling.

---

## Agent Reports

### 1. Product UX Review

**Persona:** Research analyst seeking a trustworthy graph-first investigation workspace

#### Findings

1. The clearest existing user loop is already graph-first: ask/search → create a query node → reveal related records → inspect graph relationships.
2. `ViewSwitcher` currently elevates canvas, timeline, globe, search, and detail as peer surfaces, which weakens product orientation.
3. Trust breaks because several “smart” and “AI” interactions look production-ready but do not always mutate state or deliver meaningful outcomes.
4. Query flow has been duplicated in places, creating opportunities for inconsistency and accidental double work.
5. The surface exposes too much internal product machinery too early (command concepts, multiple modes, system-like controls).

#### Recommendation

Make the **graph canvas the only true primary surface**. Search, tours, detail, and timeline should assist graph-building and investigation rather than compete with it.

#### Priority Prune List

- demote standalone search/discovery as a peer core mode
- demote standalone sightings/globe as a peer core mode
- demote standalone detail as a peer core mode
- demote standalone timeline unless it directly controls graph exploration
- hide or rework smart-connection affordances that do not actually add to the graph
- reduce control density around the graph’s primary workspace

#### Risk if Unchanged

Users will continue to experience the product as multiple half-finished surfaces rather than one strong research environment.

---

### 2. Architecture Review

**Persona:** Senior software architect - state management and React architecture specialist

#### Findings

1. `mindmap-context.tsx` is oversized and mixes graph state, layouting, orchestration, fetching, persistence, and UI concerns.
2. There are overlapping state/control layers: Zustand graph store, context orchestration layer, and persisted UI store.
3. Provider composition is implicit and spread across multiple entry points.
4. Layout logic is distributed across context, hooks, component effects, and utility modules.
5. `ViewSwitcher` breaks the graph-first shell model by treating alternate surfaces as replacements instead of graph-attached lenses.

#### Recommendation

Move toward a **single graph-first shell** with:

- Zustand as the clearer source of truth
- smaller composable hooks for layout, fetching, and graph mutation
- fewer competing entry points
- alternate views expressed as panels, overlays, or supporting lenses rather than peer shells

#### Priority Refactors

- split `mindmap-context.tsx` responsibilities
- reduce context re-exporting of store behavior
- consolidate `MindMap` / `SmartMindmap` / related shell variants
- simplify view-switching to support one canonical surface

#### Risk if Unchanged

The codebase will remain difficult to reason about, difficult to test, and increasingly vulnerable to state desync and accidental UX divergence.

---

### 3. Mindmap Design Surface Review

**Persona:** Mindmap product surface architect

#### Findings

1. The current product behaves more like an advanced toolkit than a sharply opinionated research environment.
2. The graph is still the strongest differentiator and should remain central.
3. The research-canvas concept is valuable, but it currently reads as adjacent to the graph rather than deeply unified with it.
4. Several specialized views and controls compete with the graph instead of reinforcing it.
5. The product needs a stronger and simpler visible story.

#### Preserve

- graph as the core primitive
- enhanced/contextual node foundations
- research-canvas composition concept
- layered power-user depth

#### Cut or Demote

- duplicated or parallel entry points
- debug-like or system-heavy affordances from the primary surface
- top-level modes that should instead be secondary lenses
- excessive control chrome competing with the graph itself

#### North Star Experience

A **single investigative workspace** with two tightly linked states:

- **Explore mode:** inspect, search, expand, filter, navigate
- **Compose mode:** pin, annotate, collect, synthesize

These should feel like one workspace, not multiple products.

---

### 4. Implementation Risk Review

**Persona:** Senior code reviewer - implementation risk and code quality analyst

#### Findings

1. Duplicate hover-panel directories have diverged and create maintenance risk.
2. Multiple “smart” shell variants and wrappers create entry-point ambiguity.
3. Placeholder or mock behavior still exists in important production-facing paths.
4. Duplicate/overlapping action files continue to increase confusion.
5. The current provider/context layer is oversized and high-risk to evolve without deliberate sequencing.

#### Safe High-Leverage Fixes

- audit and consolidate duplicate hover panels
- add deprecation guidance to legacy wrappers
- remove obvious dead/demo clutter from the core path
- extract pure helpers from the main context layer
- fix trust-breaking interactions incrementally before broad structural changes

#### Risk if Unchanged

The feature area will continue to accumulate debt, confuse contributors, and ship surfaces that look stronger than they actually are.

---

## Cross-Agent Discussion Synthesis

### Agreements

Across product, architecture, design-system, and implementation-risk reviews, all agents agreed that:

1. **The graph canvas is the true product core**  
   Even when alternate routes and views exist, the strongest differentiated experience is graph-led investigation.

2. **Too many surfaces compete for primacy**  
   Search, timeline, globe, tours, detail views, and contextual intelligence all currently behave as if they are primary.

3. **Trust is the main product issue**  
   Placeholder or duplicated behaviors are more damaging right now than visual inconsistency.

4. **Architecture is enabling fragmentation**  
   The current layering makes it easier to add parallel experiences than to deepen the core one.

5. **Pruning should precede broad enhancement**  
   The system needs less surface competition before it needs more polish.

---

## Recommended Direction

### Core Product Decision

Adopt a **graph-first single-workspace strategy**.

### Product Rule

The graph canvas is home. Every other important surface must either:

1. mutate the graph,
2. explain the graph,
3. guide graph exploration,
4. or be demoted/removed.

### Core UX Structure

#### Primary

- graph canvas
- one primary ask/search/research console
- inspect / expand / save-note actions

#### Secondary

- tours
- timeline filtering
- asset/document ingestion
- contextual recommendations
- detail inspection

#### Tertiary / Prunable

- peer alternate full-screen modes
- duplicated or fake AI affordances
- debug/power-user complexity in the default path

---

## Immediate Product Gaps Confirmed in Code

The review also validated several concrete implementation issues that directly impact the core product:

- `research-canvas-console.tsx` previously duplicated agent invocation, causing double workflow submission (now externally updated and should be treated as already in-flight or recently corrected)
- `enhanced-node-poc.tsx` still contains a placeholder add-connection interaction path
- `node-connection-overlay.tsx` has been externally updated toward label-based behavior and should be treated as active refactor territory
- `connected-records-panel.tsx` has active add-to-graph wiring and should be treated as a real supporting surface rather than a stub
- `EmptyCanvas.tsx` copy now better reflects real controls and indicates the product is already evolving toward a more honest primary workflow

These active file changes should be treated as current baseline when implementation begins.

---

## Roadmap Summary

### Phase 1 — Trust and Coherence

Focus on making the current graph-first surface honest and reliable:

- eliminate duplicate submission flows
- wire or hide fake “add connection” affordances
- ensure semantic analysis uses visible node titles/labels, not ID heuristics
- align onboarding copy with real controls
- make the default graph shell feel like the obvious core experience

### Phase 2 — Surface Pruning

Reduce competing primary experiences:

- define one canonical entry point for the mindmap product
- demote alternate view modes into supporting lenses/panels
- reduce bottom-surface and menu complexity
- consolidate duplicate shell variants and parallel panel systems

### Phase 3 — Architecture Simplification

Align implementation with product direction:

- split `mindmap-context.tsx`
- strengthen Zustand/store-first responsibility boundaries
- move layout, orchestration, and mutation logic into smaller focused modules/hooks
- retire duplicated or legacy shell variants

---

## Outcome

The recommended path is to make the mindmap a **single graph-first investigative workspace** where alternate capabilities support the graph instead of competing with it.

This is the clearest route to improving both product clarity and implementation quality.
