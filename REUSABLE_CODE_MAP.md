# Reusable Code Map: Agent Hub → Next.js/Xata Migration

## Executive Summary

This document maps specific reusable modules from the existing Python-based disclosure-rag system to a modern Next.js/TypeScript architecture with Xata as the primary database. The system currently has 448+ documents in a knowledge base with sophisticated RAG capabilities, entity extraction, and multi-agent orchestration.

---

## 1. Knowledge Base Service → Xata KB Wrapper

### Current Implementation (`apps/disclosure-rag/lib/knowledge_base_service.py`)

```python
class KnowledgeBaseService:
    def __init__(self):
        self.kb_crud = KnowledgeBaseCRUD()
        self.search_syncer = IntegratedUpstashSyncer()
    
    def add_youtube_to_knowledge_base(self, data, file_paths):
        # Handles YouTube transcript indexing
        # Stores metadata, manages file paths
        # Integrates with entity extraction
    
    def process_youtube_with_enhanced_workflow(self, url, upload=False):
        # Full YouTube processing pipeline
        # Includes transcript extraction, AI analysis
        # Vector embedding generation
```

### Next.js/TypeScript Refactor

```typescript
// lib/services/knowledge-base.service.ts
import { XataClient } from '@/lib/xata';
import { UpstashVectorClient } from '@/lib/upstash';

interface KnowledgeBaseDocument {
  id: string;
  title: string;
  content: string;
  source: string;
  docType: 'transcript' | 'article' | 'research' | 'case_file';
  embedding?: number[];
  metadata: Record<string, any>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class KnowledgeBaseService {
  private xata: XataClient;
  private vectorClient: UpstashVectorClient;

  constructor() {
    this.xata = new XataClient();
    this.vectorClient = new UpstashVectorClient({
      url: process.env.UPSTASH_VECTOR_URL!,
      token: process.env.UPSTASH_VECTOR_TOKEN!
    });
  }

  async addDocument(data: Omit<KnowledgeBaseDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    // Port the document addition logic
    const embedding = await this.generateEmbedding(data.content);
    
    const doc = await this.xata.db.knowledge_items.create({
      ...data,
      embedding,
      created_at: new Date()
    });

    // Sync to vector search
    await this.vectorClient.upsert({
      id: doc.id,
      vector: embedding,
      metadata: { ...data.metadata, docType: data.docType }
    });

    return doc;
  }

  async processYouTubeVideo(url: string, options?: ProcessOptions) {
    // Server Action for YouTube processing
    'use server';
    
    // Extract transcript
    const transcript = await this.extractTranscript(url);
    
    // Generate AI summary
    const summary = await this.generateSummary(transcript);
    
    // Extract entities
    const entities = await this.extractEntities(summary);
    
    // Store in Xata
    return this.addDocument({
      title: transcript.title,
      content: transcript.text,
      source: url,
      docType: 'transcript',
      metadata: {
        videoId: transcript.videoId,
        duration: transcript.duration,
        entities,
        summary
      },
      tags: ['youtube', ...entities.topics]
    });
  }
}
```

**TypeScript Types:**
```typescript
// types/knowledge-base.ts
export interface ProcessOptions {
  uploadToOpenAI?: boolean;
  extractEntities?: boolean;
  generateSummary?: boolean;
}

export interface TranscriptData {
  videoId: string;
  title: string;
  text: string;
  duration: number;
  chapters?: Chapter[];
}

export interface EntityExtractionResult {
  topics: string[];
  personnel: string[];
  events: string[];
  organizations: string[];
  locations: string[];
}
```

---

## 2. Agent Orchestration → RAG Agent Layer

### Current Implementation (`apps/disclosure-rag/agents/`)

```python
# entity_extraction_agent.py
class EntityExtractionAgent:
    async def extract_and_search_entities(self, text, domain_context="UAP/UFO research"):
        # AI-powered entity extraction
        # Xata database search
        # Relationship mapping
        
# claims_evidence_agent.py
class ClaimsEvidenceAgent(Agent):
    def analyze_evidence(self, data):
        # Multi-modal evidence assessment
        # Chain of custody validation
        # Authentication scoring
```

### Next.js/TypeScript Refactor

