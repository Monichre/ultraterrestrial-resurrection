# OneNode.ai Integration Documentation

## Overview

OneNode.ai is an AI-native database designed for multimodal data storage and semantic search, making it ideal for RAG (Retrieval-Augmented Generation) systems. It provides instant setup with both anonymous and persistent modes.

## Installation & Setup

### Installation
```bash
pip install onenode
```

### Environment Configuration
```bash
# Required for persistent data
export ONENODE_PROJECT_ID="your_project_id"
export ONENODE_API_KEY="your_api_key"
```

### Client Initialization

**Persistent Mode (Recommended for RAG):**
```python
import os
from onenode import OneNode, Text, Image, Models

# Initialize with environment variables
client = OneNode()  # Reads ONENODE_PROJECT_ID and ONENODE_API_KEY

# Or initialize directly
client = OneNode()
client.project_id = "your_project_id"
client.api_key = "your_api_key"
```

**Anonymous Mode (Temporary):**
```python
client = OneNode()  # Without environment variables - data will be temporary
```

## Core Components

### Database & Collection Access
```python
# Multiple access patterns supported
db = client.db("knowledge_base")
collection = db.collection("documents")

# Alternative syntax
db = client.knowledge_base  # Attribute access
collection = db["documents"]  # Dictionary access
```

## Data Models

### Text Data Type (Primary for RAG)
```python
from onenode import Text

# Basic text with automatic indexing
content = Text("Your document content here").enable_index(
    emb_model="text-embedding-3-small",  # Default embedding model
    max_chunk_size=512,                  # Chunk size for long texts
    chunk_overlap=50,                    # Overlap between chunks
    separators=["\n\n", "\n", ".", "!"], # Custom separators
    keep_separator=True,                 # Whether to keep separators
    is_separator_regex=False             # Use regex separators
)

# Available embedding models
Models.TextToEmbedding.OpenAI.TEXT_EMBEDDING_3_SMALL  # Default
Models.TextToEmbedding.OpenAI.TEXT_EMBEDDING_3_LARGE  # Higher quality
Models.TextToEmbedding.OpenAI.TEXT_EMBEDDING_ADA_002  # Legacy
```

### Image Data Type (Multimodal RAG)
```python
from onenode import Image

# From file path
image = Image("path/to/image.jpg").enable_index(
    vision_model="gpt-4o",              # Vision model for analysis
    emb_model="text-embedding-3-small", # For generated text embeddings
    max_chunk_size=512                  # For text chunks from vision
)

# Available vision models
Models.ImageToText.OpenAI.GPT_4O      # Best quality
Models.ImageToText.OpenAI.GPT_4O_MINI # Faster/cheaper
Models.ImageToText.OpenAI.O1          # Latest models
```

## Document Operations

### Insert Documents (RAG Ingestion)
```python
# Single document with multimodal content
documents = [{
    "id": "doc_001",
    "title": "AI Research Paper",
    "content": Text("Abstract: This paper discusses...").enable_index(),
    "summary": Text("Key findings include...").enable_index(),
    "diagram": Image("research_diagram.png").enable_index(),
    "metadata": {
        "author": "Dr. Smith",
        "published": "2024-01-15",
        "category": "machine_learning"
    }
}]

# Insert with response handling
response = collection.insert(documents)
print(f"Inserted {len(response.inserted_ids)} documents")
```

## Search Operations (RAG Retrieval)

### Semantic Search (Primary RAG Method)
```python
# Basic semantic search
query = "machine learning algorithms"
results = collection.query(
    query=query,
    top_k=10,                           # Number of results
    include_embedding=False             # Include vectors (optional)
)

# Process results
for result in results:
    print(f"Score: {result.score}")
    print(f"Content: {result.chunk}")
    print(f"Document: {result.document}")
    print(f"Path: {result.path}")
    print(f"Chunk Index: {result.chunk_n}")
```

