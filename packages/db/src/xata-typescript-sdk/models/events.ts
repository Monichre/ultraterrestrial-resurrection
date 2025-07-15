import { xata } from "../client"
import type { EventsRecord, Events } from "../xata"

// Define error interface for consistent error handling
interface EventsOperationError extends Error {
	code: string
	operation: string
	details?: unknown
}

// Error creation helper function
function createEventError(
	message: string,
	code: string,
	operation: string,
	details?: unknown,
): EventsOperationError {
	const error = new Error( message ) as EventsOperationError
	error.code = code
	error.operation = operation
	error.details = details
	return error
}

// Types for pagination response
interface PaginatedEventsResponse {
	records: EventsRecord[]
	pagination: {
		page: number
		size: number
		total?: number
		hasNextPage: boolean
	}
}

// #region CREATE OPERATIONS

/**
 * Creates a new event record in the database
 * @param data The event data without id and xata fields
 * @returns The created event record
 */
export async function createEvent(
	data: Omit<Events, "id" | "xata">,
): Promise<EventsRecord> {
	try {
		// Validate required fields
		if ( !data.title ) {
			throw createEventError(
				"Event title is required",
				"MISSING_REQUIRED_FIELD",
				"createEvent",
			)
		}

		return await xata.db.events.create( data )
	} catch ( error ) {
		console.error( "Error creating event:", error )

		// Re-throw typed errors
		if ( ( error as EventsOperationError ).code ) {
			throw error
		}

		// Create and throw standardized error
		throw createEventError(
			`Failed to create event: ${( error as Error ).message}`,
			"CREATE_FAILED",
			"createEvent",
			error,
		)
	}
}

/**
 * Creates multiple event records in the database
 * @param data Array of event data without id and xata fields
 * @returns Array of created event records
 */
export async function createManyEvents(
	data: Omit<Events, "id" | "xata">[],
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if ( !Array.isArray( data ) || data.length === 0 ) {
			throw createEventError(
				"Data must be a non-empty array",
				"INVALID_INPUT",
				"createManyEvents",
			)
		}

		// Validate each record
		for ( let i = 0; i < data.length; i++ ) {
			const item = data[i]
			if ( !item.title ) {
				throw createEventError(
					`Event at index ${i} is missing required title field`,
					"MISSING_REQUIRED_FIELD",
					"createManyEvents",
				)
			}
		}

		return await xata.db.events.create( data )
	} catch ( error ) {
		console.error( "Error creating bulk events:", error )

		// Create and throw standardized error
		throw createEventError(
			`Failed to create multiple events: ${( error as Error ).message}`,
			"BULK_CREATE_FAILED",
			"createManyEvents",
			error,
		)
	}
}

// #endregion

// #region READ OPERATIONS

/**
 * Gets an event by its ID
 * @param id The event ID
 * @param columns Optional columns to select
 * @returns The event record or null if not found
 */
export async function getEventById(
	id: string,
	columns?: string[],
): Promise<EventsRecord | null> {
	try {
		if ( !id ) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"getEventById",
			)
		}

		if ( columns && columns.length > 0 ) {
			// Use filter + getFirst for column selection to avoid TypeScript issues
			return await xata.db.events.select( columns as any ).filter( { id } ).getFirst()
		}

		return await xata.db.events.read( id )
	} catch ( error ) {
		console.error( `Error getting event with ID ${id}:`, error )

		throw createEventError(
			`Failed to get event with ID ${id}: ${( error as Error ).message}`,
			"GET_FAILED",
			"getEventById",
			error,
		)
	}
}

/**
 * Gets an event by its title
 * @param title The event title (unique)
 * @param columns Optional columns to select
 * @returns The event record or null if not found
 */
export async function getEventByTitle(
	title: string,
	columns?: string[],
): Promise<EventsRecord | null> {
	try {
		if ( !title ) {
			throw createEventError(
				"Event title is required",
				"MISSING_TITLE",
				"getEventByTitle",
			)
		}

		let query = xata.db.events.filter( { title } )

		if ( columns && columns.length > 0 ) {
			query = query.select( columns as any )
		}

		const result = await query.getFirst()
		return result || null
	} catch ( error ) {
		console.error( `Error getting event with title "${title}":`, error )

		throw createEventError(
			`Failed to get event with title "${title}": ${( error as Error ).message}`,
			"GET_BY_TITLE_FAILED",
			"getEventByTitle",
			error,
		)
	}
}

/**
 * Gets all events with optional filtering, sorting, and pagination
 * @param options Optional configuration for filtering, sorting, and pagination
 * @returns Array of event records
 */
