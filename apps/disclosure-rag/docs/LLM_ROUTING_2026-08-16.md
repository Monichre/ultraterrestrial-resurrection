# LLM Routing Config — 2026-08-16 Rework

## What changed

Two fixes and a full tier consolidation, all driven by the user directive:
**Gemini must route through OpenRouter (70% off), not native Google API.**

### 1. OpenAI upload crash fixed

**File**: `apps/disclosure-rag/lib/kb/knowledge_base_service.py:436-438`

`file_paths` carries dict values from `trace_map` and `rag_pipeline` stages.
The old filter passed dicts to `os.path.exists()`, crashing with:

```
stat: path should be string, bytes, os.PathLike or integer, not dict
```

Fix: added `isinstance(v, str)` guard so only string paths reach
`upload_file_to_openai`.

```python
files_to_upload = [
    (k, v) for k, v in file_paths.items()
    if isinstance(v, str) and os.path.exists(v)]
```

### 2. Native Google Gemini tiers removed

**File**: `packages/ai/prompts/llm_routing.yaml`

The old config had two `kind: google` tiers (`google/gemini-3-flash`,
`google/gemini-3.1-pro`) that called `generativelanguage.googleapis.com`
directly with `GEMINI_API_KEY`. These hit free-tier quota limits (HTTP 429)
and bypassed OpenRouter's 70% discount.

### 3. Full tier consolidation: 33 → 13

**File**: `packages/ai/prompts/llm_routing.yaml`

Replaced 33 mixed-vendor tiers (many with dead keys, native Google/Anthropic
direct API calls, Groq, Together, Perplexity, Cohere, xAI, auto-router
variants, custom presets) with 8 discounted models + 5 OpenRouter presets.

**File**: `apps/disclosure-rag/lib/llm_fallback.py`

`FRONTIER_FALLBACK_CHAIN` (emergency chain used when yaml router isn't
loaded) also replaced — 7 old tiers → 8 OpenRouter-only tiers, same order.

## Current tier list (priority order)

All tiers use `OPENROUTER_API_KEY` and route through `openrouter.ai/api/v1`.

| # | Tier ID | Model | Kind | Structured | Reasoning | Cost |
|---|---------|-------|------|-----------|-----------|------|
| 1 | `openrouter/gemini-3.7-flash-batch` | `google/gemini-3.7-flash:batch` | openai_compat | yes | yes | 1 |
| 2 | `openrouter/gemini-3.7-flash` | `google/gemini-3.7-flash` | openai_compat | yes | yes | 2 |
| 3 | `openrouter/gpt-5.6-luna-pro` | `openai/gpt-5.6-luna-pro` | openai_compat | yes | yes | 1 |
| 4 | `openrouter/gpt-5.6-luna` | `openai/gpt-5.6-luna` | openai_compat | yes | no | 1 |
| 5 | `openrouter/gpt-5.6-terra-pro` | `openai/gpt-5.6-terra-pro` | openai_compat | yes | yes | 3 |
| 6 | `openrouter/gpt-5.6-terra` | `openai/gpt-5.6-terra` | openai_compat | yes | yes | 3 |
| 7 | `openrouter/glm-5.2` | `z-ai/glm-5.2` | openai_compat | yes | yes | 2 |
| 8 | `openrouter/deepseek-v4-pro` | `deepseek/deepseek-v4-pro` | openai_compat | **no** | yes | 1 |

### Presets (server-side, `openrouter_preset` kind)

| Tier ID | Model | Slug |
|---------|-------|------|
| `openrouter/preset-discounted` | `@preset/discounted` | discounted |
| `openrouter/preset-free-models` | `@preset/free-models` | free-models |
| `openrouter/preset-media-gen` | `@preset/media-gen` | media-gen |
| `openrouter/preset-opensource` | `@preset/opensource` | opensource |
| `openrouter/preset-design-agents` | `@preset/design-agents` | design-agents |

## Task routing

Every task's `preferred_tiers` and `fallback_tiers` now reference only the
8 model tiers above. The priority order within each task follows the user's
discounted-model priority: batch Gemini first, then flash Gemini, then
Luna/Pro, then Terra, then GLM-5.2, then DeepSeek as last resort.

