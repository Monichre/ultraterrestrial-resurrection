# Immediate Data Synchronization Steps

## Quick Start Guide

Based on existing tools in the codebase, here's the practical approach to sync all databases:

## Step 1: Export Data from Xata

```bash
cd apps/app/scripts/xata-exports
./backup.sh

# This will create CSV files in exports/:
# - documents.csv
# - testimonies.csv
# - events.csv
# - organizations.csv
# - key-figures.csv
# - sightings.csv
# - topics.csv
# - etc.
```

## Step 2: Create PostgreSQL Import Script

Create a new script that leverages the existing TypeScript database connector:

```typescript
// @apps/disclosure-rag/scripts/import-from-xata-export.ts
import { UltraterrestrialDB } from '../lib/connectors/ultraterrestrial_db';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

const db = new UltraterrestrialDB({
  connectionString: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

async function importCSVToPostgres(tableName: string, csvPath: string) {
  const parser = createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  let batch = [];
  for await (const record of parser) {
    batch.push(record);
    
    if (batch.length >= 100) {
      await db.batchInsert(tableName, batch);
      console.log(`Imported ${batch.length} records to ${tableName}`);
      batch = [];
    }
  }
  
  if (batch.length > 0) {
    await db.batchInsert(tableName, batch);
  }
}

// Import all tables
async function main() {
  const imports = [
    { table: 'documents', file: 'documents.csv' },
    { table: 'testimonies', file: 'testimonies.csv' },
    { table: 'events', file: 'events.csv' },
    { table: 'organizations', file: 'organizations.csv' },
    { table: 'key_figures', file: 'key-figures.csv' },
    { table: 'sightings', file: 'sightings.csv' },
    { table: 'topics', file: 'topics.csv' },
  ];

  for (const { table, file } of imports) {
    console.log(`Importing ${table}...`);
    await importCSVToPostgres(
      table, 
      `../../../app/scripts/xata-exports/exports/${file}`
    );
  }
}

main().catch(console.error);
```

## Step 3: Generate Embeddings for PostgreSQL

Adapt the existing update-vectors.ts script for PostgreSQL:

```typescript
// @apps/disclosure-rag/scripts/generate-pgvector-embeddings.ts
import { UltraterrestrialDB } from '../lib/connectors/ultraterrestrial_db';

const db = new UltraterrestrialDB({
  connectionString: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbeddings() {
  // Get documents without embeddings
  const documents = await db.query(`
    SELECT id, title, content 
    FROM documents 
    WHERE embedding IS NULL 
    LIMIT 100
  `);

  for (const doc of documents.rows) {
    try {
      const text = `${doc.title}\n\n${doc.content}`.slice(0, 8000);
      const embedding = await db.generateEmbedding(text);
      
      await db.query(`
        UPDATE documents 
        SET embedding = $1 
        WHERE id = $2
      `, [embedding, doc.id]);
      
      console.log(`Updated embedding for document ${doc.id}`);
    } catch (error) {
      console.error(`Failed to generate embedding for ${doc.id}:`, error);
    }
  }
}
```

## Step 4: Sync to Upstash Vector

```typescript
// @apps/disclosure-rag/scripts/sync-to-upstash.ts
import { Index } from '@upstash/vector';
import { UltraterrestrialDB } from '../lib/connectors/ultraterrestrial_db';

const db = new UltraterrestrialDB({
  connectionString: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

const index = new Index({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});

async function syncToUpstash() {
  const documents = await db.query(`
    SELECT id, title, content, embedding
    FROM documents
    WHERE embedding IS NOT NULL
  `);

  const vectors = documents.rows.map(doc => ({
    id: doc.id,
    vector: doc.embedding,
    metadata: {
      title: doc.title,
      content: doc.content.slice(0, 1000),
    },
  }));

  // Batch upsert to Upstash
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100);
    await index.upsert(batch);
    console.log(`Synced ${i + batch.length} documents to Upstash`);
  }
}
```

## Step 5: Create OpenAI Vector Store

