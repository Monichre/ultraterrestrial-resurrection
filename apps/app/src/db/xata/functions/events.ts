import type { xata } from "@/db/xata/client";
import type { EventsRecord } from "@/db/xata/xata";
import type { Events } from "@react-three/fiber";

/**
 * Error interface for standardized error responses
 */
interface EventsOperationError extends Error {
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
function createEventError(
	message: string,
	code: string,
	operation: string,
	details?: unknown,
): EventsOperationError {
	const error = new Error(message) as EventsOperationError;
	error.code = code;
	error.operation = operation;
	error.details = details;
	return error;
}

/**
 * Create a new event record
 * @param data Event data to create
 * @returns The created event record
 * @throws {EventsOperationError} If creation fails
 */
export async function createEvent(
	data: Omit<Events, "id" | "xata">,
): Promise<EventsRecord> {
	try {
		// Validate required fields
		if (!data.title) {
			throw createEventError(
				"Event title is required",
				"MISSING_REQUIRED_FIELD",
				"createEvent",
			);
		}

		return await xata.db.events.create(data);
	} catch (error) {
		console.error("Error creating event:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to create event: ${(error as Error).message}`,
			"CREATE_FAILED",
			"createEvent",
			error,
		);
	}
}

/**
 * Create multiple event records in bulk
 * @param data Array of event data to create
 * @returns Array of created event records
 * @throws {EventsOperationError} If bulk creation fails
 */
export async function createManyEvents(
	data: Omit<Events, "id" | "xata">[],
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if (!Array.isArray(data) || data.length === 0) {
			throw createEventError(
				"Data must be a non-empty array",
				"INVALID_INPUT",
				"createManyEvents",
			);
		}

		// Validate required fields for each item
		for (const [index, item] of data.entries()) {
			if (!item.title) {
				throw createEventError(
					`Event at index ${index} is missing a title`,
					"MISSING_REQUIRED_FIELD",
					"createManyEvents",
				);
			}
		}

		return await xata.db.events.create(data);
	} catch (error) {
		console.error("Error creating bulk events:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to create multiple events: ${(error as Error).message}`,
			"BULK_CREATE_FAILED",
			"createManyEvents",
			error,
		);
	}
}

/**
 * Get an event record by ID
 * @param id The event record ID
 * @param columns Optional columns to select
 * @returns The event record or null if not found
 * @throws {EventsOperationError} If retrieval fails
 */
export async function getEventById(
	id: string,
	columns?: string[],
): Promise<EventsRecord | null> {
	try {
		if (!id) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"getEventById",
			);
		}

		const options: GetRecordOptions = {};
		if (columns && columns.length > 0) {
			options.columns = columns;
		}

		return await xata.db.events.read(id, options);
	} catch (error) {
		console.error(`Error getting event with ID ${id}:`, error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get event with ID ${id}: ${(error as Error).message}`,
			"GET_FAILED",
			"getEventById",
			error,
		);
	}
}

/**
 * Get all event records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of event records
 * @throws {EventsOperationError} If query fails
 */
export async function getAllEvents(options?: {
	filter?: RecordFilterExpression<EventsRecord>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
	consistency?: "strong" | "eventual";
}): Promise<EventsRecord[]> {
	try {
		// Build the query using builder pattern
		const queryOptions: {
			filter?: RecordFilterExpression<EventsRecord>;
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
		const result = await xata.db.events.query(queryOptions);
		return result.records;
	} catch (error) {
		console.error("Error getting all events:", error);
		throw createEventError(
			`Failed to get events: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getAllEvents",
			error,
		);
	}
}

/**
 * Get event records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @param columns Optional columns to select
 * @returns Paginated event records
 * @throws {EventsOperationError} If pagination query fails
 */
export async function getEventsWithPagination(
	page = 1,
	size = 20,
	filter?: RecordFilterExpression<EventsRecord>,
	columns?: string[],
): Promise<PaginatedResponse<EventsRecord>> {
	try {
		// Validate input
		if (page < 1) {
			throw createEventError(
				"Page number must be greater than 0",
				"INVALID_PAGE",
				"getEventsWithPagination",
			);
		}

		if (size < 1 || size > 100) {
			throw createEventError(
				"Page size must be between 1 and 100",
				"INVALID_SIZE",
				"getEventsWithPagination",
			);
		}

		const queryOptions: {
			filter?: RecordFilterExpression<EventsRecord>;
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

		const result = await xata.db.events.query(queryOptions);

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
		console.error("Error getting paginated events:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get paginated events: ${(error as Error).message}`,
			"PAGINATION_FAILED",
			"getEventsWithPagination",
			error,
		);
	}
}

/**
 * Search event records
 * @param query Search query
 * @param options Search options
 * @returns Matching event records
 * @throws {EventsOperationError} If search fails
 */
export async function searchEvents(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
		filter?: RecordFilterExpression<EventsRecord>;
	},
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw createEventError(
				"Search query is required",
				"MISSING_QUERY",
				"searchEvents",
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

		const results = await xata.db.events.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching events with query "${query}":`, error);
		throw createEventError(
			`Failed to search events: ${(error as Error).message}`,
			"SEARCH_FAILED",
			"searchEvents",
			error,
		);
	}
}

/**
 * Update an event record
 * @param id The event record ID
 * @param data The data to update
 * @returns The updated event record
 * @throws {EventsOperationError} If update fails
 */
export async function updateEvent(
	id: string,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<EventsRecord | null> {
	try {
		// Validate input
		if (!id) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"updateEvent",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createEventError(
				"Update data is required",
				"MISSING_DATA",
				"updateEvent",
			);
		}

		// Verify the record exists before updating
		const exists = await xata.db.events.read(id);
		if (!exists) {
			return null;
		}

		return await xata.db.events.update(id, data);
	} catch (error) {
		console.error(`Error updating event with ID ${id}:`, error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to update event with ID ${id}: ${(error as Error).message}`,
			"UPDATE_FAILED",
			"updateEvent",
			error,
		);
	}
}

