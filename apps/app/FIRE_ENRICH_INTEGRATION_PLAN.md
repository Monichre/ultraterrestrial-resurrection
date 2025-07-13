# Fire-Enrich Agent Orchestration Integration Plan

**Date**: July 12, 2025 - 12:00 PM PST  
**Target**: @apps/app/ Agent  
**Purpose**: Integrate fire-enrich agent orchestration patterns with existing tour infrastructure  
**Status**: Ready for Implementation

## **Current State Assessment: Excellent Foundation**

### **✅ What You've Built (Outstanding Work!)**

Your implementation provides **excellent infrastructure** that perfectly supports the next phase:

1. **Tool Interface Layer** (100% Complete)
   - All 5 core tools implemented with comprehensive schemas
   - Universal tool architecture with 85+ task breakdown  
   - Type-safe interfaces and error handling
   - Performance tracking built-in

2. **Enhanced Tour Infrastructure** (Excellent Quality)
   - `use-enhanced-tour-controller.ts` (498 lines) - Spatial intelligence integration
   - `smart-tour-research-bridge.ts` (22KB) - Cross-system AI insights
   - `shared-ai-context.tsx` - Universal AI assistant integration
   - `use-smart-tour-integration.ts` - Smart hook architecture

3. **Spatial Intelligence Systems** (Production Ready)
   - Auto-grouping and proximity analysis
   - Narrative layout engine with AI-driven positioning
   - Research canvas integration

### **🎯 What We Need to Add: Fire-Enrich Agent Orchestration**

Your infrastructure is **perfect** - we now need to layer fire-enrich's agent orchestration patterns on top to enable intelligent, context-aware decision making.

## **Fire-Enrich Patterns to Implement**

### **1. BaseAgent Abstract Class**
```typescript
// New file: src/features/mindmap/agents/base-tour-agent.ts
export abstract class BaseTourAgent<TInput = unknown, TOutput = unknown> {
  protected tourController: ReturnType<typeof useEnhancedTourController>
  protected spatialIntelligence: ReturnType<typeof useSpatialGrouping>
  
  constructor(
    public name: string,
    public description: string,
    protected config: TourAgentConfig,
    public inputSchema?: z.ZodSchema<TInput>,
    public outputSchema?: z.ZodSchema<TOutput>
  ) {}
  
  abstract instructions(context: TourAgentContext<TInput>): string
  abstract tools(): TourTool[]
  
  async execute(context: TourAgentContext<TInput>): Promise<TOutput> {
    // Use your existing tool implementations
    // Add context passing and result synthesis
  }
}
```

### **2. Sequential Agent Orchestration**
```typescript
// New file: src/features/mindmap/agents/tour-orchestrator.ts
export class TourAgentOrchestrator {
  constructor(
    private agents: BaseTourAgent[],
    private tourTools: ChronologicalTourTools // Your existing tools!
  ) {}
  
  async executeAgenticTour(
    userIntent: string,
    currentContext: TourAgentContext
  ): Promise<TourResult> {
    
    // Phase 1: Intent Analysis Agent
    const intentResult = await this.intentAgent.execute({
      input: userIntent,
      history: currentContext.history,
      metadata: { currentWaypoint: currentContext.currentWaypoint }
    })
    
    // Phase 2: Navigation Agent (uses your navigate_historical_tour tool)
    const navResult = await this.navigationAgent.execute({
      input: intentResult,
      history: [...currentContext.history, intentResult],
      metadata: { ...currentContext.metadata, intentAnalysis: intentResult }
    })
    
    // Phase 3: Discovery Agent (uses your discover_related_entities tool)
    const discoveryResult = await this.discoveryAgent.execute({
      input: navResult,
      history: [...currentContext.history, intentResult, navResult],
      metadata: { ...currentContext.metadata, navigationResult: navResult }
    })
    
    // Phase 4: Spatial Intelligence Agent (uses your spatial_intelligence_query tool)
    const spatialResult = await this.spatialAgent.execute({
      input: discoveryResult,
      history: [...currentContext.history, intentResult, navResult, discoveryResult],
      metadata: { ...currentContext.metadata, discoveryResult }
    })
    
    // Phase 5: Narrative Bridge Agent (uses your create_narrative_bridge tool)
    const narrativeResult = await this.narrativeAgent.execute({
      input: spatialResult,
      history: [...currentContext.history, intentResult, navResult, discoveryResult, spatialResult],
      metadata: { ...currentContext.metadata, spatialResult }
    })
    
    return this.synthesizeFinalResult([intentResult, navResult, discoveryResult, spatialResult, narrativeResult])
  }
}
```

