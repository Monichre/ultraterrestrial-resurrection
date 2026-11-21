# Disclosure RAG – Prompt Inventory

**Last Updated:** June 25th 2026  
**Canonical location:** [`packages/prompts/`](../) with YAML registry in [`registry.yaml`](../registry.yaml)

> **Note:** Prompts were migrated from `apps/disclosure-rag/prompts/` to `packages/prompts/` (September 2025). Runtime prompts load via `registry.yaml` and `@repo/prompts`.

This document inventories prompt files in **`packages/prompts/`**. Legacy paths under `apps/disclosure-rag/prompts/` are empty/removed.

---

## 1. Agent Prompts

### A. Research Agent Prompts

#### [`research-lead-agent.md`](../apps/disclosure-rag/prompts/research-lead-agent.md) - Research Leadership System

**Purpose:** High-level research strategy, planning, delegation, and report writing
**Type:** Lead agent orchestration
**Content:**

- Expert research lead focused on strategy and delegation
- Follows structured process: Assessment → Query type determination → Research plan → Execution
- Manages 3 query types: Depth-first, Breadth-first, Straightforward
- Subagent count guidelines (1-20 agents max)
- Parallel tool execution patterns
- Integration with available internal tools (Slack, Asana, Github, etc.)

#### [`research-sub-agent.md`](../apps/disclosure-rag/prompts/research-sub-agent.md) - Research Subagent System  

**Purpose:** Individual research task execution
**Type:** Subagent implementation
**Content:**

- Research subagent working as part of team
- OODA loop execution (Observe, Orient, Decide, Act)
- Tool selection strategy for web search, internal docs, calculations
- Research budget management (5-15 tool calls)
- Source quality evaluation protocols
- Parallel tool call optimization

#### [`research-subagents.md`](../apps/disclosure-rag/prompts/research-subagents.md) - Multi-Agent Document Processing

**Purpose:** Sub-agent orchestration for document analysis
**Type:** Document processing workflow
**Content:**

- Claude 3.5 Sonnet system for PDF/CSV/MD ingestion
- Dynamic file processing with Haiku/Opus sub-agents
- Parallel document analysis with ThreadPoolExecutor
- Complete code template for agent orchestration
- Final consolidation with Opus for unified output

### B. Specialized Analysis Agents

#### [`specialized-agents.md`](../apps/disclosure-rag/prompts/specialized-agents.md) - Core Analysis Agent System

**Purpose:** Specialized UAP research agent definitions
**Type:** Multi-agent specialization
**Content:**

**1. Historical Analysis Agent**

- Temporal pattern analysis across UAP events
- Cross-era correlation detection
- Source reliability assessment
- Confidence levels and source attribution

**2. Evidence Analysis Agent**

- Multi-modal evidence assessment
- Chain of custody validation
- Physical trace analysis
- Authentication protocols

**3. Geospatial Analysis Agent**

- Geographical pattern analysis
- Activity cluster identification
- Terrain and installation correlation
- Movement pattern tracking

**4. Network Analysis Agent**

- Entity relationship mapping
- Information flow analysis
- Credibility network assessment
- Influence mapping

---

## 2. Content Analysis & Extraction

### A. Schema-Based Research

#### [`research_base_schema.md`](../apps/disclosure-rag/prompts/research_base_schema.md) - UAP Research Knowledge System Schema v2.0

**Purpose:** Core entity definitions and relationships
**Type:** Database schema documentation
**Content:**

- **Core Entity Types:** PERSON, EVENT, ORGANIZATION, LOCATION, ARTIFACT
- **Person attributes:** Labels, credentials, metrics, verification status
- **Event attributes:** Classifications, environmental conditions, phenomena
- **Organization types:** Agency, research group, military, civilian
- **Location data:** Coordinates, geohash, activity metrics
- **Artifact tracking:** Physical evidence, chain of custody, analysis status

#### [`research-prompt.md`](../apps/disclosure-rag/prompts/research-prompt.md) - Research Assistant System Prompt

**Purpose:** Core research methodology and database compliance
**Type:** Research workflow instructions
**Content:**

- AI research assistant for resource evaluation
- Structured database schema compliance
- Evidence documentation protocols
- Relationship mapping between entities
- Classification and verification standards
- Academic writing style requirements

#### [`extraction-prompt.md`](../apps/disclosure-rag/prompts/extraction-prompt.md) - Ultraterrestrial NER Extraction Engine

**Purpose:** Named Entity Recognition and structured data extraction
**Type:** NER processing system
**Content:**

- Advanced entity recognition for UFO phenomena and Disclosure topics
- 9 core entity types with priority fields
- Relationship mapping matrix with Mermaid diagrams
- Confidence framework (High 0.9-1.0, Medium 0.6-0.8, Low 0.3-0.5)
- Validation protocols with SQL snippets
- Vector similarity checking
- Sample JSON output structures

### B. Agent Methodology Documentation

