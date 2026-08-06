# [CLAUDE.md](http://CLAUDE.md)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required Architecture Reading (MANDATORY FIRST)

**CRITICAL**: Before starting any work, read these documents in order:

1. [README.md](README.md)
2. [AGENTS.md](AGENTS.md) - **COMPREHENSIVE DEVELOPMENT GUIDELINES**
3. [docs/agents/ops/AGENT_ONBOARDING_CHECKLIST.md](docs/agents/ops/AGENT_ONBOARDING_CHECKLIST.md) - **MANDATORY FIRST READ** - Validation checklist
4. [docs/README.md](docs/README.md) - Documentation spine (what exists / where / how / want / do / start)
5. [PRODUCT.md](PRODUCT.md) — product narrative. [DESIGN.md](DESIGN.md) — **NOT CANONICAL**; a deeply limited Microfilm Dark *canvas chrome sketch* only. For design ambition / identity / UX, read [`docs/vision/`](docs/vision/) (especially `DESIGN_REGISTERS.md`, `UX_LANGUAGE_GUIDE.md`, `UI_INSPIRATION.md`, `TEMPORAL_OBSERVATORY.md`) and [`docs/design/design-lab/`](docs/design/design-lab/) before any UI or brand work.

## Agent Configuration System

All development guidelines consolidated into:

### Master Guidelines - `AGENTS.md`

- Single source of truth for development guidelines, stack, and AI architecture
- Three-tier project management details live here (do not duplicate elsewhere)
- Worklane definitions (Lane A Corpus & Ingestion / Lane B Platform & Experience) live here
- **Never `git stash` on the shared working tree** — see `AGENTS.md` for the full rule and the incident that produced it

### Ops / agent intake - `docs/agents/ops/`

- `docs/agents/ops/AGENT_ONBOARDING_CHECKLIST.md` - Mandatory validation checklist
- `docs/agents/ops/issue-tracker.md` / `triage-labels.md` / `domain.md` - Skills meta
- `docs/agents/ops/CONTRIB.md` - Contribution and import conventions
- Platform IDE rules live in `.cursor/`, `.claude/`, etc. — not under `docs/agents/ops/`

### Project Management System

- `docs/plans/FEATURES.md` - Strategic planning (Tier 1)
- `docs/plans/TODO.md` - Actionable tickets (Tier 2)
- `DAILY_WORK_PLAN.md` - Daily execution (Tier 3)

## Three-Tier Project Management System (MANDATORY FOR ALL AGENTS)

**CRITICAL**: All agents MUST use this standardized three-tier approach for project management. Tier definitions, scope, and update cadence live in [AGENTS.md](AGENTS.md) — do not restate them here.

### Project Management Rules for All Agents

1. **Always check all three tiers** before starting any work
2. **Update appropriate tier** when completing tasks or discovering new requirements
3. **Maintain consistency** - ensure tasks flow from FEATURES.md → TODO.md → DAILY_WORK_PLAN.md
4. **Document decisions** in FEATURES.md architectural decisions log
5. **Track progress** in TODO.md with realistic timelines
6. **Report status** in DAILY_WORK_PLAN.md with specific accomplishments

**No other project management files should be created or used.** This three-tier system is the single source of truth for all project tracking and planning.

## Development Commands

Standard commands live in each workspace's `package.json` scripts (`bun run <script>` in `apps/app`, `packages/db`). The following are **not** manifest scripts and are easy to miss:

```bash
# Postgres rebuild scripts — loose .py files, run from packages/db/scripts/rebuild/
python embed_entities.py   # Batch-embed 6 entity tables via OpenAI
python ingest.py           # Ingest transcripts/PDFs → documents + chunks
python load_csv.py         # Load CSV exports into Postgres
```

Python work uses Python 3 and a `.venv` (`apps/disclosure-rag/` has its own).

## Architecture Overview

- **Spacetime Canvas** (`apps/app/src/features/spacetime/`, route `(site)/spacetime`) — Temporal Observatory. Requires `NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN`; **without it the globe silently renders a placeholder instead of erroring** (`spacetime-globe.tsx`).
- **Database package guidance**: `packages/db/README.md` and `packages/db/QUICK_REFERENCE.md` (there is no `packages/db/CLAUDE.md`).

### Core AI Architecture (Grounded 2026-03-29)

**Working AI Paths (SP1–SP4 complete, 2026-06-16):**

