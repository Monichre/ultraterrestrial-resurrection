import { xata } from "@/db/xata/client";
import type { Events, EventsRecord } from "@/db/xata/xata";
import type {
	BaseApiFilter,
	SearchOptions,
	SearchPageConfig,
} from "@xata.io/client";

/**
 * Create a new event record
 * @param data Event data to create
 * @returns The created event record
 */
export async function createEvent(
	data: Omit<Events, "id" | "xata">,
): Promise<EventsRecord> {
	try {
		return await xata.db.events.create(data);
	} catch (error) {
		console.error("Error creating event:", error);
		throw error;
	}
}

/**
 * Create multiple event records in bulk
 * @param data Array of event data to create
 * @returns Array of created event records
 */
export async function createManyEvents(
	data: Omit<Events, "id" | "xata">[],
): Promise<EventsRecord[]> {
	try {
		return await xata.db.events.create(data);
	} catch (error) {
		console.error("Error creating bulk events:", error);
		throw error;
	}
}

/**
 * Get an event record by ID
 * @param id The event record ID
 * @param columns Optional columns to select
 * @returns The event record or null if not found
 */
export async function getEventById(id: string): Promise<EventsRecord | null> {
	try {
		return await xata.db.events.read(id);
	} catch (error) {
		console.error(`Error getting event with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Get all event records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of event records
 */
export async function getAllEvents(options?: {
	filter?: BaseApiFilter<EventsRecord>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
}): Promise<EventsRecord[]> {
	try {
		// Build the query using builder pattern
		const queryOptions: {
			filter?: BaseApiFilter<EventsRecord>;
			sort?: [string, "asc" | "desc"][];
			columns?: string[];
			pagination?: { size: number; offset: number };
		} = {};

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
		throw error;
	}
}

/**
 * Get event records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @returns Paginated event records
 */
export async function getEventsWithPagination(
	page = 1,
	size = 20,
	filter?: BaseApiFilter<EventsRecord>,
	columns?: string[],
) {
	try {
		const queryOptions: {
			filter?: BaseApiFilter<EventsRecord>;
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
					? page * size + 1 // There are more records than we can determine exactly
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated events:", error);
		throw error;
	}
}

/**
 * Search event records
 * @param query Search query
 * @param options Search options
 * @returns Matching event records
 */
export async function searchEvents(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
	},
): Promise<EventsRecord[]> {
	try {
		const searchOptions: SearchOptions<EventsRecord> = {
			fuzziness: options?.fuzziness || 1,
			prefix: options?.prefix || "phrase",
			page: options?.pagination
				? {
						size: options.pagination.size || 20,
						offset: options.pagination.offset || 0,
					}
				: undefined,
		};

		const results = await xata.db.events.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching events with query "${query}":`, error);
		throw error;
	}
}

/**
 * Update an event record
 * @param id The event record ID
 * @param data The data to update
 * @returns The updated event record
 */
export async function updateEvent(
	id: string,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<EventsRecord | null> {
	try {
		return await xata.db.events.update(id, data);
	} catch (error) {
		console.error(`Error updating event with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Update multiple event records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 */
export async function updateManyEvents(
	filter: BaseApiFilter<EventsRecord>,
	data: Partial<Omit<Events, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// First get the IDs of records matching the filter
		const records = await xata.db.events.query({ filter });
		const updatePromises = records.records.map((record) =>
			xata.db.events.update(record.id, data),
		);

		const updatedRecords = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple event records:", error);
		throw error;
	}
}

/**
 * Delete an event record
 * @param id The ID of the event record to delete
 * @returns True if the record was deleted, false if it didn't exist
 */
export async function deleteEvent(id: string): Promise<boolean> {
	try {
		const deletedRecord = await xata.db.events.delete(id);
		return deletedRecord !== null;
	} catch (error) {
		console.error(`Error deleting event with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Delete multiple event records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 */
export async function deleteManyEvents(
	filter: BaseApiFilter<EventsRecord>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// First get the IDs of records matching the filter
		const records = await xata.db.events.query({ filter });

		const deletePromises = records.records.map((record) =>
			xata.db.events.delete(record.id),
		);

		const deletedRecords = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple event records:", error);
		throw error;
	}
}

/**
 * Ask questions about events using natural language
 * @param question The natural language question to ask
 * @param options Optional parameters for processing the question
 * @returns The processed event data answering the question
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
		throw error;
	}
}

/**
 * Get events by location within a radius
 * @param latitude Center latitude
 * @param longitude Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Events within the radius
 */
export async function getEventsByLocation(
	latitude: number,
	longitude: number,
	radiusKm: number,
): Promise<EventsRecord[]> {
	try {
		// Calculate bounding box (approximate)
		// 1 degree latitude ~ 111 km
		// 1 degree longitude ~ 111 km * cos(latitude)
		const latRange = radiusKm / 111;
		const lonRange = radiusKm / (111 * Math.cos(latitude * (Math.PI / 180)));

		const minLat = latitude - latRange;
		const maxLat = latitude + latRange;
		const minLon = longitude - lonRange;
		const maxLon = longitude + lonRange;

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
			if (event.latitude && event.longitude) {
				const distance = calculateDistance(
					latitude,
					longitude,
					event.latitude,
					event.longitude,
				);
				return distance <= radiusKm;
			}
			return false;
		});

		return eventsWithinRadius;
	} catch (error) {
		console.error("Error getting events by location:", error);
		throw error;
	}
}

/**
 * Get events by date range
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @returns Events within the date range
 */
export async function getEventsByDateRange(
	startDate: Date,
	endDate: Date,
): Promise<EventsRecord[]> {
	try {
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
		throw error;
	}
}

/**
 * Get upcoming events from today
 * @param limit Number of events to return
 * @returns Upcoming events
 */
export async function getUpcomingEvents(limit = 10): Promise<EventsRecord[]> {
	try {
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
		throw error;
	}
}

/**
 * Get events with full-text search by category
 * @param category Category to filter by
 * @param searchTerm Optional search term to filter results
 * @returns Matching events
 */
export async function getEventsByCategory(
	category: string,
	searchTerm?: string,
): Promise<EventsRecord[]> {
	try {
		if (searchTerm) {
			// If search term provided, use search endpoint
			const searchResults = await xata.db.events.search(searchTerm, {
				filter: {
					category: category,
				},
			});
			return searchResults.records;
		} else {
			// If no search term, use query endpoint
			const queryResults = await xata.db.events.query({
				filter: {
					category: category,
				},
			});
			return queryResults.records;
		}
	} catch (error) {
		console.error(`Error getting events by category "${category}":`, error);
		throw error;
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
