# [CLAUDE.md](http://CLAUDE.md)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required Architecture Reading (MANDATORY FIRST)

**CRITICAL**: Before starting any work, read these documents in order:

1. [README.md](README.md)
2. [AGENT.md](AGENT.md) - **COMPREHENSIVE DEVELOPMENT GUIDELINES**
3. docs/agents/AGENT_ONBOARDING_CHECKLIST.md - **MANDATORY FIRST READ** - Validation checklist

## Agent Configuration System

**NEW STRUCTURE**: All development guidelines consolidated into streamlined system:

### 📖 Master Guidelines - `AGENT.md`

- **Single source of truth** for all development guidelines
- Comprehensive commands, standards, and project structure
- Technology stack and AI architecture documentation
- Three-tier project management system

### 🤖 Platform-Specific Configurations - `docs/agents/`

- `docs/agents/claude-code.md` - Claude Code specific instructions
- `docs/agents/cursor.md` - Cursor IDE specific rules
- `docs/agents/warp.md` - Warp terminal specific commands
- `docs/agents/README.md` - Agent configuration overview

### 📋 Project Management System

- `docs/plans/FEATURES.md` - Strategic planning (Tier 1)
- `docs/plans/TODO.md` - Actionable tickets (Tier 2)
- `DAILY_WORK_PLAN.md` - Daily execution (Tier 3)

## Three-Tier Project Management System (MANDATORY FOR ALL AGENTS)

**CRITICAL**: All agents MUST use this standardized three-tier approach for project management:

### Tier 1: Strategic Planning - `docs/plans/FEATURES.md`

- **Purpose**: High-level feature concepts, architectural decisions, strategic vision
- **Scope**: Long-term features, complex architectural changes, research ideas
- **Update Frequency**: Weekly reviews, major planning sessions
- **Content**: Concepts → Requirements → Technical approach → Architectural decisions

### Tier 2: Actionable Tickets - `docs/plans/TODO.md`

- **Purpose**: Ready-to-implement tasks with clear success criteria
- **Scope**: Features that have completed strategic planning and are ready for execution
- **Update Frequency**: Sprint planning, daily reviews
- **Content**: Specific tasks → Files → Timeline → Success metrics

### Tier 3: Daily Execution - `DAILY_WORK_PLAN.md`

- **Purpose**: Current sprint execution, tactical implementation
- **Scope**: Active development, immediate priorities, current session work
- **Update Frequency**: Daily updates, session tracking
- **Content**: Current tasks → Progress → Blockers → Next steps

### Project Management Rules for All Agents

1. **Always check all three tiers** before starting any work
2. **Update appropriate tier** when completing tasks or discovering new requirements
3. **Maintain consistency** - ensure tasks flow from FEATURES.md → TODO.md → DAILY_WORK_PLAN.md
4. **Document decisions** in FEATURES.md architectural decisions log
5. **Track progress** in TODO.md with realistic timelines
6. **Report status** in DAILY_WORK_PLAN.md with specific accomplishments

### Feature Maturation Flow

```
docs/plans/FEATURES.md (strategic concept) 
    → docs/plans/TODO.md (actionable ticket) 
    → DAILY_WORK_PLAN.md (active implementation)
    → Documentation updates → Completion
```

**No other project management files should be created or used.** This three-tier system is the single source of truth for all project tracking and planning.

## Development Commands

### Main Application (Next.js)

```bash
# Development
cd apps/app
bun run dev              # Start dev server
bun run build           # Production build
bun run start           # Start production server
bun run lint            # Run ESLint
bun run storybook       # Component development

# Component generation
bun run new             # Generate new component with Plop
bun run bun:new         # Alternative Bun-based generator

# Storybook
bun run build-storybook  # Build static Storybook
```

### RAG System (Python)

