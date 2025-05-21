# Review and Improve Firecrawl Agent Methods

**Status**: ⏳ pending

## Description

This ticket addresses the need to review and improve the Firecrawl agent methods based on the official documentation at https://docs.firecrawl.dev/agents/fire-1. The current implementation requires refactoring to ensure proper agent initialization and parameter handling. The ticket also aims to improve naming and API design for better developer experience.

## Objectives

- Review Firecrawl agent integration based on official documentation
- Fix any inconsistencies in agent parameter structure between scrape and extract methods
- Improve method naming conventions (e.g., rename "scrapePaginatedContent" to more descriptive names)
- Refactor to allow conditional agent usage through parameters
- Update type safety and schema handling
- Add better documentation with examples

## Technical Details

- The current implementation in `apps/app/src/lib/firecrawl/index.ts` needs updating
- The agent param for `/scrape` requires both `model` and `prompt`
- The agent param for `/extract` only requires `model` (prompt is top-level)
- Schema handling needs improving:
  - Support for both Zod and JSON schema input
  - Conversion of Zod schema to JSON schema when needed
- Type safety issues to fix:
  - Remove `any` type usage
  - Use proper generics or utility types
- Create an abstraction layer where all business logic lives in a shared package

## Success Criteria

- All agent methods correctly implement the Firecrawl API specifications
- Method signatures use proper TypeScript types with no `any` types
- Agent parameters are applied consistently and correctly
- Documentation includes clear examples for agent and non-agent usage scenarios
- Schema handling works for both Zod and JSON schema
- Code passes linting and type checking
- Implementations are moved to `packages/firecrawl` for better reusability

## Dependencies

- None

## Notes

This refactor should focus on moving from component-level business logic to a centralized, reusable implementation. The Firecrawl implementation should be moved to its own package for better maintainability.

## References

- [Review and Improve Firecrawl Agent Methods](UltraterrestrialSalvageAttempt/salvaging-workspace/spec-story-salvage-history/2025-04-27_17-23-review-and-improve-firecrawl-agent-methods.md)
- [Firecrawl Official Documentation](https://docs.firecrawl.dev/agents/fire-1) 