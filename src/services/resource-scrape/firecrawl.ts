import {
	fireCrawl,
	scrapeUrl,
	crawlUrl,
	batchScrapeUrls,
	deepResearch as fireDeepResearch,
	type DeepResearchOptions as FireDeepResearchOptions,
	ScrapeOptions,
	CrawlOptions,
} from "@/lib/firecrawl";
import { EXTERNAL_RESOURCES } from "@/utils";

// Resource categories for deep research
export enum ResearchDepth {
	SURFACE = "surface",
	MODERATE = "moderate",
	DEEP = "deep",
	COMPREHENSIVE = "comprehensive",
}

export enum ResearchCategory {
	SIGHTINGS = "sightings",
	TESTIMONIES = "testimonies",
	ARTIFACTS = "artifacts",
	ORGANIZATIONS = "organizations",
	PERSONNEL = "personnel",
	EVENTS = "events",
	THEORIES = "theories",
	LOCATIONS = "locations",
	PHENOMENA = "phenomena",
}

export type DeepResearchOptions = {
	depth: ResearchDepth;
	categories: ResearchCategory[];
	recursiveLinks?: boolean;
	linkDepth?: number;
	extractionModel?: string;
	searchParams?: Record<string, string>;
	maxResults?: number;
};

export const scrapeWithFireCrawl = async ({
	url,
	formats = ["markdown", "extract", "screenshot"],
	extract = {
		prompt:
			"Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon",
	},
}: { url: string; formats: string[]; extract: { prompt: string } }) => {
	return await scrapeUrl(url, {
		formats,
		extract: {
			prompt: extract.prompt,
		},
	});
};

/**
 *
 * Deep research feature utilizing Firecrawl's latest API capabilities
 * This function can perform targeted extraction based on research categories
 * and provides different depth levels of analysis.
 */
export const deepResearch = async (
	urls: string[],
	options: DeepResearchOptions,
) => {
	const {
		depth = ResearchDepth.MODERATE,
		categories = [ResearchCategory.SIGHTINGS],
		recursiveLinks = false,
		linkDepth = 1,
		extractionModel = "anthropic/claude-3-opus-20240229",
		searchParams = {},
		maxResults = 10,
	} = options;

	// Adjust scraping parameters based on research depth
	const depthConfig = {
		[ResearchDepth.SURFACE]: {
			formats: ["markdown", "extract"],
			limit: 50,
		},
		[ResearchDepth.MODERATE]: {
			formats: ["markdown", "extract", "screenshot"],
			limit: 100,
		},
		[ResearchDepth.DEEP]: {
			formats: ["markdown", "extract", "screenshot", "html"],
			limit: 250,
		},
		[ResearchDepth.COMPREHENSIVE]: {
			formats: ["markdown", "extract", "screenshot", "html", "text"],
			limit: 500,
		},
	};

	// Build category-specific extraction prompts
	const categoryPrompts = {
		[ResearchCategory.SIGHTINGS]:
			"Extract all UAP/UFO sighting data including dates, locations, witness details, object descriptions, and behavior patterns",
		[ResearchCategory.TESTIMONIES]:
			"Extract all testimony data including witnesses, officials, credibility factors, consistency with other accounts, and key claims",
		[ResearchCategory.ARTIFACTS]:
			"Extract all artifact data including physical evidence, analysis results, chain of custody, and scientific evaluations",
		[ResearchCategory.ORGANIZATIONS]:
			"Extract all organization data including government agencies, research groups, private entities, and their connections to UAP/UFO research",
		[ResearchCategory.PERSONNEL]:
			"Extract all data about key individuals including researchers, officials, witnesses, and their contributions to UAP/UFO disclosure",
		[ResearchCategory.EVENTS]:
			"Extract all significant event data including major incidents, hearings, disclosures, and their historical context",
		[ResearchCategory.THEORIES]:
			"Extract all theoretical frameworks explaining UAP/UFO phenomena including scientific hypotheses and alternative explanations",
		[ResearchCategory.LOCATIONS]:
			"Extract all data about significant locations including hotspots, bases, and areas with recurring phenomena",
		[ResearchCategory.PHENOMENA]:
			"Extract all data about specific types of UAP/UFO phenomena including patterns, classifications, and physical characteristics",
	};

	// Build the combined extraction prompt
	const extractionPrompt = categories
		.map((category) => categoryPrompts[category])
		.join(". Also, ");

	// Configure and execute the deep research crawl
	const deepResearchResults = await Promise.all(
		urls.map(async (url) => {
			try {
				// Determine if we're using the new recursive crawl API
				if (recursiveLinks) {
					const crawlResponse = await crawlUrl(url, {
						limit: depthConfig[depth].limit,
						maxDepth: linkDepth,
						allowExternalLinks: true,
						scrapeOptions: {
							formats: depthConfig[depth].formats,
							extract: {
								prompt: extractionPrompt,
								// model is not in our updated type, so we'll omit it
								// model: extractionModel,
							},
						},
					});

					return {
						source: url,
						data: crawlResponse,
						status: "success",
						researchDepth: depth,
						categories,
					};
				} else {
					// Use standard scrape for single-page analysis
					const scrapeResponse = await scrapeUrl(url, {
						formats: depthConfig[depth].formats,
						extract: {
							prompt: extractionPrompt,
							// model is not in our updated type, so we'll omit it
							// model: extractionModel,
						},
					});

					return {
						source: url,
						data: scrapeResponse,
						status: "success",
						researchDepth: depth,
						categories,
					};
				}
			} catch (error) {
				console.error(`Deep research failed for URL: ${url}`, error);
				return {
					source: url,
					error: error.message,
					status: "failed",
					researchDepth: depth,
					categories,
				};
			}
		}),
	);

	// Filter to max results and return
	return deepResearchResults.slice(0, maxResults);
};

