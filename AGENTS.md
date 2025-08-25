# AGENTS.md - Agentic Coding Tool Reference

## Development Commands

**Main App (Next.js 15)**
- `cd apps/app && bun run dev` - Start dev server (port 3000)
- `cd apps/app && bun run build` - Production build 
- `cd apps/app && bun run lint` - ESLint check
- `cd apps/app && bun run test` - Run single test with Vitest
- `cd apps/app && bun run storybook` - Component development (port 6006)

**Python RAG System**
- `cd apps/disclosure-rag && python -m pytest tests/` - Run all tests
- `cd apps/disclosure-rag && python -m pytest tests/test_entity_extraction.py` - Single test file
- `cd apps/disclosure-rag && python streamlit_app.py` - Interactive dashboard

**Database Operations**
- `cd packages/db && bun run seed` - Seed Xata database
- `cd packages/db && bun run query` - Quick database query

## Architecture Overview

**Monorepo Structure**: Bun workspaces with apps/ and packages/
- `apps/app/` - Next.js 15 + React 19 research platform (main app)
- `apps/disclosure-rag/` - Python FastAPI + Streamlit RAG system  
- `packages/db/` - Xata database with 15+ models, 230k+ records
- `packages/knowledge-base/` - Knowledge graph and file sources

**Core AI Stack**: Prometheus AI assistant + Contextual Intelligence + Enhanced Nodes
- Xata vector search + pgvector + triple RAG (Upstash/FAISS/CocoIndex)
- OpenAI, Anthropic, Groq via Vercel AI SDK

## Code Style & Conventions

**TypeScript**: Strict mode, ESNext target, bundler resolution
**Formatting**: Prettier (no semicolons, single quotes, 100 char width)
**Imports**: Use `@/` for app paths, `@db/` for database, `workspace:*` for packages
**Components**: PascalCase names, kebab-case files, feature-first structure
**Error Handling**: Never suppress compiler errors without explicit user request
**Security**: Never commit secrets, use environment variables properly
