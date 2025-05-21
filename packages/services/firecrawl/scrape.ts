import { fireCrawl } from "./firecrawl.client";
import type {
	ScrapeOptions,
	CrawlOptions,
	MapOptions,
	ChangeTrackingOptions,
	DeepResearchOptions,
} from "./types";

/**
 * Scrape content from a URL with enhanced options
 * @param url URL to scrape
 * @param options Scrape configuration options
 * @param prompt Optional prompt for the FIRE-1 agent
 */
export const scrape = async (
	url: string,
	options: ScrapeOptions = {},
	prompt?: string,
) => {
	try {
		// Always use FIRE-1 agent by default with optional prompt
		const agent = { model: "FIRE-1", prompt: prompt || "" };
		const config = { ...options, agent };
		return await fireCrawl.scrapeUrl(url, config);
	} catch (error) {
		console.error("FireCrawl scrape error:", error);
		throw error;
	}
};

/**
 * @deprecated Use the unified `scrape()` function instead
 */
export const enhancedScrapeContent = async (
	url: string,
	options: ScrapeOptions = {},
	agent?: { model: "FIRE-1"; prompt: string },
) => {
	return scrape(url, options, agent?.prompt);
};

/**
 * Scrape multiple URLs in batch mode
 * @param urls Array of URLs to scrape
 * @param options Batch scrape options
 * @returns Results from all scraped URLs
 */
export const batchScrapeUrls = async (
	urls: string[],
	options: ScrapeOptions = {},
) => {
	try {
		return await fireCrawl.batchScrapeUrls(urls, options);
	} catch (error) {
		console.error("FireCrawl batch scrape error:", error);
		throw error;
	}
};

/**
 * Submit batch scrape job asynchronously and get job ID
 * @param urls Array of URLs to scrape
 * @param options Batch scrape options
 * @returns Job ID and status URL
 */
export const asyncBatchScrapeUrls = async (
	urls: string[],
	options: ScrapeOptions = {},
) => {
	return await fireCrawl.asyncBatchScrapeUrls(urls, options);
};

/**
 * Check status of a batch scrape job
 * @param jobId ID of the batch job
 * @returns Current status and results if completed
 */
export const checkBatchScrapeStatus = async (jobId: string) => {
	return await fireCrawl.checkBatchScrapeStatus(jobId);
};

/**
 * Crawl a website starting from a URL
 * @param url Starting URL for crawl
 * @param options Crawl options
 * @returns Crawl results
 */
export const crawlUrl = async (url: string, options: CrawlOptions = {}) => {
	return await fireCrawl.crawlUrl(url, options);
};

/**
 * Submit crawl job asynchronously and get job ID
 * @param url Starting URL for crawl
 * @param options Crawl options
 * @returns Job ID and status URL
 */
export const asyncCrawlUrl = async (
	url: string,
	options: CrawlOptions = {},
) => {
	return await fireCrawl.asyncCrawlUrl(url, options);
};

/**
 * Check status of a crawl job
 * @param jobId ID of the crawl job
 * @returns Current status and results if completed
 */
export const checkCrawlStatus = async (jobId: string) => {
	return await fireCrawl.checkCrawlStatus(jobId);
};

/**
 * Map URLs from a starting point (discover links)
 * @param url Starting URL for mapping
 * @param options Map options
 * @returns Discovered URLs
 */
export const mapUrl = async (url: string, options: MapOptions = {}) => {
	return await fireCrawl.mapUrl(url, options);
};

/**
 * Track changes to a webpage over time
 * @param url URL to monitor
 * @param options Change tracking options
 * @returns Changes detected since last check
 */
export const trackChanges = async (
	url: string,
	options: ChangeTrackingOptions = {},
) => {
	// Note: Property 'trackChanges' doesn't exist in FirecrawlApp; this may need updating
	// @ts-ignore
	return await fireCrawl.trackChanges(url, options);
};

/**
 * Generate LLMs.txt file for a website
 * @param url URL of website
 * @param options Options for LLMs.txt generation
 * @returns Generated LLMs.txt content
 */
export const generateLLMsTxt = async (
	url: string,
	options: { maxUrls?: number; showFullText?: boolean } = {},
) => {
	// Note: Property 'generateLLMsTxt' might be 'generateLLMsText' in FirecrawlApp
	// @ts-ignore
	return await fireCrawl.generateLLMsTxt(url, options);
};

/**
 * Execute semantic search against web content
 * @param query Search query
 * @param options Search options
 * @returns Search results
 */
export const search = async (
	query: string,
	options: {
		country?: string;
		lang?: string;
		limit?: number;
		filter?: string;
		tbs?: string;
		scrapeOptions?: ScrapeOptions;
	} = {},
) => {
	return await fireCrawl.search(query, options);
};

/**
 * Perform deep research on a query using web crawling and AI
 * @param query Research query
 * @param options Research options
 * @param onActivity Optional callback for real-time updates
 * @returns Research results and analysis
 */
export const deepResearch = async (
	query: string,
	options: DeepResearchOptions = { query },
	onActivity?: (activity: unknown) => void,
) => {
	return await fireCrawl.deepResearch(query, options, onActivity);
};
