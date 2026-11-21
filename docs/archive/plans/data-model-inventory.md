# Xata CSV Export — Data Model Inventory
**Date:** 2026-05-30  
**Source:** `apps/app/scripts/xata-exports/exports/` (31 CSVs + schema.json)  
**Purpose:** Source-of-truth assessment for Postgres + pgvector greenfield rebuild

---

## 1. Export Overview

| Stat | Value |
|------|-------|
| Total CSV files | 31 |
| Authoritative row count (rec_* IDs only) | ~119,596 |
| Tables with real data | 20 |
| Completely empty tables | 7 (tags, theories, mindmaps, document-chunks, document-entities, document-processing-tasks, user-notes) |
| Tables with embedding columns | 7 (topics, personnel, events, organizations, testimonies, documents, artifacts) |
| Junction/link tables | 7 |
| User-personalisation tables | 8 (user-saved-*, user-notes) |

---

## 2. Per-Table Inventory

### 2.1 Core Entity Tables

#### `sightings` — 86,962 rows
**Purpose:** NUFORC/MUFON-style UFO sighting reports (bulk of the dataset)

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | `rec_*` format |
| date | datetime | Observation date |
| date_posted | datetime | Report submission date |
| description | string | Short description |
| comments | string | Long-form report; contains `&#44;` HTML-escaped commas (~32,752 rows affected) |
| city | string | |
| state | string | US state abbrev |
| country | string | ISO 2-letter |
| latitude | float | |
| longitude | float | |
| shape | string | e.g. "triangle", "disk", "diamond" |
| duration_seconds | string | Stored as text, not int |
| duration_hours_min | string | Human-readable text |
| media | file[] | Xata file array — URLs only recoverable if CDN still live |
| media_link | string | External URL |

**Quirks:** `&#44;` in `comments` must be decoded to `,` on ingest. No embedded newlines in this table. No FK/link columns — standalone table. `duration_seconds` should be cast to integer on import (NULLs expected).

---

#### `events` — 282 rows
**Purpose:** Named historical UAP events (Nimitz, Roosevelt, Roswell, etc.)

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| title | string (unique) | |
| name | text | |
| description | text | Contains real newlines inside quoted CSV fields |
| summary | text | |
| date | datetime | |
| location | string | Free-text location name |
| latitude | float | |
| longitude | float | |
| photos | file[] | |
| metadata | json | Default `{}` |
| category | multiple | Serialized as Python list literal: `['famous']`. Only observed value is `famous`. |
| embedding | vector(1536) | Only 1 row populated in export; must be re-generated |

**Quirks:** `category` is a `multiple` column serialized as `['famous']`; parse with `ast.literal_eval` or regex. Embedding nearly empty — re-generate all from `description + summary`.

---

#### `topics` — 182 rows
**Purpose:** Research topics / subject areas (e.g., "Ancient Aliens Theory", "Advanced Propulsion")

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| title | string (unique) | |
| name | string | |
| summary | text | |
| photo | file | Single file |
| photos | file[] | |
| embedding | vector(1536) | 1 populated row — re-generate |

---

#### `personnel` — 930 rows
**Purpose:** Key figures / researchers / witnesses in UAP history

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| name | string (unique) | |
| bio | text | Multi-paragraph, real newlines in CSV |
| role | string | |
| rank | int | 0–10 scale (inferred) |
| credibility | int | |
| popularity | int | |
| authority | int | |
| photo | file[] | |
| embedding | vector(1536) | 1 populated row — re-generate |

**Note:** `key-figures` table (930 rows, same IDs) is an **exact duplicate** of `personnel` with an added `xataversion` int column and `embedding` typed as `text` (not `vector`). See §2.4.

---

#### `organizations` — 80 rows
**Purpose:** Government agencies, research groups, military units involved in UAP

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| title | string (unique) | |
| name | string | |
| specialization | string | |
| description | text | |
| photo | text | Legacy text URL field |
| image | file | Xata managed file |
| embedding | vector(500) | **Non-standard dim: 500** — schema says 500, not 1536. 1 populated row. |

**Action required:** Schema declares `vector(500)`. For pgvector rebuild, normalize to `vector(1536)` and re-generate all embeddings using `text-embedding-3-small`.

---

