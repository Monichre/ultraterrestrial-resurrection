/**
 * Multi-provider frontier-model fallback chain.
 *
 * Policy (2026-07): only current frontier models — never legacy tiers.
 * Tiers are tried in order; a tier is skipped when its API key is absent
 * and abandoned on any error (quota, timeout, refusal), so one provider
 * being down never takes the feature down. Callers get the first success
 * plus which tier produced it.
 *
 * Gateway policy (2026-08-07): first-party OpenAI and Anthropic tiers are
 * REMOVED, not demoted. A trailing tier is still a reachable tier — leaving
 * one in place means the first time every gateway above it fails, the request
 * silently bills a vendor we have chosen to stop paying. Absence is the only
 * enforcement that survives an outage. Mirrors
 * `apps/disclosure-rag/lib/llm_fallback.py`, which is the batch counterpart.
 *
 * Scope: this governs *completions only*. It does not touch embeddings
 * (`text-embedding-3-small` @ 1536 dims, 6,540 vectors already stored) or the
 * disclosure mindmap agent, which runs on the OpenAI Assistants API —
 * threads + file_search over a vector store is a proprietary surface with no
 * chat/completions equivalent, so it cannot be routed through a gateway
 * without rearchitecting it. Both still consume OpenAI credit by design.
 *
 * Verified model IDs (2026-08-07):
 *   OpenRouter    z-ai/glm-5.2        (live — served a real completion)
 *   HuggingFace   zai-org/GLM-5.2     (endpoint 200, completion 402: credits depleted)
 *   Ollama Cloud  glm-5.2             (endpoint 200, completion 403: rejected)
 *   Google        gemini-3.5-flash    (I/O 2026)
 *   Zhipu         glm-5.2             (open flagship, via z.ai OpenAI-compatible API)
 *   Groq          openai/gpt-oss-120b (open-weight model on a Groq credential —
 *                                      bills Groq, not OpenAI, despite the name)
 */
import {generateText, generateObject, type LanguageModel} from 'ai'
import type {LanguageModelV2, LanguageModelV2CallOptions} from '@ai-sdk/provider'
import type {z} from 'zod'
import {createOpenAI} from '@ai-sdk/openai'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import {groq} from '@ai-sdk/groq'

export type FallbackTier = {
  /** Stable identifier, e.g. "openai/gpt-5.5" */
  id: string
  /** Human-readable provider name surfaced in the UI */
  provider: string
  /**
   * Aliases for the same credential — the tier is attempted when ANY of
   * these env vars is non-empty (e.g. GEMINI_API_KEY vs the SDK's canonical
   * GOOGLE_GENERATIVE_AI_API_KEY).
   */
  envKeys: string[]
  getModel: () => LanguageModel
  /**
   * Model emits chain-of-thought billed against the same output budget as the
   * answer. When true, callers' `maxOutputTokens` is treated as sizing the
   * ANSWER and reasoning headroom is added on top — see
   * REASONING_HEADROOM_TOKENS.
   *
   * Verified 2026-08-07 against GLM-5.2 on OpenRouter: at 500 tokens (what
   * enrich-hypothesis.ts asks for) `generateObject` returned "the model did
   * not return a response" and the whole chain fell through to null. The same
   * call at 500 + 4096 succeeded. Without this flag the switch to GLM-5.2
   * silently breaks every caller with a small budget.
   */
  reasoning?: boolean
  /**
   * Per-tier retry count (default 0 — the chain itself is the retry
   * mechanism). Set to 1 for providers that shed load with transient 503s
   * rather than hard-failing (free-tier Gemini does this constantly).
   */
  maxRetries?: number
  /**
   * Provider-specific call options forwarded to generateText/generateObject.
   * Used to disable Gemini's thinking phase (thinkingBudget: 0) — otherwise
   * reasoning silently consumes the whole maxOutputTokens budget and the
   * tier returns empty text (verified against gemini-3-flash 2026-07-08).
   */
  providerOptions?: Parameters<typeof generateText>[0]['providerOptions']
}

const firstEnv = (...keys: string[]) =>
  keys.map((k) => process.env[k]).find((v) => v && v.length > 0)

/**
 * Extra output budget granted to reasoning tiers, ADDED to the caller's
 * `maxOutputTokens` rather than max()'d against it. A floor would make
 * chain-of-thought and answer share one ceiling, which is the failure this
 * exists to prevent. Mirrors REASONING_HEADROOM_TOKENS in
 * `apps/disclosure-rag/lib/llm_fallback.py`.
 */
export const REASONING_HEADROOM_TOKENS = 4096

const budgetFor = (tier: FallbackTier, maxOutputTokens: number) =>
  tier.reasoning ? maxOutputTokens + REASONING_HEADROOM_TOKENS : maxOutputTokens

const googleProvider = () =>
  createGoogleGenerativeAI({
    // GOOGLE_API_KEY before GEMINI_API_KEY: the GEMINI_API_KEY in this
    // project's env was revoked by Google as leaked (verified 2026-07-08).
    apiKey: firstEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'),
  })

