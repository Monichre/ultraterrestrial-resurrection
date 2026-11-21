# 03 — Long-context models (whole-document understanding)

Written 2026-09-29 (research only; no paid API calls made, no model was run by us).

**Scope:** which models can read one large document in a single pass and still analyze its content, write a narrative summary, link claims to evidence across sections, and check a summary against its source. Corpus: podcast transcripts (up to ~200k chars ≈ 50k tokens), full declassified reports, book chapters. The sizing case is a **150k-token** input. Providers are limited to [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml).

## How to read the table

- **IDs** are OpenRouter slugs, checked against `https://openrouter.ai/api/v1/models` on 2026-09-29. NVIDIA NIM IDs were checked against the public `https://integrate.api.nvidia.com/v1/models` the same day: `moonshotai/kimi-k3`, `z-ai/glm-5.3`, `z-ai/glm-5.3-flash`, `deepseek-ai/deepseek-v4.1-flash` (note the `deepseek-ai/` prefix). On OpenAI, DeepSeek, Merge (`zai/…`) and Cheaper Inference, drop the vendor prefix. Those direct IDs are **unverified**, the same convention as [`04-orchestration.md`](04-orchestration.md).
- **Effective context** = the longest length where a published multi-needle or long-doc reasoning score stays ≥75%. "≥100k" means the only evidence is AA-LCR, whose documents run about 100k tokens. That covers 100k, not 150k.
- **$ / 150k doc** = 150k input + **20k output** (reasoning tokens included; AA-LCR scores were run at max/xhigh effort, and Opus 5.5 always thinks). The prices are OpenRouter list prices. NIM billing is unverified. The `:batch` variants cost half and suit offline ingestion.
- **AA-LCR** column = BenchLM's current copy of Artificial Analysis Long Context Reasoning v1.1 ([benchlm.ai/benchmarks/lcr](https://benchlm.ai/benchmarks/lcr)). Its top 3 matches the live [Artificial Analysis page](https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning). The older Sep 2 snapshot on [BenchmarkList](https://benchmarklist.com/benchmarks/aa_lcr/) predates Opus 5.5, Sonnet 5.5 and GPT-6, so it is used only as a second data point.

## Ranked table

