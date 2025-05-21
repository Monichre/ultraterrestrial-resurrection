# Disclosure RAG System

This is the Disclosure RAG (Retrieval-Augmented Generation) system, a specialized toolkit for UFO/UAP research and analysis.

## Features

- **Research Agent Framework**: Specialized AI agents for different research tasks
- **Content Analysis**: Tools for analyzing UFO/UAP-related documents
- **Knowledge Graph**: Entity extraction and relationship mapping
- **Chat Interfaces**: Multiple interfaces for interacting with the Disclosure Assistant
  - Local chat with knowledge base access
  - Agno Playground integration
  - File upload and analysis capabilities

## Recent Additions

The following components have been migrated from the disclosure-rag-recovered system:

- **Chat Interfaces**: 
  - `disclosure_chat.py`: Local chat interface with knowledge base browsing
  - `agno_disclosure_chat.py`: Agno Playground chat interface
  - `agno_disclosure_chat_with_files.py`: Extended Agno interface with file upload support
- **Automation**: `main.sh` script for common operations
- **Documentation**: Detailed usage guides in the `docs/` directory
- **NER Tools**: Enhanced named entity recognition and Xata integration

## Directory Structure

- `agents/`: Specialized AI research agents
- `analysis/`: Content analysis tools
- `docs/`: Documentation and research methodologies
- `ingestion/`: Data ingestion pipelines
- `lib/`: Shared libraries and utilities
- `processing/`: Document processing modules
- `research/`: Research prompts and workflows

## Usage

### Chat Interfaces

Three chat interfaces are available:

1. **Local Knowledge Base Chat**:
   ```
   python disclosure_chat.py
   ```

2. **Agno Chat**:
   ```
   python agno_disclosure_chat.py
   ```

3. **Agno Chat with File Upload**:
   ```
   python agno_disclosure_chat_with_files.py
   ```

### Automation Script

Use the main.sh script for common operations:

```
./main.sh setup       # Install dependencies
./main.sh process-url # Process a web article
./main.sh process-yt  # Process a YouTube video
./main.sh chat        # Launch the chat interface
```

## Documentation

See the `docs/` directory for detailed documentation:

- `README_DISCLOSURE_CHAT.md`: Local chat interface documentation
- `README_AGNO_CHAT.md`: Agno integration documentation
- `AgenticResearchMethodology.md`: Research agent methodology
- `entity_relationships.md`: Entity relationship model

## Requirements

See `requirements.txt` for a complete list of dependencies.

## Configuration

Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_api_key
ANTHROPIC_API_KEY=your_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
OPENAI_VECTOR_STORE_ID=your_vector_store_id
KNOWLEDGE_BASE_PATH=./knowledge
```



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