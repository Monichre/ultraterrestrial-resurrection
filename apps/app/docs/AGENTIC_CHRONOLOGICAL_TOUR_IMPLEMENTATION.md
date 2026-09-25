# Agentic Chronological Tour Implementation

**Created**: July 12, 2025 - 09:45 AM PST  
**Last Updated**: July 12, 2025 - 09:45 AM PST  
**Task ID**: `agentic-tour-master`  
**Status**: Active - Phase 1 Planning  
**Estimated Duration**: 3-5 weeks  

## **Overview**

Transform the existing chronological tour system in `@apps/app/` to work agentically through AI assistant tool use, enabling natural language tour navigation while preserving all existing sophisticated infrastructure.

## **Acceptance Criteria**

✅ **Primary Goal**: AI assistants can control chronological tours through natural language and tool use  
✅ **User Experience**: Conversational tour navigation (*"Show me how military attitudes evolved after Roswell"*)  
✅ **Intelligence**: Adaptive progression based on user engagement and spatial intelligence  
✅ **Compatibility**: Preserve all existing tour infrastructure and manual controls  
✅ **Integration**: Seamless connection with research canvas and spatial systems  

## **Design Philosophy: Orchestration over Replacement**

The existing tour infrastructure is sophisticated with spatial intelligence, enhanced nodes, and contextual AI. Instead of rebuilding, create an **intelligent agent layer** that orchestrates existing components through tool use.

### **Current Infrastructure Assets**
- **Enhanced Tour Controller**: 498 lines of sophisticated spatial integration (`use-enhanced-tour-controller.ts`)
- **Historical Tour Navigation**: 865 lines of rich UI controls (`historical-tour-navigation.tsx`)
- **Spatial Intelligence**: Auto-grouping and proximity analysis
- **Contextual AI**: Smart search rules and relationship detection (`contextual-intelligence.ts`)
- **Research Bridge**: Smart tour-research integration system

## **Technical Requirements**

### **1. Tool Interface Layer**
- 5 core tools for AI assistant control
- Schema definitions for tool parameters
- Wrapper implementations around existing infrastructure
- Backward compatibility with manual controls

### **2. Agent Orchestration Engine**
- Adaptive tour state management
- Dynamic progression determination
- User engagement analysis
- Contextual action synthesis

### **3. Enhanced Intelligence Integration**
- Full integration with spatial intelligence system
- Narrative bridge creation capabilities
- Research canvas connectivity
- Performance optimization

## **Task Breakdown & Implementation Phases**

### **Phase 1: Tool Interface Layer** (1-2 weeks)
**Milestone**: AI assistants can invoke basic tour navigation tools

#### **Subtasks**:

**1. Define Tool Schemas**
```typescript
interface TourNavigationTools {
  navigate_historical_tour(params: {
    direction: "forward" | "backward" | "jump_to_period"
    target_period?: "early_sightings" | "cold_war" | "modern_research" | "disclosure_era"
    target_year?: number
    narrative_focus?: string
    depth_level?: "overview" | "detailed" | "comprehensive"
  }): Promise<TourResult>
  
  discover_related_entities(params: {
    current_context: string
    entity_types: ("personnel" | "events" | "organizations" | "documents")[]
    relationship_depth: 1 | 2 | 3
    temporal_window?: { years_before: number, years_after: number }
  }): Promise<EntityResult>
  
  analyze_temporal_context(params: {
    time_period: { start_year: number, end_year: number }
    analysis_type: "significance" | "connections" | "progression" | "gaps"
    focus_entities?: string[]
  }): Promise<ContextResult>
  
  create_narrative_bridge(params: {
    from_period: string
    to_period: string
    bridge_type: "causal" | "parallel" | "context" | "evolution"
    evidence_threshold: number
  }): Promise<NarrativeResult>
  
  spatial_intelligence_query(params: {
    query_type: "proximity" | "clustering" | "narrative_flow" | "temporal_alignment"
    target_entities?: string[]
    optimization_goal: "discovery" | "comprehension" | "narrative_flow"
  }): Promise<SpatialResult>
}
```

**2. Implement Tool Wrappers**
- Wrap `use-enhanced-tour-controller.ts` functionality with tool interfaces
- Integrate with existing spatial intelligence systems
- Maintain backward compatibility with manual controls
- Add comprehensive tool result formatting

**3. Basic Agent Integration**
- Simple agent class that can invoke tools in sequence
- Tool result processing and state updates
- Error handling and graceful fallback mechanisms
- Initial testing framework

### **Phase 2: Agent Orchestration** (2-3 weeks)  
**Milestone**: Intelligent, adaptive tour progression based on user context

#### **Subtasks**:

