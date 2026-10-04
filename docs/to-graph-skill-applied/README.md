# Applied graph skill — Ultraterrestrial / UAP research

**This folder is new.** It does not replace or edit the original
`design-capture/to-graph-skill-template` (outside this repo). Kernel methodology is
[`00-kernel.md`](00-kernel.md). This domain's nouns are
[`08-domain-overlay.yaml`](08-domain-overlay.yaml).

## How to read this pack (two minutes)

1. [`00-kernel.md`](00-kernel.md) — rules that stay true in any domain.
2. [`05-graph-schema.md`](05-graph-schema.md) — **Part A kernel / Part B this database.**
   `Author` and `MediaAsset` are **not** kernel. Here, author is a KeyFigure role;
   photos live as properties on entities, not as a required `MediaAsset` label.
3. [`08-domain-overlay.yaml`](08-domain-overlay.yaml) — legal types and predicates.
4. The rest is how those overlay types map onto this app.

## This domain in one sentence

Unstructured UAP/disclosure sources become Key Figures, Events, Organizations,
Locations, Testimonies, Topics, Documents, Artifacts, and Sightings, linked with
evidence-preserving chunks — never with model inference indexed as source text.

## File map

| File | Kernel or overlay |
|------|-------------------|
| [`00-kernel.md`](00-kernel.md) | Kernel (identical in the other two applied packs) |
| [`01-vocabulary.md`](01-vocabulary.md) | Kernel terms + this app's field language |
| [`02-diagrams.md`](02-diagrams.md) | Kernel pipeline + this ontology |
| [`03-types.ts`](03-types.ts) | Contracts |
| [`04-structured-asks.md`](04-structured-asks.md) | Prompts with this overlay filled in |
| [`05-graph-schema.md`](05-graph-schema.md) | Schema split |
| [`06-source-adapters.md`](06-source-adapters.md) | YouTube / web / file / playlist |
| [`07-storage-decision.md`](07-storage-decision.md) | Neon Postgres + pgvector (Tier 2) |
| [`08-domain-overlay.yaml`](08-domain-overlay.yaml) | Overlay |

Live tables: [`packages/db/migrations/rebuild/0001_init.sql`](packages/db/migrations/rebuild/0001_init.sql).
Ingest skill: [`apps/disclosure-rag/disclosure-rag-processor/SKILL.md`](apps/disclosure-rag/disclosure-rag-processor/SKILL.md).
