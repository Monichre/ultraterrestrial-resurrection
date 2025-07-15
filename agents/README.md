# Agent Delegation System

This directory contains workspace-specific files for specialized agents handling Week 1 Foundation Stabilization tasks.

## Agent Structure

Each agent has their own workspace with:
- **tasks.md** - Detailed task breakdown and requirements ✅
- **context.md** - Technical context, file paths, dependencies ✅  
- **progress.md** - Current status, blockers, next steps ✅

## Active Agents

### 1. Database Migration Specialist
**Workspace:** `database-migration-specialist/`
**Responsibilities:**
- Task 1: Assess Postgres Wire Enabled Xata Migration (1 day)
- Task 2: Seed Postgres Wire Enabled Xata Instance (2 days)

### 2. Workspace Consolidation Specialist  
**Workspace:** `workspace-consolidation-specialist/`
**Responsibilities:**
- Task 3: Consolidate Research Canvas Workspace (1 day)

### 3. Database & RAG Integration Specialist
**Workspace:** `database-rag-integration-specialist/`
**Responsibilities:**
- Task 4: Fix Database Query Flow - `xataToXYFlow` (2 days)
- Task 5: Verify RAG System Integration (1 day)

## Coordination Protocol

**Dependencies:**
- Agent 1 → Agent 3: Database migration must complete before `xataToXYFlow` fix
- Agent 2 → Agent 3: Workspace consolidation must preserve RAG integrations
- All agents: Shared environment configurations and version control

## Usage

When working as one of these agents:
1. Read your `tasks.md` for detailed requirements
2. Update `progress.md` with current status
3. Coordinate with other agents as specified
4. Mark tasks complete in central `TODO.md` when finished

## Success Criteria Week 1

- ✅ Database queries return results consistently
- ✅ Triple RAG system shows parallel search results  
- ✅ Research Canvas features integrated into main app
- ✅ Environment fully configured