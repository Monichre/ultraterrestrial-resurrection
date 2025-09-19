# AGENTS.md - Development Guidelines for Ultraterrestrial Resurrection

This file provides comprehensive guidance for AI agents and developers working with the Ultraterrestrial Resurrection codebase.

## 📁 Project Structure

### Monorepo Architecture

```
ultraterrestrial-resurrection/
├── apps/                   # Applications
│   ├── app/               # Next.js 15 main application
│   ├── disclosure-rag/    # Python RAG system

├── packages/              # Shared packages
│   ├── db/               # Xata database integration
│   ├── ai/               # AI processing components
│   ├── services/         # External service clients
│   └── knowledge-base/   # Document management
├── docs/                  # Documentation
│   ├── agents/           # Agent configuration files
│   ├── plans/            # Project planning (lowercase)
│   ├── research/         # Research documentation
│   ├── work_logs/        # Development logs
│   └── prompts/          # AI prompts and templates
└── *.md                  # Root documentation files
```

## 🛠 Technology Stack

### Frontend

- **Next.js 15** + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **Radix UI** components
- **Three.js** + **React Three Fiber** for 3D
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

## 📋 Development Standards

### Code Style & Formatting

- **Prettier**: No semicolons, single quotes, 100 char width, 2 spaces
- **ESLint**: Next.js config with relaxed rules (no-explicit-any, no-unused-vars as warnings)
- **TypeScript**: Strict mode disabled, target ES2020

### Naming Conventions

- **Import paths**: `@/` for app code, `@db/` for database package, `workspace:*` for packages
- **Components**: PascalCase (e.g., `EntityNode.tsx`)
- **Files**: kebab-case (e.g., `entity-node.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSpatialGrouping.ts`)
- **Types**: PascalCase interfaces, camelCase type aliases

### File Organization

- **Feature-first structure**: Group related functionality together
- **Enhanced Nodes** serve as common UI layer across ALL features
- **Contextual Intelligence** powers smart badges, filtering, suggestions
- **Spatial Intelligence** builds on contextual intelligence foundation
- Use `@/` imports for apps/app paths, workspace imports for packages

## 🏗 Core AI Architecture

### Foundation Layer

- **Prometheus AI** (`apps/app/src/features/agents/prometheus.tsx`) - Core OpenAI assistant
- **Contextual Intelligence** (`apps/app/src/features/mindmap/utils/contextual-intelligence.ts`) - Brain of the system
- **Vector Storage + Database Search** - Dual approach with Xata vector + PostgreSQL

### Integration Hierarchy

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

## 📖 Three-Tier Project Management System

**CRITICAL**: All agents MUST use this standardized approach:

### Tier 1: Strategic Planning - `docs/plans/FEATURES.md`

- **Purpose**: High-level feature concepts, architectural decisions, strategic vision
- **Scope**: Long-term features, complex architectural changes, research ideas
- **Update Frequency**: Weekly reviews, major planning sessions

### Tier 2: Actionable Tickets - `docs/plans/TODO.md`

- **Purpose**: Ready-to-implement tasks with clear success criteria
- **Scope**: Features that have completed strategic planning and are ready for execution
- **Update Frequency**: Sprint planning, daily reviews

### Tier 3: Daily Execution - `DAILY_WORK_PLAN.md`

- **Purpose**: Current sprint execution, tactical implementation
- **Scope**: Active development, immediate priorities, current session work
- **Update Frequency**: Daily updates, session tracking

### Project Management Rules

1. **Always check all three tiers** before starting any work
2. **Update appropriate tier** when completing tasks or discovering new requirements
3. **Maintain consistency** - ensure tasks flow from FEATURES.md → TODO.md → DAILY_WORK_PLAN.md
4. **Document decisions** in FEATURES.md architectural decisions log
5. **Track progress** in TODO.md with realistic timelines
6. **Report status** in DAILY_WORK_PLAN.md with specific accomplishments

## 🔧 Database Operations

### Xata Best Practices

- **Always use filter chains**, not query() method
- **Use getPaginated()** for paginated results
- **Handle many-to-many relationships** via junction tables
- **Vector search available** for tables with embedding columns

### Key Database Entities

- **230,998+ database records** across UFO/UAP research entities
- **29 database entity models** with comprehensive relationships
- **Events, testimonies, personnel, organizations, locations, documents**

## 🛡 Security & Best Practices

### Critical Development Principles

- **"Orchestration over Replacement"** - enhance existing systems rather than rebuild
- **85% AI connectivity** represents advanced functional integration, NOT incomplete work
- **Contextual Intelligence is the foundation** - all other systems depend on it

### Safety Rules

- **Framework Respect**: Check package.json/deps before using libraries
- **Pattern Adherence**: Follow existing project conventions and import styles
- **Never commit secrets**: Use env files, rotate leaked keys
- **Always read before edit**: Understand existing patterns before modifying

## 📊 Testing Strategy

### Testing Commands

- **Frontend**: `bun run test:app` (Vitest)
- **Python**: `cd apps/disclosure-rag && python -m pytest tests/`
- **Database**: `cd packages/db && bun run test:db`

### Testing Guidelines

- **Unit tests**: Component logic and utilities
- **Integration tests**: API endpoints and database operations
- **E2E tests**: Critical user workflows
- **Visual tests**: Storybook stories with Chromatic
- **Accessibility**: Automated a11y testing

## 🔗 Agent-Specific Configuration

For platform-specific agent configurations, see:

- **`docs/agents/`** - Agent configuration files and session management
- **`.cursorrules`** - Cursor IDE specific rules
- **Platform-specific files** reference this core AGENTS.md file

## 📝 Work Log Command

When you receive the command "/worklog", automatically:

1. **ANALYZE** recent work to determine primary focus area and accomplishments
2. **GENERATE** session ID using format: [focus-area]-[YYYYMMDD]-[HHMMSS]
3. **AUTO-POPULATE** header with current date/time, session ID, focus area, agent identifier
4. **WRITE** comprehensive work log following template structure
5. **ENSURE** all sections filled with specific, actionable information

## 🎯 Key Import Patterns

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

## ⚠️ Important Notes

- **ALWAYS use mcp_filesystem-with-morph_edit_file tool** for code edits, not default edit tool
- **Check README.md and docs/agents/AGENT_ONBOARDING_CHECKLIST.md** when onboarding
- **Existing AI infrastructure is sophisticated and well-integrated** - enhance, don't replace
- **Never create documentation files unless explicitly requested** by the user
- **Always timestamp documentation updates** with exact date and time

---

*This file serves as the single source of truth for development guidelines. Platform-specific configurations in docs/agents/ should reference this file rather than duplicate information.*
