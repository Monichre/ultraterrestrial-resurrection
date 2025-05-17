import * as fs from "fs";
import axios from "axios";
import chalk from "chalk";
import { aiConfig } from "../config";
import { DataTypeConfig } from "../config";

/**
 * AI Response interface for content enhancement
 */
export interface AIResponse {
	enhanced: string;
	metadata?: {
		qualityScore?: number;
		qualityIssues?: string[];
		contentSummary?: string;
		recordCount?: number;
		schemaDescription?: any;
	};
}

/**
 * AI Analysis Results interface
 */
export interface AIAnalysisResult {
	summary: string;
	recommendations: string[];
	score: number;
	issues: string[];
	metadata: Record<string, any>;
}

/**
 * AI Assistant error class
 */
export class AIAssistantError extends Error {
	constructor(
		message: string,
		public cause?: Error,
	) {
		super(message);
		this.name = "AIAssistantError";
	}
}

/**
 * AI Assistant class for data enhancement and analysis
 */
class AIAssistant {
	private apiKey: string;
	private model: string;
	private endpoint: string;
	private maxTokens: number;

	constructor() {
		this.apiKey = aiConfig.apiKey;
		this.model = aiConfig.model;
		this.endpoint = aiConfig.endpoint;
		this.maxTokens = aiConfig.maxTokens;

		if (!this.apiKey) {
			console.warn(
				chalk.yellow(
					"⚠️  Warning: AI API key is not set. AI-assisted features will not work.",
				),
			);
		}
	}

