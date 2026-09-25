# Claude Code Session Context Template

**Project**: Ultraterrestrial Resurrection
**Generated**: January 20, 2025
**Purpose**: Standardized session initialization for consistent project awareness

---

## 🚀 Session Start Checklist

### Step 1: Load Project Context
```bash
# Automatically execute on session start
/load .context/project-context.md
```

### Step 2: Check Current Sprint Status
```bash
/status
# Should display:
# - Current Sprint: Tasks 6-8 (Unified Mindmap Foundation)
# - Active Task: {from DAILY_WORK_PLAN.md}
# - Progress: {X/30 tasks complete from TODO.md}
```

### Step 3: Review Recent Changes
```bash
git status
git log --oneline -10
```

### Step 4: Establish Work Focus
```yaml
current_session:
  sprint: "Tasks 6-8: Unified Mindmap Foundation"
  priority_1: "Task 6 - Replace mock entity extraction"
  priority_2: "Task 7 - Unified state management"
  priority_3: "Task 8 - Enhanced node standardization"
```

---

## 📋 Active Context Summary

### Current Sprint (January 15-21, 2025)
**Focus**: Unified Mindmap Foundation Architecture

#### Task 6: Replace Mock Entity Extraction ⏳
- **Files**: `@apps/app/src/app/api/disclosure/mindmap/`
- **Source**: `@apps/app/src/app/api/disclosure/chat/`
- **Action**: Copy real NER implementation
- **Success**: Real entities extracted in mindmap

#### Task 7: Unified State Management 📋
- **File**: `@apps/app/src/stores/mindmap-unified-store.ts`
- **Pattern**: Centralized Zustand store
- **Features**: Real-time sync, persistence
- **Success**: Single source of truth

#### Task 8: Enhanced Node Standardization 📋
- **Component**: `enhancedEntityNodePOC`
- **Scope**: All mindmap nodes
- **Features**: AI badges, spatial grouping
- **Success**: 100% adoption

---

## 🏗️ Architecture Quick Reference

### Core AI Systems (85% Complete)
```typescript
// Prometheus AI - Main conversational interface
import { Prometheus } from '@/features/agents/prometheus'

// Contextual Intelligence - Foundation for all AI features
import { getGraphContext } from '@/features/mindmap/utils/contextual-intelligence'

// Enhanced Nodes - Unified UI layer
import { EnhancedEntityNodePOC } from '@/features/mindmap/nodes/enhanced-node-poc'
```

### Triple RAG Architecture
- **Upstash Vector** (40%): Cloud vector search
- **LocalRAG FAISS** (40%): Local vector storage
- **CocoIndex PostgreSQL** (20%): Advanced analytics

### Database
- **Platform**: Xata PostgreSQL
- **Models**: 29 active models
- **Records**: 230,998+ entries
- **Migration**: Postgres Wire enablement pending

---

## 🎯 Session Objectives

### Primary Goals
1. Complete current sprint task
2. Update progress in DAILY_WORK_PLAN.md
3. Maintain architectural consistency
4. Document decisions and blockers

### Success Metrics
- ✅ API response time <500ms
- ✅ State update propagation <100ms
- ✅ 100% enhanced node adoption
- ✅ 90% test coverage

### Quality Gates
- [ ] Code follows existing patterns
- [ ] Tests pass (when available)
- [ ] Documentation updated
- [ ] No mock implementations remain
- [ ] Performance targets met

---

## 📊 Progress Tracking

### Three-Tier Updates
1. **DAILY_WORK_PLAN.md**: Update task progress daily
2. **docs/plans/TODO.md**: Mark completed tasks
3. **docs/plans/FEATURES.md**: Log architectural decisions

### Git Workflow
```bash
# Always work on feature branches
git checkout -b feature/task-6-entity-extraction

# Commit frequently with clear messages
git add .
git commit -m "feat(mindmap): replace mock entity extraction with real NER"

# Update progress
echo "Task 6: 50% complete" >> progress.log
```

---

## 🔗 Key Resources

### Documentation
- [DAILY_WORK_PLAN.md](../DAILY_WORK_PLAN.md) - Sprint execution
- [docs/plans/TODO.md](../docs/plans/TODO.md) - All tasks
- [docs/plans/FEATURES.md](../docs/plans/FEATURES.md) - Strategic planning
- [AGENT.md](../AGENT.md) - Development guidelines

### Implementation Files
- Entity Extraction: `@apps/app/src/app/api/disclosure/mindmap/`
- State Management: `@apps/app/src/stores/`
- Enhanced Nodes: `@apps/app/src/features/mindmap/nodes/`
- Contextual Intelligence: `@apps/app/src/features/mindmap/utils/`

### Commands Reference
- `/load` - Load project context
- `/status` - Check sprint progress
- `/worklog` - Document session work
- `/analyze` - Architecture-aware analysis
- `/build` - Sprint-aligned implementation

---

## 🚨 Important Reminders

### Architecture Principles
- **"Orchestration over Replacement"** - Enhance existing 85% complete AI
- **Build on Contextual Intelligence** - It's the foundation
- **Use Enhanced Nodes** - Consistency across all features
- **Leverage Triple RAG** - Don't rebuild what exists

### Common Pitfalls to Avoid
- ❌ Creating new AI infrastructure
- ❌ Ignoring existing patterns
- ❌ Adding features beyond sprint scope
- ❌ Leaving mock implementations
- ❌ Missing the three-tier updates

### Session End Checklist
- [ ] Update DAILY_WORK_PLAN.md progress
- [ ] Commit and push changes
- [ ] Document blockers
- [ ] Update .context/project-context.md if needed
- [ ] Run `/worklog` command

---

*Use this template at the start of each Claude Code session to ensure consistent project awareness and sprint-aligned development.*