```bash
# Development
cd apps/disclosure-rag
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run applications
python streamlit_app.py    # Interactive dashboard
python api_server.py       # FastAPI server
python cli.py             # Interactive CLI

# Data processing
python process_entities.py  # Entity extraction
python main.py              # Main processing pipeline
```

### Database Operations

```bash
# Postgres rebuild scripts (packages/db/scripts/rebuild/)
python embed_entities.py   # Batch-embed 6 entity tables via OpenAI
python ingest.py           # Ingest transcripts/PDFs → documents + chunks
python load_csv.py         # Load CSV exports into Postgres

# packages/db npm scripts
cd packages/db
bun run seed            # Seed database
bun run query           # Quick database query
bun run analyze         # Database state analysis
```

## Architecture Overview

### Monorepo Structure

- `apps/app/` - Main Next.js 15 application (research platform, mindmap, AI agents)
- `apps/disclosure-rag/` - Python RAG system (completely disconnected from Next.js app)
- `packages/db/` - Neon Postgres+pgvector layer (`@db/postgres`), 29 tables, 230,998+ records
- `packages/ai/` - AI processing components
- `packages/knowledge-base/` - Research source materials (under `sources/files/`)

### Core AI Architecture (Grounded 2026-03-29)

**Working AI Paths (SP1–SP4 complete, 2026-06-16):**

1. **Disclosure Mindmap Agent** — primary end-to-end AI path
   - Route: `/api/disclosure/mindmap` (OpenAI Assistants API + custom SSE bridge)
   - Tools: `file_search` (OpenAI vector store) + `searchDatabase` (FTS + pgvector cosine via `@db/postgres`) + `searchExternalResources` (Exa)
   - **pgvector**: `embedQuery(text-embedding-3-small)` runs before every `searchDatabase` call — FTS and vector search run in parallel, deduped by id, ranked by score
   - Client: `useMindMapAgent` hook → `transformStreamResponse` → graph nodes/edges
   - Files: `apps/app/src/app/api/disclosure/mindmap/route.ts`, `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`

2. **Prometheus Chat** — standalone conversational chat (separate protocol)
   - Route: `/api/prometheus/chat` (Vercel AI SDK `streamText`)
   - Tools: `searchUAP` (OpenAI Assistants vector store), `searchNeonDatabase` (FTS + pgvector via `@db/postgres`), `searchExternalResources`, `researchExternalTopic`, `processDocument`
   - **pgvector**: `searchNeonDatabase` tool generates embedding then calls `searchDatabase({ embedding })` — same parallel FTS+vector pattern as mindmap agent
   - File: `apps/app/src/app/api/prometheus/chat/route.ts`

**What does NOT exist in the Next.js app (corrected myths):**
- ~~Triple RAG with 40/40/20 weighting~~ — FTS + pgvector (2 paths), not 3
- ~~FAISS, Upstash Vector, CocoIndex~~ — Python-only or completely unimplemented
- ~~Multi-agent tour orchestrator~~ — 6 agent classes specced (July 2025), zero code written, scrapped
- ~~85% AI connectivity~~ — Two live AI paths (mindmap agent + Prometheus chat); the rest are broken or dead

**Foundation utilities (these do exist and work):**
- **Contextual Intelligence** (`features/mindmap/utils/contextual-intelligence.ts`) — graph context, relationship filtering
- **Spatial Intelligence** (`features/mindmap/hooks/use-spatial-grouping.ts`) — R-Tree proximity queries
- **Enhanced Nodes** (`features/mindmap/nodes/enhanced-node-poc.tsx`) — one node type in React Flow

**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md` for full audit and hardening plan

## Key Import Patterns

### Database (SP3 — use `@db/postgres` for ALL database access)

```typescript
// Typed queries — replace any legacy @db/xata imports with these
import { getAllEvents, getAllPersonnel, getAllTopics, loadEntityGraph } from '@db/postgres'
import { searchXata, searchAll, searchTable, searchDatabase } from '@db/postgres'
import { getSql } from '@db/postgres'           // raw tagged-template SQL for writes/custom queries
import { readById, getPaginatedRecords } from '@db/postgres'
import type { EventsRecord, PersonnelRecord, TopicsRecord } from '@db/postgres'

