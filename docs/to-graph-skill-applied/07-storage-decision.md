# Storage decision — Ultraterrestrial

Kernel rule: the graph is a logical model; the landing zone is a project call.
See the decision tree in [`00-kernel.md`](00-kernel.md).

## This project: Tier 2

| Store | Role |
|-------|------|
| Neon Postgres 17 + pgvector | System of record for overlay entities + `document_chunks` + `nodes`/`edges` |
| Filesystem archive (`KnowledgeBaseCRUD`) | disclosure-rag Layer A copies + `*_rag_pipeline.json` sidecars |
| OpenAI vector store | optional upload; not the canonical graph |
| Upstash Search / Mem0 | optional, fault-tolerant, skippable |

This is the "100k+ records, traversal + semantic" cell of the original template's
tree. Do not introduce Neo4j *because* the words knowledge graph appeared —
`nodes`/`edges` in Postgres already project the LPG.

## Promote path (already walked)

Tier 0 sidecars (`*_rag_pipeline.json`) still get written beside transcripts.
Canonical Layer C is Postgres. Same overlay types in both.

## JSON-LD analog (portable)

A Resource file can still round-trip:

```json
{
  "@type": "Resource",
  "canonicalRef": "https://...",
  "mentions": [{ "@id": "entity:key_figures/...", "type": "PERSON" }]
}
```

Importing that into `key_figures` is mechanical if ids stay deterministic.
