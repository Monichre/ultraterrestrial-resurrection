# Agent Onboarding Checklist

**MANDATORY FOR ALL NEW AGENTS**

> **📁 Context:** This checklist covers the AI infrastructure primarily located in the `apps/app/` directory. All system components and file references are within the main application package (`@/app`).

## 📋 REQUIRED READING ORDER (NO EXCEPTIONS)

### Phase 1: Foundation Understanding

- [ ] [**CORE_APP_AI_ARCHITECTURE_OVERVIEW.md**](apps/app/CORE_APP_AI_ARCHITECTURE_OVERVIEW.md) - System foundation and integration hierarchy (`@/app` context)
- [ ] [**CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md**](apps/app/CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md) - System comparison matrix
- [ ] [**CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md**](apps/app/CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md) - Core AI layer understanding  

### Phase 2: @/app Directory Familiarization

- [ ] Understand the `apps/app/src/` directory structure
- [ ] Locate key system files:
  - [ ] `app/api/disclosure/mindmap/route.ts` — the ONLY working e2e AI path
  - [ ] `app/api/prometheus/chat/route.ts` — standalone chat (separate protocol)
  - [ ] `features/mindmap/hooks/use-mindmap-agent.ts` — SSE client for disclosure agent
  - [ ] `features/mindmap/graph.tsx` — core React Flow canvas (359 lines)
  - [ ] `features/mindmap/mind-map.tsx` — canonical shell (16 lines, only live shell)
  - [ ] `features/mindmap/utils/contextual-intelligence.ts` — foundation utility
  - [ ] `features/mindmap/store/mindmap-ui-store.ts` — healthy Zustand store
- [ ] Read `features/mindmap/CLAUDE.md` for dead code list and render path

### Phase 3: Task-Specific Documentation

- [ ] Read documentation specific to your assigned task area
- [ ] Review relevant work logs and implementation status
- [ ] Understand your task's relationship to existing systems

### Phase 4: Validation Questions

Answer these BEFORE starting any work:

#### AI Architecture Understanding (grounded 2026-03-29)

- [ ] Which route is the ONLY working end-to-end AI path?
  - **Answer:** `/api/disclosure/mindmap` (OpenAI Assistants API + SSE + Xata search + graph nodes)
  - **File:** `apps/app/src/app/api/disclosure/mindmap/route.ts`
- [ ] What is the Prometheus chat route and how does it differ?
  - **Answer:** `/api/prometheus/chat` — standalone Vercel AI SDK `streamText`, NOT graph-connected
  - **File:** `apps/app/src/app/api/prometheus/chat/route.ts`
- [ ] What search systems actually work in the Next.js app?
  - **Answer:** OpenAI file_search (vector store) + Xata full-text search. Nothing else.
  - ~~Triple RAG~~, ~~FAISS~~, ~~Upstash Vector~~, ~~CocoIndex~~ do NOT exist here.
- [ ] What is Contextual Intelligence?
  - **Answer:** A utility that provides graph context and relationship filtering, NOT an AI pipeline
  - **File:** `apps/app/src/features/mindmap/utils/contextual-intelligence.ts`

#### Canonical Render Path

- [ ] Can you trace the research canvas render path?
  ```
  (site)/research-canvas/page.tsx
    -> MindMap (features/mindmap/mind-map.tsx)  [16 lines, only live shell]
      -> ReactFlowProvider + MindMapProvider
        -> ViewSwitcher -> Graph | TimelineView | SightingsView | SearchView | DetailView
  ```

#### State Management

- [ ] Where does UI state live?
  - **Answer:** Zustand `mindmap-ui-store.ts` — healthy, well-typed slices
  - **NOT** in `mindmap-context.tsx` (1,363-line god-object, do not add logic here)
- [ ] How does navigation work?
  - **Answer:** Zustand `setActiveView()`, NOT `router.push()`

#### Dead Code Awareness

- [ ] Do you know what NOT to extend?
  - Ghost routes: `(site)/disclosure/`, `(site)/search-and-discovery-interface/`, `(site)/content-card-detail-view/`, `(site)/ufo-sightings/`
  - Dead shells: `smart-mindmap.tsx`, `smart-mindmap-with-auto-connections.tsx`, `smart-mindmap-with-shared-context.tsx`, `smart-graph.tsx`

#### Security Awareness

- [ ] Do you know about the auth gap?
  - **Answer:** No authentication middleware exists. Every API route is publicly accessible.
  - Planned fix: Clerk middleware in `apps/app/src/middleware.ts`

#### Import Patterns

