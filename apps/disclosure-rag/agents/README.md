# Disclosure RAG - Agent System

## Agent Organization

Agents are organized into three primary categories:

### 1. Extraction Agents

*Located in `agents/extraction/`*

- Convert raw inputs (text, files, media) into structured artifacts
- Focus on entity extraction, not reasoning
- Examples: `EntityExtractionAgent`

### 2. Analysis Agents

*Located in `agents/analysis/`*

- Perform reasoning, correlation, verification, and visualization
- Answer questions, build graphs, search external sources
- Examples: `ContentAnalysisAgent`, `KnowledgeGraphAssistant`, `LocalRAGAssistant`, `OracleAssistant`, `DisclosureAssistant`

### 3. Orchestration

*Located in `agents/orchestration/`*

- Coordinate multiple agents to accomplish complex tasks
- Manage workflows and pipelines
- Examples: `ContentAnalysisEngine`, `ResearchCrew`

## Agent Catalog

- **ContentAnalysisAgent** (`content_analysis_agent.py`): Multi-model research analysis agent that produces structured findings. Supports OpenAI Assistants (threads/runs) and optional file search/vector stores.
- **DisclosureAssistant** (`disclosure_assistant.py`): Wrapper for OpenAI Assistants specialized in disclosure analysis. Provides `analyze_content` and `cross_reference_analysis`; helpers `analyze_disclosure_content` and `cross_reference_disclosure_analysis`.
- **EntityExtractionAgent** (`entity_extraction_agent.py`): Extracts topics, personnel, events, organizations, locations, artifacts, sightings, and relationships as structured output. Includes `AIEntityExtractor` and embedding generation utilities. Note: the legacy `XataSearchTool` is dead — Xata is retired and the guarded import degrades to a stub returning `{"error": "XATA search not configured"}`. Platform DB lookups go through Neon via `@db/postgres`.
- **ClaimsEvidenceAgent** (`claims_evidence_agent.py`): Evidence assessment and authentication (chain of custody, provenance, technical validation). Factory: `create_claims_evidence_agent()`; convenience: `create_evidence_agent()`.
- **HistoricalTimelineAgent** (`historical_timeline_agent.py`): Timeline reconstruction and historical pattern analysis. Factory: `make_historical_timeline_agent()`.
- **Historical Timeline Analyst** (`historical_agent.py`): Alternative historical agent. Factory: `create_historical_agent()`.
- **GeospatialAgent** (`geospatial_agent.py`): Spatial pattern analysis, hotspot/cluster identification, movement tracking. Factory: `create_geospatial_agent()`.
- **ResearchNetworkAgent** (`network_agent.py`): Entity relationship mapping, information flow, and influence analysis. Factory: `create_network_agent()`.
- **DocumentationLibrarianAgent** (`documentation_agent.py`): Document organization, metadata enrichment, cross-referencing. Factory: `create_documentation_agent()`.
- **DataVizAgent** (`dataviz_agent.py`): Visualization recommendations and schemas for complex datasets and 3D/geospatial views. Factory: `create_dataviz_agent()`.
- **TheoryDevAgent** (`theory_agent.py`): Theory evaluation and development with structured methodology. Factory: `create_theory_agent()`.
- **TestimonyValidatorAgent** (`testimony_agent.py`): Witness/testimony validation and documentation authenticity checks. Factory: `create_testimony_agent()`.
- **ApiIntegrationAgent** (`api_integration_agent.py`): Data integration and API management (schema validation, deduplication, lineage). Factory: `create_api_integration_agent()`.
- **ResearchCrew** (`research_crew.py`): Orchestrator that instantiates and coordinates multiple agents; includes a playground app.

Support modules:

- `base.py`: Shared `create_agent(...)`, model constants, and common tools.
- `prompts.py`: Centralized prompts and agent configuration mapping.
- `__init__.py`: Aggregates exports and exposes `AGENT_FACTORIES` for dynamic creation.

## Research Crew Refactoring

The `research_crew.py` file defines specialized agents (HA, CE, GV, etc.) inline. We are progressively extracting these into individual modules in the `orchestration/research_crew/specialized/` directory.

Progress:

- [x] Created directory structure
- [x] Created `historical_timeline_agent.py` as a template
- [ ] Extract other agent definitions
- [ ] Update `crew.py` to use the extracted modules

## Documentation

Comprehensive documentation for all agents is available in:

- `packages/docs/architecture/ExtractionAgents.md`
- `packages/docs/architecture/AnalysisAgents.md`
- `packages/docs/architecture/ResearchCrew.md`
