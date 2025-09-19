#!/usr/bin/env python3
"""
Mem0 integration helpers using modern SDK patterns
- Memory client with agent integration
- Async support for better performance
- Best-effort error handling for non-critical operations

Environment variables:
- MEM0_API_KEY (required for cloud) or NEXT_PUBLIC_MEM0_API_KEY
- MEM0_USER_ID (default: default_agent)
- MEM0_ENABLE (optional: true/false, default: enabled if API key present)
- MEM0_AGENT_ID (default: disclosure-rag-agent)
"""

import os
import logging
import asyncio
from typing import Any, Dict, List, Optional, Union
from functools import wraps

logger = logging.getLogger(__name__)

# Global variables for mem0 client
_mem0_client = None
_mem0_async_client = None


def _get_api_key() -> Optional[str]:
    """Get API key from environment variables."""
    return os.environ.get("MEM0_API_KEY") or os.environ.get("NEXT_PUBLIC_MEM0_API_KEY")


def _is_enabled() -> bool:
    """Check if mem0 integration is enabled."""
    api_key = _get_api_key()
    if not api_key:
        return False
    flag = os.getenv("MEM0_ENABLE", "").strip().lower()
    # Enabled by default if API key exists
    if flag in {"0", "false", "no", "off"}:
        return False
    return True


def _get_mem0_client():
    """Get or create mem0 client instance."""
    global _mem0_client
    
    if not _is_enabled():
        return None
        
    if _mem0_client is None:
        try:
            from mem0 import Memory
            
            config = {
                "provider": "openai",
                "config": {
                    "model": "gpt-4o-mini",
                }
            }
            
            api_key = _get_api_key()
            if api_key:
                config["api_key"] = api_key
                
            _mem0_client = Memory(config)
            logger.info("Mem0 client initialized successfully")
        except ImportError:
            logger.warning("mem0ai package not installed; skipping mem0 integration")
            return None
        except Exception as e:
            logger.warning(f"Failed to initialize mem0 client: {e}")
            return None
    
    return _mem0_client


async def _get_mem0_async_client():
    """Get or create async mem0 client instance."""
    global _mem0_async_client
    
    if not _is_enabled():
        return None
        
    if _mem0_async_client is None:
        try:
            from mem0 import AsyncMemory
            
            config = {
                "provider": "openai",
                "config": {
                    "model": "gpt-4o-mini",
                }
            }
            
            api_key = _get_api_key()
            if api_key:
                config["api_key"] = api_key
                
            _mem0_async_client = AsyncMemory(config)
            logger.info("Mem0 async client initialized successfully")
        except ImportError:
            logger.warning("mem0ai package not installed; skipping async mem0 integration")
            return None
        except Exception as e:
            logger.warning(f"Failed to initialize mem0 async client: {e}")
            return None
    
    return _mem0_async_client


def _handle_mem0_error(func):
    """Decorator for best-effort error handling."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.warning(f"Mem0 operation failed (non-critical): {e}")
            return None
    return wrapper


def _handle_mem0_async_error(func):
    """Decorator for best-effort async error handling."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            logger.warning(f"Mem0 async operation failed (non-critical): {e}")
            return None
    return wrapper


