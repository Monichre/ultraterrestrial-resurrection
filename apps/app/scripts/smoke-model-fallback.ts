/**
 * Smoke test for the frontier fallback chain — probes EVERY tier (not just
 * first success) so we know exactly which providers are live.
 * Run: cd apps/app && bun run scripts/smoke-model-fallback.ts
 */
import { generateText } from 'ai'
import { FRONTIER_FALLBACK_CHAIN, generateWithFallback } from '../src/lib/ai/model-fallback'

async function probeAll() {
  console.log('=== Per-tier probe ===')
  for (const tier of FRONTIER_FALLBACK_CHAIN) {
    if (!tier.envKeys.some((k) => process.env[k])) {
      console.log(`SKIP  ${tier.id} — none of: ${tier.envKeys.join(' | ')}`)
      continue
    }
    const start = Date.now()
    try {
      const { text } = await generateText({
        model: tier.getModel(),
        prompt: 'Reply with exactly the word: ok',
        maxOutputTokens: 20,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(15_000),
      })
      console.log(`LIVE  ${tier.id} (${Date.now() - start}ms) -> ${JSON.stringify(text.trim().slice(0, 40))}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log(`FAIL  ${tier.id} (${Date.now() - start}ms) — ${msg.slice(0, 200)}`)
    }
  }
}

async function chainTest() {
  console.log('\n=== Chain walk (generateWithFallback) ===')
  const res = await generateWithFallback({
    system: 'You are a terse assistant.',
    prompt: 'Name the first tier that answered. Reply with one short sentence.',
    maxOutputTokens: 60,
    timeoutMsPerTier: 15_000,
  })
  if (!res) {
    console.log('CHAIN RESULT: null — every tier failed')
  } else {
    console.log(`CHAIN RESULT: served by ${res.tierId} (${res.provider})`)
    console.log(`  text: ${res.text.slice(0, 120)}`)
  }
}

async function objectTest() {
  console.log('\n=== Structured-output walk (generateObjectWithFallback, liturgy-shaped) ===')
  const { z } = await import('zod')
  const { generateObjectWithFallback } = await import('../src/lib/ai/model-fallback')
  const schema = z.object({
    reading: z.string(),
    counterReading: z.string(),
    whatRemainsWeird: z.string(),
    nextTrace: z.string(),
  })
  const res = await generateObjectWithFallback({
    schema,
    system:
      'You are a research analyst. Never say "proves" — say "is consistent with" or "was claimed". Pair every reading with a counter-reading.',
    prompt:
      'Two records: (1) 1976 Tehran UFO incident — F-4 instrumentation failures near the object, DIA report exists. (2) Topic: electromagnetic-interference claims in military UAP cases. Give the liturgy fields, one sentence each.',
    maxOutputTokens: 400,
    timeoutMsPerTier: 25_000,
  })
  if (!res) {
    console.log('OBJECT RESULT: null — every tier failed')
  } else {
    console.log(`OBJECT RESULT: served by ${res.tierId} (${res.provider})`)
    for (const [k, v] of Object.entries(res.object)) console.log(`  ${k}: ${String(v).slice(0, 140)}`)
  }
}

await probeAll()
await chainTest()
await objectTest()
