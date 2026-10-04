---
title: DisclosureResearcherPreSubmissionMethodology
description: Architecture and process notes for the instructional rewrite of disclosure researcher prompts
created: 2026-07-12T19:05:00Z
lastUpdated: 2026-07-12T19:05:00Z
author: Cursor Grok 4.5
version: 1.0.0
---

# DisclosureResearcherPreSubmissionMethodology

## Purpose

Generate a strictly instructional research methodology prompt for agents that must evaluate UFO/UAP/Disclosure material before submission. The source file (`disclosure-researcher-prompts.md`) mixed strong domain method with extensive code, schemas, and programmatic orchestration. Those implementation layers were removed.

## Source Review Findings

The original `disclosure-researcher-prompts.md` (~3,263 lines) contained nine specialist roles:

1. Master UFO Research Orchestration Controller
2. Advanced UFO Pattern Recognition Specialist
3. Elite UFO Evidence Evaluation Specialist
4. Strategic UFO Research Synthesis Agent
5. Real-Time UFO Monitoring and Alert Agent
6. Government Disclosure Analysis Agent
7. Scientific Anomaly Detection Agent
8. Witness Interview and Psychology Specialist Agent
9. Media Analysis and Disinformation Detection Agent

Strengths retained:

- Multi-tier source and evidence credibility thinking
- Prosaic-first investigative posture
- Disclosure-language caution
- Witness ethics and psychology
- Media contamination awareness
- Physics-claim discipline
- Landmark corpus literacy

Weaknesses removed or transformed:

- Dense Python and JSON implementation blocks
- Agent orchestration as software workflow
- Tooling, monitoring cascade, and system-architecture language
- Pseudo-precision from code scaffolding that did not add methodological clarity

Supporting methodology corpus folded in at the instructional layer:

- `methodology/UAP_RESEARCH_METHODOLOGY.md` — PH/PSH/MPH taxonomy
- `methodology/EVIDENCE_EVALUATION_FRAMEWORK.md` — evidence categories and reliability scales
- `methodology/RESEARCHER_GUIDELINES.md` — professional and ethical standards
- `methodology/ufo-researchers-methodologies.md` — Vallée / Invisible College posture

## Component Architecture

| Module | Responsibility |
| --- | --- |
| Role and Mandate | Defines Pre-Submission Research Officer posture |
| Operating Principles | Non-negotiable investigative norms |
| Canonical Domain Frameworks | Hynek, Vallée, origin taxonomy, evidence map, historical corpus |
| Pre-Submission Pipeline | Ordered ten-phase gate before any submission |
| Specialist Lenses | Instructional rewrite of the nine specialist roles |
| Credibility Composite | Cross-axis confidence judgment |
| Required Output Brief | Mandatory research brief structure |
| Language / Ethics Gates | Claim-strength discipline and harm controls |

## Process Flow

```
Intake claim
  → parse explicit/implicit/meta requirements
  → prosaic exhaustion
  → source authentication
  → evidence grading
  → corroboration matrix
  → specialist lenses
  → competing hypotheses
  → bias audit
  → submission readiness decision
  → emit required research brief
```

## Data Flow

No runtime data system is implied. The only “data” is the material package under review and the research brief the agent must produce. Provenance, testimony, sensor claims, and media products are treated as evidence classes, not database objects.

## Deliverables

- `DisclosureResearcherPreSubmissionMethodology_PSEUDOCODE.md` — planning outline
- `DisclosureResearcherPreSubmissionMethodology.md` — instructional prompt copy for agent use

## Usage

Provide `DisclosureResearcherPreSubmissionMethodology.md` to an agent as standing doctrine before it authors or submits UFO/UAP/Disclosure-related material. Keep the original `disclosure-researcher-prompts.md` as the historical/code-oriented reference if needed; do not mix the two modes in one prompt load unless intentionally dual-tracking.
