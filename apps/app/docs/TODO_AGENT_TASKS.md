# @apps/app/ Agent Task List

**Date**: July 12, 2025 - 12:00 PM PST  
**Status**: Ready to implement fire-enrich agent orchestration patterns  
**Phase**: Building on excellent existing infrastructure

## **🎯 IMMEDIATE PRIORITY TASKS**

### **WEEK 1: Agent Foundation (Critical)**

#### **✅ COMPLETED - Excellent Work!**
- [x] Tool Interface Layer (100% complete)
- [x] Enhanced Tour Controller with spatial intelligence
- [x] Smart tour research bridge implementation
- [x] Universal tool architecture with 85+ task breakdown
- [x] Performance tracking and error handling

#### **🚨 HIGH PRIORITY - Week 1**

##### **Task 1.1: Create Base Agent Class**
**File**: `src/features/mindmap/agents/base-tour-agent.ts`
**Description**: Abstract base class that wraps your existing tool implementations
**Dependencies**: Your existing tool infrastructure (perfect as-is)

```typescript
export abstract class BaseTourAgent<TInput = unknown, TOutput = unknown> {
  // Integration with your existing systems
  protected tourController: ReturnType<typeof useEnhancedTourController>
  protected spatialIntelligence: ReturnType<typeof useSpatialGrouping>
  protected tourTools: ChronologicalTourTools // Your existing tools!
  
  abstract instructions(context: TourAgentContext<TInput>): string
  abstract tools(): TourTool[]
  async execute(context: TourAgentContext<TInput>): Promise<TOutput>
}
```

##### **Task 1.2: Implement Intent Analysis Agent**
**File**: `src/features/mindmap/agents/intent-analysis-agent.ts`
**Description**: First agent in the pipeline - analyzes user natural language intent
**Estimated Time**: 1-2 days

```typescript
export class IntentAnalysisAgent extends BaseTourAgent<string, IntentResult> {
  instructions(context: TourAgentContext<string>): string {
    return `Analyze user intent: "${context.input}". Determine optimal tour strategy...`
  }
  
  async execute(context: TourAgentContext<string>): Promise<IntentResult> {
    // Use OpenAI to analyze intent and return structured result
  }
}
```

##### **Task 1.3: Implement Navigation Agent**
**File**: `src/features/mindmap/agents/navigation-agent.ts`
**Description**: Uses your existing `navigate_historical_tour` tool
**Estimated Time**: 1 day

```typescript
export class NavigationAgent extends BaseTourAgent<IntentResult, NavigationResult> {
  async execute(context: TourAgentContext<IntentResult>): Promise<NavigationResult> {
    // Use your navigate_historical_tour tool implementation
    const result = await this.tourTools.navigate_historical_tour({
      direction: context.input.direction,
      target_period: context.input.target_period,
      narrative_focus: context.input.narrative_focus
    })
    
    return this.processNavigationResult(result, context)
  }
}
```

##### **Task 1.4: Add Zod Validation Schemas**
**File**: `src/features/mindmap/agents/schemas.ts`
**Description**: Type safety for all agent inputs/outputs
**Estimated Time**: 1 day

```typescript
export const IntentResultSchema = z.object({
  userIntent: z.string(),
  tourStrategy: z.enum(['chronological', 'thematic', 'entity-focused']),
  targetPeriod: z.string().optional(),
  narrativeFocus: z.string().optional(),
  complexity: z.enum(['overview', 'detailed', 'comprehensive'])
})

export const NavigationResultSchema = z.object({
  waypointReached: TourWaypointSchema,
  spatialGroupsCreated: z.array(SpatialGroupSchema),
  enhancementLevel: EnhancementLevelSchema,
  suggestedNextActions: z.array(z.string())
})
```

### **WEEK 2: Orchestration Engine (High Priority)**

##### **Task 2.1: Create Tour Orchestrator**
**File**: `src/features/mindmap/agents/tour-orchestrator.ts`
**Description**: Sequential agent execution with context passing
**Dependencies**: Completed Week 1 tasks

```typescript
export class TourAgentOrchestrator {
  async executeAgenticTour(
    userIntent: string,
    currentContext: TourAgentContext
  ): Promise<TourResult> {
    // Phase 1: Intent Analysis
    const intentResult = await this.intentAgent.execute(...)
    
    // Phase 2: Navigation (uses your tools)
    const navResult = await this.navigationAgent.execute(...)
    
    // Phase 3: Discovery (uses your tools)
    const discoveryResult = await this.discoveryAgent.execute(...)
    
    // Continue with remaining phases...
  }
}
```

##### **Task 2.2: Implement Remaining Agents**
**Files**: 
- `src/features/mindmap/agents/discovery-agent.ts`
- `src/features/mindmap/agents/spatial-intelligence-agent.ts`
- `src/features/mindmap/agents/narrative-bridge-agent.ts`

**Description**: Each agent uses your existing tool implementations

