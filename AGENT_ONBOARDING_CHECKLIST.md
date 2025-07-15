# Agent Onboarding Checklist
**MANDATORY FOR ALL NEW AGENTS**

## 📋 REQUIRED READING ORDER (NO EXCEPTIONS)

### Phase 1: Foundation Understanding
- [ ] **ARCHITECTURE_OVERVIEW.md** - System foundation and integration hierarchy
- [ ] **CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md** - Core AI layer understanding  
- [ ] **CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md** - System comparison matrix

### Phase 2: Task-Specific Documentation
- [ ] Read documentation specific to your assigned task area
- [ ] Review relevant work logs and implementation status
- [ ] Understand your task's relationship to existing systems

### Phase 3: Validation Questions
Answer these BEFORE starting any work:

#### Foundational AI Understanding
- [ ] What is "Prometheus" and how does it power the system?
- [ ] How does Vector Storage + Database Search work?
- [ ] What is the role of Contextual Intelligence in the architecture?

#### System Integration Understanding  
- [ ] Which systems are already integrated and how?
- [ ] What does "85% AI connectivity" actually represent?
- [ ] How do Enhanced Nodes serve as the common UI layer?

#### Task Relationship Understanding
- [ ] How does your task relate to existing infrastructure?
- [ ] Are you building new systems or enhancing existing ones?
- [ ] What existing systems should you leverage vs. rebuild?

## 🚨 RED FLAGS - STOP AND REASSESS

If you find yourself planning any of these, STOP and re-read documentation:

- [ ] "Connecting" systems that are already connected
- [ ] Treating 85% AI connectivity as incomplete integration
- [ ] Planning major architectural overhauls
- [ ] Assuming systems are separate when they're integrated
- [ ] Building new AI infrastructure when Prometheus + Vector Storage exists
- [ ] Creating new context systems when Contextual Intelligence is complete

## ✅ GREEN FLAGS - GOOD UNDERSTANDING

You're ready to proceed if you understand:

- [ ] Contextual Intelligence is the foundational brain powering all systems
- [ ] Enhanced Nodes are the common UI layer used across all features
- [ ] Spatial Intelligence builds on Contextual Intelligence
- [ ] Smart Tours leverage both Contextual and Spatial Intelligence
- [ ] Agentic Tours will orchestrate existing systems, not replace them
- [ ] Most "unification" work is polishing existing integration

## 📝 DOCUMENTATION VERIFICATION

Before starting, verify you can explain:

### The Integration Hierarchy
```
Contextual Intelligence (Foundation)
├── Powers: Smart badges, filtering, suggestions
├── Status: ✅ COMPLETE
└── Used by: ALL other systems

↓ Built on Foundation ↓

Spatial Intelligence  
├── Features: R-Tree indexing, proximity analysis
├── Status: ✅ COMPLETE
└── Integration: Seamless with Contextual Intelligence

↓ Leverages Both Above ↓

Smart Tour Integration
├── Features: Enhanced nodes, tour progression
├── Status: ✅ 85% Complete
└── Integration: Uses Enhanced Nodes + Contextual Intelligence

↓ Orchestration Layer ↓

Agentic Tours (Natural Language Control)
├── Philosophy: Orchestration over Replacement
├── Status: 📋 Planning
└── Will leverage: All existing systems through tool interfaces
```

### Common Infrastructure Elements
- [ ] Enhanced Nodes (`enhancedEntityNodePOC`) - Used by ALL systems
- [ ] Spatial Grouping (`useSpatialGrouping`) - Shared across features  
- [ ] Contextual Intelligence Core - Foundation for all AI features
- [ ] Vector Storage + Database Search - Unified AI infrastructure

## 🎯 TASK APPROACH VALIDATION

### BEFORE starting implementation:
- [ ] Can you map your task to existing systems?
- [ ] Do you understand what's already integrated?
- [ ] Are you enhancing existing features or building new ones?
- [ ] Have you identified the minimal changes needed?

### DURING implementation:
- [ ] Are you leveraging existing infrastructure?
- [ ] Are you following the "orchestration over replacement" philosophy?
- [ ] Are your changes enhancing the unified experience?
- [ ] Are you maintaining backward compatibility?

### AFTER implementation:
- [ ] Does your work integrate seamlessly with existing systems?
- [ ] Have you enhanced rather than fragmented the user experience?
- [ ] Is your implementation consistent with existing patterns?
- [ ] Did you preserve the AI connectivity and contextual intelligence?

## 📞 WHEN TO ASK FOR CLARIFICATION

Ask clarifying questions if:

- [ ] Your task seems to duplicate existing functionality
- [ ] You're unsure how your work fits into the integration hierarchy
- [ ] The existing documentation doesn't clearly show system relationships
- [ ] You're planning changes that might break existing integration
- [ ] You need to understand specific implementation details

## ✨ SUCCESS INDICATORS

You're on the right track if:

- [ ] Your work builds on existing AI infrastructure
- [ ] You're enhancing rather than replacing systems
- [ ] Your implementation feels like a natural extension
- [ ] You're maintaining the unified user experience
- [ ] Your changes leverage Contextual Intelligence
- [ ] You're following established patterns and conventions

---

**Remember:** This platform has sophisticated, well-integrated AI infrastructure. Your job is likely to enhance and complete existing integration rather than build from scratch.

**When in doubt:** Read more documentation, ask clarifying questions, and understand before implementing.

**Success:** Seamless integration that feels like it was always part of the unified system.