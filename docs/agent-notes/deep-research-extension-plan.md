# Deep Research Feature Extension Plan

## Current Implementation Analysis

The current deep-research feature consists of:

- A structured system in `firecrawl.ts` with detailed categorization:
  - Research depth levels (SURFACE, MODERATE, DEEP, COMPREHENSIVE)
  - 9 specialized research categories (SIGHTINGS, TESTIMONIES, etc.)
  - Support for recursive link crawling with configurable depth

- Well-designed API endpoints in `/api/disclosure/data-layer/scrape/`:
  - Single URL processing
  - Batch processing capabilities
  - Category-specific extraction

- Integration with the knowledge processing layer:
  - Content summarization with Claude
  - Vector embedding generation
  - Database integration via Xata

## Enhanced Deep Research Feature Extension Plan

### 1. Structured Entity Extraction Pipeline

- Create a dedicated entity extraction module:
  ```typescript
  // src/services/knowledge-layer/entity-extraction.ts
  export interface EntityExtractionResult {
    topics: TopicEntity[];
    personnel: PersonnelEntity[];
    events: EventEntity[];
    organizations: OrganizationEntity[];
    testimonies: TestimonyEntity[];
    artifacts: ArtifactEntity[];
    sightings: SightingEntity[];
    documents: DocumentEntity[];
    confidenceScore: number;
  }
  ```

- Implement specialized extractors for each entity type using Claude's capabilities:
  ```typescript
  // src/services/knowledge-layer/extractors/
  export const extractTopics = async (content: string): Promise<TopicEntity[]> => {
    const extraction = await getClaudeSummary({
      system: TOPIC_EXTRACTION_PROMPT,
      content,
      prompt: "Extract all topics from this content following the database schema"
    });
    return parseTopicEntities(extraction);
  };
  ```

### 2. Agent-Based Analysis Framework

- Develop a coordinator to orchestrate specialized agents:
  ```typescript
  // src/services/knowledge-layer/agent-coordinator.ts
  export const analyzeWithAgents = async (
    content: string,
    options: AgentOptions
  ): Promise<AgentAnalysisResult> => {
    // Run appropriate agents based on content and categories
    const agentTasks = [
      runHistoricalAnalysisAgent(content, options),
      runEvidenceAnalysisAgent(content, options),
      runGeospatialAnalysisAgent(content, options),
      runNetworkAnalysisAgent(content, options)
    ];
    
    const agentResults = await Promise.allSettled(agentTasks);
    
    // Consolidate and cross-validate findings
    return consolidateAgentFindings(agentResults);
  };
  ```

### 3. Enhanced Knowledge Processing

- Update the `processResource` function to incorporate the new entity extraction:
  ```typescript
  // Updated processResource function
  export const processResource = async (
    resourceUrl: string,
    options: ResourceProcessingOptions = {},
  ) => {
    // Existing deep research logic...
    
    // Enhanced processing pipeline
    const markdownContent = extractMarkdownContent(pageContent, useDeepResearch);
    
    // Extract structured entities
    const entities = await extractEntities(markdownContent, categories);
    
    // Analyze with specialized agents
    const agentAnalysis = await analyzeWithAgents(markdownContent, {
      categories,
      researchDepth,
      extractionModel
    });
    
    // Generate entity relationship graph
    const relationshipGraph = buildRelationshipGraph(entities, agentAnalysis);
    
    // Generate embeddings for vector search
    const embedding = await generateEmbeddings(JSON.stringify({
      summary: entities.summary,
      entities: entities,
      analysis: agentAnalysis
    }));
    
    // Database integration
    const databaseResult = await integrateWithDatabase(entities, relationshipGraph, updateExisting);
    
    return {
      url: resourceUrl,
      entities,
      analysis: agentAnalysis,
      relationshipGraph,
      embedding,
      databaseResult,
      rawData: pageContent
    };
  };
  ```

### 4. Advanced API Endpoints

- Create new API routes for the enhanced capabilities:
  ```typescript
  // src/app/api/disclosure/data-layer/knowledge-graph/route.ts
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { urls, categories, depth } = KnowledgeGraphSchema.parse(body);
      
      // Generate knowledge graph from provided URLs
      const graphResults = await generateKnowledgeGraph(urls, {
        categories,
        researchDepth: depth,
        recursiveLinks: true
      });
      
      return NextResponse.json({
        success: true,
        results: graphResults
      });
    } catch (error) {
      // Error handling
    }
  }
  ```

### 5. Database Schema Extensions

- Add relationship models to better capture connections:
  ```typescript
  // src/db/xata/schema-extensions.ts
  export interface EntityRelationship {
    sourceId: string;
    sourceType: string;
    targetId: string;
    targetType: string;
    relationshipType: string;
    confidence: number;
    evidence: string[];
  }
  ```

### 6. Integration with Summarization

- Enhance the summarization prompts to work with the entity extraction:
  ```typescript
  export const ENTITY_AWARE_SUMMARIZE_PROMPT = `
  ${CLAUDE_SUMMARIZE_PROMPT}
  
  Additionally, identify all key relationships between entities according to the following pattern:
  
  ## Entity Relationships
  - [PERSON]-[ROLE_IN]->[EVENT] (e.g., "John Doe-[WITNESSED]->Phoenix Lights")
  - [EVENT]-[OCCURRED_AT]->[LOCATION] (e.g., "Phoenix Lights-[OCCURRED_AT]->Phoenix, Arizona")
  - [ORGANIZATION]-[INVESTIGATED]->[EVENT] (e.g., "MUFON-[INVESTIGATED]->Phoenix Lights")
  
  For each relationship, provide a confidence score (0.0-1.0) and the evidence supporting this relationship.
  `;
  ```

## Implementation Plan

### Phase 1: Core Entity Extraction (2 weeks)
- Develop entity extraction prompts for each schema type
- Create parser functions to convert Claude outputs to structured data
- Implement basic entity validation and deduplication
- Update processing pipeline to use new extractors

### Phase 2: Agent Framework (3 weeks)
- Implement agent coordinator and specialized agents
- Create agent communication protocols
- Develop analysis consolidation logic
- Add confidence scoring system for findings

### Phase 3: Knowledge Graph Generation (2 weeks)
- Build relationship mapping functions
- Create visualization data structures
- Implement graph querying capabilities
- Add vector embedding for graph nodes

### Phase 4: Database Integration (2 weeks)
- Update database schema for entity relationships
- Implement automated CRUD operations
- Add deduplication and entity merging logic
- Create bulk import capabilities

### Phase 5: API & UI Development (3 weeks)
- Develop new API endpoints
- Create research dashboard UI components
- Implement interactive visualization tools
- Add bulk research capabilities

### Phase 6: Testing & Optimization (2 weeks)
- Performance testing and optimization
- Edge case handling
- User acceptance testing
- Documentation

This plan leverages the existing infrastructure while adding structured entity extraction, agent-based analysis, and knowledge graph capabilities to create a comprehensive research system that aligns with the project's architectural approach and research methodology documentation.