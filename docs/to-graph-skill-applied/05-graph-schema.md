# Graph schema — kernel vs Ultraterrestrial overlay

**Part A is universal.** **Part B is this database.** Do not treat Part B labels
as innate to graphs.

The original template listed `MediaAsset` and `Author` in the same table as
`Resource` and `Entity`. That flattened a bookmark-corpus overlay into the
kernel. In this app:

- **Author** = `documents.author` → FK to [`packages/db/migrations/rebuild/0001_init.sql`](packages/db/migrations/rebuild/0001_init.sql) `key_figures` (a PERSON role).
- **Media** = `photo` / `photos[]` / `images[]` columns, not a required node label.

---

## Part A — Kernel (copy this to any domain)

Every edge carries `confidence`, `extractor`, `createdAt`, and a provenance pointer.

| Label | Key | Properties |
|-------|-----|------------|
| `Resource` | hash(canonicalRef, contentHash) | canonicalRef, title, status, retrievedAt |
| `Chunk` | hash(resource, locator, ordinal, text) | locator, ordinal, text (**Evidence only**) |
| `Entity` | hash(type, normalized name) at mint | name, **type (overlay)**, aliases[] |
| `Claim` | hash(s, p, o, chunk) | assertionType, confidence |

```
(Resource)-[:CHUNKED_INTO {ordinal}]->(Chunk)
(Chunk)-[:MENTIONS {surfaceForm}]->(Entity)
(Claim)-[:SUPPORTED_BY]->(Chunk)
(Claim)-[:ABOUT]->(Entity)
```

IDs: see [`00-kernel.md`](00-kernel.md). Always `MERGE`/upsert.

GraphRAG: vector payload includes `entityIds`, `resourceId`, `chunkId`.

Optional (only if you actually use them): `Tag`, `Category`.

---

## Part B — This domain (Neon)

Live schema: [`packages/db/migrations/rebuild/0001_init.sql`](packages/db/migrations/rebuild/0001_init.sql).
Graph projection: `nodes(id, entity_type, label)` + `edges(src_id, dst_id, rel_type, confidence, provenance)`.

### Overlay entity types → tables

| Overlay `Entity.type` | Table | Notable properties |
|----------------------|-------|--------------------|
| PERSON | `key_figures` | role, credibility, authority, bio |
| EVENT | `events` | date, location, lat/lon, metadata |
| ORGANIZATION | `organizations` | specialization |
| LOCATION | `locations` | city/state/country, coordinates, google_maps_location_id |
| TESTIMONY | `testimonies` | event, witness, organization FKs |
| TOPIC | `topics` | name, summary |
| DOCUMENT | `documents` | url, author→key_figures, organization, source_type |
| ARTIFACT | `artifacts` | origin, images[], date as freeform text |
| SIGHTING | `sightings` | shape, duration_seconds, lat/lon, comments |
| (kernel Chunk) | `document_chunks` | |
| (kernel Mention) | `document_entities` | |
| (Layer D) | `agent_inferences` | **do not embed** |

### Overlay predicates → junctions / edges

| Predicate | How it lands today |
|-----------|--------------------|
| MEMBER_OF | `organization_members` |
| HAS_EXPERT | `event_subject_matter_experts`, `topic_subject_matter_experts` |
| HAS_TESTIMONY | `topics_testimonies` |
| WITNESSED / ABOUT_EVENT | `testimonies.witness`, `testimonies.event` |
| AUTHORED_BY | `documents.author` → key_figures (not an Author label) |
| OCCURS_AT / FOUND_AT | location FKs / lat-lon columns |
| generic extracted rel | `edges.rel_type` |

### Cypher-shaped view of the overlay (logical, even when Postgres is the store)

```
(PERSON)-[:MEMBER_OF]->(ORGANIZATION)
(PERSON)-[:WITNESSED]->(TESTIMONY)
(TESTIMONY)-[:ABOUT_EVENT]->(EVENT)
(EVENT)-[:OCCURS_AT]->(LOCATION)
(SIGHTING)-[:OCCURS_AT]->(LOCATION)
(ARTIFACT)-[:FOUND_AT]->(LOCATION)
(DOCUMENT)-[:REFERENCES]->(EVENT)
(DOCUMENT)-[:AUTHORED_BY]->(PERSON)
(TOPIC)-[:HAS_TESTIMONY]->(TESTIMONY)
(EVENT)-[:HAS_EXPERT]->(PERSON)
(Chunk)-[:MENTIONS]->(Entity)
(Claim)-[:SUPPORTED_BY]->(Chunk)
```

### Vector (already on the tables)

`vector(1536)` on entity tables + chunks. Payload/filter analog: store `entity_ids`
on chunk rows (`document_entities`) so retrieval can jump into `edges`.

```sql
-- Idempotent mention (logical)
INSERT INTO document_entities (id, document_id, entity_id, confidence)
VALUES ($id, $doc, $entity, $confidence)
ON CONFLICT (id) DO UPDATE SET confidence = EXCLUDED.confidence;
```

### What you should not add "because the old 05 had it"

| Old template label | Do this instead |
|--------------------|-----------------|
| `Author` | PERSON + `AUTHORED_BY` |
| `MediaAsset` | optional; photos are columns until you need DEPICTS traversal |
| `RELATED_TO` as default | use the predicate table above |
