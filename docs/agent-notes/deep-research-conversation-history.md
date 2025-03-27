# Modular Agentic Architecture for Advanced Research & Analysis

This document outlines a modular plan for implementing advanced research and analysis features in the Ultraterrestrial Resurrection project using agent orchestration.

## Feature Differentiation

### Key Differences

**Analyze:**
- Operates on internal data (nodes already in the mind map)
- Focuses on understanding relationships between selected elements
- Is contextual to what the user has already mapped
- Works with existing structured data in your database

**Deep Research:**
- Operates on external data (URLs, web content)
- Focuses on extracting new information and entities from sources
- Is acquisition-oriented (bringing new data into the system)
- Works with unstructured content that needs processing

### Recommended Approach

Rather than combining them, develop each feature with a clearer specialization:

1. **For Analyze:**
   - Make it exclusively triggered when nodes are selected
   - Focus on relationship discovery between entities
   - Show patterns, connections, and insights about the selected data
   - Present visual relationship maps or summaries of connections

2. **For Deep Research:**
   - Keep it as an input mechanism for external sources
   - Focus on comprehensive entity extraction and classification
   - Add an option to filter by specific entity types
   - Improve the results display to show entity relationships discovered

3. **For the Brain Toggle:**
   - Use as a memory/context control feature
   - Make it affect both features but in different ways:
     - For Analyze: Controls how much historical context affects analysis
     - For Deep Research: Controls depth of entity extraction

## Architecture Implementation

### 1. Core Agent Coordinator Module

```typescript
// src/services/agent-orchestration/coordinator.ts
export interface AgentCoordinatorOptions {
  agentTeam: Agent[];
  maxConcurrentAgents: number;
  contextMemory: boolean;
  debugMode?: boolean;
}

export class AgentCoordinator {
  constructor(options: AgentCoordinatorOptions) {
    // Initialize the agent coordinator
  }
  
  async dispatch(task: Task): Promise<AgentResult> {
    // Dispatch tasks to appropriate agents based on task type
  }
  
  async orchestrateMultiStepProcess(process: Process): Promise<ProcessResult> {
    // Handle multi-step processes with dependencies between agent outputs
  }
}
```

### 2. Specialized Agent Types

#### Analysis Agents

```typescript
// src/services/agent-orchestration/agents/analysis-agents.ts
export interface RelationshipAnalysisAgent extends Agent {
  analyzeConnections(entities: Entity[]): Promise<EntityRelationships>;
  identifyPatterns(data: EntityCollection): Promise<PatternResults>;
  generateInsights(relationships: EntityRelationships): Promise<InsightCollection>;
}

export interface ContextualAnalysisAgent extends Agent {
  integrateHistoricalContext(entities: Entity[]): Promise<EnhancedEntityData>;
  predictImplications(relationships: EntityRelationships): Promise<Implications>;
}
```

#### Research Agents

```typescript
// src/services/agent-orchestration/agents/research-agents.ts
export interface ContentExtractionAgent extends Agent {
  extractEntities(content: string): Promise<ExtractedEntities>;
  classifyContent(content: string): Promise<ClassificationResults>;
}

export interface ValidatingAgent extends Agent {
  validateSourceCredibility(source: Source): Promise<CredibilityAssessment>;
  crossReferenceInformation(data: ExtractedData, existingData: KnowledgeBase): Promise<CrossReferenceResults>;
}
```

### 3. Process Definitions with Agent Chaining

```typescript
// src/services/agent-orchestration/processes/deep-research-process.ts
export const deepResearchProcess: Process = {
  id: 'deep-research',
  description: 'Comprehensive extraction and analysis of entities from external content',
  steps: [
    {
      id: 'content-crawling',
      agentType: 'CrawlerAgent',
      inputs: ['url', 'depth', 'categories'],
      outputs: ['rawContent'],
    },
    {
      id: 'entity-extraction',
      agentType: 'ContentExtractionAgent',
      inputs: ['rawContent'],
      outputs: ['extractedEntities'],
      dependsOn: ['content-crawling'],
    },
    {
      id: 'validation',
      agentType: 'ValidatingAgent',
      inputs: ['extractedEntities', 'source'],
      outputs: ['validatedEntities'],
      dependsOn: ['entity-extraction'],
    },
    {
      id: 'relationship-mapping',
      agentType: 'RelationshipAnalysisAgent',
      inputs: ['validatedEntities'],
      outputs: ['entityRelationships'],
      dependsOn: ['validation'],
    },
    {
      id: 'integration',
      agentType: 'KnowledgeIntegrationAgent',
      inputs: ['validatedEntities', 'entityRelationships'],
      outputs: ['integratedKnowledge', 'suggestedAdditions'],
      dependsOn: ['relationship-mapping'],
    },
  ],
};
```