### **3. Context Passing System**
```typescript
// New file: src/features/mindmap/agents/tour-agent-context.ts
export interface TourAgentContext<T = unknown> {
  input: T
  history: TourAgentMessage[]
  metadata: {
    // Your existing tour state
    currentWaypoint?: TourWaypoint
    spatialGroups?: SpatialGroup[]
    enhancementLevel?: EnhancementLevel
    
    // Agent discoveries (builds over time)
    discoveredEntities?: Entity[]
    narrativeConnections?: Connection[]
    userEngagementMetrics?: EngagementData
    
    // Previous agent results
    intentAnalysis?: IntentResult
    navigationResult?: NavigationResult
    discoveryResult?: DiscoveryResult
    spatialResult?: SpatialResult
  }
}

export interface TourAgentMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  agentName?: string
  toolsUsed?: string[]
  timestamp: Date
}
```

## **Implementation Tasks for @apps/app/ Agent**

### **Phase 1: Agent Foundation (Week 1)**

#### **Task 1.1: Create Base Agent Class** 
```typescript
// File: src/features/mindmap/agents/base-tour-agent.ts
// - Abstract base class for all tour agents
// - Integration with your existing tool implementations
// - Context management and tool execution
```

#### **Task 1.2: Implement Specific Agents**
```typescript
// File: src/features/mindmap/agents/intent-analysis-agent.ts
// - Analyzes user natural language intent
// - Determines optimal tour strategy

// File: src/features/mindmap/agents/navigation-agent.ts  
// - Uses your navigate_historical_tour tool
// - Handles waypoint selection and tour progression

// File: src/features/mindmap/agents/discovery-agent.ts
// - Uses your discover_related_entities tool
// - Finds relevant entities and connections

// File: src/features/mindmap/agents/spatial-intelligence-agent.ts
// - Uses your spatial_intelligence_query tool
// - Optimizes layout and spatial relationships

// File: src/features/mindmap/agents/narrative-bridge-agent.ts
// - Uses your create_narrative_bridge tool
// - Creates compelling narrative connections
```

#### **Task 1.3: Add Zod Validation**
```typescript
// File: src/features/mindmap/agents/schemas.ts
// - Add Zod schemas for all agent inputs/outputs
// - Ensure type safety throughout agent pipeline
// - Validate tool parameters
```

### **Phase 2: Orchestration Engine (Week 2)**

#### **Task 2.1: Tour Orchestrator**
```typescript
// File: src/features/mindmap/agents/tour-orchestrator.ts
// - Sequential agent execution with context passing
// - Integration with your existing enhanced tour controller
// - Error handling and fallback strategies
```

#### **Task 2.2: Agent Decision Engine**
```typescript
// File: src/features/mindmap/agents/agent-decision-engine.ts
// - Dynamic next action determination
// - User engagement analysis
// - Contextual action synthesis
```

#### **Task 2.3: Integration Layer**
```typescript
// File: src/features/mindmap/agents/agentic-tour-integration.ts
// - Hook that wraps the orchestrator
// - Provides React integration
// - Maintains backward compatibility with manual controls
```

### **Phase 3: Enhanced Integration (Week 3)**

