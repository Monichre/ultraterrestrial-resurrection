---
schema_version: '1.0'
kind: ultraterrestrial_agent_manifest
status: canonical
suite:
  id: ut.agent-suite.canonical
  version: 2.0.0
  trusted_agent_count: 18
  adversarial_profile_count: 1
agents:
- codename: MAJESTIC
  id: ut.agent.orchestration.majestic
  role: Master Investigation Controller
  class: orchestration
  file: agents/01-majestic-master-controller.md
- codename: LONE_GUNMEN
  id: ut.agent.monitoring.lone-gunmen
  role: Real-Time Monitor and Flap Detection Network
  class: monitoring
  file: agents/02-lone-gunmen-realtime-monitor.md
- codename: FORT
  id: ut.agent.acquisition.fort
  role: Archive Ingestor and Source Acquisition Agent
  class: acquisition
  file: agents/03-fort-source-ingestor.md
- codename: KNAPP
  id: ut.agent.investigation.knapp
  role: Investigative Journalism and Source Development Analyst
  class: acquisition
  file: agents/04-knapp-investigative-journalism.md
- codename: RUPPELT
  id: ut.agent.extraction.ruppelt
  role: Schema-First Fact and Event Extractor
  class: extraction
  file: agents/05-ruppelt-schema-extractor.md
- codename: SCULLY
  id: ut.agent.evidence.scully
  role: Evidence Evaluation and Conventional-Explanation Analyst
  class: evidence
  file: agents/06-scully-evidence-evaluator.md
- codename: HYNEK
  id: ut.agent.science.hynek
  role: Scientific Anomaly and Technical Feasibility Analyst
  class: evidence
  file: agents/07-hynek-scientific-anomaly.md
- codename: MACK
  id: ut.agent.witness.mack
  role: Witness Psychology and Experiencer Testimony Analyst
  class: evidence
  file: agents/08-mack-witness-psychology.md
- codename: GRUSCH
  id: ut.agent.disclosure.grusch
  role: Protected Disclosure and Claim-Chain Analyst
  class: institutions
  file: agents/09-grusch-protected-disclosure.md
- codename: MELLON
  id: ut.agent.government.mellon
  role: Government Structure and Disclosure Policy Analyst
  class: institutions
  file: agents/10-mellon-government-disclosure.md
- codename: POPE
  id: ut.agent.institutional-communications.pope
  role: Official Narrative and Institutional Communications Analyst
  class: institutions
  file: agents/11-pope-official-narrative.md
- codename: PILKINGTON
  id: ut.agent.information-operations.pilkington
  role: Information Operations and Narrative Contamination Analyst
  class: institutions
  file: agents/12-pilkington-information-operations.md
- codename: MICHEL
  id: ut.agent.correlation.michel
  role: Timeline, Geography and Flap-Correlation Analyst
  class: pattern
  file: agents/13-michel-spatiotemporal-correlation.md
- codename: MULDER
  id: ut.agent.patterns.mulder
  role: Pattern Recognition and Hypothesis-Generation Analyst
  class: pattern
  file: agents/14-mulder-pattern-recognition.md
- codename: VALLEE
  id: ut.agent.ontology.vallee
  role: Ontology, Entity and Phenomenon-Model Curator
  class: pattern
  file: agents/15-vallee-ontology-curator.md
- codename: MASTERS
  id: ut.agent.hypotheses.masters
  role: Cryptoterrestrial and Alternative-Origin Hypothesis Analyst
  class: pattern
  file: agents/16-masters-alternative-origin.md
- codename: PASULKA
  id: ut.agent.culture.pasulka
  role: Religion, Technology and Myth-Formation Analyst
  class: pattern
  file: agents/17-pasulka-religion-myth.md
- codename: KEEL
  id: ut.agent.synthesis.keel
  role: Strategic Synthesis and High-Strangeness Integration Director
  class: synthesis
  file: agents/18-keel-strategic-synthesis.md
adversarial_profiles:
- codename: DOTY_PATTERN
  id: ut.adversary.information-operations.doty
  file: adversaries/doty-pattern.md
---
# Ultraterrestrial Agent Manifest

## Trusted Canonical Roster

| Codename | Role | Class |
|---|---|---|
| **MAJESTIC** | Master Investigation Controller | `orchestration` |
| **LONE_GUNMEN** | Real-Time Monitor and Flap Detection Network | `monitoring` |
| **FORT** | Archive Ingestor and Source Acquisition Agent | `acquisition` |
| **KNAPP** | Investigative Journalism and Source Development Analyst | `acquisition` |
| **RUPPELT** | Schema-First Fact and Event Extractor | `extraction` |
| **SCULLY** | Evidence Evaluation and Conventional-Explanation Analyst | `evidence` |
| **HYNEK** | Scientific Anomaly and Technical Feasibility Analyst | `evidence` |
| **MACK** | Witness Psychology and Experiencer Testimony Analyst | `evidence` |
| **GRUSCH** | Protected Disclosure and Claim-Chain Analyst | `institutions` |
| **MELLON** | Government Structure and Disclosure Policy Analyst | `institutions` |
| **POPE** | Official Narrative and Institutional Communications Analyst | `institutions` |
| **PILKINGTON** | Information Operations and Narrative Contamination Analyst | `institutions` |
| **MICHEL** | Timeline, Geography and Flap-Correlation Analyst | `pattern` |
| **MULDER** | Pattern Recognition and Hypothesis-Generation Analyst | `pattern` |
| **VALLEE** | Ontology, Entity and Phenomenon-Model Curator | `pattern` |
| **MASTERS** | Cryptoterrestrial and Alternative-Origin Hypothesis Analyst | `pattern` |
| **PASULKA** | Religion, Technology and Myth-Formation Analyst | `pattern` |
| **KEEL** | Strategic Synthesis and High-Strangeness Integration Director | `synthesis` |

## Restricted Adversarial Profiles

| Profile | Purpose | Trust status |
|---|---|---|
| **DOTY_PATTERN** | Mixed-truth contamination and provenance red-team simulation | Restricted; never evidence |

## Core Dialectics

- **MULDER ↔ SCULLY:** pattern generation versus evidentiary restraint.
- **VALLEE ↔ HYNEK:** ontological openness versus physical constraint.
- **MACK ↔ SCULLY:** experiential seriousness versus testimony limitations.
- **GRUSCH ↔ SCULLY:** testimony architecture versus evidentiary sufficiency.
- **MELLON ↔ POPE:** institutional structure versus exact public-language meaning.
- **KNAPP ↔ PILKINGTON:** source development versus source contamination.
- **MICHEL ↔ MULDER:** quantified clustering versus qualitative pattern inference.
- **MASTERS ↔ VALLEE:** specific alternative-origin models versus broad ontology.
- **PASULKA ↔ HYNEK:** cultural meaning versus physical mechanism.
- **KEEL ↔ MAJESTIC:** expansive synthesis versus final quality control.

## High-Level Flow

```text
LONE_GUNMEN → FORT / KNAPP → RUPPELT
                         ↓
       GRUSCH / MELLON / POPE / PILKINGTON
                         ↓
         SCULLY / HYNEK / MACK / MICHEL
                         ↓
       MULDER / VALLEE / MASTERS / PASULKA
                         ↓
                       KEEL
                         ↓
                     MAJESTIC
```
