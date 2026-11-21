---
status: live
role: ops
spine: do
updated: 2026-07-19
---

# Contributing Guide

**Generated:** 2026-03-29
**Source of truth:** `package.json`, `apps/app/package.json`, `packages/db/package.json`, `.env`

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v23+ | Runtime (v23.9.0 current) |
| Bun | v1.2+ | Package manager & script runner (v1.2.17 current) |
| Python | 3.12+ | RAG system (`apps/disclosure-rag`) |
| Git | 2.x | Version control |

## Repository Structure

```
ultraterrestrial-resurrection/          # Monorepo root
  apps/
    app/                                # Next.js 15.3 research platform (primary)
    disclosure-rag/                     # Python RAG system (FastAPI + Streamlit)
  packages/
    db/                                 # Neon Postgres+pgvector layer (@db/postgres — sole DB layer)
    ai/                                 # Agents + prompt registry
    knowledge-base/                     # Research source materials
      sources/files/                    # (formerly case_files)
  docs/
    README.md                           # Six-question spine navigator
    architecture/                       # How it works (API routes, runbook)
    vision/                             # Identity canon
    plans/                              # FEATURES.md + TODO.md only
    ops/                                # Agent onboarding, triage, contrib
    research/methodology/               # Platform research doctrine
    adr/                                # Architecture decision records
    archive/                            # Historical docs, sessions, prototypes
```

## Environment Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd ultraterrestrial-resurrection
bun install                             # Installs all workspace dependencies
```

### 2. Environment variables

There is no `.env.example`. Copy `.env` and `.env.local` from a team member or secrets manager.

**212 environment variables** across services:

| Category | Key vars | Required for |
|----------|----------|-------------|
| **Neon Postgres** | `DATABASE_URL` | All database operations (`packages/db/.env`) |
| **OpenAI** | `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`, `OPENAI_VECTOR_STORE_ID` | AI agent, file_search, embeddings |
| **Clerk (auth)** | `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Authentication |
| **Anthropic** | `ANTHROPIC_API_KEY` | Claude-based features |
| **Groq** | `GROQ_API_KEY` | Fast inference |
| **Exa** | `EXA_API_KEY` | External research search |
| **FireCrawl** | `FIRECRAWL_API_KEY` | Web scraping pipeline |
| **Upstash** | `UPSTASH_REDIS_REST_*` | Redis cache |
| **Liveblocks** | `LIVEBLOCKS_*` | Real-time collaboration |
| **Mapbox** | `NEXT_PUBLIC_MAPBOX_*` | Globe/sightings visualization |
| **TipTap** | `TIPTAP_*`, `TIP_TAP_PRO_TOKEN` | Research editor |
| **Disclosure agent** | `DISCLOSURE_ENGINEER_ASSISTANT_ID`, `DISCLOSURE_ENGINEER_VECTOR_STORE_ID` | Mindmap AI agent |

> **Note:** `DATABASE_URL` lives in `packages/db/.env` (gitignored). Never commit it. Xata vars (`XATA_API_KEY`, `XATA_BRANCH`, `XATA_DATABASE_URL`) are obsolete — `@db/xata` is retired (SP3).

**Minimum viable `.env` for local dev** (AI features):

```
# packages/db/.env
DATABASE_URL=postgresql://...@ep-red-sky-ah7swer1.us-east-2.aws.neon.tech/neondb?sslmode=require

# apps/app/.env.local
OPENAI_API_KEY=...
OPENAI_ASSISTANT_ID=...
OPENAI_VECTOR_STORE_ID=...
DISCLOSURE_ENGINEER_ASSISTANT_ID=...
DISCLOSURE_ENGINEER_VECTOR_STORE_ID=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```

### 3. Start development

```bash
bun run dev:app                         # Start Next.js dev server (port 3000)
```

---

## Available Scripts

