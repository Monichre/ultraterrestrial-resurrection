---
status: live
role: eng
spine: do
updated: 2026-08-13
---

# Drop-to-Canvas — API contract (T-060)

**Created:** 2026-08-13
**Ticket:** T-060 (`docs/plans/TODO.md`)
**Lane:** B — Platform & Experience
**Why this file exists:** two agents build the two halves of this feature in
parallel. This document is the **fixed interface between them**. Neither half
may change a field name, status code, or limit here without updating this file
first and telling the other agent.

---

## 1. What the feature is

A user drags a file onto the research canvas. It is extracted, embedded, and
fanned out against the existing corpus. The canvas renders the dropped artifact
as a node with edges to the corpus records it most resembles.

**Route:** `POST /api/processing/drop`

**Why `/api/processing/*` and not `/api/canvas/*`:** `middleware.ts:9-11` gates
exactly one API prefix — `createRouteMatcher(['/api/processing(.*)'])`. Placing
the route here inherits the Clerk `auth.protect()` gate for free. A route at
`/api/canvas/drop` would be **publicly reachable arbitrary file upload that
calls paid OpenAI embeddings**. Do not move it out of this prefix.

---

## 2. Hard constraints (both agents)

### 2.1 READ-ONLY against the corpus — non-negotiable

**Nothing in this feature may `INSERT` into `documents`, `document_chunks`, or
any entity table.**

Grounds: `grep -rn "INSERT INTO" packages/db/src` returns exactly **one** hit —
`agent-inferences.ts:54`. There is no TypeScript corpus writer. Corpus ingestion
is Python (Lane A, `packages/db/scripts/rebuild/ingest.py`). Adding a second
writer with different dedup semantics, into a 126,483-record production
database, on top of the **still-open** T-048 H1 md5-vs-sha256 decision
(`knowledge_base_crud.py:180-181`), is out of scope and would be actively
harmful.

The dropped artifact's vectors are **session-scoped and in-memory**. The raw
file goes to `@vercel/blob` (already a dependency, `apps/app/package.json:141`).
The fan-out **queries** the corpus; it does not join it.

Persisting a dropped artifact into the corpus is a separate, gated,
human-confirmed action. It is **not** part of T-060.

### 2.2 Images must become text before embedding

`text-embedding-3-small` @ 1536 dims is locked corpus-wide (CLAUDE.md, and
`VECTOR_TABLES` in `packages/db/src/postgres/search.ts:24-27`). An image cannot
be projected into that space directly.

**Do not reach for CLIP or any image-native embedding model.** Vectors from a
different model do not compare to anything in this corpus — the fan-out would
silently return meaningless neighbours. Images go
`vision caption / OCR → text → embedQuery()`.

### 2.3 Do not create a fourth upload component

Three already exist:

| File | Lines | Status |
| --- | --- | --- |
| `features/ai/pipelines/document-processing-pipeline/UploadZone.tsx` | 750 | only re-exported by two barrel files |
| `services/ai/components/upload-zone.tsx` | 803 | imported only for its *icons* (`PdfFileIcon`, `Doc01Icon`, `Txt01Icon`) |
| `components/file-upload/index.tsx` | 177 | live — used by `components/chat-resource-form.tsx` |

Audit these before writing new UI and reuse or extend rather than adding a
fourth. This repo already paid for duplicated surfaces once (the two tour
engines, T-050). Report what you found and what you chose.

### 2.4 One document-level embedding on the drop path

Embed the extracted text **once** for the immediate fan-out. Do not embed every
chunk on the drop path — N chunks × 7 `VECTOR_TABLES` is not "immediately."
Per-chunk drill-down is an on-demand follow-up call, not part of the first
response.

---

## 3. Request

```
POST /api/processing/drop
Content-Type: multipart/form-data

file: <File>          // required, single file
```

**Limits:**

| Rule | Value | On violation |
| --- | --- | --- |
| Max size | 10 MB | `413` + `TOO_LARGE` |
| Accepted MIME | `text/*`, `application/pdf`, `application/json`, `image/png`, `image/jpeg`, `image/webp` | `415` + `UNSUPPORTED_TYPE` |
| Text embedded | first 8,000 chars | not an error — set `meta.truncated: true` |

---

## 4. Response — `200 OK`

