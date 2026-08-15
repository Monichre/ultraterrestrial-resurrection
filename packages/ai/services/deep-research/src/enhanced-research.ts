/**
 * Enhanced Deep Research Functions
 *
 * This module provides enhanced research capabilities by combining Firecrawl and Exa
 */

import {
	deepResearch as firecrawlDeepResearch,
	ResearchDepth,
	ResearchCategory,
} from "../../firecrawl";

import { search as exaSearch, answer as exaAnswer } from "../../exa";

import {
	EnhancedDeepResearchOptions,
	DeepResearchResult,
	SourceData,
} from "../../firecrawl/types";

import {
	extractText,
	extractHighlights,
	createResearchDocument,
} from "./utils/content-processor";

/**
 * Performs enhanced deep research using both Firecrawl and Exa
 * @param query The research query
 * @param options Research options
 * @returns Enhanced research results
 */
export const enhancedDeepResearch = async (
	query: string,
	options: EnhancedDeepResearchOptions = { query },
): Promise<DeepResearchResult> => {
	// Default to using both services unless specified otherwise
	const useExa = options.useExa ?? true;
	const useFirecrawl = options.useFirecrawl ?? true;
	const maxResults = options.maxResults || 10;

	const sources: SourceData[] = [];

	// Collect data from Firecrawl if enabled
	if (useFirecrawl) {
		try {
			const firecrawlResults = await firecrawlDeepResearch(query, {
				query,
				maxDepth: options.maxDepth,
				maxUrls: options.maxUrls,
				timeLimit: options.timeLimit,
				depth: options.depth,
				categories: options.categories,
			});

			// Process and add Firecrawl results
			if (firecrawlResults && Array.isArray(firecrawlResults.results)) {
				firecrawlResults.results.forEach((result) => {
					sources.push({
						url: result.url || "",
						title: result.title || "Unknown Title",
						content: options.includeFullText ? result.content || "" : undefined,
						highlights: result.highlights || [],
					});
				});
			}
		} catch (error) {
			console.error("Error collecting data from Firecrawl:", error);
		}
	}

	// Collect data from Exa if enabled
	if (useExa) {
		try {
			const exaResults = await exaSearch(query, {
				numResults: maxResults,
				text: options.includeFullText ? true : false,
				highlights: true,
			});

			// Process and add Exa results
			if (exaResults && Array.isArray(exaResults.results)) {
				exaResults.results.forEach((result) => {
					// Check if this URL is already in sources
					if (!sources.some((source) => source.url === result.url)) {
						sources.push({
							url: result.url,
							title: result.title || "Unknown Title",
							content: options.includeFullText ? result.text : undefined,
							highlights: result.highlights || [],
							score: result.score,
						});
					}
				});
			}
		} catch (error) {
			console.error("Error collecting data from Exa:", error);
		}
	}

	// Generate insights and summary using Exa's answer function
	let insights: string[] = [];
	let summary = "";

	try {
		// Prepare content for insights generation
		const highlightText = sources
			.map(
				(source) =>
					`# ${source.title}\n${(source.highlights || []).join("\n")}\n`,
			)
			.join("\n\n");

		// Generate insights
		const insightPrompt = `Extract 5-7 key insights from this research on "${query}":\n\n${highlightText}`;
		const insightResponse = await exaAnswer(insightPrompt);

		if (insightResponse && insightResponse.answer) {
			// Split the answer into bullet points
			insights = insightResponse.answer
				.split(/\n+|\d+\.\s+/)
				.map((s) => s.trim())
				.filter((s) => s.length > 10);
		}

		// Generate summary
		const summaryPrompt = `Provide a comprehensive summary of research findings on "${query}" based on these sources:\n\n${highlightText}`;
		const summaryResponse = await exaAnswer(summaryPrompt);
		summary = summaryResponse?.answer || "";
	} catch (error) {
		console.error("Error generating insights and summary:", error);
		summary = `Research results for "${query}"`;
		insights = ["Could not generate insights automatically"];
	}

	return {
		query,
		sources: sources.slice(0, maxResults),
		insights,
		summary,
	};
};

/**
 * Performs categorical research focused on specific domain areas
 * @param query The research query
 * @param categories Categories to focus research on
 * @param options Additional research options
 * @returns Research results filtered by category
 */
export const categoryResearch = async (
	query: string,
	categories: ResearchCategory[] | string[],
	options: Omit<EnhancedDeepResearchOptions, "categories"> = { query },
): Promise<DeepResearchResult> => {
	return enhancedDeepResearch(query, {
		...options,
		categories: categories as string[],
	});
};

/**
 * Performs quick, surface-level research for rapid insights
 * @param query The research query
 * @param maxResults Maximum number of results to return
 * @returns Surface-level research results
 */
export const quickResearch = async (
	query: string,
	maxResults: number = 5,
): Promise<DeepResearchResult> => {
	return enhancedDeepResearch(query, {
		query,
		depth: ResearchDepth.SURFACE,
		maxUrls: maxResults,
		maxResults,
		useFirecrawl: false, // Quick research uses only Exa for faster results
	});
};

/**
 * Performs comprehensive deep research with full content extraction
 * @param query The research query
 * @param options Additional research options
 * @returns Comprehensive research results
 */
export const comprehensiveResearch = async (
	query: string,
	options: Partial<EnhancedDeepResearchOptions> = {},
): Promise<DeepResearchResult> => {
	return enhancedDeepResearch(query, {
		query,
		depth: ResearchDepth.COMPREHENSIVE,
		maxUrls: 20,
		maxResults: 20,
		includeFullText: true,
		timeLimit: 120, // 2 minutes
		...options,
		useExa: true,
		useFirecrawl: true,
	});
};
