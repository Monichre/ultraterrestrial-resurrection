import { xata } from "../client"
import type { TopicsRecord, Topics } from "../xata"

// Define error interface for consistent error handling
interface TopicsOperationError extends Error {
	code: string
	operation: string
	details?: unknown
}

// Error creation helper function
function createTopicError(
	message: string,
	code: string,
	operation: string,
	details?: unknown,
): TopicsOperationError {
	const error = new Error( message ) as TopicsOperationError
	error.code = code
	error.operation = operation
	error.details = details
	return error
}

// Types for pagination response
interface PaginatedTopicsResponse {
	records: TopicsRecord[]
	pagination: {
		page: number
		size: number
		total?: number
		hasNextPage: boolean
	}
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
		if ( !data.title ) {
			throw createTopicError(
				"Topic title is required",
				"MISSING_REQUIRED_FIELD",
				"createTopic",
			)
		}

		return await xata.db.topics.create( data )
	} catch ( error ) {
		console.error( "Error creating topic:", error )

		// Re-throw typed errors
		if ( ( error as TopicsOperationError ).code ) {
			throw error
		}

		// Create and throw standardized error
		throw createTopicError(
			`Failed to create topic: ${( error as Error ).message}`,
			"CREATE_FAILED",
			"createTopic",
			error,
		)
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
		if ( !Array.isArray( data ) || data.length === 0 ) {
			throw createTopicError(
				"Data must be a non-empty array",
				"INVALID_INPUT",
				"createManyTopics",
			)
		}

		// Validate each record
		for ( let index = 0; index < data.length; index++ ) {
			const item = data[index]
			if ( !item.title ) {
				throw createTopicError(
					`Topic at index ${index} is missing required title field`,
					"MISSING_REQUIRED_FIELD",
					"createManyTopics",
				)
			}
		}

		return await xata.db.topics.create( data )
	} catch ( error ) {
		console.error( "Error creating bulk topics:", error )

		// Create and throw standardized error
		throw createTopicError(
			`Failed to create multiple topics: ${( error as Error ).message}`,
			"BULK_CREATE_FAILED",
			"createManyTopics",
			error,
		)
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
		if ( !id ) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"getTopicById",
			)
		}

		if ( columns && columns.length > 0 ) {
			// Use filter + getFirst for column selection to avoid TypeScript issues
			return await xata.db.topics.select( columns as any ).filter( { id } ).getFirst()
		}

		return await xata.db.topics.read( id )
	} catch ( error ) {
		console.error( `Error getting topic with ID ${id}:`, error )

		throw createTopicError(
			`Failed to get topic with ID ${id}: ${( error as Error ).message}`,
			"GET_FAILED",
			"getTopicById",
			error,
		)
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
		if ( !title ) {
			throw createTopicError(
				"Topic title is required",
				"MISSING_TITLE",
				"getTopicByTitle",
			)
		}

		let query = xata.db.topics.filter( { title } )

		if ( columns && columns.length > 0 ) {
			query = query.select( columns as any )
		}

		const result = await query.getFirst()
		return result || null
	} catch ( error ) {
		console.error( `Error getting topic with title "${title}":`, error )

		throw createTopicError(
			`Failed to get topic with title "${title}": ${( error as Error ).message}`,
			"GET_BY_TITLE_FAILED",
			"getTopicByTitle",
			error,
		)
	}
}

/**
 * Gets all topics with optional filtering, sorting, and pagination
 * @param options Optional configuration for filtering, sorting, and pagination
 * @returns Array of topic records
 */
