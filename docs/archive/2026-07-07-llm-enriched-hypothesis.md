# LLM-Enriched Hypothesis — deterministic floor, frontier ceiling

**Date:** 2026-07-07
**Status:** Implemented
**Related ticket:** T-037 (docs/plans/TODO.md)

## Goal

The Research Suggestions Dock's hypothesis was purely deterministic (join-table
links + stored pgvector affinity + temporal clustering, synthesized in
`features/mindmap/actions/related-records.ts`). This work layers a frontier LLM
on top: the deterministic hypothesis renders instantly and is the **floor**; a
frontier model rewrites it into a sharper research thesis grounded strictly in
the surfaced records, and the dock swaps it in when it arrives. Any LLM failure
(quota, timeout, refusal) leaves the floor untouched.

## User directives baked in

1. **Comprehensive provider fallback** — not a single-provider call.
2. **Frontier models only** (user, 2026-07-07): GPT-5.5, Claude Opus 4.8 /
   Sonnet 5, Gemini 3.5 Flash, GLM-5.2. No legacy tiers anywhere.
3. **Flag research/mindmap prompts for review** — tracked as T-037.

## Architecture

### `apps/app/src/lib/ai/model-fallback.ts` (new, reusable)

Ordered 6-tier chain via Vercel AI SDK `generateText`; each tier is skipped when
its env key is missing and abandoned on any error:

| # | Model | ID | Env key | Live today? |
|---|-------|----|---------|-------------|
| 1 | GPT-5.5 | `gpt-5.5` | `OPENAI_API_KEY` | key set, quota exhausted → falls through |
| 2 | Claude Opus 4.8 | `claude-opus-4-8` | `ANTHROPIC_API_KEY` | ✅ |
| 3 | Claude Sonnet 5 | `claude-sonnet-5` | `ANTHROPIC_API_KEY` | ✅ |
| 4 | Gemini 3.5 Flash | `gemini-3.5-flash` | `GOOGLE_GENERATIVE_AI_API_KEY` | skipped until key added |
| 5 | GLM-5.2 | `glm-5.2` (z.ai OpenAI-compatible endpoint) | `ZHIPU_API_KEY` | skipped until key added |
| 6 | GPT-OSS 120B | `openai/gpt-oss-120b` on Groq | `GROQ_API_KEY` | ✅ (last resort) |

Model IDs verified against provider docs 2026-07-07. Per-tier 8s
`AbortSignal.timeout`. No sampling params passed (Opus 4.8 rejects
temperature/top_p).

### `features/mindmap/actions/enrich-hypothesis.ts` (new server action)

Input: seeds + ranked suggestions (with signal type/detail/score/snippet) +
deterministic hypothesis + optional tour context. Prompt constrains the model
to the provided records only, 2–3 sentences, no preamble. Output sanity-gated
(40–900 chars) before it can replace the floor. Returns `{hypothesis, provider}`
or `null`.

### `components/research-suggestions-dock.tsx` (edited)

- Enrichment fires after the deterministic result renders — never blocks cards
  or the baseline.
- Stale-response protection reuses the existing `requestSeq` guard.
- Per-`seedKey` cache (ref Map) — revisiting a tour waypoint never re-bills.
- UI: violet left-border + "AI-refined · {provider}" chip on the enriched
  thesis; subtle "Refining hypothesis…" spinner while in flight; existing
  `AnimatePresence` key-swap animates the upgrade.

### Bonus: Prometheus route model upgrade

`/api/prometheus/chat` was pinned to `gpt-4-turbo` — upgraded to `gpt-5.5`.
Full fallback-chain adoption for tool-calling routes is T-037 (needs a
`streamText` variant of the chain).

## Verification (2026-07-07)

- **Typecheck:** 1,913 total errors vs ~1,931 baseline — zero new errors in
  `model-fallback.ts`, `enrich-hypothesis.ts`, `research-suggestions-dock.tsx`.
  (`@ai-sdk/google` had to be pinned to the 2.x line — 4.x implements a newer
  LanguageModel spec than `ai@6.0.42` accepts.)
- **Live chain run (real keys):** chain walked all tiers correctly, skipped
  keyless tiers (Google, Zhipu), logged each failure, returned `null`
  gracefully → deterministic floor preserved. Exactly the designed degradation.
- **⚠️ Billing status discovered:** ALL providers currently unusable —
  OpenAI quota exhausted (known), **Anthropic credit balance too low (new)**,
  **Groq API key invalid (stale)**. Enrichment cannot succeed until at least
  one account is topped up / key rotated. The dock shows the deterministic
  hypothesis with no error UI in the meantime.
- `maxRetries: 0` set per tier — the chain is the retry mechanism; SDK-default
  retries were tripling time-to-fallback.
- Browser re-check of the enriched path pending billing top-up (any one of the
  six providers suffices).
