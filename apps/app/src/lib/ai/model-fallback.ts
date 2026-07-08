/**
 * Multi-provider frontier-model fallback chain.
 *
 * Policy (2026-07): only current frontier models — never legacy tiers.
 * Tiers are tried in order; a tier is skipped when its API key is absent
 * and abandoned on any error (quota, timeout, refusal), so one provider
 * being down never takes the feature down. Callers get the first success
 * plus which tier produced it.
 *
 * Verified model IDs (2026-07-07):
 *   OpenAI     gpt-5.5             (flagship, Apr 2026)
 *   Anthropic  claude-opus-4-8     (top Opus)
 *   Anthropic  claude-sonnet-5     (fast frontier)
 *   Google     gemini-3.5-flash    (I/O 2026)
 *   Zhipu      glm-5.2             (open flagship, via z.ai OpenAI-compatible API)
 *   Groq       openai/gpt-oss-120b (top Groq-hosted; kimi-k2 deprecated 2026-03)
 */
import { generateText, generateObject, type LanguageModel } from 'ai'
import type { z } from 'zod'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'

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

export const FRONTIER_FALLBACK_CHAIN: FallbackTier[] = [
  {
    id: 'openai/gpt-5.5',
    provider: 'GPT-5.5',
    envKeys: ['OPENAI_API_KEY'],
    getModel: () => openai('gpt-5.5'),
  },
  {
    id: 'anthropic/claude-opus-4-8',
    provider: 'Claude Opus 4.8',
    envKeys: ['ANTHROPIC_API_KEY'],
    getModel: () => anthropic('claude-opus-4-8'),
  },
  {
    id: 'anthropic/claude-sonnet-5',
    provider: 'Claude Sonnet 5',
    envKeys: ['ANTHROPIC_API_KEY'],
    getModel: () => anthropic('claude-sonnet-5'),
  },
  {
    id: 'google/gemini-3.5-flash',
    provider: 'Gemini 3.5 Flash',
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    getModel: () => googleProvider()('gemini-3.5-flash'),
    maxRetries: 1,
    providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
  },
  {
    // Backup Google tier: 3.5-flash frequently sheds load with 503s on
    // free-tier keys; 3-flash is same family, one step back, far more available.
    id: 'google/gemini-3-flash-preview',
    provider: 'Gemini 3 Flash',
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    getModel: () => googleProvider()('gemini-3-flash-preview'),
    maxRetries: 1,
    providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
  },
  {
    id: 'zhipu/glm-5.2',
    provider: 'GLM-5.2',
    envKeys: ['ZHIPU_API_KEY', 'GLM_API_KEY'],
    // .chat() — z.ai only serves chat/completions, not OpenAI's Responses API
    getModel: () => zhipu().chat('glm-5.2'),
  },
  {
    id: 'groq/gpt-oss-120b',
    provider: 'GPT-OSS 120B (Groq)',
    envKeys: ['GROQ_API_KEY'],
    getModel: () => groq('openai/gpt-oss-120b'),
  },
]

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
      const { text } = await generateText({
        model: tier.getModel(),
        system,
        prompt,
        maxOutputTokens,
        // The chain IS the retry mechanism — fail fast to the next tier
        // instead of re-hammering a provider that just refused.
        maxRetries: tier.maxRetries ?? 0,
        providerOptions: tier.providerOptions,
        abortSignal: AbortSignal.timeout(timeoutMsPerTier),
      })
      const trimmed = text.trim()
      if (trimmed) {
        return { text: trimmed, tierId: tier.id, provider: tier.provider }
      }
      console.warn(`model-fallback: ${tier.id} returned empty text, trying next tier`)
    } catch (error) {
      console.warn(
        `model-fallback: ${tier.id} failed, trying next tier:`,
        error instanceof Error ? error.message : error,
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
      const { object } = await generateObject({
        model: tier.getModel(),
        schema: schema as z.ZodTypeAny,
        system,
        prompt,
        maxOutputTokens,
        maxRetries: tier.maxRetries ?? 0,
        providerOptions: tier.providerOptions,
        abortSignal: AbortSignal.timeout(timeoutMsPerTier),
      })
      return { object: object as T, tierId: tier.id, provider: tier.provider }
    } catch (error) {
      console.warn(
        `model-fallback(object): ${tier.id} failed, trying next tier:`,
        error instanceof Error ? error.message : error,
      )
    }
  }
  return null
}