/**
 * Update multiple event records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 * @throws {EventsOperationError} If bulk update fails
 */
export async function updateManyEvents(
	filter: RecordFilterExpression<EventsRecord>,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// Validate inputs
		if (!filter || Object.keys(filter).length === 0) {
			throw createEventError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"updateManyEvents",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createEventError(
				"Update data is required",
				"MISSING_DATA",
				"updateManyEvents",
			);
		}

		// First get the IDs of records matching the filter
		const records = await xata.db.events.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsUpdated: 0 };
		}

		const updatePromises = records.records.map((record) =>
			xata.db.events.update(record.id, data),
		);

		const updatedRecords = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple event records:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to update multiple events: ${(error as Error).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyEvents",
			error,
		);
	}
}

/**
 * Delete an event record
 * @param id The ID of the event record to delete
 * @returns True if the record was deleted, false if it didn't exist
 * @throws {EventsOperationError} If deletion fails
 */
export async function deleteEvent(id: string): Promise<boolean> {
	try {
		// Validate input
		if (!id) {
			throw createEventError(
				"Event ID is required",
				"MISSING_ID",
				"deleteEvent",
			);
		}

		const deletedRecord = await xata.db.events.delete(id);
		return deletedRecord !== null;
	} catch (error) {
		console.error(`Error deleting event with ID ${id}:`, error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to delete event with ID ${id}: ${(error as Error).message}`,
			"DELETE_FAILED",
			"deleteEvent",
			error,
		);
	}
}

/**
 * Delete multiple event records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 * @throws {EventsOperationError} If bulk deletion fails
 */
export async function deleteManyEvents(
	filter: RecordFilterExpression<EventsRecord>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// Validate input
		if (!filter || Object.keys(filter).length === 0) {
			throw createEventError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"deleteManyEvents",
			);
		}

		// First get the IDs of records matching the filter
		const records = await xata.db.events.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsDeleted: 0 };
		}

		const deletePromises = records.records.map((record) =>
			xata.db.events.delete(record.id),
		);

		const deletedRecords = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple event records:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to delete multiple events: ${(error as Error).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyEvents",
			error,
		);
	}
}

/**
 * Ask questions about events using natural language
 * @param question The natural language question to ask
 * @param options Optional parameters for processing the question
 * @returns The processed event data answering the question
 * @throws {EventsOperationError} If question processing fails
 */
export async function askEvents(
	question: string,
	options?: {
		maxResults?: number;
		includeDetails?: boolean;
	},
): Promise<{
	answer: string;
	relatedRecords: EventsRecord[];
}> {
	try {
		// Validate input
		if (!question || question.trim() === "") {
			throw createEventError(
				"Question text is required",
				"MISSING_QUESTION",
				"askEvents",
			);
		}

		// Use Xata's search capabilities to find relevant events
		const searchResults = await xata.db.events.search(question, {
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
		console.error(`Error asking about events: "${question}"`, error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to process question: ${(error as Error).message}`,
			"QUESTION_PROCESSING_FAILED",
			"askEvents",
			error,
		);
	}
}

/**
 * Get events by location within a radius
 * @param latitude Center latitude
 * @param longitude Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Events within the radius
 * @throws {EventsOperationError} If location search fails
 */
