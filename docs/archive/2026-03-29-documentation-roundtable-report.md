# Documentation Roundtable Report

**Date:** 2026-03-29
**Specialists:** Frontend Architecture, Backend/API/DevOps, Project Management/Documentation Architecture
**Scope:** Full documentation surface audit with obsolete file disposition and gap analysis

---

## Executive Summary

**Overall Documentation Health: 58/100**

Three specialists independently audited the documentation surface and converged on a clear picture:

1. **CONTRIB.md and RUNBOOK.md** (generated today) cover dev setup, scripts, env vars, deployment, and common issues well
2. **Tier 2 (TODO.md) is healthy** and actively maintained. **Tier 1 (FEATURES.md) is 7 months stale.** Tier 3 (DAILY_WORK_PLAN.md) is a snapshot from early 2025.
3. **534 markdown files** across 7+ locations with no clear navigation hierarchy
4. **30+ files from June-September 2025** are obsolete and polluting search results
5. **Critical gaps:** No API route docs (0%), no auth middleware, no monitoring, no .env.example, no component usage guide, no state management mental model documented

---

## Specialist Assessments

### Frontend Architecture (12 gaps, 13 recommendations)

**Strengths:**
- Canonical render path documented (research-canvas -> MindMap -> ViewSwitcher -> Graph)
- Dead code explicitly marked in CLAUDE.md (7 files flagged "Do Not Extend or Debug")
- 158 Storybook stories across mindmap components
- 2026-03-29 architecture audit is exceptional (185 lines)

**Critical gaps:**
- No component usage guide (import patterns, provider nesting)
- State management mental model undocumented (Zustand vs Context decision table missing)
- ReactFlow patterns invisible (359-line graph.tsx, 10+ hooks, zero docs)
- Stories not indexed — 158 files, no map to components
- AI-graph integration patterns lost to dead code references

**Verdict:** Foundation is strong, but documentation is "architect-quality, developer-hostile" for onboarding.

### Backend/API/DevOps (9 gaps, 12 recommendations)

**Strengths:**
- CONTRIB.md covers 212 env vars, 50+ scripts, minimum viable .env
- RUNBOOK.md covers deployment, common issues, rollback
- AI architecture flow documented end-to-end for disclosure mindmap route

**Critical gaps:**
- **0% API route documentation** — no request/response contracts, no OpenAPI spec
- **No auth middleware** — every route publicly accessible (FireCrawl, OpenAI, admin)
- **No monitoring configured** — error tracking, cost tracking, alerting all absent
- **No .env.example** — 212 vars with no template file
- **No input validation docs** — Zod schemas partially implemented, not documented
- **No rate limiting** — expensive AI operations completely uncapped

**Verdict:** Strong operational docs but critical security and API documentation gaps.

### Project Management (534 files audited, 30+ obsolete)

**Strengths:**
- Three-tier system established
- TODO.md actively maintained with 34 actionable tasks

**Critical findings:**

| Tier | Status | Last Updated | Health |
|------|--------|-------------|--------|
| Tier 1: FEATURES.md | DEGRADED | Aug 13, 2025 (7 months) | Needs immediate refresh |
| Tier 2: TODO.md | HEALTHY | Jan 22, 2026 | Actively maintained |
| Tier 3: DAILY_WORK_PLAN.md | STALE | ~Mar 13, 2025 | Snapshot of old sprint |

**Obsolete files disposition:**

| Action | Count | Examples |
|--------|-------|---------|
| DELETE | 5 | Empty files, duplicates, placeholder-only |
| ARCHIVE | 50+ | June-Sept 2025 work logs, status reports, scrapped specs, research methodology (41 files) |
| UPDATE | 6 | FEATURES.md, ROADMAP.md, PRD.md, AGENT_ONBOARDING_CHECKLIST.md, DAILY_WORK_PLAN.md |

**Verdict:** Documentation sprawl across 7+ locations. 60+ files should be archived. No deprecation process exists.

---

## Unified Gap Table

| Gap | Frontend | Backend | PM | Severity |
|-----|----------|---------|-----|----------|
| No auth middleware | — | Every route public | — | CRITICAL |
| No API documentation | — | 0% coverage | — | CRITICAL |
| No monitoring | — | Zero observability | — | CRITICAL |
| Tier 1 (FEATURES.md) stale | — | — | 7 months old | CRITICAL |
| No .env.example | — | 212 vars, no template | — | HIGH |
| State management undocumented | Zustand vs Context unclear | — | — | HIGH |
| No component usage guide | Import patterns missing | — | — | HIGH |
| Documentation sprawl | — | — | 534 files, 7+ locations | HIGH |
| 50+ obsolete files | — | — | Polluting search | HIGH |
| ReactFlow patterns invisible | 10+ hooks undocumented | — | — | MEDIUM |
| Stories not indexed | 158 stories, no map | — | — | MEDIUM |
| AI integration patterns lost | Dead code references | Config not operational | — | MEDIUM |
| No rate limiting docs | — | Expensive ops uncapped | — | MEDIUM |
| Broken internal links | — | — | Onboarding doc broken | MEDIUM |

---

## Recommended Action Plan

### Week 1: Security + Foundation (8-10 hours)

