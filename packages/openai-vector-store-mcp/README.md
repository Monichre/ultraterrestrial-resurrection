# OpenAI Vector Store MCP

Remote/local MCP server that exposes ChatGPT deep-research compatible `search` and `fetch` tools over an [OpenAI Vector Store](https://platform.openai.com/docs/guides/retrieval).

Based on: <https://developers.openai.com/api/docs/mcp>

## Tools

| Tool | Input | Output |
|------|-------|--------|
| `search` | `query: string` | `{ results: [{ id, title, url }] }` |
| `fetch` | `id: string` (vector store file id) | `{ id, title, text, url, metadata? }` |

Citation-ready `url` values point at `https://platform.openai.com/storage/files/{file_id}`.

> **Full operations & fidelity-check guide: [`USAGE.md`](./USAGE.md)** — tool
> contracts, corpus-integrity workflows, known defects, and the additions backlog.
> Read it before relying on this server for data-driven work.

## Setup

```bash
cd packages/openai-vector-store-mcp
bun run setup
```

No package-level `.env` is needed: the server loads the repo-root `.env` itself
(`OPENAI_API_KEY` + `OPENAI_VECTOR_STORE_ID` — the same store the app's Prometheus /
disclosure `file_search` uses). See `USAGE.md` §2 for the precedence gotcha
(`VECTOR_STORE_ID` wins over `OPENAI_VECTOR_STORE_ID`).

## Run

```bash
# Cursor / local MCP clients (default) — VERIFIED LIVE (2026-08-09, 2026-08-15)
bun run start

# Remote SSE (ChatGPT plugins / Responses API mcp tool) — endpoint ends with /sse/
bun run dev:sse

# Streamable HTTP
bun run dev:http
```

⚠️ `sse` and `http` are **implemented but never verified** — treat as experimental
until a round-trip is recorded in `USAGE.md` §8.

## Cursor

Added under `.cursor/mcp.json` as `openai-vector-store`. Restart Cursor MCP after first setup so it picks up the server.

Manual config shape:

```json
{
  "mcpServers": {
    "openai-vector-store": {
      "command": "/absolute/path/to/packages/openai-vector-store-mcp/.venv/bin/openai-vector-store-mcp",
      "env": {
        "OPENAI_API_KEY": "sk-...",
        "VECTOR_STORE_ID": "vs_...",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

Prefer letting the process load keys from `packages/openai-vector-store-mcp/.env` (or the monorepo `.env` / `apps/app/.env.local`) instead of pasting secrets into `mcp.json`.

## ChatGPT / Responses API

1. Run with `MCP_TRANSPORT=sse` and expose a public URL ending in `/sse/`.
2. In the Prompts dashboard or Responses API, attach an MCP tool with `allowed_tools: ["search", "fetch"]` and `require_approval: "never"` for this read-only server.

## Architecture

- **Module:** `src/openai_vector_store_mcp/server.py`
- **Entry:** `openai-vector-store-mcp` console script / `python -m openai_vector_store_mcp`
- **Data flow:** MCP client → `search`/`fetch` → OpenAI `vector_stores.search` / `vector_stores.files.content` → structured tool result
- **Deps:** FastMCP, OpenAI Python SDK, Pydantic, python-dotenv
