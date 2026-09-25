/**
 * Provider-level prompt caching for AI SDK call sites.
 *
 * The invariant everything here serves: prompt caching is a PREFIX match.
 * Providers render tools -> system -> messages, and a single changed byte
 * invalidates every cached token after it. So stable content (system prompt,
 * tool schemas, conversation history) must be byte-identical across turns and
 * must physically precede anything volatile (graph state, per-turn context,
 * the current question).
 *
 * Anthropic (explicit breakpoints via `cache_control`):
 *   - A breakpoint on the system message caches tools + system together,
 *     because tools render before system.
 *   - A breakpoint on the last history message caches the conversation
 *     incrementally — each turn reads the prior turn's entry and writes only
 *     the delta. Volatile turn context is appended AFTER that breakpoint so
 *     it never poisons the cached prefix.
 *   - Minimum cacheable prefix: 4096 tokens on Opus 4.8, 2048 on Sonnet 5.
 *     Shorter prefixes silently don't cache (usage shows cacheWriteTokens: 0).
 *   - Economics: reads ~0.1x input price, 5-minute-TTL writes 1.25x — two
 *     requests inside the TTL already break even. Max 4 breakpoints per
 *     request; this module uses 2.
 *
 * OpenAI (automatic for >=1024-token prefixes): needs no markers, but
 * `promptCacheKey` pins requests from the same conversation to the same cache
 * shard, which raises hit rates under load balancing.
 *
 * Providers ignore foreign providerOptions namespaces, so these annotations
 * are safe on the multi-provider fallback chain (Gemini/GLM/Groq tiers simply
 * skip them).
 */
import type {ModelMessage} from 'ai'

export type CacheableMessage = {
  role: string
  content: unknown
  providerOptions?: Record<string, unknown>
}

const anthropicEphemeral = (existing?: Record<string, unknown>): Record<string, unknown> => ({
  ...(existing ?? {}),
  anthropic: {
    ...((existing?.anthropic as Record<string, unknown> | undefined) ?? {}),
    cacheControl: {type: 'ephemeral'},
  },
})

const markCacheBreakpoint = <T extends CacheableMessage>(message: T): T => ({
  ...message,
  providerOptions: anthropicEphemeral(message.providerOptions),
})

/**
 * Assembles a cache-friendly prompt from a frozen system prompt, the client's
 * message history, and volatile per-turn context.
 *
 * Layout (breakpoints marked *):
 *   [system*] [history...  last-history-message*] [current user message] [turn context]
 *
 * The current user message and turn context sit after the last breakpoint, so
 * per-turn changes cost only their own tokens. The turn context is a separate
 * trailing user message (the SDK merges consecutive user messages into one
 * turn) rather than an edit to the client's message — client messages must be
 * resent byte-identical next turn for the history cache to hit.
 */
export function assembleCachedPrompt({
  system,
  messages,
  turnContext,
}: {
  /** Frozen system prompt — must not contain timestamps, IDs, or per-turn state */
  system: string
  /** Client-provided conversation, ending with the current user message */
  messages: CacheableMessage[]
  /** Volatile per-turn context; always rendered after the cached prefix */
  turnContext?: string
}): ModelMessage[] {
  const prompt: CacheableMessage[] = [
    markCacheBreakpoint({role: 'system', content: system}),
  ]

  if (messages.length > 1) {
    const history = messages.slice(0, -1)
    prompt.push(...history.slice(0, -1))
    prompt.push(markCacheBreakpoint(history[history.length - 1]))
  }
  prompt.push(messages[messages.length - 1])

  if (turnContext) {
    prompt.push({role: 'user', content: turnContext})
  }

  // Client messages arrive as loosely-typed {role, content} objects; the
  // shape is ModelMessage-compatible at runtime.
  return prompt as unknown as ModelMessage[]
}

/**
 * Call-level provider options for OpenAI's automatic prefix cache. Key by a
 * stable per-user/per-conversation id — NOT a random or per-request value.
 */
export function openaiPromptCacheOptions(cacheKey: string) {
  return {openai: {promptCacheKey: cacheKey}}
}

/**
 * One-line cache telemetry for onFinish hooks. If reads stay at 0 across
 * consecutive turns of the same conversation, a silent invalidator is back
 * (dynamic bytes in the system prompt, an unstable tool set, or a prefix
 * below the model's cacheable minimum).
 */
export function logCacheUsage(
  route: string,
  usage?: {
    inputTokens?: number
    inputTokenDetails?: {cacheReadTokens?: number; cacheWriteTokens?: number}
  }
): void {
  if (!usage) return
  const read = usage.inputTokenDetails?.cacheReadTokens ?? 0
  const write = usage.inputTokenDetails?.cacheWriteTokens ?? 0
  console.log(
    `[prompt-cache] ${route}: read=${read} write=${write} uncached=${usage.inputTokens ?? 0}`
  )
}
