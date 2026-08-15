# AGENTS.md - Development Guidelines for Ultraterrestrial Resurrection

This file provides comprehensive guidance for AI agents and developers working with the Ultraterrestrial Resurrection codebase.

## 🚦 THE DEFINITION OF DONE (binding on every agent, no exceptions)

**You may not call a feature complete, done, shipped, or closed without BOTH of the following. Green tests are not sufficient. Neither is a passing typecheck.**

1. **A completion report with evidence.** Every claim states the command that proves it and shows its actual output — never "verified" or "works" on your word. Name what you did NOT do and what remains open.
2. **A dogfood visual audit.** Every user path and spec requirement is walked through **in the running app** by a reviewer who confirms it visually. A feature nobody has looked at is not done.

Full protocol, required report shape, and the honesty rules: **[`docs/agents/ops/DEFINITION_OF_DONE.md`](docs/agents/ops/DEFINITION_OF_DONE.md)** — read it before reporting any work complete.

If you cannot run the audit (no dev server, no credentials, no token), say so explicitly and report the feature as **UNVERIFIED**, not done. "Blocked on X" is an honest answer; silence that reads as completion is not.

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

- **Neon Postgres 17.10 + pgvector 0.8.0** — primary database, 30 tables, 126,483 records (live `count(*)` 2026-07-24; includes runtime-added `agent_inferences`)
- **`@db/postgres`** — the ONLY live database layer (`packages/db/src/postgres/`). `@db/xata` is retired.
- **Embeddings**: `text-embedding-3-small` @ 1536 dims. 1,594 entity rows + 4,946 document chunks = 6,540 total vectors. All entity embeddings 100% populated (live 2026-07-24).
- **OpenAI Assistants API** — disclosure mindmap agent (file_search + threads)
- **Vercel AI SDK** — Prometheus chat route (streamText)
- **AI providers**: OpenAI, Anthropic, Groq
- **Authentication**: Clerk (middleware NOT YET implemented)
- **Search**: OpenAI file_search + Postgres FTS/trgm via `@db/postgres`

### Python RAG System (disconnected from Next.js app)

- **FastAPI** + Streamlit for APIs and dashboards
- **LangChain** + sentence-transformers for AI/ML
- Does NOT share data or vector stores with the Next.js app

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

### Working AI Paths (grounded 2026-03-29)

1. **Disclosure Mindmap Agent** — the ONLY end-to-end AI path in the Next.js app
   - Route: `/api/disclosure/mindmap` (OpenAI Assistants API + custom SSE bridge)
   - Tools: `file_search` + `searchDatabase` (Postgres FTS/trgm via `@db/postgres`) + `searchExternalResources` (Exa)
   - Client: `useMindMapAgent` hook → graph nodes/edges

2. **Prometheus Chat** — standalone conversational chat (separate protocol)
   - Route: `/api/prometheus/chat` (Vercel AI SDK `streamText`)
   - Tools: `searchUAP`, `searchExternalResources`, `researchExternalTopic`, `processDocument`

### Foundation Utilities

- **Contextual Intelligence** (`features/mindmap/utils/contextual-intelligence.ts`) — graph context, relationship filtering
- **Spatial Intelligence** (`features/mindmap/hooks/use-spatial-grouping.ts`) — R-Tree proximity queries
- **Enhanced Nodes** (`features/mindmap/nodes/enhanced-node-poc.tsx`) — React Flow node type

### What Does NOT Exist (corrected myths)

- ~~Triple RAG (40/40/20)~~ — Only OpenAI file_search + Postgres full-text search work in the Next.js app
- ~~Multi-agent tour orchestrator~~ — 6 agent classes specced July 2025, zero code written, scrapped
- ~~85% AI connectivity~~ — One end-to-end path works; the rest are broken or dead
- ~~`@db/xata` / Xata SDK~~ — **Retired (SP3)**. All live call sites migrated to `@db/postgres`.
- The Python RAG system (`apps/disclosure-rag/`) is completely disconnected from the Next.js app

**Reference:** `docs/plans/2026-03-29-roundtable-unified-action-plan.md`

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

### Postgres Layer (`@db/postgres`) — SP3 Complete

**ALWAYS import from `@db/postgres`. The `@db/xata` package is retired.**

```typescript
// Reads
import { getAllEvents, getAllPersonnel, loadEntityGraph, readById, getPaginatedRecords } from '@db/postgres'
// Search (drop-in compatible with old Xata search shapes)
import { searchXata, searchAll, searchTable, searchDatabase } from '@db/postgres'
// Raw SQL for writes or custom queries
import { getSql } from '@db/postgres'
const sql = getSql()
const rows = await sql`SELECT * FROM events WHERE date > ${cutoff}`
```

