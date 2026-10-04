import { SearchResult } from "../../../firecrawl/types";
import { answer } from "../../../exa";
import {
	extractText,
	extractHighlights,
	cleanContent,
} from "./content-processor";

/**
 * Generate a concise summary of search results
 * @param results Search results to summarize
 * @param prompt Optional custom summary prompt
 * @returns Generated summary text
 */
export const summarizeResults = async (
	results: SearchResult[],
	prompt?: string,
): Promise<string> => {
	// Extract text or highlights from search results
	let content = "";

	for (const result of results) {
		if (result.text) {
			content += `# ${result.title || "Source"}\n\n${cleanContent(result.text.slice(0, 1000))}\n\n`;
		} else if (result.highlights && result.highlights.length > 0) {
			content += `# ${result.title || "Source"}\n\n${result.highlights.join("\n")}\n\n`;
		}

		if (content.length > 8000) break; // Limit content to process
	}

	if (content.length === 0) {
		return "No content available to summarize.";
	}

	// Create a summarization prompt
	const summaryPrompt =
		prompt ||
		`Provide a concise summary of the following information, highlighting key points and insights:`;

	// Generate summary using Exa's answer functionality
	try {
		const summary = await answer(`${summaryPrompt}\n\n${content}`);
		return summary.answer;
	} catch (error) {
		console.error("Error generating summary:", error);
		return "Error generating summary. Please try again with less content or a different prompt.";
	}
};

/**
 * Extract key insights from search results
 * @param results Search results to analyze
 * @param numInsights Number of insights to extract
 * @returns Array of key insights
 */
export const extractKeyInsights = async (
	results: SearchResult[],
	numInsights: number = 5,
): Promise<string[]> => {
	const content = extractText(results, 10000);

	if (content.length === 0) {
		return ["No content available to extract insights."];
	}

	const insightPrompt = `Identify the ${numInsights} most important insights from the following content. Format each insight as a single sentence.`;

	try {
		const insights = await answer(`${insightPrompt}\n\n${content}`);
		// Split the answer into individual insights
		return insights.answer
			.split(/\d+\.|\n-|\n\*/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
			.slice(0, numInsights);
	} catch (error) {
		console.error("Error extracting key insights:", error);
		return ["Error extracting insights. Please try with less content."];
	}
};

/**
 * Create a knowledge graph summary from content
 * @param results Search results to analyze
 * @returns JSON object representing entities and relationships
 */
export const createKnowledgeGraph = async (
	results: SearchResult[],
): Promise<{
	entities: string[];
	relationships: Array<{ from: string; to: string; type: string }>;
}> => {
	const content = extractHighlights(results) || extractText(results, 5000);

	if (content.length === 0) {
		return { entities: [], relationships: [] };
	}

	const graphPrompt = `
    Analyze the following content and identify key entities and their relationships.
    Return your answer as a JSON object with two properties:
    1. "entities": an array of strings naming important entities
    2. "relationships": an array of objects, each with "from", "to", and "type" properties
    Only include significant, meaningful relationships. Limit to 15 entities maximum.
  `;

	try {
		const graphResult = await answer(`${graphPrompt}\n\n${content}`);

		// Extract JSON from the answer text
		const jsonMatch =
			graphResult.answer.match(/```json\n([\s\S]*?)\n```/) ||
			graphResult.answer.match(/\{[\s\S]*\}/);

		if (jsonMatch) {
			const graphData = JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ""));
			return {
				entities: graphData.entities || [],
				relationships: graphData.relationships || [],
			};
		} else {
			throw new Error("Could not parse knowledge graph JSON");
		}
	} catch (error) {
		console.error("Error creating knowledge graph:", error);
		return { entities: [], relationships: [] };
	}
};