const zhipu = () =>
  createOpenAI({
    baseURL: 'https://api.z.ai/api/paas/v4',
    apiKey: firstEnv('ZHIPU_API_KEY', 'GLM_API_KEY'),
  })

/**
 * The three gateways. All expose OpenAI's chat/completions shape, so one
 * factory helper covers them and no new SDK dependency is needed.
 */
const openrouter = () =>
  createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: firstEnv('OPENROUTER_API_KEY'),
  })

const huggingface = () =>
  createOpenAI({
    baseURL: 'https://router.huggingface.co/v1',
    apiKey: firstEnv('HUGGINGFACE_ACCESS_TOKEN', 'HF_TOKEN', 'HUGGINGFACE_API_KEY'),
  })

const ollamaCloud = () =>
  createOpenAI({
    baseURL: 'https://ollama.com/v1',
    apiKey: firstEnv('OLLAMA_API_KEY'),
  })

/**
 * Gateway tiers 1–3 all serve the SAME model (GLM-5.2 — the one entry on the
 * frontier-only list that is neither OpenAI nor Anthropic). Descending the
 * chain therefore changes the route, not the capability: output quality does
 * not silently degrade as tiers fail, which is what a mixed-capability chain
 * would do.
 */
export const FRONTIER_FALLBACK_CHAIN: FallbackTier[] = [
  {
    id: 'openrouter/glm-5.2',
    provider: 'GLM-5.2 (OpenRouter)',
    envKeys: ['OPENROUTER_API_KEY'],
    // .chat() for the same reason as z.ai: gateways serve chat/completions,
    // not OpenAI's Responses API.
    getModel: () => openrouter().chat('z-ai/glm-5.2'),
    reasoning: true,
    maxRetries: 1,
  },
  {
    // Verified 2026-08-07: endpoint lists models, but a real completion
    // returns 402 "depleted your monthly included credits". Retained so it
    // reactivates the moment credit is added — costs one attempt.
    id: 'huggingface/glm-5.2',
    provider: 'GLM-5.2 (HuggingFace Router)',
    envKeys: ['HUGGINGFACE_ACCESS_TOKEN', 'HF_TOKEN', 'HUGGINGFACE_API_KEY'],
    getModel: () => huggingface().chat('zai-org/GLM-5.2'),
    reasoning: true,
    maxRetries: 1,
  },
  {
    // Verified 2026-08-07: endpoint lists models, real completion returns 403.
    // The key authenticates for listing but is not entitled to inference.
    id: 'ollama-cloud/glm-5.2',
    provider: 'GLM-5.2 (Ollama Cloud)',
    envKeys: ['OLLAMA_API_KEY'],
    getModel: () => ollamaCloud().chat('glm-5.2'),
    reasoning: true,
    maxRetries: 1,
  },
  {
    id: 'google/gemini-3.5-flash',
    provider: 'Gemini 3.5 Flash',
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    getModel: () => googleProvider()('gemini-3.5-flash'),
    maxRetries: 1,
    providerOptions: {google: {thinkingConfig: {thinkingBudget: 0}}},
  },
  {
    // Backup Google tier: 3.5-flash frequently sheds load with 503s on
    // free-tier keys; 3-flash is same family, one step back, far more available.
    id: 'google/gemini-3-flash-preview',
    provider: 'Gemini 3 Flash',
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    getModel: () => googleProvider()('gemini-3-flash-preview'),
    maxRetries: 1,
    providerOptions: {google: {thinkingConfig: {thinkingBudget: 0}}},
  },
  {
    id: 'zhipu/glm-5.2',
    provider: 'GLM-5.2',
    envKeys: ['ZHIPU_API_KEY', 'GLM_API_KEY'],
    // .chat() — z.ai only serves chat/completions, not OpenAI's Responses API
    getModel: () => zhipu().chat('glm-5.2'),
    reasoning: true,
  },
  {
    id: 'groq/gpt-oss-120b',
    provider: 'GPT-OSS 120B (Groq)',
    envKeys: ['GROQ_API_KEY'],
    getModel: () => groq('openai/gpt-oss-120b'),
  },
]

const enabledTiers = (tiers: FallbackTier[]) =>
  tiers.filter((tier) => tier.envKeys.some((key) => process.env[key]))

/**
 * AI SDK language model that fails over before a provider stream begins.
 * Tool schemas and messages are replayed unchanged, so multi-step tool calls
 * remain owned by streamText. Once a provider has begun emitting bytes, the
 * stream cannot be safely replayed without duplicating UI/tool events.
 */
