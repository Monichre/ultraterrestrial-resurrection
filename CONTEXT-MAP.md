# Context Map

## Contexts

- [System-wide](./CONTEXT.md) — domain vocabulary that crosses all packages and surfaces; the reserved-word rulings and evidentiary grammar every context must honour
- [Research Canvas](./apps/app/CONTEXT.md) — the core power-user surface: Investigation assembly, AI inference overlay, synthesis, evidentiary badge grammar
- [Database / `@db/postgres`](./packages/db/CONTEXT.md) — the record types, search and retrieval model, the agent-inferences contract, and the **Disclosure Lab** admin surface over that store
- [AI / Prompts](./packages/ai/prompts/CONTEXT.md) — the voice contract, the five investigative roles, the liturgy schema, and the `@repo/prompts` corpus vocabulary

## Relationships

- **System-wide → all**: Every context imports the reserved-word rulings (`Claim`, `Inference`, `Evidence`, `Proves`) and the eight evidentiary states. No context may redefine these.
- **Research Canvas → Database**: The Canvas reads entity records (sightings, events, key_figures, testimonies, topics, organizations, documents, artifacts) via `@db/postgres`. It writes back via `insertAgentInference` only — **on the Research Canvas**, agent output never writes to entity tables.
- **Disclosure Lab → Database**: Disclosure Lab is the **admin console** over the same Neon store (planned `apps/disclosure-lab`). A human operator may INSERT/UPDATE allowlisted entity tables. The Lab assistant is read/analyze only in v1 — it does not perform entity writes. This does **not** overturn the Canvas inference-only write rule.
- **Research Canvas → AI / Prompts**: The Canvas triggers synthesis and hypothesis enrichment via server actions (`synthesize-investigation.ts`, `enrich-hypothesis.ts`), which compose the voice contract from the Prompts context.
- **Database ↔ AI / Prompts**: The mindmap route and Prometheus chat call `searchDatabase` (FTS + pgvector) from `@db/postgres` and persist each reasoned edge as an `agent_inference` row. `agent_inferences` is excluded from all retrieval by contract — the analytical layer never feeds its own retrieval.

## Redirects (do not invent second glossaries)

- `packages/prompts/CONTEXT.md` → stub pointing at `packages/ai/prompts/CONTEXT.md`
- External research clients live under `packages/ai/services/` (`@repo/ai/services`) — not a separate domain context; see [`docs/plans/AiServicesMerge.md`](./docs/plans/AiServicesMerge.md)
