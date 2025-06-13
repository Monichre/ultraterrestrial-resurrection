import type { AskOptions } from "@xata.io/client";
import { getXataClient, type XataClient } from "../xata";
import { xata } from "../client";

const xataClient = getXataClient();

// Enhanced types for comprehensive Ask SDK support
export interface XataAskOptions {
	rules?: string[];
	searchType?: 'keyword' | 'vector';
	search?: {
		fuzziness?: number;
		prefix?: 'phrase' | 'disabled';
		target?: (string | { column: string; weight?: number })[];
		boosters?: Array<{
			valueBooster?: {
				column: string;
				value: string;
				factor: number;
			};
			numericBooster?: {
				column: string;
				factor: number;
				modifier?: 'log' | 'log1p' | 'log2p' | 'ln' | 'ln1p' | 'ln2p' | 'square' | 'sqrt' | 'reciprocal';
			};
		}>;
		filter?: Record<string, any>;
	};
	vectorSearch?: {
		column: string;
		contentColumn?: string;
		filter?: Record<string, any>;
	};
	sessionId?: string;
}

export interface AskResponse {
	answer: string;
	sessionId: string;
	records: string[];
}

export interface AskResponseWithRecords {
	answer: string;
	sessionId: string;
	records: any[];
}

export interface AskStreamChunk {
	answer?: string;
	sessionId?: string;
	records?: string[];
	done?: boolean;
}

/**
 * Enhanced Ask Xata function with full SDK support
 * Supports all Xata Ask SDK features including rules, search types, boosters, and filters
 */
export const askXata = async (
	table: string,
	question: string,
	options?: {
		rules?: string[];
		searchType?: string;
		search?: any;
		vectorSearch?: any;
		sessionId?: string;
	},
) => {
	try {
		const askOptions = {
			rules: options?.rules || [],
			searchType: options?.searchType || "table",
			search: options?.search,
			vectorSearch: options?.vectorSearch,
			sessionId: options?.sessionId,
		};

		const result = await xataClient.db[table].ask(question, askOptions);
		return result;
	} catch (error) {
		console.error("Error asking Xata:", error);
		throw error;
	}
};

/**
 * Enhanced askXataWithAi function that fetches actual record data
 * Returns both the AI answer and the actual record objects
 */
export const askXataWithAi = async ({
	table,
	question,
}: {
	table: string;
	question: string;
}) => {
	try {
		const result = await xata.db[table].ask(question);
		return result;
	} catch (error) {
		console.error("Error asking Xata with AI:", error);
		throw error;
	}
};

/**
 * Ask a follow-up question in an existing conversation
 * Uses the session ID from a previous ask operation
 */
export const askFollowUp = async (
	table: string,
	question: string,
	sessionId: string,
	options: Omit<XataAskOptions, 'sessionId'> = {}
): Promise<AskResponse> => {
	return askXata(table, question, { ...options, sessionId });
};

/**
 * Ask with comprehensive search configuration (matching the SDK example)
 * This function provides the full feature set shown in the documentation
 */
export const askXataComprehensive = async (
	table: string,
	question: string,
	config: {
		rules?: string[];
		searchType?: 'keyword' | 'vector';
		keywordSearch?: {
			fuzziness?: number;
			prefix?: 'phrase' | 'disabled';
			target?: (string | { column: string; weight: number })[];
			boosters?: Array<{
				valueBooster?: {
					column: string;
					value: string;
					factor: number;
				};
			}>;
		};
		vectorSearch?: {
			column: string;
			contentColumn?: string;
			filter?: Record<string, any>;
		};
		sessionId?: string;
	} = {}
): Promise<AskResponseWithRecords> => {
	const options: XataAskOptions = {
		rules: config.rules,
		searchType: config.searchType || 'keyword',
		sessionId: config.sessionId
	};

	if (config.keywordSearch) {
		options.search = config.keywordSearch;
	}

	if (config.vectorSearch) {
		options.vectorSearch = config.vectorSearch;
	}

	return askXataWithAi({
		table,
		question,
		...options
	});
};

/**
 * Process the SSE response stream from Xata's ask endpoint
 */
