import { ExaContentsParams, SearchResult } from "../firecrawl/types";
import { exa } from "./client";

/**
 * Get content for one or more URLs
 * @param urls Single URL or array of URLs
 * @param options Content retrieval options
 * @returns Content from the specified URLs
 * @example
 * const content = await getContents("https://example.com/article");
 */
export const getContents = async (
	urls: string | string[],
	options: ExaContentsParams = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.getContents(urls, options);
};

/**
 * Get text content only from specified URLs
 * @param urls Single URL or array of URLs
 * @param maxCharacters Maximum number of characters to return per URL
 * @returns Text content from the specified URLs
 * @example
 * const content = await getTextContent("https://example.com/article", 1000);
 */
export const getTextContent = async (
	urls: string | string[],
	maxCharacters?: number,
): Promise<{ results: SearchResult[] }> => {
	return await exa.getContents(urls, {
		text: maxCharacters ? { maxCharacters } : true,
	});
};

/**
 * Get highlights from URLs based on a query
 * @param urls Single URL or array of URLs
 * @param query Query to find relevant highlights
 * @param options Additional highlight options
 * @returns Relevant highlights from the content
 * @example
 * const highlights = await getHighlights("https://example.com/article", "quantum computing");
 */
export const getHighlights = async (
	urls: string | string[],
	query: string,
	options: {
		numSentences?: number;
		highlightsPerUrl?: number;
	} = {},
): Promise<{ results: SearchResult[] }> => {
	return await exa.getContents(urls, {
		highlights: {
			query,
			...options,
		},
	});
};

/**
 * Get structured summary of content based on a query
 * @param urls Single URL or array of URLs
 * @param query Query explaining what to summarize
 * @param schema Optional JSON schema for structured output
 * @returns Summary of the content
 * @example
 * const summary = await getSummary("https://example.com/company", "Extract company information");
 */
export const getSummary = async (
	urls: string | string[],
	query: string,
	schema?: object,
): Promise<{ results: SearchResult[] }> => {
	return await exa.getContents(urls, {
		summary: {
			query,
			...(schema ? { schema } : {}),
		},
	});
};

/**
 * Get comprehensive content with text, highlights, and summary
 * @param urls Single URL or array of URLs
 * @param query Query for highlights and summary
 * @returns Comprehensive content details
 * @example
 * const fullContent = await getFullContent("https://example.com/article", "Key innovations");
 */
export const getFullContent = async (
	urls: string | string[],
	query: string,
): Promise<{ results: SearchResult[] }> => {
	return await exa.getContents(urls, {
		text: true,
		highlights: {
			query,
			numSentences: 2,
			highlightsPerUrl: 5,
		},
		summary: {
			query,
		},
	});
};
