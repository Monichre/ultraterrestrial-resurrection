# RagNerDocumentProcessing — Pseudocode

**Created:** 2026-07-19T00:34:00-05:00  
**Scope:** Improve RAG, document-processing, and NER prompts under `methodology/` + `templates/` (sync live `sets/disclosure/` aliases).

---

## Goals

1. Align extraction/analysis prompts with domain vocabulary (Claim / Inference / Evidence / Key Figure / eight evidentiary states).
2. Make NER span-grounded and RAG-safe (no invented entities; provenance before prose).
3. Add missing RAG ingestion + grounded-answer templates.
4. Add methodology docs that prompt authors can cite (not runtime prompts themselves).
5. Keep wire schemas backward-compatible; extend with optional grounding fields.

---

## Pipeline (ingestion → retrieval)

```
FUNCTION process_document(source_text, provenance):
  doc_class ← render(document_classification, { content: source_text })
  chunks    ← render(rag_ingestion, {
                content: source_text,
                provenance: provenance,
                content_type: doc_class.type
              })
  FOR each chunk IN chunks:
    entities ← render(enhanced_ner | disclosure.ner, {
                  context_hint: provenance + chunk.heading
                })
    VALIDATE entities AGAINST validation template
    EMBED chunk.text  # code path; never embed agent Inference
    STORE chunk + entities with source_id, span quotes
  RETURN ingestion_manifest

FUNCTION answer_query(query, retrieved_chunks):
  rewritten ← optional query rewrite (inside rag_grounded_answer)
  answer ← render(rag_grounded_answer, {
              query: query,
              passages: retrieved_chunks  # Evidence only
            })
  # Ban: treating Inference as Evidence; overclaim verbs
  RETURN answer WITH citations to passage ids
```

---

## Prompt upgrade checklist

```
FOR each template IN [enhanced_ner, content_analysis, deep_research,
                      synthesis, validation, NEW rag_*, NEW document_classification]:
  ADD voice-contract rules (provenance, ambiguity, no closure without warrant)
  ADD Claim vs Inference separation
  ADD banned vocabulary (proves, confirmed as absolute)
  ADD JSON schema conformance instruction
  BUMP version
  KEEP max_tokens compact where possible; prefer structured bullets over essays

FOR each methodology doc IN [RAG_DOCUMENT_PROCESSING, NER_EXTRACTION_PROTOCOL]:
  WRITE researcher-facing protocol (no code as authority)
  CROSS-LINK Evidence Evaluation + Pre-Submission Methodology
  UPDATE methodology/README index

SYNC sets/disclosure/ner.v1.yaml ← templates/enhanced_ner.yaml (semantic parity)
SYNC sets/disclosure/specialized-analysis.v1.yaml ← templates/content_analysis.yaml
EXTEND schemas/output/*.json with optional span / evidentiary_state / aliases
REGISTER new template ids in registry.yaml
```

---

## Non-goals

- Training custom spaCy NER models
- Changing Postgres schema or embedding dimensions
- Building multi-agent orchestrator from legacy conductor specs
- Making agent_inferences retrievable (ADR-0001)