export async function getAllEvents( options?: {
	filter?: Record<string, any>
	sort?: { column: string; direction: "asc" | "desc" }[]
	page?: number
	size?: number
	columns?: string[]
} ): Promise<EventsRecord[]> {
	try {
		const { filter, sort, page, size, columns } = options || {}

		let query = xata.db.events.filter( filter || {} )

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
			return result.records as EventsRecord[]
		}

		return await query.getAll() as EventsRecord[]
	} catch ( error ) {
		console.error( "Error getting all events:", error )

		throw createEventError(
			`Failed to get events: ${( error as Error ).message}`,
			"QUERY_FAILED",
			"getAllEvents",
			error,
		)
	}
}

/**
 * Gets events with pagination
 * @param page The page number (starting from 1)
 * @param size The page size
 * @param filter Optional filter expression
 * @param columns Optional columns to select
 * @returns Paginated response with events records
 */
export async function getEventsWithPagination(
	page = 1,
	size = 20,
	filter?: Record<string, any>,
	columns?: string[],
): Promise<PaginatedEventsResponse> {
	try {
		// Validate input
		if ( page < 1 ) {
			throw createEventError(
				"Page number must be greater than 0",
				"INVALID_PAGE",
				"getEventsWithPagination",
			)
		}

		if ( size < 1 || size > 100 ) {
			throw createEventError(
				"Page size must be between 1 and 100",
				"INVALID_SIZE",
				"getEventsWithPagination",
			)
		}

		let query = xata.db.events.filter( filter || {} )

		if ( columns && columns.length > 0 ) {
			query = query.select( columns as any )
		}

		const result = await query.getPaginated( {
			pagination: { size, offset: ( page - 1 ) * size },
		} )

		return {
			records: result.records as EventsRecord[],
			pagination: {
				page,
				size,
				total: undefined, // Xata doesn't provide total in current SDK version
				hasNextPage: typeof result.hasNextPage === 'function' ? result.hasNextPage() : !!result.hasNextPage,
			},
		}
	} catch ( error ) {
		console.error( "Error getting paginated events:", error )

		throw createEventError(
			`Failed to get paginated events: ${( error as Error ).message}`,
			"PAGINATION_FAILED",
			"getEventsWithPagination",
			error,
		)
	}
}

/**
 * Searches events using text search
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching event records
 */
export async function searchEvents(
	searchQuery: string,
	options?: {
		fuzziness?: number
		prefix?: "phrase" | "disabled"
		pagination?: { size?: number; offset?: number }
		filter?: Record<string, any>
	},
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if ( !searchQuery || searchQuery.trim() === "" ) {
			throw createEventError(
				"Search query is required",
				"MISSING_QUERY",
				"searchEvents",
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

		const results = await xata.db.events.search( searchQuery, searchOptions )
		return results.records as EventsRecord[]
	} catch ( error ) {
		console.error( `Error searching events with query "${searchQuery}":`, error )

		throw createEventError(
			`Failed to search events: ${( error as Error ).message}`,
			"SEARCH_FAILED",
			"searchEvents",
			error,
		)
	}
}

/**
 * Performs vector search on events using embedding
 * @param embedding The vector embedding to search with
 * @param options Optional search configuration
 * @returns Array of matching event records
 */
export async function semanticSearchEvents(
	embedding: number[],
	options?: {
		maxResults?: number
		filter?: Record<string, any>
	},
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if ( !embedding || !Array.isArray( embedding ) || embedding.length !== 1536 ) {
			throw createEventError(
				"Valid embedding vector with 1536 dimensions is required",
				"INVALID_EMBEDDING",
				"semanticSearchEvents",
			)
		}

		const searchOptions = {
			maxResults: options?.maxResults || 10,
			filter: options?.filter,
		}

		const results = await xata.db.events.vectorSearch(
			"embedding",
			embedding,
			searchOptions,
		)

		return results.records as EventsRecord[]
	} catch ( error ) {
		console.error( "Error in semantic search of events:", error )

		throw createEventError(
			`Failed in semantic search: ${( error as Error ).message}`,
			"VECTOR_SEARCH_FAILED",
			"semanticSearchEvents",
			error,
		)
	}
}

/**
 * Finds events by geographical location within a radius
 * @param latitude The latitude coordinate
 * @param longitude The longitude coordinate
 * @param radiusKm The radius in kilometers
 * @returns Array of event records within the radius
 */
export async function getEventsByLocation(
	latitude: number,
	longitude: number,
	radiusKm: number,
): Promise<EventsRecord[]> {
	try {
		// Convert radius to degrees (approximately)
		const radiusDegrees = radiusKm / 111.32

		// Calculate bounding box for initial filtering
		const filter = {
			$all: [
				{ latitude: { $gte: latitude - radiusDegrees } },
				{ latitude: { $lte: latitude + radiusDegrees } },
				{ longitude: { $gte: longitude - radiusDegrees } },
				{ longitude: { $lte: longitude + radiusDegrees } },
			],
		}

		// Use the correct filter method
		const result = await xata.db.events.filter( filter ).getAll()

		// Further filter by exact radius using Haversine formula
		return ( result as EventsRecord[] ).filter( ( event ) => {
			if ( event.latitude != null && event.longitude != null ) {
				const distance = calculateDistance(
					latitude,
					longitude,
					event.latitude,
					event.longitude,
				)
				return distance <= radiusKm
			}
			return false
		} )
	} catch ( error ) {
		console.error( "Error getting events by location:", error )

		throw createEventError(
			`Failed to get events by location: ${( error as Error ).message}`,
			"LOCATION_SEARCH_FAILED",
			"getEventsByLocation",
			error,
		)
	}
}

