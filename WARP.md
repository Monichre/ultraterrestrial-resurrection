# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick start: run the main app (Next.js)
- Install workspace deps (Bun workspaces):
  - bun install
- Development server:
  - bun run dev:app       # or: cd apps/app && bun run dev
- Build / start:
  - bun run build:app
  - bun run start:app
- Storybook (components):
  - bun run storybook     # runs from apps/app

Notes
- This monorepo uses Bun and workspaces. Root scripts cd into subprojects.
- Next.js project lives in apps/app.

## Common commands by location

Root (ultraterrestrial-resurrection)
- Dev app: bun run dev:app
- Build app: bun run build:app
- Start app: bun run start:app
- Storybook: bun run storybook
- Test app: bun run test:app  # see caveat in “Testing”

apps/app (Next.js 15)
- Dev: bun run dev
- Build: bun run build
- Start: bun run start
- Lint: bun run lint
- Storybook (dev/build): bun run storybook / bun run build-storybook
- Component generator: bun run new (plop) or bun run bun:new
- Component audit: bun run audit:components
- Data operations:
  - bun run export:xata
  - bun run import:data
  - bun run import:events
  - bun run import:sightings
- Logging helpers: bun run log:checkin | log:work | log:approve | log:status | log:status:once | log:tail

packages/db (Xata SDK and DB utilities)
- Dev: bun run dev
- Type-check: bun run type-check
- DB ops: bun run test:db | seed | seed:simple | fix-and-seed | analyze | query
- Clean: bun run clean
- Command runner (JSON payload via -e): bun run cmd:create | cmd:read | cmd:update | cmd:delete

packages/services/deep-research (TS library)
- Build: bun run build (tsup)
- Dev (watch): bun run dev
- Lint: bun run lint
- Test: bun run test

packages/knowledge-base
- Build: bun run build (tsc)

apps/disclosure-rag (Python RAG system)
- Create venv and install:
  - python3 -m venv .venv && source .venv/bin/activate
  - pip install -r requirements.txt
- Run interfaces:
  - python streamlit_app.py   # dashboard
  - python api_server.py      # FastAPI server
  - python cli.py             # CLI
- Data ops (examples):
  - python setup-postgres-tables.py
  - python migrate-to-postgres-xata.py

## Testing
- apps/app: There is no explicit test script defined in apps/app/package.json. The root has a convenience script "test:app" (bun run test:app) but no runner is configured under apps/app. If you intend to run tests, add a test script to apps/app/package.json (e.g., with Vitest/Jest) and invoke it directly or adjust the root script accordingly.
- packages/services/deep-research: bun run test (Jest)
- packages/db: bun test (Bun test) and specific DB check via bun run test:db

Run a single test (example)
- For a Jest/Vitest project, once configured: npx vitest run path/to/spec.ts or npx jest path/to/spec.ts. At present, only packages/services/deep-research declares "test".

## Linting & formatting
- apps/app: bun run lint (Next.js ESLint via eslint.config.mjs)
- packages/services/deep-research: bun run lint
- Prettier: apps/app contains a .prettierrc; formatting is typically managed by editor or separate scripts if added.

## High-level architecture and structure
- Monorepo with Bun workspaces
  - apps/
    - app/ (Next.js 15, React 19) — primary web application with AI features, mindmap system, and extensive UI components
    - disclosure-rag/ (Python) — Triple RAG system and data processing (FastAPI, Streamlit, FAISS/pgvector/Upstash Vector)
  - packages/
    - db/ — Xata TypeScript SDK, models, and DB utilities (29+ entities, vector search, geospatial helpers)
    - knowledge-base/ — structured content sources (files, transcripts, web) and metadata; TypeScript export surface; used by RAG and app
    - services/ — external service clients and deep-research TS package (Firecrawl/Exa integrations)
- Data layer
  - Primary TS database access via @db package (exports registry, client, models, API helpers)
  - Knowledge-base package provides typed access to document corpora and metadata; disclosure-rag can ingest/sync these
- AI/RAG
  - apps/app integrates Vercel AI SDK + multiple providers; relies on contextual intelligence and graph/mindmap features
  - apps/disclosure-rag provides Triple RAG backends and APIs; supports bulk ingestion and analysis flows

## Important repo guidance from existing docs
- From CLAUDE.md (root):
  - Read README.md and AGENT_ONBOARDING_CHECKLIST.md first when onboarding
  - Use the three-tier planning files: docs/PLANS/FEATURES.md → docs/PLANS/TODO.md → DAILY_WORK_PLAN.md
  - For database/Xata workflows, keep compatibility with existing records and generated types; use xata codegen when schema changes (see packages/db/README.md)
- From .cursor/rules (Cursor):
  - Follow Task Master/MCP tooling if applicable; use rule files under .cursor/rules for development workflow specifics

## Caveats and gotchas
- Testing in apps/app: root defines "test:app" but no test runner is configured in apps/app/package.json. Add a test script (Vitest/Jest) before relying on bun run test:app.
- Workspace scripts cd into subfolders; if you need environment-specific flags, run inside the subproject directly for clarity.
- Python environment lives only under apps/disclosure-rag; keep it isolated in .venv.

