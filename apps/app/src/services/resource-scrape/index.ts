/**
 * Resource scraping service
 * Exports utilities for scraping and processing external resources
 */

// Export all features from firecrawl implementation
export * from "./firecrawl";

// Export jina implementation
export * from "./jina";

// Export multion-ai implementation
export * from "./multion-ai";

// Export core resource scrape functionality
export * from "./resource-scrape";

// Export document processing utilities
export * from "./process-document";

// Re-export types and enums for easier imports
export {
	ResearchDepth,
	ResearchCategory,
	type DeepResearchOptions,
} from "./firecrawl";

// Re-export types from FireCrawl lib
export type {
	ScrapeOptions,
	BatchScrapeOptions,
	CrawlOptions,
	MapOptions,
	ExtractOptions,
	ChangeTrackingOptions,
} from "@/lib/firecrawl";
