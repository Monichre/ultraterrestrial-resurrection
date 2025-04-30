import {
	fireCrawl,
	enhancedScrapeContent,
	batchScrapeUrls,
	deepResearch as fireDeepResearch,
	type DeepResearchOptions as FireDeepResearchOptions,
	type ScrapeOptions,
	type CrawlOptions,
	type Format,
	type ExtractOptions,
} from "@/lib/firecrawl";
import { EXTERNAL_RESOURCES } from "@/utils";
import { NER_RESEARCH_PROMPT } from "@/services/ai/prompts/research.prompt";
import { z, ZodType, ZodTypeDef } from "zod";
// import { askClaude } from "@/lib/anthropic/claude"; // To be implemented

// Resource categories for deep research
enum ResearchDepth {
	SURFACE = "surface",
	MODERATE = "moderate",
	DEEP = "deep",
	COMPREHENSIVE = "comprehensive",
}

enum ResearchCategory {
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

type DeepResearchOptions = {
	depth: ResearchDepth;
	categories: ResearchCategory[];
	recursiveLinks?: boolean;
	linkDepth?: number;
	extractionModel?: string;
	searchParams?: Record<string, string>;
	maxResults?: number;
};

/**
 * Scrape a single URL with Firecrawl, using a domain-specific extraction prompt.
 */
export const scrapeWithFireCrawl = async ({
	url,
	formats = ["markdown", "extract", "screenshot"],
	extract = {
		prompt:
			"Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon",
	},
}: { url: string; formats: Format[]; extract: { prompt: string } }) => {
	return await enhancedScrapeContent(url, {
		formats,
		extract: {
			prompt: extract.prompt,
		},
	});
};

/**
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
	const depthConfig: Record<
		ResearchDepth,
		{ formats: Format[]; limit: number }
	> = {
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
			formats: ["markdown", "extract", "screenshot", "html", "content"],
			limit: 500,
		},
	};

	// Build category-specific extraction prompts
	const categoryPrompts: Record<ResearchCategory, string> = {
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
				if (recursiveLinks) {
					const crawlResponse = await crawlUrl(url, {
						limit: depthConfig[depth].limit,
						maxDepth: linkDepth,
						allowExternalLinks: true,
						scrapeOptions: {
							formats: depthConfig[depth].formats,
							extract: {
								prompt: extractionPrompt,
							},
						},
					});
					return {
						source: url,
						data: crawlResponse,
						status: "success" as const,
						researchDepth: depth,
						categories,
					};
				}
				// Use standard scrape for single-page analysis
				const scrapeResponse = await enhancedScrapeContent(url, {
					formats: depthConfig[depth].formats,
					extract: {
						prompt: extractionPrompt,
					},
				});
				return {
					source: url,
					data: scrapeResponse,
					status: "success" as const,
					researchDepth: depth,
					categories,
				};
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error));
				return {
					source: url,
					error: err.message,
					status: "failed" as const,
					researchDepth: depth,
					categories,
				};
			}
		}),
	);
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
	const deepResearchOptions: FireDeepResearchOptions = {
		query,
		maxDepth: options.maxDepth || 5,
		maxUrls: options.maxUrls || 15,
		timeLimit: options.timeLimit || 180,
	};
	// Define a callback for activity updates
	const onActivity = (activity: unknown) => {
		if (
			typeof activity === "object" &&
			activity !== null &&
			"type" in activity &&
			"message" in activity
		) {
			// @ts-expect-error: dynamic shape
			console.log(`[${activity.type}] ${activity.message}`);
		}
	};
	return await fireDeepResearch(query, deepResearchOptions, onActivity);
};

/**
 * Batch scrape a list of resource URLs
 */
export const batchScrapeResources = async (
	urls: string[],
	formats: Format[] = ["markdown", "html"],
) => {
	return await batchScrapeUrls(urls, {
		formats,
		options: {
			onlyMainContent: true,
		},
	});
};

/**
 * Extract structured data from multiple resource URLs using a custom prompt
 */
export const extractStructuredData = async (
	urls: string[],
	prompt = "Extract all data related to UAP/UFO phenomena including key figures, events, topics, claims, locations, organizations,sightings, testimonies, documents, artifacts and evidence",
) => {
	return await fireCrawl.extract(urls, {
		prompt,
		allowExternalLinks: false,
		enableWebSearch: true,
	});
};

// Note: Claude integration and trackResourceChanges are omitted until a correct, type-safe implementation is available.

export { ResearchDepth, ResearchCategory, type DeepResearchOptions };
