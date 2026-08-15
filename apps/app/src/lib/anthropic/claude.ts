import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

/**
 * Call Claude 3.7 (or latest) with a system prompt and content, return summary text.
 * @param {object} params
 * @param {string} params.systemPrompt - The system prompt to use (e.g., NER_RESEARCH_PROMPT)
 * @param {string} params.content - The content to summarize/analyze
 * @returns {Promise<string>} Claude's summary/analysis
 */
export async function askClaude({
	systemPrompt,
	content,
}: { systemPrompt: string; content: string }): Promise<string> {
	const response = await generateText({
		model: anthropic("claude-4-sonnet-20250115"), // Updated to Claude 4 Sonnet
		system: systemPrompt,
		messages: [{ role: "user", content }],
	});
	return response.text;
}
