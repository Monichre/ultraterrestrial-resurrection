# 02 — Chunking and per-chunk extraction models

Written 2026-09-29 03:45 CDT (UTC−05:00). Research only: no paid API calls were made and no keys were read. Every model id below was checked against a public catalog on 2026-09-29, except the Merge Gateway ids, which have no public catalog. Nothing here has been run against our corpus yet.

## Recommendation

1. **Don't use an LLM to chunk.** Use deterministic, structure-aware splitting: speaker turns and caption timestamps for transcripts, pages and headings for PDFs, chapters and paragraphs for books. Aim for about 400 tokens with no overlap for the retrieval chunks. It costs $0 per 1M chars.
2. **Extract per window, never over the whole document.** On ExtractBench, every commercial model tested in single-shot mode falls from 88–97 value F1 on short documents (≤10 pages) to 5–38 on long ones (>50 pages). Extraction windows should group about 4–5 retrieval chunks (roughly 1.5–2K tokens) and map spans back to the chunk ids.
3. **Per-window NER:** `z-ai/glm-5.3-flash` on OpenRouter, pinned to a host that passed the reliability test (for example Fireworks). It has the best single-shot short-document F1 of any cheap model (96.3). It drops to 51.6 on medium-length documents (11–50 pages), so keep windows small.
4. **Claim extraction:** `gpt-6-luna` on OpenAI direct. It is the cheapest option with strict json_schema output, and batch pricing halves the cost. ExtractBench has no single-shot score for Luna: its 87.7 medium score was measured through the Codex agent harness. The best single-shot medium score among the cheap models belongs to DeepSeek V4.1 Flash (81.5), which is fallback 1.
5. **Three providers per role**, so running out of credit on one platform doesn't stop ingestion. Validate every response locally against the schema. Provider-side `strict` acceptance is not proof the schema is valid (see memory: *OpenRouter accepts strict without validating*).

## Ranked table

$/1M is list price per 1M input/output tokens, standard tier, ≤272K context. "SO" means structured-output support as stated in that provider's catalog.

