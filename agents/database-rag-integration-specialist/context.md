# Database & RAG Integration Specialist - Context

**Agent ID:** `database-rag-integration-specialist`
**Current Status:** Ready to debug xataToXYFlow and verify RAG systems

## Technical Context

### Primary Issue: `xataToXYFlow` Not Returning Records
**Problem Location:** `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`
**Symptom:** Entity nodes not populating when clicking entity types in mindmap
**Expected Behavior:** Database queries should return entity records for visualization

### RAG System Architecture (4 Systems)

#### 1. Postgres + CocoIndex
- **Remote:** Xata Postgres Wire Enabled instance
- **Local:** Local PostgreSQL for development
- **Purpose:** Primary database with vector search capabilities

#### 2. OpenAI Vector Storage
- **Type:** OpenAI's managed vector database
- **Integration:** Direct API calls to OpenAI vector endpoints
- **Purpose:** AI-powered semantic search

#### 3. Upstash Vector
- **Type:** Cloud-based vector search service
- **Purpose:** Distributed vector storage and search
- **Integration:** Redis-compatible interface

#### 4. Hybrid Orchestration
- **Purpose:** Intelligent routing between the above 3 systems
- **Location:** `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py`
- **Function:** Query routing, result merging, fallback handling

### Critical Files for Debugging

#### Database Integration
- `apps/app/src/features/mindmap/actions/xata-to-xyflow.ts` - Primary issue location
- `packages/db/xata/api/xata-to-xyflow.ts` - Database query utilities
- `packages/db/xata/client.ts` - Database client configuration

#### RAG System Files
- `apps/disclosure-rag/lib/adapters/dual_rag_adapter.py` - Primary RAG orchestration
- `apps/disclosure-rag/lib/storage/local_vector_library.py` - Backup vector storage
- `apps/disclosure-rag/lib/adapters/triple_rag_schema_adapter.py` - Schema adaptation

### Database Schema Context
**Tables Critical for `xataToXYFlow`:**
- `topics` - Core UFO/UAP entities
- `personnel` - Key figures
- `events` - Historical incidents
- `organizations` - Related organizations
- `testimonies` - Witness accounts

### Environment Dependencies
- Database connection via Postgres Wire Protocol
- OpenAI API keys for vector storage
- Upstash Redis connection strings
- RAG system authentication

### Coordination Dependencies
- **Agent 1:** Database must be properly seeded before debugging `xataToXYFlow`
- **Agent 2:** Research Canvas RAG integrations must be preserved during consolidation
- **Shared:** Environment variables and connection settings must be consistent

### Expected Performance Targets
- **Query Response Time:** Sub-2s for all core operations
- **RAG Coordination:** All 4 systems returning results
- **Error Handling:** Graceful fallbacks when backends fail