#### [`AgenticResearchMethodology.md`](../apps/disclosure-rag/prompts/AgenticResearchMethodology.md) - Specialized AI Agent System

**Purpose:** Complete agent role definitions and collaboration workflows
**Type:** Multi-agent system architecture
**Content:**

**Core Agents (11 types):**

1. **Historical Timeline Analyst** - UFO events chronology
2. **Data Visualization Specialist** - UFO data visualization
3. **Claims & Evidence Evaluator** - Credibility assessment
4. **Research Network Mapper** - Relationship connections
5. **Documentation Librarian** - Document curation
6. **Geospatial Analysis Agent** - Location pattern analysis
7. **Theory Development & Analysis Agent** - Theoretical frameworks
8. **Organization & Key Figure Relationship Analyst** - Network analysis
9. **Testimony & Documentation Validator** - Evidence validation
10. **User Engagement & Content Curator** - Community management
11. **API & Data Integration Specialist** - System integration

**Workflow Patterns:**

- New Event Analysis Pipeline
- Theory Development Cycle
- User Content Integration
- Cross-functional collaboration scenarios
- Quality control checkpoints

### C. Response Structure Templates

#### [`ner-response-structure.prompt.ts`](../apps/disclosure-rag/prompts/ner-response-structure.prompt.ts) - NER Response Format Template

**Purpose:** Standardized output formatting for entity extraction
**Type:** TypeScript template
**Content:**

- Sample input/output examples for content analysis
- Applied research methodology content analysis format
- Personnel profiles with authority metrics
- Event documentation with precise location/timing
- Organization profiles and relationships
- Evidence documentation and testimonies
- Structured JSON-like output examples

---

## 3. Empty/Placeholder Files

#### [`entity_relationships.md`](../apps/disclosure-rag/prompts/entity_relationships.md)

**Status:** Empty file - placeholder for relationship documentation

---

## 4. Prompt File Organization by Category

### Research & Analysis

- [`research-lead-agent.md`](../apps/disclosure-rag/prompts/research-lead-agent.md) - Research orchestration
- [`research-sub-agent.md`](../apps/disclosure-rag/prompts/research-sub-agent.md) - Individual research tasks  
- [`research-subagents.md`](../apps/disclosure-rag/prompts/research-subagents.md) - Document processing workflow
- [`research-prompt.md`](../apps/disclosure-rag/prompts/research-prompt.md) - Core research methodology
- [`AgenticResearchMethodology.md`](../apps/disclosure-rag/prompts/AgenticResearchMethodology.md) - Complete agent system

### Entity Extraction & NER

- [`extraction-prompt.md`](../apps/disclosure-rag/prompts/extraction-prompt.md) - NER extraction engine
- [`ner-response-structure.prompt.ts`](../apps/disclosure-rag/prompts/ner-response-structure.prompt.ts) - Output formatting
- [`research_base_schema.md`](../apps/disclosure-rag/prompts/research_base_schema.md) - Database schema definitions

### Specialized Agents

- [`specialized-agents.md`](../apps/disclosure-rag/prompts/specialized-agents.md) - Four core analysis agents

### Placeholders

- [`entity_relationships.md`](../apps/disclosure-rag/prompts/entity_relationships.md) - Empty file

---

## 5. Integration Patterns

All prompts follow these patterns:

- **Schema Compliance:** Strict adherence to UAP research database schema
- **Confidence Scoring:** All outputs include confidence levels
- **Source Attribution:** Required citation and verification
- **Relationship Mapping:** Cross-entity connections maintained
- **Parallel Processing:** Multi-agent coordination supported
- **Quality Control:** Multi-stage validation protocols

---

## 6. Implementation Notes

### Code Integration

- Prompts are referenced in `/agents/` Python files
- TypeScript template supports frontend integration
- Schema definitions align with PostgreSQL database structure
- Response formats support vector embedding (1536d)

### Workflow Integration  

- Lead agent coordinates 1-20 subagents
- Parallel tool execution for efficiency
- OODA loop implementation for research tasks
- Quality control through cross-agent validation

---

## 7. Next Steps for Prompt Development

1. **Complete entity_relationships.md** - Add relationship documentation
2. **Expand specialized agents** - Add more domain-specific agents
3. **Create prompt testing framework** - Validate prompt effectiveness
4. **Add prompt versioning** - Track prompt evolution
5. **Integration testing** - Verify end-to-end prompt workflows

## 8. Summary

This comprehensive prompt inventory documents all 9 prompt files found in `apps/disclosure-rag/prompts/`. The system provides:

- **Multi-Agent Coordination:** Lead/sub-agent orchestration patterns
- **Specialized Analysis:** Four core analysis agents with specific expertise  
- **Schema-Driven Extraction:** NER system with confidence scoring
- **Document Processing:** Automated PDF/CSV/MD ingestion workflows
- **Quality Assurance:** Multi-stage validation and cross-referencing

All prompts are designed for integration with the UAP research database schema and support vector embedding for semantic search capabilities. The system scales from individual research tasks to complex multi-agent investigations.
