---
schema_version: '1.0'
kind: ultraterrestrial_output_registry
id: ut.registry.outputs
status: canonical
version: 1.0.0
---
# Canonical Output Schemas

All schemas require the shared `meta` envelope and source anchors for material claims.

## `investigation_plan`

```yaml
request_id: null
complexity: null
objective: null
questions: null
tasks: null
agent_assignments: null
evidence_requirements: null
quality_gates: null
risks: null
status: null
```

## `monitoring_alert`

```yaml
alert_id: null
what_changed: null
earliest_source: null
time_window: null
geographic_scope: null
independent_source_count: null
duplicate_risk: null
cluster_method: null
confidence: null
recommended_actions: null
```

## `source_intake_record`

```yaml
document_id: null
title: null
creator: null
publisher: null
publication_date: null
retrieved_at: null
source_url_or_locator: null
format: null
hash: null
provenance: null
transformations: null
duplicate_of: null
access_notes: null
```

## `investigative_source_dossier`

```yaml
claim: null
first_publication: null
source_chain: null
access_assessment: null
conflicts: null
account_changes: null
missing_primary_material: null
interview_questions: null
confidence: null
```

## `extraction_batch`

```yaml
source_id: null
entities: null
events: null
claims: null
quotations: null
relationships: null
unresolved_matches: null
validation_errors: null
```

## `evidence_assessment`

```yaml
claim: null
supporting_evidence: null
contrary_evidence: null
dimension_scores: null
adjustments: null
final_score: null
conventional_explanations: null
anomalous_residue: null
confidence: null
publication_recommendation: null
```

## `scientific_assessment`

```yaml
claim: null
variables: null
assumptions: null
known_mechanisms: null
instrument_limits: null
calculations: null
plausible_range: null
unresolved_anomaly: null
testable_predictions: null
confidence: null
```

## `witness_assessment`

```yaml
witness_id_or_pseudonym: null
testimony_timeline: null
phenomenology: null
memory_conditions: null
interview_contamination: null
consistency: null
corroboration: null
privacy_constraints: null
confidence: null
```

## `protected_disclosure_assessment`

```yaml
claim_atoms: null
knowledge_type: null
source_distance: null
access_scope: null
intermediaries: null
oversight_path: null
corroboration: null
missing_evidence: null
protected_fields: null
confidence: null
```

## `institutional_assessment`

```yaml
institutions: null
authorities: null
jurisdictions: null
documented_actions: null
policy_changes: null
disclosure_phase: null
incentives: null
conflicts: null
evidentiary_limits: null
confidence: null
```

## `official_narrative_assessment`

```yaml
institution: null
speaker_or_office: null
date: null
exact_position: null
authority_scope: null
jurisdiction_limits: null
operative_wording: null
records_claim: null
evidentiary_meaning: null
communication_objective: null
contradictions: null
confidence: null
```

## `information_operations_assessment`

```yaml
target_narrative: null
origin: null
source_graph: null
documented_manipulation: null
contamination_indicators: null
narrative_mutations: null
circular_reporting_risk: null
alternative_explanations: null
surviving_evidence: null
confidence: null
```

## `spatiotemporal_assessment`

```yaml
case_set: null
time_model: null
location_model: null
uncertainty: null
baseline: null
cluster_method: null
results: null
sensitivity: null
biases: null
null_explanations: null
confidence: null
```

## `pattern_hypothesis`

```yaml
hunch_id: null
pattern_claim: null
selection_rule: null
supporting_cases: null
counterexamples: null
base_rate: null
null_models: null
predictions: null
evidence_requests: null
confidence: null
status: null
```

## `ontology_decision`

```yaml
candidate: null
matched_entities: null
decision: null
confidence: null
provenance: null
ambiguities: null
vocabulary_mapping: null
ontology_proposal: null
```

## `alternative_origin_hypothesis`

```yaml
model: null
assumptions: null
mechanism: null
predictions: null
supporting_cases: null
disconfirming_cases: null
explanatory_scope: null
explanatory_cost: null
competing_models: null
confidence: null
status: null
```

## `myth_formation_assessment`

```yaml
phenomenon_or_motif: null
contemporary_context: null
historical_comparanda: null
transmission_evidence: null
similarity_type: null
community_dynamics: null
technology_role: null
causal_limitations: null
confidence: null
```

## `strategic_synthesis`

```yaml
question: null
established_record: null
strong_inferences: null
contested_claims: null
anomalous_residue: null
model_comparison: null
specialist_dissent: null
predictions: null
research_backlog: null
confidence: null
```

## Shared Meta Envelope

```yaml
meta:
  agent_id: string
  task_id: string
  generated_at: ISO-8601
  sources: [anchored_source_reference]
  assumptions: [string]
  limitations: [string]
  confidence: 0.0-1.0
  review_status: draft | reviewed | contested
```