```typescript
// lib/agents/entity-extraction.agent.ts
import { OpenAI } from 'openai';
import { XataClient } from '@/lib/xata';

export class EntityExtractionAgent {
  private openai: OpenAI;
  private xata: XataClient;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.xata = new XataClient();
  }

  async extractEntities(text: string, context = "UAP/UFO research"): Promise<EntityResult> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract entities from ${context} content. Return structured JSON.`
        },
        { role: "user", content: text }
      ],
      functions: [{
        name: "extract_entities",
        parameters: this.getEntitySchema()
      }],
      function_call: { name: "extract_entities" }
    });

    const entities = JSON.parse(completion.choices[0].message.function_call?.arguments || '{}');
    
    // Search Xata for matches
    const enrichedEntities = await this.enrichWithDatabaseMatches(entities);
    
    return enrichedEntities;
  }

  private async enrichWithDatabaseMatches(entities: ExtractedEntities) {
    const searches = await Promise.all([
      this.searchTable('personnel', entities.personnel),
      this.searchTable('events', entities.events),
      this.searchTable('organizations', entities.organizations),
      this.searchTable('topics', entities.topics)
    ]);

    return {
      ...entities,
      matches: searches.flat()
    };
  }

  private async searchTable(table: string, items: string[]) {
    const results = await Promise.all(
      items.map(item => 
        this.xata.db[table].search(item, {
          fuzziness: 1,
          prefix: 'phrase'
        })
      )
    );
    return results.flat();
  }
}
```

```typescript
// lib/agents/orchestrator.ts
export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>;

  constructor() {
    this.agents = new Map([
      ['entity', new EntityExtractionAgent()],
      ['evidence', new EvidenceAnalysisAgent()],
      ['historical', new HistoricalAnalysisAgent()],
      ['organization', new OrganizationRelationsAgent()]
    ]);
  }

  async processQuery(query: string, workflow: WorkflowType = 'standard') {
    const pipeline = this.getWorkflowPipeline(workflow);
    
    let context: AgentContext = { query, results: {} };
    
    for (const step of pipeline) {
      const agent = this.agents.get(step.agent);
      if (agent) {
        context = await agent.process(context, step.params);
      }
    }
    
    return context.results;
  }
}
```

---

## 3. Flask Routes → Next.js API Routes/Server Actions

### Current Implementation (`apps/disclosure-rag/api_server.py`)

```python
@app.get("/documents", response_model=List[DocumentSummary])
async def list_documents(doc_type: Optional[str] = None, tags: Optional[str] = None):
    # Filter and paginate documents
    
@app.post("/rag/search", response_model=RAGSearchResponse)
async def rag_search(query: str, top_k: int = 8):
    # Dual RAG search (Upstash + local)
```

### Next.js/TypeScript Refactor

```typescript
// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { xata } from '@/lib/xata';

const querySchema = z.object({
  docType: z.enum(['transcript', 'article', 'research', 'case_file']).optional(),
  tags: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0)
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params = querySchema.parse({
    docType: searchParams.get('docType'),
    tags: searchParams.get('tags'),
    limit: parseInt(searchParams.get('limit') || '50'),
    offset: parseInt(searchParams.get('offset') || '0')
  });

  const filter: any = {};
  if (params.docType) filter.doc_type = params.docType;
  if (params.tags) filter.tags = { $contains: params.tags.split(',') };

  const documents = await xata.db.knowledge_items
    .filter(filter)
    .sort('created_at', 'desc')
    .getPaginated({
      pagination: {
        size: params.limit,
        offset: params.offset
      }
    });

  return NextResponse.json({
    documents: documents.records,
    pagination: {
      total: documents.totalCount,
      hasMore: documents.hasNextPage
    }
  });
}
```

```typescript
// app/(api)/rag/search/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, topK = 8, filterType } = body;

  // Parallel search in both systems
  const [xataResults, upstashResults] = await Promise.all([
    searchXata(query, topK, filterType),
    searchUpstash(query, topK, filterType)
  ]);

  // Merge and deduplicate results
  const merged = mergeSearchResults(xataResults, upstashResults);
  
  return NextResponse.json({
    query,
    results: merged,
    totalResults: merged.length,
    systemsUsed: ['xata', 'upstash'],
    timestamp: new Date().toISOString()
  });
}
```

**Server Actions Alternative:**
```typescript
// app/actions/knowledge-base.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function searchDocuments(query: string, options?: SearchOptions) {
  const results = await xata.db.knowledge_items
    .vectorSearch('embedding', await generateEmbedding(query))
    .filter(options?.filters)
    .getMany({ size: options?.limit || 10 });

  return results;
}