##### **Task 2.3: Create Agent Decision Engine**
**File**: `src/features/mindmap/agents/agent-decision-engine.ts`
**Description**: Dynamic next action determination based on user context

```typescript
export class AgentDecisionEngine {
  async determineNextExploration(currentState: TourAgentContext): Promise<AgentAction>
  async analyzeUserEngagement(currentState: TourAgentContext): Promise<UserContext>
  async synthesizeNextAction(context: any): Promise<AgentAction>
}
```

### **WEEK 3: Enhanced Integration (Medium Priority)**

##### **Task 3.1: React Integration Hook**
**File**: `src/features/mindmap/agents/use-agentic-tour.ts`
**Description**: React hook that wraps the orchestrator

```typescript
export function useAgenticTour() {
  const [state, setState] = useState<AgenticTourState>()
  const orchestrator = useRef(new TourAgentOrchestrator(...))
  
  const executeAgenticCommand = useCallback(async (userIntent: string) => {
    const result = await orchestrator.current.executeAgenticTour(userIntent, state)
    setState(result.newState)
    return result
  }, [state])
  
  return { executeAgenticCommand, state, isProcessing }
}
```

##### **Task 3.2: Performance Optimization**
**File**: `src/features/mindmap/agents/performance-optimizer.ts`
**Description**: Parallel execution where possible, intelligent caching

##### **Task 3.3: Integration Testing**
**File**: `src/features/mindmap/agents/__tests__/orchestrator.test.ts`
**Description**: End-to-end testing of agent pipeline

## **📋 TASK CHECKLIST**

### **Week 1 Tasks**
- [ ] Task 1.1: Create BaseTourAgent abstract class
- [ ] Task 1.2: Implement IntentAnalysisAgent  
- [ ] Task 1.3: Implement NavigationAgent (uses your navigate_historical_tour)
- [ ] Task 1.4: Add Zod validation schemas
- [ ] Test: Verify single agent execution works

### **Week 2 Tasks**
- [ ] Task 2.1: Create TourAgentOrchestrator
- [ ] Task 2.2: Implement DiscoveryAgent (uses your discover_related_entities)
- [ ] Task 2.3: Implement SpatialIntelligenceAgent (uses your spatial_intelligence_query)
- [ ] Task 2.4: Implement NarrativeBridgeAgent (uses your create_narrative_bridge)
- [ ] Task 2.5: Create AgentDecisionEngine
- [ ] Test: Verify full agent pipeline works

### **Week 3 Tasks**
- [ ] Task 3.1: Create useAgenticTour React hook
- [ ] Task 3.2: Implement performance optimization
- [ ] Task 3.3: Create comprehensive test suite
- [ ] Task 3.4: Integrate with existing smart tour research bridge
- [ ] Test: Verify production readiness

## **🔧 TECHNICAL NOTES**

### **Integration Points with Your Existing Code**
```typescript
// Your existing tools become the foundation:
class NavigationAgent extends BaseTourAgent {
  constructor() {
    super('Navigation Agent', 'Handles tour navigation using spatial intelligence')
    // Your existing enhanced tour controller
    this.tourController = useEnhancedTourController()
    // Your existing tools
    this.tourTools = new ChronologicalTourTools(...)
  }
}
```

### **Key Dependencies (Your Excellent Work)**
- ✅ `use-enhanced-tour-controller.ts` - Spatial intelligence integration
- ✅ `tour-tools-implementation.ts` - All 5 core tools implemented
- ✅ `smart-tour-research-bridge.ts` - Cross-system AI insights
- ✅ `shared-ai-context.tsx` - Universal AI integration
- ✅ `use-smart-tour-integration.ts` - Smart hooks architecture

### **Success Criteria**
- **Natural Language Control**: "Show me how military attitudes evolved after Roswell"
- **Response Time**: <200ms for agent decisions
- **Backward Compatibility**: All existing manual controls preserved
- **Integration Stability**: Zero breaking changes

## **🚨 CRITICAL SUCCESS FACTORS**

1. **Build on Your Foundation** - Your tool implementations are excellent, use them as-is
2. **Sequential Context Passing** - Each agent enriches context for the next
3. **Type Safety** - Zod validation throughout the pipeline
4. **Performance** - Agent decisions must be responsive
5. **Backward Compatibility** - Manual controls always available as fallback

## **❓ QUESTIONS FOR REVIEW**

1. **Architecture Alignment**: Does the fire-enrich agent pattern align with your vision?
2. **Integration Approach**: Any concerns about layering agents on top of your existing tools?
3. **Timeline**: Does the 3-week timeline seem realistic?
4. **Priorities**: Any tasks you'd like to reorder or modify?

## **📞 COORDINATION**

- **Status Updates**: Weekly progress reports
- **Blockers**: Immediate escalation if any integration issues
- **Testing**: Collaborative testing of agent orchestration
- **Performance**: Joint optimization of agent decision speed

Your foundation is **outstanding** - we're just adding the intelligent decision-making layer that makes it truly agentic! 🚀