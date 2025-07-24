# SDK Integration Completion Checklist

## TypeScript SDK Integration

### ✅ Currently Integrated (28 files)
- **Main App**: 23 files properly using @db package
- **AI Package**: 1 file using @db/xata/client
- **Next.js Config**: Proper transpilation setup

### 🔄 Needs Migration/Updates

#### Main App Updates Needed:
1. **Update import paths** in files still using old patterns
2. **Consolidate API usage** - some files use multiple import paths
3. **Add type safety** - ensure all imports use proper TypeScript types

## Python SDK Integration

### ❌ Critical Migrations Needed (Disclosure-RAG App)

#### High Priority Files (Replace Direct DB Access):
1. **`/apps/disclosure-rag/lib/connectors/ultraterrestrial_db.py`** (800+ lines)
   - Replace direct `asyncpg` with `@db` Python registry
   - Migrate custom vector search to `@db.api.search_xata`

2. **`/apps/disclosure-rag/lib/xata_search.py`**
   - Replace direct Xata client with `from @db import xata`
   - Use centralized search functions

3. **`/apps/disclosure-rag/lib/database_explorer/connection_manager.py`** (700+ lines)
   - Replace with `@db.registry.PROVIDERS`
   - Remove custom connection pooling

4. **`/apps/disclosure-rag/api_server.py`**
   - Replace custom KnowledgeBaseCRUD with `@db.models`
   - Use `@db.api` functions for search operations

#### Medium Priority Files:
5. **`/apps/disclosure-rag/components/database_stats.py`**
6. **`/apps/disclosure-rag/import-data-to-postgres.py`**
7. **`/apps/disclosure-rag/migrate-to-postgres-xata.py`**
8. **Migration scripts** (5+ files using direct `asyncpg`)

## Research-Canvas App Integration

### ⚠️ Missing Database Integration
1. **`/apps/research-canvas/src/app/api/admin/rag-settings/route.ts`**
   - Currently uses in-memory storage
   - Should migrate to `@db` for persistent settings

2. **Future Features** (when implemented):
   - User sessions/preferences
   - Document caching
   - Configuration storage

## Action Items by Priority

### 🔥 Critical (Do First)
1. **Migrate disclosure-rag database connectors** to Python SDK
2. **Replace direct Xata imports** with `@db` registry
3. **Update connection management** to use centralized providers

### 🔶 High Priority  
4. **Add persistent storage** to research-canvas RAG settings
5. **Standardize all TypeScript imports** to use proper @db paths
6. **Add Python SDK imports** to remaining disclosure-rag files

### 🔷 Medium Priority
7. **Migrate remaining Python database scripts**
8. **Add type safety** to all database operations
9. **Update documentation** with new import patterns

### 🔹 Low Priority
10. **Consider local caching** in research-canvas using @db
11. **Add user management** features using @db
12. **Performance optimization** using centralized connection pooling

## Quick Win Commands

```bash
# 1. Update TypeScript imports
find apps/app -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/from "@db\/xata\/xata"/from "@db\/xata\/client"/g'

# 2. Replace Python direct imports
find apps/disclosure-rag -name "*.py" | xargs sed -i 's/import asyncpg/from @db import PROVIDERS/g'
find apps/disclosure-rag -name "*.py" | xargs sed -i 's/from xata.client import XataClient/from @db import xata/g'

# 3. Update research-canvas settings
# Manual migration needed for in-memory storage → @db
```

## Success Metrics
- [ ] All 28 TypeScript files use consistent @db imports
- [ ] All Python files use centralized @db registry
- [ ] No direct database driver imports outside @db package
- [ ] All apps have proper persistent storage
- [ ] Test suite passes with new SDK integration

## Detailed File Analysis

### TypeScript Files Currently Using @db Package (28 files)