export async function addDocument(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const docType = formData.get('docType') as DocType;

  const doc = await kbService.addDocument({
    title,
    content,
    docType,
    source: 'manual',
    tags: [],
    metadata: {}
  });

  revalidatePath('/knowledge-base');
  return doc;
}
```

---

## 4. Job Scheduler → Next.js Route Handlers + Vercel Cron

### Current Implementation (`apps/disclosure-rag/lib/upstash/queue.py`)

```python
def add_processed_content_to_queue(metadata, summary_file, full_content_file=None):
    # QStash queue integration
    # Vector DB upload
    # Async processing pipeline
```

### Next.js/TypeScript Refactor

```typescript
// app/api/cron/process-documents/route.ts
import { NextResponse } from 'next/server';
import { Client } from '@upstash/qstash';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

  // Get unprocessed documents
  const unprocessed = await xata.db.knowledge_items
    .filter({ 
      'metadata.processed': false,
      'metadata.processing': { $not: true }
    })
    .getMany({ size: 10 });

  // Queue each for processing
  const jobs = await Promise.all(
    unprocessed.map(doc => 
      qstash.publishJSON({
        url: `${process.env.NEXT_PUBLIC_URL}/api/process/document`,
        body: {
          documentId: doc.id,
          processType: 'full'
        },
        retries: 3
      })
    )
  );

  return NextResponse.json({
    processed: jobs.length,
    jobIds: jobs.map(j => j.messageId)
  });
}

// vercel.json
{
  "crons": [{
    "path": "/api/cron/process-documents",
    "schedule": "0 */6 * * *"  // Every 6 hours
  }]
}
```

**QStash Integration:**
```typescript
// lib/queue/qstash.service.ts
import { Client } from '@upstash/qstash';

export class QueueService {
  private client: Client;

  constructor() {
    this.client = new Client({
      token: process.env.QSTASH_TOKEN!
    });
  }

