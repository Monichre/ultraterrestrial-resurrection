/**
 * Firecrawl Service Integration
 *
 * A comprehensive wrapper around the Firecrawl API for web scraping,
 * crawling, and content extraction.
 */

import {
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
} from './scrape'

import { enhancedExtractContent, extract, extractStructured } from './extract'

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
	enhancedExtractContent,
	extract,
	extractStructured,
}

export enum ResearchDepth {
	SURFACE = 'SURFACE',
	MODERATE = 'MODERATE',
	DEEP = 'DEEP',
	COMPREHENSIVE = 'COMPREHENSIVE',
}

export enum ResearchCategory {
	SIGHTINGS = 'SIGHTINGS',
	EVENTS = 'EVENTS',
	PERSONNEL = 'PERSONNEL',
	ORGANIZATIONS = 'ORGANIZATIONS',
	LOCATIONS = 'LOCATIONS',
	TESTIMONIES = 'TESTIMONIES',
	ARTIFACTS = 'ARTIFACTS',
	DOCUMENTS = 'DOCUMENTS',
}

export { fireCrawl, FirecrawlApp } from './firecrawl.client'

export type {
	ScrapeOptions,
	CrawlOptions,
	MapOptions,
	ExtractOptions,
	DeepResearchOptions,
	ChangeTrackingOptions,
} from './types'

export const scrapeUrl = scrape
export const crawl = crawlUrl
export const asyncCrawl = asyncCrawlUrl
export const batchScrape = batchScrapeUrls
export const asyncBatchScrape = asyncBatchScrapeUrls
