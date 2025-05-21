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