# CRUSH.md - Disclosure RAG Development Guidelines

## Build/Lint/Test Commands

### Testing
- **Run all tests**: `pytest tests/ -v`
- **Run single test**: `pytest tests/test_file.py::test_function -v`
- **Run with coverage**: `pytest --cov=src --cov-report=html`
- **Quick test run**: `./run.sh test`

### Linting & Formatting
- **Full lint**: `./run.sh lint`
- **Format code**: `./run.sh format`
- **Black only**: `black . --exclude=.venv`
- **isort only**: `isort . --skip=.venv`
- **Flake8 only**: `flake8 . --exclude=.venv,build,dist`
- **MyPy only**: `mypy . --exclude=.venv`

### Development Setup
- **Install deps**: `pip install -e ".[dev]"`
- **Activate venv**: `source .venv/bin/activate`
- **Run project**: `./run.sh chat` or `./run.sh agno-chat`

## Code Style Guidelines

### Python Version & Formatting
- **Python**: >=3.9
- **Formatter**: Black (line-length=88)
- **Import sorter**: isort (profile=black)
- **Type checking**: MyPy (strict mode)

### Import Organization
```python
# 1. Standard library imports
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

# 2. Third-party imports
import requests
from agno.agent import Agent
import streamlit as st

# 3. Local imports
from lib.knowledge_base_service import kb_service
from agents.base_research_agent import BaseResearchAgent
```

### Type Hints
- **Required** for all function parameters and return values
- Use `Optional[T]` for nullable types
- Use `Union[T1, T2]` for multiple possible types
- Use `List[T]`, `Dict[K, V]` instead of bare types

```python
def process_content(url: str, upload: bool = False) -> Optional[Dict[str, Any]]:
    # Function implementation
    pass
```

### Naming Conventions
- **Classes**: PascalCase (`UFOYouTubeAgent`, `EntityExtractionAgent`)
- **Functions/Methods**: snake_case (`process_youtube_url`, `extract_entities`)
- **Variables**: snake_case (`video_metadata`, `entity_results`)
- **Constants**: UPPER_CASE (`DEFAULT_CLAUDE`, `CONFIDENCE_THRESHOLD`)
- **Files**: snake_case (`ufo_youtube_agent.py`, `entity_extraction_agent.py`)

### Error Handling
- Use try/except blocks with specific exception types
- Log errors with appropriate levels
- Provide meaningful error messages
- Use tenacity for retry logic when appropriate

```python
try:
    result = await process_video(url)
except Exception as e:
    logger.error(f"Failed to process video {url}: {e}")
    raise
```

### Logging
- Use the standard logging module
- Configure with appropriate format
- Use descriptive log messages

```python
import logging
logger = logging.getLogger(__name__)

# Configure in main files
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Async/Await
- Use async/await for I/O operations
- Use asyncio.run() in main functions
- Handle async context managers properly

### File Paths
- Use `pathlib.Path` instead of string paths
- Use forward slashes for cross-platform compatibility
- Use absolute paths when necessary

```python
from pathlib import Path

script_dir = Path(__file__).parent
config_file = script_dir / "config" / "settings.json"
```

### Environment Variables
- Use python-dotenv for loading .env files
- Validate required environment variables
- Use descriptive variable names

```python
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")
```

### Documentation
- Use docstrings for all public functions and classes
- Include type hints in docstrings when helpful
- Document parameters, return values, and exceptions

### Data Classes
- Use `@dataclass` for structured data
- Include type hints for all fields
- Add docstrings for complex dataclasses

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class VideoMetadata:
    """Metadata for processed YouTube videos"""
    title: str
    duration: int
    view_count: Optional[int] = None
    upload_date: Optional[str] = None
```

### CLI Output
- Use rich for formatted terminal output
- Use emojis sparingly and consistently
- Provide clear status messages

### Security
- Never log sensitive information (API keys, secrets)
- Validate input data
- Use environment variables for secrets
- Follow principle of least privilege