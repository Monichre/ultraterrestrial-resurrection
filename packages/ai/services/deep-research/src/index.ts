/**
 * Deep Research Package
 *
 * This package integrates Firecrawl and Exa AI capabilities for advanced web research,
 * content extraction, and knowledge processing.
 */

// Re-export Firecrawl functionality
export * from "../../firecrawl";

// Re-export Exa functionality
export * from "../../exa";

// Re-export utils
export * from "./utils/content-processor";
export * from "./utils/summarizer";

// Re-export enhanced deep research types
export type {
	EnhancedDeepResearchOptions,
	DeepResearchResult,
	SourceData,
} from "../../firecrawl/types";

// Enhanced deep research functions
export * from "./enhanced-research";

// Package version
export const version = "1.0.0";
