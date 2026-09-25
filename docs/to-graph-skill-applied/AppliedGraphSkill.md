# AppliedGraphSkill

**Folder:** [`to-graph-skill-applied/`](README.md)  
**Created:** 2026-09-12  
**Did not edit:** any existing file in this repo or in `to-graph-skill-template`

---

## Purpose

A domain-applied copy of the graph-skill template for Ultraterrestrial.
Kernel methodology is identical to the design-capture and knowledge-interfaces
applied packs. Overlay types match live Postgres, not the bookmark-corpus
example (`Author`, `MediaAsset`).

---

## Modules

| File | Role |
|------|------|
| [`00-kernel.md`](00-kernel.md) | Universal rules (verbatim copy across the three packs) |
| [`05-graph-schema.md`](05-graph-schema.md) | Part A kernel / Part B Neon overlay |
| [`08-domain-overlay.yaml`](08-domain-overlay.yaml) | Legal types + table map |
| [`03-types.ts`](03-types.ts) | Contracts for agents |
| [`04-structured-asks.md`](04-structured-asks.md) | Prompts with this overlay |

---

## Data flow (this app)

```
URL | file | playlist
  → adapter (YouTube / web / file)
  → Resource (hash) + optional fidelity quarantine
  → classify / Evidence chunk / NER against overlay
  → validate safe_for_rag_index
  → resolve into key_figures…sightings
  → nodes/edges + document_chunks
  → Layer D stays in analysis / agent_inferences
```

---

## Mapping that removes the original 05 confusion

| Original template label | Here |
|-------------------------|------|
| Resource, Chunk, Entity, Claim | Kernel (keep) |
| Tag, Category | Optional |
| Author | PERSON + AUTHORED_BY → key_figures |
| MediaAsset | Not required; photo columns |

---

## Not done

- No edits to disclosure-rag code or migrations
- No Neo4j DDL (Postgres is the store)
- LLM/visual audit N/A (documentation pack)
