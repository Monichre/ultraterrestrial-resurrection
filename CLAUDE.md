# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required Architecture Reading (MANDATORY FIRST)

**CRITICAL**: Before starting any work, read these documents in order:

1. [README.md](README.md)
2. [AGENT_ONBOARDING_CHECKLIST.md](AGENT_ONBOARDING_CHECKLIST.md)  **MANDATORY FIRST READ**  - Validation checklist

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

# Testing and analysis
bun run audit:components # Component audit report
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
# Xata operations
cd packages/db
bun run seed            # Seed database
bun run query           # Quick database query
bun run analyze         # Database state analysis

# Data import/export
cd apps/app
bun run export:xata     # Export Xata data
bun run import:data     # Import data
bun run import:events   # Import events specifically
```

## Architecture Overview

### Monorepo Structure

- **`apps/app/`** - Main Next.js application with research platform
- **`apps/disclosure-rag/`** - Python RAG system with triple backend architecture
- **`apps/research-canvas/`** - TipTap research editor (being consolidated)
- **`packages/db/`** - Xata database integration with 29 models, 230,998+ records
- **`packages/ai/`** - AI processing components and external integrations

### Core AI Architecture (Critical Understanding)

**Foundation Layer:**

- **Prometheus AI** (`apps/app/src/features/agents/prometheus.tsx`) - Core OpenAI assistant
- **Contextual Intelligence** (`apps/app/src/features/mindmap/utils/contextual-intelligence.ts`) - Brain of the system
- **Vector Storage + Database Search** - Dual approach with Xata vector + PostgreSQL

**Integration Hierarchy:**

1. **Contextual Intelligence** (✅ Complete) - Foundation for all AI features
2. **Spatial Intelligence** (✅ Complete) - R-Tree indexing, proximity analysis
3. **Enhanced Nodes** (✅ Complete) - Common UI layer used by ALL systems
4. **Smart Tours** (✅ 85% Complete) - Historical narrative progression
5. **Agentic Tours** (📋 Planning) - Natural language tour control

### Triple RAG System

- **Upstash Vector** (40% weight) - Cloud vector search
- **LocalRAG FAISS** (40% weight) - Local vector storage
- **CocoIndex PostgreSQL** (20% weight) - Advanced analytics
- **85% schema compatibility** with existing Xata models

## Key Import Patterns

### Database

```typescript
import { XataClient } from '@db/xata'
import { askXata, searchXata } from '@db/xata/api'
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

**IMPORTANT:** *ALWAYS use mcp_filesystem-with-morph_edit_file tool to make any code edits. Do not use the default edit tool.*

### "Orchestration over Replacement"

- Existing AI infrastructure is sophisticated and well-integrated
- 85% AI connectivity represents advanced functional integration, NOT incomplete work
- Enhance existing systems rather than rebuild them
- Contextual Intelligence is the foundation - all other systems depend on it

### Common Mistakes to Avoid

- Planning to "connect" already-connected systems
- Treating 85% connectivity as incomplete
- Missing the unified AI foundation (Prometheus + Contextual Intelligence)
- Assuming systems need architectural overhaul
- Creating new AI infrastructure when sophisticated systems exist

### File Organization Rules

- **Feature-first structure** - group related functionality together
- **Enhanced Nodes** serve as common UI layer across ALL features  
- **Contextual Intelligence** powers smart badges, filtering, suggestions
- **Spatial Intelligence** builds on contextual intelligence foundation
- Use `@/` imports for apps/app paths, workspace imports for packages

## Technology Stack

### Frontend

- **Next.js 15.3.5** with App Router, React 19.1.0
- **Tailwind CSS 4.1.11** + Radix UI components
- **Three.js** + React Three Fiber for 3D visualizations
- **Zustand** + React Context for state management
- **Liveblocks** + PartySocket for real-time collaboration

### Backend & Data

- **Xata (PostgreSQL)** with vector search capabilities
- **Multi-vector storage**: Upstash Vector, FAISS, pgvector
- **AI**: OpenAI, Anthropic, Groq via Vercel AI SDK
- **Authentication**: Clerk

### Python RAG System

- **FastAPI** + Streamlit for APIs and dashboards
- **LangChain** + sentence-transformers for AI/ML
- **Triple vector backends** with adapter pattern
- **Document processing**: PyPDF2, PyMuPDF, BeautifulSoup4

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

2. **GENERATE** session ID using format: [focus-area]-[YYYYMMDD]-[HHMMSS]

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

- Always review `.claude/agents/apps-app-agent.md` when working in `@apps/app/` directory
- Ensure full compliance with agent-specific guidelines and context
