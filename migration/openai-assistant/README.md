# OpenAI Assistant Migration

Migrating the Prometheus assistant and its UFO Data Store vector store before OpenAI deprecates the Assistants API.

## Source

- **Assistant:** `asst_sdNxYC9p05iGpeKXtL496cyh` ("Prometheus")
- **Model:** gpt-4.1
- **Vector Store:** `vs_meWOEnUiUxtQWf0W6NBsNpCG` ("UFO Data Store")
- **Files:** 1,292 completed (38 failed, 5 cancelled)
- **Size:** ~125 MB

## What was migrated

### Assistant Config (`assistant_config.json`)
- System instructions (NER-focused UFO/UAP research expert)
- Tools: file_search, code_interpreter, searchDatabase, transformXYFlow
- Parameters: top_p=0.55, temperature=1.0, max_num_results=50

### Vector Store Files (`files/`)
- All 1,292 completed files downloaded from the OpenAI Files API
- Manifest: `vector_store_manifest.json` (vector store file refs)
- Metadata: `vector_store_files_metadata.json` (filenames, sizes, types)

## Migration Target

The assistant functionality maps to the existing Ultraterrestrial architecture:

| OpenAI Assistant Feature | Ultraterrestrial Equivalent |
|---|---|
| file_search (vector store) | Quinuple RAG (Xata pgvector + FAISS + Upstash + OpenAI VS + pgvector direct) |
| code_interpreter | Vercel AI SDK tool calling + execute_code |
| searchDatabase function | Existing Xata search API (`/packages/db/xata/api/`) |
| transformXYFlow function | Existing xata-to-xyflow converter (`/packages/db/xata/xata-to-xyflow.ts`) |
| System instructions | Prometheus agent config (`/packages/prompts/` or `/apps/disclosure-rag/agents/`) |

## Migration Steps

1. **[DONE]** Export assistant config
2. **[DONE]** Export vector store manifest and file metadata
3. **[DONE]** Download all vector store files
4. **[TODO]** Ingest files into Xata pgvector + FAISS + Upstash
5. **[TODO]** Port system instructions to Prometheus agent config
6. **[TODO]** Map searchDatabase → existing Xata search
7. **[TODO]** Map transformXYFlow → existing xata-to-xyflow converter
8. **[TODO]** Verify retrieval quality parity
9. **[TODO]** Remove OPENAI_ASSISTANT_ID and OPENAI_VECTOR_STORE_ID from .env