export async function getEventsByLocation(
	latitude: number,
	longitude: number,
	radiusKm: number,
): Promise<EventsRecord[]> {
	try {
		// Validate inputs
		if (isNaN(latitude) || latitude < -90 || latitude > 90) {
			throw createEventError(
				"Invalid latitude: must be between -90 and 90",
				"INVALID_LATITUDE",
				"getEventsByLocation",
			);
		}

		if (isNaN(longitude) || longitude < -180 || longitude > 180) {
			throw createEventError(
				"Invalid longitude: must be between -180 and 180",
				"INVALID_LONGITUDE",
				"getEventsByLocation",
			);
		}

		if (isNaN(radiusKm) || radiusKm <= 0) {
			throw createEventError(
				"Invalid radius: must be greater than 0",
				"INVALID_RADIUS",
				"getEventsByLocation",
			);
		}

		// Calculate bounding box (approximate)
		// 1 degree latitude ~ 111 km
		// 1 degree longitude ~ 111 km * cos(latitude)
		const latRange = radiusKm / 111;
		const lonRange = radiusKm / (111 * Math.cos(latitude * (Math.PI / 180)));

		const minLat = latitude - latRange;
		const maxLat = latitude + latRange;
		const minLon = longitude - lonRange;
		const maxLon = longitude + lonRange;

		// Query for events within the bounding box
		const result = await xata.db.events.query({
			filter: {
				$all: [
					{ latitude: { $ge: minLat } },
					{ latitude: { $le: maxLat } },
					{ longitude: { $ge: minLon } },
					{ longitude: { $le: maxLon } },
				],
			},
		});

		// For more precise filtering, calculate actual distance
		const eventsWithinRadius = result.records.filter((event) => {
			const eventLat = event.getWithDefault<number>("latitude", null);
			const eventLon = event.getWithDefault<number>("longitude", null);

			if (eventLat !== null && eventLon !== null) {
				const distance = calculateDistance(
					latitude,
					longitude,
					eventLat,
					eventLon,
				);
				return distance <= radiusKm;
			}
			return false;
		});

		return eventsWithinRadius;
	} catch (error) {
		console.error("Error getting events by location:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get events by location: ${(error as Error).message}`,
			"LOCATION_SEARCH_FAILED",
			"getEventsByLocation",
			error,
		);
	}
}

/**
 * Get events by date range
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @returns Events within the date range
 * @throws {EventsOperationError} If date range search fails
 */
export async function getEventsByDateRange(
	startDate: Date,
	endDate: Date,
): Promise<EventsRecord[]> {
	try {
		// Validate inputs
		if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
			throw createEventError(
				"Invalid start date",
				"INVALID_START_DATE",
				"getEventsByDateRange",
			);
		}

		if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
			throw createEventError(
				"Invalid end date",
				"INVALID_END_DATE",
				"getEventsByDateRange",
			);
		}

		if (startDate > endDate) {
			throw createEventError(
				"Start date must be before end date",
				"INVALID_DATE_RANGE",
				"getEventsByDateRange",
			);
		}

		const result = await xata.db.events.query({
			filter: {
				date: {
					$ge: startDate,
					$le: endDate,
				},
			},
			sort: [["date", "asc"]],
		});

		return result.records;
	} catch (error) {
		console.error("Error getting events by date range:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get events by date range: ${(error as Error).message}`,
			"DATE_RANGE_SEARCH_FAILED",
			"getEventsByDateRange",
			error,
		);
	}
}

/**
 * Get upcoming events from today
 * @param limit Number of events to return
 * @returns Upcoming events
 * @throws {EventsOperationError} If upcoming events search fails
 */
export async function getUpcomingEvents(limit = 10): Promise<EventsRecord[]> {
	try {
		// Validate input
		if (isNaN(limit) || limit <= 0 || limit > 100) {
			throw createEventError(
				"Invalid limit: must be between 1 and 100",
				"INVALID_LIMIT",
				"getUpcomingEvents",
			);
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const result = await xata.db.events.query({
			filter: {
				date: { $ge: today },
			},
			sort: [["date", "asc"]],
			pagination: { size: limit },
		});

		return result.records;
	} catch (error) {
		console.error("Error getting upcoming events:", error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get upcoming events: ${(error as Error).message}`,
			"UPCOMING_EVENTS_FAILED",
			"getUpcomingEvents",
			error,
		);
	}
}

/**
 * Get events with full-text search by category
 * @param category Category to filter by
 * @param searchTerm Optional search term to filter results
 * @returns Matching events
 * @throws {EventsOperationError} If category search fails
 */
export async function getEventsByCategory(
	category: string,
	searchTerm?: string,
): Promise<EventsRecord[]> {
	try {
		// Validate input
		if (!category || category.trim() === "") {
			throw createEventError(
				"Category is required",
				"MISSING_CATEGORY",
				"getEventsByCategory",
			);
		}

		if (searchTerm) {
			// If search term provided, use search endpoint
			const searchResults = await xata.db.events.search(searchTerm, {
				filter: {
					category: { $is: category },
				},
			});
			return searchResults.records;
		}

		// If no search term, use query endpoint
		const queryResults = await xata.db.events.query({
			filter: {
				category: { $is: category },
			},
		});
		return queryResults.records;
	} catch (error) {
		console.error(`Error getting events by category "${category}":`, error);

		if ((error as EventsOperationError).code) {
			throw error;
		}

		throw createEventError(
			`Failed to get events by category: ${(error as Error).message}`,
			"CATEGORY_SEARCH_FAILED",
			"getEventsByCategory",
			error,
		);
	}
}

/**
 * Helper function to calculate distance between two coordinates using the Haversine formula
 * @param lat1 First latitude
 * @param lon1 First longitude
 * @param lat2 Second latitude
 * @param lon2 Second longitude
 * @returns Distance in kilometers
 */
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Earth's radius in km
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}
