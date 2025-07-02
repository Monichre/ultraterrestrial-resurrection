# Data Synchronization & Database Parity Plan

## Overview
This document outlines the strategy for unifying and maintaining parity across our four data storage systems before implementing the RAG-TipTap integration.

## Current Data Architecture

### 1. Data Storage Systems
```
┌─────────────────────┐     ┌─────────────────────┐
│   Xata Database     │     │  Local PostgreSQL   │
│   (Remote/Primary)  │     │  (Development)      │
└──────────┬──────────┘     └──────────┬──────────┘
           │                            │
           ▼                            ▼
    ┌──────────────────────────────────────────┐
    │         Synchronization Layer             │
    └──────────────┬───────────────┬────────────┘
                   │               │
           ┌───────▼────────┐     ┌▼─────────────────┐
           │ Upstash Vector │     │ OpenAI Vector    │
           │    Storage     │     │    Storage       │
           └────────────────┘     └──────────────────┘
```

### 2. Current Data Types & Locations

#### Xata Database (Primary Source of Truth)
- Documents, Events, Testimonies, Organizations
- Key Figures, Sightings, Topics, Theories
- User data and saved items
- Document processing tasks and chunks

#### Local PostgreSQL
- Mirror of Xata structure (needs seeding)
- Local development data
- PGVector for embeddings

#### Upstash Vector
- Document embeddings
- Search indices
- Real-time vector queries

#### OpenAI Vector Storage
- Assistant-specific document chunks
- File uploads via OpenAI Files API
- Vector store for assistant retrieval

## Phase 1: Database Schema Alignment

### 1.1 Verify Schema Consistency
```typescript
// @apps/disclosure-rag/scripts/sync/verify-schemas.ts
interface SchemaVerification {
  xataSchema: XataSchema;
  postgresSchema: PostgresSchema;
  differences: SchemaDiff[];
}

async function verifySchemas() {
  const xataSchema = await fetchXataSchema();
  const pgSchema = await fetchPostgresSchema();
  
  return compareSchemas(xataSchema, pgSchema);
}
```

### 1.2 Schema Synchronization Script
```sql
-- @apps/disclosure-rag/schema_sync.sql
-- Ensure all Xata tables exist in PostgreSQL
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  source_url TEXT,
  document_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  vector vector(1536) -- PGVector embedding
);

-- Add other tables...
```

## Phase 2: Data Seeding Strategy

### 2.1 Export from Xata
```bash
# Use existing export scripts
cd apps/app/scripts/xata-exports
./backup.sh

# This creates CSV files in exports/
# - documents.csv
# - testimonies.csv
# - events.csv
# etc.
```

### 2.2 Import to PostgreSQL
```typescript
// @apps/disclosure-rag/scripts/sync/seed-postgres.ts
import { processCSVBatch } from './utils';

async function seedPostgres() {
  const dataTypes = [
    'documents',
    'testimonies', 
    'events',
    'organizations',
    'key-figures',
    'sightings',
    'topics',
  ];
  
  for (const dataType of dataTypes) {
    await processCSVBatch({
      csvPath: `exports/${dataType}.csv`,
      tableName: dataType.replace('-', '_'),
      batchSize: 1000,
    });
  }
}
```

### 2.3 Generate Embeddings
```typescript
// @apps/disclosure-rag/scripts/sync/generate-embeddings.ts
async function generateEmbeddings() {
  const documents = await db.select('documents', {
    where: { vector: null }
  });
  
  for (const batch of chunks(documents, 100)) {
    const embeddings = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: batch.map(d => d.content),
    });
    
    await updateDocumentVectors(batch, embeddings);
  }
}
```

## Phase 3: Vector Store Synchronization

### 3.1 Upstash Vector Sync
```typescript
// @apps/disclosure-rag/scripts/sync/sync-upstash.ts
import { Index } from '@upstash/vector';

const upstashIndex = new Index({
  url: process.env.UPSTASH_VECTOR_URL,
  token: process.env.UPSTASH_VECTOR_TOKEN,
});

async function syncToUpstash() {
  const documents = await getDocumentsWithVectors();
  
  for (const batch of chunks(documents, 100)) {
    await upstashIndex.upsert(
      batch.map(doc => ({
        id: doc.id,
        vector: doc.vector,
        metadata: {
          title: doc.title,
          type: doc.document_type,
          source: doc.source_url,
        },
      }))
    );
  }
}
```

### 3.2 OpenAI Vector Store Sync
```typescript
// @apps/disclosure-rag/scripts/sync/sync-openai.ts
async function syncToOpenAI() {
  // First, upload files
  const files = await uploadDocumentsAsFiles();
  
  // Create vector store
  const vectorStore = await openai.beta.vectorStores.create({
    name: 'ultraterrestrial-knowledge-base',
    file_ids: files.map(f => f.id),
  });
  
  // Update assistant
  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
}
```

## Phase 4: Real-time Synchronization

