# RagPromptPipeline — Pseudocode

**Created:** 2026-07-19T00:40:00-05:00  
**Scope:** Wire `packages/ai/prompts` RAG/NER templates into `apps/disclosure-rag` processing.

---

## Path fix

```
FUNCTION resolve_prompts_dir():
  IF env PROMPTS_DIR set → use it
  ELSE prefer packages/ai/prompts
  ELSE fallback packages/prompts (legacy)
  ELSE ascend parents looking for either
```

Update:

- `packages/ai/prompts/yaml_loader.py`
- `apps/disclosure-rag/lib/prompt_loader.py`

---

## Pipeline

```
FUNCTION process_document_for_rag(source_text, provenance, filename_hint):
  # Stage 1 — triage
  classification ← llm_json(document_classification, {
    source_text, filename_hint
  })

  IF classification.ingestion_recommendation == "reject":
    RETURN { status: "rejected", classification }

  # Stage 2 — structured content analysis
  analysis ← llm_json(disclosure.content_analysis, {
    content_type: classification.content_type,
    source_text,
    context_hint: provenance
  })

  # Stage 3 — chunk plan (Evidence only)
  ingestion ← llm_json(rag_ingestion, {
    source_text,
    provenance,
    content_type: classification.content_type,
    target_chunk_tokens: "512"
  })
  chunks ← filter(ingestion.chunks WHERE text non-empty AND NOT do_not_embed_reasons)

  # Stage 4 — NER per chunk (cap N for cost)
  entities_by_chunk ← []
  FOR chunk IN chunks[:MAX_NER_CHUNKS]:
    ner ← llm_json(disclosure.ner, {
      source_text: chunk.text,
      context_hint: provenance + chunk.heading_path
    })
    qa ← llm_json(validation, {
      target: json(ner),
      source_excerpt: chunk.text[:2000],
      schema_name: "entity"
    })
    entities_by_chunk.append({ chunk_id, ner, qa })

  # Stage 5 — index eligibility
  safe_chunks ← chunks WHERE corresponding qa.safe_for_rag_index != false
  # (if no qa, default allow with warning)

  RETURN {
    status: "ok"|"hold",
    classification,
    analysis,
    ingestion,
    chunks: safe_chunks,
    ner_results: entities_by_chunk,
    embeddable_texts: [c.text for c in safe_chunks],  # Evidence only
    metadata: provenance + priority + integrity_flags
  }
```

---

## Integration points

```
ContentAnalysisEngine.analyze_content(text):
  # keep legacy string summary for YouTube/web summary files
  ALSO expose process_for_rag(text, provenance=...) → structured dict

WebContentProcessor / KnowledgeBaseService:
  AFTER fetch content:
    result ← engine.process_for_rag(content, provenance=url)
    WRITE rag_pipeline.json next to content/summary
    IF result.status ok:
      USE result.embeddable_texts for vector upload paths when present

cocoindex_flows.get_ner_extraction_instruction:
  continues via get_prompt("disclosure.ner") after path fix
```

---

## Non-goals

- Changing embedding model / dim
- Writing agent Inference into vector stores
- Full rewrite of EnhancedContentAnalysisEngine multi-model consensus
