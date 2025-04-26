import { xata } from "@/db/xata/client";
import type { Topics, TopicsRecord } from "@/db/xata/xata";
import type { ReadOptions } from "@xata.io/client";

/**
 * Error interface for standardized error responses
 */
interface TopicsOperationError extends Error {
	code: string;
	operation: string;
	details?: unknown;
}

/**
 * Standard response interface for paginated data
 */
interface PaginatedResponse<T> {
	records: T[];
	pagination: {
		page: number;
		size: number;
		total?: number;
		hasNextPage: boolean;
	};
}

/**
 * Creates an error with standardized format for consistent error handling
 * @param message Error message
 * @param code Error code
 * @param operation Operation that caused the error
 * @param details Additional error details
 * @returns Standardized error object
 */
function createTopicError(
	message: string,
	code: string,
	operation: string,
	details?: unknown,
): TopicsOperationError {
	const error = new Error(message) as TopicsOperationError;
	error.code = code;
	error.operation = operation;
	error.details = details;
	return error;
}

/**
 * Create a new topic record
 * @param data Topic data to create
 * @returns The created topic record
 * @throws {TopicsOperationError} If creation fails
 */
export async function createTopic(
	data: Omit<Topics, "id" | "xata">,
): Promise<TopicsRecord> {
	try {
		// Validate required fields
		if (!data.title && !data.name) {
			throw createTopicError(
				"Topic title or name is required",
				"MISSING_REQUIRED_FIELD",
				"createTopic",
			);
		}

		return await xata.db.topics.create(data);
	} catch (error) {
		console.error("Error creating topic:", error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to create topic: ${(error as Error).message}`,
			"CREATE_FAILED",
			"createTopic",
			error,
		);
	}
}

/**
 * Create multiple topic records in bulk
 * @param data Array of topic data to create
 * @returns Array of created topic records
 * @throws {TopicsOperationError} If bulk creation fails
 */
export async function createManyTopics(
	data: Omit<Topics, "id" | "xata">[],
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!Array.isArray(data) || data.length === 0) {
			throw createTopicError(
				"Data must be a non-empty array",
				"INVALID_INPUT",
				"createManyTopics",
			);
		}

		// Validate required fields for each item
		for (const [index, item] of data.entries()) {
			if (!item.title && !item.name) {
				throw createTopicError(
					`Topic at index ${index} is missing a title or name`,
					"MISSING_REQUIRED_FIELD",
					"createManyTopics",
				);
			}
		}

		return await xata.db.topics.create(data);
	} catch (error) {
		console.error("Error creating bulk topics:", error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to create multiple topics: ${(error as Error).message}`,
			"BULK_CREATE_FAILED",
			"createManyTopics",
			error,
		);
	}
}

/**
 * Get a topic record by ID
 * @param id The topic record ID
 * @param columns Optional columns to select
 * @returns The topic record or null if not found
 * @throws {TopicsOperationError} If retrieval fails
 */
export async function getTopicById(
	id: string,
	columns?: string[],
): Promise<TopicsRecord | null> {
	try {
		if (!id) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"getTopicById",
			);
		}

		const options: ReadOptions = {};
		if (columns && columns.length > 0) {
			options.columns = columns;
		}

		return await xata.db.topics.read(id, options);
	} catch (error) {
		console.error(`Error getting topic with ID ${id}:`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to get topic with ID ${id}: ${(error as Error).message}`,
			"GET_FAILED",
			"getTopicById",
			error,
		);
	}
}

/**
 * Get all topic records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of topic records
 * @throws {TopicsOperationError} If query fails
 */
export async function getAllTopics(options?: {
	filter?: Record<string, unknown>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
	consistency?: "strong" | "eventual";
}): Promise<TopicsRecord[]> {
	try {
		// Build the query using builder pattern
		const queryOptions: {
			filter?: Record<string, unknown>;
			sort?: [string, "asc" | "desc"][];
			columns?: string[];
			pagination?: { size: number; offset: number };
			consistency?: "strong" | "eventual";
		} = {
			consistency: options?.consistency || "strong",
		};

		// Add filter if provided
		if (options?.filter) {
			queryOptions.filter = options.filter;
		}

		// Add sort if provided
		if (options?.sort) {
			queryOptions.sort = Object.entries(options.sort).map(
				([column, direction]) => [column, direction],
			);
		}

		// Add columns if provided
		if (options?.columns) {
			queryOptions.columns = options.columns;
		}

		// Add pagination if provided
		if (options?.pagination) {
			queryOptions.pagination = {
				size: options.pagination.size || 50,
				offset: options.pagination.offset || 0,
			};
		}

		// Execute query with all options
		const result = await xata.db.topics.query(queryOptions);
		return result.records;
	} catch (error) {
		console.error("Error getting all topics:", error);
		throw createTopicError(
			`Failed to get topics: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getAllTopics",
			error,
		);
	}
}

/**
 * Get topic records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @param columns Optional columns to select
 * @returns Paginated topic records
 * @throws {TopicsOperationError} If pagination query fails
 */
