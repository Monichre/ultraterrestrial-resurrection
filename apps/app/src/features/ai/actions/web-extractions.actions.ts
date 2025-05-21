"use server";

import { z } from "zod";
import { scrapeWithFireCrawl } from "@/lib/firecrawl/firecrawl";
import { NER_RESEARCH_PROMPT } from "@/services/ai/prompts/ner-response-structure.prompt";

// Define the expected response schema
const SummaryResponseSchema = z.object({
	title: z.string().min(1, "Title cannot be empty"),
	summary: z.string().min(1, "Summary cannot be empty"),
	keyPoints: z
		.array(z.string().min(1, "Key point cannot be empty"))
		.min(3, "At least 3 key points required")
		.max(7, "Maximum 7 key points allowed"),
	siteName: z.string().optional(),
});

type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

// Improved URL validation schema
const urlSchema = z
	.string()
	.min(1, "URL cannot be empty")
	.transform((str) => {
		// Add protocol if missing
		if (!str.startsWith("http://") && !str.startsWith("https://")) {
			return `https://${str}`;
		}
		return str;
	})
	.refine((url) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}, "Invalid URL format");

export async function scrapeAndSummarize(
	url: string,
): Promise<SummaryResponse> {
	// Validate and normalize URL
	const parsedUrl = urlSchema.parse(url);

	// Use Firecrawl for extraction and summarization
	const result = await scrapeWithFireCrawl({
		url: parsedUrl,
		formats: ["markdown", "extract"],
		extract: {
			prompt: NER_RESEARCH_PROMPT,
		},
	});

	const extract = result.extract || {};
	const markdown = result.markdown || "";

	// Build the summary object
	const summaryObj = {
		title: extract.title || extract.pageTitle || "",
		summary: extract.summary || extract.content || markdown.slice(0, 500),
		keyPoints: extract.keyPoints || extract.bullets || [],
		siteName: extract.siteName || extract.domain || undefined,
	};

	// Validate output
	const validated = SummaryResponseSchema.safeParse(summaryObj);
	if (!validated.success) {
		throw new Error(
			"Failed to extract a valid summary from the webpage. Please try a different URL.",
		);
	}
	return validated.data;
}
