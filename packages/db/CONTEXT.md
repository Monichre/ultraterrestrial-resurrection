# Database / `@db/postgres` — Context

The only live database layer: Neon Postgres 17 + pgvector 0.8, reached through `packages/db/src/postgres/`. This context owns the mapping from domain record types to tables, the retrieval model, and the `agent_inferences` contract.

Reserved words (`Claim`, `Inference`, `Evidence`, `Proves`) and the eight evidentiary states are defined in the root [`CONTEXT.md`](../../CONTEXT.md) and may not be redefined here. What follows is this context's **local encoding** of them.

---

## Entity tables

The eight primary record tables, each backing one domain record type:

`sightings` · `events` · `key_figures` · `testimonies` · `topics` · `organizations` · `documents` · `artifacts`

**`key_figures`**:
The table behind the **Key Figure** record type, migrated from `personnel`. `TABLE_ALIAS` in both `search.ts` and `queries.ts` resolves `personnel` and `key-figures` onto it, so legacy callers keep working.
_Avoid_: creating new `personnel*` identifiers; treating `PersonnelRecord` as the canonical type name (`KeyFiguresRecord` is its alias in `types.ts`)

**`document_chunks`**:
Embedded slices of `documents` content. A retrieval artifact, not a domain record type — it has no record-type entry in the root glossary and never surfaces as a node.
_Avoid_: exposing chunks as records in UI copy

**Join tables**:
`event_subject_matter_experts`, `topic_subject_matter_experts`, `organization_members`, `topics_testimonies`, `event_topic_subject_matter_experts`. These are the *documented links* that produce the `connected` suggestion signal.
_Avoid_: "relationship" for these rows — a documented link is evidence of association, not an asserted connection

**`agent_inferences`**:
The analytical-layer overlay table. See the contract below.

---

## Query patterns

**`getSql()`** (`client.ts`) — the raw tagged-template `@neondatabase/serverless` client. The write path and the escape hatch for custom SQL.

**Typed readers** (`queries.ts`) — `getAll*` / `get*ById` / `get*ByDateRange` per table, plus aggregates (`aggregateEventsByYear`, `aggregateSightingsByShape`, `sightingsTimeSeries`) and `loadEntityGraph`.

**`resolveTable(name)`** — the single alias-resolution function. Any new caller taking a table name from outside must run it through this before touching SQL.

_Avoid_: importing from `@db/xata` or `@db` (retired); `xata.db.*` patterns; string-interpolating a caller-supplied table name into SQL without a whitelist check

---

## The retrieval model

Two independent signals, fused. There is no third path — "Triple RAG" and its 40/40/20 weighting do not exist in this package.

**FTS**:
`search_vector @@ plainto_tsquery('english', …)` scored by `ts_rank`. Runs only against `FTS_TABLES` (`search.ts`): the eight entity tables.

**trgm fallback**:
`similarity()` over a per-table whitelist of text columns, used when FTS returns nothing or the table has no `search_vector`. The only keyword path into `document_chunks`.

**Vector**:
pgvector cosine over `embedding vector(1536)`, `text-embedding-3-small` (locked). Runs against `VECTOR_TABLES` (`search.ts`).

**Retrieval asymmetry** — the two table sets are not the same, and the difference is load-bearing:

| Table | FTS | Vector |
|---|---|---|
| `sightings` | yes | **no** — no embedding column |
| `document_chunks` | **no** — no `search_vector`; trgm only | yes |
| other six entity tables | yes | yes |

_Avoid_: assuming a semantic query reaches `sightings`, or that a keyword query ranks `document_chunks` well

**`searchDatabase({table, searchTerms, limit, embedding})`**:
The single search entry point used by the mindmap agent route and the Prometheus chat `searchNeonDatabase` tool. Without `embedding` it is FTS-only. With `embedding` it pulls a deeper candidate pool from each signal (`limit * 3`), runs FTS and vector **in parallel**, and fuses with **Reciprocal Rank Fusion** — rank agreement, not raw score magnitude.
_Avoid_: describing the fusion as "dedupe by id then rank by score"; comparing FTS `ts_rank` and cosine scores directly

**`getRelatedRecords({seeds, …})`** (`related.ts`):
The deterministic suggestion engine. No LLM, no embedding API call — it reads *stored* embeddings, so it works while OpenAI is down. Three signals on `RelatedReason`:

`connected` — documented links through the five join tables
`similar` — pgvector cosine neighbours of the seeds' stored embeddings
`temporal` — events within a ±N-year window of seed events

Every `RelatedSuggestion` carries `seedId`, `seedTitle`, and a human-readable `reasonDetail`, so the canvas can draw a justified edge on add.
_Avoid_: adding an LLM step here — this is the deterministic floor beneath the analytical layer

---

## The `agent_inferences` contract

Governed by [`docs/adr/0001-agent-inferences-excluded-from-retrieval.md`](../../docs/adr/0001-agent-inferences-excluded-from-retrieval.md). This is a hard boundary, not a convention.

**Write path**:
`insertAgentInference` is the **only** way agent output enters the database. Columns: `inference_text`, `evidentiary_state`, `source_record_id`, `source_table`, `target_record_id`, `extracted_by` (defaults `'mindmap-agent'`).

**Read path**:
`getInferencesForRecord(recordId)` — analytical trail only.

**Exclusion**:
`agent_inferences` is never queried by `searchDatabase`, never included in `FTS_TABLES` or `VECTOR_TABLES`, and never a source for `related.ts`. Any new retrieval or suggestion feature must explicitly exclude it. A future reader (e.g. an adversarial Skeptic pass) must use a separated read path that never mingles inference rows with entity rows in one result set.

**Why**: inferences are semantically rich, so if retrievable they would surface beside primary sources and silently bootstrap model output into the evidence base — inference grounding inference, compounding without a visible seam. The deterministic data floor must remain the floor. LLM output amplifies; it does not seed.

_Avoid_: adding `agent_inferences` to any table whitelist; naming a future source-extracted table anything but `claims`

**`EvidentiaryState` (local encoding)**:
The eight states, **lowercase** in this package (`'observed' | 'corroborated' | … | 'disconfirmed'`, `agent-inferences.ts`). The canvas uses TitleCase on the wire and UPPERCASE when rendered. The mindmap route is the conversion site: it parses the `[State]` bracket off an edge reasoning string, lowercases it, validates against its own allowed set, and falls back to `'unverified'` on no match.
_Avoid_: writing TitleCase into `evidentiary_state`; defaulting the column to anything but `'unverified'` when the caller omits it
