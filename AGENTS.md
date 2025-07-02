# Agent Guidelines for Ultraterrestrial Resurrection

## Build/Test Commands

- **Dev**: `bun run dev:app` (main app), `cd apps/app && bun run dev` (direct)
- **Build**: `bun run build:app` or `cd apps/app && bun run build`
- **Lint**: `cd apps/app && bun run lint` (ESLint + Next.js)
- **Test**: `cd apps/app && bun run test` (single test file)
- **Storybook**: `bun run storybook` or `cd apps/app && bun run storybook`

## Code Style Guidelines

- **Naming**: Directories `kebab-case`, Components `PascalCase`, hooks `camelCase` with `use` prefix, utils `kebab-case` named exports
- **Imports**: Use `@/` for src paths, `@db/` for database, absolute imports preferred
- **Components**: Default exports, functional components, Server Components by default, mark Client Components with `"use client"`
- **Types**: TypeScript strict mode disabled, use interfaces for props, prefer type inference
- **Error Handling**: Try/catch for async functions, user-friendly error messages, proper loading states
- **Styling**: Tailwind CSS only, component-specific styles in component files, use `cn()` utility for conditional classes

## Architecture Patterns

- **Monorepo**: `apps/app/` (main), `apps/disclosure-rag/` (RAG), `packages/` (shared)
- **Features**: Self-contained in `src/features/<feature>/` with `components/`, `hooks/`, `utils/`, `store/`, `actions/`
- **Services**: External integrations in `src/services/` (AI, processing, knowledge, sightings)
- **State**: Zustand for global state, React context for feature state, keep state local when possible
- **Data Fetching**: Server Components for SSR, SWR/React Query for client-side, Xata/Supabase via service layer

## Key Rules from .cursor/rules/

- Use App Router conventions, Server Actions for mutations, proper caching strategies
- Follow SOLID principles, composition over inheritance, dependency injection patterns
- Never expose secrets to client, sanitize user input, implement proper auth/authorization
- Co-locate test files with components, use Jest/React Testing Library

- Remember we use python3
- ALWAYS INCLUDE THE EXACT DATA AND TIME IN ANY DOCUMENTATION!

- Always write a summary of your work, features worked on, files touched, components effected and next steps
- Always update this doc when you finish any incremental task or code or feature
- Always timestamp the update

## Work Log - June 29, 2025

### Dual RAG Integration Implementation

**Status**: Complete (Architecture & Code) | Testing Pending (Environment Setup)

#### Features Implemented

1. **Dual RAG Adapter** - `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py`
   - Parallel search across Upstash (cloud) and CocoIndex (local)
   - Intelligent result merging with score weighting
   - Environment-based configuration and fallback handling
   - Error resilience and graceful degradation

2. **Enhanced FastAPI Endpoints** - `apps/disclosure-rag/api_server.py`
   - `POST /rag/search` - Dual system semantic search
   - `GET /rag/status` - System health monitoring
   - `POST /rag/index` - Document indexing to both systems
   - Backward compatibility with existing endpoints

3. **Frontend RAG Integration** - `apps/app/src/lib/rag/rag-llm-handler.ts`
   - Updated to use new dual search endpoints
   - Automatic fallback to legacy search if dual RAG unavailable
   - Enhanced result format with system metadata

4. **UI Source Indicators** - `apps/app/src/components/research/extensions/research-mention-suggestion.tsx`
   - Visual badges showing result source (☁️ Cloud, 💾 Local)
   - Enhanced mention suggestions with system information
   - Preserved existing UI patterns and styling

#### Files Created/Modified

- **NEW**: `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` - Core dual RAG implementation
- **NEW**: `apps/disclosure-rag/lib/adapters/__init__.py` - Module initialization
- **NEW**: `DUAL_RAG_INTEGRATION.md` - Complete integration documentation
- **NEW**: `COCOINDEX_QUICK_INTEGRATION.md` - Quick setup guide
- **NEW**: `RESEARCH_EDITOR_CHEATSHEET.md` - TipTap commands reference
- **NEW**: `setup_cocoindex.py` - Local testing script
- **NEW**: `test_dual_rag.py` - Integration test script
- **NEW**: `DUAL_RAG_STATUS.md` - Implementation status report
- **MODIFIED**: `apps/disclosure-rag/api_server.py` - Added dual RAG endpoints
- **MODIFIED**: `apps/app/src/lib/rag/rag-llm-handler.ts` - Enhanced search integration
- **MODIFIED**: `apps/app/src/components/research/extensions/research-mention-suggestion.tsx` - Added source badges

#### Architecture Benefits

- **Zero Breaking Changes**: Existing Upstash integration fully preserved
- **Flexible Configuration**: Enable/disable systems via environment variables
- **Performance**: Parallel search increases speed and result coverage  
- **User Transparency**: Clear indication of result sources
- **Cost Efficiency**: Option to process documents locally with CocoIndex
- **Scalability**: Load distribution across multiple systems

#### Technical Notes

- CocoIndex installation had dependency conflicts in current environment
- System gracefully falls back to Upstash-only mode when CocoIndex unavailable
- All RAG toolbar commands (Generate, Summarize, Fact Check) ready for testing
- New @ mention system shows enhanced search results with source badges

[@DUAL_RAG_STATUS.md](DUAL_RAG_STATUS.md)  
[@DUAL_RAG_INTEGRATION.md](DUAL_RAG_INTEGRATION.md)  
[@TIPTAP_AL_RAG_INTEGRATION_PLAN_V2.md](TIPTAP_AL_RAG_INTEGRATION_PLAN_V2.md)  
[@TODO.md](TODO.md)  
[@nified _status_report.md](nified%20_status_report.md)  
[@WORK_LOG_2025-06-29.md](WORK_LOG_2025-06-29.md)