- **Connection**: `DATABASE_URL` in `packages/db/.env` (gitignored, never commit)
- **Driver**: `@neondatabase/serverless` neon() tagged-template client
- **Write pattern**: `getSql()` + tagged-template SQL; use `autocommit=True` + `conn.transaction()` in Python scripts
- **Pagination**: `getPaginatedRecords(table, size, offset)` — cursor field removed, offset-based
- **Table alias**: `personnel` → `key_figures` in Postgres; `resolveTable()` handles both names

### Key Database Entities

- **126,483 database records** across UFO/UAP research entities (live `count(*)` 2026-07-24)
- **30 Postgres tables** with comprehensive relationships + junction tables (includes runtime-added `agent_inferences`)
- **Events, testimonies, key_figures (=personnel), organizations, locations, documents**
- **1,594 entity embeddings** + **4,946 document chunks** = 6,540 total vectors (text-embedding-3-small @ 1536 dims)

## 🛡 Security & Best Practices

### Critical Development Principles

- **"Orchestration over Replacement"** — enhance the working agent path, don't build new ones
- **One end-to-end AI path works** (disclosure/mindmap) — the rest are broken or dead
- **Contextual Intelligence utilities** are the foundation — other features depend on them
- **No auth middleware exists** — all API routes are publicly accessible (critical security gap)

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

