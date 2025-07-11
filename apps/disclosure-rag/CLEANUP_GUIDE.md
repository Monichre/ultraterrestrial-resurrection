# Disclosure RAG System Cleanup Guide

## Overview

This guide helps you transition from the overcomplicated 7-layer RAG system to a simple 2-layer system.

## Current Overcomplicated Architecture (7 layers)

1. Local File System (`/packages/knowledge-base/`)
2. PostgreSQL with PGVector
3. Upstash Vector Cloud
4. Upstash Search
5. OpenAI Vector Store  
6. FAISS with Sentence Transformers (local_rag.py)
7. QStash Queue Processing

## New Simplified Architecture (2 layers)

1. **Local File System** (`/packages/knowledge-base/`) - For raw content
2. **OpenAI Vector Store** - Primary RAG (when `--upload` flag used)
3. **Optional: Simple FAISS Backup** - To avoid vendor lock-in (when enabled)

## Migration Steps

### Step 1: Test the New Simple System

```bash
# Test basic processing
python main_simple.py "https://youtube.com/watch?v=VIDEO_ID"

# Test with OpenAI upload
python main_simple.py "https://example.com/article" --upload

# Test with backup vector enabled
export ENABLE_BACKUP_VECTOR=true
python main_simple.py "https://example.com/article" --upload
```

### Step 2: Update Your Global Command

Update your `dy` command to use the new simplified script:

```bash
# Find where dy is aliased/linked
which dy

# Update it to point to main_simple.py instead of main.py
# For example, if it's an alias:
alias dy='python /path/to/disclosure-rag/main_simple.py'

# Or if it's a symlink:
ln -sf /path/to/disclosure-rag/main_simple.py /usr/local/bin/dy
```

### Step 3: Clean Up Unnecessary Dependencies

Remove from `.env`:

```bash
# Remove these:
UPSTASH_REDIS_URL=...
UPSTASH_SEARCH_URL=...
UPSTASH_SEARCH_TOKEN=...
QSTASH_URL=...
QSTASH_TOKEN=...

# Keep only:
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...  # If needed for other features
XATA_API_KEY=...       # If needed for other features
UFO_DATA_STORE_ID=...
DISCLOSURE_ASSISTANT_ID=...
ENABLE_BACKUP_VECTOR=true  # Optional
```

### Step 4: Remove Unnecessary Files

Files that can be safely removed/archived:

```bash
# Move to an archive directory first (don't delete immediately)
mkdir -p archived_complex_rag
mv lib/local_rag.py archived_complex_rag/
mv lib/upstash/ archived_complex_rag/
mv lib/storage/hybrid_vector_manager.py archived_complex_rag/
mv lib/storage/pgvector_library.py archived_complex_rag/
mv lib/storage/local_vector_library.py archived_complex_rag/
mv lib/enhanced_main_integration.py archived_complex_rag/
mv lib/sync_to_upstash_search_integrated.py archived_complex_rag/
mv lib/state_manager.py archived_complex_rag/
mv lib/interactive_entity_processor.py archived_complex_rag/
mv main_original_backup.py archived_complex_rag/
```

### Step 5: Update Documentation

Update your documentation to reflect the simplified flow:

1. Extract content from URL/file
2. Save to local knowledge base
3. Optionally upload to OpenAI
4. Optionally save to backup vector store

### Step 6: Clean Up Database Tables (if using PostgreSQL)

If you want to remove PostgreSQL vector storage:

```sql
-- Connect to your PostgreSQL database
-- Drop vector-related tables (BE CAREFUL!)
DROP TABLE IF EXISTS document_vectors CASCADE;
DROP TABLE IF EXISTS vector_metadata CASCADE;
-- etc.
```

### Step 7: Remove Unnecessary Python Dependencies

Update `requirements.txt` to remove:

- `qstash`
- `upstash-vector`
- `pgvector`
- Any other vector-specific libraries not needed

Keep:

- `openai`
- `sentence-transformers` (if using backup vector)
- `faiss-cpu` or `faiss-gpu` (if using backup vector)
- Core dependencies (requests, beautifulsoup4, etc.)

## Testing the Simplified System

### Basic Test Suite

```bash
# 1. Test YouTube processing
python main_simple.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# 2. Test web article processing  
python main_simple.py "https://example.com/article"

# 3. Test PDF processing
python main_simple.py "/path/to/document.pdf"

# 4. Test with OpenAI upload
python main_simple.py "https://example.com/article" --upload

# 5. Test backup vector search (if enabled)
python -c "
from lib.simple_backup_vector import SimpleBackupVector
bv = SimpleBackupVector()
results = bv.search('UFO sightings')
print(results)
"
```

## Benefits of the Simplified System

1. **Faster Processing**: No more 7 different vector stores to update
2. **Lower Costs**: Reduced API calls to multiple services
3. **Easier Debugging**: Clear, linear flow
4. **Less Dependencies**: Fewer libraries to maintain
5. **Better Performance**: No redundant vector operations
6. **Simpler Configuration**: Just 2-3 environment variables

## Rollback Plan

If you need to rollback:

1. The original `main.py` is still there
2. Your archived files can be restored
3. Environment variables can be re-added
4. Simply point `dy` back to the original main.py

## FAQ

**Q: What about all my existing vectors in Upstash/PostgreSQL?**
A: They'll remain there. You can export them if needed, but the local knowledge base has all the raw content.

**Q: Can I still search my content?**
A: Yes! The KnowledgeBaseCRUD still works for local search, and you have OpenAI vector search when uploaded.

**Q: What if I need the complex features later?**
A: The archived files can be restored. But ask yourself: were you actually using 7 different vector stores?

**Q: Is the backup vector store necessary?**
A: Only if you're worried about OpenAI vendor lock-in. It's completely optional.

## Next Steps

1. Run the test suite above
2. Monitor for a week to ensure everything works
3. Delete the archived files once confident
4. Update any dependent systems/scripts
5. Enjoy the simplicity!

---

Remember: The best system is the one that does exactly what you need, nothing more, nothing less.
