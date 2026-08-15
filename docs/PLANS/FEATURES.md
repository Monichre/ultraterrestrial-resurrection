---
status: live
role: product
spine: want
updated: 2026-08-13
---

# Feature Planning & High-Level Ideas

**Purpose**: Collaborative space for high-level feature concepts, architectural decisions, and strategic planning before they become actionable tickets.

**Last Updated**: 2026-08-09  
**Contributors**: Liam Ellis, Claude Code  
**Project**: Ultraterrestrial Resurrection - UFO/UAP Research Platform

---

## 🌟 Strategic Vision

**Mission**: Create the definitive interactive platform for UFO/UAP research, combining historical documentation, real-time disclosure tracking, AI-powered analysis, and immersive 3D visualizations.

**Core User Journey**:

1. **Discovery** → Interactive mindmap with AI-enhanced nodes
2. **Investigation** → Research Canvas with contextual intelligence
3. **Documentation** → Persistent research sessions with evidence tracking
4. **Narrative** → Guided historical tours with spatial intelligence

**Technical Philosophy**: "Orchestration over Replacement" - enhance the 1 working end-to-end AI path (disclosure/mindmap) rather than rebuilding. See AGENTS.md for grounded reality: only one AI path is fully operational in the Next.js app.

---

## 🎯 Current Focus Areas

### **1. External Web Resources RAG Integration** ⭐ **Priority 1**

**Vision**: Transform Prometheus AI into comprehensive UFO/UAP research platform with access to 90+ specialized external websites.

**Core Concept**: Use Firecrawl to pre-ingest external content → local search instead of slow real-time scraping. The Exa `searchExternalResources` tool already works in both active routes.

**Key Components**:

- **Content Pipeline**: Background crawling with quality filtering
- **Tool Architecture**: Formalize existing capabilities as Prometheus tools (searchUAP, searchDatabase, searchDocuments, searchWebResources, processDocument)
- **Integration**: Leverage existing Contextual Intelligence for orchestration

**Status**: ⚠️ ASPIRATIONAL — not yet built. The Exa real-time search tool exists in both active routes. Full pre-ingestion pipeline (Firecrawl → local vector store) has not been implemented.
**Decision**: Use tool-wrapper approach to enhance the working AI paths
**Notes**: The old "Triple RAG (40/40/20 Upstash/FAISS/Postgres split)" design is SCRAPPED — that was the Python RAG system which is completely disconnected from the Next.js app. The Next.js app uses OpenAI file_search + Postgres FTS/trgm only.
**Reference**: See `docs/plans/features/prometheus/PROMETHEUS_REQUIREMENTS_ANALYSIS.md` for detailed technical approach

---

### **2. Database Infrastructure Modernization** ✅ **COMPLETE (SP1-SP4)**

**Vision**: Full migration from Xata to Neon Postgres 17.10 + pgvector 0.8.0.

**Migration Status: COMPLETE (2026-06)**

What was actually done (SP1–SP4):

- **SP1**: Schema DDL (`0001_init.sql`) — 30 tables (incl. runtime-added `agent_inferences`), vector(1536), FTS, trgm indexes — loaded and verified on Neon
- **SP2**: Re-ingestion pipeline — 189 docs / 4,946 document chunks / 1,594 entity embeddings live (text-embedding-3-small @ 1536 dims; 6,540 total vectors, all entity embeddings 100% populated)
- **SP3**: App `@db` data-layer cutover — ~25 call sites migrated from `@db/xata` to `@db/postgres`. `@db/xata` is now **retired**.
- **SP4**: ufo-ui cherry-pick (`NetworkTimelineExplorer`) complete

**Live state**: 126,483 records across 30 tables (live `count(*)` 2026-07-24). Neon Postgres 17.10 + pgvector 0.8.0 is the sole database. `DATABASE_URL` lives in `packages/db/.env`.

**`@db/postgres`** is the ONLY import to use. `@db/xata` is retired — do not reference it.

---

### **3. Prometheus API Consolidation** ⭐ **Priority 3**

**Vision**: Eliminate redundancy across 5+ API endpoints, create coherent unified API architecture.

**Problem**: Multiple overlapping endpoints with mock/stubbed implementations

- `@apps/app/src/app/api/disclosure/chat/` - RAG chat interface (sophisticated, keep)
- `@apps/app/src/app/api/disclosure/mindmap/` - Mindmap entity extraction (has mocks)
- `@apps/app/src/app/api/historical-query/` - Historical data queries (redundant)
- `@apps/app/src/app/api/mindmap/records/` - Record management (redundant)
- `@apps/app/src/app/api/prometheus/chat/` - Core Prometheus chat (consolidate)

**Proposed Unified Structure**:

```
/api/prometheus/
├── chat/          # Core chat functionality (enhanced)
├── search/        # Unified search (consolidates historical-query + mindmap/records)
├── entities/      # Real NER extraction (replaces fake implementations)
└── rag/           # External + internal RAG coordination
```

**Solution**: Unified `/api/prometheus/` structure with real implementations
**Decision**: Keep domain-specific endpoints (disclosure/chat) separate, consolidate generic functionality
**Notes**: Replace fake NER with sophisticated implementations from disclosure/chat
**Reference**: Current implementation detailed in `DAILY_WORK_PLAN.md` Day 3

