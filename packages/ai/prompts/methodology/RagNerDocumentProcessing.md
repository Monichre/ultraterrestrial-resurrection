# RagNerDocumentProcessing

**Last Updated:** 2026-07-19T00:45:00-05:00  
**Status:** Complete for prompt-layer upgrade  
**Scope:** `packages/ai/prompts/methodology/` + `templates/` (+ synced disclosure sets / schemas / registry)

---

## Summary

Upgraded the Ultraterrestrial prompt corpus for RAG, document processing, and NER so extraction and retrieval respect Claim / Inference / Evidence separation, span grounding, and ADR-0001 (agent inferences excluded from retrieval).

---

## Architecture

```
source document
    → document_classification   (triage)
    → rag_ingestion             (Evidence chunks + provenance)
    → disclosure.ner            (span-grounded entities)
    → validation                (safe_for_rag_index / safe_for_db_write)
    → embed chunk.text only
    → rag_grounded_answer       (citations + labeled Inferences)
```

Methodology docs define the human/agent protocol; YAML templates are the runtime prompt bodies; `registry.yaml` is the catalog.

---

## Key Modules

| Module | Path | Role |
|--------|------|------|
| RAG protocol | `methodology/RAG_DOCUMENT_PROCESSING.md` | Ingestion → retrieval hygiene |
| NER protocol | `methodology/NER_EXTRACTION_PROTOCOL.md` | Entity rules + domain mapping |
| Pseudocode | `methodology/RagNerDocumentProcessing_PSUEDOCODE.md` | Upgrade plan |
| NER template | `templates/enhanced_ner.yaml` | v2 span-grounded NER |
| Doc analysis | `templates/content_analysis.yaml` | Pre-NER document assessment |
| Chunking | `templates/rag_ingestion.yaml` | Embed-ready chunks |
| Grounded QA | `templates/rag_grounded_answer.yaml` | Citation-backed answers |
| Triage | `templates/document_classification.yaml` | Content-type gate |
| QC | `templates/validation.yaml` | Pre-index validation |
| Live NER set | `sets/disclosure/ner.v1.yaml` | Production alias target |
| Live analysis set | `sets/disclosure/specialized-analysis.v1.yaml` | Production alias target |
| Schemas | `schemas/*.json`, `schemas/output/*.json` | Optional span/state fields |

---

## Data Flow

1. **Inputs:** `source_text`, optional `provenance`, `context_hint`, `content_type`.  
2. **Structured outputs:** JSON per schema for NER/analysis; JSON/markdown for RAG helpers.  
3. **Side constraint:** Inference notes may be stored for humans but must not be embedded.  
4. **Wire compat:** `PERSONNEL` enum remains; prompts instruct KeyFigure mapping. `key_findings` remains required wire field but is redefined as source-grounded signals.

---

## Process Notes

- Templates that were `0.1.0` stubs (`deep_research`, `synthesis`, `validation`, `real_time_monitoring`) are now operational `1.0.0` prompts.
- `disclosure.ner` / `disclosure.content_analysis` bumped to `2.0.0` in registry.
- OpenMemory MCP unavailable this session; `openmemory.md` populated from local deep dive.

---

## Next Steps

- Wire `rag_ingestion` + `validation` into `apps/disclosure-rag` processing path.
- Optionally bump set filenames to `ner.v2.yaml` when consumers are ready (content already v2).
- Add golden-fixture evals for NER hallucination (coords / invented Key Figures).