**1. Agent State Management**
```typescript
interface AgenticTourState {
  // Agent's understanding of current position
  currentNarrativePosition: {
    historicalPeriod: string
    significanceLevel: number
    entities: Entity[]
    temporalContext: TemporalWindow
    userInterestLevel: number
  }
  
  // Agent's goals and plans
  explorationGoals: {
    primary: string
    secondary: string[]
    userDefined: string[]
    adaptiveGoals: string[] // Generated based on discoveries
  }
  
  // Agent's memory and discoveries
  discoveryHistory: {
    entitiesExplored: Entity[]
    connectionsFound: Connection[]
    narrativeThreads: NarrativeThread[]
    userInsights: UserInsight[]
  }
  
  // Agent's assessment of user engagement
  userEngagement: {
    interactionPattern: 'explorer' | 'researcher' | 'casual' | 'deep_dive'
    attentionSpan: number
    preferredComplexity: string
    currentSatisfaction: number
  }
}
```

**2. Dynamic Progression Engine**
```typescript
class ChronologicalTourAgent {
  async determineNextExploration(currentState: AgenticTourState): Promise<AgentAction> {
    // Analyze current user engagement and understanding
    const userContext = await this.analyzeUserEngagement(currentState)
    
    // Use spatial intelligence to find promising directions
    const spatialOpportunities = await this.spatial_intelligence_query({
      query_type: "discovery",
      current_entities: currentState.currentNarrativePosition.entities
    })
    
    // Check for narrative gaps or connections
    const narrativeAnalysis = await this.analyze_temporal_context({
      time_period: currentState.currentNarrativePosition.temporalContext,
      analysis_type: "gaps"
    })
    
    // Generate contextually appropriate next action
    return this.synthesizeNextAction({
      userContext,
      spatialOpportunities, 
      narrativeAnalysis,
      explorationGoals: currentState.explorationGoals
    })
  }
}
```

**3. User Engagement Analysis**
- Real-time interaction pattern detection
- Attention span and complexity preference analysis
- Satisfaction monitoring and feedback loops
- Adaptive response strategy implementation

### **Phase 3: Enhanced Intelligence** (1-2 weeks)
**Milestone**: Fully integrated agentic tour system with advanced capabilities

#### **Subtasks**:

**1. Research Canvas Integration**
- Enhanced smart tour-research bridge functionality
- Automatic research session creation from tour discoveries
- Context preservation across tour and research systems
- Seamless transition between exploration and documentation

**2. Advanced Narrative Generation**
- AI-driven narrative bridge creation between historical periods
- Temporal relationship discovery and significance assessment
- Thematic connection identification and ranking
- Dynamic storyline adaptation based on user interests

**3. Performance Optimization**
- Real-time response optimization for tool orchestration
- Efficient memory usage for agent state management
- Scalability enhancements for complex tour scenarios
- Comprehensive performance benchmarking

## **Conversational Interface Examples**

### **Natural Language Tour Control**
```typescript
// Instead of manual navigation controls
user: "I'm interested in how military personnel attitudes changed after Roswell"

agent: "I'll explore the evolution of military perspectives on UFOs post-1947. Let me navigate to the early Cold War period and discover key personnel testimonies..."

// Agent uses tools:
await navigate_historical_tour({ 
  direction: "jump_to_period", 
  target_period: "cold_war",
  narrative_focus: "military_personnel_attitudes" 
})

await discover_related_entities({
  current_context: "post-Roswell military personnel attitudes",
  entity_types: ["personnel", "documents"],
  temporal_window: { years_after: 5 }
})
```

### **Adaptive Discovery Flow**
```typescript
user: "Show me the key connections between Roswell and modern Pentagon disclosures"

agent: "I'll create a narrative bridge spanning 75 years of disclosure evolution. Let me analyze the temporal context and discover connecting entities..."

// Agent orchestrates multiple tools:
await create_narrative_bridge({
  from_period: "Roswell incident",
  to_period: "Pentagon UAP acknowledgments",
  bridge_type: "evolution"
})

await spatial_intelligence_query({
  query_type: "narrative_flow",
  optimization_goal: "comprehension"
})
```

## **Architecture Benefits**

### **For Users**
- **Natural Language Navigation**: Express interests conversationally
- **Adaptive Progression**: Tours adapt to engagement and expertise level
- **Intelligent Discovery**: AI actively surfaces relevant connections
- **Preserved Control**: Manual controls remain available for power users

### **For Development**
- **Infrastructure Preservation**: All existing sophisticated systems remain
- **Enhanced Capabilities**: Spatial intelligence and contextual AI orchestrated intelligently
- **Backward Compatibility**: No breaking changes to existing functionality
- **Extensible Design**: Easy to add new tools and capabilities

### **For AI Assistants**
- **Clear Tool Interfaces**: Well-defined schemas for tour control
- **Rich Context**: Access to historical relationships and temporal significance
- **Intelligent Orchestration**: Tools work together for optimal user experience
- **Seamless Integration**: Natural connection with existing smart features

## **Implementation Strategy**

