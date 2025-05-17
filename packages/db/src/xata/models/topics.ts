import type { RecordFilterExpression } from "@xata.io/client";
import { xata } from "../../client";
import type { TopicsRecord, Topics } from "../schema/topics";

// Define error interface for consistent error handling
interface TopicsOperationError extends Error {
	code: string;
	operation: string;
	details?: unknown;
}

// Error creation helper function
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

// Types for pagination response
interface PaginatedTopicsResponse {
	records: TopicsRecord[];
	pagination: {
		page: number;
		size: number;
		total?: number;
		hasNextPage: boolean;
	};
}

// #region CREATE OPERATIONS

/**
 * Creates a new topic record in the database
 * @param data The topic data without id and xata fields
 * @returns The created topic record
 */
export async function createTopic(
	data: Omit<Topics, "id" | "xata">,
): Promise<TopicsRecord> {
	try {
		// Validate required fields
		if (!data.title) {
			throw createTopicError(
				"Topic title is required",
				"MISSING_REQUIRED_FIELD",
				"createTopic",
			);
		}

		return await xata.db.topics.create(data);
	} catch (error) {
		console.error("Error creating topic:", error);

		// Re-throw typed errors
		if ((error as TopicsOperationError).code) {
			throw error;
		}

		// Create and throw standardized error
		throw createTopicError(
			`Failed to create topic: ${(error as Error).message}`,
			"CREATE_FAILED",
			"createTopic",
			error,
		);
	}
}

/**
 * Creates multiple topic records in the database
 * @param data Array of topic data without id and xata fields
 * @returns Array of created topic records
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

		// Validate each record
		for (const [index, item] of data.entries()) {
			if (!item.title) {
				throw createTopicError(
					`Topic at index ${index} is missing required title field`,
					"MISSING_REQUIRED_FIELD",
					"createManyTopics",
				);
			}
		}

		return await xata.db.topics.create(data);
	} catch (error) {
		console.error("Error creating bulk topics:", error);

		// Create and throw standardized error
		throw createTopicError(
			`Failed to create multiple topics: ${(error as Error).message}`,
			"BULK_CREATE_FAILED",
			"createManyTopics",
			error,
		);
	}
}

// #endregion

// #region READ OPERATIONS

/**
 * Gets a topic by its ID
 * @param id The topic ID
 * @param columns Optional columns to select
 * @returns The topic record or null if not found
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

		const options: { columns?: string[] } = {};
		if (columns && columns.length > 0) {
			options.columns = columns;
		}

		return await xata.db.topics.read(id, options);
	} catch (error) {
		console.error(`Error getting topic with ID ${id}:`, error);

		throw createTopicError(
			`Failed to get topic with ID ${id}: ${(error as Error).message}`,
			"GET_FAILED",
			"getTopicById",
			error,
		);
	}
}

/**
 * Gets a topic by its title
 * @param title The topic title (unique)
 * @param columns Optional columns to select
 * @returns The topic record or null if not found
 */
export async function getTopicByTitle(
	title: string,
	columns?: string[],
): Promise<TopicsRecord | null> {
	try {
		if (!title) {
			throw createTopicError(
				"Topic title is required",
				"MISSING_TITLE",
				"getTopicByTitle",
			);
		}

		const results = await getAllTopics({
			filter: { title },
			columns,
		});

		return results.length > 0 ? results[0] : null;
	} catch (error) {
		console.error(`Error getting topic with title "${title}":`, error);

		throw createTopicError(
			`Failed to get topic with title "${title}": ${(error as Error).message}`,
			"GET_BY_TITLE_FAILED",
			"getTopicByTitle",
			error,
		);
	}
}

/**
 * Gets all topics with optional filtering, sorting, and pagination
 * @param options Optional configuration for filtering, sorting, and pagination
 * @returns Array of topic records
 */
