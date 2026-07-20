# Prompt Caching Review & Hardening — Prometheus Chat Path

**Date:** 2026-07-19 (session ~08:45 CT)
**Scope:** `apps/app/src/app/api/prometheus/chat/route.ts`, `src/services/ai/context/build-agent-context.ts`, new `src/lib/ai/prompt-cache.ts`
**Status:** Implemented; runtime smoke pending (needs live provider keys)

## Findings (review)

1. **No provider-level prompt caching existed anywhere in the repo.** The only thing
   named like it was a prompt-hash *response* cache (Map + 5-min TTL) in the dead
   legacy route `src/services/ai/prometheus/api/chat/route.ts` — do-not-extend code.
2. **The live chat route actively defeated caching for every provider.** It built
   `system = SYSTEM_PROMPTS.main + buildAgentContext(...)`, and `buildAgentContext`
   embeds the latest user message and current graph state. Providers render
   tools → system → messages as one prefix, so per-turn bytes at the front
   invalidated the entire (growing) conversation history every request — for
   OpenAI's automatic caching and Anthropic's explicit caching alike.
3. The user query inside the system prompt also duplicated the last message verbatim.
4. Pre-existing, out-of-scope bug noticed: `frontendTools` is referenced at the
   bottom of the route's tool map but never imported (TS2304) — any client that
   sends a `tools` config will crash that request.

## Design (implemented)

Prompt layout is now: **frozen prefix first, volatile content last** —
`[tools → system*] [history…*] [current user message] [turn context]` (`*` = Anthropic
cache breakpoint; 2 of the allowed 4 used).

- **`src/lib/ai/prompt-cache.ts`** (new):
  - `assembleCachedPrompt({system, messages, turnContext})` — breakpoint on the
    system message (caches tools+system together) and on the last *history*
    message (incremental multi-turn caching). Turn context is a separate trailing
    user message, never an edit to client messages — client messages must be
    resent byte-identical next turn for the history cache to hit.
  - `openaiPromptCacheOptions(key)` — `promptCacheKey` pinned per user
    (Clerk id / IP), improving OpenAI automatic-cache routing.
  - `logCacheUsage()` — onFinish telemetry (`cacheReadTokens` staying at 0 across
    turns = a silent invalidator returned).
- **`build-agent-context.ts`**: added `buildStaticAgentGuidance()` (byte-stable:
  epistemic guidance, schema hints, NER prompt → safe inside cached system) and
  `buildTurnContext()` (volatile: graph state, focus, rules; excludes the user query).
  `buildAgentContext` untouched — still used by the mindmap route and the
  searchUAP tool's Assistants thread (fresh thread per call; prefix caching N/A).
- **Route**: system is now frozen; volatile context rides after the cached prefix;
  Anthropic message annotations are ignored harmlessly by the non-Anthropic tiers
  of the fallback chain.

## Key constraints baked into the code (from Anthropic caching semantics)

- Prefix match: one changed byte invalidates everything after it.
- Minimum cacheable prefix: 4096 tokens (Opus 4.8), 2048 (Sonnet 5) — below that
  it silently doesn't cache.
- Economics: reads ~0.1×, 5-min-TTL writes 1.25× — 2 requests inside the TTL break even.
- Model/tool-set changes invalidate everything → the fallback chain switching
  tiers mid-conversation naturally cold-starts that provider's cache (acceptable;
  caches are per-provider anyway).

## Verification

- `tsc --noEmit`: zero errors in the three touched files (repo baseline errors unchanged).
- Bun unit sanity of `assembleCachedPrompt`: correct roles/breakpoints for
  multi-turn, first-turn, and providerOptions-merge cases.
- **Pending:** live smoke of a 2-turn conversation confirming
  `[prompt-cache] prometheus/chat: read>0` on turn 2 (blocked on provider keys/quota).

## Not done deliberately

- `generateWithFallback` / `generateObjectWithFallback` (suggestion/enrichment
  one-shots): prompts are small (below cacheable minimums) and vary per call — no
  reusable prefix, caching would only add write premium.
- Disclosure mindmap route: OpenAI Assistants API manages its own caching server-side.
- 1-hour TTL / cache pre-warming: revisit if traffic becomes bursty with >5-min gaps;
  write cost doubles (2×) so it needs ≥3 reads to pay off.
