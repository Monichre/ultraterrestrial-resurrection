# Knowledge Base Python Package

Python interface to the shared knowledge resources for the Ultraterrestrial project.

## Usage

```python
# Import resources
from knowledge_base import external_resources

# Access URLs
urls = external_resources["urls"]

# Import vector storage utilities
from knowledge_base import vector_storage

# Load vector store data
vector_files = vector_storage.load_vector_store_files()
```