| # | Action | Owner | Effort |
|---|--------|-------|--------|
| 1 | Create `.env.example` from 212 current vars | Backend | 2h |
| 2 | Create `docs/archive/` and move 50+ obsolete files | PM | 2h |
| 3 | Create `docs/API_ROUTES.md` — route contracts for disclosure/mindmap + prometheus/chat | Backend | 3h |
| 4 | Refresh `docs/plans/FEATURES.md` for Q1 2026 | PM | 3h |
| 5 | Update CLAUDE.md with state management decision table | Frontend | 30m |

### Week 2: Developer Onboarding (12-15 hours)

| # | Action | Owner | Effort |
|---|--------|-------|--------|
| 6 | Create `COMPONENT_GUIDE.md` (import patterns, provider nesting) | Frontend | 2h |
| 7 | Create `STATE_MANAGEMENT.md` (Zustand vs Context) | Frontend | 3h |
| 8 | Create `REACTFLOW_PATTERNS.md` (hooks, custom nodes/edges) | Frontend | 3h |
| 9 | Create `AI_ARCHITECTURE.md` (agent patterns, tool defs, SSE bridge) | Backend | 3h |
| 10 | Rebuild `docs/INDEX.md` with hierarchy and navigation | PM | 3h |

### Week 3: Operational Hardening (8-10 hours)

| # | Action | Owner | Effort |
|---|--------|-------|--------|
| 11 | Create `STORYBOOK_MAP.md` (component-to-story index) | Frontend | 1h |
| 12 | Consolidate duplicate docs (RAG plans, pseudocode pairs) | PM | 2h |
| 13 | Update AGENT_ONBOARDING_CHECKLIST.md (fix broken links) | PM | 1h |
| 14 | Create `DATABASE_SCHEMA.md` (auto-generated from Xata SDK) | Backend | 2h |
| 15 | Establish monthly doc maintenance schedule | PM | 1h |

**Total: ~30-35 hours over 3 weeks to reach 80/100 documentation health.**

---

## Files to DELETE (zero value)

| File | Reason |
|------|--------|
| `apps/app/docs/disclosure-tour-graph.md` | Empty (0 bytes) |
| `apps/app/docs/INTEGRATION_STABILIZATION_COMPLETED.md` | Empty (1 byte) |
| `apps/app/docs/TASK_COMPLETION_LOG_JUNE_25_2025.md` | Session marker only |
| `apps/app/docs/RAG-TIPTAP-INTEGRATION-PLAN.md` | Duplicate of Aug version |
| `docs/plans/PlannedIntegrations.md` | One broken link |

## Files to ARCHIVE (move to `docs/archive/`)

**Session logs (25+ files):**
- All `docs/agents/sessions/logs/WORK_LOG_*.md`
- `apps/app/docs/AGENT_1_WORK_LOG_20250629.md`

**Status reports (5 files):**
- `apps/app/docs/ENHANCED_NODE_POC_STATUS.md`
- `apps/app/docs/RESEARCH_INTERFACE_STATUS.md`
- `apps/app/docs/SPATIAL_INTELLIGENCE_STATUS_UPDATE.md`
- `apps/app/docs/CONTEXTUAL_INTELLIGENCE_IMPLEMENTATION_STATUS.md`
- `apps/app/docs/MINDMAP_NODE_CREATION_FIX.md`

**Scrapped plans:**
- `apps/app/docs/TODO_AGENT_TASKS.md` (scrapped multi-agent spec)

**Research methodology (41 files):**
- Entire `docs/plans/features/research/agentic-research-methodology/` directory
- `docs/plans/features/research/ufo-research__military_sites_ufo_events/` directory

**Design pseudocode (8 files):**
- `apps/app/docs/Pill.md` + `Pill_PSUEDOCODE.md`
- `apps/app/docs/GalleryFlow.md` + `GalleryFlow_PSUEDOCODE.md`
- `apps/app/docs/ProductSwapCard.md` + `ProductSwapCard_PSUEDOCODE.md`
- `apps/app/docs/DynamicSettingsVariant1.md` + `DynamicSettingsVariant1_PSUEDOCODE.md`

## Files to UPDATE (currently active but stale)

| File | Last Updated | Action Needed |
|------|-------------|---------------|
| `docs/plans/FEATURES.md` | Aug 2025 | Refresh for Q1 2026 priorities |
| `docs/plans/app/ROADMAP.md` | Aug 2025 | Refresh for 2026 context |
| `docs/plans/app/PRD.md` | Aug 2025 | Verify against current implementation |
| `docs/agents/AGENT_ONBOARDING_CHECKLIST.md` | Aug 2025 | Fix broken links |
| `DAILY_WORK_PLAN.md` | ~Mar 2025 | Refresh for current sprint |
| `apps/app/docs/RESEARCH_EDITOR_CHEATSHEET.md` | Jun 2025 | Verify accuracy |

---

## Myths Corrected

| Myth | Reality |
|------|---------|
| "Documentation is comprehensive" | 534 files but 0% API route coverage, no .env.example, 7-month stale strategic docs |
| "Three-tier system is working" | Tier 2 is healthy; Tier 1 is degraded (7 months); Tier 3 is a historical snapshot |
| "Component docs exist in Storybook" | 158 stories exist but no index, no map, no "which story for which component" guide |
| "AGENT_ONBOARDING_CHECKLIST.md onboards agents" | Contains broken links to non-existent files |
| "Research methodology is documented" | 41 files from Aug 2025 in a research subdirectory, no summary or index |
