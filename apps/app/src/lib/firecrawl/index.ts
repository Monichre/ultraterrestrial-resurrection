import FirecrawlApp from "@mendable/firecrawl-js";

// Initialize the FireCrawl client with API key
export const fireCrawl = new FirecrawlApp({
	apiKey:
		process.env.FIRECRAWL_API_KEY || process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY,
});

// Types for FireCrawl functions
export type ScrapeOptions = {
	formats?: string[];
	waitFor?: number;
	onlyMainContent?: boolean;
	mobile?: boolean;
	location?: {
		country?: string;
		languages?: string[];
	};
	actions?: Array<{
		type:
			| "wait"
			| "click"
			| "screenshot"
			| "write"
			| "press"
			| "scroll"
			| "scrape"
			| "executeJavascript";
		selector?: string;
		milliseconds?: number;
		text?: string;
		key?: string;
		direction?: "up" | "down";
		fullPage?: boolean;
		script?: string;
	}>;
	extract?: {
		prompt?: string;
		schema?: Record<string, any>;
		systemPrompt?: string;
	};
	excludeTags?: string[];
	includeTags?: string[];
	removeBase64Images?: boolean;
};

export type BatchScrapeOptions = {
	formats?: string[];
	options?: {
		excludeTags?: string[];
		includeTags?: string[];
		onlyMainContent?: boolean;
		waitFor?: number;
	};
};

export type CrawlOptions = {
	limit?: number;
	maxDepth?: number;
	excludePaths?: string[];
	includePaths?: string[];
	allowExternalLinks?: boolean;
	allowBackwardLinks?: boolean;
	ignoreQueryParameters?: boolean;
	ignoreSitemap?: boolean;
	deduplicateSimilarURLs?: boolean;
	scrapeOptions?: ScrapeOptions;
	webhook?: string | { url: string; headers?: Record<string, string> };
};

export type MapOptions = {
	limit?: number;
	includeSubdomains?: boolean;
	ignoreSitemap?: boolean;
	sitemapOnly?: boolean;
	search?: string;
};

export type ExtractOptions = {
	schema?: Record<string, any>;
	prompt?: string;
	systemPrompt?: string;
	allowExternalLinks?: boolean;
	includeSubdomains?: boolean;
	enableWebSearch?: boolean;
};

export type DeepResearchOptions = {
	maxDepth?: number;
	maxUrls?: number;
	timeLimit?: number;
	query: string;
};

export type ChangeTrackingOptions = {
	lastCheckpoint?: string;
	comparisonType?: "content" | "visual" | "both";
	ignoreCssPaths?: string[];
	ignoreTextRegex?: string;
	visualDiffOptions?: {
		threshold?: number;
		highlightColor?: string;
	};
};

/**
 * Scrape a single URL with customizable options
 * @param url URL to scrape
 * @param options Scrape options
 * @returns Scraped content in requested formats
 */
export const scrapeUrl = async (url: string, options: ScrapeOptions = {}) => {
	return await fireCrawl.scrapeUrl(url, options);
};

/**
 * Scrape multiple URLs in batch mode
 * @param urls Array of URLs to scrape
 * @param options Batch scrape options
 * @returns Results from all scraped URLs
 */
export const batchScrapeUrls = async (
	urls: string[],
	options: BatchScrapeOptions = {},
) => {
	return await fireCrawl.batchScrapeUrls(urls, options);
};

/**
 * Submit batch scrape job asynchronously and get job ID
 * @param urls Array of URLs to scrape
 * @param options Batch scrape options
 * @returns Job ID and status URL
 */
export const asyncBatchScrapeUrls = async (
	urls: string[],
	options: BatchScrapeOptions = {},
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
 * Extract structured data from web pages using LLM
 * @param urls URLs to extract data from
 * @param options Extract options
 * @returns Structured data extracted from pages
 */
export const extract = async (urls: string[], options: ExtractOptions) => {
	return await fireCrawl.extract(urls, options);
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
	options: DeepResearchOptions = {},
	onActivity?: (activity: any) => void,
) => {
	return await fireCrawl.deepResearch(query, options, onActivity);
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