	/**
	 * Enhance content with AI
	 * @param content The raw content to enhance
	 * @param dataType The type of data being processed
	 * @param options Additional options
	 * @returns Enhanced content and metadata
	 */
	async enhanceContent(
		content: string,
		dataType: keyof DataTypeConfig,
		options: {
			instructions?: string;
			format?: "json" | "markdown" | "text";
			extractMetadata?: boolean;
		} = {},
	): Promise<AIResponse> {
		if (!this.apiKey) {
			throw new Error("AI API key is not set. Cannot enhance content.");
		}

		try {
			// Default format is markdown
			const format = options.format || "markdown";
			const extractMetadata = options.extractMetadata !== false;

			// Build the system prompt for the AI
			const systemPrompt = this.buildSystemPrompt(
				dataType,
				format,
				options.instructions,
			);

			// Make the API request to OpenAI
			const response = await axios.post(
				this.endpoint,
				{
					model: this.model,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user", content },
					],
					max_tokens: this.maxTokens,
					temperature: 0.2,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.apiKey}`,
					},
				},
			);

			// Extract the response content
			const aiResponse = response.data.choices[0].message.content;

			// Handle different response formats
			if (format === "json") {
				// Parse JSON response
				try {
					const parsedResponse = JSON.parse(aiResponse);
					return {
						enhanced:
							parsedResponse.content || parsedResponse.enhanced || aiResponse,
						metadata: extractMetadata
							? {
									qualityScore:
										parsedResponse.qualityScore || parsedResponse.quality_score,
									qualityIssues:
										parsedResponse.qualityIssues ||
										parsedResponse.quality_issues ||
										[],
									contentSummary:
										parsedResponse.contentSummary ||
										parsedResponse.content_summary,
									recordCount:
										parsedResponse.recordCount || parsedResponse.record_count,
									schemaDescription:
										parsedResponse.schemaDescription || parsedResponse.schema,
								}
							: undefined,
					};
				} catch (error) {
					// If JSON parsing fails, return as text
					console.warn(
						chalk.yellow(
							"Failed to parse AI response as JSON. Returning as text.",
						),
					);
					return {
						enhanced: aiResponse,
						metadata: undefined,
					};
				}
			} else {
				// Return text or markdown response
				return {
					enhanced: aiResponse,
					metadata: undefined,
				};
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					`AI enhancement failed: ${error.message} - ${JSON.stringify(error.response?.data)}`,
				);
			} else {
				throw new Error(`AI enhancement failed: ${(error as Error).message}`);
			}
		}
	}

	/**
	 * Analyze a document with AI
	 * @param content The content to analyze
	 * @param dataType The type of data being processed
	 * @param options Additional options
	 * @returns Analysis results
	 */
	async analyzeDocument(
		content: string,
		dataType: keyof DataTypeConfig,
		options: {
			instructions?: string;
		} = {},
	): Promise<AIAnalysisResult> {
		if (!this.apiKey) {
			throw new Error("AI API key is not set. Cannot analyze document.");
		}

		try {
			const prompt = `
Please analyze this ${dataType} document and provide the following:
1. A brief summary of the content
2. A quality score (0-100)
3. Any quality issues or potential problems
4. Recommendations for improvement
5. Metadata extraction (dates, locations, people, organizations, etc.)

Return the analysis as a JSON object with these keys: 
- summary
- score
- issues (array)
- recommendations (array)
- metadata (object with extracted info)

${options.instructions || ""}

Document content:
${content}
`;

			// Make the API request to OpenAI
			const response = await axios.post(
				this.endpoint,
				{
					model: this.model,
					messages: [
						{
							role: "system",
							content:
								"You are an expert data analyst and content enhancer for UFO and extraterrestrial research. Analyze the document and provide structured feedback.",
						},
						{ role: "user", content: prompt },
					],
					max_tokens: this.maxTokens,
					temperature: 0.2,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.apiKey}`,
					},
				},
			);

			// Extract the response content
			const aiResponse = response.data.choices[0].message.content;

			try {
				// Parse the JSON response
				const parsedResponse = JSON.parse(aiResponse);
				return {
					summary: parsedResponse.summary || "",
					recommendations: parsedResponse.recommendations || [],
					score: parsedResponse.score || 0,
					issues: parsedResponse.issues || [],
					metadata: parsedResponse.metadata || {},
				};
			} catch (error) {
				throw new Error(
					`Failed to parse AI analysis: ${(error as Error).message}`,
				);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					`AI analysis failed: ${error.message} - ${JSON.stringify(error.response?.data)}`,
				);
			} else {
				throw new Error(`AI analysis failed: ${(error as Error).message}`);
			}
		}
	}

	/**
	 * Validate data against a schema using AI
	 * @param data The data to validate
	 * @param schema The schema to validate against
	 * @param options Additional options
	 * @returns Validation results
	 */
	async validateData(
		data: any,
		schema: any,
		options: {
			strictMode?: boolean;
			repairData?: boolean;
		} = {},
	): Promise<{
		isValid: boolean;
		validationErrors: string[];
		validationWarnings: string[];
		repairedData?: any;
	}> {
		if (!this.apiKey) {
			throw new Error("AI API key is not set. Cannot validate data.");
		}

		try {
			const strictMode = options.strictMode === true;
			const repairData = options.repairData === true;

			// Convert data and schema to strings if they're objects
			const dataStr =
				typeof data === "object" ? JSON.stringify(data, null, 2) : data;
			const schemaStr =
				typeof schema === "object" ? JSON.stringify(schema, null, 2) : schema;

			const prompt = `
Please validate the following data against the provided schema:

SCHEMA:
${schemaStr}

DATA:
${dataStr}

Rules:
- ${strictMode ? "Use strict validation (all fields must match exactly)" : "Use flexible validation (allow extra fields and minor type mismatches)"}
- Return validation results as a JSON object

${repairData ? "Also provide a repaired version of the data that conforms to the schema." : ""}

Return a JSON object with these properties:
- isValid: boolean
- validationErrors: string[]
- validationWarnings: string[]
${repairData ? "- repairedData: object (fixed data that conforms to the schema)" : ""}
`;

			// Make the API request to OpenAI
			const response = await axios.post(
				this.endpoint,
				{
					model: this.model,
					messages: [
						{
							role: "system",
							content:
								"You are a data validation expert with deep knowledge of JSON Schema. Validate the provided data against the schema and provide detailed feedback.",
						},
						{ role: "user", content: prompt },
					],
					max_tokens: this.maxTokens,
					temperature: 0.1,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.apiKey}`,
					},
				},
			);

			// Extract the response content
			const aiResponse = response.data.choices[0].message.content;

			try {
				// Parse the JSON response
				const parsedResponse = JSON.parse(aiResponse);
				return {
					isValid: parsedResponse.isValid || false,
					validationErrors: parsedResponse.validationErrors || [],
					validationWarnings: parsedResponse.validationWarnings || [],
					repairedData: repairData ? parsedResponse.repairedData : undefined,
				};
			} catch (error) {
				throw new Error(
					`Failed to parse AI validation: ${(error as Error).message}`,
				);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					`AI validation failed: ${error.message} - ${JSON.stringify(error.response?.data)}`,
				);
			} else {
				throw new Error(`AI validation failed: ${(error as Error).message}`);
			}
		}
	}

	/**
	 * Build a system prompt for the AI based on data type and format
	 * @param dataType The type of data being processed
	 * @param format The desired output format
	 * @param instructions Additional instructions
	 * @returns A system prompt for the AI
	 */
	private buildSystemPrompt(
		dataType: keyof DataTypeConfig,
		format: "json" | "markdown" | "text",
		instructions?: string,
	): string {
		// Base system prompt
		let prompt = `You are an expert assistant for enhancing and structuring ${dataType} data related to UFO and extraterrestrial research.`;

		// Add data type specific instructions
		switch (dataType) {
			case "testimonies":
				prompt += `
For testimonies, focus on:
- Structuring narratives clearly with proper formatting
- Identifying key details (dates, locations, witnesses)
- Preserving the original voice and perspective
- Highlighting unusual or significant observations
- Maintaining chronological flow`;
				break;

			case "events":
				prompt += `
For events, focus on:
- Ensuring clear chronology with precise dates and times
- Structuring location data consistently
- Identifying all involved witnesses and authorities
- Extracting objective descriptions separate from interpretations
- Categorizing the type of event`;
				break;

			case "personnel":
				prompt += `
For personnel records, focus on:
- Maintaining consistent biographical information
- Organizing career history chronologically
- Highlighting relevant qualifications and expertise
- Noting connections to significant events or testimonies
- Preserving privacy by avoiding unnecessary personal details`;
				break;

			case "organizations":
				prompt += `
For organization records, focus on:
- Clearly defining the organization's structure and purpose
- Identifying key personnel and their roles
- Documenting historical evolution and significant events
- Noting connections to other organizations or government entities
- Highlighting any special access or knowledge claims`;
				break;

			case "artifacts":
				prompt += `
For artifact records, focus on:
- Detailed physical descriptions with precise measurements
- Chain of custody information
- Scientific analysis results
- Provenance and discovery context
- Related witness testimonies or events`;
				break;
		}

		// Add format-specific instructions
		switch (format) {
			case "json":
				prompt += `
Output Format: JSON
- Return a JSON object with two main keys: "content" and "metadata"
- The "content" field should contain the enhanced content in plain text
- The "metadata" object should contain extracted information:
  - qualityScore: number (0-100)
  - qualityIssues: string[]
  - contentSummary: string
  - recordCount: number (typically 1 for individual records)
  - schemaDescription: object (field names and types)`;
				break;

			case "markdown":
				prompt += `
Output Format: Markdown
- Use proper Markdown formatting (headings, lists, emphasis)
- Include a YAML frontmatter section with metadata
- Structure content logically with appropriate sections
- Use tables where appropriate for structured data`;
				break;

			case "text":
				prompt += `
Output Format: Plain Text
- Focus on readability and clear structure
- Use consistent formatting for similar elements
- Preserve original line breaks where semantically meaningful
- Use simple ASCII formatting (dashes, asterisks) for emphasis`;
				break;
		}

		// Add custom instructions if provided
		if (instructions) {
			prompt += `\n\nAdditional Instructions:\n${instructions}`;
		}

		return prompt;
	}
}

// Export a singleton instance
export const aiAssistant = new AIAssistant();
export default aiAssistant;
