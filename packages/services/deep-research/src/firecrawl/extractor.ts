import { fireCrawl } from "./scraper";
import { ExtractOptions } from "../deep-research/src/types";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Enhanced extract function with optional FIRE-1 agent for advanced extraction.
 * Accepts Zod or JSON schema.
 * @param urls URLs to extract from
 * @param schema Zod schema or JSON schema
 * @param prompt Extraction prompt
 * @param agent Optional FIRE-1 agent config ({ model: 'FIRE-1' })
 * @returns Extracted structured data
 * @example
 * await enhancedExtractContent(['https://forum.com'], z.object({ ... }), 'Extract all comments', { model: 'FIRE-1' })
 */
export const enhancedExtractContent = async (
	urls: string[],
	schema: object | z.ZodType<any, any, any>,
	prompt: string,
	agent?: { model: "FIRE-1" },
) => {
	let jsonSchema: object;

	// Convert Zod schema to JSON schema if needed
	if (typeof (schema as any).safeParse === "function") {
		jsonSchema = zodToJsonSchema(schema as z.ZodType<any, any, any>);
	} else {
		jsonSchema = schema;
	}

	return await fireCrawl.extract(urls, {
		prompt,
		schema: jsonSchema,
		agent,
	});
};

/**
 * Extract structured data from web pages using LLM
 * @param urls URLs to extract data from
 * @param options Extract options
 * @returns Structured data extracted from pages
 */
export const extract = async (urls: string[], options: ExtractOptions) => {
	return await fireCrawl.extract(urls, options);
};

/**
 * Extract text content from web pages using specified prompts and formatting
 * @param urls URLs to extract text from
 * @param prompt Prompt guiding the extraction
 * @returns Extracted and formatted text content
 */
export const extractText = async (urls: string[], prompt: string) => {
	return await fireCrawl.extract(urls, {
		prompt,
		excludeTags: ["script", "style", "noscript"],
		onlyMainContent: true,
	});
};

/**
 * Extract structured data as JSON using a schema
 * @param urls URLs to extract data from
 * @param schema Schema definition (JSON schema or Zod schema)
 * @param prompt Prompt explaining what to extract
 * @returns Structured JSON data conforming to schema
 */
export const extractStructured = async (
	urls: string[],
	schema: object | z.ZodType<any, any, any>,
	prompt: string,
) => {
	let jsonSchema: object;

	// Convert Zod schema to JSON schema if needed
	if (typeof (schema as any).safeParse === "function") {
		jsonSchema = zodToJsonSchema(schema as z.ZodType<any, any, any>);
	} else {
		jsonSchema = schema;
	}

	return await fireCrawl.extract(urls, {
		prompt,
		schema: jsonSchema,
	});
};
