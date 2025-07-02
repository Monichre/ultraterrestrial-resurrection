# Dual RAG System Integration Plan
**Date**: June 29, 2025

## Architecture Overview
Maintain both Upstash (cloud) and CocoIndex (local processing) for maximum flexibility:

```
TipTap Editor
     ↓
disclosure-rag API
     ↓
┌─────────────┬──────────────┐
│   Upstash   │  CocoIndex   │
│  (Cloud)    │  (Local)     │
├─────────────┼──────────────┤
│ • Shared KB │ • New docs   │
│ • Real-time │ • Bulk import│
│ • OpenAI    │ • Local embed│
└─────────────┴──────────────┘
     ↓
Merged Results
```

## Implementation Steps

### Step 1: Update disclosure-rag Adapter
Create `apps/disclosure-rag/src/adapters/dual-rag-adapter.py`:

```python
from typing import List, Dict, Any
import os
from upstash_vector import Index
import cocoindex
import asyncio

class DualRAGAdapter:
    def __init__(self):
        # Existing Upstash setup
        self.upstash = Index(
            url=os.getenv("UPSTASH_VECTOR_REST_URL"),
            token=os.getenv("UPSTASH_VECTOR_REST_TOKEN")
        )
        
        # New CocoIndex setup (lazy loaded)
        self._coco_flow = None
        self.coco_enabled = os.getenv("COCOINDEX_ENABLED", "false").lower() == "true"
    
    @property
    def coco_flow(self):
        if self._coco_flow is None and self.coco_enabled:
            try:
                self._coco_flow = cocoindex.load_flow("UFOResearch")
            except:
                print("CocoIndex not initialized, falling back to Upstash only")
                self.coco_enabled = False
        return self._coco_flow
    
    async def search(self, query: str, top_k: int = 8) -> List[Dict[str, Any]]:
        tasks = []
        
        # Always search Upstash
        tasks.append(self._search_upstash(query, top_k))
        
        # Optionally search CocoIndex
        if self.coco_enabled and self.coco_flow:
            tasks.append(self._search_cocoindex(query, top_k))
        
        # Run searches in parallel
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Merge and deduplicate results
        return self._merge_results(results, top_k)
    
    async def _search_upstash(self, query: str, top_k: int):
        # Existing Upstash logic
        response = self.upstash.query(
            vector=await self._get_openai_embedding(query),
            top_k=top_k,
            include_metadata=True
        )
        
        return [{
            "text": r.metadata.get("text", ""),
            "source": r.metadata.get("source", "upstash"),
            "score": r.score,
            "system": "upstash"
        } for r in response]
    
    async def _search_cocoindex(self, query: str, top_k: int):
        # New CocoIndex search
        try:
            results = await self.coco_flow.search(query, k=top_k)
            return [{
                "text": r.content,
                "source": r.metadata.get("source_file", "local"),
                "score": r.score,
                "system": "cocoindex"
            } for r in results]
        except Exception as e:
            print(f"CocoIndex search failed: {e}")
            return []
    
    def _merge_results(self, all_results: List[List], top_k: int):
        # Flatten and sort by score
        merged = []
        for results in all_results:
            if isinstance(results, list):
                merged.extend(results)
        
        # Sort by score and deduplicate
        seen_texts = set()
        unique_results = []
        
        for r in sorted(merged, key=lambda x: x.get("score", 0), reverse=True):
            text_snippet = r["text"][:100]  # Use first 100 chars for dedup
            if text_snippet not in seen_texts:
                seen_texts.add(text_snippet)
                unique_results.append(r)
                if len(unique_results) >= top_k:
                    break
        
        return unique_results
```

### Step 2: Update FastAPI Endpoints
Modify `apps/disclosure-rag/src/main.py`:

```python
from adapters.dual_rag_adapter import DualRAGAdapter

# Initialize dual adapter
rag_adapter = DualRAGAdapter()

@app.post("/search")
async def search(query: str, top_k: int = 8):
    results = await rag_adapter.search(query, top_k)
    
    # Add source badges for UI
    for r in results:
        r["badge"] = "☁️ Cloud" if r["system"] == "upstash" else "💾 Local"
    
    return {"results": results}

@app.post("/ingest/local")
async def ingest_local_docs(directory: str):
    """Ingest documents from local directory using CocoIndex"""
    if not rag_adapter.coco_enabled:
        raise HTTPException(400, "CocoIndex not enabled")
    
    # Run CocoIndex ingestion
    # ... implementation ...
    
    return {"status": "ingesting", "directory": directory}
```

### Step 3: Update Frontend UI
Modify `apps/app/src/components/research/research-mention-suggestion.tsx`:

```typescript
// Show source system in search results
const formatSearchResult = (item: SearchResult) => {
  return (
    <div className="flex items-center justify-between">
      <span>{item.title}</span>
      <span className="text-xs">
        {item.system === 'upstash' ? '☁️' : '💾'}
      </span>
    </div>
  );
};
```

### Step 4: Environment Configuration
Add to `.env`:

```bash
# Existing Upstash config
UPSTASH_VECTOR_REST_URL=your-url
UPSTASH_VECTOR_REST_TOKEN=your-token

# New CocoIndex config
COCOINDEX_ENABLED=true
COCOINDEX_DB_PATH=./ufo_documents.db
COCOINDEX_WATCH_DIRS=./knowledge_base,./new_documents
```

## Benefits of Dual System

1. **No Breaking Changes**: Upstash continues to work as before
2. **Gradual Migration**: Move documents to CocoIndex at your pace
3. **Best of Both Worlds**:
   - Upstash: Shared knowledge base, real-time sync
   - CocoIndex: Bulk imports, PDF processing, cost savings
4. **Fallback Support**: If one system fails, the other continues
5. **A/B Testing**: Compare result quality between systems

## Testing Strategy

```python
# Test script to verify both systems
async def test_dual_search():
    adapter = DualRAGAdapter()
    
    # Test query
    results = await adapter.search("Phoenix lights 1997")
    
    # Check we get results from both systems
    upstash_results = [r for r in results if r["system"] == "upstash"]
    coco_results = [r for r in results if r["system"] == "cocoindex"]
    
    print(f"Upstash: {len(upstash_results)} results")
    print(f"CocoIndex: {len(coco_results)} results")
    print(f"Total unique: {len(results)} results")
```

## Next Steps

1. Implement the dual adapter
2. Test with a subset of documents
3. Add monitoring to compare result quality
4. Gradually migrate documents based on usage patterns

This approach maintains all existing features while adding CocoIndex capabilities!