#### `testimonies` — 356 rows
**Purpose:** Witness statements and whistleblower claims linked to events and personnel

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| claim | text | Main assertion |
| summary | text | |
| context | text | |
| source | text | External URL or citation |
| date | datetime | |
| event | link → events | FK as bare `rec_*` id; empty string = NULL |
| witness | link → personnel | FK as bare `rec_*` id |
| organization | link → organizations | FK; mostly empty |
| documentation | file[] | |
| media | file[] | |
| embedding | vector(1536) | 1 populated — re-generate |

---

#### `documents` — 400 rows  ⚠️ EMBEDDING CORRUPTED
**Purpose:** Government documents, reports, PDFs in the evidence library

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| title | string | |
| date | datetime | |
| summary | text | |
| url | text | |
| processed | bool | Default false |
| author | link → personnel | FK |
| organization | link → organizations | FK |
| file | file[] | |
| images | file[] | |
| metadata | json | |
| embedding | vector(1536) | **CORRUPTED** — unquoted float array spills across all remaining columns |

**Corruption confirmed:** Python `csv.reader` parses every data row as 1,547 fields instead of 12. The `embedding` column value is an unquoted `[float, float, ...]` array — the CSV exporter did not quote it, so commas in the vector split into new columns. **All 400 rows are affected** (all 400 had embeddings populated at export time). The non-embedding metadata (title, url, summary, processed, author, organization) is unrecoverable from the CSV for any row that has an embedding, because column positions after the embedding field are all shifted.

**Recovery strategy:** Re-ingest documents from source URLs/files; re-generate embeddings. The `id` values (rec_* prefix, one per line) are intact and can anchor re-import.

---

#### `locations` — 27,866 rows
**Purpose:** Named geographic locations (cities, sites) with coordinates

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| name | string | City + region/country |
| city | string | |
| state | string | |
| coordinates | string | Redundant text "lat, lon" — superseded by lat/lon cols |
| latitude | float | |
| longitude | float | |
| google-maps-location-id | text | Populated for ~7,397/27,866 rows |

**Notes:** No FK links — standalone reference table. `google-maps-location-id` column name has a hyphen → must rename to `google_maps_location_id`. `coordinates` string column is redundant with float cols — can be dropped or kept for display.

---

#### `artifacts` — 72 rows
**Purpose:** Physical artifacts associated with UAP events

| Column | Xata Type | Notes |
|--------|-----------|-------|
| id | string (PK) | |
| name | string (unique) | |
| description | text | |
| date | string | Free-text date (not datetime) |
| source | text | |
| origin | text | |
| photos | multiple | Serialized as Python list of URL strings: `['http://...']` |
| images | file[] | Xata managed |
| embedding | vector(1536) | 1 populated — re-generate |

**Quirks:** `photos` is a `multiple` (array of strings) column serialized as `['url1', 'url2']`. Parse with `ast.literal_eval`. `date` is a plain `string` not datetime — values vary.

---

### 2.2 Junction / Link Tables

| Table | Rows | Links |
|-------|------|-------|
| `event-subject-matter-experts` | 236 | events ↔ personnel |
| `topic-subject-matter-experts` | 1,702 | topics ↔ personnel |
| `event-topic-subject-matter-experts` | 120 | events ↔ topics ↔ personnel (3-way) |
| `topics-testimonies` | 1,488 | topics ↔ testimonies |
| `organization-members` | 24 | personnel ↔ organizations |

**All link columns** are bare `rec_*` ID strings. Empty string (`''`) means NULL — must be converted to SQL NULL on ingest.

---

### 2.3 Document Processing Pipeline Tables (Empty)

These were scaffolded but never populated:

| Table | Rows | Columns | Verdict |
|-------|------|---------|---------|
| `document-chunks` | 0 | id, chunk_index, content, document, embedding(vector(3)!), heading, page_number, token_count | Rebuild with `vector(1536)` |
| `document-entities` | 0 | id, document, entity-type(multiple), entity-data, metadata | Rebuild |
| `document-processing-tasks` | 0 | id, document, task(multiple), status, metadata | Rebuild |
| `summary-files` | 2 (both empty) | id, content, document, embedding(multiple/0-dim), file, images, metadata, name, source | Rebuild; old embedding type is `multiple` with dim 0 — broken in Xata |

