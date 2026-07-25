# AI data engineering audit — index

**Plan:** [ai-data-audit plan](../../.cursor/plans/ai-data-audit_57824186.plan.md) (read-only reference; do not edit)

## Deliverables

| Artifact | Description |
|----------|-------------|
| [AiDataEngineeringAudit.md](./AiDataEngineeringAudit.md) | Synthesis narrative (sections 1–10) |
| [AiDataEngineeringXataReplacementAudit.md](./AiDataEngineeringXataReplacementAudit.md) | Xata call sites, consumers, migration strategies |
| [AiDataEngineeringAudit_PSEUDOCODE.md](./AiDataEngineeringAudit_PSEUDOCODE.md) | Verification pseudocode |
| [IMPORT_DATAFLOW_INVENTORY.md](./IMPORT_DATAFLOW_INVENTORY.md) | Scripts, env vars, disclosure-rag vs knowledge-base vs app paths |
| [FINDINGS_DATABASE_ARCHITECT.md](./FINDINGS_DATABASE_ARCHITECT.md) | `@db` / Xata layer (subagent) |
| [FINDINGS_AI_ML.md](./FINDINGS_AI_ML.md) | Disclosure RAG, vectors, weights |
| [FINDINGS_DISCLOSURE_RAG.md](./FINDINGS_DISCLOSURE_RAG.md) | RAG orchestrator stages |
| [FINDINGS_APP_AGENTIC_UX.md](./FINDINGS_APP_AGENTIC_UX.md) | Research canvas, mindmap agent, chat routes |

## Visual explainers (HTML)

| File | Topic |
|------|--------|
| [VISUAL_PACKAGES_DB.html](./VISUAL_PACKAGES_DB.html) | `packages/db` call graph |
| [VISUAL_DISCLOSURE_RAG.html](./VISUAL_DISCLOSURE_RAG.html) | `apps/disclosure-rag` pipeline |
| [VISUAL_KNOWLEDGE_BASE.html](./VISUAL_KNOWLEDGE_BASE.html) | Static corpus vs runtime retrieval |
| [VISUAL_XATA_REPLACEMENT_MAP.html](./VISUAL_XATA_REPLACEMENT_MAP.html) | Replacement strategies |
| [VISUAL_APP_AGENTIC_UX.html](./VISUAL_APP_AGENTIC_UX.html) | Live agentic UX path |

## Subagent runs

- **database-architect** + **ai-ml** — completed (findings in `FINDINGS_*.md`)
- **frontend-agent-ux-audit** — content in `FINDINGS_APP_AGENTIC_UX.md` + manual skill review (subagent Task failed on missing prompt)

## Sensitive items

- Redact **Upstash token** in any published material (`apps/disclosure-rag/lib/upstash/vector.py` had a hardcoded token — do not copy into external docs).