export async function getAllTopics(options?: {
	filter?: RecordFilterExpression<TopicsRecord>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
	consistency?: "strong" | "eventual";
}): Promise<TopicsRecord[]> {
	try {
		// Build query options
		const queryOptions: {
			filter?: RecordFilterExpression<TopicsRecord>;
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

		// Execute query with options
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
 * Gets topics with pagination
 * @param page The page number (starting from 1)
 * @param size The page size
 * @param filter Optional filter expression
 * @param columns Optional columns to select
 * @returns Paginated response with topic records
 */
export async function getTopicsWithPagination(
	page = 1,
	size = 20,
	filter?: RecordFilterExpression<TopicsRecord>,
	columns?: string[],
): Promise<PaginatedTopicsResponse> {
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
			filter?: RecordFilterExpression<TopicsRecord>;
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
					? undefined // Can't determine exact total when there are more records
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated topics:", error);

		throw createTopicError(
			`Failed to get paginated topics: ${(error as Error).message}`,
			"PAGINATION_FAILED",
			"getTopicsWithPagination",
			error,
		);
	}
}

/**
 * Searches topics using text search
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching topic records
 */
export async function searchTopics(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
		filter?: RecordFilterExpression<TopicsRecord>;
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
 * Performs vector search on topics using embedding
 * @param embedding The vector embedding to search with
 * @param options Optional search configuration
 * @returns Array of matching topic records
 */
export async function semanticSearchTopics(
	embedding: number[],
	options?: {
		maxResults?: number;
		filter?: RecordFilterExpression<TopicsRecord>;
	},
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if (!embedding || !Array.isArray(embedding) || embedding.length !== 1536) {
			throw createTopicError(
				"Valid embedding vector with 1536 dimensions is required",
				"INVALID_EMBEDDING",
				"semanticSearchTopics",
			);
		}

		const searchOptions = {
			maxResults: options?.maxResults || 10,
			filter: options?.filter,
		};

		const results = await xata.db.topics.vectorSearch(
			"embedding",
			embedding,
			searchOptions,
		);

		return results.records;
	} catch (error) {
		console.error("Error in semantic search of topics:", error);

		throw createTopicError(
			`Failed in semantic search: ${(error as Error).message}`,
			"VECTOR_SEARCH_FAILED",
			"semanticSearchTopics",
			error,
		);
	}
}

/**
 * Get topics related to a specific testimony
 * @param testimonyId The ID of the testimony to get related topics for
 * @returns Array of topic records related to the testimony
 */
export async function getTopicsByTestimony(
	testimonyId: string,
): Promise<TopicsRecord[]> {
	try {
		if (!testimonyId) {
			throw createTopicError(
				"Testimony ID is required",
				"MISSING_TESTIMONY_ID",
				"getTopicsByTestimony",
			);
		}

		// Query the relationship table to get the topics
		const relationships = await xata.db["topics-testimonies"].query({
			filter: {
				"testimony.id": testimonyId,
			},
		});

		if (relationships.records.length === 0) {
			return [];
		}

		// Extract topic IDs
		const topicIds = relationships.records
			.filter((rel) => rel.topic?.id)
			.map((rel) => rel.topic?.id as string);

		if (topicIds.length === 0) {
			return [];
		}

		// Get all topics by these IDs
		const topics = await getAllTopics({
			filter: {
				id: {
					$any: topicIds,
				},
			},
		});

		return topics;
	} catch (error) {
		console.error(`Error getting topics for testimony ${testimonyId}:`, error);

		throw createTopicError(
			`Failed to get topics for testimony: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getTopicsByTestimony",
			error,
		);
	}
}

// #endregion

// #region UPDATE OPERATIONS

/**
 * Updates a topic by ID
 * @param id The topic ID
 * @param data The topic data to update
 * @returns The updated topic record or null if not found
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

		// Verify the topic exists before updating
		const exists = await xata.db.topics.read(id);
		if (!exists) {
			return null;
		}

		return await xata.db.topics.update(id, data);
	} catch (error) {
		console.error(`Error updating topic with ID ${id}:`, error);

		throw createTopicError(
			`Failed to update topic with ID ${id}: ${(error as Error).message}`,
			"UPDATE_FAILED",
			"updateTopic",
			error,
		);
	}
}

/**
 * Updates multiple topics matching a filter
 * @param filter The filter to select topics to update
 * @param data The data to update
 * @returns The number of topics updated
 */
export async function updateManyTopics(
	filter: RecordFilterExpression<TopicsRecord>,
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

		// Get topics matching the filter
		const topics = await xata.db.topics.query({ filter });

		if (topics.records.length === 0) {
			return { numberOfRecordsUpdated: 0 };
		}

		const updatePromises = topics.records.map((topic: TopicsRecord) =>
			xata.db.topics.update(topic.id, data),
		);

		const updatedTopics = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedTopics.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple topics:", error);

		throw createTopicError(
			`Failed to update multiple topics: ${(error as Error).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyTopics",
			error,
		);
	}
}

// #endregion

// #region DELETE OPERATIONS

/**
 * Deletes a topic by ID
 * @param id The topic ID
 * @returns True if deleted, false if not found
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

		const deletedTopic = await xata.db.topics.delete(id);
		return deletedTopic !== null;
	} catch (error) {
		console.error(`Error deleting topic with ID ${id}:`, error);

		throw createTopicError(
			`Failed to delete topic with ID ${id}: ${(error as Error).message}`,
			"DELETE_FAILED",
			"deleteTopic",
			error,
		);
	}
}

/**
 * Deletes multiple topics matching a filter
 * @param filter The filter to select topics to delete
 * @returns The number of topics deleted
 */
export async function deleteManyTopics(
	filter: RecordFilterExpression<TopicsRecord>,
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

		// Get topics matching the filter
		const topics = await xata.db.topics.query({ filter });

		if (topics.records.length === 0) {
			return { numberOfRecordsDeleted: 0 };
		}

		const deletePromises = topics.records.map((topic: TopicsRecord) =>
			xata.db.topics.delete(topic.id),
		);

		const deletedTopics = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedTopics.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple topics:", error);

		throw createTopicError(
			`Failed to delete multiple topics: ${(error as Error).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyTopics",
			error,
		);
	}
}

// #endregion
