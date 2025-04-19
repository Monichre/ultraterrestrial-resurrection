import axios from "axios";
import chalk from "chalk";
import { aiConfig } from "../config";
import type { DataTypeConfig } from "../config";

// Add missing enum definition
export enum AnalysisType {
	QUALITY = "quality",
	ENTITY_EXTRACTION = "entity_extraction",
	ENHANCEMENT = "enhancement",
	SUMMARY = "summary",
	SCHEMA_VALIDATION = "schema_validation",
	GENERAL = "general",
}

/**
 * Analysis options
 */
export interface AnalysisOptions {
	maxTokens?: number;
	temperature?: number;
	model?: string;
	retries?: number;
}

/**
 * Analysis result interface
 */
export interface AnalysisResult {
	suggestions: string[];
	summary?: string;
	rawResponse?: any;
	quality?: {
		score: number;
		issues: string[];
		recommendations: string[];
	};
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
	 * Analyze content to get suggestions and improvements
	 * @param content The content to analyze
	 * @param dataType The type of data being analyzed
	 * @param options Analysis options
	 * @returns Analysis result
	 */
	async analyzeContent(
		content: string,
		dataType: keyof DataTypeConfig,
		options: AnalysisOptions = {},
	): Promise<AnalysisResult> {
		if (!this.apiKey) {
			throw new AIAssistantError(
				"AI API key is not set. Please set the OPENAI_API_KEY environment variable.",
			);
		}

		try {
			const prompt = this.generatePrompt(
				content,
				dataType,
				AnalysisType.GENERAL,
			);

			// Setup API request parameters
			const requestOptions = {
				model: options.model || this.model,
				messages: [
					{
						role: "system",
						content:
							"You are an expert data analyzer assisting with data processing and enhancement.",
					},
					{ role: "user", content: prompt },
				],
				max_tokens: options.maxTokens || this.maxTokens,
				temperature: options.temperature || 0.3,
			};

			const response = await this.makeRequest(
				requestOptions,
				options.retries || 2,
			);
			return this.parseResponse(response, AnalysisType.GENERAL);
		} catch (error) {
			throw new AIAssistantError(
				`Failed to analyze content: ${(error as Error).message}`,
				error as Error,
			);
		}
	}

	/**
	 * Generate a summary of content
	 * @param content The content to summarize
	 * @param dataType The type of data
	 * @param options Analysis options
	 * @returns A summary of the content
	 */
	async generateSummary(
		content: string,
		dataType: keyof DataTypeConfig,
		options: AnalysisOptions = {},
	): Promise<string> {
		try {
			const analysis = await this.analyzeContent(content, dataType, {
				...options,
				temperature: 0.2,
			});

			return analysis.summary || "";
		} catch (error) {
			throw new AIAssistantError(
				`Failed to generate summary: ${(error as Error).message}`,
				error as Error,
			);
		}
	}

	/**
	 * Generate a prompt based on analysis type
	 * @param content The content to analyze
	 * @param dataType The type of data
	 * @param analysisType The type of analysis to perform
	 * @returns A prompt for the AI
	 */
	private generatePrompt(
		content: string,
		dataType: keyof DataTypeConfig,
		analysisType: AnalysisType,
	): string {
		// Base prompt for all analysis types
		let prompt = `You are an expert data analyst specializing in UFO and paranormal research data. I need you to analyze the following ${dataType} data:\n\n${content}\n\n`;

		// Add specific instructions based on analysis type
		switch (analysisType) {
			case AnalysisType.QUALITY:
				prompt += `Please evaluate the quality of this data by examining completeness, accuracy, and consistency. 
                  Provide a quality score from 0-100, list all issues found, and recommend improvements. 
                  Format your response as a JSON object with the following structure:
                  {
                    "score": <number>,
                    "issues": ["issue1", "issue2", ...],
                    "recommendations": ["recommendation1", "recommendation2", ...]
                  }`;
				break;

			case AnalysisType.ENTITY_EXTRACTION:
				prompt += `Extract all entities from this content, including people, organizations, locations, events, and artifacts.
                  For each entity, provide its type, name, and a confidence score (0-1).
                  Format your response as a JSON array with the following structure:
                  [
                    {
                      "type": "person|organization|location|event|artifact",
                      "name": "<entity name>",
                      "confidence": <number between 0-1>,
                      "details": {<any additional information>}
                    },
                    ...
                  ]`;
				break;

			case AnalysisType.ENHANCEMENT:
				prompt += `Analyze this ${dataType} data and suggest enhancements to improve its quality, completeness, and consistency.
                  If appropriate, provide an enhanced version of the content.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "enhancements": {
                      <relevant enhancement fields based on data type>
                    }
                  }`;
				break;

			case AnalysisType.SUMMARY:
				prompt += `Generate a concise summary of this ${dataType} data, highlighting key points and insights.
                  Keep the summary to 3-5 sentences.
                  Format your response as a plain text summary.`;
				break;

			case AnalysisType.SCHEMA_VALIDATION:
				prompt += `Validate whether this data conforms to the expected schema for ${dataType}.
                  Identify any missing required fields or inconsistencies.
                  Format your response as a JSON object with the following structure:
                  {
                    "isValid": <boolean>,
                    "missingFields": ["field1", "field2", ...],
                    "inconsistencies": ["inconsistency1", "inconsistency2", ...]
                  }`;
				break;

			case AnalysisType.GENERAL:
			default:
				prompt += `Provide general analysis and insights about this data.
                  Suggest possible improvements or enhancements.
                  Format your response as a JSON object with the following structure:
                  {
                    "suggestions": ["suggestion1", "suggestion2", ...],
                    "insights": ["insight1", "insight2", ...]
                  }`;
		}

		return prompt;
	}

