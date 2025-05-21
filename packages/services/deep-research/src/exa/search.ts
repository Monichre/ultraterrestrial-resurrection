import { ExaSearchParams, SearchResult } from "../deep-research/src/types";
import { exa } from "./client";

/**
 * Perform a semantic search using Exa API
 * @param query The search query
 * @param options Search parameters and options
 * @returns Search results
 * @example
 * const results = await search("latest advancements in quantum computing", { numResults: 10 });
 */
export const search = async (
	query: string,
	options: ExaSearchParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.search(query, options);
};

/**
 * Perform a search and retrieve content in a single call
 * @param query The search query
 * @param options Search parameters including content retrieval options
 * @returns Search results with content
 * @example
 * const results = await searchAndContents("AI in healthcare", { text: true, highlights: true });
 */
export const searchAndContents = async (
	query: string,
	options: ExaSearchParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.searchAndContents(query, options);
};

/**
 * Perform a neural search optimized for concept matching
 * @param query The search query
 * @param options Search parameters
 * @returns Search results
 * @example
 * const results = await neuralSearch("ethical implications of artificial intelligence", { numResults: 5 });
 */
export const neuralSearch = async (
	query: string,
	options: ExaSearchParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.search(query, {
		...options,
		type: "neural",
	});
};

/**
 * Perform a keyword search optimized for exact matches
 * @param query The search query
 * @param options Search parameters
 * @returns Search results
 * @example
 * const results = await keywordSearch("GPT-4 technical specifications", { numResults: 3 });
 */
export const keywordSearch = async (
	query: string,
	options: ExaSearchParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.search(query, {
		...options,
		type: "keyword",
	});
};

/**
 * Search for recent content within a specified date range
 * @param query The search query
 * @param days Number of days back to search
 * @param options Additional search parameters
 * @returns Search results filtered by date
 * @example
 * const results = await recentSearch("COVID-19 research", 30, { numResults: 7 });
 */
export const recentSearch = async (
	query: string,
	days: number = 30,
	options: ExaSearchParams = {},
): Promise<{ results: SearchResult[] }> => {
	// Calculate date range from days
	const endDate = new Date().toISOString().split("T")[0]; // Today
	const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
		.toISOString()
		.split("T")[0];

	return await exa.search(query, {
		...options,
		startPublishedDate: startDate,
		endPublishedDate: endDate,
	});
};