```ts
interface DropResponse {
  artifact: {
    /** Session-scoped UUID minted by the route. NOT a database id — nothing
     *  was persisted to Postgres. Do not treat as a corpus record id. */
    id: string
    filename: string
    mime: string
    bytes: number
    kind: 'text' | 'pdf' | 'image'
    /** @vercel/blob URL, or null when blob storage is unconfigured. */
    blobUrl: string | null
    /** How the embedded text was obtained. 'vision-caption' means the user is
     *  seeing connections to a *description* of their image, not the image —
     *  the UI must say so. */
    derivedVia: 'utf8' | 'pdf-parse' | 'vision-caption'
    extractedChars: number
    /** First ~500 chars of extracted text, for display on the node. */
    excerpt: string
  }

  matches: DropMatch[]

  meta: {
    embeddingModel: 'text-embedding-3-small'
    dims: 1536
    /** Which corpus tables actually returned candidates. */
    tablesSearched: string[]
    tookMs: number
    /** True when extraction exceeded the 8,000-char embed window. */
    truncated: boolean
  }
}

interface DropMatch {
  /** Corpus table the record lives in, e.g. 'documents', 'sightings',
   *  'people', 'document_chunks'. */
  table: string
  id: string
  /** For `document_chunks`, this is the PARENT document's title — search.ts
   *  already LEFT JOINs `documents` for exactly this reason (search.ts:227-228). */
  title: string
  /** The text that matched, for edge tooltips and the inspector. */
  snippet: string
  /** `_rrfScore` from searchDatabase. Reciprocal Rank Fusion score — a
   *  RANK-AGREEMENT number, not a cosine similarity and not a percentage.
   *  Never render it as "87% match". */
  score: number
  url: string | null
}
```

**Ordering:** `matches` is sorted by `score` descending. Default `limit` 12.

**Observed score band, 2026-08-13 (Agent A).** With no `searchTerms` there is
only one ranked list to fuse, so RRF degenerates to `1/(60 + rank)`: every
response's scores run ~`0.01667` (rank 0) down to ~`0.01389` (rank 11),
regardless of how well the file matches. **Nothing magnitude-based may be built
on `score`** — no bar widths, no opacity ramps, no percentages, no
strong/weak thresholds. It carries rank order and nothing else.

---

## 5. Errors

```ts
interface DropError {
  error: string   // human-readable, safe to display
  code: 'TOO_LARGE' | 'UNSUPPORTED_TYPE' | 'EXTRACT_FAILED'
      | 'EMBED_FAILED' | 'SEARCH_FAILED'
}
```

| Code | Status | Meaning |
| --- | --- | --- |
| `TOO_LARGE` | 413 | over 10 MB |
| `UNSUPPORTED_TYPE` | 415 | MIME not in allowlist |
| `EXTRACT_FAILED` | 422 | file readable but yielded no usable text |
| `EMBED_FAILED` | 502 | OpenAI embedding call failed |
| `SEARCH_FAILED` | 502 | corpus query failed |

**Partial success is a success.** If extraction and embedding succeed but the
fan-out returns nothing, that is `200` with `matches: []` — not an error. The
canvas shows the artifact node with no edges. "No connections found" is a real
and meaningful research result and must be rendered as one, not as a failure.

**Refinement, 2026-08-13 (Agent A, server half) — empty + unreachable is 502.**
`vectorSearch` swallows per-table errors and returns `[]` (`search.ts:242`), so
a database outage reaches the route shaped exactly like "nothing resembles this
file" — observed live: a Neon `fetch failed` produced a cheerful `200` with
`matches: []`. The route therefore confirms the corpus is reachable
(`SELECT 1`) before returning an empty result, and answers `502 SEARCH_FAILED`
when it is not. `matches: []` still means what §5 says it means; it just now
only appears when it is true.

**Two §4 examples do not match the schema** (found while mapping results):

- `sightings` has no `embedding` column (`VECTOR_TABLES`, `search.ts:24-27`), so
  it can never appear in an embedding-only fan-out.
- The corpus tables are `key_figures` and `organizations` — there is no `people`
  or `orgs` table.