// NEVER import from @db/xata — that package is retired
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'
```

### Core AI Features

```typescript
import { EnhancedEntityNodePOC } from '@/features/mindmap/nodes/enhanced-node-poc'
import { useSpatialGrouping } from '@/features/mindmap/hooks/use-spatial-grouping'
import { Prometheus } from '@/features/agents/prometheus'
```

### Cross-Package

```typescript
import { AIComponent } from '@repo/ai'
import { DataVizComponent } from '@/features/data-viz'
```

## Critical Development Principles

### "Orchestration over Replacement"

- Enhance the one working agent path (disclosure/mindmap) rather than building new ones
- Contextual Intelligence utilities are the foundation — other features depend on them
- The Python RAG system (`apps/disclosure-rag/`) is completely disconnected from the Next.js app

### Common Mistakes to Avoid

- **Importing from `@db/xata` or `@db`** — that package is retired. Use `@db/postgres` for ALL database operations.
- Using `xata.db.*` patterns — Xata SDK is dead. Use typed helpers or `getSql()` tagged-template.
- Assuming "Triple RAG" or multi-agent tours exist — they do not (see myths corrected in roundtable audit)
- Extending dead code: 4 ghost routes + 4 smart-mindmap shell variants have zero consumers
- Adding state to `mindmap-context.tsx` (1,363-line god-object) — use Zustand store instead
- Using `router.push()` for canvas navigation — use Zustand `setActiveView()`
- Treating the Python RAG system as connected to the Next.js app

### Canonical Render Path (Research Canvas)

```
(site)/research-canvas/page.tsx
  -> MindMap (features/mindmap/index.tsx -> mind-map.tsx)  [16 lines, only live shell]
    -> ReactFlowProvider + MindMapProvider
      -> ViewSwitcher (canvasContent=<Graph />)
        -> Graph | TimelineView | SightingsView | SearchView | DetailView
        -> always mounts <FullScreenMenu />
