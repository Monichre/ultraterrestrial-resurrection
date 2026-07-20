# Ultraterrestrial Cursor Research Subagents

Generated from `ultraterrestrial-agent-definitions-v2/agents/` by:

```bash
bun .cursor/generate-research-agents.mjs
```

These are **project-scoped, readonly** Cursor development/research specialists.
They do not add runtime product agents and do not alter the two live AI paths
(disclosure mindmap + Prometheus chat).

The restricted `DOTY_PATTERN` adversarial profile is intentionally excluded.

## Roster

| Agent | Role | Class |
|---|---|---|
| [`MAJESTIC`](./majestic.md) | Master Investigation Controller | `orchestration` |
| [`LONE_GUNMEN`](./lone-gunmen.md) | Real-Time Monitor and Flap Detection Network | `monitoring` |
| [`FORT`](./fort.md) | Archive Ingestor and Source Acquisition Agent | `acquisition` |
| [`KNAPP`](./knapp.md) | Investigative Journalism and Source Development Analyst | `acquisition` |
| [`RUPPELT`](./ruppelt.md) | Schema-First Fact and Event Extractor | `extraction` |
| [`SCULLY`](./scully.md) | Evidence Evaluation and Conventional-Explanation Analyst | `evidence` |
| [`HYNEK`](./hynek.md) | Scientific Anomaly and Technical Feasibility Analyst | `evidence` |
| [`MACK`](./mack.md) | Witness Psychology and Experiencer Testimony Analyst | `evidence` |
| [`GRUSCH`](./grusch.md) | Protected Disclosure and Claim-Chain Analyst | `institutions` |
| [`MELLON`](./mellon.md) | Government Structure and Disclosure Policy Analyst | `institutions` |
| [`POPE`](./pope.md) | Official Narrative and Institutional Communications Analyst | `institutions` |
| [`PILKINGTON`](./pilkington.md) | Information Operations and Narrative Contamination Analyst | `institutions` |
| [`MICHEL`](./michel.md) | Timeline, Geography and Flap-Correlation Analyst | `pattern` |
| [`MULDER`](./mulder.md) | Pattern Recognition and Hypothesis-Generation Analyst | `pattern` |
| [`VALLEE`](./vallee.md) | Ontology, Entity and Phenomenon-Model Curator | `pattern` |
| [`MASTERS`](./masters.md) | Cryptoterrestrial and Alternative-Origin Hypothesis Analyst | `pattern` |
| [`PASULKA`](./pasulka.md) | Religion, Technology and Myth-Formation Analyst | `pattern` |
| [`KEEL`](./keel.md) | Strategic Synthesis and High-Strangeness Integration Director | `synthesis` |

## When to route where

| Need | Agent |
|---|---|
| Plan / gate a multi-specialist investigation | `majestic` |
| Fresh reports, flaps, duplication | `lone-gunmen` |
| Acquire / fingerprint sources | `fort` |
| Trace claim origins / interview prep | `knapp` |
| Extract structured facts | `ruppelt` |
| Credibility / prosaic alternatives (Skeptic) | `scully` |
| Physics / sensors / residual anomaly | `hynek` |
| Witness testimony (non-pathologizing) | `mack` |
| Whistleblower claim chains | `grusch` |
| Agencies / legislation / oversight | `mellon` |
| Official wording / FOIA language | `pope` |
| Contamination / IO / laundering | `pilkington` |
| Time–space clustering | `michel` |
| Patterns + falsifiable hunches | `mulder` |
| Ontology / aliases | `vallee` |
| Alternative-origin models | `masters` |
| Myth / sacred-tech resonance | `pasulka` |
| Cross-domain synthesis | `keel` |

## Core dialectics

- MULDER ↔ SCULLY — pattern generation vs evidentiary restraint
- VALLEE ↔ HYNEK — ontological openness vs physical constraint
- MACK ↔ SCULLY — experiential seriousness vs testimony limits
- GRUSCH ↔ SCULLY — testimony architecture vs evidentiary sufficiency
- KNAPP ↔ PILKINGTON — source development vs contamination
- KEEL ↔ MAJESTIC — expansive synthesis vs publication control

## Vision-role map

Maps to `docs/vision/AGENT_ARCHITECTURE_BRIEF.md` stances (conceptual, not runtime processes):

| Vision role | Cursor agents |
|---|---|
| Archivist | `fort`, `ruppelt`, `lone-gunmen` |
| Analyst | `knapp`, `michel`, `mellon`, `pope`, `grusch` |
| Skeptic | `scully`, `hynek`, `pilkington` |
| Mythographer | `pasulka`, `masters` (hypothesis-only) |
| Cartographer | `vallee`, `mulder`, `keel`, `majestic` |

## Operating model

Each file embeds a compact epistemic contract, role mandate, unfenced role prompt,
operating procedure, logical tool boundaries, output contract, and handoffs.

Frontmatter uses flat `description` strings (not YAML `>-`) so Cursor Task routing
receives the full trigger text. All agents are `readonly: true` and `model: inherit`.