// Helper function to calculate distance using Haversine formula
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371 // Earth's radius in km
	const dLat = toRadians( lat2 - lat1 )
	const dLon = toRadians( lon2 - lon1 )
	const a =
		Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
		Math.cos( toRadians( lat1 ) ) *
		Math.cos( toRadians( lat2 ) ) *
		Math.sin( dLon / 2 ) *
		Math.sin( dLon / 2 )
	const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) )
	return R * c
}

function toRadians( degrees: number ): number {
	return degrees * ( Math.PI / 180 )
}

// #endregion

// #region UPDATE OPERATIONS

/**
 * Updates an event by ID
 * @param id The event ID
 * @param data The event data to update
 * @returns The updated event record or null if not found
 */
export async function updateEvent(
	id: string,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<EventsRecord | null> {
	try {
		// Validate input
		if ( !id ) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"updateEvent",
			)
		}

		if ( !data || Object.keys( data ).length === 0 ) {
			throw createEventError(
				"Update data is required",
				"MISSING_DATA",
				"updateEvent",
			)
		}

		// Verify the record exists before updating
		const exists = await xata.db.events.read( id )
		if ( !exists ) {
			return null
		}

		return await xata.db.events.update( id, data )
	} catch ( error ) {
		console.error( `Error updating event with ID ${id}:`, error )

		throw createEventError(
			`Failed to update event with ID ${id}: ${( error as Error ).message}`,
			"UPDATE_FAILED",
			"updateEvent",
			error,
		)
	}
}

/**
 * Updates multiple events matching the filter
 * @param filter Filter criteria for events to update
 * @param data Data to update
 * @returns Object with number of records updated
 */
export async function updateManyEvents(
	filter: Record<string, any>,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// Validate inputs
		if ( !filter || Object.keys( filter ).length === 0 ) {
			throw createEventError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"updateManyEvents",
			)
		}

		if ( !data || Object.keys( data ).length === 0 ) {
			throw createEventError(
				"Update data is required",
				"MISSING_DATA",
				"updateManyEvents",
			)
		}

		// Get records matching the filter
		const records = await xata.db.events.filter( filter ).getAll() as EventsRecord[]

		if ( records.length === 0 ) {
			return { numberOfRecordsUpdated: 0 }
		}

		const updatePromises = records.map( ( record ) =>
			xata.db.events.update( record.id, data )
		)

		const updatedRecords = await Promise.all( updatePromises )
		return { numberOfRecordsUpdated: updatedRecords.filter( Boolean ).length }
	} catch ( error ) {
		console.error( "Error updating multiple events:", error )

		throw createEventError(
			`Failed to update multiple events: ${( error as Error ).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyEvents",
			error,
		)
	}
}

// #endregion

// #region DELETE OPERATIONS

/**
 * Deletes an event by ID
 * @param id The event ID
 * @returns Boolean indicating if the event was deleted
 */
export async function deleteEvent( id: string ): Promise<boolean> {
	try {
		// Validate input
		if ( !id ) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"deleteEvent",
			)
		}

		const deletedRecord = await xata.db.events.delete( id )
		return deletedRecord !== null
	} catch ( error ) {
		console.error( `Error deleting event with ID ${id}:`, error )

		throw createEventError(
			`Failed to delete event with ID ${id}: ${( error as Error ).message}`,
			"DELETE_FAILED",
			"deleteEvent",
			error,
		)
	}
}

/**
 * Deletes multiple events matching the filter
 * @param filter Filter criteria for events to delete
 * @returns Object with number of records deleted
 */
export async function deleteManyEvents(
	filter: Record<string, any>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// Validate input
		if ( !filter || Object.keys( filter ).length === 0 ) {
			throw createEventError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"deleteManyEvents",
			)
		}

		// Get records matching the filter
		const records = await xata.db.events.filter( filter ).getAll() as EventsRecord[]

		if ( records.length === 0 ) {
			return { numberOfRecordsDeleted: 0 }
		}

		const deletePromises = records.map( ( record ) =>
			xata.db.events.delete( record.id )
		)

		const deletedRecords = await Promise.all( deletePromises )
		return { numberOfRecordsDeleted: deletedRecords.filter( Boolean ).length }
	} catch ( error ) {
		console.error( "Error deleting multiple events:", error )

		throw createEventError(
			`Failed to delete multiple events: ${( error as Error ).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyEvents",
			error,
		)
	}
}

// #endregion
