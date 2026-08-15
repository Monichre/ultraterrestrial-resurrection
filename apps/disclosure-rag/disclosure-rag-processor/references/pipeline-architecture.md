# Pipeline Architecture Reference

## Directory Structure

```
apps/disclosure-rag/
├── main.py                    # Primary CLI entry point
├── main.sh                    # Shell wrapper with subcommands
├── run.sh                     # Alternative runner
├── cli.py                     # Interactive TUI (Charm tools)
├── disclosure_chat.py         # Chat interface
├── api_server.py              # FastAPI server
├── streamlit_app.py           # Streamlit dashboard
├── process_entities.py        # Standalone entity extraction
├── .env                       # API keys and config
├── config/
│   ├── cocoindex_config.py    # CocoIndex settings
│   ├── onenode_config.yaml    # OneNode integration
│   └── yt-dlp.conf            # YouTube download config
├── lib/
│   ├── knowledge_base_service.py   # KB orchestration layer
│   ├── knowledge_base_crud.py      # Document CRUD operations
│   ├── knowledge_base.py           # Base KB class
│   ├── terminal_display.py         # Terminal UI (spinners, headers)
│   ├── mem0_integration.py         # Mem0 contextual memory
│   ├── cocoindex_integration.py    # Knowledge graph builder
│   ├── cocoindex_flows.py          # CocoIndex flow definitions
│   ├── xata_search.py              # DEAD — retired Xata client, non-functional
│   ├── youtube.py                  # YouTube processing
│   ├── youtube_handler.py          # YouTube download handler
│   ├── youtube_transcript_enhanced.py # Enhanced transcript extraction
│   ├── unified_rag_orchestrator.py # Multi-backend RAG orchestration
│   ├── simple_unified_search.py    # Simplified search interface
│   ├── sync_to_upstash_search_integrated.py # Upstash Search sync
│   ├── data_formatter.py           # Data formatting utilities
│   ├── state_manager.py            # Processing state management
│   ├── shared_entity_store.py      # Cross-module entity sharing
│   ├── entity_extraction/          # NER subsystem
│   │   ├── core/                   # Core extraction logic
│   │   ├── processors/             # Processing pipelines
│   │   │   └── interactive_entity_processor.py
│   │   ├── schemas/                # Entity type definitions
│   │   ├── tools/                  # Extraction utilities
│   │   ├── ui/                     # Entity review UI
│   │   └── utils/                  # Helpers
│   ├── openai_client/              # OpenAI integration
│   │   └── upload.py               # Vector store upload
│   ├── upstash/                    # Upstash services
│   │   ├── queue.py                # QStash message queue
│   │   ├── vector.py               # Vector search operations
│   │   ├── upstash.py              # Base client
│   │   └── document_library.py     # Document management
│   ├── storage/                    # Storage backends
│   ├── connectors/                 # External service connectors
│   ├── adapters/                   # Adapter pattern implementations
│   ├── analytics/                  # Analytics and metrics
│   ├── visualization/              # Data visualization
│   ├── database_explorer/          # DB exploration tools
│   └── agno/                       # Agno AI agent integration
├── processing/
│   ├── web_content_processor.py    # Web scraping + extraction
│   ├── content_analysis.py         # Content classification
│   ├── enhanced_content_analysis.py # Advanced analysis
│   ├── document_converter.py       # Format conversion
│   └── topic_classifier.py         # Topic detection
├── scripts/
│   ├── bulk_folder_ingestion.py    # Batch folder processing
│   ├── bulk-import.py              # Bulk data import
│   ├── index_greer_docs.py         # Greer document indexing
│   └── ... (migration/import scripts)
├── agents/                         # AI agent definitions
├── knowledge/                      # Knowledge base data
├── data/                           # Processing data
│   └── processing_queue/           # Incoming files queue
└── vector_storage/                 # Local vector indices
```

## Data Flow Details

### YouTube Processing Path

```
URL -> is_youtube_url() check
  -> process_youtube_url_enhanced() [lib/knowledge_base_service.py]
    -> YouTube transcript extraction [lib/youtube.py]
    -> ContentAnalysisEngine / RagPromptPipeline (writes *_rag_pipeline.json)
    -> add_youtube_to_knowledge_base() -> doc_id
    -> Upstash Search sync (IntegratedUpstashSyncer) [optional]
  -> CocoIndex: trigger_cocoindex_processing(doc_id) [optional; YouTube branch only here]
  -> Mem0: add_processing_summary_memory() [optional]
```

### Web URL Processing Path

