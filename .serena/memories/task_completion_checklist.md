# Task Completion Checklist

## Before Starting Any Task

### 1. Project Context Check
- [ ] Check git status: `git status && git branch`
- [ ] Ensure on correct branch (not main/master for development)
- [ ] Review current development state
- [ ] Read relevant documentation in `docs/` if available

### 2. Three-Tier Project Management Review
- [ ] Check `docs/PLANS/FEATURES.md` for strategic context
- [ ] Review `docs/PLANS/TODO.md` for actionable tickets
- [ ] Update `DAILY_WORK_PLAN.md` with current session work

### 3. Architecture Understanding
- [ ] Read `AGENT_ONBOARDING_CHECKLIST.md` if working on new features
- [ ] Understand "Orchestration over Replacement" principle
- [ ] Remember: 85% AI connectivity = advanced integration, not incomplete work

## During Development

### Code Quality Standards
- [ ] Follow established file naming conventions
- [ ] Use existing import patterns (`@/` for apps/app, workspace imports)
- [ ] Leverage Enhanced Nodes for UI consistency
- [ ] Build on Contextual Intelligence foundation for AI features

### Component Development
- [ ] Use `bun run new` for component generation
- [ ] Create Storybook stories for UI components
- [ ] Follow PascalCase for components, kebab-case for files
- [ ] Implement proper TypeScript types

### Database Work
- [ ] Update Xata schema through dashboard first
- [ ] Run `xata codegen` to update types
- [ ] Test integration with existing contextual intelligence
- [ ] Maintain compatibility with 230,998+ existing records

## When Task is Completed

### 1. Code Quality Validation
```bash
cd apps/app
bun run lint              # ESLint validation
bun run build            # Production build test
bun run audit:components # Component audit (if UI changes)
```

### 2. Python RAG System (if applicable)
```bash
cd apps/disclosure-rag
source .venv/bin/activate
python -m pytest tests/  # Run tests (if available)
python cli.py            # Test CLI functionality
```

### 3. Database Validation (if applicable)
```bash
cd packages/db
bun run query           # Test database connectivity
bun run analyze         # Analyze database state
```

### 4. Documentation Updates
- [ ] Update relevant documentation with timestamp
- [ ] Update `CLAUDE.md` if workflow changes made
- [ ] Document architectural decisions in `docs/PLANS/FEATURES.md`
- [ ] Update progress in `TODO.md` and `DAILY_WORK_PLAN.md`

### 5. Git Workflow
```bash
git add .
git diff --cached        # Review changes before commit
git commit -m "descriptive commit message following project conventions"
```

### 6. Clean Workspace
- [ ] Remove temporary files, scripts, and directories
- [ ] Clean build artifacts, logs, and debugging outputs
- [ ] Maintain professional workspace without clutter

## Quality Gates

### Critical Checks
- [ ] **Never skip tests** - Don't disable or comment out tests to make builds pass
- [ ] **No partial features** - Complete all started implementations to working state
- [ ] **No TODO comments** - Replace with actual implementations
- [ ] **Root cause analysis** - Investigate failures thoroughly, don't just fix symptoms

### Professional Standards
- [ ] Use technical terms, avoid marketing language
- [ ] Provide honest trade-offs and potential issues
- [ ] State limitations clearly ("untested", "MVP", "needs validation")
- [ ] Evidence-based claims only, no speculation

### Security & Safety
- [ ] Check framework dependencies before using libraries
- [ ] Follow existing project conventions and import styles
- [ ] Never commit secrets or keys to repository
- [ ] Always use absolute paths in tools and scripts

## Failure Investigation Protocol

### When Things Go Wrong
1. **Root Cause Analysis**: Always investigate WHY failures occur
2. **Systematic Debugging**: Review error messages and tool failures thoroughly
3. **Never Skip Validation**: Don't bypass quality checks to make things work
4. **Fix Don't Workaround**: Address underlying issues, not just symptoms

### Tool Failure Investigation
- When MCP tools or scripts fail, debug before switching approaches
- Use proper error handling and logging
- Methodical problem-solving: Understand → Diagnose → Fix → Verify

## Session End Checklist

### Documentation
- [ ] Update work logs with session summary
- [ ] Document files touched and components affected
- [ ] Record next steps and any blockers
- [ ] Timestamp all documentation updates

### Cleanup
- [ ] Remove temporary files and debugging outputs
- [ ] Clean up workspace for next session
- [ ] Ensure no artifacts left that could be accidentally committed

### Validation
- [ ] Confirm all planned tasks completed or properly documented
- [ ] Verify git status clean or properly staged
- [ ] Review that all critical principles were followed