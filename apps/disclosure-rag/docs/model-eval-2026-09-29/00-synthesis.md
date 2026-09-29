# Ingestion model assignment — synthesis

2026-09-29 08:55 CDT. Merges reports [01](apps/disclosure-rag/docs/model-eval-2026-09-29/01-stage-inventory.md) · [02](apps/disclosure-rag/docs/model-eval-2026-09-29/02-chunking-extraction.md) · [03](apps/disclosure-rag/docs/model-eval-2026-09-29/03-long-context.md) · [04](apps/disclosure-rag/docs/model-eval-2026-09-29/04-orchestration.md) · [05](apps/disclosure-rag/docs/model-eval-2026-09-29/05-ocr-transcription.md). Proposal only: nothing is wired yet.

## Rules this follows

1. Each stage declares its own models, in that stage's own file. There is no global default chain. See [memory: model-selection-scoped-to-agent].
2. [`apps/disclosure-rag/platforms.yaml`](apps/disclosure-rag/platforms.yaml) is the shared provider pool. Every stage has fallbacks on **different providers**, so one account running out of credit does not stop ingestion.
3. Latest best model first. Where a benchmark only covers an older model (gpt-5.6-*), the gpt-6 equivalent leads and is marked **untested**, and the benchmarked model is the first fallback.

## Proposed stage → model

| Stage (live on `dy`) | Needs | Primary | Fallback 1 | Fallback 2 | Evidence |
|---|---|---|---|---|---|
| Chunking | split | **Code, no LLM.** Structure-aware splitting (speaker, timestamp, page, heading), about 400 tokens | — | — | 02: an LLM chunker adds only +2.4 recall |
| NER, per window | structured extraction | glm-5.3-flash (Merge) | gpt-6-luna (OpenAI) | deepseek-v4.1-flash (DeepSeek) | 02: ExtractBench short-doc F1 96.3 |
| Claim extraction, per window | strict schema | gpt-6-luna (OpenAI) | deepseek-v4.1-flash (DeepSeek) | kimi-k3 (NVIDIA) | 02 |
| Document classification | fast judgment | glm-5.3-flash (Merge) | gpt-6-luna (OpenAI) | deepseek-v4.1-flash (DeepSeek) | 04 |
| Validation / QA | fast judgment | glm-5.3-flash (Merge) | gpt-6-luna (OpenAI) | deepseek-chat (DeepSeek) | 04. JSON validity checks belong in code |
| Content analysis / narrative summary (whole transcript) | long context | gpt-6-sol (OpenAI) *untested at 150k* | claude-opus-5.5 (OpenRouter) | glm-5.3 (Merge) | 03: gpt-5.6-sol MRCR 93.8% @256K; Opus AA-LCR 84.7 |
| Cross-document linking | long context | kimi-k3 (NVIDIA) | gpt-6-sol (OpenAI) | claude-opus-5.5 (OpenRouter) | 03: AA-LCR #1, 88.7 |
| Coherence / fidelity review | cheap judge | deepseek-v4.1-flash (DeepSeek) | glm-5.3-flash (Merge) | gpt-6-luna (OpenAI) | 03 |
| Repair decision / orchestration | tool calling | gemini-3.8-flash (OpenRouter) *untested; 3.7 is τ² #1 at 80.6%* | gpt-6-sol (OpenAI) | deepseek-v4.1-flash (DeepSeek) | 04 |
| Entity match (0.3–0.92 band) | calibrated yes/no | existing trigram + human review | Laya (local), fine-tuned on our past merges | — | 04: Laya scores 0.362 until fine-tuned. Still pinned, not started |
| OCR, scanned typewritten | vision | OpenRouter file-parser `mistral-ocr` ($2 per 1k pages) | gpt-6-luna vision (OpenAI) | local Chandra OCR 2 | 05. **Missing today** |
| OCR, handwriting | vision | gpt-6-sol (OpenAI) | claude-opus-5.5 (OpenRouter) | local Chandra | 05 |
| Born-digital PDF | text layer | PyMuPDF (local, $0) | OpenRouter `cloudflare-ai` (free) | NVIDIA nemotron-parse-2.0 | 05 |
| Transcription (no captions) | ASR | OpenRouter `microsoft/mai-transcribe-2` | OpenAI `gpt-transcribe` | local whisper large-v3-turbo | 05. Local `small` on CPU today |
| Embeddings | vectors | **Unchanged:** text-embedding-3-small @1536 | — | — | 6,540 stored vectors. Changing the model would break every ranking silently |

## Bugs the inventory found (fix regardless of model choice)

1. NER and validation see only the **first 8 chunks**; the rest of every long transcript is never extracted ([01](apps/disclosure-rag/docs/model-eval-2026-09-29/01-stage-inventory.md)).
2. Scanned PDFs yield **empty text**, because only the PDF text layer is read (PyPDF2 / PyMuPDF).
3. Web image "analysis" never sends the image.
4. Settings in `llm_routing.yaml` (task `max_tokens` / `temperature` / `requires`, and `pdf_processing`) have no effect.
5. `RAG_PIPELINE_PROVIDER` does nothing on routed calls.
6. The [`CALL_CHAIN.md`](apps/disclosure-rag/docs/CALL_CHAIN.md) web-path entry is wrong.

## Not verified

- No model here has been run on our corpus.
- Direct-provider ids (OpenAI, DeepSeek, Cheaper Inference) are not checked against a catalog. Exceptions, all live 2026-09-28/29:
  - Merge `zai/glm-5.3` and `zai/glm-5.3-flash`
  - OpenAI `gpt-6-astra`
- The subagents recommended these bake-offs:
  - 20 transcript windows (NER/claims)
  - 10 planted-claim long documents
  - 30 scanned pages (OCR)