### **Tool Implementation Pattern**
```typescript
// Tool implementations leverage existing smart infrastructure
class HistoricalTourTools {
  constructor(
    private tourController: ReturnType<typeof useEnhancedTourController>,
    private spatialIntelligence: ReturnType<typeof useSpatialGrouping>,
    private contextualAI: ContextualIntelligence,
    private researchBridge: SmartTourResearchBridge
  ) {}

  async navigate_historical_tour(params: NavigateParams): Promise<ToolResult> {
    // Use existing tourController but with agent-determined parameters
    if (params.direction === "jump_to_period") {
      const waypoint = await this.findBestWaypointForPeriod(params.target_period)
      await this.tourController.navigateToWaypoint(waypoint.index)
    }
    
    // Enhance with spatial intelligence
    if (params.narrative_focus) {
      await this.spatialIntelligence.createNarrativeGroup(params.narrative_focus)
    }
    
    return {
      success: true,
      newState: this.getCurrentTourState(),
      suggestedNextActions: await this.generateContextualSuggestions()
    }
  }
}
```

## **Success Metrics**

### **Functionality Metrics**
- ✅ AI assistant can navigate tours through natural language
- ✅ Adaptive progression responds to user engagement patterns
- ✅ All existing tour features remain fully functional
- ✅ Performance maintains real-time responsiveness

### **User Experience Metrics**
- **Conversational Success Rate**: >85% successful natural language tour interactions
- **Engagement Improvement**: 40%+ increase in user engagement over manual controls
- **Discovery Efficiency**: 60%+ improvement in relevant connection discovery
- **Adoption Rate**: 70%+ adoption by users familiar with manual controls

### **Technical Metrics**
- **Tool Reliability**: >95% successful tool invocation rate
- **Agent Decision Quality**: >90% contextually relevant next actions
- **Integration Stability**: Zero breaking changes to existing infrastructure
- **Performance**: <200ms average response time for agent decisions

## **Dependencies & Risk Management**

### **Critical Dependencies**
- Existing tour infrastructure in `@apps/app/src/features/mindmap/tours/`
- Spatial intelligence system (`useSpatialGrouping`)
- Contextual AI system (`contextual-intelligence.ts`)
- Research canvas bridge functionality

### **Risk Mitigation Strategies**
- **Complexity Risk**: Incremental implementation with clear phase boundaries
- **Performance Risk**: Comprehensive benchmarking and optimization in Phase 3
- **Integration Risk**: Extensive testing with existing infrastructure
- **User Experience Risk**: Maintain manual controls as fallback option

## **Deliverables**

### **Phase 1 Deliverables**
1. **Tool Interface Specifications** - Complete API documentation for all 5 tools
2. **Wrapper Implementation** - Working tool wrappers around existing infrastructure
3. **Basic Agent Class** - Simple agent capable of tool invocation
4. **Testing Framework** - Initial test suite for tool functionality

### **Phase 2 Deliverables**
1. **Agent State Management** - Complete AgenticTourState implementation
2. **Progression Engine** - Dynamic next action determination system
3. **Engagement Analysis** - User pattern detection and adaptation
4. **Integration Testing** - Comprehensive testing with spatial intelligence

### **Phase 3 Deliverables**
1. **Research Canvas Integration** - Enhanced tour-research bridge
2. **Advanced Narrative Generation** - AI-driven connection discovery
3. **Performance Optimization** - Benchmarks and optimization implementation
4. **Complete Documentation** - User guides and technical documentation

## **Coordination with @apps/app/ Agent**

### **Collaboration Points**
- **Tool Interface Design**: Coordinate on schema specifications and parameter naming
- **Integration Testing**: Joint testing of agent functionality with tour infrastructure
- **User Experience Design**: Align on conversational interface patterns
- **Performance Optimization**: Coordinate on efficient tool orchestration

### **Communication Protocol**
- **Weekly Sync**: Progress updates and blocker resolution
- **Milestone Reviews**: Phase completion and quality validation
- **Technical Decisions**: Architecture choices and implementation approaches
- **Testing Coordination**: Integration testing and user experience validation

## **Next Actions**

### **Immediate (Week 1)**
1. **Finalize Tool Schemas** - Complete tool interface definitions with @apps/app/ agent
2. **Begin Wrapper Implementation** - Start wrapping existing tour controller functionality
3. **Set up Testing Environment** - Establish framework for tool testing and validation

### **Short Term (Weeks 2-3)**
1. **Complete Phase 1** - Functional tool wrappers and basic agent implementation
2. **Begin Agent State Design** - Start Phase 2 with state management architecture
3. **Integration Planning** - Detailed planning for spatial intelligence integration

### **Medium Term (Weeks 4-5)**
1. **Complete Agent Orchestration** - Functional adaptive progression engine
2. **Begin Enhanced Intelligence** - Start Phase 3 with research canvas integration
3. **Performance Optimization** - Comprehensive performance analysis and optimization

---

**Status**: Ready to begin implementation  
**Next Checkpoint**: Tool schema definitions complete (July 19, 2025)  
**Contact**: Coordinate with agent in @apps/app/ for tool interface specifications  
**Priority**: High - Critical for agentic tour functionality

*This document will be updated as implementation progresses and new requirements are discovered.*