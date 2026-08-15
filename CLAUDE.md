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

Python work uses Python 3 and a `.venv` (`apps/disclosure-rag/` has its own).

## Architecture Overview

**What does NOT exist in the Next.js app (corrected myths):**

- ~~Triple RAG with 40/40/20 weighting~~ — FTS + pgvector (2 paths), not 3
- ~~FAISS, Upstash Vector, CocoIndex~~ — Python-only or completely unimplemented
- ~~Multi-agent tour orchestrator~~ — 6 agent classes specced (July 2025), zero code written, scrapped
- ~~85% AI connectivity~~ — Two live AI paths (mindmap agent + Prometheus chat); the rest are broken or dead
- ~~Neo4j / Amazon Neptune knowledge graph as product persistence~~ — Postgres entity tables + five junction tables via `loadEntityGraph`; no graph database anywhere (methodology templates review, `docs/PLANS/2026-08-05-methodology-templates-deep-review.md`)
- ~~Kafka / Flink / Spark streaming topic-tracking pipeline~~ — No streaming runtime on either live AI path; realtime-monitor personas are conceptual grammar, not services (same review)
- ~~OWL / RDFS ontologies + Apache Jena SPARQL~~ — Zod/TS types + Postgres schema under `@db/postgres`, queried with typed helpers and `getSql()`; no triplestore, no SPARQL endpoint (same review)
- ~~Docker Compose / Kubernetes "ufo-research-system", with `packages/ai/agents/*.md` as deployable microservices~~ — Those 18 files are markdown persona grammar, not routes or processes; there is no orchestrated research platform to deploy (same review)

## Critical Development Principles

### "Orchestration over Replacement"

- Enhance the one working agent path (disclosure/mindmap) rather than building new ones
- Contextual Intelligence utilities are the foundation — other features depend on them
- The Python RAG system (`apps/disclosure-rag/`) is completely disconnected from the Next.js app

### Common Mistakes to Avoid

- **Importing from `@db/xata` or `@db`** — that package is retired. Use `@db/postgres` for ALL database operations.
- Using `xata.db.*` patterns — Xata SDK is dead. Use typed helpers or `getSql()` tagged-template.
- Assuming "Triple RAG" or multi-agent tours exist — they do not (see myths corrected in roundtable audit)
- Adding state to `mindmap-context.tsx` (`apps/app/src/contexts/mindmap/mindmap-context.tsx`, 1,270-line god-object) — use Zustand store instead
- Using `router.push()` for canvas navigation — use Zustand `setActiveView()`
- Treating the Python RAG system as connected to the Next.js app

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

- always show and report all effected files

## Agent skills

### Issue tracker

Linear owns implementation tickets (project "Ultraterrestrial Resurrection", team DMGD). `docs/plans/TODO.md` is kept in parity with Linear — new/updated/closed tickets get mirrored into both in the same pass, not written to Linear alone. Full parity rule in `docs/agents/ops/issue-tracker.md`. `.scratch/` may hold temporary research notes but is not the issue tracker.

### Triage labels

Five canonical labels used as-is: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/ops/triage-labels.md`.

### Domain docs

Multi-context — root `CONTEXT-MAP.md` points to per-context `CONTEXT.md` files. See `docs/agents/ops/domain.md`.