```
URL -> process_web_url_enhanced() [lib/knowledge_base_service.py]
  -> WebContentProcessor.process() [processing/web_content_processor.py]
  -> RagPromptPipeline via content analysis (sidecar JSON)
  -> add_to_knowledge_base() -> doc_id
  -> Upstash Search sync [optional]
-> Mem0: add_web_article_memory(...) [optional]
-> CocoIndex already may run inside web workflow — do not double-trigger in process_url
-> Mem0: add_processing_summary_memory() [optional]
```

### File Processing Path

```
File -> process_file() [main.py]
  -> Read file content
  -> ContentAnalysisEngine.process_for_rag(...) -> *_rag_pipeline.json
  -> Extract title from filename or markdown header
  -> OpenAI upload (if --upload)  # note: may upload raw file, not only embeddable_texts
  -> Upstash queue (add_processed_content_to_queue) [optional]
  -> add_to_knowledge_base() -> doc_id
  -> Mem0: add_file_content_memory() [optional]
  -> Entity extraction: process_summary_file_interactive(path, doc_id, interactive=False)
  -> CocoIndex: trigger_cocoindex_processing(doc_id) [optional]
  -> File relocation: processing_queue/ -> packages/knowledge-base/sources/files/
  -> Mem0: add_processing_summary_memory() [optional]
```

## Integration Status Check

`python main.py --status` reports on:

| Backend | Check |
| --------- | ------- |
| Local KB | KnowledgeBaseCRUD initialized |
| Search Sync | IntegratedUpstashSyncer available |
| Search URL | UPSTASH_SEARCH_URL env var set |
| Search Token | UPSTASH_SEARCH_TOKEN env var set |
| CocoIndex KG | cocoindex module importable |
| KG Statistics | Documents, entities, relationships counts |
| Mem0 | MEM0_API_KEY set and module available |

## Triple RAG / multi-backend search (legacy framing)

Older docs describe weighted Upstash (40%) + FAISS (40%) + CocoIndex (20%). Treat this as **inventory of optional local backends**, not as the Next.js product retrieval architecture (that is Postgres FTS + pgvector via `@db/postgres`). `UnifiedRAGOrchestrator` can still search OpenAI / local stores when configured; do not require all three for a successful ingest.

Orchestrated by `lib/unified_rag_orchestrator.py`.

## RagPromptPipeline (live)

`processing/rag_prompt_pipeline.py` runs registry prompts from `packages/ai/prompts`:

classification → content_analysis → rag_ingestion → ner → validation → `embeddable_texts`

Entry: `ContentAnalysisEngine.process_for_rag()` / `process_document_for_rag()`. Wired from YouTube, web, and file paths; writes `*_rag_pipeline.json`. Evidence-only chunks per ADR-0001.

## Entity Extraction System

Located in `lib/entity_extraction/`:

- **Schemas**: Define entity types (personnel, organizations, locations, events, technologies, documents)
- **Processors**: `interactive_entity_processor.py` -- extracts entities; some matchers still import retired Xata modules, but those code paths are dead and perform no lookups
- **Tools**: Utilities for entity normalization, deduplication

Key function:

```python
from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
results = process_summary_file_interactive(summary_path, doc_id, interactive=False)
# Returns: { total_entities, total_matches, entities: [...], status }
```

## Knowledge Base CRUD API

```python
from lib.knowledge_base_crud import KnowledgeBaseCRUD
kb = KnowledgeBaseCRUD()

# Core operations
doc_id = kb.add_document(data, doc_type)    # doc_type: 'research', 'case_file', etc.
doc = kb.get_document(doc_id)
results = kb.search_documents(query)         # Returns: [{ title, score, doc_type, snippet }]
stats = kb.get_statistics()                  # Returns: { total_documents, total_tags, documents_by_type, popular_tags, last_updated }
```

## Mem0 Memory Functions

```python
from lib.mem0_integration import (
    add_web_article_memory,          # title, url, content, summary, tags
    add_file_content_memory,         # title, file_path, content, file_type, tags
    add_entity_extraction_memory,    # doc_id, entities, total_matches, processing_results
    add_knowledge_graph_memory,      # doc_id, entities_processed, relationships_processed, kg_results
    add_processing_summary_memory,   # doc_id, title, content_type, processing_steps, final_status
    _is_enabled,                     # Check if Mem0 is active
    _get_api_key,                    # Get configured API key
)
```

## Bulk Ingestion

```python
from scripts.bulk_folder_ingestion import BulkFolderIngestion
ingester = BulkFolderIngestion()
ingester.process_folder("/path/to/folder")
```

Also accessible via `cli.py` interactive menu under "Bulk Document Ingestion".
