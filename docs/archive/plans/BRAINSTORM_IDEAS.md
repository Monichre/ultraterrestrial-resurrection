# Brainstorm Ideas - Existing Work Analysis

**Date:** March 12, 2026  
**Purpose:** Map new ideas to existing work, identify gaps for TODO

---

## My Ideas vs. Existing Work

| Idea | Status | Where |
|------|--------|-------|
| **Agentic RAG** | ✅ IN PROGRESS | `apps/disclosure-rag/lib/agno/`, `docs/plans/features/TIMELINE_AND_NETWORK_AGENTIC_ARCHITECTURE.md`, `AGENTIC_CHRONOLOGICAL_TOUR_IMPLEMENTATION.md` |
| **Unified Embedding** | ❌ MISSING | Needs implementation - embedding dimension mismatch across backends |
| **Continuous Learning** | ❌ MISSING | Feedback loops not implemented |
| **Evidence Chains** | ⚠️ PARTIAL | `packages/prompts/` has methodology, but visual chains not built |
| **Source Credibility Scoring** | ✅ EXISTS | `credibility_score` in DB, witness credibility analysis, `ufo-credibility` cmd |
| **Citation Network Graph** | ⚠️ PARTIAL | Network explorer exists, but citation linking not fully implemented |
| **3D Spacetime Timeline** | ⚠️ PARTIAL | Timeline scrubber exists, 3D timeline not fully built |
| **Cluster Discovery** | ⚠️ PARTIAL | Spatial grouping exists, statistical anomaly detection missing |
| **Signal Hunter** | ❌ MISSING | Heatmap exists, military radar overlay not built |
| **Disclosure Radar** | ❌ MISSING | - |
| **Research Scout** | ❌ MISSING | - |
| **Weekly Briefing** | ❌ MISSING | - |
| **Expert Directory** | ⚠️ PARTIAL | Personnel DB exists, expert directory UI not built |
| **Theory Debates** | ❌ MISSING | - |
| **Research Quests** | ❌ MISSING | - |

---

## Ideas to Add to TODO

### High Priority (Can Build Now)

#### 1. Unified Embedding Strategy
- **Problem:** FAISS uses 384 dims, OpenAI uses 1536/3072 dims - scores not comparable
- **Solution:** Standardize on `text-embedding-3-small` (1536 dims) across all backends
- **Impact:** Comparable relevance scores across all RAG sources
- **Files:** `apps/disclosure-rag/lib/adapters/`

#### 2. Continuous Learning (Feedback Loop)
- **Problem:** No way to improve RAG based on user feedback
- **Solution:** 
  - Add upvote/downvote on RAG results
  - Store corrections in feedback table
  - Re-rank based on feedback patterns
- **Impact:** Improves relevance over time

#### 3. Disclosure Radar
- **Problem:** No automated monitoring of disclosure events
- **Solution:**
  - Monitor: FOIA releases, Congressional hearings, NASA statements, AARO updates
  - Alert on new content
  - Auto-ingest for RAG
- **Impact:** Proactive discovery of new evidence

#### 4. Research Scout Agent
- **Problem:** Manual research is time-consuming
- **Solution:**
  - AI agent that proactively finds new sources
  - Monitors: YouTube channels, podcasts, news, academic papers
  - Queues for review and ingestion
- **Impact:** Automated source discovery

#### 5. Weekly Research Briefing
- **Problem:** Hard to stay on top of all developments
- **Solution:**
  - Weekly summary of: new sources, updates to existing entities, research progress
  - Send to: NotebookLM, email, or Discord
- **Impact:** Passive awareness of research landscape

---

### Medium Priority (Requires Design)

#### 6. Evidence Chains
- **Concept:** Visual connections between evidence across documents
- **Status:** Methodology exists in prompts, UI not built
- **Need:** 
  - Data model for evidence links
  - UI for creating/viewing chains
  - Graph visualization

#### 7. Theory Debates
- **Concept:** AI-moderated debates between competing hypotheses
- **Status:** Not started
- **Need:**
  - Hypothesis tracking
  - Debate format/prompt engineering
  - UI for viewing debates

#### 8. Research Quests
- **Concept:** Gamified research tasks
- **Status:** Not started
- **Need:**
  - Quest definitions
  - Progress tracking
  - Rewards/recognition

---

## Immediate Actions

### Add to TODO.md:

```markdown
## 🚀 NEW FEATURES

### Unified Embedding
- Standardize on text-embedding-3-small across all RAG backends
- Fix dimension mismatch between FAISS (384) and OpenAI (1536/3072)
- Files: apps/disclosure-rag/lib/adapters/

### Continuous Learning
- Add upvote/downvote on RAG results
- Store feedback in database
- Implement re-ranking based on feedback

### Disclosure Radar
- Monitor FOIA releases, congressional hearings, NASA/AARO
- Alert system for new disclosure events
- Auto-ingest to RAG system

### Research Scout
- AI agent for proactive source discovery
- Monitor: YouTube, podcasts, news, academic
- Queue for review

### Weekly Briefing
- Automated weekly research summary
- Distribution: NotebookLM, email, Discord
```

---

## Notes

- RAG system changes mentioned by user ("RAG system has to change - but underway")
- Many features have 85%+ infrastructure already - focus on integration not building from scratch
- Agentic RAG already well underway in `agno/` directory
