# AI Agent Resource Rule: 500 AI Agents Projects (Agno)

Rule intent
- Treat the following resource as a curated external reference for agent frameworks, workflows, and real-world use cases, with emphasis on the Agno framework section:
  - https://github.com/ashishpatel26/500-AI-Agents-Projects?tab=readme-ov-file#framework-name-agno

How to use this rule in this repo
- Discovery and planning: Consult the Agno section (and adjacent framework sections like CrewAI, AutoGen, LangGraph) for patterns and inspiration when planning multi‑agent features.
- Architecture alignment: Cross-reference examples with our PRD multi-agent pipeline (Research → Database → Knowledge Graph) to adopt proven patterns where applicable.
- Implementation guardrails:
  - Do not copy code verbatim from external repos into production paths.
  - Verify licenses and attribution before adopting any external snippets.
  - Prototype in isolated sandboxes (e.g., research/ or agno/workflows/) and add tests before promotion.
- Documentation & traceability: When a pattern from this resource influences design or code, note the link and rationale in the relevant design doc or PR description.

Scope
- This rule is advisory but high-signal: prefer these examples when evaluating or demonstrating agent orchestration flows, tool use patterns, and evaluation loops.
- Avoid framework lock-in; translate ideas into our existing architecture and standards.

Security & quality checklist
- Validate environment and secrets are not exposed in copied examples.
- Add input validation and error boundaries consistent with our guidelines (Zod, guard clauses, early returns).
- Write unit tests (Jest/RTL) for adopted patterns before merging.

Maintenance
- Last reviewed: 2025-09-09
- Owners: Agent Mode (terminal assistant)
- Update cadence: Revisit quarterly or when major agent framework updates occur.

Notebooks added to local context
- apps/disclosure-rag/resources/notebooks/INDEX.md (overview)
- apps/disclosure-rag/resources/notebooks/media_trend_analysis_agent.md (ID: BDcW49EEOkNEWUxzT5zIsa)
- apps/disclosure-rag/resources/notebooks/deepknowledge_ai_agent.md (ID: 6XUGfVbN5AxhNIdLDDQiQz)
- apps/disclosure-rag/resources/notebooks/research_agent_journalistic.md (ID: jznm60IwJDICXfzmk826Gu)
- apps/disclosure-rag/resources/notebooks/advanced_research_agent_exa.md (ID: lTzRR73jziIpJ426HnCsCX)

