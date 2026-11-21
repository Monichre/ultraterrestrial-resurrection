# 05 — OCR, document parsing, and speech transcription

Written 2026-09-29 03:58 CDT (UTC−05:00). This is research only: no paid API calls were made and no keys were read. OpenRouter ids were checked against `https://openrouter.ai/api/v1/models`, and against `?output_modalities=all` for the transcription models, on 2026-09-29. The NVIDIA NIM id comes from the public `integrate.api.nvidia.com/v1/models` listing captured earlier this session. Nothing here has been run against our corpus.

## What the repo does today

- **No OCR model runs anywhere.** The only extractor is PyMuPDF, at [apps/disclosure-rag/scripts/bulk_folder_ingestion.py:285](apps/disclosure-rag/scripts/bulk_folder_ingestion.py#L285) (`fitz.open`). It reads the embedded text layer, so image-only scans come back empty.
- **Unused libraries.** `pytesseract`, `pdfplumber`, `mistral-ocr` and `file-parser` have zero Python call sites. `docling` is referenced in 2 files.
- **The `pdf_processing` block is config only.** [packages/ai/prompts/llm_routing.yaml:302](packages/ai/prompts/llm_routing.yaml#L302) declares it (`default_engine: cloudflare-ai`), but nothing calls the file-parser plugin.
- **Transcription is a local last resort.** When captions are missing, [apps/disclosure-rag/lib/youtube_handler.py:344](apps/disclosure-rag/lib/youtube_handler.py#L344) runs `faster-whisper` with `WHISPER_MODEL` defaulting to `small`, on CPU int8. That is the weakest Whisper tier still in use.
- **Kie AI is excluded.** Its speech-to-text page says "upcoming" ([kie.ai/market/speech-to-text](https://kie.ai/market/speech-to-text)), so it has no audio transcription to offer yet.

## Ranked table

Each role has a primary and two fallbacks, and each of the three runs on a different provider. Two labels recur:

- **"evidence: predecessor X"** means the score was measured on an older model, not the id listed. Don't read it as that id's score.
- **"unbenchmarked"** means no public score exists for that model on that task.

| Role | Rank | Model / engine | Provider | Verified id / engine | $ per 1,000 pages or per audio hour | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| **Scanned typewritten docs (1940s–90s, faded, stamped)** | Primary | Mistral OCR via file-parser | OpenRouter | `plugins:[{id:'file-parser',pdf:{engine:'mistral-ocr'}}]` | $2.00 ($2.20 in the US region) | Mistral version **unverified** (OpenRouter doesn't publish it). OCR 3 scores 48.8% on olmOCR **Old Scans**, its weakest category. OCR 4 scores 57.4 on the scans subset. [OR docs](https://openrouter.ai/docs/guides/overview/multimodal/pdfs), [ocr4 bench](https://github.com/ukanwat/ocr4-structure-benchmark) |
| | FB1 | GPT-6 Luna, vision transcription | OpenAI direct | `gpt-6-luna` (OR mirror `openai/gpt-6-luna`) | ≈$0.50 (≈$0.25 batch) | Evidence: predecessor GPT-5.5 scored 53.2 on scans and 71.3 overall on olmOCR, a statistical tie with the leaders. [ocr4 bench](https://github.com/ukanwat/ocr4-structure-benchmark) |
| | FB2 | Chandra OCR 2 | local (free) | `datalab-to/chandra-ocr-2` | $0 (GPU time only) | 85.8% on olmOCR-Bench. [Roboflow](https://blog.roboflow.com/best-open-source-ocr-models/) |
| **Born-digital PDF text** | Primary | PyMuPDF text layer | local (free) | `fitz` (already installed) | $0 | No model involved. First check the text layer: FOIA PDFs often carry bad embedded OCR, and those should go to the scanned-docs row. |
| | FB1 | Cloudflare AI via file-parser | OpenRouter | engine `cloudflare-ai` (`pdf-text` redirects here) | $0 | Free per [OR docs](https://openrouter.ai/docs/guides/overview/multimodal/pdfs). Risk: it probably returns nothing on image-only pages (unverified). |
| | FB2 | Nemotron Parse 2.0 | NVIDIA NIM | `nvidia/nemotron-parse-2.0` | NIM credits; list price not published | Unbenchmarked. Returns text, boxes and semantic classes. [HF card, v1.1](https://huggingface.co/nvidia/NVIDIA-Nemotron-Parse-v1.1) |
| **Tables / layout / reading order** | Primary | Mistral OCR via file-parser | OpenRouter | engine `mistral-ocr` | $2.00 | Tables 94.3 and reading order 73.3 were measured on **OCR 4**. Those scores apply only if the engine runs OCR 4 (unverified). [ocr4 bench](https://github.com/ukanwat/ocr4-structure-benchmark) |
| | FB1 | Nemotron Parse 2.0 | NVIDIA NIM | `nvidia/nemotron-parse-2.0` | NIM credits | Unbenchmarked. |
| | FB2 | MinerU2.5-Pro | local (free) | `opendatalab/MinerU` | $0 | 96.12 overall and 94.49 table TEDS on OmniDocBench v1.6. [OmniDocBench](https://github.com/opendatalab/OmniDocBench) |
| **Handwriting (margin notes, signatures, logs)** | Primary | GPT-6 Sol, vision | OpenAI direct | `gpt-6-sol` | ≈$10 (≈$5 batch) | Evidence: predecessor GPT-5 scored ~1.22% CER on IAM, the best result listed. [CodeSOTA](https://www.codesota.com/ocr/best-for-handwriting) |
| | FB1 | Claude Opus 5.5, vision | OpenRouter | `anthropic/claude-opus-5.5` | ≈$20 (≈$10 `:batch`) | Evidence: predecessor Opus 4.7 scored ~1.31% CER on IAM. Mistral OCR 3 scored 2.1%. [CodeSOTA](https://www.codesota.com/ocr/best-for-handwriting) |
| | FB2 | Chandra OCR 2 | local (free) | `datalab-to/chandra-ocr-2` | $0 | No CER published. Vendor claims strong handwriting. [Roboflow](https://blog.roboflow.com/best-open-source-ocr-models/) |
| **Redaction-aware parsing (black bars, (b)(1) stamps)** | Primary | Mistral OCR via file-parser | OpenRouter | engine `mistral-ocr` | $2.00 | **No benchmark exists.** Reasoning only: a dedicated parser does not generate text to fill gaps, while a VLM can invent words under a bar. OCR 4 also returns per-block confidence and labels. |
| | FB1 | GPT-6 Sol, vision with a strict prompt | OpenAI direct | `gpt-6-sol` | ≈$10 | Unbenchmarked. Prompt: emit `[REDACTED]` plus the exemption code, and never infer hidden text. |
| | FB2 | Chandra OCR 2 | local (free) | `datalab-to/chandra-ocr-2` | $0 | Unbenchmarked. |
| **Audio transcription (podcasts, YouTube without captions)** | Primary | MAI-Transcribe-2 | OpenRouter | `microsoft/mai-transcribe-2` | ≈$0.10/hr | AA-WER 2.0%, #2 of 57. OpenRouter lists `prompt: 0.1` without a unit. The $/hr is inferred from Artificial Analysis's $1.67/1,000 min. [AA STT](https://artificialanalysis.ai/speech-to-text/non-streaming) |
| | FB1 | GPT Transcribe | OpenAI direct | `gpt-transcribe` | $0.27/hr | AA-WER 3.3%. [AA STT](https://artificialanalysis.ai/speech-to-text/non-streaming), [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-transcribe) |
| | FB2 | Whisper large-v3-turbo (swap the `small` default for this) | local (free) | `faster-whisper` `large-v3-turbo` | $0 | AA-WER 4.6% (hosted on Groq). Cohere `transcribe-03-2026` (Apache-2.0) also scores 4.6%. [AA STT](https://artificialanalysis.ai/speech-to-text/non-streaming) |

### How the VLM $/1,000-page figures were computed

Each page is assumed to be about **1,500 input tokens** (one page image) and **700 output tokens** (a full typed page). Prices are OpenRouter list $/M tokens for input/output:

- gpt-6-luna: $0.10 / $0.50 → ≈$0.50 per 1,000 pages
- gpt-6-sol: $2 / $10 → ≈$10
- claude-opus-5.5: $4 / $20 → ≈$20
- gemini-3.8-flash (an alternate if needed): $0.75 / $3.75 → ≈$3.7

Output tokens dominate the cost. Image tokenization differs by provider by as much as 2×, so treat these figures as ±2×.

### Caveats that change the decision

- **The olmOCR subset behind the ukanwat table is small:** 40 documents and 223 tests. The top five systems (Mistral OCR 4 74.9, Qwen3-VL-235B 72.6, GPT-5.5 71.3, Opus 4.8 71.3, Gemini 3.1 Pro 70.4) are within 4.5 points of each other. Read that as a tie.
- **No current model id has a published OCR score.** Every VLM score above comes from a predecessor model.
- **Default-engine billing.** If a request names no engine, OpenRouter passes the whole PDF to file-native models and bills it as input tokens. Otherwise it falls back to `mistral-ocr`, which is paid. Always set the engine explicitly.
- **Audio endpoint limits.** OpenRouter's transcription endpoint and its file-size cap are unverified. Episodes of 1–3 hours need chunking on silence, with the timestamps stitched back together afterwards. Speaker diarization has no benchmark for any of these models.
- **Unverified providers were left out.** Merge Gateway, Vercel AI Gateway and DeepSeek-direct vision ids were not checked, so they aren't listed.

## Rationale

1. Dedicated parsers and frontier VLMs are statistically tied on hard pages. The $2 dedicated engine wins on cost and on grounding (boxes and confidence), and grounding matters for citable evidence.
2. Old typewritten scans are every system's weakest category (48–62 on olmOCR scans), so the corpus needs a bake-off of about 30 pages, not a leaderboard.
3. Handwriting is the one role where frontier VLMs clearly lead (~1.2–1.4% CER vs 2.1% for Mistral). Handwritten pages are rare enough that paying ~$10 per 1,000 pages is fine.
4. Redaction handling has no public benchmark. Use it as a deliberate test in the bake-off, and prefer parsers that don't generate text.
5. MAI-Transcribe-2 through OpenRouter is both cheaper and more accurate than every OpenAI option. The free improvement is switching the local fallback from `small` to `large-v3-turbo`.

Next: pick 30 corpus pages (10 typewritten scans, 10 redacted, 5 tables, 5 handwritten), run the three primaries on them, and score CER by hand.
