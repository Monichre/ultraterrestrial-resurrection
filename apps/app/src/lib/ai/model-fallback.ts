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
import { generateText, type LanguageModel } from 'ai'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'

export type FallbackTier = {
  /** Stable identifier, e.g. "openai/gpt-5.5" */
  id: string
  /** Human-readable provider name surfaced in the UI */
  provider: string
  /** Every env var listed must be non-empty for the tier to be attempted */
  envKeys: string[]
  getModel: () => LanguageModel
}

const zhipu = () =>
  createOpenAI({
    baseURL: 'https://api.z.ai/api/paas/v4',
    apiKey: process.env.ZHIPU_API_KEY,
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
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY'],
    getModel: () => google('gemini-3.5-flash'),
  },
  {
    id: 'zhipu/glm-5.2',
    provider: 'GLM-5.2',
    envKeys: ['ZHIPU_API_KEY'],
    getModel: () => zhipu()('glm-5.2'),
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
    if (tier.envKeys.some((key) => !process.env[key])) continue

    try {
      const { text } = await generateText({
        model: tier.getModel(),
        system,
        prompt,
        maxOutputTokens,
        // The chain IS the retry mechanism — fail fast to the next tier
        // instead of re-hammering a provider that just refused.
        maxRetries: 0,
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
