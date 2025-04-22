# Merge Plan Progress Log

Date: Tue Apr 22 15:42:10 CDT 2025
Run by: liamellis

## Context

This document records the investigative and planning steps for potentially merging:

- /apps/agent-ui/back-end/playground.py (Agent UI, Agno-based backend, connects with UI)
- /apps/disclosure-rag/ (Substantially developed Disclosure-RAG backend, historically used PHI, now moving to Agno)

---

## Step 1: Architecture, Features, Core Differences

### Agent-UI Backend (playground.py)

- Purpose: Minimal backend serving Agent UI frontend via an Agno-based agent playground.
- Tech/Deps: Python, Agno (from agno.agent ... from agno.models.openai ...).
- Agents: Web agent (uses DuckDuckGoTools), Finance agent (uses YFinanceTools). Both connect to OpenAIChat, store sessions in SQLite (tmp/agents.db, via SqliteStorage).
- Interface: Instantiates Playground app with these two agents.
- Minimalism: Highly focused/demo/experimental; no custom data ingestion, retrieval, or advanced agent pipelines.

### Disclosure-RAG (/apps/disclosure-rag)

- Purpose: Heavyweight agentic backend with:
  - Data ingestion modules (news feeds, social, RSS)
  - Advanced entity recognition, topic classification, knowledge base, RAG, LLM integrations.
- **Tech/Deps:** Python, PHI (old), partial Agno transition planned, Streamlit, SQL dbs, spacy, transformers, proprietary ingestion/analysis code.
- **Agents:** Multiple, including research, entity extraction, local RAG, knowledge graph, crew/teams.
- **API/UI:** Not designed around Agno Playground, but as a set of long-running services, endpoints, and possibly Streamlit UI.
- **Data:** References to `/packages/knowledge-base`, `/transcripts`, `/case_files`, PDFs, markdown, reports.
- **Legacy PHI:** Many scripts import PHI, e.g., `from phi.assistant ... from phi.knowledge ...` in research modules.
- **Configuration:** `.env`, credentials for several LLM and vector DB services.
- **Features:** More complete ingestion pipeline, richer analysis/processing, and multi-agent orchestration.

---

## Step 2: Dependency and API Inventory (PHI → Agno, Interop)

### PHI/Agno Findings

- Agent-UI Backend: All agent code is Agno native.
- Disclosure-RAG: Many core modules use PHI, not yet Agno (phi.assistant, phi.llm.openai, phi.knowledge, etc. in research/workflow.py, also in docs, NER, entity analysis, vector search).
- Migration Target: Refactor all PHI references to Agno counterparts (reviewing Agno and existing agent-ui playground.py for equivalents).

### API Surface/Endpoints

- Agent-UI Frontend expects endpoints like:
  - `/v1/playground/agents` (list agents),
  - `/v1/playground/agents/{agent_id}/runs` (run agent),
  - `/v1/playground/status`
  - `/v1/playground/agents/{agent_id}/sessions`.
- Disclosure-RAG does not (natively) expose these endpoints; its API (if present) is more research/Streamlit oriented; would need interface mapping or refactoring for compatibility.

### Backend Storage & Data

- Agent-UI: Simple SQLite database for agent state/history.
- Disclosure-RAG: Postgres, knowledge base dirs, vector storage (PgVector), PDF/document KB, more advanced data model.

### Other Findings

- Config: Disclosure-RAG .env is large, with several "dead" or legacy keys (PHI), and data paths tightly coupled to knowledge base/package structure.
- Docs: Disclosure-RAG's docs include architecture diagrams (see docs/phidata-agentic-architecture.md) describing PHI-based flows, with some candidate migration targets to Agno.

---

## Next Steps (from PLAN)

1. Refactor all PHI usage in Disclosure-RAG to Agno, using agent-ui as reference for working import paths.
2. Inventory and merge any playground-specific features/endpoints needed for UI, either into disclosure-rag or as a join layer.
3. Ensure merged backend exposes all endpoints/behavior needed for Agent-UI frontend to work seamlessly.
4. Incrementally test and port advanced ingestion/processing capabilities once Agno foundation is stable.
5. Adjust configs, update docs, thoroughly test merged stack.

---

This log will continue as steps progress.