**Note:** `document-chunks.embedding` is declared `vector(3)` in schema — clearly a stub/mistake. The greenfield schema must use `vector(1536)` here as this is the primary chunk-level embedding store for the ingestion pipeline.

---

### 2.4 Vestigial / Duplicate Tables

| Table | Rows | Issue | Recommendation |
|-------|------|-------|----------------|
| `key-figures` | 930 | Exact ID/data duplicate of `personnel`; `embedding` typed as `text` not vector | **DROP** — consolidate into `personnel` |
| `tags` | 0 | No columns, no data | **DROP** |
| `theories` | 0 | No columns, no data | **DROP** |
| `mindmaps` | 0 | 1 header-echo row, no data; `embedding vector(1536)` + `json` + `user` link | **DROP** — mindmap state lives in app, not DB |

---

### 2.5 User Personalisation Tables

All reference a `users` table and a `user-notes` table. The `user-notes` table is empty. User-saved-events and user-saved-documents have 50 rows each, but the note content is **Lorem Ipsum seed data** — not real user data. All other user-saved-* tables have 0 real rows.

| Table | Real Rows | Notes |
|-------|-----------|-------|
| `users` | 2 (duplicate of 1 real user) | Liam Ellis / liamhellis@gmail.com — Clerk external_id present |
| `user-notes` | 0 | Empty |
| `user-saved-events` | 50 | Fake Lorem Ipsum notes — seed data only |
| `user-saved-documents` | 50 | Fake seed data |
| `user-saved-key-figure` | 0 | |
| `user-saved-topics` | 0 | |
| `user-saved-testimonies` | 0 | |
| `user-saved-organizations` | 0 | |
| `user-saved-sightings` | 0 | |

**Recommendation:** Keep schema, import only the 1 real user row. Discard seed data entirely.

---

## 3. Confirmed Export Quirks

### Q1: `&#44;` HTML-encoded commas
- **Confirmed present** in `sightings.comments`: ~32,752 of 86,962 rows
- **Not present** in events, topics, personnel, testimonies
- **Fix:** `value.replace('&#44;', ',')` on `comments` column during ETL

### Q2: Real newlines inside quoted fields
- **Confirmed** in `events.description`, `personnel.bio`, `testimonies.claim` — Python csv.reader handles these correctly (RFC 4180 quoted fields)
- **Not present** in `sightings` (0 rows with embedded newlines)

### Q3: `multiple` columns as Python list literals
- **Confirmed** in `events.category`: serialized as `['famous']`
- **Confirmed** in `artifacts.photos`: serialized as `['https://...', ...]`
- **Also in** `document-entities.entity-type`, `document-processing-tasks.task`
- **Fix:** `ast.literal_eval(value)` then store as Postgres `text[]` array

### Q4: `link` columns as bare `rec_*` strings; empty string = NULL
- **Confirmed** — every FK column (event, witness, organization, author, topic, etc.) is either a `rec_*` id string or `''`
- **Fix:** `None if value == '' else value` mapping during ingest; FK columns in Postgres should be `text` referencing the `id` column of the target table (or converted to `bigserial` with a mapping table)

### Q5: `documents.csv` embedding CORRUPTED
- **CONFIRMED** — all 400 rows parse as 1,547 fields; the unquoted `[float, ...]` vector spills across all columns after `embedding`
- **Impact:** Title, URL, summary, author, organization are unrecoverable for embedded rows from CSV alone
- **Mitigation:** Document `id` values (rec_* per line start) survive; re-ingest from source files

### Q6: Header-echo rows (duplicate header rows mid-file)
- **Confirmed** in `users.csv` (header repeated at row 2), `summary-files.csv` (header at row 2), `user-saved-events.csv` (scattered throughout)
- **Fix:** Filter rows where `id == 'id'` during ETL

### Q7: Hyphenated column and table names
- **Confirmed** — `google-maps-location-id`, `note-title`, `subject-matter-expert`, `entity-type`, `key-figure`, `chunk_index`, table names like `event-subject-matter-experts`
- **Fix:** Rename all hyphens to underscores in Postgres schema; create explicit column aliases in ETL

### Q8: Reserved word `user` as table name
- **Confirmed** — `users` table name is safe (plural). However, `user` appears as a FK column name in multiple tables (`user-saved-events.user`, `mindmaps.user`)
- **Fix:** Rename FK column `user` → `user_id` in all tables

