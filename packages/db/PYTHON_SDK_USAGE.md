# Python SDK Usage Guide

## Overview

The `@packages/db/` Python SDK has been restructured and now provides:

1. ✅ **Fixed double nesting** - Moved from `src/xata-python-sdk/src/xata-python-sdk/` to `src/xata_python_sdk/`
2. ✅ **Shared environment configuration** - Centralized env vars between packages
3. ✅ **Proper exports** - Clean package structure with consistent imports
4. ✅ **Integration ready** - Ready for use in `@apps/disclosure-rag/`

## Installation & Setup

### 1. Install the Package

From `@apps/disclosure-rag/`, add the dependency:

```bash
# Add to pyproject.toml dependencies
"ufo-research-db @ file://../../packages/db"
```

Or install directly:

```bash
cd apps/disclosure-rag
pip install -e ../../packages/db
```

### 2. Environment Variables

Ensure these environment variables are set (in `.env` or environment):

```bash
XATA_API_KEY=your_api_key_here
XATA_DATABASE_URL=https://YourWorkspace-xxxxx.region.xata.sh/db/database_name
XATA_BRANCH=main  # optional, defaults to "main"
XATA_WORKSPACE=your_workspace  # optional
```

## Usage Examples

### Basic Import and Setup

```python
# Import from the shared package
from db import XataClient, get_xata_config, get_xata_api_key

# Option 1: Use shared configuration (recommended)
client = XataClient()  # Automatically uses shared env config

# Option 2: Manual configuration
client = XataClient(
    api_key="your_key",
    database_url="your_url",
    use_shared_config=False
)
```

### Environment Configuration

```python
from db import get_xata_config, get_xata_api_key, get_xata_database_name

# Get shared configuration
config = get_xata_config()
print(f"Database: {config.database_name}")
print(f"API Key: {config.api_key[:8]}...")

# Convenience functions
api_key = get_xata_api_key()
db_name = get_xata_database_name()
```

### Database Operations

```python
import asyncio
from db import XataClient

async def main():
    client = XataClient()
    
    try:
        # Create a record
        event = await client.create_record("events", {
            "title": "Phoenix Lights",
            "date": "1997-03-13",
            "location": "Phoenix, Arizona"
        })
        
        # Search records
        results = await client.search_records(
            "events", 
            "Phoenix lights UFO",
            size=10
        )
        
        # Ask AI questions
        answer = await client.ask_question(
            "events",
            "What happened during the Phoenix Lights incident?",
            rules=["Focus on credible witness accounts"]
        )
        
    finally:
        await client.close()

# Run async function
asyncio.run(main())
```

### Context Manager Usage

```python
from db import xata_client

async def process_documents():
    async with xata_client() as client:
        # All operations automatically use shared config
        events = await client.query_records("events", size=100)
        return events
```

## Integration with Disclosure RAG

### 1. Replace Direct Xata Imports

**Before (broken):**
```python
# ❌ This was broken due to double nesting
from packages.db.src.xata_python_sdk.src.xata_python_sdk import XataClient
```

**After (fixed):**
```python
# ✅ Clean import from shared package
from db import XataClient, get_xata_config
```

### 2. Update RAG Connections

```python
# In your RAG system files
from db import XataClient, get_xata_database_name

class DisclosureRAGAdapter:
    def __init__(self):
        self.xata_client = XataClient()  # Uses shared config
        self.db_name = get_xata_database_name()
    
    async def search_documents(self, query: str):
        return await self.xata_client.search_records("documents", query)
```

### 3. Environment Consistency

```python
# Both packages now share the same environment configuration
from db import get_xata_config

config = get_xata_config()
print(f"Using database: {config.database_name}")
print(f"Environment locked between @packages/db/ and @apps/disclosure-rag/")
```

## Troubleshooting

### Import Errors

If you get import errors:

```python
# Fallback import (the SDK handles this automatically)
try:
    from db import XataClient
except ImportError:
    # SDK will fall back to environment variables only
    from packages.db.src.xata_python_sdk.client import XataClient
```

### Environment Variables Not Found

```python
from db import get_xata_config

try:
    config = get_xata_config()
except ValueError as e:
    print(f"Environment configuration error: {e}")
    print("Please ensure XATA_API_KEY and XATA_DATABASE_URL are set")
```

### Connection Issues

```python
async def test_connection():
    client = XataClient()
    try:
        # Simple test query
        result = await client.query_records("events", size=1)
        print("✅ Connection successful")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False
    finally:
        await client.close()
```

## Summary

The Python SDK is now properly structured and ready for use:

- ✅ **Double nesting fixed**
- ✅ **Shared environment configuration**
- ✅ **Clean package exports**
- ✅ **Fallback handling for imports**
- ✅ **Ready for `@apps/disclosure-rag/` integration**

You can now import the SDK cleanly and have consistent environment variables between both packages.