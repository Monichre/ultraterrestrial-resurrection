import Exa from "exa-js";
import { ExaSimilarParams, SearchResult } from "../firecrawl/types";

// Reference existing Exa client instance
import { exa } from "./client";

/**
 * Find web content similar to a reference URL
 * @param url Reference URL to find similar content
 * @param options Parameters for finding similar content
 * @returns Results similar to the reference URL
 * @example
 * const results = await findSimilar("https://example.com/article", { numResults: 5 });
 */
export const findSimilar = async (
	url: string,
	options: ExaSimilarParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.findSimilar(url, options);
};

/**
 * Find similar content and retrieve full contents in one call
 * @param url Reference URL to find similar content
 * @param options Parameters including content retrieval options
 * @returns Results with content details
 * @example
 * const results = await findSimilarAndContents("https://example.com/article", { text: true, highlights: true });
 */
export const findSimilarAndContents = async (
	url: string,
	options: ExaSimilarParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.findSimilarAndContents(url, options);
};

/**
 * Find similar content but exclude results from the same domain
 * @param url Reference URL to find similar content
 * @param options Parameters for finding similar content
 * @returns Results similar to the reference URL but from different domains
 * @example
 * const results = await findSimilarExcludingSource("https://example.com/article", { numResults: 10 });
 */
export const findSimilarExcludingSource = async (
	url: string,
	options: ExaSimilarParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.findSimilar(url, {
		...options,
		excludeSourceDomain: true,
	});
};

/**
 * Find similar content matching specific domains
 * @param url Reference URL to find similar content
 * @param domains Domains to include in the search
 * @param options Additional parameters for finding similar content
 * @returns Similar results from specified domains
 * @example
 * const results = await findSimilarInDomains("https://example.com/article", ["academic.edu", "research.org"]);
 */
export const findSimilarInDomains = async (
	url: string,
	domains: string[],
	options: ExaSimilarParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.findSimilar(url, {
		...options,
		includeDomains: domains,
	});
};