```typescript
// src/services/agent-orchestration/processes/analysis-process.ts
export const nodeAnalysisProcess: Process = {
  id: 'node-analysis',
  description: 'Analyze relationships and patterns between selected nodes',
  steps: [
    {
      id: 'data-retrieval',
      agentType: 'DataAccessAgent',
      inputs: ['nodeIds'],
      outputs: ['entityData'],
    },
    {
      id: 'relationship-analysis',
      agentType: 'RelationshipAnalysisAgent',
      inputs: ['entityData'],
      outputs: ['primaryRelationships'],
      dependsOn: ['data-retrieval'],
    },
    {
      id: 'pattern-detection',
      agentType: 'PatternDetectionAgent',
      inputs: ['entityData', 'primaryRelationships'],
      outputs: ['patterns'],
      dependsOn: ['relationship-analysis'],
    },
    {
      id: 'insight-generation',
      agentType: 'InsightGenerationAgent',
      inputs: ['patterns', 'entityData', 'primaryRelationships'],
      outputs: ['insights'],
      dependsOn: ['pattern-detection'],
    },
    {
      id: 'visualization-preparation',
      agentType: 'VisualizationAgent',
      inputs: ['entityData', 'primaryRelationships', 'patterns', 'insights'],
      outputs: ['visualizationData'],
      dependsOn: ['insight-generation'],
    },
  ],
};
```

### 4. UI Integration Components

#### Deep Research UI Module

```typescript
// src/features/deep-research/deep-research-panel.tsx
export const DeepResearchPanel: React.FC<DeepResearchProps> = ({ 
  url,
  onResearchComplete,
  options
}) => {
  const [researchStatus, setResearchStatus] = useState<ResearchStatus>('idle');
  const [researchResults, setResearchResults] = useState<DeepResearchResults | null>(null);
  
  // Handle initiating the research process
  const startResearch = async () => {
    setResearchStatus('processing');
    try {
      const coordinator = new AgentCoordinator({
        agentTeam: getResearchAgentTeam(),
        maxConcurrentAgents: 3,
        contextMemory: options.useContextMemory,
      });
      
      const results = await coordinator.orchestrateMultiStepProcess(deepResearchProcess);
      setResearchResults(results);
      onResearchComplete?.(results);
      setResearchStatus('completed');
    } catch (error) {
      setResearchStatus('error');
    }
  };
  
  // UI rendering for deep research panel
};
```

#### Analysis UI Module

```typescript
// src/features/analysis/node-analysis-panel.tsx
export const NodeAnalysisPanel: React.FC<NodeAnalysisProps> = ({
  selectedNodes,
  onAnalysisComplete,
  options
}) => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  
  // Handle initiating the analysis process
  const startAnalysis = async () => {
    setAnalysisStatus('processing');
    try {
      const coordinator = new AgentCoordinator({
        agentTeam: getAnalysisAgentTeam(),
        maxConcurrentAgents: 2,
        contextMemory: options.useContextMemory,
      });
      
      const results = await coordinator.orchestrateMultiStepProcess(nodeAnalysisProcess);
      setAnalysisResults(results);
      onAnalysisComplete?.(results);
      setAnalysisStatus('completed');
    } catch (error) {
      setAnalysisStatus('error');
    }
  };
  
  // UI rendering for analysis panel
};
```

## Implementation Plan

### Phase 1: Foundation (3 weeks)
- Implement basic AgentCoordinator class
- Create interfaces for all agent types
- Develop process definition schemas
- Build mock versions of key agents for testing

### Phase 2: Agent Development (4 weeks)
- Implement ContentExtractionAgent with Claude integration
- Create RelationshipAnalysisAgent with graph analysis capabilities
- Develop ValidatingAgent for cross-reference validation
- Build pattern detection and insight generation agents

### Phase 3: Process Orchestration (3 weeks)
- Implement deep research process with all agent steps
- Create analysis process with node relationship mapping
- Build visualization preparation system
- Develop context memory system for agents

### Phase 4: UI Integration (3 weeks)
- Integrate agent system with mind map UI
- Create deep research input and results panels
- Develop analysis visualization components
- Implement progress indicators and error handling

### Phase 5: Testing & Refinement (2 weeks)
- Performance testing and optimization
- UI/UX refinement
- Error handling improvements
- Documentation

This modular approach allows you to develop each agent independently while the coordinator manages their interaction, making it easier to add new capabilities or refine specific aspects of the system over time.