| Role | Primary (provider) | Fallback 1 (provider) | Fallback 2 (provider) | Effective context (primary) | $ / 150k doc (P / F1 / F2) | Evidence |
|---|---|---|---|---|---|---|
| **Whole-doc content analysis** (claims, entities, dates, sources from one long doc; recall matters most) | `openai/gpt-5.6-sol` (OpenAI direct) | `moonshotai/kimi-k3` (NVIDIA NIM) | `deepseek/deepseek-v4.1-flash` (DeepSeek direct) | **~512k.** MRCR v2 8-needle 93.8% @256K, 91.5% @256–512K, 73.8% @512K–1M | $0.50 / $0.75 / $0.07 | Sol: [BenchmarkList](https://benchmarklist.com/models/openai-gpt-5.6-sol/) (MRCR, GraphWalks BFS 95.4 @256k F1). AA-LCR Sol 84.0, K3 88.7, V4.1 Flash 84.0 |
| **Narrative summary** (faithful long-form prose, no invented figures) | `anthropic/claude-opus-5.5` (OpenRouter) | `zai/glm-5.3` (Merge Gateway) | `openai/gpt-5.6-terra` (OpenAI direct) | **≥100k** (AA-LCR). No MRCR published for 5.5 | $1.00 / $0.30 / $0.54 | AA-LCR Opus 5.5 84.7. Vendor-reported: 16/18 report-writing runs passed an "any invented figure fails" test ([DataCamp](https://www.datacamp.com/blog/gpt-6-sol-vs-claude-opus-5-5)). Terra MRCR 89.6% @256–512K ([Vellum](https://www.vellum.ai/blog/gpt-5-6-sol-terra-luna-explained)). GLM-5.3 AA-LCR 76.3 (Sep 2 snapshot) |
| **Cross-section / cross-doc linking** (claim → evidence → counter-claim across sections or chapters) | `moonshotai/kimi-k3` (NVIDIA NIM) | `openai/gpt-5.6-sol` (OpenAI direct) | `anthropic/claude-opus-5.5` (OpenRouter) | **≥100k** (AA-LCR). Moonshot publishes no RULER/MRCR/LongBench | $0.75 (list) / $0.50 / $1.00 | AA-LCR **#1: K3 88.7** (multi-doc reasoning is what AA-LCR tests). No retrieval-at-depth data ([IntuitionLabs](https://intuitionlabs.ai/articles/kimi-k3-long-context-evaluation)). Sol GraphWalks BFS 95.4 @256k, 83.4 @1M |
| **Fidelity / coherence review** (judge: does the summary or extraction match the source? runs on every doc) | `deepseek/deepseek-v4.1-flash` (DeepSeek direct) | `openai/gpt-5.6-luna` (Cheaper Inference) | `zai/glm-5.3-flash` (Merge Gateway) | **≥100k** (AA-LCR); V4-family multi-needle usable to ~200k | $0.07 / $0.05 / $0.03 | AA-LCR V4.1 Flash 84.0, Luna 83.7, GLM-5.3-Flash 80.0. V4 Pro usable ~200k ([CodingFleet](https://codingfleet.com/blog/context-window-lie-how-well-ai-models-use-1m-tokens-2026/)). **Luna caveat:** MRCR 41.3% from 256K up. No 128–256K bin is published, so keep source + summary under ~200k |

Every row uses three different platforms, so running out of credit on one does not stop ingestion. Keep the judge in a **different model family** from the generator it reviews. If the reviewed output came from DeepSeek, move Luna to the top of the judge chain.

## Rationale

1. At 150k tokens, only the GPT-5.6 Sol/Terra family has published multi-needle recall for that range (93.8% @256K). That is why Sol leads extraction, where missing a fact is the main failure.
2. Kimi K3 tops AA-LCR (88.7), the benchmark closest to linking evidence across ~100k-token document sets. It also runs on NIM, which spreads load off OpenAI. Its exact-fact recall at depth is unpublished, so it links and Sol extracts.
3. Opus 5.5 summarizes. It scores AA-LCR 84.7, and the vendor-reported no-invented-figures result is the only fidelity signal we found for summaries. Sonnet 5.5 (82.7, $0.50/doc) is the half-price swap.
4. Judging runs on every doc, so it goes to the cheap tier. DeepSeek V4.1 Flash and GPT-5.6 Luna score within 0.3 points of Sol on AA-LCR at about 1/8 the cost.
5. Most transcripts are about 50k tokens, well inside every model's verified range. The 150k+ reports and books are where effective context matters. Above ~200k, split by chapter rather than trusting a 1M window.

## Not recommended

- `meta/muse-glimmer-30b` (NIM): AA-LCR 83.3, but its catalog context is **131,072**, below a 150k doc.
- `google/gemini-3.8-flash`: no long-context retrieval scores published ([model card](https://deepmind.google/models/model-cards/gemini-3-8-flash/)), and max output is 65,536. Gemini 3.7 Flash scores AA-LCR 81 (Sep 2 snapshot). Worth an A/B later; not a primary without data.
- `openai/gpt-6-sol` ($2/$10) and `openai/gpt-6-astra` ($10/$50): released 2026-09-23. AA-LCR GPT-6 Sol 83.7, equal to 5.6 Sol. Search snippets attribute Sol's MRCR numbers to GPT-6, but no primary page confirmed them (openai.com returned 403). Drop-in candidate once confirmed.
- `anthropic/claude-fable-5.1` ($10/$50): AA-LCR 85.3, about the same as Opus 5.5 at 2.5× the price.
- `z-ai/glm-5.3` as a long-context **primary**: AA-LCR 76.3 is below its own Flash sibling (78–80). Z.ai publishes 1M-context agentic scores only ([HF card](https://huggingface.co/zai-org/GLM-5.3)). Fine as a summary fallback.
- Advertised 1M windows in general: DeepSeek V4 Pro scores 41% on 8-needle NIAH at 1M, and Gemini 3.1 Pro 26.3% on MRCR at 512K–1M ([CodingFleet](https://codingfleet.com/blog/context-window-lie-how-well-ai-models-use-1m-tokens-2026/)).

## Evidence gaps (what would change this table)

- No 128K–256K MRCR bin for Luna. No MRCR at all for Opus 5.5, Kimi K3, GLM-5.3, DeepSeek V4.1 or Gemini 3.8 Flash.
- Fiction.LiveBench's latest public snapshot (Aug 12, 2026, [LLMLearner](https://llmlearner.com/rankings/fiction-livebench)) only reports 16k scores for older models. It was not usable.
- Recommended next step: a 10-document in-house eval. Plant known claim/evidence pairs in real 150k reports and score each role's primary and F1. This is the only way to verify the 100k–200k range for this corpus.