### Q9: `organizations.embedding` is `vector(500)` not `vector(1536)`
- **Confirmed** in schema.json. Export has 1 populated row
- **Fix:** Normalize to `vector(1536)` in rebuild; re-generate all

### Q10: `key-figures` is an exact duplicate of `personnel`
- **Confirmed** — identical 930 IDs, same columns. `key-figures.embedding` typed as `text` in schema (not vector)
- **Fix:** DROP table; use `personnel` only

---

## 4. Relationship Graph

```
sightings ──────────────── (standalone, no FKs)
locations ──────────────── (standalone, no FKs)

personnel ◄─────────────── organization-members ──► organizations
personnel ◄─────────────── event-subject-matter-experts ──► events
personnel ◄─────────────── topic-subject-matter-experts ──► topics
personnel ◄─────────────── event-topic-subject-matter-experts ──► events, topics
personnel ◄─────────────── testimonies.witness
organizations ◄──────────── testimonies.organization
events ◄─────────────────── testimonies.event
topics ◄─────────────────── topics-testimonies ──► testimonies
personnel ◄─────────────── documents.author
organizations ◄──────────── documents.organization
documents ◄──────────────── document-chunks.document
documents ◄──────────────── document-entities.document
documents ◄──────────────── document-processing-tasks.document
documents ◄──────────────── summary-files.document (1:1, unique)

users ◄──────────────────── user-saved-events.user ──► events
users ◄──────────────────── user-saved-documents.user ──► documents
users ◄──────────────────── user-saved-topics.user ──► topics
users ◄──────────────────── user-saved-testimonies.user ──► testimonies
users ◄──────────────────── user-saved-key-figure.user ──► personnel
users ◄──────────────────── user-saved-organizations.user ──► organizations
users ◄──────────────────── user-saved-sightings.user ──► sightings
users ◄──────────────────── user-notes.user
user-notes ◄─────────────── user-saved-* .theory (all saved tables)
```

---

## 5. Target Postgres Schema Recommendations

### 5.1 Table List (greenfield)

Keep 19 tables; drop 4 vestigial ones.

**DROP:** `key_figures`, `tags`, `theories`, `mindmaps`

**KEEP / RENAME:**

| Xata name | Postgres name | Action |
|-----------|---------------|--------|
| sightings | sightings | Import as-is |
| events | events | Decode category array |
| topics | topics | |
| personnel | personnel | |
| organizations | organizations | |
| testimonies | testimonies | |
| documents | documents | Re-ingest from source |
| locations | locations | Rename hyphenated col |
| artifacts | artifacts | Parse photos array |
| event-subject-matter-experts | event_personnel | Rename |
| topic-subject-matter-experts | topic_personnel | Rename |
| event-topic-subject-matter-experts | event_topic_personnel | Rename |
| topics-testimonies | topic_testimonies | Rename |
| organization-members | organization_personnel | Rename |
| document-chunks | document_chunks | Rebuild with vector(1536) |
| document-entities | document_entities | |
| document-processing-tasks | document_processing_tasks | |
| summary-files | document_summaries | Rename; fix embedding type |
| users | users | |
| user-saved-events | user_saved_events | |
| user-saved-documents | user_saved_documents | |
| user-saved-topics | user_saved_topics | |
| user-saved-testimonies | user_saved_testimonies | |
| user-saved-key-figure | user_saved_personnel | Rename |
| user-saved-organizations | user_saved_organizations | |
| user-saved-sightings | user_saved_sightings | |
| user-notes | user_notes | |

### 5.2 Column Types

```sql
-- All id columns
id TEXT PRIMARY KEY  -- keep rec_* strings as-is OR convert to BIGSERIAL with mapping

-- FK columns (all currently bare rec_* or empty string)
author_id TEXT REFERENCES personnel(id)   -- '' → NULL
event_id  TEXT REFERENCES events(id)      -- '' → NULL

-- multiple/array columns
category    TEXT[]    -- parsed from ['famous']
photos      TEXT[]    -- parsed from ['url1','url2']
entity_type TEXT[]
task        TEXT[]

-- vector columns
embedding   vector(1536)   -- ALL tables normalized to 1536
-- Exception: document_chunks also vector(1536)

-- FTS columns (add these — not in Xata)
search_vector tsvector  -- add to: sightings, events, topics, personnel, testimonies, documents

-- Geometry (optional upgrade)
coordinates GEOGRAPHY(POINT, 4326)  -- computed from lat/lon where both present
```

