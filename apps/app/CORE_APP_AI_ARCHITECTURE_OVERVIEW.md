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
Contextual Intelligence (✅ COMPLETE - June 2025)
📁 apps/app/src/features/mindmap/utils/contextual-intelligence.ts
├── Foundation layer for all AI features
├── Powers: Context detection, relationship filtering, smart suggestions
└── Export: `getGraphContext()`, `GraphContext` interface

↓ Built on Contextual Intelligence ↓

Spatial Intelligence (✅ COMPLETE - June 2025)  
📁 apps/app/src/features/mindmap/hooks/use-spatial-grouping.ts
📁 apps/app/src/features/mindmap/tours/hooks/use-tour-with-spatial-intelligence.ts
├── R-Tree indexing for O(log n) proximity queries
├── 150px threshold, 2-second triggers
└── Export: `useSpatialGrouping()`, `useTourWithSpatialIntelligence()`

↓ Leverages Both Above ↓

Smart Tour Integration (✅ 85% Complete - July 2025)
📁 apps/app/src/features/mindmap/tours/
├── Enhanced nodes with AI-powered badges
├── Tour-specific contextual intelligence
├── Historical significance detection
└── Tools: `apps/app/src/features/mindmap/tours/tools/`

↓ Natural Language Layer ↓

Agentic Tours (📋 Planning - July 2025)
📁 apps/app/src/features/mindmap/tours/hooks/
├── Natural language tour control
├── Leverages all above systems through tool interfaces
└── Philosophy: Orchestration over Replacement
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
// API endpoint: /api/chat (apps/app/src/app/api/chat/route.ts)
```

- **Powers:** All AI conversations and analysis
- **Integration:** Connected to all knowledge systems
- **Vector Store:** `vs_meWOEnUiUxtQWf0W6NBsNpCG`

## 📊 Current Status Matrix (`@/app` Implementation)

| System | Status | File Location (apps/app/src/) | AI Connectivity |
|--------|--------|-------------------------------|-----------------|
| Contextual Intelligence | ✅ COMPLETE | `features/mindmap/utils/contextual-intelligence.ts` | 100% |
| Spatial Intelligence | ✅ COMPLETE | `features/mindmap/hooks/use-spatial-grouping.ts` | 100% |
| Smart Tours | ✅ 85% Complete | `features/mindmap/tours/` | 85% |
| Enhanced Nodes | ✅ COMPLETE | `features/mindmap/nodes/enhanced-node-poc.tsx` | 100% |
| Prometheus Integration | ✅ COMPLETE | `features/agents/prometheus.tsx` | 100% |
| Agentic Tours | 📋 Planning | `features/mindmap/tours/hooks/` | TBD |

## ⚠️ CRITICAL FOR AGENTS

### BEFORE STARTING ANY TASK

1. **Understand this hierarchy** - Don't treat systems as separate
2. **85% AI connectivity ≠ low integration** - This represents sophisticated functional integration
3. **Most integration already exists** - You're likely polishing, not building from scratch
4. **Contextual Intelligence is the brain** - All other systems depend on it

### COMMON MISTAKES TO AVOID

- Planning to "connect" already-connected systems
- Treating 85% connectivity as incomplete
- Missing the unified AI foundation
- Assuming systems need architectural overhaul
- Reverse-engineering from code without reading documentation

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

- [ ] What is Prometheus and how does it power the system?
- [ ] How does Contextual Intelligence serve as the foundation?
- [ ] Which systems are already integrated and how?
- [ ] What does "85% AI connectivity" actually represent?
- [ ] How does your task relate to existing infrastructure?

**If you can't answer these, read the documentation first.**

---

**Last Updated:** July 15, 2025  
**Status:** Living document - update as architecture evolves  
**Critical:** This must be the first document any agent reads

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

### Prometheus AI Integration

```typescript
// Example: apps/app/src/features/ai/components/ai-example.tsx
// API Call to Prometheus
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Analyze this UFO sighting...' }]
  })
})
```