- [ ] Can you write correct import statements?

  ```typescript
  // Database
  import { XataClient } from '@db/xata'
  import { askXata, searchXata } from '@db/xata/api'

  // Mindmap agent hook
  import { useMindMapAgent } from '@/features/mindmap/hooks/use-mindmap-agent'

  // Zustand store (preferred for UI state)
  import { useMindMapUiStore } from '@/features/mindmap/store/mindmap-ui-store'

  // Contextual Intelligence utility
  import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
  ```

#### Task Relationship Understanding

- [ ] How does your task relate to the hardening plan?
  - **Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`
- [ ] Are you building on the working path or creating something new?
- [ ] Have you checked the feature-local CLAUDE.md for your area? (`features/mindmap/CLAUDE.md`)

## 🗂️ @/app Directory Structure Awareness

Verify you understand this structure:

```
apps/app/src/
├── features/
│   ├── ai/                     # AI Pipeline Integration
│   │   ├── knowledge/          # Composite Knowledge Layer
│   │   ├── actions/            # AI Actions & Workflows
│   │   └── pipelines/          # Unified AI Pipelines
│   ├── agents/                 # → prometheus.tsx
│   ├── mindmap/                # Core Mind Map Features
│   │   ├── utils/              # → contextual-intelligence.ts
│   │   ├── hooks/              # → use-spatial-grouping.ts
│   │   ├── nodes/              # → enhanced-node-poc.tsx
│   │   ├── tours/              # Smart Tour System
│   │   └── actions/            # Mind Map AI Actions
│   └── sightings/              # Sightings Analysis
├── services/
│   └── ai/                     # AI Service Layer
│       ├── prompts/            # → prometheus.prompt.ts
│       ├── openai/             # OpenAI Integration
│       └── workflows/          # AI Workflows
├── app/
│   └── api/                    # API Routes
│       ├── chat/               # → Prometheus Chat API
│       └── disclosure/         # → Disclosure APIs
└── contexts/                   # React Contexts
    ├── ai/                     # AI Context Providers
    └── mindmap/                # Mind Map Context
```

## 🚨 RED FLAGS - STOP AND REASSESS

If you find yourself planning any of these, STOP and re-read documentation:

- [ ] "Connecting" systems that are already connected
- [ ] Treating 85% AI connectivity as incomplete integration
- [ ] Planning major architectural overhauls
- [ ] Assuming systems are separate when they're integrated
- [ ] Building new AI infrastructure when Prometheus + Vector Storage exists
- [ ] Creating new context systems when Contextual Intelligence is complete
- [ ] Creating files outside the `@/app` structure without understanding monorepo organization
- [ ] Planning to rebuild `enhanced-node-poc.tsx` or `contextual-intelligence.ts`

## ✅ GREEN FLAGS - GOOD UNDERSTANDING

You're ready to proceed if you understand:

- [ ] Contextual Intelligence (`apps/app/src/features/mindmap/utils/contextual-intelligence.ts`) is the foundational brain powering all systems
- [ ] Enhanced Nodes (`apps/app/src/features/mindmap/nodes/enhanced-node-poc.tsx`) are the common UI layer used across all features
- [ ] Spatial Intelligence (`apps/app/src/features/mindmap/hooks/use-spatial-grouping.ts`) builds on Contextual Intelligence
- [ ] Smart Tours (`apps/app/src/features/mindmap/tours/`) leverage both Contextual and Spatial Intelligence
- [ ] Prometheus (`apps/app/src/features/agents/prometheus.tsx`) provides the AI conversation layer
- [ ] Agentic Tours will orchestrate existing systems, not replace them
- [ ] Most "unification" work is polishing existing integration
- [ ] All primary functionality lives in the `@/app` package

## 📝 DOCUMENTATION VERIFICATION

Before starting, verify you can explain:

### The Integration Hierarchy (`@/app/src/features/`)

```
Contextual Intelligence (Foundation)
📁 features/mindmap/utils/contextual-intelligence.ts
├── Powers: Smart badges, filtering, suggestions
├── Status: ✅ COMPLETE
├── Export: getGraphContext(), GraphContext interface
└── Used by: ALL other systems

↓ Built on Foundation ↓

Spatial Intelligence  
📁 features/mindmap/hooks/use-spatial-grouping.ts
📁 features/mindmap/tours/hooks/use-tour-with-spatial-intelligence.ts
├── Features: R-Tree indexing, proximity analysis
├── Status: ✅ COMPLETE
├── Export: useSpatialGrouping(), useTourWithSpatialIntelligence()
└── Integration: Seamless with Contextual Intelligence

