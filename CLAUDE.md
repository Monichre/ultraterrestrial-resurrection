# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: ARCHITECTURE-FIRST APPROACH

### MANDATORY FIRST STEPS FOR ALL AGENTS:
1. **READ ARCHITECTURE_OVERVIEW.md FIRST** - Understand system foundations before any code work
2. **Understand the AI Infrastructure** - Prometheus + Vector Storage powers everything
3. **Map your task to existing systems** - Most integration already exists
4. **Ask clarifying questions** - Better to understand than assume

### ⚠️ NEVER ASSUME:
- Systems are separate when they're actually deeply integrated
- "85% AI connectivity" means low integration (it's sophisticated functional integration)
- Unification requires major architectural changes
- Code metrics tell the complete architecture story

### Agent Workflow Guidelines:
1. Any new agent must read ARCHITECTURE_OVERVIEW.md first
2. Red flags prevent common architectural misunderstandings
3. Validation questions ensure comprehension before work begins
4. Documentation hierarchy guides understanding progression

### Documentation-First Protocol:
1. ARCHITECTURE_OVERVIEW.md - Mandatory first read explaining the unified AI foundation
2. AGENT_ONBOARDING_CHECKLIST.md - Step-by-step validation process
3. Updated CLAUDE.md - Architecture-first approach with clear warnings
4. Documentation-First Protocol - Required reading order established

## Project Overview

**Ultraterrestrial Resurrection** is a sophisticated UFO/UAP research platform with AI-powered analysis and spatial intelligence. It's a monorepo containing multiple applications:

- **Main Research App** (`/apps/app/`) - Interactive mindmaps, 3D visualizations, and spatial intelligence
- **Disclosure RAG** (`/apps/disclosure-rag/`) - Triple RAG document processing system  
- **Research Canvas** (`/apps/research-canvas/`) - TipTap-based research editor with RAG integration

Review [Steering](.kiro/steering)