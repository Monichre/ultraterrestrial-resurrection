import { SearchResult, Citation } from "../../../firecrawl/types";

/**
 * Extract and format text from search results
 * @param results Search results containing text content
 * @param maxLength Maximum length of extracted text
 * @returns Clean formatted text content
 */
export const extractText = (
	results: SearchResult[],
	maxLength: number = 5000,
): string => {
	let extractedText = "";

	for (const result of results) {
		if (!result.text) continue;

		const titleSection = result.title ? `# ${result.title}\n\n` : "";
		const urlSection = `Source: ${result.url}\n\n`;
		const contentSection =
			result.text.slice(0, maxLength / results.length) + "\n\n";

		extractedText += titleSection + contentSection + urlSection;

		if (extractedText.length >= maxLength) {
			extractedText = extractedText.slice(0, maxLength);
			break;
		}
	}

	return extractedText;
};

/**
 * Extract and format highlights from search results
 * @param results Search results containing highlights
 * @returns Formatted highlights with attribution
 */
export const extractHighlights = (results: SearchResult[]): string => {
	let extractedHighlights = "";

	for (const result of results) {
		if (!result.highlights || result.highlights.length === 0) continue;

		const titleSection = result.title ? `# ${result.title}\n\n` : "";
		const urlSection = `Source: ${result.url}\n\n`;

		let highlightsSection = "";
		result.highlights.forEach((highlight, index) => {
			highlightsSection += `- ${highlight}\n`;
		});
		highlightsSection += "\n";

		extractedHighlights += titleSection + highlightsSection + urlSection;
	}

	return extractedHighlights;
};

/**
 * Format citations for reference and attribution
 * @param citations Array of citations
 * @param includeText Whether to include full text in output
 * @returns Formatted citation text
 */
export const formatCitations = (
	citations: Citation[],
	includeText: boolean = false,
): string => {
	let formattedCitations = "# References\n\n";

	citations.forEach((citation, index) => {
		formattedCitations += `${index + 1}. **${citation.title || "Untitled"}**\n`;
		formattedCitations += `   URL: ${citation.url}\n`;

		if (citation.author) {
			formattedCitations += `   Author: ${citation.author}\n`;
		}

		if (citation.publishedDate) {
			formattedCitations += `   Published: ${citation.publishedDate}\n`;
		}

		if (includeText && citation.text) {
			formattedCitations += `\n   > ${citation.text.slice(0, 300).replace(/\n/g, "\n   > ")}...\n`;
		}

		formattedCitations += "\n";
	});

	return formattedCitations;
};

/**
 * Clean and normalize web content for processing
 * @param content Raw content to clean
 * @returns Cleaned and normalized content
 */
export const cleanContent = (content: string): string => {
	return content
		.replace(/\s+/g, " ") // Normalize whitespace
		.replace(/\n{3,}/g, "\n\n") // Normalize line breaks
		.replace(/(<([^>]+)>)/gi, "") // Remove HTML tags
		.trim();
};

/**
 * Create a structured research document from search results
 * @param query Original search query
 * @param results Search results
 * @returns Structured markdown document
 */
export const createResearchDocument = (
	query: string,
	results: SearchResult[],
): string => {
	const now = new Date().toISOString().split("T")[0];

	let document = `# Research: ${query}\n\n`;
	document += `Date: ${now}\n\n`;
	document += `## Summary\n\n`;

	// Add top 3 results as summary
	const topResults = results.slice(0, 3);
	topResults.forEach((result) => {
		if (result.highlights && result.highlights.length > 0) {
			document += `### ${result.title || "Untitled"}\n\n`;
			document += result.highlights[0] + "\n\n";
			document += `Source: [${result.url}](${result.url})\n\n`;
		}
	});

	// Add detailed findings
	document += `## Detailed Findings\n\n`;
	results.forEach((result, i) => {
		document += `### ${i + 1}. ${result.title || "Untitled"}\n\n`;

		if (result.highlights && result.highlights.length > 0) {
			document += `**Key Points:**\n\n`;
			result.highlights.forEach((highlight) => {
				document += `- ${highlight}\n`;
			});
			document += "\n";
		}

		if (result.text) {
			document += `**Extract:**\n\n`;
			document += result.text.slice(0, 500) + "...\n\n";
		}

		document += `Source: [${result.url}](${result.url})\n\n`;
		if (result.publishedDate) {
			document += `Published: ${result.publishedDate}\n\n`;
		}
		if (result.author) {
			document += `Author: ${result.author}\n\n`;
		}
	});

	return document;
};
