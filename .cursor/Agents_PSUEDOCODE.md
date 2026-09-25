# Agents_PSUEDOCODE

**Date:** 2026-07-18  
**Scope:** Review and improve `.cursor/agents/` research subagents

## Review findings

1. **Broken Task-tool descriptions** — Generator emits `description: >-` folded YAML. Cursor's Task catalog shows bare `>-` for every research agent, so the parent cannot route by role.
2. **Missing Cursor frontmatter** — Docs support `model` and `readonly`; current files omit both.
3. **Prompt bloat** — ~10KB / ~240 lines each. Shared contract + structured mandate + identity + mission + nested system-prompt fence + null YAML schemas duplicate the same rules ~4×.
4. **Runtime fiction** — Logical tool lists look like executable tools; binding note is easy to miss under the noise.
5. **Stale source claim** — Canonical README still says Xata is the app data source.
6. **Awkward source path** — `ultraterrestrial-agent-definitions-v2 3/` looks like a macOS duplicate download.

## Target output shape (per agent)

```
FRONTMATTER:
  name: kebab-codename
  description: ONE LINE, double-quoted, triggers + anti-triggers, no >-
  model: inherit
  readonly: true

BODY:
  1. Role header + tagline
  2. When invoked (3–5 steps)
  3. Compact epistemic contract (~12 lines, once)
  4. Mandate (may / may not) from YAML
  5. Unfenced system prompt extracted from source ```text``` block
  6. Operating procedure
  7. Cursor capability binding (logical tools = authority, not APIs)
  8. Output contract (schema name + required meta fields only — no null YAML)
  9. Handoffs + failure modes
  10. Repo grounding (Postgres, not product runtime agents)
```

## Generator algorithm

```
resolveSourceRoot():
  prefer "ultraterrestrial-agent-definitions-v2"
  else fall back to "ultraterrestrial-agent-definitions-v2 3"

for each AGENT_FILE:
  parse YAML frontmatter + body
  extract systemPrompt from first ```text ... ``` fence
  extract section("Operating Procedure")
  extract section("Failure Modes...")
  extract handoffs from metadata.handoffs
  build flat description from DESCRIPTION_BY_CODENAME (enriched)
  render slim agent markdown
  validate:
    name matches /^[a-z0-9-]+$/
    description has no leading ">-"
    description length 80–320 chars
    systemPrompt non-empty
    unique agent.id / codename

write README with:
  roster, routing dialectics, vision-role map, regenerate command
```

## Non-goals

- Do not invent runtime product agents
- Do not include DOTY_PATTERN as a trusted subagent
- Do not change the two live AI paths (mindmap / Prometheus)