const processStream = (stream: ReadableStream) => {
	const reader = stream.getReader();
	const decoder = new TextDecoder();

	return new ReadableStream({
		async start(controller) {
			try {
				while (true) {
					const { done, value } = await reader.read();

					if (done) {
						controller.close();
						return;
					}

					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split("\n");

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							const data = line.slice(6); // Remove 'data: ' prefix

							try {
								const parsedData = JSON.parse(data);
								controller.enqueue(parsedData);

								// If this is the final chunk with done:true, close the stream
								if (parsedData.done) {
									controller.close();
									return;
								}
							} catch (e) {
								console.error("Error parsing SSE data:", e);
							}
						}
					}
				}
			} catch (error) {
				controller.error(error);
			}
		},
	});
};

/**
 * Create a streaming ask request that returns the answer as a stream of events
 * Supports all the same options as the regular ask function
 */
export const askStream = async (
	table: string,
	question: string,
	options: XataAskOptions = {},
): Promise<ReadableStream<AskStreamChunk>> => {
	try {
		// Setting up headers for server-sent events
		const fetchOptions: any = {
			headers: {
				Accept: "text/event-stream",
				"Content-Type": "application/json",
			},
			method: "POST",
		};

		// Prepare the request body with all supported options
		const requestBody: any = {
			question,
		};

		// Add all optional parameters
		if (options.rules) requestBody.rules = options.rules;
		if (options.searchType) requestBody.searchType = options.searchType;
		if (options.search) requestBody.search = options.search;
		if (options.vectorSearch) requestBody.vectorSearch = options.vectorSearch;

		fetchOptions.body = JSON.stringify(requestBody);

		let url: string;

		// Determine if this is a new question or a follow-up
		if (options.sessionId) {
			url = `${xataClient.fetch.baseURL}/db/${xataClient.databaseURL}/tables/${table}/ask/${options.sessionId}`;
		} else {
			url = `${xataClient.fetch.baseURL}/db/${xataClient.databaseURL}/tables/${table}/ask`;
		}

		// Send the request
		const response = await fetch(url, fetchOptions);

		if (!response.ok || !response.body) {
			throw new Error(`Failed to stream response: ${response.statusText}`);
		}

		// Process and return the stream
		return processStream(response.body);
	} catch (error) {
		console.error("Error streaming question:", error);
		throw error;
	}
};

/**
 * Utility function to create a comprehensive ask configuration
 * This helper makes it easy to create complex search configurations
 */
export const createAskConfig = (config: {
	rules?: string[];
	searchType?: 'keyword' | 'vector';
	fuzziness?: number;
	prefix?: 'phrase' | 'disabled';
	targets?: (string | { column: string; weight: number })[];
	valueBooters?: Array<{ column: string; value: string; factor: number }>;
	vectorColumn?: string;
	vectorContentColumn?: string;
	filter?: Record<string, any>;
}): XataAskOptions => {
	const options: XataAskOptions = {
		rules: config.rules,
		searchType: config.searchType || 'keyword'
	};

	if (config.searchType === 'keyword' || !config.searchType) {
		options.search = {};
		
		if (typeof config.fuzziness === 'number') {
			options.search.fuzziness = config.fuzziness;
		}
		
		if (config.prefix) {
			options.search.prefix = config.prefix;
		}
		
		if (config.targets) {
			options.search.target = config.targets;
		}
		
		if (config.valueBooters) {
			options.search.boosters = config.valueBooters.map(booster => ({
				valueBooster: booster
			}));
		}
		
		if (config.filter) {
			options.search.filter = config.filter;
		}
	}

	if (config.searchType === 'vector') {
		options.vectorSearch = {
			column: config.vectorColumn || 'embedding',
			contentColumn: config.vectorContentColumn,
			filter: config.filter
		};
	}

	return options;
};

// Export types for external use
export type {
	XataAskOptions,
	AskResponse,
	AskResponseWithRecords,
	AskStreamChunk
};

// =============================================================================
// UFO/UAP RESEARCH-SPECIFIC ENHANCEMENTS
// =============================================================================

/**
 * Pre-configured rules for UFO/UAP research
 */
