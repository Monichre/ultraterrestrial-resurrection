# Cross-language Prompt Registry (YAML)

Shared prompt corpus for the Ultraterrestrial monorepo. Consumed by **disclosure-rag** (Python) and **apps/app** (TypeScript via `@repo/prompts`).

## Structure

- `registry.yaml` — **canonical catalog** (source of truth)
- `sets/disclosure/` — versioned UFO/UAP prompts (`*.v1.yaml`)
- `templates/` — general-purpose + RAG pipeline templates
- `methodology/` — research frameworks that inform prompt authors (not runtime prompts)
- `schemas/` — JSON Schemas. [`packages/ai/prompts/schemas/prompt.schema.json`](packages/ai/prompts/schemas/prompt.schema.json) is the YAML prompt-file contract (`id` / `version` / `prompt` plus a few optional fields). **It is woefully incomplete** — it does not describe real registry entries (`kind`, `status`, `name`, `source`, structured `output`, most `runtime` keys, or the shapes behind `schema_ref`). Treat it as a stub, not a source of truth. Structured model-output schemas belong under `schema_ref` / `schemas/output/`, and those are also under-specified. In particular [`packages/ai/prompts/schemas/output/entity.schema.json`](packages/ai/prompts/schemas/output/entity.schema.json) is missing several core domain/database models: its `type` enum is only `PERSONNEL` / `EVENT` / `ORGANIZATION` / `EVIDENCE` / `LOCATION`, and it does not cover the primary record tables `sightings`, `testimonies`, `topics`, `documents`, or `artifacts` (nor `key_figures` except as the legacy `PERSONNEL` wire name).
- `yaml_loader.py` / `yaml-loader.ts` — cross-language loaders with alias support
- `scripts/promptctl.ts` — CLI: `list | validate | render | bump`

## Registry IDs

| ID | Aliases | File |
| ---- | --------- | ------ |
| `disclosure.ner` | `enhanced_ner`, `ner` | `sets/disclosure/ner.v1.yaml` |
| `disclosure.content_analysis` | `content_analysis`, `specialized_analysis` | `sets/disclosure/specialized-analysis.v1.yaml` |
| `disclosure.research` | `research` | `sets/disclosure/research.v1.yaml` |
| `disclosure.enhanced_research` | `enhanced_research` | `sets/disclosure/enhanced-research.v1.yaml` |
| `document_classification` | — | `templates/document_classification.yaml` |
| `rag_ingestion` | — | `templates/rag_ingestion.yaml` |
| `rag_grounded_answer` | — | `templates/rag_grounded_answer.yaml` |
| `deep_research` | — | `templates/deep_research.yaml` |
| `validation` | — | `templates/validation.yaml` |
| `synthesis` | — | `templates/synthesis.yaml` |
| `real_time_monitoring` | — | `templates/real_time_monitoring.yaml` |

## RAG / NER pipeline (recommended order)

1. `document_classification` — triage content type + ingest recommendation  
2. `rag_ingestion` — chunk + provenance metadata (Evidence only)  
3. `disclosure.ner` — span-grounded entities  
4. `validation` — gate before DB/index write  
5. `rag_grounded_answer` — citation-backed answers at query time  

Methodology: `methodology/RAG_DOCUMENT_PROCESSING.md`, `methodology/NER_EXTRACTION_PROTOCOL.md`.

## Environment

Set `PROMPTS_DIR` to override the default prompts location.

## TypeScript (`@repo/prompts`)

```typescript
import { loadPromptSync } from '@repo/prompts/yaml-loader'

const { prompt } = loadPromptSync('disclosure.ner', { context_hint: 'Roswell 1947' })
```

## Python (disclosure-rag)

```python
from lib.prompt_loader import get_prompt

research_prompt = get_prompt("disclosure.research")
ner_prompt = get_prompt("disclosure.ner")
```

Legacy `.py` shim files (`research_prompt.py`, etc.) re-export from the YAML registry for backward compatibility.

## CLI

```bash
bun run prompts:validate   # from repo root
bun run prompts:list
cd packages/ai/prompts && bun run render disclosure.ner context_hint="Roswell 1947"
```

## Notes

- Keep templates compact; push procedural logic into code.
- Attach JSON Schema via `schema_ref` for structured outputs. Do not infer the prompt-file contract from [`packages/ai/prompts/schemas/prompt.schema.json`](packages/ai/prompts/schemas/prompt.schema.json); that schema is woefully incomplete. [`packages/ai/prompts/schemas/output/entity.schema.json`](packages/ai/prompts/schemas/output/entity.schema.json) is not a domain model: it is missing several core Postgres record types (`sightings`, `testimonies`, `topics`, `documents`, `artifacts`).
- Wire fields like `PERSONNEL` / `key_findings` are legacy schema names — prompts map them to KeyFigure / source-grounded signals.
- Never index agent Inference as RAG Evidence (ADR-0001).
- `config.yaml` expects `OPENROUTER_API_KEY` in the environment (never commit secrets).
