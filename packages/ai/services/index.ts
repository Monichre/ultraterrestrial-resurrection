/**
 * @repo/ai/services
 *
 * Vendor research adapters (Exa, Firecrawl, deep-research) owned by the AI workspace.
 * Logical tool names live in packages/ai/shared/01-tool-registry.md.
 */

export * as firecrawl from './firecrawl'
export * as exa from './exa'
export * as deepResearch from './deep-research/src'

export {
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
  // Avoid clashing with `export * as deepResearch` (the composition module)
  deepResearch as firecrawlDeepResearch,
  trackChanges,
  generateLLMsTxt,
  ResearchDepth,
  ResearchCategory,
} from './firecrawl'

export {
  exa as EXA_CLIENT,
  search as exaSearch,
  answer,
  findSimilar,
  getContents,
} from './exa'

export {
  enhancedDeepResearch,
  categoryResearch,
  quickResearch,
  comprehensiveResearch,
} from './deep-research/src/enhanced-research'

export * from './firecrawl/types'
