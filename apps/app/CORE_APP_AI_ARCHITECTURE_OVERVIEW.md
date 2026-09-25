# UltraTerrestrial AI Architecture Overview

**MANDATORY FIRST READ FOR ALL AGENTS**

After finishing this document you must then read `CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md` and `CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md`

- [CONTEXTUAL_INTELLIGENCE_DOCUMENTATION](CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md)
- [CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE](CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md)

> **📁 Context:** This document describes the AI infrastructure primarily located in the `apps/app/` directory. All file paths and components referenced are within the main application package (`@/app`).

## 🏗️ Foundational AI Infrastructure (`@/app`)

### Core AI Layer (The Foundation)

Located in `apps/app/src/features/ai/` and `apps/app/src/services/ai/`

- **"Prometheus" OpenAI Assistant** - Core AI powering all intelligence
  - Implementation: `apps/app/src/features/agents/prometheus.tsx`
  - Prompts: `apps/app/src/services/ai/prompts/prometheus.prompt.ts`
  - API Routes: `apps/app/src/app/api/chat/route.ts`
- **Vector Storage + Database Search** - Dual approach (Xata vector + PostgreSQL)
  - Database Operations: `apps/app/src/db/xata/db/search-operations.ts`
  - AI Actions: `apps/app/src/features/ai/actions/`
- **RAG Integration** - Vector storage provides intelligence layer
  - Knowledge Base: `apps/app/src/features/ai/knowledge/`
  - Composite Layer: `apps/app/src/features/ai/knowledge/composite-knowledge-layer.md`
- **Database Methods** - `askXata`, `askXataComprehensive`, `searchXata`
  - Implementation: Various files in `apps/app/src/features/mindmap/actions/`

**CRITICAL UNDERSTANDING:** This AI foundation powers ALL systems below.

## 🎯 System Integration Hierarchy (`@/app/src/features/`)

```
WORKING AI PATHS (verified 2026-03-29 by 4-specialist roundtable audit):

1. Disclosure Mindmap Agent — THE ONLY END-TO-END AI PATH
   📁 apps/app/src/app/api/disclosure/mindmap/route.ts
   ├── Protocol: OpenAI Assistants API + custom SSE bridge
   ├── Tools: file_search (OpenAI vector store) + searchDatabase (Xata) + searchExternalResources (Exa)
   ├── Client: features/mindmap/hooks/use-mindmap-agent.ts → graph nodes/edges
   └── Status: Working in production

2. Prometheus Chat — STANDALONE CONVERSATIONAL CHAT (separate protocol)
   📁 apps/app/src/app/api/prometheus/chat/route.ts
   ├── Protocol: Vercel AI SDK streamText
   ├── Tools: searchUAP, searchExternalResources, researchExternalTopic, processDocument
   └── Status: Functional but separate from graph canvas

FOUNDATION UTILITIES (these exist and work):

Contextual Intelligence (✅ COMPLETE)
📁 apps/app/src/features/mindmap/utils/contextual-intelligence.ts
├── Graph context, relationship filtering, smart suggestions
└── Export: `getGraphContext()`, `GraphContext` interface

Spatial Intelligence (✅ COMPLETE)
📁 apps/app/src/features/mindmap/hooks/use-spatial-grouping.ts
├── R-Tree indexing for O(log n) proximity queries
└── Export: `useSpatialGrouping()`

Enhanced Nodes (✅ COMPLETE)
📁 apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx
├── One node type in React Flow with smart badges
└── Used by graph canvas

WHAT DOES NOT EXIST (corrected myths — do not reference these):

✗ Triple RAG (40/40/20) — Only OpenAI file_search + Xata full-text search work
✗ Multi-agent tour orchestrator — 6 agent classes specced July 2025, zero code, SCRAPPED
✗ "85% AI connectivity" — One end-to-end path works; the rest are broken or dead
✗ Smart Tours "85% Complete" — Tour UI exists but agent orchestrator was never built
✗ Python RAG connection — apps/disclosure-rag/ is completely disconnected from this app
```

