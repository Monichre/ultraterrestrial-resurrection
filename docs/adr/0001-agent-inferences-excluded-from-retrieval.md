# Agent inferences are excluded from all retrieval, search, and suggestion pathways

The `agent_inferences` table stores the analytical layer — reasoning strings, evidentiary-state labels, and edge rationale produced by the mindmap agent. It is write-only from the product's perspective: it is never queried by `searchDatabase`, never fed into pgvector similarity searches, and never used as a source for the deterministic suggestion engine (`related.ts`).

The alternative — making inferences retrievable — was considered and rejected. Inferences are semantically rich (they contain entity names, event references, and analytical language), so they would surface in search results and similarity queries alongside primary source material. This would silently bootstrap model output into the evidence base: a future query could retrieve an inference as if it were a sourced fact, and subsequent synthesis could treat that inference as grounding for a new inference, compounding hallucination without any visible seam. The whole epistemics of the product rest on the distinction between sourced evidence and analytical overlay; making inferences retrievable erases that distinction at the data layer where it is hardest to recover.

The deterministic data floor must remain the floor. LLM output amplifies; it does not seed.

## Consequences

- `insertAgentInference` is the only write path for agent output into the database.
- Any new retrieval or suggestion feature must explicitly exclude `agent_inferences` from its query scope.
- If a future feature needs to query inferences (e.g. an adversarial Skeptic pass reviewing past syntheses), it must do so in a clearly separated read path that never mingles inference rows with entity rows in a single result set.