```

### State Management

- **Zustand `mindmap-ui-store.ts`** — healthy, well-typed slices (navigation, tour, filter, timeline, layout, assets). Use this for UI state.
- **`mindmap-context.tsx`** — 1,363-line god-object. Do NOT add more logic here. Scheduled for decomposition.
- **Navigation** goes through Zustand `setActiveView()`, NOT `router.push()`. Path fields in FullScreenMenu are decorative.

### Dead Code — Do Not Extend

- `smart-mindmap.tsx`, `smart-mindmap-with-auto-connections.tsx`, `smart-mindmap-with-shared-context.tsx`, `smart-graph.tsx` — zero production consumers
- Ghost routes: `(site)/disclosure/`, `(site)/search-and-discovery-interface/`, `(site)/content-card-detail-view/`, `(site)/ufo-sightings/`

### File Organization Rules

- **Feature-first structure** - group related functionality together
- Use `@/` imports for apps/app paths, `@db/` for database package, `workspace:*` for packages

## Technology Stack

### Frontend

- **Next.js 15.3.5** with App Router, React 19.1.0
- **Tailwind CSS 4.1.11** + Radix UI components
- **Three.js** + React Three Fiber for 3D visualizations
- **Zustand** + React Context for state management
- **Liveblocks** + PartySocket for real-time collaboration

### Backend & Data

- **Neon Postgres 17.10 + pgvector 0.8.0** — primary database (endpoint `ep-red-sky-ah7swer1`, db `neondb`), 29 tables, 230,998+ records. Connection in `packages/db/.env` as `DATABASE_URL` — never commit.
- **`@db/postgres`** — the ONLY live database layer (`packages/db/src/postgres/`). Exports typed queries, search, and `getSql()` tagged-template client via `@neondatabase/serverless`.
- **Embeddings**: `text-embedding-3-small` @ 1536 dims (locked). 1,405 entity rows + 4,946 document chunks embedded.
- **OpenAI Assistants API** — disclosure mindmap agent (file_search + threads)
- **Vercel AI SDK** — Prometheus chat route (streamText)
- **AI providers**: OpenAI, Anthropic, Groq
- **Authentication**: Clerk (middleware NOT YET implemented — all routes publicly accessible)
- **Search**: OpenAI file_search (vector store) + Postgres FTS (`search_vector @@ plainto_tsquery`) + trgm fallback. No Xata full-text in the Next.js app.

### Python RAG System (disconnected)

- **FastAPI** + Streamlit for APIs and dashboards
- **LangChain** + sentence-transformers for AI/ML
- **Note**: This system does NOT share data or vector stores with the Next.js app

## Development Guidelines

### Component Development

1. Use `bun run new` for component generation
2. Create Storybook stories for UI components
3. Follow PascalCase for components, kebab-case for files
4. Leverage Enhanced Nodes for consistency across features

### AI Integration

1. Build on Contextual Intelligence foundation
2. Use existing Prometheus AI for conversations
3. Leverage Enhanced Nodes for UI consistency
4. Follow established spatial intelligence patterns

### Database Work

1. Update Xata schema through dashboard first
2. Run `xata codegen` to update types
3. Test integration with existing contextual intelligence
4. Maintain compatibility with 230,998+ existing records

## Work Log Command

When you receive the command "/worklog", automatically:

1. **ANALYZE** recent work to determine:

   - Primary focus area (frontend-ui, backend-api, database, testing, docs, deployment, research, bugfix, feature, refactor, integration, security)
   - Files modified/created/deleted
   - Time spent (estimate if needed)
   - Key accomplishments

2. **GENERATE** session ID using format: \[focus-area\]-\[YYYYMMDD\]-\[HHMMSS\]

3. **AUTO-POPULATE** header with:

   - Current date/time
   - Generated session ID
   - Detected focus area
   - Your agent identifier
   - Current branch/context

4. **WRITE** comprehensive work log following template structure

5. **ENSURE** all sections filled with specific, actionable information

## Documentation Standards

- **Always timestamp** documentation updates (EXACT DATE AND TIME)
- **Always include** summary of work, files touched, components affected, next steps
- **Use Python 3** and `.venv` for Python development
- **Update this file** when finishing incremental tasks
- **Prefer editing** existing files over creating new ones
- **Never create** documentation files unless explicitly requested

## Agent Review Procedures

### @apps/app/ Review Process

- Always review `.claude/agents/apps/app-agent.md` when working in `@apps/app/` directory

- Ensure full compliance with agent-specific guidelines and context

- we've updated the @packages/knowledge-base/ directory names changing case_files to files. @packages/knowledge-base/files/

- **IMPORTANT:** All former content in [@packages/knowledge-base](@packages/knowledge-base) are now nested under [@packages/knowledge-base/sources](@packages/knowledge-base/sources)

- AND we've changed `case_files` to `files` so [@.packages/knowledge-base/sources/files](@.packages/knowledge-base/sources/files)

- always show and report all effected files

- **IMPORTANT:**

- make a note to develop a framework, system or theoretical paradigm to approach data analysis, investigations or any sort of historical review or content ingestion according to "famous UFO researchers" methodology. Ex: Jacques Valle, Diana Pasulka Walksh etc

### Agent Configuration Reference

**CRITICAL**: Read [AGENTS.md](AGENTS.md) for comprehensive development guidelines before starting any work.

For platform-specific configurations, see:

- `docs/agents/` - Platform-specific agent configurations that reference AGENTS.md
- `docs/agents/claude-code.md` - Claude Code specific instructions
- `docs/agents/AGENT_ONBOARDING_CHECKLIST.md` - Mandatory validation checklist