  async enqueueDocumentProcessing(documentId: string, priority: 'high' | 'normal' = 'normal') {
    const queue = this.client.queue({
      queueName: 'knowledge-base-processing'
    });

    return queue.enqueue({
      url: `${process.env.NEXT_PUBLIC_URL}/api/process/document`,
      body: JSON.stringify({
        documentId,
        timestamp: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Priority': priority
      }
    });
  }

  async processBatch(documentIds: string[]) {
    const results = await Promise.allSettled(
      documentIds.map(id => this.enqueueDocumentProcessing(id))
    );

    return {
      success: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  }
}
```

---

## 5. Environment Configuration

### Current Python Environment
```python
# .env
OPENAI_API_KEY=sk-...
UPSTASH_SEARCH_URL=https://...
UPSTASH_SEARCH_TOKEN=...
QSTASH_TOKEN=...
XATA_API_KEY=...
XATA_DATABASE=...
```

### Next.js Environment
```typescript
// .env.local
# OpenAI
OPENAI_API_KEY=sk-...

# Xata
XATA_API_KEY=xau_...
XATA_BRANCH=main

# Upstash
UPSTASH_VECTOR_URL=https://...
UPSTASH_VECTOR_TOKEN=...
UPSTASH_SEARCH_URL=https://...
UPSTASH_SEARCH_TOKEN=...
QSTASH_TOKEN=...

# Vercel Cron
CRON_SECRET=...

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

**Type-safe Environment:**
```typescript
// env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(1),
    XATA_API_KEY: z.string().startsWith("xau_"),
    UPSTASH_VECTOR_TOKEN: z.string().min(1),
    QSTASH_TOKEN: z.string().min(1),
    CRON_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().url(),
  },
  runtimeEnv: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    XATA_API_KEY: process.env.XATA_API_KEY,
    UPSTASH_VECTOR_TOKEN: process.env.UPSTASH_VECTOR_TOKEN,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    CRON_SECRET: process.env.CRON_SECRET,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
```

---

## 6. Authentication Middleware

### Next.js Middleware Pattern
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token || !(await verifyAuth(token))) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // Protect cron routes
  if (request.nextUrl.pathname.startsWith('/api/cron')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/cron/:path*']
};
```

---

## 7. Database Schema Alignment

### Xata Schema (from existing)
```typescript
const schema = {
  topics: {
    name: 'string',
    summary: 'text',
    title: 'string | unique',
    embedding: 'vector:1536',
    photos: 'file[]'
  },
  personnel: {
    name: 'string | unique',
    bio: 'text',
    role: 'string',
    rank: 'int',
    credibility: 'int',
    embedding: 'vector:1536'
  },
  events: {
    name: 'text',
    description: 'text',
    location: 'string',
    date: 'datetime',
    embedding: 'vector:1536',
    metadata: 'json'
  },
  knowledge_items: {
    title: 'string',
    content: 'text',
    source: 'string',
    doc_type: 'string',
    embedding: 'vector:1536',
    metadata: 'json',
    tags: 'string[]',
    created_at: 'datetime',
    updated_at: 'datetime'
  }
};
```

---

## 8. Migration Strategy

### Phase 1: Core Infrastructure
1. Set up Xata database with schema
2. Configure environment variables
3. Create base service classes
4. Implement authentication middleware

### Phase 2: Knowledge Base Services
1. Port `KnowledgeBaseService` to TypeScript
2. Implement vector search with Xata
3. Create Server Actions for CRUD operations
4. Set up file upload handlers

### Phase 3: Agent System
1. Port entity extraction agent
2. Implement agent orchestrator
3. Create API routes for agent queries
4. Add streaming response support

### Phase 4: Job Processing
1. Set up QStash integration
2. Implement Vercel Cron jobs
3. Create processing pipelines
4. Add monitoring and logging

### Phase 5: Frontend Integration
1. Create React hooks for data fetching
2. Implement real-time updates with Server-Sent Events
3. Add search and filter components
4. Build knowledge graph visualization

---

## 9. Key Differences and Improvements

### From Python to TypeScript
- **Type Safety**: All data structures have TypeScript interfaces
- **Runtime Validation**: Zod schemas for API inputs
- **Error Handling**: Proper error boundaries and type-safe errors
- **Async Patterns**: Native async/await instead of Python's asyncio

### From Flask to Next.js
- **Routing**: File-based routing with automatic code splitting
- **Middleware**: Edge-compatible middleware for auth
- **Caching**: Built-in caching with revalidation
- **Streaming**: Native streaming responses for large data

### From SQLAlchemy to Xata
- **Schema**: Defined in Xata UI, TypeScript types auto-generated
- **Queries**: Type-safe query builder
- **Vector Search**: Native support, no additional setup
- **Relationships**: Automatic with link columns

### From Celery to Vercel Cron + QStash
- **Scheduling**: Simple cron expressions in vercel.json
- **Queue**: QStash for reliable job processing
- **Monitoring**: Built into Vercel dashboard
- **Scaling**: Automatic with serverless functions

---

## 10. Testing Strategy

```typescript
// __tests__/services/knowledge-base.test.ts
import { KnowledgeBaseService } from '@/lib/services/knowledge-base.service';
import { mockXataClient } from '@/test/mocks/xata';

describe('KnowledgeBaseService', () => {
  let service: KnowledgeBaseService;

  beforeEach(() => {
    service = new KnowledgeBaseService();
    service.xata = mockXataClient;
  });

  it('should add document with embeddings', async () => {
    const doc = await service.addDocument({
      title: 'Test Document',
      content: 'Test content',
      docType: 'article',
      source: 'test',
      tags: ['test'],
      metadata: {}
    });

    expect(doc.id).toBeDefined();
    expect(doc.embedding).toHaveLength(1536);
  });
});
```

This migration map provides a comprehensive guide for porting the existing Python/Flask system to a modern Next.js/TypeScript stack while maintaining all core functionality and improving type safety, performance, and developer experience.
