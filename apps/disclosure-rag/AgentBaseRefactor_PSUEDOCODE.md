## Agent Base Refactor – Pseudocode

### Types

```python
# agents/core/types.py (inline here as pseudocode)
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Any

Agent = Any  # from agno.agent

@dataclass
class AgentConfig:
    key: str
    name: str
    agent_type: str              # e.g., "historical", "network"
    model_alias: str             # e.g., "gpt_default", "claude_default"
    storage_table: Optional[str] = None
    storage_db: str = "tmp/research_agents.db"
    extra_instructions: Optional[List[str]] = None
    prompt_key: Optional[str] = None  # defaults to agent_type

CreateFn = Callable[[AgentConfig, Dict[str, Any]], Agent]
```

### Model Registry

```python
# agents/core/model_registry.py
MODEL_ALIASES = {
    "gpt_default": {"provider": "openai", "id": "gpt-5"},
    "gpt4o":       {"provider": "openai", "id": "gpt-4.1-2025-04-14"},
    "gpt4_turbo":  {"provider": "openai", "id": "gpt-4.1-2025-04-14"},
    "claude_default": {"provider": "anthropic", "id": "claude-4-sonnet-20250115"},
    "claude_sonnet_35": {"provider": "anthropic", "id": "claude-3-5-sonnet-20241022"},
}

def resolve_model(alias: str):
    entry = MODEL_ALIASES.get(alias)
    if not entry:
        raise ValueError(f"Unknown model alias: {alias}")
    if entry["provider"] == "openai":
        from agno.models.openai import OpenAIChat
        return OpenAIChat(id=entry["id"])    
    else:
        from agno.models.anthropic import Claude as AnthropicChat
        return AnthropicChat(id=entry["id"])
```

### Toolset Registry

```python
# agents/core/tools_registry.py
from utils.tools import get_tools_for_agent

OVERRIDES = {
    # optionally override per type, else fall back to utils.tools
    # "network": [CustomToolA(), CustomToolB()],
}

def resolve_tools(agent_type: str):
    if agent_type in OVERRIDES:
        return OVERRIDES[agent_type]
    return get_tools_for_agent(agent_type)
```

### Common Factory

```python
# agents/core/factory.py
from agno import Agent as AgnoAgent, PromptTemplate
from agno.storage.sqlite import SqliteStorage
from .model_registry import resolve_model
from .tools_registry import resolve_tools
from agents.prompts import AGENT_PROMPTS

def create_common_agent(cfg: AgentConfig, overrides: dict | None = None) -> AgnoAgent:
    o = overrides or {}
    model_alias = o.get("model_alias", cfg.model_alias)
    model = resolve_model(model_alias)
    tools = resolve_tools(cfg.agent_type)
    prompt_key = cfg.prompt_key or cfg.agent_type
    prompt = AGENT_PROMPTS.get(prompt_key, "You are a UAP/UFO research assistant.")
    if cfg.extra_instructions:
        # merge extra instructions into prompt or set Agent.instructions
        pass
    storage = SqliteStorage(
        table_name=(cfg.storage_table or cfg.name.lower().replace(" ", "_")),
        db_file=o.get("storage_db", cfg.storage_db),
    )
    return AgnoAgent(
        name=cfg.name,
        model=model,
        tools=tools,
        prompt_template=PromptTemplate(prompt),
        storage=storage,
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        markdown=True,
        show_tool_calls=True,
    )
```

### Agent Registry

```python
# agents/core/registry.py
from typing import Dict, List
from .factory import create_common_agent

_REGISTRY: Dict[str, AgentConfig] = {}

def register_agent(cfg: AgentConfig):
    if cfg.key in _REGISTRY:
        raise ValueError(f"Duplicate agent key: {cfg.key}")
    _REGISTRY[cfg.key] = cfg
    return cfg

def list_agent_keys() -> List[str]:
    return sorted(_REGISTRY.keys())

def get_agent_config(key: str) -> AgentConfig:
    if key not in _REGISTRY:
        raise KeyError(key)
    return _REGISTRY[key]

def create_agent(key: str, overrides: dict | None = None):
    cfg = get_agent_config(key)
    return create_common_agent(cfg, overrides)
```

