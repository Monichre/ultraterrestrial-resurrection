# Knowledge Base Sync Strategy

## Current State

Your two "official" knowledge sources:
1. **@packages/knowledge-base/** - Local files (31 PDFs, 407 transcripts)
2. **OpenAI Vector Store** (vs_meWOEnUiUxtQWf0W6NBsNpCG) - Up-to-date for RAG

## Key Insight
You already have the infrastructure! No need to rebuild - just bridge and sync.

## Simple Bridge Strategy

### 1. Create Knowledge Base Bridge
```typescript
// @packages/knowledge-base/sync-bridge.ts
import { UltraterrestrialDB } from '@apps/disclosure-rag/lib/connectors/ultraterrestrial_db';
import { LocalVectorLibrary } from '@apps/disclosure-rag/lib/storage/local_vector_library';

class KnowledgeBaseBridge {
  private db: UltraterrestrialDB;
  private localLib: LocalVectorLibrary;
  
  constructor() {
    this.db = new UltraterrestrialDB({
      connectionString: process.env.DATABASE_URL,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    this.localLib = new LocalVectorLibrary('./unified_ufo_library');
  }

  async syncToDisclosureRAG() {
    // 1. Get all local files
    const localFiles = this.scanLocalFiles();
    
    // 2. Use existing consolidation tool
    await this.localLib.consolidate_libraries([this.localKnowledgeBase]);
    
    // 3. Sync to PostgreSQL using existing connector
    for (const file of localFiles) {
      await this.db.addDocument(file);
    }
    
    // 4. Update OpenAI vector store
    await this.db.syncToOpenAI();
  }
}
```

### 2. File Organization Helper
```bash
# @packages/knowledge-base/reorganize-files.sh
#!/bin/bash

# Use existing consolidation tool from disclosure-rag
cd ../apps/disclosure-rag
python3 consolidate_libraries.py \
  --sources ../../packages/knowledge-base \
  --output ../../packages/knowledge-base/organized

# This leverages your existing file consolidation logic
```

### 3. TipTap Integration (Simple)
```typescript
// @apps/app/src/lib/rag/knowledge-bridge.ts
export class KnowledgeBridge {
  async searchKnowledge(query: string) {
    // Use existing disclosure-rag search API
    const results = await fetch('/api/disclosure-rag/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    
    return results.json();
  }
}

// TipTap Extension
export const KnowledgeExtension = Extension.create({
  name: 'knowledge',
  addCommands() {
    return {
      searchKnowledge: (query) => ({ tr, dispatch }) => {
        // Trigger search using existing system
        this.storage.bridge.searchKnowledge(query);
      }
    };
  }
});
```

## Implementation Steps

### Week 1: Bridge Setup
```bash
# 1. Use your existing consolidation tool
cd apps/disclosure-rag
python3 consolidate_libraries.py --sources ../../packages/knowledge-base

# 2. Sync to your PostgreSQL using existing tools
python3 main.py --sync-local-library

# 3. Verify OpenAI vector store sync
python3 disclosure_chat.py  # Test existing chat works
```

### Week 2: API Bridge
```typescript
// Create simple API endpoints that use your existing RAG system
// @apps/app/src/app/api/knowledge/search/route.ts
export async function POST(req: Request) {
  const { query } = await req.json();
  
  // Use existing disclosure-rag Python tools via subprocess
  const result = await execSync(`cd apps/disclosure-rag && python3 -c "
    from lib.local_rag import LocalRAG
    rag = LocalRAG()
    results = rag.search('${query}')
    print(json.dumps(results))
  "`);
  
  return Response.json(JSON.parse(result));
}
```

### Week 3: TipTap Integration
- Simple extension that calls your API bridge
- Citation system using existing document metadata
- Real-time suggestions via your existing RAG system

## No Changes Needed To:
- ✅ Your PostgreSQL schema (it's excellent)
- ✅ Your local library system (it works)
- ✅ Your Streamlit UI (it's complete)
- ✅ Your OpenAI integration (it's working)
- ✅ Your file organization (consolidation tools exist)

## Only Add:
1. Simple bridge/sync scripts
2. API endpoints for TipTap
3. TipTap extension using existing APIs

This respects your architecture and leverages the sophisticated system you've already built!