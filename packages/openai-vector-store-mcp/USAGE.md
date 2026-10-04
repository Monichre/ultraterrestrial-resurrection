# OpenAI Vector Store MCP — Operations & Fidelity Guide

**Audience:** agents and humans doing data-driven work against the Ultraterrestrial
corpus. **Last verified live:** 2026-08-15 (stdio). **Read-only by design** — this
server can only search and fetch; it can never modify the store.

## What this server is

A FastMCP server exposing two tools — `search(query)` and `fetch(id)` — over the
**same OpenAI Vector Store the app's live AI paths read for `file_search`**:
Prometheus chat (`api/prometheus/chat/route.ts` reads `OPENAI_VECTOR_STORE_ID`) and
the disclosure mindmap agent (`services/ai/openai/config.ts` derives
`PROMETHEUS_VECTOR_STORE_ID` from the same variable).

**Consequence:** whatever you see through this server is exactly what the app's
retrieval sees. There is no second copy and no transform layer. If a query returns
nothing here, the app's agents will not find it either. That is what makes this the
right instrument for fidelity checks — it measures the retrieval surface itself.

One caveat that shapes every interpretation below (from the Lane A audit, T-048):
the store is populated by `upload_file_to_openai()`, which uploads **raw source
files**, not the curated ADR-0001 evidence chunks. Search hits are whole-document
matches, not chunk-level matches.

## 1. What it can and cannot verify

| Question | Answerable today? | How |
|---|---|---|
| Is a document present in the corpus? | ✅ | `search` with a distinctive title phrase, check `id`/`title` |
| Does the corpus actually contain claim X? | ✅ | `search` a distinctive quote, then `fetch` and confirm verbatim |
| Do multiple sources corroborate a claim? | ✅ | `search`, collect distinct `file_id`s, `fetch` each |
| Did a batch ingest actually land? | ✅ | Anchor queries before/after the run; new `file_id`s appear |
| Is the retrieval surface healthy over time? | ✅ | Fixed anchor queries; top-hit stability (see Workflow D) |
| Are citation URLs valid? | ✅ | URLs are deterministic (`…/storage/files/{file_id}`) |
| How many files are in the store? | ❌ | No `list_files` tool yet; use the SDK one-liner in §4 or the dashboard |
| Which files were added/removed since date X? | ❌ | Needs file enumeration + metadata (proposed, §7) |
| Is a specific *chunk* (not file) retrievable? | ❌ | Store holds raw files; chunk indices live elsewhere (T-048 H2) |
| Is provenance/attributes metadata correct? | ❌ | `attributes` surface is populated but nothing writes it yet |

## 2. Running and connecting

### Requirements

- Repo-root `.env` with `OPENAI_API_KEY` and `OPENAI_VECTOR_STORE_ID` (both present
  as of 2026-08-15).
- The venv is already built (`packages/openai-vector-store-mcp/.venv`); `bun run
  setup` re-creates it if needed.

The package **needs no `.env` of its own**: `load_env_files()` resolves, in order,
package `.env` → repo-root `.env` → `.env.local` → `apps/app/.env.local` with
`override=False`. The README's `cp .env.example .env` step is unnecessary (see §6,
fix 6).

### Env vars

| Variable | Purpose | Default |
|---|---|---|
| `OPENAI_API_KEY` | API auth; server refuses to start without it | — |
| `VECTOR_STORE_ID` | Store to search (wins over the next) | — |
| `OPENAI_VECTOR_STORE_ID` | Store to search (used by the app itself) | — |
| `MCP_TRANSPORT` | `stdio` \| `sse` \| `http` | `stdio` |
| `MCP_HOST` / `MCP_PORT` | Bind for `sse`/`http` | `0.0.0.0:8000` |

**Precedence gotcha:** `VECTOR_STORE_ID` beats `OPENAI_VECTOR_STORE_ID`
(`server.py:73-76`). The app reads only `OPENAI_VECTOR_STORE_ID`. If both are set
to different values, this server and the app search different stores — do not let
that happen silently. See §6 fix 4.

### Registering in an MCP client