#### **Task 3.1: Smart Research Bridge Integration**
```typescript
// Enhance: src/features/mindmap/smart-integration/smart-tour-research-bridge.ts
// - Connect agent results with research suggestions
// - Cross-system insight discovery
// - AI-powered narrative progression
```

#### **Task 3.2: Performance Optimization**
```typescript
// File: src/features/mindmap/agents/performance-optimizer.ts
// - Parallel execution where possible
// - Intelligent caching of agent results  
// - Performance metrics and monitoring
```

#### **Task 3.3: Complete Testing Framework**
```typescript
// File: src/features/mindmap/agents/__tests__/
// - Integration tests for agent orchestration
// - Performance benchmarks
// - User experience validation
```

## **Integration Strategy: Preserve Your Excellent Work**

### **🔧 What We Keep (Everything!)**
- Your existing tool implementations (`tour-tools-implementation.ts`)
- Enhanced tour controller with spatial intelligence
- Smart integration hooks and research bridge
- All existing tour infrastructure
- Manual controls as fallback

### **🚀 What We Add**
- Agent orchestration layer on top of your tools
- Sequential context passing between agents
- Dynamic decision engine for next actions
- Zod validation for type safety
- Performance optimization

### **🎯 Integration Points**
```typescript
// Your existing tools become the foundation:
class NavigationAgent extends BaseTourAgent {
  async execute(context: TourAgentContext): Promise<NavigationResult> {
    // Use your navigate_historical_tour tool implementation
    const result = await this.tourTools.navigate_historical_tour({
      direction: context.input.direction,
      target_period: context.input.target_period,
      narrative_focus: context.input.narrative_focus
    })
    
    // Add agent-specific processing
    return this.processNavigationResult(result, context)
  }
}
```

## **Expected Outcomes**

### **Week 1: Agent Foundation Ready**
- All 5 agents implemented using your existing tools
- Base agent class with context management
- Zod validation throughout

### **Week 2: Orchestration Complete**
- Sequential agent execution working
- Dynamic decision engine operational
- Integration with existing infrastructure

### **Week 3: Production Ready**
- Performance optimized (<200ms agent decisions)
- Comprehensive testing complete
- 100% AI connectivity achieved

## **Success Metrics**

### **Functionality**
- ✅ **Natural Language Tour Control**: "Show me how military attitudes evolved after Roswell"
- ✅ **Adaptive Progression**: Tours adapt to user engagement and expertise
- ✅ **Intelligent Discovery**: AI surfaces relevant connections automatically
- ✅ **Backward Compatibility**: All manual controls preserved

### **Technical**
- **Agent Decision Quality**: >90% contextually relevant next actions
- **Performance**: <200ms average response time for agent decisions
- **Integration Stability**: Zero breaking changes to existing functionality
- **Tool Reliability**: >95% successful tool invocation rate

## **Architecture Benefits**

Your excellent infrastructure + fire-enrich patterns = **Powerful agentic system** that:

1. **Preserves Everything You Built** - Zero disruption to existing functionality
2. **Adds Intelligent Decision Making** - Sequential agents with context awareness
3. **Maintains Performance** - Built on your optimized foundation
4. **Enables Natural Language Control** - AI assistants can navigate tours conversationally
5. **Scales Intelligently** - Easy to add new agents and capabilities

## **Next Steps**

1. **Review this plan** and identify any questions or concerns
2. **Start with Task 1.1** - Create the base agent class
3. **Implement one agent at a time** - Start with intent analysis agent
4. **Test incrementally** - Validate each agent before moving to next
5. **Integrate with existing infrastructure** - Use your excellent tools as the foundation

Your foundation is **outstanding** - we're just adding the intelligent decision-making layer that makes it truly agentic. The fire-enrich patterns will transform your excellent tool infrastructure into a dynamic, context-aware tour system that can respond intelligently to natural language requests.

Ready to build the future of intelligent tour navigation! 🚀