export async function getAllTopics( options?: {
	filter?: Record<string, any>
	sort?: { column: string; direction: "asc" | "desc" }[]
	page?: number
	size?: number
	columns?: string[]
} ): Promise<TopicsRecord[]> {
	try {
		const { filter, sort, page, size, columns } = options || {}

		let query = xata.db.topics.filter( filter || {} )

		if ( columns && columns.length > 0 ) {
			query = query.select( columns as any )
		}

		if ( sort?.length ) {
			for ( const { column, direction } of sort ) {
				query = query.sort( column as any, direction )
			}
		}

		if ( page && size ) {
			const result = await query.getPaginated( {
				pagination: { size, offset: ( page - 1 ) * size },
			} )
			return result.records as TopicsRecord[]
		}

		return await query.getMany() as TopicsRecord[]
	} catch ( error ) {
		console.error( "Error getting all topics:", error )

		throw createTopicError(
			`Failed to get topics: ${( error as Error ).message}`,
			"QUERY_FAILED",
			"getAllTopics",
			error,
		)
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
	filter?: Record<string, any>,
	columns?: string[],
): Promise<PaginatedTopicsResponse> {
	try {
		// Validate input
		if ( page < 1 ) {
			throw createTopicError(
				"Page number must be greater than 0",
				"INVALID_PAGE",
				"getTopicsWithPagination",
			)
		}

		if ( size < 1 || size > 100 ) {
			throw createTopicError(
				"Page size must be between 1 and 100",
				"INVALID_SIZE",
				"getTopicsWithPagination",
			)
		}

		let query = xata.db.topics.filter( filter || {} )

		if ( columns && columns.length > 0 ) {
			query = query.select( columns as any )
		}

		const result = await query.getPaginated( {
			pagination: { size, offset: ( page - 1 ) * size },
		} )

		return {
			records: result.records as TopicsRecord[],
			pagination: {
				page,
				size,
				total: undefined, // Xata doesn't provide total in current SDK version
				hasNextPage: typeof result.hasNextPage === 'function' ? result.hasNextPage() : !!result.hasNextPage,
			},
		}
	} catch ( error ) {
		console.error( "Error getting paginated topics:", error )

		throw createTopicError(
			`Failed to get paginated topics: ${( error as Error ).message}`,
			"PAGINATION_FAILED",
			"getTopicsWithPagination",
			error,
		)
	}
}

/**
 * Searches topics using text search
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching topic records
 */
export async function searchTopics(
	searchQuery: string,
	options?: {
		fuzziness?: number
		prefix?: "phrase" | "disabled"
		pagination?: { size?: number; offset?: number }
		filter?: Record<string, any>
	},
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if ( !searchQuery || searchQuery.trim() === "" ) {
			throw createTopicError(
				"Search query is required",
				"MISSING_QUERY",
				"searchTopics",
			)
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
		}

		const results = await xata.db.topics.search( searchQuery, searchOptions )
		return results.records as TopicsRecord[]
	} catch ( error ) {
		console.error( `Error searching topics with query "${searchQuery}":`, error )

		throw createTopicError(
			`Failed to search topics: ${( error as Error ).message}`,
			"SEARCH_FAILED",
			"searchTopics",
			error,
		)
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
		maxResults?: number
		filter?: Record<string, any>
	},
): Promise<TopicsRecord[]> {
	try {
		// Validate input
		if ( !embedding || !Array.isArray( embedding ) || embedding.length !== 1536 ) {
			throw createTopicError(
				"Valid embedding vector with 1536 dimensions is required",
				"INVALID_EMBEDDING",
				"semanticSearchTopics",
			)
		}

		const searchOptions = {
			maxResults: options?.maxResults || 10,
			filter: options?.filter,
		}

		const results = await xata.db.topics.vectorSearch(
			"embedding",
			embedding,
			searchOptions,
		)

		return results.records as TopicsRecord[]
	} catch ( error ) {
		console.error( "Error in semantic search of topics:", error )

		throw createTopicError(
			`Failed in semantic search: ${( error as Error ).message}`,
			"VECTOR_SEARCH_FAILED",
			"semanticSearchTopics",
			error,
		)
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
		if ( !testimonyId ) {
			throw createTopicError(
				"Testimony ID is required",
				"MISSING_TESTIMONY_ID",
				"getTopicsByTestimony",
			)
		}

		// Query the relationship table to get the topics
		const relationships = await xata.db["topics-testimonies"]
			.filter( { "testimony.id": testimonyId } )
			.getAll()

		if ( relationships.length === 0 ) {
			return []
		}

		// Extract topic IDs
		const topicIds = relationships
			.filter( ( rel ) => rel.topic?.id )
			.map( ( rel ) => rel.topic?.id as string )

		if ( topicIds.length === 0 ) {
			return []
		}

		// Get all topics by these IDs
		const topics = await xata.db.topics
			.filter( {
				id: {
					$any: topicIds,
				},
			} )
			.getAll()

		return topics as TopicsRecord[]
	} catch ( error ) {
		console.error( `Error getting topics for testimony ${testimonyId}:`, error )

		throw createTopicError(
			`Failed to get topics for testimony: ${( error as Error ).message}`,
			"QUERY_FAILED",
			"getTopicsByTestimony",
			error,
		)
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
		if ( !id ) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"updateTopic",
			)
		}

		if ( !data || Object.keys( data ).length === 0 ) {
			throw createTopicError(
				"Update data is required",
				"MISSING_DATA",
				"updateTopic",
			)
		}

		// Verify the topic exists before updating
		const exists = await xata.db.topics.read( id )
		if ( !exists ) {
			return null
		}

		return await xata.db.topics.update( id, data )
	} catch ( error ) {
		console.error( `Error updating topic with ID ${id}:`, error )

		throw createTopicError(
			`Failed to update topic with ID ${id}: ${( error as Error ).message}`,
			"UPDATE_FAILED",
			"updateTopic",
			error,
		)
	}
}