### 5.3 Vector + FTS Strategy

| Table | vector(1536) | tsvector FTS |
|-------|-------------|--------------|
| sightings | No (no existing embeddings; too many rows for batch cost — add selectively) | YES — on `description + comments` |
| events | YES | YES — on `name + description + summary` |
| topics | YES | YES — on `name + summary` |
| personnel | YES | YES — on `name + bio` |
| organizations | YES (re-generate, not 500-dim) | YES — on `name + description` |
| testimonies | YES | YES — on `claim + summary + context` |
| documents | YES (re-generate; CSV corrupt) | YES — on `title + summary` |
| document_chunks | YES — **primary chunk store** | YES — on `content` |
| artifacts | YES | YES — on `name + description` |

### 5.4 FK Strategy

Two valid approaches:

**Option A — Keep `rec_*` text IDs (recommended for migration speed)**  
- Keep `id TEXT PRIMARY KEY` everywhere
- FK columns are `TEXT REFERENCES target(id) ON DELETE SET NULL`
- Zero ID remapping required; CSV import is direct

**Option B — Migrate to bigserial**  
- Add `bigserial` surrogate PKs, keep `xata_id TEXT UNIQUE` for legacy reference
- More idiomatic Postgres; heavier ETL

**Recommendation: Option A** for the initial rebuild. Add `bigserial` as a secondary migration after data is loaded and verified.

### 5.5 Tables Safe to DROP

| Table | Reason |
|-------|--------|
| `key_figures` | Exact duplicate of `personnel` with broken embedding type |
| `tags` | Zero columns, zero rows, never wired in app |
| `theories` | Zero columns, zero rows, never wired in app |
| `mindmaps` | Zero data; mindmap state managed in app layer (Zustand), not DB |

### 5.6 Special Handling Notes

1. **documents.csv** — Do NOT import from CSV. Re-ingest documents from source URLs. Use the `rec_*` IDs from the CSV line starts as the stable `id` values. Re-generate embeddings with `text-embedding-3-small`.

2. **sightings.comments** — Run `str.replace('&#44;', ',')` before insert. Cast `duration_seconds` to `INTEGER` with `NULLIF` guard.

3. **locations.google-maps-location-id** — Rename to `google_maps_location_id`. Only 7,397/27,866 rows have it; others NULL.

4. **users table** — `user` is a reserved word in Postgres but the table is named `users` (safe). Rename FK column `user` → `user_id` in all referencing tables.

5. **summary-files.embedding** — Xata schema declares this as `multiple` with `dimension: 0` — a broken field. In rebuild, replace with `vector(1536)`.

6. **User-saved seed data** — `user_saved_events` and `user_saved_documents` contain 50 rows of Lorem Ipsum seed data. Import zero rows from these tables; the schema is worth keeping.

7. **Ingestion pipeline tables** — `document_chunks`, `document_entities`, `document_processing_tasks` are all empty; create them with corrected types (`vector(1536)`, `text[]`) and let the new pipeline fill them.

---

## 6. Accurate Row Count Summary

| Table | Rows |
|-------|------|
| sightings | 86,962 |
| locations | 27,866 |
| key-figures (DROP) | 930 |
| personnel | 930 |
| documents | 400 (corrupt embedding) |
| topics-testimonies (junction) | 1,488 |
| topic-subject-matter-experts (junction) | 1,702 |
| events | 282 |
| event-subject-matter-experts (junction) | 236 |
| testimonies | 356 |
| topics | 182 |
| event-topic-subject-matter-experts (junction) | 120 |
| artifacts | 72 |
| organizations | 80 |
| organization-members (junction) | 24 |
| users | 2 (1 real) |
| user-saved-events | 50 (seed) |
| user-saved-documents | 50 (seed) |
| summary-files | 2 (both empty content) |
| All others | 0 |
| **TOTAL** | **~119,734** |

Real importable rows (excluding seed data, duplicates, empty): **~119,384**  
Largest table by far: `sightings` (72.7% of all rows)