### 4.1 Change Data Capture (CDC)
```typescript
// @apps/disclosure-rag/services/sync/cdc-service.ts
interface ChangeEvent {
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  data: Record<string, any>;
  timestamp: Date;
}

class CDCService {
  async handleXataWebhook(event: ChangeEvent) {
    // Update PostgreSQL
    await this.syncToPostgres(event);
    
    // Update vector stores if needed
    if (this.requiresVectorUpdate(event)) {
      await this.updateVectors(event);
    }
  }
  
  private async updateVectors(event: ChangeEvent) {
    // Generate new embedding
    const embedding = await this.generateEmbedding(event.data);
    
    // Update all vector stores
    await Promise.all([
      this.updateUpstash(event.data.id, embedding),
      this.updateOpenAI(event.data.id, embedding),
      this.updatePGVector(event.data.id, embedding),
    ]);
  }
}
```

### 4.2 Sync Queue System
```typescript
// @apps/disclosure-rag/services/sync/queue-service.ts
import { Queue } from '@upstash/queue';

const syncQueue = new Queue({
  url: process.env.UPSTASH_QUEUE_URL,
  token: process.env.UPSTASH_QUEUE_TOKEN,
});

export async function enqueueSyncJob(job: SyncJob) {
  await syncQueue.push({
    type: 'sync',
    source: job.source,
    target: job.target,
    data: job.data,
    priority: job.priority || 'normal',
  });
}
```

## Phase 5: Monitoring & Validation

### 5.1 Data Consistency Checks
```typescript
// @apps/disclosure-rag/scripts/sync/validate-consistency.ts
async function validateDataConsistency() {
  const tables = ['documents', 'testimonies', 'events'];
  const results = [];
  
  for (const table of tables) {
    const xataCount = await xata.db[table].count();
    const pgCount = await pg.query(`SELECT COUNT(*) FROM ${table}`);
    const upstashCount = await upstashIndex.info();
    
    results.push({
      table,
      xata: xataCount,
      postgres: pgCount.rows[0].count,
      upstash: upstashCount.vectorCount,
      consistent: xataCount === pgCount.rows[0].count,
    });
  }
  
  return results;
}
```

### 5.2 Sync Dashboard
```typescript
// @apps/app/src/app/admin/sync-status/page.tsx
export default function SyncStatusPage() {
  const { data: syncStatus } = useSyncStatus();
  
  return (
    <div>
      <h1>Database Synchronization Status</h1>
      <SyncMetrics status={syncStatus} />
      <RecentSyncJobs />
      <DataConsistencyTable />
      <ManualSyncControls />
    </div>
  );
}
```

## Implementation Timeline

### Week 1: Schema Alignment & Initial Seeding
- [ ] Verify schema consistency across databases
- [ ] Create migration scripts for any differences
- [ ] Export current Xata data
- [ ] Seed PostgreSQL database

### Week 2: Vector Generation & Storage
- [ ] Generate embeddings for all documents
- [ ] Populate PGVector columns
- [ ] Sync to Upstash Vector
- [ ] Create OpenAI vector store

### Week 3: Synchronization Infrastructure
- [ ] Implement CDC webhook handlers
- [ ] Set up sync queue system
- [ ] Create sync monitoring
- [ ] Test bi-directional sync

### Week 4: Validation & Optimization
- [ ] Run consistency checks
- [ ] Optimize sync performance
- [ ] Create admin dashboard
- [ ] Document sync procedures

## Sync Configuration

### Environment Variables
```bash
# Database connections
XATA_API_KEY=xau_xxxxx
XATA_BRANCH=main
DATABASE_URL=postgresql://user:pass@localhost:5432/ultraterrestrial

# Vector stores
UPSTASH_VECTOR_URL=https://xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=xxxxx
OPENAI_API_KEY=sk-xxxxx
OPENAI_ASSISTANT_ID=asst_xxxxx

# Sync configuration
SYNC_BATCH_SIZE=1000
SYNC_INTERVAL_MS=5000
ENABLE_REALTIME_SYNC=true
```

### Sync Priority Matrix
```typescript
const syncPriorities = {
  documents: 'high',      // Core content
  testimonies: 'high',    // Primary research data
  events: 'high',         // Time-sensitive
  organizations: 'medium', // Reference data
  topics: 'medium',       // Categorical data
  user_data: 'low',       // Can be eventually consistent
};
```

## Success Metrics

1. **Data Completeness**
   - 100% of Xata records in PostgreSQL
   - 100% of documents have embeddings
   - All vector stores populated

2. **Sync Performance**
   - < 5 second lag for real-time updates
   - Batch sync < 10 minutes for full dataset
   - Zero data loss during sync

3. **System Reliability**
   - 99.9% sync success rate
   - Automatic retry for failed syncs
   - Full audit trail of sync operations

## Next Steps

1. Start with schema verification script
2. Run initial data export from Xata
3. Set up PostgreSQL seeding pipeline
4. Begin vector generation process
5. Implement basic sync monitoring

Once data synchronization is complete, we can proceed with the RAG-TipTap integration knowing all systems have consistent data.