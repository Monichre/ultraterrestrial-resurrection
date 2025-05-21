/**
 * Firecrawl Service Integration
 *
 * A comprehensive wrapper around the Firecrawl API for web scraping,
 * crawling, and content extraction.
 */

// Re-export all from scraper
export {
	scrape,
	enhancedScrapeContent,
	batchScrapeUrls,
	asyncBatchScrapeUrls,
	checkBatchScrapeStatus,
	crawlUrl,
	asyncCrawlUrl,
	checkCrawlStatus,
	mapUrl,
	trackChanges,
	generateLLMsTxt,
	search,
	deepResearch,
} from "./scrape";

// Re-export all from extractor
export {
	enhancedExtractContent,
	extract,
	extractStructured,
} from "./extract";

// Export research depth and category enums
export enum ResearchDepth {
	SURFACE = "SURFACE",
	MODERATE = "MODERATE",
	DEEP = "DEEP",
	COMPREHENSIVE = "COMPREHENSIVE",
}

export enum ResearchCategory {
	SIGHTINGS = "SIGHTINGS",
	EVENTS = "EVENTS",
	PERSONNEL = "PERSONNEL",
	ORGANIZATIONS = "ORGANIZATIONS",
	LOCATIONS = "LOCATIONS",
	TESTIMONIES = "TESTIMONIES",
	ARTIFACTS = "ARTIFACTS",
	DOCUMENTS = "DOCUMENTS",
}

// Re-export types
export type {
	ScrapeOptions,
	CrawlOptions,
	MapOptions,
	ExtractOptions,
	DeepResearchOptions,
	ChangeTrackingOptions,
} from "./types";

// Shorter aliases for commonly used functions
export const scrapeUrl = scrape;
export const crawl = crawlUrl;
export const asyncCrawl = asyncCrawlUrl;
export const batchScrape = batchScrapeUrls;
export const asyncBatchScrape = asyncBatchScrapeUrls;
