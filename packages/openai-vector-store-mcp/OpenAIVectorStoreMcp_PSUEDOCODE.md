# OpenAI Vector Store MCP — Pseudocode

```
LOAD env (OPENAI_API_KEY, VECTOR_STORE_ID | OPENAI_VECTOR_STORE_ID)
INIT OpenAI client
INIT FastMCP(name, instructions)

TOOL search(query):
  IF query blank → return { results: [] }
  CALL openai.vector_stores.search(vector_store_id, query)
  MAP each hit → { id: file_id, title: filename, url: platform file URL }
  RETURN SearchOutput(results)

TOOL fetch(id):
  IF id blank → raise
  CALL openai.vector_stores.files.content(vector_store_id, file_id=id)
  CALL openai.vector_stores.files.retrieve(vector_store_id, file_id=id)
  JOIN content chunks → text
  RETURN FetchOutput(id, title, text, url, metadata?)

MAIN:
  transport ← MCP_TRANSPORT (stdio | sse | http), default stdio
  IF sse|http → run host/port for remote ChatGPT/API
  ELSE → run stdio for Cursor / local MCP clients
```
