"""
OpenAI Vector Store MCP server.

Implements ChatGPT / deep-research compatible `search` and `fetch` tools against
an OpenAI Vector Store, following:
https://developers.openai.com/api/docs/mcp
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, Literal

from dotenv import load_dotenv
from fastmcp import FastMCP
from openai import OpenAI
from pydantic import BaseModel

logger = logging.getLogger(__name__)

PACKAGE_ROOT = Path(__file__).resolve().parents[2]
REPO_ROOT = PACKAGE_ROOT.parents[1]

TransportName = Literal['stdio', 'sse', 'http']

SERVER_INSTRUCTIONS = """
This MCP server provides search and document retrieval against an OpenAI Vector
Store. Use `search` to find relevant documents, then `fetch` to retrieve full
document content for analysis and citation.
"""


class SearchResult(BaseModel):
    id: str
    title: str
    url: str


class SearchOutput(BaseModel):
    results: list[SearchResult]


class FetchOutput(BaseModel):
    id: str
    title: str
    text: str
    url: str
    metadata: dict[str, Any] | None = None


def clean_openai_id(raw: str | None) -> str:
    """Strip inline comments / trailing noise from env-provided OpenAI IDs."""
    if not raw:
        return ''
    return raw.strip().split()[0].split('#')[0].strip()


def load_env_files() -> None:
    """Load package `.env`, then repo-root `.env` / `.env.local` (no override)."""
    for path in (
        PACKAGE_ROOT / '.env',
        REPO_ROOT / '.env',
        REPO_ROOT / '.env.local',
        REPO_ROOT / 'apps' / 'app' / '.env.local',
    ):
        if path.is_file():
            load_dotenv(path, override=False)


def resolve_vector_store_id() -> str:
    return clean_openai_id(
        os.environ.get('VECTOR_STORE_ID') or os.environ.get(
            'OPENAI_VECTOR_STORE_ID')
    )


def resolve_api_key() -> str:
    return (os.environ.get('OPENAI_API_KEY') or '').strip()


def file_citation_url(file_id: str) -> str:
    return f'https://platform.openai.com/storage/files/{file_id}'


def create_server(
    *,
    openai_client: OpenAI | None = None,
    vector_store_id: str | None = None,
) -> FastMCP:
    """Create the FastMCP server with vector-store `search` and `fetch` tools."""
    load_env_files()

    api_key = resolve_api_key()
    store_id = clean_openai_id(vector_store_id) or resolve_vector_store_id()

    if not api_key:
        raise ValueError('OPENAI_API_KEY is required')
    if not store_id:
        raise ValueError(
            'VECTOR_STORE_ID or OPENAI_VECTOR_STORE_ID is required')

    client = openai_client or OpenAI(api_key=api_key)

    mcp = FastMCP(
        name='OpenAI Vector Store MCP',
        instructions=SERVER_INSTRUCTIONS,
    )

    @mcp.tool(output_schema=SearchOutput.model_json_schema())
    async def search(query: str) -> SearchOutput:
        """
        Search for documents using OpenAI Vector Store search.

        Returns result ids/titles/urls. Use `fetch` for full document text.
        """
        if not query or not query.strip():
            return SearchOutput(results=[])

        logger.info("Searching %s for query: %r", store_id, query)
        response = client.vector_stores.search(
            vector_store_id=store_id, query=query)

        results: list[SearchResult] = []
        data = getattr(response, 'data', None) or []
        for index, item in enumerate(data):
            item_id = getattr(item, 'file_id', None) or f'vs_{index}'
            item_filename = getattr(
                item, 'filename', None) or f'Document {index + 1}'
            results.append(
                SearchResult(
                    id=item_id,
                    title=item_filename,
                    url=file_citation_url(item_id),
                )
            )

        logger.info('Vector store search returned %s results', len(results))
        return SearchOutput(results=results)

    @mcp.tool(output_schema=FetchOutput.model_json_schema())
    async def fetch(id: str) -> FetchOutput:
        """
        Retrieve complete document content by vector-store file id.
        """
        if not id or not id.strip():
            raise ValueError('Document ID is required')

        file_id = id.strip()
        logger.info('Fetching vector store file: %s', file_id)

        content_response = client.vector_stores.files.content(
            vector_store_id=store_id,
            file_id=file_id,
        )
        file_info = client.vector_stores.files.retrieve(
            vector_store_id=store_id,
            file_id=file_id,
        )
        # Vector-store file objects omit filename; Files API carries it.
        file_meta = client.files.retrieve(file_id)

        content_parts: list[str] = []
        content_data = getattr(content_response, 'data', None) or []
        for content_item in content_data:
            text = getattr(content_item, 'text', None)
            if text:
                content_parts.append(text)

        file_content = '\n'.join(
            content_parts) if content_parts else 'No content available'
        filename = (
            getattr(file_meta, 'filename', None)
            or getattr(file_info, 'filename', None)
            or f'Document {file_id}'
        )

        result = FetchOutput(
            id=file_id,
            title=filename,
            text=file_content,
            url=file_citation_url(file_id),
        )

        attributes = getattr(file_info, 'attributes', None)
        if attributes:
            result.metadata = dict(attributes)

        logger.info('Fetched vector store file: %s', file_id)
        return result

    return mcp


def resolve_transport() -> TransportName:
    raw = (os.environ.get('MCP_TRANSPORT') or 'stdio').strip().lower()
    if raw in ('stdio', 'sse', 'http'):
        return raw  # type: ignore[return-value]
    raise ValueError(
        f'Unsupported MCP_TRANSPORT={raw!r}; use stdio, sse, or http')


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    load_env_files()

    store_id = resolve_vector_store_id()
    if not store_id:
        raise SystemExit(
            'VECTOR_STORE_ID or OPENAI_VECTOR_STORE_ID is required')
    if not resolve_api_key():
        raise SystemExit('OPENAI_API_KEY is required')

    transport = resolve_transport()
    server = create_server(vector_store_id=store_id)

    logger.info('Using vector store: %s', store_id)
    logger.info('Starting MCP server with transport=%s', transport)

    if transport == 'stdio':
        server.run(transport='stdio')
        return

    host = os.environ.get('MCP_HOST', '0.0.0.0')
    port = int(os.environ.get('MCP_PORT') or os.environ.get(
        'OPENAI_EXAMPLE_PORT') or '8000')
    logger.info('Binding %s://%s:%s', transport, host, port)

    # FastMCP 3 accepts host/port as transport kwargs (not constructor args).
    server.run(transport=transport, host=host, port=port)


if __name__ == '__main__':
    main()