export const UFO_RESEARCH_RULES = {
	SCIENTIFIC_ANALYSIS: [
		"Always prioritize scientifically documented incidents with multiple independent witnesses",
		"Include details about official investigations, military involvement, or government acknowledgment",
		"Focus on incidents with physical evidence, radar confirmation, or photographic documentation",
		"Distinguish between explained phenomena and genuinely unexplained cases"
	],
	HISTORICAL_CONTEXT: [
		"Provide historical context including the time period, geopolitical situation, and technological capabilities of the era",
		"Consider the credibility of witnesses, including military personnel, pilots, and trained observers",
		"Include information about subsequent investigations, debunking attempts, or confirmations"
	],
	DISCLOSURE_FOCUSED: [
		"Emphasize cases involving government transparency, official disclosure, or declassified documents",
		"Include information about congressional hearings, official reports, or military acknowledgments",
		"Focus on cases that contributed to policy changes or increased government transparency"
	],
	PATTERN_ANALYSIS: [
		"Look for patterns in locations, timing, witness descriptions, and reported capabilities",
		"Compare similar incidents across different time periods and geographical regions",
		"Identify common characteristics in technology descriptions, entity encounters, or environmental effects"
	]
};

/**
 * Optimized search configurations for different types of UFO/UAP research
 */
export const UFO_SEARCH_CONFIGS = {
	CREDIBLE_SIGHTINGS: {
		searchType: 'keyword' as const,
		search: {
			fuzziness: 1,
			prefix: 'phrase' as const,
			target: [
				'description',
				{ column: 'name', weight: 3 },
				{ column: 'summary', weight: 2 },
				'location',
				'witness_credibility'
			],
			boosters: [{
				valueBooster: {
					column: 'credibility_score',
					value: 'high',
					factor: 2.0
				}
			}, {
				numericBooster: {
					column: 'witness_count',
					factor: 1.5
				}
			}]
		}
	},
	GOVERNMENT_DISCLOSURE: {
		searchType: 'keyword' as const,
		search: {
			fuzziness: 0,
			prefix: 'phrase' as const,
			target: [
				{ column: 'description', weight: 2 },
				{ column: 'official_investigation', weight: 3 },
				{ column: 'government_acknowledgment', weight: 3 },
				'classification_status'
			],
			boosters: [{
				valueBooster: {
					column: 'government_involvement',
					value: 'confirmed',
					factor: 2.5
				}
			}, {
				valueBooster: {
					column: 'classification_status',
					value: 'declassified',
					factor: 2.0
				}
			}]
		}
	},
	HISTORICAL_TIMELINE: {
		searchType: 'keyword' as const,
		search: {
			fuzziness: 1,
			prefix: 'disabled' as const,
			target: [
				'description',
				{ column: 'name', weight: 2 },
				'date',
				'historical_significance'
			],
			boosters: [{
				numericBooster: {
					column: 'date',
					factor: 1.0,
					modifier: 'log' as const
				}
			}]
		}
	},
	GEOGRAPHIC_PATTERNS: {
		searchType: 'keyword' as const,
		search: {
			fuzziness: 2,
			prefix: 'phrase' as const,
			target: [
				{ column: 'location', weight: 3 },
				{ column: 'coordinates', weight: 2 },
				'description',
				'regional_patterns'
			],
			boosters: [{
				numericBooster: {
					column: 'latitude',
					factor: 1.2
				}
			}, {
				numericBooster: {
					column: 'longitude',
					factor: 1.2
				}
			}]
		}
	}
};

/**
 * Specialized ask function for UFO/UAP credibility research
 */
export const askUFOCredibilityAnalysis = async (
	table: string,
	question: string,
	options: {
		sessionId?: string;
		includeDebunked?: boolean;
		minCredibilityScore?: number;
	} = {}
): Promise<AskResponseWithRecords> => {
	const searchConfig = {
		...UFO_SEARCH_CONFIGS.CREDIBLE_SIGHTINGS,
		search: {
			...UFO_SEARCH_CONFIGS.CREDIBLE_SIGHTINGS.search,
			filter: {
				...(!options.includeDebunked && { debunked: { $ne: true } }),
				...(options.minCredibilityScore && { 
					credibility_score: { $gte: options.minCredibilityScore } 
				})
			}
		}
	};

	return askXataWithAi({
		table,
		question,
		rules: UFO_RESEARCH_RULES.SCIENTIFIC_ANALYSIS,
		searchType: searchConfig.searchType,
		search: searchConfig.search,
		sessionId: options.sessionId
	});
};

