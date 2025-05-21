# Knowledge Base Package

This package contains the shared knowledge resources for the Ultraterrestrial project. It provides access to external resources, case files, vector storage data, and transcripts in a TypeScript-friendly format.

## Directory Structure

- `case_files/` - PDF and markdown files related to UFO/UAP cases
- `external_resources.json` - URLs and references to external resources
- `transcripts/` - Organized transcripts of interviews and sessions by date
- `vector_storage/` - Vector embeddings and metadata for RAG systems
- `python/` - Python package interface for accessing the same data

## Usage

### TypeScript/JavaScript

```typescript
// Import all resources
import knowledge from '@ultraterrestrial/knowledge-base';

// Or import specific resources
import { externalResources } from '@ultraterrestrial/knowledge-base';

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

### Merging from disclosure-rag

This package is synchronized with the Python-based `apps/disclosure-rag/knowledge` directory. To merge updates from the Python version:

```bash
npm run merge-knowledge
```

The merge process:

1. Copies and converts data files from the Python source
2. Generates TypeScript exports
3. Creates Python package interfaces

### Adding New Resources

When adding new resources:

1. Add case files to the `case_files/` directory
2. Add transcripts under `transcripts/[DATE]/[ID]/`
3. Update vector storage files as needed
