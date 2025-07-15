# Workspace Consolidation Specialist - Context

**Agent ID:** `workspace-consolidation-specialist`
**Current Status:** Ready to begin Research Canvas consolidation

## Technical Context

### Monorepo Structure
- **Root:** Turborepo/Bun workspace
- **Apps:** 3 total (`app`, `disclosure-rag`, `research-canvas`)
- **Packages:** 5 total (including `db`, shared utilities)

### Source Workspace: `@apps/research-canvas/`
**Current Status:** Standalone Next.js application
**Key Components:**
- TipTap rich text editor integration
- RAG-powered research tools
- Specialized research workflows
- Independent build configuration

### Target Location: `@apps/app/src/features/research-canvas/`
**Current Status:** Existing directory structure
**Integration Points:**
- Main app routing system
- Shared component library
- Unified build configuration
- Consistent environment variables

### Build System Configuration
```json
// Main app package.json needs updates
{
  "dependencies": {
    // Research Canvas dependencies to merge
  },
  "scripts": {
    // Unified build scripts
  }
}
```

### Critical Files to Modify
- `@apps/app/tsconfig.json` - TypeScript path mapping
- `@apps/app/package.json` - Dependencies consolidation
- `@apps/app/next.config.ts` - Build configuration
- Monorepo root `package.json` - Remove research-canvas workspace

### TipTap Integration Points
**Research Canvas TipTap Components:**
- Rich text editor with RAG integration
- Document annotation features
- AI-powered content generation
- Research note organization

### RAG Integration Dependencies
**Research Canvas → RAG System:**
- Must preserve connections to 4 RAG backends
- Coordinate with Agent 3 for integration testing
- Ensure no breaking changes to research workflows

### Environment Variables
Need to consolidate environment variables from:
- `@apps/research-canvas/.env*` → `@apps/app/.env*`
- Check for conflicts or duplicates
- Maintain RAG system connections

### Coordination Dependencies
- **Agent 3:** Ensure RAG integrations remain functional post-consolidation
- **Agent 1:** No conflicts with database seeding operations
- **Shared Build System:** Maintain Turborepo workspace integrity