Claude Code (root `.mcp.json` — **pending as of 2026-08-15**; Cursor already has
this via `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "openai-vector-store": {
      "command": "/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection/packages/openai-vector-store-mcp/.venv/bin/openai-vector-store-mcp",
      "args": []
    }
  }
}
```

No `env` block needed — the process reads the repo-root `.env` itself. Keep secrets
out of the JSON.

### Smoke-testing from a terminal

Startup check (should exit 0 after the banner):

```bash
timeout 15 packages/openai-vector-store-mcp/.venv/bin/openai-vector-store-mcp < /dev/null
```

Full round-trip (fastmcp 3.x client API — this exact pattern was verified 2026-08-15):

```python
import asyncio
from fastmcp import Client
from fastmcp.client.transports.stdio import StdioTransport

async def main():
    t = StdioTransport(
        command="packages/openai-vector-store-mcp/.venv/bin/openai-vector-store-mcp",
        args=[], cwd="<repo-root>",
    )
    async with Client(t) as c:
        print([x.name for x in await c.list_tools()])          # ['search', 'fetch']
        res = await c.call_tool("search", {"query": "Roswell crash"})
        print([r.title for r in res.data.results[:3]])
        doc = await c.call_tool("fetch", {"id": res.data.results[0].id})
        print(len(doc.data.text))

asyncio.run(main())
```

### Transports

- **stdio** — verified live (2026-08-09 and 2026-08-15). Use for local clients.
- **sse / http** — implemented (`server.py:225-231`), **never verified**. Treat as
  experimental; if you exercise one, record the result in §8.

## 3. Tool contracts

### `search(query: string)`

Calls OpenAI `vector_stores.search` with no other parameters — **always returns at
most 10 results** (`server.py:122-123`; the API supports more — see §6 fix 3).

```json
{ "results": [ { "id": "file-…", "title": "AARO_Historical_Record_Report_Vol_1_2024.pdf", "url": "https://platform.openai.com/storage/files/file-…" } ] }
```

Edge cases:

- Blank/whitespace query → `{ "results": [] }` (not an error).
- `id` is the **vector-store file id** (the value `file_id` carries in search
  results) — feed it straight back into `fetch`.
- **Known defect:** the same `file_id` can appear more than once in one result set
  (observed 2026-08-15: the AARO report appeared twice in the top 3 for "Roswell
  crash"). Dedupe by `id` before counting sources (§6 fix 2).

### `fetch(id: string)`

Retrieves full file content + filename + optional `attributes`:

```json
{ "id": "file-…", "title": "…", "text": "<full document text>", "url": "https://platform.openai.com/storage/files/file-…", "metadata": null }
```

Edge cases:

- Blank `id` → error (`ValueError: Document ID is required`).
- Unknown `id` → OpenAI API error, propagated raw.
- **Fidelity trap:** if the file has no extractable text, `text` is the sentinel
  string `"No content available"` (`server.py:172`) — a *real-looking* string that
  is not content. Treat it as an error signal, never as retrieved text (§6 fix 5).
- `metadata` is populated only when the file carries `attributes` — nothing in the
  pipeline writes them yet, so expect `null` today.

Both tools return **structured output** (pydantic `output_schema`), so clients
receive typed objects, not text blobs.

## 4. Fidelity & integrity workflows

Each workflow lists its trigger, steps, and a **completion criterion** — the
checkable condition that tells you the workflow is done.

### Workflow A — Is a document in the corpus?

**Trigger:** a source file, PDF title, or episode name needs presence confirmation.

1. `search` the document's distinctive title phrase (not the full title — 2-4
   distinctive words).
2. If a result's `title` matches, `fetch` its `id` and confirm the first lines of
   `text` match the expected document.
3. If nothing matches, retry with a narrower content phrase before concluding
   absence.

**Done when:** you have either a `fetch`ed document whose title and opening text
match, or two distinct query attempts that both return zero relevant results.

### Workflow B — Does the corpus contain claim X?

**Trigger:** verifying that a claim made *about* the corpus (in a report, a ticket,
a summary) is actually grounded in the store.

1. Pick a distinctive 6-12 word verbatim quote from the source of the claim — not
   common phrasing, no stop-word runs.
2. `search` the quote. Zero hits → the claim is not retrievable from the corpus
   (note: raw-file store means even full-text hits can miss — see §1 caveat).
3. `fetch` the top hit; confirm the quote appears **verbatim** in `text`
   (string search, not eyeballing).
4. Record the citation `url` with the verification result.

**Done when:** every claim checked has either a verbatim match with a citation URL
or a documented miss with the exact query used. A miss with a vague query is not a
miss.

### Workflow C — What did a batch ingest actually add?

**Trigger:** after any bulk run — `scripts/playlist_ingestion.py`, a corpus intake
reorg, a T-057 manifest run — to confirm the run's output is searchable.

1. Before the run, record `search` results for 2-3 anchor queries that the batch
   should add (episode names, guests, topic phrases).
2. Run the ingest.
3. Re-run the same anchors. **New** `file_id`s = landed content; identical result
   sets = nothing searchable landed (possible even when files uploaded — they are
   not searchable until OpenAI finishes chunking/embedding, which can lag minutes).
4. `fetch` one new `file_id` to confirm it is the expected document, not a partial.

**Done when:** each anchor query either gained a new `file_id` that fetches to the
expected document, or you can name the step (upload vs indexing) where it stopped.

### Workflow D — Weekly retrieval-surface health check

**Trigger:** scheduled (weekly is right for this corpus size) — drift detection on
the surface the app's agents query.

1. Run a fixed set of anchors: a document title ("AARO"), a location ("Roswell"),
   a witness ("Elizondo"), a technical term ("Starlink").
2. For each, record the top hit's `file_id` + `title`.
3. Compare to the previous run: same top hit = healthy; changed top hit = new
   content or ingestion regression; zero hits = **the app's file_search is also
   blind** — investigate before anything else.
4. Log the run in §8 with the date and any deltas.

**Done when:** all anchors have a top hit and the result set is recorded against
the prior run's, with any change explained (new ingest vs. unexplained).

### Workflow E — Cross-source corroboration

**Trigger:** a claim needs ≥2 independent corpus sources before it earns
"corroborated" in a research note.

1. `search` the claim's core noun phrase.
2. Collect **distinct** `file_id`s (dedupe — §3 search defect).
3. `fetch` each and confirm the claim appears in each (verbatim or clearly
   paraphrased with named entities matching).
4. Report the citation URLs as the evidence set.

**Done when:** you have either N distinct fetched documents each containing the
claim, or a documented count of how many distinct sources actually support it.

### Workflow F — Ingestion fidelity vs. the archive

**Trigger:** a document's fetched content must match the source file on disk
(`packages/knowledge-base/sources/…`).

1. `search` the source filename (or distinctive phrase) and `fetch` the hit.
2. Compare against the disk file: byte count, first/last lines, a 3-spot quote
   check (opening, middle, closing).
3. Mismatch → record both paths and the diff summary; do not pick a "winner" —
   flag for the ingestion owner (this is exactly the failure class T-048 H1-H4
   exists to kill).

**Done when:** each checked file is either byte-consistent with its disk source or
has a recorded diff summary with both locations.

## 5. Agent etiquette & cost

- **One `search`, then `fetch` only what you need.** A full report file is
  ~168 KB of text (AARO Vol 1) — fetching the whole result set of a broad query
  is hundreds of KB of tokens and API cost.
- **Never `fetch` every result to "check".** `fetch` the top hit; only go deeper
  when the workflow demands corroboration counts.
- Citation URLs are canonical: use `…/storage/files/{file_id}` when pointing a
  human or a report at a source. Do not invent your own citation format.
- This server is **read-only** — there is no tool that writes. Do not search for
  one.
- Timeouts: `search`/`fetch` are synchronous HTTPS calls; give clients
  generous timeouts (30s+), not the default 5-10s.

## 6. What I'd fix (ordered by impact)

1. **`pyproject.toml:12` floors `fastmcp>=2.0`, but the code is FastMCP-3-only**
   (`output_schema=` on `@mcp.tool` at `server.py:111,142`; `run(transport,
   host=, port=)` kwargs at `:231`). A fresh `bun run setup` that resolves 2.x
   breaks the server. Floor at `fastmcp>=3.0`. (Works today only because the venv
   happens to hold 3.4.6; 3.4.7 is available.)
2. **`search()` does not dedupe results** (`server.py:127-137`). The same
   `file_id` appeared twice in the top-3 on the 2026-08-15 live run. Any agent
   counting "distinct sources" is silently overcounting.
3. **`search` exposes no parameters** — no `max_num_results` (API supports 1-50),
   no metadata `filter`, no `include: ["scores"]`. Agents can't tune result depth
   or see ranking scores, and Workflow E's "distinct sources" counting is harder
   than it should be.
4. **Env precedence can diverge from the app** (`server.py:73-76`):
   `VECTOR_STORE_ID` wins over `OPENAI_VECTOR_STORE_ID`, but the app reads only
   the latter. If both are set differently, this server and the app query
   different stores. Flip precedence to match the app, or fail loudly when both
   are set to different values.
5. **`fetch` fabricates a real-looking sentinel** — `"No content available"`
   (`server.py:172`) — instead of raising. In a fidelity-checking tool, a string
   that looks like content but isn't is the exact failure mode this whole system
   exists to avoid. Raise, or return an explicit empty-content error shape.
6. **README setup step is wrong**: `cp .env.example .env` is unnecessary
   (`load_env_files` walks to the repo root). Either delete that step or document
   why a package-local `.env` would be needed.
7. **No test suite** (`scripts/` is empty, no tests). Add unit tests with a mocked
   OpenAI client (empty query, sentinel, duplicate results, missing env), and
   commit a smoke script like the one in §2.
8. **sse/http transports are claimed but unverified.** Either verify and record
   (with auth — see additions) or mark them experimental in the README.
9. **Errors are raw** — `ValueError`/API errors surface as generic MCP failures.
   Map to typed, actionable error strings (missing env vs. bad id vs. API auth).
10. **INFO logs print the full store id** — fine over local stdio, a leak for
    remote transports. Redact to a suffix.

## 7. What I'd add (feature backlog)

1. **`list_files` / `count_files`** — corpus inventory; the missing fidelity
   primitive (§1's biggest "cannot"). The SDK call exists
   (`vector_stores.files.list`); it is simply not exposed.
2. **`search` parameters**: `max_num_results` (1-50), metadata `filter`
   (eq/and/or on attributes — "only documents" / "only sightings" once attributes
   exist), `include: ["scores"]` with optional `score_threshold` so agents can
   distinguish weak from strong matches instead of guessing from rank.
3. **Two id namespaces disambiguated** — search returns vector-store file ids,
   but the Files API (used for uploads) has its own ids. A `fetch_file` alias
   accepting the Files-API id, or explicit documentation, prevents agents
   confusing the two.
4. **`attributes` on search results** — OpenAI returns them when present; pass
   them through so agents can filter client-side before the provenance pipeline
   (T-048 H4) exists.
5. **Chunk-level verification tool** (later): given a chunk id, return its source
   file + offsets — the natural partner for the trace-map sidecars (T-054/T-055)
   and the ADR-0001 evidence-only rule.
6. **MCP resource** exposing store metadata (id, name, file count, created_at) as
   `vector-store://meta` — one cheap call instead of SDK workarounds.
7. **Root `.mcp.json` registration** — the deliberate action item from T-051:
   adds this tool surface to every future Claude Code session in the repo. Do it
   once the fixes above land, not before.
8. **TTL cache for repeat anchors** — Workflow D re-queries the same strings
   weekly; a 1-hour cache would make it free.
9. **Per-call cost/usage logging** — a counter in the log line (`search n=10`,
   `fetch bytes=168636`) so operators can watch spend.
10. **`diff_queries(a, b)` tool** — return added/removed `file_id`s between two
    anchor queries; makes Workflow C a single call instead of a client-side diff.

## 8. Verification log

| Date | What | Result |
|---|---|---|
| 2026-08-09 | stdio round-trip: `list_tools`, `search("Roswell")`, `fetch` | 10 results; AARO top hit; 168,636-char fetch; citation URL correct |
| 2026-08-15 | stdio round-trip re-run (`search("Roswell crash")`, `fetch` top hit) | Same 10 results / 168,636 chars; **observed duplicate `file_id` in top-3**; fastmcp 3.4.6 (3.4.7 available) |
| 2026-08-15 | T-051 status | Package committed in `51e63500`; **root `.mcp.json` still missing** |

Record every future verification here — one line, dated.