@_handle_mem0_error
def add_memory(messages: Union[str, List[Dict[str, str]]], user_id: Optional[str] = None, 
               metadata: Optional[Dict[str, Any]] = None, agent_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Add memory using modern SDK patterns."""
    client = _get_mem0_client()
    if not client:
        return None
    
    user_id = user_id or os.getenv("MEM0_USER_ID", "default_agent")
    agent_id = agent_id or os.getenv("MEM0_AGENT_ID", "disclosure-rag-agent")
    
    # Convert string to message format if needed
    if isinstance(messages, str):
        messages = [{"role": "user", "content": messages}]
    
    result = client.add(
        messages=messages,
        user_id=user_id,
        metadata=metadata or {},
        agent_id=agent_id
    )
    
    logger.info(f"Memory added successfully for user {user_id}")
    return result


@_handle_mem0_async_error
async def add_memory_async(messages: Union[str, List[Dict[str, str]]], user_id: Optional[str] = None,
                          metadata: Optional[Dict[str, Any]] = None, agent_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Add memory asynchronously using modern SDK patterns."""
    client = await _get_mem0_async_client()
    if not client:
        return None
    
    user_id = user_id or os.getenv("MEM0_USER_ID", "default_agent")
    agent_id = agent_id or os.getenv("MEM0_AGENT_ID", "disclosure-rag-agent")
    
    # Convert string to message format if needed
    if isinstance(messages, str):
        messages = [{"role": "user", "content": messages}]
    
    result = await client.add(
        messages=messages,
        user_id=user_id,
        metadata=metadata or {},
        agent_id=agent_id
    )
    
    logger.info(f"Memory added successfully (async) for user {user_id}")
    return result


@_handle_mem0_error
def search_memories(query: str, user_id: Optional[str] = None, limit: int = 5,
                   agent_id: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
    """Search memories using modern SDK patterns."""
    client = _get_mem0_client()
    if not client:
        return None
    
    user_id = user_id or os.getenv("MEM0_USER_ID", "default_agent")
    agent_id = agent_id or os.getenv("MEM0_AGENT_ID", "disclosure-rag-agent")
    
    results = client.search(
        query=query,
        user_id=user_id,
        limit=limit,
        agent_id=agent_id
    )
    
    logger.info(f"Memory search completed for query: {query[:50]}...")
    return results


@_handle_mem0_async_error
async def search_memories_async(query: str, user_id: Optional[str] = None, limit: int = 5,
                               agent_id: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
    """Search memories asynchronously using modern SDK patterns."""
    client = await _get_mem0_async_client()
    if not client:
        return None
    
    user_id = user_id or os.getenv("MEM0_USER_ID", "default_agent")
    agent_id = agent_id or os.getenv("MEM0_AGENT_ID", "disclosure-rag-agent")
    
    results = await client.search(
        query=query,
        user_id=user_id,
        limit=limit,
        agent_id=agent_id
    )
    
    logger.info(f"Memory search completed (async) for query: {query[:50]}...")
    return results


def add_youtube_summary_memory(title: str, video_url: str, video_id: Optional[str], 
                              summary_text: str, tags: Optional[List[str]] = None,
                              user_id: Optional[str] = None) -> None:
    """Add YouTube summary to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "youtube_summary",
        "source": "disclosure-rag",
        "video_url": video_url,
        "video_id": video_id,
        "tags": tags or [],
        "title": title,
    }
    
    messages = [
        {"role": "system", "content": "Processing YouTube video for UAP/UFO research"},
        {"role": "user", "content": f"YouTube video analysis: '{title}'\n\nSummary: {summary_text}"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


async def add_youtube_summary_memory_async(title: str, video_url: str, video_id: Optional[str], 
                                          summary_text: str, tags: Optional[List[str]] = None,
                                          user_id: Optional[str] = None) -> None:
    """Add YouTube summary to mem0 memory asynchronously."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "youtube_summary",
        "source": "disclosure-rag",
        "video_url": video_url,
        "video_id": video_id,
        "tags": tags or [],
        "title": title,
    }
    
    messages = [
        {"role": "system", "content": "Processing YouTube video for UAP/UFO research"},
        {"role": "user", "content": f"YouTube video analysis: '{title}'\n\nSummary: {summary_text}"}
    ]
    
    await add_memory_async(messages, user_id=user_id, metadata=metadata)


def add_web_article_memory(title: str, url: str, content: str, summary: Optional[str] = None, 
                          tags: Optional[List[str]] = None, user_id: Optional[str] = None) -> None:
    """Add web article content to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "web_article",
        "source": "disclosure-rag",
        "url": url,
        "tags": tags or [],
        "title": title,
    }
    
    # Use summary if available, otherwise use content excerpt
    text_content = summary or content[:2000]
    messages = [
        {"role": "system", "content": "Processing web article for UAP/UFO research"},
        {"role": "user", "content": f"Web article analysis: '{title}'\n\nContent: {text_content}"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


def add_file_content_memory(title: str, file_path: str, content: str, file_type: str, 
                           summary: Optional[str] = None, tags: Optional[List[str]] = None,
                           user_id: Optional[str] = None) -> None:
    """Add file content to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "file_content",
        "source": "disclosure-rag",
        "file_path": file_path,
        "file_type": file_type,
        "tags": tags or [],
        "title": title,
    }
    
    # Use summary if available, otherwise use content excerpt
    text_content = summary or content[:2000]
    messages = [
        {"role": "system", "content": "Processing document for UAP/UFO research"},
        {"role": "user", "content": f"Document analysis: '{title}' ({file_type})\n\nContent: {text_content}"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


def add_entity_extraction_memory(doc_id: str, entities: List[Dict[str, Any]], total_matches: int, 
                                processing_results: Dict[str, Any], user_id: Optional[str] = None) -> None:
    """Add entity extraction results to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "entity_extraction",
        "source": "disclosure-rag",
        "doc_id": doc_id,
        "total_entities": len(entities),
        "total_matches": total_matches,
        "processing_status": processing_results.get('status', 'unknown'),
    }
    
    # Create summary of extracted entities
    entity_names = [entity.get('name', 'Unknown') for entity in entities[:10]]
    entity_summary = ", ".join(entity_names)
    if len(entities) > 10:
        entity_summary += f" and {len(entities) - 10} more"
    
    messages = [
        {"role": "system", "content": "Processing entity extraction for UAP/UFO research"},
        {"role": "user", "content": f"Entity extraction for document {doc_id}: Found {len(entities)} entities including {entity_summary}. Database matches: {total_matches}"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


def add_knowledge_graph_memory(doc_id: str, entities_processed: int, relationships_processed: int, 
                              kg_results: Dict[str, Any], user_id: Optional[str] = None) -> None:
    """Add knowledge graph processing results to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "knowledge_graph",
        "source": "disclosure-rag",
        "doc_id": doc_id,
        "entities_processed": entities_processed,
        "relationships_processed": relationships_processed,
        "processing_status": kg_results.get('status', 'unknown'),
    }
    
    messages = [
        {"role": "system", "content": "Processing knowledge graph for UAP/UFO research"},
        {"role": "user", "content": f"Knowledge graph built for document {doc_id}: Processed {entities_processed} entities and {relationships_processed} relationships"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


def add_processing_summary_memory(doc_id: str, title: str, content_type: str, processing_steps: List[str], 
                                 final_status: str, user_id: Optional[str] = None) -> None:
    """Add comprehensive processing summary to mem0 memory using modern SDK patterns."""
    if not _is_enabled():
        return
    
    metadata = {
        "type": "processing_summary",
        "source": "disclosure-rag",
        "doc_id": doc_id,
        "content_type": content_type,
        "processing_steps": processing_steps,
        "final_status": final_status,
        "title": title,
    }
    
    steps_text = "; ".join(processing_steps)
    messages = [
        {"role": "system", "content": "Processing summary for UAP/UFO research pipeline"},
        {"role": "user", "content": f"Completed processing '{title}' ({content_type}): {steps_text}. Final status: {final_status}"}
    ]
    
    add_memory(messages, user_id=user_id, metadata=metadata)


# Backwards compatibility functions (deprecated but maintained)
def contextual_add(user_id: str, text: str, metadata: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Legacy function for backwards compatibility - use add_memory instead."""
    logger.warning("contextual_add is deprecated, use add_memory instead")
    return add_memory(text, user_id=user_id, metadata=metadata)


def search_context(user_id: str, query: str, top_k: int = 5) -> Optional[List[Dict[str, Any]]]:
    """Legacy function for backwards compatibility - use search_memories instead."""
    logger.warning("search_context is deprecated, use search_memories instead")
    return search_memories(query, user_id=user_id, limit=top_k)