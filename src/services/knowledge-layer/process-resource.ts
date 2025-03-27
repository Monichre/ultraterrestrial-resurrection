import { askXataWithAi } from "@/db/xata";
import { getClaudeSummary } from "@/services/ai/claude/get-claude-response";
import { generateEmbeddings } from "@/services/ai/embeddings/embedding";
import { SUMMARIZE_PROMPT } from "@/services/ai/prompts/summarize.prompt";

import {
	scrapeWithFireCrawl,
	deepResearch,
	ResearchCategory,
	ResearchDepth,
} from "@/services/resource-scrape";
import { EXTERNAL_RESOURCES } from "@/utils";

export type ResourceProcessingOptions = {
	useDeepResearch?: boolean;
	researchDepth?: ResearchDepth;
	categories?: ResearchCategory[];
	recursiveLinks?: boolean;
	linkDepth?: number;
	extractionModel?: string;
	updateExisting?: boolean;
};

export const processResource = async (
	resourceUrl: string,
	options: ResourceProcessingOptions = {},
) => {
	const {
		useDeepResearch = false,
		researchDepth = ResearchDepth.MODERATE,
		categories = [
			ResearchCategory.EVENTS,
			ResearchCategory.SIGHTINGS,
			ResearchCategory.TESTIMONIES,
		],
		recursiveLinks = false,
		linkDepth = 1,
		extractionModel = "anthropic/claude-3-opus-20240229",
		updateExisting = false,
	} = options;

	const memorySeries = [];

	/*
  Steps:
  1. Instantiate Claude, 01-mini, Xata and Firecrawl Agents with proper prompt assignments 
  2. Scrape the resource
  3. Identify and extract key data from resource
  4. Summarize the content
  5. Map the data to the database schema
  6. Generate embeddings for the data
  7. Tap Xata to check for existing entries
  8. If entry exists, update the entry (if updateExisting is true)
  9. If entry does not exist, create a new entry
  10. Return the entry
  */

	let pageContent;

	// Use the new deep research capabilities if specified
	if (useDeepResearch) {
		console.log(`Starting deep research process for URL: ${resourceUrl}`);
		console.log(
			`Research depth: ${researchDepth}, Categories: ${categories.join(", ")}`,
		);

		const deepResearchResults = await deepResearch([resourceUrl], {
			depth: researchDepth,
			categories,
			recursiveLinks,
			linkDepth,
			extractionModel,
		});

		// Get the first result (we only passed one URL)
		pageContent = deepResearchResults[0];

		console.log(
			`Deep research complete with ${recursiveLinks ? "recursive crawling" : "single page analysis"}`,
		);
	} else {
		// Use the standard scrape method
		pageContent = await scrapeWithFireCrawl({
			url: resourceUrl,
			formats: ["markdown", "extract", "screenshot"],
			extract: {
				prompt: `Process this webpage by extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon`,
			},
		});
	}

	console.log(
		"🚀 ~ file: process-resource.ts:35 ~ processResource ~ pageContent:",
		pageContent,
	);

	// Extract the markdown content - handle both deep research and standard scrape formats
	const markdownContent = useDeepResearch
		? pageContent?.data?.pages?.[0]?.markdown ||
			pageContent?.data?.markdown ||
			""
		: pageContent?.data?.markdown || "";

	// Process with Claude for summarization
	const summary = await getClaudeSummary({
		system: SUMMARIZE_PROMPT,
		content: markdownContent,
		prompt: "Process this page data and summarize it accordingly",
	});

	console.log(
		"🚀 ~ file: process-resource.ts:40 ~ processResource ~ summary:",
		summary,
	);

	// Generate embeddings for vector search
	const embedding = await generateEmbeddings(summary);

	console.log(
		"🚀 ~ file: process-resource.ts:44 ~ processResource ~ embedding:",
		embedding,
	);

	// Check if similar data already exists in the database
	const doesItExist = await askXataWithAi(
		`Are there records in the database for any of the following information? ${summary}`,
	);

	console.log(
		"🚀 ~ file: process-resource.ts:51 ~ processResource ~ doesItExist:",
		doesItExist,
	);

	// TODO: Add database record creation or updating logic
	// This would involve parsing the structure of the data and mapping it to the database schema

	return {
		url: resourceUrl,
		summary,
		embedding,
		doesExist: doesItExist,
		rawData: pageContent,
		processingOptions: {
			useDeepResearch,
			researchDepth,
			categories,
			recursiveLinks,
			linkDepth,
		},
	};
};

/**
 * Process multiple resources from the external resources list
 * with optional filtering and category targeting
 */
export const processMultipleResources = async (
	options: ResourceProcessingOptions & {
		resourceCount?: number;
		resourceFilter?: (url: string) => boolean;
	} = {},
) => {
	const { resourceCount = 5, resourceFilter = () => true } = options;

	// Filter and limit resources
	const resourcesToProcess = EXTERNAL_RESOURCES.filter(resourceFilter).slice(
		0,
		resourceCount,
	);

	console.log(
		`Processing ${resourcesToProcess.length} resources with deep research enabled: ${options.useDeepResearch}`,
	);

	// Process each resource
	const results = await Promise.all(
		resourcesToProcess.map(async (url) => {
			try {
				return await processResource(url, options);
			} catch (error) {
				console.error(`Failed to process resource ${url}:`, error);
				return {
					url,
					error: error.message,
					status: "failed",
				};
			}
		}),
	);

	return {
		totalProcessed: results.length,
		successCount: results.filter((r) => !r.error).length,
		failureCount: results.filter((r) => r.error).length,
		results,
	};
};
