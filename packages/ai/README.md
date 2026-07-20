---
schema_version: '1.0'
kind: documentation
id: ut.agent-suite.readme
suite_version: 2.0.0
---
# Ultraterrestrial Canonical Agent Suite

This directory contains the completed agent definitions for the Ultraterrestrial research system.

## Contents

```text
ultraterrestrial-agent-definitions-v2/   # Cursor adapters: .cursor/agents/ via generate-research-agents.mjs
├── README.md
├── MANIFEST.md
├── agents/
│   ├── 01-majestic-master-controller.md
│   ├── 02-lone-gunmen-realtime-monitor.md
│   ├── 03-fort-source-ingestor.md
│   ├── 04-knapp-investigative-journalism.md
│   ├── 05-ruppelt-schema-extractor.md
│   ├── 06-scully-evidence-evaluator.md
│   ├── 07-hynek-scientific-anomaly.md
│   ├── 08-mack-witness-psychology.md
│   ├── 09-grusch-protected-disclosure.md
│   ├── 10-mellon-government-disclosure.md
│   ├── 11-pope-official-narrative.md
│   ├── 12-pilkington-information-operations.md
│   ├── 13-michel-spatiotemporal-correlation.md
│   ├── 14-mulder-pattern-recognition.md
│   ├── 15-vallee-ontology-curator.md
│   ├── 16-masters-alternative-origin.md
│   ├── 17-pasulka-religion-myth.md
│   └── 18-keel-strategic-synthesis.md
├── adversaries/
│   └── doty-pattern.md
└── shared/
    ├── 00-operating-contract.md
    ├── 01-tool-registry.md
    └── 02-output-schemas.md
```

## Design Decisions

- Namesakes are methodological archetypes, never impersonations or authorities.
- Eighteen agents are trusted canonical actors.
- DOTY PATTERN is a restricted adversarial profile, not a trusted agent.
- Every agent has explicit tool allowlists, denied capabilities, write boundaries, handoffs, system prompts, and output contracts.
- Logical tools are runtime-neutral and must be bound through an adapter layer.
- Neon Postgres via `@db/postgres` is the live application data source; Xata is retired. Agents never receive unrestricted database access.
- No autonomous schema migration is permitted.
- Research progresses through **Pin → Thread → Hunch → Canvas → Quilt**.

## Runtime Integration

1. Parse the YAML front matter into an agent registry.
2. Load the shared operating contract before the role-specific system prompt.
3. Enforce tool allowlists at runtime; prompt instructions alone are insufficient.
4. Pass a structured task envelope and require the named output schema.
5. Store all writes in staging or append-only ledgers according to `write_scope`.
6. Route mandatory reviews before promotion or publication.
7. Keep DOTY PATTERN in a separate sandbox and strip its output from retrieval indexes.

## Suggested TypeScript Shape

```ts
export interface UltraterrestrialAgentDefinition {
  schema_version: "1.0";
  kind: "ultraterrestrial_agent";
  status: "canonical";
  agent: {
    id: string;
    codename: string;
    display_name: string;
    role: string;
    class: string;
    version: string;
    tagline: string;
  };
  tool_policy: {
    allowed: string[];
    denied: string[];
    write_scope: string;
  };
  handoffs: {
    receives_from: string[];
    sends_to: string[];
    mandatory_review: string[];
  };
  output: {
    primary_schema: string;
    citations_required: boolean;
    confidence_required: boolean;
    provenance_required: boolean;
  };
}
```

## Validation

The included front matter has been parsed with a YAML parser and checked for unique IDs, codenames, valid inherited files, and output-schema references.
