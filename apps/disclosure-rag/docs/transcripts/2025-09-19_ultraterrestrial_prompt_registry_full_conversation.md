# Ultraterrestrial — Prompt Registry: Full Conversation Transcript
_Date: 2025-09-19 · Timezone: America/Chicago_

---

## Turn 1 — User
**Message:**  
“Help me get started creating the prompt registry and its management in .yaml”

---

## Turn 2 — Assistant
**Message:**  
Heck yes—YAML prompt registry is the right move. We’ll use a shared, cross-language registry with JSON Schemas and a tiny CLI. Core goals: single source of truth, schema-validated outputs, versioned prompts, and compatibility for both Python and TypeScript.

Key decisions:
- Shared YAML prompts with variable interpolation
- Output JSON Schemas for consistent, parseable results
- Registry file enumerating all prompts (and aliases for backward-compat)
- Loaders for TS and Python
- CLI to list/validate/render/bump versions

---

## Turn 3 — User
**Message:**  
“We need to make the prompt registry flexible enough to be used in Python and TS. Implement .yaml templates.”

---

## Turn 4 — Assistant
**Message:**  
Implemented initial cross-language registry and loaders.

- Added YAML templates (initially under prompts/) for:
  - Enhanced NER prompt (structured, token-efficient)
  - Unified Content Analysis prompt (with JSON schema)
- Created JSON Schemas for outputs (entity, analysis)
- Added loaders:
  - TypeScript loader that resolves prompt, interpolates variables, attaches schema
  - Python loader with the same behavior
- Provided usage examples for both runtimes

---

## Turn 5 — User
**Message:**  
“Moved to packages/prompts.”

---

## Turn 6 — Assistant
**Message:**  
Updated both loaders to prefer the new monorepo location packages/prompts, with fallback to legacy paths and support for PROMPTS_DIR override.

- TS: apps/app/src/services/ai/prompts/yaml-loader.ts
- Python: packages/prompts/yaml_loader.py

---

## Turn 7 — User
**Message:**  
Proposed the definitive layout:

prompts/
  registry.yaml                # master index of all prompts (aliases ok)
  sets/
    disclosure/
      ner.v1.yaml
      specialized-analysis.v1.yaml
  schemas/
    prompt.schema.json         # JSON Schema for validation
    output/
      entity.schema.json
      analysis.schema.json
scripts/
  promptctl.ts                 # tiny CLI for list/validate/render/bump

---

## Turn 8 — Assistant
**Message:**  
Implemented the structure under packages/prompts (with loaders updated to read registry.yaml):

- packages/prompts/registry.yaml
- packages/prompts/sets/disclosure/ner.v1.yaml
- packages/prompts/sets/disclosure/specialized-analysis.v1.yaml
- packages/prompts/schemas/prompt.schema.json
- packages/prompts/schemas/output/entity.schema.json
- packages/prompts/schemas/output/analysis.schema.json
- packages/prompts/scripts/promptctl.ts

CLI usage:
- List: npx tsx packages/prompts/scripts/promptctl.ts list
- Validate: npx tsx packages/prompts/scripts/promptctl.ts validate
- Render: npx tsx packages/prompts/scripts/promptctl.ts render disclosure.ner context_hint="..."
- Bump: npx tsx packages/prompts/scripts/promptctl.ts bump disclosure.ner minor

---

## Turn 9 — User
**Message:**  
“Can you spin up additional agents?”

---

## Turn 10 — Assistant
**Message:**  
Clarified options and proposed safe scaffolds:
- Validation, Synthesis, and Monitoring workers in Python (apps/disclosure-rag/agents)
- Optional mirrored Node workers
- Options for queue, HTTP, or CLI orchestration

---

## Turn 11 — User
**Message:**  
“Nevermind. That’s not what I meant. Let’s come up with a clean-up plan for all the prompts in ../../packages/prompts.”

---

## Turn 12 — Assistant
**Message:**  
Proposed a focused cleanup plan:

1) Prepare a safe workspace (git worktree)  
2) Inventory & audit (list registered prompts vs. files; run validator)  
3) Standardize conventions (IDs, filenames, versions, variables, runtime, schemas, tags/owner)  
4) Fix registry & YAML files (ensure schema_ref, variables, runtime; add aliases for legacy IDs)  
5) Validate & format (promptctl validate; prettier on YAML)  
6) Migrate call sites (switch to namespaced IDs; rely on aliases)  
7) CI guardrails (add validator to PR checks; optional pre-commit)  
8) Document conventions (README updates)  
9) Deprecation window for aliases; remove after migration

Success criteria:
- 100% prompts validate  
- 0 unregistered templates; all have schema_ref  
- All IDs namespaced & versioned; variables/runtime present  
- Call sites resolve via loaders  
- CI validation in place

---

## Artifacts Created
- packages/prompts/registry.yaml  
- packages/prompts/sets/disclosure/ner.v1.yaml  
- packages/prompts/sets/disclosure/specialized-analysis.v1.yaml  
- packages/prompts/schemas/prompt.schema.json  
- packages/prompts/schemas/output/entity.schema.json  
- packages/prompts/schemas/output/analysis.schema.json  
- packages/prompts/scripts/promptctl.ts  
- apps/app/src/services/ai/prompts/yaml-loader.ts  
- packages/prompts/yaml_loader.py

## Notes
- Loaders support PROMPTS_DIR and prefer packages/prompts
- Aliases in registry.yaml preserve backward compatibility while migrating IDs
- Validator ensures prompt YAML and referenced output schemas exist
