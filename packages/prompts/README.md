# Cross-language Prompt Registry (YAML)

Shared prompt corpus for the Ultraterrestrial monorepo. Consumed by **disclosure-rag** (Python) and **apps/app** (TypeScript via `@repo/prompts`).

## Structure

- `registry.yaml` — **canonical catalog** (source of truth)
- `sets/disclosure/` — versioned UFO/UAP prompts (`*.v1.yaml`)
- `templates/` — general-purpose prompt templates
- `schemas/` — JSON Schemas for structured model outputs
- `yaml_loader.py` / `yaml-loader.ts` — cross-language loaders with alias support
- `scripts/promptctl.ts` — CLI: `list | validate | render | bump`

## Registry IDs

| ID | Aliases | File |
|----|---------|------|
| `disclosure.ner` | `enhanced_ner`, `ner` | `sets/disclosure/ner.v1.yaml` |
| `disclosure.content_analysis` | `content_analysis`, `specialized_analysis` | `sets/disclosure/specialized-analysis.v1.yaml` |
| `disclosure.research` | `research` | `sets/disclosure/research.v1.yaml` |
| `disclosure.enhanced_research` | `enhanced_research` | `sets/disclosure/enhanced-research.v1.yaml` |

## Environment

Set `PROMPTS_DIR` to override the default `packages/prompts` location.

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
cd packages/prompts && bun run render disclosure.ner context_hint="Roswell 1947"
```

## Notes

- Keep templates compact; push procedural logic into code.
- Attach JSON Schema via `schema_ref` for structured outputs.
- `config.yaml` expects `OPENROUTER_API_KEY` in the environment (never commit secrets).