## 📂 @/app Directory Structure Overview

```
apps/app/src/
├── features/
│   ├── ai/                     # AI Pipeline Integration
│   │   ├── knowledge/          # Composite Knowledge Layer
│   │   ├── actions/            # AI Actions & Workflows
│   │   └── pipelines/          # Unified AI Pipelines
│   ├── agents/                 # AI Agents (Prometheus, etc.)
│   ├── mindmap/                # Core Mind Map Features
│   │   ├── utils/              # → contextual-intelligence.ts
│   │   ├── hooks/              # → use-spatial-grouping.ts
│   │   ├── nodes/              # → enhanced-node-poc.tsx
│   │   ├── tours/              # Smart Tour System
│   │   └── actions/            # Mind Map AI Actions
│   └── sightings/              # Sightings Analysis
├── services/
│   └── ai/                     # AI Service Layer
│       ├── prompts/            # AI Prompts (Prometheus, etc.)
│       ├── openai/             # OpenAI Integration
│       └── workflows/          # AI Workflows
├── app/
│   └── api/                    # API Routes
│       ├── chat/               # → Prometheus Chat API
│       └── disclosure/         # → Disclosure-specific APIs
└── contexts/                   # React Contexts
    ├── ai/                     # AI Context Providers
    └── mindmap/                # Mind Map Context
```

## 🔗 Critical Integration Points (`@/app/src/`)

### Enhanced Nodes (`features/mindmap/nodes/enhanced-node-poc.tsx`)

```typescript
// Import path within @/app
import { EnhancedEntityNodePOC } from '@/features/mindmap/nodes/enhanced-node-poc'
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
```

- **Used by:** ALL systems (Contextual, Spatial, Tours, Agentic)
- **Purpose:** Common UI layer with smart badges
- **Integration:** 100% - all systems use this foundation

### Spatial Grouping (`features/mindmap/hooks/use-spatial-grouping.ts`)

```typescript
// Import path within @/app
import { useSpatialGrouping } from '@/features/mindmap/hooks/use-spatial-grouping'
import { useTourWithSpatialIntelligence } from '@/features/mindmap/tours/hooks/use-tour-with-spatial-intelligence'
```

- **Used by:** Spatial Intelligence, Smart Tours, Research Canvas
- **Purpose:** Intelligent node clustering and proximity analysis
- **Integration:** Complete with contextual intelligence

### Contextual Intelligence Core (`features/mindmap/utils/contextual-intelligence.ts`)

```typescript
// Import path within @/app
import { getGraphContext, type GraphContext } from '@/features/mindmap/utils/contextual-intelligence'
```

- **Powers:** Smart badges, filtering, suggestions, tour progression
- **Integration:** Foundation for all other systems
- **Status:** Production-ready and actively used

### Prometheus AI Integration (`features/agents/prometheus.tsx`)

```typescript
// Import paths within @/app
import { Prometheus } from '@/features/agents/prometheus'
// API endpoint: /api/prometheus/chat (apps/app/src/app/api/prometheus/chat/route.ts)
```

- **Powers:** Standalone conversational AI (NOT graph-connected)
- **Route:** `/api/prometheus/chat` (Vercel AI SDK streamText)
- **Vector Store:** Referenced via `OPENAI_VECTOR_STORE_ID` env var

## 📊 Current Status Matrix (`@/app` Implementation, grounded 2026-03-29)

| System | Status | File Location (apps/app/src/) | Notes |
|--------|--------|-------------------------------|-------|
| Disclosure Mindmap Agent | ✅ WORKING | `app/api/disclosure/mindmap/route.ts` | Only working e2e AI path |
| Prometheus Chat | ✅ WORKING | `app/api/prometheus/chat/route.ts` | Standalone chat, separate protocol |
| Contextual Intelligence | ✅ COMPLETE | `features/mindmap/utils/contextual-intelligence.ts` | Foundation utility |
| Spatial Intelligence | ✅ COMPLETE | `features/mindmap/hooks/use-spatial-grouping.ts` | Foundation utility |
| Enhanced Nodes | ✅ COMPLETE | `features/mindmap/nodes/enhanced-node-poc.tsx` | One React Flow node type |
| Auth Middleware | ❌ MISSING | N/A | All routes publicly accessible |
| Graph Pagination | ❌ MISSING | `packages/db/.../xyflow-integration.ts` | Loads all 230,998 records |
| Multi-agent Tours | ❌ SCRAPPED | N/A | Never started, do not revive |