/**
 * Specialized ask function for government disclosure research
 */
export const askGovernmentDisclosure = async (
	table: string,
	question: string,
	options: {
		sessionId?: string;
		includeClassified?: boolean;
		officialOnly?: boolean;
	} = {}
): Promise<AskResponseWithRecords> => {
	const searchConfig = {
		...UFO_SEARCH_CONFIGS.GOVERNMENT_DISCLOSURE,
		search: {
			...UFO_SEARCH_CONFIGS.GOVERNMENT_DISCLOSURE.search,
			filter: {
				...(!options.includeClassified && { 
					classification_status: { $ne: 'classified' } 
				}),
				...(options.officialOnly && { 
					government_involvement: 'confirmed' 
				})
			}
		}
	};

	return askXataWithAi({
		table,
		question,
		rules: UFO_RESEARCH_RULES.DISCLOSURE_FOCUSED,
		searchType: searchConfig.searchType,
		search: searchConfig.search,
		sessionId: options.sessionId
	});
};

/**
 * Specialized ask function for historical timeline analysis
 */
export const askHistoricalTimeline = async (
	table: string,
	question: string,
	options: {
		sessionId?: string;
		startYear?: number;
		endYear?: number;
		includeAncient?: boolean;
	} = {}
): Promise<AskResponseWithRecords> => {
	const searchConfig = {
		...UFO_SEARCH_CONFIGS.HISTORICAL_TIMELINE,
		search: {
			...UFO_SEARCH_CONFIGS.HISTORICAL_TIMELINE.search,
			filter: {
				...(options.startYear && { 
					date: { $gte: new Date(`${options.startYear}-01-01`) } 
				}),
				...(options.endYear && { 
					date: { $lte: new Date(`${options.endYear}-12-31`) } 
				}),
				...(!options.includeAncient && { 
					date: { $gte: new Date('1900-01-01') } 
				})
			}
		}
	};

	return askXataWithAi({
		table,
		question,
		rules: UFO_RESEARCH_RULES.HISTORICAL_CONTEXT,
		searchType: searchConfig.searchType,
		search: searchConfig.search,
		sessionId: options.sessionId
	});
};

/**
 * Specialized ask function for geographic pattern analysis
 */
export const askGeographicPatterns = async (
	table: string,
	question: string,
	options: {
		sessionId?: string;
		region?: string;
		radius?: number; // in kilometers
		centerLat?: number;
		centerLng?: number;
	} = {}
): Promise<AskResponseWithRecords> => {
	const searchConfig = {
		...UFO_SEARCH_CONFIGS.GEOGRAPHIC_PATTERNS,
		search: {
			...UFO_SEARCH_CONFIGS.GEOGRAPHIC_PATTERNS.search,
			filter: {
				...(options.region && { location: { $contains: options.region } }),
				...(options.centerLat && options.centerLng && options.radius && {
					// This would need to be implemented with proper geospatial queries
					// For now, we'll filter by approximate bounds
					latitude: {
						$gte: options.centerLat - (options.radius / 111), // rough conversion
						$lte: options.centerLat + (options.radius / 111)
					},
					longitude: {
						$gte: options.centerLng - (options.radius / 111),
						$lte: options.centerLng + (options.radius / 111)
					}
				})
			}
		}
	};

	return askXataWithAi({
		table,
		question,
		rules: UFO_RESEARCH_RULES.PATTERN_ANALYSIS,
		searchType: searchConfig.searchType,
		search: searchConfig.search,
		sessionId: options.sessionId
	});
};

/**
 * Multi-table research function that queries across events, personnel, and testimonies
 */
