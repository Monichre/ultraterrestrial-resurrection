# CRUSH.md - DEPRECATED

⚠️ **This file has been superseded by the new agent configuration system.**

## 🔄 New Structure

All development guidelines, commands, and coding standards have been consolidated into:

### 📖 Master Guidelines

- **`AGENTS.md`** - Comprehensive development guidelines including:
  - Build, test, and lint commands
  - Code style guidelines
  - Technology stack reference
  - Performance guidelines
  - Security considerations
  - Testing strategy

### 🤖 Platform-Specific Configurations

- **`docs/agents/`** - Platform-specific configurations
- **`docs/agents/claude-code.md`** - Claude Code specific instructions
- **`docs/agents/cursor.md`** - Cursor IDE specific rules
- **`docs/agents/warp.md`** - Warp terminal commands

## 🎯 What You'll Find in AGENT.md

All the information from this file is now in `AGENT.md`:

- **Quick Start Commands** - All bun/npm commands for development
- **Code Style Guidelines** - Prettier, ESLint, TypeScript configuration
- **Component Development** - Storybook, component generation, best practices
- **Database Operations** - Xata best practices and patterns
- **Technology Stack** - Complete frontend/backend/development tools reference
- **Testing Strategy** - Unit, integration, E2E, visual testing approaches

## ⚡ Quick Migration

Instead of this file, use:

1. **`AGENT.md`** - For all development guidelines and commands
2. **`docs/agents/[platform].md`** - For platform-specific additions only
3. **Three-tier project management** - As defined in `AGENT.md`

---

**Please use `AGENT.md` instead of this deprecated file.**