/**
 * Updates multiple topics matching a filter
 * @param filter The filter to select topics to update
 * @param data The data to update
 * @returns The number of topics updated
 */
export async function updateManyTopics(
	filter: Record<string, any>,
	data: Partial<Omit<Topics, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// Validate inputs
		if ( !filter || Object.keys( filter ).length === 0 ) {
			throw createTopicError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"updateManyTopics",
			)
		}

		if ( !data || Object.keys( data ).length === 0 ) {
			throw createTopicError(
				"Update data is required",
				"MISSING_DATA",
				"updateManyTopics",
			)
		}

		// Get topics matching the filter
		const topics = await xata.db.topics.filter( filter ).getMany() as TopicsRecord[]

		if ( topics.length === 0 ) {
			return { numberOfRecordsUpdated: 0 }
		}

		const updatePromises = topics.map( ( topic: TopicsRecord ) =>
			xata.db.topics.update( topic.id, data ),
		)

		const updatedTopics = await Promise.all( updatePromises )
		return { numberOfRecordsUpdated: updatedTopics.filter( Boolean ).length }
	} catch ( error ) {
		console.error( "Error updating multiple topics:", error )

		throw createTopicError(
			`Failed to update multiple topics: ${( error as Error ).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyTopics",
			error,
		)
	}
}

// #endregion

// #region DELETE OPERATIONS

/**
 * Deletes a topic by ID
 * @param id The topic ID
 * @returns True if deleted, false if not found
 */
export async function deleteTopic( id: string ): Promise<boolean> {
	try {
		// Validate input
		if ( !id ) {
			throw createTopicError(
				"Topic ID is required",
				"MISSING_ID",
				"deleteTopic",
			)
		}

		const deletedTopic = await xata.db.topics.delete( id )
		return deletedTopic !== null
	} catch ( error ) {
		console.error( `Error deleting topic with ID ${id}:`, error )

		throw createTopicError(
			`Failed to delete topic with ID ${id}: ${( error as Error ).message}`,
			"DELETE_FAILED",
			"deleteTopic",
			error,
		)
	}
}

/**
 * Deletes multiple topics matching a filter
 * @param filter The filter to select topics to delete
 * @returns The number of topics deleted
 */
export async function deleteManyTopics(
	filter: Record<string, any>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// Validate input
		if ( !filter || Object.keys( filter ).length === 0 ) {
			throw createTopicError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"deleteManyTopics",
			)
		}

		// Get topics matching the filter
		const topics = await xata.db.topics.filter( filter ).getMany() as TopicsRecord[]

		if ( topics.length === 0 ) {
			return { numberOfRecordsDeleted: 0 }
		}

		const deletePromises = topics.map( ( topic: TopicsRecord ) =>
			xata.db.topics.delete( topic.id ),
		)

		const deletedTopics = await Promise.all( deletePromises )
		return { numberOfRecordsDeleted: deletedTopics.filter( Boolean ).length }
	} catch ( error ) {
		console.error( "Error deleting multiple topics:", error )

		throw createTopicError(
			`Failed to delete multiple topics: ${( error as Error ).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyTopics",
			error,
		)
	}
}

// #endregion
