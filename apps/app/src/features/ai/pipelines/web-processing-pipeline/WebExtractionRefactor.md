# WebExtractionRefactor

## Overview

This refactor replaces legacy Cheerio/OpenAI-based web extraction and summarization with a robust pipeline leveraging Firecrawl for web scraping/extraction and Anthropic Claude 3.7 for structured summary analysis using the NER_RESEARCH_PROMPT.

## Key Modules

- **/lib/firecrawl/index.ts**: Firecrawl SDK integration, exposes scrape, extract, deep research, and related utilities.
- **/lib/claude.ts**: New utility for calling Claude 3.7 with a system prompt and content, returning summary text.
- **/services/resource-scrape/firecrawl.ts**: Service layer orchestrating Firecrawl scraping/extraction and Claude analysis. Exports `scrapeAndAnalyze` and `deepResearchAndAnalyze`.
- **/features/ai/actions/web-extractions.actions.ts**: Exposes `scrapeAndSummarize`, now using the new pipeline. Handles URL validation, rate limiting, and output validation.
- **/features/ai/blocks/web-extraction/WebExtraction.tsx**: UI component for user input, progress, and displaying results. Now reflects Firecrawl/Claude pipeline in all user-facing text.
- **/features/ai/blocks/web-extraction/ContentAnalysis.tsx**: Displays structured summary and key points. Linter fix: uses stable key for keyPoints.

## Process & Data Flow

1. **User Input**: User submits a URL via the WebExtraction UI.
2. **Validation & Rate Limiting**: URL is validated and rate-limited in the server action.
3. **Firecrawl Scraping**: `scrapeAndAnalyze` calls Firecrawl's `scrapeUrl` to extract content and metadata.
4. **Claude 3.7 Analysis**: The scraped content (preferably markdown) is sent to Claude 3.7 with the `NER_RESEARCH_PROMPT` as the system prompt via `callClaude37`.
5. **Output Validation**: The Claude response is parsed and validated against a Zod schema for summary and key points. Fallbacks are used if parsing fails.
6. **UI Rendering**: The result is displayed in the UI, with loading and error states handled appropriately.

## Component Architecture

- **WebExtraction.tsx**: Handles state, progress, and orchestrates the workflow.
- **ContentAnalysis.tsx**: Pure display component for summary and key points.
- **SummaryDisplay**: Used for rendering the final output.
- **LoadingSkeleton**: Used for loading state.

## Data Types

- **FirecrawlResult**: `{ content, markdown, metadata, ... }`
- **ClaudeSummary**: `{ summary, keyPoints, ... }` (validated by Zod)
- **CombinedResult**: `{ firecrawl: FirecrawlResult, claude: ClaudeSummary }`

## Best Practices

- All scraping/extraction is now handled by Firecrawl, supporting advanced features (FIRE-1 agent, deep research, extraction schema, etc.).
- All summary analysis is performed by Claude 3.7, using a strict research prompt for structured output.
- Functional, modular, and type-safe code throughout.
- UI is decoupled from service logic, supporting future extensibility (e.g., batch/deep research, schema extraction).
- Linter and error handling improvements included.

## Next Steps

- Extend to support batch/deep research in the UI.
- Add streaming support for Claude responses if needed.
- Further modularize for additional extraction schemas or research prompts.
