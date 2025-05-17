# Integrate Firecrawl Into Web Processing Pipeline

**Status**: ⏳ pending

## Description

This ticket focuses on integrating the refactored Firecrawl implementation into the web processing pipeline. Currently, the web processing pipeline uses various scraping and extraction methods that are not consistently leveraging the Firecrawl abstraction. This integration will ensure that all web extraction, crawling, and scraping logic in the pipeline uses the exported functions/types from the Firecrawl package.

## Objectives

- Update the web processing pipeline to use the Firecrawl abstraction for all web extraction
- Replace all direct API calls with calls to the Firecrawl abstraction
- Move business logic from components to actions files
- Ensure consistent error handling and data shaping
- Use type-safe approach throughout the integration

## Technical Details

- Update the following files to use the Firecrawl abstraction:
  - `apps/app/src/features/ai/pipelines/web-processing-pipeline/WebProcessingPipeline.tsx`
  - `apps/app/src/features/ai/actions/web-extractions.actions.ts`
  - Any other files that contain web extraction logic
- Replace inline scraping and extraction logic with calls to Firecrawl methods:
  - Replace `scrapeAndSummarize` with functions that use the Firecrawl abstraction
  - Use `enhancedScrapeContent` and `enhancedExtractContent` for all scraping needs
- Implement proper error handling and rate limiting
- Use research.prompt.ts as the default web scrape and content extraction prompt
- Move all business logic to action files, keeping components focused on UI

## Success Criteria

- All web extraction in the pipeline uses the Firecrawl abstraction
- No direct API calls to scraping or extraction services remain
- Business logic is properly separated from UI components
- Consistent error handling is implemented
- Pipeline successfully extracts and summarizes web content using Firecrawl
- All code passes linting and type checking

## Dependencies

- [52-Review-Improve-Firecrawl-Agent-Methods](52-Review-Improve-Firecrawl-Agent-Methods.md) - Need the refactored Firecrawl implementation first

## Notes

This integration is an important step toward centralizing all web extraction logic in the application. It will make future maintenance easier and ensure consistent behavior across different parts of the application.

## References

- [Integrating Firecrawl into Web Processing Pipeline](UltraterrestrialSalvageAttempt/salvaging-workspace/spec-story-salvage-history/2025-04-27_17-50-integrating-firecrawl-into-web-processing-pipeline.md)
- [Research Prompt File](apps/app/src/services/ai/prompts/research.prompt.ts) 