# Research Canvas Gen-UI Fit — Pseudocode

**Date:** 2026-08-09
**Status:** analysis only
**Surface:** `/research-canvas` → `features/mindmap` shell
**Parents:** GenerativeUiAgentsFit.md + deep-research-agent-fit.canvas.tsx

## Goal

Apply Deep Research loop + Dashboard Canvas shared-state pattern onto the live
research-canvas shell without a sidecar Workspace or new agent runtime.

## Session shape (extend T-027)

```
researchSession = {
  ...existing, // sessionId, activeMode, pinnedCards, canvasNotes, analysisResults
  plan: [{ id, content, status }],
  sources: [{ id, kind: 'neon'|'exa'|'vector', title, ref, tier? }],
  artifacts: [{ id, kind: 'dossier', content, createdAt }],
}
```

## Pseudocode

```
// RC-P0
ON AgentToolEvent update in EnhancedAnimatedChat:
  RENDER ToolCard(tool, status, parameters, resultSummary)
  // replace status pills for known tools

// RC-P1
ON useMindMapAgent processSseLine tool complete:
  MATCH tool:
    searchDatabase          → researchSession.sources += neon hits
    searchExternalResources → researchSession.sources += exa hits
    addGraphNodes/Edges     → (graph write stays in graph.tsx)
  addSessionEvent(...)

// RC-P2
ON typer card "Deep Research" OR toggleDeepResearch:
  setResearchMode('research')
  setDeepResearchEnabled(true)
  runAgentQuery({
    message,
    researchFocus: 'deep-research',
    graphState: buildAgentGraphState(),
    sessionState: serialize(researchSession),  // NEW — Dashboard Canvas pattern
  })

// Server (/api/disclosure/mindmap) when researchFocus == deep-research:
  system += "PLAN first, then corpus search, then external, then dossier"
  // prefer existing tools; add planInvestigation + writeResearchDossier when ready

// RC-P3
ON writeResearchDossier complete OR deep-research final analysis:
  researchSession.artifacts.push(dossier)
  open SynthesisPanelHost with artifact content OR trigger synthesizeInvestigation
  badge epistemic tiers; optional insertAgentInference (never retrieval)

// RC-P4 (after T-050 render)
ON researchSession.plan change:
  project plan steps as on-canvas waypoints (same React Flow)
  DO NOT mount a second React Flow for the plan
```

## Non-goals on this surface

- No CopilotKit Workspace pane beside Graph
- No KPI Recharts dashboard as canvas content
- No Gen-UI hosted in `features/research-canvas/*` Storybook islands
- No new state in `mindmap-context.tsx`
