# Cross-language Prompt Registry (YAML)

This directory provides a shared, YAML-based prompt registry that can be consumed from both TypeScript/Node and Python.

## Structure

- `templates/` — YAML prompt files (one per prompt)
- `schemas/` — JSON Schemas that define expected model outputs
- `index.yaml` — Catalog of available prompts with metadata

## YAML Template Format

Common fields:
- `id`: unique identifier (also the filename stem)
- `version`: semver string
- `description`: short description
- `owner`: owning team or person
- `tags`: discovery metadata
- `schema_ref`: path to JSON Schema (relative to `prompts/`) or null
- `runtime`: defaults for `max_tokens`, `temperature`, etc.
- `variables`: array of `{ name, type, required }`
- `prompt`: multi-line string with `{{variable}}` placeholders

## Environment

Both loaders support an optional `PROMPTS_DIR` env var to override the location of this folder.
If not set, they attempt to resolve `prompts/` relative to the repository root.

## TypeScript Usage (server-side)

1) Install dependency: `npm i yaml` (or `pnpm add yaml`)
2) Use the loader in `apps/app/src/services/ai/prompts/yaml-loader.ts`

Example:

- Load `enhanced_ner`:
  - Rendered prompt string
  - Attached JSON Schema (if any)

## Python Usage

1) Install dependency: `pip install pyyaml`
2) Use the loader in `apps/disclosure-rag/research/prompts/yaml_loader.py`

Example:

- Load `content_analysis` with variables
  - Rendered prompt string
  - Attached JSON Schema (if any)

## Notes

- Keep templates compact; move any long procedural logic into code, not the prompt text.
- Use JSON Schema to enforce structured outputs and simplify downstream parsing.