---

### **4. Unified Mindmap Experience Architecture** 🎯 **Priority 4**

**Vision**: Consolidate mindmap functionality into single coherent experience with enhanced state management and real-time collaboration.

**Current State**: Fragmented mindmap components across multiple contexts with inconsistent state management

**Unified Architecture**:

- **Foundation API**: Single source of truth for mindmap data
- **State Management**: Centralized Zustand store with real-time synchronization  
- **Enhanced Nodes**: All mindmap nodes use `enhancedEntityNodePOC` consistently
- **Spatial Intelligence**: Integrated proximity analysis and contextual grouping
- **Tour Integration**: Seamless connection between exploration and guided narratives

**Key Components**:

- Unified API endpoints for all mindmap operations
- Real-time collaboration via Liveblocks integration
- Enhanced state persistence and session restoration
- Contextual intelligence for smart relationship detection

**Benefits**: Consistent user experience, reduced maintenance overhead, enhanced performance
**Reference**: Extracted from Todo2 architecture foundation (T-10)

---

### **5. Research Canvas Integration as Contextual Panel** 📝 **Priority 5**

**Vision**: Transform research canvas from standalone component to integrated contextual panel within mindmap workflow.

**Integration Strategy**:

- **Panel Architecture**: Slide-out contextual panel triggered by mindmap interactions
- **TipTap Enhancement**: Advanced research editor with AI-powered assistance
- **Session Management**: Automatic research session creation from spatial grouping
- **Evidence Tracking**: Persistent evidence collection linked to mindmap entities

**Key Features**:

- Seamless transition from mindmap discovery to research documentation
- AI-powered research assistance with RAG integration
- Real-time collaboration on research sessions
- Evidence citation and relationship tracking

**User Journey**: Mindmap Discovery → Contextual Research Panel → Session Documentation → Evidence Validation
**Reference**: Extracted from Todo2 integration concept (T-11)

**Superseding upgrade (2026-08-09):** The live shell is already `/research-canvas` → mindmap `Graph`. Strategic follow-on is **Decision 11 / T-053** — Gen-UI Deep Research loop + agentic `researchSession` on that shell (not a TipTap sidecar revival). See [`2026-08-09-research-canvas-genui.md`](./2026-08-09-research-canvas-genui.md).

---

### **5b. Research Canvas Gen-UI upgrade** ⭐ **Priority — Lane B feature upgrade**

**Vision**: Make `/research-canvas` an agentic investigation surface: thin command rail, Graph as the durable canvas, explicit plan → multi-hop retrieve → liturgy dossier — with inspectable tool cards during the run.

