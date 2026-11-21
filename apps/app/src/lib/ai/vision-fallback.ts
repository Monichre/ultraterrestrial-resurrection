/**
 * Vision (image → text) fallback chain.
 *
 * Sibling of `model-fallback.ts`, not a replacement for it. That chain is
 * text-in/text-out: its tiers are selected for completion quality and several
 * of them (`groq/gpt-oss-120b`, `z-ai/glm-5.2` on OpenRouter) reject image
 * parts outright — verified 2026-08-13, OpenRouter answered
 * `No endpoints found that support image input` for z-ai/glm-5.2. Reusing that
 * chain for captions would therefore burn every tier before failing, and a
 * text-only model that *doesn't* hard-fail returns "I'm unable to view images",
 * which would then be embedded and fanned out as if it were the user's
 * document. Hence a separate, explicitly vision-capable tier list.
 *
 * Policy inherited from `model-fallback.ts` (2026-08-07): frontier models only,
 * routed through gateways. First-party OpenAI/Anthropic tiers are deliberately
 * ABSENT — a trailing first-party tier means the first time every gateway fails
 * the request silently bills a vendor we chose to stop paying, and absence is
 * the only enforcement that survives an outage. The OpenAI carve-out for
 * `text-embedding-3-small` does not extend to completions.
 *
 * Tier state as probed 2026-08-13 (all four failed — see T-060 report):
 *   z.ai        glm-5v-turbo             429 "Insufficient balance or no resource package"
 *   OpenRouter  google/gemini-3.5-flash  402 "Insufficient credits"
 *   OpenRouter  openai/gpt-5.5           402 "Insufficient credits"
 *   Google      gemini-3.5-flash         400 "Your API key was reported as leaked"
 * The chain is written so the image path starts working the moment any one of
 * those credentials is funded; until then callers get null and must surface
 * that honestly rather than embedding a placeholder.
 */
import {generateText} from 'ai'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import {createOpenAI} from '@ai-sdk/openai'
import type {LanguageModel} from 'ai'

export type VisionTier = {
  /** Stable identifier, e.g. "openrouter/google/gemini-3.5-flash" */
  id: string
  /** Human-readable provider name, safe to surface in the UI */
  provider: string
  /** Tier is attempted when ANY of these env vars is non-empty */
  envKeys: string[]
  getModel: () => LanguageModel
}

const firstEnv = (...keys: string[]) =>
  keys.map((k) => process.env[k]).find((v) => v && v.length > 0)

const openrouter = () =>
  createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: firstEnv('OPENROUTER_API_KEY'),
  })

const zhipu = () =>
  createOpenAI({
    baseURL: 'https://api.z.ai/api/paas/v4',
    apiKey: firstEnv('ZHIPU_API_KEY', 'GLM_API_KEY'),
  })

const googleProvider = () =>
  createGoogleGenerativeAI({
    // GOOGLE_API_KEY ahead of GEMINI_API_KEY for the same reason as
    // model-fallback.ts — the GEMINI key in this env was revoked as leaked.
    apiKey: firstEnv('GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'),
  })

export const VISION_FALLBACK_CHAIN: VisionTier[] = [
  {
    id: 'zhipu/glm-5v-turbo',
    provider: 'GLM-5V Turbo',
    envKeys: ['ZHIPU_API_KEY', 'GLM_API_KEY'],
    // .chat() — z.ai serves chat/completions, not OpenAI's Responses API.
    getModel: () => zhipu().chat('glm-5v-turbo'),
  },
  {
    id: 'openrouter/google/gemini-3.5-flash',
    provider: 'Gemini 3.5 Flash (OpenRouter)',
    envKeys: ['OPENROUTER_API_KEY'],
    getModel: () => openrouter().chat('google/gemini-3.5-flash'),
  },
  {
    id: 'openrouter/openai/gpt-5.5',
    provider: 'GPT-5.5 (OpenRouter)',
    envKeys: ['OPENROUTER_API_KEY'],
    getModel: () => openrouter().chat('openai/gpt-5.5'),
  },
  {
    id: 'google/gemini-3.5-flash',
    provider: 'Gemini 3.5 Flash',
    envKeys: ['GOOGLE_GENERATIVE_AI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    getModel: () => googleProvider()('gemini-3.5-flash'),
  },
]

export type VisionResult = {
  text: string
  tierId: string
  provider: string
}

/**
 * Describe/transcribe an image as text. Returns null when no configured tier
 * produces usable text — callers must treat that as a failure to extract, not
 * as an empty document.
 */
export async function captionImageWithFallback({
  image,
  mediaType,
  instruction = 'Transcribe every piece of visible text in this image verbatim, preserving line order. Then describe what the image shows in two or three factual sentences: objects, people, place, date stamps, document type, and any identifiers. Do not speculate about meaning.',
  maxOutputTokens = 1_200,
  timeoutMsPerTier = 30_000,
  tiers = VISION_FALLBACK_CHAIN,
}: {
  image: Uint8Array
  mediaType: string
  instruction?: string
  maxOutputTokens?: number
  timeoutMsPerTier?: number
  tiers?: VisionTier[]
}): Promise<VisionResult | null> {
  for (const tier of tiers) {
    if (!tier.envKeys.some((key) => process.env[key])) continue

    try {
      const {text} = await generateText({
        model: tier.getModel(),
        maxOutputTokens,
        // The chain IS the retry mechanism — fail fast to the next tier.
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(timeoutMsPerTier),
        messages: [
          {
            role: 'user',
            content: [
              {type: 'text', text: instruction},
              {type: 'image', image, mediaType},
            ],
          },
        ],
      })
      const trimmed = text.trim()
      if (trimmed) return {text: trimmed, tierId: tier.id, provider: tier.provider}
      console.warn(`vision-fallback: ${tier.id} returned empty text, trying next tier`)
    } catch (error) {
      console.warn(
        `vision-fallback: ${tier.id} failed, trying next tier:`,
        error instanceof Error ? error.message : error
      )
    }
  }
  return null
}