export function createStreamingFallbackModel(
  tiers: FallbackTier[] = FRONTIER_FALLBACK_CHAIN
): LanguageModelV2 {
  const active = enabledTiers(tiers)
  if (!active.length) throw new Error('No frontier AI provider credentials are configured')

  const primary = active[0].getModel() as LanguageModelV2
  const call = async <T>(
    method: 'doGenerate' | 'doStream',
    options: LanguageModelV2CallOptions
  ): Promise<T> => {
    let lastError: unknown
    for (const tier of active) {
      const attempts = (tier.maxRetries ?? 0) + 1
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          const model = tier.getModel() as LanguageModelV2
          const tierOptions = {
            ...options,
            // Same additive headroom as the non-streaming paths. Without it a
            // reasoning tier spends the caller's whole budget on
            // chain-of-thought and the stream ends having emitted nothing.
            ...(tier.reasoning && typeof options.maxOutputTokens === 'number'
              ? {maxOutputTokens: budgetFor(tier, options.maxOutputTokens)}
              : {}),
            providerOptions: {
              ...(options.providerOptions || {}),
              ...(tier.providerOptions || {}),
            },
          }
          return (await model[method](tierOptions)) as T
        } catch (error) {
          lastError = error
          console.warn(
            `model-fallback(stream): ${tier.id} attempt ${attempt}/${attempts} failed before streaming${attempt < attempts ? ', retrying tier' : ', trying next tier'}:`,
            error instanceof Error ? error.message : error
          )
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error('All frontier AI providers failed')
  }

  return {
    specificationVersion: 'v2',
    provider: 'ultraterrestrial-fallback',
    modelId: active.map((tier) => tier.id).join(' -> '),
    supportedUrls: primary.supportedUrls,
    doGenerate: (options) =>
      call<Awaited<ReturnType<LanguageModelV2['doGenerate']>>>('doGenerate', options),
    doStream: (options) =>
      call<Awaited<ReturnType<LanguageModelV2['doStream']>>>('doStream', options),
  }
}

export type FallbackResult = {
  text: string
  /** Tier that produced the text */
  tierId: string
  provider: string
}

export async function generateWithFallback({
  system,
  prompt,
  maxOutputTokens = 512,
  timeoutMsPerTier = 8_000,
  tiers = FRONTIER_FALLBACK_CHAIN,
}: {
  system?: string
  prompt: string
  maxOutputTokens?: number
  timeoutMsPerTier?: number
  tiers?: FallbackTier[]
}): Promise<FallbackResult | null> {
  for (const tier of tiers) {
    if (!tier.envKeys.some((key) => process.env[key])) continue

    try {
      const {text} = await generateText({
        model: tier.getModel(),
        system,
        prompt,
        // Reasoning tiers get headroom ON TOP of the caller's budget — the
        // caller's number sizes the answer, not the model's thinking.
        maxOutputTokens: budgetFor(tier, maxOutputTokens),
        // The chain IS the retry mechanism — fail fast to the next tier
        // instead of re-hammering a provider that just refused.
        maxRetries: tier.maxRetries ?? 0,
        providerOptions: tier.providerOptions,
        abortSignal: AbortSignal.timeout(timeoutMsPerTier),
      })
      const trimmed = text.trim()
      if (trimmed) {
        return {text: trimmed, tierId: tier.id, provider: tier.provider}
      }
      console.warn(`model-fallback: ${tier.id} returned empty text, trying next tier`)
    } catch (error) {
      console.warn(
        `model-fallback: ${tier.id} failed, trying next tier:`,
        error instanceof Error ? error.message : error
      )
    }
  }
  return null
}

export type FallbackObjectResult<T> = {
  object: T
  tierId: string
  provider: string
}

/**
 * Schema-constrained variant of the chain — same tier walk, but the model is
 * forced into a zod schema via generateObject. Tiers whose provider rejects
 * structured-output mode simply fall through like any other error.
 */
export async function generateObjectWithFallback<T>({
  schema,
  system,
  prompt,
  maxOutputTokens = 512,
  timeoutMsPerTier = 10_000,
  tiers = FRONTIER_FALLBACK_CHAIN,
}: {
  schema: z.ZodType<T>
  system?: string
  prompt: string
  maxOutputTokens?: number
  timeoutMsPerTier?: number
  tiers?: FallbackTier[]
}): Promise<FallbackObjectResult<T> | null> {
  for (const tier of tiers) {
    if (!tier.envKeys.some((key) => process.env[key])) continue

    try {
      // Cast: generateObject's conditional generic can't resolve against an
      // unconstrained T; the zod schema still validates the output at runtime.
      const {object} = await generateObject({
        model: tier.getModel(),
        schema: schema as z.ZodTypeAny,
        system,
        prompt,
        maxOutputTokens: budgetFor(tier, maxOutputTokens),
        maxRetries: tier.maxRetries ?? 0,
        providerOptions: tier.providerOptions,
        abortSignal: AbortSignal.timeout(timeoutMsPerTier),
      })
      return {object: object as T, tierId: tier.id, provider: tier.provider}
    } catch (error) {
      console.warn(
        `model-fallback(object): ${tier.id} failed, trying next tier:`,
        error instanceof Error ? error.message : error
      )
    }
  }
  return null
}
