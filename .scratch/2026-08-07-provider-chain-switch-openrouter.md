# Provider chain switch → OpenRouter / HuggingFace / Ollama Cloud

**Date:** 2026-08-07
**Request:** switch default provider for the fallback chains to
openrouter → huggingface → ollama-cloud; stop OpenAI/Anthropic API token usage.

---

## What changed

| File | Change |
|---|---|
| `apps/disclosure-rag/lib/llm_fallback.py` | New chain head (3 gateways); **deleted** `anthropic/claude-sonnet-5`, `anthropic/claude-opus-4-8`, `openai/gpt-5.5`; `402` added to `PERMANENT_STATUS`; `REASONING_MIN_TOKENS` floor → `REASONING_HEADROOM_TOKENS` additive |
| `apps/app/src/lib/ai/model-fallback.ts` | Same reordering + same three removals; dropped now-unused `openai`/`anthropic` SDK imports |
| `apps/disclosure-rag/lib/transcript_fidelity.py` | `llm_coherence_review()` was constructing its own `OpenAI()` client on `gpt-5.5`, bypassing the chain — rerouted through `LLMFallback` |
| `apps/disclosure-rag/scripts/playlist_ingestion.py` | `--llm-review` help text (stale `FIDELITY_REVIEW_MODEL` → `FIDELITY_REVIEW_PROVIDER`) |
| `apps/disclosure-rag/.env` | Appended `OPENROUTER_API_KEY` copied from repo-root `.env` (gitignored; value never echoed) |

Resulting Python chain:

```
openrouter/glm-5.2 -> huggingface/glm-5.2 -> ollama-cloud/glm-5.2
  -> deepseek/deepseek-v4-pro -> together/kimi-k3 -> groq/gpt-oss-120b
```

All three gateways serve **the same model** (GLM-5.2 — the only entry on the
frontier-only list that is neither OpenAI nor Anthropic), so descending the
chain changes route, not capability.

---

## Provider liveness (2026-08-07)

A `200` on `/models` is **not** evidence of a working key. Measured with real
completions:

| tier | `/models` | real completion |
|---|---|---|
| openrouter | 200 | ✅ served |
| huggingface | 200 | ❌ `402 — depleted your monthly included credits` |
| ollama-cloud | 200 | ❌ `403` — authenticates for listing, not entitled to inference |
| deepseek | — | ✅ served |

**The requested 3-deep chain is currently 1-deep.** Tiers 2 and 3 need billing
fixed before they are real redundancy.

Credential delivery is also uneven: `OPENROUTER_API_KEY` now lives in
`apps/disclosure-rag/.env`, but `HUGGINGFACE_ACCESS_TOKEN` and `OLLAMA_API_KEY`
exist **only as ambient shell exports** (`OLLAMA_API_KEY` from `~/.zshrc:311`).
They resolve for an interactive `dy` run and are silently absent under
cron/CI/Vercel.

---

## Bugs surfaced by the switch

1. **`402` was in neither status set** — fell through to the transient path, so
   a depleted-credit tier would have cost one wasted round-trip on *every* call
   across a 104-episode batch. Now permanent; verified the tier is dead-cached
   after one attempt.
2. **Reasoning budget was a ceiling, not headroom.** `max(max_tokens, 2048)`
   made CoT and answer share one budget. Now additive (`+4096`) in **both**
   chains.
3. **`enrich-hypothesis` was outright broken by the switch and would have
   shipped that way.** It asks for `maxOutputTokens: 500`
   (`enrich-hypothesis.ts:102`); GLM-5.2 spent all 500 on chain-of-thought and
   `generateObject` returned *"the model did not return a response"*, cascading
   to `null` through every tier. Measured before the fix:

   | caller config | before | after |
   |---|---|---|
   | `enrich-hypothesis` 500 / 10s | **NULL** | OK `openrouter/glm-5.2` (7,972ms) |
   | `synthesize-investigation` 1800 / 25s | OK | OK (8,751ms) |
   | stock defaults 512 / 10s | **NULL** | — |

   Note 7,972ms against `enrich-hypothesis`'s own 10s per-tier timeout. It
   passes, with ~2s of margin. GLM-5.2 is slower than what that timeout was
   tuned for.

### Blast radius worth knowing

`REASONING_HEADROOM_TOKENS` also lifts `deepseek/deepseek-v4-pro` and
`together/kimi-k3` from 2,048 → caller+4,096 per call. Those tiers were not
broken; the change is very likely strictly better, but it is a ~2.6× budget
increase on working paths.

---

## Still billing OpenAI / Anthropic — NOT covered by this change

The chains are clean. These are **direct clients** that bypass them entirely:

| file | vendor | reachability |
|---|---|---|
| `lib/anthropic/claude.ts:16` | Anthropic — and on **legacy** `claude-4-sonnet-20250115`, which also violates the frontier-only policy | **imported by 7 files** |
| `services/ai/claude/get-claude-response.ts:7` | Anthropic `claude-sonnet-5` | 1 importer |
| `api/prometheus/chat/route.ts:68` | `new OpenAI()` | live route |
| `features/ai/actions/chat.actions.tsx:11` | `new OpenAI()` | 1 importer |
| `features/mindmap/actions/ai-actions.ts:7` | `new OpenAI()` | 1 importer |
| `features/mindmap/actions/smart-connection-analysis.ts:8` | `new OpenAI()` | 0 importers (dead) |
| `lib/unified_rag_orchestrator.py:72`, `lib/simple_unified_search.py:57` | OpenAI | disclosure-rag |

Deliberate carve-outs (cannot move): `lib/knowledge_base.py:127,172` +
`vectorize.ts` / `embed-query.ts` embeddings, and `lib/openai_client/*`
(Assistants API / vector store).

`lib/anthropic/claude.ts` is the one to do next — 7 importers on a legacy model.

---

## NOT fixed — enrichment still fails at production scale

The provider switch does **not** by itself fix the 47 `enrichment_failed`
episodes. With OpenRouter live, `process_document_for_rag` now reaches the
prompt stages and fails later, on output length:

| input chars | result |
|---|---|
| 4,000 | `status: ok`, 3 chunks, **0 entities** |
| 8,000 | `JSONDecodeError` — truncated at char 7,584 |
| 20,000 | `JSONDecodeError` — truncated at char 15,940 |

Real transcripts are ~287,000 chars. GLM-5.2 emits verbose JSON and the
chunking prompt's declared `runtime.max_tokens: 1200`
(`processing/rag_prompt_pipeline.py:134`) is far below what it actually
produces. Raising headroom moved the truncation point (7,209 → 15,940) but did
not clear it — inflating the budget further is a treadmill, not a fix.

Two separate open problems:

- **Output truncation.** Needs the source pre-split before the chunking prompt,
  or per-prompt `max_tokens` raised in prompt metadata, or continuation
  handling in `_extract_json_payload`.
- **Zero entities even on a successful run.** NER returned nothing at 4k chars
  with `status: ok`. Not diagnosed.

Re-running the 47 episodes is pointless until the first is fixed.