#### Database Client Usage (@db/xata/client)
- `/apps/app/src/app/api/disclosure/data-layer/search/table/route.ts`
- `/apps/app/src/features/mindmap/actions/actions.ts`
- `/apps/app/src/features/mindmap/actions/tour-validation-server-actions.ts`
- `/apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`
- `/apps/app/src/features/mindmap/actions/xata-to-xyflow-fixed.ts`
- `/apps/app/src/features/data-viz/sightings/actions/fetch-time-series-data.ts`
- `/packages/ai/prometheus/lib/vectorize.ts`

#### API Function Usage (@db/xata/api)
- `/apps/app/src/app/api/historical-query/route.ts`
- `/apps/app/src/app/(site)/explore/page.tsx`
- `/apps/app/src/features/mindmap/actions/historical-query-server-actions.ts`
- `/apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`
- `/apps/app/src/features/mindmap/actions/get-entity-network-graph-data.ts`
- `/apps/app/src/features/mindmap/actions/actions.ts`
- `/apps/app/src/features/mindmap/actions/ai-actions.ts`
- `/apps/app/src/features/mindmap/actions/xata-to-xyflow-fixed.ts`

#### Models Usage (@db/xata/models)
- `/apps/app/src/app/(auth)/admin/page.tsx`

#### Configuration
- `/apps/app/next.config.ts` (transpilePackages configuration)

#### Type Exports
- `/apps/app/src/features/mindmap/types/index.ts`

### Python Files Requiring Migration

#### Direct Database Connections (Critical)
- `/apps/disclosure-rag/lib/connectors/ultraterrestrial_db.py` - Direct asyncpg/psycopg2 usage
- `/apps/disclosure-rag/lib/connectors/ultraterrestrial_db.ts` - Direct PostgreSQL connections with pg library
- `/apps/disclosure-rag/lib/database_explorer/connection_manager.py` - Complex multi-database connection manager
- `/apps/disclosure-rag/lib/xata_search.py` - Direct Xata SDK usage
- `/apps/disclosure-rag/components/database_stats.py` - Direct asyncpg usage

#### Import and Migration Scripts (Medium Priority)
- `/apps/disclosure-rag/import-data-to-postgres.py` - Direct asyncpg usage
- `/apps/disclosure-rag/setup-postgres-tables.py` - Direct asyncpg usage
- `/apps/disclosure-rag/migrate-to-postgres-xata.py` - Complex migration logic
- `/apps/disclosure-rag/ssl-import.py` - SSL-aware PostgreSQL imports

#### Test and Verification Files (Low Priority)
- `/apps/disclosure-rag/verify-database-structure.py` - Direct asyncpg usage
- `/apps/disclosure-rag/test_db_connection.ts` - Direct database testing
- `/apps/disclosure-rag/examine_db.py` - Direct psycopg2 usage

## Migration Patterns

### TypeScript Migration
**Current Pattern:**
```typescript
import { Pool } from 'pg';
// Custom database operations
```

**Should Migrate To:**
```typescript
import { PROVIDERS } from '@db/registry';
import { xata } from '@db/xata/client';
// Use centralized client
```

### Python Migration
**Current Pattern:**
```python
import asyncpg
import psycopg2
from xata.client import XataClient
```

**Should Migrate To:**
```python
from @db import PROVIDERS, xata
from @db.api import search_xata, ask_xata
```

### Custom Database Operations → @db API
**Current Pattern:**
```python
# Custom search implementations
async def semantic_search(query, table_name, limit):
    # 50+ lines of custom code
```

**Should Migrate To:**
```python
from @db.api import search_xata
# Use standardized API
```

## Benefits of Complete Migration

1. **Consistency**: All database operations use the same client
2. **Type Safety**: Proper TypeScript/Python types from @db models
3. **Maintainability**: Single source of truth for database operations
4. **Feature Parity**: Access to all Xata features through standardized API
5. **Reduced Complexity**: Remove 1000+ lines of custom database code
6. **Better Testing**: Centralized mocking and testing utilities
7. **Performance**: Optimized connection pooling and caching

**Bottom Line**: Main focus should be migrating the disclosure-rag app's direct database access to the Python SDK, then cleaning up import inconsistencies across the TypeScript codebase.