"use server";

import { askXataWithAi, tables as xataTables, xata } from "@/db/xata";
import type { z } from "zod";
import { fireCrawl } from "@/lib/firecrawl";

const tables = xataTables.map((table) => ({ table: table.name }));

// Types for our functions
type AskParams = {
	question: string;
	prompt?: string;
	table?: string;
};

type SearchParams = {
	query: string;
	id?: string | null;
	table?: string | null;
};

type ExtractParams = {
	prompt: string;
	urls: string[];
	schema?: z.ZodSchema;
	enableWebSearch?: boolean;
};

type DeepResearchParams = {
	query: string;
	maxDepth?: number;
	timeLimit?: number;
	maxUrls?: number;
	enableRealTimeUpdates?: boolean;
};

// Ask Database
export const askAIAction = async ({ question, prompt, table }: AskParams) => {
	try {
		const dbResponse = await askXataWithAi({ question, table, prompt });
		console.log("dbResponse: ", dbResponse);
		const plainData = JSON.parse(JSON.stringify(dbResponse));
		console.log("plainData: ", plainData);
		// const assistantResponse = await askDisclosureAgentToFindRelatedRecords( { subject: question, type: table } )
		// !TODO: figure out how to process the response
		const response = {
			...plainData,
			// assistantResponse
		};
		console.log("response: ", response);
		return response;
	} catch (error) {
		console.error("Error in askAIAction:", error);
		throw error;
	}
};

// Ask Assistant
export const askDatabase = async ({ question, prompt, table }: AskParams) => {
	const response = await askXataWithAi({ question, table, prompt });
	console.log("response: ", response);
	return response;
};

// closeModelMenu;

export const searchXataConnections = async ({
	query,
	id = null,
	table = null,
}: SearchParams) => {
	try {
		const response = await xata.search.all(query, {
			tables: table ? [{ table }] : tables,
			fuzziness: 0,
			prefix: "phrase",
		});

		console.log("🚀 ~ searchXataConnections ~ response:", response);

		return {
			success: true,
			searchResults: response.records,
		};
	} catch (error) {
		console.error("Error in searchXataConnections:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};

// Extract function using Firecrawl SDK directly
export const extract = async ({
	prompt,
	urls,
	schema,
	enableWebSearch = true,
}: ExtractParams) => {
	try {
		// Use Firecrawl's extract method directly
		const scrapeResult = await fireCrawl.extract(urls, {
			prompt,
			schema: schema ? schema : undefined,
			enableWebSearch,
		});

		if (!scrapeResult.success) {
			throw new Error(
				`Failed to extract data: ${scrapeResult.error || "Unknown error"}`,
			);
		}

		return {
			success: true,
			data: scrapeResult.data,
		};
	} catch (error) {
		console.error("Error in extract function:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};

// Deep research function using Firecrawl SDK directly
export const deepResearch = async ({
	query,
	maxDepth = 3,
	timeLimit = 180,
	maxUrls = 10,
	enableRealTimeUpdates = true,
}: DeepResearchParams) => {
	try {
		// Configure deep research parameters
		const params = {
			maxDepth,
			timeLimit,
			maxUrls,
		};

		// Activity handler for real-time updates (optional)
		const onActivity = enableRealTimeUpdates
			? (activity: any) => {
					console.log(`[${activity.type}] ${activity.message}`);
				}
			: undefined;

		// Run deep research
		const results = await fireCrawl.deepResearch(query, params, onActivity);

		return {
			success: true,
			finalAnalysis: results.data.finalAnalysis,
			sources: results.data.sources,
			data: results.data,
		};
	} catch (error) {
		console.error("Error in deepResearch function:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
