# Xata replacement audit

**Scope:** Production call sites that depend on `@db` / Xata before any database migration.  
**Related:** [IMPORT_DATAFLOW_INVENTORY.md](./IMPORT_DATAFLOW_INVENTORY.md), [FINDINGS_DATABASE_ARCHITECT.md](./FINDINGS_DATABASE_ARCHITECT.md)

## Executive summary

Xata is embedded across **CRUD**, **search**, **Ask/AI**, and **mindmap graph hydration**. Replacing it is a **cross-cutting** change: generated types, API routes, agent tools, and React Flow hydration must stay aligned. A strangler/adapter approach per call site is lower risk than a big-bang cutover.

## Call site inventory

| Area | Entry points | Role |
|------|--------------|------|
| `packages/db` | `askXata`, `searchXata`, `askXataWithAi`, `searchXataWithAi` (AI SDK) | Primary data access |
| `packages/db` | `xata-to-xyflow.ts` → `hydrateGraphFromXata` | Mindmap node/edge hydration |
| `packages/db` | `xata-typescript-sdk/api/ask.ts`, `search.ts` | Low-level SDK |
| `apps/app` | `searchDatabase` tool → `askXata` | Disclosure mindmap agent |
| `apps/app` | Mindmap UI graph load via hydration | Research canvas |
| `packages/ai` | Verify direct imports | Secondary consumers |

## Consumer matrix

| Consumer | Functions / routes | Migration notes |
|----------|-------------------|-----------------|
| Mindmap agent | `searchDatabase` | Replace with Postgres/pgvector search or keep adapter |
| Ask/AI | `askXataWithAi` | Route to new RAG/LLM stack per product decision |
| Disclosure RAG | If still uses Xata in search path | Align with `apps/disclosure-rag` vector backends |
| Generated types | `packages/db/xata.ts` | Regenerate from new schema; version API |
| Future features | Any new `askXata` usage | Block without adapter or migration plan |

## Replacement strategies

### 1. Strangler / adapter (recommended for incremental work)

- Introduce `XataRepository` interface in `packages/db` with Postgres (or pgvector) implementation.
- Point `askXata` / `searchXata` at existing signatures; swap implementation behind the interface.
- **Pros:** Low blast radius per PR; tests per adapter.  
- **Cons:** Two systems to operate until cutover complete.

### 2. Postgres + pgvector (align with disclosure-rag)

- Disclosure RAG already supports **pgvector** and **Upstash** (`lib/storage/pgvector_library.py`).
- Unify mindmap entity search on the same vector stack as batch ingestion where possible.
- **Pros:** One operational model for vectors; fewer secrets (no Xata API key in app runtime for search).  
- **Cons:** Re-embed or re-index if dimensions/models change; migration scripts for relational data still required.

### 3. Generated types regeneration

- Replace `packages/db/xata.ts` and SDK-generated types with types from new schema (Drizzle/Prisma/etc. per team standards).
- Version public APIs if response shapes change.

## Risk register

| Risk | Mitigation |
|------|------------|
| Hidden call sites | Grep for `@db/xata`, `askXata`, `searchXata`, `XATA_`, `xataClient` |
| Type drift | CI check: generated types match runtime queries |
| Dual vector stores | Document which index backs which feature (OpenAI vs pgvector) |
| Test data on Xata | Staging fixtures + contract tests on adapters before prod cutover |

## Recommended sequence

1. Inventory all imports (grep + dependency graph).  
2. Implement adapters for read-heavy paths (`searchXata`, `askXata` read paths).  
3. Migrate mindmap `searchDatabase` tool to new search backend.  
4. Migrate `hydrateGraphFromXata` to Postgres loaders.  
5. Remove Xata credentials from production env; drop dead code paths.  
6. Regenerate types and run full regression on `apps/app` + `packages/db`.

## Open questions

- Single source of truth for **entity search** at runtime: pgvector only, or hybrid with OpenAI file_search for Assistants?  
- **Transactional** semantics: which operations must remain ACID on Postgres vs can be eventually consistent search indices?  
- **Timeline** and **rollback** plan per environment (staging first).

## Verification checklist

- [ ] Grep confirms no unexpected `xata` imports in `apps/app` production bundles (except documented adapters).  
- [ ] Mindmap E2E: searchDatabase returns results without Xata.  
- [ ] Research canvas loads graph from Postgres (or adapter) in staging.  
- [ ] Generated types compile and match API handlers.