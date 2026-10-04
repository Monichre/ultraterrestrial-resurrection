# OpenAIVectorStoreMcp

**Updated:** 2026-08-08

## Purpose

Expose an OpenAI Vector Store as an MCP server with ChatGPT deep-research compatible `search` and `fetch` tools.

## Key modules

| Path | Role |
| ------ | ------ |
| `src/openai_vector_store_mcp/server.py` | FastMCP server, env resolution, tools, transport runner |
| `src/openai_vector_store_mcp/__main__.py` | `python -m openai_vector_store_mcp` entry |
| `pyproject.toml` | Package metadata + console script |
| `.env.example` | Required secrets / transport knobs |

## Process

1. Load dotenv from package / monorepo env files.
2. Resolve `OPENAI_API_KEY` and `VECTOR_STORE_ID` \| `OPENAI_VECTOR_STORE_ID`.
3. Register `search` + `fetch` with explicit Pydantic output schemas.
4. Run FastMCP over `stdio` (Cursor), `sse` (ChatGPT remote), or `http`.

## Data flow

```
Client (Cursor / ChatGPT / Responses API)
  → MCP search(query)
  → openai.vector_stores.search
  → [{ id, title, url }]
  → MCP fetch(id)
  → openai.vector_stores.files.content + retrieve
  → { id, title, text, url, metadata? }
```

## Component architecture

- **Transport layer:** FastMCP (`stdio` \| `sse` \| `http`)
- **Tool contract:** OpenAI company-knowledge / deep-research schema
- **Retrieval backend:** OpenAI Vector Stores API (same store as Prometheus `OPENAI_VECTOR_STORE_ID`)