↓ Leverages Both Above ↓

Smart Tour Integration
📁 features/mindmap/tours/
├── Features: Enhanced nodes, tour progression
├── Status: ✅ 85% Complete
├── Tools: features/mindmap/tours/tools/
└── Integration: Uses Enhanced Nodes + Contextual Intelligence

↓ Orchestration Layer ↓

Agentic Tours (Natural Language Control)
📁 features/mindmap/tours/hooks/
├── Philosophy: Orchestration over Replacement
├── Status: 📋 Planning
└── Will leverage: All existing systems through tool interfaces

↓ AI Conversation Layer ↓

Prometheus AI Integration
📁 features/agents/prometheus.tsx
📁 app/api/chat/route.ts
├── Powers: All AI conversations and analysis
├── Status: ✅ COMPLETE  
├── Vector Store: vs_meWOEnUiUxtQWf0W6NBsNpCG
└── Integration: Connected to all knowledge systems
```

### Common Infrastructure Elements (`@/app/src/`)

- [ ] Enhanced Nodes (`features/mindmap/nodes/enhanced-node-poc.tsx`) - Used by ALL systems
- [ ] Spatial Grouping (`features/mindmap/hooks/use-spatial-grouping.ts`) - Shared across features  
- [ ] Contextual Intelligence Core (`features/mindmap/utils/contextual-intelligence.ts`) - Foundation for all AI features
- [ ] Prometheus AI (`features/agents/prometheus.tsx`) - Unified AI conversation layer
- [ ] Vector Storage + Database Search - Unified AI infrastructure

### Development Integration Examples (`@/app`)

- [ ] Can you write a component that uses Contextual Intelligence?

  ```typescript
  // Example: apps/app/src/features/mindmap/components/example.tsx
  import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
  import { useMindMap } from '@/contexts/mindmap/mindmap-context'

  export function ExampleComponent() {
    const { getNodes } = useMindMap()
    const graphContext = getGraphContext(getNodes())
    // Use contextual intelligence data...
  }
  ```

- [ ] Can you integrate Spatial Intelligence?

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

- [ ] Can you integrate with Prometheus AI?

  ```typescript
  // API Call to Prometheus
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Analyze this...' }]
    })
  })
  ```

## 🎯 TASK APPROACH VALIDATION

### BEFORE starting implementation

- [ ] Can you map your task to existing systems in `@/app`?
- [ ] Do you understand what's already integrated?
- [ ] Are you enhancing existing features or building new ones?
- [ ] Have you identified the minimal changes needed?
- [ ] Do you know which files in `apps/app/src/` you'll be working with?

### DURING implementation

- [ ] Are you leveraging existing infrastructure in `@/app`?
- [ ] Are you following the "orchestration over replacement" philosophy?
- [ ] Are your changes enhancing the unified experience?
- [ ] Are you maintaining backward compatibility?
- [ ] Are you using correct `@/` import paths?

### AFTER implementation

- [ ] Does your work integrate seamlessly with existing systems?
- [ ] Have you enhanced rather than fragmented the user experience?
- [ ] Is your implementation consistent with existing patterns in `@/app`?
- [ ] Did you preserve the AI connectivity and contextual intelligence?

## 📞 WHEN TO ASK FOR CLARIFICATION

Ask clarifying questions if:

- [ ] Your task seems to duplicate existing functionality in `@/app`
- [ ] You're unsure how your work fits into the integration hierarchy
- [ ] The existing documentation doesn't clearly show system relationships
- [ ] You're planning changes that might break existing integration
- [ ] You need to understand specific implementation details in `apps/app/src/`
- [ ] You're unclear about monorepo package boundaries

## ✨ SUCCESS INDICATORS

You're on the right track if:

- [ ] Your work builds on existing AI infrastructure in `@/app`
- [ ] You're enhancing rather than replacing systems
- [ ] Your implementation feels like a natural extension
- [ ] You're maintaining the unified user experience
- [ ] Your changes leverage Contextual Intelligence
- [ ] You're following established patterns and conventions
- [ ] Your imports use the `@/` alias correctly
- [ ] Your file locations make sense within `apps/app/src/`

---

**Remember:** This platform has sophisticated, well-integrated AI infrastructure in the `@/app` directory. Your job is likely to enhance and complete existing integration rather than build from scratch.

**When in doubt:** Read more documentation, ask clarifying questions, and understand the `@/app` structure before implementing.

**Success:** Seamless integration that feels like it was always part of the unified system.
