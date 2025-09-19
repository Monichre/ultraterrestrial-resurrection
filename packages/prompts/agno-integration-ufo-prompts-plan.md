# Agno Integration Plan for Enhanced UFO Prompts

## Objectives

- Operationalize the enhanced UFO/UAP prompts with Agno agents, teams, and workflows.
- Enforce structured outputs for entity/relationship extraction and evidence evaluation.
- Integrate with existing Xata/knowledge layers while preserving current accuracy and workflows.

## Artifacts Analyzed

- `apps/disclosure-rag/research/prompts/enhanced_ufo_prompts.py` (ENHANCED_NER_PROMPT)
- `apps/disclosure-rag/research/prompts/ultra-enhanced-prompts.md` (4-role orchestration suite)

## Architecture Mapping to Agno

- Agents (specialized):
  - `ufo_orchestrator`: Applies query decomposition, strategy selection, decision matrices, and routing.
  - `ufo_ner_extractor`: Uses ENHANCED_NER_PROMPT to produce JSON entities/relationships + credibility.
  - `ufo_pattern_specialist`: Detects temporal/geographic/behavioral/tech/consciousness patterns.
  - `ufo_evidence_evaluator`: Validates media, chain-of-custody, and hoax indicators; assigns evidence quality.
  - `ufo_synthesis`: Produces final, decision-traceable synthesis with implications and next actions.

- Team: `ufo_research_team` (Agno `Team`)
  - Mode: `route` for strategy-led sequencing; optional `parallel` for fan-out phases (e.g., pattern + evidence).
  - Orchestrator routes to specialists based on the strategy templates (breaking event, historical analysis, pattern detection).

- Workflows: encode canonical flows using Agno `Workflow`:
  - Congressional Testimony, Mass Sighting, Document Leak (prebuilt phases and expected outputs).

## Tools & Data Adapters

- Web: `DuckDuckGoTools` for corroboration.
- Validation & Verification (implement as Agno tools):
  - `weather_at(datetime, lat, lon)`
  - `astronomy_at(datetime, lat, lon)` (satellites, planetary events)
  - `adsb_activity_near(datetime_range, bbox)`
  - `satellite_positions_at(datetime, lat, lon)`
  - `foia_search(query, sources)`
  - `exif_analyze(media_url|bytes)` and `media_forensics_check(media)`
- Data connectors:
  - Xata adapter: upsert/map extracted entities to existing tables, preserve IDs, link new relationships and metadata.
  - Sightings DB adapter: natural-language → SQL for pattern queries (pgvector/pg, geo helpers).
  - Knowledge graph/KB adapter: retrieve and cross-link entities (hybrid search via `AgentKnowledge` + PgVector).

## Knowledge & Memory

- Use `AgentKnowledge` + `PgVector(SearchType.hybrid)` for role-relevant retrieval (short, domain-specific chunks).
- Persist sessions via `PostgresAgentStorage` per agent/team for auditability and iterative improvements.

## Structured Outputs & Validation

- NER JSON schema (from ENHANCED_NER_PROMPT) → Pydantic models; validate and auto-repair via retry-on-violation.
- Pattern/Evidence agents: define concise, typed outputs with confidences and decision factors for downstream scoring.
- Add deduplication/fuzzy matching prior to inserts to Xata; store provenance and credibility metrics.

## Minimal Integration Sketches

### Dedicated NER Agent (instructions shortened)

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.agent.postgres import PostgresAgentStorage
from db.session import db_url

ner_agent = Agent(
    name="UFO NER",
    agent_id="ufo-ner",
    model=OpenAIChat(id="gpt-4o"),
    instructions=("ENHANCED_NER_PROMPT...\nReturn only valid JSON matching the schema."),
    storage=PostgresAgentStorage(table_name="ufo_ner_sessions", db_url=db_url),
    markdown=False,
    debug_mode=True,
)
```

### Orchestrated Team

```python
from agno.team.team import Team
from agno.models.openai import OpenAIChat
from agno.storage.postgres import PostgresStorage
from db.session import db_url

ufo_team = Team(
  name="UFO Research Team",
  team_id="ufo-team",
  mode="route",
  members=[ufo_orchestrator, ufo_ner, ufo_pattern, ufo_evidence, ufo_synthesis],
  model=OpenAIChat(id="gpt-4o"),
  storage=PostgresStorage(table_name="ufo_team_runs", db_url=db_url, mode="team", auto_upgrade_schema=True),
  show_members_responses=True,
  debug_mode=True,
)
```

## Implementation Steps (Checklist)

1) Split prompts into per-role system prompts
- Extract role-specific sections from `ultra-enhanced-prompts.md` into concise instructions.
- Use `ENHANCED_NER_PROMPT` for `ufo_ner_extractor`; add strict JSON output guidance.

2) Add agents and team
- Create: `apps/disclosure-rag/agno/agents/ufo_orchestrator.py`, `ufo_ner.py`, `ufo_pattern.py`, `ufo_evidence.py`, `ufo_synthesis.py`.
- Create team: `apps/disclosure-rag/agno/teams/ufo_research.py`; expose via `apps/disclosure-rag/agno/agents/operator.py` and API routes.

3) Implement tools
- Ship minimal stubs for weather/astronomy/adsb/satellites/foia/exif; wire to orchestrator and specialists.

4) Define schemas and validators
- Pydantic models for NER entities/relationships; strict validation + retry.
- Light schemas for pattern/evidence outputs with confidence fields.

5) Data adapters and persistence
- Xata adapter for entity upsert/linking; include provenance and credibility aggregation.
- Knowledge retrieval via `AgentKnowledge` (PgVector) for context-aware reasoning.

6) Workflows for common flows
- Encode 3 flows as `Workflow`s: Congressional Testimony, Mass Sighting, Document Leak.

7) Testing & QA
- Unit tests for schema validation and adapter mapping.
- E2E dry-runs for each workflow with sample inputs.

## Risks & Mitigations

- Prompt length/cognitive load → Split by role, keep instructions tight; move “algorithms” into tools.
- Output drift → Enforce schemas, retries, and minimal few-shot examples.
- Data duplication → Fuzzy matching + ID mapping before upsert; keep provenance and confidence trails.
- Tool reliability → Start with deterministic stubs; later attach live APIs behind adapters.

## Next Actions

- [ ] Approve agent/team file scaffolding and prompt splits
- [ ] Confirm initial tool surface (weather/astronomy/adsb/foia/exif)
- [ ] Decide on schema fields for NER and pattern/evidence outputs
- [ ] Prioritize which workflow to ship first (recommend: Mass Sighting)