1. **Disclosure Mindmap Agent** — primary end-to-end AI path
   - Route: `/api/disclosure/mindmap` (OpenAI Assistants API + custom SSE bridge)
   - Tools: `file_search` (OpenAI vector store) + `searchDatabase` (FTS + pgvector cosine via `@db/postgres`) + `searchExternalResources` (Exa)
   - **pgvector**: `embedQuery(text-embedding-3-small)` runs before every `searchDatabase` call — FTS and vector search run in parallel over a deeper candidate pool (`limit * 3`) and are fused with **Reciprocal Rank Fusion** (rank agreement across signals, not raw score magnitude)
   - Client: `useMindMapAgent` hook → `transformStreamResponse` → graph nodes/edges
   - Files: `apps/app/src/app/api/disclosure/mindmap/route.ts`, `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`

2. **Prometheus Chat** — standalone conversational chat (separate protocol)
   - Route: `/api/prometheus/chat` (Vercel AI SDK `streamText`)
   - Tools: `searchUAP` (OpenAI Assistants vector store), `searchNeonDatabase` (FTS + pgvector via `@db/postgres`), `searchExternalResources`, `researchExternalTopic`, `processDocument`
   - **pgvector**: `searchNeonDatabase` tool generates embedding then calls `searchDatabase({ embedding })` — same parallel FTS+vector RRF fusion pattern as mindmap agent
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

### Dead Code — Do Not Extend

- `smart-mindmap.tsx`, `smart-mindmap-with-auto-connections.tsx`, `smart-mindmap-with-shared-context.tsx`, `smart-graph.tsx` — zero production consumers
- Ghost routes: `(site)/disclosure/`, `(site)/search-and-discovery-interface/`, `(site)/content-card-detail-view/`, `(site)/ufo-sightings/`

### File Organization Rules

- **Feature-first structure** - group related functionality together
- Use `@/` imports for apps/app paths, `@db/` for database package, `workspace:*` for packages
- Prometheus agent lives at `@/services/ai/prometheus` (there is no `@/features/agents/`)

## Technology Stack

Frontend framework and library versions are pinned in `apps/app/package.json` — read it rather than trusting a copy here.

### Backend & Data

- **Neon Postgres 17.10 + pgvector 0.8.0** — primary database, 30 tables, 126,483 records (live `count(*)` 2026-07-24). Connection in `packages/db/.env` as `DATABASE_URL` — never commit.
- **`@db/postgres`** — the ONLY live database layer (`packages/db/src/postgres/`). Exports typed queries, search, and `getSql()` tagged-template client via `@neondatabase/serverless`.
- **Embeddings**: `text-embedding-3-small` @ 1536 dims (locked). 1,594 entity rows + 4,946 document chunks embedded = 6,540 total vectors. All entity embeddings 100% populated (live 2026-07-24).
- **OpenAI Assistants API** — disclosure mindmap agent (file_search + threads)
- **Vercel AI SDK** — Prometheus chat route (streamText)
- **AI providers**: OpenAI, Anthropic, Groq
- **Authentication**: Clerk middleware exists (`apps/app/src/middleware.ts`) — `/admin` and `/api/processing` gated; most AI read routes (`/api/disclosure/*`, `/api/prometheus/chat`) remain public until canvas sign-in exists
- **Search**: OpenAI file_search (vector store) + Postgres FTS (`search_vector @@ plainto_tsquery`) + trgm fallback. No Xata full-text in the Next.js app.

### Python RAG System (disconnected)

- **Note**: This system does NOT share data or vector stores with the Next.js app

## Development Guidelines

### Database Work

1. Schema and types live under `packages/db/src/postgres/` and are exported by `@db/postgres`
2. Prefer the typed helpers; use `getSql()` tagged-template for writes and custom SQL
3. `DATABASE_URL` lives in `packages/db/.env` — never commit it
4. Maintain compatibility with 126,483 existing records (live count 2026-07-24)

## Definition of Done (binding — read before claiming any work complete)

No feature is done on green tests alone. Two gates, both required: a **completion report with evidence** (every claim shows its command and that command's actual output; scope every number; name what you did NOT do) and a **dogfood visual audit** (every user path and spec requirement walked through in the running app by a reviewer and visually confirmed). Cannot run the audit? Report **UNVERIFIED**, not done.

Full protocol: [docs/agents/ops/DEFINITION_OF_DONE.md](docs/agents/ops/DEFINITION_OF_DONE.md). Short binding form is at the top of [AGENTS.md](AGENTS.md).

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

For agent intake and ops docs, see:

- `docs/agents/ops/` - Onboarding, triage, issue tracker, contrib
- `docs/agents/ops/AGENT_ONBOARDING_CHECKLIST.md` - Mandatory validation checklist
- `docs/README.md` - Full documentation spine

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature>/` in this repo (local-markdown convention). See `docs/agents/ops/issue-tracker.md`.

### Triage labels

Five canonical labels used as-is: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/ops/triage-labels.md`.

### Domain docs

Multi-context — root `CONTEXT-MAP.md` points to per-context `CONTEXT.md` files. See `docs/agents/ops/domain.md`.
