import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { fireCrawl } from "./firecrawl.client";
import type { ExtractOptions as FireCrawlExtractOptions } from "./types";

// Define the type for the fireCrawl client
export interface FireCrawlClient {
	extract: (urls: string[], options: ExtractOptions) => Promise<any>;
}

/**
 * Generic type for schema input that can be either a Zod schema or JSON schema
 */
export type SchemaInput<T> = z.ZodType<T> | object;

/**
 * Options for extraction operations
 */
export interface ExtractOptions {
	/** Prompt guiding the extraction */
	prompt: string;
	/** Schema for structured data (optional) */
	schema?: object;
	/** Tags to exclude from extraction */
	excludeTags?: string[];
	/** Only extract main content */
	onlyMainContent?: boolean;
	/** Optional AI agent configuration */
	agent?: { model: "FIRE-1" };
}

/**
 * Unified extraction function with multiple capabilities
 * @param urls URLs to extract from
 * @param options Extraction options or prompt string
 * @param schema Optional schema when using prompt string
 * @param noAgent Optional flag to disable the default FIRE-1 agent
 * @returns Extracted content according to options
 *
 * @example Simple text extraction:
 * await extract(['https://example.com'], 'Extract the main article text')
 *
 * @example Structured data extraction:
 * await extract(
 *   ['https://forum.com'],
 *   'Extract all comments',
 *   z.object({ comments: z.array(z.string()) })
 * )
 *
 * @example Without AI agent:
 * await extract(
 *   ['https://data.com'],
 *   'Extract financial data',
 *   z.object({ data: z.array(z.number()) }),
 *   true
 * )
 *
 * @example With full options object:
 * await extract(['https://example.com'], {
 *   prompt: 'Extract article content',
 *   excludeTags: ['script', 'style'],
 *   onlyMainContent: true
 * })
 */
export async function extract<T = Record<string, unknown>>(
	urls: string[],
	options: ExtractOptions | string,
	schema?: SchemaInput<T>,
	noAgent?: boolean,
): Promise<T> {
	if (typeof options === "string") {
		return schema
			? extractWithSchema(urls, options, schema, noAgent)
			: (extractText(urls, options) as T);
	}

	// Add FIRE-1 agent by default unless explicitly disabled via options or noAgent flag
	const config = {
		...options,
		agent: options.agent || (noAgent ? undefined : { model: "FIRE-1" }),
	};

	return fireCrawl.extract(urls, config) as Promise<T>;
}

/**
 * Internal helper: Extract text content from web pages
 */
async function extractText(urls: string[], prompt: string): Promise<string> {
	return fireCrawl.extract(urls, {
		prompt,
		excludeTags: ["script", "style", "noscript"],
		onlyMainContent: true,
	});
}

/**
 * Internal helper: Extract structured data with schema
 */
async function extractWithSchema<T>(
	urls: string[],
	prompt: string,
	schema: SchemaInput<T>,
	noAgent?: boolean,
): Promise<T> {
	const jsonSchema =
		typeof (schema as z.ZodType<T>).safeParse === "function"
			? zodToJsonSchema(schema as z.ZodType<T>)
			: schema;

	const options: ExtractOptions = {
		prompt,
		schema: jsonSchema as object,
		// Add FIRE-1 agent by default unless explicitly disabled
		...(noAgent ? {} : { agent: { model: "FIRE-1" } }),
	};

	return fireCrawl.extract(urls, options);
}

/**
 * @deprecated Use the unified `extract()` function instead
 */
export const enhancedExtractContent = async <T>(
	urls: string[],
	schema: SchemaInput<T>,
	prompt: string,
	agent?: { model: "FIRE-1" },
): Promise<T> => {
	return extract(urls, prompt, schema, agent);
};

/**
 * @deprecated Use the unified `extract()` function instead
 */
export const extractStructured = async <T>(
	urls: string[],
	schema: SchemaInput<T>,
	prompt: string,
): Promise<T> => {
	return extract(urls, prompt, schema);
};
