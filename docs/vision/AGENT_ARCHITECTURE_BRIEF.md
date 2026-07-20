# Agent Architecture Brief — Investigative Roles

register: agents

Canonicalized 2026-07-09. **Honesty header, per root CLAUDE.md's corrected myths: no multi-agent orchestrator exists in this codebase.** A 6-agent tour orchestrator was fully specced in July 2025, zero code shipped, scrapped. Exactly two AI paths are live: the **disclosure/mindmap agent** (`apps/app/src/app/api/disclosure/mindmap/route.ts`, OpenAI Assistants + SSE) and **Prometheus chat** (`apps/app/src/app/api/prometheus/chat/route.ts`, Vercel AI SDK `streamText`), plus two server actions (`enrich-hypothesis.ts`, `synthesize-investigation.ts`) on the `model-fallback.ts` chain. The roles below are a **conceptual grammar** — a way to name the investigative stances the system already performs and to discipline future prompt work. They are NOT five processes, five routes, or five personas to be built.

---

## 1. Why roles at all

The vision doc's five narrative layers (§7: evidentiary, analytical, relational, mythopoetic, operational) are stances a single model moves through inside one synthesis. Naming them as roles gives us: (a) a review vocabulary ("the skeptic is missing from this output"), (b) a prompt-engineering checklist, (c) an honest growth path if role-specialized prompts ever become separate calls.

## 2. The five roles

### The Archivist — evidentiary layer
Custodian of provenance. What are the sources? What is directly stated? What is missing? Tone: precise, unemotional, sourced. Never lets synthesis outrun the record.
- **Live today as:** the retrieval discipline — mindmap route's tool ladder (`file_search` → `searchDatabase` → optional `searchExternalResources`, route.ts:328-330); "provenance before prose" in both action prompts; synthesis §B (evidentiary ground, strongest/weakest named).
- **Owns states:** `[Observed] [Corroborated] [Unverified]`.

### The Analyst — analytical layer
Comparer and interpreter. Which claims reinforce, which conflict, which timelines are unstable, what explanation currently fits best? Tone: investigative, skeptical, curious.
- **Live today as:** edge `reasoning` strings with `[State]` prefixes written by the mindmap agent; the deterministic suggestion engine's signals (documented link / semantic affinity / temporal cluster, `packages/db/src/postgres/related.ts`); synthesis §C-§E (sequence, field map, contradictions); every inference persisted to `agent_inferences`.
- **Owns states:** `[Inferred] [Contested]`.

### The Skeptic — the counter-reading engine
The anti-echo-chamber mechanism, structurally guaranteed rather than personality-driven. Generates the strongest rival explanation, flags "narratively compelling but evidentially weak," welcomes the prosaic reading when it fits.
- **Live today as:** `counterReading` (required field, `enrich-hypothesis.ts:27-31`); the prosaic + institutional + psychological-social readings (required, `synthesize-investigation.ts` READINGS_SCHEMA); the voice-contract rule "pair every reading with a counter-reading."
- **Owns states:** `[Speculative] [Disconfirmed]` — and the honest sentence "nothing genuinely remains weird here."

### The Mythographer — mythopoetic layer
The dangerous layer, so the most disciplined. Tracks symbolic recurrence, folklore structure, encounter-tradition grammar — always labeled as resonance, never as evidence. "Myth is context, not confirmation."
- **Live today as:** the `mythopoetic` reading (required field, labeled "resonance, never evidence" in its schema description); the `Resonant` state on semantic-affinity suggestions; violet across the evidentiary palette.
- **Owns state:** `[Resonant]`.

### The Cartographer — relational + operational layers
Maps the field and plots the next move. Which entities recur, where is the shape emerging, what single action would most change the evidentiary weight? Tone: cartographic, then practical.
- **Live today as:** the canvas itself (the researcher-assembled graph IS the field map); graph-write tools on the mindmap route; synthesis §D (fieldMap) + §I (nextTraces); `nextTrace` in the dock liturgy; the R-Tree spatial grouping and contextual-intelligence utilities.
- **Owns:** `Open Questions` and `Next Traces` — the outputs that keep an investigation alive.

## 3. Mapping to what actually runs

| Role | Mindmap agent (live) | Prometheus chat (live) | Server actions (live) | Future (unbuilt) |
|---|---|---|---|---|
| Archivist | tool ladder + FTS/pgvector retrieval | `searchUAP`, `searchNeonDatabase` | grounding rules in both prompts | source-extracted `claims` table (Phase 2) |
| Analyst | `[State]`-prefixed edge reasoning → `agent_inferences` | `processDocument` analyses | deterministic hypothesis floor | contradiction objects |
| Skeptic | (prompt-level rule only) | (prompt-level rule only) | required counterReading + 3 non-anomalous readings | adversarial second-pass review |
| Mythographer | (prompt-level rule only) | — | required mythopoetic reading | motif tracking across investigations |
| Cartographer | graph-write tools | — | fieldMap + nextTraces | `theories` model (user-owned) |

## 4. Shared voice core

All five roles speak through one identity — "the research intelligence layer inside Ultraterrestrial" — with obligations in fixed order: **epistemic integrity, narrative coherence, atmosphere.** The canonical text lives today duplicated in `enrich-hypothesis.ts:49-61` and `synthesize-investigation.ts:98-112`; the governing contract is `features/mindmap/CLAUDE.md:37-52`. (Extraction to a single module is an open recommendation — see the canonicalization audit §3.)

Also on record, from the Brand Bible package: `01_RESEARCH_UI_AGENT.md` defines a *development-time design agent* (research-ui archival design specialist — already mirrored as the repo's `research-ui-agent` subagent), and `08_PROMPT_LIBRARY/investigative-research-assistant.md` is an *editorial persona* for long-form articles. Neither is a runtime product agent; they are adjacent tooling and should not be confused with the five investigative roles.

## 5. Rules for future agent work

1. **Orchestration over replacement** — deepen the two live paths; do not spawn parallel agents per role. A role becomes a separate call only when a surface needs it independently (e.g. an adversarial Skeptic pass on a finished synthesis).
2. Any new agent output that persists is an **inference** (`insertAgentInference`), never a claim, and never feeds retrieval/search/suggestions.
3. Every role speaks under the voice contract and is judged by `docs/vision/RESEARCH_NARRATIVE_RUBRIC.md`.
4. Model selection goes through `lib/ai/model-fallback.ts` (frontier-only policy, T-037). The vision doc's Fable-specific guidance (refusal-as-mature-UX, summarized reasoning as transparency) applies when Anthropic tiers serve a request.
5. **The user is the investigator.** Agents propose, structure, challenge, synthesize — they do not decree. No role ever gets closure authority.
