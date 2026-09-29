# 04 — Orchestration and judgment models

Written 2026-09-29 (research only; no paid API calls made, no model was run by us).

**Scope:** which paid-provider models to use for the disclosure-rag orchestrator (source routing, stage repair, agentic tool loops) and for cheap high-volume judgments (doc type, quality gate, entity match). Providers limited to [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml).

## Ranked table

IDs are OpenRouter slugs, checked against `https://openrouter.ai/api/v1/models` on 2026-09-29. Prices are that catalog's $/1M input / output. On a direct provider (OpenAI, DeepSeek, Merge, NIM), drop the `vendor/` prefix; those direct IDs are **unverified**. Latency class is an estimate from model tier. None of it was measured.

Benchmark column: τ²-Bench Airline = multi-turn tool calls under a policy manual. It is the closest public proxy for "follow pipeline rules, call DB/fetch/write tools correctly". Source: [OpenRouter τ²-Bench Airline](https://openrouter.ai/benchmarks/tau2-bench-airline), run 2026-09-29.

| Role | Primary (provider) | Fallback 1 (provider) | Fallback 2 (provider) | Latency | $/1M in/out (primary) | Tools / structured out | Evidence |
|---|---|---|---|---|---|---|---|
| **Orchestrator / agent loop** | `google/gemini-3.7-flash` (OpenRouter) | `openai/gpt-5.6-sol` (OpenAI direct) | `deepseek/deepseek-v4-pro-0813` (DeepSeek direct) | medium | 0.75 / 3.75 | yes / yes | τ² Airline: 80.6% (#1 of 133), 76.7%, 76.9% |
| **Repair decision** (re-run vs repair vs quarantine a failed stage) | `openai/gpt-5.6-sol` (OpenAI direct) | `anthropic/claude-sonnet-5.5` (OpenRouter) | `deepseek/deepseek-v4-pro-0813` (DeepSeek direct) | medium–slow | 2.0 / 10.0 | yes / yes | τ² 76.7%. Sonnet 5.5 shipped Sep 22–28 and is not on the τ² board yet (Sonnet 5: 75.4%) |
| **Source router** (transcript / scanned PDF / book / article) | Rules first (mime type, has text layer, page count, YouTube URL), then **Laya** (local), then `z-ai/glm-5.3-flash` (Merge Gateway) | `openai/gpt-5.6-luna` (Cheaper Inference) | `deepseek/deepseek-v4.1-flash` (DeepSeek direct) | fast | 0.15 / 0.50 | yes / yes | Laya AG News 4-label: 0.950, p50 33 ms ([Laya README](https://github.com/NandhaKishorM/laya)). τ² Luna 70.7%, V4.1 Flash 75.7% |
| **Entity-match judgment** ("Bob Bigelow" = "Robert Bigelow"?) | **Laya** fine-tuned on our merge history (local, $0), for the 0.3–0.92 band in `store.py` | `openai/gpt-5.6-luna` (OpenAI direct) | `z-ai/glm-5.3-flash` (Merge Gateway) | fast (Laya ~33 ms) | 0 / 0 (self-host) | n/a (typed `choice` + probability) | Laya ECE 0.081 (post-temperature) vs Jev 0.246; zero-shot base is only 0.362 on typed decisions, so fine-tuning is required |
| **Classification / quality gate** | `z-ai/glm-5.3-flash` (Merge Gateway) | `openai/gpt-5.6-luna` (Cheaper Inference) | `deepseek/deepseek-v4.1-flash` (DeepSeek direct) | fast | 0.15 / 0.50 | yes / yes | OpenRouter catalog lists `structured_outputs` for all three. JSON validation is code (pydantic/jsonschema), not a model |

Cheap orchestrator alternate on a fourth provider: `meta/muse-glimmer-30b` (NVIDIA NIM), τ² 74.1%, 0.30 / 1.20.

### Not recommended

- `moonshotai/kimi-k3` (NIM): τ² about 71%, and 3.0 / 15.0 on OpenRouter. Worse score than DeepSeek V4 Pro at 6× the input price. Its 85% Terminus-2 figure is a coding-terminal harness, not tool-policy compliance.
- `anthropic/claude-opus-5.5`: leads Terminal-Bench 4.0 at 66.4%, but that figure is vendor-reported ([CodingFleet TB4](https://codingfleet.com/blog/terminal-bench-4-leaderboard-2026/)). It scores 73.3% on τ² at 4.0 / 20.0. Overkill for pipeline routing.
- `openai/gpt-6-luna` is cheaper (0.10 / 0.50) but scores τ² 66.0% vs 70.7% for gpt-5.6-luna.
- `z-ai/glm-5.3-flashx`: no `structured_outputs` flag in the catalog.
- BFCL v4 was not used: its September board ([llm-stats](https://llm-stats.com/benchmarks/bfcl-v4)) covers 22 models and almost none of the candidates here.

## Jev and Laya: where they fit

- **Jev (TypeSafe):** built for exactly the entity-match and routing shape: typed `choice`/`score` answers with calibrated probability, $0.042/1M input, free output, 236–276 ms ([docs](https://docs.typesafe.ai/llms.txt)). It is **outside the paid-provider constraint**, because TypeSafe is not in `platforms.yaml`. `typesafe/jev-router` on OpenRouter is not the decision API; it is a model picker that routes chat requests to other LLMs. It is useful only if we want OpenRouter to choose the orchestrator model per request. Jev leads Laya when a question has more than 20 options (Banking77: 0.870 vs 0.425). None of our pipeline's questions have more than 20 options.
- **Laya (local, Apache 2.0):** exposes the same `POST /v1/systemone` wire format as Jev, so a client written for Laya can later point at hosted Jev without changes. Its strengths are low-cardinality choices, 33 ms latency, and $0 cost. Its weakness is poor zero-shot accuracy, so it must be fine-tuned on our confirmed merges and rejects plus temperature fitting. All Laya-vs-Jev numbers are self-reported in Laya's README and have not been independently checked.

## Rationale

1. On τ² Airline, the cheapest top performer beats the flagships: Gemini 3.7 Flash scores 80.6% at 0.75/3.75, while Opus 5.5 scores 73.3% and GPT-6 Sol 68.7%. Pay for tool-policy compliance, not brand tier.
2. Every role has fallbacks on three separate providers (OpenRouter, OpenAI, DeepSeek, Merge, Cheaper Inference), so one outage or quota block never stalls a stage.
3. The source router and JSON validation should be deterministic code first; a model runs only on the ambiguous remainder.
4. LLM verbal confidence is not calibrated. Entity-match thresholds (0.3–0.92) need a calibrated scorer, which is Laya, or Jev if TypeSafe is added. LLMs serve as the tie-break.
5. Liveness risk: only DeepSeek keys have been probed live from disclosure-rag, and OpenRouter accepts `strict: true` without validating the schema. Probe each fallback before wiring it in, and validate outputs locally.
