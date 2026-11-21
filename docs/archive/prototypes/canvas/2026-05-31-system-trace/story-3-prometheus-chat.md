# Story #3 trace — "Prometheus chat" (tool-calling conversational RAG)

_Traced firsthand by Claude, 2026-06-08. Every hop cites real `file:line`. RESOURCE hops flagged **real vs aspirational**._
_Method: `UI → fn call → query layer → resource requested → RESOURCE → RESPONSE → (mods) → state → UI → result`._

**One-line verdict:** A **standalone conversational chat** (Vercel AI SDK `streamText` + tool-calling), feeding **chat message state, NOT the graph**. It is the **least coupled path** — **zero Xata / zero `@db`**, so it fully survives Xata's death. Its only corpus grounding is `searchUAP` → the **same OpenAI vector store on the deprecating Assistants API** as Story #1. Two real defects: a `searchUAP` blocking-poll, and a `researchExternalTopic` poll-timeout that exceeds the route's `maxDuration`.

---

## Hop-by-hop

### 1. UI/UX — chat input
Multiple client surfaces post here (`useChat`/custom handlers): `contexts/ai/assistant.tsx`, `hooks/useBackendChat.ts`, `hooks/useChatActions.ts`, `hooks/useAIStreamHandler.tsx`, `components/chat-sidebar.tsx`, `app/(site)/prometheus/agent.tsx`, plus mindmap menus. This is a **chat surface**, distinct from the board canvas.

### 2. Function call — POST to the chat route
- `app/api/prometheus/chat/route.ts:436` — `POST(req)`. Body: `{messages, system, tools (frontend), graphState, researchFocus, contextRules}` (`:440–454`).
- `:463` `extractLatestUserMessage` → `:464` `buildAgentContext(...)` (⭐ **same shared context builder as Story #1** — `services/ai/context/build-agent-context.ts`) → `:470` `contextualSystemPrompt`.

### 3. Query layer — Vercel AI SDK streamText
- `:472` `streamText({ model: openai(MODEL_NAME), system, messages, tools:{…} })`. `MODEL_NAME='gpt-4-turbo'` (`:20`), provider `@ai-sdk/openai` (`:1`). `export const maxDuration = 60` (`:434`).
- `:765` `return result.toDataStreamResponse()` — AI SDK data-stream protocol (⚠️ **different protocol from Story #1's custom SSE bridge**).

### 4 + 5. RESOURCE layer — the tools

| Tool | Code | Resource | Reality |
|---|---|---|---|
| **searchUAP** | `route.ts:477` → `openaiClient.beta.threads.create/runs.create/runs.retrieve/messages.list` (`:488–514`) | **OpenAI Assistants API + vector store** (`ASSISTANT_ID` `:82`, `VECTOR_STORE_ID` `:83`, `file_search` `:500`) | ⚠️ **REAL today, deprecating surface** — same vector store as Story #1, same `beta.threads.*` Assistants API. 🐛 **Blocking poll**: `while(in_progress|queued){ sleep 1s }` (`:505–509`) — not streamed; ties up the request. Returns content + citation file_ids (`:522–541`). **This is the ONLY corpus-grounded hop in the whole route.** |
| **searchExternalResources** | `route.ts:558` `exaClient.searchAndContents` (`:586`) | **Exa** neural/keyword search | ✅ **REAL.** Trusted-domain allowlist (`:54`) + exclude list (`:71`), `livecrawl` modes. Returns formatted `{content,relevance,source,title,…}`. |
| **researchExternalTopic** | `route.ts:633` `exaClient.research.createTask` (`:666`, `model:"exa-research-pro"`) | **Exa Research Pro** (async deep research) | ✅ REAL but 🐛 **poll-vs-timeout bug**: polls up to `30 × 10s = 300s` (`:676–702`) while the route's `maxDuration=60` (`:434`). The function **cannot complete** within the serverless budget for non-trivial research → effectively times out at the platform level before its own 5-min timeout. |
| **summarize / extractTopics / analyzeSentiment / findConnections / findInsights / generateTags** | `route.ts:724–758` → `executeDocumentAction` (`:~390`) → `documentActions.*` (`:98+`), each its own `streamText(gpt-4-turbo)` (`:100`, `:210…355`) | **OpenAI gpt-4-turbo** over **uploaded file content** | ✅ **REAL.** Operate on user-uploaded `fileContent`, **not** the corpus or DB. Pure LLM transforms. |
| **frontendTools** | `route.ts:761` `frontendTools(frontendToolsConfig)` | client-supplied tool defs (AI SDK) | ✅ REAL passthrough — lets the calling UI inject its own tools. |

> **No `xata`, no `@db`, no relational query anywhere in this route.** Story #3 is fully decoupled from the dead data layer.

### 6. RESPONSE / 7. State — AI SDK data stream → chat state
- `:765` `result.toDataStreamResponse()` → standard Vercel AI SDK stream (text deltas + tool-call/tool-result parts).
- Consumed client-side by `useChat`/custom handlers (`hooks/useBackendChat.ts`, `useChatActions.ts`, `useAIStreamHandler.tsx`, `contexts/ai/assistant.tsx`) → **chat message list state**. Does **not** write React Flow nodes/edges (contrast Stories #1 & #2).

### 8. UI/UX result
Streamed assistant message in a chat panel, with tool invocations surfaced inline. Independent of the board's Zustand graph store.

---

## What this trace proves for the rebuild

1. **Story #3 is insulated from the Xata rebuild** — it keeps working through Xata's death because it never touched `@db`. Don't spend rebuild effort here for *data-layer* reasons.
2. **But it's also the LEAST data-grounded** — its only corpus access is `searchUAP` → OpenAI vector store. When the owned pgvector layer exists, **`searchUAP` is the natural insertion point** for a tool that queries OUR store (vector + FTS + entity filters) instead of (or alongside) the OpenAI Assistant. That's the bridge from this chat into the rebuilt data platform.
3. **Two protocols / two context paths now confirmed across the app:**
   - Story #1 (mindmap agent): **OpenAI Assistants runs.stream** + **custom SSE bridge** → graph.
   - Story #3 (chat): **Vercel AI SDK `streamText`** + **`toDataStreamResponse`** → chat.
   - **They share `buildAgentContext`** — the one unifying seam. A future consolidation (scratchpad parked item) would converge these two protocols; the shared context builder is the foothold.
4. **The Assistants-API dependency is now confirmed in BOTH AI paths** (Story #1 route + Story #3 `searchUAP`). The Assistants→Responses migration is a cross-cutting concern, not route-local. Same `OPENAI_ASSISTANT_ID` / `OPENAI_VECTOR_STORE_ID` env in both.
5. **Pre-existing defects to fix opportunistically** (not data-layer, flag for the AI-hardening thread): `searchUAP` blocking poll (`:505`); `researchExternalTopic` 300s poll under a 60s `maxDuration` (`:676` vs `:434`).

## Open follow-ups (observations, not decisions)
- [ ] When pgvector lands: add an owned-store branch to `searchUAP` (keep the `{query, results[], totalResults}` shape so chat clients are unaffected).
- [ ] Confirm `frontendTools` import source (AI SDK `ai` package) and what client tools actually get injected.
- [ ] `researchExternalTopic`: either raise `maxDuration`, move to a background job, or drop Research Pro for the inline-chat use case.
