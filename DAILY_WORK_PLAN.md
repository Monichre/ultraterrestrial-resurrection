# Daily Work Plan

**Date:** 2026-03-29
**Sprint:** Research Canvas Hardening
**Branch:** dev
**Reference:** `docs/plans/TODO.md` (ticket IDs: T-001 through T-029)

---

## Current Sprint: Research Canvas Hardening

### Completed Today (2026-03-29)
- [x] T-001: Remove Edge runtime from Prometheus chat route
- [x] T-002: Fix 3 broken API routes (scrape imports, delete file/route.ts, fix disclosure/chat tool output)
- [x] Ground all onboarding docs (CLAUDE.md, AGENTS.md, CORE_APP_AI_ARCHITECTURE_OVERVIEW.md, AGENT_ONBOARDING_CHECKLIST.md)
- [x] Generate docs/CONTRIB.md and docs/RUNBOOK.md
- [x] 4-specialist roundtable audit (frontend, backend, project management)
- [x] Documentation roundtable report
- [x] Rewrite TODO.md with agent-friendly ticket format (T-001 through T-029)

### Ready to Pick Up (no blockers)
- [ ] T-003: Add Clerk auth middleware — **CRITICAL SECURITY**
- [ ] T-004: Delete 4 ghost route wrappers — XS, 30 min
- [ ] T-005: Delete 4 dead shell variants — XS, 30 min
- [ ] T-007: Consolidate xata-to-xyflow files — S, 2-4 hours
- [ ] T-009: Fix EmptyCanvas — XS, 30 min
- [ ] T-010: Wire suggestion chips — XS, 30 min
- [ ] T-011: Replace local sightings dataset — M, 1 day
- [ ] T-014: Split processDocument tool — M, 1-2 days
- [ ] T-015: Standardize context injection — M, 2-3 days
- [ ] T-017: Wire testimony cron — S, 1 day
- [ ] T-018: Extract factories from context — S, half day
- [ ] T-021: Create .env.example — XS, 2 hours
- [ ] T-022: Create docs/archive/ — XS, 2 hours
- [ ] T-023: Refresh FEATURES.md — S, 3 hours
- [ ] T-024: Create API_ROUTES.md — S, 3 hours

### Blocked
- [ ] T-006: Prune index.tsx — blocked by T-005
- [ ] T-008: Paginate graph load — blocked by T-007
- [ ] T-012: Zod validation — ready (T-002 done)
- [ ] T-016: Unify chat routes — blocked by T-014, T-015
- [ ] T-019: Move graph init — blocked by T-018
- [ ] T-020: Move UI state to Zustand — blocked by T-018
- [ ] T-025: Rate limiting — blocked by T-003
- [ ] T-028: Agent consolidation — blocked by T-013, T-015

### Uncommitted Changes (37+ files)
**WARNING:** 37+ files modified across dev branch, NOTHING COMMITTED.
- Phase 0 fixes (routes)
- Parallel session build fixes (~10 files)
- All doc updates from today

### Recommended Next Session
1. **Commit current work** (37+ uncommitted files)
2. **T-004 + T-005 + T-006** (delete dead code, 1 hour total)
3. **T-003** (auth middleware, half day)
4. **T-009 + T-010** (EmptyCanvas + chips, 1 hour total)

---

## How Agents Should Use This File

1. Check "Ready to Pick Up" for available tasks
2. Claim a task by moving it to a new "In Progress" section with your agent name
3. When done, move to "Completed" with date
4. If blocked, move to "Blocked" with reason
5. Reference `docs/plans/TODO.md` for full task details (file paths, acceptance criteria)
