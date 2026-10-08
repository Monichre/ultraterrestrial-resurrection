---
status: live
role: identity
spine: how
updated: 2026-07-19
---

# Implementation Spec — Where the Identity Touches Code

register: implementation

Canonicalized 2026-07-09. Maps the rubric, vocabulary, and roles onto the data objects, retrieval, prompts, and UI flows that actually exist. Every "LIVE" assertion below cites a real file; the Gap List at the end names what the identity implies but code does not yet do.

---

## 1. Data objects

| Concept | Status | Where |
|---|---|---|
| Entity records (events, key_figures, topics, organizations, testimonies, documents, artifacts) | LIVE | Neon Postgres via `@db/postgres` (`packages/db/src/postgres/`), 29 tables, 230,998+ records, 1,405 entity rows + 4,946 doc chunks embedded (`text-embedding-3-small` @1536, locked) |
| Evidentiary state (8-state enum) | LIVE | `apps/app/src/features/mindmap/utils/evidentiary-state.ts` (UI vocabulary, TitleCase) + `packages/db/src/postgres/agent-inferences.ts:19-27` (db enum, lowercase) |
| Agent inference (analytical layer) | LIVE | `agent_inferences` table; `insertAgentInference`/`getInferencesForRecord` in `packages/db/src/postgres/agent-inferences.ts`. Contract in module doc: interpretive layer ONLY, never feeds retrieval/search/suggestions. Written fire-and-forget per reasoned edge by the mindmap route (route.ts:97) |
| Claim (source-extracted) | **NOT BUILT** | Name reserved by the 2026-07-08 ruling; Phase 2 (vision review §Phase 2). Producers will be ingestion pipeline / testimony extraction / human researcher — never the agent |
| Theory (user-owned research hypothesis) | **NOT BUILT** | Phase 2; the legitimate long-term home for agent inferences as attached support |
| Contradiction / Motif objects | **NOT BUILT** | Phase 2 backlog; contradictions exist only as strings in synthesis output |

## 2. Retrieval

- **`searchDatabase`** (`packages/db/src/postgres/search.ts`): FTS (`search_vector @@ plainto_tsquery`) + pgvector cosine run in parallel, deduped, RRF-fused. Both live routes call it; embeddings come from the shared `embedQuery` (`apps/app/src/services/ai/openai/embed-query.ts`).
- **Suggestion engine** (`packages/db/src/postgres/related.ts`): deterministic, no-LLM — join-table links, stored-pgvector affinity, temporal clustering. Its three signal types map to evidentiary states in the dock: connected→`Corroborated`, similar→`Resonant`, temporal→`Inferred`.
- **OpenAI vector store** via `file_search` on the mindmap Assistant; Exa via `searchExternalResources`.
- **Identity rule enforced here:** `agent_inferences` is excluded from all retrieval paths by contract. Deterministic data is the floor; the LLM amplifies (`PRODUCT.md:28`).

## 3. Prompts (the voice in production)

| Surface | File | Identity features |
|---|---|---|
| Mindmap agent | `apps/app/src/app/api/disclosure/mindmap/route.ts` | UT identity in `additional_instructions`; tool ladder (route.ts:328-330); `[Observed]…[Unverified]` edge-labeling instruction; every reasoned edge persisted as inference |
| Prometheus chat | `apps/app/src/app/api/prometheus/chat/route.ts` | `SYSTEM_PROMPTS.main` rewritten with UT identity (T-037 Phase 0); tools `searchUAP`, `searchNeonDatabase`, `searchExternalResources`, `researchExternalTopic`, `processDocument` |
| Dock liturgy | `apps/app/src/features/mindmap/actions/enrich-hypothesis.ts` | LITURGY_SCHEMA `{reading, counterReading, whatRemainsWeird, nextTrace}`; deterministic hypothesis is the floor, LLM enrichment optional; sanity gates discard degenerate output |
| Investigation synthesis | `apps/app/src/features/mindmap/actions/synthesize-investigation.ts` | Full §15 A-I schema (signal → nextTraces) incl. five readings; grounded strictly in canvas nodes/edges; titles-not-ids rule (verified live 2026-07-08); returns null on failure — canvas is the fallback |
| Model selection | `apps/app/src/lib/ai/model-fallback.ts` | Frontier-only chain (GPT-5.5 → Opus 4.8 → Sonnet 5 → Gemini 3.5 Flash → …), env-gated, provider surfaced to UI |

Shared-prompt duplication is a known liability (audit §3): the identity preamble lives in two actions + two routes with no single source.

## 4. UI flows

| Identity element | Status | Where |
|---|---|---|
| Evidentiary badges (bracketed, mono) | LIVE | `features/mindmap/components/evidentiary-state-badge.tsx`; `edges/SiblingEdge.tsx` parses `[State]` prefixes and renders badge + stripped text |
| Synthesis dossier panel | LIVE | `features/mindmap/components/synthesis-panel.tsx` + "Synthesize Investigation" button in `research-canvas/FloatingToolbar.tsx` (the live toolbar) |
| Suggestions dock (liturgy) | LIVE | four-part reading rendered; deterministic floor stays if all providers fail |
| Microfilm Dark chrome | LIVE | `--ut-*` OKLCH tokens, clipped dossier corners, redaction-bar skeletons, file-reference micro-headers per `DESIGN.md` (codified from live canvas 2026-07-08) |
| Provenance delineation (solid=sourced / dashed=inference) | LIVE (canvas) | `DESIGN.md:30` rule; enforced on edges/panels — **not yet audited app-wide** |
| Agent failure in-fiction (`NO CARRIER`) | LIVE | commit 3c719a0 |
| Terminology pass over all UI strings | **NOT DONE** | adopted-vocabulary set (UX guide §2) applied opportunistically, not swept |

## 5. Rubric enforcement points

1. **Schema-level (strongest):** required `counterReading`/five-readings fields make gates G4/D2 structurally unfailable on those surfaces.
2. **Prompt-level:** "never proves" / liturgy / grounding rules in every prompt (G1, G2, D1).
3. **Parse-level:** `parseEvidentiaryState` refuses to default a missing state (G3's honest half — absence renders as absence).
4. **Review-level (manual):** the rubric itself; candidate future hook: an LLM-judge pass scoring stored syntheses. **NOT BUILT.**

## 6. Gap list (identity implies, code lacks)

1. **Canonical `claims` table + `theories` model** — Phase 2, blocks Contradiction/Motif objects.
2. **Shared voice-core module** — extract duplicated preamble (audit §3 recommendation).
3. **UI terminology sweep** — apply UX guide §2/§5 across FullScreenMenu, panels, empty states.
4. **Refusal UX** — the mature reframe copy (vision §10) is specced, not implemented; relevant once Anthropic tiers serve primary traffic.
5. **`streamText` fallback variant** — the two live routes still die with a single provider outage (T-037 remaining).
6. **Rubric-as-judge** — no automated scoring of outputs.
7. **Design-token reconciliation** — Brand Bible `06_DESIGN_TOKENS.ts` (hex, light-paper world) vs `DESIGN.md` `--ut-*` OKLCH (Microfilm Dark). These are two lighting conditions of one world (paper artifacts vs night canvas); a future pass should state the mapping explicitly rather than merge them.
8. **Design Canon sync** — four corrected files in the Brand Bible package supersede `apps/app/src/components/design-system/` copies (audit §1).