**`matches: []` is in practice unreachable while the database is up.** Vector
search applies no similarity floor, so `vectorSearchAll` always returns its
top-12 nearest neighbours no matter how unrelated the dropped file is. The
canvas should still implement the empty state (it is correct, and it is what a
future similarity threshold would produce), but should expect never to see it
today.

---

## 6. Existing building blocks — use these, do not rebuild

| Need | Use | Location |
| --- | --- | --- |
| Text → 1536-dim vector | `embedQuery(text)` | `apps/app/src/services/ai/openai/embed-query.ts:9` |
| Corpus fan-out | `searchDatabase({ embedding, limit })` | `packages/db/src/postgres/search.ts:348` |
| Worked example of both together | `researchSearch` tool | `apps/app/src/services/ai/tools/research-search.ts` |
| Canvas mount point | below `<TourOverlay />` | `apps/app/src/features/mindmap/graph.tsx:558` |
| Node / edge registries | `node-types.tsx`, `edge-types.tsx` | `apps/app/src/features/mindmap/config/` |
| Canvas UI state | Zustand `mindmap-ui-store.ts` | `apps/app/src/features/mindmap/store/` |
| Blob storage | `@vercel/blob` `^1.1.1` | already in `apps/app/package.json:141` |

**Calling `searchDatabase({ embedding, limit })` with no `table` fans out across
every member of `VECTOR_TABLES`** (`search.ts:24-27`) via `vectorSearchAll`,
then fuses with RRF. That single call *is* the fan-out. You do not need to loop
tables yourself.

> **Corrected 2026-08-13 (Agent A).** An earlier draft of this paragraph listed
> the fan-out tables as "people, orgs, events, sightings, testimonies,
> documents, artifacts, document_chunks." That list was wrong on two counts and
> is retained here only so nobody re-derives it: the corpus tables are
> **`key_figures`** and **`organizations`** (there is no `people` or `orgs`
> table), and **`sightings` has no `embedding` column**, so it can never appear
> in an embedding-only fan-out at all. Read `VECTOR_TABLES` in
> `search.ts:24-27` for the authoritative set — do not trust a prose list,
> including this one.

**Do NOT add state to `mindmap-context.tsx`** (1,363-line god-object, CLAUDE.md).
Use the Zustand store.

---

## 7. Split of work

**Agent A — server.** Everything behind `POST /api/processing/drop`: multipart
parsing, limits, extraction (utf8 / pdf / vision-caption), blob upload,
`embedQuery`, `searchDatabase` fan-out, response assembly, error taxonomy.
Owns §3–§5 server-side.

**Agent B — canvas.** Drop target on the canvas, upload/thinking/resolved
states, the dropped-artifact node type, edges to matches, inspector, Zustand
state. Consumes §4. Builds against a local fixture until A's route lands — do
not block on A.

**Shared seam:** this file. If either agent needs a field that does not exist
here, they update this file and say so in their report rather than inventing it
locally.

---

## 7a. Deferred content types

T-060 covers **text / PDF / image only** (contract §3 MIME allowlist).
Deliberately deferred:

| Type | Why deferred |
| --- | --- |
| YouTube | Ingestion already exists and is **Lane A Python** (`apps/disclosure-rag/lib/youtube.py` + `trace_map.py` provenance). A Next.js reimplementation would be a second divergent ingestion path — the same class of error as the second corpus writer ruled out in §2.1. |
| URL | Needs unfurl + fetch + extraction infrastructure; overlaps `/api/processing/scrape`, which already exists and should be the integration point if this is picked up. |
| Video | Frame extraction and transcription is not a viable shape for a request-scoped serverless route. |

These are follow-ups, not omissions. Do not implement them under T-060.

---

## 8. Definition of Done (binding — `AGENTS.md`)

Both agents must return:

1. **A completion report with evidence.** Every claim names the command that
   proves it and shows that command's **actual output**. No "verified" or
   "works" on your word. Explicitly name what you did NOT do.
2. **A dogfood visual audit.** Every user path walked in the running app and
   visually confirmed.

If you cannot run the audit — no dev server, no `OPENAI_API_KEY`, no
`DATABASE_URL`, no blob token — say so explicitly and report the feature
**UNVERIFIED**. "Blocked on X" is an honest answer. Silence that reads as
completion is not. This repo has already been burned by a milestone recorded as
"DONE, dogfooded" whose literal exit criterion failed under review.
