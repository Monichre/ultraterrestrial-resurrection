# Knowledge Base Package

This package contains the shared knowledge resources for the Ultraterrestrial project. It provides access to external resources, UFO/UAP documents, vector storage data, and transcripts in a TypeScript-friendly format.

## Directory Structure

### Current Organization (Updated February 2025)

```
@packages/knowledge-base/
├── sources/
│   ├── files/           # 31 PDF documents and markdown files related to UFO/UAP cases
│   ├── transcripts/     # 431 transcript files organized by date (2024-2025)
│   └── web/            # Web-scraped content organized by date
├── metadata/           # Registry and indexing information
├── docs/              # Documentation and analysis reports
├── cases/             # Organized case data
└── python/            # Python package interface (planned)
```

### Content Overview

- **PDF Documents**: 31 files including CIA documents, congressional hearings, research papers
- **Transcripts**: 431 files from interviews, podcasts, and testimonies (2024-2025)
- **Web Content**: Scraped articles and reports organized by collection date
- **Metadata**: JSON registry files for indexing and search
- **External Resources**: Curated URLs and references to external materials

## Usage

### TypeScript/JavaScript

```typescript
// Import all resources
import knowledge from '@ultraterrestrial/knowledge-base';

// Or import specific resources
import { externalResources } from '@ultraterrestrial/knowledge-base';

// Access specific directories
import '@ultraterrestrial/knowledge-base/sources/files';        // PDF and document files
import '@ultraterrestrial/knowledge-base/sources/transcripts';  // Transcript collection

// Use the data
const urls = externalResources.urls;
```

### Python

```python
# Import resources
from knowledge_base.python import external_resources

# Access URLs
urls = external_resources["urls"]

# Import vector storage utilities
from knowledge_base.python import vector_storage

# Load vector store data
vector_files = vector_storage.load_vector_store_files()
```

## Development

### Integration with disclosure-rag

This package is designed to work with the Python-based `apps/disclosure-rag` system. The disclosure-rag application provides:

- Vector search capabilities across all documents
- RAG (Retrieval Augmented Generation) system
- PostgreSQL + pgvector storage
- Streamlit dashboard for knowledge management
- Multi-vector backend support (Upstash, FAISS, pgvector)

### Synchronization Process

To sync knowledge base with the disclosure-rag system:

```bash
# Use existing consolidation tools
cd apps/disclosure-rag
python3 consolidate_libraries.py --sources ../../packages/knowledge-base

# Sync to PostgreSQL
python3 main.py --sync-local-library

# Test the integration
python3 disclosure_chat.py
```

### Adding New Resources

When adding new resources:

1. **Documents**: Add PDF files to the `sources/files/` directory
2. **Transcripts**: Add transcripts under `sources/transcripts/[DATE]/` following existing patterns
3. **Web Content**: Add scraped content to `sources/web/[DATE]/`
4. **Metadata**: Update registry files in `metadata/` as needed
5. **External References**: Update `external_resources.json` for new URL references

### File Organization

The knowledge base uses a date-based organization system:

- **sources/files/**: Contains core documents and some dated subdirectories
- **sources/transcripts/**: Organized by date (YYYY-MM-DD) with transcript files
- **sources/web/**: Web-scraped content organized by collection date
- **metadata/**: Registry files for search and indexing

### Integration Points

This package integrates with:

- **disclosure-rag**: Primary RAG system and vector search
- **TipTap Editor**: Knowledge search and citation features  
- **Xata Database**: Main application database with 230,998+ records
- **Vector Stores**: Multiple vector backends for semantic search

## Architecture Notes

The knowledge base serves as a bridge between the main application and the specialized RAG system, providing:

- **TypeScript Interface**: For main application integration
- **Python Compatibility**: For RAG system processing
- **Metadata Management**: For search and discovery
- **Version Control**: For knowledge evolution tracking

For detailed technical documentation, see the `docs/` directory.