## ⚠️ CRITICAL FOR AGENTS

### BEFORE STARTING ANY TASK

1. **Only one AI path works end-to-end** — disclosure/mindmap route. Prometheus chat is separate.
2. **Contextual Intelligence is a utility** — it provides graph context, not an AI pipeline
3. **Do not add state to mindmap-context.tsx** — it's a 1,363-line god-object scheduled for decomposition
4. **Navigation uses Zustand** `setActiveView()`, NOT `router.push()`
5. **Read the hardening plan** — `docs/plans/2026-03-29-roundtable-unified-action-plan.md`

### COMMON MISTAKES TO AVOID

- Assuming Triple RAG, multi-agent tours, or "85% AI connectivity" exist — they do not
- Extending dead code (4 ghost routes, 4 smart-mindmap shell variants)
- Treating the Python RAG system as connected to this app
- Adding logic to mindmap-context.tsx instead of Zustand store

### REQUIRED READING ORDER

1. **This document** (ARCHITECTURE_OVERVIEW.md)
2. **CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md** - Core AI layer understanding
3. **System-specific documentation** for your task area
4. **Code exploration** - Only after understanding architecture

## 🎯 Integration Philosophy

**"Orchestration over Replacement"**

- Existing infrastructure is sophisticated and well-integrated
- New features should leverage existing systems
- Polish and complete existing integration rather than rebuild
- Natural language and AI layers should orchestrate existing tools

## 📋 Quick Architecture Validation

Can you answer these before starting your task?

- [ ] Which route is the only working end-to-end AI path? (`/api/disclosure/mindmap`)
- [ ] What protocol does it use? (OpenAI Assistants API + SSE)
- [ ] What is the canonical render path for the research canvas? (page.tsx -> MindMap -> ViewSwitcher -> Graph)
- [ ] Where does UI state live? (Zustand `mindmap-ui-store.ts`, NOT mindmap-context.tsx)
- [ ] What is dead code in this codebase? (4 ghost routes, 4 smart-mindmap shells)

**If you can't answer these, read the documentation first.**

---

**Last Updated:** 2026-03-29 (grounded by 4-specialist roundtable audit)
**Status:** Living document - update as architecture evolves
**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`

## 🔧 Development Integration Examples

### Using Contextual Intelligence in @/app Components

```typescript
// Example: apps/app/src/features/mindmap/components/example.tsx
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'

export function ExampleComponent() {
  const { getNodes } = useMindMap()
  const graphContext = getGraphContext(getNodes())
  
  // Use contextual intelligence data
  const isContextual = graphContext?.connectedEntityTypes.has('personnel')
}
```

### Integrating Spatial Intelligence

```typescript
// Example: apps/app/src/features/mindmap/components/spatial-example.tsx
import { useSpatialGrouping } from '@/features/mindmap/hooks/use-spatial-grouping'

export function SpatialExample() {
  const { spatialGroups, createSpatialGroup } = useSpatialGrouping({
    minGroupSize: 2,
    maxGroupDistance: 150
  })
}
```

### Prometheus Chat Integration

```typescript
// Example: apps/app/src/features/ai/components/ai-example.tsx
// API Call to Prometheus (standalone chat, NOT graph-connected)
const response = await fetch('/api/prometheus/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Analyze this UFO sighting...' }]
  })
})
```

### Disclosure Mindmap Agent (graph-connected AI)

```typescript
// The disclosure mindmap agent is consumed via useMindMapAgent hook:
// apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts
// It streams SSE events that get transformed into graph nodes/edges
// See: apps/app/src/features/mindmap/graph.tsx (runAgentQueryAndAddNodes)
```