### Advanced Semantic Search with Filtering
```python
# Complex RAG retrieval with metadata filtering
results = collection.query(
    query="neural networks deep learning",
    filter={
        "metadata.category": "machine_learning",
        "metadata.published": {"$gte": "2023-01-01"}
    },
    projection={
        "mode": "include", 
        "fields": ["title", "content", "metadata.author"]
    },
    emb_model="text-embedding-3-large",  # Use better embedding
    top_k=5
)
```

## RAG System Integration Patterns

### Document Ingestion Pipeline
```python
class OneNodeRAGIngester:
    def __init__(self, project_id: str, api_key: str, db_name: str):
        self.client = OneNode()
        self.db = self.client.db(db_name)
        self.collection = self.db.collection("knowledge_base")
    
    def ingest_text_documents(self, documents: list, batch_size: int = 50):
        """Ingest text documents with chunking and embedding."""
        batches = [documents[i:i+batch_size] for i in range(0, len(documents), batch_size)]
        
        for batch in batches:
            processed_docs = []
            for doc in batch:
                processed_doc = {
                    "id": doc.get("id"),
                    "title": doc.get("title", ""),
                    "content": Text(doc["content"]).enable_index(
                        emb_model="text-embedding-3-small",
                        max_chunk_size=512,
                        chunk_overlap=50
                    ),
                    "metadata": doc.get("metadata", {}),
                    "ingested_at": datetime.utcnow().isoformat()
                }
                processed_docs.append(processed_doc)
            
            response = self.collection.insert(processed_docs)
            yield len(response.inserted_ids)
```

### RAG Retrieval Engine
```python
class OneNodeRAGRetriever:
    def __init__(self, project_id: str, api_key: str, db_name: str):
        self.client = OneNode()
        self.db = self.client.db(db_name)
        self.collection = self.db.collection("knowledge_base")
    
    def retrieve_context(self, query: str, top_k: int = 5, filters: dict = None):
        """Retrieve relevant context for RAG generation."""
        results = self.collection.query(
            query=query,
            filter=filters or {},
            top_k=top_k,
            projection={
                "mode": "include",
                "fields": ["title", "content", "metadata"]
            }
        )
        
        # Format for RAG context
        context_chunks = []
        for result in results:
            context_chunks.append({
                "content": result.chunk,
                "score": result.score,
                "source": result.document.get("title", "Unknown"),
                "metadata": result.document.get("metadata", {})
            })
        
        return context_chunks
```

## Best Practices for RAG Integration

### 1. Embedding Model Selection
- **text-embedding-3-small**: Fast, cost-effective for most RAG use cases
- **text-embedding-3-large**: Higher quality for critical applications
- **text-embedding-ada-002**: Legacy model for compatibility

### 2. Chunking Strategy
- **Technical documents**: 1024 tokens, 100 overlap
- **Conversational content**: 512 tokens, 50 overlap
- **Legal/formal text**: Sentence-aware separators with regex

### 3. Metadata Organization
```python
# Structured metadata for effective filtering
metadata = {
    "domain": "healthcare",
    "document_type": "research_paper",
    "published_date": "2024-01-15",
    "confidence_level": "high",
    "language": "en",
    "tags": ["oncology", "treatment", "clinical_trial"]
}
```

### 4. Performance Optimization
- Use batch operations for ingestion
- Implement appropriate projection to reduce data transfer
- Cache frequent queries when possible
- Monitor and optimize chunk sizes based on your use case

## Error Handling
```python
from onenode import AuthenticationError, ClientRequestError, ServerError

try:
    response = collection.insert(documents)
except AuthenticationError as e:
    print(f"Authentication failed: {e.message}")
except ClientRequestError as e:
    print(f"Client error: {e.message}")
except ServerError as e:
    print(f"Server error: {e.message}")
```

## Integration with Disclosure RAG System

### Potential Integration Points
1. **Alternative Vector Backend**: Use OneNode alongside existing FAISS/Upstash
2. **Multimodal Enhancement**: Leverage image indexing for document diagrams
3. **Rapid Prototyping**: Use anonymous mode for testing new features
4. **Document Ingestion**: Integrate with existing processing pipeline
5. **Search Enhancement**: Add semantic search capabilities to current system