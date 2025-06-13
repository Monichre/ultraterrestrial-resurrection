"""
Pytest configuration and fixtures for disclosure-rag tests.
"""

import os
import sys
from pathlib import Path
import pytest
from typing import Generator
import tempfile
import shutil

# Add the parent directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))


@pytest.fixture
def temp_dir() -> Generator[Path, None, None]:
    """Create a temporary directory for test files."""
    temp_path = Path(tempfile.mkdtemp())
    yield temp_path
    shutil.rmtree(temp_path)


@pytest.fixture
def mock_env(monkeypatch):
    """Mock environment variables for testing."""
    test_env = {
        'OPENAI_API_KEY': 'test-openai-key',
        'ANTHROPIC_API_KEY': 'test-anthropic-key',
        'OPENAI_ASSISTANT_ID': 'test-assistant-id',
        'OPENAI_VECTOR_STORE_ID': 'test-vector-store-id',
        'KNOWLEDGE_BASE_PATH': './test-knowledge',
        'LOG_LEVEL': 'DEBUG',
        'DEBUG': 'true'
    }
    
    for key, value in test_env.items():
        monkeypatch.setenv(key, value)
    
    return test_env


@pytest.fixture
def sample_web_content():
    """Sample web content for testing."""
    return {
        'content': 'This is a test article about UFO sightings.',
        'metadata': {
            'title': 'Test UFO Article',
            'url': 'https://example.com/ufo-article',
            'author': 'Test Author',
            'date': '2024-01-01'
        },
        'markdown': '# Test UFO Article\n\nThis is a test article about UFO sightings.',
        'summary': 'A brief summary of UFO sightings.'
    }


@pytest.fixture
def sample_youtube_data():
    """Sample YouTube data for testing."""
    return {
        'title': 'UFO Disclosure Video',
        'url': 'https://youtube.com/watch?v=test123',
        'transcript': 'This is a test transcript about UFO disclosure.',
        'duration': '10:30',
        'author': 'Test Channel',
        'upload_date': '2024-01-01'
    }