# Workspace Consolidation Specialist - Task Assignment

**Agent ID:** `workspace-consolidation-specialist`
**Owner:** Week 1 Foundation Stabilization
**Priority:** High

## Task 3: Consolidate Research Canvas Workspace (1 day)

### Objective
Seamlessly integrate `@apps/research-canvas/` into `@apps/app/src/features/research-canvas/` while maintaining functionality and code quality.

### Source Analysis Required
- [ ] Analyze `@apps/research-canvas/` structure and entry points
- [ ] Identify routing, state management, and API integrations
- [ ] Map unique build configurations and dependencies
- [ ] Identify shared components that could be refactored into packages

### Migration Strategy
- [ ] Determine approach: direct file copy vs. internal package creation
- [ ] Plan new directory structure within `@apps/app/src/features/research-canvas/`
- [ ] Strategy decision: Prefer internal package for maintainability

### Code Relocation & Refactoring
- [ ] Move files from `research-canvas` to target location
- [ ] Update all import paths and relative references
- [ ] Resolve naming collisions (components, CSS classes)
- [ ] Handle conflicting dependencies between apps

### Configuration Updates
- [ ] Update `@apps/app/tsconfig.json` to include new features
- [ ] Modify `@apps/app/package.json` for dependencies
- [ ] Update build configurations (Webpack/Vite)
- [ ] Remove `@apps/research-canvas/` from monorepo root config

### Integration Requirements
- [ ] Integrate routes into main app routing system
- [ ] Update navigation and entry points
- [ ] Migrate environment variables and static assets
- [ ] Ensure UI/UX consistency with main app design system

### Critical Files to Modify
- `@apps/app/tsconfig.json` - TypeScript configuration
- `@apps/app/package.json` - Dependencies and scripts
- `@apps/app/next.config.ts` - Build configuration
- Monorepo root configs - Remove research-canvas workspace

### Files to Preserve/Migrate
- TipTap components and extensions
- Research tools and interfaces
- RAG integration components
- Any unique styling or assets

### Success Criteria
- [ ] `@apps/research-canvas/` directory completely removed
- [ ] All research-canvas features functional within main app
- [ ] Clean import paths with no broken references
- [ ] Build system compiles without errors
- [ ] No dependency conflicts or version mismatches

### Coordination Points
- **With Agent 3:** Ensure RAG integrations remain functional post-consolidation
- **With Agent 1:** Coordinate any database connection changes
- **Critical:** Verify no breaking changes to existing research workflows

### Risk Mitigation
- [ ] Create backup branch before starting consolidation
- [ ] Test each migration step incrementally
- [ ] Maintain git history for moved files where possible
- [ ] Document any breaking changes or required updates