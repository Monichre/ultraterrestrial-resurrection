/**
 * @repo/ai/services
 * Shared types for service integrations
 */

// Types for FireCrawl functions
export type ScrapeOptions = {
	formats?: Array<
		| "screenshot"
		| "content"
		| "markdown"
		| "html"
		| "rawHtml"
		| "links"
		| "screenshot@fullPage"
		| "extract"
		| "json"
		| "changeTracking"
	>
	waitFor?: number
	onlyMainContent?: boolean
	mobile?: boolean
	location?: {
		country?: string
		languages?: string[]
	}
	actions?: Array<{
		type:
		| "wait"
		| "click"
		| "screenshot"
		| "write"
		| "press"
		| "scroll"
		| "scrape"
		| "executeJavascript"
		selector?: string
		milliseconds?: number
		text?: string
		key?: string
		direction?: "up" | "down"
		fullPage?: boolean
		script?: string
	}>
	extract?: {
		prompt?: string
		schema?: Record<string, unknown>
		systemPrompt?: string
	}
	excludeTags?: string[]
	includeTags?: string[]
	removeBase64Images?: boolean
	agent?: {
		model: "FIRE-1"
		prompt?: string
	}
}

export type CrawlOptions = {
	limit?: number
	maxDepth?: number
	excludePaths?: string[]
	includePaths?: string[]
	allowExternalLinks?: boolean
	allowBackwardLinks?: boolean
	ignoreQueryParameters?: boolean
	ignoreSitemap?: boolean
	deduplicateSimilarURLs?: boolean
	scrapeOptions?: ScrapeOptions
	webhook?: string | { url: string; headers?: Record<string, string> }
}

export type MapOptions = {
	limit?: number
	includeSubdomains?: boolean
	ignoreSitemap?: boolean
	sitemapOnly?: boolean
	search?: string
}

export type ExtractOptions = {
	schema?: Record<string, unknown>
	prompt?: string
	systemPrompt?: string
	allowExternalLinks?: boolean
	includeSubdomains?: boolean
	enableWebSearch?: boolean
	agent?: {
		model: "FIRE-1"
	}
}

export type DeepResearchOptions = {
	maxDepth?: number
	maxUrls?: number
	timeLimit?: number
	query: string
	depth?: string
	categories?: string[]
}

export type ChangeTrackingOptions = {
	lastCheckpoint?: string
	comparisonType?: "content" | "visual" | "both"
	ignoreCssPaths?: string[]
	ignoreTextRegex?: string
	visualDiffOptions?: {
		threshold?: number
		highlightColor?: string
	}
}

// Types for Exa AI API
export interface ExaSearchParams {
	numResults?: number
	type?: "auto" | "neural" | "keyword"
	includeDomains?: string[]
	excludeDomains?: string[]
	category?: string
	text?:
	| boolean
	| {
		maxCharacters?: number
	}
	highlights?:
	| boolean
	| {
		query?: string
		numSentences?: number
		highlightsPerUrl?: number
	}
	startPublishedDate?: string
	endPublishedDate?: string
}

export interface ExaSimilarParams {
	numResults?: number
	excludeSourceDomain?: boolean
	includeDomains?: string[]
	excludeDomains?: string[]
	text?:
	| boolean
	| {
		maxCharacters?: number
	}
	highlights?:
	| boolean
	| {
		query?: string
		numSentences?: number
		highlightsPerUrl?: number
	}
}

export interface ExaContentsParams {
	text?:
	| boolean
	| {
		maxCharacters?: number
	}
	highlights?: {
		query: string
		numSentences?: number
		highlightsPerUrl?: number
	}
	summary?: {
		query: string
		schema?: object
	}
}

export interface ExaAnswerParams {
	model?: "exa" | "exa-pro"
	stream?: boolean
	text?: boolean
}

// Result types
export interface SearchResult {
	url: string
	id: string
	title: string | null
	score?: number
	publishedDate?: string
	author?: string
	text?: string
	highlights?: string[]
	highlightScores?: number[]
	summary?: string
}

export interface Citation {
	id: string
	url: string
	title: string
	author?: string
	publishedDate?: string
	text?: string
}

export interface AnswerResponse {
	answer: string
	citations: Citation[]
	costDollars?: number
}

// Deep Research types
export interface EnhancedDeepResearchOptions extends DeepResearchOptions {
	useExa?: boolean
	useFirecrawl?: boolean
	maxResults?: number
	includeFullText?: boolean
}

export interface DeepResearchResult {
	query: string
	sources: SourceData[]
	insights: string[]
	summary: string
}

export interface SourceData {
	url: string
	title: string
	content?: string
	highlights?: string[]
	score?: number
}
