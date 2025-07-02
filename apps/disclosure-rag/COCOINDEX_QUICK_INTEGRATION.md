# CocoIndex Quick Integration - Let's Ship It!
**Date**: June 29, 2025

## Why CocoIndex? 
- Your current RAG setup works but lacks real-time updates
- CocoIndex gives you incremental indexing for free
- Perfect for UFO research where new documents/sightings drop constantly

## Essential Resources
- **Main Repo**: https://github.com/cocoindex-io/cocoindex
- **FastAPI Docker Example**: https://github.com/cocoindex-io/cocoindex/tree/main/examples/fastapi_server_docker
- **PDF Embedding Example**: https://github.com/cocoindex-io/cocoindex/tree/main/examples/pdf_embedding
- **Qdrant Integration**: https://github.com/cocoindex-io/cocoindex/tree/main/examples/text_embedding_qdrant
- **Knowledge Graph Example**: https://github.com/cocoindex-io/cocoindex/tree/main/examples/docs_to_knowledge_graph

## Day 1-2: Just Get It Running
```bash
# Dead simple - just install the package
pip install cocoindex

# Check out the examples for patterns
git clone https://github.com/cocoindex-io/cocoindex
# Look at examples/text_embedding_qdrant for the cleanest start
```

## Day 3: Wire It Into disclosure-rag
```python
# Since you already have FastAPI, just add CocoIndex directly
import cocoindex

# Initialize in your existing FastAPI app
coco_flow = None  # Will initialize on first use

async def search_cocoindex(query):
    global coco_flow
    if not coco_flow:
        # Lazy load the flow
        coco_flow = cocoindex.load_flow("ufo_research")
    
    try:
        results = await coco_flow.search(query, top_k=8)
        return [{"text": r.content, "source": r.metadata["source"]} 
                for r in results]
    except:
        # Fallback to old search
        return legacy_search(query)
```

## Day 4-5: Migrate Your 448 Documents
```python
# Copy from pdf_embedding example - perfect for UFO docs!
# Create main.py based on the PDF example:

import cocoindex

@cocoindex.flow_def(name="UFOResearch")
def ufo_flow(flow_builder, data_scope):
    # Ingest PDFs (FOIA documents, reports, etc.)
    data_scope["documents"] = flow_builder.add_source(
        cocoindex.sources.LocalFile(path="./knowledge_base")
    )
    
    # Convert PDFs to markdown (from pdf_embedding example)
    data_scope["markdown"] = flow_builder.add_transformation(
        cocoindex.transformations.PdfToMarkdown()
    )
    
    # Chunk and embed text
    data_scope["chunks"] = flow_builder.add_transformation(
        cocoindex.transformations.TextChunker(chunk_size=1000)
    )
    
    data_scope["embeddings"] = flow_builder.add_transformation(
        cocoindex.transformations.SentenceTransformer()
    )
    
    # Save to Postgres with PGVector (or adapt to Qdrant)
    flow_builder.add_export(
        cocoindex.exports.PgVector(table="ufo_embeddings")
    )

# Setup and run (from PDF example)
# cocoindex setup main.py
# cocoindex update main.py
```

## That's It!
- No feature flags, just try/except
- No canary deployments, just run it locally first
- If it breaks, comment out the new code and ship the fix later

## Real Benefits You'll See Immediately:
1. **PDF Support**: Perfect for FOIA documents - automatic PDF→markdown conversion
2. **Live Updates**: Drop a new UFO doc in the folder, it auto-indexes  
3. **Better Search**: CocoIndex's chunking is smarter than most custom implementations
4. **Less Code**: Delete your custom ingestion pipeline
5. **Visual Debugging**: Use `cocoindex server -ci main.py` to see why certain docs aren't matching

## Potential Issues (and Quick Fixes):
- **Different search results**: Tweak chunk size until it matches your current quality
- **Memory usage**: Limit batch size in the config
- **API changes**: Pin to a specific version

Ship it and iterate!