# UltraTerrestrial Architecture Overview
**MANDATORY FIRST READ FOR ALL AGENTS**

## 🏗️ Foundational AI Infrastructure

### Core AI Layer (The Foundation)
- **"Prometheus" OpenAI Assistant** - Core AI powering all intelligence
- **Vector Storage + Database Search** - Dual approach (Xata vector + PostgreSQL)
- **RAG Integration** - Vector storage provides intelligence layer
- **Database Methods** - `askXata`, `askXataComprehensive`, `searchXata`

**CRITICAL UNDERSTANDING:** This AI foundation powers ALL systems below.

## 🎯 System Integration Hierarchy

```
Contextual Intelligence (✅ COMPLETE - June 2025)
├── Foundation layer for all AI features
├── Powers: Context detection, relationship filtering, smart suggestions
└── Implementation: contextual-intelligence.ts

↓ Built on Contextual Intelligence ↓

Spatial Intelligence (✅ COMPLETE - June 2025)  
├── R-Tree indexing for O(log n) proximity queries
├── 150px threshold, 2-second triggers
└── Implementation: useSpatialGrouping, proximity analysis

↓ Leverages Both Above ↓

Smart Tour Integration (✅ 85% Complete - July 2025)
├── Enhanced nodes with AI-powered badges
├── Tour-specific contextual intelligence
├── Historical significance detection
└── Implementation: Enhanced nodes + tour system

↓ Natural Language Layer ↓

Agentic Tours (📋 Planning - July 2025)
├── Natural language tour control
├── Leverages all above systems through tool interfaces
└── Philosophy: Orchestration over Replacement
```

## 🔗 Critical Integration Points

### Enhanced Nodes (enhancedEntityNodePOC)
- **Used by:** ALL systems (Contextual, Spatial, Tours, Agentic)
- **Purpose:** Common UI layer with smart badges
- **Integration:** 100% - all systems use this foundation

### Spatial Grouping (useSpatialGrouping)
- **Used by:** Spatial Intelligence, Smart Tours, Research Canvas
- **Purpose:** Intelligent node clustering and proximity analysis
- **Integration:** Complete with contextual intelligence

### Contextual Intelligence Core
- **Powers:** Smart badges, filtering, suggestions, tour progression
- **Integration:** Foundation for all other systems
- **Status:** Production-ready and actively used

## 📊 Current Status Matrix

| System | Status | Integration Level | AI Connectivity |
|--------|--------|------------------|-----------------|
| Contextual Intelligence | ✅ COMPLETE | Foundation | 100% |
| Spatial Intelligence | ✅ COMPLETE | Built on foundation | 100% |
| Smart Tours | ✅ 85% Complete | Leverages both above | 85% |
| Enhanced Nodes | ✅ COMPLETE | Used by all systems | 100% |
| Agentic Tours | 📋 Planning | Will use all above | TBD |

## ⚠️ CRITICAL FOR AGENTS

### BEFORE STARTING ANY TASK:
1. **Understand this hierarchy** - Don't treat systems as separate
2. **85% AI connectivity ≠ low integration** - This represents sophisticated functional integration
3. **Most integration already exists** - You're likely polishing, not building from scratch
4. **Contextual Intelligence is the brain** - All other systems depend on it

### COMMON MISTAKES TO AVOID:
- Planning to "connect" already-connected systems
- Treating 85% connectivity as incomplete
- Missing the unified AI foundation
- Assuming systems need architectural overhaul
- Reverse-engineering from code without reading documentation

### REQUIRED READING ORDER:
1. **This document** (ARCHITECTURE_OVERVIEW.md)
2. **CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md** - Core AI layer understanding
3. **System-specific documentation** for your task area
4. **Code exploration** - Only after understanding architecture

## 🎯 Integration Philosophy

**"Orchestration over Replacement"**
- Existing infrastructure is sophisticated and well-integrated
- New features should leverage existing systems
- Polish and complete existing integration rather than rebuild
- Natural language and AI layers should orchestrate existing tools

## 📋 Quick Architecture Validation

Can you answer these before starting your task?

- [ ] What is Prometheus and how does it power the system?
- [ ] How does Contextual Intelligence serve as the foundation?
- [ ] Which systems are already integrated and how?
- [ ] What does "85% AI connectivity" actually represent?
- [ ] How does your task relate to existing infrastructure?

**If you can't answer these, read the documentation first.**

---

**Last Updated:** July 15, 2025  
**Status:** Living document - update as architecture evolves  
**Critical:** This must be the first document any agent reads