| Role | Rank | Model | Provider | Verified id | $/1M in / out | Context | SO | Evidence |
|---|---|---|---|---|---|---|---|---|
| **Chunking** | Primary | Deterministic splitter (no model) | local code | n/a | $0 | n/a | n/a | Recursive 400/0 reaches 89.5 recall vs 91.9 for an LLM chunker (GPT-4o), a 2.4-point gap for a large cost increase. Cluster-semantic at 200 tokens has the best IoU (8.0) ([Chroma](https://www.trychroma.com/research/evaluating-chunking)). Semantic chunking showed "no consistent improvement" over recursive ([arXiv 2607.01852](https://arxiv.org/html/2607.01852v1)) |
| Chunking (optional boundary pass, messy captions only) | Fallback 1 | GPT-6 Luna | OpenAI direct | `gpt-6-luna` | 0.10 / 0.50 (batch 0.05 / 0.25) | 1.05M | json_schema strict | [OpenAI pricing](https://developers.openai.com/api/docs/pricing). Use a LumberChunker-style prompt that returns boundary sentence indices only, never rewritten text |
| | Fallback 2 | GLM-5.3 Flash | OpenRouter | `z-ai/glm-5.3-flash` | 0.15 / 0.50 | 1.31M | structured_outputs | [OpenRouter catalog](https://openrouter.ai/api/v1/models) |
| **Per-window NER** (people/orgs/locations/events/dates) | **Primary** | GLM-5.3 Flash | OpenRouter (pin host) | `z-ai/glm-5.3-flash` | 0.15 / 0.50 | 1.31M | structured_outputs | Single-shot short **96.30**, medium 51.56, long 27.83, $0.0034/page ([ExtractBench leaderboard.csv](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv)). 200/200 exact 10-field schemas on only 3 of 10 hosts (Fireworks, Modal, Telnyx), so host choice matters ([Openbenchmarks](https://openbenchmarks.com/inference/best-inference-provider-for-structured-extraction)) |
| | Fallback 1 | GPT-6 Luna | OpenAI direct | `gpt-6-luna` | 0.10 / 0.50 | 1.05M | json_schema strict | No single-shot row. Through the Codex agent harness: short 93.09, medium 87.71, long 80.88 ([ExtractBench](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv)) |
| | Fallback 2 | DeepSeek V4.1 Flash | DeepSeek direct | `deepseek-flash` | 0.15 / 0.60 off-peak (0.30 / 1.20 peak) | 1M | JSON Output (json_object mode, not strict schema) | Single-shot short 94.44, medium 81.49 ([ExtractBench](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv), [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing)) |
| | Alt hosts | GLM-5.3 Flash | Merge Gateway / NVIDIA NIM | `zai/glm-5.3-flash` (Merge, **unverified**, from [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml) and the lead's brief) / `z-ai/glm-5.3-flash` (NIM, verified) | — | — | — | Same model, different hosts. Check each host's structured-output reliability before relying on it |
| **Claim extraction** (claim, speaker, stance, hedging, source span) | **Primary** | GPT-6 Luna | OpenAI direct | `gpt-6-luna` | 0.10 / 0.50 (batch 0.05 / 0.25) | 1.05M | json_schema strict | Native strict schema, cheapest verified option. Medium 87.71 through the Codex harness only ([ExtractBench](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv), [OpenAI pricing](https://developers.openai.com/api/docs/pricing)) |
| | Fallback 1 | DeepSeek V4.1 Flash | DeepSeek direct | `deepseek-flash` | 0.15 / 0.60 off-peak | 1M | json_object | Best single-shot medium score among the cheap models (81.49), cheapest per page ($0.0032) ([ExtractBench](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv)) |
| | Fallback 2 | Kimi K3 | NVIDIA NIM | `moonshotai/kimi-k3` | NIM credits (OpenRouter list 3.00 / 15.00) | 1M | structured-output (OpenRouter/Vercel catalogs) | Single-shot short 94.64, medium 69.64 ([ExtractBench](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv)). Listed in the NIM catalog `https://integrate.api.nvidia.com/v1/models`. Use when OpenAI and DeepSeek are both out of credit |

The Cheaper Inference `gpt-5.6-luna` is a usable fourth fallback for either extraction role, since it is the same model family as the OpenAI primary. It is one generation behind `gpt-6-luna` and costs 0.20 / 1.20 on OpenRouter. I did not verify its id on Cheaper Inference.

### Also verified, not recommended for this job
- `google/gemini-3.8-flash` (OpenRouter/Vercel, 0.75 / 3.75): single-shot short 88.14, below GLM-5.3 Flash at 5x the price.
- `openai/gpt-6-astra` (10 / 50): highest single-shot short F1 (97.22), but roughly 100x Luna's price for a 1–4 point gain.
- `z-ai/glm-5.3` (full model, NIM and OpenRouter 1.40 / 4.40): no ExtractBench row. Only worth trying if the flash version fails our own bake-off.

## Cost per 1M characters

Assumptions: about 4 chars per token, so 1M chars ≈ 250K content tokens. Each extraction window is about 2K tokens, so 1M chars is about 125 calls. Each call carries about 1K tokens of instructions and schema (+125K input tokens). Extraction output is about 30% of content (≈75K tokens of JSON). The LLM boundary pass outputs only indices (about 5K tokens). Standard tier. If the static prefix is cached, the overhead is close to zero (Luna cached input costs $0.01/M).

| Step | Method / model | $ per 1M chars |
|---|---|---|
| Chunking | Deterministic splitter | **$0.00** |
| Chunking | Embedding-similarity semantic chunking (`text-embedding-3-small`, $0.02/M: embed every sentence once) | ~$0.005 |
| Chunking | LLM boundary pass, `gpt-6-luna` | ~$0.03 (≈$0.015 batch) |
| Chunking | LLM chunking that rewrites text, `gpt-6-luna` | ~$0.15 (output-bound) |
| Chunking | Late chunking | **not available via our APIs.** It needs token-level embeddings from a long-context model. OpenAI, OpenRouter and NIM embedding endpoints return pooled vectors only, so this means self-hosting ([Late Chunking, arXiv 2409.04701](https://arxiv.org/pdf/2409.04701)) |
| NER | `glm-5.3-flash` | ~$0.09 |
| NER / claims | `gpt-6-luna` | ~$0.08 (≈$0.04 batch) |
| NER / claims | `deepseek-flash` | ~$0.10 off-peak, ~$0.20 peak |
| Claims | `kimi-k3` at OpenRouter list price | ~$2.25 |
| Reference | `gemini-3.8-flash` | ~$0.56 |

A 200K-char podcast transcript costs about **$0.035 end to end** (NER + claims on the primary models, uncached).

## Caveats (read before wiring)

- **ExtractBench uses enterprise PDFs,** not caption transcripts. Treat its ranks as a prior, then run a bake-off on about 20 of our own windows per model and score them against hand labels. Run each model at least 3 times, because output varies from run to run (see memory: *content_analysis output varies run to run*).
- **Page counts don't map cleanly to tokens.** ExtractBench defines "short" as ≤10 pages and "medium" as 11–50 pages. A 2K-token window is far inside "short", but the exact token point where GLM-5.3 Flash starts to drop is unmeasured. Test 2K vs 6K windows in the bake-off.
- **Luna's extraction numbers come from an agent harness** with tools, not single calls. Its single-shot quality is unmeasured, and the bake-off decides whether it keeps the claims primary.
- **DeepSeek direct has no strict json_schema** (json_object only). Validate locally with Pydantic and retry once.
- **Reasoning models can return empty content at low `max_tokens`** (memory: *provider key liveness probing*). Set reasoning effort to low/none for NER and give output a ceiling of at least 4K tokens.

## Sources

- ExtractBench: [leaderboard.csv](https://github.com/run-llama/ExtractBench/blob/main/leaderboard.csv) (prices as of 2026-09-11), [README split definitions](https://github.com/run-llama/ExtractBench), [extractbench.ai](https://www.extractbench.ai/)
- [Openbenchmarks: structured-output reliability, GLM 5.3 Flash across 10 hosts (2026-09-03)](https://openbenchmarks.com/inference/best-inference-provider-for-structured-extraction)
- [Chroma: Evaluating Chunking Strategies for Retrieval](https://www.trychroma.com/research/evaluating-chunking)
- [Evaluating Chunking Strategies for RAG on Academic Texts (arXiv 2607.01852)](https://arxiv.org/html/2607.01852v1)
- [Late Chunking (arXiv 2409.04701)](https://arxiv.org/pdf/2409.04701)
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) and the [GPT-6 Luna model page](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [DeepSeek Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing): use `deepseek-flash`. `deepseek-v4-flash` is a legacy alias.
- NVIDIA NIM public list `https://integrate.api.nvidia.com/v1/models` (fetched 2026-09-29): includes `z-ai/glm-5.3`, `z-ai/glm-5.3-flash`, `moonshotai/kimi-k3`, `meta/muse-glimmer-30b`, `deepseek-ai/deepseek-v4.1-flash`
- Vercel AI Gateway public list `https://ai-gateway.vercel.sh/v1/models` (fetched 2026-09-29): `openai/gpt-6-luna`, `zai/glm-5.3-flash`, `deepseek/deepseek-v4.1-flash`, `moonshotai/kimi-k3`, all tagged `structured-output`
- OpenRouter catalog [`https://openrouter.ai/api/v1/models`](https://openrouter.ai/api/v1/models) (fetched 2026-09-29, 460 models):
  - `openai/gpt-6-luna`: 0.10 / 0.50, 1.05M, SO
  - `z-ai/glm-5.3-flash`: 0.15 / 0.50, 1.31M, SO
  - `deepseek/deepseek-v4.1-flash`: 0.30 / 1.20, 1.05M, SO
  - `moonshotai/kimi-k3`: 3.00 / 15.00, 1.05M, SO
  - `google/gemini-3.8-flash`: 0.75 / 3.75, 1.05M, SO
