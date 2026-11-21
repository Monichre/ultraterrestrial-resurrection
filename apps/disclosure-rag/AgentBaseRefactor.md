## Agent Base Refactor – Technical Design (Deep Research Team compatible)

### Context

The current agent layer under `apps/disclosure-rag/agents/` has grown organically and exhibits duplication and drift:

- Prompts and model IDs are duplicated in multiple places (e.g., `agents/prompts.py` vs inline copies in `agents/research_crew.py`).
- Model constants are inconsistent (e.g., `agents/base.py` defines `GPT_5`, `CLAUDE_SONNET_4`, while some modules reference `GPT4O`, `GPT4_TURBO`, `CLAUDE_SONNET`, etc.).
- Some modules contain conflicting/duplicate factory functions (e.g., `agents/network_agent.py` has two `create_network_agent` definitions).
- Tools selection logic is spread between `utils.tools` and individual agents.
- The “Deep Research” orchestration (`agents/research_crew.py`, `agents/uap_deep_research_agent.py`) partially redefines prompts, model IDs, and agent construction rather than using a common base.

This refactor standardizes model selection, toolsets, prompts, and agent construction behind a single factory and registry, while providing a team builder that composes deep research agents consistently.

### Goals

- Single source of truth for:
  - Model aliases and provider-specific IDs
  - Agent prompts by agent type
  - Toolsets by agent type
- A common factory that builds any specialized agent with consistent defaults (storage, markdown, history, etc.).
- A typed registry that exposes discoverable agent types, their configs, and their factory entry points.
- Config-driven “Deep Research Team” assembly using the registry (compatible with Agno Team/AgentGroup and our FastAPI routes).
- Backward-compatible thin wrappers for existing specialized agents (e.g., `create_claims_evidence_agent`) delegating to the factory.

Non-goals:

- Rewriting business prompts (we will centralize them, not re-author them).
- Changing Agno as the underlying agent framework.
- Changing external APIs beyond a controlled upgrade path (operator/router exposed surfaces remain stable).

### Target Architecture (modules and responsibilities)

1) Model alias registry

- File: `agents/core/model_registry.py`
- Purpose: Map logical model aliases to concrete provider model IDs; resolve to `OpenAIChat` vs `Claude` automatically.
- Examples:
  - `gpt_default -> gpt-5`
  - `claude_default -> claude-4-sonnet-20250115`
  - Preserve shims for legacy names: `gpt4o -> gpt-4.1-2025-04-14`, `gpt4_turbo -> gpt-4.1-2025-04-14`, `claude_sonnet_35 -> claude-3-5-sonnet-20241022`.

2) Toolset registry

- File: `agents/core/tools_registry.py`
- Purpose: Centralize per-agent-type tool bundles. Initially delegates to `utils.tools.get_tools_for_agent(agent_type)` to avoid churn, but provides an overridable mapping for fine-grained control.
- Example keys: `historical`, `claims_evidence`, `geospatial`, `network`, `documentation`, `dataviz`, `theory`, `organization`, `testimony`, `api_integration`.

3) Prompts source of truth

- File: keep `agents/prompts.py` as the single prompt map; delete/replace inline copies in `research_crew.py`.

4) Common agent factory

- File: `agents/core/factory.py`
- Purpose: Create configured `agno.Agent` instances given an `AgentConfig` (name, agent_type, model_alias, storage table/db, flags). Handles model resolution, toolset selection, and prompt wiring.
- Guarantees: consistent storage, markdown, `add_history_to_messages`, `add_datetime_to_instructions`, and `show_tool_calls` defaults.

5) Agent registry

- File: `agents/core/registry.py`
- Purpose: A typed registry that knows all agent types, their default configs, and a callable to construct each via the common factory. Exposes:
  - `register_agent(agent_key, config)` decorator/helper
  - `get_agent_config(agent_key)` and `create_agent(agent_key, overrides)`
  - `list_agent_keys()` for discovery (used by API routes)

6) Specialized agents (thin wrappers)

- Files: existing `agents/*_agent.py` updated to call common factory and return the `Agent`. Their `create_*` functions become very small (read defaults, forward to factory). Prompts and tools are no longer duplicated locally.
- Keep backward-compatible function names/exports to avoid breaking imports.

7) Deep Research Team builder

- File: `agents/teams/deep_research.py`
- Purpose: Build a research team/AgentGroup using the registry and a config object. Supports named bundles (e.g., `"deep_research_default"`) and ad-hoc lists of agent keys. Compatible with `agno.Team`/`AgentGroup` and playground.

8) Operator API alignment