### Register Built-ins

```python
# agents/__init__ (registration snippet shown)
from agents.core.registry import register_agent
from agents.core.types import AgentConfig

register_agent(AgentConfig(
    key="historical",
    name="HistoricalTimelineAgent",
    agent_type="historical",
    model_alias="claude_default",
))

register_agent(AgentConfig(
    key="network",
    name="ResearchNetworkAgent",
    agent_type="network",
    model_alias="gpt_default",
))

# ...repeat for: claims_evidence, geospatial, documentation, dataviz, theory, organization, testimony, api_integration
```

### Specialized Agent Thin Wrapper (example)

```python
# agents/claims_evidence_agent.py (reduced)
from agents.core.registry import create_agent

def create_claims_evidence_agent(name: str = None, model_id: str = None, storage_path: str = None):
    overrides = {}
    if name: overrides["name"] = name  # optional enhancement: factory can accept name override
    if model_id: overrides["model_alias"] = model_id  # allow alias or provider id by shim
    if storage_path: overrides["storage_db"] = storage_path
    return create_agent("claims_evidence", overrides)
```

### Deep Research Team Builder

```python
# agents/teams/deep_research.py
from agno.team.team import Team
from agno.agent import Agent
from agents.core.registry import create_agent

DEFAULT_TEAM = ["historical", "geospatial", "claims_evidence", "testimony", "network", "documentation", "dataviz"]

def build_deep_research_team(members: list[str] | None = None, name: str = "DeepResearchTeam") -> Team:
    keys = members or DEFAULT_TEAM
    agents: list[Agent] = [create_agent(k) for k in keys]
    return Team(
        members=agents,
        name=name,
        instructions=(
            "You are a coordinated deep research team. Use historical first, then geospatial,"
            " then claims_evidence and testimony, then map network/documentation, and provide dataviz guidance."
        ),
        show_tool_calls=True,
        show_members_responses=True,
        get_member_information_tool=True,
        add_member_tools_to_system_message=True,
    )
```

### Operator API Integration

```python
# agents/operator.py (essentials)
from enum import Enum
from agents.core.registry import list_agent_keys, create_agent

class AgentType(str, Enum):
    # dynamically generate at import time
    pass

def _init_enum():
    keys = list_agent_keys()
    # build Enum members dynamically (implementation detail)
    # fallback: pre-generate from known keys

def get_available_agents() -> list[str]:
    return list_agent_keys()

def get_agent(agent_id: AgentType, model_id: str | None = None, user_id: str | None = None, session_id: str | None = None):
    overrides = {}
    if model_id:
        overrides["model_alias"] = model_id
    # user_id/session_id can be wired into storage_table suffixing if desired
    return create_agent(str(agent_id), overrides)
```

### Research Crew Update (excerpt)

```python
# agents/research_crew.py (replace manual builds)
from agents.core.registry import create_agent

class ResearchCrew:
    def __init__(self, storage_path="tmp/research_agents.db"):
        self.agents = {
            "HA": create_agent("historical"),
            "CE": create_agent("claims_evidence"),
            "GV": create_agent("geospatial"),
            "RN": create_agent("network"),
            "DL": create_agent("documentation"),
            "DV": create_agent("dataviz"),
            "TD": create_agent("theory"),
            "OR": create_agent("organization"),
            "TV": create_agent("testimony"),
            "API": create_agent("api_integration"),
        }
        # rest unchanged
```

### Migration Checklist (code-level)

1. Add `agents/core/{model_registry,tools_registry,factory,registry}.py`.
2. Switch `agents/__init__.py` exports and `AGENT_FACTORIES` to `core/registry`.
3. Replace inline prompt/config definitions in `research_crew.py` with registry calls.
4. Thin specialized agent factories to call `create_agent(key)`.
5. Add `agents/teams/deep_research.py`; update playground wiring where applicable.
6. Update `agents/operator.py` to enumerate from registry.
7. Verify FastAPI routes (`agno/api/routes/agents.py`) still stream and return results.

```