### Root Monorepo (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev:app` | `cd apps/app && bun run dev` | Start Next.js dev server |
| `build:app` | `cd apps/app && bun run build` | Production build |
| `start:app` | `cd apps/app && bun run start` | Start production server |
| `test:app` | `cd apps/app && bun run test` | Run app tests |
| `storybook` | `cd apps/app && bun run storybook` | Storybook dev (port 6006) |
| `db:seed` | `cd packages/db && bun run seed` | Seed database |
| `db:seed:simple` | `cd packages/db && bun run seed:simple` | Simplified seed |
| `db:seed:python` | `cd packages/db && bun run seed:python` | Python-based seed |
| `db:fix-and-seed` | `cd packages/db && bun run fix-and-seed` | Fix schema issues + seed |
| `db:analyze` | `cd packages/db && bun run analyze` | Database state analysis |
| `db:query` | `cd packages/db && bun run query` | Quick database query |
| `db:test:db` | `cd packages/db && bun run test:db` | Test database connection |
| `db:smoke-test` | `cd packages/db && bun run smoke-test` | Run DB smoke tests |
| `db:interactive` | `cd packages/db && bun run interactive` | Interactive CLI |
| `db:enhanced-cli` | `cd packages/db && bun run enhanced-cli` | Enhanced CLI commands |
| `db:cmd:search` | `cd packages/db && bun run cmd:search` | Full-text search (Postgres FTS) |
| `db:test:db` | `cd packages/db && bun run test:db` | Connection smoke test |

### Next.js App (`apps/app/package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Dev server with hot reload |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `next lint` | ESLint check |
| `storybook` | `storybook dev -p 6006` | Component development |
| `build-storybook` | `storybook build` | Build static Storybook |
| `new` | `plop` | Generate new component (interactive) |
| `bun:new` | `bun bunplop.js` | Bun-based component generator |

### Database Package (`packages/db/package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `bun run --watch index.ts` | Watch mode |
| `test` | `bun test` | Run tests |
| `test:db` | `bun run test-db-connection.js` | Test DB connection |
| `seed` | `bun run xata-seeding-script.ts` | Full database seed |
| `seed:simple` | `bun run simple-seed.js` | Simple seed |
| `analyze` | `bun run database-state-analysis.js` | State analysis |
| `query` | `bun run quick-db-query.ts` | Quick query |
| `type-check` | `tsc --noEmit --skipLibCheck` | Type checking |
| `smoke-test` | `bun run run-smoke-tests.ts` | Smoke tests |
| `interactive` | `bun run interactive-cli.ts` | Interactive CLI |

---

## Development Workflow

### Branch strategy

- `main` — production branch
- `dev` — primary development branch
- Feature branches from `dev`

### Before you code

1. Read `AGENT.md` for comprehensive development guidelines
2. Check the three-tier project management system:
   - `docs/plans/FEATURES.md` — strategic planning
   - `docs/plans/TODO.md` — actionable tickets
   - `DAILY_WORK_PLAN.md` — current sprint
3. Check `docs/archive/` for the roundtable hardening plan if needed (`2026-03-29-roundtable-unified-action-plan.md`)
4. Read `docs/README.md` for the documentation spine

### Import conventions

```typescript
// Database — ALWAYS @db/postgres (@db/xata is retired)
import { getAllEvents, searchDatabase, getSql } from '@db/postgres'
import type { EventsRecord } from '@db/postgres'

// Features (within apps/app)
import { Component } from '@/features/mindmap/...'

// Cross-package
import { AIComponent } from '@repo/ai'
```

### Component creation

```bash
cd apps/app
bun run new                             # Interactive Plop generator
```

- PascalCase for components, kebab-case for files
- Create Storybook stories for UI components
- Use Enhanced Nodes (`enhanced-node-poc.tsx`) for graph node consistency

### Key architectural rules

- **Orchestration over replacement** — enhance existing systems, don't rebuild
- The research canvas canonical path is: `research-canvas/page.tsx` -> `MindMap` -> `ViewSwitcher` -> `Graph`
- Navigation uses Zustand `setActiveView()`, NOT `router.push()`
- `mindmap-context.tsx` is a known god-object — do not add more logic to it
- Only one end-to-end AI agent path works: disclosure/mindmap route

---

## Testing

### Database tests

```bash
bun run db:test:db                      # Connection test
bun run db:smoke-test                   # Smoke test suite
```

### App tests

```bash
bun run test:app                        # App test suite
```

### Storybook visual testing

```bash
bun run storybook                       # Visual component dev at localhost:6006
```

### Manual verification

The canonical research canvas is at `http://localhost:3000/research-canvas`. Verify:

1. Graph loads (currently fetches all 230,998 records — known perf issue)
2. AI agent query works (type a question, see nodes appear)
3. View switching works (canvas, timeline, globe, search, detail)

---

## Python RAG System

```bash
cd apps/disclosure-rag
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python streamlit_app.py                 # Interactive dashboard
python api_server.py                    # FastAPI server
python cli.py                           # CLI interface
python process_entities.py              # Entity extraction
python main.py                          # Main pipeline
```

**Note:** The Python RAG system and the Next.js app are completely disconnected at the data layer. They do not share state or vector stores in production.