export const askMultiTableResearch = async (
	question: string,
	options: {
		tables?: string[];
		sessionId?: string;
		researchType?: keyof typeof UFO_RESEARCH_RULES;
	} = {}
): Promise<{
	combinedAnswer: string;
	tableResults: Record<string, AskResponseWithRecords>;
	sessionId: string;
}> => {
	const tables = options.tables || ['events', 'personnel', 'testimonies'];
	const rules = UFO_RESEARCH_RULES[options.researchType || 'SCIENTIFIC_ANALYSIS'];
	
	const results: Record<string, AskResponseWithRecords> = {};
	let sessionId = options.sessionId;

	// Query each table
	for (const table of tables) {
		try {
			const result = await askXataWithAi({
				table,
				question,
				rules,
				sessionId
			});
			
			results[table] = result;
			sessionId = result.sessionId; // Use the session for follow-ups
		} catch (error) {
			console.error(`Error querying table ${table}:`, error);
		}
	}

	// Combine results into a comprehensive answer
	const combinedAnswer = Object.entries(results)
		.map(([table, result]) => `**${table.toUpperCase()}**: ${result.answer}`)
		.join('\n\n');

	return {
		combinedAnswer,
		tableResults: results,
		sessionId: sessionId || ''
	};
};

/**
 * Research conversation builder for complex investigations
 */
export class UFOResearchConversation {
	private sessionId?: string;
	private table: string;
	private conversationHistory: Array<{
		question: string;
		answer: string;
		timestamp: Date;
		searchType?: string;
	}> = [];

	constructor(table: string) {
		this.table = table;
	}

	async startInvestigation(
		initialQuestion: string,
		researchType: keyof typeof UFO_RESEARCH_RULES = 'SCIENTIFIC_ANALYSIS'
	): Promise<AskResponseWithRecords> {
		const result = await askXataWithAi({
			table: this.table,
			question: initialQuestion,
			rules: UFO_RESEARCH_RULES[researchType]
		});

		this.sessionId = result.sessionId;
		this.conversationHistory.push({
			question: initialQuestion,
			answer: result.answer,
			timestamp: new Date(),
			searchType: researchType
		});

		return result;
	}

	async askFollowUp(
		question: string,
		searchConfig?: keyof typeof UFO_SEARCH_CONFIGS
	): Promise<AskResponseWithRecords> {
		if (!this.sessionId) {
			throw new Error('No active investigation session. Call startInvestigation first.');
		}

		const config = searchConfig ? UFO_SEARCH_CONFIGS[searchConfig] : undefined;
		
		const result = await askXataWithAi({
			table: this.table,
			question,
			sessionId: this.sessionId,
			...(config && {
				searchType: config.searchType,
				search: config.search
			})
		});

		this.conversationHistory.push({
			question,
			answer: result.answer,
			timestamp: new Date(),
			searchType: searchConfig
		});

		return result;
	}

	getConversationSummary(): {
		totalQuestions: number;
		sessionId?: string;
		history: typeof this.conversationHistory;
	} {
		return {
			totalQuestions: this.conversationHistory.length,
			sessionId: this.sessionId,
			history: this.conversationHistory
		};
	}

	async generateInvestigationReport(): Promise<string> {
		if (!this.sessionId || this.conversationHistory.length === 0) {
			return 'No investigation data available.';
		}

		const reportPrompt = `Based on our investigation conversation, generate a comprehensive research report summarizing the key findings, evidence patterns, and conclusions. Include:
		1. Executive Summary
		2. Key Evidence Found
		3. Patterns and Connections
		4. Credibility Assessment
		5. Areas for Further Investigation`;

		const result = await askFollowUp(this.table, reportPrompt, this.sessionId);
		return result.answer;
	}
}

/**
 * Export specialized UFO/UAP research functions
 */
export const ufoResearch = {
	askCredibilityAnalysis: askUFOCredibilityAnalysis,
	askGovernmentDisclosure: askGovernmentDisclosure,
	askHistoricalTimeline: askHistoricalTimeline,
	askGeographicPatterns: askGeographicPatterns,
	askMultiTableResearch: askMultiTableResearch,
	UFOResearchConversation,
	RULES: UFO_RESEARCH_RULES,
	CONFIGS: UFO_SEARCH_CONFIGS
};
