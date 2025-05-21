/**
 * @ultraterrestrial/services
 *
 * Central export point for all service clients and utilities
 */

// Export Firecrawl services
export * as firecrawl from "./firecrawl";

// Export Exa AI services
export * as exa from "./exa";

// Export deep-research services
export * as deepResearch from "./deep-research/src";

// Export specific named services for direct imports
// This allows importing directly: import { search } from '@ultraterrestrial/services';
export {
	// Firecrawl core services
	search,
	fireCrawl as FIRECRAWL_CLIENT,
	scrapeUrl as scrape,
	batchScrapeUrls as batchScrape,
	asyncBatchScrapeUrls as asyncBatchScrape,
	checkBatchScrapeStatus,
	crawlUrl as crawl,
	asyncCrawlUrl as asyncCrawl,
	checkCrawlStatus,
	mapUrl,
	extract,
	deepResearch,
	trackChanges,
	generateLLMsTxt,
	ResearchDepth,
	ResearchCategory,
} from "./firecrawl";

// Export Exa services for direct import
export {
	exa as EXA_CLIENT,
	search as exaSearch,
	answer,
	findSimilar,
	getContents,
} from "./exa";

// Export enhanced research functions
export {
	enhancedDeepResearch,
	categoryResearch,
	quickResearch,
	comprehensiveResearch,
} from "./deep-research/src/enhanced-research";

// Export types
export * from "./firecrawl/types";
