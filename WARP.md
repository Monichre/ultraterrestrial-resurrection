# WARP.md - DEPRECATED

⚠️ **This file has been superseded by the new agent configuration system.**

## 🔄 New Structure

All terminal commands and development workflows have been consolidated into:

### 📖 Master Guidelines

- **`AGENTS.md`** - Comprehensive development guidelines including:
  - All development commands (bun, python, database)
  - Project structure and monorepo organization
  - Quick start commands for all applications
  - Testing and validation workflows

### 🤖 Platform-Specific Configuration

- **`docs/agents/warp.md`** - Warp terminal specific shortcuts and workflows
- References `AGENT.md` for all command documentation
- Warp-specific features and terminal organization

## 🎯 What You'll Find in AGENT.md

All the command information from this file is now in `AGENT.md`:

### Main Application Commands

```bash
bun run dev:app              # Start dev server (port 3000)
bun run build:app           # Production build
bun run test:app            # Run tests
bun run lint                # ESLint check
bun run storybook           # Component development
```

### RAG System Commands  

```bash
cd apps/disclosure-rag
python streamlit_app.py     # Dashboard
python api_server.py        # API server
python cli.py              # CLI interface
```

### Database Operations

```bash
cd packages/db
bun run seed               # Seed database
bun run query              # Quick query
bun run analyze            # Database analysis
```

## ⚡ Quick Migration

Instead of this file, use:

1. **`AGENT.md`** - For all commands and development workflows
2. **`docs/agents/warp.md`** - For Warp-specific terminal features only
3. **Project structure reference** - Documented in `AGENT.md`

## 🏗 Architecture Overview (now in AGENT.md)

The monorepo structure and all development guidance is now centralized in `AGENT.md`:

- **Project Structure** - Complete monorepo organization
- **Technology Stack** - Frontend, backend, and tooling
- **Development Commands** - All commands for all platforms
- **Three-Tier Project Management** - Planning and execution system

---

**Please use `AGENT.md` and `docs/agents/warp.md` instead of this deprecated file.**