/**
 * Use FireCrawl's native deep research feature
 * This is a simplified wrapper around FireCrawl's deep research API
 */
export const advancedDeepResearch = async (
	query: string,
	options: {
		maxDepth?: number;
		maxUrls?: number;
		timeLimit?: number;
	},
) => {
	try {
		const deepResearchOptions: FireDeepResearchOptions = {
			query,
			maxDepth: options.maxDepth || 5,
			maxUrls: options.maxUrls || 15,
			timeLimit: options.timeLimit || 180,
		};

		// Define a callback for activity updates
		const onActivity = (activity: any) => {
			console.log(`[${activity.type}] ${activity.message}`);
		};

		// Execute deep research
		return await fireDeepResearch(query, deepResearchOptions, onActivity);
	} catch (error) {
		console.error(`Advanced deep research failed for query: ${query}`, error);
		throw error;
	}
};

export const scrapeAllExternalDisclosureResources = async () => {
	const fullResourceScrape = await Promise.all(
		EXTERNAL_RESOURCES.map(async (resource) => {
			const scrapeResponse = await scrapeUrl(resource, {
				formats: ["markdown", "html"],
			});
			return {
				source: resource,
				data: scrapeResponse,
			};
		}),
	);
	console.log("fullResourceScrape: ", fullResourceScrape);
	return fullResourceScrape;
};

export const crawlAllExternalDisclosureResources = async () => {
	const fullResourceCrawl = await Promise.all(
		EXTERNAL_RESOURCES.map(async (resource) => {
			const crawlResponse = await crawlUrl(resource, {
				limit: 100,
				scrapeOptions: {
					formats: ["markdown", "html"],
				},
			});
			return {
				source: resource,
				data: crawlResponse,
			};
		}),
	);
	console.log("fullResourceCrawl: ", fullResourceCrawl);
	return fullResourceCrawl;
};

/**
 * Track changes to a specific resource URL over time
 * @param url URL to monitor for changes
 * @param lastCheckpoint Previous checkpoint ID to compare against
 * @returns Changes detected since last check
 */
export const trackResourceChanges = async (
	url: string,
	lastCheckpoint?: string,
) => {
	try {
		return await fireCrawl.trackChanges(url, {
			lastCheckpoint,
			comparisonType: "both",
		});
	} catch (error) {
		console.error(`Failed to track changes for URL: ${url}`, error);
		throw error;
	}
};

/**
 * Batch scrape a list of resource URLs
 * @param urls List of URLs to scrape
 * @param formats Output formats to request
 * @returns Results from all scraped URLs
 */
export const batchScrapeResources = async (
	urls: string[],
	formats = ["markdown", "html"],
) => {
	try {
		return await batchScrapeUrls(urls, {
			formats,
			options: {
				onlyMainContent: true,
			},
		});
	} catch (error) {
		console.error(`Batch scrape failed for ${urls.length} URLs`, error);
		throw error;
	}
};

/**
 * Extract structured data from multiple resource URLs using a custom prompt
 * @param urls URLs to extract data from
 * @param prompt Custom extraction prompt
 * @returns Structured data extracted from pages
 */
export const extractStructuredData = async (
	urls: string[],
	prompt = "Extract all data related to UAP/UFO phenomena including sightings, testimonies, and evidence",
) => {
	try {
		return await fireCrawl.extract(urls, {
			prompt,
			allowExternalLinks: false,
			enableWebSearch: true,
		});
	} catch (error) {
		console.error(`Data extraction failed for ${urls.length} URLs`, error);
		throw error;
	}
};