	/**
	 * Make a request to the AI API
	 * @param requestOptions Request options
	 * @param retries Number of retries
	 * @returns API response
	 */
	private async makeRequest(requestOptions: any, retries = 2): Promise<any> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= retries; attempt++) {
			try {
				// Add a delay for retries
				if (attempt > 0) {
					const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
					await new Promise((resolve) => setTimeout(resolve, delay));
					console.log(chalk.yellow(`Retry attempt ${attempt}/${retries}...`));
				}

				const response = await axios.post(this.endpoint, requestOptions, {
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						"Content-Type": "application/json",
					},
				});

				return response.data;
			} catch (error) {
				lastError = error as Error;
				console.error(
					chalk.red(`API request failed: ${(error as Error).message}`),
				);
			}
		}

		throw new AIAssistantError(
			`Failed after ${retries} retries: ${lastError?.message || "Unknown error"}`,
			lastError || undefined,
		);
	}

	/**
	 * Parse the response from the AI API
	 * @param response The API response
	 * @param analysisType The type of analysis
	 * @returns Parsed analysis result
	 */
	private parseResponse(
		response: any,
		analysisType: AnalysisType,
	): AnalysisResult {
		try {
			const messageContent = response.choices?.[0]?.message?.content || "";
			const analysis: AnalysisResult = {
				suggestions: [],
				rawResponse: response,
			};

			if (analysisType === AnalysisType.QUALITY) {
				try {
					// Try to extract JSON from response
					const match = messageContent.match(/\{[\s\S]*\}/);
					const jsonStr = match ? match[0] : "";
					const qualityData = JSON.parse(jsonStr);

					analysis.quality = {
						score: qualityData.score || 0,
						issues: qualityData.issues || [],
						recommendations: qualityData.recommendations || [],
					};
				} catch (error) {
					console.warn(chalk.yellow("Failed to parse quality data as JSON"));
				}
			} else if (analysisType === AnalysisType.SUMMARY) {
				analysis.summary = messageContent.trim();
			} else {
				// For other types, try to parse suggestions
				try {
					// Try to extract JSON from response
					const match = messageContent.match(/\{[\s\S]*\}/);
					const jsonStr = match ? match[0] : "";
					const data = JSON.parse(jsonStr);

					analysis.suggestions = data.suggestions || [];

					// Extract summary if available
					if (messageContent.includes("SUMMARY:")) {
						const summaryMatch = messageContent.match(
							/SUMMARY:([\s\S]*?)(?:SUGGESTIONS:|$)/,
						);
						analysis.summary = summaryMatch ? summaryMatch[1].trim() : "";
					}
				} catch (error) {
					console.warn(chalk.yellow("Failed to parse response as JSON"));

					// Fallback: try to extract suggestions from text
					const suggestionMatches = messageContent.match(/- (.*)/g);
					if (suggestionMatches) {
						analysis.suggestions = suggestionMatches.map((match) =>
							match.substring(2).trim(),
						);
					}

					// Fallback: try to extract summary
					if (messageContent.includes("SUMMARY:")) {
						const summaryMatch = messageContent.match(
							/SUMMARY:([\s\S]*?)(?:SUGGESTIONS:|$)/,
						);
						analysis.summary = summaryMatch ? summaryMatch[1].trim() : "";
					}
				}
			}

			return analysis;
		} catch (error) {
			console.error(
				chalk.red(`Error parsing response: ${(error as Error).message}`),
			);
			return {
				suggestions: [],
				summary: "",
				rawResponse: response,
			};
		}
	}
}

// Export a singleton instance
export const aiAssistant = new AIAssistant();