| Task | Preferred (top 3) | Fallbacks |
|------|-------------------|-----------|
| `document_classification` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna | luna-pro, terra, glm-5.2, deepseek-v4-pro |
| `disclosure.content_analysis` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna-pro | terra-pro, terra, glm-5.2 |
| `rag_ingestion` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-terra-pro | terra, luna-pro, glm-5.2 |
| `disclosure.ner` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna-pro | luna, terra, glm-5.2 |
| `validation` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna | luna-pro, terra, glm-5.2, deepseek-v4-pro |
| `narrative_summary` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna-pro | terra, terra-pro, glm-5.2, deepseek-v4-pro |
| `coherence_review` | gemini-3.7-flash-batch, gemini-3.7-flash, gpt-5.6-luna | luna-pro, terra, glm-5.2, deepseek-v4-pro |
| `parse_repair` | inherits from parent | inherits from parent |

### Global last-resort chain

```yaml
defaults:
  last_resort_tiers:
    - openrouter/glm-5.2
    - openrouter/deepseek-v4-pro
```

## What was removed

- All `kind: google` tiers (native Google API calls)
- All `kind: anthropic` tiers (dead API keys)
- `openai/gpt-5.5` (dead key)
- `xai/grok-4` (out of credits)
- `groq/gpt-oss-120b` (dead key)
- `together/kimi-k3`, `perplexity/sonar`, `cohere/command-r-plus`
- `openrouter/solar-pro4`, `openrouter/longcat-2.0`, `openrouter/ling-3.0-flash`
- `openrouter/tencent-hy3`, `openrouter/laguna-s-2.1`
- `openrouter/deepseek-v4-flash-0731` (replaced by deepseek-v4-pro)
- All `openrouter/auto-*` tiers (5 auto-router variants)
- All old custom presets (`disclosure-classification`, `disclosure-content-analysis`, etc.)
- `FRONTIER_FALLBACK_CHAIN` old entries: huggingface/glm-5.2, ollama-cloud/glm-5.2, deepseek/deepseek-v4-pro (direct), together/kimi-k3, groq/gpt-oss-120b, zhipu/glm-5.2

## Wire path (before vs after)

```
BEFORE (native Google, full price, 429 quota)
  dy → llm_fallback → google.genai.Client(GEMINI_API_KEY)
    → POST generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview

AFTER (via OpenRouter, 70% off)
  dy → llm_fallback → OpenAI(base_url=openrouter.ai, OPENROUTER_API_KEY)
    → POST openrouter.ai/api/v1/chat/completions  (model: "google/gemini-3.7-flash")
```

## Files modified

| File | Change |
|------|--------|
| `apps/disclosure-rag/lib/kb/knowledge_base_service.py` | Upload filter: added `isinstance(v, str)` guard |
| `packages/ai/prompts/llm_routing.yaml` | Full rewrite: 33 tiers → 8 models + 5 presets |
| `apps/disclosure-rag/lib/llm_fallback.py` | `FRONTIER_FALLBACK_CHAIN`: 7 old tiers → 8 OpenRouter tiers |

## Verification

- YAML loads, all task references resolve to declared tiers
- No `kind: google` or `kind: anthropic` tiers remain
- All tiers use `OPENROUTER_API_KEY`
- Python import of `FRONTIER_FALLBACK_CHAIN` succeeds
- Upload filter correctly skips dict values from `trace_map` and `rag_pipeline`

## Notes for agents

- **DeepSeek V4 Pro has no structured output support** — it rejects
  `response_format`. Only use it for free-text tasks or as last resort.
- **Batch mode (`gemini-3.7-flash:batch`) is non-streaming** — don't use it
  for tasks that need streaming responses.
- **The `model:` field in yaml still says `google/gemini-*`** — this is
  OpenRouter's model identifier (what OR routes to internally), not a
  native Google API call. The `kind: openai_compat` + `base_url:
  openrouter.ai` is what makes it route through OpenRouter.
- **Presets are server-side** — they activate when the preset slug exists
  on OpenRouter. The `@preset/discounted` and `@preset/free-models` slugs
  are OpenRouter built-ins; the others may need to be created.
- **The `apps/app/src/lib/ai/model-fallback.ts` file** (Next.js app) still
  has native Google Gemini tiers. That file is in a separate app
  (`apps/app`) and is out of scope for this change. Do not modify it unless
  the user asks.