- File: `agents/operator.py` (existing)
- Purpose: Implement `AgentType` Enum from registry keys; implement `get_available_agents()` from `list_agent_keys()`; implement `get_agent(agent_id, model_id, user_id, session_id)` by delegating to the registry/factory.

### Data Flow

- API → `agents/operator.py` → `registry.create_agent(agent_key, overrides)` → `factory.create_agent(config)` → returns configured `agno.Agent`.
- Deep Research Apps (Playground, Streamlit) → `agents/teams/deep_research.py` → registry to instantiate members → `agno.Team`/`AgentGroup`.

### Detailed Changes (hotspots)

- `agents/research_crew.py`
  - Remove inline `AGENT_PROMPTS`/`AGENT_CONFIG`; import prompts from `agents/prompts.py` and fetch agent constructors from `agents/core/registry.py`.
  - Create agents with `registry.create_agent(key)` instead of hand-assembling.

- `agents/base.py`
  - Replace hard-coded model constants with calls into `model_registry`. Keep a minimal shim for legacy constants so external callers don’t break.

- `agents/network_agent.py`
  - Eliminate duplicate `create_network_agent` definitions. Keep one function that simply forwards to the common factory with `agent_type="network"`.

- `agents/content_analysis_agent.py`, `agents/disclosure_assistant.py`
  - Keep as specialized power-users of OpenAI Assistants/threads. Where they create Agno `Agent`s, use model aliases from `model_registry` for consistency.

- `agents/uap_deep_research_agent.py`
  - Reuse `agents/teams/deep_research.py` for team assembly where applicable; continue to expose higher-level cross-reference/report APIs.

### Backward Compatibility

- Keep all `create_*_agent` functions exported by their modules; internally they call the common factory.
- Keep `agents/__init__.py` exports stable; update its `AGENT_FACTORIES` to pull from `agents/core/registry.py`.
- Maintain environment variable usage (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, optional vector store IDs) unchanged.

### Acceptance Criteria

- Single prompt source: No inline prompt maps remain in `research_crew.py`.
- Single model alias source: No hard-coded provider IDs outside `model_registry` (except specialist Assistant code where strictly required).
- Single toolset source: Agents obtain tools through `tools_registry` (or `utils.tools` via the registry), not ad-hoc per file.
- `agents/operator.py` responds with agent IDs from the registry and can instantiate any registered agent.
- `agents/network_agent.py` no longer contains duplicate factory functions.
- `agents/base.py` no longer exports stale constant names; legacy names are shims mapping to `model_registry`.

### Rollout Plan

1) Introduce `model_registry.py`, `tools_registry.py`, `factory.py`, `registry.py` (no behavior change yet).
2) Switch `agents/__init__.py` and `agents/operator.py` to use the registry for discovery and creation.
3) Migrate `research_crew.py` to use registry + prompts module; delete inline duplicates.
4) Thin the specialized agent factories to one-liners (forward to common factory).
5) Add `agents/teams/deep_research.py` and update playground wiring to use it.
6) Run tests and verify FastAPI endpoints in `agno/api/routes/agents.py` still work (stream and non-stream paths).

### Risks & Mitigations

- Import cycles between `utils.tools` and `agents/*` → keep `tools_registry` thin; only call `utils.tools.get_tools_for_agent` from the registry layer (no back-imports from `utils` into agents).
- Model naming drift → centralize in `model_registry` and keep legacy aliases for a full release cycle.
- Hidden direct imports of old constants → quick grep and create shims in `agents/base.py` (deprecated warnings).

### Directory Layout (after refactor)

```
apps/disclosure-rag/agents/
  core/
    factory.py           # Common Agent factory
    model_registry.py    # Aliases → provider IDs
    tools_registry.py    # AgentType → tools[]
    registry.py          # Register/list/create
  teams/
    deep_research.py     # Team/AgentGroup builder
  prompts.py             # Single source of prompts
  __init__.py            # Exports, AGENT_FACTORIES (from core/registry)
  ...specialized agents...
```

### Test Strategy

- Unit tests:
  - Model resolution (aliases → provider classes/IDs)
  - Toolset retrieval by agent type
  - Registry registration and creation (happy path + override model alias)
- Integration tests:
  - FastAPI `POST /agents/{id}/runs` (stream and non-stream)
  - Deep Research Team builder returns expected set of agents
- Regression checks:
  - Existing convenience creators still return working agents (spot-check 2–3 types)

### Open Questions

- Should we move `utils.tools` under `agents/core` to reduce mental hops? For now, keep as-is to avoid broad changes.
- Should `uap_deep_research_agent.py` be migrated to the team builder fully? We’ll start by allowing both paths; consolidate later.
