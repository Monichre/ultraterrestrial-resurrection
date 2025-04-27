import FirecrawlApp from "@mendable/firecrawl-js";
import type { ZodType, ZodTypeDef } from "zod";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Initialize the FireCrawl client with API key
export const fireCrawl = new FirecrawlApp({
	apiKey:
		process.env.FIRECRAWL_API_KEY || process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY,
});

// Canonical types
export type Format =
	| "content"
	| "html"
	| "json"
	| "markdown"
	| "extract"
	| "screenshot"
	| "rawHtml"
	| "links"
	| "screenshot@fullPage"
	| "changeTracking";

export type ScrapeOptions = {
	formats?: Format[];
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
		schema?: ZodType<any, ZodTypeDef, any>;
		systemPrompt?: string;
	};
	excludeTags?: string[];
	includeTags?: string[];
	removeBase64Images?: boolean;
	agent?: {
		model: "FIRE-1";
		prompt: string;
	};
};

export type BatchScrapeOptions = {
	formats?: Format[];
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
	schema?: ZodType<any, ZodTypeDef, any>;
	prompt?: string;
	systemPrompt?: string;
	allowExternalLinks?: boolean;
	includeSubdomains?: boolean;
	enableWebSearch?: boolean;
	agent?: {
		model: "FIRE-1";
		prompt: string;
	};
};

export type DeepResearchOptions = {
	maxDepth?: number;
	maxUrls?: number;
	timeLimit?: number;
	query: string;
};

/**
 * Enhanced scrape function with optional FIRE-1 agent for advanced navigation.
 * @param url URL to scrape
 * @param options Scrape options
 * @param agent Optional FIRE-1 agent config ({ model: 'FIRE-1', prompt: string })
 * @returns Scraped content in requested formats
 * @example
 * await enhancedScrapeContent('https://example.com', { formats: ['html'] }, { model: 'FIRE-1', prompt: 'Click next until done.' })
 */
export const enhancedScrapeContent = async (
	url: string,
	options: ScrapeOptions = {},
	agent?: { model: "FIRE-1"; prompt: string },
) => {
	if (agent) options.agent = agent;
	return await fireCrawl.scrapeUrl(url, options);
};

/**
 * Enhanced extract function with optional FIRE-1 agent for advanced extraction.
 * Accepts Zod or JSON schema.
 * @param urls URLs to extract from
 * @param schema Zod schema or JSON schema
 * @param prompt Extraction prompt
 * @param agent Optional FIRE-1 agent config ({ model: 'FIRE-1' })
 * @returns Extracted structured data
 * @example
 * await enhancedExtractContent(['https://forum.com'], z.object({ ... }), 'Extract all comments', { model: 'FIRE-1' })
 */
export const enhancedExtractContent = async (
	urls: string[],
	schema: object | z.ZodType<any, any, any>,
	prompt: string,
	agent?: { model: "FIRE-1" },
) => {
	let jsonSchema: object;
	if (typeof (schema as any).safeParse === "function") {
		jsonSchema = zodToJsonSchema(schema as z.ZodType<any, any, any>);
	} else {
		jsonSchema = schema;
	}
	return await fireCrawl.extract(urls, {
		prompt,
		schema: jsonSchema,
		agent,
	});
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
 * @param options.agent Optional FIRE-1 agent configuration for intelligent web navigation
 * @param options.agent.model Set to "FIRE-1" to use the AI agent
 * @param options.agent.prompt Detailed instructions for the agent to navigate and extract from the webpage
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
	onActivity?: (activity: unknown) => void,
) => {
	return await fireCrawl.deepResearch(query, options, onActivity);
};

/**
 * Generate LLMs.txt file for a website
 * @param url URL of website
 * @param options Options for LLMs.txt generation
 * @returns Generated LLMs.txt content
 */
export const generateLLMsText = async (
	url: string,
	options: { maxUrls?: number; showFullText?: boolean } = {},
) => {
	return await fireCrawl.generateLLMsText(url, options);
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