**Status**: 🟡 Specced 2026-08-09 — **T-053 / [DMGD-219](https://linear.app/digital-mischief-group/issue/DMGD-219/lane-b-research-canvas-gen-ui-upgrade-deep-research-loop-agentic)** · Backlog
**Decision**: Decision 11 (below)
**Canonical plan**: [`docs/plans/2026-08-09-research-canvas-genui.md`](./2026-08-09-research-canvas-genui.md)
**Phases**: RC-P0 ToolCards → RC-P1 expand `researchSession` → RC-P2 wire Deep Research mode → RC-P3 dossier bridge → RC-P4 plan→waypoints (soft-deps T-050)

---

### **6. 3D Visualization Spatial Integration** 🌐 **Priority 6**

**Vision**: Advanced 3D globe visualization with spatial intelligence for geographic UAP incident mapping and temporal analysis.

**Current State**: Basic 3D components exist but lack integration with spatial intelligence and mindmap systems

**Enhanced Architecture**:

- **Globe Integration**: Three.js globe with incident location mapping
- **Spatial Intelligence**: Integration with existing `useSpatialGrouping` for geographic clustering
- **Temporal Analysis**: Time-based incident visualization and pattern recognition
- **Interactive Navigation**: Seamless zoom from global view to local incident details

**Technical Requirements**:

- Enhanced Three.js globe with performance optimization
- Spatial indexing for efficient geographic queries
- Integration with existing mindmap spatial intelligence
- Real-time updates for collaborative exploration

**User Stories**:

- "Show me all UFO incidents within 100 miles of Area 51"
- "Display the temporal progression of disclosure events globally"
- "Find geographic clusters of similar incident types"

**Reference**: Extracted from Todo2 3D visualization concept (T-13)

---

### **7. Workspace-Wide Prompts System** 🔄 **Priority 7**

**Vision**: Centralized prompts management shared across apps/app and apps/disclosure-rag.

**Current State**: Scattered prompts in various files, inconsistent management

- `src/services/ai/prompts/daedalus.prompt.ts` - Research assistant system prompt
- OpenAI Assistant prompts (asst_sdNxYC9p05iGpeKXtL496cyh)
- Various feature-specific prompts in AI services

**Target Architecture**: `@repo/prompts` workspace package

```
packages/prompts/
├── system/          # Core system prompts
├── research/        # Research and analysis prompts
├── extraction/      # Entity and data extraction prompts
├── generation/      # Content generation prompts
└── templates/       # Reusable prompt templates
```

**Features**: Versioning, A/B testing, dynamic parameter injection, environment variations
**Integration**: TypeScript interfaces, template engine, cross-package sharing
**Benefits**: Consistency, version control, performance optimization through caching
**Reference**: Detailed in `DAILY_WORK_PLAN.md` Day 4

---

### **8. File-Based Storage & Data Layer (Source-of-Truth Files)** 🔎 **Strategic — Tracking**

**Vision**: Give `packages/knowledge-base`'s 950 raw source files (31 case PDFs, 833 transcripts, 68 web scrapes) a managed, URL-addressable home with presigned access — instead of raw disk + `metadata/index.json` path strings. Wire first-class file tools into the Prometheus/mindmap agents alongside the existing `searchDatabase`/`searchExternalResources` tools.

**Why now**: Reviewed Neon **Files SDK** (`files-sdk` v2.2.0, <https://files-sdk.dev>) and the `with-files-sdk` Neon example (<https://github.com/neondatabase/examples/tree/main/with-files-sdk>). Three things line up with this codebase:

1. **Branchable object storage** — Neon buckets are copy-on-write per DB branch; an experiment branch gets its own isolated file state. Matches the "research canvas / experiment with a corpus" ethos.
2. **Native Vercel AI SDK tools** — `createFileTools({ files })` from `files-sdk/ai-sdk` drops straight into `generateText`/`streamText`, which is exactly what `/api/prometheus/chat` already uses. Read tools need no approval; writes gated by default; `readOnly: true` strips writes. ~5 lines to give agents file browsing.
3. **Fills a real gap** — the raw source files currently have no managed home. `documents` (189 rows) + `document_chunks` (4,946 rows) hold *processed* artifacts in Postgres; the *raw* sources sit on disk with only `index.json` referencing them by path.

**Catch — region blocker (decisive for timing)**: Neon object storage is a **preview feature, only on *new* projects in `us-east-2`**. The live project (`ep-red-sky-…`, `us-east-1`, 126,483 records) **cannot** enable it. Adopting it means either (a) migrating to a new `us-east-2` project, or (b) running a separate storage-only project alongside — both non-trivial given the data volume and live agent paths.

**Other notes**:

- v2.2.0 just shipped (too fresh to pin in production per the >=7-days dependency guidance; watch it for a week or two).
- Pulls AWS SDK v3 peer deps (`@aws-sdk/client-s3` + presigners) — fine for server routes, avoid the client bundle.
- Clean credential story depends on the Neon CLI (`neon deploy` / `neon env pull` injecting `AWS_*` vars); the repo doesn't currently use the Neon CLI.

**Proposed architecture** (see "Proposal: Official file-based storage + data layer" below for the full version):

- **Two layers, complementary** — object storage for *raw* source files; Postgres + pgvector for *processed* chunks/embeddings. Do not move chunks out of Postgres.
- **Adapter pattern** — `files-sdk` adapter behind a thin `@repo/files` package, so the provider is swappable (Neon / R2 / S3) without touching call sites.
- **Agent file tools** — `createFileTools({ files, readOnly: true })` added to Prometheus as a new `browseFiles` tool alongside existing `searchNeonDatabase`/`searchExternalResources`.
- **Phased adoption** — (1) abstract today behind an interface; (2) spike on a throwaway `us-east-2` project when bandwidth allows; (3) adopt when GA or `us-east-1` opens.

**Status**: 🟡 STRATEGIC / TRACKING — not actionable until the region constraint clears or a deliberate migration is approved.
**Decision**: Log as a strategic option. Do not adopt on the current project. Re-evaluate when Neon object storage GA's or expands to `us-east-1`.
**Reference**: Full proposal in "Proposal: Official file-based storage + data layer" section below. Review notes in this session (2026-07-24).

---

## 🌟 Emerging Ideas & Future Concepts

### **Natural Language Tours (Agentic Tours)** 🎙️ **Post-MVP**

> ⚠️ **SCRAPPED (as of 2026-03-29 roundtable)**: The multi-agent tour orchestrator (6 agent classes specced July 2025) was scrapped — **zero code was ever written**. Do not plan against this architecture. See `docs/plans/2026-03-29-documentation-roundtable-report.md`.

**Idea**: Voice/text-controlled tour navigation - "Take me to the Roswell connection" or "Show me government involvement"
**Dependencies**: Enhanced Nodes, Contextual Intelligence (both exist), working AI agent path
**Technical Requirements**: Advanced NLP, tour state management, natural language understanding
**User Stories**:

- "Show me all government officials connected to Roswell"
- "Take me through the Pentagon UFO disclosure timeline"
- "Find connections between Bob Lazar and Area 51"
**Complexity**: High - requires building on the working disclosure/mindmap agent path
**Timeline**: Future (blocked on UX hardening and state management work first)

### **UFO Research Methodology Framework** 🔬 **Future Phase**

**Idea**: Develop systematic approach to UFO/UAP research based on famous researchers' methodologies (Jacques Vallée, Diana Pasulka Walsh, etc.)

**Research Framework Components**:

- **Vallée Classification System**: Standardized incident categorization and analysis
- **Evidence Evaluation**: Multi-dimensional credibility assessment inspired by scientific methodology
- **Source Verification**: Academic standards for witness testimony and document authentication
- **Pattern Analysis**: Statistical approaches to identifying meaningful correlations
- **Historical Context**: Temporal relationship mapping and sociocultural analysis

**Implementation Strategy**:

- Research methodologies database with tagged approaches
- AI-powered analysis scoring based on established frameworks
- Template-driven investigation workflows
- Cross-reference validation using multiple researcher perspectives

**Value Proposition**: Brings academic rigor to UFO research, provides structured investigation paths
**Timeline**: Future phase (requires extensive research methodology analysis)

### **Performance Optimization and Caching** ⚡ **Architecture Enhancement**

**Vision**: Comprehensive performance optimization with intelligent caching and web worker integration.

**Optimization Areas**:

- **Smart Caching**: Multi-layer caching strategy for database queries, RAG results, and API responses
- **Web Workers**: Background processing for heavy computational tasks
- **Bundle Optimization**: Code splitting and lazy loading for improved initial load times
- **Database Indexing**: Advanced indexing strategies for complex spatial and temporal queries

**Performance Targets**:

- Sub-2s response times for all core operations
- 99.9% uptime with graceful degradation
- Efficient memory usage for large dataset operations
- Real-time collaboration without performance impact

**Reference**: Extracted from Todo2 performance optimization (T-16)

### **AI-Driven Research Insights** 🧠 **Future Phase**

**Idea**: Proactive pattern detection across research sessions - "Users researching X also discover Y"
**Components**:

- Session analytics and user behavior tracking
- Pattern recognition across research paths
- Collaborative filtering recommendation engine
- Anomaly detection for unusual connections
**Value Proposition**: Discovery acceleration, hidden connection identification, research community insights
**Technical**: Machine learning models, graph analysis, behavioral analytics
**Timeline**: Future phase (requires sufficient user data)

### **Multi-Modal Research** 📹 **Advanced Feature**

**Idea**: Comprehensive media analysis integration with text-based research
**Capabilities**:

- **Document Image OCR**: Extract text from declassified documents, witness sketches
- **Video Analysis**: Testimony analysis, object detection in footage, temporal analysis
- **Audio Processing**: Interview transcription, voice analysis, audio enhancement
- **Cross-Modal Search**: "Find videos mentioning entities from this document"
**Technical Stack**: Computer vision (OpenCV, YOLO), speech-to-text (Whisper), multi-modal embeddings (CLIP)
**Integration**: Extend the live FTS + pgvector search paths (`searchDatabase` in both active routes) with multi-modal vector storage; embeddings use `text-embedding-3-small` @ 1536 dims via `@db/postgres`. Note: there is no "Triple RAG" — the Next.js app has two search paths (OpenAI file_search + Postgres FTS/pgvector), not three.
**Timeline**: Advanced feature (requires significant ML infrastructure)

### **Collaborative Investigation Workspaces** 👥 **Future Vision**

**Idea**: Multi-user investigation environments with real-time collaboration
**Features**:

- Shared research sessions with live cursors
- Collaborative annotation and evidence tagging
- Group discussions threaded to specific evidence
- Peer review and verification workflows
**Technical**: WebRTC for real-time, operational transforms for collaborative editing
**Dependencies**: User authentication system, advanced permissions model
**Timeline**: Long-term (requires mature platform and user base)

### **AR/VR Historical Recreation** 🥽 **Visionary**

**Idea**: Immersive experiences recreating historical UFO events in AR/VR
**Use Cases**:

- VR recreation of Roswell crash site with testimony overlay
- AR visualization of UFO sightings in user's current location
- 3D reconstruction of declassified incidents
**Technical**: WebXR, 3D modeling, spatial computing, location-based services
**Timeline**: Visionary (requires significant 3D content creation and specialized hardware adoption)

---

## 📦 Proposal: Official file-based storage + data layer

**Authored**: 2026-07-24 (post-review of Neon Files SDK v2.2.0 + `with-files-sdk` example)
**Status**: Proposal — awaiting decision. Tracked as Focus Area #8 above.

### The problem, precisely

`packages/knowledge-base` holds **950 raw source files** on disk (31 case PDFs, 833 transcripts across 50 day-folders, 68 web scrapes). The only index is `metadata/index.json` (564 docs) referencing them by **absolute filesystem path**. Consequences:

- No presigned URLs — agents and UI can't address a file by URL.
- No branchable state — a corpus experiment means copying files on disk.
- No lifecycle — no versioning, no soft-delete, no audit of who uploaded what.
- `documents` (189 rows) + `document_chunks` (4,946 rows) in Postgres hold the *processed* artifacts (summaries, chunks, embeddings), but the *raw* source-of-truth files have no managed home. Re-processing means re-finding the file on disk.
- Agents (`/api/prometheus/chat`, `/api/disclosure/mindmap`) have `searchDatabase` (FTS+pgvector) and `searchExternalResources` (Exa) but **no file-browsing tool** — they can't list or read a raw source PDF.

### The two-layer model (the core architectural decision)

Keep the **retrieval layer** in Postgres; add a **file layer** for raw sources. They are complementary, not competing.

```
┌─────────────────────────────────────────────────────────────┐
│  FILE LAYER  (new)  — raw source-of-truth files             │
│  object storage (Neon / R2 / S3) via files-sdk adapter      │
│  upload · download · url(presigned) · list · search · head   │
│  keys:  case-files/<id>.pdf · transcripts/<date>/<slug>.txt │
│         web/<date>/<slug>.<ext>                             │
└───────────────┬─────────────────────────────────────────────┘
                │  ingest pipeline (existing, extended)
                │  PDF/txt → extract → chunk → embed
                ▼
┌─────────────────────────────────────────────────────────────┐
│  RETRIEVAL LAYER  (existing, keep)  — Postgres + pgvector   │
│  documents (189) · document_chunks (4,946) · embeddings     │
│  FTS (search_vector) + vector(1536) cosine + trgm fallback  │
│  searchDatabase() in both active AI routes                  │
└─────────────────────────────────────────────────────────────┘
```

**Rule**: object storage never holds embeddings or chunks. Postgres never holds raw file bytes. The `documents` row stores the object key (replacing the current `url`/path string) and links to its chunks.

### The adapter seam — `packages/files` (new workspace package)

A thin package so the provider is swappable without touching call sites. Mirrors how `@db/postgres` abstracts the DB driver.

```
packages/files/
├── src/
│   ├── index.ts            # public API: upload/download/url/list/search/head
│   ├── adapter.ts          # interface + factory
│   ├── adapters/
│   │   ├── neon.ts         # files-sdk neon adapter (target)
│   │   ├── r2.ts           # files-sdk r2 adapter (fallback)
│   │   └── fs.ts           # filesystem adapter (local dev / today)
│   └── tools.ts            # createFileTools wrapper for the AI SDK
├── package.json            # files-sdk as optional peer
└── README.md
```

Public surface (provider-agnostic):

```typescript
import { files } from '@repo/files'
await files.upload('case-files/roswell.pdf', body)
const url = await files.url('case-files/roswell.pdf', { expiresIn: 3600 })
for await (const f of files.search('transcripts/2024-11-*/**')) { ... }
```

**Today (no Neon object storage)**: ship the `fs` adapter backed by `packages/knowledge-base/sources/`. Every call site uses the interface; the interface works against local disk. Zero new infra, zero region dependency, zero new deps in the client bundle. This is the low-risk first step that unblocks the agent file tool and URL-addressability *now*.

**When Neon object storage is available**: swap `adapter: neon({ bucket })` in one place. Call sites don't change.

### Agent integration — the `browseFiles` tool

Add to the Prometheus route (`apps/app/src/app/api/prometheus/chat/route.ts`) and the mindmap route, alongside the existing tools:

```typescript
import { createFileTools } from 'files-sdk/ai-sdk'   // or @repo/files wrapper
const fileTools = createFileTools({ files, readOnly: true })
// → { listFiles, getFileMetadata, downloadFile, getFileUrl }

tools: {
  ...existingTools,          // searchNeonDatabase, searchExternalResources, …
  ...fileTools,              // browseFiles family — read-only, no approval gate
}
```

Read-only by default — agents can browse and read raw sources but not mutate the corpus. This is the missing piece: today an agent can *search* the processed chunks but can't *open* the original PDF a chunk came from. With this, a researcher asking "show me the source for that claim" gets a presigned URL to the actual case file.

### Phased adoption

| Phase | What | Infra | Risk | When |
| --- | --- | --- | --- | --- |
| **1 — Abstract** | `@repo/files` package with `fs` adapter; point at `knowledge-base/sources/`. Add `browseFiles` (read-only) to Prometheus. Store object *keys* (not absolute paths) in `documents.url`. | none (local disk) | low | can start now |
| **2 — Spike** | Throwaway `us-east-2` Neon project. Upload the 31 case PDFs. Validate branchable-corpus story + `createFileTools` end-to-end. | new us-east-2 project | low (throwaway) | when bandwidth allows |
| **3 — Adopt** | Migrate `@repo/files` to `neon` adapter (or R2 if Neon region constraint persists). Move all 950 sources. Wire `neon deploy` into the flow. | production object store | medium | when Neon GA's / opens us-east-1, OR a deliberate R2/S3 decision is made |

### What NOT to do

- **Do not** move `document_chunks` or embeddings into object storage. pgvector retrieval stays in Postgres — that's the working layer both AI routes depend on.
- **Do not** adopt `files-sdk` v2.2.0 on the current `us-east-1` Neon project — object storage can't be enabled there.
- **Do not** pin `files-sdk` in production until it's ≥7 days old (per dependency guidance) and GA-rated, not preview.
- **Do not** put `files-sdk` or AWS SDK v3 in the client bundle — keep it server-side.

### Open decisions (for Liam)

1. **Provider preference when the time comes**: Neon native (branchable, but region-locked), Cloudflare R2 (no egress fees, no branch story), or plain S3? The `@repo/files` seam makes this reversible.
2. **Phase 1 now?** The `fs` adapter + `browseFiles` tool is low-risk and unblocks agent file access without waiting on Neon. Worth doing as a TODO.md ticket, or hold the whole track until the storage decision is made?
3. **Migration of the 950 existing files**: one-shot bulk upload vs. lazy migration (upload on first access)? Affects the ingest pipeline shape.

---

## 🏗️ Architectural Decisions Log

### **Decision 1: Tool-Based Architecture Approach**

**Date**: August 9, 2025  
**Context**: External RAG integration strategy  
**Decision**: Wrap existing capabilities as formal Prometheus tools rather than rebuild
**Rationale**: Preserves the working AI paths (disclosure/mindmap + prometheus/chat), enables incremental enhancement without rebuilding
**Impact**: Low risk, high compatibility, leverages existing Contextual Intelligence
**Status**: ✅ Approved - Implementation ready

### **Decision 2: Firecrawl Pre-Ingestion Strategy**

**Date**: August 9, 2025  
**Context**: External web resources access method  
**Decision**: Pre-ingest content to local vector store vs real-time scraping
**Rationale**: Fast search but slow integration solved by local storage
**Impact**: Fast responses, reliable performance, respects external sites
**Technical Details**: Background crawling → local storage → fast local search
**Status**: ⚠️ ASPIRATIONAL — not implemented. The "Triple RAG (40/40/20 Upstash/FAISS/Postgres split)" design is **SCRAPPED** — that was the Python RAG system (`apps/disclosure-rag/`) which is completely disconnected from the Next.js app. The Next.js app uses only OpenAI file_search + Postgres FTS/trgm.

### **Decision 3: API Consolidation Boundaries**  

**Date**: August 9, 2025  
**Context**: Which APIs to consolidate vs keep separate
**Decision**: Consolidate generic functionality, preserve domain-specific endpoints
**Rationale**: disclosure/chat has sophisticated implementations worth preserving
**Impact**: Reduces redundancy while maintaining working sophisticated features
**Preserved**: `disclosure/chat` (sophisticated NER), domain-specific functionality
**Consolidated**: Generic search, entity extraction, historical queries
**Status**: ✅ Approved - Implementation plan in DAILY_WORK_PLAN.md

### **Decision 4: Three-Tier Project Management**

**Date**: August 9, 2025
**Context**: Project management workflow optimization
**Decision**: FEATURES.md (strategic) → TODO.md (actionable) → DAILY_WORK_PLAN.md (tactical)
**Rationale**: Prevents overwhelm, natural feature maturation flow, clear boundaries
**Impact**: Improved focus, better planning, reduced context switching
**Status**: ✅ Implemented - Active use

### **Decision 5: Monorepo Workspace Architecture**

**Context**: Shared code and cross-package dependencies
**Decision**: Maintain existing workspace structure with new `@repo/prompts` package
**Rationale**: Established patterns work well, centralized prompts solve consistency issues
**Packages**: `@db`, `@ai`, `@knowledge-base`, `@prompts` (new)
**Status**: ✅ Approved - Prompts package implementation planned

### **Decision 6: Research Canvas Integration Approach**

**Context**: Standalone research-canvas app vs integrated features
**Decision**: Consolidate TipTap components into main app, deprecate standalone
**Rationale**: Reduces maintenance overhead, improves user experience continuity
**Migration**: `@apps/research-canvas/` → `@apps/app/src/features/research-canvas/`
**Status**: 🔄 In Progress - Referenced in TODO.md

### Decision 7: Postgres + pgvector as sole database (SP1-SP4 Complete)

**Date**: June 2026
**Decision**: Full migration from Xata to Neon Postgres 17.10 + pgvector 0.8.0. @db/xata retired.
**Status**: ✅ COMPLETE — 126,483 records, 30 tables, 1,594 entity embeddings + 4,946 doc chunks live (count(*) 2026-07-24).

### Decision 8: Docs six-question spine + aggressive prune (2026-07-19)

**Date**: 2026-07-19
**Context**: `docs/` had ~24MB of prototypes, moodboards, stale indexes, and missing `docs/agents/` paths.
**Decision**: Restructure around six navigation questions (exists → where → how → want → do → start). Living canon ~22 files. `docs/README.md` is the only index. Agent intake moves to `docs/ops/`. Prototypes/binaries → `docs/archive/` or deleted. Prompts/personas stay in `packages/ai/`.
**Impact**: ~85% size reduction (24MB → ~3.5MB). CLAUDE/AGENTS paths fixed. Canvas: `docs-root-and-prune`.
**Status**: ✅ Implemented on branch `docs/root-and-prune`

### Decision 10: Disclosure Lab as Neon admin console (2026-08-09)

**Date**: 2026-08-09
**Context**: Need an internal surface to inspect and correct Neon entity fidelity without treating admin tooling as Research Canvas. Grilling closed on DMGD-216 / T-052.
**Decision**: Ship `apps/disclosure-lab` as a Database-context **admin layer** over `@db/postgres` (live `DATABASE_URL`). Human INSERT/UPDATE on entity allowlist with confirm-every-write; Lab assistant is read/analyze only in v1; no DELETE. Canvas inference-only write rule remains scoped to Research Canvas (`apps/app`).
**Impact**: Separates operator corpus edits from Investigation/Inference semantics. Spec: [`docs/plans/2026-08-09-disclosure-lab.md`](./2026-08-09-disclosure-lab.md). Linear: DMGD-216.
**Status**: 🟡 In progress — implementation started 2026-08-09

### Decision 11: Research Canvas Gen-UI = Deep Research loop on agentic canvas (2026-08-09)

**Date**: 2026-08-09
**Context**: Fit analysis of awesome-llm-apps Gen-UI demos ([deep research](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-deep-research-agent), [dashboard canvas](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/generative_ui_agents/ai-dashboard-canvas-agent)) against the live `/research-canvas` mindmap shell.
**Decision**:

1. Steal Deep Research’s **plan → multi-hop → dossier + ToolCards** interaction model.
2. Steal Dashboard Canvas’s **thin chat + shared AgentState the agent mutates** geometry (already mostly true of Graph + console).
3. Host on the **existing disclosure mindmap path** (`useMindMapAgent` + `/api/disclosure/mindmap`); expand T-027 `researchSession` as AgentState.
4. **Reject** CopilotKit / ADK / LangGraph dual runtimes, Tavily-as-primary, SaaS KPI dashboard grammar, and a Deep Research Workspace sidecar as the long-term UX.
5. Project intelligence into Graph / waypoints / SynthesisPanel — not insight-card sidebars.
**Impact**: Feature upgrade tracked as T-053 / DMGD-219. Soft-deps T-050 only for plan→waypoint projection (RC-P4). Spec: [`docs/plans/2026-08-09-research-canvas-genui.md`](./2026-08-09-research-canvas-genui.md).
**Status**: 🟡 Specced — Backlog (ready to claim)

### Decision 12: YouTube podcast ingest — enhance disclosure-rag, reject parallel n8n+Qdrant stack (2026-08-12)

**Context**: Reviewed external n8n templates (Apify→Qdrant RAG search; playlist analyst chatbot) plus a 52-playlist UAP podcast catalog. Templates solve transcript RAG + timestamp citations well but run on n8n + Qdrant + Redis (+ Apify/Gemini embeddings), disconnected from Neon pgvector, trace maps, and live mindmap/Prometheus paths.

**Decision**:

1. **Ingest** UAP podcast playlists through existing `apps/disclosure-rag/scripts/playlist_ingestion.py` after T-048 H1 — ticketed **T-057**, **T-059**.
2. **Port patterns only** — grouped multi-video retrieval and `&t=` timestamp citations into live AI tools — ticketed **T-058**. No second vector database.
3. **Reject** adopting n8n workflows as production ingest or search surfaces; archive JSON references under `packages/ai/prompts/` for pattern study.
4. **Reject** Psynalytics research-proposal Telegram workflow for YouTube corpus work (wrong domain); multi-agent outline→JSON→artifact pattern may inform T-055/T-029 later.

**Impact**: T-057, T-058, T-059 in `docs/plans/TODO.md`.

### Decision 13: Assembling-components wires into existing Next.js + disclosure-ui (2026-08-13)

**Context**: assembling-components was customized as a vault in `disclosure-design-references`. The assembly target is this monorepo's Next.js 15 app, which already has `@repo/disclosure-ui` (`--du-*` registers), next-themes (`class` + forced dark), and shadcn/Radix primitives.

**Decision**:

1. **Do not** generate a Vite/FastAPI/Axum scaffold.
2. Map assembling token names (`--color-*`, `--spacing-*`, …) as **aliases** on `--du-*` in `packages/disclosure-ui/styles/tokens.css`.
3. Dual-write `data-theme` beside Tailwind `class`; keep `forcedTheme='dark'`.
4. Mount `ToastProvider` at root; add skill-chain barrels that re-export existing chrome (`ResearchDeskShell` as Dashboard, `ResearchAppChrome` as Header).
5. Token-validate **new** assembling CSS only. Legacy `globals.css` / feature hex remains an open migration.

**Impact**: `docs/plans/AssemblingComponentsApply.md`.

---

## 🔄 Implementation Flow

**Feature Journey**: FEATURES.md (concepts) → TODO.md (actionable tickets) → DAILY_WORK_PLAN.md (current execution)

### **Criteria for Moving Features to TODO.md**

1. ✅ Technical approach decided and documented
2. ✅ Dependencies identified and resolved
3. ✅ Success criteria clearly defined
4. ✅ Timeline estimated with confidence
5. ✅ Implementation files identified
6. ✅ Architectural decisions logged
7. ✅ Integration points mapped to existing systems

### **Criteria for Moving to DAILY_WORK_PLAN.md**

1. ✅ Feature broken into specific tasks (2-4 hour chunks)
2. ✅ Required immediate execution within current sprint
3. ✅ Dependencies resolved or scheduled
4. ✅ Resources allocated and available
5. ✅ Success metrics and validation criteria defined
6. ✅ Risk mitigation strategies identified

### **Feature Maturation Status**

- **External Web RAG**: ✅ Live through the shared Exa research tool; further work belongs in Linear
- **API Consolidation**: ✅ Two live paths with shared DB/Exa tools; OpenAI Assistants boundary documented
- **Prompts System**: ✅ Shared epistemic guidance and frontier fallback implemented; further work belongs in Linear
- **Deep Research / Research Canvas Gen-UI**: ✅ Approach decided (Decision 11) — ticketed as T-053 / DMGD-219; RC-P0–P4 in `docs/plans/2026-08-09-research-canvas-genui.md`
- **Natural Language Tours**: ⛔ SCRAPPED — multi-agent tour orchestrator was specced July 2025, zero code written, scrapped at 2026-03-29 roundtable. Do not pursue. (Guided-tours convergence is **T-050**, a different ticket.)
- **TipTap Integration**: ✅ Ready for TODO.md (detailed plan exists)

### **Current Development Pipeline**

- **Active tracker**: Linear project `Ultraterrestrial Resurrection` (DMG Dev)
- **Backlog (ready to claim)**: Research Canvas Gen-UI **DMGD-219 / T-053**
- **In review**: agent consolidation, provider fallback, design canon, documentation cleanup, and Linear cutover
- **Blocked**: screenshot-grounded UX audit until a browser backend is available
- **Planning**: 10-source LLM-wiki provenance pilot decision; local-agent definition refresh

---

## 📊 Feature Priority Matrix

### **Current Sprint Readiness**

| Feature | Technical Complexity | Business Value | Implementation Risk | Priority Score |
| --------- | --------------------- | ---------------- | ------------------- | --------------- |
| External Web RAG | Medium | Very High | Low | ⭐⭐⭐⭐⭐ |
| API Consolidation | Low | High | Low | ⭐⭐⭐⭐ |
| Prompts System | Medium | Medium | Low | ⭐⭐⭐ |
| ~~Smart Tours Integration~~ | ~~Low~~ | ~~High~~ | ~~Very Low~~ | ⛔ SCRAPPED |
| TipTap RAG Integration | Medium | High | Medium | ⭐⭐⭐ |
| Research Canvas Gen-UI (T-053) | Medium–High | Very High | Medium | ⭐⭐⭐⭐ |

### **Resource Allocation Recommendations**

- **Immediate Focus**: Research Canvas Gen-UI RC-P0–P2 when claimed (T-053 / DMGD-219) — Smart Tours orchestrator was scrapped; T-050 is the live tour path
- **Parallel**: Disclosure Lab (T-052), T-050 render, Lane A T-048 H1
- **Next Sprint**: External Web RAG pre-ingest (still aspirational; Exa live today)
- **Following Sprint**: TipTap Integration if still desired after Gen-UI dossier lands
- **Research Phase**: Closed for Gen-UI fit — Decision 11 is the SoT

---

## 📝 Collaboration Notes

**For Liam**: Add ideas, architectural preferences, strategic priorities, user experience insights
**For Claude**: Technical feasibility, implementation strategies, risk assessment, performance analysis

### **Note-Taking Format**

```markdown
**[Your Name] - [Date]**: [Brief note or idea]
**Decision Needed**: [What needs to be decided]
**Research Required**: [What needs investigation]
**Impact Assessment**: [Expected effects on users/system]
```

### **Active Collaboration Items**

**Liam - Aug 9**: Really like the tool architecture approach - feels natural and builds on what works  
**Decision Needed**: Priority order for external websites to crawl first (suggest starting with government archives, major databases)
**Research Required**: Firecrawl rate limits and cost implications for 90+ sites  
**Claude - Aug 9**: Recommend tiered crawling: Tier 1 (archives.gov, MUFON, NICAP), Tier 2 (databases), Tier 3 (community sites)

**Decision Needed**: User authentication strategy for collaborative features
**Research Required**: Integration approach with existing Clerk auth system
**Impact Assessment**: Affects all future collaborative and personalization features

**Decision Needed**: Mobile optimization priority vs desktop-first development
**Research Required**: User analytics on device usage patterns
**Impact Assessment**: Core user experience accessibility and engagement

---

## 🎯 Success Metrics Framework

### **Technical KPIs**

- **Performance**: <2s response time for all core operations
- **Reliability**: 99.9% uptime target
- **Search Quality**: >85% relevance score for RAG search results
- **Integration Success**: <0.1% error rate across consolidated APIs

### **User Experience KPIs**

- **Engagement**: >15 min average session duration
- **Discovery**: >30% cross-reference discovery rate
- **Research Effectiveness**: 30%+ reduction in time to find information
- **Feature Adoption**: 60%+ of users utilizing new capabilities within 30 days

### **Business KPIs**

- **Knowledge Base Growth**: 10,000+ documents across external sources
- **User Retention**: >80% weekly active user retention
- **Community Growth**: >25% monthly user base growth
- **Content Quality**: >4.2/5.0 user satisfaction rating

---

*This document serves as the strategic foundation for tactical implementation. Features mature here through collaborative refinement before becoming actionable tickets in TODO.md and detailed execution plans in DAILY_WORK_PLAN.md.*