```typescript
// @apps/disclosure-rag/scripts/create-openai-vector-store.ts
import OpenAI from 'openai';
import { UltraterrestrialDB } from '../lib/connectors/ultraterrestrial_db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db = new UltraterrestrialDB({
  connectionString: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

async function createOpenAIVectorStore() {
  // Get documents
  const documents = await db.query(`
    SELECT id, title, content 
    FROM documents 
    ORDER BY created_at DESC 
    LIMIT 1000
  `);

  // Create files for OpenAI
  const fileIds = [];
  for (const doc of documents.rows) {
    const file = await openai.files.create({
      file: new Blob([`# ${doc.title}\n\n${doc.content}`]),
      purpose: 'assistants',
    });
    fileIds.push(file.id);
  }

  // Create vector store
  const vectorStore = await openai.beta.vectorStores.create({
    name: 'ultraterrestrial-knowledge-base',
    file_ids: fileIds,
  });

  // Update assistant
  const assistant = await openai.beta.assistants.update(
    process.env.OPENAI_ASSISTANT_ID!,
    {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    }
  );

  console.log('Vector store created:', vectorStore.id);
  console.log('Assistant updated:', assistant.id);
}
```

## Step 6: Create Master Sync Script

```typescript
// @apps/disclosure-rag/scripts/sync-all-databases.ts
import { execSync } from 'child_process';

async function syncAllDatabases() {
  console.log('Starting full database synchronization...');
  
  // Step 1: Export from Xata
  console.log('Step 1: Exporting from Xata...');
  execSync('cd ../app/scripts/xata-exports && ./backup.sh', { stdio: 'inherit' });
  
  // Step 2: Import to PostgreSQL
  console.log('Step 2: Importing to PostgreSQL...');
  execSync('ts-node import-from-xata-export.ts', { stdio: 'inherit' });
  
  // Step 3: Generate embeddings
  console.log('Step 3: Generating embeddings...');
  execSync('ts-node generate-pgvector-embeddings.ts', { stdio: 'inherit' });
  
  // Step 4: Sync to Upstash
  console.log('Step 4: Syncing to Upstash...');
  execSync('ts-node sync-to-upstash.ts', { stdio: 'inherit' });
  
  // Step 5: Create OpenAI vector store
  console.log('Step 5: Creating OpenAI vector store...');
  execSync('ts-node create-openai-vector-store.ts', { stdio: 'inherit' });
  
  console.log('✅ All databases synchronized!');
}

syncAllDatabases().catch(console.error);
```

## Environment Setup

Create `.env` file in `@apps/disclosure-rag/`:

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/ultraterrestrial

# OpenAI
OPENAI_API_KEY=sk-xxxxx
OPENAI_ASSISTANT_ID=asst_xxxxx

# Upstash
UPSTASH_VECTOR_URL=https://xxxxx.upstash.io
UPSTASH_VECTOR_TOKEN=xxxxx

# Xata (for reference)
XATA_API_KEY=xau_xxxxx
XATA_BRANCH=main
```

## Quick Execution

```bash
# From @apps/disclosure-rag/scripts/
npm install csv-parse @upstash/vector openai

# Run the full sync
ts-node sync-all-databases.ts
```

## Validation Script

```typescript
// @apps/disclosure-rag/scripts/validate-sync.ts
async function validateSync() {
  // Check PostgreSQL
  const pgCount = await db.query('SELECT COUNT(*) FROM documents');
  
  // Check Upstash
  const upstashInfo = await index.info();
  
  // Check OpenAI
  const vectorStore = await openai.beta.vectorStores.retrieve(
    process.env.OPENAI_VECTOR_STORE_ID!
  );
  
  console.log({
    postgres: pgCount.rows[0].count,
    upstash: upstashInfo.vectorCount,
    openai: vectorStore.file_counts,
  });
}
```

## Next Steps After Sync

Once all databases are synchronized:

1. Set up webhook handlers for real-time updates
2. Create a cron job for periodic sync validation
3. Implement the RAG API wrapper
4. Connect TipTap to the unified data layer