# AI data engineering audit — pseudocode

Companion to the main audit narrative. Maps plan sections to verification steps.

## Section 1 — Executive summary

```
LOAD plan_section_1()
VERIFY claims in synthesis doc against FINDINGS_* and live code paths
```

## Section 2 — Database architecture

```
FOR each table IN schema:
  TRACE packages/db/xata-to-xyflow.ts loaders
  TRACE packages/db/xata-typescript-sdk
  DOCUMENT FK coverage and index usage
OUTPUT: update FINDINGS_DATABASE_ARCHITECT.md if gaps found
```

## Section 3 — AI/ML architecture

```
TRACE apps/disclosure-rag/lib/unified_rag_orchestrator.py
TRACE lib/upstash/vector.py, lib/storage/pgvector_library.py
VERIFY no hardcoded secrets in published docs
COMPARE weights (40/40/20) — document in FINDINGS_DISCLOSURE_RAG.md only
```

## Section 4 — Disclosure RAG pipeline

```
RUN disclosure-rag CLI ingest --dry-run (if safe) OR read orchestrator code only
MAP stages: ingest → vectorize → store (Upstash/pgvector/OpenAI)
OUTPUT: confirm FINDINGS_DISCLOSURE_RAG.md stage table matches code
```

## Section 5 — Import / dataflow inventory

```
FOR each row IN IMPORT_DATAFLOW_INVENTORY.md:
  CONFIRM source file path exists OR mark NOT FOUND
  CONFIRM target table/collection named
GENERATE mermaid for top flows (already in IMPORT_DATAFLOW_INVENTORY)
```

## Section 6 — App agentic UX

```
TRACE (site)/research-canvas → MindMap → useMindMapAgent → /api/disclosure/mindmap
TRACE bottom menu → /api/disclosure/chat
LIST AgentToolEvent types and handlers
COMPARE EntityAdditionProgress, citations, context budget vs skill checklists
OUTPUT: FINDINGS_APP_AGENTIC_UX.md + gap list
```

## Section 7 — Knowledge-base package

```
ASSERT runtime search does NOT read packages/knowledge-base/sources directly
DOCUMENT path: disclosure-rag ingest/search only
OUTPUT: one paragraph in synthesis on corpus vs runtime
```

## Section 8 — Cross-cutting Xata replacement

```
GREP repo for: askXata, searchXata, askXataWithAi, hydrateGraphFromXata, XATA_
BUILD consumer matrix (table in XataReplacementAudit.md)
MARK each consumer: migrated | adapter | blocked
```

## Section 9 — Synthesis document

```
MERGE:
  FINDINGS_DATABASE_ARCHITECT.md
  FINDINGS_AI_ML.md
  FINDINGS_DISCLOSURE_RAG.md
  FINDINGS_APP_AGENTIC_UX.md (from section 6)
  IMPORT_DATAFLOW_INVENTORY.md (summary + link)
  AiDataEngineeringXataReplacementAudit.md
  AiDataEngineeringAudit_PSEUDOCODE.md
  All HTML visuals in docs/architecture/ai-data-engineering-audit/
OUTPUT: AiDataEngineeringAudit.md (single narrative)
RULE: do not paste raw subagent UX audit verbatim — synthesize only
```

## Section 10 — Verification

```
FOR each HTML visual:
  OPEN file, verify mermaid/text matches cited paths
FOR each diagram in synthesis:
  CONFIRM nodes match real file paths (spot-check 3–5 paths per diagram)
REDACT: Upstash token, any live secrets in published HTML
OUTPUT: verification checklist appended to audit doc
```

## Completion

```
MARK plan todos:
  visual-explainers — completed (partial: kb + xata map + app UX HTML; synthesis pending)
  synthesis-doc — pending (blocked on user rule: no raw subagent paste)
  verification-review — pending
UPDATE 00_INDEX.md with links to all deliverables
```