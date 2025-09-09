# Agent Configuration Directory

This directory contains platform-specific agent configurations that extend the core development guidelines defined in [AGENTS.md](../../AGENTS.md).

## 📖 Architecture

### Master Guidelines
- **[AGENTS.md](../../AGENTS.md)** - Single source of truth for all development guidelines
- Contains comprehensive commands, project structure, technology stack, and development standards
- All platform-specific files reference this master file rather than duplicating content

### Platform-Specific Configurations
- **[claude-code.md](claude-code.md)** - Claude Code specific enhancements and AI-powered development patterns
- **[cursor.md](cursor.md)** - Cursor IDE specific configuration and keyboard shortcuts
- **[warp.md](warp.md)** - Warp terminal specific commands and workflows
- **[AGENT_ONBOARDING_CHECKLIST.md](AGENT_ONBOARDING_CHECKLIST.md)** - Mandatory onboarding validation checklist

## 🎯 Usage Principles

### Single Source of Truth
- **Core information** is maintained only in AGENTS.md
- **Platform files** contain only platform-specific additions
- **No duplication** of commands, standards, or project structure

### Integration Pattern
1. **Read AGENTS.md** for comprehensive development guidelines
2. **Check platform file** for platform-specific enhancements only
3. **Follow three-tier project management** system as defined in AGENTS.md

### Consistency Rules
- All platform files reference AGENTS.md for core information
- Changes to core guidelines are made in AGENTS.md only
- Platform files focus on platform-specific features and integrations

## 🔗 Quick Links

- **[AGENTS.md](../../AGENTS.md)** - Master development guidelines
- **[Three-Tier Project Management](../../AGENTS.md#-three-tier-project-management-system)** - Strategic planning system
- **[Technology Stack](../../AGENTS.md#-technology-stack)** - Complete technical reference
- **[Core AI Architecture](../../AGENTS.md#-core-ai-architecture)** - AI system integration guide

---

**Note**: This directory structure prevents duplication and ensures consistency across all agent platforms while maintaining platform-specific optimizations.