export async function getTopicsWithPagination(
	page = 1,
	size = 20,
	filter?: Record<string, unknown>,
	columns?: string[],
): Promise<PaginatedResponse<TopicsRecord>> {
	try {
		// Validate input
		if (page < 1) {
			throw createTopicError(
				"Page number must be greater than 0",
				"INVALID_PAGE",
				"getTopicsWithPagination",
			);
		}

		if (size < 1 || size > 100) {
			throw createTopicError(
				"Page size must be between 1 and 100",
				"INVALID_SIZE",
				"getTopicsWithPagination",
			);
		}

		const queryOptions: {
			filter?: Record<string, unknown>;
			columns?: string[];
			pagination: { size: number; offset: number };
		} = {
			pagination: {
				size,
				offset: (page - 1) * size,
			},
		};

		if (filter) {
			queryOptions.filter = filter;
		}

		if (columns) {
			queryOptions.columns = columns;
		}

		const result = await xata.db.topics.query(queryOptions);

		return {
			records: result.records,
			pagination: {
				page,
				size,
				total: result.meta?.page?.more
					? undefined // We can't determine the exact total when there are more records
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated topics:", error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to get paginated topics: ${(error as Error).message}`,
			"PAGINATION_FAILED",
			"getTopicsWithPagination",
			error,
		);
	}
}

/**
 * Search topic records
 * @param query Search query
 * @param options Search options
 * @returns Matching topic records
 * @throws {TopicsOperationError} If search fails
 */
export async function searchTopics(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
		filter?: Record<string, unknown>;
	},
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw createTopicError(
				"Search query is required",
				"MISSING_QUERY",
				"searchTopics",
			);
		}

		const searchOptions = {
			fuzziness: options?.fuzziness || 1,
			prefix: options?.prefix || "phrase",
			page: options?.pagination
				? {
						size: options.pagination.size || 20,
						offset: options.pagination.offset || 0,
					}
				: undefined,
			filter: options?.filter,
		};

		const results = await xata.db.topics.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching topics with query "${query}":`, error);
		throw createTopicError(
			`Failed to search topics: ${(error as Error).message}`,
			"SEARCH_FAILED",
			"searchTopics",
			error,
		);
	}
}

/**
 * Update a topic record
 * @param id The topic record ID
 * @param data The data to update
 * @returns The updated topic record
 * @throws {TopicsOperationError} If update fails
 */
export async function updateTopic(
	id: string,
	data: Partial<Omit<Topics, "id" | "xata">>,
): Promise<TopicsRecord | null> {
	try {
		// Validate input
		if (!id) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"updateTopic",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createTopicError(
				"Update data is required",
				"MISSING_DATA",
				"updateTopic",
			);
		}

		// Verify the record exists before updating
		const exists = await xata.db.topics.read(id);
		if (!exists) {
			return null;
		}

		return await xata.db.topics.update(id, data);
	} catch (error) {
		console.error(`Error updating topic with ID ${id}:`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to update topic with ID ${id}: ${(error as Error).message}`,
			"UPDATE_FAILED",
			"updateTopic",
			error,
		);
	}
}

/**
 * Update multiple topic records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 * @throws {TopicsOperationError} If bulk update fails
 */
export async function updateManyTopics(
	filter: Record<string, unknown>,
	data: Partial<Omit<Topics, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// Validate inputs
		if (!filter || Object.keys(filter).length === 0) {
			throw createTopicError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"updateManyTopics",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createTopicError(
				"Update data is required",
				"MISSING_DATA",
				"updateManyTopics",
			);
		}

		// First get the IDs of records matching the filter
		const records = await xata.db.topics.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsUpdated: 0 };
		}

		const updatePromises = records.records.map((record) =>
			xata.db.topics.update(record.id, data),
		);

		const updatedRecords = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple topic records:", error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to update multiple topics: ${(error as Error).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyTopics",
			error,
		);
	}
}

/**
 * Delete a topic record
 * @param id The ID of the topic record to delete
 * @returns True if the record was deleted, false if it didn't exist
 * @throws {TopicsOperationError} If deletion fails
 */