> **None of the above lets you call a feature done.** Passing tests prove the code does what the tests say — not that the feature works on screen. See [THE DEFINITION OF DONE](#-the-definition-of-done-binding-on-every-agent-no-exceptions) at the top of this file and [`docs/agents/ops/DEFINITION_OF_DONE.md`](docs/agents/ops/DEFINITION_OF_DONE.md).

## 🔗 Agent-Specific Configuration

For agent intake and ops docs, see:

- **`docs/ops/`** - Onboarding checklist, triage, issue tracker, contrib
- **`docs/README.md`** - Documentation spine navigator
- **`.cursorrules` / `.cursor/` / `.claude/`** - Platform IDE rules
- Platform-specific files reference this core AGENTS.md file

## 🪞 Identity & Design Canon (read before any brand/UX/UI/voice work)

Any agent, on any platform, waking into this repo for design-, identity-, or
UX-adjacent work should read `docs/vision/` before proposing anything:

- `docs/vision/2026-07-09-canonicalization-audit.md` - source-of-truth audit + placement rulings
- `docs/vision/RESEARCH_NARRATIVE_RUBRIC.md` - judging checklist for "does this feel Ultraterrestrial"
- `docs/vision/UX_LANGUAGE_GUIDE.md` - reserved words, adopted vocabulary, badge grammar
- `docs/vision/AGENT_ARCHITECTURE_BRIEF.md` - investigative-role framing (honest about what's actually live)
- `docs/vision/IMPLEMENTATION_SPEC.md` - identity → real code map + gap list
- `docs/vision/DESIGN_REGISTERS.md` - the techno-analytical vs. archival-material reframe (not two product lines)
- `docs/vision/UI_INSPIRATION.md` - curated external UI reference links (Fable Showcase, etc.) with steal-notes
- `DESIGN.md` (repo root) — **NOT CANONICAL.** Deeply limited Microfilm Dark *Research Canvas chrome* sketch (tokens / a few signature motifs). Do not treat as the design system or product design SoT.
- `PRODUCT.md` (repo root) - product manifesto register
- `docs/design/design-lab/` - briefs, mockups, visual-language boards, unfinished `document-system/`

This index is expected to grow; check `docs/vision/` and `docs/design/` for new files even if this list is stale. Prefer vision + design-lab over root `DESIGN.md` for any ambitious UI work.

## 📝 Work Log Command

When you receive the command "/worklog", automatically:

1. **ANALYZE** recent work to determine primary focus area and accomplishments
2. **GENERATE** session ID using format: [focus-area]-[YYYYMMDD]-[HHMMSS]
3. **AUTO-POPULATE** header with current date/time, session ID, focus area, agent identifier
4. **WRITE** comprehensive work log following template structure
5. **ENSURE** all sections filled with specific, actionable information

## 🎯 Key Import Patterns

### Database (SP3 — `@db/xata` retired, use `@db/postgres`)

```typescript
import { getAllEvents, getAllPersonnel, loadEntityGraph } from '@db/postgres'
import { searchXata, searchAll, searchDatabase } from '@db/postgres'
import { getSql, readById, getPaginatedRecords } from '@db/postgres'
import type { EventsRecord, PersonnelRecord, TopicsRecord } from '@db/postgres'
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

- **Check README.md, docs/README.md, and docs/ops/AGENT_ONBOARDING_CHECKLIST.md** when onboarding
- **Existing AI infrastructure is sophisticated and well-integrated** - enhance, don't replace
- **Never create documentation files unless explicitly requested** by the user
- **Always timestamp documentation updates** with exact date and time
- **Never `git stash` on the shared working tree.** Multiple agent sessions run concurrently in this repo. Stashing removes other sessions' uncommitted work from disk — it is a destructive mutation of shared state, not a filing cabinet. To exclude foreign changes from your commit, stage selectively (`git add <your paths>`) and list the foreign paths in your work log for their owner. (Added 2026-07-12 after a ticket-swarm stash reverted four files of a live concurrent session — see `docs/archive/sessions/` for session logs.)

---

*This file serves as the single source of truth for development guidelines. Platform ops docs in `docs/ops/` and IDE configs under `.cursor/` / `.claude/` should reference this file rather than duplicate information.*

## Autonomous Loop Protocol

This app has a closed development loop.

- `GOAL.md` (app root) — the current objective, done condition, and constraints. One goal at a time.
- `/goal` (`.agents/skills/goal/SKILL.md`) — set or update the goal. Accepts a Linear ticket ID or inline text.
- `/loop` (`.agents/skills/loop/SKILL.md`) — run the closed loop: plan → execute → verify → iterate → PR for human review.
- Platforms without skill support: read `.agents/skills/loop/SKILL.md` and follow it manually.

## Learned User Preferences

- Prefer aggressive pruning of bulk/archive docs that do not matter; navigate docs via the six-question spine (what exists / where / how it works / what we want / how to do it / where to start).
- Treat large agent persona packs as overkill — cannibalize distinctive methodology into a smaller cohesive research suite wired to `packages/ai/prompts`.
- Research-canvas intelligence belongs in records, waypoints, or visual connections — not separate cards, sidebars, or drawers.
- Guided tours should be traversable evidence graphs with a waypoint contract (claim → basis → counterpoint → unresolved → next), rendered as research-canvas/mindmap state — not scrolling articles, decorative timeline dots, or separate app-level routes.
- Prefer archival/dossier plus clinical HUD / low-opacity ghosts; inline/on-canvas progressive disclosure over modal/card-heavy chrome; unused tour chrome should hide.
- Follow authored animation/spec documents exactly (e.g. `ANIMATION_SEQUENCE.md`); do not arbitrarily remove cinematic beats.
- When migrating design/reference sources into the app, migrate only the components unless explicitly asked to move scaffolding or docs.
- New UI components should be composable, modular, and prop-driven, and should ship with Storybook stories.

## Learned Workspace Facts

- Docs spine and living-canon index live in `docs/README.md`; historical bulk belongs under `docs/archive/`.
- Reference-prototype document UI is migrating into `apps/app/src/components/design-system/research-ui/documents/reference-prototype/` from `docs/design/reference-prototype`.
- Guided-tour / research-canvas design-lab notes live at `docs/2026-07-19-guided-tour-canvas-design-lab.md` and `docs/2026-07-19-impeccable-live-research-canvas.md`.
- Research agent role definitions live under `packages/ai/agents/`; prompt library and orchestration material live under `packages/ai/prompts/`.
- Sci-fi canvas components (`HolographicFileStack`, `RotatingGlobe`) and Command Palette (`CommandK`) live under `apps/app/src/components/`.
- Data architecture centers on Neon Postgres + pgvector with graph relationships as first-class schema citizens (hybrid retrieval: vector + FTS + graph traversal).
- Spacetime Canvas lives at `/spacetime` (`apps/app/src/features/spacetime/`) as the geographic/temporal corollary to Research Canvas.
- `apps/disclosure-lab` (port 3010) is the Neon admin/DX console: human confirms every write, no deletes in v1, agent is read-only assistance — not Research Canvas.
- Internal packages: `@repo/disclosure-ui` (tokens/components kit) and `@repo/openai-vector-store-mcp` (OpenAI Vector Store search/fetch MCP). `packages/services` was merged into `packages/ai`.
- Prefer `apps/disclosure-rag/disclosure-rag-processor/` over the global `~/.claude` skill copy for playlist + `dy` routing.
