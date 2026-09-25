# Mindmap Feature — Agent Guidance

**Guide context updated:** 2026-09-13 16:44:15 CDT (UTC−05:00). **Status:** source-verified; runtime not tested in this documentation pass.

## Research Canvas — purpose and boundaries

Research Canvas is the entity/relationship research workspace at `/research-canvas`, owned by this mindmap feature. For the combined instructional entry point, current Spacetime behavior, donor provenance, design/mockup/source-imagery references, Storybook distinctions and open decisions, start at [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md). The requested unified rendered presentation is still pending the user's format decision; the source guide is not that rendered deliverable.

The live nested [`apps/app/src/features/mindmap/research-canvas/`](apps/app/src/features/mindmap/research-canvas/) supplies ViewSwitcher and canvas UI. The separate older [`apps/app/src/features/research-canvas/`](apps/app/src/features/research-canvas/) collection does not own this route. [`apps/app/src/features/research-platform/living-research-canvas/LivingResearchCanvas.stories.tsx`](apps/app/src/features/research-platform/living-research-canvas/LivingResearchCanvas.stories.tsx) is a presentation prototype with story fixtures, not the live MindMap graph. Its sibling Temporal Observatory prototype is not the live `/spacetime` route either.

For feature-local component examples, open [`apps/app/src/features/mindmap/research-canvas/tool-card.stories.tsx`](apps/app/src/features/mindmap/research-canvas/tool-card.stories.tsx) (**Research Canvas/ToolCards**: completed, streaming, zero-match and unknown-tool cases). These stories do not prove full-route behavior. Final UX expectations, prototype consolidation and rendered documentation format remain open; this guide grants no implementation or deletion approval.

**Historical architecture audit (not current runtime acceptance):** [`docs/archive/2026-03-29-research-canvas-frontend-architecture-audit.md`](docs/archive/2026-03-29-research-canvas-frontend-architecture-audit.md)

File references in this file must be markdown links whose href is the workspace path from repo root (see [`AGENTS.md`](AGENTS.md#markdown-file-links-binding)). No `../` climbs and no `@/` hrefs.

## Canonical Render Path

```
(site)/research-canvas/page.tsx
  -> MindMap (index.tsx -> mind-map.tsx)  [16 lines, the only live shell]
    -> ReactFlowProvider + MindMapProvider
      -> ViewSwitcher (canvasContent=<Graph />)
        -> Graph | TimelineView | SightingsView | SearchView | DetailView
```

Cmd-click: [`apps/app/src/app/(site)/research-canvas/page.tsx`](apps/app/src/app/(site)/research-canvas/page.tsx) → [`index.tsx`](index.tsx) / [`mind-map.tsx`](mind-map.tsx) → [`apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx). ViewSwitcher returns only the selected view; its source notes that MenuTrigger is mounted globally. The nested globe case loads the legacy mindmap sightings peer, not `/spacetime` or the standalone sightings routes.

## Dead Code — Do Not Extend or Debug

These files have zero production consumers (names only — they are not in the tree to open):

- `smart-mindmap.tsx`, `smart-mindmap-with-auto-connections.tsx`, `smart-mindmap-with-shared-context.tsx`
- `smart-graph.tsx` (feature root — `components/smart-graph/` is separate)
- Ghost routes: `(site)/disclosure/`, `(site)/search-and-discovery-interface/`, `(site)/content-card-detail-view/`, `(site)/ufo-sightings/`

## State Management

- [`store/mindmap-ui-store.ts`](store/mindmap-ui-store.ts) — healthy Zustand store, no changes needed to structure
- [`apps/app/src/contexts/mindmap/mindmap-context.tsx`](apps/app/src/contexts/mindmap/mindmap-context.tsx) — 1,363-line god-object; contains pure factory functions, layout helpers, UI useState, and data-fetch effects that all belong elsewhere. Do not add more logic here. See audit plan for decomposition steps.
- Navigation goes through Zustand `setActiveView()`, NOT `router.push()`. The `path` fields in `FullScreenMenu.VIEWS` are stale/decorative.

## FloatingToolbar Duplication

Two unrelated implementations exist:

- [`research-canvas/FloatingToolbar.tsx`](research-canvas/FloatingToolbar.tsx) — LIVE (imported by [`graph.tsx`](graph.tsx))
- [`components/menus/mindmap-side-menu/FloatingToolbar.tsx`](components/menus/mindmap-side-menu/FloatingToolbar.tsx) — Storybook only, not in main render path

Always import from `research-canvas/FloatingToolbar` when working with the canvas.

## Voice Contract — Ultraterrestrial Identity (2026-07-08)

North star: **"an integrated research narrative engine for anomalous knowledge."** Full vision: [`docs/archive/vision/2026-07-08-memory-first-vision-capture.md`](docs/archive/vision/2026-07-08-memory-first-vision-capture.md); implementation review: `...-vision-review.md`.

Every prompt, tour narrative, hypothesis, and UI copy string in this feature MUST:

1. **Label the epistemic tier** — sourced evidence / claim / inference / speculation / mythic resonance. Evidentiary states: `[Observed] [Corroborated] [Contested] [Inferred] [Speculative] [Resonant] [Unverified] [Disconfirmed]`.
2. **Never say "proves"** — say "is consistent with", "was claimed", "remains unexplained".
3. **Pair every reading with a counter-reading** — the anti-echo-chamber mechanism.
4. **Follow the liturgy** for synthesis: what we know → what we think → what echoes → what breaks → what remains open → next trace.
5. **End on falsifiability or a next trace**, never on closure the evidence doesn't warrant.

Rubric for review — does the output: respect the strangeness / protect the evidence / map the relationships / refuse premature closure? All four or it isn't Ultraterrestrial.

**Terminology ruling (Liam, 2026-07-08) — "claim" is RESERVED.** A claim is a discrete assertion extracted from SOURCE material (human testimony, documents). AI output is never a claim — it is an **inference**, part of the analytical layer. Persisted agent analysis lives in the `agent_inferences` table (`@db/postgres`: `insertAgentInference`/`getInferencesForRecord`) and must NEVER feed retrieval, search, or suggestions. Its legitimate roles: auditable analytical trail, and (Phase 2) support attached to a user-owned `theory`. Never name a table, type, or UI surface "claim(s)" unless its content is source-extracted.

Reference implementations: [`actions/enrich-hypothesis.ts`](actions/enrich-hypothesis.ts) (liturgy schema), the Improbable Moon tour narrative (extracted to [`docs/design/tour-narrative-canon.md`](docs/design/tour-narrative-canon.md) when the dead tour-generation system was deleted 2026-07-23), the two live route prompts.

<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>