export async function deleteTopic(id: string): Promise<boolean> {
	try {
		// Validate input
		if (!id) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"deleteTopic",
			);
		}

		const deletedRecord = await xata.db.topics.delete(id);
		return deletedRecord !== null;
	} catch (error) {
		console.error(`Error deleting topic with ID ${id}:`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to delete topic with ID ${id}: ${(error as Error).message}`,
			"DELETE_FAILED",
			"deleteTopic",
			error,
		);
	}
}

/**
 * Delete multiple topic records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 * @throws {TopicsOperationError} If bulk deletion fails
 */
export async function deleteManyTopics(
	filter: Record<string, unknown>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// Validate input
		if (!filter || Object.keys(filter).length === 0) {
			throw createTopicError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"deleteManyTopics",
			);
		}

		// First get the IDs of records matching the filter
		const records = await xata.db.topics.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsDeleted: 0 };
		}

		const deletePromises = records.records.map((record) =>
			xata.db.topics.delete(record.id),
		);

		const deletedRecords = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple topic records:", error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to delete multiple topics: ${(error as Error).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyTopics",
			error,
		);
	}
}

/**
 * Ask questions about topics using natural language
 * @param question The natural language question to ask
 * @param options Optional parameters for processing the question
 * @returns The processed topic data answering the question
 * @throws {TopicsOperationError} If question processing fails
 */
export async function askTopics(
	question: string,
	options?: {
		maxResults?: number;
		includeDetails?: boolean;
	},
): Promise<{
	answer: string;
	relatedRecords: TopicsRecord[];
}> {
	try {
		// Validate input
		if (!question || question.trim() === "") {
			throw createTopicError(
				"Question text is required",
				"MISSING_QUESTION",
				"askTopics",
			);
		}

		// Use Xata's search capabilities to find relevant topics
		const searchResults = await xata.db.topics.search(question, {
			fuzziness: 2,
			page: {
				size: options?.maxResults || 5,
			},
		});

		return {
			answer: `Results for: ${question}`,
			relatedRecords: searchResults.records,
		};
	} catch (error) {
		console.error(`Error asking about topics: "${question}"`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to process question: ${(error as Error).message}`,
			"QUESTION_PROCESSING_FAILED",
			"askTopics",
			error,
		);
	}
}

/**
 * Get topics related to a specific testimony
 * @param testimonyId The ID of the testimony
 * @returns Topics related to the specified testimony
 * @throws {TopicsOperationError} If retrieval fails
 */
export async function getTopicsByTestimony(
	testimonyId: string,
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!testimonyId) {
			throw createTopicError(
				"Testimony ID is required",
				"MISSING_TESTIMONY_ID",
				"getTopicsByTestimony",
			);
		}

		// First get the topic-testimony connections
		const connections = await xata.db["topics-testimonies"].query({
			filter: {
				"testimony.id": testimonyId,
			},
		});

		if (connections.records.length === 0) {
			return [];
		}

		// Extract topic IDs
		const topicIds = connections.records
			.map((connection) => connection.topic?.id)
			.filter(Boolean) as string[];

		if (topicIds.length === 0) {
			return [];
		}

		// Get the topic records
		const topics = await xata.db.topics.query({
			filter: {
				id: {
					$any: topicIds,
				},
			},
		});

		return topics.records;
	} catch (error) {
		console.error(
			`Error getting topics by testimony ID ${testimonyId}:`,
			error,
		);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to get topics by testimony: ${(error as Error).message}`,
			"TESTIMONY_QUERY_FAILED",
			"getTopicsByTestimony",
			error,
		);
	}
}

/**
 * Get topics related to a specific event
 * @param eventId The ID of the event
 * @returns Topics related to the specified event
 * @throws {TopicsOperationError} If retrieval fails
 */
export async function getTopicsByEvent(
	eventId: string,
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!eventId) {
			throw createTopicError(
				"Event ID is required",
				"MISSING_EVENT_ID",
				"getTopicsByEvent",
			);
		}

		// Get event-topic-subject-matter-experts connections
		const connections = await xata.db[
			"event-topic-subject-matter-experts"
		].query({
			filter: {
				"event.id": eventId,
			},
		});

		if (connections.records.length === 0) {
			return [];
		}

		// Extract topic IDs
		const topicIds = connections.records
			.map((connection) => connection.topic?.id)
			.filter(Boolean) as string[];

		if (topicIds.length === 0) {
			return [];
		}

		// Get the topic records
		const topics = await xata.db.topics.query({
			filter: {
				id: {
					$any: topicIds,
				},
			},
		});

		return topics.records;
	} catch (error) {
		console.error(`Error getting topics by event ID ${eventId}:`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to get topics by event: ${(error as Error).message}`,
			"EVENT_QUERY_FAILED",
			"getTopicsByEvent",
			error,
		);
	}
}

/**
 * Get topics associated with a specific subject matter expert
 * @param expertId The ID of the subject matter expert (personnel)
 * @returns Topics associated with the specified expert
 * @throws {TopicsOperationError} If retrieval fails
 */
export async function getTopicsByExpert(
	expertId: string,
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!expertId) {
			throw createTopicError(
				"Expert ID is required",
				"MISSING_EXPERT_ID",
				"getTopicsByExpert",
			);
		}

		// Get topic-subject-matter-experts connections
		const connections = await xata.db["topic-subject-matter-experts"].query({
			filter: {
				"subject-matter-expert.id": expertId,
			},
		});

		if (connections.records.length === 0) {
			return [];
		}

		// Extract topic IDs
		const topicIds = connections.records
			.map((connection) => connection.topic?.id)
			.filter(Boolean) as string[];

		if (topicIds.length === 0) {
			return [];
		}

		// Get the topic records
		const topics = await xata.db.topics.query({
			filter: {
				id: {
					$any: topicIds,
				},
			},
		});

		return topics.records;
	} catch (error) {
		console.error(`Error getting topics by expert ID ${expertId}:`, error);

		if ((error as TopicsOperationError).code) {
			throw error;
		}

		throw createTopicError(
			`Failed to get topics by expert: ${(error as Error).message}`,
			"EXPERT_QUERY_FAILED",
			"getTopicsByExpert",
			error,
		);
	}
}
